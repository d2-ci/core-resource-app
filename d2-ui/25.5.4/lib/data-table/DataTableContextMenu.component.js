var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

import React, { PropTypes } from 'react';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import FontIcon from 'material-ui/FontIcon';
import Popover from 'material-ui/Popover/Popover';
import Paper from 'material-ui/Paper';
import addD2Context from '../component-helpers/addD2Context';

function handleClick(props, action) {
    props.actions[action].apply(props.actions, [props.activeItem]);

    if (props.onRequestClose) {
        props.onRequestClose();
    }
}

function DataTableContextMenu(props, context) {
    var actionList = Object.keys(props.actions).filter(function (menuActionKey) {
        return typeof props.actions[menuActionKey] === 'function';
    });

    var cmStyle = {
        position: 'fixed'
    };
    return React.createElement(
        Popover,
        _extends({}, props, {
            open: Boolean(props.activeItem),
            anchorEl: props.target,
            anchorOrigin: { horizontal: 'middle', vertical: 'center' },
            animated: false,
            style: cmStyle,
            animation: Paper
        }),
        React.createElement(
            Menu,
            { className: 'data-table__context-menu', desktop: true },
            actionList.map(function (action) {
                var iconName = props.icons[action] ? props.icons[action] : action;

                return React.createElement(MenuItem, {
                    key: action,
                    'data-object-id': props.activeItem && props.activeItem.id,
                    className: 'data-table__context-menu__item',
                    onClick: function onClick() {
                        return handleClick(props, action);
                    },
                    primaryText: context.d2.i18n.getTranslation(action),
                    leftIcon: React.createElement(
                        FontIcon,
                        { className: 'material-icons' },
                        iconName
                    )
                });
            })
        )
    );
}

DataTableContextMenu.defaultProps = {
    icons: {},
    actions: {}
};

DataTableContextMenu.propTypes = {
    actions: PropTypes.objectOf(PropTypes.func),
    activeItem: PropTypes.object,
    icons: PropTypes.object,
    target: PropTypes.object,
    onRequestClose: PropTypes.func
};

export default addD2Context(DataTableContextMenu);