import React from 'react';

import ChallengePage from '../components/ChallengePage';

const Challenge = () => {
  return (
    <ChallengePage
      lang="ptbr"
      title="Desafio Full stack | Full Stack Aberto"
      seoDescription="A Universidade de Helsinque e a Houston Inc. se uniram para desafiar tanto desenvolvedores individuais quanto empresas a aprender e a aprimorar suas habilidades em desenvolvimento de software do jeito Full Stack. O curso é construído por programadores para programadores, e oferece valor tanto para iniciantes quanto para veteranos da indústria."
      aboutContent={[
        'O mundo precisa desesperadamente de desenvolvedores de software. Queremos ajudar a criar a próxima geração de programadores — e um dos meios que oferecemos é se inscrever no curso MOOC Full Stack.',
        'A Universidade de Helsinque e a Houston Inc. se uniram para desafiar tanto desenvolvedores individuais quanto empresas a aprender e a aprimorar suas habilidades no verdadeiro espírito Full Stack. Entre nossos afiliados e pioneiros do desafio estão Elisa Oyj, K-ryhmä, Konecranes Oyj, Terveystalo Oyj e a Unity Technologies Finland Ltd.',
        'Nosso objetivo é incentivar o aprendizado. Oferecemos um curso Full Stack completamente elaborado e com um escopo que diminui propositalmente a barreira de entrada para aprender sobre novas tecnologias de ponta e de qualidade de produção. O curso é gratuito e você pode participar de qualquer lugar e em qualquer hora, quando você desejar.',
        'O curso é construído por programadores para programadores e oferece valor tanto para iniciantes quanto para veteranos da indústria. O único pré-requisito é um bom entendimento dos fundamentos básicos da programação.',
      ]}
      joinContent={[
        'Ao aceitar o desafio, você está incentivando e dando poder às pessoas de sua comunidade de trabalho a adquirir novas habilidades. O curso Full Stack é totalmente online e será uma ótima adição aos seus programas internos de treinamento e desenvolvimento, e será útil como material de estudo autodidata entre suas outras ofertas de treinamento na empresa.',
        'Ao participar do desafio, você está transmitindo uma mensagem clara ao mundo sobre a expertise técnica de sua empresa — isso ajudará a construir sua imagem de empregador e aumentará sua visibilidade para profissionais da indústria de software.',
        'Participar do desafio é gratuito. As empresas que atenderem ao chamado e aceitarem o desafio terão seu logotipo orgulhosamente estampado na página do curso Full Stack.',
      ]}
    />
  );
};

export default Challenge;
