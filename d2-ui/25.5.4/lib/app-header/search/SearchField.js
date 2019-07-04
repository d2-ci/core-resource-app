var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import styles, { MENU_ITEM_WIDTH } from '../header-bar-styles';
import TextField from 'material-ui/TextField';
import { search, handleKeyPress, setSearchFieldFocusTo, hideWhenNotHovering } from './search.stores';
import IconButton from 'material-ui/IconButton';
import AppsIcon from 'material-ui/svg-icons/navigation/apps';
import ClearIcon from 'material-ui/svg-icons/content/clear';
import { white } from 'material-ui/styles/colors';
import { config } from 'd2/lib/d2';
import addD2Context from '../../component-helpers/addD2Context';
import SearchResults from './SearchResults';
import { Observable } from 'rx';
import log from 'loglevel';
import withStateFrom from '../../component-helpers/withStateFrom';
import { searchStore$ } from './search.stores';

config.i18n.strings.add('app_search_placeholder');

var SearchField = function (_Component) {
    _inherits(SearchField, _Component);

    function SearchField() {
        var _ref;

        _classCallCheck(this, SearchField);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        var _this = _possibleConstructorReturn(this, (_ref = SearchField.__proto__ || Object.getPrototypeOf(SearchField)).call.apply(_ref, [this].concat(args)));

        _this.state = {
            searchValue: ''
        };

        _this._setSearchValue = _this._setSearchValue.bind(_this);
        _this._focusSearchField = _this._focusSearchField.bind(_this);
        _this._onFocus = _this._onFocus.bind(_this);
        _this._onBlur = _this._onBlur.bind(_this);
        _this.clearSearchField = _this.clearSearchField.bind(_this);
        return _this;
    }

    _createClass(SearchField, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            var isCtrlPressed = function isCtrlPressed(event) {
                return event.ctrlKey;
            };
            var isSpaceKey = function isSpaceKey(event) {
                return event.keyCode === 32 || event.key === 'Space';
            };
            var combineFilters = function combineFilters() {
                for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                    args[_key2] = arguments[_key2];
                }

                return function combinedFiltersFn(event) {
                    return args.map(function (filterFn) {
                        return filterFn(event);
                    }).every(function (filterResult) {
                        return filterResult === true;
                    });
                };
            };

            // When Ctrl+Space is pressed focus the search field in the header bar
            this.disposable = Observable.fromEvent(window, 'keyup') // TODO: Using the window global directly is bad for testability
            .filter(combineFilters(isCtrlPressed, isSpaceKey)).subscribe(this._focusSearchField, log.error);
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            if (this.disposable && this.disposable.dispose) {
                this.disposable.dispose();
            }
        }
    }, {
        key: 'render',
        value: function render() {
            return React.createElement(
                'div',
                { style: styles.searchField },
                React.createElement(
                    'div',
                    { style: Object.assign({ width: this.state.hasFocus ? '100%' : '50%' }, styles.searchFieldInnerWrap) },
                    React.createElement(TextField, {
                        fullWidth: true,
                        value: this.props.searchValue || '',
                        onChange: this._setSearchValue,
                        onFocus: this._onFocus,
                        onBlur: this._onBlur,
                        hintText: this.context.d2.i18n.getTranslation('app_search_placeholder'),
                        hintStyle: styles.searchFieldHintText,
                        inputStyle: styles.searchFieldInput,
                        onKeyUp: this._onKeyUp,
                        ref: 'searchBox',
                        underlineFocusStyle: { borderColor: white }
                    }),
                    this.props.searchValue ? React.createElement(ClearIcon, { style: styles.clearIcon, color: white, onClick: this.clearSearchField }) : ''
                ),
                React.createElement(
                    IconButton,
                    { onClick: this._focusSearchField },
                    React.createElement(AppsIcon, { color: white })
                ),
                React.createElement(SearchResults, null)
            );
        }
    }, {
        key: '_focusSearchField',
        value: function _focusSearchField() {
            var searchField = findDOMNode(this.refs.searchBox);

            if (searchField && searchField !== document.activeElement) {
                searchField.querySelector('input').focus();
            }
        }
    }, {
        key: 'clearSearchField',
        value: function clearSearchField() {
            if (this.state.hasFocus) {
                this._focusSearchField();
            }
            search('');
        }
    }, {
        key: '_setSearchValue',
        value: function _setSearchValue(event) {
            this.setState({ hasValue: Boolean(event.target.value) });
            search(event.target.value);
        }
    }, {
        key: '_onFocus',
        value: function _onFocus() {
            this.setState({ hasFocus: true });
            setSearchFieldFocusTo(true);
        }
    }, {
        key: '_onBlur',
        value: function _onBlur() {
            this.setState({ hasFocus: false });
            hideWhenNotHovering();
        }
    }, {
        key: '_onKeyUp',
        value: function _onKeyUp(event) {
            handleKeyPress(event, Math.floor(event.currentTarget.clientWidth / MENU_ITEM_WIDTH));
        }
    }]);

    return SearchField;
}(Component);

export default withStateFrom(searchStore$, addD2Context(SearchField));