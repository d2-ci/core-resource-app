import PropTypes from 'prop-types';
import React from 'react';
import Rule from './Rule.component';

var UserGroupAccess = function UserGroupAccess(_ref) {
    var nameOfGroup = _ref.nameOfGroup,
        groupType = _ref.groupType,
        canView = _ref.canView,
        canEdit = _ref.canEdit,
        onChange = _ref.onChange,
        onRemove = _ref.onRemove;
    return React.createElement(Rule, {
        disableNoAccess: true,
        accessType: groupType,
        primaryText: nameOfGroup,
        onChange: onChange,
        onRemove: onRemove,
        accessOptions: {
            canView: canView,
            canEdit: canEdit
        }
    });
};

UserGroupAccess.propTypes = {
    nameOfGroup: PropTypes.string.isRequired,
    groupType: PropTypes.oneOf(['user', 'userGroup']),
    canView: PropTypes.bool.isRequired,
    canEdit: PropTypes.bool.isRequired,
    onChange: PropTypes.func.isRequired,
    onRemove: PropTypes.func.isRequired
};

export default UserGroupAccess;