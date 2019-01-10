import { Link } from 'gatsby';
import PropTypes from 'prop-types';
import React from 'react';

export const NavigationItem = ({ text, path, className, ...props }) => {
  return (
    <li {...props} className={`navigation__item ${className}`}>
      <Link className="nav-item-hover" to={path}>
        {text}
      </Link>
    </li>
  );
};

NavigationItem.propTypes = {
  text: PropTypes.string.isRequired,
  path: PropTypes.string.isRequired,
  className: PropTypes.string,
};

NavigationItem.defaultProps = {
  className: '',
};
