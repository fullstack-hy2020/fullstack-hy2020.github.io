import React from 'react';
import cn from 'classnames';

import styles from './LanguagePicker.module.scss';

const options = [
  { value: 'fi', label: 'Suomi' },
  { value: 'en', label: 'English' },
  { value: 'zh', label: '中文' },
  { value: 'es', label: 'Spanish' },
  { value: 'fr', label: 'Français' },
];

const LanguagePicker = ({
  value = 'fi',
  onChange,
  className: classNameProp,
}) => {
  const selectOnChange = e => {
    onChange(e.target.value, e);
  };

  const className = cn(classNameProp, styles.select);

  return (
    /*eslint jsx-a11y/no-onchange: "off" */
    <select value={value} onChange={selectOnChange} className={className}>
      {options.map(({ value: optionValue, label }) => (
        <option value={optionValue} key={optionValue}>
          {label}
        </option>
      ))}
    </select>
  );
};

export default LanguagePicker;
