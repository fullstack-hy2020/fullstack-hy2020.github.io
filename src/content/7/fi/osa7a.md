---
mainImage: ../../../images/part-7.svg
part: 7
letter: a
lang: fi
---

<div class="content">

Kurssin seitsemännen osan tehtävät poikkeavat jossain määrin muiden osien tehtävistä. Tässä ja seuraavassa luvussa on normaaliin tapaan [luvun teoriaan liittyviä tehtäviä](/osa7/react_router/#tehtavat-7-1-7-3).

Tämän ja seuraavan luvun tehtävien lisäksi seitsemäs osa sisältää kertaavan ja soveltavan [tehtäväsarjan](/osa7/tehtavia_blogilistan_laajennus), jossa laajennetaan osissa 4 ja 5 tehtyä Bloglist-sovellusta.

### Sovelluksen navigaatiorakenne

Palataan osan 6 jälkeen jälleen Reduxittoman Reactin pariin.

On erittäin tyypillistä, että web-sovelluksissa on navigaatiopalkki, jonka avulla on mahdollista vaihtaa sovelluksen näkymää. Muistiinpanosovelluksemme voisi sisältää pääsivun:

![](../../images/7/1ea.png)

ja omat sivunsa muistiinpanojen ja käyttäjien tietojen näyttämiseen:

![](../../images/7/2ea.png)

[Vanhan koulukunnan websovelluksessa](/osa0#perinteinen-web-sovellus) sovelluksen näyttämän sivun vaihto tapahtui siten että selain teki palvelimelle uuden HTTP GET -pyynnön ja renderöi sitten palvelimen palauttaman näkymää vastaavan HTML-koodin.

Single page appeissa taas ollaan todellisuudessa koko ajan samalla sivulla, ja selaimessa suoritettava Javascript-koodi luo illuusion eri "sivuista". Jos näkymää vaihdettaessa tehdään HTTP-kutsuja, niiden avulla haetaan ainoastaan JSON-muotoista dataa, jota uuden näkymän näyttäminen ehkä edellyttää.

Navigaatiopalkki ja useita näkymiä sisältävä sovellus on erittäin helppo toteuttaa Reactilla.

Seuraavassa on eräs tapa:

```js
import React, { useState } from 'react'
import ReactDOM from 'react-dom'

const Home = () => (
  <div> <h2>TKTL notes app</h2> </div>
)

const Notes = () => (
  <div> <h2>Notes</h2> </div>
)

const Users = () => (
  <div> <h2>Users</h2> </div>
)

const App = () => {
  const [page, setPage] = useState('home')

 const  toPage = (page) => (event) => {
    event.preventDefault()
    setPage(page)
  }

  const content = () => {
    if (page === 'home') {
      return <Home />
    } else if (page === 'notes') {
      return <Notes />
    } else if (page === 'users') {
      return <Users />
    }
  }

  const padding = {
    padding: 5
  }

  return (
    <div>
      <div>
        <a href="" onClick={toPage('home')} style={padding}>
          home
        </a>
        <a href="" onClick={toPage('notes')} style={padding}>
          notes
        </a>
        <a href="" onClick={toPage('users')} style={padding}>
          users
        </a>
      </div>

      {content()}
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
```

Eli jokainen näkymä on toteutettu omana komponenttinaan ja sovelluksen tilassa <i>page</i> pidetään tieto siitä, minkä näkymää vastaava komponentti menupalkin alla näytetään.

Menetelmä ei kuitenkaan ole optimaalinen. Kuten kuvista näkyy, sivuston osoite pysyy samana vaikka välillä ollaankin eri näkymässä. Jokaisella näkymällä tulisi kuitenkin olla oma osoitteensa, jotta esim. bookmarkien tekeminen olisi mahdollista. Sovelluksessamme ei myöskään selaimen <i>back</i>-painike toimi loogisesti, eli <i>back</i> ei vie edelliseksi katsottuun sovelluksen näkymään vaan jonnekin ihan muualle. Jos sovellus kasvaisi suuremmaksi ja sinne haluttaisiin esim. jokaiselle käyttäjälle sekä muistiinpanolle oma yksittäinen näkymänsä, itse koodattu <i>reititys</i> eli sivuston navigaationhallinta menisi turhan monimutkaiseksi.

Reactissa on onneksi olemassa kirjasto [React router](https://github.com/ReactTraining/react-router) joka tarjoaa erinomaisen ratkaisun React-sovelluksen navigaation hallintaan.

Muutetaan ylläoleva sovellus käyttämään React routeria. Asennetaan React router komennolla

```bash
npm install react-router-dom
```

React routerin tarjoama reititys saadaan käyttöön muuttamalla sovellusta seuraavasti:

```js
import {
  BrowserRouter as Router,
  Switch, Route, Link
} from "react-router-dom"

const App = () => {

  const padding = {
    padding: 5
  }

  return (
    <Router>
      <div>
        <Link style={padding} to="/">home</Link>
        <Link style={padding} to="/notes">notes</Link>
        <Link style={padding} to="/users">users</Link>
      </div>

      <Switch>
        <Route path="/notes">
          <Notes />
        </Route>
        <Route path="/users">
          <Users />
        </Route>
        <Route path="/">
          <Home />
        </Route>
      </Switch>

      <div>
        <i>Note app, Department of Computer Science 2020</i>
      </div>
    </Router>
  )
}
```

Reititys, eli komponenttien ehdollinen, selaimen <i>urliin perustuva</i> renderöinti otetaan käyttöön sijoittamalla komponentteja <i>Router</i>-komponentin lapsiksi, eli <i>Router</i>-tagien sisälle.

Huomaa, että vaikka komponenttiin viitataan nimellä <i>Router</i> kyseessä on [BrowserRouter](https://reacttraining.com/react-router/web/api/BrowserRouter), sillä importtaus tapahtuu siten, että importattava olio uudelleennimetään:

```js
import {
  BrowserRouter as Router, // highlight-line
  Switch, Route, Link
} from "react-router-dom"
```

[Manuaalin](https://reacttraining.com/react-router/web/api/BrowserRouter) mukaan

> <i>BrowserRouter</i> is a <i>Router</i> that uses the HTML5 history API (pushState, replaceState and the popstate event) to keep your UI in sync with the URL.

Normaalisti selain lataa uuden sivun osoiterivillä olevan urlin muuttuessa. [HTML5 history API](https://css-tricks.com/using-the-html5-history-api/):n avulla <i>BrowserRouter</i> kuitenkin mahdollistaa sen, että selaimen osoiterivillä olevaa urlia voidaan käyttää React-sovelluksen sisäiseen "reitittämiseen", eli vaikka osoiterivillä oleva url muuttuu, sivun sisältöä manipuloidaan ainoastaan Javascriptillä ja selain ei lataa uutta sisältöä palvelimelta. Selaimen toiminta back- ja forward-toimintojen ja bookmarkien tekemisen suhteen on kuitenkin loogista, eli toimii kuten perinteisillä web-sivuilla.

Routerin sisälle määritellään selaimen osoiteriviä muokkaavia <i>linkkejä</i> komponentin [Link](https://reacttraining.com/react-router/web/api/Link) avulla. Esim.

```js
<Link to="/notes">notes</Link>
```

luo sovellukseen linkin, jonka teksti on <i>notes</i> ja jonka klikkaaminen vaihtaa selaimen osoiteriville urliksi <i>/notes</i>.

Selaimen urliin perustuen renderöitävät komponentit määritellään komponentin [Route](https://reacttraining.com/react-router/web/api/Route) avulla. Esim.

```js
<Route path="/notes">
  <Notes />
</Route>
```

määrittelee, että jos selaimen osoiteena on <i>/notes</i>, renderöidään komponentti <i>Notes</i>.

Urliin perustuen renderöitävät komponentit on sijoitettu [Switch](https://reacttraining.com/react-router/web/api/Switch)-komponentin lapsiksi

```js 
<Switch>
  <Route path="/notes">
    <Notes />
  </Route>
  <Route path="/users">
    <Users />
  </Route>
  <Route path="/">
    <Home />
  </Route>
</Switch>
```

Switch saa aikaan sen, että renderöitävä komponentti on ensimmäinen, jonka <i>path</i> vastaa osoiterivin polkua.

Huomaa, että komponenttien järjestys on tärkeä. Jos laittaisimme ensimmäiseksi komponentin <i>Home</i>, jonka polku on <i> path="/"</i>, ei mitään muuta komponenttia koskaan renderöitäisi, sillä "olematon" polku on minkä tahansa polun alkuosa:

```js 
<Switch>
  <Route path="/"> // highlight-line
    <Home /> // highlight-line
  </Route> // highlight-line
  
  <Route path="/notes">
    <Notes />
  </Route>
  // ...
</Switch>
```

### Parametroitu route

Tarkastellaan sitten hieman modifioitua versiota edellisestä esimerkistä. Esimerkin koodi kokonaisuudessaan on [täällä](https://github.com/fullstack-hy2020/misc/blob/master/router-app-v1.js).

Sovellus sisältää nyt viisi eri näkymää, joiden näkyvyyttä kontrolloidaan routerin avulla. Edellisestä esimerkistä tuttujen komponenttien <i>Home</i>, <i>Notes</i> ja <i>Users</i> lisäksi mukana on kirjautumisnäkymää vastaava <i>Login</i> ja yksittäisen muistiinpanon näkymää vastaava <i>Note</i>.

<i>Home</i> ja <i>Users</i> ovat kuten aiemmassa esimerkissä. <i>Notes</i> on hieman monimutkaisempi, se renderöi propseina saamansa muistiinpanojen listan siten, että jokaisen muistiinpanon nimi on klikattavissa

![](../../images/7/3ea.png)

Nimen klikattavuus on toteutettu komponentilla <i>Link</i> ja esim. muistiinpanon, jonka id on 3 nimen klikkaaminen aiheuttaa selaimen osoitteen arvon päivittymisen muotoon <i>notes/3</i>:

```js
const Notes = ({notes}) => (
  <div>
    <h2>Notes</h2>
    <ul>
      {notes.map(note =>
        <li key={note.id}>
          <Link to={`/notes/${note.id}`}>{note.content}</Link>
        </li>
      )}
    </ul>
  </div>
)
```

Parametrisoitu url määritellään komponentissa <i>App</i> olevaan reititykseen seuraavasti:

```js
<Router>
  <div>
    <div>
      <Link style={padding} to="/">home</Link>
      <Link style={padding} to="/notes">notes</Link>
      <Link style={padding} to="/users">users</Link>
    </div>

    <Switch>
    // highlight-start
      <Route path="/notes/:id">
        <Note notes={notes} />
      </Route>
      // highlight-end
      <Route path="/notes">
        <Notes notes={notes} />
      </Route>
      <Route path="/">
        <Home />
      </Route>
    </Switch>

</Router>
```

Yksittäisen muistiinpanon näkymän renderöivä route siis määritellään "expressin tyyliin" merkkaamalla reitin parametrina oleva osa merkinnällä <i>:id</i>

```js
<Route path="/notes/:id">
```

Kun selain siirtyy muistiinpanon yksilöivään osoitteeseen, esim. <i>/notes/3</i>, renderöidään komponentti <i>Note</i>:

```js
import {
  // ...
  useParams  // highlight-line
} from "react-router-dom"

const Note = ({ notes }) => {
  const id = useParams().id // highlight-line
  const note = notes.find(n => n.id === Number(id))
  return (
    <div>
      <h2>{note.content}</h2>
      <div>{note.user}</div>
      <div><strong>{note.important ? 'tärkeä' : ''}</strong></div>
    </div>
  )
}
```

Komponentti _Note_ saa parametrikseen kaikki muistiinpanot propsina <i>notes</i> ja se pääsee urlin yksilöivään osaan, eli näytettävän muistiinpanon id:hen käsiksi  react-routerin funktion [useParams](https://reacttraining.com/react-router/web/api/Hooks/useparams) avulla. 

### useHistory

Sovellukseen on myös toteutettu erittäin yksinkertainen kirjautumistoiminto. Jos sovellukseen ollaan kirjautuneena, talletetaan tieto kirjautuneesta käyttäjästä komponentin <i>App</i> tilaan <i>user</i>.

Mahdollisuus <i>Login</i>-näkymään navigointiin renderöidään menuun ehdollisesti

```js
<Router>
  <div>
    <Link style={padding} to="/">home</Link>
    <Link style={padding} to="/notes">notes</Link>
    <Link style={padding} to="/users">users</Link>
    // highlight-start
    {user
      ? <em>{user} logged in</em>
      : <Link style={padding} to="/login">login</Link>
    }
    // highlight-end
  </div>

  // ...
</Router>
```

eli jos käyttäjä on kirjautunut, renderöidäänkin linkin <i>login</i> sijaan kirjautuneen käyttäjän käyttäjätunnus:

![](../../images/7/4a.png)

Kirjautumisesta huolehtivan komponentin koodi seuraavassa

```js
import {
  // ...
  useHistory // highlight-line
} from 'react-router-dom'

const Login = (props) => {
  const history = useHistory() // highlight-line

  const onSubmit = (event) => {
    event.preventDefault()
    props.onLogin('mluukkai')
    history.push('/') // highlight-line
  }

  return (
    <div>
      <h2>login</h2>
      <form onSubmit={onSubmit}>
        <div>
          username: <input />
        </div>
        <div>
          password: <input type='password' />
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  )
}
```

Mielenkiintoista komponentissa on react-routerin funktion [useHistory](https://reacttraining.com/react-router/web/api/Hooks/usehistory) käyttö. Funktion avulla komponentti pääsee käsiksi [history](https://reacttraining.com/react-router/web/api/history)-olioon, joka taas mahdollistaa mm. selaimen osoiterivin muokkaamisen ohjelmallisesti.

Kirjautumisen yhteydessä kutsutaan history-olion metodia push. Komento _history.push('/')_ saa aikaan sen, että selaimen osoiteriville tulee osoitteeksi _/_ ja sovellus renderöi osoitetta vastaavan komponentin <i>Home</i>.

Käyttämämme react-router-kirjaston funktiot [useParams](https://reacttraining.com/react-router/web/api/Hooks/useparams) ja [useHistory](https://reacttraining.com/react-router/web/api/Hooks/usehistory) ovat molemmat hook-funktiota, samaan tapaan kuin esim. moneen kertaan käyttämämme useState ja useEffect. Kuten muistamme osasta 1, hook-funktioiden käyttöön liittyy tiettyjä [sääntöjä](/osa1/monimutkaisempi_tila_reactin_debuggaus#hookien-saannot). Create-react-app on konfiguroitu varoittamaan, jos hookien säännöt rikkoutuvat, esim. jos hook-funktiota yritetään kutsua ehtolauseen sisältä. 

### redirect

Näkymän <i>Users</i> routeen liittyy vielä eräs mielenkiintoinen detalji:

```js
<Route path="/users">
  {user ? <Users /> : <Redirect to="/login" />}
</Route>
```

Jos käyttäjä ei ole kirjautuneena, ei renderöidäkään näkymää <i>Users</i> vaan sen sijaan <i>uudelleenohjataan</i> käyttäjä <i>Redirect</i>-komponentin avulla kirjautumisnäkymään

```js
<Redirect to="/login" />
```

Todellisessa sovelluksessa olisi kenties parempi olla kokonaan näyttämättä navigaatiovalikossa kirjautumista edellyttäviä näkymiä jos käyttäjä ei ole kirjautunut sovellukseen.

Seuraavassa vielä komponentin <i>App</i> koodi kokonaisuudessaan:

```js
const App = () => {
  const [notes, setNotes] = useState([
    // ...
  ])

  const [user, setUser] = useState(null) 

  const login = (user) => {
    setUser(user)
  }

  const padding = { padding: 5 }

  return (
    <div>
      <Router>
        <div>
          <Link style={padding} to="/">home</Link>
          <Link style={padding} to="/notes">notes</Link>
          <Link style={padding} to="/users">users</Link>
          {user
            ? <em>{user} logged in</em>
            : <Link style={padding} to="/login">login</Link>
          }
        </div>

        <Switch>
          <Route path="/notes/:id">
            <Note notes={notes} />
          </Route>
          <Route path="/notes">
            <Notes notes={notes} />
          </Route>
          <Route path="/users">
            {user ? <Users /> : <Redirect to="/login" />}
          </Route>
          <Route path="/login">
            <Login onLogin={login} />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </Router>      
      <div>
        <br />
        <em>Note app, Department of Computer Science 2020</em>
      </div>
    </div>
  )
}
```

Komponentti renderöi myös kokonaan <i>Router</i>:in ulkopuolella olevan web-sovelluksille tyypillisen <i>footer</i>-elementin, eli sivuston pohjalla olevan osan, joka on näkyvillä riippumatta siitä mikä komponentti sovelluksen reititetyssä osassa näytetään.

### Parametroitu route revisited

Sovelluksessa on eräs hieman ikävä seikka. Komponentti _Note_ saa propseina <i>kaikki muistiinpanot</i>, vaikka se näyttää niistä ainoastaan sen, jonka id vastaa urlin parametroitua osaa:


```js
const Note = ({ notes }) => { 
  const id = useParams().id
  const note = notes.find(n => n.id === Number(id))
  // ...
}
```

Olisiko mahdollista muuttaa sovellusta siten, että _Note_ saisi propsina ainoastaan näytettävän komponentin:

```js
const Note = ({ note }) => {
  return (
    <div>
      <h2>{note.content}</h2>
      <div>{note.user}</div>
      <div><strong>{note.important ? 'tärkeä' : ''}</strong></div>
    </div>
  )
}
```

Eräs tapa muuttaa sovellusta olisi selvittää näytettävän muistiinpanon _id_ komponentissa _App_ react-routerin hook-funktion [useRouteMatch](https://reacttraining.com/react-router/web/api/Hooks/useroutematch) avulla.

<i>useRouteMatch</i>-hookin käyttö [ei ole](https://github.com/ReactTraining/react-router/issues/7015) mahdollista samassa komponentissa, joka määrittelee sovelluksen reititettävän osan. Siirretäänkin _Router_-komponenttien käyttö komponentin _App_ ulkopuolelle:

```js
ReactDOM.render(
  <Router> // highlight-line
    <App />
  </Router>, // highlight-line
  document.getElementById('root')
)
```

Komponentti _App_ muuttuu seuraavasti:

```js
import {
  // ...
  useRouteMatch  // highlight-line
} from "react-router-dom"

const App = () => {
  // ...

 // highlight-start
  const match = useRouteMatch('/notes/:id')
  const note = match 
    ? notes.find(note => note.id === Number(match.params.id))
    : null
  // highlight-end

  return (
    <div>
      <div>
        <Link style={padding} to="/">home</Link>
        // ...
      </div>

      <Switch>
        <Route path="/notes/:id">
          <Note note={note} /> // highlight-line
        </Route>
        <Route path="/notes">
          <Notes notes={notes} />
        </Route>
         // ...
      </Switch>

      <div>
        <em>Note app, Department of Computer Science 2020</em>
      </div>
    </div>
  )
}    
```

Joka kerta kun komponentti renderöidään, eli käytännössä myös aina kun sovelluksen osoiterivillä oleva url vaihtuu, suoritetaan komento

```js
const match = useRouteMatch('/notes/:id')
```

Jos url on muotoa _/notes/:id_ eli vastaa yksittäisen muistiinpanon urlia, saa muuttuja _match_ arvokseen olion, jonka polun parametroitu osa, eli muistiinpanon id voidaan selvittää, ja näin saadaan haettua renderöitävä muistiinpano

```js
const note = match 
  ? notes.find(note => note.id === Number(match.params.id))
  : null
```

Lopullinen koodi on kokonaisuudessaan [täällä](https://github.com/fullstack-hy2020/misc/blob/master/router-app-v2.js).

</div>

<div class="tasks">

### Tehtävät 7.1.-7.3.

Jatketaan anekdoottien parissa. Ota seuraaviin tehtäviin pohjaksi repositoriossa <https://github.com/fullstack-hy2020/routed-anecdotes> oleva reduxiton anekdoottisovellus.

Jos kloonaat projektin olemassaolevan git-reposition sisälle, <i>poista kloonatun sovelluksen git-konfiguraatio:</i>

```bash
cd routed-anecdotes   // eli mene ensin kloonatun repositorion hakemistoon
rm -rf .git
```

Sovellus käynnistyy normaaliin tapaan, mutta joudut ensin asentamaan sovelluksen riippuvuudet:

```bash
npm install
npm start
```

#### 7.1: routed anecdotes, step1

Lisää sovellukseen React Router siten, että <i>Menu</i>-komponentissa olevia linkkejä klikkailemalla saadaan säädeltyä näytettävää näkymää.

Sovelluksen juuressa, eli polulla _/_ näytetään anekdoottien lista:

![](../../assets/teht/40.png)

Pohjalla oleva <i>Footer</i>-komponentti tulee näyttää aina.

Uuden anekdootin luominen tapahtuu esim. polulla <i>create</i>:

![](../../assets/teht/41.png)

#### 7.2: routed anecdotes, step2

Toteuta sovellukseen yksittäisen anekdootin tiedot näyttävä näkymä:

![](../../assets/teht/42.png)

Yksittäisen anekdootin sivulle navigoidaan klikkaamalla anekdootin nimeä

![](../../assets/teht/43.png)

#### 7.3: routed anecdotes, step3

Luomislomakkeen oletusarvoinen toiminnallisuus on melko hämmentävä, sillä kun lomakkeen avulla luodaan uusi muistiinpano, mitään ei näytä tapahtuvan.

Paranna toiminnallisuutta siten, että luomisen jälkeen siirrytään automaattisesti kaikkien anekdoottien näkymään <i>ja</i> käyttäjälle näytetään 10 sekunnin ajan onnistuneesta lisäyksestä kertova notifikaatio:

![](../../assets/teht/44.png)

</div>
