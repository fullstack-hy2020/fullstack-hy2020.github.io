import './Some.scss';

import React from 'react';

const urls = {
  github: 'https://github.com/fullstack-hy2020/fullstack-hy2020.github.io',
  twitter: 'https://twitter.com/moocfi',
  facebook: 'https://www.facebook.com/Moocfi',
  youtube:
    'https://www.youtube.com/watch?v=BZexOyQZMMc&list=PLumQiZ25uijis31zaRL7rhzLalSwLqUtm',
};

export const Some = ({ iconName }) => (
  <a target="__blank" href={urls[iconName]} className="some-logo__link">
    <img
      className="some-logo__image"
      alt={iconName}
      src={require(`../../images/some-logo__${iconName}.svg`)}
    />
  </a>
);
