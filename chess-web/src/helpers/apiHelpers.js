import { io } from "socket.io-client";

export const url = "https://chess-game-1cwu.onrender.com";
export const socket = io.connect(url);