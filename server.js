const express = require('express');
const path = require('path');
const app = express();
const port=process.env.PORT ||3000;
const uuid=require('uuid');
var room_id="";
const server= require("http").Server(app)
const socket2=require("socket.io")(server)
app.enable('trust proxy')
app.use(express.static(path.join(__dirname,"views")))
app.set("view engine", "ejs")
app.get("/",(req,res)=>{
    
    res.redirect(`/${uuid.v4()}`);
})
app.get("/:room",(req,res)=>{
     room_id=req.params.room;
    console.log(room_id)
    res.render("app",{room_id:req.params.room});
})
socket2.on("connection",(socket)=>
{
    console.log("connected.........")
    socket.on("join-room",(roomId,user_id)=>
    {
        socket.room_id_store=roomId;
        socket.user_id_store=user_id;
        socket.broadcast.emit("user-connected",user_id,socket.room_id_store);
        socket.on("disconnect",()=>
        {
            socket.broadcast.emit("user-disconnected",socket.user_id_store,socket.room_id_store)
        })
    })
    socket.on("message",(msg)=>
    {
        socket.broadcast.emit("message",msg,socket.room_id_store);
    })
})
server.listen(port,"localhost",()=>
{
    console.log("Listening from port :",port);
});