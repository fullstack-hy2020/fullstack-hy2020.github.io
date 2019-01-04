import React from 'react';

import { BodyText } from '../BodyText/BodyText';
import Element from '../Element/Element';
import { TripleBorder } from '../TripleBorder/TripleBorder';

const ReturnInfo = () => (
  <Element flex dirColumn centered className="container spacing">
    <BodyText bold text="Tehtävien palautus" />
    <a
      href="https://studies.cs.helsinki.fi/fullstackopen/"
      style={{ padding: '1rem 0' }}
      className="col-2 centered spacing--small"
    >
      <TripleBorder
        largeMargin
        className="nav-item-hover"
        childrenClassName="triple-border__return-tasks"
      >
        Palauta tehtävät palautussovellukseen
      </TripleBorder>
    </a>
  </Element>
);

export default ReturnInfo;
