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

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    const response = await fetch("http://localhost:3000");
    const data = await response.json();
    console.log(data)
    setMessagesAndScrolldown(data);
  }

  const setMessagesAndScrolldown = (data) => {
    setMessages(data);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  return (
    <div className="App">
      <div className="messageHeader">
        <h1>Message</h1>
        <p>Guid: { guid }</p>
      </div>
      <div className="messages" id="messages">
        {messages.map(message => {
          <div className="message" key={ message.id }>
            <div>{ message.body }</div>
          </div>
        })}
      </div>
    </div>
  )
}

export default App
