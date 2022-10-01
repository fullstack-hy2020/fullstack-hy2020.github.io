import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import ThemeSwitcherIcon from '../../ThemeSwitcherIcon';
import SrOnly from '../../SrOnly';
import styles from './ThemeSwitcher.module.scss';

const ThemeSwitcher = () => {
  const { t } = useTranslation();

  const [theme, setTheme] = useState(document.documentElement.dataset.theme);

  useEffect(
    () => {
      document.documentElement.dataset.theme = theme;
      localStorage.setItem('selected_theme', theme);
    },
    [theme]
  );

  const handleThemeSwitchClick = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <button
      onClick={handleThemeSwitchClick}
      className={styles.themeSwitcher}
      aria-pressed={theme === 'dark'}
    >
      <SrOnly>{t('navigation:ThemeSwitcherSrLabel')}</SrOnly>
      <ThemeSwitcherIcon mode={theme} />
    </button>
  );
};

export default ThemeSwitcher;
