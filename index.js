import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import stringSimilarity from "string-similarity";

const app = express();
const port = 3000;

const url = "https://riddles-api.vercel.app/random";

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

let currentRiddle = '';
let currentAnswer = '';

app.get("/", async (req, res) => {
    try {
        const response = await axios.get("https://riddles-api.vercel.app/random");
        currentRiddle = response.data.riddle;
        currentAnswer = response.data.answer.toLowerCase();

        res.render("index.ejs", { riddle: currentRiddle, result: "" });
    } catch (error) {
        console.error('Error fetching riddle:', error);
        res.render("index.ejs", {riddle: "Failed to load riddle. Please try again.", result: "" })
    }
});
    
app.post("/check-answer",async (req, res) => {
    const userAnswer = req.body.answer.trim().toLowerCase();
    const similarity = stringSimilarity.compareTwoStrings(userAnswer, currentAnswer);
    const result = similarity >= 0.8 ? "Correct!" : "Wrong!";
    res.render("index.ejs", { riddle: currentRiddle, result, currentAnswer });
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})