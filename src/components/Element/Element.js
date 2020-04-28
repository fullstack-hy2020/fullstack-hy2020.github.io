import './Element.scss';

import PropTypes from 'prop-types';
import React from 'react';

const Element = ({
  Tag,
  children,
  className,
  flex,
  dirColumn,
  spaceAround,
  spaceBetween,
  centered,
  autoMargin,
  autoBottomMargin,
  horizontalHalf,
  flexStart,
  noWrap,
  centeredInDesktop,
  relative,
  ...props
}) => {
  const classes = [];

  flex && classes.push('element--flex');
  autoMargin && classes.push('element--auto-margin');
  autoBottomMargin && classes.push('element--auto-bottom-margin');
  dirColumn && classes.push('element--column');
  spaceAround && classes.push('element--space-around');
  spaceBetween && classes.push('element--space-between');
  centered && classes.push('element--centered');
  horizontalHalf && classes.push('element--horizontal-half');
  flexStart && classes.push('element--flex-start');
  noWrap && classes.push('element--no-wrap');
  centeredInDesktop && classes.push('element--centered-in-desktop');
  relative && classes.push('element--relative');

  return (
    <Tag className={`${className} ${classes.join(' ')}`} {...props}>
      {children}
    </Tag>
  );
};

Element.defaultProps = {
  className: '',
  Tag: 'div',
};

Element.propTypes = {
  Tag: PropTypes.string,
  children: PropTypes.node,
  className: PropTypes.string,
  flex: PropTypes.bool,
  spaceAround: PropTypes.bool,
  spaceBetween: PropTypes.bool,
  dirColumn: PropTypes.bool,
  centered: PropTypes.bool,
  horizontalHalf: PropTypes.bool,
  autoMargin: PropTypes.bool,
  autoBottomMargin: PropTypes.bool,
  flexStart: PropTypes.bool,
  noWrap: PropTypes.bool,
  centeredInDesktop: PropTypes.bool,
  relative: PropTypes.bool,
};

export default Element;
