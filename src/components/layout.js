import './layout.css';
import './index.scss';

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import Header from './Header/Header';
import InfoBanner from './InfoBanner';
import Footer from './Footer/Footer';
import PropTypes from 'prop-types';
import SkipToContent from './SkipToContent/SkipToContent';

const BANNER_TO_KEY = 'exam_banner_seen';

const Layout = props => {
  const { i18n } = useTranslation();

  const { children, hideFooter, isCoursePage } = props;
  const siteLanguage = i18n.language;

  const [visible, setVisible] = useState(
    () => false // !localStorage.getItem(BANNER_TO_KEY)
  );

  const hideNote = () => {
    localStorage.setItem(BANNER_TO_KEY, 'yes');
    setVisible(false);
  };

  return (
    <div className="main-wrapper">
      <SkipToContent isCoursePage={isCoursePage} />

      <Header lang={siteLanguage} />

      <InfoBanner onHide={() => hideNote()} visible={visible} />

      <main id="main-content">{children}</main>

      {!hideFooter && <Footer lang={siteLanguage} />}
    </div>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
