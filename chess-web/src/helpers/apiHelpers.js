import { io } from "socket.io-client";

export const url = "https://chess-game-api.onrender.com";
export const socket = io.connect(url);