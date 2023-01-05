import { useEffect, useState } from 'react';
import './App.css'

const ws = new WebSocket("ws://localhost:3000/cable");

function App() {
  const [messages, setMessages] = useState([]);
  const [guid, setGuid] = useState("");
  const messagesContainer = document.getElementById("messages");

  ws.onopen = () => {
    console.log("Connected to websocket server");
    setGuid(Math.random().toString(36).substring(2, 15));

    ws.send(
      JSON.stringify({
        command: "subscribe",
        identifier: JSON.stringify({
          id: guid,
          channel: "MessageChannel",
        }),
      })
    );
  }

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.type === "ping") return;
    if (data.type ==="welcome") return;
    if (data.type === "confirm_subscription") return;

    const message = data.message;
    setMessagesAndScrolldown(...messages, message);
  }

  useEffect(() => {
    fetchMessages();
  }, [messages]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const body = event.target.message.value;
    event.target.message.value = "";
    await fetch("http://localhost:3000/messages", {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ body }),
    })
  }

  const fetchMessages = async () => {
    const response = await fetch("http://localhost:3000/messages");
    const data = await response.json();
    setMessagesAndScrolldown(data);
  }

  const setMessagesAndScrolldown = (data) => {
    console.log(data)
    setMessages(data);
    if (!messagesContainer) return;
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  return (
    <div className="App">
      <div className="messageHeader">
        <h1>Chatroom</h1>
        <p>Guid: { guid }</p>
      </div>
      <div className="messages" id="messages">
        {messages.map(message => (
          <div className="message" key={message.id}>
            <p>{message.body}</p>
          </div>
        ))}
      </div>
      <div className='messageForm'>
          <form onSubmit={handleSubmit}>
            <input className="messageInput" type="text" name="message" />
            <button className='messageButton' type="submit">
              Send
            </button>
          </form>
      </div>
    </div>
  )
}

export default App
