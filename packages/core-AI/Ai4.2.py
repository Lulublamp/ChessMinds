import numpy as np
import tensorflow as tf
from tensorflow.keras.layers import Input, Conv2D, BatchNormalization, Activation, Dense, Flatten, Add
from tensorflow.keras.models import Model
import chess
import chess.engine
import time

class MCTS:
    def __init__(self, neural_network, num_simulations=800, c_puct=1.0):
        self.neural_network = neural_network
        self.num_simulations = num_simulations
        self.c_puct = c_puct
        self.Qsa = {}
        self.Nsa = {}
        self.Ns = {}
        self.Ps = {}

    def search(self, board, temperature=1.0):
        """
        Perform MCTS search starting from the given board position and return the best move found.

        Lower temperatures will make the algorithm more deterministic (it will almost always choose the movement with the highest number of visits), 
        while higher temperatures will encourage wider exploration and more random action selection.

        Args:
        - board: chess.Board representing the current state of the board.
        - temperature: float representing the temperature for action selection. Higher values encourage more exploration. Default: 1.0.

        Returns:
        - best_move: chess.Move representing the best move found during MCTS search.
        """

        for _ in range(self.num_simulations):
            self._simulate(board.copy())

        s = board.fen()
        best_move = None
        max_action_value = -float("inf")
        normalized_sum = sum([(self.Nsa[(s, move.from_square, move.to_square)] ** (1 / temperature)) for move in board.legal_moves])

        for move in board.legal_moves:
            from_idx = move.from_square
            to_idx = move.to_square
            action_value = (self.Nsa[(s, from_idx, to_idx)] ** (1 / temperature)) / normalized_sum

            if action_value > max_action_value:
                max_action_value = action_value
                best_move = move

        return best_move

    def _simulate(self, board):
        s = self.neural_network.get_board_state(board)
        s = tuple(map(tuple, s.reshape(8, 8, 17)))

        if s not in self.Ps:
            policy, value = self.neural_network.predict(np.array([s]))
            policy = policy[0]
            legal_moves = [move for move in board.legal_moves]
            legal_policy = np.zeros(64 * 64)

            for move in legal_moves:
                legal_policy[self.neural_network.square_to_index(move.from_square) * 8 + self.neural_network.square_to_index(move.to_square) // 8] = policy[self.neural_network.square_to_index(move.from_square) * 8 + self.neural_network.square_to_index(move.to_square) // 8]

            self.Ps[s] = legal_policy / legal_policy.sum()
            self.Ns[s] = 0
            return -value[0]

        best_uct = -np.inf
        best_move = None
        legal_moves = [move for move in board.legal_moves]

        for move in legal_moves:
            from_idx = self.neural_network.square_to_index(move.from_square)
            to_idx = self.neural_network.square_to_index(move.to_square)

            if (s, from_idx, to_idx) in self.Qsa:
                uct = self.Qsa[(s, from_idx, to_idx)] + self.c_puct * self.Ps[s][from_idx * 8 + to_idx // 8] * np.sqrt(self.Ns[s]) / (1 + self.Nsa[(s, from_idx, to_idx)])
            else:
                uct = self.c_puct * self.Ps[s][from_idx * 8 + to_idx // 8] * np.sqrt(self.Ns[s] + 1e-8)

            if uct > best_uct:
                best_uct = uct
                best_move = move

        board.push(best_move)
        from_idx = self.neural_network.square_to_index(best_move.from_square)
        to_idx = self.neural_network.square_to_index(best_move.to_square)

        v = self._simulate(board)

        if (s, from_idx, to_idx) in self.Qsa:
            self.Qsa[(s, from_idx, to_idx)] = (self.Nsa[(s, from_idx, to_idx)] * self.Qsa[(s, from_idx, to_idx)] + v) / (self.Nsa[(s, from_idx, to_idx)] + 1)
            self.Nsa[(s, from_idx, to_idx)] += 1
        else:
            self.Qsa[(s, from_idx, to_idx)] = v
            self.Nsa[(s, from_idx, to_idx)] = 1

        self.Ns[s] += 1

        return -v

class NeuralNetwork:
    def __init__(self, input_shape, num_actions, filters=256, num_residual_blocks=19):
        self.input_shape = input_shape
        self.num_actions = num_actions
        self.filters = filters
        self.num_residual_blocks = num_residual_blocks
        
        self._build_model()
        
    def _build_residual_block(self, x):
        res_input = x
        
        x = Conv2D(filters=self.filters, kernel_size=3, padding='same')(x)
        x = BatchNormalization()(x)
        x = Activation('relu')(x)
        
        x = Conv2D(filters=self.filters, kernel_size=3, padding='same')(x)
        x = BatchNormalization()(x)
        x = Add()([x, res_input])
        x = Activation('relu')(x)
        
        return x
        
    def _build_model(self):
        inputs = Input(shape=self.input_shape)
        
        x = Conv2D(filters=self.filters, kernel_size=3, padding='same')(inputs)
        x = BatchNormalization()(x)
        x = Activation('relu')(x)
        
        for _ in range(self.num_residual_blocks):
            x = self._build_residual_block(x)
            
        policy_head = Conv2D(filters=2, kernel_size=1, padding='same')(x)
        policy_head = BatchNormalization()(policy_head)
        policy_head = Activation('relu')(policy_head)
        policy_head = Flatten()(policy_head)
        policy_head = Dense(units=self.num_actions, activation='softmax', name='policy')(policy_head)
        
        value_head = Conv2D(filters=1, kernel_size=1, padding='same')(x)
        value_head = BatchNormalization()(value_head)
        value_head = Activation('relu')(value_head)
        value_head = Flatten()(value_head)
        value_head = Dense(units=self.filters, activation='relu')(value_head)
        value_head = Dense(units=1, activation='tanh', name='value')(value_head)
        
        self.model = Model(inputs=inputs, outputs=[policy_head, value_head])

    def predict(self, state):
        """
        Perform a feedforward pass of the neural network on a given state.

        Args:
        - state: np.ndarray representing the state of the chess board. Shape: (batch_size, 8, 8, 17).

        Returns:
        - policy: np.ndarray representing the policy of the neural network. Shape: (batch_size, num_actions).
        - value: np.ndarray representing the value of the neural network. Shape: (batch_size, 1).
        """
        policy, value = self.model.predict(state)
        return policy, value

    def self_play(self, num_games=1000):
        """
        Play games against itself to generate training data.

        Args:
        - num_games: int representing the number of games to play. Default: 1000.

        Returns:
        - states: np.ndarray representing the states of the chess boards. Shape: (num_samples, 8, 8, 17).
        - policies: np.ndarray representing the policies of the chess boards. Shape: (num_samples, num_actions).
        - values: np.ndarray representing the values of the chess boards. Shape: (num_samples, 1).
        """

        states = []
        policies = []
        values = []

        mcts = MCTS(self)

        for _ in range(num_games):
            board = chess.Board()
            game_states = []
            game_policies = []
            game_values = []

            while not board.is_game_over():
                # Record the current state and policy
                game_states.append(self.get_board_state(board))

                best_move = mcts.search(board)
                policy = np.zeros(64 * 64)
                for move in board.legal_moves:
                    policy[self.square_to_index(move.from_square) * 8 + self.square_to_index(move.to_square) // 8] = 1
                policy /= policy.sum()
                game_policies.append(policy)

                # Play the move found by MCTS
                board.push(best_move)

            # Compute the final value of the game
            value = 0 if board.result() == "1/2-1/2" else 1 if board.result() == "1-0" else -1

            # Assign the value to each state and policy in the game
            for j in range(len(game_states)):
                states.append(game_states[j])
                policies.append(game_policies[j])
                values.append(value)

    return np.array(states), np.array(policies), np.array(values)

    def train(self, states, policies, values, epochs=1, batch_size=64):
        """
        Train the neural network on a batch of training data.

        Args:
        - states: np.ndarray representing the states of the chess boards. Shape: (num_samples, 8, 8, 17).
        - policies: np.ndarray representing the policies of the chess boards. Shape: (num_samples, num_actions).
        - values: np.ndarray representing the values of the chess boards. Shape: (num_samples, 1).
        - epochs: int representing the number of epochs to train the neural network for. Default: 1.
        - batch_size: int representing the batch size to use during training. Default: 64.
        """
        
        optimizer = tf.keras.optimizers.Adam(learning_rate=0.001)
        self.model.compile(optimizer=optimizer,
            loss=['categorical_crossentropy', 'mean_squared_error'],
            loss_weights=[1, 1],
            metrics=['accuracy'])
        self.model.fit(states, [policies, values], epochs=epochs, batch_size=batch_size)
    
    def generate_training_data(self, path_stockfish, num_samples=1000, depth=4, use_self_play=False):
        """
        Generate training data by having Stockfish or play against itself and recording positions and values.

        Args:
        - num_samples: int representing the number of samples to generate. Default: 1000.
        - depth: int representing the depth of the search to use during self-play. Default: 2.

        Returns:
        - states: np.ndarray representing the states of the chess boards. Shape: (num_samples, 8, 8, 17).
        - policies: np.ndarray representing the policies of the chess boards. Shape: (num_samples, num_actions).
        - values: np.ndarray representing the values of the chess boards. Shape: (num_samples, 1).
        """
        if use_self_play:
            return self.self_play(num_games=num_samples)
        else:
            engine = chess.engine.SimpleEngine.popen_uci(path_stockfish)

            states = []
            policies = []
            values = []

            for i in range(num_samples):
                board = chess.Board()
                game_states = []
                game_policies = []
                game_values = []

                while not board.is_game_over():
                    # Get the Stockfish evaluation of the current position
                    result = engine.analyse(board, chess.engine.Limit(depth=depth))
                    policy = np.zeros(64 * 64)

                    # Compute the policy from the legal moves
                    for move in board.legal_moves:
                        policy[move.from_square * 8 + move.to_square // 8] = 1
                    policy /= policy.sum()

                    # Record the current state and policy
                    game_states.append(self.get_board_state(board))
                    game_policies.append(policy)

                    # Play the move recommended by Stockfish
                    board.push(result["pv"][0])

                # Compute the final value of the game
                value = 0 if board.result() == "1/2-1/2" else 1 if board.result() == "1-0" else -1

                # Assign the value to each state and policy in the game
                for j in range(len(game_states)):
                    states.append(game_states[j])
                    policies.append(game_policies[j])
                    values.append(value)

            engine.quit()

            return np.array(states), np.array(policies), np.array(values)

    @staticmethod
    def square_to_index(square):
        """
        Convert a square on the chess board to an index in the state array.

        Args:
        - square: int representing the square on the chess board.

        Returns:
        - int: the index in the state array corresponding to the square.
        """
        row = square // 8
        col = square % 8
        return row * 8 + col


    def piece_to_index(self, piece):
        """
        Map a chess piece to an index between 0 and 12.

        Args:
        - piece: chess.Piece representing a chess piece.

        Returns:
        - index: int representing the index of the piece in the state array.
        """

        piece_dict = {
            chess.PAWN: 0,
            chess.KNIGHT: 1,
            chess.BISHOP: 2,
            chess.ROOK: 3,
            chess.QUEEN: 4,
            chess.KING: 5
        }

        if piece.color == chess.WHITE:
            return piece_dict[piece.piece_type]
        else:
            return piece_dict[piece.piece_type] + 6

        return 12

    def get_board_state(self, board):
        """
        Get the state of the chess board as a 8x8x17 NumPy array.

        Args:
        - board: chess.Board representing the current state of the board.

        Returns:
        - state: np.ndarray representing the state of the chess board. Shape: (8, 8, 17).
        """

        state = np.zeros((8, 8, 17), dtype=np.float32)

        for i in range(8):
            for j in range(8):
                piece = board.piece_at(chess.square(i, j))

                if piece is not None:
                    index = self.piece_to_index(piece)
                    state[i, j, index] = 1

        # Add a channel indicating the player to move
        state[:, :, -1] = board.turn * 1.0

        # Add a channel indicating the number of moves played in the game
        state[:, :, -2] = board.fullmove_number * 1.0 / 500.0

        # Add a channel indicating the number of consecutive non-capturing moves
        state[:, :, -3] = board.halfmove_clock * 1.0 / 50.0

        # Add a channel indicating whether each square is being attacked by the opponent
        for i in range(8):
            for j in range(8):
                square = chess.square(i, j)
                if board.is_attacked_by(not board.turn, square):
                    state[i, j, -4] = 1

        # Add a channel indicating whether castling is possible
        if board.has_kingside_castling_rights(chess.WHITE):
            state[7, 6, -5] = 1
        if board.has_queenside_castling_rights(chess.WHITE):
            state[7, 2, -5] = 1
        if board.has_kingside_castling_rights(chess.BLACK):
            state[0, 6, -5] = 1
        if board.has_queenside_castling_rights(chess.BLACK):
            state[0, 2, -5] = 1

        # Add a channel indicating whether an en passant capture is possible
        ep_square = board.ep_square
        if ep_square is not None:
            ep_file = chess.square_file(ep_square)
            ep_rank = chess.square_rank(ep_square)
            if board.turn == chess.WHITE:
                state[ep_rank+1, ep_file, -6] = 1
            else:
                state[ep_rank-1, ep_file, -6] = 1

        return state

    def save(self, path):
        """
        Save the neural network to a file.

        Args:
        - path: string representing the path to save the neural network to.
        """

        self.model.save(path)

    def load(self, path):
        """
        Load the neural network from a file.

        Args:
        - path: string representing the path to load the neural network from.
        """

        self.model = tf.keras.models.load_model(path)

if __name__ == "__main__":
    # Create the neural network
    neural_network = NeuralNetwork(input_shape=(8, 8, 17), num_actions=4096, filters=256, num_residual_blocks=19)

    engine_path = "path/to/stockfish"
    # Generate training data
    print("Generating training data...")
    t0 = time.time()
    states, policies, values = neural_network.generate_training_data(engine_path, num_samples=1000, depth=14)
    print("Done.")
    print("Time taken: {:.2f} seconds".format(time.time() - t0))
    
    # Train the neural network
    neural_network.train(states, policies, values, epochs=250)

    #train vs elsef
    states, policies, values = neural_network.generate_training_data(engine_path, num_samples=1000, depth=14, use_self_play=True)
    neural_network.train(states, policies, values, epochs=250)


    # Save the neural network
    neural_network.save("neural_network.h5")
