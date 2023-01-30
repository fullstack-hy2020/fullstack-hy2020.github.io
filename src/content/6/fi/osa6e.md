---
mainImage: ../../../images/part-6.svg
part: 6
letter: e
lang: fi
---

<div class="tasks">

**HUOM**: tämä on osan 6 vanha päätösluku joka korvattiin 30.1.2023 [uudella luvulla](/osa6/react_query_use_reducer_ja_contex), joka käsittelee React Queryä, useReduceria ja contextia. Tämä luku säilyy nähtävillä muutaman viikon ajan.

Jos olet jo ehtinyt aloittaa Redux connectia käsittelevät tehtävät (6.19-6.21), voit tehdä ne loppuun. Muussa tapauksessa suosittelen siirtymään uuteen lukuun.
</div>

<div class="content">

###

Olemme käyttäneet Redux-storea React Redux -kirjaston [hook](https://react-redux.js.org/api/hooks)-apin eli funktioiden [useSelector](https://react-redux.js.org/api/hooks#useselector) ja [useDispatch](https://react-redux.js.org/api/hooks#usedispatch) avulla.

Tarkastellaan tämän osan lopuksi toista, hieman vanhempaa ja jonkin verran monimutkaisempaa tapaa Reduxin käyttöön eli [React Redux](https://github.com/reactjs/react-redux) -kirjaston määrittelemää [connect](https://github.com/reduxjs/react-redux/blob/master/docs/api/connect.md)-funktiota.

<i>**Uusissa sovelluksissa kannattaa ehdottomasti käyttää hook-apia**</i>, mutta _connect_-funktion tuntemisesta on hyötyä vanhempia Reduxia käyttäviä projekteja ylläpidettäessä.

### Redux-storen välittäminen komponentille connect-funktiolla

Muutetaan sovelluksen komponenttia <i>Notes</i> siten, että korvataan hook-apin eli funktioiden _useDispatch_ ja _useSelector_ käyttö funktiolla _connect_. Komponentin seuraavat osat tulee siis muuttaa:

````js
import { useDispatch, useSelector } from 'react-redux' // highlight-line
import { toggleImportanceOf } from '../reducers/noteReducer'

const Notes = () => {
  // highlight-start
  const dispatch = useDispatch() 
  const notes = useSelector(({filter, notes}) => {
    if ( filter === 'ALL' ) {
      return notes
    }
    return filter  === 'IMPORTANT' 
      ? notes.filter(note => note.important)
      : notes.filter(note => !note.important)
  })
  // highlight-end

  return (
    <ul>
      {notes.map(note =>
        <Note
          key={note.id}
          note={note}
          handleClick={() => 
            dispatch(toggleImportanceOf(note.id)) // highlight-line
          }
        />
      )}
    </ul>
  )
}

export default Notes
````

Funktiota _connect_ käyttämällä "normaaleista" React-komponenteista saadaan muodostettua komponentteja, joiden <i>propseihin</i> on "mäpätty" eli yhdistetty haluttuja osia storen määrittelemästä tilasta.

Muodostetaan ensin komponentista <i>Notes</i> _connect_-funktion avulla <i>yhdistetty komponentti</i>:

```js
import { connect } from 'react-redux' // highlight-line
import { toggleImportanceOf } from '../reducers/noteReducer'

const Notes = () => {
  // ...
}

const ConnectedNotes = connect()(Notes) // highlight-line
export default ConnectedNotes           // highlight-line
```

Moduuli eksporttaa nyt alkuperäisen komponentin sijaan <i>yhdistetyn komponentin</i>, joka toimii toistaiseksi täsmälleen alkuperäisen komponentin kaltaisesti.

Komponentti tarvitsee storesta sekä muistiinpanojen listan että filtterin arvon. Funktion _connect_ ensimmäisenä parametrina voidaan määritellä funktio [mapStateToProps](https://github.com/reduxjs/react-redux/blob/master/docs/api/connect.md#connect-parameters), joka liittää joitakin storen tilan perusteella määriteltyjä asioita _connect_-funktiolla muodostetun <i>yhdistetyn komponentin</i> propseiksi.

Jos määritellään:

```js
const Notes = (props) => { // highlight-line
  const dispatch = useDispatch()

// highlight-start
  const notesToShow = () => {
    if ( props.filter === 'ALL') {
      return props.notes
    }
    
    return props.filter  === 'IMPORTANT' 
      ? props.notes.filter(note => note.important)
      : props.notes.filter(note => !note.important)
  }
  // highlight-end

  return (
    <ul>
      {notesToShow().map(note => // highlight-line
        <Note
          key={note.id}
          note={note}
          handleClick={() => 
            dispatch(toggleImportanceOf(note.id))
          }
        />
      )}
    </ul>
  )
}

const mapStateToProps = (state) => {
  return {
    notes: state.notes,
    filter: state.filter,
  }
}

const ConnectedNotes = connect(mapStateToProps)(Notes) // highlight-line

export default ConnectedNotes
```

on komponentin <i>Notes</i> sisällä mahdollista viitata storen tilaan, esim. muistiinpanoihin suoraan propsin kautta <i>props.notes</i>. Vastaavasti <i>props.filter</i> viittaa storessa olevaan filter-kentän tilaan.

Komennolla _connect_ ja <i>mapStateToProps</i>-määrittelyllä aikaan saatua tilannetta voidaan visualisoida seuraavasti:

![Sovelluksella on kaksi propsia, notes ja filter. Näistä notes on viite storeen talletettuihin muistiinpanoihin ja filter viite storeen talletettuun filtterimerkkijonoon.](../../images/6/24c.png)

Komponentin <i>Notes</i> sisältä on siis propsien <i>props.notes</i> ja <i>props.filter</i> kautta "suora pääsy" tarkastelemaan Redux-storen sisällä olevaa tilaa.

Komponentti _Notes_ ei oikeastaan tarvitse mihinkään tietoa siitä, mikä filtteri on valittuna. Filtteröintilogiikka voidaan siis siirtää kokonaan komponentin ulkopuolelle, ja palauttaa propsina _notes_ suoraan sopivalla tavalla filtteröidyt muistiinpanot:

```js
const Notes = (props) => {
  const dispatch = useDispatch()

  return (
    <ul>
      {props.notes.map(note =>
        <Note
          key={note.id}
          note={note}
          handleClick={() => 
            dispatch(toggleImportanceOf(note.id))
          }
        />
      )}
    </ul>
  )
}

// highlight-start
const mapStateToProps = (state) => {
  if ( state.filter === 'ALL' ) {
    return {
      notes: state.notes
    }
  }

  return {
    notes: (state.filter  === 'IMPORTANT' 
      ? state.notes.filter(note => note.important)
      : state.notes.filter(note => !note.important)
    )
  }
}
// highlight-end

const ConnectedNotes = connect(mapStateToProps)(Notes)
export default ConnectedNotes  
```

### mapDispatchToProps

Olemme nyt korvanneet hookin _useSelector_, mutta <i>Notes</i> käyttää edelleen hookia _useDispatch_ ja sen palauttavaa funktiota _dispatch_:

```js
const Notes = (props) => {
  const dispatch = useDispatch() // highlight-line

  return (
    <ul>
      {props.notes.map(note =>
        <Note
          key={note.id}
          note={note}
          handleClick={() => 
            dispatch(toggleImportanceOf(note.id)) // highlight-line
          }
        />
      )}
    </ul>
  )
}
```

_connect_-funktion toisena parametrina voidaan määritellä [mapDispatchToProps](https://github.com/reduxjs/react-redux/blob/master/docs/api/connect.md#connect-parameters) eli joukko <i>action creator</i> -funktioita, jotka välitetään yhdistetylle komponentille propseina. Laajennetaan connectausta seuraavasti:

```js
const mapStateToProps = (state) => {
  return {
    notes: state.notes,
    filter: state.filter,
  }
}

// highlight-start
const mapDispatchToProps = {
  toggleImportanceOf,
}
// highlight-end

const ConnectedNotes = connect(
  mapStateToProps,
  mapDispatchToProps // highlight-line
)(Notes)

export default ConnectedNotes
```

Nyt komponentti voi dispatchata suoraan action creatorin _toggleImportanceOf_ määrittelemän actionin kutsumalla propsien kautta saamaansa funktiota koodissa:

```js
const Notes = (props) => {
  return (
    <ul>
      {props.notes.map(note =>
        <Note
          key={note.id}
          note={note}
          handleClick={() => props.toggleImportanceOf(note.id)}
        />
      )}
    </ul>
  )
}
```

Eli se sijaan että kutsuttaisiin action creator -funktiota _dispatch_-funktion kanssa

```js
dispatch(toggleImportanceOf(note.id))
```

_connect_-funktiota käytettäessä actionin dispatchaamiseen riittää

```js
props.toggleImportanceOf(note.id)
```

Storen _dispatch_-funktiota ei enää tarvitse kutsua, sillä _connect_ on muokannut action creatorin _toggleImportanceOf_ sellaiseen muotoon, joka sisältää dispatchauksen.

_mapDispatchToProps_ lienee aluksi hieman haastava ymmärtää, etenkin sen kohta käsiteltävä [vaihtoehtoinen käyttötapa](/osa6/connect#map-dispatch-to-propsin-vaihtoehtoinen-kayttotapa).

_connect_-funktion aikaansaamaa tilannetta voidaan havainnollistaa seuraavasti:

![Sovelluksella on nyt propsia, notes, filter ja toggle_importance_of. Näistä notes on viite storeen talletettuihin muistiinpanoihin ja filter viite storeen talletettuun filtterimerkkijonoon. Uutena oleva toggle_importance_of on viite toggle_importance-funktioon, joka on sidottu dispatch-operaatioon](../../images/6/25b.png)

Eli sen lisäksi, että <i>Notes</i> pääsee storen tilaan propsin <i>props.notes</i> kautta, se viittaa <i>props.toggleImportanceOf</i>:lla funktioon, jonka avulla storeen saadaan dispatchattua <i>notes/toggleImportanceOf</i>-tyyppisiä actioneja.

_connect_-funktiota käyttämään refaktoroitu komponentti <i>Notes</i> on kokonaisuudessaan seuraava:

```js
import { connect } from 'react-redux' 
import { toggleImportanceOf } from '../reducers/noteReducer'

const Notes = (props) => {
  return (
    <ul>
      {props.notes.map(note =>
        <Note
          key={note.id}
          note={note}
          handleClick={() => props.toggleImportanceOf(note.id)}
        />
      )}
    </ul>
  )
}

const mapStateToProps = (state) => {
  if ( state.filter === 'ALL' ) {
    return {
      notes: state.notes
    }
  }

  return {
    notes: (state.filter  === 'IMPORTANT' 
    ? state.notes.filter(note => note.important)
    : state.notes.filter(note => !note.important)
    )
  }
}

const mapDispatchToProps = {
  toggleImportanceOf
}

// eksportoidaan suoraan connectin palauttama komponentti
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Notes)
```

Otetaan _connect_ käyttöön myös uuden muistiinpanon luomisessa:

```js
import { connect } from 'react-redux' 
import { createNote } from '../reducers/noteReducer'

const NewNote = (props) => { // highlight-line
  
  const addNote = async (event) => {
    event.preventDefault()
    const content = event.target.note.value
    event.target.note.value = ''
    props.createNote(content) // highlight-line
  }

  return (
    <form onSubmit={addNote}>
      <input name="note" />
      <button type="submit">add</button>
    </form>
  )
}

// highlight-start
export default connect(
  null, 
  { createNote }
)(NewNote)
// highlight-end
```

Koska komponentti ei tarvitse storen tilasta mitään, on _connect_-funktion ensimmäinen parametri <i>null</i>.

Sovelluksen koodi on [GitHubissa](https://github.com/fullstack-hy2020/redux-notes/tree/part6-5) branchissa <i>part6-5</i>.

### Huomio propsina välitettyyn action creatoriin viittaamisesta

Tarkastellaan vielä erästä mielenkiintoista seikkaa komponentista <i>NewNote</i>:

```js
import { connect } from 'react-redux' 
import { createNote } from '../reducers/noteReducer'  // highlight-line

const NewNote = (props) => {
  
  const addNote = async (event) => {
    event.preventDefault()
    const content = event.target.note.value
    event.target.note.value = ''
    props.createNote(content)  // highlight-line
  }

  return (
    <form onSubmit={addNote}>
      <input name="note" />
      <button type="submit">add</button>
    </form>
  )
}

export default connect(
  null, 
  { createNote }  // highlight-line
)(NewNote)
```

Aloittelevalle _connect_-funktion käyttäjälle aiheuttaa joskus ihmetystä se, että action creatorista <i>createNote</i> on komponentin sisällä käytettävissä <i>kaksi eri versiota</i>.

Funktioon tulee viitata propsien kautta, eli <i>props.createNote</i>. Tällöin kyseessä on _connect_-funktion muokkaama, <i>dispatchauksen sisältävä</i> versio funktiosta.

Moduulissa olevan import-lauseen

```js
import { createNote } from './../reducers/noteReducer'
```

ansiosta komponentin sisältä on mahdollista viitata funktioon myös suoraan (eli _createNote_). Näin ei kuitenkaan tule tehdä, sillä silloin on kyseessä alkuperäinen action creator, joka <i>ei sisällä dispatchausta</i>.

Jos tulostamme funktiot koodin sisällä (emme olekaan vielä käyttäneet kurssilla tätä erittäin hyödyllistä debug-kikkaa)

```js
const NewNote = (props) => {
  console.log(createNote)
  console.log(props.createNote)

  const addNote = (event) => {
    event.preventDefault()
    const content = event.target.note.value
    event.target.note.value = ''
    props.createNote(content)
  }

  // ...
}
```

näemme eron:

![Ensin tulostuu pelkkä action creatot -funktion koodi. Tämän jälkeen tulostuu koodi joka sisältää komennon, dispatch(actionCreator.apply(this, arguments)) eli dispatchiin "sidottu" action creator](../../images/6/10.png)

Ensimmäinen funktioista on siis normaali <i>action creator</i>, toinen taas _connect_-funktion muotoilema funktio, joka sisältää storen metodin dispatch-kutsun.

_connect_ on erittäin kätevä työkalu, mutta abstraktisuutensa takia se voi aluksi tuntua hankalalta.

### mapDispatchToPropsin vaihtoehtoinen käyttötapa

Määrittelimme siis _connect_-funktion komponentille <i>NewNote</i> antaman actioneja dispatchaavan funktion seuraavasti:

```js
const NewNote = (props) => {
  // ...
}

export default connect(
  null,
  { createNote } // highlight-line
)(NewNote)
```

Eli määrittelyn ansiosta komponentti dispatchaa uuden muistiinpanon lisäyksen suorittavan actionin suoraan komennolla <code>props.createNote('uusi muistiinpano')</code>.

Parametrin <i>mapDispatchToProps</i> kenttinä ei voi antaa mitä tahansa funktiota, vaan funktion on oltava <i>action creator</i> eli Redux-actionin palauttava funktio.

Kannattaa huomata, että parametri <i>mapDispatchToProps</i> on nyt <i>olio</i>, sillä määrittely

```js
{
  createNote
}
```

on lyhempi tapa määritellä olioliteraali

```js
{
  createNote: createNote
}
```

eli olio, jonka ainoan kentän <i>createNote</i> arvona on funktio <i>createNote</i>.

Voimme määritellä saman myös pitemmän kaavan kautta, antamalla _connect_-funktion toisena parametrina seuraavanlaisen <i>funktion</i>:

```js
const NewNote = (props) => {
  // ...
}

// highlight-start
const mapDispatchToProps = (dispatch) => {
  return {
    createNote: (value) => {
      dispatch(createNote(value))
    },
  }
}
// highlight-end

export default connect(
  null,
  mapDispatchToProps
)(NewNote)
```

Tässä vaihtoehtoisessa tavassa <i>mapDispatchToProps</i> on funktio, jota _connect_ kutsuu antaen sille parametriksi storen _dispatch_-funktion. Funktion paluuarvona on olio, joka määrittelee joukon funktioita, jotka annetaan connectoitavalle komponentille propsiksi. Esimerkkimme määrittelee propsin <i>createNote</i> olevan funktio

```js
(value) => {
  dispatch(createNote(value))
}
```

eli action creatorilla luodun actionin dispatchaus.

Komponentti siis viittaa funktioon propsin <i>props.createNote</i> kautta:

```js
const NewNote = (props) => {

  const addNote = async (event) => {
    event.preventDefault()
    const content = event.target.note.value
    event.target.note.value = ''
    props.createNote(content)
  }

  return (
    <form onSubmit={addNote}>
      <input name="note" />
      <button type="submit">add</button>
    </form>
  )
}
```

Konsepti on hiukan monimutkainen ja sen selittäminen sanallisesti on haastavaa. Useimmissa tapauksissa onneksi riittää <i>mapDispatchToProps</i>:in yksinkertaisempi muoto. On kuitenkin tilanteita, joissa monimutkaisempi muoto on tarpeen, esim. jos määriteltäessä propseiksi mäpättyjä <i>dispatchattavia actioneja</i> on [viitattava komponentin omiin propseihin](https://github.com/gaearon/redux-devtools/issues/250#issuecomment-186429931).

Egghead.io:sta löytyy Reduxin kehittäjän Dan Abramovin loistava tutoriaali [Getting started with Redux](https://egghead.io/courses/getting-started-with-redux), jonka katsomista voin suositella kaikille. Neljässä viimeisessä videossa käsitellään _connect_-funktiota ja nimenomaan sen "hankalampaa" käyttötapaa.

### Presentational/Container revisited

_connect_-funktiota hyödyntävä versio komponentista <i>Notes</i> keskittyy lähes ainoastaan muistiinpanojen renderöimiseen, ja se on hyvin lähellä sitä minkä sanotaan olevan [presentational](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0)-komponentti, joita Dan Abramovin [sanoin](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0) kuvaillaan seuraavasti:

- Are concerned with how things look.
- May contain both presentational and container components inside, and usually have some DOM markup and styles of their own.
- Often allow containment via props.children.
- Have no dependencies on the rest of the app, such as Redux actions or stores.
- Don’t specify how the data is loaded or mutated.
- Receive data and callbacks exclusively via props.
- Rarely have their own state (when they do, it’s UI state rather than data).
- Are written as functional components unless they need state, lifecycle hooks, or performance optimizations.

_connect_-funktion avulla muodostettu _yhdistetty komponentti_

```js
const mapStateToProps = (state) => {
  if ( state.filter === 'ALL' ) {
    return {
      notes: state.notes
    }
  }

  return {
    notes: (state.filter  === 'IMPORTANT' 
    ? state.notes.filter(note => note.important)
    : state.notes.filter(note => !note.important)
    )
  }
}

const mapDispatchToProps = {
  toggleImportanceOf,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Notes)
```

taas on selkeästi <i>container</i>-komponentti, joita Dan Abramov [luonnehtii](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0) seuraavasti:

- Are concerned with how things work.
- May contain both presentational and container components inside but usually don’t have any DOM markup of their own except for some wrapping divs, and never have any styles.
- Provide the data and behavior to presentational or other container components.
- Call Redux actions and provide these as callbacks to the presentational components.
- Are often stateful, as they tend to serve as data sources.
- Are usually generated using higher order components such as connect from React Redux, rather than written by hand.

Komponenttien presentational vs. container -jaottelu on eräs hyväksi havaittu tapa strukturoida React-sovelluksia. Jako voi olla toimiva tai sitten ei, kaikki riippuu kontekstista.

Abramov mainitsee jaon [eduiksi](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0) muun muassa seuraavat:

- Better separation of concerns. You understand your app and your UI better by writing components this way.
- Better reusability. You can use the same presentational component with completely different state sources, and turn those into separate container components that can be further reused.
- Presentational components are essentially your app’s “palette”. You can put them on a single page and let the designer tweak all their variations without touching the app’s logic. You can run screenshot regression tests on that page.

Abramov mainitsee termin [higher-order component](https://reactjs.org/docs/higher-order-components.html). Esim. <i>Notes</i> on normaali komponentti, React Reduxin _connect_-funktio taas on <i>higher-order komponentti</i> eli käytännössä funktio, joka haluaa parametrikseen komponentin muuttuakseen "normaaliksi" komponentiksi.

Higher-order componentit eli HOC:t ovat yleinen tapa määritellä geneeristä toiminnallisuutta, joka sitten erikoistetaan esim. renderöitymisen määrittelyn suhteen parametrina annettavan komponentin avulla. Kyseessä on funktionaalisen ohjelmoinnin etäisesti olio-ohjelmoinnin perintää muistuttava käsite.

HOC:it ovat oikeastaan käsitteen [Higher-Order Function](https://en.wikipedia.org/wiki/Higher-order_function) (HOF) yleistys. HOF:eja ovat sellaiset funktiot, jotka joko ottavat parametrikseen funktioita tai palauttavat funktioita. Olemme oikeastaan käyttäneet HOF:eja läpi kurssin. Esim. lähes kaikki taulukoiden käsittelyyn tarkoitetut metodit kuten _map, filter ja find_ ovat HOF:eja.

Reactin hook-apin ilmestymisen jälkeen HOC:ien suosio on kääntynyt laskuun, ja melkein kaikki kirjastot, joiden käyttö on aiemmin perustunut HOC:eihin, ovat saaneet hook-perustaisen apin. Useimmiten, kuten myös Reduxin kohdalla, hook-perustaiset apit ovat HOC-apeja huomattavasti yksinkertaisempia.

### Redux ja komponenttien tila

Kurssi on ehtinyt pitkälle, ja olemme vihdoin päässeet siihen pisteeseen missä käytämme Reactia "oikein", eli React keskittyy pelkästään näkymien muodostamiseen ja sovelluksen tila sekä sovelluslogiikka on eristetty kokonaan React-komponenttien ulkopuolelle, Reduxiin ja action reducereihin.

Entä _useState_-hookilla saatava komponenttien oma tila, onko sillä roolia jos sovellus käyttää Reduxia tai muuta komponenttien ulkoista tilanhallintaratkaisua? Jos sovelluksessa on monimutkaisempia lomakkeita, saattaa niiden lokaali tila olla edelleen järkevä toteuttaa funktiolla _useState_ saatavan tilan avulla. Lomakkeidenkin tilan voi toki tallettaa myös Reduxiin, mutta jos lomakkeen tila on oleellinen ainoastaan lomakkeen täyttövaiheessa (esim. syötteen muodon validoinnin kannalta), voi olla viisaampaa jättää tilan hallinta suoraan lomakkeesta huolehtivan komponentin vastuulle.

Kannattaako Reduxia käyttää aina? Tuskinpa. Reduxin kehittäjä Dan Abramov pohdiskelee asiaa artikkelissaan [You Might Not Need Redux](https://medium.com/@dan_abramov/you-might-not-need-redux-be46360cf367)

Reduxin kaltainen tilankäsittely on mahdollista toteuttaa nykyään myös ilman Reduxia käyttämällä Reactin [context](https://reactjs.org/docs/context.html)-apia ja [useReducer](https://reactjs.org/docs/hooks-reference.html#usereducer)-hookia, lisää asiasta on esim. [täällä](https://www.simplethread.com/cant-replace-redux-with-hooks/) ja [täällä](https://hswolff.com/blog/how-to-usecontext-with-usereducer/). Tutustumme tähän tapaan myös kurssin [yhdeksännessä osassa](/en/part9).

</div>

<div class="tasks">

### Tehtävät 6.19.-6.21.

**HUOM**: tämä on osan 6 vanha päätösluku joka korvattiin 30.1.2023 [uudella luvulla](/osa6/react_query_use_reducer_ja_contex), joka käsittelee React Queryä, useReduceria ja contextia. Tämä luku säilyy nähtävillä muutaman viikon ajan.

Jos olet jo ehtinyt aloittaa Redux connectia käsittelevät tehtävät (6.19-6.21), voit tehdä ne loppuun. Muussa tapauksessa suosittelen siirtymään uuteen lukuun.

#### 6.19 anekdootit ja connect, step1

<i>Redux-storea</i> käytetään tällä hetkellä <em>useSelector</em>- ja <em>useDispatch</em>-hookien avulla. Tämä on varmasti paras tapa tehdä asiat, mutta harjoitellaan kuitenkin hieman _connect_-funktion käyttöä.

Muokkaa <i>Notification</i>-komponenttia niin, että se käyttää _connect_-funktiota hookien sijaan. 

#### 6.20 anekdootit ja connect, step2

Tee sama <i>Filter</i>- ja <i>AnecdoteForm</i>-komponenteille.

#### 6.21 anekdootit, loppuhuipennus

Sovellukseen on (todennäköisesti) jäänyt eräs hieman ikävä bugi. Jos "vote"-näppäintä painellaan useasti peräkkäin, notifikaatio näkyy ruudulla hieman miten sattuu. Esimerkiksi jos äänestetään kaksi kertaa kolmen sekunnin välein, näkyy jälkimmäinen notifikaatio ruudulla ainoastaan kahden sekunnin verran (olettaen, että notifikaation näyttöaika on viisi sekuntia). Tämä johtuu siitä, että ensimmäisen äänestyksen notifikaation tyhjennys tyhjentääkin myöhemmän äänestyksen notifikaation.

Korjaa bugi siten, että usean peräkkäisen äänestyksen viimeistä notifikaatiota näytetään aina viiden sekunnin ajan. Korjaus tapahtuu siten, että uuden notifikaation tullessa edellisen notifikaation nollaus tarvittaessa perutaan, ks. funktion _setTimeout_ [dokumentaatio](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setTimeout).

Tämä oli osan viimeinen tehtävä ja on aika pushata koodi GitHubiin sekä merkata tehdyt tehtävät [palautussovellukseen](https://studies.cs.helsinki.fi/stats/courses/fullstackopen).

</div>
