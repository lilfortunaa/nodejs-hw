import express from 'express';
import cors from 'cors';
import  'dotenv/config';

import { connectMongoDB } from './db/connectMongoDB.js';
import {logger} from './middleware/logger.js';
import {notFoundHandler} from './middleware/notFoundHandler.js';
import {errorHandler} from './middleware/errorHandler.js';
import notesRoutes from "./routes/notesRoutes.js";

const app = express();
const PORT = process.env.PORT || 3030;

app.use(cors());
app.use(express.json());
app.use(logger);

app.use("/notes", notesRoutes);
app.get("/test-error", (req, res) => {
  throw new Error("Simulated server error");
});

app.use(notFoundHandler);
app.use(errorHandler);


await connectMongoDB();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
