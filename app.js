import express from "express";
import postRoute from "./routes/post.route.js"

const app = express()

app.use("/api/posts", postRoute)


app.listen(4000, ()=>{
    console.log("server is running")
})