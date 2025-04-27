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

<h3>Exercices 2.16.-2.17.</h3>

<h4>2.16: phonebook, étape11</h4>

Utilisez l'exemple de [message d'erreur amélioré](/en/part2/adding_styles_to_react_app#improved-error-message) de la partie 2 comme guide pour afficher une notification qui dure quelques secondes après l'exécution d'une opération réussie (une personne est ajoutée ou un nombre est modifié) :

![](../../images/2/27e.png)

<h4>2.17*: phonebook, étape12</h4>

Ouvrez votre application dans deux navigateurs. **Si vous supprimez une personne dans le navigateur 1**, essayer de <i>modifier le numéro de téléphone de la personne</i> dans le navigateur 2, vous obtiendrez le message d'erreur suivant :

![](../../images/2/29b.png)

Corrigez le problème selon l'exemple présenté dans [promises et erreurs](/en/part2/altering_data_in_server#promises-and-errors) dans la partie 2. Modifiez l'exemple afin qu'un message s'affiche lorsque l'opération échoue. Les messages affichés pour les événements réussis et non réussis doivent être différents :

![](../../images/2/28e.png)

**Note** Même si vous gérez l'exception, le message d'erreur est affiché sur la console.

</div>

<div class="content">

### Quelques remarques importantes

À la fin de cette partie, vous trouverez quelques exercices plus difficiles. À ce stade, vous pouvez les ignorer s'ils vous semblent trop complexes. Nous y reviendrons plus tard. Quoi qu'il en soit, ce document mérite d'être lu.

Nous avons fait, dans notre application, quelque chose qui masque une source d'erreur très courante.

Nous avons initialisé l'etat de _notes_ à partir d'un tableau vide:

```js
const App = () => {
  const [notes, setNotes] = useState([])

  // ...
}
```

C'est une valeur initiale tout à fait naturelle, puisque notes constitue un ensemble, c'est-à-dire qu'il y a de nombreuses notes que l'état va stocker.

Si l'état ne devait sauvegarder  qu' " une seule chose ", une valeur initiale plus appropriée serait null, ce qui indique qu'il n'y a <i>rien</i> dans l'état au départ. Voyons ce qui se passe si nous utilisons cette valeur initiale :

```js
const App = () => {
  const [notes, setNotes] = useState(null) // highlight-line

  // ...
}
```

L'application plante:

![console typerror cannot read properties of null via map from App](../../images/2/31a.png)

Le message d'erreur indique la raison et l'emplacement de l'erreur. Le code qui a provoqué le problème est le suivant :

```js
  // notesToShow gets the value of notes
  const notesToShow = showAll
    ? notes
    : notes.filter(note => note.important)

  // ...

  {notesToShow.map(note =>  // highlight-line
    <Note key={note.id} note={note} />
  )}
```

Le message d'erreur est:

```bash
Cannot read properties of null (reading 'map')
```

La variable _notesToShow_ est d'abord assigné à la valeur de l'état _notes_ puis le code tente d'appeler la méthode _map_ sur un object inexistant, c'est à dire sur _null_.

Pourquoi ?

Le hook d'effet(useEffect) utilise la fonction _setNotes_ pour affecter à _notes_ les données renvoyées par le back-end

```js
  useEffect(() => {
    noteService
      .getAll()
      .then(initialNotes => {
        setNotes(initialNotes)  // highlight-line
      })
  }, [])
```

Cependant, le problème est que le hook d'effet n'est exécuté qu'<i>après le premier rendu</i>.
Et puisque _notes_ a pour valeur initiale null:

```js
const App = () => {
  const [notes, setNotes] = useState(null) // highlight-line

  // ...
```

Lors du premier rendu, le code suivant est exécuté :

```js
notesToShow = notes

// ...

notesToShow.map(note => ...)
```

et cela fait planter l'application, car on ne peut pas appeler la méthode _map_ sur une valeur _null_.

En initialisant _notes_ avec un tableau vide, il n'y a pas d'erreur puisqu'il est permis d'utiliser _map_ sur un tableau vide

Ainsi, l'initialisation de l'état a  "masqué"  le problème lié au fait que les données ne sont pas encore récupérées depuis le backend

une autre manière de contourner le problème aurait été d'utiliser un <i>rendu conditionnel</i> et de retourner null tant que l'état du composant n'est pas correctement initialisé :

```js
const App = () => {
  const [notes, setNotes] = useState(null) // highlight-line
  // ... 

  useEffect(() => {
    noteService
      .getAll()
      .then(initialNotes => {
        setNotes(initialNotes)
      })
  }, [])

  // do not render anything if notes is still null
  // highlight-start
  if (!notes) { 
    return null 
  }
  // highlight-end

  // ...
} 
```

Donc, lors du premier rendu, rien n'est affiché. Lorsque les notes arrivent du backend, l'effet utilise la fonction _setNotes_ our mettre à jour la valeur de l'état _notes_. Cela provoque un nouveau rendu du composant, et lors de ce second rendu, les notes sont affichées à l'écran.

Cette méthode basée sur le rendu conditionnel convient dans les cas où il est impossible de définir l'état de façon à permettre un rendu initial.

L'autre point auquel il nous faut encore jeter un œil est le second paramètre de useEffect:

```js
  useEffect(() => {
    noteService
      .getAll()
      .then(initialNotes => {
        setNotes(initialNotes)  
      })
  }, []) // highlight-line
```

Le second paramètre de <em>useEffect</em> sert à [spécifier la fréquence d'exécution de l'effet](https://react.dev/reference/react/useEffect#parameters). Le principe est que l'effet s'exécute systématiquement après le premier rendu du composant <i>et</i> à chaque fois que la valeur de ce second paramètre change.

Si ce second paramètre est un tableau vide <em>[]</em>, son contenu ne change jamais et l'effet n'est exécuté qu'après le premier rendu du composant. C'est exactement ce que l'on souhaite lorsqu'on initialise l'état de l'application depuis le serveur.

Cependant, il existe des situations où l'on veut exécuter cet effet à d'autres moments, par exemple lorsque l'état du composant change de manière particulière.

Considérons l'exemple d'une application simple pour interroger les taux de change via [l'Api de taux de change](https://www.exchangerate-api.com/):

```js
import { useState, useEffect } from 'react'
import axios from 'axios'

const App = () => {
  const [value, setValue] = useState('')
  const [rates, setRates] = useState({})
  const [currency, setCurrency] = useState(null)

  useEffect(() => {
    console.log('effect run, currency is now', currency)

    // skip if currency is not defined
    if (currency) {
      console.log('fetching exchange rates...')
      axios
        .get(`https://open.er-api.com/v6/latest/${currency}`)
        .then(response => {
          setRates(response.data.rates)
        })
    }
  }, [currency])

  const handleChange = (event) => {
    setValue(event.target.value)
  }

  const onSearch = (event) => {
    event.preventDefault()
    setCurrency(value)
  }

  return (
    <div>
      <form onSubmit={onSearch}>
        currency: <input value={value} onChange={handleChange} />
        <button type="submit">exchange rate</button>
      </form>
      <pre>
        {JSON.stringify(rates, null, 2)}
      </pre>
    </div>
  )
}

export default App
```

L'interface utilisateur de l'application comporte un formulaire dont le champ de saisie reçoit le code de la devise désirée. Si la devise existe, l'application affiche ses taux de change par rapport aux autres monnaies :

![navigateur affichant les taux de change avec eur saisi et console indiquant fetching exchange rates](../../images/2/32new.png)

Lorsque l’on appuie sur le bouton, l’application stocke la devise saisie dans l’état _currency_.

Dès que la valeur de  _currency_ change, l’application récupère ses taux de change depuis l’API dans la fonction d’effet :

```js
const App = () => {
  // ...
  const [currency, setCurrency] = useState(null)

  useEffect(() => {
    console.log('effect run, currency is now', currency)

    // skip if currency is not defined
    if (currency) {
      console.log('fetching exchange rates...')
      axios
        .get(`https://open.er-api.com/v6/latest/${currency}`)
        .then(response => {
          setRates(response.data.rates)
        })
    }
  }, [currency]) // highlight-line
  // ...
}
```

Le hook useEffect prend désormais  _[currency]_ comme second paramètre. La fonction d’effet s’exécute donc après le premier rendu et <i>à chaque fois</i> que la valeur de ce second paramètre  _[currency]_ change. Autrement dit, lorsque l’état _currency_ reçoit une nouvelle valeur, le contenu du tableau est mis à jour et la fonction d’effet est relancée.

Il est normal de choisir _null_ comme valeur initiae pour la variable _currency_, puisque _currency_ ne stocke qu'un seul élément. la valeur _null_ indique qu’il n’y a encore rien dans l’état, et il est très simple, à l’aide d’un if, de vérifier si la variable a reçu une valeur. L’effet comporte donc la condition suivante :

```js
if (currency) { 
  // exchange rates are fetched
}
```

ce qui empêche de requêter les taux de change juste après le premier rendu lorsque la variable _currency_ a encore sa valeur initiale, c’est-à-dire _null_.

Ainsi, si l’utilisateur saisit par exemple <i>eur</i> dans le champ de recherche, l’application utilise Axios pour effectuer une requête HTTP GET vers l’adresse <https://open.er-api.com/v6/latest/eur> et stocke la réponse dans l’état _rates_.

Lorsque l’utilisateur saisit ensuite une autre valeur dans le champ de recherche, par exemple <i>usd</i>, la fonction d’effet est de nouveau exécutée et les taux de change de la nouvelle devise sont récupérés depuis l’API.

La méthode présentée ici pour effectuer les requêtes API peut sembler un peu lourde. Cette application particulière aurait pu être réalisée entièrement sans utiliser useEffect en effectuant les requêtes directement dans le gestionnaire de soumission du formulaire :

```js
const onSearch = (event) => {
  event.preventDefault()
  axios
    .get(`https://open.er-api.com/v6/latest/${value}`)
    .then(response => {
      setRates(response.data.rates)
    })
}
```

Cependant, il existe des situations où cette technique ne fonctionnerait pas. Par exemple, vous <i>pourriez</i> rencontrer un tel cas dans l’exercice 2.20 où l’utilisation de _useEffect_ pourrait apporter une solution. Notez que cela dépend beaucoup de l’approche choisie ; par exemple, la solution modèle n’utilise pas toujours cette astuce.

</div>

<div class="tasks">

<h3>Exercices 2.18.-2.20.</h3>

<h4>2.18* countries, étape1</h4>

L'API [https://restcountries.com](https://restcountries.com) fournit des données pour différents pays dans un format lisible par machine, appelé API REST.

Créer une application, dans laquelle on peut consulter les données de différents pays. L'application devrait probablement obtenir les données du end point [all](https://restcountries.com/v3.1/all).

L'interface utilisateur est très simple. Le pays à afficher est trouvé en tapant une requête de recherche dans le champ de recherche.

S'il y a trop de pays (plus de 10) qui correspondent à la requête, l'utilisateur est invité à préciser sa requête :

![](../../images/2/19b1.png)

S'il y a dix pays ou moins, mais plus d'un, tous les pays correspondant à la requête sont affichés :

![](../../images/2/19b2.png)

Lorsqu'il n'y a qu'un seul pays correspondant à la requête, les données de base du pays (par exemple, sa capitale et sa superficie), son drapeau et les langues qui y sont parlées sont affichés :

![](../../images/2/19c3.png)

**NB** : Il suffit que votre application fonctionne pour la plupart des pays. Certains pays, comme le <i>Soudan</i>, peuvent être difficiles à soutenir, car le nom du pays fait partie du nom d'un autre pays, le <i>Soudan du Sud</i>. Vous n'avez pas à vous soucier de ces cas extrêmes.

<h4>2.19*: countries, étape2</h4>

**Il y a encore beaucoup à faire dans cette partie, alors ne restez pas bloqué sur cet exercice !**

Améliorez l'application de l'exercice précédent, de sorte que lorsque les noms de plusieurs pays sont affichés sur la page, il y a un bouton à côté du nom du pays, qui, lorsqu'il est pressé, affiche la vue pour ce pays :

![](../../images/2/19b4.png)

Dans cet exercice, il suffit également que votre application fonctionne pour la plupart des pays. Les pays dont le nom apparaît dans le nom d'un autre pays, comme le <i>Soudan</i>, peuvent être ignorés.

<h4>2.20*: countries, étape3</h4>

Ajoutez à la vue montrant les données d'un seul pays, le bulletin météo de la capitale de ce pays. Il existe des dizaines de fournisseurs de données météorologiques. Une API suggérée est [https://openweathermap.org](https://openweathermap.org). Notez que cela peut prendre quelques minutes avant qu'une clé API générée soit valide.

![](../../images/2/19x.png)

Si vous utilisez Open weather map, trouvez [ici](https://openweathermap.org/weather-conditions#Icon-list) une description de comment obtenir des icônes météo.

**NB :** Dans certains navigateurs (tels que Firefox), l'API choisie peut envoyer une réponse d'erreur, ce qui indique que le cryptage HTTPS n'est pas pris en charge, bien que l'URL de la requête commence par _http://_. Ce problème peut être résolu en effectuant l'exercice à l'aide de Chrome.

**NB :** Vous avez besoin d'une clé API pour utiliser presque tous les services météorologiques. N'enregistrez pas la clé API dans le contrôle de code source ! Ni coder en dur la clé API dans votre code source. Utilisez plutôt une [variable d'environnement](https://vitejs.dev/guide/env-and-mode.html) pour enregistrer la clé.
Dans les applications réelles, il est considéré comme peu sûr d’envoyer ces clés directement depuis le navigateur, car toute personne pouvant ouvrir la console développeur pourrait intercepter vos clés ! Nous verrons comment implémenter un backend séparé dans la prochaine partie du cours.

En supposant que la clé API est <i>4l41n3n4v41m34rv0</i>, lorsque l'application est démarrée comme suit :

```bash
export VITE_SOME_KEY=54l41n3n4v41m34rv0 && npm run dev   # Linux/macOS Bash
($env:VITE_SOME_KEY="54l41n3n4v41m34rv0") -and (npm run dev)   # Windows PowerShell
set "VITE_SOME_KEY=54l41n3n4v41m34rv0" && npm run dev   # Windows cmd.exe
```

vous pouvez accéder à la valeur de la clé via l’objet import.meta.env :

```js
const api_key = import.meta.env.VITE_SOME_KEY
// la variable api_key a maintenant la valeur définie au démarrage
```

**NB :**  Pour éviter de divulguer accidentellement des variables d’environnement au client, seules celles préfixées par VITE_ sont exposées à Vite.

N’oubliez pas que si vous modifiez des variables d’environnement, vous devez redémarrer le serveur de développement pour que les changements soient pris en compte.

C'était le dernier exercice de cette partie du cours. Il est temps de transmettre votre code à GitHub et de marquer tous vos exercices terminés dans le [système de soumission d'exercices](https://studies.cs.helsinki.fi/stats/courses/fullstackopen).

</div>


