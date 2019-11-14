
import http from "http";
import express from "express";
import { applyMiddleware } from "./utils";
import middleware from "./middleware";
import errorHandlers from "./middleware/errorHandlers";
import userRouter from "./services/user/routes";
import mongoose from "mongoose";
import { mongoDbUrl } from './config/db';

process.on("uncaughtException", e => {
  console.log(e);
  process.exit(1);
});

process.on("unhandledRejection", e => {
  console.log(e);
  process.exit(1);
});

mongoose.connect(mongoDbUrl, {
  useNewUrlParser: true,
  useCreateIndex: true,
});

const router = express();
applyMiddleware(middleware, router);
router.use(userRouter);
applyMiddleware(errorHandlers, router);

const PORT = process.env.PORT;
const server = http.createServer(router);

server.listen(PORT, () =>
  console.log(`Server is running http://localhost:${PORT}...`)
);