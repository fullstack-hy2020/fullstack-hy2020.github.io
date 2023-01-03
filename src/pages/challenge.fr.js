import React from 'react';

import ChallengePage from '../components/ChallengePage';

const Challenge = () => {
  return (
    <ChallengePage
      lang="fr"
      title="Défi Full Stack | Full Stack open 2022"
      seoDescription="Les Universités d'Helsinki et Houston Inc. se sont associées pour mettre au défi les développeurs individuels et les entreprises afin d'apprendre et de tirer parti de leur expertise dans le véritable développement Full Stack. Le cours est construit par des codeurs pour des codeurs et offre quelque chose à la fois aux nouveaux arrivants et aux vétérans chevronnés de l'industrie."
      aboutContent={[
        "Le monde a désespérément besoin de développeurs logiciels. Nous voulons aider à former la prochaine génération de codeurs - l'une des méthodes que nous proposons consiste à s'inscrire au cours MOOC Full Stack.",
        "Les Université d'Helsinki et Houston Inc. se sont associées pour mettre au défi les développeurs individuels et les entreprises afin d'apprendre et de développer leur expertise dans le véritable esprit Full Stack. Parmi nos affiliés et initiateurs de défis figurent Elisa Oyj, K-ryhmä, Konecranes Oyj, Terveystalo Oyj et Unity Technologies Finland Ltd.",
        "Notre objectif est d'encourager l'apprentissage. Nous proposons un cours Full Stack entièrement assemblé et ciblé qui abaisse la barrière d'entrée pour l'apprentissage des nouvelles technologies de pointe et de qualité de production. Le cours est gratuit et vous pouvez participer de n'importe où, n'importe quand, à votre guise.",
        "Le cours est construit par des codeurs pour des codeurs et offre quelque chose à la fois aux nouveaux arrivants et aux vétérans chevronnés de l'industrie. La seule condition préalable est une solide compréhension des principes de base de la programmation.",
      ]}
      joinContent={[
        "En acceptant le défi, vous encouragez et responsabilisez les membres de votre communauté de travail à acquérir de nouvelles compétences. Le cours Full Stack entièrement en ligne constituera un excellent complément à vos programmes de formation et de développement internes et servira également de matériel d'auto-apprentissage parmi vos autres offres de formation en entreprise.",
        "En participant au challenge, vous enverrez un message fort au monde extérieur sur l'expertise technique de votre entreprise. Cela contribuera à renforcer votre image d'employeur et à accroître votre visibilité auprès des professionnels de l'industrie du logiciel.",
        "Rejoindre l'aventure est gratuit. Les entreprises qui répondent à l'appel et acceptent le défi verront leur logo fièrement placé sur la page Web du cours Full Stack.",
      ]}
    />
  );
};

export default Challenge;
