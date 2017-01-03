import React from 'react';
// import {Link} from 'react-router';

export default class Message extends React.Component {
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
							<span className="input-group-addon" id="basic-addon1">Name</span>
							<input type="text" className="form-control" id="name" placeholder="Name"/>
						</div>
                    
                    </div>
                    <div id="control"></div>
                </div>                
            }
            </div>
        );
    }

    calculateLink(data) {
        return data.link ? `${data.link}` : false;
    }
}
