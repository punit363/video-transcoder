import express from "express";
import cors from "cors";


const app = express();

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use("uploads",express.static("uploads"))

app.listen(8000,()=>{
    console.log("App listening on port 8000...")
})