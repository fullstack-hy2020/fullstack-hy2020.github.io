import React from 'react';

import ChallengePage from '../components/ChallengePage';

const Challenge = () => {
  return (
    <ChallengePage
      lang="es"
      title="Full stack -challenge | Full Stack open"
      seoDescription="La Universidad de Helsinki y Houston Inc. se han asociado para desafiar tanto a desarrolladores individuales como a empresas a aprender y mejorar sus habilidades en el verdadero desarrollo Full Stack. El curso está diseñado por codificadores para codificadores y ofrece algo tanto para principiantes como para veteranos experimentados de la industria. "
      aboutContent={[
        'El mundo está en una necesidad urgente de desarrolladores de software. Queremos ayudar a criar la próxima generación de codificadores — Uno de nuestros métodos ofrecidos es inscribirse en el curso MOOC de Full Stack.',
        'La Universidad de Helsinki y Houston Inc. se han asociado para desafiar tanto a desarrolladores individuales como a empresas a aprender y mejorar sus habilidades en el verdadero espíritu Full Stack. Entre nuestros afiliados e iniciadores de desafíos se encuentran Elisa Oyj, K-ryhmä, Konecranes Oyj, Terveystalo Oyj y Unity Technologies Finland Ltd.',
        'Nuestro objetivo es fomentar el aprendizaje. Ofrecemos un curso Full Stack completamente ensamblado y diseñado con un propósito, que reduce la barrera de entrada para aprender sobre las últimas tecnologías de grado de producción. El curso es gratuito y puedes participar desde cualquier lugar en cualquier momento, a tu propio ritmo.',
        'El curso está construido por codificadores para codificadores, y ofrece algo tanto para principiantes como para veteranos experimentados de la industria. El único requisito previo es tener un sólido conocimiento de los fundamentos básicos de la programación.',
      ]}
      joinContent={[
        'Al aceptar el desafío, estás alentando y capacitando a los miembros de tu comunidad laboral para adquirir nuevas habilidades. El curso Full Stack completamente en línea será una gran adición a tus programas internos de capacitación y desarrollo, y servirá bien como material de autoestudio entre otras ofertas de capacitación interna de tu empresa.',
        'Al participar en el desafío, enviarás un mensaje claro al mundo exterior sobre la experiencia técnica de tu empresa — lo que ayudará a construir tu imagen como empleador y aumentará tu visibilidad entre los profesionales de la industria del software.',
        'Unirse al desafío es gratuito. Las empresas que atiendan al llamado y acepten el desafío tendrán su logotipo colocado con orgullo en la página web del curso Full Stack.',
      ]}
    />
  );
};

export default Challenge;
