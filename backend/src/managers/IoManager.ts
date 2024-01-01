import { Server } from "socket.io";
import * as http from "http";
const server = http.createServer();
export class IoManager {
  private static io: Server;
  public static getInstance() {
    if (!this.io) {
      const io = new Server(server,{
        cors:{
          origin:"*",
          methods:["GET","POST"]
        }
      });
      this.io = io;
    }

    return this.io;
  }
}
