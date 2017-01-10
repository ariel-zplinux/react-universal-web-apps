import React from 'react';
// import {Link} from 'react-router';
// import Actions from '../../actions/Actions';

export default class Message extends React.Component {
    static get contextTypes() {
        return {
            root: React.PropTypes.string            
        };
    }

    render() {
        const data = this.props.data;
        const mode = data.mode;
        const username = data.username || data.name; 
        const content = data.content;
        return (
            <div>
            { mode === 'view' ?
                <article className="media  {{selectedClass}}">
                    <div className="parent_media">
                        <div className="title">
                            { '<' + username + '> ' + content }
                        </div>
                    </div>
                </article>
                : 

                <div className="row">
                    <div className="col-lg-3">
                        <div className="input-group">
                        <span className="input-group-btn">
                            <button className="btn btn-warning" 
                                type="button"
                                id="btn-change-username"
                                onClick={this.changeUsername.bind(this)}>
                                Change
                            </button>
                        </span>
                        <div id="tooltip"></div>
                        <input type="text" className="form-control" 
                            placeholder={username}
                            onKeyPress={this.changeUsername.bind(this)} 
                            id="change-username"
                            />
                        </div>
                    </div>
                    <div className="col-lg-9">
                        <div className="input-group">
                        <input type="text" className="form-control" placeholder="Message"
                            onKeyPress={this.sendMessage.bind(this)} 
                            id="new-message"
                        />
                        <span className="input-group-btn">
                            <button className="btn btn-success"
                                id="btn-send-message" 
                                type="button" 
                                onClick={this.sendMessage.bind(this)}>
                                Send
                            </button>
                        </span>
                        </div>
                    </div>
                </div>                
            }
            </div>
        );
    }

    sendMessage(event) {
        if (event.key === 'Enter' || event.target.id === 'btn-send-message') {
            const message = document.getElementById('new-message').value;
            const data = {
                content: message,
                username: this.props.data.username
            };
            document.getElementById('new-message').value = '';
            this.props.onNewMessage(data);
        } 
    }

    changeUsername(event) {
        if (event.key === 'Enter' || event.target.id === 'btn-change-username') {
            const username = document.getElementById('change-username').value;
            const data = {
                name: username
            };
            document.getElementById('change-username').value = '';
            this.props.onChangeUsername(data);
        } 
    }
}
