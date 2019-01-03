import { shallow } from 'enzyme';
import React from 'react';

import { Banner } from './Banner';

describe('Banner', () => {
  let banner;

  const props = {
    image: '/test/path',
    text: ['Test message'],
  };

  beforeEach(() => {
    banner = shallow(<Banner {...props} />);
  });

  it('Renders', () => {
    expect(banner.find('.banner').exists()).toBe(true);
  });
});
