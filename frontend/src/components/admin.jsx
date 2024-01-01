import { useEffect, useState } from "react"
import { io } from "socket.io-client"
import CreateProblem from "./CreateProblem"


function Admin() {
  const [roomId,setRoomId]=useState("")
  const [socket,setSocket]=useState(null)
  const [quizid,setQuixid]=useState("")
  useEffect(()=>{
    const socket=io("http://localhost:3000")
    setSocket(socket)
    socket.on("connect",()=>{
        console.log(socket.id)
        socket.emit("join_admin",{
          password:"ankush"
        })
      
    })
    socket.on("")
  },[])
  if(!quizid){

  return (
    <div>
     <input type="text" value={roomId} onChange={(e)=>setRoomId(e.target.value)} />
     <button onClick={()=>{
    socket.emit("createQuiz",{
      roomId
    })
    setQuixid(roomId)
     }}>
      create room
     </button>
    </div>
  )
} 
return <CreateProblem socket={socket} roomId={roomId}/>
}

export default Admin