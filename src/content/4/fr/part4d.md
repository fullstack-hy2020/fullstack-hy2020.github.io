---
mainImage: ../../../images/part-4.svg
part: 4
letter: d
lang: fr
---

<div class="content">

Les utilisateurs doivent pouvoir se connecter à notre application, et lorsque l'utilisateur est connecté, ses informations doivent automatiquement être attachées à toutes les nouvelles notes qu'ils créent.

Nous allons maintenant implémenter le support de [l'authentification basée sur des jetons](https://www.digitalocean.com/community/tutorials/the-ins-and-outs-of-token-based-authentication#how-token-based-works) dans le backend.

Les principes de l'authentification basée sur des jetons sont représentés dans le diagramme de séquence suivant :

![diagramme de séquence de l'authentification basée sur des jetons](../../images/4/16new.png)

- L'utilisateur commence par se connecter à l'aide d'un formulaire de connexion implémenté avec React
    - Nous ajouterons le formulaire de connexion à l'interface utilisateur dans la [partie 5](/fr/part5)
- Cela amène le code React à envoyer le nom d'utilisateur et le mot de passe à l'adresse du serveur <i>/api/login</i> sous forme de requête HTTP POST.
- Si le nom d'utilisateur et le mot de passe sont corrects, le serveur génère un <i>jeton</i> qui identifie d'une certaine manière l'utilisateur connecté.
    - Le jeton est signé numériquement, le rendant impossible à falsifier (par des moyens cryptographiques)
- Le backend répond avec un code d'état indiquant que l'opération a réussi et retourne le jeton avec la réponse.
- Le navigateur enregistre le jeton, par exemple dans l'état d'une application React.
- Lorsque l'utilisateur crée une nouvelle note (ou effectue une autre opération nécessitant une identification), le code React envoie le jeton au serveur avec la requête.
- Le serveur utilise le jeton pour identifier l'utilisateur

Implémentons d'abord la fonctionnalité de connexion. Installez la bibliothèque [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken), qui nous permet de générer des [jetons web JSON](https://jwt.io/).

```bash
npm install jsonwebtoken
```

Le code pour la fonctionnalité de connexion est placé dans le fichier <i>controllers/login.js</i>.

```js
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/user')

loginRouter.post('/', async (request, response) => {
  const { username, password } = request.body

  const user = await User.findOne({ username })
  const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(password, user.passwordHash)

  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: 'invalid username or password'
    })
  }

  const userForToken = {
    username: user.username,
    id: user._id,
  }

  const token = jwt.sign(userForToken, process.env.SECRET)

  response
    .status(200)
    .send({ token, username: user.username, name: user.name })
})

module.exports = loginRouter
```

Le code commence par rechercher l'utilisateur dans la base de données en utilisant le <i>nom d'utilisateur</i> joint à la requête.

```js
const user = await User.findOne({ username })
```

Ensuite, il vérifie le <i>mot de passe</i>, également joint à la requête.

```js
const passwordCorrect = user === null
  ? false
  : await bcrypt.compare(password, user.passwordHash)
```

Comme les mots de passe eux-mêmes ne sont pas enregistrés dans la base de données, mais plutôt des <i>hashes</i> calculés à partir des mots de passe, la méthode _bcrypt.compare_ est utilisée pour vérifier si le mot de passe est correct:

```js
await bcrypt.compare(password, user.passwordHash)
```

Si l'utilisateur n'est pas trouvé ou si le mot de passe est incorrect, la requête reçoit une réponse avec le code d'état [401 non autorisé](https://www.rfc-editor.org/rfc/rfc9110.html#name-401-unauthorized). La raison de l'échec est expliquée dans le corps de la réponse.

```js
if (!(user && passwordCorrect)) {
  return response.status(401).json({
    error: 'invalid username or password'
  })
}
```

Si le mot de passe est correct, un jeton est créé avec la méthode _jwt.sign_. Le jeton contient le nom d'utilisateur et l'identifiant de l'utilisateur sous une forme numériquement signée.

```js
const userForToken = {
  username: user.username,
  id: user._id,
}

const token = jwt.sign(userForToken, process.env.SECRET)
```

Le jeton a été signé numériquement en utilisant une chaîne de la variable d'environnement <i>SECRET</i> comme <i>secret</i>.
La signature numérique garantit que seules les parties qui connaissent le secret peuvent générer un jeton valide.
La valeur de la variable d'environnement doit être définie dans le fichier <i>.env</i>.

Une requête réussie reçoit une réponse avec le code d'état <i>200 OK</i>. Le jeton généré et le nom d'utilisateur de l'utilisateur sont renvoyés dans le corps de la réponse.

```js
response
  .status(200)
  .send({ token, username: user.username, name: user.name })
```

Il ne reste plus qu'à ajouter le code pour la connexion à l'application en ajoutant le nouveau routeur à <i>app.js</i>.

```js
const loginRouter = require('./controllers/login')

//...

app.use('/api/login', loginRouter)
```

Essayons de nous connecter en utilisant le client REST de VS Code:

![post de vscode rest avec nom d'utilisateur/mot de passe](../../images/4/17e.png)

Cela ne fonctionne pas. Le message suivant est imprimé dans la console:

```bash
(node:32911) UnhandledPromiseRejectionWarning: Error: secretOrPrivateKey must have a value
    at Object.module.exports [as sign] (/Users/mluukkai/opetus/_2019fullstack-koodit/osa3/notes-backend/node_modules/jsonwebtoken/sign.js:101:20)
    at loginRouter.post (/Users/mluukkai/opetus/_2019fullstack-koodit/osa3/notes-backend/controllers/login.js:26:21)
(node:32911) UnhandledPromiseRejectionWarning: Unhandled promise rejection. This error originated either by throwing inside of an async function without a catch block, or by rejecting a promise which was not handled with .catch(). (rejection id: 2)
```

La commande _jwt.sign(userForToken, process.env.SECRET)_ échoue. Nous avons oublié de définir une valeur pour la variable d'environnement <i>SECRET</i>. Cela peut être n'importe quelle chaîne. Lorsque nous définissons la valeur dans le fichier <i>.env</i> (et redémarrons le serveur), la connexion fonctionne.

Une connexion réussie renvoie les détails de l'utilisateur et le jeton:

![réponse du client rest de VS Code montrant les détails et le jeton](../../images/4/18ea.png)

Un nom d'utilisateur ou un mot de passe incorrect renvoie un message d'erreur et le code d'état approprié:

![réponse du client rest de VS Code pour des détails de connexion incorrects](../../images/4/19ea.png)

### Limiter la création de nouvelles notes aux utilisateurs connectés

Changeons la création de nouvelles notes de manière à ce qu'elle ne soit possible que si la requête post a un jeton valide attaché. La note est ensuite enregistrée dans la liste des notes de l'utilisateur identifié par le jeton.

Il existe plusieurs façons d'envoyer le jeton du navigateur au serveur. Nous utiliserons l'en-tête [Authorization](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Authorization). L'en-tête indique également quel [schéma d'authentification](https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication#Authentication_schemes) est utilisé. Cela peut être nécessaire si le serveur offre plusieurs façons de s'authentifier.
L'identification du schéma indique au serveur comment les informations d'identification jointes doivent être interprétées.

Le schéma <i>Bearer</i> convient à nos besoins.

En pratique, cela signifie que si le jeton est, par exemple, la chaîne <i>eyJhbGciOiJIUzI1NiIsInR5c2VybmFtZSI6Im1sdXVra2FpIiwiaW</i>, l'en-tête Authorization aura la valeur :

<pre>
Bearer eyJhbGciOiJIUzI1NiIsInR5c2VybmFtZSI6Im1sdXVra2FpIiwiaW
</pre>
La création de nouvelles notes changera ainsi (<i>controllers/notes.js</i>):

```js
const jwt = require('jsonwebtoken') //highlight-line

// ...
  //highlight-start
const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '')
  }
  return null
}
  //highlight-end

notesRouter.post('/', async (request, response) => {
  const body = request.body
//highlight-start
  const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }

  const user = await User.findById(decodedToken.id)
//highlight-end

  const note = new Note({
    content: body.content,
    important: body.important === undefined ? false : body.important,
    user: user._id
  })

  const savedNote = await note.save()
  user.notes = user.notes.concat(savedNote._id)
  await user.save()

  response.json(savedNote)
})
```

La fonction d'aide _getTokenFrom_ isole le jeton de l'en-tête <i>authorization</i>. La validité du jeton est vérifiée avec _jwt.verify_. La méthode décode également le jeton ou renvoie l'objet sur lequel le jeton était basé.

```js
const decodedToken = jwt.verify(token, process.env.SECRET)
```

Si le jeton est manquant ou invalide, l'exception <i>JsonWebTokenError</i> est levée. Nous devons étendre le middleware de gestion des erreurs pour prendre en charge ce cas particulier:

```js
const errorHandler = (error, request, response, next) => {
  logger.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  } else if (error.name ===  'JsonWebTokenError') { // highlight-line
    return response.status(401).json({ error: error.message }) // highlight-line
  }

  next(error)
}
```

L'objet décodé du jeton contient les champs <i>username</i> et <i>id</i>, qui indiquent au serveur qui a effectué la requête.

Si l'objet décodé du jeton ne contient pas l'identité de l'utilisateur (si decodedToken.id est indéfini), le code d'état d'erreur [401 non autorisé](https://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html#sec10.4.2) est renvoyé et la raison de l'échec est expliquée dans le corps de la réponse.

```js
if (!decodedToken.id) {
  return response.status(401).json({
    error: 'token invalid'
  })
}
```

Lorsque l'identité de l'auteur de la requête est résolue, l'exécution continue comme auparavant.

Une nouvelle note peut maintenant être créée en utilisant Postman si l'en-tête <i>authorization</i> se voit attribuer la valeur correcte, la chaîne <i>Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ</i>, où la seconde valeur est le jeton renvoyé par l'opération <i>login</i>.

Avec Postman, cela ressemble à ceci:

![postman ajoutant un jeton bearer](../../images/4/20e.png)

et avec le client REST de Visual Studio Code

![exemple vscode ajoutant un jeton bearer](../../images/4/21e.png)

Le code actuel de l'application peut être trouvé sur [Github](https://github.com/fullstack-hy2020/part3-notes-backend/tree/part4-9), branche <i>part4-9</i>.

Si l'application a plusieurs interfaces nécessitant une identification, la validation du JWT devrait être séparée dans son propre middleware. Une bibliothèque existante comme [express-jwt](https://www.npmjs.com/package/express-jwt) pourrait également être utilisée.

### Problèmes de l'authentification basée sur des jetons

L'authentification par jeton est assez facile à mettre en oeuvre, mais elle contient un problème. Une fois que l'utilisateur de l'API, par exemple une application React, obtient un jeton, l'API fait entièrement confiance au détenteur du jeton. Que faire si les droits d'accès du détenteur du jeton doivent être révoqués?

Il existe deux solutions à ce problème. La plus simple consiste à limiter la période de validité d'un jeton:

```js
loginRouter.post('/', async (request, response) => {
  const { username, password } = request.body

  const user = await User.findOne({ username })
  const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(password, user.passwordHash)

  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: 'invalid username or password'
    })
  }

  const userForToken = {
    username: user.username,
    id: user._id,
  }

  // token expires in 60*60 seconds, that is, in one hour
  // highlight-start
  const token = jwt.sign(
    userForToken, 
    process.env.SECRET,
    { expiresIn: 60*60 }
  )
  // highlight-end

  response
    .status(200)
    .send({ token, username: user.username, name: user.name })
})
```

Une fois que le jeton expire, l'application cliente doit obtenir un nouveau jeton. Habituellement, cela se fait en obligeant l'utilisateur à se reconnecter à l'application.

Le middleware de gestion des erreurs devrait être étendu pour fournir une erreur appropriée en cas de jeton expiré:


```js
const errorHandler = (error, request, response, next) => {
  logger.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  } else if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({
      error: 'invalid token'
    })
  // highlight-start  
  } else if (error.name === 'TokenExpiredError') {
    return response.status(401).json({
      error: 'token expired'
    })
  }
  // highlight-end

  next(error)
}
```

La durée de validité plus courte, la solution est plus sûre. Ainsi, si le jeton tombe entre de mauvaises mains ou si l'accès de l'utilisateur au système doit être révoqué, le jeton n'est utilisable que pendant une durée limitée. D'autre part, une durée de validité courte force l'utilisateur à se connecter plus fréquemment au système, ce qui peut être pénible.

L'autre solution consiste à enregistrer des informations sur chaque jeton dans la base de données du backend et à vérifier pour chaque requête API si les droits d'accès correspondant aux jetons sont toujours valides. Avec ce schéma, les droits d'accès peuvent être révoqués à tout moment. Ce type de solution est souvent appelé une <i>session côté serveur</i>.

L'aspect négatif des sessions côté serveur est la complexité accrue dans le backend et aussi l'effet sur les performances puisque la validité du jeton doit être vérifiée pour chaque requête API dans la base de données. L'accès à la base de données est considérablement plus lent par rapport à la vérification de la validité du jeton lui-même. C'est pourquoi il est assez courant d'enregistrer la session correspondant à un jeton dans une base de données <i>clé-valeur</i> comme [Redis](https://redis.io/), qui est limitée en fonctionnalités par rapport, par exemple, à MongoDB ou à une base de données relationnelle, mais extrêmement rapide dans certains scénarios d'utilisation.

Lorsque les sessions côté serveur sont utilisées, le jeton est souvent juste une chaîne aléatoire, qui n'inclut pas d'informations sur l'utilisateur, comme c'est souvent le cas avec les jetons jwt. Pour chaque requête API, le serveur récupère les informations pertinentes sur l'identité de l'utilisateur depuis la base de données. Il est également assez courant que, au lieu d'utiliser l'en-tête d'autorisation, les <i>cookies</i> soient utilisés comme mécanisme pour transférer le jeton entre le client et le serveur.

### Notes de fin

Il y a eu de nombreux changements dans le code qui ont causé un problème typique pour un projet logiciel en rapide évolution: la plupart des tests ont échoué. Comme cette partie du cours est déjà saturée de nouvelles informations, nous laisserons la réparation des tests en tant qu'exercice facultatif.

Les noms d'utilisateur, les mots de passe et les applications utilisant l'authentification par jeton doivent toujours être utilisés via [HTTPS](https://en.wikipedia.org/wiki/HTTPS). Nous pourrions utiliser un serveur [HTTPS](https://nodejs.org/api/https.html) de Node dans notre application au lieu du serveur [HTTP](https://nodejs.org/docs/latest-v8.x/api/http.html) (cela nécessite plus de configuration). D'autre part, la version de production de notre application est sur Fly.io, donc notre application reste sécurisée : Fly.io achemine tout le trafic entre un navigateur et le serveur Fly.io via HTTPS.

Nous mettrons en oeuvre la connexion au frontend dans la [partie suivante](/fr/part5).

REMARQUE: À ce stade, dans l'application de prise de notes déployée, il est prévu que la fonctionnalité de création d'une note cesse de fonctionner car la fonction de connexion du backend n'est pas encore liée au frontend.

</div>

<div class="tasks">

### Exercices 4.15.-4.23.

Dans les exercices suivants, les bases de la gestion des utilisateurs seront implémentées pour l'application Bloglist. La manière la plus sûre est de suivre l'histoire de la partie 4 du chapitre [Administration des utilisateurs](/en/part4/user_administration) au chapitre [Authentification par jeton](/en/part4/token_authentication). Vous pouvez bien sûr aussi utiliser votre créativité.

**Encore un avertissement:** Si vous remarquez que vous mélangez les appels async/await et _then_, il est à 99 % certain que vous faites quelque chose de mal. Utilisez l'un ou l'autre, mais jamais les deux.

#### 4.15 : expansion de bloglist, étape3

Mettez en oeuvre un moyen de créer de nouveaux utilisateurs en effectuant une requête HTTP POST à l'adresse <i>api/users</i>. Les utilisateurs ont un <i>nom d'utilisateur, un mot de passe et un nom</i>.

Ne sauvegardez pas les mots de passe dans la base de données en texte clair, mais utilisez la bibliothèque <i>bcrypt</i> comme nous l'avons fait dans la partie 4 du chapitre [Créer de nouveaux utilisateurs](/en/part4/user_administration#creating-users).

**NB** Certains utilisateurs de Windows ont eu des problèmes avec <i>bcrypt</i>. Si vous rencontrez des problèmes, supprimez la bibliothèque avec la commande

```bash
npm uninstall bcrypt 
```

et installez [bcryptjs](https://www.npmjs.com/package/bcryptjs) à la place.

Mettez en oeuvre un moyen de voir les détails de tous les utilisateurs en effectuant une requête HTTP appropriée.

La liste des utilisateurs peut, par exemple, ressembler à ceci:

![api/users du navigateur affiche les données JSON de deux utilisateurs](../../images/4/22.png)

#### 4.16* : expansion de bloglist, étape4

Ajoutez une fonctionnalité qui impose les restrictions suivantes pour la création de nouveaux utilisateurs : Le nom d'utilisateur et le mot de passe doivent être fournis. Le nom d'utilisateur et le mot de passe doivent avoir au moins 3 caractères de long. Le nom d'utilisateur doit être unique.

L'opération doit répondre avec un code de statut approprié et une sorte de message d'erreur si un utilisateur invalide est créé.

**NB** Ne testez pas les restrictions de mot de passe avec les validations Mongoose. Ce n'est pas une bonne idée car le mot de passe reçu par le backend et le hash du mot de passe enregistré dans la base de données ne sont pas la même chose. La longueur du mot de passe doit être validée dans le contrôleur comme nous l'avons fait dans la [partie 3](/en/part3/node_js_and_express) avant d'utiliser la validation Mongoose.

Mettez également en oeuvre des tests qui garantissent que les utilisateurs invalides ne sont pas créés et qu'une opération d'ajout d'utilisateur invalide retourne un code de statut et un message d'erreur appropriés.

#### 4.17 : expansion de bloglist, étape5

Étendez les blogs pour que chaque blog contienne des informations sur le créateur du blog.

Modifiez l'ajout de nouveaux blogs pour que, lorsqu'un nouveau blog est créé, <i>n'importe quel</i> utilisateur de la base de données soit désigné comme son créateur (par exemple, le premier trouvé). Implémentez cela selon la partie 4 du chapitre [populate](/en/part4/user_administration#populate).
Peu importe quel utilisateur est désigné comme le créateur pour le moment. La fonctionnalité est terminée dans l'exercice 4.19.

Modifiez la liste de tous les blogs pour que les informations de l'utilisateur créateur soient affichées avec le blog:

![api/blogs intègre les informations de l'utilisateur créateur dans les données JSON](../../images/4/23e.png)

et que la liste de tous les utilisateurs affiche également les blogs créés par chaque utilisateur:

![api/users intègre les blogs dans les données JSON](../../images/4/24e.png)

#### 4.18 : expansion de bloglist, étape6

Mettez en oeuvre l'authentification basée sur les jetons selon le chapitre [Authentification par jeton](/en/part4/token_authentication) de la partie 4.

#### 4.19 : expansion de bloglist, étape7

Modifiez l'ajout de nouveaux blogs pour qu'il ne soit possible que si un jeton valide est envoyé avec la requête HTTP POST. L'utilisateur identifié par le jeton est désigné comme le créateur du blog.

#### 4.20* : expansion de bloglist, étape8

[Cet exemple](/en/part4/token_authentication) de la partie 4 montre comment extraire le jeton de l'en-tête avec la fonction d'aide _getTokenFrom_ dans <i>controllers/blogs.js</i>.

Si vous avez utilisé la même solution, refactorisez l'extraction du jeton en un [middleware](/en/part3/node_js_and_express#middleware). Le middleware devrait prendre le jeton de l'en-tête <i>Authorization</i> et le placer dans le champ <i>token</i> de l'objet <i>request</i>.

En d'autres termes, si vous enregistrez ce middleware dans le fichier <i>app.js</i> avant toutes les routes

```js
app.use(middleware.tokenExtractor)
```

les routes peuvent accéder au jeton avec _request.token_:

```js
blogsRouter.post('/', async (request, response) => {
  // ..
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  // ..
})
```

souvenez-vous qu'une [fonction middleware](/en/part3/node_js_and_express#middleware) normale est une fonction avec trois paramètres, qui, à la fin, appelle le dernier paramètre <i>next</i> pour transférer le contrôle au prochain middleware:

```js
const tokenExtractor = (request, response, next) => {
  // code that extracts the token

  next()
}
```

#### 4.21* : expansion de bloglist, étape9

Modifiez l'opération de suppression de blog de manière à ce qu'un blog puisse être supprimé uniquement par l'utilisateur qui l'a ajouté. Par conséquent, la suppression d'un blog n'est possible que si le jeton envoyé avec la requête est le même que celui du créateur du blog.

Si une tentative de suppression d'un blog est faite sans jeton ou par un utilisateur invalide, l'opération doit retourner un code de statut approprié.

Notez que si vous récupérez un blog de la base de données,

```js
const blog = await Blog.findById(...)
```

le champ <i>blog.user</i> ne contient pas une chaîne de caractères, mais un objet. Donc, si vous voulez comparer l'identifiant de l'objet récupéré de la base de données avec un identifiant sous forme de chaîne, une opération de comparaison normale ne fonctionnera pas. L'identifiant récupéré de la base de données doit d'abord être converti en chaîne de caractères.

```js
if ( blog.user.toString() === userid.toString() ) ...
```

#### 4.22* : expansion de bloglist, étape10

Les opérations de création d'un nouveau blog et de suppression d'un blog doivent toutes deux déterminer l'identité de l'utilisateur qui effectue l'opération. Le middleware _tokenExtractor_ que nous avons réalisé dans l'exercice 4.20 aide, mais les gestionnaires des opérations <i>post</i> et <i>delete</i> doivent toujours déterminer qui est l'utilisateur associé à un jeton spécifique.

Créez maintenant un nouveau middleware _userExtractor_, qui identifie l'utilisateur et le définit dans l'objet de requête. Lorsque vous enregistrez le middleware dans <i>app.js</i>

```js
app.use(middleware.userExtractor)
```

l'utilisateur sera défini dans le champ _request.user_:

```js
blogsRouter.post('/', async (request, response) => {
  // get user from request object
  const user = request.user
  // ..
})

blogsRouter.delete('/:id', async (request, response) => {
  // get user from request object
  const user = request.user
  // ..
})
```

Notez qu'il est possible d'enregistrer un middleware uniquement pour un ensemble spécifique de routes. Ainsi, au lieu d'utiliser _userExtractor_ avec toutes les routes,

```js
const middleware = require('../utils/middleware');
// ...

// use the middleware in all routes
app.use(middleware.userExtractor) // highlight-line

app.use('/api/blogs', blogsRouter)  
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
```

nous pourrions l'enregistrer pour qu'il soit exécuté uniquement avec les routes du chemin <i>/api/blogs</i>:

```js
const middleware = require('../utils/middleware');
// ...

// use the middleware only in /api/blogs routes
app.use('/api/blogs', middleware.userExtractor, blogsRouter) // highlight-line
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
```

Comme on peut le voir, cela se fait en chaînant plusieurs middlewares en tant que paramètre de la fonction <i>use</i>. Il serait également possible d'enregistrer un middleware uniquement pour une opération spécifique:

```js
const middleware = require('../utils/middleware');
// ...

router.post('/', middleware.userExtractor, async (request, response) => {
  // ...
}
```

#### 4.23* : expansion de bloglist, étape11

Après l'ajout de l'authentification basée sur les jetons, les tests pour l'ajout d'un nouveau blog ont échoué. Corrigez les tests. Écrivez également un nouveau test pour vous assurer que l'ajout d'un blog échoue avec le code de statut approprié <i>401 Non autorisé</i> si un jeton n'est pas fourni.

[Ceci](https://github.com/visionmedia/supertest/issues/398) pourrait être très utile pour effectuer la correction.

C'est le dernier exercice de cette partie du cours et il est temps de pousser votre code sur GitHub et de marquer tous vos exercices terminés dans le [système de soumission](https://studies.cs.helsinki.fi/stats/courses/fullstackopen) des exercices.

</div>