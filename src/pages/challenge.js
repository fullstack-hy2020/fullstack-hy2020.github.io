import React from 'react';

import ChallengePage from '../components/ChallengePage';

const Challenge = () => {
  return (
    <ChallengePage
      lang="fi"
      title="Full stack -haaste | Full stack open 2020"
      seoDescription="Helsingin yliopisto, Houston Inc ja kumppaniyrityksemme haastavat niin koodarit kuin yritykset kasvattamaan osaamistaan tätä kurssia suorittamalla. Haaste on tarkoitettu jokaiselle sovelluskehitysalan osaajalle ja sellaiseksi haluavalle."
      aboutContent={[
        'Suomi tarvitsee lisää ohjelmistokehittäjiä. Haluamme kasvattaa seuraavan sukupolven koodareita - yksi valitsemistamme tavoista on osallistuminen Full Stack MOOC -kurssille.',
        'Helsingin yliopisto ja Houston Inc. haastavat niin tekijöitä kuin yrityksiä oppimaan uutta ja laajentamaan osaamistaan Full Stack -hengessä. Yhteistyökumppaneina ja haasteen käynnistäjinä ovat myös Elisa Oyj, K-ryhmä, Konecranes Oyj, Terveystalo Oyj ja Unity Technologies Finland Ltd.',
        'Haasteen päämäärä on kannustaa oppimaan. Tarjoamme valmiiksi kootun ja ajatuksella rajatun Full Stack -kurssin, joka helpottaa ja vauhdittaa nykyaikaisiin, tuotannossa käytettyihin teknologioihin tutustumista. Kurssi on maksuton, eikä sen suorittaminen ole aikaan tai paikkaan sidottu.',
        'Kurssi on rakennettu koodarilta koodarille ja tarjoaa uutta kokeneemmallekin konkarille. Pohjatiedoiksi vaaditaan hyvä perustason ohjelmointirutiini.',
      ]}
      joinContent={[
        'Tarttumalla haasteeseen kannustatte työyhteisönne osaajia uuden oppimisen äärelle. Full Stack -verkkokurssi on oiva lisä yrityksen täydennyskoulutusvalikoimaan ja toimii hyvin itseopiskelumateriaalina yrityksen muiden koulutusmahdollisuuksien joukossa',
        'Osallistumalla haasteeseen voitte viestiä omaa teknologista osaamistanne yrityksen ulkopuolelle – tämä auttaa niin työnantajakuvan muodostamisessa kuin näkyvyydessä sovelluskehitysalan ammattilaisille.',
        'Haasteeseen osallistuminen on maksutonta. Haasteen vastaanottaneiden yritysten logot nostetaan Full Stack -kurssin sivulle.',
      ]}
    />
  );
};

export default Challenge;
