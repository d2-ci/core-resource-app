var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { config } from 'd2/lib/d2';
import AutoComplete from 'material-ui/AutoComplete';
import PermissionPicker from './PermissionPicker.component';

config.i18n.strings.add('add_users_and_user_groups');
config.i18n.strings.add('enter_names');

var styles = {
    container: {
        fontWeight: '400',
        marginTop: 16,
        padding: 16,
        backgroundColor: '#F5F5F5',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
    },

    innerContainer: {
        display: 'flex',
        flexDirection: 'row',
        flex: 1
    },

    title: {
        color: '#818181',
        paddingBottom: 8
    },

    searchBox: {
        backgroundColor: 'white',
        boxShadow: '2px 2px 2px #cccccc',
        padding: '0px 16px',
        marginRight: '16px'
    }
};

function debounce(inner) {
    var ms = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

    var timer = null;
    var resolves = [];

    return function () {
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        clearTimeout(timer);
        timer = setTimeout(function () {
            var result = inner.apply(undefined, args);
            resolves.forEach(function (r) {
                return r(result);
            });
            resolves = [];
        }, ms);

        return new Promise(function (r) {
            return resolves.push(r);
        });
    };
}

var UserSearch = function (_Component) {
    _inherits(UserSearch, _Component);

    function UserSearch(props) {
        _classCallCheck(this, UserSearch);

        var _this = _possibleConstructorReturn(this, (UserSearch.__proto__ || Object.getPrototypeOf(UserSearch)).call(this, props));

        _this.accessOptionsChanged = function (_ref) {
            var canView = _ref.canView,
                canEdit = _ref.canEdit;

            _this.setState({
                initialViewAccess: canView,
                initialEditAccess: canEdit
            });
        };

        _this.groupWasSelected = function (chosenRequest, index) {
            if (index === -1) return;
            _this.setState({ searchText: '' });
            var selectedGroup = _this.state.searchResult[index];
            _this.props.addUserGroupAccess(_extends({}, selectedGroup, {
                canView: _this.state.initialViewAccess,
                canEdit: _this.state.initialEditAccess
            }));
        };

        _this.handleUpdateInput = function (searchText) {
            _this.setState({ searchText: searchText });
            _this.debouncedSearch(searchText);
        };

        _this.generousFilter = function () {
            return true;
        };

        _this.state = {
            initialViewAccess: true,
            initialEditAccess: true,
            searchText: '',
            searchResult: []
        };

        _this.debouncedSearch = debounce(_this.fetchSearchResult.bind(_this), 300);
        return _this;
    }

    _createClass(UserSearch, [{
        key: 'fetchSearchResult',
        value: function fetchSearchResult(searchText) {
            var _this2 = this;

            if (searchText === '') {
                this.setState({ searchResult: [] });
            } else {
                this.props.onSearch(searchText).then(function (searchResult) {
                    var noDuplicates = searchResult.filter(function (result) {
                        return !_this2.props.currentAccesses.some(function (access) {
                            return access.id === result.id;
                        });
                    });
                    _this2.setState({ searchResult: noDuplicates });
                });
            }
        }
    }, {
        key: 'render',
        value: function render() {
            return React.createElement(
                'div',
                { style: styles.container },
                React.createElement(
                    'div',
                    { style: styles.title },
                    this.context.d2.i18n.getTranslation('add_users_and_user_groups')
                ),
                React.createElement(
                    'div',
                    { style: styles.innerContainer },
                    React.createElement(AutoComplete, {
                        dataSource: this.state.searchResult,
                        dataSourceConfig: { text: 'displayName', value: 'id' },
                        filter: this.generousFilter,
                        fullWidth: true,
                        hintText: this.context.d2.i18n.getTranslation('enter_names'),
                        onNewRequest: this.groupWasSelected,
                        onUpdateInput: this.handleUpdateInput,
                        openOnFocus: true,
                        searchText: this.state.searchText,
                        style: styles.searchBox,
                        underlineShow: false
                    }),
                    React.createElement(PermissionPicker, {
                        disableNoAccess: true,
                        onChange: this.accessOptionsChanged,
                        accessOptions: {
                            canView: this.state.initialViewAccess,
                            canEdit: this.state.initialEditAccess
                        }
                    })
                )
            );
        }
    }]);

    return UserSearch;
}(Component);

UserSearch.propTypes = {
    onSearch: PropTypes.func.isRequired,
    addUserGroupAccess: PropTypes.func.isRequired,
    currentAccesses: PropTypes.array.isRequired
};

UserSearch.contextTypes = {
    d2: PropTypes.object.isRequired
};

export default UserSearch;