import React, { useRef, useState, useEffect } from 'react';
import axios from 'axios'
import './chatIndex.css'

function Chat() {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [openRooms, setOpenRooms] = useState({}); // Define openRooms state

  //fetch current user from the backend
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await axios.get('http://localhost:4000/chat/currentUser', { withCredentials: true });
        setCurrentUser(response.data);  //the response.data already is the username le, so currentUser is username of the uer
      } catch (error) {
        console.error('Error fetching current user:', error);
      }
    };

    fetchCurrentUser();
  }, []);

  // Fetch users from the backend
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:4000/chat/userName', { withCredentials: true });  //withCredentials: true is pass the cookies as header to baekcnd
        const usernames = response.data.map(user => user.username); // Assuming the response contains an array of user objects with 'username' property
        setUsers(usernames);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []); //maybe can add dependency here

  const handleUserClick = (user) => {
    setSelectedUser(user);
    // If the chat room is not already open, add it to openRooms state
    if (!openRooms[user]) {
      // Mark the chat room as open
      setOpenRooms({ ...openRooms, [user]: true });
    }
    // Handle updating messages in the future
  };

  return (
    <div className='homeContainer'>
      <div className="chat_container">
        <ChatList users={users} onUserClick={handleUserClick} />
        {selectedUser && <ChatRoom user={selectedUser} currentUser={currentUser} />}
      </div>
    </div>
  );
}

function ChatList({ users, onUserClick }) {
  const [selectedStatus, setSelectedStatus] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredUsers, setFilteredUsers] = useState(users)

  // Synchronize filteredUsers with users when users change
  useEffect(() => {
    setFilteredUsers(users);
  }, [users]);

  // Function to handle changes in the search input
  const handleSearch = (e) => {
    const searchQuery = e.target.value;
    setSearchQuery(searchQuery);
    filterChatsByName(searchQuery);
  };

  const filterChatsByName = (searchQuery) => {
    if (searchQuery === '') {
      setFilteredUsers(users);
    } else {
      const filteredArray = users.filter(user => user.toLowerCase().includes(searchQuery.toLowerCase()));
      setFilteredUsers(filteredArray);
    }
  };

  return (
    <div className="chat-list-container">
      <div className="search-container">
        <input type="text" placeholder="Search user..." value={searchQuery} onChange={handleSearch} className="search-input" />
      </div>
      <div className="chat-items-container">
        {filteredUsers.map((user, index) => (
          <div key={index} className="chat-item" onClick={() => onUserClick(user)}>
            <div>{user}</div>
          </div>
        ))}
      </div>
    </div>
  );
}


function ChatRoom({ user, currentUser }) { //user= selecteduser
  const dummy = useRef();
  const [messages, setMessages] = useState([]);
  const [formValue, setFormValue] = useState('');
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);


  // Reset messages when a new user is clicked
  useEffect(() => {
    setMessages([]);
  }, [user]);

  useEffect(() => {
    if (user) {
      // Fetch previous messages for the selected user from the backend
      const fetchMessages = async () => {
        try {
          const response = await axios.get(`http://localhost:4000/chat/${user}/messages`, {
            params: {
              currentUser: currentUser
            }
          });
          setMessages(response.data);

        } catch (error) {
          console.error('Error fetching messages:', error);
        }
      };
      fetchMessages();
    }
  }, [user]);

  const sendMessage = async (e) => {
    e.preventDefault();
    const currentTime = new Date().toLocaleTimeString([], {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });

    try {
      const formData = new FormData();
      formData.append('senderName', currentUser);
      formData.append('receiverName', user);
      formData.append('content', formValue);
      formData.append('timestamp', currentTime);

      if (file) {
        formData.append('file', file);
      }

      const response = await axios.post('http://localhost:4000/chat/newMessage', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      // Update messages state
      setMessages(prevMessages => [...prevMessages, response.data]);

      setFormValue('');
      setFile(null);

      // dummy.current.scrollIntoView({ behavior: 'smooth' });
      const chatContent = document.querySelector('.chatcontent');
      chatContent.scrollTop = chatContent.scrollHeight;
    } catch (error) {
      console.error('Error sending message:', error);
    }
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
        <ChatMessage key={index} message={msg} userSelected={user} currentUser={currentUser} />
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

function ChatMessage({ message, currentUser }) {
  const messageClass = message.senderName === currentUser ? 'sent' : 'received';

  const getImgUrl = (imgPath) => {
    const adjustedPath = imgPath.replace('/frontend/src/uploads/', '/src/uploads/');
    return `/${adjustedPath}`;
  }

  return (
    <div className={`chatmessage ${messageClass}`}>
      {message.content && !message.file && <p>{message.content}</p>}
      {message.file && (<img src={getImgUrl(message.file)} className={`uploaded-image ${message.senderName === currentUser ? 'sent-image' : 'received-image'}`} />)}
      <div className="message-time">{message.timestamp}</div>
    </div>
  )
}
export default Chat;