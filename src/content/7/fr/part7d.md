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

Installons webpack avec la commande:

```bash
npm install --save-dev webpack webpack-cli
```

Nous définissons la fonctionnalité de webpack dans le fichier <i>webpack.config.js</i>, que nous initialisons avec le contenu suivant:

```js
const path = require('path')

const config = () => {
  return {
    entry: './src/index.js',
    output: {
      path: path.resolve(__dirname, 'build'),
      filename: 'main.js'
    }
  }
}

module.exports = config
```

**Remarque:** il serait possible de faire la définition directement comme un objet au lieu d'une fonction:

```js
const path = require('path')

const config = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'main.js'
  }
}

module.exports = config
```

Un objet suffira dans de nombreuses situations, mais nous aurons plus tard besoin de certaines fonctionnalités qui exigent que la définition soit faite sous forme de fonction.

Nous allons ensuite définir un nouveau script npm appelé <i>build</i> qui exécutera l'empaquetage avec webpack:

```js
// ...
"scripts": {
  "build": "webpack --mode=development"
},
// ...
```

Ajoutons un peu plus de code au fichier <i>src/index.js</i>:

```js
const hello = name => {
  console.log(`hello ${name}`)
}
```

Lorsque nous exécutons la commande _npm run build_, notre code d'application sera empaqueté par webpack. L'opération produira un nouveau fichier <i>main.js</i> qui est ajouté sous le répertoire <i>build</i>:

![sortie du terminal webpack npm run build](../../images/7/19x.png)

Le fichier contient beaucoup de choses qui semblent assez intéressantes. Nous pouvons également voir le code que nous avons écrit précédemment à la fin du fichier:

```js
eval("const hello = name => {\n  console.log(`hello ${name}`)\n}\n\n//# sourceURL=webpack://webpack-osa7/./src/index.js?");
```

Ajoutons un fichier <i>App.js</i> sous le répertoire <i>src</i> avec le contenu suivant:

```js
const App = () => {
  return null
}

export default App
```

Importons et utilisons le module <i>App</i> dans le fichier <i>index.js</i>:

```js
import App from './App';

const hello = name => {
  console.log(`hello ${name}`)
}

App()
```

Lorsque nous empaquetons à nouveau l'application avec la commande _npm run build_, nous remarquons que webpack a pris en compte les deux fichiers:

![sortie du terminal montrant que webpack a généré deux fichiers](../../images/7/20x.png)

Notre code d'application peut être trouvé à la fin du fichier bundle dans un format plutôt obscur:

![sortie du terminal montrant notre code minifié](../../images/7/20z.png)

### Fichier de configuration

Examinons de plus près le contenu de notre fichier <i>webpack.config.js</i> actuel:

```js
const path = require('path')

const config = () => {
  return {
    entry: './src/index.js',
    output: {
      path: path.resolve(__dirname, 'build'),
      filename: 'main.js'
    }
  }
}

module.exports = config
```

Le fichier de configuration a été écrit en JavaScript et la fonction retournant l'objet de configuration est exportée en utilisant la syntaxe de module de Node.

Notre définition de configuration minimale s'explique presque d'elle-même. La propriété [entry](https://webpack.js.org/concepts/#entry) de l'objet de configuration spécifie le fichier qui servira de point d'entrée pour l'empaquetage de l'application.

La propriété [output](https://webpack.js.org/concepts/#output) définit l'emplacement où le code empaqueté sera stocké. Le répertoire cible doit être défini comme un <i>chemin absolu</i>, ce qui est facile à créer avec la méthode [path.resolve](https://nodejs.org/docs/latest-v8.x/api/path.html#path_path_resolve_paths). Nous utilisons aussi [\_\_dirname](https://nodejs.org/docs/latest/api/globals.html#globals_dirname) qui est une variable dans Node qui stocke le chemin vers le répertoire courant.

### Empaquetage de React

Ensuite, transformons notre application en une application React minimale. Installons les bibliothèques requises:

```bash
npm install react react-dom
```

Et transformons notre application en une application React en ajoutant les définitions familières dans le fichier <i>index.js</i>:

```js
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

ReactDOM.createRoot(document.getElementById('root')).render(<App />)
```

Nous apporterons également les modifications suivantes au fichier <i>App.js</i>:

```js
import React from 'react' // we need this now also in component files

const App = () => {
  return (
    <div>
      hello webpack
    </div>
  )
}

export default App
```

Nous avons encore besoin du fichier <i>build/index.html</i> qui servira de "page principale" de notre application et qui chargera notre code JavaScript empaqueté avec une balise <i>script</i>:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>React App</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="text/javascript" src="./main.js"></script>
  </body>
</html>
```

Lorsque nous empaquetons notre application, nous rencontrons le problème suivant:

![terminal webpack échec chargeur nécessaire](../../images/7/21x.png)

### Chargeurs (Loaders)

Le message d'erreur de webpack indique que nous pourrions avoir besoin d'un <i>chargeur</i> approprié pour empaqueter correctement le fichier <i>App.js</i>. Par défaut, webpack ne sait traiter que le JavaScript pur. Bien que nous ne nous en rendions peut-être plus compte, nous utilisons [JSX](https://facebook.github.io/jsx/) pour rendre nos vues dans React. Pour illustrer cela, le code suivant n'est pas du JavaScript ordinaire:

```js
const App = () => {
  return (
    <div>
      hello webpack
    </div>
  )
}
```

La syntaxe utilisée ci-dessus provient de JSX et nous offre une manière alternative de définir un élément React pour une balise HTML <i>div</i>.

Nous pouvons utiliser des [chargeurs (loaders)](https://webpack.js.org/concepts/loaders/) pour informer webpack des fichiers qui doivent être traités avant d'être empaquetés.

Configurons un chargeur pour notre application qui transforme le code JSX en JavaScript ordinaire:

```js
const path = require('path')

const config = () => {
  return {
    entry: './src/index.js',
    output: {
      path: path.resolve(__dirname, 'build'),
      filename: 'main.js'
    },
      // highlight-start
    module: {
      rules: [
        {
          test: /\.js$/,
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-react'],
          },
        },
      ],
    },
      // highlight-end
  }
}

module.exports = config
```

Les chargeurs sont définis sous la propriété <i>module</i> dans le tableau <i>rules</i> (règles).

La définition d'un seul chargeur se compose de trois parties:

```js
{
  test: /\.js$/,
  loader: 'babel-loader',
  options: {
    presets: ['@babel/preset-react']
  }
}
```

La propriété <i>test</i> spécifie que le chargeur est destiné aux fichiers dont les noms se terminent par <i>.js</i>. La propriété <i>loader</i> spécifie que le traitement de ces fichiers sera effectué avec [babel-loader](https://github.com/babel/babel-loader). La propriété <i>options</i> est utilisée pour spécifier des paramètres pour le chargeur, qui configurent sa fonctionnalité.

Installons le chargeur et ses paquets requis en tant que <i>dépendance de développement</i>:

```bash
npm install @babel/core babel-loader @babel/preset-react --save-dev
```

L'empaquetage de l'application réussira désormais.

Si nous apportons des modifications au composant <i>App</i> et examinons le code empaqueté, nous remarquons que la version empaquetée du composant ressemble à ceci:

```js
const App = () =>
  react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
    'div',
    null,
    'hello webpack'
  )
```

Comme nous pouvons le voir dans l'exemple ci-dessus, les éléments React qui ont été écrits en JSX sont maintenant créés avec du JavaScript ordinaire en utilisant la fonction [createElement](https://react.dev/reference/react/createElement) de React.

Vous pouvez tester l'application empaquetée en ouvrant le fichier <i>build/index.html</i> avec la fonctionnalité <i>ouvrir le fichier</i> de votre navigateur:

![navigateur hello webpack](../../images/7/22.png)

Il convient de noter que si le code source de l'application empaquetée utilise <i>async/await</i>, le navigateur ne rendra rien sur certains navigateurs. [Rechercher le message d'erreur dans la console](https://stackoverflow.com/questions/33527653/babel-6-regeneratorruntime-is-not-defined) éclairera le problème. Avec la [solution précédente](https://babeljs.io/docs/en/babel-polyfill/) étant obsolète, nous devons maintenant installer deux dépendances manquantes, à savoir [core-js](https://www.npmjs.com/package/core-js) et [regenerator-runtime](https://www.npmjs.com/package/regenerator-runtime):

```bash
npm install core-js regenerator-runtime
```

Vous devez importer ces dépendances en haut du fichier <i>index.js</i>:

```js
import 'core-js/stable/index.js'
import 'regenerator-runtime/runtime.js'
```

Notre configuration contient presque tout ce dont nous avons besoin pour le développement React.

### Transpilers

Le processus de transformation du code d'une forme de JavaScript à une autre est appelé [transpilation](https://en.wiktionary.org/wiki/transpile). La définition générale du terme est de compiler du code source en le transformant d'un langage à un autre.

En utilisant la configuration de la section précédente, nous sommes en train de <i>transpiler</i> le code contenant JSX en JavaScript ordinaire avec l'aide de [babel](https://babeljs.io/), qui est actuellement l'outil le plus populaire pour ce travail.

Comme mentionné dans la partie 1, la plupart des navigateurs ne prennent pas en charge les dernières fonctionnalités introduites dans ES6 et ES7, et pour cette raison, le code est généralement transpilé vers une version de JavaScript qui implémente la norme ES5.

Le processus de transpilation exécuté par Babel est défini avec des <i>plugins</i>. En pratique, la plupart des développeurs utilisent des [presets](https://babeljs.io/docs/plugins/) prêts à l'emploi qui sont des groupes de plugins préconfigurés.

Actuellement, nous utilisons le preset [@babel/preset-react](https://babeljs.io/docs/plugins/preset-react/) pour transpiler le code source de notre application:

```js
{
  test: /\.js$/,
  loader: 'babel-loader',
  options: {
    presets: ['@babel/preset-react'] // highlight-line
  }
}
```

Ajoutons le plugin [@babel/preset-env](https://babeljs.io/docs/plugins/preset-env/) qui contient tout ce dont nous avons besoin pour prendre le code utilisant toutes les dernières fonctionnalités et le transpiler en code compatible avec la norme ES5:

```js
{
  test: /\.js$/,
  loader: 'babel-loader',
  options: {
    presets: ['@babel/preset-env', '@babel/preset-react'] // highlight-line
  }
}
```

Installons le preset avec la commande:

```bash
npm install @babel/preset-env --save-dev
```

Lorsque nous transpilons le code, il est transformé en JavaScript à l'ancienne. La définition du composant <i>App</i> transformé ressemble à ceci:

```js
var App = function App() {
  return _react2.default.createElement('div', null, 'hello webpack')
};
```

Comme nous pouvons le voir, les variables sont déclarées avec le mot-clé _var_, car JavaScript ES5 ne comprend pas le mot-clé _const_. Les fonctions fléchées ne sont également pas utilisées, c'est pourquoi la définition de _fonction_ utilise le mot-clé function.

### CSS

Ajoutons du CSS à notre application. Créons un nouveau fichier <i>src/index.css</i>:

```css
.container {
  margin: 10px;
  background-color: #dee8e4;
}
```

Ensuite, utilisons le style dans le composant <i>App</i>:

```js
const App = () => {
  return (
    <div className="container">
      hello webpack
    </div>
  )
}
```

Et nous importons le style dans le fichier <i>index.js</i>:

```js
import './index.css'
```

Cela provoquera l'échec du processus de transpilation:

![échec de webpack manquant chargeur pour css/style](../../images/7/23x.png)

Lors de l'utilisation de CSS, nous devons utiliser les chargeurs [css](https://webpack.js.org/loaders/css-loader/) et [style](https://webpack.js.org/loaders/style-loader/):

```js
{
  rules: [
    {
      test: /\.js$/,
      loader: 'babel-loader',
      options: {
        presets: ['@babel/preset-react', '@babel/preset-env'],
      },
    },
    // highlight-start
    {
      test: /\.css$/,
      use: ['style-loader', 'css-loader'],
    },
    // highlight-end
  ],
}
```

Le rôle du [css loader](https://webpack.js.org/loaders/css-loader/) est de charger les fichiers <i>CSS</i> et celui du [style loader](https://webpack.js.org/loaders/style-loader/) est de générer et d'injecter un élément <i>style</i> contenant tous les styles de l'application.

Avec cette configuration, les définitions CSS sont incluses dans le fichier <i>main.js</i> de l'application. Pour cette raison, il n'est pas nécessaire d'importer séparément les styles <i>CSS</i> dans le fichier principal <i>index.html</i> de l'application.

Si nécessaire, le CSS de l'application peut également être généré dans son propre fichier séparé en utilisant le [mini-css-extract-plugin](https://github.com/webpack-contrib/mini-css-extract-plugin).

Lorsque nous installons les chargeurs:

```bash
npm install style-loader css-loader --save-dev
```

L'empaquetage réussira à nouveau et l'application recevra de nouveaux styles.

### Webpack-dev-server

La configuration actuelle permet de développer notre application, mais le flux de travail est terrible (au point qu'il ressemble au flux de travail de développement avec Java). Chaque fois que nous apportons un changement au code, nous devons l'empaqueter et rafraîchir le navigateur pour tester le code.

Le [webpack-dev-server](https://webpack.js.org/guides/development/#using-webpack-dev-server) offre une solution à nos problèmes. Installons-le avec la commande:

```js
npm install --save-dev webpack-dev-server
```

Définissons un script npm pour démarrer le serveur de développement:

```js
{
  // ...
  "scripts": {
    "build": "webpack --mode=development",
    "start": "webpack serve --mode=development" // highlight-line
  },
  // ...
}
```

Ajoutons également une nouvelle propriété <i>devServer</i> à l'objet de configuration dans le fichier <i>webpack.config.js</i>:

```js
const config = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'main.js',
  },
  // highlight-start
  devServer: {
    static: path.resolve(__dirname, 'build'),
    compress: true,
    port: 3000,
  },
  // highlight-end
  // ...
};
```

La commande _npm start_ va maintenant démarrer le serveur de développement sur le port 3000, ce qui signifie que notre application sera accessible en visitant <http://localhost:3000> dans le navigateur. Lorsque nous apportons des modifications au code, le navigateur rafraîchira automatiquement la page.

Le processus de mise à jour du code est rapide. Lorsque nous utilisons le serveur de développement, le code n'est pas empaqueté de la manière habituelle dans le fichier <i>main.js</i>. Le résultat de l'empaquetage existe uniquement en mémoire.

Étendons le code en changeant la définition du composant <i>App</i> comme indiqué ci-dessous:

```js
import React, { useState } from 'react'
import './index.css'

const App = () => {
  const [counter, setCounter] = useState(0)

  return (
    <div className="container">
      hello webpack {counter} clicks
      <button onClick={() => setCounter(counter + 1)}>
        press
      </button>
    </div>
  )
}

export default App
```

L'application fonctionne bien et le flux de travail de développement est assez fluide.

### Cartes sources (Source maps)

Extrayons le gestionnaire de clic dans sa propre fonction et stockons la valeur précédente du compteur dans son propre état <i>values</i>:

```js
const App = () => {
  const [counter, setCounter] = useState(0)
  const [values, setValues] = useState() // highlight-line

//highlight-start
  const handleClick = () => {
    setCounter(counter + 1)
    setValues(values.concat(counter))
  }
//highlight-end

  return (
    <div className="container">
      hello webpack {counter} clicks
      <button onClick={handleClick}> // highlight-line
        press
      </button>
    </div>
  )
}
```

L'application ne fonctionne plus et la console affichera l'erreur suivante :

![console devtools ne peut pas concaténer sur undefined dans handleClick](../../images/7/25.png)

Nous savons que l'erreur se trouve dans la méthode onClick, mais si l'application était plus grande, le message d'erreur serait assez difficile à localiser:

<pre>
App.js:27 Uncaught TypeError: Cannot read property 'concat' of undefined
    at handleClick (App.js:27)
</pre>

L'emplacement de l'erreur indiqué dans le message ne correspond pas à l'emplacement réel de l'erreur dans notre code source. Si nous cliquons sur le message d'erreur, nous remarquons que le code source affiché ne ressemble pas à notre code d'application:

![la source devtools n'affiche pas notre code source](../../images/7/26.png)

Bien sûr, nous voulons voir notre véritable code source dans le message d'erreur.

Heureusement, corriger le message d'erreur à cet égard est assez facile. Nous demanderons à webpack de générer une soi-disant [carte source](https://webpack.js.org/configuration/devtool/) pour le bundle, ce qui rend possible de <i>mapper les erreurs</i> qui surviennent pendant l'exécution du bundle à la partie correspondante dans le code source original.

La carte source peut être générée en ajoutant une nouvelle propriété <i>devtool</i> à l'objet de configuration avec la valeur 'source-map':

```js
const config = {
  entry: './src/index.js',
  output: {
    // ...
  },
  devServer: {
    // ...
  },
  devtool: 'source-map', // highlight-line
  // ..
};
```

Webpack doit être redémarré lorsque nous apportons des modifications à sa configuration. Il est également possible de faire en sorte que webpack surveille les modifications apportées à lui-même, mais nous ne le ferons pas cette fois.

Le message d'erreur est maintenant beaucoup mieux

![console devtools montrant une erreur de concat à une ligne différente](../../images/7/27.png)

puisqu'il se réfère au code que nous avons écrit:

![source devtools montrant notre vrai code avec values.concat](../../images/7/27eb.png)

Générer la carte source permet également d'utiliser le débogueur Chrome:

![débogueur devtools en pause juste avant la ligne en cause](../../images/7/28.png)

Corrigeons le bug en initialisant l'état de <i>values</i> comme un tableau vide:

```js
const App = () => {
  const [counter, setCounter] = useState(0)
  const [values, setValues] = useState([])
  // ...
}
```

### Minification du code

Lorsque nous déployons l'application en production, nous utilisons le bundle de code <i>main.js</i> généré par webpack. La taille du fichier <i>main.js</i> est de 1009487 octets même si notre application ne contient que quelques lignes de notre code. La grande taille du fichier est due au fait que le bundle contient également le code source de toute la bibliothèque React. La taille du code empaqueté est importante car le navigateur doit charger le code lorsque l'application est utilisée pour la première fois. Avec des connexions internet à haute vitesse, 1009487 octets ne posent pas de problème, mais si nous continuons à ajouter plus de dépendances externes, la vitesse de chargement pourrait devenir un problème, en particulier pour les utilisateurs mobiles.

Si nous inspectons le contenu du fichier bundle, nous remarquons qu'il pourrait être grandement optimisé en termes de taille de fichier en supprimant tous les commentaires. Il n'est pas utile d'optimiser manuellement ces fichiers, car il existe de nombreux outils pour cela.

Le processus d'optimisation pour les fichiers JavaScript s'appelle la <i>minification</i>. L'un des outils principaux destinés à cet effet est [UglifyJS](http://lisperator.net/uglifyjs/).

À partir de la version 4 de webpack, le plugin de minification ne nécessite pas de configuration supplémentaire pour être utilisé. Il suffit de modifier le script npm dans le fichier <i>package.json</i> pour spécifier que webpack exécutera l'empaquetage du code en mode <i>production</i>:

```json
{
  "name": "webpack-part7",
  "version": "0.0.1",
  "description": "practising webpack",
  "scripts": {
    "build": "webpack --mode=production", // highlight-line
    "start": "webpack serve --mode=development"
  },
  "license": "MIT",
  "dependencies": {
    // ...
  },
  "devDependencies": {
    // ...
  }
}
```

Lorsque nous empaquetons à nouveau l'application, la taille du fichier <i>main.js</i> résultant diminue considérablement:

```bash
$ ls -l build/main.js
-rw-r--r--  1 mluukkai  ATKK\hyad-all  227651 Feb  7 15:58 build/main.js
```

Le résultat du processus de minification ressemble à du code C à l'ancienne; tous les commentaires et même les espaces blancs inutiles et les caractères de nouvelle ligne ont été supprimés, et les noms de variables ont été remplacés par un seul caractère.

```js
function h(){if(!d){var e=u(p);d=!0;for(var t=c.length;t;){for(s=c,c=[];++f<t;)s&&s[f].run();f=-1,t=c.length}s=null,d=!1,function(e){if(o===clearTimeout)return clearTimeout(e);if((o===l||!o)&&clearTimeout)return o=clearTimeout,clearTimeout(e);try{o(e)}catch(t){try{return o.call(null,e)}catch(t){return o.call(this,e)}}}(e)}}a.nextTick=function(e){var t=new Array(arguments.length-1);if(arguments.length>1)
```

### Configuration de développement et de production

Ensuite, ajoutons un backend à notre application en réutilisant le backend de l'application de notes désormais familier.

Stockons le contenu suivant dans le fichier <i>db.json</i>:

```json
{
  "notes": [
    {
      "important": true,
      "content": "HTML is easy",
      "id": "5a3b8481bb01f9cb00ccb4a9"
    },
    {
      "important": false,
      "content": "Mongo can save js objects",
      "id": "5a3b920a61e8c8d3f484bdd0"
    }
  ]
}
```

Notre objectif est de configurer l'application avec webpack de telle manière que, lorsqu'elle est utilisée localement, l'application utilise le json-server disponible sur le port 3001 comme backend.

Le fichier empaqueté sera ensuite configuré pour utiliser le backend disponible à l'URL <https://notes2023.fly.dev/api/notes>.

Nous installerons <i>axios</i>, démarrerons le json-server, puis apporterons les modifications nécessaires à l'application. Pour varier un peu les choses, nous récupérerons les notes du backend avec notre [hook personnalisé](/en/part7/custom_hooks) appelé _useNotes_:

```js
// highlight-start
import React, { useState, useEffect } from 'react'
import axios from 'axios'

const useNotes = (url) => {
  const [notes, setNotes] = useState([])

  useEffect(() => {
    axios.get(url).then(response => {
      setNotes(response.data)
    })
  }, [url])

  return notes
}
// highlight-end

const App = () => {
  const [counter, setCounter] = useState(0)
  const [values, setValues] = useState([])
  const url = 'https://notes2023.fly.dev/api/notes' // highlight-line
  const notes = useNotes(url) // highlight-line

  const handleClick = () => {
    setCounter(counter + 1)
    setValues(values.concat(counter))
  }

  return (
    <div className="container">
      hello webpack {counter} clicks
      <button onClick={handleClick}>press</button>
      <div>{notes.length} notes on server {url}</div> // highlight-line
    </div>
  )
}

export default App
```

L'adresse du serveur backend est actuellement codée en dur dans le code de l'application. Comment pouvons-nous changer l'adresse de manière contrôlée pour qu'elle pointe vers le serveur backend de production lorsque le code est empaqueté pour la production ?

La fonction de configuration de Webpack a deux paramètres, <i>env</i> et <i>argv</i>. Nous pouvons utiliser ce dernier pour connaître le <i>mode</i> défini dans le script npm:

```js
const path = require('path')

const config = (env, argv) => { // highlight-line
  console.log('argv.mode:', argv.mode)
  return {
    // ...
  }
}

module.exports = config
```

Maintenant, si nous le souhaitons, nous pouvons configurer Webpack pour fonctionner différemment selon que l'environnement d'exploitation de l'application, ou <i>mode</i>, est défini sur production ou développement.

Nous pouvons également utiliser le [DefinePlugin](https://webpack.js.org/plugins/define-plugin/) de webpack pour définir des <i>constantes globales par défaut</i> qui peuvent être utilisées dans le code empaqueté. Définissons une nouvelle constante globale <i>BACKEND\_URL</i> qui obtient une valeur différente selon l'environnement pour lequel le code est empaqueté:

```js
const path = require('path')
const webpack = require('webpack') // highlight-line

const config = (env, argv) => {
  console.log('argv', argv.mode)

  // highlight-start
  const backend_url = argv.mode === 'production'
    ? 'https://notes2023.fly.dev/api/notes'
    : 'http://localhost:3001/notes'
  // highlight-end

  return {
    entry: './src/index.js',
    output: {
      path: path.resolve(__dirname, 'build'),
      filename: 'main.js'
    },
    devServer: {
      static: path.resolve(__dirname, 'build'),
      compress: true,
      port: 3000,
    },
    devtool: 'source-map',
    module: {
      // ...
    },
    // highlight-start
    plugins: [
      new webpack.DefinePlugin({
        BACKEND_URL: JSON.stringify(backend_url)
      })
    ]
    // highlight-end
  }
}

module.exports = config
```

La constante globale est utilisée de la manière suivante dans le code:

```js
const App = () => {
  const [counter, setCounter] = useState(0)
  const [values, setValues] = useState([])
  const notes = useNotes(BACKEND_URL) // highlight-line

  // ...
  return (
    <div className="container">
      hello webpack {counter} clicks
      <button onClick={handleClick} >press</button>
      <div>{notes.length} notes on server {BACKEND_URL}</div> // highlight-line
    </div>
  )
}
```

Si la configuration pour le développement et la production diffère beaucoup, il peut être judicieux de [séparer la configuration](https://webpack.js.org/guides/production/) des deux dans leurs propres fichiers.

Maintenant, si l'application est lancée avec la commande npm start en mode développement, elle récupère les notes depuis l'adresse <http://localhost:3001/notes>. La version empaquetée avec la commande _npm run build_ utilise l'adresse <https://notes2023.fly.dev/api/notes> pour obtenir la liste des notes.

Nous pouvons inspecter localement la version de production empaquetée de l'application en exécutant la commande suivante dans le répertoire <i>build</i>:

```bash
npx static-server
```

Par défaut, l'application empaquetée sera disponible à <http://localhost:9080>.

### Polyfill

Notre application est terminée et fonctionne avec toutes les versions relativement récentes des navigateurs modernes, à l'exception d'Internet Explorer. La raison en est que, à cause d'axios, notre code utilise les [Promesses](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise), et aucune version existante d'IE ne les prend en charge:

![tableau de compatibilité des navigateurs soulignant à quel point Internet Explorer est mauvais](../../images/7/29.png)

Il y a beaucoup d'autres choses dans la norme qu'IE ne prend pas en charge. Quelque chose d'aussi inoffensif que la méthode [find](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find) des tableaux JavaScript dépasse les capacités d'IE:

![tableau de compatibilité des navigateurs montrant qu'IE ne prend pas en charge la méthode find](../../images/7/30.png)

Dans ces situations, il ne suffit pas de transpiler le code, car la transpilation transforme simplement le code d'une version plus récente de JavaScript en une version plus ancienne avec une prise en charge plus large par les navigateurs. IE comprend syntaxiquement les Promesses mais n'a tout simplement pas implémenté leur fonctionnalité. La propriété find des tableaux dans IE est simplement <i>undefined</i>.

Si nous voulons que l'application soit compatible avec IE, nous devons ajouter un [polyfill](https://remysharp.com/2010/10/08/what-is-a-polyfill), qui est un code qui ajoute la fonctionnalité manquante aux navigateurs plus anciens.

Les polyfills peuvent être ajoutés à l'aide de [webpack et Babel](https://babeljs.io/docs/usage/polyfill/) ou en installant l'une des nombreuses bibliothèques de polyfill existantes.

Le polyfill fourni par la bibliothèque [promise-polyfill](https://www.npmjs.com/package/promise-polyfill) est facile à utiliser. Nous devons simplement ajouter ce qui suit à notre code d'application existant:

```js
import PromisePolyfill from 'promise-polyfill'

if (!window.Promise) {
  window.Promise = PromisePolyfill
}
```

Si l'objet global _Promise_ n'existe pas, ce qui signifie que le navigateur ne prend pas en charge les Promesses, la Promise polyfillée est stockée dans la variable globale. Si la Promise polyfillée est suffisamment bien implémentée, le reste du code devrait fonctionner sans problèmes.

Une liste exhaustive des polyfills existants peut être trouvée [ici](https://github.com/Modernizr/Modernizr/wiki/HTML5-Cross-browser-Polyfills).

La compatibilité des différents API avec les navigateurs peut être vérifiée en visitant [https://caniuse.com](https://caniuse.com) ou le site web de [Mozilla](https://developer.mozilla.org/en-US/).

</div>