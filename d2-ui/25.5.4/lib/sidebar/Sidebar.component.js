import React from 'react';
import List from 'material-ui/List/List';
import ListItem from 'material-ui/List/ListItem';
import TextField from 'material-ui/TextField';
import FontIcon from 'material-ui/FontIcon';

var styles = {
    container: {
        padding: '16px 32px 0 24px',
        position: 'relative',
        flex: 1
    },
    closeButton: {
        position: 'absolute',
        cursor: 'pointer',
        top: '2rem',
        right: '.75rem',
        fontSize: '1rem',
        color: '#AAA'
    },
    list: {
        paddingTop: 0,
        paddingBottom: 0,
        backgroundColor: 'transparent',
        marginTop: 16
    },
    item: {
        fontSize: 14,
        borderRadius: 5,
        margin: '0 8px'
    },
    activeItem: {
        fontSize: 14,
        fontWeight: 700,
        color: '#2196f3',
        backgroundColor: '#e0e0e0',
        borderRadius: 5,
        margin: '0 8px'
    },
    sidebar: {
        backgroundColor: '#f3f3f3',
        overflowY: 'auto',
        width: 295
    }
};

var Sidebar = React.createClass({
    displayName: 'Sidebar',

    propTypes: {
        sections: React.PropTypes.arrayOf(React.PropTypes.shape({
            key: React.PropTypes.string,
            label: React.PropTypes.string,
            icon: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.element])
        })).isRequired,
        currentSection: React.PropTypes.string,
        onChangeSection: React.PropTypes.func.isRequired,
        onSectionClick: React.PropTypes.func,
        showSearchField: React.PropTypes.bool,
        searchFieldLabel: React.PropTypes.string,
        onChangeSearchText: React.PropTypes.func,
        sideBarButtons: React.PropTypes.element,
        styles: React.PropTypes.shape({
            leftBar: React.PropTypes.object
        })
    },

    contextTypes: {
        d2: React.PropTypes.object,
        muiTheme: React.PropTypes.object
    },

    getDefaultProps: function getDefaultProps() {
        return {
            showSearchField: false,
            styles: {
                leftBar: {}
            },
            onSectionClick: function onSectionClick() {}
        };
    },
    getInitialState: function getInitialState() {
        return {
            currentSection: this.props.currentSection || this.props.sections[0] && this.props.sections[0].key,
            searchText: ''
        };
    },
    componentWillReceiveProps: function componentWillReceiveProps(props) {
        var _this = this;

        if (props.currentSection) {
            this.setState({ currentSection: props.currentSection });
        }

        if (props.searchText && props.searchText !== this.state.searchText) {
            this.setState({ searchText: props.searchText }, function () {
                _this.changeSearchText();
            });
        }
    },
    setSection: function setSection(key) {
        // TODO: Refactor as this behavior is sort of silly. The current version of the SideBar with managed state should
        // probably be a HoC and a simpler version of the header bar should be available for more dynamic scenarios.
        this.props.onSectionClick(key);

        if (key !== this.state.currentSection) {
            this.setState({ currentSection: key });
            this.props.onChangeSection(key);
        }
    },
    changeSearchText: function changeSearchText() {
        var _this2 = this;

        this.setState({ searchText: this.searchBox.getValue() }, function () {
            if (_this2.props.onChangeSearchText) {
                _this2.props.onChangeSearchText(_this2.state.searchText);
            }
        });
    },
    _clear: function _clear() {
        var _this3 = this;

        this.setState({ searchText: '' }, function () {
            if (_this3.props.onChangeSearchText) {
                _this3.props.onChangeSearchText(_this3.state.searchText);
            }
        });
    },
    clearSearchBox: function clearSearchBox() {
        this.setState({ searchText: '' });
    },
    renderSidebarButtons: function renderSidebarButtons() {
        if (this.props.sideBarButtons) {
            return React.createElement(
                'div',
                { style: { padding: '1rem 0 0' } },
                this.props.sideBarButtons
            );
        }
        return null;
    },
    renderSearchField: function renderSearchField() {
        var _this4 = this;

        var d2 = this.context.d2;

        if (this.props.showSearchField) {
            return React.createElement(
                'div',
                { style: styles.container },
                React.createElement(TextField, {
                    hintText: !!this.props.searchFieldLabel ? this.props.searchFieldLabel : d2.i18n.getTranslation('search'),
                    style: { width: '100%' },
                    value: this.state.searchText,
                    onChange: this.changeSearchText,
                    ref: function ref(_ref) {
                        _this4.searchBox = _ref;
                    }
                }),
                !!this.state.searchText ? React.createElement(
                    FontIcon,
                    { style: styles.closeButton, className: 'material-icons', onClick: this._clear },
                    'clear'
                ) : undefined
            );
        }

        return null;
    },
    renderSections: function renderSections() {
        var _this5 = this;

        return React.createElement(
            List,
            { style: styles.list },
            this.props.sections.map(function (section) {
                var listItemStyle = section.key === _this5.state.currentSection && !_this5.state.searchText ? styles.activeItem : styles.item;
                var icon = typeof section.icon === 'string' || section.icon instanceof String ? React.createElement(
                    FontIcon,
                    { className: 'material-icons' },
                    section.icon
                ) : section.icon;

                return React.createElement(ListItem, {
                    key: section.key,
                    primaryText: section.label,
                    onClick: _this5.setSection.bind(_this5, section.key),
                    style: listItemStyle,
                    leftIcon: icon
                });
            })
        );
    },
    render: function render() {
        return React.createElement(
            'div',
            { style: Object.assign(styles.sidebar, this.props.styles.leftBar), className: 'left-bar' },
            this.renderSidebarButtons(),
            this.renderSearchField(),
            this.renderSections()
        );
    }
});

export default Sidebar;