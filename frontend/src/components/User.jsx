import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { CurrentQuestion } from "./CurrentQuestion";
import { LeaderBoard } from "./LeaderBoard";
// import { Quiz } from "./Quiz";
import {Quizop} from "./Quizop"
import Alluser from "./Alluser";
import { toast } from "react-hot-toast";
import ChatRoom from "./ChatRoom";
export const User = () => {
  const [name, setName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [code, setCode] = useState("");
  if (!submitted) {
    return (
      <div>
        <div className="bg-gray-100 flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="mb-8">
              <h1 className="text-2xl font-semibold mb-2 text-slate-600">
                Enter the code to join
              </h1>
              <p className="text-gray-600">
                It’s on the screen in front of you
              </p>
            </div>
            <div className="mb-8">
              <input
                className="text-center w-64 p-2 border-2 border-purple-600 rounded-lg shadow-sm focus:outline-none focus:border-purple-800"
                placeholder="1234 5678"
                style={{ fontSize: "1rem" }}
                type="text"
                onChange={(e) => {
                  setCode(e.target.value);
                }}
              />
              <br /> <br />
              <input
                className="text-center w-64 p-2 border-2 border-purple-600 rounded-lg shadow-sm focus:outline-none focus:border-purple-800"
                placeholder="Your name"
                style={{ fontSize: "1rem" }}
                type="text"
                onChange={(e) => {
                  setName(e.target.value);
                }}
              />
            </div>
            <button
              className="bg-purple-600 text-white w-64 py-2 rounded-lg shadow-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-800 focus:ring-opacity-50"
              style={{ fontSize: "1rem" }}
              onClick={() => {
                setSubmitted(true);
              }}
            >
              Join
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <UserLoggedin code={code} name={name} />;
};

export const UserLoggedin = ({ name, code }) => {
  const [socket, setSocket] = useState(null);
  const roomId = code;
  const [currentState, setCurrentState] = useState("not_started");
  const [availableUsers,setAvailableUsers]=useState([])
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [userId, setUserId] = useState("");

  useEffect(() => {
    const socket = io("http://localhost:3000");
    setSocket(socket);
    socket.on("connect", () => {
      console.log(socket.id);
      socket.emit("join", {
        roomId,
        name,
      });
    });
    socket.on("userJoined", (data) => {
      toast.success(`${data.name} has joined the room `)
      setAvailableUsers(data.users)
      console.log("User joined: " + data.name);
      data.users.map((x)=>{
        console.log(x.name)
      })
    });
    
    socket.on("getallusers", (data) => {
      console.log("total users in the rooom " + data.users);
    });
    socket.on("init", ({ userId, state }) => {
      setUserId(userId);
      if (state.leaderboard) {
        console.log("leaderboarding setted");
        console.log(state.leaderboard);
        setLeaderboard(state.leaderboard);
        console.log("leaderboarding setted");
      }

      if (state.problem) {
        console.log("problem setted");
        setCurrentQuestion(state.problem);
      }

      setCurrentState(state.type);
    });

    socket.on("leaderboard", (data) => {
      console.log("fetchign leaderboard");
      setCurrentState("leaderboard");
      setLeaderboard(data.leaderboard);
    });
    socket.on("problem", (data) => {
      console.log("fetching next problem");
      setCurrentState("question");
      setCurrentQuestion(data.problem);
    });
  }, [currentState]);

  if (currentState === "not_started") {
    return (
    <div className="flex">
      <div className="w-full"> 
      <div className="text-center bg-gray-400 text-black-600 font-bold p-4 text-2xl">Quiz has not began Yet</div>
        {socket && roomId && <ChatRoom socket={socket} name={name} roomId={roomId} />}

      </div>
    
      
      </div>
    )
  }
  if (currentState === "question") {
    console.log(currentQuestion, "curr");
    return (
     <Quizop     roomId={roomId}
     userId={userId}
     problemId={currentQuestion.id}
     quizData={{
       title: currentQuestion.description,
       options: currentQuestion.options,
     }}
     socket={socket}/>
    );
  }    


  if (currentState === "leaderboard") {
    return (
      <div style={{ display: 'flex' }}>
        <ChatRoom socket={socket}name={name} roomId={roomId}/>
        {/* <div style={{ flex: 1, marginRight: '10px' }}>
          <Alluser users={availableUsers} />
        </div> */}
        <div style={{ flex: 4 }}>
          <LeaderBoard
            leaderboardData={leaderboard?.map((x) => ({
              points: x.points,
              name: x.name,
              image: x.image,
            }))}
          />
        </div>
      </div>
    );
  }
  

  return (
    <div>
      <br />
      Quiz has ended
      {currentState}
    </div>
  );
};
