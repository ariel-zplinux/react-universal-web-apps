import React from 'react';
import RandomName from 'random-name';

export default class List extends React.Component {
    render() {
        const ItemType = this.props.itemType;
        const items = this.props.items || [];
        const markupItems = this.createItemsMarkup(items, ItemType);

        return (<ul className="ui-list">{markupItems}</ul>);
    }

    createItemsMarkup(items, Type) {
        const markupItems = items.map((item) => {
            item.name = item.username ? item.username : item.name;
            item.data.mode = 'view';
            const key = RandomName();
            return (
                <li className="ui-list-item" key={key}>
                    <Type data={item.data}/>
                </li>
            );
        });

        return markupItems;
    }
}

