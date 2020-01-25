import PropTypes from 'prop-types';
import React from 'react';
import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';

import PermissionPicker from './PermissionPicker.component';

var styles = {
    ruleView: {
        fontWeight: '400',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '4px 8px'
    },
    ruleDescription: {
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        paddingLeft: 16
    }
};

function getAccessIcon(userType) {
    switch (userType) {
        case 'user':
            return 'person';
        case 'userGroup':
            return 'group';
        case 'external':
            return 'public';
        case 'public':
            return 'business';
        default:
            return 'person';
    }
}

var Rule = function Rule(_ref) {
    var accessType = _ref.accessType,
        primaryText = _ref.primaryText,
        secondaryText = _ref.secondaryText,
        accessOptions = _ref.accessOptions,
        onChange = _ref.onChange,
        onRemove = _ref.onRemove,
        disabled = _ref.disabled,
        disableWritePermission = _ref.disableWritePermission,
        disableNoAccess = _ref.disableNoAccess;
    return React.createElement(
        'div',
        { style: styles.ruleView },
        React.createElement(
            FontIcon,
            { className: 'material-icons' },
            getAccessIcon(accessType)
        ),
        React.createElement(
            'div',
            { style: styles.ruleDescription },
            React.createElement(
                'div',
                null,
                primaryText
            ),
            React.createElement(
                'div',
                { style: { color: '#818181', paddingTop: 4 } },
                secondaryText || ' '
            )
        ),
        React.createElement(PermissionPicker, {
            disableWritePermission: disableWritePermission,
            disableNoAccess: disableNoAccess,
            accessOptions: accessOptions,
            onChange: onChange,
            disabled: disabled
        }),
        React.createElement(
            IconButton,
            {
                disabled: !onRemove,
                iconStyle: { color: '#bbbbbb' },
                iconClassName: 'material-icons',
                onClick: onRemove || function () {}
            },
            'clear'
        )
    );
};

Rule.propTypes = {
    accessType: PropTypes.oneOf(['user', 'userGroup', 'external', 'public']).isRequired,
    primaryText: PropTypes.string.isRequired,
    accessOptions: PropTypes.object.isRequired,
    secondaryText: PropTypes.string,
    onChange: PropTypes.func,
    onRemove: PropTypes.func,
    disabled: PropTypes.bool,
    disableWritePermission: PropTypes.bool,
    disableNoAccess: PropTypes.bool
};

export default Rule;