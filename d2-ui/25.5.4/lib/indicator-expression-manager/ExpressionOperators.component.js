import React from 'react';
import classes from 'classnames';
import FlatButton from 'material-ui/FlatButton/FlatButton';

var ExpressionOperators = React.createClass({
    displayName: 'ExpressionOperators',

    propTypes: {
        operatorClicked: React.PropTypes.func.isRequired
    },

    render: function render() {
        var classList = classes('expression-operators');

        var operatorButtonStyle = {
            minWidth: 50
        };

        return React.createElement(
            'div',
            { className: classList },
            React.createElement(
                FlatButton,
                { style: operatorButtonStyle, onClick: this.createOperatorClick('(') },
                '('
            ),
            React.createElement(
                FlatButton,
                { style: operatorButtonStyle, onClick: this.createOperatorClick(')') },
                ')'
            ),
            React.createElement(
                FlatButton,
                { style: operatorButtonStyle, onClick: this.createOperatorClick(' * ') },
                '*'
            ),
            React.createElement(
                FlatButton,
                { style: operatorButtonStyle, onClick: this.createOperatorClick(' / ') },
                '/'
            ),
            React.createElement(
                FlatButton,
                { style: operatorButtonStyle, onClick: this.createOperatorClick(' + ') },
                '+'
            ),
            React.createElement(
                FlatButton,
                { style: operatorButtonStyle, onClick: this.createOperatorClick(' - ') },
                '-'
            ),
            React.createElement(
                FlatButton,
                { style: operatorButtonStyle, onClick: this.createOperatorClick(' [days] ') },
                'Days'
            )
        );
    },
    createOperatorClick: function createOperatorClick(operatorValue) {
        return function operatorButtonClick() {
            this.props.operatorClicked(operatorValue);
        }.bind(this);
    }
});

export default ExpressionOperators;