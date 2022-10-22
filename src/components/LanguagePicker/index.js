import React from 'react';
import { useTranslation } from 'react-i18next';
import cn from 'classnames';
import SrOnly from '../SrOnly';
import styles from './LanguagePicker.module.scss';

const options = [
  { value: 'fi', label: 'Suomi' },
  { value: 'en', label: 'English' },
  { value: 'zh', label: '中文' },
  { value: 'es', label: 'Spanish' },
  { value: 'fr', label: 'Français' },
  { value: 'it', label: 'Italian' },  
];

const LanguagePicker = ({
  value = 'fi',
  onChange,
  className: classNameProp,
}) => {
  const { t } = useTranslation();
  const selectOnChange = e => {
    onChange(e.target.value, e);
  };

  const className = cn(classNameProp, styles.select);

  return (
    /*eslint jsx-a11y/no-onchange: "off" */
    <>
      <SrOnly>
        <label htmlFor="language-select">
          {t('navigation:LanguagePickerSrLabel')}
        </label>
      </SrOnly>
      <select
        id="language-select"
        value={value}
        onChange={selectOnChange}
        className={className}
      >
        {options.map(({ value: optionValue, label }) => (
          <option value={optionValue} key={optionValue}>
            {label}
          </option>
        ))}
      </select>
    </>
  );
};

export default LanguagePicker;
