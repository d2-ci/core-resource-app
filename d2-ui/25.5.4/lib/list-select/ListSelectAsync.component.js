var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

import React from 'react';
import ListSelect from './ListSelect.component';
import { Observable } from 'rx';
import log from 'loglevel';

var ListSelectAsync = React.createClass({
    displayName: 'ListSelectAsync',

    propTypes: {
        source: React.PropTypes.instanceOf(Observable),
        onItemDoubleClick: React.PropTypes.func.isRequired,
        listStyle: React.PropTypes.object
    },

    getInitialState: function getInitialState() {
        return {
            listSource: []
        };
    },
    componentWillMount: function componentWillMount() {
        var _this = this;

        if (!this.props.source) {
            return;
        }

        this.disposable = this.props.source.subscribe(function (listValues) {
            return _this.setState({ listSource: listValues });
        }, function (error) {
            return log.error(error);
        });
    },
    componentWillUnmount: function componentWillUnmount() {
        this.disposable && this.disposable.dispose();
    },
    render: function render() {
        return React.createElement(ListSelect, _extends({}, this.props, {
            onItemDoubleClick: this.props.onItemDoubleClick,
            source: this.state.listSource,
            listStyle: this.props.listStyle
        }));
    }
});

export default ListSelectAsync;