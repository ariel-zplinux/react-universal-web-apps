// Functions to synchronize with the clients through socket.io

export function onConnectionSync(socket) {
    console.log('======= socket.io - server - on connection ');
    socket.on('message', () => {
        console.log('======= socket.io -server - message received');
    });
}