import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import CreateProblem from "./CreateProblem";

function Admin() {
  const [roomId, setRoomId] = useState("");
  const [socket, setSocket] = useState(null);
  const [quizid, setQuizId] = useState("");

  useEffect(() => {
    const socket = io("http://localhost:3000");
    setSocket(socket);

    socket.on("connect", () => {
      console.log(socket.id);
      socket.emit("join_admin", {
        password: "ankush",
      });
    });
  }, []);

  if (!quizid) {
    return (
      <div className="max-w-md mx-auto p-4">
        <input
          type="text"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          className="border rounded px-2 py-1 w-full mb-2"
          placeholder="Enter Room ID"
        />
        <button
          onClick={() => {
            socket.emit("createQuiz", {
              roomId,
            });
            setQuizId(roomId);
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Create Room
        </button>
      </div>
    );
  }

  return <CreateProblem socket={socket} roomId={roomId} />;
}

export default Admin;
