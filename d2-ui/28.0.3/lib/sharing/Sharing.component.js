var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import PropTypes from 'prop-types';
import React from 'react';
import { config } from 'd2/lib/d2';
import Divider from 'material-ui/Divider';
import Subheader from 'material-ui/Subheader';

import Heading from '../headings/Heading.component';
import UserSearch from './UserSearch.component';
import CreatedBy from './CreatedBy.component';
import PublicAccess from './PublicAccess.component';
import ExternalAccess from './ExternalAccess.component';
import UserGroupAccess from './UserGroupAccess.component';

config.i18n.strings.add('who_has_access');

var styles = {
    createdBy: {
        color: '#818181'
    },
    titleBodySpace: {
        paddingTop: 50
    },
    rules: {
        height: '240px',
        overflowY: 'scroll'
    }
};

/**
 * Content of the sharing dialog; a set of components for changing sharing
 * preferences.
 */

var Sharing = function (_React$Component) {
    _inherits(Sharing, _React$Component);

    function Sharing(props) {
        _classCallCheck(this, Sharing);

        var _this = _possibleConstructorReturn(this, (Sharing.__proto__ || Object.getPrototypeOf(Sharing)).call(this, props));

        _this.setAccessListRef = function (ref) {
            _this.accessList = ref;
        };

        _this.publicAccessChanged = function (_ref) {
            var canView = _ref.canView,
                canEdit = _ref.canEdit;

            _this.props.onSharingChanged({
                publicCanView: canView,
                publicCanEdit: canEdit
            });
        };

        _this.externalAccessChanged = function (_ref2) {
            var canView = _ref2.canView;

            _this.props.onSharingChanged({ isSharedExternally: canView });
        };

        _this.accessRulesChanged = function (id, canView, canEdit) {
            var accesses = [].concat(_toConsumableArray(_this.props.accesses)).map(function (accessRule) {
                return accessRule.id === id ? _extends({}, accessRule, { canView: canView, canEdit: canEdit }) : accessRule;
            });

            _this.props.onSharingChanged({ accesses: accesses });
        };

        _this.addUserGroupAccess = function (userGroup) {
            var accesses = [].concat(_toConsumableArray(_this.props.accesses), [userGroup]);
            _this.props.onSharingChanged({ accesses: accesses }, function () {
                _this.scrollAccessListToBottom();
            });
        };

        _this.removeUserGroupAccess = function (userGroupId) {
            var accesses = [].concat(_toConsumableArray(_this.props.accesses)).filter(function (userGroup) {
                return userGroup.id !== userGroupId;
            });
            _this.props.onSharingChanged({ accesses: accesses });
        };

        _this.scrollAccessListToBottom = function () {
            _this.accessList.scrollTop = _this.accessList.scrollHeight;
        };

        _this.accessList = null;
        return _this;
    }

    _createClass(Sharing, [{
        key: 'render',
        value: function render() {
            var _this2 = this;

            return React.createElement(
                'div',
                null,
                React.createElement(Heading, { text: this.props.nameOfSharableItem, level: 2 }),
                React.createElement(CreatedBy, { user: this.props.authorOfSharableItem }),
                React.createElement('div', { style: styles.titleBodySpace }),
                React.createElement(
                    Subheader,
                    null,
                    this.context.d2.i18n.getTranslation('who_has_access')
                ),
                React.createElement(Divider, null),
                React.createElement(
                    'div',
                    { style: styles.rules, ref: this.setAccessListRef },
                    React.createElement(PublicAccess, {
                        canView: this.props.publicCanView,
                        canEdit: this.props.publicCanEdit,
                        disabled: !this.props.canSetPublicAccess,
                        onChange: this.publicAccessChanged
                    }),
                    React.createElement(Divider, null),
                    React.createElement(ExternalAccess, {
                        canView: this.props.isSharedExternally,
                        disabled: !this.props.canSetExternalAccess,
                        onChange: this.externalAccessChanged
                    }),
                    React.createElement(Divider, null),
                    this.props.accesses.map(function (accessRules, index) {
                        return React.createElement(
                            'div',
                            { key: index },
                            React.createElement(UserGroupAccess, {
                                nameOfGroup: accessRules.displayName,
                                groupType: accessRules.type,
                                canView: accessRules.canView,
                                canEdit: accessRules.canEdit

                                // eslint-disable-next-line
                                , onRemove: function onRemove() {
                                    _this2.removeUserGroupAccess(accessRules.id);
                                }

                                // eslint-disable-next-line
                                , onChange: function onChange(newAccessRules) {
                                    _this2.accessRulesChanged(accessRules.id, newAccessRules.canView, newAccessRules.canEdit);
                                }
                            }),
                            React.createElement(Divider, null)
                        );
                    })
                ),
                React.createElement(Divider, null),
                React.createElement(UserSearch, {
                    onSearch: this.props.onSearch,
                    addUserGroupAccess: this.addUserGroupAccess,
                    currentAccesses: this.props.accesses
                })
            );
        }
    }]);

    return Sharing;
}(React.Component);

Sharing.propTypes = {

    /**
     * Author of the shared object.
     */
    authorOfSharableItem: PropTypes.shape({
        id: PropTypes.string,
        name: PropTypes.string
    }).isRequired,

    /**
     * Display name of the shared object.
     */
    nameOfSharableItem: PropTypes.string.isRequired,

    /**
     * Is *true* if the public access options (publicCanView/publicCanEdit)
     * can be changed
     */
    canSetPublicAccess: PropTypes.bool.isRequired,

    /**
     * Is *true* if the external access options (isSharedExternally) can be
     * changed
     */
    canSetExternalAccess: PropTypes.bool.isRequired,

    /**
     * If *true*, the object can currently be found and viewed by all users of
     * the DHIS instance.
     */
    publicCanView: PropTypes.bool.isRequired,

    /**
     * If *true*, the object can currently be found, viewed and changed by all
     * users of the DHIS instance.
     */
    publicCanEdit: PropTypes.bool.isRequired,

    /**
     * If *true*, the object is shared outside of DHIS.
     */
    isSharedExternally: PropTypes.bool.isRequired,

    /**
     * A list of the access preferences of the sharable object. Each entry in
     * the list consists of a type (user or userGroup), an id, a name and
     * whether the user or group can view and/or edit the object.
     */
    accesses: PropTypes.arrayOf(PropTypes.shape({
        type: PropTypes.oneOf(['user', 'userGroup']).isRequired,
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        canView: PropTypes.bool.isRequired,
        canEdit: PropTypes.bool.isRequired
    })).isRequired,

    /**
     * Function that takes an object containing updated sharing preferences and
     * an optional callback fired when the change was successfully posted.
     */
    onSharingChanged: PropTypes.func.isRequired,

    /**
     * Takes a string and a callback, and returns matching users and userGroups.
     */
    onSearch: PropTypes.func.isRequired
};

Sharing.contextTypes = {
    d2: PropTypes.object.isRequired
};

export default Sharing;