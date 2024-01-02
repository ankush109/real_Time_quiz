import { useEffect, useState } from 'react';

function ChatRoom({ socket, roomId,name }) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const handleReceiveMessage = (mess,name) => {
      console.log(mess,name, "message received");
  
      // Extract the message text from the object
      const receivedMessage = { name: name, message: mess };
        console.log(receivedMessage.message)
      // Update the state to include the new message
      setMessages((prevMessages) => [...prevMessages, receivedMessage.message]);
      console.log(messages,"all the messages")
    };
  
    socket.on("receive-message", handleReceiveMessage);
  
    // Clean up the event listener when the component unmounts
    return () => {
      socket.off("receive-message", handleReceiveMessage);
    };
  }, [socket]);  // Ensure that the effect only runs when the socket changes
  
  const handleInputChange = (e) => {
    setMessage(e.target.value);
  };

  const handleSendMessage = () => {
    if (message.trim() === '') {
      // Prevent sending empty messages
      return;
    }
    const m = {name:"you",message:message}
    setMessage((prev)=>[...prev,m])
    console.log(messages,"mess")
    socket.emit("send-message", {
      message,
      name
        
    });

    // You can add further logic to send the message to a server or update the state, etc.
    setMessage(''); // Clear the input after sending the message
  };

  return (
    <div className="max-w-md overflow-none mx-auto p-5 w-1/4">
      <div className="mb-4">
        <label className="block text-white text-sm font-bold mb-2">Message:</label>
        <input
          type="text"
          value={message}
          onChange={handleInputChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline"
          placeholder="Type your message..."
        />
      </div>

      

      <button
        onClick={handleSendMessage}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        Send
      </button>
      <div className="mb-4">
  <label className="block text-white text-sm font-bold mb-2">Messages:</label>
  <div className="text-white ">
  {messages?.map((msg, index) => (
    <div className="flex gap-2 message-container m-3" key={index}>
      <div className="message-content bg-re p-2 rounded-lg">
        <span className="text-gray-400">@{
            msg.mess?.name===name? "you" :msg.mess?.name
        }</span>
      </div>
      <div className="sender-name bg-white w-full p-2 text-blue-500 font-bold rounded-lg">
        {msg.mess?.message}
      </div>
    </div>
  ))}
</div>

</div>

    </div>
  );
}

export default ChatRoom;
