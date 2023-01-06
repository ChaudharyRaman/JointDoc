import {Server} from 'socket.io'

const PORT = process.env.PORT||5000;
const io = new Server(PORT,{
    cors:{
        origin:'http://localhost:3000',
        methods:['GET','POST']
    }
})

io.on('connection',(socket)=>{
    console.log('New client connected');

    socket.on('send-changes',(delta)=>{
        socket.broadcast.emit('receive-changes',delta)
    })
})

