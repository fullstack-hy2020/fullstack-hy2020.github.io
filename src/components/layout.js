import './layout.css';
import './index.scss';

import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import Header from './Header/Header';
import InfoBanner from './InfoBanner';
import InfoBanner2 from './InfoBanner2';
import Footer from './Footer/Footer';
import PropTypes from 'prop-types';
import SkipToContent from './SkipToContent/SkipToContent';

const BANNER_TO_KEY = 'part_13_changes';
const BANNER2_TO_KEY = 'part_12_changes';

const Layout = (props) => {
  const { i18n } = useTranslation();

  const { children, hideFooter, isCoursePage } = props;
  const siteLanguage = i18n.language;

  const [visible, setVisible] = useState(false);
  const [visible2, setVisible2] = useState(false);

  useEffect(() => {
    const key = localStorage.getItem(BANNER_TO_KEY);
    if (!key) {
      const relevant = window.location.href.includes('en/part13') || window.location.href.includes('osa13');
      setVisible(relevant);
    }
  }, []);

  useEffect(() => {
    const key = localStorage.getItem(BANNER2_TO_KEY);
    if (!key) {
      const relevant = window.location.href.includes('en/part12') || window.location.href.includes('osa12');
      setVisible2(relevant);
    }
  }, []);

  const hideNote = () => {
    console.log('hideNote');
    localStorage.setItem(BANNER_TO_KEY, 'yes');
    setVisible(false);
  };

  const hideNote2 = () => {
    console.log('hideNote');
    localStorage.setItem(BANNER2_TO_KEY, 'yes');
    setVisible2(false);
  };

  return (
    <div className="main-wrapper">
      <SkipToContent isCoursePage={isCoursePage} />

      <Header lang={siteLanguage} />

      <InfoBanner onHide={() => hideNote()} visible={visible} />

      <InfoBanner2 onHide={() => hideNote2()} visible={visible2} />

      <main id="main-content">{children}</main>

      {!hideFooter && <Footer lang={siteLanguage} />}
    </div>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
