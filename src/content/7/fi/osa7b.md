---
mainImage: ../../../images/part-7.svg
part: 7
letter: b
lang: fi
---

<div class="content">

Kurssin seitsemännen osan tehtävät poikkeavat jossain määrin aiemmista osista. Edellisessä ja tässä luvussa on normaaliin tapaan [luvun teoriaan liittyviä tehtäviä](/osa7/custom_hookit#tehtavat-7-4-7-8).

Tämän ja seuraavan luvun tehtävien lisäksi seitsemäs osa sisältää kertaavan ja soveltavan [tehtäväsarjan](/osa7/tehtavia_blogilistan_laajennus), jossa laajennetaan osissa 4 ja 5 tehtyä Blog list -sovellusta.

### Hookit

React tarjoaa yhteensä 15 erilaista [valmista hookia](https://reactjs.org/docs/hooks-reference.html), joista ylivoimaisesti eniten käytetyt ovat meillekin jo tutut [useState](https://reactjs.org/docs/hooks-reference.html#usestate) ja [useEffect](https://reactjs.org/docs/hooks-reference.html#useeffect).

Käytimme [osassa 5](/osa5/props_children_ja_proptypet#ref-eli-viite-komponenttiin) hookia [useImperativeHandle](https://reactjs.org/docs/hooks-reference.html#useimperativehandle), jonka avulla komponentin sisäinen funktio pystyttiin tarjoamaan näkyville komponentin ulkopuolelle. [Osassa 6](/osa6/react_query_use_reducer_ja_contex) taas olivat käytössä [useReducer](https://reactjs.org/docs/hooks-reference.html#usereducer) ja [useContext](https://reactjs.org/docs/hooks-reference.html#usecontext) kun toteutimme Reduxia muistuttavan tilanhallintaratkaisun.

Muutaman edellisen vuoden aikana moni Reactin apukirjasto on ruvennut tarjoamaan hook-perustaisen rajapinnan. [Osassa 6](/osa6/flux_arkkitehtuuri_ja_redux#redux-storen-valittaminen-eri-komponenteille)
käytimme React Redux -kirjaston hookeja [useSelector](https://react-redux.js.org/api/hooks#useselector) ja [useDispatch](https://react-redux.js.org/api/hooks#usedispatch) välittämään Redux-storen ja dispatch-funktion niitä tarvitseville komponenteille.

Myös edellisessä [luvussa](/osa7/react_router/) käsitellyn [React Routerin](https://v5.reactrouter.com/web/guides) API perustuu osin [hookeihin](https://reacttraining.com/react-router/web/api/Hooks), joiden avulla päästiin käsiksi routejen parametroituun osaan, sekä <i>navigation</i>-olioon, joka mahdollistaa selaimen osoiterivin manipuloinnin koodista.

Kuten [osassa 1](/osa1/monimutkaisempi_tila_reactin_debuggaus#hookien-saannot) mainittiin, hookit eivät ole mitä tahansa funktiota, vaan niitä on käytettävä tiettyjä [sääntöjä](https://reactjs.org/docs/hooks-rules.html) noudattaen. Seuraavassa vielä hookien käytön säännöt suoraan Reactin dokumentaatiosta kopioituna:

**Don’t call Hooks inside loops, conditions, or nested functions.** Instead, always use Hooks at the top level of your React function. 

**Don’t call Hooks from regular JavaScript functions.** Instead, you can:

- Call Hooks from React function components.
- Call Hooks from custom Hooks

On olemassa [ESLint](https://www.npmjs.com/package/eslint-plugin-react-hooks)-sääntö, jonka avulla voidaa varmistaa, että sovellus käyttää hookeja oikein. Create React Appiin valmiiksi asennettu säätö [eslint-plugin-react-hooks](https://www.npmjs.com/package/eslint-plugin-react-hooks) varoittaa, jos yrität käyttää hookia väärin:

![](../../images/7/60ea.png)

### Custom-hookit

React tarjoaa mahdollisuuden myös omien eli [custom](https://reactjs.org/docs/hooks-custom.html)-hookien määrittelyyn. Custom-hookien pääasiallinen tarkoitus on Reactin dokumentaation mukaan mahdollistaa komponenttien logiikan uusiokäyttö:

> <i>Building your own Hooks lets you extract component logic into reusable functions.</i>

Custom-hookit ovat tavallisia JavaScript-funktioita, jotka voivat kutsua mitä tahansa muita hookeja kunhan ne vain toimivat hookien sääntöjen puitteissa. Custom-hookin nimen täytyy alkaa sanalla _use_.

Teimme [osassa 1](/osa1/komponentin_tila_ja_tapahtumankasittely#tapahtumankasittely) laskurin, jonka arvoa voi kasvattaa, vähentää ja nollata. Sovelluksen koodi on seuraava:

```js  
import { useState } from 'react'
const App = () => {
  const [counter, setCounter] = useState(0)

  return (
    <div>
      <div>{counter}</div>
      <button onClick={() => setCounter(counter + 1)}>
        plus
      </button>
      <button onClick={() => setCounter(counter - 1)}>
        minus
      </button>      
      <button onClick={() => setCounter(0)}>
        zero
      </button>
    </div>
  )
}
```

Eriytetään laskurilogiikka custom-hookiksi. Hookin koodi on seuraava:

```js
const useCounter = () => {
  const [value, setValue] = useState(0)

  const increase = () => {
    setValue(value + 1)
  }

  const decrease = () => {
    setValue(value - 1)
  }

  const zero = () => {
    setValue(0)
  }

  return {
    value, 
    increase,
    decrease,
    zero
  }
}
```

Hook siis käyttää sisäisesti _useState_-hookia luomaan itselleen tilan. Hook palauttaa olion, joka sisältää kenttinään hookin tilan arvon sekä funktiot hookin tallettaman arvon muuttamiseen.

React-komponentti käyttää hookia seuraavaan tapaan:

```js
const App = () => {
  const counter = useCounter()

  return (
    <div>
      <div>{counter.value}</div>
      <button onClick={counter.increase}>
        plus
      </button>
      <button onClick={counter.decrease}>
        minus
      </button>      
      <button onClick={counter.zero}>
        zero
      </button>
    </div>
  )
}
```

Näin komponentin _App_ tila ja sen manipulointi on siirretty kokonaisuudessaan hookin _useCounter_ vastuulle. 

Samaa hookia voitaisiin <i>uusiokäyttää</i> sovelluksessa, joka laski vasemman ja oikean napin painalluksia:

```js

const App = () => {
  const left = useCounter()
  const right = useCounter()

  return (
    <div>
      {left.value}
      <button onClick={left.increase}>
        left
      </button>
      <button onClick={right.increase}>
        right
      </button>
      {right.value}
    </div>
  )
}
```

Nyt sovellus luo <i>kaksi</i> erillistä laskuria. Toisen käsittelyfunktioineen se tallentaa muuttujaan _left_ ja toisen muuttujaan _right_. 

Lomakkeiden käsittely on Reactissa jokseenkin vaivalloista. Seuraavassa on sovellus, joka pyytää lomakkeella käyttäjän nimen, syntymäajan ja pituuden:

```js
const App = () => {
  const [name, setName] = useState('')
  const [born, setBorn] = useState('')
  const [height, setHeight] = useState('')

  return (
    <div>
      <form>
        name: 
        <input
          type='text'
          value={name}
          onChange={(event) => setName(event.target.value)} 
        /> 
        <br/> 
        birthdate:
        <input
          type='date'
          value={born}
          onChange={(event) => setBorn(event.target.value)}
        />
        <br /> 
        height:
        <input
          type='number'
          value={height}
          onChange={(event) => setHeight(event.target.value)}
        />
      </form>
      <div>
        {name} {born} {height} 
      </div>
    </div>
  )
}
```

Jokaista lomakkeen kenttää varten on oma tilansa. Jotta tila pysyy ajan tasalla lomakkeelle syötettyjen tietojen kanssa, on jokaiselle <i>input</i>-elementille rekisteröity sopiva <i>onChange</i>-käsittelijä.

Määritellään custom-hook _useField_, joka yksinkertaistaa lomakkeen tilan hallintaa:

```js
const useField = (type) => {
  const [value, setValue] = useState('')

  const onChange = (event) => {
    setValue(event.target.value)
  }

  return {
    type,
    value,
    onChange
  }
}
```

Hook-funktio saa parametrina kentän tyypin. Funktio palauttaa kaikki <i>input</i>-kentän tarvitsemat attribuutit eli tyypin, kentän arvon sekä onChange-tapahtumankäsittelijän.

Hookia voidaan käyttää seuraavasti:

```js
const App = () => {
  const name = useField('text')
  // ...

  return (
    <div>
      <form>
        <input
          type={name.type}
          value={name.value}
          onChange={name.onChange} 
        /> 
        // ...
      </form>
    </div>
  )
}
```

### Spread-attribuutit

Pääsemme itseasiassa helpommalla. Koska oliolla _name_ on nyt täsmälleen ne kentät, jotka <i>input</i>-komponentti odottaa saavansa propseina, voimme välittää propsit hyödyntäen [spread-syntaksia](https://reactjs.org/docs/jsx-in-depth.html#spread-attributes) seuraavasti:

```js
<input {...name} /> 
```

Eli kuten Reactin dokumentaation [esimerkki](https://reactjs.org/docs/jsx-in-depth.html#spread-attributes) kertoo, seuraavat kaksi tapaa välittää propseja komponentille tuottavat saman lopputuloksen:


```js
<Greeting firstName='Arto' lastName='Hellas' />

const person = {
  firstName: 'Arto',
  lastName: 'Hellas'
}

<Greeting {...person} />
```

Sovellus pelkistyy muotoon:

```js
const App = () => {
  const name = useField('text')
  const born = useField('date')
  const height = useField('number')

  return (
    <div>
      <form>
        name: 
        <input  {...name} /> 
        <br/> 
        birthdate:
        <input {...born} />
        <br /> 
        height:
        <input {...height} />
      </form>
      <div>
        {name.value} {born.value} {height.value}
      </div>
    </div>
  )
}
```

Lomakkeiden käsittely yksinkertaistuu huomattavasti, kun ikävät tilan synkronoimiseen liittyvät detaljit on kapseloitu custom-hookin vastuulle.

Custom-hookit eivät selvästikään ole pelkkä uusiokäytön väline, vaan ne mahdollistavat myös entistä paremman tavan jakaa koodia pienempiin, modulaarisiin osiin.

Internetistä alkaa löytyä yhä enenevissä määrin valmiita hookeja sekä muuta hookeihin liittyvä hyödyllistä materiaalia. Esim. seuraavia kannattaa vilkaista:

* [Awesome React Hooks Resources](https://github.com/rehooks/awesome-react-hooks)
* [Easy to understand React Hook recipes by Gabe Ragland](https://usehooks.com/)
* [Why Do React Hooks Rely on Call Order?](https://overreacted.io/why-do-hooks-rely-on-call-order/)

</div>

<div class="tasks">

### Tehtävät 7.4.-7.8.

#### 7.4: anekdoottisovellus ja hookit step1

Jatketaan React Router -[tehtävien](/osa7/react_router#tehtavat-7-1-7-3) sovelluksen parissa.

Yksinkertaista sovelluksen uuden anekdootin luomiseen käytettävän lomakkeen käyttöä äsken määritellyn _useField_-custom-hookin avulla.

Talleta hook tiedostoon <i>/src/hooks/index.js</i>. 

Jos käytät normaalisti käyttämämme default exportin sijaan [nimettyä exportia](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export#Description)

```js
import { useState } from 'react'

export const useField = (type) => { // highlight-line
  const [value, setValue] = useState('')

  const onChange = (event) => {
    setValue(event.target.value)
  }

  return {
    type,
    value,
    onChange
  }
}

// moduulissa voi olla monta nimettyä eksportia
export const useAnotherHook = () => { // highlight-line
  // ...
}
```

[importtaus](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import) tapahtuu seuraavasti:

```js
import  { useField } from './hooks'

const App = () => {
  // ...
  const username = useField('text')
  // ...
}
```

#### 7.5: anekdoottisovellus ja hookit step2

Lisää lomakkeeseen nappi, joka mahdollistaa syötekenttien tyhjentämisen:

![](../../images/7/61ea.png)

Laajenna hookia siten, että se tarjoaa <i>reset</i>-nimisen operaation kentän tyhjentämiseen. 

Lisäyksen jälkeen konsoliin saattaa ilmestyä ikävä varoitus:

![](../../images/7/62ea.png)

Ei välitetä virheestä vielä tässä tehtävässä.

#### 7.6: anekdoottisovellus ja hookit step3

Jos ratkaisusi ei aiheuttanut warningia, ei sinun tarvitse tehdä tässä tehtävässä mitään.

Muussa tapauksessa tee sovellukseen korjaus, joka poistaa varoituksen _Invalid value for prop 'reset' on &lt;input&gt; tag_.

Warningin syynä on siis se, että edellisen tehtävän laajennuksen jälkeen seuraava

```js
<input {...content}/>
```

tarkoittaa samaa kuin

```js
<input
  value={content.value} 
  type={content.type}
  onChange={content.onChange}
  reset={content.reset} // highlight-line
/>
```

Elementille <i>input</i> ei kuitenkaan kuuluisi antaa propsia <i>reset</i>

Yksinkertainen korjaus olisi tietysti olla käyttämättä spread-syntaksia ja kirjoittaa kaikki lomakkeet seuraavasti:

```js
<input
  value={username.value} 
  type={username.type}
  onChange={username.onChange}
/>
```

Tällöin menettäisimme suurelta osin <i>useField</i>-hookin edut. Keksi tähän tehtävään edelleen spread-syntaksia käyttävä helppokäyttöinen ratkaisu ongelman kiertämiseen.

#### 7.7: country hook

Palataan hetkeksi tehtäväsarjan [2.12-14](/osa2/palvelimella_olevan_datan_hakeminen#tehtavat-2-11-2-14) tunnelmiin.

Ota pohjaksi repositoriossa https://github.com/fullstack-hy2020/country-hook oleva koodi. 

Sovelluksen avulla on mahdollista hakea maiden tietoja <https://restcountries.com/> -rajapinnasta. Jos maa löytyy, näytetään maan perustiedot:

![](../../images/7/69ea.png)

Jos maata ei löydy, kerrotaan siitä käyttäjälle:

![](../../images/7/70ea.png)

Sovellus on muuten valmiiksi toteutettu, mutta joudut tässä tehtävässä toteuttamaan custom hookin _useCountry_, jonka avulla haet hookin parametrina saaman maan tiedot.

Maan tietojen hakeminen kannattaa hoitaa API:n endpointin [full name](https://restcountries.com/#api-endpoints-v3-full-name) avulla ja hookin sisällä olevassa _useEffect_-hookissa.

Huomaa, että tässä tehtävässä on oleellista hyödyntää useEffectin [toisena parametrina](https://reactjs.org/docs/hooks-reference.html#conditionally-firing-an-effect) olevaa taulukkoa. Taulukolla kontrolloidaan, milloin efektifunktio kannattaa suorittaa. Kurssin [osassa 2](/osa2/tyylien_lisaaminen_react_sovellukseen#muutama-tarkea-huomio) on käyty läpi toisen parametrin käytön periaatteita.

#### 7.8: ultimate hooks

Aiempien osien materiaalissa kehitetyn muistiinpanosovelluksen palvelimen kanssa keskusteleva koodi näyttää seuraavalta:

```js
import axios from 'axios'
const baseUrl = '/api/notes'

let token = null

const setToken = newToken => {
  token = `bearer ${newToken}`
}

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = async newObject => {
  const config = {
    headers: { Authorization: token },
  }

  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

const update = (id, newObject) => {
  const request = axios.put(`${baseUrl}/${id}`, newObject)
  return request.then(response => response.data)
}

export default { getAll, create, update, setToken }
```

Huomaamme, että koodi ei itse asiassa välitä ollenkaan siitä, että se käsittelee nimenomaan muistiinpanoja. Muuttujan _baseUrl_ arvoa lukuunottamatta käytännössä sama koodi voi hoitaa myös blogisovelluksen frontendin ja backendin välistä kommunikointia. 

Eristä kommunikoiva koodi hookiksi _useResource_. Riittää, että kaikkien olioiden haku ja uuden olion luominen onnistuvat.

Voit tehdä tehtävän repositoriossa https://github.com/fullstack-hy2020/ultimate-hooks olevaan projektiin. Projektin komponentti <i>App</i> on seuraava:

```js
const App = () => {
  const content = useField('text')
  const name = useField('text')
  const number = useField('text')

  const [notes, noteService] = useResource('http://localhost:3005/notes')
  const [persons, personService] = useResource('http://localhost:3005/persons')

  const handleNoteSubmit = (event) => {
    event.preventDefault()
    noteService.create({ content: content.value })
  }
 
  const handlePersonSubmit = (event) => {
    event.preventDefault()
    personService.create({ name: name.value, number: number.value})
  }

  return (
    <div>
      <h2>notes</h2>
      <form onSubmit={handleNoteSubmit}>
        <input {...content} />
        <button>create</button>
      </form>
      {notes.map(n => <p key={n.id}>{n.content}</p>)}

      <h2>persons</h2>
      <form onSubmit={handlePersonSubmit}>
        name <input {...name} /> <br/>
        number <input {...number} />
        <button>create</button>
      </form>
      {persons.map(n => <p key={n.id}>{n.name} {n.number}</p>)}
    </div>
  )
}
```

Custom-hook _useResource_ siis palauttaa (tilahookien tapaan) kaksialkioisen taulukon. Taulukon ensimmäinen alkio sisältää resurssin kaikki oliot ja toisena alkiona on olio, jonka kautta resurssia on mahdollista manipuloida esim. lisäämällä uusia olioita. 

Jos toteutit hookin oikein, mahdollistaa sovellus muistiinpanojen ja puhelinnumeroiden yhtäaikaisen käsittelyn (käynnistä backend porttiin 3005 komennolla _npm run server_):

![](../../images/5/21e.png)

</div>
