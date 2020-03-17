import { Banner } from '../components/Banner/Banner';
import { BodyText } from '../components/BodyText/BodyText';
import Element from '../components/Element/Element';
import Footer from '../components/Footer/Footer';
import { Image } from '../components/Image/Image';
import Layout from '../components/layout';
import { PartBanner } from '../components/PartBanner/PartBanner';
import React from 'react';
import SEO from '../components/seo';
import content from '../content/pages/about.json';
import landingImage from '../images/landing.svg';
import mainSEOdescription from '../content/seo/mainSEOdescription';
import mainSEOtags from '../content/seo/mainSEOtags';

const About = () => {
  const { intro } = content.zh;

  return (
    <Layout>
      <SEO
        lang="zh"
        title="关于本课程 | 全栈公开课2020"
        description={mainSEOdescription['en']}
        keywords={[
          ...mainSEOtags,
          'Avoin yliopisto',
          'Full stack harjoitustyö',
        ]}
      />

      <Banner style={{ paddingBottom: 0, overflow: 'hidden' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '-70px',
          }}
          className="container"
        >
          <Image
            className="col-4 push-right-2"
            contain
            style={{ margin: 0 }}
            alt="Stacked cubes with React logo and JavaScript text"
            src={landingImage}
          />
        </div>
      </Banner>

      <Element className="container spacing spacing--mobile--large">
        <Element className="col-8 push-right-1">
          <BodyText
            heading={{ level: 'h1', title: '课程简介' }}
            headingFontSize="2.3rem"
          />

          <Element flex spaceBetween>
            <div className="col-10 spacing--after">
              <BodyText text={intro} className="link" headingFont />

              <BodyText
                className="link"
                headingFont
                text={[
                  '上课的同学需要具备良好的编程技能、基本的网络编程和数据库知识，并且了解使用 Git 这个版本控制系统的基础知识。 你还需要有坚持不懈的精神以及独立解决问题和搜索信息的能力',
                  '课程的第0部分更详细地介绍了课程的内容和教学方法。 因此一定要仔细阅读材料和课程说明。',
                ]}
              />
            </div>
          </Element>
        </Element>
      </Element>

      <PartBanner lang="zh" />
      <Footer lang="zh" />
    </Layout>
  );
};

export default About;
