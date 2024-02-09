import React from 'react';
import { useTranslation } from 'react-i18next';
import cn from 'classnames';

import SrOnly from '../SrOnly';
import { TRANSLATION_LANGUAGE_OPTIONS } from '../../config';
import styles from './LanguagePicker.module.scss';

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

  const fontSizeStyle = {
    fontSize: '1em',
  };

  if (value === 'ptbr') {
    fontSizeStyle.fontSize = '0.65em';
  }

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
        style={fontSizeStyle}
      >
        {TRANSLATION_LANGUAGE_OPTIONS.map(({ value: optionValue, label }) => (
          <option value={optionValue} key={optionValue}>
            {label}
          </option>
        ))}
      </select>
    </>
  );
};

export default LanguagePicker;
