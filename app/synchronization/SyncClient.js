// Functions to synchronize with the server through socket.io

export function emitChatRoomSync(io) {
    io.emit('message', 'hello world')
}