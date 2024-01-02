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
      <div>
        <div className="bg-gray-100 flex flex-col border-black items-center justify-center h-screen">
        <div className="mb-8">
              <h1 className="text-2xl font-semibold mb-2 text-slate-600">
               Welcome Admin
              </h1>
              <p className="text-gray-600">
               Create your Quiz Room 
              </p>
            </div>
        <input
          type="text"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          className="text-center w-64 p-2 border-2 border-blue-600 rounded-lg shadow-sm focus:outline-none focus:border-blue-800 mb-3"
          placeholder="Enter Room ID"
        />
        <button
          onClick={() => {
            socket.emit("createQuiz", {
              roomId,
            });
            setQuizId(roomId);
          }}
          className="bg-blue-600 text-white w-64 py-2 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-800 focus:ring-opacity-50"
        >
          Create Room
        </button>
      </div>
      </div>
    );
  }

  return <CreateProblem socket={socket} roomId={roomId} />;
}

export default Admin;
