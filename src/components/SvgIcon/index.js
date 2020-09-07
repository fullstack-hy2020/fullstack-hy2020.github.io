import React from 'react';
import cn from 'classnames';

import styles from './SvgIcon.module.css';

const SvgIcon = ({
  viewBox = '0 0 24 24',
  className: classNameProp,
  ...props
}) => {
  const className = cn(classNameProp, styles.svgIcon);

  return <svg role="img" viewBox={viewBox} className={className} {...props} />;
};

export default SvgIcon;
