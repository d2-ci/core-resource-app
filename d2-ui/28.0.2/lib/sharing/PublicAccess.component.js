/* eslint react/jsx-no-bind: 0 */

import PropTypes from 'prop-types';
import React from 'react';
import { config } from 'd2/lib/d2';
import Rule from './Rule.component';

config.i18n.strings.add('public_access');
config.i18n.strings.add('anyone_can_find_and_view');
config.i18n.strings.add('anyone_can_find_view_and_edit');

function constructSecondaryText(canView, canEdit, context) {
    if (canView) {
        return canEdit ? context.d2.i18n.getTranslation('anyone_can_find_view_and_edit') : context.d2.i18n.getTranslation('anyone_can_find_and_view');
    }

    return 'No access';
}

var PublicAccess = function PublicAccess(_ref, context) {
    var canView = _ref.canView,
        canEdit = _ref.canEdit,
        disabled = _ref.disabled,
        onChange = _ref.onChange;
    return React.createElement(Rule, {
        accessType: 'public',
        disabled: disabled,
        primaryText: context.d2.i18n.getTranslation('public_access'),
        secondaryText: constructSecondaryText(canView, canEdit, context),
        onChange: onChange,
        accessOptions: { canView: canView, canEdit: canEdit }
    });
};

PublicAccess.propTypes = {
    canView: PropTypes.bool.isRequired,
    canEdit: PropTypes.bool.isRequired,
    onChange: PropTypes.func.isRequired,
    disabled: PropTypes.bool
};

PublicAccess.contextTypes = {
    d2: PropTypes.object.isRequired
};

export default PublicAccess;