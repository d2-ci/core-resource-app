var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { Component, PropTypes } from 'react';

var ExpressionFormula = function (_Component) {
    _inherits(ExpressionFormula, _Component);

    function ExpressionFormula() {
        var _ref;

        var _temp, _this, _ret;

        _classCallCheck(this, ExpressionFormula);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = ExpressionFormula.__proto__ || Object.getPrototypeOf(ExpressionFormula)).call.apply(_ref, [this].concat(args))), _this), _this._handleFomulaChange = function (event) {
            var formulaValue = event.target.value;

            if (_this.props.onFormulaChange) {
                _this.props.onFormulaChange(formulaValue);
            }
        }, _temp), _possibleConstructorReturn(_this, _ret);
    }

    _createClass(ExpressionFormula, [{
        key: 'render',
        value: function render() {
            var textAreaStyle = {
                margin: 0,
                width: '100%',
                height: 200,
                border: '1px solid #DDD',
                padding: '1rem',
                outline: 'none',
                resize: 'vertical',
                boxSizing: 'border-box'
            };

            return React.createElement(
                'div',
                { className: 'expression-formula' },
                React.createElement('textarea', {
                    onChange: this._handleFomulaChange,
                    value: this.props.formula,
                    style: textAreaStyle
                })
            );
        }
    }]);

    return ExpressionFormula;
}(Component);

export default ExpressionFormula;


ExpressionFormula.propTypes = {
    onFormulaChange: PropTypes.func.isRequired,
    formula: PropTypes.string
};