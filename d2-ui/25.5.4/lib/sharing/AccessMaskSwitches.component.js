import React, { PropTypes, createClass } from 'react';
import Translate from '../i18n/Translate.mixin';
import Toggle from 'material-ui/Toggle/Toggle';
import ClearFix from 'material-ui/internal/ClearFix';
import { config } from 'd2/lib/d2';

config.i18n.strings.add('can_view');
config.i18n.strings.add('can_edit');

export default createClass({
    propTypes: {
        accessMask: PropTypes.oneOf(['--------', 'r-------', 'rw------']).isRequired,
        onChange: PropTypes.func.isRequired,
        name: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
        style: PropTypes.object,
        disabled: PropTypes.bool
    },

    mixins: [Translate],

    getDefaultProps: function getDefaultProps() {
        return {
            name: '' + Date.now(), // TODO: Not strictly unique, but perhaps good enough.
            accessMask: '--------'
        };
    },
    getInitialState: function getInitialState() {
        return {
            view: this.hasView(),
            edit: this.hasEdit()
        };
    },
    onChange: function onChange() {
        var viewChar = this.state.view || this.state.edit ? 'r' : '-';
        var editChar = this.state.edit ? 'w' : '-';
        var accessMask = '' + viewChar + editChar + '------';

        if (this.props.onChange) {
            this.props.onChange(accessMask);
        }
    },
    render: function render() {
        var style = Object.assign({
            marginTop: '.5rem',
            paddingTop: '.5rem',
            borderTop: '1px solid #CCC'
        }, this.props.style);

        return React.createElement(
            'div',
            { style: style, classnName: 'sharing--access-mask-switches' },
            React.createElement(
                'div',
                null,
                this.props.label
            ),
            React.createElement(
                ClearFix,
                null,
                React.createElement(Toggle, {
                    style: {
                        width: '40%',
                        float: 'left'
                    },
                    ref: 'toggleView',
                    name: this.props.name + 'View',
                    label: this.getTranslation('can_view'),
                    checked: this.hasView(),
                    onToggle: this.setView,
                    disabled: this.props.disabled || this.hasEdit()
                }),
                React.createElement(Toggle, {
                    style: {
                        width: '40%',
                        float: 'right'
                    },
                    ref: 'toggleEdit',
                    name: this.props.name + 'Edit',
                    label: this.getTranslation('can_edit'),
                    checked: this.hasEdit(),
                    onToggle: this.setEdit,
                    disabled: this.props.disabled
                })
            )
        );
    },
    hasView: function hasView() {
        return (/^r/.test(this.props.accessMask)
        );
    },
    setView: function setView() {
        var _this = this;

        this.setState({
            view: !this.state.view
        }, function () {
            return _this.onChange();
        });
    },
    hasEdit: function hasEdit() {
        return (/^rw/.test(this.props.accessMask)
        );
    },
    setEdit: function setEdit() {
        var _this2 = this;

        this.setState({
            view: true,
            edit: !this.state.edit
        }, function () {
            return _this2.onChange();
        });
    }
});