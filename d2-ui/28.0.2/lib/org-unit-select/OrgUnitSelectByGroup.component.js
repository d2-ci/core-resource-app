var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React from 'react';
import log from 'loglevel';

import { addToSelection, removeFromSelection, handleChangeSelection, renderDropdown, renderControls } from './common';

var OrgUnitSelectByGroup = function (_React$Component) {
    _inherits(OrgUnitSelectByGroup, _React$Component);

    function OrgUnitSelectByGroup(props, context) {
        _classCallCheck(this, OrgUnitSelectByGroup);

        var _this = _possibleConstructorReturn(this, (OrgUnitSelectByGroup.__proto__ || Object.getPrototypeOf(OrgUnitSelectByGroup)).call(this, props, context));

        _this.state = {
            loading: false,
            selection: undefined
        };
        _this.groupCache = {};

        _this.addToSelection = addToSelection.bind(_this);
        _this.removeFromSelection = removeFromSelection.bind(_this);
        _this.handleChangeSelection = handleChangeSelection.bind(_this);
        _this.renderControls = renderControls.bind(_this);

        _this.getOrgUnitsForGroup = _this.getOrgUnitsForGroup.bind(_this);
        _this.handleSelect = _this.handleSelect.bind(_this);
        _this.handleDeselect = _this.handleDeselect.bind(_this);

        _this.getTranslation = context.d2.i18n.getTranslation.bind(context.d2.i18n);
        return _this;
    }

    _createClass(OrgUnitSelectByGroup, [{
        key: 'getOrgUnitsForGroup',
        value: function getOrgUnitsForGroup(groupId) {
            var _this2 = this;

            var ignoreCache = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

            var d2 = this.context.d2;
            return new Promise(function (resolve) {
                if (_this2.props.currentRoot) {
                    log.debug('Loading org units for group ' + groupId + ' within ' + _this2.props.currentRoot.displayName);
                    _this2.setState({ loading: true });

                    d2.models.organisationUnits.list({
                        root: _this2.props.currentRoot.id,
                        paging: false,
                        includeDescendants: true,
                        fields: 'id,path',
                        filter: 'organisationUnitGroups.id:eq:' + groupId
                    }).then(function (orgUnits) {
                        return orgUnits.toArray();
                    }).then(function (orgUnits) {
                        log.debug('Loaded ' + orgUnits.length + ' org units for group ' + groupId + ' within ' + _this2.props.currentRoot.displayName);
                        _this2.setState({ loading: false });

                        resolve(orgUnits.slice());
                    });
                } else if (!ignoreCache && _this2.groupCache.hasOwnProperty(groupId)) {
                    resolve(_this2.groupCache[groupId].slice());
                } else {
                    log.debug('Loading org units for group ' + groupId);
                    _this2.setState({ loading: true });

                    var _d = _this2.context.d2;
                    _d.models.organisationUnitGroups.get(groupId, { fields: 'organisationUnits[id,path]' }).then(function (orgUnitGroups) {
                        return orgUnitGroups.organisationUnits.toArray();
                    }).then(function (orgUnits) {
                        log.debug('Loaded ' + orgUnits.length + ' org units for group ' + groupId);
                        _this2.setState({ loading: false });
                        _this2.groupCache[groupId] = orgUnits;

                        // Make a copy of the returned array to ensure that the cache won't be modified from elsewhere
                        resolve(orgUnits.slice());
                    }).catch(function (err) {
                        _this2.setState({ loading: false });
                        log.error('Failed to load org units in group ' + groupId + ':', err);
                    });
                }
            });
        }
    }, {
        key: 'handleSelect',
        value: function handleSelect() {
            this.getOrgUnitsForGroup(this.state.selection).then(this.addToSelection);
        }
    }, {
        key: 'handleDeselect',
        value: function handleDeselect() {
            this.getOrgUnitsForGroup(this.state.selection).then(this.removeFromSelection);
        }
    }, {
        key: 'render',
        value: function render() {
            var menuItems = Array.isArray(this.props.groups) && this.props.groups || this.props.groups.toArray();

            var label = 'organisation_unit_group';

            // The minHeight on the wrapping div below is there to compensate for the fact that a
            // Material-UI SelectField will change height depending on whether or not it has a value
            return renderDropdown.call(this, menuItems, label);
        }
    }]);

    return OrgUnitSelectByGroup;
}(React.Component);

OrgUnitSelectByGroup.propTypes = {
    // groups is an array of either ModelCollection objects or plain objects,
    // where each object should contain `id` and `displayName` properties
    groups: React.PropTypes.oneOfType([React.PropTypes.object, React.PropTypes.array]).isRequired,

    // selected is an array of selected organisation unit IDs
    selected: React.PropTypes.array.isRequired,

    // Whenever the selection changes, onUpdateSelection will be called with
    // one argument: The new array of selected organisation unit paths
    onUpdateSelection: React.PropTypes.func.isRequired,

    // If currentRoot is set, only org units that are descendants of the
    // current root org unit will be added to or removed from the selection
    currentRoot: React.PropTypes.object

    // TODO: Add group cache prop?
};

OrgUnitSelectByGroup.contextTypes = { d2: React.PropTypes.any.isRequired };

export default OrgUnitSelectByGroup;