import React, { useState, useRef, useEffect } from 'react';
import SockJS from 'sockjs-client/dist/sockjs';
import { Client } from '@stomp/stompjs';
import {
    createPeerConnection,
    createOffer,
    createAnswer,
    addAnswer,
    addIceCandidate
} from '../../webrtc-utils';

const VideoCall = () => {
    const [userName, setUserName] = useState("");
    const [stompClient, setStompClient] = useState(null);
    const localVideoRef = useRef();
    const remoteVideoRef = useRef();
    const peerConnectionRef = useRef();
    const [isConnected, setIsConnected] = useState(false);  // Connection state
    const [isCalling, setIsCalling] = useState(false);

    useEffect(() => {
        // Cleanup on component unmount
        return () => {
            if (stompClient) {
                stompClient.disconnect(() => {
                    console.log('WebSocket connection closed');
                });
            }
            if (peerConnectionRef.current) {
                peerConnectionRef.current.close();
            }
        };
    }, [stompClient]);

    const connect = () => {
        const socket = new SockJS('https://192.168.1.19:8081/ws/video');  // Use HTTPS
        const client = Stomp.over(socket);

        client.connect({}, (frame) => {
            console.log('WebSocket connected successfully', frame);
            setStompClient(client);
            setIsConnected(true);  // Update connection state

            // Subscribe to signaling messages
            console.log("before subscribe");
            
            client.subscribe('/topic/signaling', (message) => {
                
                const signal = JSON.parse(message.body);
                handleSignalingMessage(signal);
                
                
            });
        }, (error) => {
            console.error('WebSocket connection error:', error);
            setIsConnected(false);
        });
    };

    const handleSignalingMessage = async (signal) => {
        console.log("this is signal :" + signal);
        
        const { type, data } = signal;
        const peerConnection = peerConnectionRef.current;
    
        if (type === 'offer') {
            const answer = await createAnswer(peerConnection, data);
            stompClient.send('/app/signal', {}, JSON.stringify({ type: 'answer', data: answer }));
        } else if (type === 'answer') {
            await addAnswer(peerConnection, data);
        } else if (type === 'candidate') {
            if (peerConnection) {
                await addIceCandidate(peerConnection, data);
            }
        }
        else{
            console.log("no Type");
            
        }
    };
    

    const endCall = () => {
        // Logic to end the call and disconnect the WebSocket
        if (stompClient) {
            stompClient.disconnect();
        }
        if (peerConnectionRef.current) {
            peerConnectionRef.current.close();
        }
        setIsCalling(false);
        setIsConnected(false);
    };

    const muteAudio = () => {
        const localStream = localVideoRef.current.srcObject;
        localStream.getAudioTracks().forEach(track => track.enabled = !track.enabled);
    };

    const startCall = async () => {
        try {
            const localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            localVideoRef.current.srcObject = localStream;
    
            const peerConnection = createPeerConnection(localStream, (remoteStream) => {
                remoteVideoRef.current.srcObject = remoteStream;  // Set remote video stream
            }, (candidate) => {
                stompClient.send('/app/signal', {}, JSON.stringify({ type: 'candidate', data: candidate }));
            });
    
            peerConnectionRef.current = peerConnection;
    
            const offer = await createOffer(peerConnection);
            stompClient.send('/app/signal', {}, JSON.stringify({ type: 'offer', data: offer }));
            setIsCalling(true);
        } catch (error) {
            console.error("Error starting call:", error);
        }
    };
    

    return (
        <div>
            <h1>Video Call App</h1>
            {isConnected ? (
                <div>
                    <video ref={localVideoRef} autoPlay playsInline muted style={{ width: '300px' }} />
                    <video ref={remoteVideoRef} autoPlay playsInline style={{ width: '300px' }} />
                    {!isCalling && <button onClick={startCall}>Start Call</button>}
                    {isCalling && (
                        <>
                            <button onClick={endCall}>End Call</button>
                            <button onClick={muteAudio}>Mute/Unmute</button>
                        </>
                    )}
                </div>
            ) : (
                <div>
                    <input type="text" value={userName} onChange={(e) => setUserName(e.target.value)} />
                    <button onClick={connect}>Enter</button>
                </div>
            )}
        </div>
    );
};

export default VideoCall;
