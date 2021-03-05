//On load les modules
const express = require('express');
const socketIO = require('socket.io');

const port = process.env.PORT || 3000;
const index = '/index.html';

//on setup le serv
const server = express() .use((req, res)=> {

    res.sendFile(index, { root: __dirname })

})
.listen(port, () =>{
    console.log(`Server started on port: ${port}`);
})

//on setup socket
const io = socketIO(server);

let users = [];

io.on('connection', (socket) => {

    socket.on('username', (username) =>{
        console.log(`${username} joined the game.`);

        socket.username = username;

        users.push(socket);
    });

    socket.on('disconnect', () =>{
        users = users.filter((user) =>{
            return user !== socket
        });

        sendUsers();
    });

});

function sendUsers() {
    const usersData = users.map((user) =>{

        return {
            username: user.username
        }

    });
    io.emit('users', usersData);
}