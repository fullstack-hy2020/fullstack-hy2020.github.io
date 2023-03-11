---
mainImage: ../../../images/part-3.svg
part: 3
letter: d
lang: fr
---

<div class="content">


Il y a généralement des contraintes que nous voulons appliquer aux données qui sont stockées dans la base de données de notre application. Notre application ne devrait pas accepter les notes dont la propriété <i>content</i> est manquante ou vide. La validité de la note est vérifiée dans le gestionnaire de route :

```js
app.post('/api/notes', (request, response) => {
  const body = request.body
  // highlight-start
  if (body.content === undefined) {
    return response.status(400).json({ error: 'content missing' })
  }
  // highlight-end

  // ...
})
```


Si la note ne possède pas la propriété <i>content</i>, nous répondons à la requête avec le code d'état <i>400 bad request</i>.


Une façon plus intelligente de valider le format des données avant de les stocker dans la base de données, est d'utiliser la fonctionnalité [validation](https://mongoosejs.com/docs/validation.html) disponible dans Mongoose.


Nous pouvons définir des règles de validation spécifiques pour chaque champ du schéma :

```js
const noteSchema = new mongoose.Schema({
  // highlight-start
  content: {
    type: String,
    minLength: 5,
    required: true
  },
  date: { 
    type: Date,
    required: true
  },
  // highlight-end
  important: Boolean
})
```


Le champ <i>contenu</i> doit désormais comporter au moins cinq caractères. Le champ <i>date</i> est défini comme obligatoire, ce qui signifie qu'il ne peut pas être manquant. La même contrainte est également appliquée au champ <i>contenu</i>, puisque la contrainte de longueur minimale permet au champ d'être manquant. Nous n'avons pas ajouté de contraintes au champ <i>important</i>, sa définition dans le schéma n'a donc pas changé.


Les validateurs <i>minLength</i> et <i>required</i> sont [built-in](https://mongoosejs.com/docs/validation.html#built-in-validators) et fournis par Mongoose. La fonctionnalité Mongoose [custom validator](https://mongoosejs.com/docs/validation.html#custom-validators) nous permet de créer de nouveaux validateurs, si aucun des validateurs intégrés ne couvre nos besoins.


Si nous essayons de stocker dans la base de données un objet qui ne respecte pas l'une des contraintes, l'opération déclenchera une exception. Modifions notre gestionnaire pour la création d'une nouvelle note afin qu'il transmette toute exception potentielle au middleware de gestion des erreurs :

```js
app.post('/api/notes', (request, response, next) => { // highlight-line
  const body = request.body

  const note = new Note({
    content: body.content,
    important: body.important || false,
    date: new Date(),
  })

  note.save()
    .then(savedNote => {
      response.json(savedNote)
    })
    .catch(error => next(error)) // highlight-line
})
```


Développons le gestionnaire d'erreurs pour traiter ces erreurs de validation :

```js
const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') { // highlight-line
    return response.status(400).json({ error: error.message }) // highlight-line
  }

  next(error)
}
```

Lorsque la validation d'un objet échoue, nous renvoyons le message d'erreur par défaut suivant de Mongoose :

![](../../images/3/50.png)

Nous remarquons que le backend a maintenant un problème : les validations ne sont pas effectuées lors de l'édition d'une note. 
La [documentation](https://github.com/blakehaswell/mongoose-unique-validator#find--updates) explique quel est le problème, les validations ne sont pas exécutées par défaut lorsque <i>findOneAndUpdate</i> est exécuté.

La correction est simple. Reformulons aussi un peu le code de la route :

```js
app.put('/api/notes/:id', (request, response, next) => {
  const { content, important } = request.body // highlight-line

  Note.findByIdAndUpdate(
    request.params.id, 
    { content, important }, // highlight-line
    { new: true, runValidators: true, context: 'query' } // highlight-line
  ) 
    .then(updatedNote => {
      response.json(updatedNote)
    })
    .catch(error => next(error))
})
```

### Déploiement du backend de la base de données en production

L'application devrait fonctionner presque telle quelle dans Heroku. Nous devons générer un nouveau build de production du frontend en raison des modifications que nous avons apportées à notre frontend. 

Les variables d'environnement définies dans dotenv ne seront utilisées que lorsque le backend n'est pas en mode <i>production</i>, c'est-à-dire Heroku.

Nous avons défini les variables d'environnement pour le développement dans le fichier <i>.env</i>, mais la variable d'environnement qui définit l'URL de la base de données en production doit être définie sur Heroku avec la commande _heroku config:set_.

```bash
heroku config:set MONGODB_URI=mongodb+srv://fullstack:secretpasswordhere@cluster0-ostce.mongodb.net/note-app?retryWrites=true
```

 **NB:** si la commande provoque une erreur, donnez la valeur de MONGODB_URI entre apostrophes :

```bash
heroku config:set MONGODB_URI='mongodb+srv://fullstack:secretpasswordhere@cluster0-ostce.mongodb.net/note-app?retryWrites=true'
```

L'application devrait maintenant fonctionner. Parfois, les choses ne se passent pas comme prévu. S'il y a des problèmes, les <i>logsheroku</i> seront là pour vous aider. Ma propre application n'a pas fonctionné après avoir effectué les changements. Les journaux montraient ce qui suit :

![](../../images/3/51a.png)

Pour une raison quelconque, l'URL de la base de données était indéfinie. La commande <i>heroku config</i> a révélé que j'avais accidentellement défini l'URL dans la variable d'environnement <em>MONGO\_URL</em>, alors que le code s'attendait à ce qu'elle soit dans <em>MONGODB\_URI</em>.

Vous pouvez trouver le code de notre application actuelle dans son intégralité dans la branche <i>part3-5</i> de [ce dépôt GitHub](https://github.com/fullstack-hy2019/part3-notes-backend/tree/part3-5).

</div>

<div class="tasks">

### Exercices 3.19.-3.21.

#### 3.19* : Base de données du répertoire téléphonique, étape 7

Développez la validation de sorte que le nom stocké dans la base de données doive comporter au moins trois caractères.

Développez le frontend pour qu'il affiche une forme de message d'erreur lorsqu'une erreur de validation se produit. La gestion des erreurs peut être implémentée en ajoutant un bloc <em>catch</em> comme indiqué ci-dessous :

```js
personService
    .create({ ... })
    .then(createdPerson => {
      // ...
    })
    .catch(error => {
      // this is the way to access the error message
      console.log(error.response.data.error)
    })
```

Vous pouvez afficher les messages d'erreur par défaut renvoyés par Mongoose, même s'ils ne sont pas aussi lisibles qu'ils pourraient l'être :

![](../../images/3/56e.png)

**NB:** Lors des opérations de mise à jour, les validateurs de Mongoose sont désactivés par défaut. [Lisez la documentation](https://mongoosejs.com/docs/validation.html) pour déterminer comment les activer.

#### 3.20* : Base de données du répertoire téléphonique, étape 8

Ajoutez la validation à votre application de répertoire téléphonique, qui s'assurera que les numéros de téléphone sont de la bonne forme. Un numéro de téléphone doit 
- avoir une longueur de 8 ou plus 
- être formé de deux parties séparées par -, la première partie comporte deux ou trois chiffres et la seconde partie est également composée de chiffres 
  - par exemple, 09-1234556 et 040-22334455 sont des numéros de téléphone valides 
  - par exemple, 1234556, 1-22334455 et 10-22-334455 ne sont pas valides.

Utilisez un [validateur personnalisé](https://mongoosejs.com/docs/validation.html#custom-validators) pour mettre en œuvre la deuxième partie de la validation.

Si une requête HTTP POST tente d'ajouter un nom qui se trouve déjà dans le répertoire, le serveur doit répondre avec un code d'état et un message d'erreur appropriés.

#### 3.21 Déploiement du backend de la base de données en production

Générez une nouvelle version "full stack" de l'application en créant un nouveau build de production du frontend, et copiez-le dans le référentiel du backend. Vérifiez que tout fonctionne localement en utilisant l'application entière à partir de l'adresse <http://localhost:3001/>.

Poussez la dernière version vers Heroku et vérifiez que tout fonctionne là aussi.

</div>

<div class="content">

### Lint

Avant de passer à la partie suivante, nous allons jeter un coup d'œil à un outil important appelé [lint](<https://en.wikipedia.org/wiki/Lint_(software)>). Wikipedia dit ce qui suit à propos de lint :

> <i>Généralement, lint ou un linter est tout outil qui détecte et signale les erreurs dans les langages de programmation, y compris les erreurs stylistiques. Le terme de comportement de type lint est parfois appliqué au processus de signalisation de l'utilisation suspecte du langage. Les outils de type linter effectuent généralement une analyse statique du code source.</i>

Dans les langages compilés à typage statique comme Java, les IDE comme NetBeans peuvent signaler les erreurs dans le code, même celles qui sont plus que de simples erreurs de compilation. Des outils supplémentaires pour effectuer une [analyse statique](https://en.wikipedia.org/wiki/Static_program_analysis) comme [checkstyle](https://checkstyle.sourceforge.io), peuvent être utilisés pour étendre les capacités de l'IDE afin de signaler également les problèmes liés au style, comme l'indentation.


Dans l'univers JavaScript, le principal outil d'analyse statique, autrement dit de "linting", est [ESlint](https://eslint.org/).

Installons ESlint comme une dépendance de développement au projet principal avec la commande :

```bash
npm install eslint --save-dev
```

Après cela, nous pouvons initialiser une configuration ESlint par défaut avec la commande :

```bash
npx eslint --init
```

Nous allons répondre à toutes les questions :

![](../../images/3/52be.png)

La configuration sera sauvegardée dans le fichier _.eslintrc.js_ :

```js
module.exports = {
    'env': {
        'commonjs': true,
        'es2021': true,
        'node': true
    },
    'extends': 'eslint:recommended',
    'parserOptions': {
        'ecmaVersion': 'latest'
    },
    'rules': {
        'indent': [
            'error',
            4
        ],
        'linebreak-style': [
            'error',
            'unix'
        ],
        'quotes': [
            'error',
            'single'
        ],
        'semi': [
            'error',
            'never'
        ]
    }
}
```

Changeons immédiatement la règle concernant l'indentation, de sorte que le niveau d'indentation soit de deux espaces.

```js
"indent": [
    "error",
    2
],
```

L'inspection et la validation d'un fichier comme _index.js_ peuvent être effectuées avec la commande suivante :

```bash
npx eslint index.js
```

Il est recommandé de créer un script _npm_ séparé pour le linting :

```json
{
  // ...
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js",
    // ...
    "lint": "eslint ." // highlight-line
  },
  // ...
}
```

Maintenant, la commande _npm run lint_ vérifiera chaque fichier du projet.


Les fichiers du répertoire <em>build</em> seront également vérifiés lors de l'exécution de la commande. Nous ne voulons pas que cela se produise, et nous pouvons y parvenir en créant un fichier [.eslintignore](https://eslint.org/docs/user-guide/configuring#ignoring-files-and-directories) à la racine du projet avec le contenu suivant :

```bash
build
```

Cela fait en sorte que le répertoire entier <em>build</em> ne soit pas vérifié par ESlint.

Lint a beaucoup de choses à dire sur notre code :

![](../../images/3/53ea.png)

Ne corrigeons pas ces problèmes pour l'instant.

Une meilleure alternative à l'exécution du linter depuis la ligne de commande est de configurer un <i>eslint-plugin</i> à l'éditeur, qui exécute le linter en continu. En utilisant le plugin, vous verrez immédiatement les erreurs dans votre code. Vous pouvez trouver plus d'informations sur le plugin ESLint de Visual Studio [ici](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint).


Le plugin VS Code ESlint soulignera les violations de style par une ligne rouge :

![](../../images/3/54a.png)


Cela permet de repérer facilement les erreurs et de les corriger immédiatement.


ESlint dispose d'une vaste gamme de [règles](https://eslint.org/docs/rules/) qu'il est facile de mettre en œuvre en modifiant le fichier <i>.eslintrc.js</i>.


Ajoutons la règle [eqeqeq](https://eslint.org/docs/rules/eqeqeq) qui nous avertit, si l'égalité est vérifiée avec autre chose que l'opérateur triple égal. La règle est ajoutée sous le champ <i>rules</i> dans le fichier de configuration.

```js
{
  // ...
  'rules': {
    // ...
   'eqeqeq': 'error',
  },
}
```

Pendant que nous y sommes, apportons quelques autres modifications aux règles.

Empêchons les [espaces de fin](https://eslint.org/docs/rules/no-trailing-spaces) inutiles en fin de ligne, exigeons qu'[il y ait toujours un espace avant et après les accolades](https://eslint.org/docs/rules/object-curly-spacing), et exigeons également une utilisation cohérente des espaces dans les paramètres des fonctions flèches.

```js
{
  // ...
  'rules': {
    // ...
    'eqeqeq': 'error',
    'no-trailing-spaces': 'error',
    'object-curly-spacing': [
        'error', 'always'
    ],
    'arrow-spacing': [
        'error', { 'before': true, 'after': true }
    ]
  },
}
```


Notre configuration par défaut utilise un ensemble de règles prédéterminées provenant de <i>eslint:recommended</i> :

```bash
'extends': 'eslint:recommended',
```


Cela inclut une règle qui met en garde contre les commandes _console.log_. La [désactivation](https://eslint.org/docs/user-guide/configuring#configuring-rules) d'une règle peut être accomplie en définissant sa "valeur" comme 0 dans le fichier de configuration. Faisons cela pour la règle <i>no-console</i> en attendant.

```js
{
  // ...
  'rules': {
    // ...
    'eqeqeq': 'error',
    'no-trailing-spaces': 'error',
    'object-curly-spacing': [
        'error', 'always'
    ],
    'arrow-spacing': [
        'error', { 'before': true, 'after': true }
    ],
    'no-console': 0 // highlight-line
  },
}
```

**NB** lorsque vous apportez des modifications au fichier <i>.eslintrc.js</i>, il est recommandé d'exécuter le linter depuis la ligne de commande. Cela permettra de vérifier que le fichier de configuration est correctement formaté :

![](../../images/3/55.png)


Si quelque chose ne va pas dans votre fichier de configuration, le plugin lint peut se comporter de manière assez erratique.

De nombreuses entreprises définissent des normes de codage qui sont appliquées dans toute l'organisation par le biais du fichier de configuration ESlint. Il n'est pas recommandé de réinventer la roue encore et encore, et cela peut être une bonne idée d'adopter une configuration prête à l'emploi du projet de quelqu'un d'autre dans le vôtre. Récemment, de nombreux projets ont adopté le [guide de style Javascript](https://github.com/airbnb/javascript) d'Airbnb en utilisant la configuration [ESlint](https://github.com/airbnb/javascript/tree/master/packages/eslint-config-airbnb) d'Airbnb.

Vous pouvez trouver le code de notre application actuelle dans son intégralité dans la branche <i>part3-7</i> de [ce dépôt GitHub](https://github.com/fullstack-hy2020/part3-notes-backend/tree/part3-7). 
</div>

<div class="tasks">

### Exercice 3.22.

#### 3.22 : configuration de Lint

Ajoutez ESlint à votre application et corrigez tous les avertissements.

C'était le dernier exercice de cette partie du cours. Il est temps de pousser votre code sur GitHub et de marquer tous vos exercices terminés sur le [système de soumission des exercices](https://studies.cs.helsinki.fi/stats/courses/fullstackopen).

</div>
