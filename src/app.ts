import express from "express"

const app = express();

app.get("/", (req, res) => {
    res.send("Where Every Word Matters. - Okshor")
})



export default app;