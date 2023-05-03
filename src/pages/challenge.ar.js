import React from 'react';

import ChallengePage from '../components/ChallengePage';

const Challenge = () => {
  return (
    <ChallengePage
      lang="en"
      title="Full stack -challenge | Full Stack open"
      seoDescription="The University of Helsinki and Houston Inc. have partnered up to challenge both individual developers and companies alike to learn and build upon their expertise in true Full Stack development. The course is built by coders for coders, and offers something for both newcomers and seasoned industry veterans alike. "
      aboutContent={[
        'The world is in dire need of software developers. We want to help breed the next generation of coders — one of our offered methods is to enroll in the Full Stack MOOC course.',
        'The University of Helsinki and Houston Inc. have partnered up to challenge both individual developers and companies alike to learn and build upon their expertise in true Full Stack spirit. Among our affiliates and challenge initiators are Elisa Oyj, K-ryhmä, Konecranes Oyj, Terveystalo Oyj, and Unity Technologies Finland Ltd.',
        'Our objective is to encourage learning. We offer a fully-assembled and purposefully-scoped Full Stack course that lowers the barrier of entry for learning about new state-of-the-art and production grade technologies. The course is free of charge and you can participate from anywhere at anytime, at your leisure.',
        'The course is built by coders for coders, and offers something for both newcomers and seasoned industry veterans alike. The only prerequisite is a solid grasp of basic programming fundamentals.',
      ]}
      joinContent={[
        'By accepting the challenge you are encouraging and empowering the members of your working community to acquire new skills. The fully-online Full Stack course will make a great addition to your internal training and development programs and will serve well as self-study material amongst your other in-company training offerings.',
        'By partaking in the challenge, you will send a strong message to the outside world about your company’s technical expertise — this will help build your employer image and increase your visibility to software industry professionals.',
        'Joining the challenge is free of charge. Companies that heed the call and accept the challenge will have their logo proudly placed on the Full Stack course webpage.',
      ]}
    />
  );
};

export default Challenge;
