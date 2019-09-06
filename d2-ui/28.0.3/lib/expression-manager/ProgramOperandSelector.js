var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Tabs from 'material-ui/Tabs/Tabs';
import Tab from 'material-ui/Tabs/Tab';
import { config } from 'd2/lib/d2';
import log from 'loglevel';
import ListSelect from '../list-select/ListSelect.component';
import Translate from '../i18n/Translate.mixin';
import CircularProgress from '../circular-progress/CircularProgress';
import DropDown from '../form-fields/DropDown.component';

config.i18n.strings.add('please_select_a_program');
config.i18n.strings.add('no_tracked_entity_attributes');
config.i18n.strings.add('no_program_indicators');
config.i18n.strings.add('no_program_data_elements');

var DropDownForSchemaReference = function (_Component) {
    _inherits(DropDownForSchemaReference, _Component);

    function DropDownForSchemaReference(props, context) {
        _classCallCheck(this, DropDownForSchemaReference);

        var _this = _possibleConstructorReturn(this, (DropDownForSchemaReference.__proto__ || Object.getPrototypeOf(DropDownForSchemaReference)).call(this, props, context));

        _this.state = {
            isLoading: true,
            options: []
        };
        return _this;
    }

    _createClass(DropDownForSchemaReference, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            var _this2 = this;

            var schema = this.getSchema(); // getSchema returns a d2.schema (modelDefinition object)

            schema.list({ paging: false, fields: 'displayName,id' }).then(function (collection) {
                return collection.toArray();
            }).then(function (options) {
                return _this2.setState({ options: options, isLoading: false });
            }).catch(function () {
                return _this2.setState({ isLoading: false });
            });
        }

        /**
         * Gets a d2 modelDefinition for the `schema` prop.
         *
         * @returns {ModelDefinition}
         * @throws When the `schema` is not a valid schema on the `d2.models` object.
         */

    }, {
        key: 'getSchema',
        value: function getSchema() {
            var _this3 = this;

            var d2 = this.context.d2;
            var isSchemaAvailable = function isSchemaAvailable() {
                return _this3.props.schema && d2.models[_this3.props.schema];
            };

            if (isSchemaAvailable()) {
                return d2.models[this.props.schema];
            }

            throw new Error(this.props.schema + ' is not a valid schema name on the d2.models object. Perhaps you forgot to load the schema or the schema does not exist.');
        }
    }, {
        key: 'render',
        value: function render() {
            var _props = this.props,
                schema = _props.schema,
                selectProps = _objectWithoutProperties(_props, ['schema']);

            if (this.isLoading) {
                return React.createElement(CircularProgress, null);
            }

            return React.createElement(DropDown, _extends({
                menuItems: this.state.options
            }, selectProps));
        }
    }]);

    return DropDownForSchemaReference;
}(Component);

DropDownForSchemaReference.propTypes = {
    schema: PropTypes.string.isRequired
};

DropDownForSchemaReference.contextTypes = {
    d2: PropTypes.object
};

export default React.createClass({
    displayName: 'ProgramOperandSelector',

    propTypes: {
        programOperandSelected: React.PropTypes.func.isRequired
    },

    mixins: [Translate],

    getInitialState: function getInitialState() {
        return {
            programTrackedEntityAttributeOptions: [],
            programIndicatorOptions: [],
            programDataElementOptions: [],
            programMenuItems: []
        };
    },
    componentDidMount: function componentDidMount() {
        var _this4 = this;

        this.context.d2.models.program.list({ paging: false, fields: 'id,displayName,programTrackedEntityAttributes[id,displayName,dimensionItem],programIndicators[id,displayName,dimensionItem]' }).then(function (programCollection) {
            return programCollection.toArray();
        }).then(function (programs) {
            var programMenuItems = programs.map(function (program) {
                return {
                    payload: program.id,
                    text: program.displayName
                };
            }).sort(function (left, right) {
                return left.text.localeCompare(right.text.toLowerCase());
            });

            _this4.setState({
                programMenuItems: programMenuItems,
                programAttributes: new Map(programs.map(function (program) {
                    return [program.id, Array.from(program.programTrackedEntityAttributes.values()).map(function (tea) {
                        return {
                            value: tea.dimensionItem,
                            label: tea.displayName
                        };
                    }).sort(function (left, right) {
                        return left.label.toLowerCase().localeCompare(right.label.toLowerCase());
                    })];
                })),
                programIndicators: new Map(programs.map(function (program) {
                    return [program.id, Array.from(program.programIndicators.values()).map(function (pi) {
                        return {
                            value: pi.dimensionItem,
                            label: pi.displayName
                        };
                    }).sort(function (left, right) {
                        return left.label.toLowerCase().localeCompare(right.label.toLowerCase());
                    })];
                }))
            });
        }).catch(function (e) {
            return log.error(e);
        });
    },
    renderTabs: function renderTabs() {
        var listStyle = { width: '100%', outline: 'none', border: 'none', padding: '0rem 1rem' };
        var noValueMessageStyle = {
            padding: '1rem'
        };

        return React.createElement(
            Tabs,
            { tabItemContainerStyle: { backgroundColor: '#FFF' } },
            React.createElement(
                Tab,
                { label: this.getTranslation('program_data_elements'), style: { color: '#333' } },
                !this.state.programDataElementOptions.length ? React.createElement(
                    'div',
                    { style: noValueMessageStyle },
                    this.getTranslation('no_program_data_elements')
                ) : React.createElement(ListSelect, {
                    onItemDoubleClick: this._programDataElementSelected,
                    source: this.state.programDataElementOptions,
                    listStyle: listStyle,
                    size: 10
                })
            ),
            React.createElement(
                Tab,
                { label: this.getTranslation('program_tracked_entity_attributes'), style: { color: '#333' } },
                !this.state.programTrackedEntityAttributeOptions.length ? React.createElement(
                    'div',
                    { style: noValueMessageStyle },
                    this.getTranslation('no_tracked_entity_attributes')
                ) : React.createElement(ListSelect, {
                    onItemDoubleClick: this._programTrackedEntityAttributeSelected,
                    source: this.state.programTrackedEntityAttributeOptions,
                    listStyle: listStyle,
                    size: 10
                })
            ),
            React.createElement(
                Tab,
                { label: this.getTranslation('program_indicators'), style: { color: '#333' } },
                !this.state.programIndicatorOptions.length ? React.createElement(
                    'div',
                    { style: noValueMessageStyle },
                    this.getTranslation('no_program_indicators')
                ) : React.createElement(ListSelect, {
                    onItemDoubleClick: this._programIndicatorSelected,
                    source: this.state.programIndicatorOptions,
                    listStyle: listStyle,
                    size: 10
                })
            )
        );
    },
    render: function render() {
        return React.createElement(
            'div',
            null,
            React.createElement(
                'div',
                { style: { margin: '0 1rem' } },
                React.createElement(DropDownForSchemaReference, {
                    schema: 'program',
                    value: this.state.selectedProgram,
                    fullWidth: true,
                    onChange: this._loadProgramDataOperands,
                    hintText: this.getTranslation('please_select_a_program')
                })
            ),
            this.state.selectedProgram ? this.renderTabs() : null
        );
    },
    _loadProgramDataOperands: function _loadProgramDataOperands(event) {
        var _this5 = this;

        var api = this.context.d2.Api.getApi();
        var programId = event.target.value;

        api.get('programDataElements', { program: programId, fields: 'id,displayName,dimensionItem', paging: false, order: 'displayName:asc' }).then(function (programDataElements) {
            _this5.setState({
                selectedProgram: programId,
                programDataElementOptions: programDataElements.programDataElements.map(function (programDataElement) {
                    return { value: programDataElement.dimensionItem, label: programDataElement.displayName };
                }),
                programIndicatorOptions: _this5.state.programIndicators.get(programId) || [],
                programTrackedEntityAttributeOptions: _this5.state.programAttributes.get(programId) || []
            });
        }).catch(function (error) {
            return log.error(error);
        });
    },
    _programTrackedEntityAttributeSelected: function _programTrackedEntityAttributeSelected(value) {
        var programTrackedEntityAttributeFormula = ['A{', value, '}'].join('');

        this.props.programOperandSelected(programTrackedEntityAttributeFormula);
    },
    _programIndicatorSelected: function _programIndicatorSelected(value) {
        var programIndicatorFormula = ['I{', value, '}'].join('');

        this.props.programOperandSelected(programIndicatorFormula);
    },
    _programDataElementSelected: function _programDataElementSelected(value) {
        var programDataElementSelected = ['D{', value, '}'].join('');

        this.props.programOperandSelected(programDataElementSelected);
    }
});