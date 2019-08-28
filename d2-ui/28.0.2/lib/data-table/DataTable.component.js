import isArrayOfStrings from 'd2-utilizr/lib/isArrayOfStrings';
import isIterable from 'd2-utilizr/lib/isIterable';
import React from 'react';

import DataTableHeader from './DataTableHeader.component';
import DataTableRow from './DataTableRow.component';
import DataTableContextMenu from './DataTableContextMenu.component';

var DataTable = React.createClass({
    displayName: 'DataTable',

    propTypes: {
        contextMenuActions: React.PropTypes.object,
        contextMenuIcons: React.PropTypes.object,
        primaryAction: React.PropTypes.func,
        isContextActionAllowed: React.PropTypes.func
    },

    getInitialState: function getInitialState() {
        return this.getStateFromProps(this.props);
    },
    componentWillReceiveProps: function componentWillReceiveProps(newProps) {
        this.setState(this.getStateFromProps(newProps));
    },
    getStateFromProps: function getStateFromProps(props) {
        var dataRows = [];

        if (isIterable(props.rows)) {
            dataRows = props.rows instanceof Map ? Array.from(props.rows.values()) : props.rows;
        }

        return {
            columns: isArrayOfStrings(props.columns) ? props.columns : ['name', 'lastUpdated'],
            dataRows: dataRows
        };
    },
    renderContextMenu: function renderContextMenu() {
        var _this = this;

        var actionAccessChecker = this.props.isContextActionAllowed && this.props.isContextActionAllowed.bind(null, this.state.activeRow) || function () {
            return true;
        };

        var actionsToShow = Object.keys(this.props.contextMenuActions || {}).filter(actionAccessChecker).reduce(function (availableActions, actionKey) {
            availableActions[actionKey] = _this.props.contextMenuActions[actionKey];
            return availableActions;
        }, {});

        return React.createElement(DataTableContextMenu, {
            target: this.state.contextMenuTarget,
            onRequestClose: this._hideContextMenu,
            actions: actionsToShow,
            activeItem: this.state.activeRow,
            icons: this.props.contextMenuIcons
        });
    },
    renderHeaders: function renderHeaders() {
        return this.state.columns.map(function (headerName, index) {
            return React.createElement(DataTableHeader, { key: index, isOdd: Boolean(index % 2), name: headerName });
        });
    },
    renderRows: function renderRows() {
        var _this2 = this;

        return this.state.dataRows.map(function (dataRowsSource, dataRowsId) {
            return React.createElement(DataTableRow, {
                key: dataRowsId,
                dataSource: dataRowsSource,
                columns: _this2.state.columns,
                isActive: _this2.state.activeRow === dataRowsId,
                itemClicked: _this2.handleRowClick,
                primaryClick: _this2.props.primaryAction || function () {}
            });
        });
    },
    render: function render() {
        return React.createElement(
            'div',
            { className: 'data-table' },
            React.createElement(
                'div',
                { className: 'data-table__headers' },
                this.renderHeaders(),
                React.createElement(DataTableHeader, null)
            ),
            React.createElement(
                'div',
                { className: 'data-table__rows' },
                this.renderRows()
            ),
            this.renderContextMenu()
        );
    },
    handleRowClick: function handleRowClick(event, rowSource) {
        this.setState({
            contextMenuTarget: event.currentTarget,
            showContextMenu: true,
            activeRow: rowSource !== this.state.activeRow ? rowSource : undefined
        });
    },
    _hideContextMenu: function _hideContextMenu() {
        this.setState({
            activeRow: undefined,
            showContextMenu: false
        });
    }
});

export default DataTable;