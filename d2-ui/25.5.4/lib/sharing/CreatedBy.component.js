import { PropTypes, createClass, default as React } from 'react';
import Translate from '../i18n/Translate.mixin';
import { config } from 'd2/lib/d2';

config.i18n.strings.add('created_by');

export default createClass({
    propTypes: {
        user: PropTypes.shape({
            name: PropTypes.string.isRequired
        }).isRequired
    },

    mixins: [Translate],

    getDefaultProps: function getDefaultProps() {
        return {
            user: {}
        };
    },
    render: function render() {
        var nameToRender = '';
        if (this.props.user && this.props.user.name) {
            nameToRender = this.props.user.name;
        }

        var createdByText = this.getTranslation('created_by') + ': ' + nameToRender;

        return React.createElement(
            'div',
            null,
            createdByText
        );
    }
});