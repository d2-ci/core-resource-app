var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { Component, PropTypes } from 'react';
import ExpressionDescription from './ExpressionDescription.component';
import ExpressionOperators from './ExpressionOperators.component';
import ExpressionFormula from './ExpressionFormula.component';
import DataElementOperandSelector from './DataElementOperandSelector.component';
import Tabs from 'material-ui/Tabs/Tabs';
import Tab from 'material-ui/Tabs/Tab';
import Paper from 'material-ui/Paper/Paper';
import log from 'loglevel';
import { config } from 'd2/lib/d2';
import ProgramOperandSelector from './ProgramOperandSelector';
import Heading from '../headings/Heading.component';
import OrganisationUnitGroupSelector from './OrganisationUnitGroupSelector.component';
import ConstantSelector from './ConstantSelector.component';
import addD2Context from '../component-helpers/addD2Context';
import Action from '../action/Action';
import { Observable } from 'rx';
import { Row, Column } from '../layout';

config.i18n.strings.add('data_elements');
config.i18n.strings.add('description');
config.i18n.strings.add('organisation_unit_counts');
config.i18n.strings.add('program_tracked_entity_attributes');
config.i18n.strings.add('program_indicators');
config.i18n.strings.add('program_data_elements');
config.i18n.strings.add('constants');
config.i18n.strings.add('this_field_is_required');
config.i18n.strings.add('programs');

var styles = {
    expressionDescription: {
        padding: '1rem',
        margin: '1rem 0'
    },

    expressionMessage: {
        valid: {
            padding: '1rem',
            color: '#006400'
        },
        invalid: {
            padding: '1rem',
            color: '#8B0000'
        }
    },

    list: {
        width: '100%',
        outline: 'none',
        border: 'none',
        padding: '0rem 1rem'
    },

    expressionFormulaWrap: {
        padding: '1rem',
        maxWidth: '650px',
        marginRight: '1rem'
    },

    expressionValueOptionsWrap: {
        minHeight: 395
    }
};

var IndicatorExpressionManager = function (_Component) {
    _inherits(IndicatorExpressionManager, _Component);

    function IndicatorExpressionManager(props, context) {
        _classCallCheck(this, IndicatorExpressionManager);

        var _this = _possibleConstructorReturn(this, (IndicatorExpressionManager.__proto__ || Object.getPrototypeOf(IndicatorExpressionManager)).call(this, props, context));

        _this.descriptionChange = function (newDescription) {
            _this.setState({
                description: newDescription
            }, function () {
                _this.props.indicatorExpressionChanged({
                    formula: _this.state.formula,
                    description: _this.state.description,
                    expressionStatus: _this.state.expressionStatus
                });
            });
        };

        _this.formulaChange = function (newFormula) {
            _this.setState({
                formula: newFormula
            }, function () {
                _this.requestExpressionStatus();
            });
        };

        _this.addOperatorToFormula = function (operator) {
            _this.appendToFormula(operator);
        };

        _this.programOperandSelected = function (programFormulaPart) {
            _this.appendToFormula(programFormulaPart);
        };

        _this.appendToFormula = function (partToAppend) {
            _this.setState({
                formula: [_this.state.formula, partToAppend].join('')
            }, function () {
                _this.requestExpressionStatus();
            });
        };

        _this.dataElementOperandSelected = function (dataElementOperandId) {
            var dataElementOperandFormula = ['#{', dataElementOperandId, '}'].join('');

            _this.appendToFormula(dataElementOperandFormula);
        };

        _this.requestExpressionStatus = function () {
            _this.requestExpressionStatusAction(_this.state.formula);
        };

        _this.state = {
            formula: _this.props.formulaValue,
            description: _this.props.descriptionValue,
            expressionStatus: {
                description: '',
                isValid: false
            }
        };

        _this.i18n = _this.context.d2.i18n;
        _this.requestExpressionStatusAction = Action.create('requestExpressionStatus');
        return _this;
    }

    _createClass(IndicatorExpressionManager, [{
        key: 'componentWillMount',
        value: function componentWillMount() {
            var _this2 = this;

            if (!this.props.expressionStatusStore) {
                return true;
            }

            var first = true;

            this.disposable = this.props.expressionStatusStore.subscribe(function (expressionStatus) {
                _this2.setState({
                    expressionStatus: {
                        description: expressionStatus.description,
                        isValid: expressionStatus.status === 'OK',
                        message: expressionStatus.message
                    }
                }, function () {
                    if (first) {
                        first = false;
                        return;
                    }

                    _this2.props.indicatorExpressionChanged({
                        formula: _this2.state.formula,
                        description: _this2.state.description,
                        expressionStatus: _this2.state.expressionStatus
                    });
                });
            }, function (error) {
                return log.error(error);
            });

            this.expressionStatusDisposable = this.requestExpressionStatusAction.throttle(500).map(function (action) {
                var formula = action.data;
                var url = 'expressions/description?expression=' + formula;

                return Observable.fromPromise(_this2.context.d2.Api.getApi().get(url));
            }).concatAll().subscribe(function (response) {
                return _this2.props.expressionStatusStore.setState(response);
            }, function (error) {
                return log.error(error);
            });

            if (this.props.formulaValue.trim()) {
                this.requestExpressionStatus();
            }
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            this.disposable && this.disposable.dispose();
            this.expressionStatusDisposable && this.expressionStatusDisposable.dispose();
        }
    }, {
        key: 'render',
        value: function render() {
            var _this3 = this;

            var isDescriptionValid = function isDescriptionValid() {
                return _this3.state.description && _this3.state.description.trim();
            };

            return React.createElement(
                Column,
                null,
                React.createElement(Heading, { level: 3, text: this.props.titleText }),
                React.createElement(
                    Row,
                    null,
                    React.createElement(
                        Paper,
                        { style: styles.expressionFormulaWrap },
                        React.createElement(
                            Column,
                            null,
                            React.createElement(ExpressionDescription, {
                                descriptionValue: this.state.description,
                                descriptionLabel: this.i18n.getTranslation('description'),
                                onDescriptionChange: this.descriptionChange,
                                errorText: !isDescriptionValid() ? this.i18n.getTranslation('this_field_is_required') : undefined,
                                onBlur: this.requestExpressionStatus
                            }),
                            React.createElement(ExpressionFormula, {
                                onFormulaChange: this.formulaChange,
                                formula: this.state.formula
                            }),
                            React.createElement(ExpressionOperators, { operatorClicked: this.addOperatorToFormula })
                        )
                    ),
                    React.createElement(
                        Paper,
                        { style: styles.expressionValueOptionsWrap },
                        React.createElement(
                            Tabs,
                            null,
                            React.createElement(
                                Tab,
                                { label: this.i18n.getTranslation('data_elements') },
                                React.createElement(DataElementOperandSelector, {
                                    listStyle: styles.list,
                                    onItemDoubleClick: this.dataElementOperandSelected
                                })
                            ),
                            React.createElement(
                                Tab,
                                { label: this.i18n.getTranslation('programs') },
                                React.createElement(ProgramOperandSelector, { programOperandSelected: this.programOperandSelected })
                            ),
                            React.createElement(
                                Tab,
                                { label: this.i18n.getTranslation('organisation_unit_counts') },
                                React.createElement(OrganisationUnitGroupSelector, {
                                    listStyle: styles.list,
                                    onSelect: this.appendToFormula
                                })
                            ),
                            React.createElement(
                                Tab,
                                { label: this.i18n.getTranslation('constants') },
                                React.createElement(ConstantSelector, {
                                    listStyle: styles.list,
                                    onSelect: this.appendToFormula
                                })
                            )
                        )
                    )
                ),
                React.createElement(
                    Column,
                    null,
                    React.createElement(
                        Paper,
                        { style: styles.expressionDescription },
                        this.state.expressionStatus.description
                    ),
                    React.createElement(
                        'div',
                        {
                            style: this.state.expressionStatus.isValid ? styles.expressionMessage.valid : styles.expressionMessage.invalid
                        },
                        this.state.expressionStatus.message
                    )
                )
            );
        }
    }]);

    return IndicatorExpressionManager;
}(Component);

IndicatorExpressionManager.propTypes = {
    descriptionLabel: PropTypes.string.isRequired,
    expressionStatusStore: PropTypes.object.isRequired,
    indicatorExpressionChanged: PropTypes.func.isRequired,
    descriptionValue: PropTypes.string.isRequired,
    formulaValue: PropTypes.string.isRequired,
    titleText: PropTypes.string.isRequired
};

export default addD2Context(IndicatorExpressionManager);