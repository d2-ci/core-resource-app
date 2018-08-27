var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React from 'react';
import LinearProgress from 'material-ui/LinearProgress';

import ModelBase from 'd2/lib/model/Model';
import ModelCollection from 'd2/lib/model/ModelCollection';

import TreeView from '../tree-view/TreeView.component';

var styles = {
    progress: {
        position: 'absolute',
        display: 'inline-block',
        width: '100%',
        left: -8
    },
    progressBar: {
        height: 2,
        backgroundColor: 'transparent'
    },
    spacer: {
        position: 'relative',
        display: 'inline-block',
        width: '1.2rem',
        height: '1rem'
    },
    label: {
        display: 'inline-block',
        outline: 'none'
    },
    ouContainer: {
        borderColor: 'transparent',
        borderStyle: 'solid',
        borderWidth: '1px',
        borderRightWidth: 0,
        borderRadius: '3px 0 0 3px',
        background: 'transparent',
        paddingLeft: 2,
        outline: 'none'
    },
    currentOuContainer: {
        background: 'rgba(0,0,0,0.05)',
        borderColor: 'rgba(0,0,0,0.1)'
    },
    memberCount: {
        fontSize: '0.75rem',
        marginLeft: 4
    }
};

var OrgUnitTree = function (_React$Component) {
    _inherits(OrgUnitTree, _React$Component);

    function OrgUnitTree(props) {
        _classCallCheck(this, OrgUnitTree);

        var _this = _possibleConstructorReturn(this, (OrgUnitTree.__proto__ || Object.getPrototypeOf(OrgUnitTree)).call(this, props));

        _this.state = {
            children: props.root.children === false || Array.isArray(props.root.children) && props.root.children.length === 0 ? [] : undefined,
            loading: false
        };
        if (props.root.children instanceof ModelCollection && !props.root.children.hasUnloadedData) {
            _this.state.children = props.root.children.toArray()
            // Sort here since the API returns nested children in random order
            .sort(function (a, b) {
                return a.displayName.localeCompare(b.displayName);
            });
        }

        _this.loadChildren = _this.loadChildren.bind(_this);
        _this.handleSelectClick = _this.handleSelectClick.bind(_this);
        return _this;
    }

    _createClass(OrgUnitTree, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            var _this2 = this;

            if (this.props.initiallyExpanded.some(function (ou) {
                return ou.includes('/' + _this2.props.root.id);
            })) {
                this.loadChildren();
            }
        }
    }, {
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(newProps) {
            if (newProps.initiallyExpanded.some(function (ou) {
                return ou.includes('/' + newProps.root.id);
            }) || newProps.idsThatShouldBeReloaded.includes(newProps.root.id)) {
                this.loadChildren();
            }
        }
    }, {
        key: 'setChildState',
        value: function setChildState(children) {
            if (this.props.onChildrenLoaded) {
                this.props.onChildrenLoaded(children);
            }
            this.setState({
                children: children.toArray().sort(function (a, b) {
                    return a.displayName.localeCompare(b.displayName);
                }),
                loading: false
            });
        }
    }, {
        key: 'loadChildren',
        value: function loadChildren() {
            var _this3 = this;

            if (this.state.children === undefined && !this.state.loading || this.props.idsThatShouldBeReloaded.indexOf(this.props.root.id) >= 0) {
                this.setState({ loading: true });

                var root = this.props.root;
                root.children.load({ fields: 'id,displayName,children::isNotEmpty,path,parent' }).then(function (children) {
                    _this3.setChildState(children);
                });
            }
        }
    }, {
        key: 'handleSelectClick',
        value: function handleSelectClick(e) {
            if (this.props.onSelectClick) {
                this.props.onSelectClick(e, this.props.root);
            }
            e.stopPropagation();
        }
    }, {
        key: 'renderChildren',
        value: function renderChildren() {
            var _this4 = this;

            // If initiallyExpanded is an array, remove the current root id and pass the rest on
            // If it's a string, pass it on unless it's the current root id
            var expandedProp = Array.isArray(this.props.initiallyExpanded) ? this.props.initiallyExpanded.filter(function (id) {
                return id !== _this4.props.root.id;
            }) : this.props.initiallyExpanded !== this.props.root.id && this.props.initiallyExpanded || [];

            if (Array.isArray(this.state.children) && this.state.children.length > 0) {
                return this.state.children.map(function (orgUnit) {
                    return React.createElement(OrgUnitTree, {
                        key: orgUnit.id,
                        root: orgUnit,
                        selected: _this4.props.selected,
                        initiallyExpanded: expandedProp,
                        onSelectClick: _this4.props.onSelectClick,
                        currentRoot: _this4.props.currentRoot,
                        onChangeCurrentRoot: _this4.props.onChangeCurrentRoot,
                        labelStyle: _this4.props.labelStyle,
                        selectedLabelStyle: _this4.props.selectedLabelStyle,
                        arrowSymbol: _this4.props.arrowSymbol,
                        idsThatShouldBeReloaded: _this4.props.idsThatShouldBeReloaded,
                        hideCheckboxes: _this4.props.hideCheckboxes,
                        onChildrenLoaded: _this4.props.onChildrenLoaded,
                        hideMemberCount: _this4.props.hideMemberCount
                    });
                });
            }

            if (this.state.loading) {
                return React.createElement(
                    'div',
                    { style: styles.progress },
                    React.createElement(LinearProgress, { style: styles.progressBar })
                );
            }

            return null;
        }
    }, {
        key: 'render',
        value: function render() {
            var _this5 = this;

            var currentOu = this.props.root;

            // True if this OU has children = is not a leaf node
            var hasChildren = this.state.children === undefined || Array.isArray(this.state.children) && this.state.children.length > 0;
            // True if a click handler exists
            var isSelectable = !!this.props.onSelectClick;
            var pathRegEx = new RegExp('/' + currentOu.id + '$');
            var memberRegEx = new RegExp('/' + currentOu.id);
            var isSelected = this.props.selected && this.props.selected.some(function (ou) {
                return pathRegEx.test(ou);
            });
            // True if this OU is the current root
            var isCurrentRoot = this.props.currentRoot && this.props.currentRoot.id === currentOu.id;
            // True if this OU should be expanded by default
            var isInitiallyExpanded = this.props.initiallyExpanded.some(function (ou) {
                return ou.includes('/' + currentOu.id);
            });
            // True if this OU can BECOME the current root, which means that:
            // 1) there is a change root handler
            // 2) this OU is not already the current root
            // 3) this OU has children (is not a leaf node)
            var canBecomeCurrentRoot = this.props.onChangeCurrentRoot && !isCurrentRoot && hasChildren;

            var memberCount = this.props.selected !== undefined ? this.props.selected.filter(function (ou) {
                return memberRegEx.test(ou);
            }).length : currentOu.memberCount;

            // Hard coded styles for OU name labels - can be overridden with the selectedLabelStyle and labelStyle props
            var labelStyle = Object.assign({}, styles.label, {
                fontWeight: isSelected ? 500 : 300,
                color: isSelected ? 'orange' : 'inherit',
                cursor: canBecomeCurrentRoot ? 'pointer' : 'default'
            }, isSelected ? this.props.selectedLabelStyle : this.props.labelStyle);

            // Styles for this OU and OUs contained within it
            var ouContainerStyle = Object.assign({}, styles.ouContainer, isCurrentRoot ? styles.currentOuContainer : {});

            // Wrap the change root click handler in order to stop event propagation
            var setCurrentRoot = function setCurrentRoot(e) {
                e.stopPropagation();
                _this5.props.onChangeCurrentRoot(currentOu);
            };

            var label = React.createElement(
                'div',
                {
                    style: labelStyle,
                    onClick: canBecomeCurrentRoot && setCurrentRoot || isSelectable && this.handleSelectClick,
                    role: 'button',
                    tabIndex: 0
                },
                isSelectable && !this.props.hideCheckboxes && React.createElement('input', {
                    type: 'checkbox',
                    readOnly: true,
                    disabled: !isSelectable,
                    checked: isSelected,
                    onClick: this.handleSelectClick
                }),
                currentOu.displayName,
                hasChildren && !this.props.hideMemberCount && !!memberCount && React.createElement(
                    'span',
                    { style: styles.memberCount },
                    '(',
                    memberCount,
                    ')'
                )
            );

            if (hasChildren) {
                return React.createElement(
                    TreeView,
                    {
                        label: label,
                        onExpand: this.loadChildren,
                        persistent: true,
                        initiallyExpanded: isInitiallyExpanded,
                        arrowSymbol: this.props.arrowSymbol,
                        className: 'orgunit with-children',
                        style: ouContainerStyle
                    },
                    this.renderChildren()
                );
            }

            return React.createElement(
                'div',
                {
                    onClick: isSelectable && this.handleSelectClick,
                    className: 'orgunit without-children',
                    style: ouContainerStyle,
                    role: 'button',
                    tabIndex: 0
                },
                React.createElement('div', { style: styles.spacer }),
                label
            );
        }
    }]);

    return OrgUnitTree;
}(React.Component);

function orgUnitPathPropValidator(propValue, key, compName, location, propFullName) {
    if (!/(\/[a-zA-Z][a-zA-Z0-9]{10})+/.test(propValue[key])) {
        return new Error('Invalid org unit path `' + propValue[key] + '` supplied to `' + compName + '.' + propFullName + '`');
    }
    return undefined;
}

OrgUnitTree.propTypes = {
    /**
     * The root OrganisationUnit of the tree
     *
     * If the root OU is known to have no children, the `children` property of the root OU should be either
     * `false` or an empty array. If the children property is undefined, the children will be fetched from
     * the server when the tree is expanded.
     */
    root: React.PropTypes.instanceOf(ModelBase).isRequired,

    /**
     * An array of paths of selected OUs
     *
     * The path of an OU is the UIDs of the OU and all its parent OUs separated by slashes (/)
     */
    selected: React.PropTypes.arrayOf(orgUnitPathPropValidator),

    /**
     * An array of OU paths that will be expanded automatically as soon as they are encountered
     *
     * The path of an OU is the UIDs of the OU and all its parent OUs separated by slashes (/)
     */
    initiallyExpanded: React.PropTypes.arrayOf(orgUnitPathPropValidator),

    /**
     * onSelectClick callback, which is triggered when a click triggers the selection of an organisation unit
     *
     * The onSelectClick callback will receive two arguments: The original click event, and the OU that was clicked
     */
    onSelectClick: React.PropTypes.func,

    /**
     * onChangeCurrentRoot callback, which is triggered when the change current root label is clicked. Setting this also
     * enables the display of the change current root label
     *
     * the onChangeCurrentRoot callback will receive two arguments: The original click event, and the organisation unit
     * model object that was selected as the new root
     */
    onChangeCurrentRoot: React.PropTypes.func,

    /**
     * Organisation unit model representing the current root
     */
    currentRoot: React.PropTypes.object,

    /**
     * onChildrenLoaded callback, which is triggered when the children of this root org unit have been loaded
     *
     * The callback receives one argument: A D2 ModelCollection object that contains all the newly loaded org units
     */
    onChildrenLoaded: React.PropTypes.func,

    /**
     * Custom styling for OU labels
     */
    labelStyle: React.PropTypes.object,

    /**
     * Custom styling for the labels of selected OUs
     */
    selectedLabelStyle: React.PropTypes.object,

    /**
     * An array of organisation unit IDs that should be reloaded from the API
     */
    idsThatShouldBeReloaded: React.PropTypes.arrayOf(React.PropTypes.string),

    /**
     * Custom arrow symbol
     */
    arrowSymbol: React.PropTypes.string,

    /**
     * If true, don't display checkboxes next to org unit labels
     */
    hideCheckboxes: React.PropTypes.bool,

    /**
     * if true, don't display the selected member count next to org unit labels
     */
    hideMemberCount: React.PropTypes.bool
};

OrgUnitTree.defaultProps = {
    selected: [],
    initiallyExpanded: [],
    onSelectClick: undefined,
    onChangeCurrentRoot: undefined,
    currentRoot: undefined,
    onChildrenLoaded: undefined,
    labelStyle: {},
    selectedLabelStyle: {},
    idsThatShouldBeReloaded: [],
    arrowSymbol: undefined,
    hideCheckboxes: false,
    hideMemberCount: false
};

export default OrgUnitTree;