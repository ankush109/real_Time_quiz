import { Socket } from "socket.io";
import { QuizManager } from "./QuizManager";
import { IoManager } from "./IoManager";
const ADMIN_PASSWORD = "ankush";
export class UserManager {
  private quizManager;
  constructor() {
    this.quizManager = new QuizManager();
  }
  addUser(socket: Socket) {
    this.createHandler(socket);
  }
  private createHandler(socket: Socket) {
    // establishes a socket connection betweeen the client and the server
    // for the user
    socket.on("join", (data) => {
      const userId = this.quizManager.addUser(data.roomId, data.name);
      console.log(data.name+" has joined the room");

      // Broadcast the user's name to all users in the room
      const allUsers = this.quizManager.getAllUsers(data.roomId);
      console.log(allUsers,"all the users in the room")
    IoManager.getInstance().to(data.roomId).emit("userJoined", {
      name: data.name,
      users: allUsers, 
    });
  
      socket.emit("init", {
        userId,
        state: this.quizManager.getCurrentState(data.roomId),
      });
      socket.join(data.roomId);
    });
    // for the admin controls
    socket.on("join_admin", (data) => {
      console.log("join admin called")
      if (data.password !== ADMIN_PASSWORD) {
        return;
      }
      socket.on("createQuiz", (data) => {
        console.log("creating quiz")
        this.quizManager.addQuiz(data.roomId);
      });
      socket.on("createproblem", (data) => {
        this.quizManager.addProblem(data.roomId, data.problem);
      });
      socket.on("next", (data) => {
        this.quizManager.next(data.roomId);
      });
    });
    socket.on("submit", (data) => {
      const userId = data.userId;
      const problemId = data.problemId;
      const submission = data.submission;
      const roomId = data.roomId;
      if (
        submission != 0 &&
        submission != 1 &&
        submission != 2 &&
        submission != 3
      ) {
        console.error("issue while getting input " + submission);
        return;
      }
      console.log("sub,itting")
      console.log(roomId);
      this.quizManager.submit(userId, roomId, problemId, submission);
    });
  }
}
