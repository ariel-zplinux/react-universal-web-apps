// Functions to synchronize with the server through socket.io

import Actions from '../actions/Actions';

export function emitChatRoomSync(io) {
    io.emit('message', 'hello world');
    io.on('new message added', () => {
        console.log('===== server - on message sent');
        
        // to prevent a warning probably due to browsersync or ssr getting broadcast signal
	// it checks that we are in the client
        if (typeof window !== 'undefined') {
            Actions.getMessages();
        }
    });
}

export function emitNewMessageSent(io) {
    io.emit('new message sent');
}
