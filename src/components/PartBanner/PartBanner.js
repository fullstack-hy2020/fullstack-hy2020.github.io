import React from 'react';

import part0_hover from '../../images/thumbnails/part0_over.png';
import part0 from '../../images/thumbnails/part0.png';
import part1_hover from '../../images/thumbnails/part1_over.png';
import part1 from '../../images/thumbnails/part1.png';
import part2_hover from '../../images/thumbnails/part2_over.png';
import part2 from '../../images/thumbnails/part2.png';
import part3_hover from '../../images/thumbnails/part3_over.png';
import part3 from '../../images/thumbnails/part3.png';
import part4 from '../../images/thumbnails/part4_over.png';
import part4_hover from '../../images/thumbnails/part4_over.png';
import part5_hover from '../../images/thumbnails/part5_over.png';
import part5 from '../../images/thumbnails/part5.png';
import part6_hover from '../../images/thumbnails/part6_over.png';
import part6 from '../../images/thumbnails/part6.png';
import part7_hover from '../../images/thumbnails/part7_over.png';
import part7 from '../../images/thumbnails/part7.png';
import { Banner } from '../Banner/Banner';
import { ContentLiftup } from '../ContentLiftup/ContentLiftup';

export const PartBanner = () => {
  return (
    <Banner className="spacing spacing--after">
      <div className="container spacing flex-fix-aligning">
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
