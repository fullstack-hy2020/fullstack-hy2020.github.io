---
mainImage: ../../../images/part-4.svg
part: 4
letter: c
lang: fr
---

<div class="content">

Nous souhaitons ajouter l'authentification et l'autorisation des utilisateurs à notre application. Les utilisateurs doivent être stockés dans la base de données et chaque note doit être liée à l'utilisateur qui l'a créée. La suppression et l'édition d'une note ne devraient être autorisées que pour l'utilisateur qui l'a créée.

Commençons par ajouter des informations sur les utilisateurs dans la base de données. Il existe une relation un-à-plusieurs entre l'utilisateur (<i>User</i>) et les notes (<i>Note</i>):

![diagramme liant user et notes](https://yuml.me/a187045b.png)

Si nous travaillions avec une base de données relationnelle, la mise en oeuvre serait simple. Les deux ressources auraient leurs propres tables de base de données séparées, et l'identifiant de l'utilisateur qui a créé une note serait stocké dans la table des notes comme une clé étrangère.

Lorsqu'on travaille avec des bases de données de documents, la situation est un peu différente, car il existe de nombreuses manières différentes de modéliser la situation.

La solution existante enregistre chaque note dans la <i>collection de notes</i> dans la base de données. Si nous ne voulons pas modifier cette collection existante, alors le choix naturel est de sauvegarder les utilisateurs dans leur propre collection, <i>users</i> par exemple.

Comme avec toutes les bases de données de documents, nous pouvons utiliser des identifiants d'objets dans Mongo pour référencer des documents dans d'autres collections. Cela est similaire à l'utilisation de clés étrangères dans les bases de données relationnelles.

Traditionnellement, les bases de données de documents comme Mongo ne prennent pas en charge les <i>requêtes jointes</i> disponibles dans les bases de données relationnelles, utilisées pour agréger des données de plusieurs tables. Cependant, à partir de la version 3.2, Mongo a pris en [charge les requêtes d'agrégation](https://docs.mongodb.com/manual/reference/operator/aggregation/lookup/) de recherche. Nous n'allons pas examiner cette fonctionnalité dans ce cours.

Si nous avons besoin d'une fonctionnalité similaire aux requêtes jointes, nous l'implémenterons dans notre code d'application en effectuant plusieurs requêtes. Dans certaines situations, Mongoose peut s'occuper de joindre et d'agréger des données, ce qui donne l'apparence d'une requête jointe. Cependant, même dans ces situations, Mongoose effectue plusieurs requêtes à la base de données en arrière-plan.

### Références entre collections

Si nous utilisions une base de données relationnelle, la note contiendrait une <i>clé de référence</i> à l'utilisateur qui l'a créée. Dans les bases de données de documents, nous pouvons faire la même chose.

Supposons que la collection <i>users</i> contienne deux utilisateurs:

```js
[
  {
    username: 'mluukkai',
    _id: 123456,
  },
  {
    username: 'hellas',
    _id: 141414,
  },
]
```

La collection <i>notes</i> contient trois notes qui ont toutes un champ <i>user</i> qui fait référence à un utilisateur dans la collection <i>users</i>:

```js
[
  {
    content: 'HTML is easy',
    important: false,
    _id: 221212,
    user: 123456,
  },
  {
    content: 'The most important operations of HTTP protocol are GET and POST',
    important: true,
    _id: 221255,
    user: 123456,
  },
  {
    content: 'A proper dinosaur codes with Java',
    important: false,
    _id: 221244,
    user: 141414,
  },
]
```

Les bases de données de documents n'exigent pas que la clé étrangère soit stockée dans les ressources de note, elle pourrait <i>aussi</i> être stockée dans la collection des utilisateurs, ou même dans les deux:

```js
[
  {
    username: 'mluukkai',
    _id: 123456,
    notes: [221212, 221255],
  },
  {
    username: 'hellas',
    _id: 141414,
    notes: [221244],
  },
]
```

Puisque les utilisateurs peuvent avoir de nombreuses notes, les identifiants associés sont stockés dans un tableau dans le champ <i>notes</i>.

Les bases de données de documents offrent également une manière radicalement différente d'organiser les données : Dans certaines situations, il pourrait être avantageux d'imbriquer le tableau entier de notes comme une partie des documents dans la collection des utilisateurs:

```js
[
  {
    username: 'mluukkai',
    _id: 123456,
    notes: [
      {
        content: 'HTML is easy',
        important: false,
      },
      {
        content: 'The most important operations of HTTP protocol are GET and POST',
        important: true,
      },
    ],
  },
  {
    username: 'hellas',
    _id: 141414,
    notes: [
      {
        content:
          'A proper dinosaur codes with Java',
        important: false,
      },
    ],
  },
]
```

Dans ce schéma, les notes seraient étroitement imbriquées sous les utilisateurs et la base de données ne générerait pas d'identifiants pour elles.

La structure et le schéma de la base de données ne sont pas aussi évidents qu'avec les bases de données relationnelles. Le schéma choisi doit soutenir au mieux les cas d'utilisation de l'application. Ce n'est pas une décision de conception simple à prendre, car tous les cas d'utilisation des applications ne sont pas connus lorsque la décision de conception est prise.

Paradoxalement, les bases de données sans schéma comme Mongo exigent des développeurs qu'ils prennent des décisions de conception bien plus radicales sur l'organisation des données au début du projet que les bases de données relationnelles avec des schémas. En moyenne, les bases de données relationnelles offrent une manière plus ou moins adaptée d'organiser les données pour de nombreuses applications.

### Schéma Mongoose pour les utilisateurs

Dans ce cas, nous décidons de stocker les identifiants des notes créées par l'utilisateur dans le document utilisateur. Définissons le modèle pour représenter un utilisateur dans le fichier <i>models/user.js</i>:

```js
const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  username: String,
  name: String,
  passwordHash: String,
  notes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Note'
    }
  ],
})

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    // the passwordHash should not be revealed
    delete returnedObject.passwordHash
  }
})

const User = mongoose.model('User', userSchema)

module.exports = User
```

Les identifiants des notes sont stockés dans le document utilisateur sous forme de tableau d'identifiants Mongo. La définition est la suivante:

```js
{
  type: mongoose.Schema.Types.ObjectId,
  ref: 'Note'
}
```

Le type du champ est <i>ObjectId</i> qui fait référence à des documents de type <i>note</i>. Mongo ne sait pas intrinsèquement qu'il s'agit d'un champ qui fait référence à des notes, la syntaxe est purement liée à et définie par Mongoose.

Étendons le schéma de la note définie dans le fichier <i>models/note.js</i> pour que la note contienne des informations sur l'utilisateur qui l'a créée:

```js
const noteSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
    minlength: 5
  },
  important: Boolean,
  // highlight-start
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
  // highlight-end
})
```

En net contraste avec les conventions des bases de données relationnelles, <i>les références sont maintenant stockées dans les deux documents</i> : la note fait référence à l'utilisateur qui l'a créée, et l'utilisateur possède un tableau de références à toutes les notes qu'il a créées.

### Création d'utilisateurs

Implémentons une route pour créer de nouveaux utilisateurs. Les utilisateurs ont un <i>nom d'utilisateur</i> unique, un <i>nom</i> et quelque chose appelé <i>passwordHash</i>. Le hachage de mot de passe est le résultat d'une [fonction de hachage à sens unique](https://en.wikipedia.org/wiki/Cryptographic_hash_function) appliquée au mot de passe de l'utilisateur. Il n'est jamais judicieux de stocker des mots de passe en texte clair non crypté dans la base de données!

Installons le paquet [bcrypt](https://github.com/kelektiv/node.bcrypt.js) pour générer les hachages de mot de passe:

```bash
npm install bcrypt
```

La création de nouveaux utilisateurs se fait conformément aux conventions REST discutées dans la [partie 3](/en/part3/node_js_and_express#rest), en effectuant une requête HTTP POST vers le chemin <i>users</i>.

Définissons un <i>routeur</i> séparé pour gérer les utilisateurs dans un nouveau fichier <i>controllers/users.js</i>. Prenons ce routeur en compte dans notre application dans le fichier <i>app.js</i>, de sorte qu'il gère les requêtes faites à l'URL <i>/api/users</i>:

```js
const usersRouter = require('./controllers/users')

// ...

app.use('/api/users', usersRouter)
```

Le contenu du fichier, <i>controllers/users.js</i>, qui définit le routeur est le suivant:

```js
const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash,
  })

  const savedUser = await user.save()

  response.status(201).json(savedUser)
})

module.exports = usersRouter
```

Le mot de passe envoyé dans la requête n'est <i>pas</i> stocké dans la base de données. Nous stockons le <i>hash</i> du mot de passe qui est généré avec la fonction _bcrypt.hash_.

Les principes fondamentaux de [stockage des mots de passe](https://codahale.com/how-to-safely-store-a-password/) sont hors du champ d'application de ce matériel de cours. Nous n'aborderons pas ce que signifie le nombre magique 10 assigné à la variable [saltRounds](https://github.com/kelektiv/node.bcrypt.js/#a-note-on-rounds), mais vous pouvez en lire plus à ce sujet dans le matériel lié.

Notre code actuel ne contient aucune gestion des erreurs ou validation des entrées pour vérifier que le nom d'utilisateur et le mot de passe sont dans le format souhaité.

La nouvelle fonctionnalité peut et doit initialement être testée manuellement avec un outil comme Postman. Cependant, tester les choses manuellement deviendra rapidement trop fastidieux, en particulier une fois que nous aurons mis en oeuvre une fonctionnalité qui impose l'unicité des noms d'utilisateur.

Il demande beaucoup moins d'effort d'écrire des tests automatisés, et cela rendra le développement de notre application beaucoup plus facile.

Nos tests initiaux pourraient ressembler à ceci:

```js
const bcrypt = require('bcrypt')
const User = require('../models/user')

//...

describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })
})
```

Les tests utilisent la fonction d'aide <i>usersInDb()</i> que nous avons implémentée dans le fichier <i>tests/test_helper.js</i>. Cette fonction est utilisée pour nous aider à vérifier l'état de la base de données après la création d'un utilisateur:

```js
const User = require('../models/user')

// ...

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

module.exports = {
  initialNotes,
  nonExistingId,
  notesInDb,
  usersInDb,
}
```

Le bloc <i>beforeEach</i> ajoute un utilisateur avec le nom d'utilisateur <i>root</i> à la base de données. Nous pouvons écrire un nouveau test qui vérifie qu'un nouvel utilisateur avec le même nom d'utilisateur ne peut pas être créé:

```js
describe('when there is initially one user in db', () => {
  // ...

  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('expected `username` to be unique')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toEqual(usersAtStart)
  })
})
```

Le cas de test ne passera évidemment pas à ce stade. Nous pratiquons essentiellement le [développement piloté par les tests (TDD)](https://en.wikipedia.org/wiki/Test-driven_development), où les tests pour une nouvelle fonctionnalité sont écrits avant que la fonctionnalité soit implémentée.

Mongoose n'a pas de validateur intégré pour vérifier l'unicité d'un champ. Heureusement, il existe une solution toute faite pour cela, la bibliothèque [mongoose-unique-validator](https://www.npmjs.com/package/mongoose-unique-validator). Installons cette bibliothèque:

```bash
npm install mongoose-unique-validator
```

et étendons le code en suivant la documentation de la bibliothèque dans <i>models/user.js</i>:

```js
const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator') // highlight-line

const userSchema = mongoose.Schema({
  // highlight-start
  username: {
    type: String,
    required: true,
    unique: true
  },
  // highlight-end
  name: String,
  passwordHash: String,
  notes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Note'
    }
  ],
})

userSchema.plugin(uniqueValidator) // highlight-line

// ...
```


Nous pourrions également implémenter d'autres validations dans la création de l'utilisateur. Nous pourrions vérifier que le nom d'utilisateur est assez long, que le nom d'utilisateur ne se compose que de caractères autorisés, ou que le mot de passe est suffisamment fort. L'implémentation de ces fonctionnalités est laissée comme un exercice optionnel.

Avant de poursuivre, ajoutons une première implémentation d'un gestionnaire de route qui retourne tous les utilisateurs dans la base de données:

```js
usersRouter.get('/', async (request, response) => {
  const users = await User.find({})
  response.json(users)
})
```

Pour créer de nouveaux utilisateurs dans un environnement de production ou de développement, vous pouvez envoyer une requête POST à ```/api/users/``` via Postman ou un client REST dans le format suivant:

```js
{
    "username": "root",
    "name": "Superuser",
    "password": "salainen"
}

```

La liste ressemble à ceci:

![navigateur api/users montre des données JSON avec un tableau de notes](../../images/4/9.png)

Vous pouvez trouver le code de notre application actuelle dans son intégralité dans la branche <i>part4-7</i> de [ce dépôt GitHub](https://github.com/fullstack-hy2020/part3-notes-backend/tree/part4-7).

### Création d'une nouvelle note

Le code pour créer une nouvelle note doit être mis à jour afin que la note soit attribuée à l'utilisateur qui l'a créée.

Étendons notre implémentation actuelle dans <i>controllers/notes.js</i> pour que les informations concernant l'utilisateur qui a créé une note soient envoyées dans le champ <i>userId</i> du corps de la requête:

```js
const User = require('../models/user') //highlight-line

//...

notesRouter.post('/', async (request, response) => {
  const body = request.body

  const user = await User.findById(body.userId) //highlight-line

  const note = new Note({
    content: body.content,
    important: body.important === undefined ? false : body.important,
    user: user.id //highlight-line
  })

  const savedNote = await note.save()
  user.notes = user.notes.concat(savedNote._id) //highlight-line
  await user.save()  //highlight-line
  
  response.status(201).json(savedNote)
})
```

Le schéma de la note devra également changer comme suit dans notre fichier models/note.js:

```js
const noteSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
    minlength: 5
  },
  important: Boolean,
  // highlight-start
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
  //highlight-end
})
```

Il convient de noter que l'objet <i>user</i> change également. L'<i>id</i> de la note est stocké dans le champ <i>notes</i> de l'objet <i>user</i>:

```js
const user = await User.findById(body.userId)

// ...

user.notes = user.notes.concat(savedNote._id)
await user.save()
```

Essayons de créer une nouvelle note:

![Postman créant une nouvelle note](../../images/4/10e.png)

L'opération semble fonctionner. Ajoutons encore une note puis visitons la route pour récupérer tous les utilisateurs:

![api/users retourne du JSON avec les utilisateurs et leur tableau de notes](../../images/4/11e.png)

Nous pouvons voir que l'utilisateur a deux notes.

De même, les identifiants des utilisateurs qui ont créé les notes peuvent être vus lorsque nous visitons la route pour récupérer toutes les notes :

![api/notes montre les identifiants des numéros en JSON](../../images/4/12e.png)

### Populate

Nous aimerions que notre API fonctionne de telle manière que lorsqu'une requête HTTP GET est faite à la route <i>/api/users</i>, les objets utilisateur contiennent également le contenu des notes de l'utilisateur et pas seulement leur id. Dans une base de données relationnelle, cette fonctionnalité serait mise en oeuvre avec une <i>requête jointe</i>.

Comme mentionné précédemment, les bases de données de documents ne prennent pas correctement en charge les requêtes jointes entre collections, mais la bibliothèque Mongoose peut faire certaines de ces jointures pour nous. Mongoose réalise la jointure en effectuant plusieurs requêtes, ce qui est différent des requêtes jointes dans les bases de données relationnelles qui sont <i>transactionnelles</i>, ce qui signifie que l'état de la base de données ne change pas pendant le temps de la requête. Avec les requêtes jointes dans Mongoose, rien ne peut garantir que l'état entre les collections jointes est cohérent, ce qui signifie que si nous faisons une requête qui joint les collections utilisateur et notes, l'état des collections peut changer pendant la requête.

La jointure Mongoose est réalisée avec la méthode [populate](http://mongoosejs.com/docs/populate.html). Mettons à jour en premier lieu la route qui retourne tous les utilisateurs dans le fichier <i>controllers/users.js</i>:

```js
usersRouter.get('/', async (request, response) => {
  const users = await User  // highlight-line
    .find({}).populate('notes') // highlight-line

  response.json(users)
})
```

La méthode [populate](http://mongoosejs.com/docs/populate.html) est enchaînée après la méthode <i>find</i> qui effectue la requête initiale. Le paramètre donné à la méthode populate définit que les <i>ids</i> référençant les objets <i>note</i> dans le champ <i>notes</i> du document <i>user</i> seront remplacés par les documents <i>note</i> référencés.

Le résultat est presque exactement ce que nous voulions:

![Données JSON montrant des notes et des données d'utilisateurs remplies avec répétition](../../images/4/13new.png)

Nous pouvons utiliser le paramètre populate pour choisir les champs que nous voulons inclure des documents. En plus du champ <i>id</i>, nous sommes maintenant intéressés uniquement par <i>content</i> et <i>important</i>.

La sélection des champs se fait avec la [syntaxe de Mongo](https://docs.mongodb.com/manual/tutorial/project-fields-from-query-results/#return-the-specified-fields-and-the-id-field-only):

```js
usersRouter.get('/', async (request, response) => {
  const users = await User
    .find({}).populate('notes', { content: 1, important: 1 })

  response.json(users)
})
```

Le résultat est maintenant exactement comme nous le voulons:

![données combinées montrant aucune répétition](../../images/4/14new.png)

Ajoutons également une population appropriée des informations utilisateur aux notes dans le fichier <i>controllers/notes.js</i>:

```js
notesRouter.get('/', async (request, response) => {
  const notes = await Note
    .find({}).populate('user', { username: 1, name: 1 })

  response.json(notes)
})
```

Maintenant, les informations de l'utilisateur sont ajoutées au champ <i>user</i> des objets note.

![le JSON des notes contient maintenant aussi les informations de l'utilisateur](../../images/4/15new.png)

Il est important de comprendre que la base de données ne sait pas que les identifiants stockés dans le champ <i>user</i> de la collection de notes référencent des documents dans la collection utilisateur.

La fonctionnalité de la méthode <i>populate</i> de Mongoose repose sur le fait que nous avons défini des "types" pour les références dans le schéma Mongoose avec l'option <i>ref</i>:

```js
const noteSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
    minlength: 5
  },
  important: Boolean,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
})
```

Vous pouvez trouver le code de notre application actuelle dans son intégralité dans la branche <i>part4-8</i> de [ce dépôt GitHub](https://github.com/fullstack-hy2020/part3-notes-backend/tree/part4-8).

REMARQUE : À ce stade, premièrement, certains tests échoueront. Nous laisserons la correction des tests à un exercice non obligatoire. Deuxièmement, dans l'application de notes déployée, la fonctionnalité de création d'une note cessera de fonctionner car l'utilisateur n'est pas encore lié à l'interface utilisateur.

</div>