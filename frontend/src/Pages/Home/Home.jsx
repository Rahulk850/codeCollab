import React, { useState } from 'react'
import './Home.css'
import { v4 as uuidv4 } from 'uuid';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const Home = () => {

    const navigate = useNavigate();
   const [roomId, setRoomId] = useState(""); 
   const [username, setUsername] = useState("");

  const generateRoomId = ()=>{
         setRoomId(uuidv4());
         toast.success('Created a new roomId');
  }
  const handleJoinRoom = (e)=>{
      e.preventDefault();
    //   console.log(roomId + " " + username);
     if( !roomId || !username){
        toast.error('ROOM ID & username is required');
        return;
     }
         navigate(`/editor/${roomId}`, {
            state: {
                username,
            }
         });
  }

  return (
    <div className='home-container'>
         <div className="home-upperpart">
        <img src="./logo.png" className='home-logo' alt="logo" />
        <h3 className="home-uppertext">
            Paste invitation ROOM ID
        </h3>
         <div className="home-input">
            <input type="text"
             className='home-input home-input-roomid'  placeholder="Enter Room ID"
             value={roomId} 
             onChange={e=>setRoomId(e.target.value)}/>
             
            <input type="text"
             className='home-input home-input-username' placeholder='Enter Your USERNAME'
             value={username}
            onChange={(e)=> setUsername(e.target.value)}
             />
         </div>
          <button className='btn home-btn' onClick={handleJoinRoom} >Join</button>
          <p className='home-invitation' >If you don't have a <strong>Room ID</strong> then Create <a className='home-anchor-tag' onClick={generateRoomId} >new room</a> </p>
         </div>
         <h3 className='home-footer' >Build with 🤍 by <a className='home-anchor-tag' target='_blank' href="https://main--krish2643-portfolio.netlify.app/">KRISH</a></h3>  
    </div>
  )
}

export default Home