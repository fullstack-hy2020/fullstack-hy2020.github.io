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



</div>