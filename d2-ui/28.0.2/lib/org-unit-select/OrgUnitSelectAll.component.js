var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React from 'react';
import log from 'loglevel';
import RaisedButton from 'material-ui/RaisedButton/RaisedButton';

import { addToSelection, removeFromSelection } from './common';

var style = {
    button: {
        position: 'relative',
        top: 3,
        marginLeft: 16
    },
    progress: {
        height: 2,
        backgroundColor: 'rgba(0,0,0,0)',
        top: 46
    }
};
style.button1 = Object.assign({}, style.button, { marginLeft: 0 });

var OrgUnitSelectAll = function (_React$Component) {
    _inherits(OrgUnitSelectAll, _React$Component);

    function OrgUnitSelectAll(props, context) {
        _classCallCheck(this, OrgUnitSelectAll);

        var _this = _possibleConstructorReturn(this, (OrgUnitSelectAll.__proto__ || Object.getPrototypeOf(OrgUnitSelectAll)).call(this, props, context));

        _this.state = {
            loading: false,
            cache: null
        };

        _this.addToSelection = addToSelection.bind(_this);
        _this.removeFromSelection = removeFromSelection.bind(_this);

        _this.handleSelectAll = _this.handleSelectAll.bind(_this);
        _this.handleDeselectAll = _this.handleDeselectAll.bind(_this);

        _this.getTranslation = context.d2.i18n.getTranslation.bind(context.d2.i18n);
        return _this;
    }

    _createClass(OrgUnitSelectAll, [{
        key: 'handleSelectAll',
        value: function handleSelectAll() {
            var _this2 = this;

            if (this.props.currentRoot) {
                this.setState({ loading: true });
                this.getDescendantOrgUnits().then(function (orgUnits) {
                    _this2.setState({ loading: false });
                    _this2.addToSelection(orgUnits);
                });
            } else if (Array.isArray(this.state.cache)) {
                this.props.onUpdateSelection(this.state.cache.slice());
            } else {
                this.setState({ loading: true });

                this.context.d2.models.organisationUnits.list({ fields: 'id,path', paging: false }).then(function (orgUnits) {
                    var ous = orgUnits.toArray().map(function (ou) {
                        return ou.path;
                    });
                    _this2.setState({
                        cache: ous,
                        loading: false
                    });

                    _this2.props.onUpdateSelection(ous.slice());
                }).catch(function (err) {
                    _this2.setState({ loading: false });
                    log.error('Failed to load all org units:', err);
                });
            }
        }
    }, {
        key: 'getDescendantOrgUnits',
        value: function getDescendantOrgUnits() {
            return this.context.d2.models.organisationUnits.list({
                root: this.props.currentRoot.id,
                paging: false,
                includeDescendants: true,
                fields: 'id,path'
            });
        }
    }, {
        key: 'handleDeselectAll',
        value: function handleDeselectAll() {
            var _this3 = this;

            if (this.props.currentRoot) {
                this.setState({ loading: true });
                this.getDescendantOrgUnits().then(function (orgUnits) {
                    _this3.setState({ loading: false });
                    _this3.removeFromSelection(orgUnits);
                });
            } else {
                this.props.onUpdateSelection([]);
            }
        }
    }, {
        key: 'render',
        value: function render() {
            return React.createElement(
                'div',
                null,
                React.createElement(RaisedButton, {
                    style: style.button1,
                    label: this.getTranslation('select_all'),
                    onClick: this.handleSelectAll,
                    disabled: this.state.loading
                }),
                React.createElement(RaisedButton, {
                    style: style.button,
                    label: this.getTranslation('deselect_all'),
                    onClick: this.handleDeselectAll,
                    disabled: this.state.loading
                })
            );
        }
    }]);

    return OrgUnitSelectAll;
}(React.Component);

OrgUnitSelectAll.propTypes = {
    // selected is an array of selected organisation unit IDs
    selected: React.PropTypes.array.isRequired,

    // Whenever the selection changes, onUpdateSelection will be called with
    // one argument: The new array of selected organisation unit paths
    onUpdateSelection: React.PropTypes.func.isRequired,

    // If currentRoot is set, only org units that are descendants of the
    // current root org unit will be added to or removed from the selection
    currentRoot: React.PropTypes.object
};

OrgUnitSelectAll.contextTypes = { d2: React.PropTypes.object.isRequired };

export default OrgUnitSelectAll;