import { IoManager } from "./managers/IoManager";
export type AllowedSubmissions = 0 | 1 | 2 | 3;
const PROBLEM_TIME_S = 1000

interface Submission {
  problemId: string;
  userId: string;
  isCorrect: boolean;
  optionSelected: AllowedSubmissions;
}
interface Problem {
  id: string;
  title: string;
  startTime: number;
  desc: string;
  image?: string;
  answer: AllowedSubmissions;
  option: {
    id: number;
    title: string;
  }[];
  submissions: Submission[];
}
interface User {
  id: string;
  name: string;
  points: number;
}
export class Quiz {
  public roomId: string;
  private hasStarted: boolean;
  private problems: Problem[];
  private activeProblems: number;
  public users: User[];
  private currentState: "leaderboard" | "question" | "not_started" | "ended";
  constructor(roomId: string) {
    this.roomId = roomId;
    this.hasStarted = false;
    this.problems = [];
    this.currentState = "not_started";
    this.activeProblems = 0;
    this.users = [];
    console.log("room created")
    setInterval(()=>{
      this.debug()
    },10000)
  }
  addProblem(problem: Problem) {
    this.problems.push(problem);
    console.log(this.problems,"problems");
  }
debug(){
  console.log("---debug--")
  console.log(this.roomId)
  console.log(JSON.stringify(this.problems))
  console.log(this.users)
  console.log(this.currentState)
  console.log(this.activeProblems,"problem count")
}
start() {
    this.hasStarted = true;
    this.setActiveProblem(this.problems[0]);
  }
  genRandonstring(length: number) {
    var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()";
    var charLength = chars.length;
    var result = "";
    for (var i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * charLength));
    }
    return result;
  }
  addUser(name: string) {
    const id = this.genRandonstring(7);
   
    this.users.push({
      id,
      name,
      points: 0,
    });
   
    return id;
  }
getAllUsers(){
  console.log(this.users,"users")
  return this.users;
}
  next() {
    this.activeProblems++;
    const problem = this.problems[this.activeProblems];
    console.log(problem,"i am problem")
    if (problem) {
      this.setActiveProblem(problem);
    } else {
      this.activeProblems--;
    }
  }
  setActiveProblem(problem: Problem) {
    console.log("set active problem")
    this.currentState="question"
    problem.startTime = new Date().getTime();
    problem.submissions = [];
    IoManager.getInstance().to(this.roomId).emit("problem", {
      problem,
    });
    setTimeout(() => {
      this.sendLeaderBoard();
    },PROBLEM_TIME_S*1000);
  }
  submit(
    userId: string,
    roomId: string,
    problemId: string,
    submission: 0 | 1 | 2 | 3
  ) {
    console.log("userId");
    console.log(userId);
    const problem = this.problems.find((x) => x.id === problemId);
    const user = this.users.find((x) => x.id === userId);
    if (!problem || !user) {
      console.log("problem or user not found")
      return;
    }

    const existingsubmission = problem.submissions.find(
      (x) => x.userId === userId
    );
    if (existingsubmission){
      console.log("existn submissions")
    }
    problem.submissions.push({
      problemId,
      userId,
      isCorrect: problem.answer === submission,
      optionSelected: submission,
    });
    user.points += (1000 - (500 * (new Date().getTime() - problem.startTime) / (PROBLEM_TIME_S * 1000)));
  }

  sendLeaderBoard() {
    console.log("send leaderboard")
    this.currentState="leaderboard"
    const leaderBoard = this.getLeaderBoard();
    IoManager.getInstance().to(this.roomId).emit("leaderboard", {
      leaderBoard,
    });
    console.log(leaderBoard,"leaderboard")
  }
  getCurrentState() {
    if (this.currentState === "not_started") {
      return {
        type: "not_started",
      };
    }
    if (this.currentState === "ended") {
      return {
        type: "ended",
        leaderboard: this.getLeaderBoard(),
      };
    }
    if (this.currentState === "leaderboard") {
      return {
        type: "leaderboard",
        leaderboard: this.getLeaderBoard(),
      };
    }
    if (this.currentState === "question") {
      const problem = this.problems[this.activeProblems];
      return {
        type: "question",
        problem,
      };
    }
   
  }
  getLeaderBoard() {
    return this.users.sort((a, b) => a.points < b.points ? 1 : -1).slice(0, 20);
  }
}
