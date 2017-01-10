import React from 'react';

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
            item.mode = 'view';
            const key = item._id || item.name;
            return (
                <li className="ui-list-item" key={key}>
                    <Type data={item}/>
                </li>
            );
        });

        return markupItems;
    }
}

