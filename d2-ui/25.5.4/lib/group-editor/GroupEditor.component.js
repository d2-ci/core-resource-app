import React from 'react';
import { findDOMNode } from 'react-dom';

// Material UI
import CircularProgress from 'material-ui/CircularProgress/CircularProgress';
import Paper from 'material-ui/Paper/Paper';
import RaisedButton from 'material-ui/RaisedButton/RaisedButton';

// D2
import { config } from 'd2/lib/d2';

// D2-UI
import TranslateMixin from '../i18n/Translate.mixin.js';

// TODO: TOAST!
// TODO: Undo support (in TOAST?)

config.i18n.strings.add('selected');
config.i18n.strings.add('assign_all');
config.i18n.strings.add('remove_all');
config.i18n.strings.add('hidden_by_filters');

export default React.createClass({
    displayName: 'GroupEditor.component',

    propTypes: {
        // itemStore: d2-ui store containing all available items, either as a D2 ModelCollection,
        // or an array on the following format: [{value: 1, text: '1'}, {value: 2, text: '2'}, ...]
        itemStore: React.PropTypes.object.isRequired,

        // assignedItemStore: d2-ui store containing all items assigned to the current group, either
        // as a D2 ModelCollectionProperty or an array of ID's that match values in the itemStore
        assignedItemStore: React.PropTypes.object.isRequired,

        // filterText: A string that will be used to filter items in both columns
        filterText: React.PropTypes.string,

        // Note: Callbacks should return a promise that will resolve when the operation succeeds
        // and is rejected when it fails. The component will be in a loading state until the promise
        // resolves or is rejected.

        // assign items callback, called with an array of values to be assigned to the group
        onAssignItems: React.PropTypes.func.isRequired,

        // remove items callback, called with an array of values to be removed from the group
        onRemoveItems: React.PropTypes.func.isRequired,

        // The height of the component, defaults to 500px
        height: React.PropTypes.number
    },

    contextTypes: {
        d2: React.PropTypes.object
    },

    mixins: [TranslateMixin],

    componentDidMount: function componentDidMount() {
        var _this = this;

        this.disposables = [];

        this.disposables.push(this.props.itemStore.subscribe(function (state) {
            return _this.setState({ loading: !state });
        }));
        this.disposables.push(this.props.assignedItemStore.subscribe(function () {
            return _this.forceUpdate();
        }));
    },
    componentWillReceiveProps: function componentWillReceiveProps(props) {
        if (props.hasOwnProperty('filterText') && this.leftSelect && this.rightSelect) {
            this.setState({
                selectedLeft: [].filter.call(this.leftSelect.selectedOptions, function (item) {
                    return item.text.toLowerCase().indexOf(('' + props.filterText).trim().toLowerCase()) !== -1;
                }).length,
                selectedRight: [].filter.call(this.rightSelect.selectedOptions, function (item) {
                    return item.text.toLowerCase().indexOf(('' + props.filterText).trim().toLowerCase()) !== -1;
                }).length
            });
        }
    },
    componentWillUnmount: function componentWillUnmount() {
        this.disposables.forEach(function (disposable) {
            disposable.dispose();
        });
    },
    getDefaultProps: function getDefaultProps() {
        return {
            height: 500,
            filterText: ''
        };
    },
    getInitialState: function getInitialState() {
        return {
            // Number of items selected in the left/right columns
            selectedLeft: 0,
            selectedRight: 0,

            // Loading
            loading: true
        };
    },


    //
    // Data handling utility functions
    //
    getItemStoreIsCollection: function getItemStoreIsCollection() {
        return this.props.itemStore.state !== undefined && typeof this.props.itemStore.state.values === 'function' && typeof this.props.itemStore.state.has === 'function';
    },
    getItemStoreIsArray: function getItemStoreIsArray() {
        return this.props.itemStore.state !== undefined && this.props.itemStore.state.constructor.name === 'Array';
    },
    getAssignedItemStoreIsCollection: function getAssignedItemStoreIsCollection() {
        return this.props.assignedItemStore.state !== undefined && typeof this.props.assignedItemStore.state.values === 'function' && typeof this.props.assignedItemStore.state.has === 'function';
    },
    getAssignedItemStoreIsArray: function getAssignedItemStoreIsArray() {
        return this.props.assignedItemStore.state !== undefined && this.props.assignedItemStore.state.constructor.name === 'Array';
    },
    getAllItems: function getAllItems() {
        return this.getItemStoreIsCollection() ? Array.from(this.props.itemStore.state.values()).map(function (item) {
            return { value: item.id, text: item.name };
        }) : this.props.itemStore.state || [];
    },
    getItemCount: function getItemCount() {
        return this.getItemStoreIsCollection() && this.props.itemStore.state.size || this.getItemStoreIsArray() && this.props.itemStore.state.length || 0;
    },
    getIsValueAssigned: function getIsValueAssigned(value) {
        return this.getAssignedItemStoreIsCollection() ? this.props.assignedItemStore.state.has(value) : this.props.assignedItemStore.state && this.props.assignedItemStore.state.indexOf(value) !== -1;
    },
    getAssignedItems: function getAssignedItems() {
        var _this2 = this;

        return this.getAllItems().filter(function (item) {
            return _this2.getIsValueAssigned(item.value);
        });
    },
    getAvailableItems: function getAvailableItems() {
        var _this3 = this;

        return this.getAllItems().filter(function (item) {
            return !_this3.getIsValueAssigned(item.value);
        });
    },
    getAllItemsFiltered: function getAllItemsFiltered() {
        return this.filterItems(this.getAllItems());
    },
    getAssignedItemsFiltered: function getAssignedItemsFiltered() {
        return this.filterItems(this.getAssignedItems());
    },
    getAvailableItemsFiltered: function getAvailableItemsFiltered() {
        return this.filterItems(this.getAvailableItems());
    },
    getAssignedItemsCount: function getAssignedItemsCount() {
        return this.getAssignedItems().length;
    },
    getAvailableItemsCount: function getAvailableItemsCount() {
        return this.getAvailableItems().length;
    },
    getAssignedItemsFilterCount: function getAssignedItemsFilterCount() {
        return this.getFilterText().length === 0 ? 0 : this.getAssignedItems().length - this.getAssignedItemsFiltered().length;
    },
    getAvailableItemsFilterCount: function getAvailableItemsFilterCount() {
        return this.getFilterText().length === 0 ? 0 : this.getAvailableItems().length - this.getAvailableItemsFiltered().length;
    },
    getAssignedItemsUnfilteredCount: function getAssignedItemsUnfilteredCount() {
        return this.getFilterText().length === 0 ? this.getAssignedItemsCount() : this.getAssignedItemsCount() - this.getAssignedItemsFilterCount();
    },
    getAvailableItemsUnfilteredCount: function getAvailableItemsUnfilteredCount() {
        return this.getFilterText().length === 0 ? this.getAvailableItemsCount() : this.getAvailableItemsCount() - this.getAvailableItemsFilterCount();
    },
    getFilterText: function getFilterText() {
        return this.props.filterText ? this.props.filterText.trim().toLowerCase() : '';
    },
    getAvailableSelectedCount: function getAvailableSelectedCount() {
        return Math.max(this.state.selectedLeft, 0);
    },
    getAssignedSelectedCount: function getAssignedSelectedCount() {
        return Math.max(this.state.selectedRight, 0);
    },
    getSelectedCount: function getSelectedCount() {
        return Math.max(this.getAvailableSelectedCount(), this.getAssignedSelectedCount());
    },
    byAssignedItemsOrder: function byAssignedItemsOrder(left, right) {
        var assignedItemStore = this.props.assignedItemStore.state;

        // Don't order anything if the assignedItemStore is not an array
        // TODO: Support sorting for a ModelCollectionProperty
        if (!Array.isArray(assignedItemStore)) {
            return 0;
        }

        return assignedItemStore.indexOf(left.value) > assignedItemStore.indexOf(right.value) ? 1 : -1;
    },


    //
    // Rendering
    //
    render: function render() {
        var _this4 = this;

        var filterHeight = this.getFilterText().length > 0 ? 15 : 0;
        var styles = {
            container: {
                display: 'flex',
                marginTop: 16,
                marginBottom: 32,
                height: this.props.height + 'px'
            },
            left: {
                flex: '1 0 120px'
            },
            middle: {
                flex: '0 0 120px',
                alignSelf: 'center',
                textAlign: 'center'
            },
            right: {
                flex: '1 0 120px'
            },
            paper: {
                width: '100%',
                height: '100%'
            },
            select: {
                width: '100%',
                minHeight: '50px',
                height: this.props.height - filterHeight + 'px',
                border: 'none',
                fontFamily: 'Roboto',
                fontSize: 13,
                outline: 'none'
            },
            options: {
                padding: '.25rem .5rem'
            },
            buttons: {
                minWidth: '100px',
                maxWidth: '100px',
                marginTop: '8px'
            },
            selected: {
                fontSize: 13,
                minHeight: '15px',
                marginTop: '45px',
                padding: '0 8px'
            },
            status: {
                marginTop: '8px',
                minHeight: '60px'
            },
            hidden: {
                fontSize: 13,
                color: '#404040',
                fontStyle: 'italic',
                textAlign: 'center',
                width: '100%',
                background: '#d0d0d0',
                maxHeight: '15px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
            }
        };

        var onChangeLeft = function onChangeLeft(e) {
            _this4.clearSelection(false, true);
            _this4.setState({
                selectedLeft: e.target.selectedOptions.length
            });
        };

        var onChangeRight = function onChangeRight(e) {
            _this4.clearSelection(true, false);
            _this4.setState({
                selectedRight: e.target.selectedOptions.length
            });
        };

        var hiddenLabel = function hiddenLabel(itemCount) {
            return _this4.getItemCount() > 0 && _this4.getFilterText().length > 0 ? itemCount + ' ' + _this4.getTranslation('hidden_by_filters') : '';
        };

        var selectedLabel = function selectedLabel() {
            return _this4.getSelectedCount() > 0 ? _this4.getSelectedCount() + ' ' + _this4.getTranslation('selected') : '';
        };

        return React.createElement(
            'div',
            { style: styles.container },
            React.createElement(
                'div',
                { style: styles.left },
                React.createElement(
                    Paper,
                    { style: styles.paper },
                    React.createElement(
                        'div',
                        { style: styles.hidden },
                        hiddenLabel(this.getAvailableItemsFilterCount())
                    ),
                    React.createElement(
                        'select',
                        { multiple: true, style: styles.select, onChange: onChangeLeft,
                            ref: function ref(r) {
                                _this4.leftSelect = findDOMNode(r);
                            } },
                        this.getAvailableItemsFiltered().map(function (item) {
                            return React.createElement(
                                'option',
                                { key: item.value, value: item.value,
                                    onDoubleClick: _this4._assignItems,
                                    style: styles.options },
                                item.text
                            );
                        })
                    )
                ),
                React.createElement(RaisedButton, {
                    label: this.getTranslation('assign_all') + ' ' + (this.getAvailableItemsUnfilteredCount() === 0 ? '' : this.getAvailableItemsUnfilteredCount()) + ' \u2192',
                    disabled: this.state.loading || this.getAvailableItemsUnfilteredCount() === 0,
                    onClick: this._assignAll,
                    style: { marginTop: '1rem' },
                    secondary: true })
            ),
            React.createElement(
                'div',
                { style: styles.middle },
                React.createElement(
                    'div',
                    { style: styles.selected },
                    selectedLabel()
                ),
                React.createElement(RaisedButton, {
                    label: '\u2192',
                    secondary: true,
                    onClick: this._assignItems,
                    style: styles.buttons,
                    disabled: this.state.loading || this.state.selectedLeft === 0 }),
                React.createElement(RaisedButton, {
                    label: '\u2190',
                    secondary: true,
                    onClick: this._removeItems,
                    style: styles.buttons,
                    disabled: this.state.loading || this.state.selectedRight === 0 }),
                React.createElement(
                    'div',
                    { style: styles.status },
                    this.state.loading ? React.createElement(CircularProgress, { size: 0.5, style: { width: 60, height: 60 } }) : undefined
                )
            ),
            React.createElement(
                'div',
                { style: styles.right },
                React.createElement(
                    Paper,
                    { style: styles.paper },
                    React.createElement(
                        'div',
                        { style: styles.hidden },
                        hiddenLabel(this.getAssignedItemsFilterCount())
                    ),
                    React.createElement(
                        'select',
                        { multiple: true, style: styles.select, onChange: onChangeRight,
                            ref: function ref(r) {
                                _this4.rightSelect = findDOMNode(r);
                            } },
                        this.getAssignedItemsFiltered().sort(this.byAssignedItemsOrder).map(function (item) {
                            return React.createElement(
                                'option',
                                { key: item.value, value: item.value,
                                    onDoubleClick: _this4._removeItems,
                                    style: styles.options },
                                item.text
                            );
                        })
                    )
                ),
                React.createElement(RaisedButton, {
                    label: '\u2190 ' + this.getTranslation('remove_all') + ' ' + (this.getAssignedItemsUnfilteredCount() > 0 ? this.getAssignedItemsUnfilteredCount() : ''),
                    style: { float: 'right', marginTop: '1rem' },
                    disabled: this.state.loading || this.getAssignedItemsUnfilteredCount() === 0,
                    onClick: this._removeAll,
                    secondary: true })
            )
        );
    },
    clearSelection: function clearSelection() {
        var left = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
        var right = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

        if (left) {
            this.leftSelect.selectedIndex = -1;
        }

        if (right) {
            this.rightSelect.selectedIndex = -1;
        }

        this.setState(function (state) {
            return {
                selectedLeft: left ? 0 : state.selectedLeft,
                selectedRight: right ? 0 : state.selectedRight
            };
        });
    },
    filterItems: function filterItems(items) {
        var _this5 = this;

        return items.filter(function (item) {
            return _this5.getFilterText().length === 0 || item.text.trim().toLowerCase().indexOf(_this5.getFilterText()) !== -1;
        });
    },
    getSelectedItems: function getSelectedItems() {
        return [].map.call(this.rightSelect.selectedOptions, function (item) {
            return item.value;
        });
    },


    //
    // Event handlers
    //
    _assignItems: function _assignItems() {
        var _this6 = this;

        this.setState({ loading: true });
        this.props.onAssignItems([].map.call(this.leftSelect.selectedOptions, function (item) {
            return item.value;
        })).then(function () {
            _this6.clearSelection();
            _this6.setState({ loading: false });
        }).catch(function () {
            _this6.setState({ loading: false });
        });
    },
    _removeItems: function _removeItems() {
        var _this7 = this;

        this.setState({ loading: true });
        this.props.onRemoveItems([].map.call(this.rightSelect.selectedOptions, function (item) {
            return item.value;
        })).then(function () {
            _this7.clearSelection();
            _this7.setState({ loading: false });
        }).catch(function () {
            _this7.setState({ loading: false });
        });
    },
    _assignAll: function _assignAll() {
        var _this8 = this;

        this.setState({ loading: true });
        this.props.onAssignItems([].map.call(this.leftSelect.options, function (item) {
            return item.value;
        })).then(function () {
            _this8.clearSelection();
            _this8.setState({ loading: false });
        }).catch(function () {
            _this8.setState({ loading: false });
        });
    },
    _removeAll: function _removeAll() {
        var _this9 = this;

        this.setState({ loading: true });
        this.props.onRemoveItems([].map.call(this.rightSelect.options, function (item) {
            return item.value;
        })).then(function () {
            _this9.clearSelection();
            _this9.setState({ loading: false });
        }).catch(function () {
            _this9.setState({ loading: false });
        });
    }
});