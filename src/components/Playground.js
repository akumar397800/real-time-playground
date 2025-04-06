import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../contexts/AuthContext";
import { initSocket, getSocket } from "../services/socket";
import UserAvatar from "./UserAvatar";
//import VoiceChat from "./VoiceChat";
import "./Playground.css";
//import Coin from "./Coin.js";

const Playground = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  //const [coins, setCoins] = useState({});
  // const [voiceChatWith, setVoiceChatWith] = useState(null);
  // const [voiceChatRequest, setVoiceChatRequest] = useState(null);
  const playgroundRef = useRef(null);
  const socketRef = useRef(null);

  // const collectCoin = (coinId) => {
  //   socket.emit("collectCoin", coinId);
  // };

  useEffect(() => {
    const socket = initSocket();
    socketRef.current = socket;
    if (!user) return;

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    // Initialize socket connection using the socket service

    // Join the world
    socket.emit("joinWorld", { uniqueId: user.uniqueId });

    // Listen for world updates
    socket.on("worldState", (worldUsers) => {
      setUsers(worldUsers);
    });

    socket.on("userJoined", (newUser) => {
      setUsers((prev) => [...prev, newUser]);
    });

    socket.on("userLeft", ({ uniqueId }) => {
      setUsers((prev) => prev.filter((u) => u.uniqueId !== uniqueId));
    });

    socket.on("userMoved", ({ uniqueId, position }) => {
      setUsers((prev) =>
        prev.map((u) => (u.uniqueId === uniqueId ? { ...u, position } : u))
      );
    });

    // socket.on("initialCoins", (serverCoins) => {
    //   setCoins(serverCoins);
    // });
    // socket.on("coinCollected", (coinId) => {
    //   setCoins((prev) => {
    //     const newCoins = { ...prev };
    //     delete newCoins[coinId];
    //     return newCoins;
    //   });
    // });

    // socket.on("newCoin", (newCoin) => {
    //   setCoins((prev) => ({ ...prev, [newCoin.id]: newCoin }));
    // });

    {
      /* socket.on("voiceChatRequest", ({ fromUserId, fromUsername }) => {
      setVoiceChatRequest({ fromUserId, fromUsername });
    });

    socket.on("voiceChatResponse", ({ accepted, targetUserId }) => {
      if (accepted) {
        setVoiceChatWith(targetUserId);
      } else {
        alert(`${targetUserId} declined your voice chat request`);
      }
    });

    socket.on("voiceChatStarted", ({ targetUserId }) => {
      setVoiceChatWith(targetUserId);
    });

    socket.on("voiceChatDeclined", () => {
      // You could set some state here to show a notification
      console.log("Voice chat was declined");
    });
    */
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [user]);

  const handleKeyDown = (e) => {
    const step = 10;
    let newX = position.x;
    let newY = position.y;

    switch (e.key) {
      case "ArrowUp":
        newY -= step;
        break;
      case "ArrowDown":
        newY += step;
        break;
      case "ArrowLeft":
        newX -= step;
        break;
      case "ArrowRight":
        newX += step;
        break;
      default:
        return;
    }

    // Boundary checks
    if (playgroundRef.current) {
      const { width, height } = playgroundRef.current.getBoundingClientRect();
      newX = Math.max(0, Math.min(width - 50, newX));
      newY = Math.max(0, Math.min(height - 50, newY));
    }

    setPosition({ x: newX, y: newY });
    socketRef.current.emit("move", { x: newX, y: newY });
  };

  {
    /*const requestVoiceChat = (targetUserId) => {
    if (socketRef.current) {
      socketRef.current.emit("requestVoiceChat", {
        targetUserId,
        fromUsername: user.username,
      });
      // Add this to your requestVoiceChat function
      console.log("Requesting voice chat with:", targetUserId);
    }
  };*/
  }

  return (
    <div className="playground-container">
      <div
        ref={playgroundRef}
        tabIndex="0"
        onKeyDown={handleKeyDown}
        className="playground-area"
      >
        {/* Current user */}
        <UserAvatar
          username={user?.username}
          position={position}
          isCurrentUser
        />

        {/* Other users */}
        {users
          .filter((u) => u.uniqueId !== user?.uniqueId)
          .map((user) => (
            <UserAvatar
              key={user.uniqueId}
              username={user.username}
              position={user.position}
            />
          ))}

        {/* {Object.entries(coins).map(([coinId, coin]) => (
          <Coin
            key={coinId}
            id={coinId}
            x={coin.x}
            y={coin.y}
            value={coin.value}
            onCollect={collectCoin}
          />
        ))} */}

        {/* Voice chat component 
        {voiceChatWith && (
          <VoiceChat
            targetUserId={voiceChatWith}
            onClose={() => setVoiceChatWith(null)}
          />
        )}*/}
      </div>

      {/* Voice chat request modal */}
      {/*{voiceChatRequest && (
        <div className="voice-chat-modal">
          <div className="modal-content">
            <p>{voiceChatRequest.fromUsername} wants to voice chat. Accept?</p>
            <div className="modal-buttons">
              <button
                className="accept-button"
                onClick={() => {
                  socketRef.current.emit("respondToVoiceChat", {
                    requestorUserId: voiceChatRequest.fromUserId,
                    accept: true,
                  });
                  setVoiceChatWith(voiceChatRequest.fromUserId);
                  setVoiceChatRequest(null);
                }}
              >
                Accept
              </button>
              <button
                className="decline-button"
                onClick={() => {
                  socketRef.current.emit("respondToVoiceChat", {
                    requestorUserId: voiceChatRequest.fromUserId,
                    accept: false,
                  });
                  setVoiceChatRequest(null);
                }}
              >
                Decline
              </button>
            </div>
          </div>
        </div>
      )}*/}
    </div>
  );
};

export default Playground;
