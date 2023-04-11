import React from 'react';
import { Link } from 'gatsby';
import { useTranslation } from 'react-i18next';

import { BodyText } from '../BodyText/BodyText';
import { CompaniesBanner } from '../CompaniesBanner/CompaniesBanner';
import Element from '../Element/Element';
import { Image } from './../Image/Image';
import Layout from '../layout';
import { PartBanner } from '../PartBanner/PartBanner';
import SEO from '../seo';
import { Some } from '../Some/Some';
import { SubHeader } from '../SubHeader/SubHeader';
import { TripleBorder } from '../TripleBorder/TripleBorder';
import cc from '../../images/cc.svg';
import content from '../../content/pages/main.json';
import houstonLogo from '../../images/Houston_big2.svg';
import landingImage from '../../images/landing.svg';
import licenceIcon from '../../images/cc-logo.png';
import mainSEOdescription from '../../content/seo/mainSEOdescription';
import mainSEOtags from '../../content/seo/mainSEOtags';
import news from '../../images/noun_news_1248039.svg';
import yliopistoLogo from '../../images/company_logos/uoh_centre.svg';
import getTranslationPath from '../../utils/getTranslationPath';

const IndexPage = ({ lang, title = 'Full stack open' }) => {
  const { t } = useTranslation();

  const {
    mainTitle,
    intro,
    current,
    licence,
    university,
    houston,
    contacts,
    licenced,
  } = content[lang] || content.en;

  const seoDescription = mainSEOdescription[lang];

  return (
    <Layout hideFooter={true}>
      <SEO
        lang={lang}
        title={title}
        description={seoDescription}
        keywords={[...mainSEOtags]}
      />
      <div className="frontpage-hero container spacing--after spacing--mobile">
        <Element
          flex
          spaceBetween
          className="spacing--small spacing--mobile"
          relative
        >
          <Element dirColumn className="frontpage-hero__content col-6">
            <SubHeader
              className="frontpage-hero__heading"
              text={mainTitle}
              headingLevel="h1"
            />

            <SubHeader text={t('homePage:courseNameTitle')} headingLevel="h2" />

            <Link
              className="frontpage-hero__cta centered about__challenge-button spacing--after--mobile"
              to={getTranslationPath(lang, '/about')}
            >
              {t('homePage:startCourseButton')}
            </Link>

            <BodyText
              className="frontpage-hero__description"
              headingFont
              text={intro}
            />
          </Element>

          <Image
            contain
            className="col-4 frontpage-hero__image"
            style={{ margin: 0 }}
            alt="Stacked cubes with React logo and JavaScript text"
            src={landingImage}
          />
        </Element>
      </div>

      <Element className="container spacing spacing--after">
        <Element className="push-right-1 push-left-1" spaceBetween flex>
          <Element flex horizontalHalf flexStart>
            <Element flex spaceBetween autoBottomMargin className="col-10">
              <Image
                contain
                small
                darkThemeInvert
                src={news}
                className="col-1--mobile"
              />

              <BodyText
                className="col-7 col-8--mobile link"
                style={{ marginRight: '2rem' }}
                heading={{
                  title: t('homePage:announcementsTitle'),
                  level: 'h3',
                }}
              />
            </Element>

            <BodyText
              className="spacing--small link"
              headingFont
              text={current}
            />
          </Element>

          <Element flex horizontalHalf flexStart>
            <Element
              flex
              spaceBetween
              autoBottomMargin
              className="col-10 spacing--mobile"
            >
              <Image
                contain
                small
                darkThemeInvert
                src={cc}
                className="col-1--mobile"
              />

              <BodyText
                headingFont
                className="col-7 col-8--mobile"
                style={{ marginRight: '2rem' }}
                heading={{
                  title: t('homePage:authorsTitle'),
                  level: 'h3',
                }}
              />
            </Element>

            <BodyText
              headingFont
              className="spacing--small link"
              text={licence}
            />
          </Element>
        </Element>
      </Element>

      <PartBanner lang={lang} />

      <CompaniesBanner lang={lang} isFrontPage />

      <Element flex spaceBetween className="container col-10 spacing--after">
        <TripleBorder
          largeMargin
          backgroundColor="var(--color-main)"
          className="col-10 centered--mobile"
        >
          <Element
            flex
            spaceAround
            autoMargin
            className="col-10 col-8--mobile spacing--small"
          >
            <div className="col-3 col-10--mobile">
              <a
                target="_BLANK"
                rel="noopener noreferrer"
                className="col-10 col-4--mobile"
                href="https://www.helsinki.fi/fi"
              >
                <Image
                  contain
                  darkThemeInvert
                  src={yliopistoLogo}
                  alt="Helsingin Yliopisto logo"
                  className="col-5 col-4--mobile"
                />
              </a>

              <BodyText headingFont text={university} />
            </div>

            <Element flex spaceBetween className="col-3 col-10--mobile">
              <a
                target="_BLANK"
                rel="noopener noreferrer"
                className="col-10 col-4--mobile"
                href="https://www.houston-inc.com"
              >
                <Image
                  contain
                  darkThemeInvert
                  src={houstonLogo}
                  alt="Houston Inc. logo"
                />
              </a>

              <BodyText headingFont className="link" text={houston} />
            </Element>
          </Element>

          <Element
            flex
            spaceAround
            autoMargin
            className="spacing--small spacing--after col-10 col-8--mobile centered--mobile"
          >
            <div className="col-3 col-10--mobile">
              <BodyText
                noPadding
                headingFont
                className="link"
                style={{ paddingTop: '2.111rem' }}
                text={contacts}
              />

              {['github', 'twitter', 'facebook', 'youtube'].map(icon => (
                <Some key={icon} iconName={icon} />
              ))}
            </div>
            <div className="col-3 col-10--mobile">
              <Image
                contain
                src={licenceIcon}
                alt="Creative Commons BY-NC-SA 3.0 -lisenssi"
                className="col-4--mobile"
              />

              <BodyText headingFont text={licenced} className="link" />
            </div>
          </Element>
        </TripleBorder>
      </Element>
    </Layout>
  );
};

export default IndexPage;
