import { Banner } from '../components/Banner/Banner';
import { BodyText } from '../components/BodyText/BodyText';
import { CompaniesBanner } from '../components/CompaniesBanner/CompaniesBanner';
import Element from '../components/Element/Element';
import Form from '../components/Form/Form';
import { Image } from '../components/Image/Image';
import Layout from '../components/layout';
import React from 'react';
import SEO from '../components/seo';
import { SubHeader } from '../components/SubHeader/SubHeader';
import landingImage from '../images/haaste.svg';
import mainSEOtags from '../content/seo/mainSEOtags';

const Challenge = () => (
  <Layout>
    <SEO
      lang="zh"
      title="全栈——挑战 | 全栈公开课2020"
      description="The University of Helsinki and Houston Inc. have partnered up to challenge both individual developers and companies alike to learn and build upon their expertise in true Full Stack development. The course is built by coders for coders, and offers something for both newcomers and seasoned industry veterans alike. "
      keywords={[
        ...mainSEOtags,
        'fullstackhaaste',
        'full stack haaste',
        'elisa',
        'terveystalo',
        'sympa',
        'konecranes',
        'unity technologies',
        'täydennyskoulutus',
        'koodari',
        'haaste',
      ]}
    />

    <Banner style={{ paddingBottom: 0, overflow: 'hidden' }}>
      <div className="container challenge__banner">
        <Image
          contain
          className="col-10"
          alt="Stacked cubes with React logo and JavaScript text"
          src={landingImage}
        />
      </div>
    </Banner>

    <Element className="container spacing">
      <SubHeader
        className="col-10col-8 push-right-1"
        text="这就是全栈！——挑战内容"
        headingLevel="h1"
      />

      <Element className="spacing--after col-6 push-right-2">
        <BodyText
          headingFont
          text={[
            '这个世界迫切地需要软件开发人员。 我们希望帮助培育下一代程序员ーー我们提供的方法之一是就报名参加全栈 MOOC 公开课',
            ' 赫尔辛基大学和Houston 公司已经结成伙伴关系，向个人开发者和公司提出挑战，要求他们学习并发扬真正的全栈精神。 我们的友情机构以及本次挑战的发起者是 Elisa Oyj，k-ryhm，Konecranes Oyj，Terveystalo Oyj，和 Unity Technologies Finland Ltd',
            '我们的目标是鼓励学习。 我们提供了一个大而全，且目标导向的全栈课程，降低了学习这些技术的门槛，而这些内容是业界领先的，并且是生产级别的。 课程全部免费，您可以在任何时间、任何地点、在您的闲暇时间参与其中',
            '该课程从程序员中来，到程序员中去，为新手也为经验丰富的行业老手提供一些帮助。 唯一的先决条件是扎实地掌握基本的编程基础',
          ]}
        />

        <BodyText
          className="spacing"
          headingFont
          heading={{
            level: 'h2',
            title: '贵司，接受挑战吧！',
          }}
          text={[
            '通过接受这项挑战，你就是在鼓励和赋能你的员工，获得新的技能。 完全线上的全栈课程将为您的内部培训和发展计划提供一个很好的补充，同样也可以作为您公司内部培训课程中的自学材料',
            '通过参与这项挑战，你将向外界发出一个关于贵司技术专长的强烈信息ーー这将有助于树立你的企业形象，并提高贵司在软件行业专业人士中的知名度',
            '参与这项挑战是免费的。 参与并接受挑战的公司应当自豪地把你们的公司LOGO放在全栈课程网页上',
          ]}
        />

        <Form lang="zh" />
      </Element>
    </Element>

    <CompaniesBanner lang="zh" />

    <SubHeader
      className="col-10 spacing--after centered"
      text="#全栈挑战"
      headingLevel="h3"
    />
  </Layout>
);

export default Challenge;
