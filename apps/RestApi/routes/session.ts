import {WebSocketController} from "@/apps/RestApi/uniMatch/websocket/WebSocketsController";
import {Router} from "express";
import {dependencies} from "@/apps/RestApi/Dependencies";

const router = Router();

WebSocketController.start(
    8080,
    8081,
    dependencies.sessionStatusRepository,
    dependencies.wsClientHandler
);

export {router};