import React, { useState, useEffect } from "react";
import "./ChatStyle.css";
import { ChatMessage } from "@TRPI/core/core-network/src/utils/Chat";
import { useGameManager } from "../../contexts/GameContext";
import { omit } from "lodash";

// interface ChatMessage {
//   message: string;
//   sender: string;
// }

interface Props{
  matchId: string;
  pseudo: string;
}

const Chat: React.FC<Props> = ({matchId, pseudo}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");

  const [gameManager, setGameManager] = useGameManager();

  useEffect(() => {
    gameManager?.listenToChatMessage({setChat: setMessages});
  }, [gameManager]);
    

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleSendMessage = () => {
    if (inputValue.trim() !== "") {
      const message = { message: inputValue, sender: pseudo, matchId: matchId, timestamp: Date.now() };
      setMessages([...messages, message]);
      setInputValue("");
      gameManager?.sendChatMessage(omit(message, "timestamp"));
    }
  };



  return (
    <div className="chatContainer">
      <div className="messageContainer">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.sender === pseudo ? "sent" : "received"}`}>
            <p>{message.message}</p>
          </div>
        ))}
      </div>
      <div className="sendMessage">
        <input type="text" placeholder="Envoyer un message..." value={inputValue} onChange={handleInputChange} />
        <svg
          width="24"
          height="25"
          viewBox="0 0 24 25"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          onClick={handleSendMessage}
        >
          <path
            d="M9.99994 14.3508L12.2727 19.6808C12.5856 20.4144 13.5585 20.4919 13.9486 19.7967C14.7182 18.4248 15.8591 16.2123 16.9999 13.3457C18.9999 8.3205 19.9999 4.30029 19.9999 4.30029M9.99994 14.3508L4.69672 12.0665C3.9668 11.7521 3.88969 10.7742 4.58143 10.3822C5.9464 9.6087 8.14778 8.46207 10.9999 7.31544C15.9999 5.30534 19.9999 4.30029 19.9999 4.30029M9.99994 14.3508L19.9999 4.30029"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
};

export default Chat;
