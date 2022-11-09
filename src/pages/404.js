import React from 'react';
import { useTranslation } from 'react-i18next';

import Arrow from '../components/Arrow/Arrow';
import Element from '../components/Element/Element';
import Layout from '../components/layout';
import SEO from '../components/seo';
import colors from '../colors';
import getTranslationPath from '../utils/getPartTranslationPath';

const NotFoundPage = () => {
  const { i18n, t } = useTranslation();

  const title = t('notFoundPage:title');
  const siteLanguage = i18n.language;

  return (
    <Layout>
      <SEO
        title={`${title} | Full stack open`}
        lang={siteLanguage}
      />

      <Element className="container spacing--large spacing--after">
        <h1>404 - {title}</h1>

        <p className="col-10 spacing--small spacing--after">
          Uncaught ReferenceError: unknown is not defined
        </p>

        <Arrow
          className="col-10 arrow__container--with-link"
          bold
          thickBorder
          link={getTranslationPath(siteLanguage, '/')}
          content={[{ backgroundColor: colors['main'], text: 'Go back home' }]}
        />
      </Element>
    </Layout>
  );
};

export default NotFoundPage;
