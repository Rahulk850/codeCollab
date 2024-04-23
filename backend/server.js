const express = require('express');
const app = express();
const http = require('http');
const path = require('path');
const { Server } = require('socket.io');
const ACTIONS = require('./src/Actions');
const server = http.createServer(app);
const io = new Server(server);


const userSocketMap = {};
function getAllConnectedClients(roomId) {
    // Map
    return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
        (socketId) => {
            return {
                socketId,
                username: userSocketMap[socketId],
            };
        }
    );
}

io.on( 'connection', ( socket ) => {
  console.log(`socket connected: ${socket.id}`);

    socket.on(ACTIONS.JOIN, ({roomId, username}) => {
       userSocketMap[socket.id] = username;
       socket.join(roomId);
       const clients = getAllConnectedClients(roomId);
       console.log(clients);
       clients.forEach(({ socketId }) => {
           io.to(socketId).emit(ACTIONS.JOINED, {
               clients,
               username,
               socketId: socket.id,
           });
       });
   });

    socket.on(ACTIONS.HTML_CODE_CHANGE, ({ roomId, html_code }) => {
       socket.in(roomId).emit(ACTIONS.HTML_CODE_CHANGE, { html_code });
     });    
    socket.on(ACTIONS.CSS_CODE_CHANGE, ({ roomId, css_code }) => {
        socket.in(roomId).emit(ACTIONS.CSS_CODE_CHANGE, { css_code });
      });
    socket.on(ACTIONS.JS_CODE_CHANGE, ({ roomId, js_code }) => {
        socket.in(roomId).emit(ACTIONS.JS_CODE_CHANGE, { js_code });
      });


                //    <------- this is for code sync ------>
    socket.on(ACTIONS.HTML_SYNC_CODE, ({ socketId, html_code }) => {
        io.to(socketId).emit(ACTIONS.HTML_CODE_CHANGE, { html_code });
      });
    socket.on(ACTIONS.CSS_SYNC_CODE, ({ socketId, css_code }) => {
        io.to(socketId).emit(ACTIONS.CSS_CODE_CHANGE, { css_code });
      });
    socket.on(ACTIONS.JS_SYNC_CODE, ({ socketId, js_code }) => {
        io.to(socketId).emit(ACTIONS.JS_CODE_CHANGE, { js_code });
      });


     // disconnecting for user
     socket.on('disconnecting', () => {
        const rooms = [...socket.rooms];    // it will give us all the roomId's in which this socket is connected
        rooms.forEach((roomId) => {        // we are notifying other users in each room that the client has left
            socket.in(roomId).emit(ACTIONS.DISCONNECTED, {    // send msg in perticular room only
                socketId: socket.id,
                username: userSocketMap[socket.id],
            });
        });
        delete userSocketMap[socket.id];     // we will update Clients
        socket.leave();                     // user wil leave the room
    });



})


app.get('/hello', (req, res)=>{
    res.send("this is home page");
})


const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Listening on port ${PORT}`));