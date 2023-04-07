import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import ThemeSwitcherIcon from '../../ThemeSwitcherIcon';
import SrOnly from '../../SrOnly';
import styles from './ThemeSwitcher.module.scss';

const getInitialTheme = () => {
  if (typeof document === 'undefined') {
    return 'light';
  }

  return document.documentElement.dataset.theme || 'light';
};

const ThemeSwitcher = () => {
  const { t } = useTranslation();

  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('selected_theme', theme);
  }, [theme]);

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
