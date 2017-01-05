import React from 'react';

import List from '../common/List';
import Footer from '../main/Footer';
import Message from './Message';

import Actions from '../../actions/Actions';

import socketIOclient from 'socket.io-client'
import {emitChatRoomSync} from '../../synchronization/SyncClient';

// start socket.io client
const io = socketIOclient('http://localhost:6001');
emitChatRoomSync(io);

export default class ChatRoom extends React.Component {
    static loadAction(params, req, domain) {
        // to have menu displayed when root address called
        params.url = (req === '/') ? '/menu' : req;
        // Actions.loadData(params, domain);
        return Actions.loadMessages(params, domain);
    }


    handlePageClick(data) {
        let selected = data.selected;
        let offset = Math.ceil(selected * this.props.route.perPage);
        this.setState({offset});
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
        this.props.store.removeChangeListener(this.changeHandler);
    }

    componentDidMount() {
        // Actions.getLatestBillsData(this.props.params);
        // Actions.getClientsPerUserDeviceData(this.props.params);
        // Actions.getDataList(this.props.params, this.props.route.path);
        Actions.connectNewUser(this.props.params);
        Actions.getMessages(this.props.params);
    }

    shouldComponentUpdate(nextProps, nextState) {
        let result = true;


        if ((this.state.messages && this.state.messages.length) 
            !== (nextState.messagse && nextState.messages.length)) {
            result = true;
        }

        // check if new messages

        // if (this.state.messages && nextState.messages) {
        //     const oldItems = this.state.items;
        //     const newItems = nextState.items;

        //     if (oldItems.length === newItems.length) {
        //         const validList = newItems.filter((item, index) => {
        //             return oldItems[index].name !== item.name;
        //         });

        //         if (validList.length === 0) {
        //             result = false;
        //         }
        //     }
        // }

        // check change of username 
        if (this.state.username !== nextState.username) {
            result = true;
        }
        return result;
    }

    componentDidUpdate() {
        // // update state after shouldComponentUpdate hook
        // let params = {
        //     limit: this.props.route.perPage,
        //     offset: this.state.offset
        // };
        // Actions.getDataList(params, this.props.route.path);

        // to auto scroll to last message
        const elem = document.getElementById('main');
        elem.scrollTop = elem.scrollHeight;
    }

    onChange() {
        const state = this.props.store.getAll();
        this.setState(state);
    }

    onNewMessage(data) {
        Actions.sendNewMessage(data);
    }

    render() {
        let status = 'ready' || this.state.status;
        let items = this.state.messages;
        const data = {
            username: this.state.username,
            mode: this.state.mode
        };
        return (
            <section id="list">
                <div className="container-fluid">
                    { status === 'ready' ?
                        <List items={items} itemType={Message}/>
                        : 'Waiting to connect'
                    }               
                </div>
                <Footer data={data} onNewMessage={this.onNewMessage}/>
            </section>    
        );
    }
}
