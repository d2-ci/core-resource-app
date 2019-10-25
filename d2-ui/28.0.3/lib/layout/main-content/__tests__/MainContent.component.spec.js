import React from 'react';
import { shallow } from 'enzyme';
import MainContent from '../MainContent.component';

describe('<MainContent />', function () {
    var component = void 0;

    beforeEach(function () {
        component = shallow(React.createElement(MainContent, null));
    });

    it('should add a default margin at the bottom', function () {
        expect(component.props().style.marginBottom).toBe('4rem');
    });

    it('should set the width of the main content to 100%', function () {
        expect(component.props().style.width).toBe('100%');
    });

    it('should render the passed children', function () {
        component = shallow(React.createElement(
            MainContent,
            null,
            React.createElement(
                'h1',
                null,
                'Some heading'
            ),
            React.createElement(
                'div',
                null,
                'Some content'
            )
        ));

        expect(component.props().children).toEqual([React.createElement(
            'h1',
            null,
            'Some heading'
        ), React.createElement(
            'div',
            null,
            'Some content'
        )]);
    });
});