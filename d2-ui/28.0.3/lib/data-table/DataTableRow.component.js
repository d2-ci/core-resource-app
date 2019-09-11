import React, { isValidElement } from 'react';
import classes from 'classnames';
import { isObject } from 'lodash/fp';
import { isString } from 'lodash/fp';
import IconButton from 'material-ui/IconButton';
import MoreVert from 'material-ui/svg-icons/navigation/more-vert';
import addD2Context from '../component-helpers/addD2Context';
import { findValueRenderer } from './data-value/valueRenderers';

function getD2ModelValueType(dataSource, columnName) {
    return dataSource && dataSource.modelDefinition && dataSource.modelDefinition.modelValidations && dataSource.modelDefinition.modelValidations[columnName] && dataSource.modelDefinition.modelValidations[columnName].type;
}

var DataTableRow = addD2Context(React.createClass({
    displayName: 'DataTableRow',

    propTypes: {
        columns: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
        dataSource: React.PropTypes.object,
        isEven: React.PropTypes.bool,
        isOdd: React.PropTypes.bool,
        itemClicked: React.PropTypes.func.isRequired,
        primaryClick: React.PropTypes.func.isRequired
    },

    render: function render() {
        var _this = this;

        var classList = classes('data-table__rows__row', {
            'data-table__rows__row--even': !this.props.isOdd,
            'data-table__rows__row--odd': this.props.isOdd
        });

        var columns = this.props.columns.map(function (columnName, index) {
            var valueDetails = {
                valueType: getD2ModelValueType(_this.props.dataSource, columnName),
                value: _this.props.dataSource[columnName],
                columnName: columnName
            };

            var Value = findValueRenderer(valueDetails);

            return React.createElement(
                'div',
                {
                    key: index,
                    className: 'data-table__rows__row__column',
                    onContextMenu: _this.handleContextClick,
                    onClick: _this.handleClick
                },
                React.createElement(Value, valueDetails)
            );
        });
        return React.createElement(
            'div',
            { className: classList },
            columns,
            React.createElement(
                'div',
                { className: 'data-table__rows__row__column', style: { width: '1%' } },
                React.createElement(
                    IconButton,
                    { tooltip: this.context.d2.i18n.getTranslation('actions'), onClick: this.iconMenuClick },
                    React.createElement(MoreVert, null)
                )
            )
        );
    },
    iconMenuClick: function iconMenuClick(event) {
        this.props.itemClicked(event, this.props.dataSource);
    },
    handleContextClick: function handleContextClick(event) {
        event && event.preventDefault();
        this.props.itemClicked(event, this.props.dataSource);
    },
    handleClick: function handleClick(event) {
        this.props.primaryClick(this.props.dataSource, event);
    }
}));

export default DataTableRow;