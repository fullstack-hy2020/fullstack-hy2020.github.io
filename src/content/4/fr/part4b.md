---
mainImage: ../../../images/part-4.svg
part: 4
letter: b
lang: fr
---

<div class="content">

Nous allons maintenant commencer à écrire des tests pour le backend. Étant donné que le backend ne contient pas de logique compliquée, il n'est pas judicieux d'écrire des [tests unitaires](https://en.wikipedia.org/wiki/Unit_testing) pour cela. La seule chose que nous pourrions potentiellement tester unitairement est la méthode _toJSON_ utilisée pour formater les notes.

Dans certaines situations, il peut être bénéfique d'implémenter certains tests du backend en simulant la base de données plutôt qu'en utilisant une vraie base de données. Une bibliothèque qui pourrait être utilisée pour cela est [mongodb-memory-server](https://github.com/nodkz/mongodb-memory-server).

Comme le backend de notre application est encore relativement simple, nous déciderons de tester l'ensemble de l'application via son API REST, de sorte que la base de données soit également incluse. Ce type de test, où plusieurs composants du système sont testés en groupe, est appelé [test d'intégration](https://en.wikipedia.org/wiki/Integration_testing).


## Environnement de test

Dans l'un des chapitres précédents du matériel de cours, nous avons mentionné que lorsque votre serveur backend fonctionne sur Fly.io ou Render, il est en mode <i>production</i>.

La convention en Node est de définir le mode d'exécution de l'application avec la variable d'environnement <i>NODE\_ENV</i>. Dans notre application actuelle, nous chargeons uniquement les variables d'environnement définies dans le fichier <i>.env</i> si l'application n'est <i>pas</i> en mode production.

Il est courant de définir des modes séparés pour le développement et les tests.

Ensuite, modifions les scripts dans le fichier <i>package.json</i> de notre application de notes, de sorte que lorsque les tests sont exécutés, <i>NODE\_ENV</i> reçoive la valeur <i>test</i>:

```json
{
  // ...
  "scripts": {
    "start": "NODE_ENV=production node index.js",// highlight-line
    "dev": "NODE_ENV=development nodemon index.js",// highlight-line
    "build:ui": "rm -rf build && cd ../frontend/ && npm run build && cp -r build ../backend",
    "deploy": "fly deploy",
    "deploy:full": "npm run build:ui && npm run deploy",
    "logs:prod": "fly logs",
    "lint": "eslint .",
    "test": "NODE_ENV=test jest --verbose --runInBand"// highlight-line
  },
  // ...
}
```

Nous avons également ajouté l'option [runInBand](https://jestjs.io/docs/cli#--runinband) au script npm qui exécute les tests. Cette option empêchera Jest d'exécuter les tests en parallèle; nous discuterons de son importance une fois que nos tests commenceront à utiliser la base de données.

Nous avons spécifié le mode de l'application comme étant <i>développement</i> dans le script _npm run dev_ qui utilise nodemon. Nous avons également précisé que la commande par défaut _npm start_ définira le mode comme <i>production</i>.

Il y a un léger problème dans la façon dont nous avons spécifié le mode de l'application dans nos scripts: cela ne fonctionnera pas sur Windows. Nous pouvons corriger cela en installant le package [cross-env](https://www.npmjs.com/package/cross-env) en tant que dépendance de développement avec la commande:

```bash
npm install --save-dev cross-env
```

Nous pouvons ensuite obtenir une compatibilité multi-plateformes en utilisant la bibliothèque cross-env dans nos scripts npm définis dans le fichier <i>package.json</i>:

```json
{
  // ...
  "scripts": {
    "start": "cross-env NODE_ENV=production node index.js",
    "dev": "cross-env NODE_ENV=development nodemon index.js",
    // ...
    "test": "cross-env NODE_ENV=test jest --verbose --runInBand",
  },
  // ...
}
```

**NB:** Si vous déployez cette application sur Fly.io/Render, gardez à l'esprit que si cross-env est enregistré en tant que dépendance de développement, cela pourrait provoquer une erreur d'application sur votre serveur web. Pour résoudre ce problème, changez cross-env en une dépendance de production en exécutant ceci dans la ligne de commande:

```bash
npm install cross-env
```


Nous pouvons maintenant modifier la manière dont notre application fonctionne dans différents modes. Par exemple, nous pourrions définir l'application pour utiliser une base de données de test séparée lorsqu'elle exécute des tests.

Nous pouvons créer notre base de données de test séparée dans MongoDB Atlas. Ce n'est pas une solution optimale dans les situations où de nombreuses personnes développent la même application. L'exécution de tests nécessite en particulier une seule instance de base de données qui n'est pas utilisée par des tests s'exécutant simultanément.

Il serait préférable d'exécuter nos tests en utilisant une base de données installée et fonctionnant sur la machine locale du développeur. La solution optimale serait que chaque exécution de test utilise une base de données séparée. Cela est "relativement simple" à réaliser en exécutant [Mongo en mémoire](https://docs.mongodb.com/manual/core/inmemory/) ou en utilisant des conteneurs [Docker](https://www.docker.com). Nous ne compliquerons pas les choses et continuerons à utiliser la base de données MongoDB Atlas.

Faisons quelques modifications au module qui définit la configuration de l'application:

```js
require('dotenv').config()

const PORT = process.env.PORT

// highlight-start
const MONGODB_URI = process.env.NODE_ENV === 'test' 
  ? process.env.TEST_MONGODB_URI
  : process.env.MONGODB_URI
// highlight-end

module.exports = {
  MONGODB_URI,
  PORT
}
```

Le fichier <i>.env</i> contient des <i>variables distinctes</i> pour les adresses de la base de données de développement et de test:

```bash
MONGODB_URI=mongodb+srv://fullstack:thepasswordishere@cluster0.o1opl.mongodb.net/noteApp?retryWrites=true&w=majority
PORT=3001

// highlight-start
TEST_MONGODB_URI=mongodb+srv://fullstack:thepasswordishere@cluster0.o1opl.mongodb.net/testNoteApp?retryWrites=true&w=majority
// highlight-end
```

Le module _config_ que nous avons implémenté ressemble un peu au package [node-config](https://github.com/lorenwest/node-config). Écrire notre propre implémentation est justifié puisque notre application est simple, et cela nous apprend également des leçons précieuses.

Ce sont les seuls changements que nous devons apporter au code de notre application.

Vous pouvez trouver le code complet de notre application actuelle dans la branche <i>part4-2</i> de ce [dépôt GitHub](https://github.com/fullstack-hy2020/part3-notes-backend/tree/part4-2).

### supertest

Utilisons le package [supertest](https://github.com/visionmedia/supertest) pour nous aider à écrire nos tests pour tester l'API.

Nous installerons le package en tant que dépendance de développement:

```bash
npm install --save-dev supertest
```

Écrivons notre premier test dans le fichier <i>tests/note_api.test.js</i>:

```js
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

test('notes are returned as json', async () => {
  await api
    .get('/api/notes')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

afterAll(async () => {
  await mongoose.connection.close()
})
```

Le test importe l'application Express depuis le module <i>app.js</i> et l'enveloppe avec la fonction <i>supertest</i> en un objet dit [superagent](https://github.com/visionmedia/superagent). Cet objet est assigné à la variable <i>api</i> et les tests peuvent l'utiliser pour faire des requêtes HTTP vers le backend.

Notre test effectue une requête HTTP GET vers l'URL <i>api/notes</i> et vérifie que la requête reçoit une réponse avec le code de statut 200. Le test vérifie également que l'en-tête <i>Content-Type</i> est défini sur <i>application/json</i>, indiquant que les données sont dans le format souhaité.

La vérification de la valeur de l'en-tête utilise une syntaxe un peu étrange:

```js
.expect('Content-Type', /application\/json/)
```

La valeur souhaitée est maintenant définie comme une [expression régulière](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions) ou, en abrégé, regex. La regex commence et se termine par un slash /, car la chaîne souhaitée <i>application/json</i> contient également le même slash, elle est précédée d'un \ de sorte qu'elle ne soit pas interprétée comme un caractère de fin de regex.

En principe, le test aurait également pu être défini comme une chaîne

```js
.expect('Content-Type', 'application/json')
```

Le problème ici, cependant, est que lorsqu'on utilise une chaîne, la valeur de l'en-tête doit être exactement la même. Pour la regex que nous avons définie, il est acceptable que l'en-tête <i>contienne</i> la chaîne en question. La valeur réelle de l'en-tête est <i>application/json; charset=utf-8</i>, c'est-à-dire qu'elle contient également des informations sur l'encodage des caractères. Cependant, notre test n'est pas intéressé par cela et il est donc préférable de définir le test comme une regex au lieu d'une chaîne exacte.

Le test contient certains détails que nous explorerons [un peu plus tard](/en/part4/testing_the_backend#async-await). La fonction fléchée qui définit le test est précédée du mot-clé <i>async</i> et l'appel de méthode pour l'objet <i>api</i> est précédé du mot-clé <i>await</i>. Nous allons écrire quelques tests puis examiner de plus près cette magie async/await. Ne vous en préoccupez pas pour l'instant, soyez simplement assuré que les tests d'exemple fonctionnent correctement. La syntaxe async/await est liée au fait que faire une requête à l'API est une opération <i>asynchrone</i>. La syntaxe [async/await](https://jestjs.io/docs/asynchronous) peut être utilisée pour écrire du code asynchrone avec l'apparence de code synchrone.

Une fois que tous les tests (il n'y en a actuellement qu'un) ont fini de s'exécuter, nous devons fermer la connexion à la base de données utilisée par Mongoose. Cela peut être facilement réalisé avec la méthode [afterAll](https://jestjs.io/docs/api#afterallfn-timeout):

```js
afterAll(async () => {
  await mongoose.connection.close()
})
```

Lorsque vous exécutez vos tests, vous pouvez rencontrer l'avertissement suivant dans la console:

![avertissement de la console jest sur la non-sortie](../../images/4/8.png)

Le problème est très probablement causé par la version 6.x de Mongoose, le problème n'apparaît pas avec les versions 5.x ou 7.x. La [documentation de Mongoose](https://mongoosejs.com/docs/jest.html) ne recommande pas de tester des applications Mongoose avec Jest.

[Une manière](https://stackoverflow.com/questions/50687592/jest-and-mongoose-jest-has-detected-opened-handles) de se débarrasser de cela est d'ajouter dans le répertoire <i>tests</i> un fichier <i>teardown.js</i> avec le contenu suivant

```js
module.exports = () => {
  process.exit(0)
}
```

et en étendant les définitions de Jest dans le fichier <i>package.json</i> comme suit

```js
{
 //...
 "jest": {
   "testEnvironment": "node",
   "globalTeardown": "./tests/teardown.js" // highlight-line
 }
}
```

Une autre erreur que vous pourriez rencontrer est que votre test prend plus de temps que le délai d'attente par défaut de Jest de 5000 ms. Cela peut être résolu en ajoutant un troisième paramètre à la fonction de test:

```js
test('notes are returned as json', async () => {
  await api
    .get('/api/notes')
    .expect(200)
    .expect('Content-Type', /application\/json/)
}, 100000)
```

Ce troisième paramètre définit le délai d'attente à 100 000 ms. Un long délai d'attente garantit que notre test ne échouera pas à cause du temps nécessaire pour s'exécuter. (Un long délai d'attente n'est peut-être pas ce que vous souhaitez pour des tests basés sur la performance ou la vitesse, mais cela convient pour nos tests d'exemple).

Si vous rencontrez toujours des problèmes avec les délais d'attente de mongoose, définissez la variable `bufferTimeoutMS` à une valeur significativement supérieure à 10 000 (10 secondes). Vous pourriez la définir ainsi en haut, juste après les déclarations `require`. `mongoose.set("bufferTimeoutMS", 30000)`

Un petit détail mais important: au [début](/en/part4/structure_of_backend_application_introduction_to_testing#project-structure) de cette partie, nous avons extrait l'application Express dans le fichier <i>app.js</i>, et le rôle du fichier <i>index.js</i> a été modifié pour lancer l'application sur le port spécifié via `app.listen`:

```js
const app = require('./app') // the actual Express app
const config = require('./utils/config')
const logger = require('./utils/logger')

app.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`)
})
```

Les tests utilisent uniquement l'application Express définie dans le fichier <i>app.js</i>, qui n'écoute aucun port:

```js
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app') // highlight-line

const api = supertest(app) // highlight-line

// ...
```

La documentation de supertest dit ce qui suit:

> <i>si le serveur n'écoute pas déjà les connexions, il est lié à un port éphémère pour vous, il n'est donc pas nécessaire de suivre les ports.</i>

En d'autres termes, supertest s'assure que l'application testée est lancée sur le port qu'il utilise en interne.

Ajoutons deux notes à la base de données de test à l'aide du programme _mongo.js_ (ici, nous devons nous rappeler de passer à l'url correcte de la base de données).

Écrivons quelques tests supplémentaires:

```js
test('there are two notes', async () => {
  const response = await api.get('/api/notes')

  expect(response.body).toHaveLength(2)
})

test('the first note is about HTTP methods', async () => {
  const response = await api.get('/api/notes')

  expect(response.body[0].content).toBe('HTML is easy')
})
```

Les deux tests stockent la réponse de la requête dans la variable _response_, et contrairement au test précédent qui utilisait les méthodes fournies par _supertest_ pour vérifier le code de statut et les en-têtes, cette fois-ci nous inspectons les données de réponse stockées dans la propriété <i>response.body</i>. Nos tests vérifient le format et le contenu des données de réponse avec la méthode [expect](https://jestjs.io/docs/expect#expectvalue) de Jest.

L'avantage de l'utilisation de la syntaxe async/await commence à devenir évident. Normalement, nous devrions utiliser des fonctions de rappel pour accéder aux données renvoyées par les promesses, mais avec la nouvelle syntaxe, les choses sont beaucoup plus confortables:

```js
const response = await api.get('/api/notes')

// execution gets here only after the HTTP request is complete
// the result of HTTP request is saved in variable response
expect(response.body).toHaveLength(2)
```

Le middleware qui affiche des informations sur les requêtes HTTP gêne l'affichage de l'exécution des tests. Modifions le logger pour qu'il n'imprime pas dans la console en mode test:

```js
const info = (...params) => {
  // highlight-start
  if (process.env.NODE_ENV !== 'test') { 
    console.log(...params)
  }
  // highlight-end
}

const error = (...params) => {
  // highlight-start
  if (process.env.NODE_ENV !== 'test') { 
    console.error(...params)
  }
  // highlight-end  
}

module.exports = {
  info, error
}
```

### Initialisation de la base de données avant les tests

Les tests semblent faciles et nos tests passent actuellement. Cependant, nos tests ne sont pas fiables car ils dépendent de l'état de la base de données, qui contient actuellement deux notes. Pour rendre nos tests plus robustes, nous devons réinitialiser la base de données et générer les données de test nécessaires de manière contrôlée avant d'exécuter les tests.

Nos tests utilisent déjà la fonction [afterAll](https://jestjs.io/docs/api#afterallfn-timeout) de Jest pour fermer la connexion à la base de données après l'exécution des tests. Jest offre de nombreuses autres [fonctions](https://jestjs.io/docs/setup-teardown) qui peuvent être utilisées pour exécuter des opérations une fois avant l'exécution de n'importe quel test ou à chaque fois avant un test.

Initialisons la base de données <i>avant chaque test</i> avec la fonction [beforeEach](https://jestjs.io/docs/en/api.html#beforeeachfn-timeout):

```js
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
// highlight-start
const Note = require('../models/note')
// highlight-end

// highlight-start
const initialNotes = [
  {
    content: 'HTML is easy',
    important: false,
  },
  {
    content: 'Browser can execute only JavaScript',
    important: true,
  },
]
// highlight-end

// highlight-start
beforeEach(async () => {
  await Note.deleteMany({})

  let noteObject = new Note(initialNotes[0])
  await noteObject.save()

  noteObject = new Note(initialNotes[1])
  await noteObject.save()
})
// highlight-end
// ...
```

La base de données est vidée au début, et après cela, nous enregistrons les deux notes stockées dans le tableau _initialNotes_ dans la base de données. En faisant cela, nous nous assurons que la base de données est dans le même état avant l'exécution de chaque test.

Faisons également les modifications suivantes aux deux derniers tests:

```js
test('all notes are returned', async () => { // highlight-line
  const response = await api.get('/api/notes')

  expect(response.body).toHaveLength(initialNotes.length) // highlight-line
})

test('a specific note is within the returned notes', async () => { // highlight-line
  const response = await api.get('/api/notes')

  // highlight-start
  const contents = response.body.map(r => r.content)

  expect(contents).toContain(
    'Browser can execute only JavaScript'
  )
  // highlight-end
})
```

Portez une attention particulière à l'expectation dans le dernier test. La commande <code>response.body.map(r => r.content)</code> est utilisée pour créer un tableau contenant le contenu de chaque note renvoyée par l'API. La méthode [toContain](https://jestjs.io/docs/expect#tocontainitem) est utilisée pour vérifier que la note donnée en paramètre se trouve dans la liste des notes renvoyées par l'API.

### Exécution des tests un par un

La commande _npm test_ exécute tous les tests de l'application. Lorsque nous écrivons des tests, il est généralement judicieux de n'en exécuter qu'un ou deux. Jest offre plusieurs manières de le faire, dont une est la méthode [only](https://jestjs.io/docs/en/api#testonlyname-fn-timeout). Si les tests sont répartis sur plusieurs fichiers, cette méthode n'est pas idéale.

Une meilleure option est de spécifier les tests à exécuter en tant que paramètres de la commande <i>npm test</i>.

La commande suivante exécute uniquement les tests trouvés dans le fichier <i>tests/note_api.test.js</i>:

```js
npm test -- tests/note_api.test.js
```

L'option <i>-t</i> peut être utilisée pour exécuter des tests ayant un nom spécifique:

```js
npm test -- -t "a specific note is within the returned notes"
```

Le paramètre fourni peut faire référence au nom du test ou du bloc describe. Le paramètre peut également contenir juste une partie du nom. La commande suivante exécutera tous les tests qui contiennent <i>notes</i> dans leur nom:

```js
npm test -- -t 'notes'
```

**NB:** Lors de l'exécution d'un seul test, la connexion mongoose peut rester ouverte si aucun test utilisant la connexion n'est exécuté.
Le problème peut être dû au fait que supertest initialise la connexion, mais Jest n'exécute pas la partie afterAll du code.

### async/await

Avant d'écrire plus de tests, examinons les mots-clés _async_ et _await_.

La syntaxe async/await introduite dans ES7 permet d'utiliser des <i>fonctions asynchrones qui retournent une promesse</i> d'une manière qui rend le code apparemment synchrone.

Par exemple, la récupération de notes depuis la base de données avec des promesses ressemble à ceci:

```js
Note.find({}).then(notes => {
  console.log('operation returned the following notes', notes)
})
```

La méthode _Note.find()_ renvoie une promesse et nous pouvons accéder au résultat de l'opération en enregistrant une fonction de rappel avec la méthode _then_.

Tout le code que nous voulons exécuter une fois l'opération terminée est écrit dans la fonction de rappel. Si nous voulions effectuer plusieurs appels de fonction asynchrones en séquence, la situation deviendrait rapidement pénible. Les appels asynchrones devraient être faits dans le rappel. Cela pourrait probablement conduire à un code compliqué et pourrait potentiellement donner naissance à ce qu'on appelle un [enfer de rappels](http://callbackhell.com/).

En [chaînant les promesses](https://javascript.info/promise-chaining), nous pourrions garder la situation quelque peu sous contrôle, et éviter l'enfer de rappels en créant une chaîne assez propre d'appels de méthode _then_. Nous avons vu quelques exemples de cela au cours de la formation. Pour illustrer cela, vous pouvez voir un exemple artificiel d'une fonction qui récupère toutes les notes puis supprime la première:

```js
Note.find({})
  .then(notes => {
    return notes[0].deleteOne()
  })
  .then(response => {
    console.log('the first note is removed')
    // more code here
  })
```

La chaîne de then est correcte, mais nous pouvons faire mieux. Les [fonctions générateur](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Generator) introduites dans ES6 ont fourni une [méthode astucieuse](https://github.com/getify/You-Dont-Know-JS/blob/1st-ed/async%20%26%20performance/ch4.md#iterating-generators-asynchronously) d'écrire du code asynchrone d'une manière qui "semble synchrone". La syntaxe est un peu lourde et n'est pas largement utilisée.

Les mots-clés _async_ et _await_ introduits dans ES7 apportent la même fonctionnalité que les générateurs, mais d'une manière compréhensible et syntaxiquement plus propre à la portée de tous les citoyens du monde JavaScript.

Nous pourrions récupérer toutes les notes dans la base de données en utilisant l'opérateur [await](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await) de cette façon:

```js
const notes = await Note.find({})

console.log('operation returned the following notes', notes)
```

Le code ressemble exactement à du code synchrone. L'exécution du code s'arrête à <em>const notes = await Note.find({})</em> et attend jusqu'à ce que la promesse associée soit <i>remplie</i>, puis continue son exécution jusqu'à la ligne suivante. Lorsque l'exécution se poursuit, le résultat de l'opération qui a renvoyé une promesse est attribué à la variable _notes_.

L'exemple légèrement compliqué présenté ci-dessus pourrait être mis en oeuvre en utilisant await de cette façon: 

```js
const notes = await Note.find({})
const response = await notes[0].deleteOne()

console.log('the first note is removed')
```

Grâce à la nouvelle syntaxe, le code est beaucoup plus simple que la chaîne de then précédente.

Il y a quelques détails importants à prendre en compte lors de l'utilisation de la syntaxe async/await. Pour utiliser l'opérateur await avec des opérations asynchrones, elles doivent retourner une promesse. Ce n'est pas un problème en soi, car les fonctions asynchrones régulières utilisant des callbacks sont faciles à envelopper dans des promesses.

Le mot-clé await ne peut pas être utilisé n'importe où dans le code JavaScript. L'utilisation de await est possible uniquement à l'intérieur d'une fonction [async](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function).

Cela signifie que pour que les exemples précédents fonctionnent, ils doivent utiliser des fonctions async. Remarquez la première ligne dans la définition de la fonction fléchée:

```js
const main = async () => { // highlight-line
  const notes = await Note.find({})
  console.log('operation returned the following notes', notes)

  const response = await notes[0].deleteOne()
  console.log('the first note is removed')
}

main() // highlight-line
```

Le code déclare que la fonction assignée à _main_ est asynchrone. Après cela, le code appelle la fonction avec <code>main()</code>.

### async/await dans le backend

Commençons à changer le backend pour utiliser async et await. Comme toutes les opérations asynchrones sont actuellement effectuées à l'intérieur d'une fonction, il suffit de changer les fonctions de gestionnaire de route en fonctions asynchrones.

La route pour récupérer toutes les notes est modifiée comme suit:

```js
notesRouter.get('/', async (request, response) => { 
  const notes = await Note.find({})
  response.json(notes)
})
```

Nous pouvons vérifier que notre refactoring a été réussi en testant le point de terminaison via le navigateur et en exécutant les tests que nous avons écrits précédemment.

Vous pouvez trouver le code de notre application actuelle dans son intégralité dans la branche <i>part4-3</i> de ce [dépôt GitHub](https://github.com/fullstack-hy2020/part3-notes-backend/tree/part4-3).

### Plus de tests et refactoring du backend

Lorsque le code est refactorisé, il y a toujours le risque de [régression](https://en.wikipedia.org/wiki/Regression_testing), ce qui signifie que la fonctionnalité existante peut se briser. Refactorisons les opérations restantes en écrivant d'abord un test pour chaque route de l'API.

Commençons par l'opération d'ajout d'une nouvelle note. Écrivons un test qui ajoute une nouvelle note et vérifie que le nombre de notes renvoyées par l'API augmente et que la nouvelle note ajoutée est dans la liste.

```js
test('a valid note can be added', async () => {
  const newNote = {
    content: 'async/await simplifies making async calls',
    important: true,
  }

  await api
    .post('/api/notes')
    .send(newNote)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/notes')

  const contents = response.body.map(r => r.content)

  expect(response.body).toHaveLength(initialNotes.length + 1)
  expect(contents).toContain(
    'async/await simplifies making async calls'
  )
})
```

Le test échoue car nous retournons par erreur le code d'état <i>200 OK</i> lorsqu'une nouvelle note est créée. Modifions cela pour <i>201 CREATED</i>:

```js
notesRouter.post('/', (request, response, next) => {
  const body = request.body

  const note = new Note({
    content: body.content,
    important: body.important || false,
  })

  note.save()
    .then(savedNote => {
      response.status(201).json(savedNote) // highlight-line
    })
    .catch(error => next(error))
})
```

Écrivons également un test qui vérifie qu'une note sans contenu ne sera pas enregistrée dans la base de données.

```js
test('note without content is not added', async () => {
  const newNote = {
    important: true
  }

  await api
    .post('/api/notes')
    .send(newNote)
    .expect(400)

  const response = await api.get('/api/notes')

  expect(response.body).toHaveLength(initialNotes.length)
})
```

Les deux tests vérifient l'état stocké dans la base de données après l'opération d'enregistrement, en récupérant toutes les notes de l'application.

```js
const response = await api.get('/api/notes')
```

Les mêmes étapes de vérification se répéteront dans d'autres tests ultérieurement, et il est judicieux d'extraire ces étapes en fonctions d'aide. Ajoutons la fonction dans un nouveau fichier appelé <i>tests/test_helper.js</i> qui se trouve dans le même répertoire que le fichier de test.

```js
const Note = require('../models/note')

const initialNotes = [
  {
    content: 'HTML is easy',
    important: false
  },
  {
    content: 'Browser can execute only JavaScript',
    important: true
  }
]

const nonExistingId = async () => {
  const note = new Note({ content: 'willremovethissoon' })
  await note.save()
  await note.deleteOne()

  return note._id.toString()
}

const notesInDb = async () => {
  const notes = await Note.find({})
  return notes.map(note => note.toJSON())
}

module.exports = {
  initialNotes, nonExistingId, notesInDb
}
```

Le module définit la fonction _notesInDb_ qui peut être utilisée pour vérifier les notes stockées dans la base de données. Le tableau _initialNotes_ contenant l'état initial de la base de données est également présent dans le module. Nous définissons également la fonction _nonExistingId_ à l'avance, qui peut être utilisée pour créer un ID d'objet de base de données qui n'appartient à aucun objet de note dans la base de données.

Nos tests peuvent maintenant utiliser le module d'aide et être modifiés comme suit:

```js
const supertest = require('supertest')
const mongoose = require('mongoose')
const helper = require('./test_helper') // highlight-line
const app = require('../app')
const api = supertest(app)

const Note = require('../models/note')

beforeEach(async () => {
  await Note.deleteMany({})

  let noteObject = new Note(helper.initialNotes[0]) // highlight-line
  await noteObject.save()

  noteObject = new Note(helper.initialNotes[1]) // highlight-line
  await noteObject.save()
})

test('notes are returned as json', async () => {
  await api
    .get('/api/notes')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('all notes are returned', async () => {
  const response = await api.get('/api/notes')

  expect(response.body).toHaveLength(helper.initialNotes.length) // highlight-line
})

test('a specific note is within the returned notes', async () => {
  const response = await api.get('/api/notes')

  const contents = response.body.map(r => r.content)

  expect(contents).toContain(
    'Browser can execute only JavaScript'
  )
})

test('a valid note can be added ', async () => {
  const newNote = {
    content: 'async/await simplifies making async calls',
    important: true,
  }

  await api
    .post('/api/notes')
    .send(newNote)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const notesAtEnd = await helper.notesInDb() // highlight-line
  expect(notesAtEnd).toHaveLength(helper.initialNotes.length + 1) // highlight-line

  const contents = notesAtEnd.map(n => n.content) // highlight-line
  expect(contents).toContain(
    'async/await simplifies making async calls'
  )
})

test('note without content is not added', async () => {
  const newNote = {
    important: true
  }

  await api
    .post('/api/notes')
    .send(newNote)
    .expect(400)

  const notesAtEnd = await helper.notesInDb() // highlight-line

  expect(notesAtEnd).toHaveLength(helper.initialNotes.length) // highlight-line
})

afterAll(async () => {
  await mongoose.connection.close()
})
```

Le code utilisant des promesses fonctionne et les tests passent. Nous sommes prêts à refactorer notre code pour utiliser la syntaxe async/await.

Nous apportons les modifications suivantes au code qui gère l'ajout d'une nouvelle note (remarquez que la définition du gestionnaire de route est précédée du mot-clé _async_):

```js
notesRouter.post('/', async (request, response, next) => {
  const body = request.body

  const note = new Note({
    content: body.content,
    important: body.important || false,
  })

  const savedNote = await note.save()
  response.status(201).json(savedNote)
})
```

Il y a un léger problème avec notre code: nous ne gérons pas les situations d'erreur. Comment devrions-nous les traiter?

### Gestion des erreurs et async/await

Si une exception se produit lors de la gestion de la requête POST, nous nous retrouvons dans une situation familière:

![terminal montrant un avertissement de rejet de promesse non géré](../../images/4/6.png)

En d'autres termes, nous nous retrouvons avec un rejet de promesse non géré, et la requête ne reçoit jamais de réponse.

Avec async/await, la manière recommandée de gérer les exceptions est le mécanisme ancien et familier _try/catch_ :

```js
notesRouter.post('/', async (request, response, next) => {
  const body = request.body

  const note = new Note({
    content: body.content,
    important: body.important || false,
  })
  // highlight-start
  try {
    const savedNote = await note.save()
    response.status(201).json(savedNote)
  } catch(exception) {
    next(exception)
  }
  // highlight-end
})
```

Le bloc catch appelle simplement la fonction _next_, qui transmet la gestion de la requête au middleware de gestion des erreurs.

Après avoir apporté cette modification, tous nos tests passeront à nouveau.

Ensuite, écrivons des tests pour récupérer et supprimer une note individuelle:

```js
test('a specific note can be viewed', async () => {
  const notesAtStart = await helper.notesInDb()

  const noteToView = notesAtStart[0]

// highlight-start
  const resultNote = await api
    .get(`/api/notes/${noteToView.id}`)
    .expect(200)
    .expect('Content-Type', /application\/json/)
// highlight-end

  expect(resultNote.body).toEqual(noteToView)
})

test('a note can be deleted', async () => {
  const notesAtStart = await helper.notesInDb()
  const noteToDelete = notesAtStart[0]

// highlight-start
  await api
    .delete(`/api/notes/${noteToDelete.id}`)
    .expect(204)
// highlight-end

  const notesAtEnd = await helper.notesInDb()

  expect(notesAtEnd).toHaveLength(
    helper.initialNotes.length - 1
  )

  const contents = notesAtEnd.map(r => r.content)

  expect(contents).not.toContain(noteToDelete.content)
})
```

Les deux tests partagent une structure similaire. Dans la phase d'initialisation, ils récupèrent une note de la base de données. Ensuite, les tests appellent l'opération réelle qui est testée, comme indiqué dans le bloc de code. Enfin, les tests vérifient que le résultat de l'opération est conforme aux attentes.

Les tests réussissent et nous pouvons en toute sécurité refactorer les routes testées pour utiliser async/await:

```js
notesRouter.get('/:id', async (request, response, next) => {
  try {
    const note = await Note.findById(request.params.id)
    if (note) {
      response.json(note)
    } else {
      response.status(404).end()
    }
  } catch(exception) {
    next(exception)
  }
})

notesRouter.delete('/:id', async (request, response, next) => {
  try {
    await Note.findByIdAndDelete(request.params.id)
    response.status(204).end()
  } catch(exception) {
    next(exception)
  }
})
```

Vous pouvez trouver le code de notre application actuelle dans son intégralité dans la branche <i>part4-4</i> de ce [dépôt GitHub](https://github.com/fullstack-hy2020/part3-notes-backend/tree/part4-4).

### Élimination du try-catch

Async/await simplifie quelque peu le code, mais la contrepartie est l'utilisation de la structure <i>try/catch</i> nécessaire pour gérer les exceptions. Tous les gestionnaires de routes suivent la même structure.

```js
try {
  // do the async operations here
} catch(exception) {
  next(exception)
}
```

On commence à se demander s'il serait possible de refactorer le code pour éliminer la clause <i>catch</i> des méthodes?

La bibliothèque [express-async-errors](https://github.com/davidbanham/express-async-errors) propose une solution à ce problème.

Installons la bibliothèque

```bash
npm install express-async-errors
```

L'utilisation de la bibliothèque est <i>très</i> facile.
Vous introduisez la bibliothèque dans <i>app.js</i>, <i>avant</i> d'importer vos routes:

```js
const config = require('./utils/config')
const express = require('express')
require('express-async-errors') // highlight-line
const app = express()
const cors = require('cors')
const notesRouter = require('./controllers/notes')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const mongoose = require('mongoose')

// ...

module.exports = app
```

La "magie" de la bibliothèque nous permet d'éliminer complètement les blocs try-catch.
Par exemple, la route pour supprimer une note:

```js
notesRouter.delete('/:id', async (request, response, next) => {
  try {
    await Note.findByIdAndDelete(request.params.id)
    response.status(204).end()
  } catch (exception) {
    next(exception)
  }
})
```

devient

```js
notesRouter.delete('/:id', async (request, response) => {
  await Note.findByIdAndDelete(request.params.id)
  response.status(204).end()
})
```

Grâce à la bibliothèque, nous n'avons plus besoin de l'appel _next(exception)_.
La bibliothèque gère tout en interne. Si une exception se produit dans une route <i>asynchrone</i>, l'exécution est automatiquement transmise au middleware de gestion des erreurs.

Les autres routes deviennent:

```js
notesRouter.post('/', async (request, response) => {
  const body = request.body

  const note = new Note({
    content: body.content,
    important: body.important || false,
  })

  const savedNote = await note.save()
  response.status(201).json(savedNote)
})

notesRouter.get('/:id', async (request, response) => {
  const note = await Note.findById(request.params.id)
  if (note) {
    response.json(note)
  } else {
    response.status(404).end()
  }
})
```

### Optimisation de la fonction beforeEach

Revenons à l'écriture de nos tests et examinons de plus près la fonction _beforeEach_ qui configure les tests:

```js
beforeEach(async () => {
  await Note.deleteMany({})

  let noteObject = new Note(helper.initialNotes[0])
  await noteObject.save()

  noteObject = new Note(helper.initialNotes[1])
  await noteObject.save()
})
```

La fonction enregistre les deux premières notes du tableau _helper.initialNotes_ dans la base de données avec deux opérations distinctes. La solution est correcte, mais il existe un moyen plus efficace d'enregistrer plusieurs objets dans la base de données:


```js
beforeEach(async () => {
  await Note.deleteMany({})
  console.log('cleared')

  helper.initialNotes.forEach(async (note) => {
    let noteObject = new Note(note)
    await noteObject.save()
    console.log('saved')
  })
  console.log('done')
})

test('notes are returned as json', async () => {
  console.log('entered test')
  // ...
}
```

Nous enregistrons les notes stockées dans le tableau dans la base de données à l'intérieur d'une boucle _forEach_. Cependant, les tests ne semblent pas fonctionner comme prévu, alors nous avons ajouté quelques journaux de console pour nous aider à trouver le problème.

La console affiche la sortie suivante:

<pre>
cleared
done
entered test
saved
saved
</pre>

Malgré l'utilisation de la syntaxe async/await, notre solution ne fonctionne pas comme nous l'espérions. L'exécution des tests commence avant que la base de données ne soit initialisée!

Le problème réside dans le fait que chaque itération de la boucle forEach génère une opération asynchrone, et _beforeEach_ n'attend pas leur achèvement. En d'autres termes, les commandes _await_ définies à l'intérieur de la boucle _forEach_ ne sont pas dans la fonction _beforeEach_, mais dans des fonctions séparées auxquelles _beforeEach_ n'attend pas.

Comme l'exécution des tests commence immédiatement après que _beforeEach_ a terminé son exécution, l'exécution des tests commence avant que l'état de la base de données ne soit initialisé.

Une façon de résoudre ce problème est d'attendre que toutes les opérations asynchrones se terminent avec la méthode [Promise.all](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all):

```js
beforeEach(async () => {
  await Note.deleteMany({})

  const noteObjects = helper.initialNotes
    .map(note => new Note(note))
  const promiseArray = noteObjects.map(note => note.save())
  await Promise.all(promiseArray)
})
```

La solution est assez avancée malgré son apparence compacte. La variable _noteObjects_ est assignée à un tableau d'objets Mongoose qui sont créés avec le constructeur _Note_ pour chacune des notes du tableau _helper.initialNotes_. La ligne suivante de code crée un nouveau tableau qui <i>consiste en des promesses</i>, créées en appelant la méthode _save_ pour chaque élément du tableau _noteObjects_. En d'autres termes, il s'agit d'un tableau de promesses pour sauvegarder chacun des éléments dans la base de données.

La méthode [Promise.all](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all) peut être utilisée pour transformer un tableau de promesses en une seule promesse, qui sera <i>accomplie</i> une fois que chaque promesse du tableau passé en paramètre sera résolue. La dernière ligne de code <em>await Promise.all(promiseArray)</em> attend que chaque promesse de sauvegarde d'une note soit terminée, ce qui signifie que la base de données a été initialisée.

> Les valeurs renvoyées par chaque promesse du tableau peuvent toujours être consultées lors de l'utilisation de la méthode Promise.all. Si nous attendons que les promesses soient résolues avec la syntaxe _await_ <em>const results = await Promise.all(promiseArray)</em>, l'opération renverra un tableau contenant les valeurs résolues pour chaque promesse du _promiseArray_, et elles apparaissent dans le même ordre que les promesses dans le tableau.

Promise.all exécute les promesses qu'il reçoit en parallèle. Si les promesses doivent être exécutées dans un ordre particulier, cela posera problème. Dans de telles situations, les opérations peuvent être exécutées à l'intérieur d'une boucle [for...of](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...of), qui garantit un ordre d'exécution spécifique.

```js
beforeEach(async () => {
  await Note.deleteMany({})

  for (let note of helper.initialNotes) {
    let noteObject = new Note(note)
    await noteObject.save()
  }
})
```

L'aspect asynchrone de JavaScript peut en effet entraîner un comportement inattendu, et il est essentiel de comprendre comment fonctionnent les promesses lorsque l'on utilise la syntaxe async/await. Bien que async/await simplifie le travail avec les promesses, une compréhension solide des promesses est essentielle.

Vous pouvez trouver le code de notre application sur [GitHub](https://github.com/fullstack-hy2020/part3-notes-backend/tree/part4-5), dans la branche <i>part4-5</i>.

### Le serment d'un véritable développeur full stack

L'ajout de tests apporte un autre niveau de complexité à la programmation. Nous devons mettre à jour notre serment de développeur full stack pour vous rappeler que la systématicité est également essentielle lors du développement de tests.

Nous devrions donc étendre une fois de plus notre serment comme suit:

Le développement full stack est <i>extrêmement difficile</i>, c'est pourquoi j'utiliserai tous les moyens possibles pour le rendre plus facile :

- J'aurai toujours ma console de développement du navigateur ouverte
- J'utiliserai l'onglet réseau des outils de développement du navigateur pour m'assurer que le frontend et le backend communiquent comme prévu
- Je garderai constamment un oeil sur l'état du serveur pour m'assurer que les données envoyées par le frontend sont enregistrées conformément à mes attentes
- Je surveillerai la base de données : est-ce que le backend enregistre les données au bon format?
- J'avancerai par petites étapes
- <i>J'écrirai de nombreuses instructions console.log pour m'assurer de comprendre le comportement du code et des tests, et pour m'aider à repérer les problèmes</i>
- Si mon code ne fonctionne pas, je n'écrirai pas davantage de code. Au lieu de cela, je commencerai par supprimer le code jusqu'à ce qu'il fonctionne ou que je revienne à un état où tout fonctionnait encore
- <i>Si un test ne réussit pas, je m'assurerai que la fonctionnalité testée fonctionne certainement dans l'application</i>
- Lorsque je demande de l'aide sur le Discord du cours, le canal Telegram ou ailleurs, je formulerai mes questions correctement. Consultez [ici](https://fullstackopen.com/en/part0/general_info#how-to-get-help-in-discord-telegram) comment demander de l'aide de manière appropriée

</div>

<div class="tasks">

### Exercices 4.8.-4.12.

**NB:** Le matériel utilise le matcher [toContain](https://jestjs.io/docs/expect#tocontainitem) à plusieurs endroits pour vérifier qu'un tableau contient un élément spécifique. Il est important de noter que cette méthode utilise l'opérateur === pour comparer et faire correspondre les éléments, ce qui signifie qu'elle n'est souvent pas adaptée à la correspondance d'objets. Dans la plupart des cas, la méthode appropriée pour vérifier les objets dans les tableaux est le matcher [toContainEqual](https://jestjs.io/docs/expect#tocontainequalitem). Cependant, les solutions modèles ne vérifient pas les objets dans les tableaux avec des matchers, donc l'utilisation de cette méthode n'est pas nécessaire pour résoudre les exercices.

**Avertissement** : Si vous vous retrouvez à utiliser à la fois async/await et les méthodes <i>then</i> dans le même code, il est presque garanti que vous faites quelque chose de mal. Utilisez l'une ou l'autre, ne les mélangez pas.

####  4.8: Tests de la liste de blogs, étape 1

Utilisez le package supertest pour écrire un test qui effectue une requête HTTP GET vers l'URL <i>/api/blogs</i>. Vérifiez que l'application de la liste de blogs renvoie le bon nombre d'articles de blog au format JSON.

Une fois le test terminé, refactorez le gestionnaire de route pour utiliser la syntaxe async/await au lieu des promesses.

Notez que vous devrez apporter des modifications similaires à celles qui ont été apportées [dans le matériel](/en/part4/testing_the_backend#test-environment), comme la définition de l'environnement de test afin de pouvoir écrire des tests qui utilisent des bases de données distinctes.

**NB:** Lors de l'exécution des tests, vous pouvez rencontrer l'avertissement suivant:

![Avertissement de lire la documentation sur la connexion de mongoose à jest](../../images/4/8a.png)

[Une façon](https://stackoverflow.com/questions/50687592/jest-and-mongoose-jest-has-detected-opened-handles) de s'en débarrasser consiste à ajouter dans le répertoire <i>tests</i> un fichier <i>teardown.js</i> avec le contenu suivant

```js
module.exports = () => {
  process.exit(0)
}
```

et en étendant les définitions Jest dans le fichier <i>package.json</i> comme suit:

```js
{
 //...
 "jest": {
   "testEnvironment": "node",
   "globalTeardown": "./tests/teardown.js" // highlight-line
 }
}
```

**NB:** Lorsque vous rédigez vos tests, **<i>il est préférable de ne pas exécuter tous vos tests</i>**, exécutez uniquement ceux sur lesquels vous travaillez. En savoir plus à ce sujet [ici](/en/part4/testing_the_backend#running-tests-one-by-one).

#### 4.9: Tests de la liste de blogs, étape 2

Écrivez un test qui vérifie que la propriété d'identifiant unique des articles de blog est nommée <i>id</i>, par défaut, la base de données nomme la propriété <i>_id</i>. La vérification de l'existence d'une propriété se fait facilement avec le matcher [toBeDefined](https://jestjs.io/docs/en/expect#tobedefined) de Jest.

Apportez les modifications nécessaires au code pour qu'il passe le test. La méthode [toJSON](/en/part3/saving_data_to_mongo_db#connecting-the-backend-to-a-database) discutée dans la partie 3 est un endroit approprié pour définir le paramètre <i>id</i>.

#### 4.10: Tests de la liste de blogs, étape 3

Écrivez un test qui vérifie qu'une requête HTTP POST à l'URL <i>/api/blogs</i> crée avec succès un nouvel article de blog. Au moins, vérifiez que le nombre total de blogs dans le système augmente d'un. Vous pouvez également vérifier que le contenu de l'article de blog est correctement enregistré dans la base de données.

Une fois le test terminé, refactorisez l'opération pour utiliser async/await au lieu des promises.

#### 4.11*: Tests de la liste de blogs, étape 4

Écrivez un test qui vérifie que si la propriété <i>likes</i> est manquante dans la requête, elle prendra par défaut la valeur 0. Ne testez pas encore les autres propriétés des blogs créés.

Apportez les modifications nécessaires au code pour qu'il passe le test.

#### 4.12*: Tests de la liste de blogs, étape 5

Écrivez des tests liés à la création de nouveaux blogs via l'endpoint <i>/api/blogs</i>, qui vérifient que si les propriétés <i>title</i> ou <i>url</i> sont manquantes dans les données de la requête, le backend répondra à la requête avec le code d'état <i>400 Bad Request</i>.

Apportez les modifications nécessaires au code pour qu'il passe le test.

</div>

<div class="content">

### Refactoring des tests

Notre couverture de tests est actuellement insuffisante. Certaines requêtes comme <i>GET /api/notes/:id</i> et <i>DELETE /api/notes/:id</i> ne sont pas testées lorsque la requête est envoyée avec un id invalide. Le regroupement et l'organisation des tests pourraient également être améliorés, car tous les tests se trouvent sur le même "niveau supérieur" dans le fichier de test. La lisibilité des tests s'améliorerait si nous regroupions les tests connexes avec des blocs <i>describe</i>.

Voici un exemple du fichier de test après quelques améliorations mineures:

```js
const supertest = require('supertest')
const mongoose = require('mongoose')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const Note = require('../models/note')

beforeEach(async () => {
  await Note.deleteMany({})
  await Note.insertMany(helper.initialNotes)
})

describe('when there is initially some notes saved', () => {
  test('notes are returned as json', async () => {
    await api
      .get('/api/notes')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all notes are returned', async () => {
    const response = await api.get('/api/notes')

    expect(response.body).toHaveLength(helper.initialNotes.length)
  })

  test('a specific note is within the returned notes', async () => {
    const response = await api.get('/api/notes')

    const contents = response.body.map(r => r.content)

    expect(contents).toContain(
      'Browser can execute only JavaScript'
    )
  })
})

describe('viewing a specific note', () => {
  test('succeeds with a valid id', async () => {
    const notesAtStart = await helper.notesInDb()

    const noteToView = notesAtStart[0]

    const resultNote = await api
      .get(`/api/notes/${noteToView.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(resultNote.body).toEqual(noteToView)
  })

  test('fails with statuscode 404 if note does not exist', async () => {
    const validNonexistingId = await helper.nonExistingId()

    await api
      .get(`/api/notes/${validNonexistingId}`)
      .expect(404)
  })

  test('fails with statuscode 400 if id is invalid', async () => {
    const invalidId = '5a3d5da59070081a82a3445'

    await api
      .get(`/api/notes/${invalidId}`)
      .expect(400)
  })
})

describe('addition of a new note', () => {
  test('succeeds with valid data', async () => {
    const newNote = {
      content: 'async/await simplifies making async calls',
      important: true,
    }

    await api
      .post('/api/notes')
      .send(newNote)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const notesAtEnd = await helper.notesInDb()
    expect(notesAtEnd).toHaveLength(helper.initialNotes.length + 1)

    const contents = notesAtEnd.map(n => n.content)
    expect(contents).toContain(
      'async/await simplifies making async calls'
    )
  })

  test('fails with status code 400 if data invalid', async () => {
    const newNote = {
      important: true
    }

    await api
      .post('/api/notes')
      .send(newNote)
      .expect(400)

    const notesAtEnd = await helper.notesInDb()

    expect(notesAtEnd).toHaveLength(helper.initialNotes.length)
  })
})

describe('deletion of a note', () => {
  test('succeeds with status code 204 if id is valid', async () => {
    const notesAtStart = await helper.notesInDb()
    const noteToDelete = notesAtStart[0]

    await api
      .delete(`/api/notes/${noteToDelete.id}`)
      .expect(204)

    const notesAtEnd = await helper.notesInDb()

    expect(notesAtEnd).toHaveLength(
      helper.initialNotes.length - 1
    )

    const contents = notesAtEnd.map(r => r.content)

    expect(contents).not.toContain(noteToDelete.content)
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})
```

La sortie des tests est regroupée en fonction des blocs <i>describe</i> :

![jest output showing grouped describe blocks](../../images/4/7.png)

Il y a encore de la place pour des améliorations, mais il est temps de continuer.

Cette façon de tester l'API, en effectuant des requêtes HTTP et en inspectant la base de données avec Mongoose, n'est en aucun cas la seule ni la meilleure façon de réaliser des tests d'intégration au niveau de l'API pour les applications serveur. Il n'y a pas de meilleure façon universelle d'écrire des tests, car tout dépend de l'application testée et des ressources disponibles.

Vous pouvez trouver le code de notre application actuelle dans sa totalité dans la branche <i>part4-6</i> de [ce dépôt GitHub](https://github.com/fullstack-hy2020/part3-notes-backend/tree/part4-6).

</div>

<div class="tasks">

### Exercices 4.13.-4.14.

#### 4.13 Blog list expansions, step1

Mettez en oeuvre la fonctionnalité permettant de supprimer une seule ressource de billet de blog.

Utilisez la syntaxe async/await. Suivez les conventions [RESTful](/en/part3/node_js_and_express#rest) lors de la définition de l'API HTTP.

Implémentez des tests pour la fonctionnalité.

#### 4.14 Blog list expansions, step2

Mettez en oeuvre la fonctionnalité permettant de mettre à jour les informations d'un billet de blog individuel.

Utilisez async/await.

L'application a principalement besoin de mettre à jour le nombre de <i>likes</i> pour un billet de blog. Vous pouvez mettre en oeuvre cette fonctionnalité de la même manière que nous avons mis en oeuvre la mise à jour des notes dans la [partie 3](/en/part3/saving_data_to_mongo_db#other-operations).

Implémentez des tests pour la fonctionnalité.

</div>