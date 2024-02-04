---
mainImage: ../../../images/part-5.svg
part: 5
letter: b
lang: fr
---

<div class="content">

### Afficher le formulaire de connexion uniquement lorsque c'est approprié

Modifions l'application pour que le formulaire de connexion ne soit pas affiché par défaut:

![navigateur montrant le bouton de connexion par défaut](../../images/5/10e.png)

Le formulaire de connexion apparaît lorsque l'utilisateur appuie sur le bouton <i>login</i>:

![utilisateur sur l'écran de connexion sur le point d'appuyer sur annuler](../../images/5/11e.png)

L'utilisateur peut fermer le formulaire de connexion en cliquant sur le bouton <i>cancel</i>.

Commençons par extraire le formulaire de connexion dans son propre composant:

```js
const LoginForm = ({
   handleSubmit,
   handleUsernameChange,
   handlePasswordChange,
   username,
   password
  }) => {
  return (
    <div>
      <h2>Login</h2>

      <form onSubmit={handleSubmit}>
        <div>
          username
          <input
            value={username}
            onChange={handleUsernameChange}
          />
        </div>
        <div>
          password
          <input
            type="password"
            value={password}
            onChange={handlePasswordChange}
          />
      </div>
        <button type="submit">login</button>
      </form>
    </div>
  )
}

export default LoginForm
```

L'état et toutes les fonctions qui s'y rapportent sont définis à l'extérieur du composant et sont passés au composant sous forme de props.

Remarquez que les props sont assignées à des variables par le biais de la <i>décomposition</i>, ce qui signifie qu'au lieu d'écrire:

```js
const LoginForm = (props) => {
  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={props.handleSubmit}>
        <div>
          username
          <input
            value={props.username}
            onChange={props.handleChange}
            name="username"
          />
        </div>
        // ...
        <button type="submit">login</button>
      </form>
    </div>
  )
}
```

où les propriétés de l'objet _props_ sont accessibles par exemple via _props.handleSubmit_, les propriétés sont directement assignées à leurs propres variables.

Une manière rapide de mettre en oeuvre la fonctionnalité consiste à modifier la fonction _loginForm_ du composant <i>App</i> de cette façon:

```js
const App = () => {
  const [loginVisible, setLoginVisible] = useState(false) // highlight-line

  // ...

  const loginForm = () => {
    const hideWhenVisible = { display: loginVisible ? 'none' : '' }
    const showWhenVisible = { display: loginVisible ? '' : 'none' }

    return (
      <div>
        <div style={hideWhenVisible}>
          <button onClick={() => setLoginVisible(true)}>log in</button>
        </div>
        <div style={showWhenVisible}>
          <LoginForm
            username={username}
            password={password}
            handleUsernameChange={({ target }) => setUsername(target.value)}
            handlePasswordChange={({ target }) => setPassword(target.value)}
            handleSubmit={handleLogin}
          />
          <button onClick={() => setLoginVisible(false)}>cancel</button>
        </div>
      </div>
    )
  }

  // ...
}
```

L'état du composant <i>App</i> contient maintenant le booléen <i>loginVisible</i>, qui définit si le formulaire de connexion doit être montré à l'utilisateur ou non.

La valeur de _loginVisible_ est basculée avec deux boutons. Les deux boutons ont leurs gestionnaires d'événements définis directement dans le composant:

```js
<button onClick={() => setLoginVisible(true)}>log in</button>

<button onClick={() => setLoginVisible(false)}>cancel</button>
```

La visibilité du composant est définie en donnant au composant une règle de style [en ligne](/fr/part2/styliser_vos_applications_react#styles-en-ligne), où la valeur de la propriété [display](https://developer.mozilla.org/en-US/docs/Web/CSS/display) est <i>none</i> si nous ne voulons pas que le composant soit affiché:

```js
const hideWhenVisible = { display: loginVisible ? 'none' : '' }
const showWhenVisible = { display: loginVisible ? '' : 'none' }

<div style={hideWhenVisible}>
  // button
</div>

<div style={showWhenVisible}>
  // button
</div>
```

Nous utilisons une fois de plus l'opérateur ternaire "point d'interrogation". Si _loginVisible_ est <i>true</i>, alors la règle CSS du composant sera:

```css
display: 'none';
```

Si _loginVisible_ est <i>false</i>, alors <i>display</i> ne recevra aucune valeur liée à la visibilité du composant.

### Les enfants des composants, alias props.children

Le code lié à la gestion de la visibilité du formulaire de connexion pourrait être considéré comme sa propre entité logique, et pour cette raison, il serait bon de l'extraire du composant <i>App</i> pour le placer dans un composant séparé.

Notre objectif est de mettre en oeuvre un nouveau composant <i>Togglable</i> qui peut être utilisé de la manière suivante:

```js
<Togglable buttonLabel='login'>
  <LoginForm
    username={username}
    password={password}
    handleUsernameChange={({ target }) => setUsername(target.value)}
    handlePasswordChange={({ target }) => setPassword(target.value)}
    handleSubmit={handleLogin}
  />
</Togglable>
```

La manière dont le composant est utilisé est légèrement différente de nos composants précédents. Le composant a des balises d'ouverture et de fermeture qui entourent un composant <i>LoginForm</i>. Dans la terminologie React, <i>LoginForm</i> est un composant enfant de <i>Togglable</i>.

Nous pouvons ajouter tous les éléments React que nous voulons entre les balises d'ouverture et de fermeture de <i>Togglable</i>, comme ceci par exemple:

```js
<Togglable buttonLabel="reveal">
  <p>this line is at start hidden</p>
  <p>also this is hidden</p>
</Togglable>
```

Le code pour le composant <i>Togglable</i> est montré ci-dessous:

```js
import { useState } from 'react'

const Togglable = (props) => {
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  return (
    <div>
      <div style={hideWhenVisible}>
        <button onClick={toggleVisibility}>{props.buttonLabel}</button>
      </div>
      <div style={showWhenVisible}>
        {props.children}
        <button onClick={toggleVisibility}>cancel</button>
      </div>
    </div>
  )
}

export default Togglable
```

La partie nouvelle et intéressante du code est [props.children](https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children), qui est utilisée pour référencer les composants enfants du composant. Les composants enfants sont les éléments React que nous définissons entre les balises d'ouverture et de fermeture d'un composant.

Cette fois, les enfants sont rendus dans le code utilisé pour le rendu du composant lui-même:

```js
<div style={showWhenVisible}>
  {props.children}
  <button onClick={toggleVisibility}>cancel</button>
</div>
```

Contrairement aux props "normales" que nous avons vues précédemment, <i>children</i> est automatiquement ajouté par React et existe toujours. Si un composant est défini avec une balise de fermeture automatique _/>_, comme ceci:

```js
<Note
  key={note.id}
  note={note}
  toggleImportance={() => toggleImportanceOf(note.id)}
/>
```

Alors, <i>props.children</i> est un tableau vide.

Le composant <i>Togglable</i> est réutilisable et nous pouvons l'utiliser pour ajouter une fonctionnalité de basculement de visibilité similaire au formulaire utilisé pour créer de nouvelles notes.

Avant cela, extrayons le formulaire de création de notes dans un composant:

```js
const NoteForm = ({ onSubmit, handleChange, value}) => {
  return (
    <div>
      <h2>Create a new note</h2>

      <form onSubmit={onSubmit}>
        <input
          value={value}
          onChange={handleChange}
        />
        <button type="submit">save</button>
      </form>
    </div>
  )
}
```

Ensuite, définissons le composant de formulaire à l'intérieur d'un composant <i>Togglable</i>:

```js
<Togglable buttonLabel="new note">
  <NoteForm
    onSubmit={addNote}
    value={newNote}
    handleChange={handleNoteChange}
  />
</Togglable>
```

Vous pouvez trouver le code de notre application actuelle dans son intégralité dans la branche <i>part5-4</i> [de ce dépôt GitHub](https://github.com/fullstack-hy2020/part2-notes-frontend/tree/part5-4).

### État des formulaires

L'état de l'application est actuellement dans le composant _App_.

La documentation de React dit ce qui [suit](https://react.dev/learn/sharing-state-between-components) sur l'endroit où placer l'état:

<i>Parfois, vous voulez que l'état de deux composants change toujours ensemble. Pour ce faire, retirez l'état de ces deux composants, déplacez-le vers leur parent commun le plus proche, puis transmettez-le à ces composants via les props. Cela est connu sous le nom de remontée d'état, et c’est l’une des choses les plus courantes que vous ferez en écrivant du code React.</i>

Si nous réfléchissons à l'état des formulaires, donc par exemple au contenu d'une nouvelle note avant qu'elle n'ait été créée, le composant _App_ n'en a besoin pour rien.
Nous pourrions tout aussi bien déplacer l'état des formulaires vers les composants correspondants.

Le composant pour une note change comme suit:

```js
import { useState } from 'react'

const NoteForm = ({ createNote }) => {
  const [newNote, setNewNote] = useState('')

  const addNote = (event) => {
    event.preventDefault()
    createNote({
      content: newNote,
      important: true
    })

    setNewNote('')
  }

  return (
    <div>
      <h2>Create a new note</h2>

      <form onSubmit={addNote}>
        <input
          value={newNote}
          onChange={event => setNewNote(event.target.value)}
        />
        <button type="submit">save</button>
      </form>
    </div>
  )
}

export default NoteForm
```

**NOTE** En même temps, nous avons changé le comportement de l'application de sorte que les nouvelles notes soient importantes par défaut, c'est-à-dire que le champ <i>important</i> reçoit la valeur <i>true</i>.

L'attribut d'état <i>newNote</i> et le gestionnaire d'événements responsable de sa modification ont été déplacés du composant _App_ au composant responsable du formulaire de note.

Il ne reste qu'une seule prop, la fonction _createNote_, que le formulaire appelle lorsqu'une nouvelle note est créée.

Le composant _App_ devient plus simple maintenant que nous nous sommes débarrassés de l'état <i>newNote</i> et de son gestionnaire d'événements.
La fonction _addNote_ pour créer de nouvelles notes reçoit une nouvelle note en paramètre, et la fonction est la seule prop que nous envoyons au formulaire:

```js
const App = () => {
  // ...
  const addNote = (noteObject) => { // highlight-line
    noteService
      .create(noteObject)
      .then(returnedNote => {
        setNotes(notes.concat(returnedNote))
      })
  }
  // ...
  const noteForm = () => (
    <Togglable buttonLabel='new note'>
      <NoteForm createNote={addNote} />
    </Togglable>
  )

  // ...
}
```

Nous pourrions faire de même pour le formulaire de connexion, mais nous laisserons cela pour un exercice optionnel.

Le code de l'application peut être trouvé sur [GitHub](https://github.com/fullstack-hy2020/part2-notes-frontend/tree/part5-5),
branche <i>part5-5</i>.

### Références aux composants avec ref

Notre mise en oeuvre actuelle est assez bonne; il y a un aspect qui pourrait être amélioré.

Après la création d'une nouvelle note, il serait logique de masquer le formulaire de la nouvelle note. Actuellement, le formulaire reste visible. Il y a un léger problème pour masquer le formulaire. La visibilité est contrôlée avec la variable <i>visible</i> à l'intérieur du composant <i>Togglable</i>. Comment pouvons-nous y accéder de l'extérieur du composant ?

Il existe de nombreuses manières d'implémenter la fermeture du formulaire depuis le composant parent, mais utilisons le mécanisme de [ref](https://react.dev/learn/referencing-values-with-refs) de React, qui offre une référence au composant.

Faisons les changements suivants au composant <i>App</i>:

```js
import { useState, useEffect, useRef } from 'react' // highlight-line

const App = () => {
  // ...
  const noteFormRef = useRef() // highlight-line

  const noteForm = () => (
    <Togglable buttonLabel='new note' ref={noteFormRef}>  // highlight-line
      <NoteForm createNote={addNote} />
    </Togglable>
  )

  // ...
}
```

Le hook [useRef](https://react.dev/reference/react/useRef) est utilisé pour créer une référence <i>noteFormRef</i>, qui est attribuée au composant <i>Togglable</i> contenant le formulaire de création de note. La variable <i>noteFormRef</i> agit comme une référence au composant. Ce hook garantit que la même référence (ref) est conservée tout au long des rendus du composant.

Nous apportons également les changements suivants au composant <i>Togglable</i>:

```js
import { useState, forwardRef, useImperativeHandle } from 'react' // highlight-line

const Togglable = forwardRef((props, refs) => { // highlight-line
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

// highlight-start
  useImperativeHandle(refs, () => {
    return {
      toggleVisibility
    }
  })
// highlight-end

  return (
    <div>
      <div style={hideWhenVisible}>
        <button onClick={toggleVisibility}>{props.buttonLabel}</button>
      </div>
      <div style={showWhenVisible}>
        {props.children}
        <button onClick={toggleVisibility}>cancel</button>
      </div>
    </div>
  )
})  // highlight-line

export default Togglable
```

La fonction qui crée le composant est encapsulée à l'intérieur d'un appel de fonction [forwardRef](https://react.dev/reference/react/forwardRef). De cette manière, le composant peut accéder à la référence qui lui est attribuée.

Le composant utilise le hook [useImperativeHandle](https://react.dev/reference/react/useImperativeHandle) pour rendre sa fonction <i>toggleVisibility</i> disponible à l'extérieur du composant.

Nous pouvons maintenant masquer le formulaire en appelant <i>noteFormRef.current.toggleVisibility()</i> après qu'une nouvelle note a été créée:

```js
const App = () => {
  // ...
  const addNote = (noteObject) => {
    noteFormRef.current.toggleVisibility() // highlight-line
    noteService
      .create(noteObject)
      .then(returnedNote => {     
        setNotes(notes.concat(returnedNote))
      })
  }
  // ...
}
```

Pour résumer, la fonction [useImperativeHandle](https://react.dev/reference/react/useImperativeHandle) est un hook de React, qui est utilisé pour définir des fonctions dans un composant, qui peuvent être invoquées de l'extérieur du composant.

Cette astuce fonctionne pour changer l'état d'un composant, mais elle semble un peu désagréable. Nous aurions pu accomplir la même fonctionnalité avec un code légèrement plus propre en utilisant les composants basés sur les classes du "vieux React". Nous examinerons ces composants de classe pendant la partie 7 du matériel du cours. Jusqu'à présent, c'est la seule situation où l'utilisation des hooks de React mène à un code qui n'est pas plus propre qu'avec les composants de classe.

Il existe également [d'autres cas d'utilisation](https://react.dev/learn/manipulating-the-dom-with-refs) pour les refs que l'accès aux composants React.

Vous pouvez trouver le code de notre application actuelle dans son intégralité dans la branche <i>part5-6</i> de [ce dépôt GitHub](https://github.com/fullstack-hy2020/part2-notes-frontend/tree/part5-6).

### Un point sur les composants

Lorsque nous définissons un composant en React:

```js
const Togglable = () => ...
  // ...
}
```

And use it like this:

```js
<div>
  <Togglable buttonLabel="1" ref={togglable1}>
    first
  </Togglable>

  <Togglable buttonLabel="2" ref={togglable2}>
    second
  </Togglable>

  <Togglable buttonLabel="3" ref={togglable3}>
    third
  </Togglable>
</div>
```

Nous créons <i>trois instances distinctes du composant</i> qui ont toutes leur état séparé:

![navigateur de trois composants togglable](../../images/5/12e.png)

L'attribut <i>ref</i> est utilisé pour assigner une référence à chacun des composants dans les variables <i>togglable1</i>, <i>togglable2</i> et <i>togglable3</i>.

### Le serment du développeur full stack mis à jour

Le nombre de parties mobiles augmente. En même temps, la probabilité de se retrouver dans une situation où nous cherchons un bug au mauvais endroit augmente. Nous devons donc être encore plus systématiques.

Nous devrions donc étendre une fois de plus notre serment:

Le développement full stack est <i>extrêmement difficile</i>, c'est pourquoi j'utiliserai tous les moyens possibles pour le rendre plus facile

- J'aurai ma console de développeur de navigateur ouverte tout le temps
- J'utiliserai l'onglet réseau des outils de développement du navigateur pour m'assurer que le frontend et le backend communiquent comme je le souhaite
- Je garderai constamment un oeil sur l'état du serveur pour m'assurer que les données envoyées par le frontend y sont sauvegardées comme je le souhaite
- Je garderai un oeil sur la base de données: le backend y sauvegarde-t-il les données dans le bon format
- Je progresse par petites étapes
- <i>lorsque je suspecte qu'il y a un bug dans le frontend, je m'assure que le backend fonctionne à coup sûr</i>
- <i>lorsque je suspecte qu'il y a un bug dans le backend, je m'assure que le frontend fonctionne à coup sûr</i>
- J'écrirai beaucoup de _console.log_ pour m'assurer que je comprends comment le code et les tests se comportent et pour aider à localiser les problèmes
- Si mon code ne fonctionne pas, je n'écrirai pas plus de code. Au lieu de cela, je commence à supprimer le code jusqu'à ce qu'il fonctionne ou je reviens à un état où tout fonctionnait encore
- Si un test ne passe pas, je m'assure que la fonctionnalité testée fonctionne à coup sûr dans l'application
- Lorsque je demande de l'aide sur le canal Discord ou Telegram du cours ou ailleurs, je formule correctement mes questions, voir [ici](https://fullstackopen.com/en/part0/general_info#how-to-get-help-in-discord-telegram) comment demander de l'aide

</div>

<div class="tasks">

### Exercices 5.5.-5.11.

#### 5.5 Blog list frontend, étape 5

Changez le formulaire de création de billets de blog de sorte qu'il ne soit affiché que lorsque cela est approprié. Utilisez une fonctionnalité similaire à celle montrée [plus tôt dans cette partie du matériel du cours](/en/part5/props_children_and_proptypes#displaying-the-login-form-only-when-appropriate). Si vous le souhaitez, vous pouvez utiliser le composant <i>Togglable</i> défini dans la partie 5.

Par défaut, le formulaire n'est pas visible

![navigateur montrant le bouton nouvelle note sans formulaire](../../images/5/13ae.png)

Il se déploie lorsque le bouton <i>créer un nouveau blog</i> est cliqué

![navigateur montrant le formulaire avec créer nouveau](../../images/5/13be.png)

Le formulaire se ferme lorsqu'un nouveau blog est créé.

#### 5.6 Blog list frontend, étape 6

Séparez le formulaire de création d'un nouveau blog dans son propre composant (si ce n'est pas déjà fait), et déplacez tous les états nécessaires à la création d'un nouveau blog dans ce composant.

Le composant doit fonctionner comme le composant <i>NoteForm</i> du [matériel](/en/part5/props_children_and_proptypes) de cette partie.

#### 5.7 Blog list frontend, étape 7

Ajoutons un bouton à chaque blog, qui contrôle si tous les détails sur le blog sont montrés ou non.

Les détails complets du blog s'ouvrent lorsque le bouton est cliqué.

![navigateur montrant les détails complets d'un blog avec les autres ayant juste des boutons de vue](../../images/5/13ea.png)

Et les détails sont cachés lorsque le bouton est cliqué à nouveau.

À ce stade, le bouton <i>like</i> n'a pas besoin de faire quoi que ce soit.

L'application montrée dans l'image a un peu de CSS supplémentaire pour améliorer son apparence.

Il est facile d'ajouter des styles à l'application comme montré dans la partie 2 en utilisant des styles [en ligne](/fr/part2/styliser_vos_applications_react#styles-en-ligne):

```js
const Blog = ({ blog }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  return (
    <div style={blogStyle}> // highlight-line
      <div>
        {blog.title} {blog.author}
      </div>
      // ...
  </div>
)}
```

**NB:** même si la fonctionnalité mise en oeuvre dans cette partie est presque identique à la fonctionnalité fournie par le composant <i>Togglable</i>, le composant ne peut pas être utilisé directement pour obtenir le comportement souhaité. La solution la plus simple sera d'ajouter un état au billet de blog qui contrôle la forme affichée du billet de blog.

#### 5.8 : Blog list frontend, étape 8

Nous remarquons que quelque chose ne va pas. Lorsqu'un nouveau blog est créé dans l'application, le nom de l'utilisateur qui a ajouté le blog n'est pas affiché dans les détails du blog:

![navigateur montrant le nom manquant sous le bouton like](../../images/5/59new.png)

Lorsque le navigateur est rechargé, les informations de la personne sont affichées. Ceci n'est pas acceptable, trouvez où se trouve le problème et apportez la correction nécessaire.

#### 5.9 : Blog list frontend, étape 9

Mettez en oeuvre la fonctionnalité pour le bouton like. Les likes sont augmentés en faisant une requête HTTP _PUT_ à l'adresse unique du billet de blog dans le backend.

Puisque l'opération du backend remplace l'ensemble du billet de blog, vous devrez envoyer tous ses champs dans le corps de la requête. Si vous vouliez ajouter un like au billet de blog suivant:

```js
{
  _id: "5a43fde2cbd20b12a2c34e91",
  user: {
    _id: "5a43e6b6c37f3d065eaaa581",
    username: "mluukkai",
    name: "Matti Luukkainen"
  },
  likes: 0,
  author: "Joel Spolsky",
  title: "The Joel Test: 12 Steps to Better Code",
  url: "https://www.joelonsoftware.com/2000/08/09/the-joel-test-12-steps-to-better-code/"
},
```

Vous devriez faire une requête HTTP PUT à l'adresse <i>/api/blogs/5a43fde2cbd20b12a2c34e91</i> avec les données de requête suivantes:

```js
{
  user: "5a43e6b6c37f3d065eaaa581",
  likes: 1,
  author: "Joel Spolsky",
  title: "The Joel Test: 12 Steps to Better Code",
  url: "https://www.joelonsoftware.com/2000/08/09/the-joel-test-12-steps-to-better-code/"
}
```

Le backend doit également être mis à jour pour gérer la référence utilisateur.

**Un dernier avertissement:** si vous remarquez que vous utilisez async/await et la méthode _then_ dans le même code, il est presque certain que vous faites quelque chose de mal. Tenez-vous en à l'utilisation de l'un ou de l'autre, et n'utilisez jamais les deux en même temps "juste au cas où".

#### 5.10 : Blog list frontend, étape 10

Modifiez l'application pour lister les posts de blog par nombre de <i>likes</i>. Le tri des posts de blog peut être réalisé avec la méthode [sort](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort) du tableau.

#### 5.11 : Blog list frontend, étape 11

Ajoutez un nouveau bouton pour supprimer les posts de blog. Implémentez également la logique de suppression des posts de blog dans le frontend.

Votre application pourrait ressembler à cela:

![navigateur de confirmation de suppression de blog](../../images/5/14ea.png)

La boîte de dialogue de confirmation pour la suppression d'un post de blog est facile à implémenter avec la fonction [window.confirm](https://developer.mozilla.org/en-US/docs/Web/API/Window/confirm).

Affichez le bouton de suppression d'un post de blog uniquement si le post de blog a été ajouté par l'utilisateur.

</div>

<div class="content">

### PropTypes

Le composant <i>Togglable</i> suppose qu'on lui donne le texte pour le bouton via la prop <i>buttonLabel</i>. Si nous oublions de le définir pour le composant:

```js
<Togglable> buttonLabel forgotten... </Togglable>
```

L'application fonctionne, mais le navigateur affiche un bouton qui n'a pas de texte d'étiquette.

Nous aimerions imposer que lorsque le composant <i>Togglable</i> est utilisé, la prop de texte d'étiquette du bouton doit se voir attribuer une valeur.

Les props attendues et requises d'un composant peuvent être définies avec le package [prop-types](https://github.com/facebook/prop-types). Installons le package:

```shell
npm install prop-types
```

Nous pouvons définir la prop <i>buttonLabel</i> comme une prop obligatoire ou <i>required</i> de type chaîne de caractères comme montré ci-dessous:

```js
import PropTypes from 'prop-types'

const Togglable = React.forwardRef((props, ref) => {
  // ..
})

Togglable.propTypes = {
  buttonLabel: PropTypes.string.isRequired
}
```

La console affichera le message d'erreur suivant si la prop est laissée indéfinie:

![erreur de console indiquant que buttonLabel est indéfini](../../images/5/15.png)

L'application fonctionne toujours et rien ne nous oblige à définir des props malgré les définitions de PropTypes. Cela dit, il est extrêmement peu professionnel de laisser <i>n'importe quel</i> message d'erreur en rouge dans la console du navigateur.

Définissons également les PropTypes pour le composant <i>LoginForm</i>:

```js
import PropTypes from 'prop-types'

const LoginForm = ({
   handleSubmit,
   handleUsernameChange,
   handlePasswordChange,
   username,
   password
  }) => {
    // ...
  }

LoginForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  handleUsernameChange: PropTypes.func.isRequired,
  handlePasswordChange: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired
}
```

Si le type d'une prop passée est incorrect, par exemple, si nous essayons de définir la prop <i>handleSubmit</i> comme une chaîne de caractères, cela entraînera l'avertissement suivant:

![erreur de console disant que handleSubmit attendait une fonction](../../images/5/16.png)

### ESlint

Dans la partie 3, nous avons configuré l'outil de style de code [ESlint](/fr/part3/validation_et_es_lint#lint) pour le backend. Prenons ESlint en main pour l'utiliser également dans le frontend.

Vite a installé ESlint dans le projet par défaut, il ne nous reste donc plus qu'à définir notre configuration souhaitée dans le fichier <i>.eslintrc.cjs</i>.

Ensuite, nous commencerons à tester le frontend et afin d'éviter des erreurs de linter indésirables et non pertinentes, nous installerons le package [eslint-plugin-jest](https://www.npmjs.com/package/eslint-plugin-jest):

```bash
npm install --save-dev eslint-plugin-jest
```

Créons un fichier <i>.eslintrc.cjs</i> avec le contenu suivant:

```js
module.exports = {
  root: true,
  env: {
    browser: true,
    es2020: true,
    "jest/globals": true
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  settings: { react: { version: '18.2' } },
  plugins: ['react-refresh', 'jest'],
  rules: {
    "indent": [
        "error",
        2  
    ],
    "linebreak-style": [
        "error",
        "unix"
    ],
    "quotes": [
        "error",
        "single"
    ],
    "semi": [
        "error",
        "never"
    ],
    "eqeqeq": "error",
    "no-trailing-spaces": "error",
    "object-curly-spacing": [
        "error", "always"
    ],
    "arrow-spacing": [
        "error", { "before": true, "after": true }
    ],
    "no-console": 0,
    "react/react-in-jsx-scope": "off",
    "react/prop-types": 0,
    "no-unused-vars": 0    
  },
}
```

NOTE: Si vous utilisez Visual Studio Code avec le plugin ESLint, vous pourriez avoir besoin d'ajouter un paramètre de workspace pour qu'il fonctionne. Si vous voyez l'erreur ```Failed to load plugin react: Cannot find module 'eslint-plugin-react'```, une configuration supplémentaire est nécessaire. Ajouter la ligne ```"eslint.workingDirectories": [{ "mode": "auto" }]``` au fichier settings.json dans l'espace de travail semble fonctionner. Voir [ici](https://github.com/microsoft/vscode-eslint/issues/880#issuecomment-578052807) pour plus d'informations.

Créons un fichier [.eslintignore](https://eslint.org/docs/user-guide/configuring#ignoring-files-and-directories) avec le contenu suivant à la racine du dépôt:

```bash
node_modules
dist
.eslintrc.cjs
```

Maintenant, les répertoires <em>dist</em> et <em>node_modules</em> seront ignorés lors du linting.

Comme d'habitude, vous pouvez effectuer le linting soit depuis la ligne de commande avec la commande

```bash
npm run Lint
```

ou en utilisant le plugin Eslint de l'éditeur.

Le composant _Togglable_ provoque un avertissement désagréable <i>La définition du composant manque d'un nom d'affichage</i>:

![vscode montrant une erreur de définition de composant](../../images/5/25x.png)

Les react-devtools révèlent également que le composant n'a pas de nom:

1[react devtools montrant forwardRef comme anonyme](../../images/5/26ea.png)

Heureusement, cela est facile à corriger

```js
import { useState, useImperativeHandle } from 'react'
import PropTypes from 'prop-types'

const Togglable = React.forwardRef((props, ref) => {
  // ...
})

Togglable.displayName = 'Togglable' // highlight-line

export default Togglable
```

Vous pouvez trouver le code de notre application actuelle dans son intégralité dans la branche <i>part5-7</i> de [ce dépôt GitHub](https://github.com/fullstack-hy2020/part2-notes-frontend/tree/part5-7).

</div>

<div class="tasks">

### exercice 5.12.

#### 5.12 : Blog list frontend, étape 12

Définissez PropTypes pour l'un des composants de votre application et ajoutez ESlint au projet. Définissez la configuration selon vos préférences. Corrigez toutes les erreurs du linter.

Vite a installé ESlint dans le projet par défaut, il ne vous reste donc plus qu'à définir votre configuration souhaitée dans le fichier <i>.eslintrc.cjs</i>.

</div>