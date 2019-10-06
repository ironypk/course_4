let express = require('express');
let exphbs  = require('express-handlebars');
let app = express();
let path = require('path');
let server = require('http').createServer(app);

app.engine('handlebars', exphbs());
app.set('view engine', '.hbs');

app.get('/', function (req, res) {
    res.render('index');
});

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname,'views'));

server = app.listen(3000)


let io = require('socket.io')(server);

let users = new Map();
let message = {};

io.on('connection', (socket) => {
    let usersValue = [];

    users.set(socket.id);
	//default username
    socket.username = "Anonymous"
    socket.nickname = "Anonymous"

    //listen on change_username
    socket.on('change_username', (data) => {
        socket.username = data.username
        socket.nickname = data.userNickname
        users.set(socket.id, {name : data.username, nickname : data.userNickname});
        usersValue = Array.from(users.values());
        io.sockets.emit('user_connected', {usersValue});
    })

    //listen on new_message
    socket.on('new_message', (data) => {
        users.get(socket.id).lastMsg = data.message;
        usersValue = Array.from(users.values());
        message = {name : socket.username, message : data.message};
        io.sockets.emit('new_message', {usersValue , message});
    })

    socket.on('new_avatar', (photoUrl) =>{
        users.get(socket.id).photoUrl = photoUrl;
        usersValue = Array.from(users.values());
        io.sockets.emit('new_avatar', usersValue);
    })

    socket.on('disconnect', () => {
        users.delete(socket.id);
        usersValue = Array.from(users.values());
        io.sockets.emit('disconnect', usersValue);
    })
})
