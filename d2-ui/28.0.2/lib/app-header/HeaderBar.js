import PropTypes from 'prop-types';
import React from 'react';
import LinearProgress from 'material-ui/LinearProgress';
import ProfileMenu from './menus/ProfileMenu';
import InnerHeader from './InnerHeader';
import HeaderMenus from './menus/HeaderMenus';
import SearchField from './search/SearchField';
import styles, { applyUserStyle } from './header-bar-styles';

export default function HeaderBar(props, _ref) {
    var d2 = _ref.d2;
    var appItems = props.appItems,
        profileItems = props.profileItems,
        currentUser = props.currentUser,
        settings = props.settings,
        noLoadingIndicator = props.noLoadingIndicator;

    // If the required props are not passed we're in a loading state.

    if (!appItems && !profileItems && !settings) {
        if (noLoadingIndicator) {
            return React.createElement('div', { style: { display: 'none' } });
        }
        return React.createElement(
            'div',
            { style: styles.headerBar },
            React.createElement(LinearProgress, { mode: 'indeterminate' })
        );
    }

    return React.createElement(
        'div',
        { style: applyUserStyle(d2.currentUser, styles.headerBar) },
        React.createElement(InnerHeader, null),
        React.createElement(SearchField, null),
        React.createElement(
            HeaderMenus,
            null,
            React.createElement(ProfileMenu, {
                items: profileItems,
                rowItemCount: 3,
                columnItemCount: 3,
                currentUser: currentUser
            })
        )
    );
}
HeaderBar.contextTypes = {
    d2: PropTypes.object
};
HeaderBar.propTypes = {
    appItems: PropTypes.array,
    profileItems: PropTypes.array,
    currentUser: PropTypes.object,
    settings: PropTypes.object
};