---
mainImage: ../../../images/part-2.svg
part: 2
letter: c
lang: fr
---

<div class="content">

Depuis un certain temps, nous ne travaillons que sur le "frontend", c'est-à-dire la fonctionnalité côté client (navigateur). Nous commencerons à travailler sur le "backend", c'est-à-dire les fonctionnalités côté serveur dans la [troisième partie](/fr/part3) de ce cours. Néanmoins, nous allons maintenant faire un pas dans cette direction en nous familiarisant avec la façon dont le code s'exécutant dans le navigateur communique avec le backend.

Utilisons un outil destiné à être utilisé lors du développement logiciel appelé [JSON Server](https://github.com/typicode/json-server) pour agir en tant que notre serveur.

Créez un fichier nommé <i>db.json</i> dans le répertoire racine du projet de notes précédent avec le contenu suivant :

```json
{
  "notes": [
    {
      "id": 1,
      "content": "HTML is easy",
      "date": "2022-1-17T17:30:31.098Z",
      "important": true
    },
    {
      "id": 2,
      "content": "Browser can execute only JavaScript",
      "date": "2022-1-17T18:39:34.091Z",
      "important": false
    },
    {
      "id": 3,
      "content": "GET and POST are the most important methods of HTTP protocol",
      "date": "2022-1-17T19:20:14.298Z",
      "important": true
    }
  ]
}
```

Vous pouvez [installer](https://github.com/typicode/json-server#getting-started) le serveur JSON globalement sur votre ordinateur à l'aide de la commande _npm install -g json-server_. Une installation globale nécessite des privilèges administratifs, ce qui signifie qu'elle n'est pas possible sur les ordinateurs des professeurs ou les ordinateurs portables des étudiants de première année.

Cependant, une installation globale n'est pas nécessaire. Depuis le répertoire racine de votre application, nous pouvons exécuter le <i>json-server</i> en utilisant la commande _npx_ :

```js
npx json-server --port 3001 --watch db.json
```

Le <i>json-server</i> commence à s'exécuter sur le port 3000 par défaut ; mais comme les projets créés à l'aide de create-react-app réservent le port 3000, nous devons définir un port alternatif, tel que le port 3001, pour le serveur json.

Naviguons jusqu'à l'adresse <http://localhost:3001/notes> dans le navigateur. Nous pouvons voir que <i>json-server</i> retourne les notes que nous avons précédemment écrites dans le fichier au format JSON :

![](../../images/2/14e.png)

Si votre navigateur ne permet pas de formater l'affichage des données JSON, installez un plugin approprié, par ex. [JSONView](https://chrome.google.com/webstore/detail/jsonview/chklaanhfefbnpoihckbnefhakgolnmc) pour vous faciliter la vie.

À l'avenir, l'idée sera de sauvegarder les notes sur le serveur, ce qui signifie dans ce cas de les sauvegarder sur le serveur json. Le code React récupère les notes du serveur et les affiche à l'écran. Chaque fois qu'une nouvelle note est ajoutée à l'application, le code React l'envoie également au serveur pour que la nouvelle note persiste en "mémoire".

json-server stocke toutes les données dans le fichier <i>db.json</i>, qui réside sur le serveur. Dans le monde réel, les données seraient stockées dans une sorte de base de données. Cependant, json-server est un outil pratique qui permet d'utiliser les fonctionnalités côté serveur dans la phase de développement sans avoir besoin de programmer quoi que ce soit.

Nous nous familiariserons plus en détail avec les principes d'implémentation des fonctionnalités côté serveur dans la [partie 3](/fr/part3) de ce cours.

### Le navigateur comme environnement d'exécution

Notre première tâche consiste à récupérer les notes déjà existantes dans notre application React à partir de l'adresse <http://localhost:3001/notes>.

Dans l'[exemple de projet](/fr/part0/introduction_aux_applications_web#execution-de-la-logique-dapplication-dans-le-navigateur) de la partie 0, nous avons appris un moyen de récupérer des données à partir d'un serveur à l'aide de JavaScript. Le code de l'exemple récupérait les données à l'aide de [XMLHttpRequest](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest), également connu sous le nom de requête HTTP effectuée à l'aide d'un objet XHR. Il s'agit d'une technique introduite en 1999, que tous les navigateurs supportent depuis un bon moment maintenant.

L'utilisation de XHR n'est plus recommandée, et les navigateurs supportent déjà largement la méthode [fetch](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch), qui est basée sur les [promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise), au lieu du modèle événementiel utilisé par XHR.

Pour rappel de la partie 0 (qu'il faut en fait <i>se souvenir de ne pas utiliser</i> sans raison impérieuse), les données ont été récupérées en utilisant XHR de la manière suivante :


```js
const xhttp = new XMLHttpRequest()

xhttp.onreadystatechange = function() {
  if (this.readyState == 4 && this.status == 200) {
    const data = JSON.parse(this.responseText)
    // gérer la réponse qui est enregistrée dans la variable data
  }
}

xhttp.open('GET', '/data.json', true)
xhttp.send()
```

Dès le début, nous enregistrons un <i>gestionnaire d'événements</i> sur l'objet <em>xhttp</em> représentant la requête HTTP, qui sera appelée par le runtime JavaScript chaque fois que l'état de <em>xhttp</em> changements d'objet. Si le changement d'état signifie que la réponse à la demande est arrivée, alors les données sont traitées en conséquence.

Il convient de noter que le code du gestionnaire d'événements est défini avant que la requête ne soit envoyée au serveur. Malgré cela, le code du gestionnaire d'événements sera exécuté ultérieurement. Par conséquent, le code ne s'exécute pas de manière synchrone "de haut en bas", mais le fait de manière <i>asynchrone</i>. JavaScript appelle le gestionnaire d'événements qui a été enregistré pour la demande à un moment donné.

Une manière synchrone de faire des requêtes qui est courante dans la programmation Java, par exemple, se déroulerait comme suit (NB, ce n'est pas du code Java fonctionnel):

```java
HTTPRequest request = new HTTPRequest();

String url = "https://studies.cs.helsinki.fi/exampleapp/data.json";
List<Note> notes = request.get(url);

notes.forEach(m => {
  System.out.println(m.content);
});
```

En Java, le code s'exécute ligne par ligne et s'arrête pour attendre la requête HTTP, c'est-à-dire attendre la fin de la commande _request.get(...)_. Les données renvoyées par la commande, dans ce cas les notes, sont ensuite stockées dans une variable, et nous commençons à manipuler les données de la manière souhaitée.

D'autre part, les moteurs JavaScript ou les environnements d'exécution suivent le [modèle asynchrone](https://developer.mozilla.org/en-US/docs/Web/JavaScript/EventLoop). En principe, cela nécessite que toutes les [opérations IO](https://en.wikipedia.org/wiki/Input/output) (à quelques exceptions près) soient exécutées de manière non bloquante. Cela signifie que l'exécution du code se poursuit immédiatement après l'appel d'une fonction IO, sans attendre son retour.

Lorsqu'une opération asynchrone est terminée, ou, plus précisément, à un moment donné après son achèvement, le moteur JavaScript appelle les gestionnaires d'événements enregistrés à l'opération.

Actuellement, les moteurs JavaScript sont <i>à thread unique</i>, ce qui signifie qu'ils ne peuvent pas exécuter de code en parallèle. Par conséquent, il est nécessaire en pratique d'utiliser un modèle non bloquant pour l'exécution des opérations IO. Sinon, le navigateur "se bloquerait" pendant, par exemple, la récupération de données à partir d'un serveur.

Une autre conséquence de cette nature à thread unique des moteurs JavaScript est que si l'exécution de certains codes prend beaucoup de temps, le navigateur restera bloqué pendant toute la durée de l'exécution. Si nous ajoutions le code suivant en haut de notre application :

```js
setTimeout(() => {
  console.log('loop..')
  let i = 0
  while (i < 50000000000) {
    i++
  }
  console.log('end')
}, 5000)
```

tout fonctionnerait normalement pendant 5 secondes. Cependant, lorsque la fonction définie comme paramètre pour <em>setTimeout</em> est exécutée, le navigateur sera bloqué pendant toute la durée d'exécution de la longue boucle. Même l'onglet du navigateur ne peut pas être fermé pendant l'exécution de la boucle, du moins pas dans Chrome.

Pour que le navigateur reste <i>réactif</i>, c'est-à-dire qu'il puisse réagir en permanence aux opérations de l'utilisateur avec une vitesse suffisante, la logique du code doit être telle qu'aucun calcul ne peut prendre trop de temps.

Il existe une foule de documents supplémentaires sur le sujet à trouver sur Internet. Une présentation particulièrement claire du sujet est le discours d'ouverture de Philip Roberts intitulé [Qu'est-ce que c'est que la boucle d'événement de toute façon ?](https://www.youtube.com/watch?v=8aGhZQkoFbQ)

Dans les navigateurs d'aujourd'hui, il est possible d'exécuter du code parallélisé à l'aide de ce qu'on appelle des [web workers](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers). La boucle d'événements d'une fenêtre de navigateur individuelle n'est cependant toujours gérée que par un [fil unique](https://medium.com/techtrument/multithreading-javascript-46156179cf9a).

### npm

Revenons au sujet de la récupération des données du serveur.

Nous pourrions utiliser la fonction basée sur la promise mentionnée précédemment [fetch](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch) pour extraire les données du serveur. Fetch est un excellent outil. Il est standardisé et supporté par tous les navigateurs modernes (hors IE).

Cela étant dit, nous utiliserons plutôt la bibliothèque [axios](https://github.com/axios/axios) pour la communication entre le navigateur et le serveur. Axios fonctionne comme fetch, mais est un peu plus agréable à utiliser. Une autre bonne raison d'utiliser axios est que nous nous familiarisons avec l'ajout de bibliothèques externes, appelées <i>packages npm</i>, aux projets React.

De nos jours, pratiquement tous les projets JavaScript sont définis à l'aide du gestionnaire de packages de nœuds, alias [npm](https://docs.npmjs.com/getting-started/what-is-npm). Les projets créés à l'aide de create-react-app suivent également le format npm. Un indicateur clair qu'un projet utilise npm est le fichier <i>package.json</i> situé à la racine du projet :

```json
{
  "name": "notes",
  "version": "0.1.0",
  "private": true,
  "dependencies": {
    "@testing-library/jest-dom": "^5.16.1",
    "@testing-library/react": "^12.1.2",
    "@testing-library/user-event": "^13.5.0",
    "react": "^17.0.2",
    "react-dom": "^17.0.2",
    "react-scripts": "5.0.0",
    "web-vitals": "^2.1.3"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
  "eslintConfig": {
    "extends": [
      "react-app",
      "react-app/jest"
    ]
  },
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  }
}
```

À ce stade, la partie <i>dépendances</i> nous intéresse le plus car elle définit les <i>dépendances</i>, ou bibliothèques externes, du projet.

Nous voulons maintenant utiliser axios. Théoriquement, on pourrait définir la librairie directement dans le fichier <i>package.json</i>, mais il vaut mieux l'installer depuis la ligne de commande.

```js
npm install axios
```


**NB Les commandes _npm_ doivent toujours être exécutées dans le répertoire racine du projet**, où se trouve le fichier <i>package.json</i>.

Axios est désormais inclus parmi les autres dépendances :

```json
{
  "name": "notes",
  "version": "0.1.0",
  "private": true,
  "dependencies": {
    "@testing-library/jest-dom": "^5.16.1",
    "@testing-library/react": "^12.1.2",
    "@testing-library/user-event": "^13.5.0",
    "axios": "^0.24.0", // highlight-line
    "react": "^17.0.2",
    "react-dom": "^17.0.2",
    "react-scripts": "5.0.0",
    "web-vitals": "^2.1.3"
  },
  // ...
}
```

En plus d'ajouter axios aux dépendances, la commande <em>npm install</em> a également <i>téléchargé</i> le code de la bibliothèque. Comme pour les autres dépendances, le code se trouve dans le répertoire <i>node\_modules</i> situé à la racine. Comme on a pu le remarquer, <i>node\_modules</i> contient une bonne quantité de choses intéressantes.

Faisons un autre ajout. Installez <i>json-server</i> en tant que dépendance de développement (utilisée uniquement pendant le développement) en exécutant la commande :

```js
npm install json-server --save-dev
```

et faire un petit ajout à la partie <i>scripts</i> du fichier <i>package.json</i> :

```json
{
  // ... 
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject",
    "server": "json-server -p3001 --watch db.json" // highlight-line
  },
}
```

Nous pouvons maintenant, sans définitions de paramètres, démarrer le json-server à partir du répertoire racine du projet avec la commande :

```js
npm run server
```

Nous nous familiariserons davantage avec l'outil _npm_ dans la [troisième partie du cours](/fr/part3).

**NB** Le serveur json précédemment démarré doit être terminé avant d'en démarrer un nouveau ; sinon il y aura des problèmes :

![](../../images/2/15b.png)

Le rouge dans le message d'erreur nous informe du problème :

<i>Cannot bind to port 3001. Please specify another port number either through --port argument or through the json-server.json configuration file</i> 

Comme nous pouvons le voir, l'application n'est pas capable de se lier au [port](https://en.wikipedia.org/wiki/Port_(computer_networking)). La raison étant que le port 3001 est déjà occupé par le serveur json précédemment démarré.

Nous avons utilisé la commande _npm install_ deux fois, mais avec de légères différences :

```js
npm install axios
npm install json-server --save-dev
```

Il y a une fine différence dans les paramètres. <i>axios</i> est installé en tant que dépendance d'exécution de l'application, car l'exécution du programme nécessite l'existence de la bibliothèque. D'autre part, <i>json-server</i> a été installé en tant que dépendance de développement (_--save-dev_), puisque le programme lui-même n'en a pas besoin. Il est utilisé pour l'assistance lors du développement de logiciels. Il y aura plus sur les différentes dépendances dans la prochaine partie du cours.

### Axios et promises

Nous sommes maintenant prêts à utiliser axios. À l'avenir, json-server est supposé s'exécuter sur le port 3001.

NB : Pour exécuter simultanément json-server et votre application React, vous devrez peut-être utiliser deux fenêtres de terminal. L'une pour maintenir json-server en cours d'exécution et l'autre pour exécuter react-app.

La bibliothèque peut être mise en service de la même manière que d'autres bibliothèques, par ex. React, c'est-à-dire en utilisant une instruction <em>import</em> appropriée.

Ajoutez ce qui suit au fichier <i>index.js</i> :

```js
import axios from 'axios'

const promise = axios.get('http://localhost:3001/notes')
console.log(promise)

const promise2 = axios.get('http://localhost:3001/foobar')
console.log(promise2)
```

Si vous ouvrez <http://localhost:3000> dans le navigateur, cela devrait être imprimé sur la console

![](../../images/2/16b.png)

**Remarque :** lorsque le contenu du fichier <i>index.js</i> change, React ne le remarque pas toujours automatiquement, vous devrez donc peut-être actualiser le navigateur pour voir vos modifications ! Une solution de contournement simple pour que React remarque automatiquement le changement consiste à créer un fichier nommé <i>.env</i> dans le répertoire racine du projet et à ajouter cette ligne <i>FAST_REFRESH=false</i>. Redémarrez l'application pour que les modifications appliquées prennent effet.

La méthode _get_ d'Axios renvoie une [promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises).

La documentation sur le site de Mozilla indique ce qui suit à propos des promises:

> <i>Une Promise est un objet représentant l'achèvement ou l'échec éventuel d'une opération asynchrone.</i>

En d'autres termes, une promise est un objet qui représente une opération asynchrone. Une promise peut avoir trois états distincts :

1. La promise est <i>en attente</i> : cela signifie que la valeur finale (l'une des deux suivantes) n'est pas encore disponible.
2. La promise est <i>tenue</i> : cela signifie que l'opération est terminée et que la valeur finale est disponible, ce qui est généralement une opération réussie. Cet état est parfois aussi appelé <i>résolu</i>.
3. La promise est <i>rejetée</i> : cela signifie qu'une erreur a empêché la détermination de la valeur finale, ce qui représente généralement une opération échouée.

La première promise dans notre exemple est <i>fulfilled</i>, représentant une requête _axios.get('http://localhost:3001/notes')_ réussie. La seconde, cependant, est <i>rejetée</i>, et la console nous en donne la raison. Il semble que nous essayions de faire une requête HTTP GET à une adresse inexistante.

Si, et quand, nous voulons accéder au résultat de l'opération représentée par la promise, nous devons associer un gestionnaire d'événements à la promise. Ceci est réalisé en utilisant la méthode <em>then</em> :

```js
const promise = axios.get('http://localhost:3001/notes')

promise.then(response => {
  console.log(response)
})
```
Ce qui suit est renvoyé sur la console :

![](../../images/2/17new.png)

L'environnement d'exécution JavaScript appelle la fonction de rappel enregistrée par la méthode <em>then</em> en lui fournissant un objet <em>response</em> en tant que paramètre. L'objet <em>response</em> contient toutes les données essentielles liées à la réponse d'une requête HTTP GET, qui inclurait les <i>données</i> renvoyées, le <i>code d'état</i> et <i>en-têtes</i>.

Stocker l'objet promise dans une variable est généralement inutile, et il est plutôt courant d'enchaîner l'appel de méthode <em>then</em> à l'appel de méthode axios, de sorte qu'il le suive directement :

```js
axios.get('http://localhost:3001/notes').then(response => {
  const notes = response.data
  console.log(notes)
})
```

La fonction callback prend maintenant les données contenues dans la réponse, les stocke dans une variable et affiche les notes sur la console.

Une façon plus lisible de formater les appels de méthode <i>chaînés</i> consiste à placer chaque appel sur sa propre ligne :

```js
axios
  .get('http://localhost:3001/notes')
  .then(response => {
    const notes = response.data
    console.log(notes)
  })
```

Les données renvoyées par le serveur sont du texte brut, essentiellement une seule longue chaîne. La bibliothèque axios est toujours capable d'analyser les données dans un tableau JavaScript, puisque le serveur a spécifié que le format de données est <i>application/json ; charset=utf-8</i> (voir image précédente) en utilisant l'en-tête <i>content-type</i>.

Nous pouvons enfin commencer à utiliser les données récupérées sur le serveur.

Essayons de demander les notes à notre serveur local et de les rendre, initialement en tant que composant App. Veuillez noter que cette approche présente de nombreux problèmes, car nous n'affichons l'intégralité du composant <i>App</i> que lorsque nous récupérons avec succès une réponse :

```js
import React from 'react'
import ReactDOM from 'react-dom/client'
import axios from 'axios' // highlight-line

import App from './App'

axios.get('http://localhost:3001/notes').then(response => {
  const notes = response.data
  ReactDOM.createRoot(document.getElementById('root')).render(<App notes={notes} />)
})
```

Cette méthode pourrait être acceptable dans certaines circonstances, mais elle est quelque peu problématique. Déplaçons plutôt la récupération des données dans le composant <i>App</i>.

Ce qui n'est pas immédiatement évident, cependant, c'est où la commande <em>axios.get</em> doit être placée dans le composant.

### Hooks d'effet

Nous avons déjà utilisé les [state hooks](https://reactjs.org/docs/hooks-state.html) qui ont été introduits avec la version React [16.8.0](https://www.npmjs.com/package/react/v/16.8.0), qui fournissent un état aux composants React définis comme des fonctions - les soi-disant <i>composants fonctionnels</i>. La version 16.8.0 introduit également les [Hooks d'effet](https://reactjs.org/docs/hooks-effect.html) en tant que nouvelle fonctionnalité. Selon la doc officielle :

> <i>Le hook d'effet vous permet d'effectuer des effets secondaires sur les composants fonctionnels.</i>
> <i>La récupération de données, la configuration d'un abonnement et la modification manuelle du DOM dans les composants React sont tous des exemples d'effets secondaires.</i>

En tant que tels, les hooks d'effet sont précisément le bon outil à utiliser lors de la récupération de données à partir d'un serveur.

Supprimons la récupération des données de <i>index.js</i>. Puisque nous allons récupérer les notes du serveur, il n'est plus nécessaire de transmettre des données en tant qu'accessoires au composant <i>App</i>. Donc <i>index.js</i> peut être simplifié en :

```js
ReactDOM.createRoot(document.getElementById('root')).render(<App />)
```

Le composant <i>App</i> change comme suit :

```js
import { useState, useEffect } from 'react' // highlight-line
import axios from 'axios' // highlight-line
import Note from './components/Note'

const App = () => { // highlight-line
  const [notes, setNotes] = useState([]) // highlight-line
  const [newNote, setNewNote] = useState('')
  const [showAll, setShowAll] = useState(true)

// highlight-start
  useEffect(() => {
    console.log('effect')
    axios
      .get('http://localhost:3001/notes')
      .then(response => {
        console.log('promise fulfilled')
        setNotes(response.data)
      })
  }, [])

  console.log('render', notes.length, 'notes')
// highlight-end

  // ...
}
```

Nous avons également ajouté quelques impressions utiles, qui clarifient la progression de l'exécution.

Ceci est affiché sur la console :

<pre>
render 0 notes
effect
promise fulfilled
render 3 notes
</pre>

Tout d'abord, le corps de la fonction définissant le composant est exécuté et le composant est rendu pour la première fois. À ce stade, <i>render 0 notes</i> est imprimé, ce qui signifie que les données n'ont pas encore été extraites du serveur.

La fonction ou l'effet suivant dans le jargon React :

```js
() => {
  console.log('effect')
  axios
    .get('http://localhost:3001/notes')
    .then(response => {
      console.log('promise fulfilled')
      setNotes(response.data)
    })
}
```

est exécuté immédiatement après le rendu. L'exécution de la fonction entraîne l'impression de l'<i>effet</i> sur la console, et la commande <em>axios.get</em> lance la récupération des données du serveur et enregistre la fonction suivante en tant que un <i>gestionnaire d'événements</i> pour l'opération :

```js
response => {
  console.log('promise fulfilled')
  setNotes(response.data)
}
```

Lorsque les données arrivent du serveur, le runtime JavaScript appelle la fonction enregistrée en tant que gestionnaire d'événements, qui affiche <i>promise fulfilled</i> sur la console et stocke les notes reçues du serveur dans l'état à l'aide de la fonction <em>setNotes(response.data)</em>.

Comme toujours, un appel à une fonction de mise à jour d'état déclenche le nouveau rendu du composant. Par conséquent, <i>render 3 notes</i> est affiché sur la console et les notes récupérées sur le serveur sont rendues à l'écran.

Enfin, regardons la définition du hook d'effet dans son ensemble :

```js
useEffect(() => {
  console.log('effect')
  axios
    .get('http://localhost:3001/notes').then(response => {
      console.log('promise fulfilled')
      setNotes(response.data)
    })
}, [])
```

Réécrivons le code un peu différemment.

```js
const hook = () => {
  console.log('effect')
  axios
    .get('http://localhost:3001/notes')
    .then(response => {
      console.log('promise fulfilled')
      setNotes(response.data)
    })
}

useEffect(hook, [])
```

Maintenant, nous pouvons voir plus clairement que la fonction [useEffect](https://reactjs.org/docs/hooks-reference.html#useeffect) prend en fait <i>deux paramètres</i>. Le premier est une fonction, l'<i>effet</i> lui-même. Selon la documentation :

> <i>Par défaut, les effets s'exécutent après chaque rendu terminé, mais vous pouvez choisir de ne les déclencher que lorsque certaines valeurs ont changé.</i>

Ainsi, par défaut, l'effet est <i>toujours</i> exécuté après le rendu du composant. Dans notre cas, cependant, nous ne voulons exécuter l'effet qu'avec le premier rendu.

Le deuxième paramètre de <em>useEffect</em> est utilisé pour [spécifier la fréquence d'exécution de l'effet](https://reactjs.org/docs/hooks-reference.html#conditionally-firing-an-effect). Si le deuxième paramètre est un tableau vide <em>[]</em>, alors l'effet n'est exécuté qu'avec le premier rendu du composant.

Il existe de nombreux cas d'utilisation possibles pour un hook d'effet autres que la récupération de données à partir du serveur. Cependant, cette utilisation nous suffit, pour l'instant.

Repensez à la séquence d'événements dont nous venons de parler. Quelles parties du code sont exécutées ? Dans quel ordre? À quelle fréquence? Comprendre l'ordre des événements est essentiel !

Notez que nous aurions également pu écrire le code de la fonction d'effet de cette façon :

```js
useEffect(() => {
  console.log('effect')

  const eventHandler = response => {
    console.log('promise fulfilled')
    setNotes(response.data)
  }

  const promise = axios.get('http://localhost:3001/notes')
  promise.then(eventHandler)
}, [])
```

Une référence à une fonction de gestion d'événements est affectée à la variable <em>eventHandler</em>. La promise renvoyée par la méthode <em>get</em> d'Axios est stockée dans la variable <em>promise</em>. L'enregistrement du rappel se produit en donnant la variable <em>eventHandler</em>, faisant référence à la fonction de gestion d'événements, en tant que paramètre de la méthode <em>then</em> de la promise. Il n'est généralement pas nécessaire d'assigner des fonctions et des promises aux variables, et une manière plus compacte de représenter les choses, comme vu plus haut, est suffisante.

```js
useEffect(() => {
  console.log('effect')
  axios
    .get('http://localhost:3001/notes')
    .then(response => {
      console.log('promise fulfilled')
      setNotes(response.data)
    })
}, [])
```

Nous avons toujours un problème dans notre application. Lors de l'ajout de nouvelles notes, elles ne sont pas stockées sur le serveur.

Le code de l'application, tel que décrit jusqu'à présent, peut être trouvé dans son intégralité sur [github](https://github.com/fullstack-hy2020/part2-notes/tree/part2-4), sur la branche <i>part2-4</i>.

### Environnement d'exécution de développement

La configuration de l'ensemble de l'application est devenue de plus en plus complexe. Passons en revue ce qui se passe et où. L'image suivante décrit la composition de l'application

![](../../images/2/18e.png)

Le code JavaScript composant notre application React est exécuté dans le navigateur. Le navigateur obtient le JavaScript du <i>serveur de développement React</i>, qui est l'application qui s'exécute après l'exécution de la commande <em>npm start</em>. Le dev-server transforme le JavaScript dans un format compris par le navigateur. Entre autres choses, il assemble le JavaScript de différents fichiers en un seul fichier. Nous aborderons le dev-server plus en détail dans la partie 7 du cours.

L'application React s'exécutant dans le navigateur récupère les données au format JSON à partir de <i>json-server</i> s'exécutant sur le port 3001 de la machine. Le serveur à partir duquel nous interrogeons les données - <i>json-server</i> - obtient ses données à partir du fichier <i>db.json</i>.

À ce stade du développement, toutes les parties de l'application résident sur la machine du développeur, également appelée localhost. La situation change lorsque l'application est déployée sur Internet. Nous le ferons dans la partie 3.

</div>

<div class="tasks">

<h3>Exercices 2.11.-2.14.</h3>

<h4>2.11: phonebook, étape6</h4>

Nous continuons à développer le répertoire. Stockez l'état initial de l'application dans le fichier <i>db.json</i>, qui doit être placé à la racine du projet.

```json
{
  "persons":[
    { 
      "name": "Arto Hellas", 
      "number": "040-123456",
      "id": 1
    },
    { 
      "name": "Ada Lovelace", 
      "number": "39-44-5323523",
      "id": 2
    },
    { 
      "name": "Dan Abramov", 
      "number": "12-43-234345",
      "id": 3
    },
    { 
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122",
      "id": 4
    }
  ]
}
```

Démarrez json-server sur le port 3001 et assurez-vous que le serveur renvoie la liste des personnes en allant à l'adresse <http://localhost:3001/persons> dans le navigateur.

Si vous recevez le message d'erreur suivant :

```js
events.js:182
      throw er; // Unhandled 'error' event
      ^

Error: listen EADDRINUSE 0.0.0.0:3001
    at Object._errnoException (util.js:1019:11)
    at _exceptionWithHostPort (util.js:1041:20)
```

cela signifie que le port 3001 est déjà utilisé par une autre application, par ex. en cours d'utilisation par un json-server déjà en cours d'exécution. Fermez l'autre application ou modifiez le port au cas où cela ne fonctionnerait pas.

Modifiez l'application de sorte que l'état initial des données soit extrait du serveur à l'aide de la bibliothèque <i>axios</i>. Terminez la récupération avec un [Hook d'effet](https://reactjs.org/docs/hooks-effect.html).

<h4>2.12* countries, étape1</h4>

L'API [https://restcountries.com](https://restcountries.com) fournit des données pour différents pays dans un format lisible par machine, appelé API REST.

Créer une application, dans laquelle on peut consulter les données de différents pays. L'application devrait probablement obtenir les données du end point [all](https://restcountries.com/v3.1/all).

L'interface utilisateur est très simple. Le pays à afficher est trouvé en tapant une requête de recherche dans le champ de recherche.

S'il y a trop de pays (plus de 10) qui correspondent à la requête, l'utilisateur est invité à préciser sa requête :

![](../../images/2/19b1.png)

S'il y a dix pays ou moins, mais plus d'un, tous les pays correspondant à la requête sont affichés :

![](../../images/2/19b2.png)

Lorsqu'il n'y a qu'un seul pays correspondant à la requête, les données de base du pays (par exemple, sa capitale et sa superficie), son drapeau et les langues qui y sont parlées sont affichés :

![](../../images/2/19c3.png)

**NB** : Il suffit que votre application fonctionne pour la plupart des pays. Certains pays, comme le <i>Soudan</i>, peuvent être difficiles à soutenir, car le nom du pays fait partie du nom d'un autre pays, le <i>Soudan du Sud</i>. Vous n'avez pas à vous soucier de ces cas extrêmes.

**ATTENTION** create-react-app transformera automatiquement votre projet en un référentiel git à moins que vous ne créiez votre application dans un référentiel git existant. **Il est fort probable que vous ne vouliez pas que chacun de vos projets soit un référentiel distinct**, il vous suffit donc d'exécuter la commande _rm -rf .git_ à la racine de votre application.

<h4>2.13*: countries, étape2</h4>

**Il y a encore beaucoup à faire dans cette partie, alors ne restez pas bloqué sur cet exercice !**

Améliorez l'application de l'exercice précédent, de sorte que lorsque les noms de plusieurs pays sont affichés sur la page, il y a un bouton à côté du nom du pays, qui, lorsqu'il est pressé, affiche la vue pour ce pays :

![](../../images/2/19b4.png)

Dans cet exercice, il suffit également que votre application fonctionne pour la plupart des pays. Les pays dont le nom apparaît dans le nom d'un autre pays, comme le <i>Soudan</i>, peuvent être ignorés.

<h4>2.14*: countries, étape3</h4>

**Il y a encore beaucoup à faire dans cette partie, alors ne restez pas bloqué sur cet exercice !**

Ajoutez à la vue montrant les données d'un seul pays, le bulletin météo de la capitale de ce pays. Il existe des dizaines de fournisseurs de données météorologiques. Une API suggérée est [https://openweathermap.org](https://openweathermap.org). Notez que cela peut prendre quelques minutes avant qu'une clé API générée soit valide.

![](../../images/2/19x.png)

Si vous utilisez Open weather map, trouvez [ici](https://openweathermap.org/weather-conditions#Icon-list) une description de comment obtenir des icônes météo.

**NB :** Dans certains navigateurs (tels que Firefox), l'API choisie peut envoyer une réponse d'erreur, ce qui indique que le cryptage HTTPS n'est pas pris en charge, bien que l'URL de la requête commence par _http://_. Ce problème peut être résolu en effectuant l'exercice à l'aide de Chrome.

**NB :** Vous avez besoin d'une clé API pour utiliser presque tous les services météorologiques. N'enregistrez pas la clé API dans le contrôle de code source ! Ni coder en dur la clé API dans votre code source. Utilisez plutôt une [variable d'environnement](https://create-react-app.dev/docs/adding-custom-environment-variables/) pour enregistrer la clé.

En supposant que la clé API est <i>t0p53cr3t4p1k3yv4lu3</i>, lorsque l'application est démarrée comme suit :

```bash
REACT_APP_API_KEY=t0p53cr3t4p1k3yv4lu3 npm start // For Linux/macOS Bash
($env:REACT_APP_API_KEY="t0p53cr3t4p1k3yv4lu3") -and (npm start) // For Windows PowerShell
set "REACT_APP_API_KEY=t0p53cr3t4p1k3yv4lu3" && npm start // For Windows cmd.exe
```

vous pouvez accéder à la valeur de la clé depuis l'objet _process.env_ :

```js
const api_key = process.env.REACT_APP_API_KEY
// la variable api_key a maintenant la valeur définie au démarrage
```

Notez que si vous avez créé l'application à l'aide de `npx create-react-app ...` et que vous souhaitez utiliser un nom différent pour votre variable d'environnement, le nom de la variable d'environnement doit toujours commencer par `REACT_APP_`. Vous pouvez également utiliser un fichier `.env` plutôt que de le définir sur la ligne de commande à chaque fois en créant un fichier intitulé '.env' à la racine du projet et en ajoutant ce qui suit.

```
# .env

REACT_APP_API_KEY=t0p53cr3t4p1k3yv4lu3
```

Notez que vous devrez redémarrer le serveur pour appliquer les modifications.
</div>
