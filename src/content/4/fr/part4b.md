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

**NB**: Si vous déployez cette application sur Fly.io/Render, gardez à l'esprit que si cross-env est enregistré en tant que dépendance de développement, cela pourrait provoquer une erreur d'application sur votre serveur web. Pour résoudre ce problème, changez cross-env en une dépendance de production en exécutant ceci dans la ligne de commande:

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
MONGODB_URI=mongodb+srv://fullstack:<password>@cluster0.o1opl.mongodb.net/noteApp?retryWrites=true&w=majority
PORT=3001

// highlight-start
TEST_MONGODB_URI=mongodb+srv://fullstack:<password>@cluster0.o1opl.mongodb.net/testNoteApp?retryWrites=true&w=majority
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

</div>