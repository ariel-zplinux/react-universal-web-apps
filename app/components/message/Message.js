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
                <div className="panel panel-default">
                    <div className="panel-body" id="status">
							
						<div className="input-group">
							<span className="input-group-addon" id="basic-addon1">{username}</span>
							<input 
                                type="text" className="form-control" 
                                id="new-message" placeholder="Name"
                                onKeyPress={this.sendMessage.bind(this)} />
						</div>
                    
                    </div>
                    <div id="control"></div>
                </div>                
            }
            </div>
        );
    }

    sendMessage(event) {
        if (event.key === 'Enter') {
            const data = {
                content: event.target.value,
                username: this.props.data.username
            };
            document.getElementById('new-message').value = '';
            this.props.onNewMessage(data);
        } 
    }

    calculateLink(data) {
        return data.link ? `${data.link}` : false;
    }
}
