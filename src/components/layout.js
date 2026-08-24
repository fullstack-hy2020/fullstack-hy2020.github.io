import './layout.css';
import './index.scss';

import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import Header from './Header/Header';
import InfoBanner from './InfoBanner';
import InfoBanner2 from './InfoBanner2';
import InfoBanner3 from './InfoBanner3';
import InfoBanner4 from './InfoBanner4';
import InfoBannerNextJs from './InfoBannerNextJs';
import Footer from './Footer/Footer';
import PropTypes from 'prop-types';
import SkipToContent from './SkipToContent/SkipToContent';

const BANNER_TO_KEY = 'part_6_upcomming_changes';
const BANNER3_TO_KEY = 'part_7_changes';
const BANNER2_TO_KEY = 'part_6_changes';
const BANNER4_TO_KEY = 'part_8_changes';
const BANNER_NEXT_JS_KEY = 'part_14_changes';

const Layout = (props) => {
  const { i18n } = useTranslation();

  const { children, hideFooter, isCoursePage } = props;
  const siteLanguage = i18n.language;

  const [visible, setVisible] = useState(false);
  const [visible2, setVisible2] = useState(false);
  const [visible3, setVisible3] = useState(false);
  const [visible4, setVisible4] = useState(false);
  const [nextJsVisible, setNextJsVisible] = useState(false);

  useEffect(() => {
    const key = localStorage.getItem(BANNER_TO_KEY);
    if (!key) {
      const relevant = window.location.href.includes('en/part6') || window.location.href.includes('osa6');
      setVisible(relevant);
    }
  }, []);

  useEffect(() => {
    const key = localStorage.getItem(BANNER2_TO_KEY);
    if (!key) {
      const relevant = window.location.href.includes('en/part6') || window.location.href.includes('osa6');
      setVisible2(relevant);
    }
  }, []);

  useEffect(() => {
    const key = localStorage.getItem(BANNER3_TO_KEY);
    if (!key) {
      const relevant = window.location.href.includes('en/part7') || window.location.href.includes('osa7');
      setVisible3(relevant);
    }
  }, []);

  useEffect(() => {
    const key = localStorage.getItem(BANNER4_TO_KEY);
    if (!key) {
      const relevant = window.location.href.includes('en/part8') || window.location.href.includes('osa8');
      setVisible4(relevant);
    }
  }, []);

  useEffect(() => {
    const key = localStorage.getItem(BANNER_NEXT_JS_KEY);
    if (!key) {
      setNextJsVisible(true);
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

  const hideNote3 = () => {
    console.log('hideNote');
    localStorage.setItem(BANNER3_TO_KEY, 'yes');
    setVisible3(false);
  };

  const hideNote4 = () => {
    console.log('hideNote');
    localStorage.setItem(BANNER4_TO_KEY, 'yes');
    setVisible4(false);
  };

  const hideNextJsNote = () => {
    console.log('hideNote');
    localStorage.setItem(BANNER_NEXT_JS_KEY, 'yes');
    setNextJsVisible(false);
  };

  return (
    <div className="main-wrapper">
      <SkipToContent isCoursePage={isCoursePage} />

      <Header lang={siteLanguage} />

      <InfoBanner 
        onHide={() => hideNote()}
        visible={visible}
        language={siteLanguage}
      />

      <InfoBanner2 onHide={() => hideNote2()} visible={false} />

      <InfoBanner3 onHide={() => hideNote3()} visible={false} />

      <InfoBanner4 onHide={() => hideNote4()} visible={false} />

      <InfoBannerNextJs
        language={siteLanguage}
        onHide={() => hideNextJsNote()}
        visible={nextJsVisible}
      />

      <main id="main-content">{children}</main>

      {!hideFooter && <Footer lang={siteLanguage} />}
    </div>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
