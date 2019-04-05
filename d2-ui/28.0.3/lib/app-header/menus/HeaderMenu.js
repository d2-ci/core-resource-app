var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { Component } from 'react';
import Paper from 'material-ui/Paper';
import styles, { MENU_ITEM_WIDTH } from '../header-bar-styles';
import HeaderMenuItems from './HeaderMenuItems';

var HeaderMenu = function (_Component) {
    _inherits(HeaderMenu, _Component);

    function HeaderMenu() {
        var _ref;

        _classCallCheck(this, HeaderMenu);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        var _this = _possibleConstructorReturn(this, (_ref = HeaderMenu.__proto__ || Object.getPrototypeOf(HeaderMenu)).call.apply(_ref, [this].concat(args)));

        _this.state = {};

        _this._mouseEnter = _this._mouseEnter.bind(_this);
        _this._mouseLeave = _this._mouseLeave.bind(_this);
        _this._onScroll = _this._onScroll.bind(_this);
        return _this;
    }

    _createClass(HeaderMenu, [{
        key: 'render',
        value: function render() {
            var itemsPerRow = this.props.rowItemCount;
            var menuWidth = itemsPerRow * MENU_ITEM_WIDTH;
            var _props = this.props,
                name = _props.name,
                children = _props.children;

            var menuStyle = Object.assign({}, styles.dropDownWrap, {
                display: this.state.open ? 'flex' : 'none',
                right: this.state.showScrollBar ? 20 : styles.dropDownWrap.right,
                width: this.state.showScrollBar ? menuWidth + 55 : menuWidth + 35
            }, this.props.menuStyle);

            var useScrollAfterNumberOfRows = this.props.columnItemCount * MENU_ITEM_WIDTH;
            var calculatedHeight = Math.ceil(children.length / itemsPerRow) * MENU_ITEM_WIDTH;
            var innerMenuProps = {
                height: calculatedHeight > useScrollAfterNumberOfRows ? useScrollAfterNumberOfRows : calculatedHeight,
                width: this.state.showScrollBar ? menuWidth + 35 : menuWidth + 55,
                marginRight: this.state.showScrollBar ? 0 : -30,
                onScroll: this._onScroll.bind(this),
                padding: this.props.padding
            };

            return React.createElement(
                'div',
                {
                    style: styles.headerMenu,
                    onMouseEnter: this._mouseEnter,
                    onMouseLeave: this._mouseLeave
                },
                name,
                React.createElement(
                    'div',
                    { style: { paddingTop: 55 } },
                    React.createElement(
                        Paper,
                        { style: menuStyle },
                        React.createElement(
                            HeaderMenuItems,
                            innerMenuProps,
                            children
                        ),
                        this.props.rightSide,
                        this.props.moreButton
                    )
                )
            );
        }
    }, {
        key: '_mouseEnter',
        value: function _mouseEnter(event) {
            this.setState({
                anchor: event.target,
                open: true
            });
        }
    }, {
        key: '_mouseLeave',
        value: function _mouseLeave() {
            this.setState({
                open: false
            });
        }
    }, {
        key: '_onScroll',
        value: function _onScroll(event) {
            this.setState({
                showScrollBar: event.target.scrollTop > 1
            });
        }
    }]);

    return HeaderMenu;
}(Component);

export default HeaderMenu;