const express = require("express");
const cors = require("cors"); // Import cors
const faceCountRouter = require("./face_count");
const speechBrightnessRouter = require("./class_quality");

const app = express();
const PORT = 3000;

// Enable CORS
app.use(cors());

app.use(express.json());
app.use("/api", faceCountRouter);
app.use("/api", speechBrightnessRouter);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
