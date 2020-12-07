---
mainImage: ../../../images/part-2.svg
part: 2
letter: b
lang: fi
---

<div class="content">

Jatketaan sovelluksen laajentamista siten, että se mahdollistaa uusien muistiinpanojen lisäämisen.

Jotta saisimme sivun päivittymään uusien muistiinpanojen lisäyksen yhteydessä, on parasta sijoittaa muistiinpanot komponentin <i>App</i> tilaan. Eli importataan funktio [useState](https://reactjs.org/docs/hooks-state.html) ja määritellään sen avulla komponentille tila, joka saa aluksi arvokseen propsina välitettävän muistiinpanot alustavan taulukon: 

```js
import React, { useState } from 'react' // highlight-line
import Note from './components/Note'

const App = (props) => { // highlight-line
  const [notes, setNotes] = useState(props.notes) // highlight-line

  return (
    <div>
      <h1>Notes</h1>
      <ul>
        {notes.map(note => 
          <Note key={note.id} note={note} />
        )}
      </ul>
    </div>
  )
}

export default App 
```

Komponentti siis alustaa funktion <em>useState</em> avulla tilan  <em>notes</em> arvoksi propseina välitettävän alustavan muistiinpanojen listan:

```js
const App = (props) => { 
  const [notes, setNotes] = useState(props.notes) 

  // ...
}
```

Jos haluaisimme lähteä liikkeelle tyhjästä muistiinpanojen listasta, annettaisiin tilan alkuarvoksi tyhjä taulukko, ja koska komponentti ei käyttäisi ollenkaan propseja, voitaisiin parametri <em>props</em> jättää kokonaan määrittelemättä:

```js
const App = () => { 
  const [notes, setNotes] = useState([]) 

  // ...
}  
```

Jätetään kuitenkin toistaiseksi tilalle alkuarvon asettava määrittely voimaan.

Lisätään seuraavaksi komponenttiin lomake eli HTML [form](https://developer.mozilla.org/en-US/docs/Learn/HTML/Forms) uuden muistiinpanon lisäämistä varten:

```js
const App = (props) => {
  const [notes, setNotes] = useState(props.notes)

// highlight-start 
  const addNote = (event) => {
    event.preventDefault()
    console.log('button clicked', event.target)
  }
  // highlight-end   

  return (
    <div>
      <h1>Notes</h1>
      <ul>
        {notes.map(note => 
          <Note key={note.id} note={note} />
        )}
      </ul>
      // highlight-start 
      <form onSubmit={addNote}>
        <input />
        <button type="submit">save</button>
      </form>   
      // highlight-end   
    </div>
  )
}
```

Lomakkeelle on lisätty myös tapahtumankäsittelijäksi funktio _addNote_ reagoimaan sen "lähettämiseen", eli napin painamiseen.

Tapahtumankäsittelijä on [osasta 1](/osa1/komponentin_tila_ja_tapahtumankasittely#tapahtumankasittely) tuttuun tapaan määritelty seuraavasti:

```js
const addNote = (event) => {
  event.preventDefault()
  console.log('button clicked'', event.target)
}
```

Parametrin <em>event</em> arvona on metodin kutsun aiheuttama [tapahtuma](https://reactjs.org/docs/handling-events.html).

Tapahtumankäsittelijä kutsuu heti tapahtuman metodia <em>event.preventDefault()</em> jolla se estää lomakkeen lähetyksen oletusarvoisen toiminnan, joka aiheuttaisi mm. sivun uudelleenlatautumisen.

Tapahtuman kohde, eli _event.target_ on tulostettu konsoliin

![](../../images/2/6e.png)

Kohteena on siis komponentin määrittelemä lomake.

Miten pääsemme käsiksi lomakkeen <i>input</i>-komponenttiin syötettyyn dataan?

Tapoja on useampia, tutustumme ensin ns. [kontrolloituina komponentteina](https://reactjs.org/docs/forms.html#controlled-components) toteutettuihin lomakkeisiin.

Lisätään komponentille <i>App</i> tila <em>newNote</em> lomakkeen syötettä varten **ja** määritellään se <i>input</i>-komponentin attribuutin <i>value</i> arvoksi:

```js
const App = (props) => {
  const [notes, setNotes] = useState(props.notes)
  // highlight-start
  const [newNote, setNewNote] = useState(
    'a new note...'
  ) 
  // highlight-end

  const addNote = (event) => {
    event.preventDefault()
    console.log('button clicked', event.target)
  }

  return (
    <div>
      <h1>Notes</h1>
      <ul>
        {notes.map(note => 
          <Note key={note.id} note={note} />
        )}
      </ul>
      <form onSubmit={addNote}>
        <input value={newNote} /> //highlight-line
        <button type="submit">save</button>
      </form>   
    </div>
  )
}
```

Tilaan <em>newNote</em> määritelty "placeholder"-teksti <i>uusi muistiinpano...</i> ilmestyy syötekomponenttiin, tekstiä ei kuitenkaan voi muuttaa. Konsoliin tuleekin ikävä varoitus joka kertoo mistä on kyse

![](../../images/2/7e.png)

Koska määrittelimme syötekomponentille <i>value</i>-attribuutiksi komponentin <i>App</i> tilassa olevan muuttujan, alkaa <i>App</i> [kontrolloimaan](https://reactjs.org/docs/forms.html#controlled-components) syötekomponentin toimintaa.

Jotta kontrolloidun syötekomponentin editoiminen olisi mahdollista, täytyy sille rekisteröidä <i>tapahtumankäsittelijä</i>, joka synkronoi syötekenttään tehdyt muutokset komponentin <i>App</i> tilaan:

```js
const App = (props) => {
  const [notes, setNotes] = useState(props.notes)
  const [newNote, setNewNote] = useState(
    'a new note...'
  ) 

  // ...

// highlight-start
  const handleNoteChange = (event) => {
    console.log(event.target.value)
    setNewNote(event.target.value)
  }
// highlight-end

  return (
    <div>
      <h1>Notes</h1>
      <ul>
        {notes.map(note => 
          <Note key={note.id} note={note} />
        )}
      </ul>
      <form onSubmit={addNote}>
        <input
          value={newNote}
          onChange={handleNoteChange} // highlight-line
        />
        <button type="submit">save</button>
      </form>   
    </div>
  )
}
```

Lomakkeen <i>input</i>-komponentille on nyt rekisteröity tapahtumankäsittelijä tilanteeseen <i>onChange</i>:

```js
<input
  value={newNote}
  onChange={handleNoteChange}
/>
```

Tapahtumankäsittelijää kutsutaan <i>aina kun syötekomponentissa tapahtuu jotain</i>. Tapahtumankäsittelijämetodi saa parametriksi tapahtumaolion <em>event</em>

```js
const handleNoteChange = (event) => {
  console.log(event.target.value)
  setNewNote(event.target.value)
}
```

Tapahtumaolion kenttä <em>target</em> vastaa nyt kontrolloitua <i>input</i>-kenttää ja <em>event.target.value</em> viittaa inputin syötekentän arvoon.

Huomaa, että toisin kuin lomakkeen lähettämistä vastaavan tapahtuman <i>onSubmit</i> käsittelijässä, nyt oletusarvoisen toiminnan estävää metodikutusua _event.preventDefault()_ ei tarvita, sillä syötekentän muutoksella ei ole oletusarvoista toimintaa toisin kuin lomakkeen lähettämisellä.

Voit seurata konsolista miten tapahtumankäsittelijää kutsutaan:

![](../../images/2/8e.png)

Muistithan jo asentaa [React devtoolsin](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi)? Devtoolsista näet, miten tila muuttuu syötekenttään kirjoitettaessa:

![](../../images/2/9ea.png)

Nyt komponentin <i>App</i> tila <em>newNote</em> heijastaa koko ajan syötekentän arvoa, joten voimme viimeistellä uuden muistiinpanon lisäämisestä huolehtivan metodin <em>addNote</em>:

```js
const addNote = (event) => {
  event.preventDefault()
  const noteObject = {
    content: newNote,
    date: new Date().toISOString(),
    important: Math.random() > 0.5,
    id: notes.length + 1,
  }

  setNotes(notes.concat(noteObject))
  setNewNote('')
}
```

Ensin luodaan uutta muistiinpanoa vastaava olio <em>noteObject</em>, jonka sisältökentän arvo saadaan komponentin tilasta <em>newNote</em>. Yksikäsitteinen tunnus eli <i>id</i> generoidaan kaikkien muistiinpanojen lukumäärän perusteella. Koska muistiinpanoja ei poisteta, menetelmä toimii sovelluksessamme. Komennon <em>Math.random()</em> avulla muistiinpanosta tulee 50% todennäköisyydellä tärkeä.

Uusi muistiinpano lisätään vanhojen joukkoon oikeaoppisesti käyttämällä [osasta 1](/osa1/javascriptia#taulukot) tuttua taulukon metodia [concat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/concat):

```js
setNotes(notes.concat(noteObject))
```

Metodi ei muuta alkuperäistä tilaa <em>notes</em> vaan luo <i>uuden taulukon, joka sisältää myös lisättävän alkion</i>. Tämä on tärkeää, sillä Reactin tilaa [ei saa muuttaa suoraan](https://reactjs.org/docs/state-and-lifecycle.html#using-state-correctly)!

Tapahtumankäsittelijä tyhjentää myös syötekenttää kontrolloivan tilan <em>newNote</em> sen funktiolla <em>setNewNote</em>

```js
setNewNote('')
```

Sovelluksen tämän hetkinen koodi on kokonaisuudessaan [githubissa](https://github.com/fullstack-hy2020/part2-notes/tree/part2-2), branchissä <i>part2-2</i>.

### Näytettävien elementtien filtteröinti

Tehdään sovellukseen toiminto, joka mahdollistaa ainoastaan tärkeiden muistiinpanojen näyttämisen.

Lisätään komponentin <i>App</i> tilaan tieto siitä näytetäänkö muistiinpanoista kaikki vai ainoastaan tärkeät:

```js
const App = (props) => {
  const [notes, setNotes] = useState(props.notes) 
  const [newNote, setNewNote] = useState('')
  const [showAll, setShowAll] = useState(true) // highlight-line
  
  // ...
}
```

Muutetaan komponenttia siten, että se tallettaa muuttujaan <em>notesToShow</em> näytettävien muistiinpanojen listan riippuen siitä tuleeko näyttää kaikki vai vain tärkeät:

```js
import React, { useState } from 'react'
import Note from './components/Note'

const App = (props) => {
  const [notes, setNotes] = useState(props.notes)
  const [newNote, setNewNote] = useState('') 
  const [showAll, setShowAll] = useState(true)

  // ...

// highlight-start
  const notesToShow = showAll
    ? notes
    : notes.filter(note => note.important === true)
// highlight-end

  return (
    <div>
      <h1>Notes</h1>
      <ul>
        {notesToShow.map(note => // highlight-line
          <Note key={note.id} note={note} />
        )}
      </ul>
      // ...
    </div>
  )
}
```

Muuttujan <em>notesToShow</em> määrittely on melko kompakti

```js
const notesToShow = showAll
  ? notes
  : notes.filter(note => note.important === true)
```

Käytössä on monissa muissakin kielissä oleva [ehdollinen](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_Operator) operaattori.

Operaattori toimii seuraavasti. Jos meillä on esim:

```js
const tulos = ehto ? val1 : val2
```

muuttujan <em>tulos</em> arvoksi asetetaan <em>val1</em>:n arvo jos <em>ehto</em> on tosi. Jos <em>ehto</em> ei ole tosi, muuttujan <em>tulos</em> arvoksi tulee <em>val2</em>:n arvo.

Eli jos tilan arvo <em>showAll</em> on epätosi, muuttuja <em>notesToShow</em> saa arvokseen vaan ne muistiinpanot, joiden <em>important</em>-kentän arvo on tosi. Filtteröinti tapahtuu taulukon metodilla [filter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter):

```js
notes.filter(note => note.important === true)
```

Vertailuoperaatio on oikeastaan turha, koska <em>note.important</em> on arvoltaan joko <i>true</i> tai <i>false</i>, eli riittää, kun kirjoittaa:

```js
notes.filter(note => note.important)
```

Tässä käytettiin kuitenkin ensin vertailuoperaattoria, mm. korostamaan erästä tärkeää seikkaa: Javascriptissa <em>arvo1 == arvo2</em> ei toimi kaikissa tilanteissa loogisesti ja onkin varmempi käyttää aina vertailuissa muotoa <em>arvo1 === arvo2</em>. Enemmän aiheesta [täällä](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Equality_comparisons_and_sameness).

Filtteröinnin toimivuutta voi jo nyt kokeilla vaihtelemalla sitä, miten tilan kentän <em>showAll</em> alkuarvo määritellään konstruktorissa.

Lisätään sitten toiminnallisuus, joka mahdollistaa <em>showAll</em>:in tilan muuttamisen sovelluksesta.

Oleelliset muutokset ovat seuraavassa:

```js
import React, { useState } from 'react' 
import Note from './components/Note'

const App = (props) => {
  const [notes, setNotes] = useState(props.notes) 
  const [newNote, setNewNote] = useState('')
  const [showAll, setShowAll] = useState(true)

  // ...

  const notesToShow = showAll
    ? notes
    : notes.filter(note => note.important)

  return (
    <div>
      <h1>Notes</h1>
      // highlight-start  
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all' }
        </button>
      </div>      
      // highlight-end  
      <ul>
        {notesToShow.map(note =>
          <Note key={note.id} note={note} />
        )}
      </ul>
      // ...
    </div>
  )
}
```

Näkyviä muistiinpanoja (kaikki vai ainoastaan tärkeät) siis kontrolloidaan napin avulla. Napin tapahtumankäsittelijä on niin yksinkertainen että se on kirjotettu suoraan napin attribuutiksi. Tapahtumankäsittelijä muuttaa _showAll_:n arvon truesta falseksi ja päinvastoin:

```js
() => setShowAll(!showAll)
```

Napin teksti riippuu tilan <em>showAll</em> arvosta:

```js
show {showAll ? 'important' : 'all' }
```

Sovelluksen tämän hetkinen koodi on kokonaisuudessaan [githubissa](https://github.com/fullstack-hy2020/part2-notes/tree/part2-3), branchissa <i>part2-3</i>.

</div>

<div class="tasks">

<h3>Tehtävät 2.6.-2.10.</h3>

<i>Seuraavassa tehtävässä aloitettavaa ohjelmaa kehitellään eteenpäin muutamassa seuraavassa tehtävässä. Tässä ja kurssin aikana muissakin vastaantulevissa tehtäväsarjoissa ohjelman lopullisen version palauttaminen riittää, voit toki halutessasi tehdä commitin jokaisen tehtävän jälkeisestä tilanteesta, mutta se ei ole välttämätöntä.</i>

**VAROITUS** create-react-app tekee projektista automaattisesti git-repositorion, ellei sovellusta luoda jo olemassaolevan repositorion sisälle. Todennäköisesti **et halua** että projektista tulee repositorio, joten suorita projektin juuressa komento _rm -rf .git_.

<h4>2.6: puhelinluettelo step1</h4>

Toteutetaan yksinkertainen puhelinluettelo. <i>**Aluksi luetteloon lisätään vaan nimiä.**</i>

Toteutetaan tässä tehtävässä henkilön lisäys puhelinluetteloon.

Voit ottaa sovelluksesi komponentin <i>App</i> pohjaksi seuraavan:

```js
import React, { useState } from 'react'

const App = () => {
  const [ persons, setPersons] = useState([
    { name: 'Arto Hellas' }
  ]) 
  const [ newName, setNewName ] = useState('')

  return (
    <div>
      <h2>Phonebook</h2>
      <form>
        <div>
          name: <input />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      ...
    </div>
  )

}

export default App
```

Tila <em>newName</em> on tarkoitettu lomakkeen kentän kontrollointiin.

Joskus tilaa tallettavia ja tarvittaessa muitakin muuttujia voi olla hyödyllistä renderöidä debugatessa komponenttiin, eli voi tilapäisesti lisätä komponentin  palauttamaan koodiin esim. seuraavan:

```
<div>debug: {newName}</div>
```

Muista myös osan 1 luku [React-sovellusten debuggaus](/osa1/monimutkaisempi_tila_reactin_debuggaus#react-sovellusten-debuggaus), erityisesti [react developer tools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi) on välillä todella kätevä komponentin tilan muutosten seuraamisessa.

Sovellus voi näyttää tässä vaiheessa seuraavalta:

![](../../images/2/10ea.png)

Huomaa, React developer toolsin käyttö!

**Huom:**

- voit käyttää kentän <i>key</i> arvona henkilön nimeä
- muista estää lomakkeen lähetyksen oletusarvoinen toiminta!

<h4>2.7: puhelinluettelo step2</h4>

Jos lisättävä nimi on jo sovelluksen tiedossa, estä lisäys. Taulukolla on lukuisia sopivia [metodeja](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) tehtävän tekemiseen.

Anna tilanteessa virheilmoitus komennolla [alert](https://developer.mozilla.org/en-US/docs/Web/API/Window/alert):

![](../../images/2/11e.png)

**Muistutus edellisestä osasta:** kun muodostat Javascriptissä merkkijonoja muuttujaan perustuen, on tyylikkäin tapa asian hoitamiseen [template string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals):

```js
`${newName} is already added to phonebook`
```

Jos muuttujalla <em>newName</em> on arvona <i>Arto Hellas</i>, on tuloksena merkkijono

```js
`Arto Hellas is already added to phonebook`
```

Sama toki hoituisi javamaisesti merkkijonojen plus-metodilla

```js
newName + ' is already added to phonebook'
```

Template stringin käyttö antaa kuitenkin ammattimaisemman vaikutelman.

<h4>2.8: puhelinluettelo step3</h4>

Lisää sovellukseen mahdollisuus antaa henkilöille puhelinnumero. Tarvitset siis lomakkeeseen myös toisen <i>input</i>-elementin (ja sille oman muutoksenkäsittelijän):

```js
<form>
  <div>name: <input /></div>
  <div>number: <input /></div>
  <div><button type="submit">add</button></div>
</form>
```

Sovellus voi näyttää tässä vaiheessa seuraavalta. Kuvassa myös [react developer tools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi):in tarjoama näkymä komponentin <i>App</i> tilaan:

![](../../images/2/12ea.png)

<h4>2.9*: puhelinluettelo step4</h4>

Tee lomakkeeseen hakukenttä, jonka avulla näytettävien nimien listaa voidaan rajata:

![](../../images/2/13e.png)

Rajausehdon syöttämisen voi hoitaa omana lomakkeeseen kuulumattomana <i>input</i>-elementtinä. Kuvassa rajausehdosta on tehty <i>caseinsensitiivinen</i> eli ehto <i>arto</i> löytää isolla kirjaimella kirjoitetun Arton.

**Huom:** Kun toteutat jotain uutta toiminnallisuutta, on usein hyötyä 'kovakoodata' sovellukseen jotain sisältöä, esim.

```js
const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456' },
    { name: 'Ada Lovelace', number: '39-44-5323523' },
    { name: 'Dan Abramov', number: '12-43-234345' },
    { name: 'Mary Poppendieck', number: '39-23-6423122' }
  ])

  // ...
}
```

Näin vältytään turhalta manuaaliselta työltä, missä testaaminen edellyttäisi myös testiaineiston syöttämistä käsin sovelluksen lomakkeen kautta.

<h4>2.10: puhelinluettelo step5</h4>

Jos koko sovelluksesi on tehty yhteen komponenttiin, refaktoroi sitä eriyttämällä sopivia komponentteja. Pidä kuitenkin edelleen kaikki tila- sekä tapahtumankäsittelijäfunktiot juurikomponentissa <i>App</i>.

Riittää että erotat sovelluksesta <i>**kolme**</i> komponenttia. Hyviä kandidaatteja ovat esim. filtteröintilomake, uuden henkilön lisäävä lomake, kaikki henkilöt renderöivä komponentti sekä yksittäisen henkilön renderöivä komponentti.

Sovelluksen juurikomponentti voi näyttää refaktoroinnin jälkeen suunnilleen seuraavalta, eli se ei itse renderöi suoraan oikeastaan mitään muita kuin otsikkoja:

```js
const App = () => {
  // ...

  return (
    <div>
      <h2>Phonebook</h2>

      <Filter ... />

      <h3>Add a new</h3>

      <PersonForm 
        ...
      />

      <h3>Numbers</h3>

      <Persons ... />
    </div>
  )
}
```

**HUOM**: saatat törmätä ongelmiin tässä tehtävässä, jos määrittelet komponentteja "väärässä paikassa", nyt kannattaakin ehdottomasti kerrata edellisen osan luku [älä määrittele komponenttia komponentin sisällä](/osa1/monimutkaisempi_tila_reactin_debuggaus#ala-maarittele-komponenttia-komponentin-sisalla).

</div>
