import React, { useRef, useState, useEffect } from 'react';
import './chatIndex.css'

const sampleChats = [
  { id: 1, name: 'John', orderStatus: 'Pending' },
  { id: 2, name: 'Alice', orderStatus: 'Delivered' },
  { id: 3, name: 'Bob', orderStatus: 'Cancelled' },
  { id: 4, name: 'Adam', orderStatus: 'Delivered' }
];

function Chat() {
  const [selectedUser, setSelectedUser] = useState(null);
  const [openRooms, setOpenRooms] = useState({}); // Define openRooms state

  const handleUserClick = (user) => {
    setSelectedUser(user.id);
    // If the chat room is not already open, add it to openRooms state
    if (!openRooms[user.id]) {
      // Mark the chat room as open
      setOpenRooms({ ...openRooms, [user.id]: true });
    }
    // Handle updating messages in the future
  };

  return (
    <div className='homeContainer'>
        <div className="chat_container">
          <ChatList onUserClick={handleUserClick} />
          {selectedUser && <ChatRoom user={selectedUser} />}
        </div>
    </div>
  );
}

function ChatList({ onUserClick }) {
  const [chats, setChats] = useState(sampleChats);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Function to handle changes in the search input
  const handleSearch = (e) => {
    const searchQuery = e.target.value;
    setSearchQuery(searchQuery);
    filterChatsByName(searchQuery);
  };

  // Function to handle changes in the dropdown selection
  const handleStatusChange = (e) => {
    const status = e.target.value;
    setSelectedStatus(status);
    filterChats(status);
  };

  const filterChats = (status) => {
    if (status === 'All') {
      setChats(sampleChats);
    } else {
      const filteredChats = sampleChats.filter(chat => chat.orderStatus === status);
      setChats(filteredChats);
    }
  };

  const filterChatsByName = (searchQuery) => {
    if (searchQuery === '') {
      setChats(sampleChats);
    } else {
      const filteredChats = sampleChats.filter(chat =>chat.name.toLowerCase().includes(searchQuery.toLowerCase()));
      setChats(filteredChats);
    }
  };

  return (
    <div className="chat-list-container">
      <div className="order-status-container">
        <label htmlFor="orderStatus" className="order-status-label"></label>
        <select id="orderStatus" onChange={handleStatusChange} value={selectedStatus}>
          <option value="All">All</option>
          <option value="Pending">Pending</option>
          <option value="Cancelled">Cancelled</option>
          <option value="Delivered">Delivered</option>
        </select>
      </div>
      <div className="search-container">
        <input type="text" placeholder="Search user..." value={searchQuery} onChange={handleSearch} className="search-input" />
      </div>
      <div className="chat-items-container">
        {chats.map((chat) => (
          <div key={chat.id} className="chat-item" onClick={() => onUserClick(chat)}>
            <div>{chat.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
}


function ChatRoom({user}) {
  const dummy = useRef();
  const [messages, setMessages] = useState([]);
  const [formValue, setFormValue] = useState('');
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);

  // Reset messages when a new user is clicked
  useEffect(() => {
    setMessages([]);
  }, [user]);

  const sendMessage = (e) => {
    e.preventDefault();
    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    // const currentTime = new Date().toLocaleTimeString();

    if (file) {
      const newMessage = {
        text: '',
        file: URL.createObjectURL(file), 
        time: currentTime,
      };
      setMessages([...messages, newMessage]);
    } else if (formValue) {
      const newMessage = {
        text: formValue,
        file: null,
        time: currentTime,
      };
      setMessages([...messages, newMessage]);
    }

    setFormValue('');
    setFile(null);

    // dummy.current.scrollIntoView({ behavior: 'smooth' });
  const chatContent = document.querySelector('.chatcontent');
  chatContent.scrollTop = chatContent.scrollHeight;
  };

  const handleFileUpload = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setFormValue(selectedFile.name);
  };

  return (
      <div className='chatcontent'>
        {messages.map((msg, index) => (
          <ChatMessage key={index} message={msg} />
        ))}
        <span ref={dummy}></span>
        <form className="formchatcontent" onSubmit={sendMessage}>
          <input value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder="Type a message..." />
          <button type="submit" disabled={!formValue} className="send-button"> </button>
          <button type="button" onClick={handleFileUpload} className="upload-button"> </button>
          <input type="file" ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileChange} />
        </form>
      </div>
  )
}

function ChatMessage({ message }) {
  return (
    <div className="chatmessage">
      {message.text && <p>{message.text}</p>}
      {message.file && (<img src={message.file} className="uploaded-image" />)}
      <div className="message-time">{message.time}</div>
    </div>
  )
}

export default Chat;
