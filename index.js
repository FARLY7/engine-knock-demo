var express = require('express');
var app     = express();
var http    = require('http').Server(app);
var io = require('socket.io')(http);
var socket2; /* Global reference to web socket */

/* ============================================================== */
/* =======================  SERIAL PORT  ======================== */
var serialport = require("serialport");
var SerialPort = serialport.SerialPort; // localize object constructor
var serialPort = new SerialPort('COM5', {
	baudrate: 115200,
	dataBits: 8,
	parity: 'none',
	stopBits: 1,
	flowControl: false,
        parser: serialport.parsers.readline('\n')
});

serialPort.on("open", function () {
        console.log('Serial Communication Opened');
        serialPort.on('data', function(data) {
            /* Relay the data received from the serial port to the web socket,
             * which will be read by the web page */
            socket2.emit('message', data.toString());    
            console.log('(Serial) Received: ' + data.toString());
        });
});  

/* ============================================================== */
/* ========================  WEB SOCKET  ======================== */


io.on('connection', function(socket) {
    console.log('A user connected');
    /* Make a reference to the socket globally, so the serial port
     * can access it.
     */
    socket2 = socket;

    socket2.on('message', function(msg) {
        serialPort.write(msg.toString());
        
        console.log('(Socket) Received: ' + msg.toString());
    });

    socket2.on('fuel', function(msg) {
       var m = [ 0x1, 0, 0, msg ]; 
       serialPort.write(Buffer(m));
       
        console.log('(Socket) Received: ' + msg.toString());
    });

    socket2.on('rpm', function(msg) {
        var m = [ 0x2, 0, 0, msg ]; 
        serialPort.write(Buffer(m));
        
        console.log('(Socket) Received: ' + msg.toString());
    });
    
    socket2.on('start', function(msg) {
        var m = [ 0x3, 0, 0, msg ]; 
        serialPort.write(Buffer(m));
        
        console.log('(Socket) Received: ' + msg.toString());
    });
    
    socket2.on('stop', function(msg) {
        var m = [ 0x4, 0, 0, msg ]; 
        serialPort.write(Buffer(m));
        
        console.log('(Socket) Received: ' + msg.toString());
    });
    
    socket2.on('disconnect', function() {
        console.log('A user disconnected');
    });
});

/* ============================================================== */
/* =========================   SERVER   ========================= */


app.use(express.static(__dirname));

app.get('/', function(req, res){
	res.sendfile('index.html');
});

http.listen(8080, function(){
	console.log('Listening on *:8080');
});



