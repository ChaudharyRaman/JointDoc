import { Server } from 'socket.io'
import mongoose from 'mongoose';
import {Document} from './Document.js'

mongoose.set('strictQuery', false),
mongoose.connect("mongodb://localhost:27017/google-docs-clone",{
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log("Connected to MongoDB")).catch((err) => console.log(err.message));

const PORT = process.env.PORT || 5000;
const io = new Server(PORT, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST']
    }
})

io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('get-document', documentId => {
        const data = ""
        socket.join(documentId)

        socket.emit('load-document', data)

        socket.on('send-changes', (delta) => {
            socket.broadcast.to(documentId).emit('receive-changes', delta)
        })
    })

})

async function findOrCreateDocument(id){
    if(id==null) return;

    const document = await Document.findById(id);
    if(document){
        return await Document.create()
    }
}
