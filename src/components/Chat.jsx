import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCommentDots, faTimes, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import "./chat.css";

const Chat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      from: "bot",
      text: "Hi there! Welcome to Jirani's flavours of home. How can I help you?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg = { from: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const userId = localStorage.getItem("user_id"); // get user_id if logged in

      const res = await fetch("https://mnkymn9n.pythonanywhere.com/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: input,
          user_id: userId || null,
        }),
      });

      const data = await res.json();
      setMessages((prev) => [...prev, { from: "bot", text: data.response }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: "Sorry, I'm having trouble connecting. Please try again later." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="chat-container">
      {isOpen ? (
        <div className="chat-widget">
          <div className="chat-header">
            <FontAwesomeIcon icon={faCommentDots} className="chat-icon" />
            <span>Y Jiran's Assistant</span>
            <button
              className="chat-close-btn"
              onClick={toggleChat}
              aria-label="Close chat"
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>
          <div className="chat-body">
            {messages.map((msg, i) => (
              <div key={i} className={`chat-msg ${msg.from}`}>
                {msg.text}
              </div>
            ))}
            {isLoading && (
              <div className="chat-msg bot">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <form className="chat-input" onSubmit={handleSubmit}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your question..."
              disabled={isLoading}
              aria-label="Type your message"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              aria-label="Send message"
            >
              <FontAwesomeIcon icon={faPaperPlane} />
            </button>
          </form>
        </div>
      ) : (
        <button
          className="chat-fab"
          onClick={toggleChat}
          aria-label="Open chat"
        >
          <FontAwesomeIcon icon={faCommentDots} size="lg" />
        </button>
      )}
    </div>
  );
};

export default Chat;
