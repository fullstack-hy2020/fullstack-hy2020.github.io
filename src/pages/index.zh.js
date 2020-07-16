import { BodyText } from '../components/BodyText/BodyText';
import { CompaniesBanner } from '../components/CompaniesBanner/CompaniesBanner';
import Element from '../components/Element/Element';
import { Image } from '../components/Image/Image';
import Layout from '../components/layout';
import { PartBanner } from '../components/PartBanner/PartBanner';
import React from 'react';
import SEO from '../components/seo';
import { Some } from '../components/Some/Some';
import { SubHeader } from '../components/SubHeader/SubHeader';
import { TripleBorder } from '../components/TripleBorder/TripleBorder';
import cc from '../images/cc.svg';
import colors from '../colors';
import content from '../content/pages/main.json';
import houstonLogo from '../images/Houston_big.svg';
import landingImage from '../images/landing.svg';
import licenceIcon from '../images/cc-logo.svg';
import mainSEOdescription from '../content/seo/mainSEOdescription';
import mainSEOtags from '../content/seo/mainSEOtags';
import news from '../images/noun_news_1248039.svg';
import yliopistoLogo from '../images/company_logos/uoh_centre.svg';
import { Link } from 'gatsby';

const IndexPage = () => {
  const {
    mainTitle,
    intro,
    current,
    licence,
    university,
    houston,
    contacts,
    licenced,
  } = content.zh;

  return <Layout>
      <SEO lang="zh" title="全栈公开课2020" description={mainSEOdescription['en']} keywords={[...mainSEOtags]} />
      <div className="container spacing--after spacing--mobile">
        <Element flex spaceBetween className="col-10 spacing--small frontpage__hero spacing--mobile" relative>
          <SubHeader className="col-6 index__main-title" text={mainTitle} headingLevel="h1" />

          <SubHeader className="col-10" text="全栈公开课 2020" headingLevel="h2" />

            <Link className="col-2 centered about__challenge-button spacing--after--mobile" to="/zh/about">
              开始课程
            </Link>

          <div className="spacing--small" />

          <BodyText headingFont className="col-4 order-1--mobile col-8--mobile link" text={intro} />

          <Image contain className="col-4--mobile spacing--tablet absolute-top-right--desktop" style={{ margin: 0 }} alt="Stacked cubes with React logo and JavaScript text" src={landingImage} />
        </Element>
      </div>

      <Element className="container spacing spacing--after">
        <Element className="push-right-1 push-left-1" spaceBetween flex>
          <Element flex horizontalHalf flexStart>
            <Element flex spaceBetween autoBottomMargin className="col-10">
              <Image contain small src={news} className="col-1--mobile" />

              <BodyText className="col-7 col-8--mobile link" style={{ marginRight: '2rem' }} heading={{ title: '公告', level: 'h3' }} />
            </Element>

            <BodyText className="spacing--small link" headingFont text={current} />
          </Element>

          <Element flex horizontalHalf flexStart>
            <Element flex spaceBetween autoBottomMargin className="col-10 spacing--mobile">
              <Image contain small src={cc} className="col-1--mobile" />

              <BodyText headingFont className="col-7 col-8--mobile" style={{ marginRight: '2rem' }} heading={{ title: '著作权与版权', level: 'h3' }} />
            </Element>

            <BodyText headingFont className="spacing--small link" text={licence} />
          </Element>
        </Element>
      </Element>

      <PartBanner lang="zh" />

      <CompaniesBanner lang="zh" isFrontPage />

      <Element flex spaceBetween className="container col-10 spacing--after">
        <TripleBorder largeMargin backgroundColor={colors['main']} className="col-10 centered--mobile">
          <Element flex spaceAround autoMargin className="col-10 col-8--mobile spacing--small">
            <div className="col-3 col-10--mobile">
              <a target="_BLANK" rel="noopener noreferrer" className="col-10 col-4--mobile" href="https://www.helsinki.fi/fi">
                <Image contain src={yliopistoLogo} alt="Helsingin Yliopisto logo" className="col-5 col-4--mobile" />
              </a>

              <BodyText headingFont text={university} />
            </div>

            <Element flex spaceBetween className="col-3 col-10--mobile">
              <a target="_BLANK" rel="noopener noreferrer" className="col-10 col-4--mobile" href="https://www.houston-inc.com">
                <Image contain src={houstonLogo} alt="Houston Inc. logo" />
              </a>

              <BodyText headingFont className="link" text={houston} />
            </Element>
          </Element>

          <Element flex spaceAround autoMargin className="spacing--small spacing--after col-10 col-8--mobile centered--mobile">
            <div className="col-3 col-10--mobile">
              <BodyText noPadding headingFont className="link" style={{ paddingTop: '2.111rem' }} text={contacts} />

              {['github', 'twitter', 'facebook', 'youtube'].map(icon => (
                <Some key={icon} iconName={icon} />
              ))}
            </div>
            <div className="col-3 col-10--mobile">
              <Image contain src={licenceIcon} alt="Creative Commons BY-NC-SA 3.0 -lisenssi" className="col-4--mobile" />

              <BodyText headingFont text={licenced} className="link" />
            </div>
          </Element>
        </TripleBorder>
      </Element>
    </Layout>;
};

export default IndexPage;
