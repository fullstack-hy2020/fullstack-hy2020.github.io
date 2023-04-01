---
mainImage: ../../../images/part-4.svg
part: 4
letter: a
lang: fr
---

<div class="content">

Poursuivons notre travail sur le backend de l'application de notes que nous avons commencé dans la [partie 3](/fr/part3).

### Structure du projet
Avant de passer au sujet des tests, nous allons modifier la structure de notre projet pour respecter les meilleures pratiques de Node.js.

Après avoir apporté les modifications à la structure de répertoire de notre projet, nous obtenons la structure suivante :

```bash
├── index.js
├── app.js
├── build
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

Jusqu'à présent, nous avons utilisé <i>console.log</i> et <i>console.error</i> pour afficher différentes informations du code.
Cependant, ce n'est pas une très bonne façon de faire les choses.
Séparons toute l'impression dans la console de son propre module <i>utils/logger.js</i> :

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
Le journalisateur dispose de deux fonctions, __info__ pour afficher les messages de journalisation normaux, et __error__ pour tous les messages d'erreur.

Extraire la journalisation dans son propre module est une bonne idée à plus d'un titre. Si nous voulions commencer à écrire des journaux dans un fichier ou les envoyer à un service de journalisation externe comme [graylog] (https://www.graylog.org/) ou [papertrail] (https://papertrailapp.com), nous n'aurions à effectuer des modifications qu'à un seul endroit.

Le contenu du fichier <i>index.js</i> utilisé pour démarrer l'application est simplifié comme suit :

```js
const app = require('./app') // l'application Express
const config = require('./utils/config')
const logger = require('./utils/logger')

app.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`)
})
```

Le fichier <i>index.js</i> n'importe que l'application réelle depuis le fichier <i>app.js</i>, puis démarre l'application. La fonction info du module journalisateur est utilisée pour l'affichage console indiquant que l'application est en cours d'exécution.

Maintenant, l'application Express et le code qui s'occupe du serveur web sont séparés l'un de l'autre selon les [meilleures](https://dev.to/nermineslimane/always-separate-app-and-server-files--1nc7) [pratiques](https://nodejsbestpractices.com/sections/projectstructre/separateexpress). L'un des avantages de cette méthode est que l'application peut désormais être testée au niveau des appels API HTTP sans effectuer réellement des appels via HTTP sur le réseau, ce qui rend l'exécution des tests plus rapide.

La gestion des variables d'environnement est extraite dans un fichier séparé <i>utils/config.js</i> :

```js
require('dotenv').config()

const PORT = process.env.PORT
const MONGODB_URI = process.env.MONGODB_URI

module.exports = {
  MONGODB_URI,
  PORT
}

```

Les autres parties de l'application peuvent accéder aux variables d'environnement en important le module de configuration :

```js
const config = require('./utils/config')

logger.info(`Serveur en cours d'exécution sur le port ${config.PORT}`)

```

Les gestionnaires de routes ont également été déplacés dans un module dédié. Les gestionnaires d'événements des routes sont couramment appelés <i>contrôleurs</i>, et c'est pourquoi nous avons créé un nouveau répertoire <i>controllers</i>. Toutes les routes liées aux notes sont désormais dans le module <i>notes.js</i> sous le répertoire <i>controllers</i>.

Le contenu du module <i>notes.js</i> est le suivant :

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
  Note.findByIdAndRemove(request.params.id)
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

Ceci est presque une copie conforme de notre précédent fichier <i>index.js</i>.

Cependant, il y a quelques changements importants. Au tout début du fichier, nous créons un nouvel objet [router](http://expressjs.com/en/api.html#router):

```js
const notesRouter = require('express').Router()

//...

module.exports = notesRouter

```

Le module exporte le router pour qu'il soit disponible pour tous les consommateurs du module.

Toutes les routes sont maintenant définies pour l'objet router, de la même manière que ce que nous avons fait auparavant avec l'objet représentant l'ensemble de l'application.

Il convient de noter que les chemins dans les gestionnaires de routes ont été raccourcis. Dans la version précédente, nous avions :

```js
app.delete('/api/notes/:id', (request, response) => {

```

Et dans la version actuelle, nous avons :

```js
notesRouter.delete('/:id', (request, response) => {

```
Alors qu'est-ce que ces objets router exactement ? Le manuel Express fournit l'explication suivante :

> <i>Un objet router est une instance isolée de middleware et de routes. Vous pouvez le considérer comme une "mini-application", capable uniquement de réaliser des fonctions de middleware et de routage. Chaque application Express a un router d'application intégré.</i>

Le router est en fait un <i>middleware</i>, qui peut être utilisé pour définir des "routes associées" en un seul endroit, qui est généralement placé dans son propre module.

Le fichier <i>app.js</i> qui crée l'application réelle prend le router en compte comme indiqué ci-dessous:

```js
const notesRouter = require('./controllers/notes')
app.use('/api/notes', notesRouter)
```

Le routeur que nous avons défini précédemment est utilisé si l'URL de la requête commence par <i>/api/notes</i>. Pour cette raison, l'objet notesRouter doit seulement définir les parties relatives des routes, c'est-à-dire le chemin vide <i>/</i> ou simplement le paramètre <i>/:id</i>.

Après avoir effectué ces modifications, notre fichier <i>app.js</i> ressemble à ceci:

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
app.use(express.static('build'))
app.use(express.json())
app.use(middleware.requestLogger)

app.use('/api/notes', notesRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app
```

Le fichier utilise différents middlewares, dont l'un est le <i>notesRouter</i> qui est attaché à la route <i>/api/notes</i>.

Notre middleware personnalisé a été déplacé vers un nouveau module <i>utils/middleware.js</i> :

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

La responsabilité d'établir la connexion à la base de données a été confiée au module <i>app.js</i>. Le fichier <i>note.js</i> dans le répertoire <i>models</i> ne définit que le schéma Mongoose pour les notes.

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

En résumé, la structure du répertoire ressemble à ceci après les modifications apportées :

```bash
├── index.js
├── app.js
├── build
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

Pour les applications plus petites, la structure n'a pas une grande importance. Une fois que l'application commence à devenir plus grande, il faut établir une certaine structure et séparer les différentes responsabilités de l'application en modules séparés. Cela facilitera grandement le développement de l'application.

Il n'y a pas de structure de répertoire stricte ou de convention de nommage de fichiers requise pour les applications Express. En revanche, Ruby on Rails nécessite une structure spécifique. Notre structure actuelle suit simplement certaines des meilleures pratiques que vous pouvez trouver sur Internet.

Vous pouvez trouver le code de notre application actuelle dans son intégralité dans la branche <i>part4-1</i> de ce [dépôt GitHub](https://github.com/fullstack-hy2020/part3-notes-backend/tree/part4-1).

Si vous clonez le projet pour vous-même, exécutez la commande  _npm install_ avant de lancer l'application avec  _npm start_.

</div>

### Notes à l'export

