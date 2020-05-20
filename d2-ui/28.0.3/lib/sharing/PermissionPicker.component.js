/* eslint react/jsx-no-bind: 0 */

import PropTypes from 'prop-types';
import React from 'react';
import FontIcon from 'material-ui/FontIcon';
import MenuItem from 'material-ui/MenuItem';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import { config } from 'd2/lib/d2';

config.i18n.strings.add('can_edit_and_view');
config.i18n.strings.add('can_view_only');
config.i18n.strings.add('no_access');

function getAccessIcon(accessOptions) {
    if (accessOptions.canView) {
        return accessOptions.canEdit ? 'create' : 'remove_red_eye';
    }

    return 'not_interested';
}

function createMenuItem(text, canView, canEdit, isSelected, disabled) {
    return !disabled && React.createElement(MenuItem, {
        insetChildren: true,
        value: { canView: canView, canEdit: canEdit },
        primaryText: text,
        leftIcon: React.createElement(
            FontIcon,
            { className: 'material-icons' },
            isSelected ? 'done' : ''
        )
    });
}

var PermissionPicker = function PermissionPicker(_ref, context) {
    var accessOptions = _ref.accessOptions,
        _onChange = _ref.onChange,
        disabled = _ref.disabled,
        disableWritePermission = _ref.disableWritePermission,
        disableNoAccess = _ref.disableNoAccess;
    return React.createElement(
        IconMenu,
        {
            anchorOrigin: { vertical: 'bottom', horizontal: 'right' },
            touchTapCloseDelay: 1,
            menuStyle: { width: '200px' },
            onChange: function onChange(event, value) {
                return _onChange(value);
            },
            iconButtonElement: React.createElement(
                IconButton,
                {
                    disabled: disabled,
                    iconClassName: 'material-icons'
                },
                getAccessIcon(accessOptions)
            )
        },
        createMenuItem(context.d2.i18n.getTranslation('can_edit_and_view'), true, true, accessOptions.canEdit, disableWritePermission),
        createMenuItem(context.d2.i18n.getTranslation('can_view_only'), true, false, accessOptions.canView && !accessOptions.canEdit),
        createMenuItem(context.d2.i18n.getTranslation('no_access'), false, false, !accessOptions.canView && !accessOptions.canEdit, disableNoAccess)
    );
};

PermissionPicker.propTypes = {
    accessOptions: PropTypes.shape({
        canView: PropTypes.bool.isRequired,
        canEdit: PropTypes.bool
    }).isRequired,
    onChange: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
    disableWritePermission: PropTypes.bool,
    disableNoAccess: PropTypes.bool
};

PermissionPicker.contextTypes = {
    d2: PropTypes.object.isRequired
};

export default PermissionPicker;