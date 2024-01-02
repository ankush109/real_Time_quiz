const express =require("express")
import { Server } from "http"; 
import { IoManager } from "./managers/IoManager";
import { UserManager } from "./managers/UserManager";
const io = IoManager.getInstance();
const app = express();

const server: Server = app.listen(3000); // Use express app to create server

const userManager = new UserManager();

io.attach(server);

io.on("connection", (socket) => {
  userManager.addUser(socket);
   socket.on("send-message",(mess,name)=>{
    IoManager.getInstance().emit("receive-message",{mess,name})
    console.log(mess)
   })
});
