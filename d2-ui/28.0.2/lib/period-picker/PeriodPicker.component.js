var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React from 'react';
import log from 'loglevel';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import DatePicker from 'material-ui/DatePicker';
import { is53WeekISOYear, getFirstDateOfWeek } from 'd2/lib/period/helpers';

var styles = {
    datePicker: { width: '100%' },
    year: { width: 95, marginRight: 16 },
    month: { width: 125 },
    week: { width: 105 },
    biMonth: { width: 200 },
    quarter: { width: 200 },
    sixMonth: { width: 200 },
    line: { marginTop: 0 }
};

var getYear = function getYear(date) {
    return new Date(date).getFullYear();
};
var getTwoDigitMonth = function getTwoDigitMonth(date) {
    var month = new Date(date).getMonth() + 1; // Month is 0 indexed

    return ('0' + month).slice(-2);
};
var getTwoDigitDay = function getTwoDigitDay(date) {
    var day = new Date(date).getDate();

    return ('0' + day).slice(-2);
};
var formattedDate = function formattedDate(date) {
    return '' + getYear(date) + getTwoDigitMonth(date) + getTwoDigitDay(date);
};
var getWeekYear = function getWeekYear(date) {
    // Create a new date object for the thursday of this week
    var target = new Date(date);
    target.setDate(target.getDate() - (date.getDay() + 6) % 7 + 3);

    return target.getFullYear();
};
var isWeekValid = function isWeekValid(date, week) {
    return (
        // It's not possible to have a week 53 in a 52 week year
        !is53WeekISOYear(date) && Number(week) !== 53
    );
};

var PeriodPicker = function (_React$Component) {
    _inherits(PeriodPicker, _React$Component);

    function PeriodPicker(props, context) {
        _classCallCheck(this, PeriodPicker);

        var _this = _possibleConstructorReturn(this, (PeriodPicker.__proto__ || Object.getPrototypeOf(PeriodPicker)).call(this, props, context));

        _this.state = {};

        _this.getTranslation = context.d2.i18n.getTranslation.bind(context.d2.i18n);
        return _this;
    }

    _createClass(PeriodPicker, [{
        key: 'getPeriod',
        value: function getPeriod() {
            var date = this.state.year && this.state.week && getFirstDateOfWeek(this.state.year, this.state.week);
            switch (this.props.periodType) {
                case 'Daily':
                    return this.state.date && formattedDate(this.state.date);
                case 'Weekly':
                    if (date) {
                        this.setState({ invalidWeek: !isWeekValid(date, this.state.week) });
                    }
                    return date && isWeekValid(date, this.state.week) && getWeekYear(date) + 'W' + this.state.week;
                case 'WeeklyWednesday':
                    if (date) {
                        this.setState({ invalidWeek: !isWeekValid(date, this.state.week) });
                    }
                    return date && isWeekValid(date, this.state.week) && getWeekYear(date) + 'WedW' + this.state.week;
                case 'WeeklyThursday':
                    if (date) {
                        this.setState({ invalidWeek: !isWeekValid(date, this.state.week) });
                    }
                    return date && isWeekValid(date, this.state.week) && getWeekYear(date) + 'ThuW' + this.state.week;
                case 'WeeklySaturday':
                    if (date) {
                        this.setState({ invalidWeek: !isWeekValid(date, this.state.week) });
                    }
                    return date && isWeekValid(date, this.state.week) && getWeekYear(date) + 'SatW' + this.state.week;
                case 'WeeklySunday':
                    if (date) {
                        this.setState({ invalidWeek: !isWeekValid(date, this.state.week) });
                    }
                    return date && isWeekValid(date, this.state.week) && getWeekYear(date) + 'SunW' + this.state.week;
                case 'Monthly':
                    return this.state.year && this.state.month && '' + this.state.year + this.state.month;
                case 'BiMonthly':
                    return this.state.year && this.state.biMonth && this.state.year + '0' + this.state.biMonth + 'B';
                case 'Quarterly':
                    return this.state.year && this.state.quarter && this.state.year + 'Q' + this.state.quarter;
                case 'SixMonthly':
                    return this.state.year && this.state.sixMonth && this.state.year + 'S' + this.state.sixMonth;
                case 'SixMonthlyApril':
                    return this.state.year && this.state.sixMonth && this.state.year + 'AprilS' + this.state.sixMonth;
                case 'Yearly':
                    return this.state.year;
                case 'FinancialApril':
                    return this.state.year && this.state.year + 'April';
                case 'FinancialJuly':
                    return this.state.year && this.state.year + 'July';
                case 'FinancialOct':
                    return this.state.year && this.state.year + 'Oct';

                default:
                    log.error('Unknown period type: ' + this.props.periodType);
                    return false;
            }
        }
    }, {
        key: 'handleChange',
        value: function handleChange() {
            if (this.getPeriod()) {
                this.props.onPickPeriod(this.getPeriod());
                // Reset detail fields
                this.setState({
                    date: undefined,
                    week: undefined,
                    month: undefined,
                    biMonth: undefined,
                    quarter: undefined,
                    sixMonth: undefined
                });
            }
        }
    }, {
        key: 'renderOptionPicker',
        value: function renderOptionPicker(name, options) {
            var _this2 = this;

            var changeState = function changeState(e, i, value) {
                return _this2.setState(_defineProperty({}, name, value), _this2.handleChange);
            };
            var isInvalid = name === 'week' && this.state.invalidWeek;

            return React.createElement(
                SelectField,
                {
                    value: this.state[name],
                    onChange: changeState,
                    style: styles[name],
                    floatingLabelText: this.getTranslation(name),
                    floatingLabelStyle: isInvalid ? { color: 'red' } : {}
                },
                React.createElement(MenuItem, { key: '', value: this.state[name], primaryText: '\xA0' }),
                Object.keys(options).sort().map(function (value) {
                    return React.createElement(MenuItem, {
                        key: value,
                        value: value,
                        primaryText: /[^0-9]/.test(options[value]) ? _this2.getTranslation(options[value]) : options[value]
                    });
                })
            );
        }
    }, {
        key: 'renderYearPicker',
        value: function renderYearPicker() {
            var years = {};
            var currentYear = new Date().getFullYear();
            for (var year = 2014; year < currentYear + 5; year++) {
                years[year] = year;
            }

            return this.renderOptionPicker('year', years);
        }
    }, {
        key: 'renderMonthPicker',
        value: function renderMonthPicker() {
            var months = {
                '01': 'jan',
                '02': 'feb',
                '03': 'mar',
                '04': 'apr',
                '05': 'may',
                '06': 'jun',
                '07': 'jul',
                '08': 'aug',
                '09': 'sep',
                10: 'oct',
                11: 'nov',
                12: 'dec'
            };
            return this.renderOptionPicker('month', months);
        }
    }, {
        key: 'renderWeekPicker',
        value: function renderWeekPicker() {
            var weeks = {};
            var weekLimit = 53;
            for (var week = 1; week <= weekLimit; week++) {
                weeks[('0' + week).substr(-2)] = week;
            }

            return this.renderOptionPicker('week', weeks);
        }
    }, {
        key: 'renderBiMonthPicker',
        value: function renderBiMonthPicker() {
            var biMonths = { 1: 'jan-feb', 2: 'mar-apr', 3: 'may-jun', 4: 'jul-aug', 5: 'sep-oct', 6: 'nov-dec' };
            return this.renderOptionPicker('biMonth', biMonths);
        }
    }, {
        key: 'renderQuarterPicker',
        value: function renderQuarterPicker() {
            var quarters = { 1: 'Q1', 2: 'Q2', 3: 'Q3', 4: 'Q4' };
            return this.renderOptionPicker('quarter', quarters);
        }
    }, {
        key: 'render',
        value: function render() {
            var _this3 = this;

            var setDateState = function setDateState(nothing, date) {
                var year = getYear(date);
                var month = getTwoDigitMonth(date);
                _this3.setState({ date: date, year: year, month: month }, _this3.handleChange);
            };

            switch (this.props.periodType) {
                case 'Daily':
                    return React.createElement(DatePicker, {
                        floatingLabelText: this.getTranslation('day'),
                        onChange: setDateState,
                        autoOk: true,
                        container: 'inline',
                        style: styles.datePicker
                    });
                case 'Weekly':
                case 'WeeklyWednesday':
                case 'WeeklyThursday':
                case 'WeeklySaturday':
                case 'WeeklySunday':
                    return React.createElement(
                        'div',
                        { style: styles.line },
                        this.renderYearPicker(),
                        this.renderWeekPicker()
                    );
                case 'Monthly':
                    return React.createElement(
                        'div',
                        { style: styles.line },
                        this.renderYearPicker(),
                        this.renderMonthPicker()
                    );
                case 'BiMonthly':
                    return React.createElement(
                        'div',
                        { style: styles.line },
                        this.renderYearPicker(),
                        this.renderBiMonthPicker()
                    );
                case 'Quarterly':
                    return React.createElement(
                        'div',
                        { style: styles.line },
                        this.renderYearPicker(),
                        this.renderQuarterPicker()
                    );
                case 'SixMonthly':
                    return React.createElement(
                        'div',
                        { style: styles.line },
                        this.renderYearPicker(),
                        this.renderOptionPicker('sixMonth', { 1: 'jan-jun', 2: 'jul-dec' })
                    );
                case 'SixMonthlyApril':
                    return React.createElement(
                        'div',
                        { style: styles.line },
                        this.renderYearPicker(),
                        this.renderOptionPicker('sixMonth', { 1: 'apr-sep', 2: 'oct-mar' })
                    );
                case 'Yearly':
                case 'FinancialApril':
                case 'FinancialJuly':
                case 'FinancialOct':
                    return React.createElement(
                        'div',
                        { style: styles.line },
                        this.renderYearPicker()
                    );

                default:
                    return null;
            }
        }
    }]);

    return PeriodPicker;
}(React.Component);

PeriodPicker.propTypes = {
    periodType: React.PropTypes.oneOf(['Daily', 'Weekly', 'WeeklyWednesday', 'WeeklyThursday', 'WeeklySaturday', 'WeeklySunday', 'Monthly', 'BiMonthly', 'Quarterly', 'SixMonthly', 'SixMonthlyApril', 'Yearly', 'FinancialApril', 'FinancialJuly', 'FinancialOct']).isRequired,

    onPickPeriod: React.PropTypes.func.isRequired
};
PeriodPicker.contextTypes = { d2: React.PropTypes.object.isRequired };

export default PeriodPicker;