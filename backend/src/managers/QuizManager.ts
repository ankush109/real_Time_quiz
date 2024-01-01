import { AllowedSubmissions, Quiz } from "../Quiz";
import { IoManager } from "./IoManager";

let globalProblemId = 0;
export class QuizManager {
  private quizes: Quiz[];
  constructor() {
    this.quizes = [];
  }
  public start(roomId: string) {
    const quiz = this.getQuiz(roomId);
    if (!quiz) return;
    quiz.start();
  }
  public next(roomId: string) {
    const quiz = this.getQuiz(roomId);
    if (!quiz) return;
    quiz.next();
  }
  public addProblem(
    roomId: string,
    problem: {
      title: string;
      desc: string;
      image?: string;
      option: {
        id: number;
        title: string;
      }[];
      answer: AllowedSubmissions;
    }
  ) {
    const quiz = this.getQuiz(roomId);
    if (!quiz) return;
    quiz.addProblem({
      ...problem,
      id: (globalProblemId++).toString(),
      startTime: new Date().getTime(),
      submissions: [],
    });
  }
  addUser(roomId: string, name: string) {
    return this.getQuiz(roomId)?.addUser(name);
  }
  getCurrentState(roomId: string) {
    const quiz = this.quizes.find((x) => x.roomId === roomId);
    if (!quiz) {
      return null;
    }
    return quiz.getCurrentState();
  }
  getQuiz(roomId: string) {
    return this.quizes.find(x => x.roomId === roomId) ?? null;
  }
  submit(
    userId: string,
    roomId: string,
    problemId: string,
    submission: 0 | 1 | 2 | 3
  ) {
    return this.getQuiz(roomId)?.submit(userId, roomId, problemId, submission);
  }
  addQuiz(roomId: string) {
    if (this.getQuiz(roomId)) {
      return;
    }
    const quiz = new Quiz(roomId);
    this.quizes.push(quiz);
  }
}
