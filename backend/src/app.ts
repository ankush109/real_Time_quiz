const express =require("express")
import { Server } from "http"; // Import Server from http module
import { IoManager } from "./managers/IoManager";
import { UserManager } from "./managers/UserManager";
import helmet from "helmet";
import morgan = require("morgan");
import serveFavicon = require("serve-favicon");
import path = require("path");
import rateLimit from "express-rate-limit";
import createHttpError = require("http-errors");
const io = IoManager.getInstance();
const app = express();

const server: Server = app.listen(3000); // Use express app to create server
app.use(helmet());
app.set("trust proxy", 1);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan("dev"));
app.use(serveFavicon(path.join(__dirname, "public", "favicon.ico")));

const userManager = new UserManager();

io.attach(server);

io.on("connection", (socket) => {
  userManager.addUser(socket);
});
app.all("/", (req:any, res:any, next:any) => {
  console.log("Server is running on port 3000")
  res.send({ message: "API is Up and Running on render 😎🚀" });
});