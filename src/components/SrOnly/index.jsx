import React from 'react';
import cn from 'classnames';

import styles from './SrOnly.module.css';

const SrOnly = ({ className, ...props }) => {
  return <span className={cn(styles.srOnly, className)} {...props} />;
};

export default SrOnly;
