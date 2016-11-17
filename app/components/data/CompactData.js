import React from 'react';
import {Link} from 'react-router';

export default class CompactData extends React.Component {
    render() {
        const data = this.props.data;
        // const amount = `$${data.amount}\%`;
        const amount = data.quantity ? `${data.quantity}%` : "";
        const link = this.calculateLink(data);

        return (
            <div className="bill compact-bill">
                <img className="icon" src={data.icon}/>
                <div className="info-container">
                    <h4 className="title">{data.device}</h4>
                    <Link className="link" to={link}>
                        More Details &#187;
                    </Link>
                    &nbsp;
                    <Link className="link" to={"/menu"}>
                        Back &#187;
                    </Link>                    
                </div>
                <span className="amount">{amount}</span>
            </div>
        );
    }

    calculateLink(data) {
        return `${data.id}`;
    }
}
