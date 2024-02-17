---
mainImage: ../../../images/part-5.svg
part: 5
letter: d
lang: fr
---

<div class="content">

Jusqu'à présent, nous avons testé le backend dans son ensemble au niveau de l'API en utilisant des tests d'intégration et testé certains composants frontend en utilisant des tests unitaires.

Ensuite, nous examinerons une manière de tester le [système dans son ensemble](https://en.wikipedia.org/wiki/System_testing) en utilisant des tests <i>End to End</i> (E2E).

Nous pouvons effectuer des tests E2E d'une application web en utilisant un navigateur et une bibliothèque de tests. Il existe plusieurs bibliothèques disponibles. Un exemple est [Selenium](http://www.seleniumhq.org/), qui peut être utilisé avec presque tous les navigateurs.
Une autre option de navigateur est ce qu'on appelle les [navigateurs sans tête](https://en.wikipedia.org/wiki/Headless_browser), qui sont des navigateurs sans interface graphique utilisateur.
Par exemple, Chrome peut être utilisé en mode sans tête.

Les tests E2E sont potentiellement la catégorie de tests la plus utile car ils testent le système via la même interface que celle utilisée par les vrais utilisateurs.

Ils présentent toutefois certains inconvénients. Configurer des tests E2E est plus difficile que les tests unitaires ou d'intégration. Ils tendent également à être assez lents, et avec un grand système, leur temps d'exécution peut être de minutes ou même d'heures. Cela est mauvais pour le développement car pendant la codification, il est bénéfique de pouvoir exécuter des tests aussi souvent que possible en cas de [régressions](https://en.wikipedia.org/wiki/Regression_testing) de code.

Les tests E2E peuvent également être [instables](https://hackernoon.com/flaky-tests-a-war-that-never-ends-9aa32fdef359).
Certains tests peuvent réussir une fois et échouer une autre, même si le code ne change pas du tout.

### Cypress

La bibliothèque E2E [Cypress](https://www.cypress.io/) est devenue populaire au cours de la dernière année. Cypress est exceptionnellement facile à utiliser et, comparé à Selenium, par exemple, il nécessite beaucoup moins de tracas et de maux de tête.
Son principe de fonctionnement est radicalement différent de celui de la plupart des bibliothèques de tests E2E parce que les tests Cypress sont exécutés entièrement dans le navigateur.
D'autres bibliothèques exécutent les tests dans un processus Node, qui est connecté au navigateur via une API.

Faisons quelques tests de bout en bout pour notre application de notes.

Nous commençons par installer Cypress dans <i>le frontend</i> en tant que dépendance de développement

```js
npm install --save-dev cypress
```

et en ajoutant un script npm pour l'exécuter:

```js
{
  // ...
  "scripts": {
    "dev": "vite --host",  // highlight-line
    "build": "vite build",
    "lint": "eslint . --ext js,jsx --report-unused-disable-directives --max-warnings 0",
    "preview": "vite preview",
    "server": "json-server -p3001 --watch db.json",
    "test": "jest",
    "cypress:open": "cypress open"  // highlight-line
  },
  // ...
}
```

Nous avons également apporté un petit changement au script qui démarre l'application, sans ce changement Cypress ne peut pas accéder à l'appli.

Contrairement aux tests unitaires du frontend, les tests Cypress peuvent se trouver dans le dépôt du frontend ou du backend, ou même dans leur propre dépôt séparé.

Les tests nécessitent que le système testé soit en cours d'exécution. Contrairement à nos tests d'intégration backend, les tests Cypress <i>ne démarrent pas</i> le système lorsqu'ils sont exécutés.

Ajoutons un script npm à <i>backend</i> qui le démarre en mode test, ou de manière à ce que <i>NODE\_ENV</i> soit <i>test</i>.

```js
{
  // ...
  "scripts": {
    "start": "NODE_ENV=production node index.js",
    "dev": "NODE_ENV=development nodemon index.js",
    "build:ui": "rm -rf build && cd ../frontend/ && npm run build && cp -r build ../backend",
    "deploy": "fly deploy",
    "deploy:full": "npm run build:ui && npm run deploy",
    "logs:prod": "fly logs",
    "lint": "eslint .",
    "test": "jest --verbose --runInBand",
    "start:test": "NODE_ENV=test node index.js" // highlight-line
  },
  // ...
}
```

**NB** Pour que Cypress fonctionne avec WSL2, il peut être nécessaire d'effectuer d'abord quelques configurations supplémentaires. Ces deux [liens](https://docs.cypress.io/guides/getting-started/installing-cypress#Windows-Subsystem-for-Linux) sont de bons points de [départ](https://nickymeuleman.netlify.app/blog/gui-on-wsl2-cypress).

Lorsque le backend et le frontend sont en cours d'exécution, nous pouvons démarrer Cypress avec la commande

```js
npm run cypress:open
```

Cypress demande quel type de tests nous effectuons. Choisissons "E2E Testing" (Tests E2E):

![flèche cypress vers l'option de test e2e](../../images/5/51new.png)

Ensuite, un navigateur est sélectionné (par exemple, Chrome) et nous cliquons sur "Create new spec" (Créer une nouvelle spécification):

![créer une nouvelle spécification avec une flèche pointant vers celle-ci](../../images/5/52new.png)

Créons le fichier de test <i>cypress/e2e/note\_app.cy.js</i>:

![cypress avec le chemin cypress/e2e/note_app.cy.js](../../images/5/53new.png)

Nous pourrions modifier les tests dans Cypress, mais utilisons plutôt VS Code:

![vscode montrant les modifications du test et cypress montrant la spécification ajoutée](../../images/5/54new.png)

Nous pouvons maintenant fermer la vue d'édition de Cypress.

Changeons le contenu du test comme suit:

```js
describe('Note app', function() {
  it('front page can be opened', function() {
    cy.visit('http://localhost:5173')
    cy.contains('Notes')
    cy.contains('Note app, Department of Computer Science, University of Helsinki 2023')
  })
})
```

Le test est exécuté en cliquant sur le test dans Cypress:

L'exécution du test montre comment l'application se comporte pendant l'exécution du test:

![cypress montrant l'automatisation du test de note](../../images/5/56new.png)

La structure du test devrait vous sembler familière. Ils utilisent des blocs <i>describe</i> pour regrouper différents cas de test, tout comme Jest. Les cas de test ont été définis avec la méthode <i>it</i>. Cypress a emprunté ces parties à la bibliothèque de tests [Mocha](https://mochajs.org/) qu'il utilise en interne.

[cy.visit](https://docs.cypress.io/api/commands/visit.html) et [cy.contains](https://docs.cypress.io/api/commands/contains.html) sont des commandes Cypress, et leur but est assez évident.
[cy.visit](https://docs.cypress.io/api/commands/visit.html) ouvre l'adresse web qui lui est donnée en paramètre dans le navigateur utilisé par le test. [cy.contains](https://docs.cypress.io/api/commands/contains.html) recherche la chaîne qu'il a reçue en paramètre sur la page.

Nous aurions pu déclarer le test en utilisant une fonction fléchée

```js
describe('Note app', () => { // highlight-line
  it('front page can be opened', () => { // highlight-line
    cy.visit('http://localhost:5173')
    cy.contains('Notes')
    cy.contains('Note app, Department of Computer Science, University of Helsinki 2023')
  })
})
```

Cependant, Mocha [recommande](https://mochajs.org/#arrow-functions) de ne pas utiliser de fonctions fléchées, car elles pourraient causer certains problèmes dans certaines situations.

Si <i>cy.contains</i> ne trouve pas le texte qu'il recherche, le test ne passe pas. Donc, si nous étendons notre test ainsi

```js
describe('Note app', function() {
  it('front page can be opened',  function() {
    cy.visit('http://localhost:5173')
    cy.contains('Notes')
    cy.contains('Note app, Department of Computer Science, University of Helsinki 2023')
  })

// highlight-start
  it('front page contains random text', function() {
    cy.visit('http://localhost:5173')
    cy.contains('wtf is this app?')
  })
// highlight-end
})
```

le test échoue

![cypress montrant l'échec s'attendant à trouver wtf mais non](../../images/5/57new.png)

Supprimons le code qui échoue du test.

La variable _cy_ que nos tests utilisent nous donne une vilaine erreur Eslint

![capture d'écran vscode montrant cy n'est pas défini](../../images/5/58new.png)

Nous pouvons nous en débarrasser en installant [eslint-plugin-cypress](https://github.com/cypress-io/eslint-plugin-cypress) en tant que dépendance de développement

```js
npm install eslint-plugin-cypress --save-dev
```

et en changeant la configuration dans <i>.eslintrc.cjs</i> comme suit:

```js
module.exports = {
  "env": {
    browser: true,
    es2020: true,
    "jest/globals": true,
    "cypress/globals": true // highlight-line
  },
  "extends": [ 
    // ...
  ],
  "parserOptions": {
    // ...
  },
  "plugins": [
      "react", "jest", "cypress" // highlight-line
  ],
  "rules": {
    // ...
  }
}
```

### Écrire dans un formulaire

Étendons nos tests de manière à ce que le test essaie de se connecter à notre application.
Nous supposons que notre backend contient un utilisateur avec le nom d'utilisateur <i>mluukkai</i> et le mot de passe <i>salainen</i>.

Le test commence par ouvrir le formulaire de connexion.

```js
describe('Note app',  function() {
  // ...

  it('login form can be opened', function() {
    cy.visit('http://localhost:5173')
    cy.contains('log in').click()
  })
})
```

Le test recherche d'abord le bouton de connexion par son texte et clique sur le bouton avec la commande [cy.click](https://docs.cypress.io/api/commands/click.html#Syntax).

Comme nos deux tests commencent de la même manière, par l'ouverture de la page <i><http://localhost:5173></i>, nous devrions séparer la partie commune dans un bloc <i>beforeEach</i> exécuté avant chaque test:

```js
describe('Note app', function() {
  // highlight-start
  beforeEach(function() {
    cy.visit('http://localhost:5173')
  })
  // highlight-end

  it('front page can be opened', function() {
    cy.contains('Notes')
    cy.contains('Note app, Department of Computer Science, University of Helsinki 2023')
  })

  it('login form can be opened', function() {
    cy.contains('log in').click()
  })
})
```

Le champ de connexion contient deux champs <i>input</i>, dans lesquels le test devrait écrire.

La commande [cy.get](https://docs.cypress.io/api/commands/get.html#Syntax) permet de rechercher des éléments par sélecteurs CSS.

Nous pouvons accéder au premier et au dernier champ de saisie sur la page, et y écrire avec la commande [cy.type](https://docs.cypress.io/api/commands/type.html#Syntax) comme suit:

```js
it('user can login', function () {
  cy.contains('log in').click()
  cy.get('input:first').type('mluukkai')
  cy.get('input:last').type('salainen')
})  
```

Le test fonctionne. Le problème est que si nous ajoutons plus tard d'autres champs de saisie, le test échouera car il s'attend à ce que les champs dont il a besoin soient le premier et le dernier sur la page.

Il serait préférable de donner à nos entrées des <i>ids</i> uniques et de les utiliser pour les trouver.
Nous modifions notre formulaire de connexion comme suit:

```js
const LoginForm = ({ ... }) => {
  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          username
          <input
            id='username'  // highlight-line
            value={username}
            onChange={handleUsernameChange}
          />
        </div>
        <div>
          password
          <input
            id='password' // highlight-line
            type="password"
            value={password}
            onChange={handlePasswordChange}
          />
        </div>
        <button id="login-button" type="submit"> // highlight-line
          login
        </button>
      </form>
    </div>
  )
}
```

Nous avons également ajouté un id à notre bouton de soumission afin de pouvoir y accéder dans nos tests.

Le test devient:

```js
describe('Note app',  function() {
  // ..
  it('user can log in', function() {
    cy.contains('log in').click()
    cy.get('#username').type('mluukkai')  // highlight-line    
    cy.get('#password').type('salainen')  // highlight-line
    cy.get('#login-button').click()  // highlight-line

    cy.contains('Matti Luukkainen logged in') // highlight-line
  })
})
```

La dernière ligne assure que la connexion a été réussie.

Notez que le [sélecteur d'id](https://developer.mozilla.org/en-US/docs/Web/CSS/ID_selectors) CSS est #, donc si nous voulons rechercher un élément avec l'id <i>username</i>, le sélecteur CSS est <i>#username</i>.

Veuillez noter que réussir le test à ce stade nécessite qu'il y ait un utilisateur dans la base de données de test de l'environnement backend dont le nom d'utilisateur est <i>mluukkai</i> et le mot de passe est <i>salainen</i>. Créez un utilisateur si nécessaire !

### Tester le formulaire de nouvelle note

Ajoutons ensuite des méthodes de test pour tester la fonctionnalité "nouvelle note":

```js
describe('Note app', function() {
  // ..
  // highlight-start
  describe('when logged in', function() {
    beforeEach(function() {
      cy.contains('log in').click()
      cy.get('input:first').type('mluukkai')
      cy.get('input:last').type('salainen')
      cy.get('#login-button').click()
    })
    // highlight-end

    // highlight-start
    it('a new note can be created', function() {
      cy.contains('new note').click()
      cy.get('input').type('a note created by cypress')
      cy.contains('save').click()

      cy.contains('a note created by cypress')
    })
  })
  // highlight-end
})
```

Le test a été défini dans son propre bloc <i>describe</i>.
Seuls les utilisateurs connectés peuvent créer de nouvelles notes, donc nous avons ajouté la connexion à l'application dans un bloc <i>beforeEach</i>.

Le test suppose que lors de la création d'une nouvelle note, la page contient un seul champ de saisie, donc il le recherche comme suit:

```js
cy.get('input')
```

Si la page contenait plus d'entrées, le test échouerait

![erreur cypress - cy.type ne peut être appelé que sur un seul élément](../../images/5/31x.png)

À cause de ce problème, il serait à nouveau préférable de donner un <i>id</i> à l'entrée et de rechercher l'élément par son id.

La structure des tests ressemble à ceci:

```js
describe('Note app', function() {
  // ...

  it('user can log in', function() {
    cy.contains('log in').click()
    cy.get('#username').type('mluukkai')
    cy.get('#password').type('salainen')
    cy.get('#login-button').click()

    cy.contains('Matti Luukkainen logged in')
  })

  describe('when logged in', function() {
    beforeEach(function() {
      cy.contains('log in').click()
      cy.get('input:first').type('mluukkai')
      cy.get('input:last').type('salainen')
      cy.get('#login-button').click()
    })

    it('a new note can be created', function() {
      // ...
    })
  })
})
```

Cypress exécute les tests dans l'ordre où ils figurent dans le code. Ainsi, il exécute d'abord <i>user can log in</i> (l'utilisateur peut se connecter), où l'utilisateur se connecte. Ensuite, Cypress exécutera <i>a new note can be created</i> (une nouvelle note peut être créée) pour lequel un bloc <i>beforeEach</i> se connecte également.
Pourquoi faire cela ? L'utilisateur n'est-il pas déjà connecté après le premier test?
Non, car <i>chaque</i> test commence de zéro en ce qui concerne le navigateur.
Tous les changements dans l'état du navigateur sont réinitialisés après chaque test.

### Contrôler l'état de la base de données

Si les tests doivent pouvoir modifier la base de données du serveur, la situation devient immédiatement plus compliquée. Idéalement, la base de données du serveur devrait être la même chaque fois que nous exécutons les tests, pour que nos tests puissent être fiables et facilement répétables.

Comme avec les tests unitaires et d'intégration, avec les tests E2E, il est préférable de vider la base de données et éventuellement de la formater avant l'exécution des tests. Le défi avec les tests E2E est qu'ils n'ont pas accès à la base de données.

La solution est de créer des points d'API pour les tests backend.
Nous pouvons vider la base de données en utilisant ces points d'API.
Créons un nouveau routeur pour les tests à l'intérieur du dossier <i>controllers</i>, dans le fichier <i>testing.js</i>

```js
const testingRouter = require('express').Router()
const Note = require('../models/note')
const User = require('../models/user')

testingRouter.post('/reset', async (request, response) => {
  await Note.deleteMany({})
  await User.deleteMany({})

  response.status(204).end()
})

module.exports = testingRouter
```

et l'ajouter au backend <i>uniquement si l'application est exécutée en mode test</i>:

```js
// ...

app.use('/api/login', loginRouter)
app.use('/api/users', usersRouter)
app.use('/api/notes', notesRouter)

// highlight-start
if (process.env.NODE_ENV === 'test') {
  const testingRouter = require('./controllers/testing')
  app.use('/api/testing', testingRouter)
}
// highlight-end

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app
```

Après les modifications, une requête HTTP POST vers le point de terminaison <i>/api/testing/reset</i> vide la base de données. Assurez-vous que votre backend est exécuté en mode test en le démarrant avec cette commande (préalablement configurée dans le fichier package.json):

```js
  npm run start:test
```

Le code backend modifié peut être trouvé sur la branche [GitHub](https://github.com/fullstack-hy2020/part3-notes-backend/tree/part5-1) <i>part5-1</i>.

Ensuite, nous allons modifier le bloc <i>beforeEach</i> de sorte qu'il vide la base de données du serveur avant l'exécution des tests.

Actuellement, il n'est pas possible d'ajouter de nouveaux utilisateurs via l'interface utilisateur du frontend, donc nous ajoutons un nouvel utilisateur au backend depuis le bloc beforeEach.

```js
describe('Note app', function() {
   beforeEach(function() {
    // highlight-start
    cy.request('POST', 'http://localhost:3001/api/testing/reset')
    const user = {
      name: 'Matti Luukkainen',
      username: 'mluukkai',
      password: 'salainen'
    }
    cy.request('POST', 'http://localhost:3001/api/users/', user) 
    // highlight-end
    cy.visit('http://localhost:5173')
  })
  
  it('front page can be opened', function() {
    // ...
  })

  it('user can login', function() {
    // ...
  })

  describe('when logged in', function() {
    // ...
  })
})
```

Lors du formatage, le test effectue des requêtes HTTP vers le backend avec [cy.request](https://docs.cypress.io/api/commands/request.html).

Contrairement à avant, maintenant, les tests commencent avec le backend dans le même état à chaque fois. Le backend contiendra un utilisateur et aucune note.

Ajoutons un autre test pour vérifier que nous pouvons changer l'importance des notes.

Il y a quelque temps, nous avons modifié le frontend de sorte qu'une nouvelle note soit importante par défaut, ou que le champ <i>important</i> soit <i>true</i>:

```js
const NoteForm = ({ createNote }) => {
  // ...

  const addNote = (event) => {
    event.preventDefault()
    createNote({
      content: newNote,
      important: true // highlight-line
    })

    setNewNote('')
  }
  // ...
} 
```

Il existe plusieurs manières de tester cela. Dans l'exemple suivant, nous recherchons d'abord une note et cliquons sur son bouton <i>rendre non important</i>. Ensuite, nous vérifions que la note contient maintenant un bouton <i>rendre important</i>.

```js
describe('Note app', function() {
  // ...

  describe('when logged in', function() {
    // ...

    describe('and a note exists', function () {
      beforeEach(function () {
        cy.contains('new note').click()
        cy.get('input').type('another note cypress')
        cy.contains('save').click()
      })

      it('it can be made not important', function () {
        cy.contains('another note cypress')
          .contains('make not important')
          .click()

        cy.contains('another note cypress')
          .contains('make important')
      })
    })
  })
})
```

La première commande recherche un composant contenant le texte <i>another note cypress</i>, puis un bouton <i>rendre non important</i> à l'intérieur. Elle clique ensuite sur le bouton.

La deuxième commande vérifie que le texte sur le bouton a changé en <i>rendre important</i>.

Les tests et le code frontend actuel peuvent être trouvés sur la branche [GitHub](https://github.com/fullstack-hy2020/part2-notes-frontend/tree/part5-9) <i>part5-9</i>.

### Test d'échec de connexion

Faisons un test pour s'assurer qu'une tentative de connexion échoue si le mot de passe est incorrect.

Par défaut, Cypress exécutera tous les tests chaque fois, et à mesure que le nombre de tests augmente, cela commence à devenir assez chronophage.
Lors du développement d'un nouveau test ou lors du débogage d'un test en échec, nous pouvons définir le test avec <i>it.only</i> au lieu de <i>it</i>, de sorte que Cypress n'exécute que le test requis.
Lorsque le test fonctionne, nous pouvons retirer <i>.only</i>.

La première version de nos tests est la suivante:

```js
describe('Note app', function() {
  // ...

  it.only('login fails with wrong password', function() {
    cy.contains('log in').click()
    cy.get('#username').type('mluukkai')
    cy.get('#password').type('wrong')
    cy.get('#login-button').click()

    cy.contains('wrong credentials')
  })

  // ...
)}
```

Le test utilise [cy.contains](https://docs.cypress.io/api/commands/contains.html#Syntax) pour s'assurer que l'application affiche un message d'erreur.

L'application rend le message d'erreur dans un composant avec la classe CSS <i>error</i>:

```js
const Notification = ({ message }) => {
  if (message === null) {
    return null
  }

  return (
    <div className="error"> // highlight-line
      {message}
    </div>
  )
}
```

Nous pourrions faire en sorte que le test s'assure que le message d'erreur est rendu dans le composant correct, c'est-à-dire, le composant avec la classe CSS <i>error</i>:

```js
it('login fails with wrong password', function() {
  // ...

  cy.get('.error').contains('wrong credentials') // highlight-line
})
```

D'abord, nous utilisons [cy.get](https://docs.cypress.io/api/commands/get.html#Syntax) pour rechercher un composant avec la classe CSS <i>error</i>. Ensuite, nous vérifions que le message d'erreur peut être trouvé dans ce composant.
Notez que le [sélecteur de classe CSS](https://developer.mozilla.org/en-US/docs/Web/CSS/Class_selectors) commence par un point, donc le sélecteur pour la classe <i>error</i> est <i>.error</i>.

Nous pourrions faire la même chose en utilisant la syntaxe [should](https://docs.cypress.io/api/commands/should.html):

```js
it('login fails with wrong password', function() {
  // ...

  cy.get('.error').should('contain', 'wrong credentials') // highlight-line
})
```

Utiliser should est un peu plus délicat que d'utiliser <i>contains</i>, mais cela permet des tests plus divers que <i>contains</i>, qui fonctionne uniquement sur la base du contenu textuel.

Une liste des assertions les plus courantes qui peuvent être utilisées avec _should_ peut être trouvée [ici](https://docs.cypress.io/guides/references/assertions.html#Common-Assertions).

Nous pouvons, par exemple, nous assurer que le message d'erreur est rouge et qu'il a une bordure:

```js
it('login fails with wrong password', function() {
  // ...

  cy.get('.error').should('contain', 'wrong credentials') 
  cy.get('.error').should('have.css', 'color', 'rgb(255, 0, 0)')
  cy.get('.error').should('have.css', 'border-style', 'solid')
})
```

Cypress exige que les couleurs soient données en [rgb](https://rgbcolorcode.com/color/red).

Puisque tous les tests concernent le même composant auquel nous avons accédé en utilisant [cy.get](https://docs.cypress.io/api/commands/get.html#Syntax), nous pouvons les enchaîner en utilisant [and](https://docs.cypress.io/api/commands/and.html).

```js
it('login fails with wrong password', function() {
  // ...

  cy.get('.error')
    .should('contain', 'wrong credentials')
    .and('have.css', 'color', 'rgb(255, 0, 0)')
    .and('have.css', 'border-style', 'solid')
})
```

Terminons le test de sorte qu'il vérifie également que l'application ne rend pas le message de succès <i>'Matti Luukkainen connecté'</i>:

```js
it('login fails with wrong password', function() {
  cy.contains('log in').click()
  cy.get('#username').type('mluukkai')
  cy.get('#password').type('wrong')
  cy.get('#login-button').click()

  cy.get('.error')
    .should('contain', 'wrong credentials')
    .and('have.css', 'color', 'rgb(255, 0, 0)')
    .and('have.css', 'border-style', 'solid')

  cy.get('html').should('not.contain', 'Matti Luukkainen logged in') // highlight-line
})
```

La commande <i>should</i> est le plus souvent utilisée en la chaînant après la commande <i>get</i> (ou une autre commande similaire qui peut être enchaînée). Le <i>cy.get('html')</i> utilisé dans le test signifie pratiquement le contenu visible de toute l'application.

Nous pourrions également vérifier la même chose en chaînant la commande <i>contains</i> avec la commande <i>should</i> avec un paramètre légèrement différent:

```js
cy.contains('Matti Luukkainen logged in').should('not.exist')
```

**REMARQUE:** Certaines propriétés CSS se [comportent différemment sur Firefox](https://github.com/cypress-io/cypress/issues/9349). Si vous exécutez les tests avec Firefox:

![running](https://user-images.githubusercontent.com/4255997/119015927-0bdff800-b9a2-11eb-9234-bb46d72c0368.png)

alors les tests qui impliquent, par exemple, `border-style`, `border-radius` et `padding`, passeront dans Chrome ou Electron, mais échoueront dans Firefox :

![borderstyle](https://user-images.githubusercontent.com/4255997/119016340-7b55e780-b9a2-11eb-82e0-bab0418244c0.png)

### Contournement de l'UI

Actuellement, nous avons les tests suivants:

```js
describe('Note app', function() {
  it('user can login', function() {
    cy.contains('log in').click()
    cy.get('#username').type('mluukkai')
    cy.get('#password').type('salainen')
    cy.get('#login-button').click()

    cy.contains('Matti Luukkainen logged in')
  })

  it('login fails with wrong password', function() {
    // ...
  })

  describe('when logged in', function() {
    beforeEach(function() {
      cy.contains('log in').click()
      cy.get('input:first').type('mluukkai')
      cy.get('input:last').type('salainen')
      cy.get('#login-button').click()
    })

    it('a new note can be created', function() {
      // ... 
    })
   
  })
})
```

D'abord, nous testons la connexion. Ensuite, dans leur propre bloc <i>describe</i>, nous avons un ensemble de tests, qui supposent que l'utilisateur est connecté. L'utilisateur est connecté dans le bloc <i>beforeEach</i>.

Comme nous l'avons dit ci-dessus, chaque test commence à zéro! Les tests ne commencent pas à partir de l'état où les tests précédents se sont terminés.

La documentation de Cypress nous donne le conseil suivant: [Tester complètement le flux de connexion – mais une seule fois](https://docs.cypress.io/guides/end-to-end-testing/testing-your-app#Fully-test-the-login-flow-but-only-once).
Donc, au lieu de connecter un utilisateur en utilisant le formulaire dans le bloc <i>beforeEach</i>, Cypress recommande de [contourner l'UI](https://docs.cypress.io/guides/getting-started/testing-your-app.html#Bypassing-your-UI) et de faire une requête HTTP au backend pour se connecter. La raison en est que se connecter avec une requête HTTP est beaucoup plus rapide que de remplir un formulaire.

Notre situation est un peu plus compliquée que dans l'exemple de la documentation de Cypress car, lorsqu'un utilisateur se connecte, notre application sauvegarde ses détails dans le localStorage.
Cependant, Cypress peut également gérer cela.
Le code est le suivant

```js
describe('when logged in', function() {
  beforeEach(function() {
    // highlight-start
    cy.request('POST', 'http://localhost:3001/api/login', {
      username: 'mluukkai', password: 'salainen'
    }).then(response => {
      localStorage.setItem('loggedNoteappUser', JSON.stringify(response.body))
      cy.visit('http://localhost:5173')
    })
    // highlight-end
  })

  it('a new note can be created', function() {
    // ...
  })

  // ...
})
```

Nous pouvons accéder à la réponse d'une [cy.request](https://docs.cypress.io/api/commands/request.html) avec la méthode _then_. Sous le capot, <i>cy.request</i>, comme toutes les commandes Cypress, sont des [promesses](https://docs.cypress.io/guides/core-concepts/introduction-to-cypress.html#Commands-Are-Promises).
La fonction de rappel sauvegarde les détails d'un utilisateur connecté dans le localStorage, et recharge la page.
Maintenant, il n'y a aucune différence avec un utilisateur se connectant avec le formulaire de connexion.

Si et lorsque nous écrivons de nouveaux tests pour notre application, nous devons utiliser le code de connexion à plusieurs endroits.
Nous devrions en faire une [commande personnalisée](https://docs.cypress.io/api/cypress-api/custom-commands.html).

Les commandes personnalisées sont déclarées dans <i>cypress/support/commands.js</i>.
Le code pour se connecter est le suivant:

```js
Cypress.Commands.add('login', ({ username, password }) => {
  cy.request('POST', 'http://localhost:3001/api/login', {
    username, password
  }).then(({ body }) => {
    localStorage.setItem('loggedNoteappUser', JSON.stringify(body))
    cy.visit('http://localhost:5173')
  })
})
```

Utiliser notre commande personnalisée est facile, et notre test devient plus clair:

```js
describe('when logged in', function() {
  beforeEach(function() {
    // highlight-start
    cy.login({ username: 'mluukkai', password: 'salainen' })
    // highlight-end
  })

  it('a new note can be created', function() {
    // ...
  })

  // ...
})
```

La même chose s'applique à la création d'une nouvelle note maintenant que nous y pensons. Nous avons un test qui crée une nouvelle note en utilisant le formulaire. Nous créons également une nouvelle note dans le bloc <i>beforeEach</i> du test testant le changement de l'importance d'une note:

```js
describe('Note app', function() {
  // ...

  describe('when logged in', function() {
    it('a new note can be created', function() {
      cy.contains('new note').click()
      cy.get('input').type('a note created by cypress')
      cy.contains('save').click()

      cy.contains('a note created by cypress')
    })

    describe('and a note exists', function () {
      beforeEach(function () {
        cy.contains('new note').click()
        cy.get('input').type('another note cypress')
        cy.contains('save').click()
      })

      it('it can be made important', function () {
        // ...
      })
    })
  })
})
```

Créons une nouvelle commande personnalisée pour créer une nouvelle note. La commande créera une nouvelle note avec une requête HTTP POST:

```js
Cypress.Commands.add('createNote', ({ content, important }) => {
  cy.request({
    url: 'http://localhost:3001/api/notes',
    method: 'POST',
    body: { content, important },
    headers: {
      'Authorization': `Bearer ${JSON.parse(localStorage.getItem('loggedNoteappUser')).token}`
    }
  })

  cy.visit('http://localhost:5173')
})
```

La commande suppose que l'utilisateur est connecté et que les détails de l'utilisateur sont sauvegardés dans le localStorage.

Maintenant, le bloc de formatage devient:

```js
describe('Note app', function() {
  // ...

  describe('when logged in', function() {
    it('a new note can be created', function() {
      // ...
    })

    describe('and a note exists', function () {
      beforeEach(function () {
        // highlight-start
        cy.createNote({
          content: 'another note cypress',
          important: true
        })
        // highlight-end
      })

      it('it can be made important', function () {
        // ...
      })
    })
  })
})
```

Il y a encore une caractéristique ennuyeuse dans nos tests. L'adresse de l'application <i><http://localhost:5173></i> est codée en dur à de nombreux endroits.

Définissons l'<i>baseUrl</i> pour l'application dans le [fichier de configuration](https://docs.cypress.io/guides/references/configuration) pré-généré par Cypress <i>cypress.config.js</i>:

```js
const { defineConfig } = require("cypress")

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
    },
    baseUrl: 'http://localhost:5173' // highlight-line
  },
})
```

Toutes les commandes dans les tests utilisent l'adresse de l'application

```js
cy.visit('http://localhost:5173' )
```

peuvent être transformées en

```js
cy.visit('')
```

L'adresse codée en dur du backend <i><http://localhost:3001></i> est encore dans les tests. La [documentation](https://docs.cypress.io/guides/guides/environment-variables) de Cypress recommande de définir les autres adresses utilisées par les tests comme variables d'environnement.

Étendons le fichier de configuration <i>cypress.config.js</i> comme suit:

```js
const { defineConfig } = require("cypress")

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
    },
    baseUrl: 'http://localhost:5173',
    env: {
      BACKEND: 'http://localhost:3001/api' // highlight-line
    }
  },
})
```

Remplaçons toutes les adresses du backend dans les tests de la manière suivante

```js
describe('Note ', function() {
  beforeEach(function() {

    cy.request('POST', `${Cypress.env('BACKEND')}/testing/reset`) // highlight-line
    const user = {
      name: 'Matti Luukkainen',
      username: 'mluukkai',
      password: 'secret'
    }
    cy.request('POST', `${Cypress.env('BACKEND')}/users`, user) // highlight-line
    cy.visit('')
  })
  // ...
})
```

Les tests et le code frontend peuvent être trouvés sur la branche [GitHub](https://github.com/fullstack-hy2020/part2-notes-frontend/tree/part5-10) <i>part5-10</i>.

### Changer l'importance d'une note

Enfin, examinons le test que nous avons réalisé pour changer l'importance d'une note.
D'abord, nous allons changer le bloc de formatage pour qu'il crée trois notes au lieu d'une:

```js
describe('when logged in', function() {
  describe('and several notes exist', function () {
    beforeEach(function () {
      // highlight-start
      cy.login({ username: 'mluukkai', password: 'salainen' })
      cy.createNote({ content: 'first note', important: false })
      cy.createNote({ content: 'second note', important: false })
      cy.createNote({ content: 'third note', important: false })
      // highlight-end
    })

    it('one of those can be made important', function () {
      cy.contains('second note')
        .contains('make important')
        .click()

      cy.contains('second note')
        .contains('make not important')
    })
  })
})
```

Comment la commande [cy.contains](https://docs.cypress.io/api/commands/contains.html) fonctionne-t-elle réellement ?

Lorsque nous cliquons sur la commande _cy.contains('second note')_ dans le [Test Runner](https://docs.cypress.io/guides/core-concepts/test-runner.html) de Cypress, nous voyons que la commande recherche l'élément contenant le texte <i>second note</i>:

![cypress test runner cliquant sur testbody et second note](../../images/5/34new.png)

En cliquant sur la ligne suivante _.contains('make important')_, nous voyons que le test utilise le bouton 'make important' correspondant à la <i>second note</i>:

![cypress test runner cliquant sur make important](../../images/5/35new.png)

Lorsqu'elles sont enchaînées, la seconde commande <i>contains</i> <i>continue</i> la recherche à partir du composant trouvé par la première commande.

Si nous n'avions pas enchaîné les commandes, et avions écrit à la place:

```js
cy.contains('second note')
cy.contains('make important').click()
```

le résultat aurait été totalement différent. La seconde ligne du test aurait cliqué sur le bouton d'une mauvaise note:

![cypress montrant une erreur et essayant incorrectement de cliquer sur le premier bouton](../../images/5/36new.png)

Lors de l'écriture des tests, vous devriez vérifier dans le test runner que les tests utilisent les bons composants!

Changeons le composant _Note_ pour que le texte de la note soit rendu dans un <i>span</i>.

```js
const Note = ({ note, toggleImportance }) => {
  const label = note.important
    ? 'make not important' : 'make important'

  return (
    <li className='note'>
      <span>{note.content}</span> // highlight-line
      <button onClick={toggleImportance}>{label}</button>
    </li>
  )
}
```

Nos tests échouent ! Comme le révèle le test runner, _cy.contains('second note')_ retourne maintenant le composant contenant le texte, et le bouton n'y est pas.

![cypress montrant que le test est cassé en essayant de cliquer sur rendre important](../../images/5/37new.png)

Une façon de corriger cela est la suivante:

```js
it('one of those can be made important', function () {
  cy.contains('second note').parent().find('button').click()
  cy.contains('second note').parent().find('button')
    .should('contain', 'make not important')
})
```

Dans la première ligne, nous utilisons la commande [parent](https://docs.cypress.io/api/commands/parent.html) pour accéder à l'élément parent de l'élément contenant <i>second note</i> et trouver le bouton à l'intérieur de celui-ci.
Ensuite, nous cliquons sur le bouton et vérifions que le texte dessus change.

Notez que nous utilisons la commande [find](https://docs.cypress.io/api/commands/find.html#Syntax) pour rechercher le bouton. Nous ne pouvons pas utiliser [cy.get](https://docs.cypress.io/api/commands/get.html) ici, car cela recherche toujours dans la <i>totalité</i> de la page et retournerait les 5 boutons sur la page.

Malheureusement, nous avons maintenant un peu de copier-coller dans les tests, car le code pour rechercher le bon bouton est toujours le même.

Dans ce genre de situations, il est possible d'utiliser la commande [as](https://docs.cypress.io/api/commands/as.html):

```js
it('one of those can be made important', function () {
  cy.contains('second note').parent().find('button').as('theButton')
  cy.get('@theButton').click()
  cy.get('@theButton').should('contain', 'make not important')
})
```

Maintenant, la première ligne trouve le bon bouton et utilise <i>as</i> pour le sauvegarder sous le nom <i>theButton</i>. Les lignes suivantes peuvent utiliser l'élément nommé avec <i>cy.get('@theButton')</i>.

### Exécution et débogage des tests

Enfin, quelques notes sur le fonctionnement de Cypress et le débogage de vos tests.

La forme des tests Cypress donne l'impression que les tests sont du code JavaScript normal, et nous pourrions par exemple essayer ceci:

```js
const button = cy.contains('log in')
button.click()
debugger
cy.contains('logout').click()
```

Cela ne fonctionnera cependant pas. Lorsque Cypress exécute un test, il ajoute chaque commande _cy_ à une file d'exécution.
Quand le code de la méthode de test a été exécuté, Cypress exécutera chaque commande dans la file une par une.

Les commandes Cypress retournent toujours _undefined_, donc _button.click()_ dans le code ci-dessus provoquerait une erreur. Une tentative de démarrer le débogueur ne stopperait pas le code entre l'exécution des commandes, mais avant que toute commande ait été exécutée.

Les commandes Cypress sont <i>comme des promesses</i>, donc si nous voulons accéder à leurs valeurs de retour, nous devons le faire en utilisant la commande [then](https://docs.cypress.io/api/commands/then.html).
Par exemple, le test suivant imprimerait le nombre de boutons dans l'application et cliquerait sur le premier bouton:

```js
it('then example', function() {
  cy.get('button').then( buttons => {
    console.log('number of buttons', buttons.length)
    cy.wrap(buttons[0]).click()
  })
})
```

Arrêter l'exécution du test avec le débogueur est [possible](https://docs.cypress.io/api/commands/debug.html). Le débogueur se lance uniquement si la console de développement du test runner de Cypress est ouverte.

La console de développement est très utile pour déboguer vos tests.
Vous pouvez voir les requêtes HTTP effectuées par les tests dans l'onglet Réseau, et l'onglet Console vous montrera des informations sur vos tests:

![console de développement lors de l'exécution de cypress](../../images/5/38new.png)

Jusqu'à présent, nous avons exécuté nos tests Cypress en utilisant le test runner graphique.
Il est également possible de les exécuter [depuis la ligne de commande](https://docs.cypress.io/guides/guides/command-line.html). Il suffit d'ajouter un script npm pour cela:

```js
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject",
    "server": "json-server -p3001 --watch db.json",
    "cypress:open": "cypress open",
    "test:e2e": "cypress run" // highlight-line
  },
```

Maintenant, nous pouvons exécuter nos tests depuis la ligne de commande avec la commande <i>npm run test:e2e</i>

![sortie terminal de l'exécution des tests npm e2e montrant réussi](../../images/5/39new.png)

Notez que des vidéos de l'exécution des tests seront sauvegardées dans <i>cypress/videos/</i>, vous devriez donc probablement ignorer ce répertoire avec git. Il est également possible de [désactiver](https://docs.cypress.io/guides/guides/screenshots-and-videos#Videos) la création de vidéos.

Le frontend et le code de test peuvent être trouvés sur la branche [GitHub](https://github.com/fullstack-hy2020/part2-notes-frontend/tree/part5-11) <i>part5-11</i>.

</div>

<div class="tasks">

### Exercices 5.17.-5.23.

Dans les derniers exercices de cette partie, nous allons réaliser quelques tests E2E pour notre application de blogs.
Le matériel de cette partie devrait être suffisant pour compléter les exercices.
Vous **devez consulter la [documentation](https://docs.cypress.io/guides/overview/why-cypress.html#In-a-nutshell) de Cypress**. C'est probablement la meilleure documentation que j'ai jamais vue pour un projet open source.

Je recommande particulièrement de lire [Introduction à Cypress](https://docs.cypress.io/guides/core-concepts/introduction-to-cypress.html#Cypress-Can-Be-Simple-Sometimes), qui déclare

><i>Ceci est le guide le plus important pour comprendre comment tester avec Cypress. Lisez-le. Comprenez-le.</i>

#### 5.17: tests de bout en bout de la liste des blogs, étape 1

Configurez Cypress pour votre projet. Réalisez un test pour vérifier que l'application affiche par défaut le formulaire de connexion.

La structure du test doit être la suivante:

```js
describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    cy.visit('http://localhost:5173')
  })

  it('Login form is shown', function() {
    // ...
  })
})
```

Le bloc de formatage <i>beforeEach</i> doit vider la base de données en utilisant par exemple la méthode que nous avons utilisée dans le [matériel](/en/part5/end_to_end_testing#controlling-the-state-of-the-database).

#### 5.18: tests de bout en bout de la liste des blogs, étape 2

Réalisez des tests pour la connexion. Testez à la fois les tentatives de connexion réussies et échouées.
Créez un nouvel utilisateur dans le bloc <i>beforeEach</i> pour les tests.

La structure du test s'étend comme suit:

```js
describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3001/api/testing/reset')
    // create here a user to backend
    cy.visit('http://localhost:5173')
  })

  it('Login form is shown', function() {
    // ...
  })

  describe('Login',function() {
    it('succeeds with correct credentials', function() {
      // ...
    })

    it('fails with wrong credentials', function() {
      // ...
    })
  })
})
```

<i>Exercice bonus facultatif</i>: Vérifiez que la notification affichée lors d'une connexion infructueuse est affichée en rouge.

#### 5.19: tests de bout en bout de la liste des blogs, étape 3

Réalisez un test qui vérifie qu'un utilisateur connecté peut créer un nouveau blog.
La structure du test pourrait être la suivante:

```js
describe('Blog app', function() {
  // ...

  describe('When logged in', function() {
    beforeEach(function() {
      // log in user here
    })

    it('A blog can be created', function() {
      // ...
    })
  })

})
```

Le test doit s'assurer qu'un nouveau blog est ajouté à la liste de tous les blogs.

#### 5.20: tests de bout en bout de la liste des blogs, étape 4

Réalisez un test qui confirme que les utilisateurs peuvent aimer un blog.

#### 5.21: tests de bout en bout de la liste des blogs, étape 5

Réalisez un test pour s'assurer que l'utilisateur qui a créé un blog peut le supprimer.

#### 5.22: tests de bout en bout de la liste des blogs, étape 6

Réalisez un test pour s'assurer que seul le créateur peut voir le bouton de suppression d'un blog, et pas les autres.

#### 5.23: tests de bout en bout de la liste des blogs, étape 7

Réalisez un test qui vérifie que les blogs sont ordonnés selon les likes, avec le blog ayant le plus de likes en premier.

<i>Cet exercice est un peu plus compliqué que les précédents.</i> Une solution est d'ajouter une certaine classe pour l'élément qui enveloppe le contenu du blog et d'utiliser la méthode [eq](https://docs.cypress.io/api/commands/eq#Syntax) pour obtenir l'élément du blog à un index spécifique:

```js
cy.get('.blog').eq(0).should('contain', 'The title with the most likes')
cy.get('.blog').eq(1).should('contain', 'The title with the second most likes')
```

Notez que vous pourriez rencontrer des problèmes si vous cliquez plusieurs fois de suite sur un bouton de like. Il se peut que Cypress clique si rapidement qu'il n'ait pas le temps de mettre à jour l'état de l'application entre les clics. Un remède à cela est d'attendre que le nombre de likes se mette à jour entre tous les clics.

C'était le dernier exercice de cette partie, et il est temps de pousser votre code sur GitHub et de marquer les exercices que vous avez complétés dans le [système de soumission des exercices](https://studies.cs.helsinki.fi/stats/courses/fullstackopen).

</div>