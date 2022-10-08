import React from 'react';
import { useTranslation } from 'react-i18next';

import './SkipToContent.scss';

const SkipToContent = ({ isCoursePage }) => {
  const { t } = useTranslation();

  return (
    <a
      href={`${isCoursePage ? '#course-main-content' : '#main-content'}`}
      className="skip-to-content"
    >
      {t('navigation:skipToContent')}
    </a>
  );
};

export default SkipToContent;
