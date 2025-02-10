import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const API_KEY = "AIzaSyCD5bLwunYj_Y3apC-zC6Yajqmknl8JffU";
  const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`;

  // Scroll to the bottom of the chat when messages update
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || !API_KEY) return;

    const newMessages = [...messages, { text: input, sender: "user" }];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const response = await axios.post(API_URL, {
        contents: [{ parts: [{ text: input }] }],
      });

      const botReply =
        response.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "Sorry, I couldn't understand.";

      setMessages([...newMessages, { text: botReply, sender: "bot" }]);
    } catch (error) {
      console.error("Error fetching response:", error);
      setMessages([...newMessages, { text: "Error connecting to AI.", sender: "bot" }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <div className="card shadow-lg">
        <div className="card-header bg-primary text-white text-center">
          <h2>Ranjit Chatbot</h2>
        </div>
        <div className="card-body" style={{ height: "400px", overflowY: "auto" }}>
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`alert ${
                msg.sender === "user" ? "alert-primary text-end" : "alert-secondary text-start"
              }`}
            >
              <strong>{msg.sender === "user" ? "You: " : "Bot: "}</strong>
              {msg.text}
            </div>
          ))}
          {isLoading && (
            <div className="alert alert-info text-start">
              <strong>Bot: </strong>Typing...
            </div>
          )}
          <div ref={messagesEndRef} /> {/* For auto-scrolling */}
        </div>
        <div className="card-footer d-flex">
          <input
            type="text"
            className="form-control me-2"
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            disabled={isLoading}
          />
          <button
            className="btn btn-primary"
            onClick={sendMessage}
            disabled={isLoading}
          >
            {isLoading ? "Sending..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;