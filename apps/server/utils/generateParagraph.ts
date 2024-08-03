const string = `import { createServer } from "http";
import { Server } from "socket.io";
import { setupListeners } from "./setupListeners";

const PORT = process.env.PORT || 8000;
const httpServer = createServer();

const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

setupListeners(io);

httpServer.listen(PORT, () => {
  console.log(\`Server is running on port \${PORT}\`);
});`;

export function generateLocalParagraph() {
  return string;
}

export async function generateParagraph() {
  try {
    const response = await fetch("http://metaphorpsum.com/paragraphs/3/4");
    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }
    const data = response.text();
    return data;
  } catch (error) {
    console.log(error);
    return generateLocalParagraph();
  }
}
