---
mainImage: ../../../images/part-7.svg
part: 7
letter: d
lang: fr
---

<div class="content">

Aux premiers jours, React était quelque peu célèbre pour être très difficile à configurer avec les outils requis pour le développement d'applications. Pour faciliter la situation, [Create React App](https://github.com/facebookincubator/create-react-app) a été développé, ce qui a éliminé les problèmes liés à la configuration. [Vite](https://vitejs.dev/), qui est également utilisé dans le cours, a récemment remplacé Create React App dans les nouvelles applications.

Vite et Create React App utilisent des <i>bundlers</i> (empaqueteurs) pour faire le travail réel. Nous allons maintenant nous familiariser avec l'empaqueteur appelé [Webpack](https://webpack.js.org/) utilisé par Create React App. Webpack a été de loin l'empaqueteur le plus populaire pendant des années. Récemment, cependant, il y a eu plusieurs empaqueteurs de nouvelle génération tels que esbuild utilisé par Vite, qui sont significativement plus rapides et plus faciles à utiliser que Webpack. Cependant, par exemple, [esbuild](https://esbuild.github.io/) manque encore de certaines fonctionnalités utiles (telles que le rechargement à chaud du code dans le navigateur), donc ensuite nous allons connaître l'ancien souverain des empaqueteurs, Webpack.

### Empaquetage

Nous avons implémenté nos applications en divisant notre code en modules séparés qui ont été <i>importés</i> aux endroits qui en ont besoin. Même si les modules ES6 sont définis dans la norme ECMAScript, les navigateurs plus anciens ne savent pas comment gérer le code qui est divisé en modules.

Pour cette raison, le code qui est divisé en modules doit être <i>empaqueté</i> pour les navigateurs, ce qui signifie que tous les fichiers de code source sont transformés en un seul fichier qui contient tout le code de l'application. Lorsque nous avons déployé notre frontend React en production dans la [partie 3](/fr/part3/deployer_votre_application_sur_internet), nous avons effectué l'empaquetage de notre application avec la commande npm run build. Sous le capot, le script npm empaquette la source, et cela produit la collection suivante de fichiers dans le répertoire <i>dist</i>:

<pre>
├── assets
│   ├── index-d526a0c5.css
│   ├── index-e92ae01e.js
│   └── react-35ef61ed.svg
├── index.html
└── vite.svg
</pre>

Le fichier <i>index.html</i> situé à la racine du répertoire <i>dist</i> est le "fichier principal" de l'application qui charge le fichier JavaScript empaqueté avec une balise <i>script</i>:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vite + React</title>
    <script type="module" crossorigin src="/assets/index-e92ae01e.js"></script>
    <link rel="stylesheet" href="/assets/index-d526a0c5.css">
  </head>
  <body>
    <div id="root"></div>
    
  </body>
</html>
```

Comme nous pouvons le voir dans l'application exemple qui a été créée avec Vite, le script de build empaquette également les fichiers CSS de l'application dans un seul fichier <i>/assets/index-d526a0c5.css</i>.

En pratique, l'empaquetage est effectué de manière à définir un point d'entrée pour l'application, qui est typiquement le fichier <i>index.js</i>. Lorsque Webpack empaquette le code, il inclut non seulement le code du point d'entrée mais aussi le code qui est importé par le point d'entrée, ainsi que le code importé par ses instructions d'importation, et ainsi de suite.

Puisque une partie des fichiers importés sont des paquets comme React, Redux et Axios, le fichier JavaScript empaqueté contiendra également le contenu de chacune de ces bibliothèques.

> L'ancienne manière de diviser le code de l'application en plusieurs fichiers reposait sur le fait que le fichier <i>index.html</i> chargeait tous les fichiers JavaScript séparés de l'application à l'aide de balises script. Cela résultait en une diminution de performance, puisque le chargement de chaque fichier séparé entraîne certains frais généraux. Pour cette raison, la méthode préférée de nos jours est d'empaqueter le code en un seul fichier.

Ensuite, nous allons créer une configuration Webpack adaptée pour une application React à la main, à partir de zéro.

Créons un nouveau répertoire pour le projet avec les sous-répertoires (<i>build</i> et <i>src</i>) et fichiers suivants:

<pre>
├── build
├── package.json
├── src
│   └── index.js
└── webpack.config.js
</pre>

Le contenu du fichier <i>package.json</i> peut par exemple être le suivant:

```json
{
  "name": "webpack-part7",
  "version": "0.0.1",
  "description": "practising webpack",
  "scripts": {},
  "license": "MIT"
}
```

</div>