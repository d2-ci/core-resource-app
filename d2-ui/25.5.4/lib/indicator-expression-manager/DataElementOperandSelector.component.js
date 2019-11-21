import React from 'react';
import ListSelectAsync from '../list-select/ListSelectAsync.component';
import TextField from 'material-ui/TextField/TextField';
import LinearProgress from 'material-ui/LinearProgress/LinearProgress';
import Pagination from '../pagination/Pagination.component';
import Translate from '../i18n/Translate.mixin';
import Store from '../store/Store';
import { createDataElementOperandActions, subscribeDataElementActionsToStore } from './dataElementOperandSelector.actions';
import { config } from 'd2/lib/d2';

config.i18n.strings.add('search_by_name');

var DataElementOperandSelector = React.createClass({
    displayName: 'DataElementOperandSelector',

    propTypes: {
        dataElementOperandSelectorActions: React.PropTypes.object,
        dataElementOperandStore: React.PropTypes.object,
        onItemDoubleClick: React.PropTypes.func.isRequired,
        listStyle: React.PropTypes.object
    },

    mixins: [Translate],

    getDefaultProps: function getDefaultProps() {
        return {
            dataElementOperandSelectorActions: createDataElementOperandActions(),
            dataElementOperandStore: Store.create()
        };
    },
    getInitialState: function getInitialState() {
        return {
            isLoading: true,
            pager: {
                hasNextPage: function hasNextPage() {
                    return false;
                },
                hasPreviousPage: function hasPreviousPage() {
                    return false;
                }
            }
        };
    },
    componentWillMount: function componentWillMount() {
        var _this = this;

        this.actionSubscriptions = subscribeDataElementActionsToStore(this.props.dataElementOperandSelectorActions, this.props.dataElementOperandStore);

        if (this.props.dataElementOperandSelectorActions) {
            this.props.dataElementOperandSelectorActions.loadList();
        }

        this.storeObservable = this.props.dataElementOperandStore.tap(function (collection) {
            return _this.setState({ pager: collection.pager });
        }).map(function (collection) {
            return collection.toArray();
        }).map(function (collection) {
            return collection.map(function (item) {
                return {
                    label: item.displayName,
                    value: item.id
                };
            });
        }).tap(function (value) {
            _this.setState({ isLoading: false });
            return value;
        });

        this.disposable = this.storeObservable.map(function (collection) {
            return collection.pager;
        }).filter(function (pager) {
            return Boolean(pager);
        }).subscribe(function (pager) {
            _this.setState({ pager: pager });
        });
    },
    componentWillUnmount: function componentWillUnmount() {
        this.disposable && this.disposable.dispose();
        this.actionSubscriptions.forEach(function (subscription) {
            return subscription.dispose();
        });
    },
    getNextPage: function getNextPage() {
        this.setState({ isLoading: true });
        this.props.dataElementOperandSelectorActions.getNextPage(this.state.pager, this.state.searchValue);
    },
    getPreviousPage: function getPreviousPage() {
        this.setState({ isLoading: true });
        this.props.dataElementOperandSelectorActions.getPreviousPage(this.state.pager, this.state.searchValue);
    },
    render: function render() {
        var _this2 = this;

        return React.createElement(
            'div',
            { className: 'data-element-operand-selector' },
            React.createElement(
                'div',
                { style: { float: 'right' } },
                React.createElement(Pagination, {
                    hasNextPage: function hasNextPage() {
                        return _this2.state.pager.hasNextPage();
                    },
                    hasPreviousPage: function hasPreviousPage() {
                        return _this2.state.pager.hasPreviousPage();
                    },
                    onNextPageClick: this.getNextPage,
                    onPreviousPageClick: this.getPreviousPage
                })
            ),
            React.createElement(TextField, {
                style: { marginLeft: '1rem' },
                hintText: this.getTranslation('search_by_name'),
                onChange: this.searchDataElement
            }),
            this.state.isLoading ? React.createElement(LinearProgress, { mode: 'indeterminate' }) : null,
            React.createElement(ListSelectAsync, {
                size: 12,
                onItemDoubleClick: this.props.onItemDoubleClick,
                source: this.storeObservable,
                listStyle: this.props.listStyle
            })
        );
    },
    searchDataElement: function searchDataElement(event) {
        var _this3 = this;

        var value = event.target.value;
        this.props.dataElementOperandSelectorActions.search(value).subscribe(function () {
            _this3.setState({
                isLoading: false,
                searchValue: value
            });
        });

        this.setState({ isLoading: true });
    }
});

export default DataElementOperandSelector;