import React from 'react';

import List from '../common/List';
import Footer from '../main/Footer';
import Message from './Message';
import User from '../user/User';

import Actions from '../../actions/Actions';

import socketIOclient from 'socket.io-client';
import {SERVER_URL, 
    emitChatRoomSync, 
    emitNewMessageSent, 
    emitNewUserAdded,
    emitUserDisconnected} from '../../synchronization/SyncClient';

// start socket.io client
export const io = socketIOclient(SERVER_URL);
emitChatRoomSync(io);

export default class ChatRoom extends React.Component {
    static loadAction(params, req, domain) {
        return Actions.loadMessages(params, domain);
    }

    constructor(props) {
        super(props);
        this.changeHandler = this.onChange.bind(this);
        this.state = this.props.store.getAll() || {};
    }

    componentWillMount() {
        if (process.browser) {
            this.props.store.addChangeListener(this.changeHandler);            
        }
    }

    componentWillUnmount() {
        window.removeEventListener('beforeunload');
        this.props.store.removeChangeListener(this.changeHandler);
    }

    // disconnect and delete user when closing window
    handleWindowClose(event) {
        event.preventDefault();
        const data = {
            id: this.state.userId
        };
        Actions.disconnectUser(data);
        // warn server that client got disconnected
        emitUserDisconnected(io);
        return true;        
    }

    componentDidMount() {
        // disconnect and delete user when closing window
        window.addEventListener('beforeunload', this.handleWindowClose.bind(this));        
        
        Actions.connectNewUser(this.props.params);
        Actions.getMessages(this.props.params);
    }

    shouldComponentUpdate(nextProps, nextState) {
        let result = true;

        // check if new messages
        if ((this.state.messages && this.state.messages.length) 
            !== (nextState.messagse && nextState.messages.length)) {
            result = true;
        }

        // check change of username 
        if (this.state.username !== nextState.username) {
            result = true;
        }
        return result;
    }

    componentDidUpdate() {
        // warn the server that a new message has been sent
        if (this.state.newMessageSent) {
            emitNewMessageSent(io);
        }

        // warn the server that the client got connected or changed his username
        if (this.state.newUserAdded) {
            emitNewUserAdded(io);
            Actions.getUsers();
        }

        // to auto scroll to last message
        const elem = document.getElementById('messageList');
        elem.scrollTop = elem.scrollHeight;
    }

    onChange() {
        const state = this.props.store.getAll();
        this.setState(state);
    }

    onNewMessage(data) {
        Actions.sendNewMessage(data);
    }

    onChangeUsername(data) {
        data.id = this.state.userId;
        Actions.changeUsername(data);
    }

    render() {
        let status = 'ready' || this.state.status;
        let messages = this.state.messages;
        let users = this.state.users;
        const data = {
            username: this.state.username,
            mode: this.state.mode
        };
        return (
            <main role="main" id="main">

                <section id="messageList">
                    <div className="container-fluid">
                        { status === 'ready' ?
                            <List items={messages} itemType={Message}/>
                            : 'Waiting to connect'
                        }               
                    </div>
                    <Footer 
                        data={data} 
                        onNewMessage={this.onNewMessage}
                        onChangeUsername={this.onChangeUsername.bind(this)} 
                    />
                </section>
                <section id="userList">
                        { status === 'ready' ?
                            <List items={users} itemType={User}/>
                            : 'Waiting to connect'
                        }               
                </section>
            </main>
        );
    }
}
