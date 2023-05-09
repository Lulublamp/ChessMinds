from flask import Flask, request, jsonify
import numpy as np
import chess

app = Flask(__name__)

# Create an instance of the NeuralNetwork class
neural_network = NeuralNetwork(input_shape=(8, 8, 17), num_actions=64*64)
neural_network.model.load_weights('ai/neural_network.h5')

# Create an instance of the MCTS class
mcts = MCTS(neural_network)

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json(force=True)
    fen = data['fen']
    board = chess.Board(fen)
    best_move = mcts.search(board)
    return jsonify({'best_move': str(best_move)})

if __name__ == '__main__':
    app.run(port=5000, debug=True)
