var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

import { createClass, PropTypes, default as React } from 'react';
import TextField from 'material-ui/TextField';
import Action from '../action/Action';
import { Observable, helpers, Scheduler, default as Rx } from 'rx';
import { config } from 'd2/lib/d2';
import d2Lib from 'd2/lib/d2';
import List from 'material-ui/List/List';
import ListItem from 'material-ui/List/ListItem';
import Paper from 'material-ui/Paper';
import Translate from '../i18n/Translate.mixin';
import log from 'loglevel';

config.i18n.strings.add('members');
config.i18n.strings.add('search_for_user_groups');

function searchByForModel(searchBy, modelTypeToSearch, valueToSearchFor) {
    var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

    if (!Boolean(modelTypeToSearch) || !Boolean(valueToSearchFor)) {
        log.warn('forType property and value should be provided to be able to show results');

        return Observable.just([]);
    }

    var searchQueryRequest = d2Lib.getInstance().then(function (d2) {
        return d2.models[modelTypeToSearch];
    }).then(function (modelType) {
        return modelType.filter().on(searchBy).ilike(valueToSearchFor);
    }).then(function (modelTypeWithFilter) {
        return modelTypeWithFilter.list(options);
    }).then(function (collection) {
        return collection.toArray();
    }).catch(function (error) {
        return log.error(error);
    });

    return Observable.fromPromise(searchQueryRequest);
}

var AutoComplete = createClass({
    propTypes: {
        actions: PropTypes.object,
        forType: PropTypes.string.isRequired,
        onSuggestionClicked: PropTypes.func.isRequired,
        closeOnItemClicked: PropTypes.bool,
        clearValueOnItemClicked: PropTypes.bool,
        filterForSuggestions: PropTypes.func
    },

    mixins: [Translate],

    getDefaultProps: function getDefaultProps() {
        return {
            actions: Action.createActionsFromNames(['loadAutoCompleteSuggestions']),
            debounceTime: 500,
            propertyToSearchBy: 'displayName',
            scheduler: Scheduler.default,
            closeOnItemClicked: true,
            clearValueOnItemClicked: true
        };
    },

    //
    getInitialState: function getInitialState() {
        return {
            showAutoComplete: false,
            autoCompleteValues: [],
            loadingSuggestions: false
        };
    },
    componentWillMount: function componentWillMount() {
        var _this = this;

        var _props = this.props,
            actions = _props.actions,
            forType = _props.forType;

        var searchValue = void 0;

        this.disposable = actions.loadAutoCompleteSuggestions.map(function (_ref) {
            var args = _ref.data;
            return args[1];
        }).tap(function (value) {
            searchValue = value;
            _this.setState({
                loadingSuggestions: true,
                showAutoComplete: Boolean(value),
                value: searchValue
            });
        }).debounce(this.props.debounceTime, this.props.scheduler).distinctUntilChanged()
        // TODO: Do not hardcore these fields to search for
        .map(function (valueToSearchFor) {
            return searchByForModel(_this.props.propertyToSearchBy, forType, valueToSearchFor, { fields: 'id,displayName|rename(name),users::size', pageSize: 10 });
        }).concatAll().map(function (suggestions) {
            return Array.isArray(suggestions) ? suggestions.filter(_this.props.filterForSuggestions || helpers.identity) : [];
        }).map(function (suggestions) {
            return suggestions.slice(0, 5);
        }).subscribe(function (autoCompleteValues) {
            return _this.setState({
                autoCompleteValues: autoCompleteValues,
                loadingSuggestions: false,
                value: searchValue
            });
        }, function (errorMessage) {
            return log.error(errorMessage);
        });
    },
    componentWillUnmount: function componentWillUnmount() {
        this.disposable && this.disposable.dispose();
    },
    onSuggestionClick: function onSuggestionClick(item) {
        var _this2 = this;

        return function (event) {
            var _props2 = _this2.props,
                closeOnItemClicked = _props2.closeOnItemClicked,
                clearValueOnItemClicked = _props2.clearValueOnItemClicked,
                onSuggestionClicked = _props2.onSuggestionClicked;


            if (closeOnItemClicked) {
                _this2.refs.autoCompleteField.focus();
            }

            if (clearValueOnItemClicked) {
                _this2.props.actions.loadAutoCompleteSuggestions({
                    target: { value: '' }
                });
            }

            _this2.setState({
                showAutoComplete: !closeOnItemClicked,
                value: clearValueOnItemClicked ? '' : _this2.state.value
            });

            if (onSuggestionClicked) {
                onSuggestionClicked(item, event);
            }
        };
    },


    // TODO: Allow the component user to specify how to render the list items or at least the primary and secondary texts
    renderAutoCompleteSuggestions: function renderAutoCompleteSuggestions() {
        var _this3 = this;

        return React.createElement(
            'div',
            { style: { position: 'absolute', zIndex: 100 } },
            React.createElement(
                Paper,
                null,
                React.createElement(
                    List,
                    null,
                    this.state.autoCompleteValues.map(function (userGroup) {
                        return React.createElement(ListItem, {
                            primaryText: userGroup.name,
                            secondaryText: userGroup.users + ' ' + _this3.getTranslation('members'),
                            innerDivStyle: { paddingTop: '.5rem', paddingBottom: '.5rem' },
                            onClick: _this3.onSuggestionClick(userGroup)
                        });
                    })
                )
            )
        );
    },
    render: function render() {
        var _props3 = this.props,
            actions = _props3.actions,
            forType = _props3.forType,
            other = _objectWithoutProperties(_props3, ['actions', 'forType']);

        return React.createElement(
            'div',
            { style: { position: 'relative' }, onClick: function onClick(event) {
                    return event.stopPropagation();
                } },
            React.createElement(TextField, _extends({
                ref: 'autoCompleteField' }, other, {
                onChange: actions.loadAutoCompleteSuggestions,
                hintText: this.getTranslation('search_for_user_groups'),
                value: this.state.value,
                fullWidth: true
            })),
            this.state.showAutoComplete && !this.state.loadingSuggestions ? this.renderAutoCompleteSuggestions() : null
        );
    }
});

export default AutoComplete;