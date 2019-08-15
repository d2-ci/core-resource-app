import camelCaseToUnderscores from 'd2-utilizr/lib/camelCaseToUnderscores';
import React from 'react';
import classes from 'classnames';
import Translate from '../i18n/Translate.mixin';

var DataTableHeader = React.createClass({
    displayName: 'DataTableHeader',

    propTypes: {
        isOdd: React.PropTypes.bool,
        name: React.PropTypes.string
    },

    mixins: [Translate],

    render: function render() {
        var classList = classes('data-table__headers__header', {
            'data-table__headers__header--even': !this.props.isOdd,
            'data-table__headers__header--odd': this.props.isOdd
        });

        return React.createElement(
            'div',
            { className: classList },
            this.props.name ? this.getTranslation(camelCaseToUnderscores(this.props.name)) : null
        );
    }
});

export default DataTableHeader;