import React, { useState, useRef, useEffect, useContext } from "react";
import {
  MessageCircle,
  X,
  Send,
  Bot,
  User,
  Users,
  Search,
  ArrowLeft,
  Image,
  Paperclip,
  Maximize2,
  Minimize2,
  RotateCcw,
  Download,
  FileText,
  Camera,
  Smile,
  Phone,
  Video,
  MoreVertical,
} from "lucide-react";
import axios from "axios";
import { AuthContext } from "../context/UserContext";

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [chatMode, setChatMode] = useState(null); // null, 'ai', 'friends'
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [showFriendsList, setShowFriendsList] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  // Sample friends data - replace with your actual friends list API
  const [friends] = useState([
    {
      id: 1,
      name: "John Doe",
      avatar: "JD",
      online: true,
      lastSeen: "2 min ago",
    },
    {
      id: 2,
      name: "Sarah Smith",
      avatar: "SS",
      online: false,
      lastSeen: "1 hour ago",
    },
    {
      id: 3,
      name: "Mike Johnson",
      avatar: "MJ",
      online: true,
      lastSeen: "just now",
    },
    {
      id: 4,
      name: "Emma Wilson",
      avatar: "EW",
      online: false,
      lastSeen: "5 hours ago",
    },
    {
      id: 5,
      name: "Alex Brown",
      avatar: "AB",
      online: true,
      lastSeen: "3 min ago",
    },
  ]);

  // Original AI chatbot state
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! How can I help you today?",
      sender: "bot",
      timestamp: new Date(),
      type: "text",
    },
  ]);

  // Friend messages state
  const [friendMessages, setFriendMessages] = useState({});

  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);
  const { darkMode } = useContext(AuthContext);

  // Common emojis for quick access
  const commonEmojis = [
    "😊",
    "😂",
    "❤️",
    "👍",
    "👋",
    "🙏",
    "😢",
    "😮",
    "🎉",
    "🔥",
    "💯",
    "🤔",
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  console.log("Dark Mode:", darkMode);

  useEffect(() => {
    scrollToBottom();
  }, [messages, friendMessages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Handle file upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const fileMessage = {
      id: Date.now(),
      text: `Shared a file: ${file.name}`,
      sender: "user",
      timestamp: new Date(),
      type: "file",
      fileName: file.name,
      fileSize: (file.size / 1024).toFixed(2) + " KB",
      fileType: file.type,
    };

    if (chatMode === "ai") {
      setMessages((prev) => [...prev, fileMessage]);
    } else if (chatMode === "friends" && selectedFriend) {
      setFriendMessages((prev) => ({
        ...prev,
        [selectedFriend.id]: [...(prev[selectedFriend.id] || []), fileMessage],
      }));
    }

    // Reset file input
    event.target.value = "";
  };

  // Handle image upload
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const imageMessage = {
        id: Date.now(),
        text: "Shared an image",
        sender: "user",
        timestamp: new Date(),
        type: "image",
        imageUrl: e.target.result,
        fileName: file.name,
      };

      if (chatMode === "ai") {
        setMessages((prev) => [...prev, imageMessage]);
      } else if (chatMode === "friends" && selectedFriend) {
        setFriendMessages((prev) => ({
          ...prev,
          [selectedFriend.id]: [
            ...(prev[selectedFriend.id] || []),
            imageMessage,
          ],
        }));
      }
    };
    reader.readAsDataURL(file);

    // Reset file input
    event.target.value = "";
  };

  // Add emoji to input text
  const addEmoji = (emoji) => {
    setInputText((prev) => prev + emoji);
    setShowEmojiPicker(false);
    inputRef.current?.focus();
  };

  // Original AI chatbot message handler
  const handleAIMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: inputText,
      sender: "user",
      timestamp: new Date(),
      type: "text",
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsTyping(true);

    // Your original AI chatbot logic
    try {
      const response = await axios.post(
        "http://localhost:4000/chatbot/generate",
        {
          message: inputText,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.data.success) {
        const botMessage = {
          id: Date.now() + 1,
          text: response.data.message,
          sender: "bot",
          timestamp: new Date(),
          type: "text",
        };
        setMessages((prev) => [...prev, botMessage]);
        setIsTyping(false);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setIsTyping(false);
      return;
    }
  };

  // Friend message handler
  const handleFriendMessage = async () => {
    if (!inputText.trim() || !selectedFriend) return;

    const userMessage = {
      id: Date.now(),
      text: inputText,
      sender: "user",
      timestamp: new Date(),
      type: "text",
    };

    setFriendMessages((prev) => ({
      ...prev,
      [selectedFriend.id]: [...(prev[selectedFriend.id] || []), userMessage],
    }));
    setInputText("");

    // Here you would send the message to your friend messaging API
    try {
      // await axios.post("http://localhost:4000/messages/send", {
      //   recipientId: selectedFriend.id,
      //   message: inputText
      // });
      console.log(
        `Message sent to ${selectedFriend.name}: ${userMessage.text}`
      );
    } catch (error) {
      console.error("Error sending message to friend:", error);
    }
  };

  const handleSendMessage = () => {
    if (chatMode === "ai") {
      handleAIMessage();
    } else if (chatMode === "friends") {
      handleFriendMessage();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const filteredFriends = friends.filter((friend) =>
    friend.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const resetChat = () => {
    setChatMode(null);
    setSelectedFriend(null);
    setShowFriendsList(false);
    setSearchTerm("");
    setIsExpanded(false);
  };

  const selectFriend = (friend) => {
    setSelectedFriend(friend);
    setShowFriendsList(false);
    setChatMode("friends");
  };

  const getCurrentMessages = () => {
    if (chatMode === "ai") {
      return messages;
    } else if (chatMode === "friends" && selectedFriend) {
      return friendMessages[selectedFriend.id] || [];
    }
    return [];
  };

  // Download file function
  const downloadFile = (message) => {
    if (message.type === "image" && message.imageUrl) {
      const link = document.createElement("a");
      link.href = message.imageUrl;
      link.download = message.fileName || "image.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Render message content based on type
  const renderMessageContent = (message) => {
    switch (message.type) {
      case "image":
        return (
          <div className="space-y-2">
            <img
              src={message.imageUrl}
              alt={message.fileName}
              className="max-w-full h-auto rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
              style={{ maxHeight: "200px" }}
              onClick={() => window.open(message.imageUrl, "_blank")}
            />
            <p className="text-xs opacity-75">{message.text}</p>
            {message.sender === "user" && (
              <button
                onClick={() => downloadFile(message)}
                className="text-xs opacity-60 hover:opacity-100 flex items-center space-x-1"
              >
                <Download size={10} />
                <span>Download</span>
              </button>
            )}
          </div>
        );
      case "file":
        return (
          <div className="flex items-center space-x-2 p-2 bg-gray-100 rounded-lg">
            <FileText size={16} className="text-gray-600" />
            <div className="flex-1">
              <p className="text-sm font-medium">{message.fileName}</p>
              <p className="text-xs text-gray-500">{message.fileSize}</p>
            </div>
          </div>
        );
      default:
        return <p>{message.text}</p>;
    }
  };

  // Chat window dimensions
  const chatWindowClass = isExpanded
    ? "fixed inset-x-0 bottom-0 top-[82px] w-full" // 72px is typical navbar height
    : "mb-4 w-92 h-140";

  return (
    <div
      className={`fixed  ${
        isExpanded
          ? "inset-x-0 bottom-0 top-[72px] z-40" // Start below navbar
          : "bottom-6 right-6 z-50"
      } ${darkMode ? "dark" : ""}`}
    >
      {/* Hidden file inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.doc,.docx,.txt,.zip,.rar"
        onChange={handleFileUpload}
        className="hidden"
      />
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />

      {/* Chat Window */}
      {isOpen && (
        <div
          className={`${chatWindowClass} bg-[#1a1f37] rounded-2xl shadow-2xl border border-[#1a1f37] flex flex-col overflow-hidden animate-in ${
            isExpanded ? "rounded-none" : "slide-in-from-bottom-5"
          } duration-300`}
        >
          {/* Mode Selection Screen */}
          {!chatMode && !showFriendsList && (
            <div className="flex flex-col items-center justify-center h-full p-6 space-y-6">
              <div className="text-center mb-4">
                <h3 className="text-xl font-bold text-white mb-2">
                  Choose Chat Mode
                </h3>
                <p className="text-white text-sm">
                  Select how you want to communicate
                </p>
                <div className="absolute top-4 right-4 flex space-x-2">
                  <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded-full"
                    title={isExpanded ? "Minimize" : "Expand"}
                  >
                    {isExpanded ? (
                      <Minimize2 size={18} />
                    ) : (
                      <Maximize2 size={18} />
                    )}
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded-full"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              <button
                onClick={() => setChatMode("ai")}
                className="w-full max-w-xs bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-xl hover:shadow-lg transition-all duration-200 flex items-center justify-center space-x-3 cursor-pointer"
              >
                <Bot size={24} />
                <span className="font-semibold">Chat with AI Assistant</span>
              </button>

              <button
                onClick={() => {
                  setShowFriendsList(true);
                  setChatMode("friends");
                }}
                className="w-full max-w-xs bg-gradient-to-r from-green-600 to-teal-600 text-white p-4 rounded-xl hover:shadow-lg transition-all duration-200 flex items-center justify-center space-x-3 cursor-pointer"
              >
                <Users size={24} />
                <span className="font-semibold">Message Friends</span>
              </button>
            </div>
          )}

          {/* Friends List */}
          {showFriendsList && !selectedFriend && (
            <div className="flex flex-col h-full">
              <div className="bg-gradient-to-r from-green-600 to-teal-600 text-white p-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <button
                    onClick={resetChat}
                    className="text-white/80 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-full"
                  >
                    <ArrowLeft size={18} />
                  </button>
                  <h3 className="font-semibold">Select Friend</h3>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="text-white/80 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-full"
                    title={isExpanded ? "Minimize" : "Expand"}
                  >
                    {isExpanded ? (
                      <Minimize2 size={18} />
                    ) : (
                      <Maximize2 size={18} />
                    )}
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-white/80 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-full"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* Search */}
              <div className="p-4 border-b bg-white">
                <div className="relative">
                  <Search
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={16}
                  />
                  <input
                    type="text"
                    placeholder="Search friends..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>

              {/* Friends List */}
              <div className="flex-1 overflow-y-auto bg-white">
                {filteredFriends.length > 0 ? (
                  filteredFriends.map((friend) => (
                    <button
                      key={friend.id}
                      onClick={() => selectFriend(friend)}
                      className="w-full p-4 hover:bg-gray-50 transition-colors flex items-center space-x-3 border-b border-gray-100 text-left"
                    >
                      <div className="relative">
                        <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center text-white font-semibold">
                          {friend.avatar}
                        </div>
                        {friend.online && (
                          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800">
                          {friend.name}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {friend.online
                            ? "Online"
                            : `Last seen ${friend.lastSeen}`}
                        </p>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    <p>No friends found</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Original AI Chat Interface */}
          {chatMode === "ai" && !showFriendsList && (
            <>
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <button
                    onClick={resetChat}
                    className="text-white/80 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-full"
                  >
                    <ArrowLeft size={18} />
                  </button>
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <Bot size={16} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">AI Assistant</h3>
                    <p className="text-xs text-white/80">Online now</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setMessages([messages[0]])}
                    className="text-white/80 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-full"
                    title="Clear Chat"
                  >
                    <RotateCcw size={18} />
                  </button>
                  <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="text-white/80 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-full"
                    title={isExpanded ? "Minimize" : "Expand"}
                  >
                    {isExpanded ? (
                      <Minimize2 size={18} />
                    ) : (
                      <Maximize2 size={18} />
                    )}
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-white/80 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-full"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.sender === "user"
                        ? "justify-end"
                        : "justify-start"
                    } items-end space-x-2`}
                  >
                    {message.sender === "bot" && (
                      <div className="w-6 h-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <Bot size={12} className="text-white" />
                      </div>
                    )}
                    <div
                      className={`max-w-xs px-3 py-2 rounded-2xl text-sm ${
                        message.sender === "user"
                          ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-br-md"
                          : "bg-white text-gray-800 rounded-bl-md shadow-sm border"
                      }`}
                    >
                      {renderMessageContent(message)}
                      <p
                        className={`text-xs mt-1 ${
                          message.sender === "user"
                            ? "text-white/70"
                            : "text-gray-500"
                        }`}
                      >
                        {formatTime(message.timestamp)}
                      </p>
                    </div>
                    {message.sender === "user" && (
                      <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                        <User size={12} className="text-gray-600" />
                      </div>
                    )}
                  </div>
                ))}

                {/* Typing Indicator */}
                {isTyping && (
                  <div className="flex justify-start items-end space-x-2">
                    <div className="w-6 h-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <Bot size={12} className="text-white" />
                    </div>
                    <div className="bg-white px-3 py-2 rounded-2xl rounded-bl-md shadow-sm border">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Emoji Picker */}
              {showEmojiPicker && (
                <div className="absolute bottom-20 right-4 bg-white border border-gray-200 rounded-lg shadow-lg p-3">
                  <div className="grid grid-cols-6 gap-2">
                    {commonEmojis.map((emoji, index) => (
                      <button
                        key={index}
                        onClick={() => addEmoji(emoji)}
                        className="text-xl hover:bg-gray-100 p-1 rounded transition-colors"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Input */}
              <div className="p-4 border-t border-white/10 bg-[#2c3250]">
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <button
                      onClick={() => imageInputRef.current?.click()}
                      className="w-8 h-8 text-white hover:text-blue-600 rounded-full flex items-center justify-center hover:bg-gray-100 transition-all duration-200"
                      title="Share Image"
                    >
                      <Image size={16} />
                    </button>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-8 h-8 text-white hover:text-blue-600 rounded-full flex items-center justify-center hover:bg-gray-100 transition-all duration-200"
                      title="Share File"
                    >
                      <Paperclip size={16} />
                    </button>
                    <button
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                      className="w-8 h-8 text-white hover:text-blue-600 rounded-full flex items-center justify-center hover:bg-gray-100 transition-all duration-200"
                      title="Add Emoji"
                    >
                      <Smile size={16} />
                    </button>
                  </div>

                  <textarea
                    ref={inputRef}
                    value={inputText}
                    onChange={(e) => {
                      setInputText(e.target.value);
                      // Auto-adjust height
                      e.target.style.height = "auto";
                      e.target.style.height = `${e.target.scrollHeight}px`;
                    }}
                    onKeyPress={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    placeholder="Type your message..."
                    rows="1"
                    style={{
                      minHeight: "40px",
                      maxHeight: "120px",
                    }}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm resize-none overflow-auto text-white bg-[#2c3250] placeholder-gray-400"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!inputText.trim()}
                    className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full flex items-center justify-center hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send size={14} />
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Friend Chat Interface */}
          {chatMode === "friends" && selectedFriend && (
            <>
              {/* Header */}
              <div className="bg-gradient-to-r from-green-600 to-teal-600 text-white p-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => {
                      setSelectedFriend(null);
                      setShowFriendsList(true);
                    }}
                    className="text-white/80 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-full"
                  >
                    <ArrowLeft size={18} />
                  </button>
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <span className="text-xs font-semibold">
                      {selectedFriend.avatar}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">
                      {selectedFriend.name}
                    </h3>
                    <p className="text-xs text-white/80">
                      {selectedFriend.online
                        ? "Online"
                        : selectedFriend.lastSeen}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    className="text-white/80 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-full"
                    title="Voice Call"
                  >
                    <Phone size={18} />
                  </button>
                  <button
                    className="text-white/80 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-full"
                    title="Video Call"
                  >
                    <Video size={18} />
                  </button>
                  <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="text-white/80 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-full"
                    title={isExpanded ? "Minimize" : "Expand"}
                  >
                    {isExpanded ? (
                      <Minimize2 size={18} />
                    ) : (
                      <Maximize2 size={18} />
                    )}
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-white/80 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-full"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                {getCurrentMessages().length > 0 ? (
                  getCurrentMessages().map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.sender === "user"
                          ? "justify-end"
                          : "justify-start"
                      } items-end space-x-2`}
                    >
                      {message.sender !== "user" && (
                        <div className="w-6 h-6 bg-gradient-to-r from-green-600 to-teal-600 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-xs text-white font-semibold">
                            {selectedFriend.avatar.charAt(0)}
                          </span>
                        </div>
                      )}
                      <div
                        className={`max-w-xs px-3 py-2 rounded-2xl text-sm ${
                          message.sender === "user"
                            ? "bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-br-md"
                            : "bg-white text-gray-800 rounded-bl-md shadow-sm border"
                        }`}
                      >
                        {renderMessageContent(message)}
                        <p
                          className={`text-xs mt-1 ${
                            message.sender === "user"
                              ? "text-white/70"
                              : "text-gray-500"
                          }`}
                        >
                          {formatTime(message.timestamp)}
                        </p>
                      </div>
                      {message.sender === "user" && (
                        <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                          <User size={12} className="text-gray-600" />
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-gray-500 space-y-2">
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                      <Users size={24} className="text-gray-400" />
                    </div>
                    <p className="text-sm">No messages yet</p>
                    <p className="text-xs text-center max-w-xs">
                      Start a conversation with {selectedFriend.name} by sending
                      a message
                    </p>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Emoji Picker */}
              {showEmojiPicker && (
                <div className="absolute bottom-20 right-4 bg-white border border-gray-200 rounded-lg shadow-lg p-3">
                  <div className="grid grid-cols-6 gap-2">
                    {commonEmojis.map((emoji, index) => (
                      <button
                        key={index}
                        onClick={() => addEmoji(emoji)}
                        className="text-xl hover:bg-gray-100 p-1 rounded transition-colors"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Input */}
              <div className="p-4 border-t bg-white">
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <button
                      onClick={() => imageInputRef.current?.click()}
                      className="w-8 h-8 text-gray-500 hover:text-green-600 rounded-full flex items-center justify-center hover:bg-gray-100 transition-all duration-200"
                      title="Share Image"
                    >
                      <Image size={16} />
                    </button>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-8 h-8 text-gray-500 hover:text-green-600 rounded-full flex items-center justify-center hover:bg-gray-100 transition-all duration-200"
                      title="Share File"
                    >
                      <Paperclip size={16} />
                    </button>
                    <button
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                      className="w-8 h-8 text-gray-500 hover:text-green-600 rounded-full flex items-center justify-center hover:bg-gray-100 transition-all duration-200"
                      title="Add Emoji"
                    >
                      <Smile size={16} />
                    </button>
                  </div>
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={`Message ${selectedFriend.name}...`}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!inputText.trim()}
                    className="w-8 h-8 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-full flex items-center justify-center hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send size={14} />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* Chat Toggle Button */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6">
          <button
            onClick={() => setIsOpen(true)}
            className="w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:shadow-xl bg-gradient-to-r from-yellow-400 to-orange-500 text-[#1a1f37] cursor-pointer"
          >
            <MessageCircle size={24} />
          </button>
        </div>
      )}
    </div>
  );
};

export default ChatBot;
