import React from 'react';
import log from 'loglevel';

export default React.createClass({
    displayName: 'AppWithD2.component',

    propTypes: {
        children: React.PropTypes.element,
        d2: React.PropTypes.shape({
            then: React.PropTypes.func.isRequired
        })
    },

    childContextTypes: {
        d2: React.PropTypes.object
    },

    getChildContext: function getChildContext() {
        return {
            d2: this.state.d2
        };
    },
    getInitialState: function getInitialState() {
        return {};
    },
    componentDidMount: function componentDidMount() {
        var _this = this;

        if (!this.props.d2) {
            return log.error('D2 is a required prop to <AppWithD2 />');
        }
        this.props.d2.then(function (d2) {
            return _this.setState({ d2: d2 });
        }).catch(function (error) {
            return log.error(error);
        });
    },
    render: function render() {
        var _this2 = this;

        var getChildren = function getChildren() {
            if (!_this2.props.children) {
                return null;
            }
            return React.Children.map(_this2.props.children, function (child) {
                return React.cloneElement(child);
            });
        };

        return React.createElement(
            'div',
            null,
            getChildren()
        );
    }
});