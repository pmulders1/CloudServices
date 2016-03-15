var io;

function initIo(){

    io.on('connection', function (socket) {
        
        console.log('connected');
        
        socket.on('updated', function(data){
            
            console.log(data);
            
            io.emit('updated', data);
            
            socket.on('disconnect', function(){
                console.log('user disconnected');
            });
        });
    });
}

function sendMsg(msg){
     io.emit(msg);
}

module.exports = function(http){

    if(!io && http){
        io = require('socket.io').listen(http);
        initIo();
    }

    //functies die nu vanuit elke module aangeroepen kunnen worden.
    return {
        sendMsg: sendMsg
    };
};
