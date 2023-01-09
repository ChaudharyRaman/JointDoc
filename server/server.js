const {Server} = require('socket.io')
const mongoose = require('mongoose')
const Document = require('./Document')

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

const defaultValue = ""

io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('get-document', async (documentId) => {
        const document = await findOrCreateDocument(documentId)
        socket.join(documentId)

        socket.emit('load-document', document.data)

        socket.on('send-changes', (delta) => {
            socket.broadcast.to(documentId).emit('receive-changes', delta)
        })

        socket.on("save-document",async(data)=>{
            await Document.findByIdAndUpdate(documentId,{data})
        })
    })

})


async function findOrCreateDocument(id){
    if(id==null) return;

    const document = await Document.findById(id);
    if(!document){
        return await Document.create({_id:id, data:defaultValue})
    }else{
        return document;
    }
}

