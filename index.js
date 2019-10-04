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
let counter = 0;

io.on('connection', (socket) => {

    console.log('New user connected')
	//default username
    socket.username = "Anonymous"
    socket.nickname = "Anonymous"

    //listen on change_username
    socket.on('change_username', (data) => {
        counter++;
        socket.username = data.username
        socket.nickname = data.userNickname
        io.sockets.emit('user_connected', {msg : 'last msg', name : data.username, counter : counter, username : data.username, nickname : data.userNickname});
    })

    //listen on new_message
    socket.on('new_message', (data) => {
        //broadcast the new message
        io.sockets.emit('new_message', {message : data.message, username : socket.username});
    })

    //listen on typing
    // socket.on('typing', (data) => {
    // 	socket.broadcast.emit('typing', {username : socket.username})
    // })
})