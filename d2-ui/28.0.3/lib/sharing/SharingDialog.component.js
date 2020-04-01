var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/* eslint no-console: 0 */

import { config, getInstance } from 'd2/lib/d2';
import Dialog from 'material-ui/Dialog/Dialog';
import FlatButton from 'material-ui/FlatButton/FlatButton';
import Snackbar from 'material-ui/Snackbar';
import PropTypes from 'prop-types';
import React from 'react';
import Sharing from './Sharing.component';
import LoadingMask from '../loading-mask/LoadingMask.component';

config.i18n.strings.add('share');
config.i18n.strings.add('close');
config.i18n.strings.add('no_manage_access');

function cachedAccessTypeToString(canView, canEdit) {
    if (canView) {
        return canEdit ? 'rw------' : 'r-------';
    }

    return '--------';
}

function transformAccessObject(access, type) {
    return {
        id: access.id,
        name: access.name,
        displayName: access.displayName,
        type: type,
        canView: access.access && access.access.includes('r'),
        canEdit: access.access && access.access.includes('rw')
    };
}

function transformObjectStructure(apiMeta, apiObject) {
    var userGroupAccesses = !apiObject.userGroupAccesses ? [] : apiObject.userGroupAccesses.map(function (access) {
        return transformAccessObject(access, 'userGroup');
    });

    var userAccesses = !apiObject.userAccesses ? [] : apiObject.userAccesses.map(function (access) {
        return transformAccessObject(access, 'user');
    });

    var combinedAccesses = userGroupAccesses.concat(userAccesses);
    var authorOfSharableItem = apiObject.user && {
        id: apiObject.user.id,
        name: apiObject.user.name
    };

    return {
        authorOfSharableItem: authorOfSharableItem,
        nameOfSharableItem: apiObject.name,
        canSetPublicAccess: apiMeta.allowPublicAccess,
        canSetExternalAccess: apiMeta.allowExternalAccess,
        publicCanView: apiObject.publicAccess.includes('r'),
        publicCanEdit: apiObject.publicAccess.includes('rw'),
        isSharedExternally: apiObject.externalAccess,
        accesses: combinedAccesses
    };
}

/**
 * A pop-up dialog for changing sharing preferences for a sharable object.
 */

var SharingDialog = function (_React$Component) {
    _inherits(SharingDialog, _React$Component);

    function SharingDialog(props) {
        _classCallCheck(this, SharingDialog);

        var _this = _possibleConstructorReturn(this, (SharingDialog.__proto__ || Object.getPrototypeOf(SharingDialog)).call(this, props));

        _this.onSearchRequest = function (searchText) {
            var apiInstance = _this.state.api;

            return apiInstance.get('sharing/search', { key: searchText }).then(function (searchResult) {
                var transformedResult = searchResult.users.map(function (user) {
                    return transformAccessObject(user, 'user');
                });

                return transformedResult.concat(searchResult.userGroups.map(function (userGroup) {
                    return transformAccessObject(userGroup, 'userGroup');
                }));
            });
        };

        _this.onSharingChanged = function (updatedAttributes, onSuccess) {
            var objectToShare = _extends({}, _this.state.objectToShare, updatedAttributes);

            var apiObject = _this.restoreObjectStructure(objectToShare);

            return _this.state.api.post('sharing?type=' + _this.props.type + '&id=' + _this.props.id, apiObject).then(function (_ref) {
                var httpStatus = _ref.httpStatus,
                    message = _ref.message;

                if (httpStatus === 'OK') {
                    _this.setState({
                        objectToShare: objectToShare,
                        apiObject: apiObject
                    }, function () {
                        if (onSuccess) onSuccess();
                    });
                } else {
                    console.warn('Failed to post changes.');
                    console.warn('SERVER SAID:', message);
                }

                return message;
            }).catch(function (_ref2) {
                var message = _ref2.message;

                console.warn('Failed to post changes.');
                console.warn('SERVER SAID:', message);
            });
        };

        _this.closeSharingDialog = function () {
            _this.props.onRequestClose(_this.state.apiObject.object);
        };

        _this.state = {
            accessForbidden: false,
            apiObject: null,
            objectToShare: null
        };

        if (_this.props.open) {
            _this.loadObjectFromApi();
        }
        return _this;
    }

    _createClass(SharingDialog, [{
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(nextProps) {
            if (nextProps.id !== this.props.id) {
                this.setState({
                    accessForbidden: false,
                    objectToShare: null
                });

                if (nextProps.open) this.loadObjectFromApi();
            }

            if (!this.props.open && nextProps.open) {
                this.loadObjectFromApi();
            }
        }
    }, {
        key: 'loadObjectFromApi',
        value: function loadObjectFromApi() {
            var _this2 = this;

            getInstance().then(function (d2) {
                var apiInstance = d2.Api.getApi();
                apiInstance.get('sharing', { type: _this2.props.type, id: _this2.props.id }).then(function (apiObject) {
                    _this2.setState({
                        api: apiInstance,
                        apiObject: apiObject,
                        objectToShare: transformObjectStructure(apiObject.meta, apiObject.object)
                    });
                }).catch(function () {
                    _this2.setState({
                        accessForbidden: true
                    });
                });
            });
        }
    }, {
        key: 'restoreObjectStructure',
        value: function restoreObjectStructure(transformedObject) {
            var userAccesses = [];
            var userGroupAccesses = [];

            transformedObject.accesses.forEach(function (access) {
                var apiAccess = {
                    id: access.id,
                    name: access.name,
                    displayName: access.name,
                    access: cachedAccessTypeToString(access.canView, access.canEdit)
                };

                if (access.type === 'user') {
                    userAccesses.push(apiAccess);
                } else {
                    userGroupAccesses.push(apiAccess);
                }
            });

            return {
                meta: this.state.apiObject.meta,
                object: _extends({}, this.state.apiObject.object, {
                    userAccesses: userAccesses,
                    userGroupAccesses: userGroupAccesses,

                    publicAccess: cachedAccessTypeToString(transformedObject.publicCanView, transformedObject.publicCanEdit),
                    externalAccess: transformedObject.isSharedExternally
                })
            };
        }
    }, {
        key: 'render',
        value: function render() {
            var sharingDialogActions = [React.createElement(FlatButton, {
                label: this.context.d2.i18n.getTranslation('close'),
                onClick: this.closeSharingDialog
            })];

            var loadingMaskStyle = {
                position: 'relative'
            };

            if (!this.state.objectToShare) {
                if (this.state.accessForbidden) {
                    return React.createElement(Snackbar, {
                        open: true,
                        message: this.context.d2.i18n.getTranslation('no_manage_access'),
                        autoHideDuration: 3000
                    });
                }

                if (this.props.open) {
                    return React.createElement(LoadingMask, { style: loadingMaskStyle, size: 1 });
                }

                return null;
            }

            return React.createElement(
                Dialog,
                _extends({
                    open: this.props.open,
                    title: this.context.d2.i18n.getTranslation('share'),
                    actions: sharingDialogActions,
                    autoDetectWindowHeight: true,
                    autoScrollBodyContent: true,
                    onRequestClose: this.closeSharingDialog
                }, this.props),
                React.createElement(Sharing, {
                    authorOfSharableItem: this.state.objectToShare.authorOfSharableItem,
                    nameOfSharableItem: this.state.objectToShare.nameOfSharableItem,
                    canSetPublicAccess: this.state.objectToShare.canSetPublicAccess,
                    canSetExternalAccess: this.state.objectToShare.canSetExternalAccess,
                    publicCanView: this.state.objectToShare.publicCanView,
                    publicCanEdit: this.state.objectToShare.publicCanEdit,
                    isSharedExternally: this.state.objectToShare.isSharedExternally,
                    accesses: this.state.objectToShare.accesses,
                    onSharingChanged: this.onSharingChanged,
                    onSearch: this.onSearchRequest
                })
            );
        }
    }]);

    return SharingDialog;
}(React.Component);

SharingDialog.propTypes = {
    /**
     * Decides whether the dialog should be open or closed.
     */
    open: PropTypes.bool.isRequired,

    /**
     * Function to be called when the dialog is closed. The function is called
     * with the updated sharing preferences as the first and only argument.
     */
    onRequestClose: PropTypes.func.isRequired,

    /**
     * Type of the sharable object.
     */
    type: PropTypes.string.isRequired,

    /**
     * Id of the sharable object.
     */
    id: PropTypes.string.isRequired
};

SharingDialog.contextTypes = {
    d2: PropTypes.object.isRequired
};

export default SharingDialog;