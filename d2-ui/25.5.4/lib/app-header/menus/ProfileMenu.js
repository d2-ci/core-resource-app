var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

import React from 'react';
import Avatar from 'material-ui/Avatar';
import HeaderMenu from './HeaderMenu';
import HeaderMenuItem from './HeaderMenuItem';
import styles, { applyUserStyle } from '../header-bar-styles';
import addD2Context from '../../component-helpers/addD2Context';
import FlatButton from 'material-ui/FlatButton';
import getBaseUrlFromD2ApiUrl from '../getBaseUrlFromD2ApiUrl';

var getBaseUrl = getBaseUrlFromD2ApiUrl;

var ProfileMenu = addD2Context(function ProfileMenu(props, _ref) {
    var d2 = _ref.d2;
    var currentUser = props.currentUser,
        items = props.items;

    var menuItems = items.map(function (item, index) {
        return React.createElement(HeaderMenuItem, _extends({ key: index }, item));
    });

    if (!currentUser.firstName) {
        return React.createElement('div', null);
    }

    var rightSideStyle = {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '1rem',
        justifyContent: 'space-between',
        borderLeft: '1px solid #CCC',
        backgroundColor: '#F5F5F5'
    };

    // TODO: Pull out these styles
    var rightSide = React.createElement(
        'div',
        { style: rightSideStyle },
        React.createElement(
            'div',
            { style: { display: 'flex', alignItems: 'center', flexDirection: 'column' } },
            React.createElement(
                Avatar,
                { size: 60, style: styles.avatarBig },
                currentUser.firstName.charAt(0) + ' ' + currentUser.surname.charAt(0)
            ),
            React.createElement(
                'div',
                null,
                React.createElement(
                    'div',
                    { style: { width: '100%', marginTop: '1rem', lineHeight: '1.5rem', fontWeight: 'bold' } },
                    currentUser.displayName
                ),
                React.createElement(
                    'div',
                    { style: { width: '100%', lineHeight: '1.5rem' } },
                    currentUser.email
                )
            )
        ),
        React.createElement(
            FlatButton,
            { style: { width: '100%', textAlign: 'center' }, href: getBaseUrl(d2) + '/dhis-web-commons-security/logout.action' },
            d2.i18n.getTranslation('log_out')
        )
    );

    return React.createElement(
        HeaderMenu,
        {
            name: React.createElement(
                Avatar,
                { size: 32, style: styles.avatar },
                currentUser.firstName.charAt(0) + ' ' + currentUser.surname.charAt(0)
            ),
            rowItemCount: props.rowItemCount,
            columnItemCount: props.columnItemCount,
            rightSide: rightSide,
            width: 700,
            menuStyle: {
                flexDirection: 'row',
                width: 600,
                padding: '0'
            },
            padding: '1rem'
        },
        menuItems
    );
});

export default ProfileMenu;