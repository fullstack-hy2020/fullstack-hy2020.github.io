import React from 'react';

import part0_hover from '../../images/thumbnails/part-0_ovr.svg';
import part0 from '../../images/thumbnails/part-0.svg';
import part1_hover from '../../images/thumbnails/part-1_ovr.svg';
import part1 from '../../images/thumbnails/part-1.svg';
import part2_hover from '../../images/thumbnails/part-2_ovr.svg';
import part2 from '../../images/thumbnails/part-2.svg';
import part3_hover from '../../images/thumbnails/part-3_ovr.svg';
import part3 from '../../images/thumbnails/part-3.svg';
import part4_hover from '../../images/thumbnails/part-4_ovr.svg';
import part4 from '../../images/thumbnails/part-4.svg';
import part5_hover from '../../images/thumbnails/part-5_ovr.svg';
import part5 from '../../images/thumbnails/part-5.svg';
import part6_hover from '../../images/thumbnails/part-6_ovr.svg';
import part6 from '../../images/thumbnails/part-6.svg';
import part7_hover from '../../images/thumbnails/part-7_ovr.svg';
import part7 from '../../images/thumbnails/part-7.svg';
import { Banner } from '../Banner/Banner';
import { ContentLiftup } from '../ContentLiftup/ContentLiftup';

export const PartBanner = () => {
  return (
    <Banner className="spacing spacing--after">
      <div id="course-contents" className="container spacing flex-fix-aligning">
        <ContentLiftup
          image={{ src: part0, alt: '' }}
          hoverImageSrc={part0_hover}
          name="Osa 0"
          summary="Web-sovellusten toiminnan perusteet"
          path="/osa0"
        />

        <ContentLiftup
          image={{ src: part1, alt: 'part1' }}
          hoverImageSrc={part1_hover}
          name="Osa 1"
          summary="Web-sovellusten toiminnan perusteet"
          path="/osa1"
        />

        <ContentLiftup
          image={{ src: part2, alt: '' }}
          hoverImageSrc={part2_hover}
          name="Osa 2"
          summary="Web-sovellusten toiminnan perusteet"
          path="/osa2"
        />

        <ContentLiftup
          image={{ src: part3, alt: '' }}
          hoverImageSrc={part3_hover}
          name="Osa 3"
          summary="Web-sovellusten toiminnan perusteet"
          path="/osa3"
        />

        <ContentLiftup
          image={{ src: part4, alt: '' }}
          hoverImageSrc={part4_hover}
          name="Osa 4"
          summary="Web-sovellusten toiminnan perusteet"
          path="/osa4"
        />

        <ContentLiftup
          image={{ src: part5, alt: '' }}
          hoverImageSrc={part5_hover}
          name="Osa 5"
          summary="Web-sovellusten toiminnan perusteet"
          path="/osa5"
        />

        <ContentLiftup
          image={{ src: part6, alt: '' }}
          hoverImageSrc={part6_hover}
          name="Osa 6"
          summary="Web-sovellusten toiminnan perusteet"
          path="/osa6"
        />

        <ContentLiftup
          image={{ src: part7, alt: '' }}
          hoverImageSrc={part7_hover}
          name="Osa 7"
          summary="Web-sovellusten toiminnan perusteet"
          path="/osa7"
        />
        {/*
        <ContentLiftup
          image={{ src: part8, alt: '' }}
          hoverImageSrc={part8_hover}
          name="Osa 8"
          summary="GraphQL"
          path="/osa8"
        />
*/}
      </div>
    </Banner>
  );
};
