var socket=io()
var name1;
var our_user_id;
var arr=[],counter = -1;
var m = true;
const peers={}
var mic_on=true,video_on=true,chat_on=true,myStream;
do{
    name1 = prompt("Enter ur name")
}while(!name1);
const video_grid=document.querySelector(".video_grid");
    //const peer=new Peer(undefined,{host:"/",port:3001})
    const peer = new Peer(undefined,{host:'peerjs-server.herokuapp.com', secure:true, port:443})
    peer.on("open",(id)=>
    {
        our_user_id=id;
        socket.emit("join-room",room_id1,id)
        socket.on("user-connected",(user_id)=>
        {
            console.log("User connected","USer:",user_id)
        })
    })
    const myVideo=document.createElement("video")
    myVideo.muted=true;
    navigator.mediaDevices.getUserMedia(
        {
        video:true,audio:true
    }).then(stream=>
        {
        myStream=stream
        addVideo(myVideo,stream,"mine")
        peer.on('call',call=>
        {
            console.log(call)
            console.log("Hello video_eleo")
            call.answer(stream);
            const video_ele=document.createElement("video");
            call.on("stream",userStream=>
            {
                if(m){
                    counter++
                    m = false
                }
                else{
                    m = true
                }
                addVideo(video_ele,userStream,arr[counter])
            })
        })  
        socket.on("user-connected",(u,roomID1)=>
        {
            if(roomID1==room_id1)
            {
                console.log("User connected")
                setTimeout(connectToNewUser,500,u,stream)
            }
        })
socket.on("user-disconnected",(u,roomId1)=>
    {
        if(roomId1==room_id1)
        {
        var ele=document.getElementById("u");
        if(ele)
        {
            ele.remove();
        }
        if(peers[u])
        {
            peers[u].close();
        }
    }
    })
function connectToNewUser(u,stream)
{   
    setTimeout(function(){callToNewUser(u,stream)},1000)
}
function callToNewUser(u,stream){
    console.log("In call",u)
    const call2 = peer.call(u,stream)
    const video_ele = document.createElement('video')
    call2.on("stream",userVideoStream=>
    {
        addVideo(video_ele,userVideoStream,u)
    })
    call2.on("close",()=>
    {
        video_ele.remove();
    })
    peers[u]=call2;
}
function addVideo(video,stream,u)
{
    video.srcObject=stream;
    console.log("Useradd",u)
    video.setAttribute('id',u)
    video.addEventListener("loadedmetadata",()=>
    {
        video.play()
    })
    video_grid.append(video)
}
})
var text_area=document.querySelector("#textarea");
const message_area=document.querySelector(".msg_area");
const send_button=document.querySelector("#send_button");
const cls_button=document.querySelector("#btn_close");
const message_part=document.querySelector(".message_part");
const video_part=document.querySelector(".video_part");
const text_box=document.querySelector(".text_box");
const open_button=document.querySelector("#btn_open");
const msg_area=document.querySelector(".msg_area");
const sideBar = document.getElementById("side-bar");
const mic=document.querySelector("#mic")
const video_lol=document.querySelector("#video")
const check_messages=document.querySelector("#check_message")
function closeSidebar(){
    sideBar.setAttribute("data-state","close");
}
function openSidebar(){
    sideBar.setAttribute("data-state","open");
}
send_button.addEventListener("click",()=>
{   
    var k=text_area.value
    let cleanText = k.replace(/<\/?[^>]+(>|$)/g, "");
    text_area.value=""
    printMessage(cleanText)
})
text_area.addEventListener("keyup",(e)=>
{
    if(e.key=="Enter")
    {
        var k=text_area.value
        let cleanText = k.replace(/<\/?[^>]+(>|$)/g, "");
        text_area.value=""
        printMessage(cleanText) 
    } 
})
check_messages.addEventListener("click",()=>
{   
    if(message_part.style.display=="none")
    {
    message_part.style.display="block";
    video_part.style.width="61%";
    message_part.style.width="39%";
    video_grid.style.gridTemplateColumns="repeat(2,48%)";
    }
    else
    {
        message_part.style.display="none";  
        video_part.style.width="100%";
        video_grid.style.gridTemplateColumns="repeat(3,30%)";
    }
})
var printMessage = (msg) =>{
    let text = {
        user : name1,
        message : msg.trim()
    }

    if (text.message.length > 0){
        //append
        append_msg(text,"outgoing")
        //scroll down to current msg
        msg_area.scrollTop = msg_area.scrollHeight;
        //send to server
        socket.emit('message',text);
    }
}
var append_msg = (msg,className) =>{
    let mainDiv = document.createElement('div')
    mainDiv.classList.add(className)
    let markup;
                markup = `<h3>${msg.user}</h3>
                <p >${msg.message}</p>`
      
    mainDiv.innerHTML = markup
    msg_area.appendChild(mainDiv)   
}
function mute_off()
{
    switch(mic_on) 
    {
        case true:
             {
                 mic.innerText="mic_off"
                 mic.style.background="red";
                 mic.style.color="white";
                 mic_on=false;
                 break;
             }
        case false:
            {
                mic.innerText="mic"
                mic.style.background="white";
                mic.style.color="black";
                mic_on=true;
                break;
            }
            default:
                {}
                ; 
    }
    myStream.getAudioTracks()[0].enabled = !(myStream.getAudioTracks()[0].enabled)    
}
function video_off()
{
   switch(video_on)
   {
       case true:
           {
               video_lol.innerText="videocam_off";
              video_lol.style.background="red";
              video_lol.style.color="white";
               video_on=false;
               break;
           }
        case false:
            {
               video_lol.innerText="videocam";
               video_lol.style.background="white";
              video_lol.style.color="black";
               video_on=true;
               break;
            }
        default:
            {}
   }
    myStream.getVideoTracks()[0].enabled = !(myStream.getVideoTracks()[0].enabled);
}
socket.on("message",(msg,roomID1)=>
{
    if(roomID1==room_id1)
    {
    append_msg (msg,"incoming");
    }
})