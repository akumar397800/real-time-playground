// components/VoiceChat.js
import React, { useEffect, useRef } from 'react';

const VoiceChat = ({ targetUserId, onClose }) => {
  const localAudioRef = useRef(null);
  const remoteAudioRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const socketRef = useRef(null);

  useEffect(() => {
    // Initialize WebRTC connection
    async function setupVoiceChat() {
      try {
        // Get local audio stream
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        localAudioRef.current.srcObject = stream;

        // Create peer connection
        const peerConnection = new RTCPeerConnection({
          iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
        });
        peerConnectionRef.current = peerConnection;

        // Add local stream to connection
        stream.getTracks().forEach(track => {
          peerConnection.addTrack(track, stream);
        });

        // Listen for remote stream
        peerConnection.ontrack = (event) => {
          remoteAudioRef.current.srcObject = event.streams[0];
        };

        // ICE candidate handling
        peerConnection.onicecandidate = (event) => {
          if (event.candidate) {
            // Send candidate to other peer via signaling (Socket.IO)
            socketRef.current.emit('iceCandidate', {
              targetUserId,
              candidate: event.candidate
            });
          }
        };

        // Create offer
        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);

        // Send offer to other peer via signaling
        socketRef.current.emit('offer', {
          targetUserId,
          offer
        });

      } catch (error) {
        console.error('Error setting up voice chat:', error);
        onClose();
      }
    }

    setupVoiceChat();

    return () => {
      // Cleanup
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
      }
      if (localAudioRef.current.srcObject) {
        localAudioRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
    };
  }, [targetUserId, onClose]);

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      backgroundColor: 'white',
      padding: '10px',
      borderRadius: '5px',
      boxShadow: '0 0 10px rgba(0,0,0,0.2)'
    }}>
      <h3>Voice Chat with {targetUserId}</h3>
      <div>
        <audio ref={localAudioRef} autoPlay muted />
        <audio ref={remoteAudioRef} autoPlay />
      </div>
      <button onClick={onClose}>End Call</button>
    </div>
  );
};

export default VoiceChat;