var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { Component, PropTypes } from 'react';
import TextField from 'material-ui/TextField/TextField';
import ListSelect from '../list-select/ListSelect.component';
import addD2Context from '../component-helpers/addD2Context';

var ListSelectWithLocalSearch = function (_Component) {
    _inherits(ListSelectWithLocalSearch, _Component);

    function ListSelectWithLocalSearch(props, context) {
        _classCallCheck(this, ListSelectWithLocalSearch);

        var _this = _possibleConstructorReturn(this, (ListSelectWithLocalSearch.__proto__ || Object.getPrototypeOf(ListSelectWithLocalSearch)).call(this, props, context));

        _this._filterList = function (event) {
            _this.setState({
                textSearch: event.target.value
            });
        };

        _this.state = {
            textSearch: ''
        };

        _this.i18n = context.d2.i18n;
        return _this;
    }

    _createClass(ListSelectWithLocalSearch, [{
        key: 'render',
        value: function render() {
            var _this2 = this;

            var listStyle = { width: '100%', outline: 'none', border: 'none', padding: '0rem 1rem', overflowX: 'auto' };

            return React.createElement(
                'div',
                null,
                React.createElement(TextField, {
                    style: { marginLeft: '1rem' },
                    hintText: this.i18n.getTranslation('search_by_name'),
                    onChange: this._filterList,
                    value: this.state.textSearch
                }),
                React.createElement(ListSelect, _extends({}, this.props, {
                    listStyle: listStyle,
                    source: this.props.source.filter(function (option) {
                        return option.label.toLowerCase().indexOf(_this2.state.textSearch.toLowerCase()) !== -1;
                    }),
                    size: 10
                }))
            );
        }
    }]);

    return ListSelectWithLocalSearch;
}(Component);

ListSelectWithLocalSearch.propTypes = {
    source: PropTypes.array.isRequired
};
ListSelectWithLocalSearch.defaultProps = {
    source: []
};

export default addD2Context(ListSelectWithLocalSearch);