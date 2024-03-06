---
mainImage: ../../../images/part-4.svg
part: 4
letter: a
lang: fr
---

<div class="content">

Poursuivons notre travail sur le backend de l'application de notes que nous avons commencé dans la [partie 3](/fr/part3).

### Structure du projet

Avant de nous plonger dans le sujet des tests, nous allons modifier la structure de notre projet pour nous conformer aux meilleures pratiques de Node.js.

Une fois que nous aurons apporté les modifications à la structure de répertoire de notre projet, nous obtiendrons la structure suivante:

```bash
├── index.js
├── app.js
├── dist
│   └── ...
├── controllers
│   └── notes.js
├── models
│   └── note.js
├── package-lock.json
├── package.json
├── utils
│   ├── config.js
│   ├── logger.js
│   └── middleware.js  
```

Jusqu'à présent, nous avons utilisé <i>console.log</i> et <i>console.error</i> pour afficher différentes informations provenant du code. Cependant, ce n'est pas une très bonne manière de procéder. Séparons toute impression sur la console dans son propre module <i>utils/logger.js</i>:

```js
const info = (...params) => {
  console.log(...params)
}

const error = (...params) => {
  console.error(...params)
}

module.exports = {
  info, error
}
```

Le logger possède deux fonctions, __info__ pour imprimer les messages de log normaux, et __error__ pour tous les messages d'erreur.

Extraire le logging dans son propre module est une bonne idée à plus d'un titre. Si nous voulions commencer à écrire des logs dans un fichier ou les envoyer à un service de logging externe comme [graylog](https://www.graylog.org/) ou [papertrail](https://papertrailapp.com), nous n'aurions à faire des modifications qu'à un seul endroit.

La gestion des variables d'environnement est extraite dans un fichier séparé <i>utils/config.js</i>:

```js
require('dotenv').config()

const PORT = process.env.PORT
const MONGODB_URI = process.env.MONGODB_URI

module.exports = {
  MONGODB_URI,
  PORT
}
```

Les autres parties de l'application peuvent accéder aux variables d'environnement en important le module de configuration:

```js
const config = require('./utils/config')

logger.info(`Server running on port ${config.PORT}`)
```

Le contenu du fichier <i>index.js</i> utilisé pour démarrer l'application est simplifié comme suit:

```js
const app = require('./app') // the actual Express application
const config = require('./utils/config')
const logger = require('./utils/logger')

app.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`)
})
```

Le fichier <i>index.js</i> importe seulement l'application réelle du fichier <i>app.js</i> et lance ensuite l'application. La fonction _info_ du module logger est utilisée pour l'affichage dans la console indiquant que l'application fonctionne.

Maintenant, l'application Express et le code s'occupant du serveur web sont séparés l'un de l'autre, suivant les [meilleures](https://dev.to/nermineslimane/always-separate-app-and-server-files--1nc7) [pratiques](https://nodejsbestpractices.com/sections/projectstructre/separateexpress). L'un des avantages de cette méthode est que l'application peut maintenant être testée au niveau des appels API HTTP sans faire réellement des appels via HTTP sur le réseau, ce qui rend l'exécution des tests plus rapide.

Les gestionnaires de route ont également été déplacés dans un module dédié. Les gestionnaires d'événements des routes sont communément appelés <i>contrôleurs</i>, et pour cette raison, nous avons créé un nouveau répertoire <i>controllers</i>. Toutes les routes liées aux notes se trouvent maintenant dans le module <i>notes.js</i> sous le répertoire <i>controllers</i>.

Le contenu du module <i>notes.js</i> est le suivant:

```js
const notesRouter = require('express').Router()
const Note = require('../models/note')

notesRouter.get('/', (request, response) => {
  Note.find({}).then(notes => {
    response.json(notes)
  })
})

notesRouter.get('/:id', (request, response, next) => {
  Note.findById(request.params.id)
    .then(note => {
      if (note) {
        response.json(note)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

notesRouter.post('/', (request, response, next) => {
  const body = request.body

  const note = new Note({
    content: body.content,
    important: body.important || false,
  })

  note.save()
    .then(savedNote => {
      response.json(savedNote)
    })
    .catch(error => next(error))
})

notesRouter.delete('/:id', (request, response, next) => {
  Note.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

notesRouter.put('/:id', (request, response, next) => {
  const body = request.body

  const note = {
    content: body.content,
    important: body.important,
  }

  Note.findByIdAndUpdate(request.params.id, note, { new: true })
    .then(updatedNote => {
      response.json(updatedNote)
    })
    .catch(error => next(error))
})

module.exports = notesRouter
```

Ceci est presque une copie exacte de notre précédent fichier <i>index.js</i>.

Cependant, il y a quelques changements significatifs. Au tout début du fichier, nous créons un nouvel objet [router](http://expressjs.com/en/api.html#router):

```js
const notesRouter = require('express').Router()

//...

module.exports = notesRouter
```

Le module exporte le routeur pour qu'il soit disponible pour tous les consommateurs du module.

Toutes les routes sont maintenant définies pour l'objet routeur, de manière similaire à ce que j'ai fait auparavant avec l'objet représentant l'ensemble de l'application.

Il est important de noter que les chemins dans les gestionnaires de route ont été raccourcis. Dans la version précédente, nous avions:

```js
app.delete('/api/notes/:id', (request, response) => {
```

And in the current version, we have:

```js
notesRouter.delete('/:id', (request, response) => {
```

Alors, que sont exactement ces objets routeur? Le manuel Express fournit l'explication suivante :

> <i>Un objet routeur est une instance isolée de middleware et de routes. Vous pouvez le considérer comme une “mini-application”, capable uniquement de réaliser des fonctions de middleware et de routage. Chaque application Express possède un routeur intégré à l'application.</i>

Le routeur est en fait un <i>middleware</i>, qui peut être utilisé pour définir des "routes connexes" en un seul endroit, généralement placé dans son propre module.

Le fichier <i>app.js</i> qui crée l'application réelle prend le routeur en utilisation comme montré ci-dessous:


```js
const notesRouter = require('./controllers/notes')
app.use('/api/notes', notesRouter)
```

Le routeur que nous avons défini plus tôt est utilisé <i>si</i> l'URL de la requête commence par <i>/api/notes</i>. Pour cette raison, l'objet notesRouter doit uniquement définir les parties relatives des routes, c'est-à-dire le chemin vide <i>/</i> ou simplement le paramètre <i>/:id</i>.

Après avoir apporté ces modifications, notre fichier <i>app.js</i> ressemble à ceci:


```js
const config = require('./utils/config')
const express = require('express')
const app = express()
const cors = require('cors')
const notesRouter = require('./controllers/notes')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

logger.info('connecting to', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI)
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.error('error connecting to MongoDB:', error.message)
  })

app.use(cors())
app.use(express.static('dist'))
app.use(express.json())
app.use(middleware.requestLogger)

app.use('/api/notes', notesRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app
```

Le fichier utilise différents middleware, et l'un d'entre eux est le <i>notesRouter</i> qui est attaché à la route <i>/api/notes</i>.

Notre middleware personnalisé a été déplacé dans un nouveau module <i>utils/middleware.js</i>:

```js
const logger = require('./logger')

const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method)
  logger.info('Path:  ', request.path)
  logger.info('Body:  ', request.body)
  logger.info('---')
  next()
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  logger.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler
}
```

La responsabilité d'établir la connexion à la base de données a été attribuée au module <i>app.js</i>. Le fichier <i>note.js</i> situé dans le répertoire <i>models</i> définit uniquement le schéma Mongoose pour les notes.

```js
const mongoose = require('mongoose')

const noteSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
    minlength: 5
  },
  important: Boolean,
})

noteSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Note', noteSchema)
```

Pour récapituler, la structure de répertoire ressemble à ceci après que les modifications ont été apportées:


```bash
├── index.js
├── app.js
├── dist
│   └── ...
├── controllers
│   └── notes.js
├── models
│   └── note.js
├── package-lock.json
├── package.json
├── utils
│   ├── config.js
│   ├── logger.js
│   └── middleware.js  
```

Pour les applications plus petites, la structure n'a pas beaucoup d'importance. Une fois que l'application commence à grandir en taille, vous allez devoir établir une sorte de structure et séparer les différentes responsabilités de l'application en modules distincts. Cela rendra le développement de l'application beaucoup plus facile.

Il n'y a pas de structure de répertoire stricte ou de convention de nommage de fichiers requise pour les applications Express. En contraste, Ruby on Rails exige une structure spécifique. Notre structure actuelle suit simplement certaines des meilleures pratiques que vous pouvez trouver sur Internet.

Vous pouvez trouver le code de notre application actuelle dans son intégralité dans la branche <i>part4-1</i> de [ce dépôt GitHub](https://github.com/fullstack-hy2020/part3-notes-backend/tree/part4-1).

Si vous clonez le projet pour vous-même, exécutez la commande _npm install_ avant de démarrer l'application avec _npm run dev_.

### Note sur les exports

Nous avons utilisé deux types différents d'exports dans cette partie. Tout d'abord, par exemple, le fichier <i>utils/logger.js</i> fait l'exportation comme suit:

```js
const info = (...params) => {
  console.log(...params)
}

const error = (...params) => {
  console.error(...params)
}

// highlight-start
module.exports = {
  info, error
}
// highlight-end
```

Le fichier exporte <i>un objet</i> qui a deux champs, qui sont tous les deux des fonctions. Les fonctions peuvent être utilisées de deux manières différentes. La première option est d'importer l'objet entier et de se référer aux fonctions à travers l'objet en utilisant la notation par point:

```js
const logger = require('./utils/logger')

logger.info('message')

logger.error('error message')
```

L'autre option est de décomposer les fonctions en leurs propres variables dans l'instruction <i>require</i>:

```js
const { info, error } = require('./utils/logger')

info('message')
error('error message')
```

La deuxième manière d'exporter peut être préférable si seulement une petite partie des fonctions exportées est utilisée dans un fichier. Par exemple, dans le fichier <i>controller/notes.js</i>, l'exportation se fait comme suit:

```js
const notesRouter = require('express').Router()
const Note = require('../models/note')

// ...

module.exports = notesRouter // highlight-line
```

Dans ce cas, il n'y a qu'une seule "chose" exportée, donc la seule façon de l'utiliser est la suivante:

```js
const notesRouter = require('./controllers/notes')

// ...

app.use('/api/notes', notesRouter)
```

Maintenant, la "chose" exportée (dans ce cas, un objet routeur) est assignée à une variable et utilisée comme telle.

#### Trouver les utilisations de vos exports avec VS Code

VS Code dispose d'une fonctionnalité pratique qui vous permet de voir où vos modules ont été exportés. Cela peut être très utile pour le refactoring. Par exemple, si vous décidez de diviser une fonction en deux fonctions séparées, votre code pourrait se casser si vous ne modifiez pas toutes les utilisations. C'est difficile si vous ne savez pas où elles se trouvent. Cependant, vous devez définir vos exports d'une manière particulière pour que cela fonctionne.

Si vous faites un clic droit sur une variable à l'endroit où elle est exportée et que vous sélectionnez "Trouver toutes les références", cela vous montrera partout où la variable est importée. Cependant, si vous assignez directement un objet à module.exports, cela ne fonctionnera pas. Une solution consiste à assigner l'objet que vous souhaitez exporter à une variable nommée, puis à exporter la variable nommée. Cela ne fonctionnera pas non plus si vous déstructurez là où vous importez ; vous devez importer la variable nommée puis la déstructurer, ou simplement utiliser la notation par point pour utiliser les fonctions contenues dans la variable nommée.

Le fait que la nature de VS Code influe sur la manière dont vous écrivez votre code n'est probablement pas idéal, donc vous devez décider par vous-même si le compromis en vaut la peine.

</div>

<div class="tasks">

### Exercices 4.1.-4.2.

Dans les exercices de cette partie, nous allons construire une <i>application de liste de blogs</i>, qui permet aux utilisateurs de sauvegarder des informations sur des blogs intéressants qu'ils ont trouvés sur Internet. Pour chaque blog listé, nous sauvegarderons l'auteur, le titre, l'URL et le nombre de votes positifs des utilisateurs de l'application.

#### 4.1 Liste de blogs, étape 1

Imaginons une situation où vous recevez un email contenant le corps de l'application suivant:

```js
const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number
})

const Blog = mongoose.model('Blog', blogSchema)

const mongoUrl = 'mongodb://localhost/bloglist'
mongoose.connect(mongoUrl)

app.use(cors())
app.use(express.json())

app.get('/api/blogs', (request, response) => {
  Blog
    .find({})
    .then(blogs => {
      response.json(blogs)
    })
})

app.post('/api/blogs', (request, response) => {
  const blog = new Blog(request.body)

  blog
    .save()
    .then(result => {
      response.status(201).json(result)
    })
})

const PORT = 3003
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
```

Transformez l'application en un projet <i>npm</i> fonctionnel. Pour maintenir votre productivité de développement, configurez l'application pour qu'elle soit exécutée avec <i>nodemon</i>. Vous pouvez créer une nouvelle base de données pour votre application avec MongoDB Atlas, ou utiliser la même base de données que celle des exercices de la partie précédente.

Vérifiez qu'il est possible d'ajouter des blogs à la liste avec Postman ou le client REST de VS Code et que l'application renvoie les blogs ajoutés au bon point de terminaison.

#### 4.2 Liste de blogs, étape 2

Refactorisez l'application en modules séparés comme montré précédemment dans cette partie du matériel de cours.

**NB** refactorisez votre application par petites étapes et vérifiez que l'application fonctionne après chaque changement que vous effectuez. Si vous essayez de prendre un "raccourci" en refactorisant plusieurs choses à la fois, alors la [loi de Murphy](https://en.wikipedia.org/wiki/Murphy%27s_law) entrera en jeu et il est presque certain que quelque chose se cassera dans votre application. Le "raccourci" finira par prendre plus de temps que d'avancer lentement et systématiquement.

Une bonne pratique est de commettre votre code chaque fois qu'il est dans un état stable. Cela facilite le retour à une situation où l'application fonctionne encore.

Si vous rencontrez des problèmes avec <i>content.body</i> étant <i>indéfini</i> sans raison apparente, assurez-vous de ne pas avoir oublié d'ajouter <i>app.use(express.json())</i> près du haut du fichier.

</div>

<div class="content">

### Tester les applications Node

Nous avons complètement négligé un domaine essentiel du développement logiciel, à savoir les tests automatisés.

Commençons notre parcours de test en examinant les tests unitaires. La logique de notre application est si simple qu'il n'y a pas grand-chose qui a du sens à tester avec des tests unitaires. Créons un nouveau fichier <i>utils/for_testing.js</i> et écrivons quelques fonctions simples que nous pouvons utiliser pour pratiquer l'écriture de tests :

```js
const reverse = (string) => {
  return string
    .split('')
    .reverse()
    .join('')
}

const average = (array) => {
  const reducer = (sum, item) => {
    return sum + item
  }

  return array.reduce(reducer, 0) / array.length
}

module.exports = {
  reverse,
  average,
}
```

> La fonction _average_ utilise la méthode [reduce](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce) de l'array. Si cette méthode ne vous est pas encore familière, c'est le moment idéal pour regarder les trois premières vidéos de la série [Functional Javascript](https://www.youtube.com/watch?v=BMUiFMZr7vk&list=PL0zVEGEvSaeEd9hlmCXrk5yUyqUag-n84) sur YouTube.

Il existe de nombreuses bibliothèques de test différentes ou des <i>test runners</i> disponibles pour JavaScript. Dans ce cours, nous utiliserons une bibliothèque de test développée et utilisée en interne par Facebook appelée [jest](https://jestjs.io/), qui ressemble à l'ancien roi des bibliothèques de test JavaScript [Mocha](https://mochajs.org/).

Jest est un choix naturel pour ce cours, car il fonctionne bien pour tester les backends, et il brille lorsqu'il s'agit de tester des applications React.

> <i>**Utilisateurs Windows:**</i> Jest peut ne pas fonctionner si le chemin du répertoire du projet contient un répertoire ayant des espaces dans son nom.

Puisque les tests ne sont exécutés que pendant le développement de notre application, nous installerons <i>jest</i> comme une dépendance de développement avec la commande:

```bash
npm install --save-dev jest
```

Définissons le <i>script npm _test_</i> pour exécuter les tests avec Jest et pour rapporter sur l'exécution des tests avec le style <i>verbose</i>:

```bash
{
  //...
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js",
    "build:ui": "rm -rf build && cd ../frontend/ && npm run build && cp -r build ../backend",
    "deploy": "fly deploy",
    "deploy:full": "npm run build:ui && npm run deploy",
    "logs:prod": "fly logs",
    "lint": "eslint .",
    "test": "jest --verbose" // highlight-line
  },
  //...
}
```

Jest nécessite de spécifier que l'environnement d'exécution est Node. Cela peut être fait en ajoutant ce qui suit à la fin de <i>package.json</i>:

```js
{
 //...
 "jest": {
   "testEnvironment": "node"
 }
}
```

Créons un répertoire séparé pour nos tests appelé <i>tests</i> et créons un nouveau fichier appelé <i>reverse.test.js</i> avec le contenu suivant:

```js
const reverse = require('../utils/for_testing').reverse

test('reverse of a', () => {
  const result = reverse('a')

  expect(result).toBe('a')
})

test('reverse of react', () => {
  const result = reverse('react')

  expect(result).toBe('tcaer')
})

test('reverse of releveler', () => {
  const result = reverse('releveler')

  expect(result).toBe('releveler')
})
```

La configuration ESLint que nous avons ajoutée au projet dans la partie précédente se plaint des commandes _test_ et _expect_ dans notre fichier de test puisque la configuration ne permet pas les <i>globals</i>. Débarrassons-nous de ces plaintes en ajoutant <i>"jest": true</i> à la propriété <i>env</i> dans le fichier <i>.eslintrc.js</i>.

```js
module.exports = {
  'env': {
    'commonjs': true,
    'es2021': true,
    'node': true,
    'jest': true, // highlight-line
  },
  // ...
}
```
Dans la première ligne, le fichier de test importe la fonction à tester et l'assigne à une variable appelée _reverse_:

```js
const reverse = require('../utils/for_testing').reverse
```

Les cas de test individuels sont définis avec la fonction _test_. Le premier paramètre de la fonction est la description du test sous forme de chaîne de caractères. Le deuxième paramètre est une <i>fonction</i> qui définit la fonctionnalité du cas de test. La fonctionnalité du deuxième cas de test ressemble à ceci:

```js
() => {
  const result = reverse('react')

  expect(result).toBe('tcaer')
}
```

Tout d'abord, nous exécutons le code à tester, ce qui signifie que nous générons une inversion pour la chaîne de caractères <i>react</i>. Ensuite, nous vérifions les résultats avec la fonction [expect](https://jestjs.io/docs/expect#expectvalue). Expect encapsule la valeur résultante dans un objet qui offre une collection de fonctions de <i>comparaison</i> (matcher), qui peuvent être utilisées pour vérifier la correction du résultat. Étant donné que dans ce cas de test, nous comparons deux chaînes, nous pouvons utiliser le comparateur [toBe](https://jestjs.io/docs/expect#tobevalue).

Comme prévu, tous les tests passent :

![Sortie du terminal de npm test](../../images/4/1x.png)

Par défaut, Jest s'attend à ce que les noms des fichiers de test contiennent <i>.test</i>. Dans ce cours, nous suivrons la convention de nommer nos fichiers de test avec l'extension <i>.test.js</i>.

Jest offre d'excellents messages d'erreur. Intentionnellement, échouons le test pour illustrer:

```js
test('palindrome of react', () => {
  const result = reverse('react')

  expect(result).toBe('tkaer')
})
```

Exécuter les tests ci-dessus génère le message d'erreur suivant:

![La sortie du terminal montre un échec de npm test](../../images/4/2x.png)

Ajoutons quelques tests pour la fonction _average_ dans un nouveau fichier <i>tests/average.test.js</i>.

```js
const average = require('../utils/for_testing').average

describe('average', () => {
  test('of one value is the value itself', () => {
    expect(average([1])).toBe(1)
  })

  test('of many is calculated right', () => {
    expect(average([1, 2, 3, 4, 5, 6])).toBe(3.5)
  })

  test('of empty array is zero', () => {
    expect(average([])).toBe(0)
  })
})
```

Le test révèle que la fonction ne fonctionne pas correctement avec un tableau vide (cela est dû au fait qu'en JavaScript, diviser par zéro donne <i>NaN</i>):

![Sortie du terminal montrant que le tableau vide échoue avec jest](../../images/4/3.png)

Corriger la fonction est assez simple:

```js
const average = array => {
  const reducer = (sum, item) => {
    return sum + item
  }

  return array.length === 0
    ? 0
    : array.reduce(reducer, 0) / array.length
}
```

Si la longueur du tableau est de 0, nous renvoyons 0, et dans tous les autres cas, nous utilisons la méthode _reduce_ pour calculer la moyenne.

Il y a quelques choses à noter à propos des tests que nous venons d'écrire. Nous avons défini un bloc <i>describe</i> autour des tests qui ont été nommés _average_:

```js
describe('average', () => {
  // tests
})
```

Les blocs <i>describe</i> peuvent être utilisés pour regrouper des tests en collections logiques. La sortie des tests de Jest utilise également le nom du bloc <i>describe</i> :

![Capture d'écran de npm test montrant les blocs describe](../../images/4/4x.png)

Comme nous le verrons plus tard, les blocs <i>describe</i> sont nécessaires lorsque nous voulons exécuter des opérations de configuration ou de nettoyage partagées pour un groupe de tests.

Une autre chose à noter est que nous avons écrit les tests de manière assez compacte, sans attribuer la sortie de la fonction testée à une variable:

```js
test('of empty array is zero', () => {
  expect(average([])).toBe(0)
})
```

</div>

<div class="tasks">

### Exercices 4.3 à 4.7.

Dans cette série d'exercices, nous allons créer une collection de fonctions d'aide destinées à faciliter la gestion de la liste de blogs. Créez ces fonctions dans un fichier appelé <i>utils/list_helper.js</i> et écrivez les tests correspondants dans un fichier de test approprié sous le répertoire <i>tests</i>.

### 4.3 : fonctions d'aide et tests unitaires, étape 1

Tout d'abord, définissez une fonction _dummy_ qui reçoit un tableau de billets de blog en tant que paramètre et renvoie toujours la valeur 1. Le contenu du fichier <i>list_helper.js</i> à ce stade devrait être le suivant :

```js
const dummy = (blogs) => {
  // ...
}

module.exports = {
  dummy
}
```

Vérifiez que votre configuration de test fonctionne avec le test suivant:

```js
const listHelper = require('../utils/list_helper')

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  expect(result).toBe(1)
})
```

### 4.4 : fonctions d'aide et tests unitaires, étape 2

Définissez une nouvelle fonction _totalLikes_ qui reçoit une liste de billets de blog en tant que paramètre. La fonction renvoie la somme totale des <i>likes</i> dans tous les billets de blog.

Écrivez des tests appropriés pour la fonction. Il est recommandé de mettre les tests à l'intérieur d'un bloc <i>describe</i> pour que le rapport de test soit bien regroupé :

![npm test passing for list_helper_test](../../images/4/5.png)

La définition des entrées de test pour la fonction peut être faite de la manière suivante:

```js
describe('total likes', () => {
  const listWithOneBlog = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
      __v: 0
    }
  ]

  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog)
    expect(result).toBe(5)
  })
})
```

Si définir votre propre liste d'entrée de test pour les blogs est trop compliqué, vous pouvez utiliser la liste toute faite disponible [ici](https://raw.githubusercontent.com/fullstack-hy2020/misc/master/blogs_for_test.md).

Vous risquez de rencontrer des problèmes lors de l'écriture des tests. Rappelez-vous des choses que nous avons apprises sur le [débogage](/fr/part3/saving_data_to_mongo_db#debugging-node-applications) dans la partie 3. Vous pouvez afficher des choses dans la console avec console.log même pendant l'exécution des tests. Il est même possible d'utiliser le débogueur pendant l'exécution des tests, vous pouvez trouver des instructions à ce sujet [ici](https://jestjs.io/docs/en/troubleshooting).

**NB** : si un test échoue, il est recommandé de ne lancer que ce test pendant que vous corrigez le problème. Vous pouvez exécuter un seul test avec la méthode [only](https://jestjs.io/docs/api#testonlyname-fn-timeout).

Une autre façon d'exécuter un seul test (ou un bloc de description) consiste à spécifier le nom du test à exécuter avec le drapeau [-t](https://jestjs.io/docs/en/cli.html):

```js
npm test -- -t 'when list has only one blog, equals the likes of that'
```

#### 4.5*: Fonctions d'aide et tests unitaires, étape 3

Définissez une nouvelle fonction _favoriteBlog_ qui reçoit en paramètre une liste de blogs. La fonction détermine quel blog a le plus de likes. S'il y a plusieurs favoris principaux, il suffit d'en retourner un.

La valeur renvoyée par la fonction pourrait être dans le format suivant :

```js
{
  title: "Canonical string reduction",
  author: "Edsger W. Dijkstra",
  likes: 12
}
```

**NB** lorsque vous comparez des objets, la méthode [toEqual](https://jestjs.io/docs/en/expect#toequalvalue) est probablement ce que vous voulez utiliser, car la méthode [toBe](https://jestjs.io/docs/en/expect#tobevalue) tente de vérifier que les deux valeurs sont la même valeur, et non seulement qu'elles contiennent les mêmes propriétés.

Écrivez les tests pour cet exercice à l'intérieur d'un nouveau bloc <i>describe</i>. Faites de même pour les exercices suivants.

#### 4.6*: Fonctions d'aide et tests unitaires, étape 4

Cet exercice et le suivant sont un peu plus difficiles. Terminer ces deux exercices n'est pas nécessaire pour avancer dans le matériel du cours, il peut donc être judicieux de revenir à ceux-ci une fois que vous avez terminé de parcourir l'intégralité du matériel de cette partie.

Vous pouvez terminer cet exercice sans utiliser de bibliothèques supplémentaires. Cependant, cet exercice est une excellente occasion d'apprendre à utiliser la bibliothèque [Lodash](https://lodash.com/).

Définissez une fonction appelée _mostBlogs_ qui reçoit un tableau de blogs en tant que paramètre. La fonction renvoie l'<i>auteur</i> qui a le plus grand nombre de blogs. La valeur renvoyée contient également le nombre de blogs que l'auteur principal possède:

```js
{
  author: "Robert C. Martin",
  blogs: 3
}
```

S'il y a plusieurs blogueurs en tête, il suffit d'en renvoyer un.

#### 4.7*: Fonctions d'aide et tests unitaires, étape 5

Définissez une fonction appelée _mostLikes_ qui reçoit un tableau de blogs en tant que paramètre. La fonction renvoie l'auteur dont les articles de blog ont reçu le plus grand nombre de "j'aime". La valeur renvoyée contient également le nombre total de "j'aime" que l'auteur a reçus :

```js
{
  author: "Edsger W. Dijkstra",
  likes: 17
}
```

S'il y a plusieurs blogueurs en tête, il suffit d'en montrer un quelconque.

</div>
