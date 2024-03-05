---
mainImage: ../../../images/part-7.svg
part: 7
letter: e
lang: fr
---

<div class="content">

### Composants de Classe

Au cours de ce cours, nous avons uniquement utilisé des composants React définis en tant que fonctions JavaScript. Cela n'était pas possible sans la fonctionnalité de [hook](https://reactjs.org/docs/hooks-intro.html) qui est arrivée avec la version 16.8 de React. Auparavant, pour définir un composant utilisant un état, on devait le définir en utilisant la syntaxe [Class](https://reactjs.org/docs/state-and-lifecycle.html#converting-a-function-to-a-class) de JavaScript.

Il est bénéfique d'être au moins quelque peu familier avec les composants de classe, car le monde contient beaucoup de vieux code React, qui ne sera probablement jamais entièrement réécrit en utilisant la syntaxe mise à jour.

Familiarisons-nous avec les principales fonctionnalités des composants de classe en produisant une fois de plus une application d'anecdotes très familière. Nous stockons les anecdotes dans le fichier <i>db.json</i> en utilisant <i>json-server</i>. Le contenu du fichier est repris de [ici](https://github.com/fullstack-hy/misc/blob/master/anecdotes.json).

La version initiale du composant de classe ressemble à ceci

```js
import React from 'react'

class App extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div>
        <h1>anecdote of the day</h1>
      </div>
    )
  }
}

export default App
```

Le composant possède maintenant un [constructeur](https://react.dev/reference/react/Component#constructor), dans lequel rien ne se passe pour le moment, et contient la méthode [render](https://react.dev/reference/react/Component#render). Comme on pourrait s'y attendre, render définit comment et ce qui est rendu à l'écran.

Définissons un état pour la liste des anecdotes et l'anecdote actuellement visible. Contrairement à l'utilisation du hook [useState](https://react.dev/reference/react/useState), les composants de classe ne contiennent qu'un seul état. Ainsi, si l'état est composé de plusieurs "parties", elles doivent être stockées en tant que propriétés de l'état. L'état est initialisé dans le constructeur:

```js
class App extends React.Component {
  constructor(props) {
    super(props)

    // highlight-start
    this.state = {
      anecdotes: [],
      current: 0
    }
    // highlight-end
  }

  render() {
  // highlight-start
    if (this.state.anecdotes.length === 0) {
      return <div>no anecdotes...</div>
    }
  // highlight-end

    return (
      <div>
        <h1>anecdote of the day</h1>
        // highlight-start
        <div>
          {this.state.anecdotes[this.state.current].content}
        </div>
        <button>next</button>
        // highlight-end
      </div>
    )
  }
}
```

L'état du composant se trouve dans la variable d'instance this.state. L'état est un objet ayant deux propriétés. <i>this.state.anecdotes</i> est la liste des anecdotes et <i>this.state.current</i> est l'index de l'anecdote actuellement affichée.

Dans les composants fonctionnels, l'endroit approprié pour récupérer les données d'un serveur est à l'intérieur d'un [hook d'effet](https://react.dev/reference/react/useEffect), qui est exécuté lorsque le composant se rend ou moins fréquemment si nécessaire, par exemple, uniquement en combinaison avec le premier rendu.

Les [méthodes de cycle de vie](https://react.dev/reference/react/Component#adding-lifecycle-methods-to-a-class-component) des composants de classe offrent une fonctionnalité correspondante. L'endroit correct pour déclencher la récupération des données depuis un serveur se trouve à l'intérieur de la méthode de cycle de vie [componentDidMount](https://react.dev/reference/react/Component#componentdidmount), qui est exécutée une fois juste après le premier rendu du composant:

```js
class App extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      anecdotes: [],
      current: 0
    }
  }

  // highlight-start
  componentDidMount = () => {
    axios.get('http://localhost:3001/anecdotes').then(response => {
      this.setState({ anecdotes: response.data })
    })
  }
  // highlight-end

  // ...
}
```

La fonction de rappel de la requête HTTP met à jour l'état du composant en utilisant la méthode [setState](https://react.dev/reference/react/Component#setstate). La méthode affecte uniquement les clés qui ont été définies dans l'objet passé à la méthode comme argument. La valeur de la clé <i>current</i> reste inchangée.

Appeler la méthode setState déclenche toujours le rerendu du composant de classe, c'est-à-dire l'appel de la méthode _render_.

Nous allons terminer le composant avec la capacité de changer l'anecdote affichée. Voici le code pour l'ensemble du composant avec l'ajout mis en évidence:

```js
class App extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      anecdotes: [],
      current: 0
    }
  }

  componentDidMount = () => {
    axios.get('http://localhost:3001/anecdotes').then(response => {
      this.setState({ anecdotes: response.data })
    })
  }

  // highlight-start
  handleClick = () => {
    const current = Math.floor(
      Math.random() * this.state.anecdotes.length
    )
    this.setState({ current })
  }
  // highlight-end

  render() {
    if (this.state.anecdotes.length === 0 ) {
      return <div>no anecdotes...</div>
    }

    return (
      <div>
        <h1>anecdote of the day</h1>
        <div>{this.state.anecdotes[this.state.current].content}</div>
        <button onClick={this.handleClick}>next</button> // highlight-line
      </div>
    )
  }
}
```

Pour comparaison, voici la même application en tant que composant fonctionnel:

```js
const App = () => {
  const [anecdotes, setAnecdotes] = useState([])
  const [current, setCurrent] = useState(0)

  useEffect(() =>{
    axios.get('http://localhost:3001/anecdotes').then(response => {
      setAnecdotes(response.data)
    })
  },[])

  const handleClick = () => {
    setCurrent(Math.round(Math.random() * (anecdotes.length - 1)))
  }

  if (anecdotes.length === 0) {
    return <div>no anecdotes...</div>
  }

  return (
    <div>
      <h1>anecdote of the day</h1>
      <div>{anecdotes[current].content}</div>
      <button onClick={handleClick}>next</button>
    </div>
  )
}
```

Dans le cas de notre exemple, les différences étaient mineures. La plus grande différence entre les composants fonctionnels et les composants de classe est principalement que l'état d'un composant de classe est un objet unique, et que l'état est mis à jour en utilisant la méthode _setState_, tandis que dans les composants fonctionnels, l'état peut consister en plusieurs variables différentes, chacune ayant sa propre fonction de mise à jour.

Dans certains cas d'utilisation plus avancés, le hook d'effet offre un mécanisme considérablement meilleur pour contrôler les effets secondaires par rapport aux méthodes de cycle de vie des composants de classe.

Un avantage notable de l'utilisation des composants fonctionnels est de ne pas avoir à traiter avec la référence _this_ qui se réfère à elle-même dans la classe Javascript.

À mon avis, et à celui de beaucoup d'autres, les composants de classe offrent peu d'avantages par rapport aux composants fonctionnels améliorés avec des hooks, à l'exception du mécanisme dit de [limite d'erreur](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary) , qui actuellement (15 février 2021) n'est pas encore utilisé par les composants fonctionnels.

Lors de l'écriture de code frais, [il n'y a pas de raison rationnelle d'utiliser des composants de classe](https://reactjs.org/docs/hooks-faq.html#should-i-use-hooks-classes-or-a-mix-of-both) si le projet utilise React avec un numéro de version 16.8 ou supérieur. D'autre part, [il n'est actuellement pas nécessaire de réécrire tout l'ancien code React](https://reactjs.org/docs/hooks-faq.html#do-i-need-to-rewrite-all-my-class-components) comme composants fonctionnels.

### Organisation du code dans une application React

Dans la plupart des applications, nous avons suivi le principe selon lequel les composants étaient placés dans le répertoire <i>components</i>, les réducteurs étaient placés dans le répertoire <i>reducers</i>, et le code responsable de la communication avec le serveur était placé dans le répertoire <i>services</i>. Cette manière d'organiser convient très bien à une petite application, mais à mesure que le nombre de composants augmente, des solutions meilleures sont nécessaires. Il n'y a pas une seule manière correcte d'organiser un projet. L'article [The 100% correct way to structure a React app (or why there’s no such thing)](https://medium.com/hackernoon/the-100-correct-way-to-structure-a-react-app-or-why-theres-no-such-thing-3ede534ef1ed)  donne un certain éclairage sur la question.

### Frontend et backend dans le même dépôt

Au cours de ce cours, nous avons créé le frontend et le backend dans des dépôts séparés. C'est une approche très typique. Cependant, nous avons effectué le déploiement en [copiant](/fr/part3/deployer_votre_application_sur_internet#servir-des-fichiers-statiques-a-partir-du-backend) le code frontend groupé dans le dépôt backend. Une approche éventuellement meilleure aurait été de déployer le code frontend séparément.

Parfois, il peut y avoir une situation où l'ensemble de l'application doit être mis dans un seul dépôt. Dans ce cas, une approche courante consiste à placer le fichier <i>package.json</i> et <i>webpack.config.js</i> dans le répertoire racine, ainsi qu'à placer le code frontend et backend dans leurs propres répertoires, par exemple <i>client</i> et <i>server</i>.

### Changements sur le serveur

S'il y a des changements dans l'état sur le serveur, par exemple, lorsque de nouveaux blogs sont ajoutés par d'autres utilisateurs au service bloglist, le frontend React que nous avons implémenté au cours de ce cours ne remarquera pas ces changements jusqu'à ce que la page soit rechargée. Une situation similaire se présente lorsque le frontend déclenche un calcul long dans le backend. Comment reflétons-nous les résultats du calcul au frontend ?

Une manière est d'exécuter le [polling](<https://en.wikipedia.org/wiki/Polling_(computer_science)>) sur le frontend, ce qui signifie des demandes répétées à l'API backend par exemple en utilisant la commande [setInterval](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setInterval).

Une manière plus sophistiquée est d'utiliser [WebSockets](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API) qui permettent d'établir un canal de communication bidirectionnel entre le navigateur et le serveur. Dans ce cas, le navigateur n'a pas besoin d'interroger le backend et doit simplement définir des fonctions de rappel pour les situations où le serveur envoie des données sur la mise à jour de l'état via un WebSocket.

WebSockets est une API fournie par le navigateur, qui n'est pas encore entièrement prise en charge par tous les navigateurs:

![caniuse chart showing websockets not usable by all yet](../../images/7/31ea.png)

Au lieu d'utiliser directement l'API WebSocket, il est conseillé d'utiliser la bibliothèque [Socket.io](https://socket.io/), qui offre diverses options de <i>fallback</i> au cas où le navigateur n'aurait pas un support complet pour WebSockets.

Dans la [partie 8](/fr/part8), notre sujet est GraphQL, qui fournit un mécanisme agréable pour notifier les clients lorsqu'il y a des changements dans les données du backend.

### Virtual DOM

Le concept de Virtual DOM est souvent évoqué lorsqu'on parle de React. De quoi s'agit-il ? Comme mentionné dans la [partie 0](/fr/part0/introduction_aux_applications_web#document-object-model-ou-dom), les navigateurs fournissent une [API DOM](https://developer.mozilla.org/fi/docs/DOM) grâce à laquelle le JavaScript exécuté par le navigateur peut modifier les éléments définissant l'apparence de la page.

Lorsqu'un développeur utilise React, il manipule rarement ou jamais directement le DOM. La fonction définissant le composant React retourne un ensemble [d'éléments React](https://reactjs.org/docs/glossary.html#elements). Bien que certains des éléments ressemblent à des éléments HTML normaux

```js
const element = <h1>Hello, world</h1>
```

ils sont également, au fond, des éléments React basés sur JavaScript.

Les éléments React définissant l'apparence des composants de l'application composent le [DOM Virtuel](https://reactjs.org/docs/faq-internals.html#what-is-the-virtual-dom), qui est stocké dans la mémoire système pendant l'exécution.

Avec l'aide de la bibliothèque [ReactDOM](https://react.dev/reference/react-dom), le DOM virtuel défini par les composants est rendu à un vrai DOM qui peut être affiché par le navigateur en utilisant l'API DOM:

```js
ReactDOM.createRoot(document.getElementById('root')).render(<App />)
```

Lorsque l'état de l'application change, un <i>nouveau DOM virtuel</i> est défini par les composants. React a la version précédente du DOM virtuel en mémoire et, au lieu de rendre directement le nouveau DOM virtuel en utilisant l'API DOM, React calcule la manière optimale de mettre à jour le DOM (supprimer, ajouter ou modifier des éléments dans le DOM) de manière à ce que le DOM reflète le nouveau DOM virtuel.

### Sur le rôle de React dans les applications

Dans le matériel, nous n'avons peut-être pas suffisamment souligné le fait que React est principalement une bibliothèque pour gérer la création de vues pour une application. Si nous regardons le schéma traditionnel [Modèle Vue Contrôleur (MVC)](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller) , alors le domaine de React serait <i>Vue</i>. React a une aire d'application plus restreinte que, par exemple, [Angular](https://angular.io/), qui est un cadre MVC frontal complet. Par conséquent, React n'est pas appelé un <i>cadre</i> (framework), mais une <i>bibliothèque</i> (library).

Dans les petites applications, les données manipulées par l'application sont stockées dans l'état des composants React, donc dans ce scénario, l'état des composants peut être considéré comme les <i>modèles</i> d'une architecture MVC.

Cependant, l'architecture MVC n'est généralement pas mentionnée lorsqu'on parle d'applications React. De plus, si nous utilisons Redux, alors les applications suivent l'architecture [Flux](https://facebook.github.io/flux/docs/in-depth-overview) et le rôle de React est encore plus centré sur la création des vues. La logique métier de l'application est gérée en utilisant l'état et les créateurs d'actions Redux. Si nous utilisons [Redux Thunk](/fr/part6/communiquer_avec_le_backend_dans_lapplication_redux#actions-asynchrones-et-redux-thunk) connu de la partie 6, alors la logique métier peut être presque complètement séparée du code React.

Étant donné que React et [Flux](https://facebook.github.io/flux/docs/in-depth-overview) ont été créés chez Facebook, on pourrait dire que l'utilisation de React uniquement comme une bibliothèque UI est le cas d'utilisation prévu. Suivre l'architecture Flux ajoute une certaine surcharge à l'application et si nous parlons d'une petite application ou d'un prototype, il pourrait être judicieux d'utiliser React de manière "incorrecte", puisque la [sur-ingénierie](https://en.wikipedia.org/wiki/Overengineering) donne rarement un résultat optimal.

Le dernier chapitre de la [partie 6](/fr/part6/react_query_use_reducer_et_le_contexte) couvre les tendances plus récentes de gestion d'état dans React. Les fonctions hook <i>useReducer</i> et <i>useContext</i> de React fournissent une sorte de version allégée de Redux. <i>React Query</i>, d'autre part, est une bibliothèque qui résout de nombreux problèmes associés à la gestion de l'état sur le serveur, éliminant le besoin pour une application React de stocker directement les données récupérées du serveur dans l'état frontal.

### Sécurité des applications React/node

Jusqu'à présent, au cours de ce cours, nous n'avons pas beaucoup abordé la sécurité de l'information. Nous n'avons pas non plus beaucoup de temps pour cela maintenant, mais heureusement, l'Université d'Helsinki propose un cours MOOC [Securing Software](https://cybersecuritybase.mooc.fi/module-2.1) pour ce sujet important.

Cependant, nous allons jeter un oeil à quelques spécificités de ce cours.

Le Open Web Application Security Project, connu sous le nom de [OWASP](https://www.owasp.org), publie une liste annuelle des risques de sécurité les plus courants dans les applications Web. La liste la plus récente peut être trouvée [ici](https://owasp.org/www-project-top-ten/). Les mêmes risques se retrouvent d'une année à l'autre.

En haut de la liste, nous trouvons l'<i>injection</i>, ce qui signifie que, par exemple, le texte envoyé à l'aide d'un formulaire dans une application est interprété de manière complètement différente de ce que le développeur de logiciels avait prévu. Le type d'injection le plus célèbre est probablement [l'injection SQL](https://stackoverflow.com/questions/332365/how-does-the-sql-injection-from-the-bobby-tables-xkcd-comic-work).

Par exemple, imaginez que la requête SQL suivante soit exécutée dans une application vulnérable:

```js
let query = "SELECT * FROM Users WHERE name = '" + userName + "';"
```

Maintenant, supposons qu'un utilisateur malveillant, <i>Arto Hellas</i>, définisse son nom comme

<pre>
Arto Hell-as'; DROP TABLE Users; --
</pre>

Les injections SQL sont évitées en utilisant des [requêtes paramétrées](https://security.stackexchange.com/questions/230211/why-are-stored-procedures-and-prepared-statements-the-preferred-modern-methods-f). Avec elles, les entrées des utilisateurs ne sont pas mélangées avec la requête SQL, mais la base de données elle-même insère les valeurs d'entrée à des emplacements réservés dans la requête (généralement <code>?</code>).

```js
execute("SELECT * FROM Users WHERE name = ?", [userName])
```

Les attaques par injection sont également possibles dans les bases de données NoSQL. Cependant, mongoose les empêche en [sanitisant](https://zanon.io/posts/nosql-injection-in-mongodb) les requêtes. Plus d'informations sur le sujet peuvent être trouvées par exemple [ici](https://web.archive.org/web/20220901024441/https://blog.websecurify.com/2014/08/hacking-nodejs-and-mongodb.html).

Le <i>Cross-site scripting (XSS)</i> est une attaque où il est possible d'injecter du code JavaScript malveillant dans une application web légitime. Le code malveillant serait alors exécuté dans le navigateur de la victime. Si nous essayons d'injecter le suivant dans par exemple l'application de notes:

```html
<script>
  alert('Evil XSS attack')
</script>
```

le code n'est pas exécuté, mais est uniquement rendu comme 'texte' sur la page:

![browser showing notes with XSS attempt](../../images/7/32e.png)

car React [s'occupe de la sanitation des données dans les variables](https://reactjs.org/docs/introducing-jsx.html#jsx-prevents-injection-attacks). Certaines versions de React [ont été vulnérables](https://medium.com/dailyjs/exploiting-script-injection-flaws-in-reactjs-883fb1fe36c1) aux attaques XSS. Les failles de sécurité ont bien sûr été corrigées, mais il n'y a aucune garantie qu'il n'y en ait pas d'autres.

Il faut rester vigilant lors de l'utilisation des bibliothèques; si des mises à jour de sécurité pour ces bibliothèques sont disponibles, il est conseillé de mettre à jour ces bibliothèques dans ses applications. Les mises à jour de sécurité pour Express se trouvent dans la [documentation de la bibliothèque](https://expressjs.com/en/advanced/security-updates.html) et celles pour Node se trouvent dans [ce blog](https://nodejs.org/en/blog/).

Vous pouvez vérifier à quel point vos dépendances sont à jour en utilisant la commande

```bash
npm outdated --depth 0
```

Le projet vieux d'un an utilisé dans la [partie 9](/fr/part9) de ce cours a déjà un certain nombre de dépendances obsolètes:

![npm outdated output of patientor](../../images/7/33x.png)

Les dépendances peuvent être mises à jour en actualisant le fichier <i>package.json</i>. La meilleure façon de faire cela est d'utiliser un outil appelé _npm-check-updates_. Il peut être installé globalement en exécutant la commande

```bash
npm install -g npm-check-updates
```

En utilisant cet outil, la vérification de l'actualité des dépendances se fait de la manière suivante:

```bash
$ npm-check-updates
Checking ...\ultimate-hooks\package.json
[====================] 9/9 100%

 @testing-library/react       ^13.0.0  →  ^13.1.1
 @testing-library/user-event  ^14.0.4  →  ^14.1.1
 react-scripts                  5.0.0  →    5.0.1

Run ncu -u to upgrade package.json
```

Le fichier <i>package.json</i> est mis à jour en exécutant la commande _ncu -u_.

```bash
$ ncu -u
Upgrading ...\ultimate-hooks\package.json
[====================] 9/9 100%

 @testing-library/react       ^13.0.0  →  ^13.1.1
 @testing-library/user-event  ^14.0.4  →  ^14.1.1
 react-scripts                  5.0.0  →    5.0.1

Run npm install to install new versions.
```

Il est ensuite temps de mettre à jour les dépendances en exécutant la commande _npm install_. Cependant, les anciennes versions des dépendances ne sont pas nécessairement un risque de sécurité.

La commande npm [audit](https://docs.npmjs.com/cli/audit) peut être utilisée pour vérifier la sécurité des dépendances. Elle compare les numéros de version des dépendances de votre application à une liste de numéros de version de dépendances contenant des menaces de sécurité connues dans une base de données d'erreurs centralisée.

Exécuter _npm audit_ sur le même projet affiche une longue liste de plaintes et de corrections suggérées.
Voici une partie du rapport:

```js
$ patientor npm audit

... many lines removed ...

url-parse  <1.5.2
Severity: moderate
Open redirect in url-parse - https://github.com/advisories/GHSA-hh27-ffr2-f2jc
fix available via `npm audit fix`
node_modules/url-parse

ws  6.0.0 - 6.2.1 || 7.0.0 - 7.4.5
Severity: moderate
ReDoS in Sec-Websocket-Protocol header - https://github.com/advisories/GHSA-6fc8-4gx4-v693
ReDoS in Sec-Websocket-Protocol header - https://github.com/advisories/GHSA-6fc8-4gx4-v693
fix available via `npm audit fix`
node_modules/webpack-dev-server/node_modules/ws
node_modules/ws

120 vulnerabilities (102 moderate, 16 high, 2 critical)

To address issues that do not require attention, run:
  npm audit fix

To address all issues (including breaking changes), run:
  npm audit fix --force
```

Après seulement un an, le code est plein de petites menaces de sécurité. Heureusement, il n'y a que 2 menaces critiques. Exécutons _npm audit fix_ comme le suggère le rapport:

```js
$ npm audit fix

+ mongoose@5.9.1
added 19 packages from 8 contributors, removed 8 packages and updated 15 packages in 7.325s
fixed 354 of 416 vulnerabilities in 20047 scanned packages
  1 package update for 62 vulns involved breaking changes
  (use `npm audit fix --force` to install breaking changes; or refer to `npm audit` for steps to fix these manually)
```

62 menaces restent parce que, par défaut, _audit fix_ ne met pas à jour les dépendances si leur numéro de version <i>majeure</i> a augmenté. Mettre à jour ces dépendances pourrait entraîner l'effondrement de toute l'application.

La source du bug critique est la bibliothèque [immer](https://github.com/immerjs/immer)

```js
immer  <9.0.6
Severity: critical
Prototype Pollution in immer - https://github.com/advisories/GHSA-33f9-j839-rf8h
fix available via `npm audit fix --force`
Will install react-scripts@5.0.0, which is a breaking change
```

Exécuter _npm audit fix --force_ mettrait à jour la version de la bibliothèque mais mettrait également à jour la bibliothèque _react-scripts_, ce qui pourrait potentiellement détruire l'environnement de développement. Nous laisserons donc les mises à jour des bibliothèques pour plus tard...

L'une des menaces mentionnées dans la liste de l'OWASP est <i>Broken Authentication</i> et le <i>Broken Access Control</i> lié. L'authentification basée sur les jetons que nous avons utilisée est assez robuste si l'application est utilisée sur le protocole HTTPS qui crypte le trafic. Lors de la mise en oeuvre du contrôle d'accès, il faut par exemple se rappeler de ne pas seulement vérifier l'identité d'un utilisateur dans le navigateur, mais aussi sur le serveur. Une mauvaise sécurité consisterait à empêcher certaines actions d'être prises uniquement en cachant les options d'exécution dans le code du navigateur.

Sur MDN de Mozilla, il existe un très bon [guide de sécurité des sites web](https://developer.mozilla.org/en-US/docs/Learn/Server-side/First_steps/Website_security), qui aborde ce sujet très important:

![capture d'écran de la sécurité des sites web sur MDN](../../images/7/34.png)

La documentation d'Express comprend une section sur la sécurité: [Pratiques recommandées en production: Sécurité](https://expressjs.com/en/advanced/best-practice-security.html), qui mérite d'être lue. Il est également recommandé d'ajouter une bibliothèque appelée [Helmet](https://helmetjs.github.io/) au backend. Elle comprend un ensemble de middleware qui élimine certaines vulnérabilités de sécurité dans les applications Express.

L'utilisation du plugin de [sécurité ESlint](https://github.com/nodesecurity/eslint-plugin-security) est également à prévoir.

### Tendances actuelles

Enfin, examinons un peu la technologie de demain (ou, en réalité, déjà d'aujourd'hui) et les directions dans lesquelles le développement Web se dirige.

#### Versions typées de JavaScript

Parfois, le [typage dynamique](https://developer.mozilla.org/en-US/docs/Glossary/Dynamic_typing) des variables JavaScript crée des bugs ennuyeux. Dans la partie 5, nous avons brièvement parlé des [PropTypes](/fr/part5/props_children_et_proptypes#prop-types): un mécanisme qui permet d'imposer le contrôle de type pour les props passées aux composants React.

Dernièrement, il y a eu un intérêt notable pour le [contrôle de type statique](https://en.wikipedia.org/wiki/Type_system#Static_type_checking). Actuellement, la version typée de Javascript la plus populaire est [TypeScript](https://www.typescriptlang.org/) qui a été développée par Microsoft. TypeScript est couvert dans la [partie 9](/fr/part9).

#### Rendu côté serveur, applications isomorphes et code universel

Le navigateur n'est pas le seul domaine où les composants définis en utilisant React peuvent être rendus. Le rendu peut également être effectué sur le [serveur](https://react.dev/reference/react-dom/server). Ce type d'approche est de plus en plus utilisé, de sorte que, lors de l'accès à l'application pour la première fois, le serveur fournit une page pré-rendue faite avec React. À partir de là, le fonctionnement de l'application continue comme d'habitude, ce qui signifie que le navigateur exécute React, qui manipule le DOM affiché par le navigateur. Le rendu effectué sur le serveur porte le nom de: <i>rendu côté serveur</i>.

Une motivation pour le rendu côté serveur est l'optimisation pour les moteurs de recherche (SEO). Traditionnellement, les moteurs de recherche ont été très mauvais pour reconnaître le contenu rendu par JavaScript. Cependant, la tendance pourrait être en train de changer, par exemple, jetez un oeil à [ceci](https://www.javascriptstuff.com/react-seo/) et [cela](https://medium.freecodecamp.org/seo-vs-react-is-it-neccessary-to-render-react-pages-in-the-backend-74ce5015c0c9).

Bien sûr, le rendu côté serveur n'est pas spécifique à React ou même à JavaScript. Utiliser le même langage de programmation à travers la pile en théorie simplifie l'exécution du concept parce que le même code peut être exécuté à la fois sur le front-end et le back-end.

Avec le rendu côté serveur, il a été question des soi-disant <i>applications isomorphes</i> et du <i>code universel</i>, bien qu'il y ait eu un certain débat sur leurs définitions. Selon certaines [définitions](https://medium.com/@ghengeveld/isomorphism-vs-universal-javascript-4b47fb481beb), une application web isomorphe effectue le rendu à la fois sur le front-end et le back-end. D'un autre côté, le code universel est un code qui peut être exécuté dans la plupart des environnements, ce qui signifie à la fois le front-end et le back-end.

React et Node offrent une option désirable pour implémenter une application isomorphe en tant que code universel.

Écrire directement du code universel en utilisant React est actuellement encore assez laborieux. Dernièrement, une bibliothèque appelée [Next.js](https://github.com/vercel/next.js), qui est mise en oeuvre au-dessus de React, a attiré beaucoup d'attention et est une bonne option pour faire des applications universelles.

#### Applications web progressives

Dernièrement, les gens ont commencé à utiliser le terme [application web progressive](https://developers.google.com/web/progressive-web-apps/) (PWA) lancé par Google.

En bref, nous parlons d'applications web fonctionnant aussi bien que possible sur chaque plateforme et tirant parti des meilleurs aspects de ces plateformes. L'écran plus petit des appareils mobiles ne doit pas entraver l'utilisabilité de l'application. Les PWA devraient également fonctionner parfaitement en mode hors ligne ou avec une connexion Internet lente. Sur les appareils mobiles, ils doivent être installables comme n'importe quelle autre application. Tout le trafic réseau dans une PWA devrait être chiffré.

#### Architecture microservices

Pendant ce cours, nous avons juste effleuré la surface du côté serveur des choses. Dans nos applications, nous avions un backend <i>monolithique</i>, signifiant une application formant un tout et fonctionnant sur un seul serveur, servant seulement quelques points d'API.

À mesure que l'application grandit, l'approche backend monolithique commence à poser problème tant en termes de performance que de maintenabilité.

Une [architecture microservices](https://martinfowler.com/articles/microservices.html)  est une façon de composer le backend d'une application à partir de nombreux services séparés et indépendants, qui communiquent entre eux sur le réseau. Le but d'un microservice individuel est de s'occuper d'un ensemble fonctionnel logique particulier. Dans une architecture microservices pure, les services n'utilisent pas une base de données partagée.

Par exemple, l'application bloglist pourrait consister en deux services : un gérant l'utilisateur et un autre prenant en charge les blogs. La responsabilité du service utilisateur serait l'inscription et l'authentification des utilisateurs, tandis que le service blog s'occuperait des opérations liées aux blogs.

L'image ci-dessous visualise la différence entre la structure d'une application basée sur une architecture microservices et celle basée sur une structure monolithique plus traditionnelle:

![diagramme comparant microservices et approche traditionnelle](../../images/7/36.png)

Le rôle du frontend (encadré sur l'image) ne diffère pas beaucoup entre les deux modèles. Il y a souvent ce qu'on appelle une [passerelle API](http://microservices.io/patterns/apigateway) entre les microservices et le frontend, qui fournit une illusion d'une API "tout sur le même serveur" plus traditionnelle. [Netflix](https://medium.com/netflix-techblog/optimizing-the-netflix-api-5c9ac715cf19), entre autres, utilise ce type d'approche.

Les architectures microservices sont apparues et se sont développées pour les besoins des applications à grande échelle sur Internet. La tendance a été établie par Amazon bien avant l'apparition du terme microservice. Le point de départ crucial a été un courriel envoyé à tous les employés en 2002 par le PDG d'Amazon, Jeff Bezos:

> Toutes les équipes exposeront désormais leurs données et fonctionnalités à travers des interfaces de service.
>
> Les équipes doivent communiquer entre elles à travers ces interfaces.
>
> Il n'y aura aucune autre forme de communication inter-processus autorisée : pas de liaison directe, pas de lectures directes de la base de données d'une autre équipe, pas de modèle de mémoire partagée, absolument aucune porte dérobée. La seule communication autorisée est via des appels d'interface de service sur le réseau.
>
> Peu importe la technologie que vous utilisez.
>
> Toutes les interfaces de service, sans exception, doivent être conçues dès le départ pour être externalisables. C'est-à-dire que l'équipe doit planifier et concevoir pour être en mesure d'exposer l'interface aux développeurs du monde extérieur.
>
Pas d'exceptions.
>
> Quiconque ne fait pas cela sera licencié. Merci; passez une bonne journée!

Aujourd'hui, l'un des plus grands précurseurs de l'utilisation des microservices est [Netflix](https://www.infoq.com/presentations/netflix-chaos-microservices).

L'utilisation des microservices a été progressivement perçue comme une sorte de [balle magique](https://en.wikipedia.org/wiki/No_Silver_Bullet) d'aujourd'hui, qui est proposée comme solution à presque tous les types de problèmes. Cependant, il y a plusieurs défis à appliquer une architecture microservices, et cela pourrait être sensé de commencer [d'abord par un monolithe](https://martinfowler.com/bliki/MonolithFirst.html) en faisant initialement un backend tout-en-un traditionnel. Ou peut-être [pas](https://martinfowler.com/articles/dont-start-monolith.html). Il y a un tas d'opinions différentes sur le sujet. Les deux liens mènent au site de Martin Fowler; comme nous pouvons le voir, même les sages ne sont pas tout à fait sûrs de quelle voie est la plus juste.

Malheureusement, nous ne pouvons pas approfondir davantage ce sujet important pendant ce cours. Même un coup d'oeil superficiel sur le sujet nécessiterait au moins 5 semaines supplémentaires.

#### Serverless

Après le lancement du service [lambda](https://aws.amazon.com/lambda/) d'Amazon fin 2014, une nouvelle tendance a commencé à émerger dans le développement d'applications web: [serverless](https://serverless.com/).

La particularité de lambda, et aujourd'hui aussi des [Cloud functions](https://cloud.google.com/functions/) de Google ainsi que de [fonctionnalités similaires dans Azure](https://azure.microsoft.com/en-us/services/functions/), est qu'elle permet <i>l'exécution de fonctions individuelles</i> dans le cloud. Auparavant, la plus petite unité exécutable dans le cloud était un seul <i>processus</i>, par exemple, un environnement d'exécution exécutant un backend Node.

Par exemple, en utilisant la [passerelle API](https://aws.amazon.com/api-gateway/) d'Amazon, il est possible de créer des applications serverless où les requêtes à l'API HTTP définie obtiennent des réponses directement des fonctions cloud. Habituellement, les fonctions fonctionnent déjà avec des données stockées dans les bases de données du service cloud.

Serverless ne signifie pas qu'il n'y a pas de serveur dans les applications, mais comment le serveur est défini. Les développeurs de logiciels peuvent déplacer leurs efforts de programmation vers un niveau d'abstraction plus élevé car il n'est plus nécessaire de définir programmatiquement le routage des requêtes HTTP, les relations de base de données, etc., puisque l'infrastructure cloud fournit tout cela. Les fonctions cloud se prêtent également à la création d'un système bien évolutif, par exemple, Lambda d'Amazon peut exécuter une énorme quantité de fonctions cloud par seconde. Tout cela se produit automatiquement grâce à l'infrastructure et il n'est pas nécessaire d'initier de nouveaux serveurs, etc.

### Bibliothèques utiles et liens intéressants

La communauté des développeurs JavaScript a produit une grande variété de bibliothèques utiles. Si vous développez quelque chose de plus substantiel, il vaut la peine de vérifier si des solutions existantes sont déjà disponibles.
Ci-dessous sont listées certaines bibliothèques recommandées par des parties dignes de confiance.

Si votre application doit gérer des données complexes, [lodash](https://www.npmjs.com/package/lodash), que nous avons recommandé dans la [partie 4](/fr/part4/structure_de_lapplication_backend_introduction_aux_tests#exercices-4-3-a-4-7), est une bonne bibliothèque à utiliser. Si vous préférez le style de programmation fonctionnel, vous pourriez envisager d'utiliser [ramda](https://ramdajs.com/).

Si vous gérez des dates et heures, [date-fns](https://github.com/date-fns/date-fns) offre de bons outils pour cela. Si vous avez des formulaires complexes dans vos applications, regardez si [React Hook Form](https://react-hook-form.com/) pourrait être un bon choix. Si votre application affiche des graphiques, il y a plusieurs options à choisir. [recharts](http://recharts.org/en-US/) et [highcharts](https://github.com/highcharts/highcharts-react) sont bien recommandés.

[Immer](https://github.com/mweststrate/immer) fournit des implémentations immuables de certaines structures de données. La bibliothèque pourrait être utile lors de l'utilisation de Redux, car comme nous nous en [souvenons](/fr/part6/architecture_de_flux_et_redux#fonctions-pures-immuables) dans la partie 6, les réducteurs doivent être des fonctions pures, c'est-à-dire qu'ils ne doivent pas modifier l'état du store mais doivent le remplacer par un nouveau lorsqu'un changement se produit.

[Redux-saga](https://redux-saga.js.org/) fournit une autre manière de faire des actions asynchrones pour [Redux Thunk](/fr/part6/communiquer_avec_le_backend_dans_lapplication_redux#actions-asynchrones-et-redux-thunk) connu de la partie 6. Certains embrassent le battage médiatique et l'apprécient. Je ne le fais pas.

Pour les applications à page unique, la collecte de données analytiques sur l'interaction entre les utilisateurs et la page est [plus difficile](https://developers.google.com/analytics/devguides/collection/gtagjs/single-page-applications) que pour les applications web traditionnelles où la page entière est chargée. La bibliothèque [React Google Analytics](https://github.com/react-ga/react-ga) offre une solution.

Vous pouvez profiter de vos connaissances en React lors du développement d'applications mobiles en utilisant la bibliothèque extrêmement populaire [React Native](https://facebook.github.io/react-native/) de Facebook, qui est le sujet de la [partie 10](/fr/part10) du cours.

En ce qui concerne les outils utilisés pour la gestion et le bundling des projets JavaScript, la communauté a été très versatile. Les meilleures pratiques ont changé rapidement (les années sont approximatives, personne ne se souvient si loin dans le passé):

- 2011 [Bower](https://www.npmjs.com/package/bower)
- 2012 [Grunt](https://www.npmjs.com/package/grunt)
- 2013-14 [Gulp](https://www.npmjs.com/package/gulp)
- 2012-14 [Browserify](https://www.npmjs.com/package/browserify)
- 2015- [Webpack](https://www.npmjs.com/package/webpack)

Les hipsters semblent avoir perdu leur intérêt pour le développement d'outils après que webpack a commencé à dominer les marchés. Il y a quelques années, [Parcel](https://parceljs.org) a commencé à se faire connaître en se commercialisant comme simple (ce que Webpack n'est pas) et plus rapide que Webpack. Cependant, après un début prometteur, Parcel n'a pas rassemblé de vapeur, et il commence à ressembler à ce qu'il ne sera pas la fin de Webpack. Récemment, [esbuild](https://esbuild.github.io/) a été en hausse relativement élevée et défie sérieusement Webpack.

Le site <https://reactpatterns.com/> fournit une liste concise des meilleures pratiques pour React, dont certaines sont déjà familières depuis ce cours. Une autre liste similaire est [react bits](https://vasanthk.gitbooks.io/react-bits/).

[Reactiflux](https://www.reactiflux.com/) est une grande communauté de chat de développeurs React sur Discord. Cela pourrait être un endroit possible pour obtenir du soutien après la fin du cours. Par exemple, de nombreuses bibliothèques ont leurs propres canaux.

Si vous connaissez des liens ou des bibliothèques recommandables, faites un pull request!

</div>