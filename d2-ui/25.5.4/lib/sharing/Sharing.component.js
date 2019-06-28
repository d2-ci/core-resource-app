import { PropTypes, createClass, default as React } from 'react';
import Heading from '../headings/Heading.component';
import CreatedBy from './CreatedBy.component';
import ExternalAccess from './ExternalAccess.component';
import PublicAccess from './PublicAccess.component';
import sharingActions from './sharing.actions';
import sharingStore from './sharing.store';
import UserGroupAccesses from './UserGroupAccesses.component';
import LoadingMask from '../loading-mask/LoadingMask.component';
import AutoComplete from '../auto-complete/AutoComplete.component';
import { config } from 'd2/lib/d2';
import log from 'loglevel';

config.i18n.strings.add('external_access');
config.i18n.strings.add('public_access');

function noop() {}

export default createClass({
    propTypes: {
        objectToShare: PropTypes.shape({
            name: PropTypes.string.isRequired,
            user: PropTypes.object.isRequired
        }).isRequired
    },

    getInitialState: function getInitialState() {
        return {
            objectToShare: null
        };
    },
    componentWillMount: function componentWillMount() {
        var _this = this;

        sharingActions.loadObjectSharingState(this.props.objectToShare).subscribe(noop, function (error) {
            log.error(error.message);
        });

        this.disposable = sharingStore.subscribe(function (newState) {
            _this.setState({
                objectToShare: newState
            });
        });
    },
    componentWillReceiveProps: function componentWillReceiveProps(newProps) {
        sharingActions.loadObjectSharingState(newProps.objectToShare);
    },
    componentWillUnmount: function componentWillUnmount() {
        this.disposable && this.disposable.dispose();
    },
    render: function render() {
        var _this2 = this;

        var loadingMaskStyle = {
            position: 'relative'
        };

        if (!this.state.objectToShare) {
            return React.createElement(LoadingMask, { style: loadingMaskStyle, size: 1 });
        }

        function doesNotContainItemWithId() {
            var collection = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

            return function checkForItemWithId() {
                var object = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

                return collection.every(function (item) {
                    return item.id !== object.id;
                });
            };
        }

        var canSetExternalAccess = function canSetExternalAccess() {
            return Boolean(_this2.state.objectToShare.meta && _this2.state.objectToShare.meta.allowExternalAccess);
        };

        var canSetPublicAccess = function canSetPublicAccess() {
            return Boolean(_this2.state.objectToShare.meta && _this2.state.objectToShare.meta.allowPublicAccess);
        };

        // TODO: Is it true that the user should not be able to see externalAccess when he/she can not set it?
        var getExternalAccessValue = function getExternalAccessValue() {
            if (canSetExternalAccess()) {
                return _this2.state.objectToShare.externalAccess;
            }
            return false;
        };

        return React.createElement(
            'div',
            null,
            React.createElement(Heading, { text: this.props.objectToShare.name, level: 2 }),
            React.createElement(CreatedBy, { user: this.state.objectToShare.user }),
            React.createElement(
                'div',
                null,
                React.createElement(AutoComplete, { forType: 'userGroup',
                    onSuggestionClicked: this.addUserGroup,
                    filterForSuggestions: doesNotContainItemWithId(this.state.objectToShare.userGroupAccesses)
                })
            ),
            React.createElement(ExternalAccess, { disabled: !canSetExternalAccess(), externalAccess: getExternalAccessValue(), onChange: this.updatedExternalAccess }),
            React.createElement(PublicAccess, { disabled: !canSetPublicAccess(), publicAccess: this.state.objectToShare.publicAccess, onChange: this.updatePublicAccess }),
            React.createElement(UserGroupAccesses, { userGroupAccesses: this.state.objectToShare.userGroupAccesses, onChange: this.updateUserGroupAccesses })
        );
    },
    addUserGroup: function addUserGroup(userGroup) {
        sharingActions.userGroupAcessesChanged(this.state.objectToShare.userGroupAccesses.concat(userGroup));
    },
    updateUserGroupAccesses: function updateUserGroupAccesses(userGroupAccesses) {
        sharingActions.userGroupAcessesChanged(userGroupAccesses);
    },
    updatePublicAccess: function updatePublicAccess(publicAccessValue) {
        sharingActions.publicAccessChanged(publicAccessValue);
    },
    updatedExternalAccess: function updatedExternalAccess(externalAccessValue) {
        sharingActions.externalAccessChanged(externalAccessValue);
    }
});