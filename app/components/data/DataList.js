import React from 'react';

import List from '../common/List';
// import CompactBill from './CompactBill';
import CompactData from './CompactData';

import ReactPaginate from 'react-paginate';
import Actions from '../../actions/Actions';

export default class DataList extends React.Component {
    static loadAction(params, req, domain) {
        // to have menu displayed when root address called
        params.url = (req === '/') ? '/menu' : req;
        return Actions.loadData(params, domain);
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
        Actions.getDataList(this.props.params, this.props.route.path);
    }

    shouldComponentUpdate(nextProps, nextState) {
        let result = true;

        if (this.state.items && nextState.items) {
            const oldItems = this.state.items;
            const newItems = nextState.items;

            if (oldItems.length === newItems.length) {
                const validList = newItems.filter((item, index) => {
                    return oldItems[index].name !== item.name;
                });

                if (validList.length === 0) {
                    result = false;
                }
            }
        }

        // check change of url 
        if (this.props.route.path !== nextProps.route.path) {
            result = true;
        }

        // check change of offset
        if (this.state.offset !== nextState.offset) {
            result = true;
        }
            
        return result;
    }

    componentDidUpdate() {
        // update state after shouldComponentUpdate hook
        let params = {
            limit: this.props.route.perPage,
            offset: this.state.offset
        };
        Actions.getDataList(params, this.props.route.path);
    }

    onChange() {
        const state = this.props.store.getAll();
        this.setState(state);
    }

    render() {
        let paginate = this.props.route.paginate;
        return (
            <section className="latest-bills">
                <header className="section-header">
                    <h3 className="title">Data</h3>
                </header>
                <section className="section-content">
                    <List items={this.state.items} itemType={CompactData}/>
                    { paginate ?
                        <div id="react-paginate">
                            <ReactPaginate previousLabel={"previous"}
                                nextLabel={"next"}
                                breakLabel={<a href="">...</a>}
                                breakClassName={"break-me"}
                                pageNum={131}
                                marginPagesDisplayed={2}
                                pageRangeDisplayed={5}
                                clickCallback={this.handlePageClick.bind(this)}
                                containerClassName={"pagination"}
                                subContainerClassName={"pages pagination"}
                                activeClassName={"active"} />
                        </div>
                        :
                        ''
                    }
                </section>
            </section>
        );
    }
}
