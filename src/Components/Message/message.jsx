import React, { useEffect, useRef, useState } from 'react'
import { over } from 'stompjs';
import SockJS, { log } from 'sockjs-client/dist/sockjs';
import "./message.css";
import axios from 'axios';
import { ImAttachment } from "react-icons/im";
import { GrGallery } from "react-icons/gr";
import ImageUpload from '../ImageUpload/ImageUpload';

var stompClient = null;
const ChatRoom = () => {

    const [messageCount, setMessageCount] = useState(new Map());
    const [unreadMessages, setUnreadMessages] = useState(new Map());
    const [users, setUsers] = useState(["Sujal", "Namita", "Asur"]);
    const [imageUpload, setImageUpload] = useState(false);
    const [render, setRender] = useState(false);
    const [privateChats, setPrivateChats] = useState(new Map());
    const [publicChats, setPublicChats] = useState([]);
    const [tab, setTab] = useState("CHATROOM");
    const [userData, setUserData] = useState({
        username: '',
        receivername: '',
        connected: false,
        message: ''
    });

    const [image, setImage] = useState(null);
    const [imageUrl, setImageUrl] = useState('');

    const messageEndRef = useRef(null);  // This will reference the end of the chat messages

    // Function to scroll to the bottom of the chat
    const scrollToBottom = () => {
        messageEndRef.current?.scrollIntoView({ behavior: 'auto' });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        const maxSize = 10 * 1024 * 1024; // 10MB
    
        if (file.size > maxSize) {
            alert('File size exceeds 10MB limit');
            return;
        }
    
        setImage(file);

    };

    const toggleImageUpload = () => {
        setImageUpload(!imageUpload);
    }

    useEffect(() => {
        console.log(userData);
    }, [userData]);

    useEffect(() => {
        if (tab !== "CHATROOM") {
            if (userData.receivername !== tab) { setUserData(prevState => ({ ...prevState, receivername: tab })); }
        }

    }, [tab]);

    useEffect(() => {
        axios.get('http://localhost:8081/messages/public')
            .then(response => {
                // publicChats.push(response.data);
                setPublicChats(response.data);

            })
            .catch(error => console.error(error));
            
    }, []);
    

    useEffect(() => {
        console.log("this is receiver: " + userData.receivername);

        if (userData.username && userData.receivername && userData.receivername !== "CHATROOM") {
            console.log("before fetch");

            // Fetch private messages between the current user and the selected receiver
            axios.get('http://localhost:8081/messages/private', {
                params: {
                    sender: userData.username,
                    receiver: userData.receivername
                }
            })
                .then(response => {
                    console.log(response.data);

                    setPrivateChats(prevChats => {
                        const updatedChats = new Map(prevChats);
                        updatedChats.set(userData.receivername, response.data);
                        return new Map(updatedChats);
                    });
                    scrollToBottom();
                })
                .catch(error => console.error(error));

            console.log("after Fetched");
        }
    }, [userData.username, userData.receivername, render]); // Removed privateChats and tab dependencies

    useEffect(() => {
        scrollToBottom();
    }, [privateChats, tab]);

    useEffect(() => {

    }, [privateChats])

   


    const connect = () => {
        var Sock = new SockJS('http://localhost:8081/ws');
        stompClient = over(Sock);
        stompClient.connect({}, onConnected, onError);
    }

    const onConnected = () => {
        setUserData({ ...userData, "connected": true });
        stompClient.subscribe('/chatroom/public', onMessageReceived);
        users.forEach(user => {

            stompClient.subscribe('/user/' + user + '/private', onPrivateMessage);
            privateChats.set(user, []);
            setPrivateChats(new Map(privateChats));

        });

      
        // stompClient.subscribe('/chatroom/public', onMessageReceived);
        // stompClient.subscribe('/user/'+userData.username+'/private', onPrivateMessage);
        userJoin();
    }

    const userJoin = () => {
        var chatMessage = {
            sender: userData.username,
            status: "JOIN"
        };
        //   stompClient.send("/app/message", {}, JSON.stringify(chatMessage));
    }

    const onMessageReceived = (payload) => {
        var payloadData = JSON.parse(payload.body);
        switch (payloadData.status) {
            case "JOIN":
                if (!privateChats.get(payloadData.sender)) {
                    privateChats.set(payloadData.sender, []);
                    setPrivateChats(new Map(privateChats));
                }
                break;
            case "MESSAGE":
                publicChats.push(payloadData);
                setPublicChats([...publicChats]);


                break;
        }
    }

    const onPrivateMessage = (payload) => {
        const payloadData = JSON.parse(payload.body);
        console.log(payloadData);

        setPrivateChats(prevChats => {
            const newChats = new Map(prevChats);
            const messages = newChats.get(payloadData.sender) || [];
            newChats.set(payloadData.sender, [...messages, payloadData]);



            return newChats;
        });

        // Move the sender to the top of the list
        setUsers(prevUsers => {
            const updatedUsers = [payloadData.sender, payloadData.receiver, ...prevUsers.filter(user => user !== payloadData.sender)];
            return updatedUsers;
        });

        // Mark as unread
        setUnreadMessages(prev => new Map(prev).set(payloadData.sender, true));
        setMessageCount(prev =>{
            const newMessageCount = new Map(prev);
            const count = newMessageCount.get(payloadData.sender) || [0];
            const newCount = parseInt(count[0]) + 1;
            console.log(newCount);
            
            newMessageCount.set(payloadData.sender, [newCount, payloadData.receiver]);
            console.log("this is map " + newMessageCount)
            return newMessageCount;
        });

        scrollToBottom();
    };

    const handleUserClick = (name) => {
        setTab(name);

        // Mark the messages as read when the user clicks on the chat
        setUnreadMessages(prev => {
            const newMap = new Map(prev);
            newMap.set(name, false);  // Mark as read
            return newMap;
        });

        setMessageCount(prev=>{
            const newMessageCount = new Map(prev);
            newMessageCount.set(name, 0);
            return newMessageCount;
        })
    }



    const onError = (err) => {
        console.log(err);

    }

    const handleMessage = (event) => {
        const { value } = event.target;
        setUserData({ ...userData, "message": value });
    }
    const sendValue = () => {
        if (stompClient) {
            var chatMessage = {
                sender: userData.username,
                message: userData.message,
                status: "MESSAGE"
            };
            console.log(chatMessage);
            stompClient.send("/app/message", {}, JSON.stringify(chatMessage));
            setUserData({ ...userData, "message": "" });
        }
    }

    const sendValueImage = (image) => {
        if (stompClient) {
            var chatMessage = {
                sender: userData.username,
                message: image,
                status: "MESSAGE"
            };
            console.log(chatMessage);
            stompClient.send("/app/message", {}, JSON.stringify(chatMessage));
            setUserData({ ...userData, "message": "" });
        }
    }

    const sendPrivateValue = () => {
        console.log("Sending message to tab:", tab);

        if (stompClient) {
            const chatMessage = {
                sender: userData.username,
                receiver: tab,
                message: userData.message,
                status: "MESSAGE"
            };

            const newPrivateChats = new Map(privateChats);

            if (!newPrivateChats.get(tab)) {
                newPrivateChats.set(tab, []);
            }

            newPrivateChats.get(tab).push(chatMessage);
            console.log("Updated privateChats:", newPrivateChats);

            setPrivateChats(newPrivateChats);
            stompClient.send("/app/private-message", {}, JSON.stringify(chatMessage));
            setUserData({ ...userData, message: "" });

            // Force a re-render by toggling a dummy state
            setRender(prev => !prev);

            scrollToBottom();
        }
    };

    const sendPrivateValueImage = (image) => {
        console.log("Sending message to tab:", tab);

        if (stompClient) {
            const chatMessage = {
                sender: userData.username,
                receiver: tab,
                message: image,
                status: "MESSAGE"
            };

            const newPrivateChats = new Map(privateChats);

            if (!newPrivateChats.get(tab)) {
                newPrivateChats.set(tab, []);
            }

            newPrivateChats.get(tab).push(chatMessage);
            console.log("Updated privateChats:", newPrivateChats);

            setPrivateChats(newPrivateChats);
            stompClient.send("/app/private-message", {}, JSON.stringify(chatMessage));
            setUserData({ ...userData, message: "" });

            // Force a re-render by toggling a dummy state
            setRender(prev => !prev);

            scrollToBottom();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('image', image);

        try {
            const response = await axios.post('http://localhost:8080/sendImage/uploadImage', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            const imageData = `<img src="${response.data.url}" alt="" style={{width:"300px"}}/>`;

            setImageUrl(response.data.url);
            console.log('Image uploaded:', response.data.url);

            if (tab === "CHATROOM") {
                sendValueImage(imageData);
            }
            else {
                sendPrivateValueImage(imageData);
            }



            setImage(null);
            toggleImageUpload();
        } catch (error) {
            console.error('Error uploading image:', error);
        }
    };

    const handleUsername = (event) => {
        const { value } = event.target;
        setUserData({ ...userData, "username": value });
    }

    const registerUser = () => {
        connect();
    }
    return (
        <div className="container">
            {userData.connected ?
                <div className="chat-box">
                    <div className="member-list">
                        <ul>

                            <li onClick={() => { setTab("CHATROOM") }} className={`member ${tab === "CHATROOM" && "active"}`}>Chatroom</li>
                            {[...privateChats.keys()].map((name, index) => (
                                name !== userData.username && (
                                    <li
                                        onClick={() => handleUserClick(name)}
                                        className={`member ${tab === name && "active"}`}
                                        key={index}
                                        style={{ fontWeight: unreadMessages.get(name) && messageCount.get(name) && messageCount.get(name)[1] == userData.username ? 'bold' : 'normal' }}
                                    >
                                        <div style={{display:"flex", justifyContent:"space-between"}}>

                                        
                                        <p style={{margin:"0"}}>{name}</p>
                                        <span>{messageCount.get(name) && messageCount.get(name)[1] == userData.username && messageCount.get(name)[0] > 0 ? messageCount.get(name)[0] : ""}</span>
                                        
                                        </div>

                                        <div className="latest-message">
                                        {/* Display the latest message under the user's name */}
                                        {privateChats.get(name) && privateChats.get(name).length > 0 ? (
                                            <span> { privateChats.get(name).slice(-1)[0].message.startsWith('<img') ? "Sent an image": messageCount.get(name) && messageCount.get(name)[1] == userData.username? "message: " + privateChats.get(name).slice(-1)[0].message: ""}</span>
                                        ) : (
                                            <span></span>
                                        )}
                                    </div>
                                    </li>
                                )
                            ))}
                        </ul>
                    </div>
                    {tab === "CHATROOM" && <div className="chat-content">
                        <div style={{ display: "flex", justifyContent: "space-between", position: "sticky", top: "0", backgroundColor: "blueviolet", color: "white", padding: "0 20px", borderRadius: '6px' }}>
                            <h4>{tab}</h4>
                            <h4>{userData.username}</h4>
                        </div>
                        <ul className="chat-messages">
                            {publicChats.map((chat, index) => (
                                <li className={`message ${chat.sender === userData.username && "self"}`} key={index}>
                                    {chat.sender !== userData.username && <div className="avatar">{chat.sender.charAt(0).toUpperCase()}</div>}
                                    <div className="message-data">{chat.message.startsWith('<img') ? (
                                        <div dangerouslySetInnerHTML={{ __html: chat.message }} />
                                    ) : (
                                        chat.message
                                    )}</div>
                                    {chat.sender === userData.username && <div className="avatar self">{chat.sender.charAt(0).toUpperCase()}</div>}
                                </li>
                            ))}
                        </ul>

                        <div className="send-message">
                            <GrGallery style={{ width: "5%", fontSize: "23px", cursor: "pointer" }} onClick={toggleImageUpload} />
                            {imageUpload && <div style={{ position: "absolute", top: "-90px", backgroundColor: "gray" }}>
                                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                                    <input type="file" style={{ marginBottom: "7px" }} onChange={handleImageChange} />
                                    <button type='submit' style={{ color: "white", backgroundColor: "blueviolet" }}>Send</button>
                                </form>
                            </div>}
                            <input type="text" className="input-message" placeholder="enter the message" value={userData.message} onChange={handleMessage} />
                            <button type="submit" className="send-button" onClick={sendValue}>send</button>
                        </div>
                    </div>}
                    {tab !== "CHATROOM" && <div className="chat-content">
                        <div style={{ display: "flex", justifyContent: "space-between", position: "sticky", top: "0", backgroundColor: "blueviolet", color: "white", padding: "0 20px", borderRadius: "6px" }}>
                            <h4>{tab}</h4>
                            <h4>{userData.username}</h4>
                        </div>
                        <ul className="chat-messages">
                            {[...privateChats.get(tab)].map((chat, index) => (

                                <li className={`message ${chat.sender === userData.username && "self"}`} key={index}>
                                    {chat.sender !== userData.username && <div className="avatar">{chat.sender}</div>}
                                    <div className="message-data">{chat.message.startsWith('<img') ? (
                                        <div dangerouslySetInnerHTML={{ __html: chat.message }} />
                                    ) : (
                                        chat.message
                                    )}</div>
                                    {chat.sender === userData.username && <div className="avatar self">{chat.sender}</div>}
                                </li>
                            ))}
                            <div ref={messageEndRef} />
                        </ul>

                        <div className="send-message">
                            <GrGallery style={{ width: "5%", fontSize: "23px", cursor: "pointer" }} onClick={toggleImageUpload} />
                            {imageUpload && <div style={{ position: "absolute", top: "-90px", backgroundColor: "gray" }}>
                                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                                    <input type="file" style={{ marginBottom: "7px" }} onChange={handleImageChange} />
                                    <button type='submit' style={{ color: "white", backgroundColor: "blueviolet" }}>Send</button>
                                </form>
                            </div>}
                            <input type="text" className="input-message" placeholder="enter the message" value={userData.message} onChange={handleMessage} />
                            <button type="submit" className="send-button" onClick={sendPrivateValue}>send</button>
                        </div>
                    </div>}
                </div>
                :
                <div className="register">
                    <input
                        id="user-name"
                        placeholder="Enter your name"
                        name="userName"
                        value={userData.username}
                        onChange={handleUsername}
                        margin="normal"
                    />
                    <button type="button" onClick={registerUser}>
                        connect
                    </button>
                </div>}
        </div>
    )
}

export default ChatRoom