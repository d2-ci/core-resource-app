import { PropTypes, createClass, default as React } from 'react';
import AccessMaskSwitches from '../sharing/AccessMaskSwitches.component';

export default createClass({
    propTypes: {
        userGroupAccesses: PropTypes.array,
        onChange: PropTypes.func.isRequired
    },

    getDefaultProps: function getDefaultProps() {
        return {
            userGroupAccesses: [],
            onChange: function onChange() {}
        };
    },
    render: function render() {
        var _this = this;

        var onChange = function onChange(currentItem) {
            // eslint-ignore-line
            return function (newAccessMask) {
                var modifiedUserGroupAccesses = _this.props.userGroupAccesses.map(function (item) {
                    return Object.assign({}, item);
                }).map(function (item) {
                    if (item.id === currentItem.id) {
                        item.access = newAccessMask;
                    }
                    return item;
                });

                _this.props.onChange(modifiedUserGroupAccesses);
            };
        };

        return React.createElement(
            'div',
            null,
            this.props.userGroupAccesses.map(function (item) {
                return React.createElement(AccessMaskSwitches, {
                    accessMask: item.access,
                    name: item.name,
                    label: item.name,
                    onChange: onChange(item)
                });
            })
        );
    }
});