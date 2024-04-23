import React, { useState, useRef, useEffect } from 'react'
import logo from '../../img/logo.png'
import Clients from '../../Components/Clients';
import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom';
import { initSocket } from '../../socket';
import ACTIONS from '../../Actions';
import InputPart from './InputPart';
import toast from 'react-hot-toast';
import OutputPart from './OutputPart';

const LogoPart = () => {
    
    const socketRef = useRef(null);
    const htmlcodeRef = useRef(null);
    const csscodeRef = useRef(null);
    const jscodeRef = useRef(null);
    const location = useLocation();
    const reactNavigator = useNavigate();
    const {roomId} = useParams();

    const [clients, setClients] = useState([]);
    const [html, setHtml] = useState('');          //-----
    const [css, setCss] = useState('');            //-----
    const [js, setJs] = useState('');       //-----

    useEffect(()=>{
        const init = async ()=>{
            socketRef.current = await initSocket();
            socketRef.current.on('connect_error', (err) => handleErrors(err));
            socketRef.current.on('connect_failed', (err) => handleErrors(err));

            function handleErrors(e) {
                 console.log('socket error', e);
                 toast.error('Socket connection failed, try again later.');
                reactNavigator('/');
            }

            socketRef.current.emit(ACTIONS.JOIN, {
                roomId,
                username: location.state?.username,
            });

            // listening for joined event
            socketRef.current.on(
                ACTIONS.JOINED,
                ({ clients, username, socketId }) => {
                    if (username !== location.state?.username) {
                       toast.success(`${username} joined the room.`);
                    }
                    setClients(clients);
                    socketRef.current.emit(ACTIONS.HTML_SYNC_CODE, {
                         html_code: htmlcodeRef.current, 
                        socketId,
                    });
                    socketRef.current.emit(ACTIONS.CSS_SYNC_CODE, {
                        css_code: csscodeRef.current,
                        socketId,
                    });
                    socketRef.current.emit(ACTIONS.JS_SYNC_CODE, {
                        js_code: jscodeRef.current,
                        socketId,
                    });
                }
            );

          // Listening for disconnected
          socketRef.current.on(
            ACTIONS.DISCONNECTED,
            ({ socketId, username }) => {
                toast.success(`${username} left the room.`);
                setClients((prev) => {
                    return prev.filter(
                        (client) => client.socketId !== socketId
                    );
                });
              }
            );

        }

        init();
         // we have to write an cleanup function  so that when our component unmounts it will remove all listeners from the socket server
         return () => {
            socketRef.current.disconnect();  // disconnect the socket
            socketRef.current.off(ACTIONS.JOINED);
            socketRef.current.off(ACTIONS.DISCONNECTED);
        };
    },[])

     if(!location.state){
        return <Navigate to="/" />
     }

     async function copyRoomId() {
        try {
            await navigator.clipboard.writeText(roomId);
            toast.success('Room ID has been copied to your clipboard');
        } catch (err) {
            toast.error('Could not copy the Room ID');
        }
    }

    function leaveRoom() {
        reactNavigator('/');
    }
    

  return (
    <>
    <div className="editorpage-logo-part">
          <div >
          <img src={logo} className='editorpage-logo' alt="logo" />
          </div>         
          <div className="clientsList">
             {clients.map((client) => (
                 <Clients
                     key={client.socketId}
                     username={client.username}
                  />
             ))}
           </div>
          <div className="editorpage-btn">
            <button className='btnn copyBtn' onClick={copyRoomId} >Copy ROOM ID</button>
            <button className='btnn leaveBtn' onClick={leaveRoom}>Leave</button>
          </div>
    </div>
     <InputPart socketRef={socketRef} 
       roomId={roomId} 
       onHtmlCodeChange={(code) => { htmlcodeRef.current = code; }}
       onCssCodeChange={(code) => { csscodeRef.current = code; }}
       onJsCodeChange={(code) => { jscodeRef.current = code; }}
          handleHtml={(code) => {setHtml(code)}}
          handleCss={(code) => {setCss(code)}}
          handleJs={(code) => {setJs(code)}}
     />

     <OutputPart 
       htmlcode = {html}
       csscode = {css}
       jscode = {js}
     />

    </>
  )
}

export default LogoPart