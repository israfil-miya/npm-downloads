import express from "express";
import { downloadCountsHandler } from "./routes/downloadCounts";

const app = express();
const port = process.env.PORT || 3000;

app.get("/api/download-counts", downloadCountsHandler);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
