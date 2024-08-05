import { createServer } from "http";
import { Server } from "socket.io";
import { setupListeners } from "./setupListeners";

const PORT = process.env.PORT || 8000;
const httpServer = createServer((req, res) => {
  if (req.method === 'GET' && req.url === '/') {
    res.end('Server is running, keySprint is a multiplayer online browser-based typing game. allows people to race each-other by typing.');
  }
});

const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

setupListeners(io);

httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
