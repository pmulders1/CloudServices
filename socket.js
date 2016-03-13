var io;

function initIo(){

    io.on('connection', function (socket) {
        
        console.log('connected');
        
        socket.on('race', function(msg){
            
            console.log(msg);
            
            io.emit('race', msg);
            
            socket.on('disconnect', function(){
                console.log('user disconnected');
            });
        });

        socket.on('participant', function(msg){
            
            console.log(msg);
            
            io.emit('participant', msg);
            
            socket.on('disconnect', function(){
                console.log('user disconnected');
            });
        });
    });
}

function sendMsg(msg){
     io.emit(msg);
}

function addRace(race){
     io.emit(race);
}


module.exports = function(http){

    if(!io && http){
        io = require('socket.io').listen(http);
        initIo();
    }

    //functies die nu vanuit elke module aangeroepen kunnen worden.
    return {
        addRace: addRace,
        sendMsg: sendMsg
    };
};
