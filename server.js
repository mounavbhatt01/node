const e = require('express')
const express = require('express')
const res = require('express/lib/response')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const {v4: uuidV4} = require('uuid')
let ch=1
//const jsdom = require("jsdom"); 
//const { JSDOM } = jsdom; 
//const dom = new JSDOM(``,{url :__dirname+"/starting.html"});

app.set('view engine', 'ejs')
app.use(express.static('public'))

app.get('/',(req,res)=>{
    //res.sendFile(__dirname + '/views/starting.html');
    //res.setHeader("Content-Type", "text/html")
     res.render('starting')
   // res.redirect('/starting.html');
})

app.get('/submit', (req, res) => {
    var rooms = req.body.roomId;
    if (rooms != "") {
        res.redirect(`/${rooms}`)

    }
    else{
        res.redirect(`/${uuidV4()}`)
       // res.redirect('/starting.html');
    }
})

app.get('/:room', (req, res) => {
    res.render('room', {roomId: req.params.room})
})

io.on('connection', socket => {
    socket.on('join-room', (roomId, userId) => {
        socket.join(roomId)
        socket.broadcast.emit('user-connected', userId)

        socket.on('disconnect', () => {
            socket.broadcast.emit('user-disconnected', userId)
        })
    })
})

server.listen(3000)