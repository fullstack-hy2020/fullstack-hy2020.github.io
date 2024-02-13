---
mainImage: ../../../images/part-5.svg
part: 5
letter: c
lang: fr
---

<div class="content">

Il existe de nombreuses manières différentes de tester les applications React. Examinons-les ensuite.

Les tests seront implémentés avec la même bibliothèque de test [Jest](http://jestjs.io/) développée par Facebook qui a été utilisée dans la partie précédente.

En plus de Jest, nous avons également besoin d'une autre bibliothèque de test qui nous aidera à rendre les composants pour les besoins des tests. L'option actuelle la meilleure pour cela est [react-testing-library](https://github.com/testing-library/react-testing-library) qui a connu une croissance rapide en popularité récemment.

Installons les bibliothèques avec la commande:

```js
npm install --save-dev @testing-library/react @testing-library/jest-dom jest jest-environment-jsdom @babel/preset-env @babel/preset-react
```

Le fichier <i>package.json</i> devrait être étendu comme suit:

```js 
{
  "scripts": {
    // ...
    "test": "jest"
  }
  // ...
  "jest": {
    "testEnvironment": "jsdom"
  }
}
```

Nous avons également besoin du fichier <i>.babelrc</i> avec le contenu suivant:

```js 
{
  "presets": [
    "@babel/preset-env",
    ["@babel/preset-react", { "runtime": "automatic" }]
  ]
}
```

Écrivons d'abord des tests pour le composant qui est responsable de l'affichage d'une note:

```js
const Note = ({ note, toggleImportance }) => {
  const label = note.important
    ? 'make not important'
    : 'make important'

  return (
    <li className='note'> // highlight-line
      {note.content}
      <button onClick={toggleImportance}>{label}</button>
    </li>
  )
}
```

Remarquez que l'élément <i>li</i> possède la classe [CSS](https://react.dev/learn#adding-styles) nommée <i>note</i>, qui pourrait être utilisée pour accéder au composant dans nos tests.

### Rendre le composant pour les tests

Nous écrirons notre test dans le fichier <i>src/components/Note.test.js</i>, qui se trouve dans le même répertoire que le composant lui-même.

Le premier test vérifie que le composant rend le contenu de la note:

```js
import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import Note from './Note'

test('renders content', () => {
  const note = {
    content: 'Component testing is done with react-testing-library',
    important: true
  }

  render(<Note note={note} />)

  const element = screen.getByText('Component testing is done with react-testing-library')
  expect(element).toBeDefined()
})
```

Après la configuration initiale, le test rend le composant avec la fonction [render](https://testing-library.com/docs/react-testing-library/api#render) fournie par la react-testing-library:

```js
render(<Note note={note} />)
```

Normalement, les composants React sont rendus dans le <i>DOM</i>. La méthode render que nous avons utilisée rend les composants dans un format adapté aux tests sans les rendre dans le DOM.

Nous pouvons utiliser l'objet [screen](https://testing-library.com/docs/queries/about#screen) pour accéder au composant rendu. Nous utilisons la méthode [getByText](https://testing-library.com/docs/queries/bytext) de screen pour rechercher un élément qui contient le contenu de la note et nous assurer qu'il existe:

```js
  const element = screen.getByText('Component testing is done with react-testing-library')
  expect(element).toBeDefined()
```

Exécutez le test avec la commande _npm test_:

```js
$ npm test

> notes-frontend@0.0.0 test
> jest

 PASS  src/components/Note.test.js
  ✓ renders content (15 ms)

Test Suites: 1 passed, 1 total
Tests:       1 passed, 1 total
Snapshots:   0 total
Time:        1.152 s
```

Comme prévu, le test passe.

**NB:** la console peut émettre un avertissement si vous n'avez pas installé Watchman. Watchman est une application développée par Facebook qui surveille les modifications apportées aux fichiers. Le programme accélère l'exécution des tests et au moins à partir de macOS Sierra, l'exécution des tests en mode watch émet quelques avertissements dans la console, qui peuvent être supprimés en installant Watchman.

Les instructions pour installer Watchman sur différents systèmes d'exploitation peuvent être trouvées sur le site officiel de Watchman: <https://facebook.github.io/watchman/>

### Emplacement du fichier de test

En React, il existe (au moins) [deux conventions différentes](https://medium.com/@JeffLombardJr/organizing-tests-in-jest-17fc431ff850) pour l'emplacement du fichier de test. Nous avons créé nos fichiers de test selon la norme actuelle en les plaçant dans le même répertoire que le composant testé.

L'autre convention consiste à stocker les fichiers de test "normalement" dans un répertoire _test_ séparé. Quelle que soit la convention que nous choisissons, il est presque garanti qu'elle sera considérée comme incorrecte selon l'opinion de quelqu'un.

Je n'aime pas cette manière de stocker les tests et le code de l'application dans le même répertoire. La raison pour laquelle nous choisissons de suivre cette convention est qu'elle est configurée par défaut dans les applications créées par Vite ou create-react-app.

### Rechercher du contenu dans un composant

Le paquet react-testing-library offre de nombreuses manières différentes d'investiguer le contenu du composant testé. En réalité, le _expect_ dans notre test n'est pas nécessaire du tout

```js
import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import Note from './Note'

test('renders content', () => {
  const note = {
    content: 'Component testing is done with react-testing-library',
    important: true
  }

  render(<Note note={note} />)

  const element = screen.getByText('Component testing is done with react-testing-library')

  expect(element).toBeDefined() // highlight-line
})
```

Le test échoue si _getByText_ ne trouve pas l'élément qu'il recherche.

Nous pourrions également utiliser les [sélecteurs CSS](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors) pour trouver les éléments rendus en utilisant la méthode [querySelector](https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector) de l'objet [container](https://testing-library.com/docs/react-testing-library/api/#container-1) qui est l'un des champs retournés par le rendu:

```js
import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import Note from './Note'

test('renders content', () => {
  const note = {
    content: 'Component testing is done with react-testing-library',
    important: true
  }

  const { container } = render(<Note note={note} />) // highlight-line

// highlight-start
  const div = container.querySelector('.note')
  expect(div).toHaveTextContent(
    'Component testing is done with react-testing-library'
  )
  // highlight-end
})
```

**NB:** Une manière plus cohérente de sélectionner des éléments consiste à utiliser un [attribut data](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/data-*) qui est spécifiquement défini à des fins de test. En utilisant _react-testing-library_, nous pouvons tirer parti de la méthode [getByTestId](https://testing-library.com/docs/queries/bytestid/) pour sélectionner des éléments avec un attribut _data-testid_ spécifié.

### Déboguer les tests

Nous rencontrons généralement de nombreux types de problèmes différents lors de la rédaction de nos tests.

L'objet _screen_ a la méthode [debug](https://testing-library.com/docs/dom-testing-library/api-debugging#screendebug) qui peut être utilisée pour imprimer le HTML d'un composant dans le terminal. Si nous modifions le test comme suit:

```js
import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import Note from './Note'

test('renders content', () => {
  const note = {
    content: 'Component testing is done with react-testing-library',
    important: true
  }

  render(<Note note={note} />)

  screen.debug() // highlight-line

  // ...

})
```

le HTML est imprimé dans la console:

```js
console.log
  <body>
    <div>
      <li
        class="note"
      >
        Component testing is done with react-testing-library
        <button>
          make not important
        </button>
      </li>
    </div>
  </body>
```

Il est également possible d'utiliser la même méthode pour imprimer un élément souhaité dans la console:


```js
import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import Note from './Note'

test('renders content', () => {
  const note = {
    content: 'Component testing is done with react-testing-library',
    important: true
  }

  render(<Note note={note} />)

  const element = screen.getByText('Component testing is done with react-testing-library')

  screen.debug(element)  // highlight-line

  expect(element).toBeDefined()
})
```

Maintenant, le HTML de l'élément souhaité est imprimé:

```js
  <li
    class="note"
  >
    Component testing is done with react-testing-library
    <button>
      make not important
    </button>
  </li>
```

### Cliquer sur des boutons dans les tests

En plus d'afficher du contenu, le composant <i>Note</i> s'assure également que lorsque le bouton associé à la note est pressé, la fonction gestionnaire d'événement _toggleImportance_ est appelée.

Installons une bibliothèque [user-event](https://testing-library.com/docs/user-event/intro) qui facilite un peu la simulation des entrées utilisateur:

```bash
npm install --save-dev @testing-library/user-event
```

Tester cette fonctionnalité peut être réalisé de cette manière:

```js
import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event' // highlight-line
import Note from './Note'

// ...

test('clicking the button calls event handler once', async () => {
  const note = {
    content: 'Component testing is done with react-testing-library',
    important: true
  }

  const mockHandler = jest.fn()  // highlight-line

  render(
    <Note note={note} toggleImportance={mockHandler} />  // highlight-line
  )

  const user = userEvent.setup()  // highlight-line
  const button = screen.getByText('make not important')  // highlight-line
  await user.click(button)  // highlight-line

  expect(mockHandler.mock.calls).toHaveLength(1)  // highlight-line
})
```

Il y a quelques points intéressants liés à ce test. Le gestionnaire d'événement est une fonction [mock](https://facebook.github.io/jest/docs/en/mock-functions.html) définie avec Jest:

```js
const mockHandler = jest.fn()
```

Une [session](https://testing-library.com/docs/user-event/setup/) est démarrée pour interagir avec le composant rendu:

```js
const user = userEvent.setup()
```

Le test trouve le bouton <i>en se basant sur le texte</i> du composant rendu et clique sur l'élément:

```js
const button = screen.getByText('make not important')
await user.click(button)
```

Le clic est effectué avec la méthode [click](https://testing-library.com/docs/user-event/convenience/#click) de la bibliothèque userEvent.

L'attente du test vérifie que la <i>fonction mock</i> a été appelée exactement une fois.

```js
expect(mockHandler.mock.calls).toHaveLength(1)
```

Les [objets et fonctions mock](https://en.wikipedia.org/wiki/Mock_object) sont couramment utilisés comme composants bouchons dans les tests, servant à remplacer les dépendances des composants testés. Les mocks permettent de retourner des réponses codées en dur, et de vérifier le nombre de fois que les fonctions mock sont appelées et avec quels paramètres.

Dans notre exemple, la fonction mock est un choix parfait puisqu'elle peut être facilement utilisée pour vérifier que la méthode est appelée exactement une fois.

### Tests pour le composant <i>Togglable</i>

Écrivons quelques tests pour le composant <i>Togglable</i>. Ajoutons la classe CSS <i>togglableContent</i> à la div qui retourne les composants enfants.

```js
const Togglable = forwardRef((props, ref) => {
  // ...

  return (
    <div>
      <div style={hideWhenVisible}>
        <button onClick={toggleVisibility}>
          {props.buttonLabel}
        </button>
      </div>
      <div style={showWhenVisible} className="togglableContent"> // highlight-line
        {props.children}
        <button onClick={toggleVisibility}>cancel</button>
      </div>
    </div>
  )
})
```

Les tests sont présentés ci-dessous:

```js
import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Togglable from './Togglable'

describe('<Togglable />', () => {
  let container

  beforeEach(() => {
    container = render(
      <Togglable buttonLabel="show...">
        <div className="testDiv" >
          togglable content
        </div>
      </Togglable>
    ).container
  })

  test('renders its children', async () => {
    await screen.findAllByText('togglable content')
  })

  test('at start the children are not displayed', () => {
    const div = container.querySelector('.togglableContent')
    expect(div).toHaveStyle('display: none')
  })

  test('after clicking the button, children are displayed', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('show...')
    await user.click(button)

    const div = container.querySelector('.togglableContent')
    expect(div).not.toHaveStyle('display: none')
  })
})
```

La fonction _beforeEach_ est appelée avant chaque test, ce qui permet ensuite de rendre le composant <i>Togglable</i> et de sauvegarder le champ _container_ de la valeur retournée.

Le premier test vérifie que le composant <i>Togglable</i> rend son composant enfant

```js
<div className="testDiv">
  togglable content
</div>
```

Les tests restants utilisent la méthode [toHaveStyle](https://www.npmjs.com/package/@testing-library/jest-dom#tohavestyle) pour vérifier que le composant enfant du composant <i>Togglable</i> n'est pas visible initialement, en vérifiant que le style de l'élément <i>div</i> contient _{ display: 'none' }_. Un autre test vérifie que lorsque le bouton est pressé, le composant est visible, signifiant que le style pour cacher le composant <i>n'est plus</i> attribué au composant.

Ajoutons également un test qui peut être utilisé pour vérifier que le contenu visible peut être caché en cliquant sur le second bouton du composant:

```js
describe('<Togglable />', () => {

  // ...

  test('toggled content can be closed', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('show...')
    await user.click(button)

    const closeButton = screen.getByText('cancel')
    await user.click(closeButton)

    const div = container.querySelector('.togglableContent')
    expect(div).toHaveStyle('display: none')
  })
})
```

### Tester les formulaires

Nous avons déjà utilisé la fonction click de [user-event](https://testing-library.com/docs/user-event/intro) dans nos tests précédents pour cliquer sur des boutons.

```js
const user = userEvent.setup()
const button = screen.getByText('show...')
await user.click(button)
```

Nous pouvons également simuler la saisie de texte avec <i>userEvent</i>.

Faisons un test pour le composant <i>NoteForm</i>. Le code du composant est le suivant.

```js
import { useState } from 'react'

const NoteForm = ({ createNote }) => {
  const [newNote, setNewNote] = useState('')

  const handleChange = (event) => {
    setNewNote(event.target.value)
  }

  const addNote = (event) => {
    event.preventDefault()
    createNote({
      content: newNote,
      important: Math.random() > 0.5,
    })

    setNewNote('')
  }

  return (
    <div className="formDiv">
      <h2>Create a new note</h2>

      <form onSubmit={addNote}>
        <input
          value={newNote}
          onChange={handleChange}
        />
        <button type="submit">save</button>
      </form>
    </div>
  )
}

export default NoteForm
```

Le formulaire fonctionne en appelant la fonction _createNote_ qu'il a reçue en props avec les détails de la nouvelle note.

Le test est le suivant:

```js
import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import NoteForm from './NoteForm'
import userEvent from '@testing-library/user-event'

test('<NoteForm /> updates parent state and calls onSubmit', async () => {
  const createNote = jest.fn()
  const user = userEvent.setup()

  render(<NoteForm createNote={createNote} />)

  const input = screen.getByRole('textbox')
  const sendButton = screen.getByText('save')

  await user.type(input, 'testing a form...')
  await user.click(sendButton)

  expect(createNote.mock.calls).toHaveLength(1)
  expect(createNote.mock.calls[0][0].content).toBe('testing a form...')
})
```

Les tests accèdent au champ de saisie en utilisant la fonction [getByRole](https://testing-library.com/docs/queries/byrole).

La méthode [type](https://testing-library.com/docs/user-event/utility#type) de userEvent est utilisée pour écrire du texte dans le champ de saisie.

La première attente du test assure que la soumission du formulaire appelle la méthode _createNote_.
La deuxième attente vérifie que le gestionnaire d'événement est appelé avec les bons paramètres - qu'une note avec le contenu correct est créée lorsque le formulaire est rempli.

### À propos de la recherche des éléments

Supposons que le formulaire ait deux champs de saisie

```js
const NoteForm = ({ createNote }) => {
  // ...

  return (
    <div>
      <h2>Create a new note</h2>

      <form onSubmit={addNote}>
        <input
          value={newNote}
          onChange={handleChange}
        />
        // highlight-start
        <input
          value={...}
          onChange={...}
        />
        // highlight-end
        <button type="submit">save</button>
      </form>
    </div>
  )
}
```

Maintenant, l'approche que notre test utilise pour trouver le champ de saisie

```js
const input = screen.getByRole('textbox')
```

provoquerait une erreur:

![erreur node indiquant deux éléments avec textbox puisque nous utilisons getByRole](../../images/5/40.png)

Le message d'erreur suggère d'utiliser <i>getAllByRole</i>. Le test pourrait être corrigé comme suit:

```js
const inputs = screen.getAllByRole('textbox')

await user.type(inputs[0], 'testing a form...')
```

La méthode <i>getAllByRole</i> retourne maintenant un tableau et le bon champ de saisie est le premier élément de ce tableau. Cependant, cette approche est un peu suspecte car elle repose sur l'ordre des champs de saisie.

Assez souvent, les champs de saisie ont un texte <i>placeholder</i> qui indique à l'utilisateur quel type de saisie est attendu. Ajoutons un placeholder à notre formulaire:

```js
const NoteForm = ({ createNote }) => {
  // ...

  return (
    <div>
      <h2>Create a new note</h2>

      <form onSubmit={addNote}>
        <input
          value={newNote}
          onChange={handleChange}
          placeholder='write note content here' // highlight-line 
        />
        <input
          value={...}
          onChange={...}
        />    
        <button type="submit">save</button>
      </form>
    </div>
  )
}
```

Maintenant, trouver le bon champ de saisie est facile avec la méthode [getByPlaceholderText](https://testing-library.com/docs/queries/byplaceholdertext):

```js
test('<NoteForm /> updates parent state and calls onSubmit', () => {
  const createNote = jest.fn()

  render(<NoteForm createNote={createNote} />) 

  const input = screen.getByPlaceholderText('write note content here') // highlight-line 
  const sendButton = screen.getByText('save')

  userEvent.type(input, 'testing a form...')
  userEvent.click(sendButton)

  expect(createNote.mock.calls).toHaveLength(1)
  expect(createNote.mock.calls[0][0].content).toBe('testing a form...')
})
```

La manière la plus flexible de trouver des éléments dans les tests est la méthode <i>querySelector</i> de l'objet _container_, qui est retourné par _render_, comme mentionné [plus tôt dans cette partie](/en/part5/testing_react_apps#searching-for-content-in-a-component). Tout sélecteur CSS peut être utilisé avec cette méthode pour rechercher des éléments dans les tests.

Considérez par exemple que nous définirions un _id_ unique au champ de saisie:

```js
const NoteForm = ({ createNote }) => {
  // ...

  return (
    <div>
      <h2>Create a new note</h2>

      <form onSubmit={addNote}>
        <input
          value={newNote}
          onChange={handleChange}
          id='note-input' // highlight-line 
        />
        <input
          value={...}
          onChange={...}
        />    
        <button type="submit">save</button>
      </form>
    </div>
  )
}
```

L'élément de saisie pourrait maintenant être trouvé dans le test comme suit:

```js
const { container } = render(<NoteForm createNote={createNote} />)

const input = container.querySelector('#note-input')
```

Cependant, nous allons nous en tenir à l'approche consistant à utiliser _getByPlaceholderText_ dans le test.

Examinons quelques détails avant de continuer. Supposons qu'un composant rende du texte dans un élément HTML comme suit:

```js
const Note = ({ note, toggleImportance }) => {
  const label = note.important
    ? 'make not important' : 'make important'

  return (
    <li className='note'>
      Your awesome note: {note.content} // highlight-line
      <button onClick={toggleImportance}>{label}</button>
    </li>
  )
}

export default Note
```

la commande _getByText_ que le test utilise ne trouve <i>pas</i> l'élément

```js
test('renders content', () => {
  const note = {
    content: 'Does not work anymore :(',
    important: true
  }

  render(<Note note={note} />)

  const element = screen.getByText('Does not work anymore :(')

  expect(element).toBeDefined()
})
```

La commande _getByText_ recherche un élément qui a le **même texte** qu'elle a comme paramètre, et rien de plus. Si nous voulons chercher un élément qui <i>contient</i> le texte, nous pourrions utiliser une option supplémentaire:

```js
const element = screen.getByText(
  'Does not work anymore :(', { exact: false }
)
```

ou nous pourrions utiliser la commande _findByText_:

```js
const element = await screen.findByText('Does not work anymore :(')
```

Il est important de noter que, contrairement aux autres commandes_ ByText_, _findByText_ renvoie une promesse!

Il existe des situations où une autre forme de la commande _queryByText_ est utile. La commande renvoie l'élément mais <i>ne provoque pas d'exception</i> si l'élément n'est pas trouvé.

Nous pourrions par exemple utiliser la commande pour nous assurer que quelque chose <i>n'est pas rendu</i> dans le composant:

```js
test('does not render this', () => {
  const note = {
    content: 'This is a reminder',
    important: true
  }

  render(<Note note={note} />)

  const element = screen.queryByText('do not want this thing to be rendered')
  expect(element).toBeNull()
})
```

### Couverture des tests

Nous pouvons facilement découvrir la [couverture](https://jestjs.io/blog/2020/01/21/jest-25#v8-code-coverage) de nos tests en les exécutant avec la commande.

```js
npm test -- --coverage --collectCoverageFrom='src/**/*.{jsx,js}'
```

![Le résultat dans le terminal de la couverture de test](../../images/5/18new.png)

Un rapport HTML assez primitif sera généré dans le répertoire <i>coverage/lcov-report</i>. Le rapport nous indiquera les lignes de code non testées dans chaque composant :

![rapport HTML de la couverture des tests](../../images/5/19new.png)

Vous pouvez trouver le code de notre application actuelle dans son intégralité dans la branche <i>part5-8</i> de ce [dépôt GitHub](https://github.com/fullstack-hy2020/part2-notes-frontend/tree/part5-8).

</div>

<div class="tasks">

### Exercices 5.13.-5.16.

#### 5.13 : Tests de la liste des blogs, étape 1

Réalisez un test qui vérifie que le composant affichant un blog rend le titre et l'auteur du blog, mais ne rend pas par défaut son URL ou le nombre de likes.

Ajoutez des classes CSS au composant pour faciliter le test si nécessaire.

#### 5.14 : Tests de la liste des blogs, étape 2

Réalisez un test qui vérifie que l'URL du blog et le nombre de likes sont affichés lorsque le bouton contrôlant les détails affichés a été cliqué.

#### 5.15 : Tests de la liste des blogs, étape 3

Réalisez un test qui assure que si le bouton <i>like</i> est cliqué deux fois, le gestionnaire d'événements que le composant a reçu en props est appelé deux fois.

#### 5.16 : Tests de la liste des blogs, étape 4

Réalisez un test pour le formulaire de nouveau blog. Le test devrait vérifier que le formulaire appelle le gestionnaire d'événements qu'il a reçu en props avec les bons détails lorsqu'un nouveau blog est créé.

</div>

<div class="content">

### Tests d'intégration Frontend

Dans la partie précédente du matériel de cours, nous avons écrit des tests d'intégration pour le backend qui testaient sa logique et se connectaient à la base de données à travers l'API fournie par le backend. Lors de l'écriture de ces tests, nous avons pris la décision consciente de ne pas écrire de tests unitaires, car le code pour ce backend est assez simple, et il est probable que les bugs dans notre application surviennent dans des scénarios plus compliqués que les tests unitaires ne le permettent.

Jusqu'à présent, tous nos tests pour le frontend ont été des tests unitaires qui ont validé le bon fonctionnement des composants individuels. Les tests unitaires sont utiles parfois, mais même un ensemble complet de tests unitaires n'est pas suffisant pour valider que l'application fonctionne dans son ensemble.

Nous pourrions également faire des tests d'intégration pour le frontend. Les tests d'intégration testent la collaboration de plusieurs composants. C'est considérablement plus difficile que les tests unitaires, car nous devrions par exemple simuler des données provenant du serveur.
Nous avons choisi de nous concentrer sur la réalisation de tests de bout en bout pour tester l'ensemble de l'application. Nous travaillerons sur les tests de bout en bout dans le dernier chapitre de cette partie.

### Tests de snapshot

Jest offre une alternative complètement différente aux tests "traditionnels" appelés tests de [snapshot](https://facebook.github.io/jest/docs/en/snapshot-testing.html). La particularité des tests de snapshot est que les développeurs n'ont pas besoin de définir eux-mêmes les tests, il est assez simple d'adopter les tests de snapshot.

Le principe fondamental est de comparer le code HTML défini par le composant après qu'il a été changé au code HTML qui existait avant qu'il ne soit modifié.

Si le snapshot remarque un changement dans le code HTML défini par le composant, alors soit c'est une nouvelle fonctionnalité, soit un "bug" causé par accident. Les tests de snapshot informent le développeur si le code HTML du composant change. Le développeur doit indiquer à Jest si le changement était souhaité ou non. Si le changement du code HTML est inattendu, cela implique fortement un bug, et le développeur peut prendre conscience de ces problèmes potentiels facilement grâce aux tests de snapshot.

</div>