import { shallow } from 'enzyme';
import React from 'react';
import Heading from '../Heading.component';

describe('Heading component', function () {
    var renderedHeading = void 0;

    var renderComponent = function renderComponent() {
        var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        renderedHeading = shallow(React.createElement(Heading, props));
    };

    it('should render a h1 tag with the title', function () {
        renderComponent({ text: 'Facility Funding Agency' });

        expect(renderedHeading.is('h1')).toBe(true);
    });

    it('should render a h2 tag with the title', function () {
        renderComponent({ text: 'Facility Funding Agency', level: 2 });

        expect(renderedHeading.is('h2')).toBe(true);
        expect(renderedHeading.children().nodes[0]).toBe('Facility Funding Agency');
    });

    it('should render a span instead of a h7 tag', function () {
        renderComponent({ text: 'Facility Funding Agency', level: 7 });

        expect(renderedHeading.is('span')).toBe(true);
    });

    it('should pass any additional props to the h1 tag', function () {
        var classDef = 'my-heading-class';
        renderComponent({ text: 'Facility Funding Agency', className: classDef, id: 'SomeText' });

        expect(renderedHeading.props().id).toBe('SomeText');
        expect(renderedHeading.props().className).toEqual(classDef);
    });
});