---
mainImage: ../../../images/part-2.svg
part: 2
letter: e
lang: fr
---

<div class="content">


L'apparence de notre application actuelle est assez modeste. Dans l'[exercice 0.2](/fr/part0/introduction_aux_applications_web#exercices-0-1-0-6), le travail consistait à suivre le [tutoriel CSS](https://developer.mozilla.org/en-US/docs/Learn/Getting_started_with_the_web/CSS_basics) de Mozilla.

Avant de passer à la partie suivante, voyons comment ajouter des styles à une application React. Il existe plusieurs façons de procéder et nous verrons les autres méthodes plus tard. Tout d'abord, nous allons ajouter CSS à notre application à l'ancienne ; dans un seul fichier sans utiliser de [préprocesseur CSS](https://developer.mozilla.org/en-US/docs/Glossary/CSS_preprocessor) (bien que ce ne soit pas tout à fait vrai comme nous le verrons plus tard).

Ajoutons un nouveau fichier <i>index.css</i> sous le répertoire <i>src</i> puis ajoutons-le à l'application en l'important dans le fichier <i>index.js</i> :

```js
import './index.css'
```

Ajoutons la règle CSS suivante au fichier <i>index.css</i> :

```css
h1 {
  color: green;
}
```

**Remarque :** lorsque le contenu du fichier <i>index.css</i> change, React peut ne pas le remarquer automatiquement, vous devrez donc peut-être actualiser le navigateur pour voir vos modifications !

Les règles CSS comprennent des <i>sélecteurs</i> et des <i>déclarations</i>. Le sélecteur définit les éléments auxquels la règle doit être appliquée. Le sélecteur ci-dessus est <i>h1</i>, qui correspondra à toutes les balises d'en-tête <i>h1</i> de notre application.

La déclaration définit la propriété _color_ sur la valeur <i>green</i>.

Une règle CSS peut contenir un nombre arbitraire de propriétés. Modifions la règle précédente pour rendre le texte cursif, en définissant le style de police en <i>italique</i> :

```css
h1 {
  color: green;
  font-style: italic;  // highlight-line
}
```

Il existe de nombreuses façons de faire correspondre des éléments en utilisant [différents types de sélecteurs CSS](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors).

Si nous voulions cibler, disons, chacune des notes avec nos styles, nous pourrions utiliser le sélecteur <i>li</i>, car toutes les notes sont enveloppées dans des balises <i>li</i> :

```js
const Note = ({ note, toggleImportance }) => {
  const label = note.important 
    ? 'make not important' 
    : 'make important';

  return (
    <li>
      {note.content} 
      <button onClick={toggleImportance}>{label}</button>
    </li>
  )
}
```
Ajoutons la règle suivante à notre feuille de style (puisque ma connaissance de la conception Web élégante est proche de zéro, les styles n'ont pas beaucoup de sens) :

```css
li {
  color: grey;
  padding-top: 3px;
  font-size: 15px;
}
```

L'utilisation de types d'éléments pour définir des règles CSS est légèrement problématique. Si notre application contenait d'autres balises <i>li</i>, la même règle de style leur serait également appliquée.

Si nous voulons appliquer notre style spécifiquement aux notes, il est préférable d'utiliser [class selectors](https://developer.mozilla.org/en-US/docs/Web/CSS/Class_selectors).

En HTML normal, les classes sont définies comme la valeur de l'attribut <i>class</i> :

```html
<li class="note">some text...</li>
```
Dans React, nous devons utiliser l'attribut [className](https://reactjs.org/docs/dom-elements.html#classname) au lieu de l'attribut class. Gardant cela à l'esprit, apportons les modifications suivantes à notre composant <i>Note</i> :

```js
const Note = ({ note, toggleImportance }) => {
  const label = note.important 
    ? 'make not important' 
    : 'make important';

  return (
    <li className='note'> // highlight-line
      {note.content} 
      <button onClick={toggleImportance}>{label}</button>
    </li>
  )
}
```

Les sélecteurs de classe sont définis avec la syntaxe _.classname_ :

```css
.note {
  color: grey;
  padding-top: 5px;
  font-size: 15px;
}
```

Si vous ajoutez maintenant d'autres éléments <i>li</i> à l'application, ils ne seront pas affectés par la règle de style ci-dessus.


### Message d'erreur amélioré

Nous avons précédemment implémenté le message d'erreur qui s'affichait lorsque l'utilisateur tentait de modifier l'importance d'une note supprimée avec la méthode <em>alert</em>. Implémentons le message d'erreur comme son propre composant React.

Le composant est assez simple :

```js
const Notification = ({ message }) => {
  if (message === null) {
    return null
  }

  return (
    <div className='error'>
      {message}
    </div>
  )
}
```

Si la valeur de la prop <em>message</em> est <em>null</em>, alors rien n'est rendu à l'écran, et dans d'autres cas, le message est rendu à l'intérieur d'un élément div.

Ajoutons un nouvel élément d'état appelé <i>errorMessage</i> au composant <i>App</i>. Initialisons-le avec un message d'erreur afin que nous puissions immédiatement tester notre composant :

```js
const App = () => {
  const [notes, setNotes] = useState([]) 
  const [newNote, setNewNote] = useState('')
  const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState('some error happened...') // highlight-line

  // ...

  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage} /> // highlight-line
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all' }
        </button>
      </div>      
      // ...
    </div>
  )
}
```

Ajoutons ensuite une règle de style qui convient à un message d'erreur :

```css
.error {
  color: red;
  background: lightgrey;
  font-size: 20px;
  border-style: solid;
  border-radius: 5px;
  padding: 10px;
  margin-bottom: 10px;
}
```
Nous sommes maintenant prêts à ajouter la logique pour afficher le message d'erreur. Modifions la fonction <em>toggleImportanceOf</em> de la manière suivante :

```js
  const toggleImportanceOf = id => {
    const note = notes.find(n => n.id === id)
    const changedNote = { ...note, important: !note.important }

    noteService
      .update(changedNote).then(returnedNote => {
        setNotes(notes.map(note => note.id !== id ? note : returnedNote))
      })
      .catch(error => {
        // highlight-start
        setErrorMessage(
          `Note '${note.content}' was already removed from server`
        )
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
        // highlight-end
        setNotes(notes.filter(n => n.id !== id))
      })
  }
```

Lorsque l'erreur se produit, nous ajoutons un message d'erreur descriptif à l'état <em>errorMessage</em>. En même temps, nous démarrons une minuterie, qui définira l'état <em>errorMessage</em> sur <em>null</em> après cinq secondes.

Le résultat ressemble à ceci :

![](../../images/2/26e.png)


Le code de l'état actuel de notre application se trouve sur la branche <i>part2-7</i> sur [GitHub](https://github.com/fullstack-hy2020/part2-notes/tree/part2-sept).

### Styles en ligne

React permet également d'écrire des styles directement dans le code en tant que [inline-styles](https://react-cn.github.io/react/tips/inline-styles.html).

L'idée derrière la définition des styles en ligne est extrêmement simple. Tout composant ou élément React peut être fourni avec un ensemble de propriétés CSS en tant qu'objet JavaScript via l'attribut [style](https://reactjs.org/docs/dom-elements.html#style).

Les règles CSS sont définies légèrement différemment dans JavaScript que dans les fichiers CSS normaux. Disons que nous voulions donner à un élément la couleur verte et une police en italique d'une taille de 16 pixels. En CSS, cela ressemblerait à ceci :

```css
{
  color: green;
  font-style: italic;
  font-size: 16px;
}
```

Mais en tant qu'objet de style en ligne React, cela ressemblerait à ceci :

```js
{
  color: 'green',
  fontStyle: 'italic',
  fontSize: 16
}
```

Chaque propriété CSS est définie comme une propriété distincte de l'objet JavaScript. Les valeurs numériques des pixels peuvent être simplement définies comme des nombres entiers. L'une des principales différences par rapport au CSS standard est que les propriétés CSS avec trait d'union (kebab case) sont écrites en camelCase.

Ensuite, nous pourrions ajouter un "bloc inférieur" à notre application en créant un composant <i>Footer</i> et en définissant les styles en ligne suivants pour celui-ci:

```js
// highlight-start
const Footer = () => {
  const footerStyle = {
    color: 'green',
    fontStyle: 'italic',
    fontSize: 16
  }

  return (
    <div style={footerStyle}>
      <br />
      <em>Note app, Department of Computer Science, University of Helsinki 2022</em>
    </div>
  )
}
// highlight-end

const App = () => {
  // ...

  return (
    <div>
      <h1>Notes</h1>

      <Notification message={errorMessage} />

      // ...  

      <Footer /> // highlight-line
    </div>
  )
}
```

Les styles en ligne comportent certaines limitations. Par exemple, les soi-disant [pseudo-classes](https://developer.mozilla.org/en-US/docs/Web/CSS/Pseudo-classes) ne peuvent pas être utilisées directement.

Les styles en ligne et certaines des autres façons d'ajouter des styles aux composants React vont complètement à l'encontre des anciennes conventions. Traditionnellement, il a été considéré comme une bonne pratique de séparer entièrement CSS du contenu (HTML) et de la fonctionnalité (JavaScript). Selon cette ancienne école de pensée, l'objectif était d'écrire CSS, HTML et JavaScript dans leurs fichiers séparés.

La philosophie de React est, en fait, à l'opposé de cela. Étant donné que la séparation de CSS, HTML et JavaScript dans des fichiers séparés ne semblait pas bien évoluer dans les applications plus grandes, React fonde la division de l'application sur les lignes de ses entités fonctionnelles logiques.

Les unités structurelles qui composent les entités fonctionnelles de l'application sont des composants React. Un composant React définit le HTML pour structurer le contenu, les fonctions JavaScript pour déterminer les fonctionnalités, ainsi que le style du composant ; tout en un seul endroit. Il s'agit de créer des composants individuels aussi indépendants et réutilisables que possible.

Le code de la version finale de notre application se trouve sur la branche <i>part2-8</i> sur [GitHub](https://github.com/fullstack-hy2020/part2-notes/tree/part2-8).

</div>

<div class="tasks">

<h3>Exercices 2.19.-2.20.</h3>

<h4>2.19: phonebook, étape11</h4>

Utilisez l'exemple de [message d'erreur amélioré](/en/part2/adding_styles_to_react_app#improved-error-message) de la partie 2 comme guide pour afficher une notification qui dure quelques secondes après l'exécution d'une opération réussie (une personne est ajoutée ou un nombre est modifié) :

![](../../images/2/27e.png)

<h4>2.20*: phonebook, étape12</h4>

Ouvrez votre application dans deux navigateurs. **Si vous supprimez une personne dans le navigateur 1**, essayer de <i>modifier le numéro de téléphone de la personne</i> dans le navigateur 2, vous obtiendrez le message d'erreur suivant :

![](../../images/2/29b.png)

Corrigez le problème selon l'exemple présenté dans [promises et erreurs](/en/part2/altering_data_in_server#promises-and-errors) dans la partie 2. Modifiez l'exemple afin qu'un message s'affiche lorsque l'opération échoue. Les messages affichés pour les événements réussis et non réussis doivent être différents :

![](../../images/2/28e.png)

**Note** Même si vous gérez l'exception, le message d'erreur est affiché sur la console.

C'était le dernier exercice de cette partie du cours. Il est temps de transmettre votre code à GitHub et de marquer tous vos exercices terminés dans le [système de soumission d'exercices](https://studies.cs.helsinki.fi/stats/courses/fullstackopen).

</div>
