var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { isNil } from 'lodash/fp';
import Color from './Color.component';
import Translate from '../../i18n/Translate.component';

function TextValue(_ref) {
    var _ref$value = _ref.value,
        value = _ref$value === undefined ? '' : _ref$value;

    var textWrapStyle = {
        width: '100%',
        textOverflow: 'ellipsis',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        position: 'absolute',
        wordBreak: 'break-all',
        wordWrap: 'break-word',
        top: 0,
        lineHeight: '50px',
        paddingRight: '1rem'
    };

    var displayValue = value.toString();

    return React.createElement(
        'span',
        { title: displayValue, style: textWrapStyle },
        displayValue
    );
}

function getDateToShowInList(value) {
    var locale = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'en';

    if (isNil(value)) {
        return '';
    }

    if (typeof global.Intl !== 'undefined' && Intl.DateTimeFormat) {
        return new Intl.DateTimeFormat(locale, { year: 'numeric', month: 'long', day: 'numeric' }).format(new Date(value));
    }

    return value.substr(0, 19).replace('T', ' ');
}

var DateValue = function (_PureComponent) {
    _inherits(DateValue, _PureComponent);

    function DateValue(props, context) {
        _classCallCheck(this, DateValue);

        var _this = _possibleConstructorReturn(this, (DateValue.__proto__ || Object.getPrototypeOf(DateValue)).call(this, props, context));

        _this.state = {
            uiLocale: 'en'
        };
        return _this;
    }

    _createClass(DateValue, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            var _this2 = this;

            // Get the locale from the userSettings
            this.context.d2.currentUser.userSettings.get('keyUiLocale').then(function (uiLocale) {
                return _this2.setState({ uiLocale: uiLocale });
            });
        }
    }, {
        key: 'render',
        value: function render() {
            var displayDate = getDateToShowInList(this.props.value, this.state.uiLocale);

            return React.createElement(TextValue, { value: displayDate });
        }
    }]);

    return DateValue;
}(PureComponent);

DateValue.contextTypes = {
    d2: PropTypes.object
};

function ObjectWithDisplayName(props) {
    var textValue = props.value && (props.value.displayName || props.value.name);
    return React.createElement(TextValue, _extends({}, props, { value: textValue }));
}

var dhis2DateFormat = /^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}\.[0-9]{2,3}$/;
function isDateValue(_ref2) {
    var valueType = _ref2.valueType,
        value = _ref2.value;

    return valueType === 'DATE' || dhis2DateFormat.test(value);
}

function isColorValue(_ref3) {
    var value = _ref3.value;

    return (/#([a-z0-9]{6})$/i.test(value)
    );
}

function isObjectWithDisplayName(_ref4) {
    var value = _ref4.value;

    return value && (value.displayName || value.name);
}

function PublicAccessValue(_ref5) {
    var value = _ref5.value;

    if (value) {
        if (value === 'rw------') {
            return React.createElement(
                Translate,
                null,
                'public_can_edit'
            );
        }

        if (value === 'r-------') {
            return React.createElement(
                Translate,
                null,
                'public_can_view'
            );
        }

        if (value === '--------') {
            return React.createElement(
                Translate,
                null,
                'public_none'
            );
        }
    }

    return React.createElement(TextValue, { value: value });
}

function isPublicAccess(_ref6) {
    var columnName = _ref6.columnName;

    return columnName === 'publicAccess';
}

var valueRenderers = [[isPublicAccess, PublicAccessValue], [isDateValue, DateValue], [isObjectWithDisplayName, ObjectWithDisplayName], [isColorValue, Color]];

/**
 * Register a new ValueRenderer. The value renderers are used to render different values in the DataTable. (e.g. colors should be rendered as a Color component).
 * The new renderer is added to the start of the renderer list. If your passed `checker` is too specific the `component` might be used for values that you might not want.
 * Passing `() => true` as a checker will result the passed `component` to be used for every value in the DataTable.
 *
 * @param {function} checker Check if the value is valid for the `component` to be rendered. This function receives an object with `value`, `valueType` and `columnName` that can be used to determine if this `component` should render the value.
 * @param {function} component A React component to render when the `checker` returns true. This is the component that will be returned from `findValueRenderer`.
 *
 * @returns {function} A de-register function to unregister the checker. If you want to remove the valueRenderer from the list of renderers you can use this function to undo the add.
 */
export function addValueRenderer(checker, component) {
    valueRenderers.unshift([checker, component]);

    /**
     * Un-register the valueRenderer
     */
    return function removeValueRenderer() {
        var rendererMap = new Map(valueRenderers);

        rendererMap.delete(checker);

        valueRenderers = Array.from(rendererMap);
    };
}

/**
 * This method is used by the DataTableRow component to find a ValueRenderer for the value that should be displayed in the table's cell.
 * It will recieve an object like the one below and loop through a list of renderers until it finds one that will handle this type of value.
 * ```json
 * {
 *   "value": "#FFFFFF",
 *   "valueType": "TEXT",
 *   "columnName": "color",
 * }
 * ```
 *
 * @param {object} valueDetails The value and its details. The object has the properties `columnName`, `value` and `valueType`.
 * @returns {function} The React component that can render a value for the passed `valueDetails`.
 */
export var findValueRenderer = function findValueRenderer(valueDetails) {
    var valueCheckers = valueRenderers.map(function (_ref7) {
        var _ref8 = _slicedToArray(_ref7, 1),
            checker = _ref8[0];

        return checker;
    });
    var checkerIndex = valueCheckers.findIndex(function (checker) {
        return checker(valueDetails);
    });

    return valueRenderers[checkerIndex] && valueRenderers[checkerIndex][1] || TextValue;
};