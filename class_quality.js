const express = require("express");
const connectDB = require("./index");
const router = express.Router();

router.get("/speech-brightness", async (req, res) => {
  const AICTE_CODE = req.query.AICTE_CODE; 

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
      const wordCount = entry.speechtext.split(" ").length;
      const brightnessScore = entry.brightness === "Dim" ? 0 : 10;
      const speechScore = wordCount > 5 ? 10 : (wordCount / 5) * 100; 
      const overallScore = 0.35 * ((brightnessScore + speechScore) / 2);

      return {
        timestamp: entry.timestamp,
        brightness: entry.brightness,
        speechText: entry.speechtext,
        brightnessScore,
        speechScore,
        overallScore,
      };
    });

   
    const averageOverallScore = results.reduce((acc, cur) => acc + cur.overallScore, 0) / results.length;

    
    const weightedOverallScore = (0.35 * averageOverallScore).toFixed(2);

    res.json({ AICTE_CODE, averageScore: weightedOverallScore });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
