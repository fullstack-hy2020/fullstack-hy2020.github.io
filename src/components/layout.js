import './layout.css';
import './index.scss';

import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import Header from './Header/Header';
import InfoBanner from './InfoBanner';
import Footer from './Footer/Footer';
import PropTypes from 'prop-types';
import SkipToContent from './SkipToContent/SkipToContent';

const BANNER_TO_KEY = 'part_9_changes';

const Layout = props => {
  const { i18n } = useTranslation();

  const { children, hideFooter, isCoursePage } = props;
  const siteLanguage = i18n.language;

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const key = localStorage.getItem(BANNER_TO_KEY)
    if (!key) {
      setVisible(true);
    }
  }, []);

  const hideNote = () => {
    localStorage.setItem(BANNER_TO_KEY, 'yes');
    setVisible(false);
  };

  return (
    <div className="main-wrapper">
      <SkipToContent isCoursePage={isCoursePage} />

      <Header lang={siteLanguage} />

      <InfoBanner onHide={() => hideNote()} visible={false} />

      <main id="main-content">{children}</main>

      {!hideFooter && <Footer lang={siteLanguage} />}
    </div>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
