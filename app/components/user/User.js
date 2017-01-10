import React from 'react';

export default class User extends React.Component {
    static get contextTypes() {
        return {
            root: React.PropTypes.string            
        };
    }

    render() {
        const data = this.props.data;
        const name = data.name;
        const mode = data.mode;
        return (
            <div>
            { mode === 'view' ?
                <article className="list-group-item">
                    { '[' + name + ']' }
                </article>
                : 
                <div className="row">
                </div>                
            }
            </div>
        );
    }
}
