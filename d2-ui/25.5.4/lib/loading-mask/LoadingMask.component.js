import React from 'react';
import CircularProgress from 'material-ui/CircularProgress';

export default React.createClass({
    displayName: 'LoadingMask.component',

    propTypes: {
        style: React.PropTypes.object,
        size: React.PropTypes.number
    },

    getDefaultProps: function getDefaultProps() {
        return {
            style: {},
            size: 1.5
        };
    },
    render: function render() {
        var loadingStatusMask = {
            left: '45%',
            position: 'fixed',
            top: '45%'
        };

        return React.createElement(CircularProgress, {
            mode: 'indeterminate',
            size: this.props.size,
            style: Object.assign(loadingStatusMask, this.props.style)
        });
    }
});