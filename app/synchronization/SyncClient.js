// Functions to synchronize with the server through socket.io
import Actions from '../actions/Actions';

// to change in production with WAN url
export const SERVER_URL = 'http://localhost:6001';

export function emitChatRoomSync(io) {
    io.emit('message', 'hello world');
    io.on('new message added', () => {
        console.log('===== client - on message added');        
        // to prevent a warning probably due to browsersync or ssr getting broadcast signal
        // it checks that we are in the client
        if (typeof window !== 'undefined') {
            Actions.getMessages();
        }
    });
    io.on('user list to update', () => {
        console.log('===== client - user list to update');        
        // to prevent a warning probably due to browsersync or ssr getting broadcast signal
        // it checks that we are in the client
        if (typeof window !== 'undefined') {
            console.log('action get users');
            Actions.getUsers();
        }
    });
}

export function emitNewMessageSent(io) {
    io.emit('new message sent');
}

export function emitNewUserAdded(io) {
    io.emit('new user connected');
}

export function emitUserDisconnected(io) {
    io.emit('user disconnected');
}

