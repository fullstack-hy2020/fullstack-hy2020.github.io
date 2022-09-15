---
mainImage: ../../../images/part-3.svg
part: 3
letter: c
lang: fr
---

<div class="content">

Avant de passer au sujet principal de la persistance des données dans une base de données, nous allons jeter un coup d'œil à quelques façons différentes de déboguer les applications Node.

### Débogage des applications Node

Le débogage des applications Node est légèrement plus difficile que le débogage du JavaScript exécuté dans votre navigateur. L'impression à la console est une méthode éprouvée et vraie, et cela vaut toujours la peine de la faire. Il y a des gens qui pensent que des méthodes plus sophistiquées devraient être utilisées à la place, mais je ne suis pas d'accord. Même l'élite mondiale des développeurs open source [utilise](https://tenderlovemaking.com/2016/02/05/i-am-a-puts-debuggerer.html) cette [méthode](https://swizec.com/blog/javascript-debugging-slightly-beyond-consolelog/).


#### Visual Studio Code

Le débogueur de Visual Studio Code peut être utile dans certaines situations. Vous pouvez lancer l'application en mode débogage comme ceci :

![](../../images/3/35x.png)

Notez que l'application ne doit pas être exécutée dans une autre console, sinon le port sera déjà utilisé.

__NB__ Une version plus récente de Visual Studio Code peut avoir _Run_ au lieu de _Debug_. De plus, vous devrez peut-être configurer votre fichier _launch.json_ pour lancer le débogage. Cela peut être fait en choisissant _Add Configuration... _ dans le menu déroulant, qui se trouve à côté du bouton vert de lecture et au-dessus du menu _VARIABLES_, et sélectionnez _Run "npm start" dans un terminal de débogage_. Pour des instructions de configuration plus détaillées, consultez la [documentation sur le débogage] de Visual Studio Code (https://code.visualstudio.com/docs/editor/debugging).

Vous pouvez voir ci-dessous une capture d'écran où l'exécution du code a été interrompue au milieu de l'enregistrement d'une nouvelle note :

![](../../images/3/36x.png)

L'exécution s'est arrêtée au <i>point d'arrêt</i> à la ligne 63. Dans la console, vous pouvez voir la valeur de la variable <i>note</i>. Dans la fenêtre en haut à gauche, vous pouvez voir d'autres choses liées à l'état de l'application.

Les flèches en haut peuvent être utilisées pour contrôler le flux du débogueur.

Pour une raison quelconque, je n'utilise pas beaucoup le débogueur de Visual Studio Code.

#### Outils de développement de Chrome

Le débogage est également possible avec la console de développement de Chrome en démarrant votre application avec la commande :

```bash
node --inspect index.js
```

Vous pouvez accéder au débogueur en cliquant sur l'icône verte - le logo de node - qui apparaît dans la console du développeur de Chrome :

![](../../images/3/37.png)

La vue de débogage fonctionne de la même manière que pour les applications React. L'onglet <i>Sources</i> peut être utilisé pour définir des points d'arrêt où l'exécution du code sera mise en pause.

![](../../images/3/38eb.png)

Tous les messages <i>console.log</i> de l'application apparaîtront dans l'onglet <i>Console</i> du débogueur. Vous pouvez également inspecter les valeurs des variables et exécuter votre propre code JavaScript.

![](../../images/3/39ea.png)

#### Questionnez tout

Le débogage des applications Full Stack peut sembler délicat au début. Bientôt, notre application aura également une base de données en plus du frontend et du backend, et il y aura de nombreuses zones potentielles de bugs dans l'application.

Lorsque l'application "ne fonctionne pas", nous devons d'abord déterminer où le problème se situe réellement. Il est très fréquent que le problème se trouve à un endroit où vous ne vous y attendiez pas, et il peut se passer des minutes, des heures, voire des jours avant que vous ne trouviez la source du problème.

La clé est d'être systématique. Puisque le problème peut exister n'importe où, <i>vous devez tout remettre en question</i>, et éliminer toutes les possibilités une par une. La journalisation sur la console, Postman, les débogueurs et l'expérience vous aideront.

Lorsque des bugs surviennent, <i>la pire des stratégies possibles</i> est de continuer à écrire du code. Cela garantira que votre code aura bientôt encore plus de bugs, et que leur débogage sera encore plus difficile. Le principe [stop and fix](http://gettingtolean.com/toyota-principle-5-build-culture-stopping-fix/) du Toyota Production Systems est également très efficace dans cette situation.

### MongoDB

Afin de stocker indéfiniment nos notes enregistrées, nous avons besoin d'une base de données. La plupart des cours dispensés à l'Université d'Helsinki utilisent des bases de données relationnelles. Dans la majeure partie de ce cours, nous utiliserons [MongoDB](https://www.mongodb.com/) qui est une base de données documentaire (https://en.wikipedia.org/wiki/Document-oriented_database).

La raison de l'utilisation de Mongo comme base de données est sa moindre complexité par rapport à une base de données relationnelle. [La partie 13](https://fullstackopen.com/en/part13) du cours montre comment construire des backends node.js qui utilisent une base de données relationnelle.

Les bases de données documentaires diffèrent des bases de données relationnelles par la manière dont elles organisent les données ainsi que par les langages d'interrogation qu'elles prennent en charge. Les bases de données documentaires sont généralement classées sous le terme générique [NoSQL](https://en.wikipedia.org/wiki/NoSQL).

Pour en savoir plus sur les bases de données documentaires et les bases de données NoSQL, consultez le support de cours de la [semaine 7](https://tikape-s18.mooc.fi/part7/) du cours Introduction aux bases de données. Malheureusement, ce matériel n'est actuellement disponible qu'en finnois. 

Lisez maintenant les chapitres sur les [collections](https://docs.mongodb.com/manual/core/databases-and-collections/) et les [documents](https://docs.mongodb.com/manual/core/document/) du manuel MongoDB pour avoir une idée de base sur la façon dont une base de données de documents stocke les données.

Naturellement, vous pouvez installer et exécuter MongoDB sur votre propre ordinateur. Cependant, l'Internet regorge également de services de base de données Mongo que vous pouvez utiliser. Notre fournisseur MongoDB préféré dans ce cours sera [MongoDB Atlas](https://www.mongodb.com/atlas/database).



Une fois que vous avez créé et connecté votre compte, commençons par sélectionner l'option gratuite :

![](../../images/3/mongo1.png)

Choisissez le fournisseur de cloud et l'emplacement et créez le cluster :

![](../../images/3/mongo2.png)

Attendons que le cluster soit prêt à être utilisé. Cela peut prendre quelques minutes.

**NB** ne continuez pas avant que le cluster soit prêt.

Utilisons l'onglet <i>security</i> pour créer les informations d'identification des utilisateurs pour la base de données. Veuillez noter que ce ne sont pas les mêmes informations d'identification que vous utilisez pour vous connecter à MongoDB Atlas. Ils seront utilisés par votre application pour se connecter à la base de données.

![](../../images/3/mongo3.png)

 Ensuite, nous devons définir les adresses IP qui sont autorisées à accéder à la base de données. Pour des raisons de simplicité, nous allons autoriser l'accès à partir de toutes les adresses IP :

![](../../images/3/mongo4.png)

Enfin, nous sommes prêts à nous connecter à notre base de données. Commencez par cliquer sur <i>connect</i> :

![](../../images/3/mongo5.png)

et choisissez <i>Connecter votre application</i> :

![](../../images/3/mongo6.png)

La vue affiche l'<i>URI MongoDB</i>, qui est l'adresse de la base de données que nous allons fournir à la bibliothèque client MongoDB que nous allons ajouter à notre application.

L'adresse ressemble à ceci :

```bash
mongodb+srv://fullstack:$<password>@cluster0.o1opl.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
```

Nous sommes maintenant prêts à utiliser la base de données.

Nous pourrions utiliser la base de données directement depuis notre code JavaScript avec la bibliothèque [official MongoDb Node.js driver](https://mongodb.github.io/node-mongodb-native/), mais elle est assez lourde à utiliser. Nous utiliserons plutôt la bibliothèque [Mongoose](http://mongoosejs.com/index.html) qui offre une API de plus haut niveau.

Mongoose pourrait être décrit comme un <i>object document mapper</i> (ODM), et l'enregistrement d'objets JavaScript en tant que documents Mongo est simple avec cette bibliothèque.

Installons Mongoose :

```bash
npm install mongoose
```

 N'ajoutons pas encore de code traitant de Mongo à notre backend. Au lieu de cela, faisons une application d'entraînement en créant un nouveau fichier, <i>mongo.js</i> :

 ```js
const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://notes-app-full:${password}@cluster1.lvvbt.mongodb.net/?retryWrites=true&w=majority`

const noteSchema = new mongoose.Schema({
  content: String,
  date: Date,
  important: Boolean,
})

const Note = mongoose.model('Note', noteSchema)

mongoose
  .connect(url)
  .then((result) => {
    console.log('connected')

    const note = new Note({
      content: 'HTML is Easy',
      date: new Date(),
      important: true,
    })

    return note.save()
  })
  .then(() => {
    console.log('note saved!')
    return mongoose.connection.close()
  })
  .catch((err) => console.log(err))
```

**NB:** Selon la région que vous avez sélectionnée lors de la construction de votre cluster, l'URI <i>MongoDB</i> peut être différent de l'exemple fourni ci-dessus. Vous devez vérifier et utiliser l'URI correct qui a été généré par l'Atlas MongoDB.

Le code suppose également qu'on lui transmettra le mot de passe des informations d'identification que nous avons créées dans MongoDB Atlas, en tant que paramètre de ligne de commande. Nous pouvons accéder au paramètre de la ligne de commande comme suit :

```js
const password = process.argv[2]
````

Lorsque le code est exécuté avec la commande <i>node mongo.js password</i>, Mongo ajoutera un nouveau document à la base de données.

**NB:** Veuillez noter que le mot de passe est le mot de passe créé pour l'utilisateur de la base de données, et non votre mot de passe Atlas MongoDB.  De plus, si vous avez créé un mot de passe avec des caractères spéciaux, vous devrez [coder l'URL de ce mot de passe](https://docs.atlas.mongodb.com/troubleshoot-connection/#special-characters-in-connection-string-password).

Nous pouvons voir l'état actuel de la base de données dans l'Atlas MongoDB à partir de <i>Browse collections</i>, dans l'onglet Database.

![](../../images/3/mongo7.png)

Comme l'indique la vue, le <i>document</i> correspondant à la note a été ajouté à la collection <i>notes</i> de la base de données <i>myFirstDatabase</i>.

![](../../images/3/mongo8.png)

Détruisons la base de données par défaut <i>myFirstDatabase</i> et changeons le nom de la base de données référencée dans notre chaîne de connexion en <i>noteApp</i> à la place, en modifiant l'URI :

```bash
mongodb+srv://fullstack:$<password>@cluster0.o1opl.mongodb.net/noteApp?retryWrites=true&w=majority
```

Exécutons à nouveau notre code :

![](../../images/3/mongo9.png)

Les données sont maintenant stockées dans la bonne base de données. La vue offre également la fonctionnalité <i>créer une base de données</i>, qui peut être utilisée pour créer de nouvelles bases de données à partir du site Web. Créer la base de données comme ceci n'est pas nécessaire, puisque MongoDB Atlas crée automatiquement une nouvelle base de données lorsqu'une application tente de se connecter à une base de données qui n'existe pas encore.

### Schema

Après avoir établi la connexion à la base de données, nous définissons le [schéma](http://mongoosejs.com/docs/guide.html) pour une note et le [modèle](http://mongoosejs.com/docs/models.html) correspondant :

```js
const noteSchema = new mongoose.Schema({
    content: String,
    date: Date,
    important: Boolean,
})

const Note = mongoose.model('Note', noteSchema)
```

Tout d'abord, nous définissons le [schéma](http://mongoosejs.com/docs/guide.html) d'une note qui est stocké dans la variable _noteSchema_. Le schéma indique à Mongoose comment les objets note doivent être stockés dans la base de données.

Dans la définition du modèle _Note_, le premier paramètre <i>"Note"</i> est le nom singulier du modèle. Le nom de la collection sera le pluriel en minuscules <i>notes</i>, car la [convention Mongoose](http://mongoosejs.com/docs/models.html) consiste à nommer automatiquement les collections au pluriel (par exemple <i>notes</i>) lorsque le schéma les désigne au singulier (par exemple <i>Note</i>).

Les bases de données de documents comme Mongo sont <i>schemaless</i>, ce qui signifie que la base de données elle-même ne se soucie pas de la structure des données qui sont stockées dans la base. Il est possible de stocker des documents avec des champs complètement différents dans la même collection.

L'idée derrière Mongoose est que les données stockées dans la base de données reçoivent un <i>schéma au niveau de l'application</i> qui définit la forme des documents stockés dans toute collection donnée.

### Création et sauvegarde d'objets

Ensuite, l'application crée un nouvel objet note à l'aide du <i>Note</i> [modèle](http://mongoosejs.com/docs/models.html) :

```js
const note = new Note({
  content: 'HTML is Easy',
  date: new Date(),
  important: false,
})
```

Les modèles sont des fonctions dites <i>constructrices</i> qui créent de nouveaux objets JavaScript en fonction des paramètres fournis. Puisque les objets sont créés avec la fonction constructeur du modèle, ils ont toutes les propriétés du modèle, qui incluent des méthodes pour enregistrer l'objet dans la base de données.

L'enregistrement de l'objet dans la base de données s'effectue à l'aide de la méthode _save_, qui peut être associée à un gestionnaire d'événements avec la méthode _then_ :

```js
note.save().then(result => {
  console.log('note saved!')
  mongoose.connection.close()
})
```

Lorsque l'objet est enregistré dans la base de données, le gestionnaire d'événements fourni à _then_ est appelé. Le gestionnaire d'événements ferme la connexion à la base de données avec la commande <code>mongoose.connection.close()</code>. Si la connexion n'est pas fermée, le programme ne terminera jamais son exécution.

Le résultat de l'opération de sauvegarde se trouve dans le paramètre _result_ du gestionnaire d'événements. Le résultat n'est pas très intéressant lorsque nous stockons un seul objet dans la base de données. Vous pouvez imprimer l'objet sur la console si vous souhaitez l'examiner de plus près lors de la mise en œuvre de votre application ou pendant le débogage.

Prenons également quelques notes supplémentaires en modifiant les données dans le code et en exécutant à nouveau le programme.

**NB:** Malheureusement, la documentation de Mongoose n'est pas très cohérente, certaines parties utilisant les callbacks dans leurs exemples et d'autres parties, d'autres styles, il n'est donc pas recommandé de copier-coller du code directement à partir de là. Il n'est pas recommandé de mélanger les promesses avec les callbacks de la vieille école dans le même code. 

### Récupération d'objets dans la base de données

Mettons en commentaire le code pour générer de nouvelles notes et remplaçons-le par ce qui suit :

```js
Note.find({}).then(result => {
  result.forEach(note => {
    console.log(note)
  })
  mongoose.connection.close()
})
```

Lorsque le code est exécuté, le programme imprime toutes les notes stockées dans la base de données :

![](../../images/3/70ea.png)

Les objets sont récupérés dans la base de données avec la méthode [find](https://mongoosejs.com/docs/api/model.html#model_Model-find) du modèle _Note_. Le paramètre de la méthode est un objet exprimant les conditions de recherche. Comme le paramètre est un objet vide<code>{}</code>, nous obtenons toutes les notes stockées dans la collection _notes_.

Les conditions de recherche sont conformes à la requête de recherche Mongo [syntaxe](https://docs.mongodb.com/manual/reference/operator/).

Nous pourrions restreindre notre recherche pour n'inclure que les notes importantes comme ceci :

```js
Note.find({ important: true }).then(result => {
  // ...
})
```

</div>

<div class="tâches">

### Exercice 3.12.

#### 3.12 : base de données en ligne de commande

Créez une base de données MongoDB basée sur le cloud pour l'application de répertoire téléphonique avec MongoDB Atlas. 

Créez un fichier <i>mongo.js</i> dans le répertoire du projet, qui peut être utilisé pour ajouter des entrées au répertoire et pour lister toutes les entrées existantes dans le répertoire.

**NB:** N'incluez pas le mot de passe dans le fichier que vous commettez et poussez sur GitHub ! 

L'application doit fonctionner comme suit. Vous utilisez le programme en passant trois arguments de ligne de commande (le premier est le mot de passe), par exemple :

```bash
node mongo.js yourpassword Anna 040-1234556
```

 En conséquence, l'application imprimera :

```bash
added Anna number 040-1234556 to phonebook
```

 La nouvelle entrée du répertoire sera enregistrée dans la base de données. Notez que si le nom contient des caractères d'espacement, il doit être placé entre guillemets :

```bash
node mongo.js yourpassword "Arto Vihavainen" 045-1232456
```

 Si le mot de passe est le seul paramètre donné au programme, c'est-à-dire qu'il est invoqué comme ceci :

```bash
node mongo.js yourpassword
```

 Alors le programme devrait afficher toutes les entrées du répertoire téléphonique :

<pre>
phonebook:
Anna 040-1234556
Arto Vihavainen 045-1232456
Ada Lovelace 040-1231236
</pre>

Vous pouvez obtenir les paramètres de la ligne de commande à partir de la variable [process.argv](https://nodejs.org/docs/latest-v8.x/api/process.html#process_process_argv).

**NB : ne pas fermer la connexion au mauvais endroit**. Par exemple, le code suivant ne fonctionnera pas :

```js
Person
  .find({})
  .then(persons=> {
    // ...
  })

mongoose.connection.close()
```

Dans le code ci-dessus, la commande <i>mongoose.connection.close()</i> sera exécutée immédiatement après le lancement de l'opération <i>Person.find</i>. Cela signifie que la connexion à la base de données sera fermée immédiatement, et que l'exécution n'arrivera jamais au point où l'opération <i>Person.find</i> se termine et où la fonction <i>callback</i> est appelée.

L'endroit correct pour fermer la connexion à la base de données est à la fin de la fonction callback :

```js
Person
  .find({})
  .then(persons=> {
    // ...
    mongoose.connection.close()
  })
```

**NB:** Si vous définissez un modèle avec le nom <i>Person</i>, mongoose nommera automatiquement la collection associée comme <i>people</i>.

</div>

<div class="content">

### Backend connecté à une base de données

Maintenant, nous avons suffisamment de connaissances pour commencer à utiliser Mongo dans notre application.

Commençons rapidement en copiant-collant les définitions de Mongoose dans le fichier <i>index.js</i> :

```js
const mongoose = require('mongoose')

// DO NOT SAVE YOUR PASSWORD TO GITHUB!!
const url =
  `mongodb+srv://fullstack:<password>@cluster0.o1opl.mongodb.net/noteApp?retryWrites=true&w=majority`

mongoose.connect(url)

const noteSchema = new mongoose.Schema({
  content: String,
  date: Date,
  important: Boolean,
})

const Note = mongoose.model('Note', noteSchema)
```

Modifions le gestionnaire pour récupérer toutes les notes sous la forme suivante :

```js
app.get('/api/notes', (request, response) => {
  Note.find({}).then(notes => {
    response.json(notes)
  })
})
```

Nous pouvons vérifier dans le navigateur que le backend fonctionne pour l'affichage de tous les documents :

![](../../images/3/44ea.png)

L'application fonctionne presque parfaitement. Le frontend suppose que chaque objet a un id unique dans le champ <i>id</i>. Nous ne voulons pas non plus renvoyer le champ de versioning mongo <i>\_\_v</i> au frontend.

Une façon de formater les objets retournés par Mongoose est de [modifier](https://stackoverflow.com/questions/7034848/mongodb-output-id-instead-of-id) la méthode _toJSON_ du schéma, qui est utilisée sur toutes les instances des modèles produits avec ce schéma. La modification de la méthode fonctionne comme suit :

```js
noteSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})
```

Même si la propriété <i>\_id</i> des objets Mongoose ressemble à une chaîne, il s'agit en fait d'un objet. La méthode _toJSON_ que nous avons définie la transforme en chaîne de caractères par mesure de sécurité. Si nous ne faisions pas ce changement, cela nous causerait plus de tort à l'avenir, lorsque nous commencerons à écrire des tests.

Répondons à la requête HTTP avec une liste d'objets formatés avec la méthode _toJSON_ :

```js
app.get('/api/notes', (request, response) => {
  Note.find({}).then(notes => {
    response.json(notes)
  })
})
```

Maintenant la variable _notes_ est assignée à un tableau d'objets retournés par Mongo. Lorsque la réponse est envoyée au format JSON, la méthode _toJSON_ de chaque objet du tableau est appelée automatiquement par la méthode [JSON.stringify](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify).

### La configuration de la base de données dans son propre module

Avant de refactoriser le reste du backend pour utiliser la base de données, extrayons le code spécifique à Mongoose dans son propre module.

Créons un nouveau répertoire pour le module appelé <i>models</i>, et ajoutons un fichier appelé <i>note.js</i> :

```js
const mongoose = require('mongoose')

const url = process.env.MONGODB_URI // highlight-line

console.log('connecting to', url) // highlight-line

mongoose.connect(url)
// highlight-start
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })
// highlight-end

const noteSchema = new mongoose.Schema({
  content: String,
  date: Date,
  important: Boolean,
})

noteSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Note', noteSchema) // highlight-line
```

La définition des [modules] de Node (https://nodejs.org/docs/latest-v8.x/api/modules.html) diffère légèrement de la manière de définir les [modules ES6](/fr/part2/rendering_a_collection_modules#refactoring-modules) dans la partie 2.

L'interface publique du module est définie en attribuant une valeur à la variable _module.exports_. Nous allons définir la valeur comme étant le modèle <i>Note</i>. Les autres choses définies à l'intérieur du module, comme les variables _mongoose_ et _url_ ne seront pas accessibles ou visibles pour les utilisateurs du module.

L'importation du module se fait en ajoutant la ligne suivante à <i>index.js</i> :

```js
const Note = require('./models/note')
```

De cette façon, la variable _Note_ sera affectée au même objet que celui défini par le module.

La façon dont la connexion est établie a légèrement changé :

```js
const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose.connect(url)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })
```

Ce n'est pas une bonne idée de coder en dur l'adresse de la base de données dans le code, donc à la place l'adresse de la base de données est transmise à l'application via la variable d'environnement <em>MONGODB_URI</em>.

La méthode d'établissement de la connexion est maintenant dotée de fonctions permettant de traiter une tentative de connexion réussie ou non. Les deux fonctions se contentent de consigner un message dans la console concernant l'état de réussite :

![](../../images/3/45e.png)

Il existe de nombreuses façons de définir la valeur d'une variable d'environnement. L'une d'elles consiste à la définir au démarrage de l'application :

```bash
MONGODB_URI=address_here npm run dev
```

Une méthode plus sophistiquée consiste à utiliser la bibliothèque [dotenv](https://github.com/motdotla/dotenv#readme). Vous pouvez installer la bibliothèque avec la commande :

```bash
npm install dotenv
```

Pour utiliser la bibliothèque, nous créons un fichier <i>.env</i> à la racine du projet. Les variables d'environnement sont définies à l'intérieur du fichier, et il peut ressembler à ceci :

```bash
MONGODB_URI=mongodb+srv://fullstack:<password>@cluster0.o1opl.mongodb.net/noteApp?retryWrites=true&w=majority
PORT=3001
```

 Nous avons également ajouté le port en dur du serveur dans la variable d'environnement <em>PORT</em>.

**Le fichier <i>.env</i> doit être gitignoré tout de suite, car nous ne voulons pas publier d'informations confidentielles publiquement en ligne !**

![](../../images/3/45ae.png)

Les variables d'environnement définies dans le fichier <i>.env</i> peuvent être prises en compte avec l'expression <em>require('dotenv').config()</em> et vous pouvez les référencer dans votre code comme vous référeriez des variables d'environnement normales, avec la syntaxe familière <em>process.env.MONGODB_URI</em>.

Modifions le fichier <i>index.js</i> de la manière suivante :

```js
require('dotenv').config() // highlight-line
const express = require('express')
const app = express()
const Note = require('./models/note') // highlight-line

// ..

const PORT = process.env.PORT // highlight-line
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
```

Il est important que <i>dotenv</i> soit importé avant que le modèle <i>note</i> soit importé. Cela garantit que les variables d'environnement du fichier <i>.env</i> sont disponibles globalement avant que le code des autres modules ne soit importé.

Une fois que le fichier .env a été gitignoré, Heroku ne récupère pas l'url de la base de données à partir du référentiel, vous devez donc le définir vous-même. Cela peut être fait via le tableau de bord Heroku comme suit :

![](../../images/3/herokuConfig.png)

ou depuis la ligne de commande avec la commande :

```
heroku config:set MONGODB_URI='mongodb+srv://fullstack:<password>@cluster0.o1opl.mongodb.net/noteApp?retryWrites=true&w=majority'
```

### Utilisation de la base de données dans les gestionnaires de route

Ensuite, changeons le reste de la fonctionnalité du backend pour utiliser la base de données.

La création d'une nouvelle note se fait comme suit :

```js
app.post('/api/notes', (request, response) => {
  const body = request.body

  if (body.content === undefined) {
    return response.status(400).json({ error: 'content missing' })
  }

  const note = new Note({
    content: body.content,
    important: body.important || false,
    date: new Date(),
  })

  note.save().then(savedNote => {
    response.json(savedNote)
  })
})
```

Les objets note sont créés avec la fonction constructrice _Note_. La réponse est envoyée dans la fonction de rappel de l'opération _save_. Cela garantit que la réponse n'est envoyée que si l'opération a réussi. Nous aborderons la gestion des erreurs un peu plus tard.

Le paramètre _savedNote_ de la fonction de rappel est la note sauvegardée et nouvellement créée. Les données renvoyées dans la réponse sont la version formatée créée avec la méthode _toJSON_ :

```js
response.json(savedNote)
```

En utilisant la méthode [findById](https://mongoosejs.com/docs/api/model.html#model_Model-findById) de Mongoose, la récupération d'une note individuelle se transforme en ce qui suit :

```js
app.get('/api/notes/:id', (request, response) => {
  Note.findById(request.params.id).then(note => {
    response.json(note)
  })
})
```

### Vérification de l'intégration du front-end et du back-end

Lorsque le backend est étendu, c'est une bonne idée de tester d'abord le backend avec **le navigateur, Postman ou le client REST de VS Code**. Ensuite, essayons de créer une nouvelle note après avoir pris en compte la base de données :

![](../../images/3/46e.png)

Ce n'est qu'une fois que l'on a vérifié que tout fonctionne dans le backend, qu'il est bon de tester que le frontend fonctionne avec le backend. Il est très inefficace de tester les choses exclusivement par le biais du frontend.

C'est probablement une bonne idée d'intégrer le frontend et le backend une fonctionnalité à la fois. Tout d'abord, nous pourrions implémenter la récupération de toutes les notes de la base de données et la tester via le point de terminaison du backend dans le navigateur. Ensuite, nous pourrions vérifier que le frontend fonctionne avec le nouveau backend. Une fois que tout semble fonctionner, nous pourrions passer à la fonctionnalité suivante.

Une fois que nous introduisons une base de données dans le mélange, il est utile d'inspecter l'état persistant dans la base de données, par exemple à partir du panneau de contrôle dans MongoDB Atlas. Très souvent, de petits programmes d'aide Node comme le programme <i>mongo.js</i> que nous avons écrit précédemment peuvent être très utiles pendant le développement.

Vous pouvez trouver le code de notre application actuelle dans son intégralité dans la branche <i>part3-4</i> de [ce dépôt GitHub](https://github.com/fullstack-hy2020/part3-notes-backend/tree/part3-4).

</div>

<div class="tasks">

### Exercices 3.13.-3.14.

Les exercices suivants sont assez simples, mais si votre frontend cesse de fonctionner avec le backend, alors trouver et corriger les bugs peut être assez intéressant. 

#### 3.13 : Base de données du répertoire téléphonique, étape 1

Changez la récupération de toutes les entrées du répertoire téléphonique pour que les données soient <i>retirées de la base de données</i>.

Vérifiez que le frontend fonctionne après que les changements ont été faits.

Dans les exercices suivants, écrivez tout le code spécifique à Mongoose dans son propre module, comme nous l'avons fait dans le chapitre [Configuration de la base de données dans son propre module](/fr/part3/saving_data_to_mongo_db#database-configuration-into-its-own-module).

#### 3.14 : Base de données du répertoire téléphonique, étape 2

Changez le backend pour que les nouveaux numéros soient <i>sauvegardés dans la base de données</i>. Vérifiez que votre frontend fonctionne toujours après les changements.

À ce stade, vous pouvez choisir de simplement autoriser les utilisateurs à créer toutes les entrées du répertoire téléphonique. À ce stade, le répertoire téléphonique peut avoir plusieurs entrées pour une personne ayant le même nom. 

</div>

<div class="content">

### Traitement des erreurs

Si nous essayons de visiter l'URL d'une note avec un id qui n'existe pas réellement, par exemple <http://localhost:3001/api/notes/5c41c90e84d891c15dfa3431> où <i>5c41c90e84d891c15dfa3431</i> n'est pas un id stocké dans la base de données, alors la réponse sera _null_.

Changeons ce comportement pour que si la note avec l'id donné n'existe pas, le serveur répondra à la requête avec le code de statut HTTP 404 not found. En outre, implémentons un simple bloc <em>catch</em> pour gérer les cas où la promesse retournée par la méthode <em>findById</em> est <i>rejetée</i> :

```js
app.get('/api/notes/:id', (request, response) => {
  Note.findById(request.params.id)
    .then(note => {
      // highlight-start
      if (note) {
        response.json(note)
      } else {
        response.status(404).end()
      }
      // highlight-end
    })
    // highlight-start
    .catch(error => {
      console.log(error)
      response.status(500).end()
    })
    // highlight-end
})
```

Si aucun objet correspondant n'est trouvé dans la base de données, la valeur de _note_ sera _null_ et le bloc _else_ sera exécuté. Il en résulte une réponse avec le code d'état <i>404 not found</i>. Si la promesse renvoyée par la méthode <em>findById</em> est rejetée, la réponse aura le code d'état <i>500 internal server error</i>. La console affiche des informations plus détaillées sur l'erreur.

En plus de la note inexistante, il y a une autre situation d'erreur qui doit être traitée. Dans cette situation, nous essayons de récupérer une note avec un mauvais type d'_id_, c'est-à-dire un _id_ qui ne correspond pas au format d'identifiant mongo.

Si nous effectuons la requête suivante, nous obtiendrons le message d'erreur indiqué ci-dessous :

<pre>
Method: GET
Path:   /api/notes/someInvalidId
Body:   {}
---
{ CastError: Cast to ObjectId failed for value "someInvalidId" at path "_id"
    at CastError (/Users/mluukkai/opetus/_fullstack/osa3-muisiinpanot/node_modules/mongoose/lib/error/cast.js:27:11)
    at ObjectId.cast (/Users/mluukkai/opetus/_fullstack/osa3-muisiinpanot/node_modules/mongoose/lib/schema/objectid.js:158:13)
    ...
</pre>

Étant donné un id malformé comme argument, la méthode <em>findById</em> lancera une erreur provoquant le rejet de la promesse retournée. Cela provoquera l'appel de la fonction callback définie dans le bloc <em>catch</em>. 

Faisons quelques petits ajustements à la réponse dans le bloc <em>catch</em> :

```js
app.get('/api/notes/:id', (request, response) => {
  Note.findById(request.params.id)
    .then(note => {
      if (note) {
        response.json(note)
      } else {
        response.status(404).end() 
      }
    })
    .catch(error => {
      console.log(error)
      response.status(400).send({ error: 'malformatted id' }) // highlight-line
    })
})
```

Si le format de l'identifiant est incorrect, nous nous retrouverons dans le gestionnaire d'erreur défini dans le bloc _catch_. Le code d'état approprié pour cette situation est [400 Bad Request](https://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html#sec10.4.1), car la situation correspond parfaitement à la description :

> <i>La demande n'a pas pu être comprise par le serveur en raison d'une syntaxe malformée. Le client NE DEVRAIT PAS répéter la demande sans modifications.</i>

Nous avons également ajouté quelques données à la réponse pour faire la lumière sur la cause de l'erreur.

Lorsque vous traitez avec des Promesses, c'est presque toujours une bonne idée d'ajouter la gestion des erreurs et des exceptions, car sinon vous vous retrouverez à traiter des bugs étranges.

Ce n'est jamais une mauvaise idée d'imprimer l'objet qui a causé l'exception sur la console dans le gestionnaire d'erreur :

```js
.catch(error => {
  console.log(error)  // highlight-line
  response.status(400).send({ error: 'malformatted id' })
})
```

La raison pour laquelle le gestionnaire d'erreurs est appelé peut être complètement différente de ce que vous aviez prévu. Si vous consignez l'erreur dans la console, vous vous épargnerez de longues et frustrantes sessions de débogage. En outre, la plupart des services modernes sur lesquels vous déployez votre application prennent en charge une certaine forme de système de journalisation que vous pouvez utiliser pour vérifier ces journaux. Comme nous l'avons mentionné, Heroku en est un.

Chaque fois que vous travaillez sur un projet avec un backend, <i>il est essentiel de garder un œil sur la sortie console du backend</i>. Si vous travaillez sur un petit écran, il suffit de voir une toute petite tranche de la sortie en arrière-plan. Tout message d'erreur attirera votre attention même si la console est loin en arrière-plan :

![](../../images/3/15b.png)

### Déplacer la gestion des erreurs dans le middleware

Nous avons écrit le code pour le gestionnaire d'erreurs parmi le reste de notre code. Cela peut être une solution raisonnable à certains moments, mais il y a des cas où il est préférable d'implémenter toute la gestion des erreurs à un seul endroit. Cela peut s'avérer particulièrement utile si nous souhaitons par la suite transmettre les données relatives aux erreurs à un système externe de suivi des erreurs comme [Sentry](https://sentry.io/welcome/).

Modifions le gestionnaire de la route <i>/api/notes/:id</i>, afin qu'il transmette l'erreur avec la fonction <em>next</em>. La fonction next est passée au handler comme troisième paramètre :

```js
app.get('/api/notes/:id', (request, response, next) => { // highlight-line
  Note.findById(request.params.id)
    .then(note => {
      if (note) {
        response.json(note)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error)) // highlight-line
})
```

L'erreur qui est transmise en amont est donnée à la fonction <em>next</em> en tant que paramètre. Si <em>next</em> était appelée sans paramètre, alors l'exécution passerait simplement à la route ou au middleware suivant. Si la fonction <em>next</em> est appelée avec un paramètre, alors l'exécution se poursuivra jusqu'au <i>milieu de traitement des erreurs</i>.

Les [error handlers](https://expressjs.com/en/guide/error-handling.html) d'express sont des middlewares qui sont définis avec une fonction qui accepte <i>quatre paramètres</i>. Notre gestionnaire d'erreur ressemble à ceci :

```js
const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } 

  next(error)
}

// this has to be the last loaded middleware.
app.use(errorHandler)
```

Le gestionnaire d'erreur vérifie si l'erreur est une exception <i>CastError</i>, auquel cas nous savons que l'erreur a été causée par un id d'objet invalide pour Mongo. Dans cette situation, le gestionnaire d'erreur enverra une réponse au navigateur avec l'objet de réponse passé en paramètre. Dans toutes les autres situations d'erreur, le middleware transmet l'erreur au gestionnaire d'erreur Express par défaut. 

Notez que le middleware de gestion des erreurs doit être le dernier middleware chargé !

### L'ordre de chargement des middlewares

L'ordre d'exécution des middlewares est le même que l'ordre dans lequel ils sont chargés dans Express avec la fonction _app.use_. Pour cette raison, il est important d'être prudent lors de la définition des middlewares.

L'ordre correct est le suivant :

```js
app.use(express.static('build'))
app.use(express.json())
app.use(requestLogger)

app.post('/api/notes', (request, response) => {
  const body = request.body
  // ...
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

// handler of requests with unknown endpoint
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  // ...
}

// handler of requests with result to errors
app.use(errorHandler)
```

Le middleware json-parser devrait être parmi les tout premiers middleware chargés dans Express. Si l'ordre était le suivant :

```js
app.use(requestLogger) // request.body is undefined!

app.post('/api/notes', (request, response) => {
    // request.body is undefined!
    const body = request.body
    // ...
})

app.use(express.json())
```

Les données JSON envoyées avec les requêtes HTTP ne seraient alors pas disponibles pour le middleware du logger ou le gestionnaire de route POST, puisque le _request.body_ serait _undefined_ à ce moment-là.

Il est également important que le middleware de gestion des routes non prises en charge soit le dernier middleware chargé dans Express, juste avant le gestionnaire d'erreurs.

Par exemple, l'ordre de chargement suivant causerait un problème :

```js
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

// handler of requests with unknown endpoint
app.use(unknownEndpoint)

app.get('/api/notes', (request, response) => {
  // ...
})
```

Maintenant, le traitement des points de terminaison inconnus est ordonné <i>avant le gestionnaire de requête HTTP</i>. Puisque le gestionnaire de points de terminaison inconnus répond à toutes les demandes avec <i>404 unknown endpoint</i>, aucune route ou middleware ne sera appelée après que la réponse ait été envoyée par le middleware de points de terminaison inconnus. La seule exception à cela est le gestionnaire d'erreur qui doit venir à la toute fin, après le gestionnaire de points de terminaison inconnus.

### Autres opérations

Ajoutons quelques fonctionnalités manquantes à notre application, notamment la suppression et la mise à jour d'une note individuelle.

La façon la plus simple de supprimer une note de la base de données est d'utiliser la méthode [findByIdAndRemove](https://mongoosejs.com/docs/api/model.html#model_Model-findByIdAndRemove) :

```js
app.delete('/api/notes/:id', (request, response, next) => {
  Note.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})
```

Dans les deux cas de "réussite" de la suppression d'une ressource, le backend répond avec le code d'état <i>204 no content</i>. Les deux cas différents sont la suppression d'une note qui existe, et la suppression d'une note qui n'existe pas dans la base de données. Le paramètre de callback _result_ pourrait être utilisé pour vérifier si une ressource a effectivement été supprimée, et nous pourrions utiliser cette information pour renvoyer des codes d'état différents pour les deux cas si nous le jugions nécessaire. Toute exception qui se produit est transmise au gestionnaire d'erreurs.

Le changement de l'importance d'une note peut être facilement réalisé avec la méthode [findByIdAndUpdate](https://mongoosejs.com/docs/api/model.html#model_Model-findByIdAndUpdate).

```js
app.put('/api/notes/:id', (request, response, next) => {
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
``` 

Dans le code ci-dessus, nous permettons également de modifier le contenu de la note. Cependant, nous ne prendrons pas en charge la modification de la date de création pour des raisons évidentes.

Remarquez que la méthode <em>findByIdAndUpdate</em> reçoit un objet JavaScript ordinaire comme paramètre, et non un nouvel objet note créé avec la fonction constructeur <em>Note</em>.

Il existe un détail important concernant l'utilisation de la méthode <em>findByIdAndUpdate</em>. Par défaut, le paramètre <em>updatedNote</em> du gestionnaire d'événements reçoit le document original [sans les modifications](https://mongoosejs.com/docs/api/model.html#model_Model-findByIdAndUpdate). Nous avons ajouté le paramètre optionnel <code>{ new : true }</code>, qui fera en sorte que notre gestionnaire d'événements soit appelé avec le nouveau document modifié au lieu de l'original.

Après avoir testé le backend directement avec Postman et le client REST de VS Code, nous pouvons vérifier qu'il semble fonctionner. Le frontend semble également fonctionner avec le backend en utilisant la base de données. 

Vous pouvez trouver le code de notre application actuelle dans son intégralité dans la branche <i>part3-5</i> de [ce dépôt GitHub](https://github.com/fullstack-hy2020/part3-notes-backend/tree/part3-5).

</div>

<div class="tasks">

### Exercices 3.15.-3.18.

#### 3.15 : Base de données du répertoire téléphonique, étape3

Modifiez le backend pour que la suppression des entrées du répertoire téléphonique soit répercutée dans la base de données.

Vérifiez que le frontend fonctionne toujours après avoir fait les changements.

#### 3.16 : Base de données du répertoire téléphonique, étape 4

Déplacer la gestion des erreurs de l'application vers un nouveau middleware de gestion des erreurs. 

#### 3.17* : Base de données du répertoire téléphonique, étape 5

Si l'utilisateur essaie de créer une nouvelle entrée dans le répertoire pour une personne dont le nom est déjà dans le répertoire, le frontend va essayer de mettre à jour le numéro de téléphone de l'entrée existante en faisant une requête HTTP PUT à l'URL unique de l'entrée.

Modifiez le backend pour supporter cette requête.

Vérifiez que le frontend fonctionne après avoir fait vos changements.

#### 3.18* : Base de données du répertoire téléphonique étape6

Mettez également à jour la gestion des routes <i>api/persons/:id</i> et <i>info</i> pour utiliser la base de données, et vérifiez qu'elles fonctionnent directement avec le navigateur, Postman, ou le client REST de VS Code.

L'inspection d'une entrée de répertoire individuelle depuis le navigateur devrait ressembler à ceci :

![](../../images/3/49.png)

 </div>
