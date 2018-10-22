import React from 'react';
import classes from 'classnames';
import { config } from 'd2/lib/d2';
import Translate from '../i18n/Translate.mixin';

var noop = function noop() {};

config.i18n.strings.add('of_page');

var Pagination = React.createClass({
    displayName: 'Pagination',

    propTypes: {
        hasPreviousPage: React.PropTypes.func,
        hasNextPage: React.PropTypes.func,
        onPreviousPageClick: React.PropTypes.func,
        onNextPageClick: React.PropTypes.func,
        total: React.PropTypes.number,
        currentlyShown: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.number])
    },

    mixins: [Translate],

    getDefaultProps: function getDefaultProps() {
        return {
            hasPreviousPage: noop,
            hasNextPage: noop,
            onPreviousPageClick: noop,
            onNextPageClick: noop,
            total: 0,
            currentlyShown: 0
        };
    },
    render: function render() {
        var _props = this.props,
            hasPreviousPage = _props.hasPreviousPage,
            hasNextPage = _props.hasNextPage,
            onPreviousPageClick = _props.onPreviousPageClick,
            onNextPageClick = _props.onNextPageClick,
            currentlyShown = _props.currentlyShown,
            total = _props.total;

        var pagerButtonClasses = ['material-icons', 'waves-effect'];

        var previousPageClasses = classes(pagerButtonClasses, { 'data-table-pager--previous-page__disabled': !hasPreviousPage() });
        var nextPageClasses = classes(pagerButtonClasses, { 'data-table-pager--next-page__disabled': !hasNextPage() });

        return React.createElement(
            'div',
            { className: 'data-table-pager' },
            React.createElement(
                'ul',
                { className: 'data-table-pager--buttons' },
                total ? React.createElement(
                    'li',
                    { className: 'data-table-pager--page-info' },
                    React.createElement(
                        'span',
                        null,
                        currentlyShown,
                        ' ',
                        '' + this.getTranslation('of_page'),
                        ' ',
                        total
                    )
                ) : '',
                React.createElement(
                    'li',
                    { className: 'data-table-pager--previous-page' },
                    React.createElement(
                        'i',
                        {
                            className: previousPageClasses,
                            onClick: hasPreviousPage() ? onPreviousPageClick : noop
                        },
                        'navigate_before'
                    )
                ),
                React.createElement(
                    'li',
                    { className: 'data-table-pager--next-page' },
                    React.createElement(
                        'i',
                        {
                            className: nextPageClasses,
                            onClick: hasNextPage() ? onNextPageClick : noop
                        },
                        'navigate_next'
                    )
                )
            )
        );
    }
});

export default Pagination;