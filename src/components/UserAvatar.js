import React from "react";
import "./UserAvatar.css";

const UserAvatar = ({ username, position, isCurrentUser = false }) => {
  /* const handleVoiceChatClick = (e) => {
    e.stopPropagation();
    if (!isCurrentUser && onRequestVoiceChat) {
      onRequestVoiceChat();
    }
  };*/

  return (
    <div
      className={`user-avatar ${isCurrentUser ? "current-user" : ""}`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: "translate(-50%, -50%)",
      }}
    >
      <div className="avatar-circle">{username.charAt(0).toUpperCase()}</div>
      <div className="username">{username}</div>
      {/* //<div className="user-score">Score: {score}</div> */}
      {/*!isCurrentUser && (
        <button 
          className="voice-chat-button"
          onClick={handleVoiceChatClick}
          title="Request Voice Chat"
        >
          🎤
        </button>
      )*/}
    </div>
  );
};

export default UserAvatar;
