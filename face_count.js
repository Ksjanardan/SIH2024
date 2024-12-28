const express = require("express");
const connectDB = require("./index");
const router = express.Router();

router.get("/face-count", async (req, res) => {
  const AICTE_CODE = req.query.AICTE_CODE; 
  const classStrength = parseInt(req.query.classStrength) || 30;

  try {
    const db = await connectDB();
    const data = await db.collection("InfraData").findOne({
      AICTE_CODE:AICTE_CODE,
    });
    console.log(data);
    if (!data || !data.headcount) {
      return res.status(404).json({ error: "No data found for given AICTE_CODE" });
    }

    const results = data.headcount.map((entry) => {
      let score = (entry.face_count / classStrength) * 100;
      if (entry.face_count > classStrength) {
        score = 10; 
      }
      return { timestamp: entry.timestamp, faceCount: entry.face_count, score };
    });

    
    const averageScore = results.reduce((acc, cur) => acc + cur.score, 0) / results.length;

    
    const weightedFaceCountScore = (0.15 * averageScore).toFixed(2);

    res.json({ AICTE_CODE, averageScore: weightedFaceCountScore });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
