// Functions to synchronize with the clients through socket.io

export function onConnectionSync(socket) {
    console.log('======= socket.io - server - on connection ');
    socket.on('new message sent', () => {
	socket.broadcast.emit('new message added', 'Message to all units. I repeat, message to all units.');
    })
}
