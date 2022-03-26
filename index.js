/*
 * @Author: willwil
 * @Date: 2022-01-07 10:38:53
 * @LastEditors: willwil
 * @LastEditTime: 2022-01-07 13:00:57
 * @Description: 
 */
let app = require('express')();
let http = require('http').Server(app);
// 需要传入http对象初始化socket.io的一个实例
let io = require('socket.io')(http);
let i = 0; // 当前在线人数

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
})

io.on('connection', (socket) => {
    i++;
    console.log('有' + i + '个用户连接了')

    // 所有人发送消息
    socket.broadcast.emit('hi');

    socket.on('chat message', (msg) => {
        console.log('message: ' + msg);
        io.emit('chat message', socket.nickName + '说：' + msg);
    });

    socket.on('join', (userName) => {
        socket.nickName = userName;
        io.emit('join', userName);
    })

    socket.on('disconnect', () => {
        i--;
        console.log(socket.nickName + '骂骂咧咧的离开了');
        io.emit('chat message', socket.nickName + '骂骂咧咧的离开了');
        console.log('user disconnected');
    });
})

http.listen(3000, () => {
    console.log('3000端口开启')
})