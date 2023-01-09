import React from 'react'

import Quill from 'quill'
import 'quill/dist/quill.snow.css'
import { useEffect } from 'react'
import { useRef } from 'react'
import { useCallback } from 'react'
import './EditorStyles.css'

import {io} from 'socket.io-client'
import { useState } from 'react'
import { useParams } from 'react-router-dom'

const SAVE_INTERVAL_MS = 2000;
const ENDPOINT = 'http://localhost:5000'
const TOOLBAR_OPTIONS = [
    ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
    ['blockquote', 'code-block'],
  
    [{ 'header': 1 }, { 'header': 2 }],               // custom button values
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
    [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
    [{ 'direction': 'rtl' }],                         // text direction
  
    [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
  
    [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
    [{ 'font': [] }],
    [{ 'align': [] }],
  
    ['clean']                                         // remove formatting button
  ];
  

const Editor = () => {

    // const wrapperRef = useRef();
    const [socket,setSocket] = useState()
    const [quill,setQuill] = useState()

    const {id: documentId} = useParams();

    useEffect(()=>{
        const s = io(ENDPOINT)
        console.log(s);
        setSocket(s)
        s.on('connect', ()=>{
            console.log(s.id)
        })
        return ()=>{
            s.disconnect()
        }
    },[])

    useEffect(()=>{
        if(socket == null || quill == null)return;

        socket.once('load-document',document=>{
            quill.setContents(document)
            quill.enable()
        })

        socket.emit('get-document',documentId);

    },[socket,quill,documentId])

    useEffect(()=>{
        console.log('HII');
        if(socket == null || quill ==null) return;

        const interval = setInterval(()=>{
            socket.emit('save-document',quill.getContents())
        },SAVE_INTERVAL_MS)

        return()=>{
            clearInterval(interval);
        }

    },[socket,quill])

    useEffect(()=>{

        if(socket == null || quill == null ) return

        const handler = (delta)=>{
            quill.updateContents(delta)
        }

        socket.on('receive-changes',handler)

        return ()=>{
            socket.off("receive-changes",handler)
        }
    },[socket,quill])
    
    
    useEffect(()=>{

        if(socket == null || quill == null ) return

        const handler = (delta,oldDelta,source)=>{
            if(source !== 'user') return
            socket.emit("send-changes",delta)
        }

        quill.on('text-change',handler)

        return ()=>{
            quill.off("text-change",handler)
        }
    },[socket,quill])


    const wrapperRef = useCallback((wrapper) => {
        if (wrapper == null) return;
        wrapper.innerHTML ='';
        const editor = document.createElement('div')
        wrapper.append(editor)
        const q = new Quill(editor, {
            theme: 'snow',
            modules: { toolbar: TOOLBAR_OPTIONS }
        })
        q.disable()
        q.setText('Loading...')
        setQuill(q)

    }, [])
    return (
        <div className='container' ref={wrapperRef}>
        </div>
    )
}

export default Editor
