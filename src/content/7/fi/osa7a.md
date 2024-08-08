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

On erittäin tyypillistä, että web-sovelluksissa on navigaatiopalkki, jonka avulla on mahdollista vaihtaa sovelluksen näkymää. Muistiinpanosovelluksemme voisi sisältää pääsivun

![](../../images/7/1ea.png)

ja omat sivunsa muistiinpanojen ja käyttäjien tietojen näyttämiseen:

![](../../images/7/2ea.png)

[Vanhan koulukunnan web-sovelluksessa](/osa0#perinteinen-web-sovellus) sovelluksen näyttämän sivun vaihto tapahtui siten, että selain teki palvelimelle uuden HTTP GET ‑pyynnön ja renderöi sitten palvelimen palauttaman, uutta näkymää vastaavan HTML-koodin.

Single page appeissa taas ollaan todellisuudessa koko ajan samalla sivulla, ja selaimessa suoritettava JavaScript-koodi luo illuusion eri "sivuista". Jos näkymää vaihdettaessa tehdään HTTP-kutsuja, niiden avulla haetaan ainoastaan JSON-muotoista dataa, jota uuden näkymän näyttäminen ehkä edellyttää.

Navigaatiopalkki ja useita näkymiä sisältävä sovellus on helppo toteuttaa Reactilla.

Seuraavassa on eräs tapa:

```js
import React, { useState }  from 'react'
import ReactDOM from 'react-dom/client'

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

ReactDOM.createRoot(document.getElementById('root')).render(<App />)
```

Jokainen näkymä on siis toteutettu omana komponenttinaan, ja sovelluksen tilassa <i>page</i> pidetään tieto siitä, mitä näkymää vastaava komponentti menupalkin alla näytetään.

Menetelmä ei kuitenkaan ole optimaalinen. Kuten kuvista näkyy, sivuston osoite pysyy samana vaikka välillä ollaankin eri näkymässä. Jokaisella näkymällä tulisi kuitenkin olla oma osoitteensa, jotta esim. kirjanmerkkien tekeminen olisi mahdollista. Myöskään selaimen <i>back</i>-painike ei toimi sovelluksessamme loogisesti, eli <i>back</i> ei vie edelliseksi katsottuun sovelluksen näkymään vaan jonnekin ihan muualle. Jos sovellus kasvaisi suuremmaksi ja siihen haluttaisiin vaikkapa jokaiselle käyttäjälle sekä muistiinpanolle oma yksittäinen näkymänsä, itse koodattu <i>reititys</i> eli sivuston navigaationhallinta menisi turhan monimutkaiseksi.

### React Router

Reactissa on onneksi olemassa kirjasto [React Router](https://reactrouter.com/), joka tarjoaa erinomaisen ratkaisun React-sovelluksen navigaation hallintaan.

Muutetaan yllä oleva sovellus käyttämään React Routeria. Asennetaan React Router:

```bash
npm install react-router-dom
```

React Routerin tarjoama reititys saadaan käyttöön muuttamalla sovellusta seuraavasti:

```js
import {
  BrowserRouter as Router,
  Routes, Route, Link
} from 'react-router-dom'

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

      <Routes>
        <Route path="/notes" element={<Notes />} />
        <Route path="/users" element={<Users />} />
        <Route path="/" element={<Home />} />
      </Routes>

      <div>
        <i>Note app, Department of Computer Science 2023</i>
      </div>
    </Router>
  )
}
```

Reititys eli komponenttien ehdollinen, selaimen <i>URL:iin perustuva</i> renderöinti otetaan käyttöön sijoittamalla komponentteja <i>Router</i>-komponentin lapsiksi eli <i>Router</i>-tagien sisälle.

Huomaa, että vaikka komponenttiin viitataan nimellä <i>Router</i>, kyseessä on [BrowserRouter](https://reactrouter.com/en/main/router-components/browser-router), sillä importtaus tapahtuu siten, että importattava olio uudelleennimetään:

```js
import {
  BrowserRouter as Router, // highlight-line
  Routes, Route, Link
} from 'react-router-dom'
```

[Manuaalin](https://reactrouter.com/en/main/router-components/browser-router) mukaan

> <i>BrowserRouter</i> is a <i>Router</i> that uses the HTML5 history API (pushState, replaceState and the popstate event) to keep your UI in sync with the URL.

Normaalisti selain lataa uuden sivun osoiterivillä olevan URL:n muuttuessa. [HTML5 history API](https://css-tricks.com/using-the-html5-history-api/):n avulla <i>BrowserRouter</i> kuitenkin mahdollistaa sen, että selaimen osoiterivillä olevaa URL:ia voidaan käyttää React-sovelluksen sisäiseen "reitittämiseen", eli vaikka osoiterivillä oleva URL muuttuu, sivun sisältöä manipuloidaan ainoastaan JavaScriptillä, eikä selain lataa uutta sisältöä palvelimelta. Selaimen toiminta back- ja forward-toimintojen ja kirjanmerkkien tekemisen suhteen on kuitenkin intuitiivista eli toimii kuten perinteisillä verkkosivuilla.

Routerin sisälle määritellään selaimen osoiteriviä muokkaavia <i>linkkejä</i> komponentin [Link](https://reactrouter.com/en/main/components/link) avulla. Esim.

```js
<Link to="/notes">notes</Link>
```

luo sovellukseen linkin, jonka teksti on <i>notes</i> ja jonka klikkaaminen vaihtaa selaimen osoiteriville URL:ksi <i>/notes</i>.

Selaimen URL:iin perustuen renderöitävät komponentit määritellään komponentin [Route](https://reactrouter.com/en/main/route/route) avulla. Esim.

```js
<Route path="/notes" element={<Notes />} />
```

määrittelee, että jos selaimen osoiteena on <i>/notes</i>, renderöidään komponentti <i>Notes</i>.

URL:iin perustuen renderöitävät komponentit on sijoitettu [Routes](https://reactrouter.com/en/main/components/routes)-komponentin lapsiksi:

```js 
<Routes>
  <Route path="/notes" element={<Notes />} />
  <Route path="/users" element={<Users />} />
  <Route path="/" element={<Home />} />
</Routes>
```

Routes saa aikaan sen, että renderöitävä komponentti on se, jonka <i>path</i> vastaa osoiterivin polkua.

### Parametrisoitu route

Tarkastellaan sitten hieman modifioitua versiota edellisestä esimerkistä. Esimerkin koodi kokonaisuudessaan on [täällä](https://github.com/fullstack-hy2020/misc/blob/master/router-app-v1.js).

Sovellus sisältää nyt viisi eri näkymää, joiden näkyvyyttä kontrolloidaan routerin avulla. Edellisestä esimerkistä tuttujen komponenttien <i>Home</i>, <i>Notes</i> ja <i>Users</i> lisäksi mukana on kirjautumisnäkymää vastaava <i>Login</i> ja yksittäisen muistiinpanon näkymää vastaava <i>Note</i>.

<i>Home</i> ja <i>Users</i> ovat kuten aiemmassa esimerkissä. <i>Notes</i> on hieman monimutkaisempi. Se renderöi propseina saamansa muistiinpanojen listan siten, että jokaisen muistiinpanon nimi on klikattavissa:

![](../../images/7/3ea.png)

Nimen klikattavuus on toteutettu komponentilla <i>Link</i> ja esim. muistiinpanon, jonka <i>id</i> on 3 nimen klikkaaminen aiheuttaa selaimen osoitteen arvon päivittymisen muotoon <i>notes/3</i>:

```js
const Notes = ({notes}) => (
  <div>
    <h2>Notes</h2>
    <ul>
      {notes.map(note =>
        <li key={note.id}>
          <Link to={`/notes/${note.id}`}>{note.content}</Link>  // highlight-line
        </li>
      )}
    </ul>
  </div>
)
```

Parametrisoitu URL määritellään komponentissa <i>App</i> olevaan reititykseen seuraavasti:

```js
<Router>
  // ...

  <Routes>
    <Route path="/notes/:id" element={<Note notes={notes} />} /> // highlight-line
    <Route path="/notes" element={<Notes notes={notes} />} />   
    <Route path="/users" element={user ? <Users /> : <Navigate replace to="/login" />} />
    <Route path="/login" element={<Login onLogin={login} />} />
    <Route path="/" element={<Home />} />      
  </Routes>
</Router>
```

Yksittäisen muistiinpanon näkymän renderöivä route siis määritellään "Expressin tyyliin" merkkaamalla reitin parametrina oleva osa merkinnällä <i>:id</i> näin:

```js
<Route path="/notes/:id" element={<Note notes={notes} />} />
```

Kun selain siirtyy muistiinpanon yksilöivään osoitteeseen, esim. <i>/notes/3</i>, renderöidään komponentti <i>Note</i>:

```js
import {
  // ...
  useParams  // highlight-line
} from 'react-router-dom'

const Note = ({ notes }) => {
  const id = useParams().id // highlight-line
  const note = notes.find(n => n.id === Number(id))
  return (
    <div>
      <h2>{note.content}</h2>
      <div>{note.user}</div>
      <div><strong>{note.important ? 'important' : ''}</strong></div>
    </div>
  )
}
```

Komponentti _Note_ saa parametrikseen kaikki muistiinpanot propsina <i>notes</i> ja se pääsee URL:n yksilöivään osaan eli näytettävän muistiinpanon <i>id</i>:hen käsiksi React Routerin funktion [useParams](https://reactrouter.com/en/main/hooks/use-params) avulla. 

### useNavigate

Sovellukseen on myös toteutettu yksinkertainen kirjautumistoiminto. Jos sovellukseen ollaan kirjautuneena, talletetaan tieto kirjautuneesta käyttäjästä komponentin <i>App</i> tilaan <i>user</i>.

Mahdollisuus <i>Login</i>-näkymään navigointiin renderöidään menuun ehdollisesti:

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

Jos käyttäjä on kirjautunut, renderöidäänkin linkin <i>login</i> sijaan kirjautuneen käyttäjän käyttäjätunnus:

![](../../images/7/4a.png)

Kirjautumisesta huolehtivan komponentin koodi on seuraava:

```js
import {
  // ...
  useNavigate // highlight-line
} from 'react-router-dom'

const Login = (props) => {
  const navigate = useNavigate() // highlight-line

  const onSubmit = (event) => {
    event.preventDefault()
    props.onLogin('mluukkai')
    navigate('/') // highlight-line
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

Mielenkiintoista komponentissa on React Routerin funktion [useNavigate](https://reactrouter.com/en/main/hooks/use-navigate) käyttö. Funktion avulla on mahdollista selaimen osoiterivin muokkaaminen ohjelmallisesti.

Kirjautumisen yhteydessä suoritettava komento _navigate('/')_ saa aikaan sen, että selaimen osoiteriville tulee osoitteeksi _/_ ja sovellus renderöi osoitetta vastaavan komponentin <i>Home</i>.

Käyttämämme React Router ‑kirjaston funktiot [useParams](https://reactrouter.com/en/main/hooks/use-params) ja [useNavigate](https://reactrouter.com/en/main/hooks/use-navigate) ovat molemmat hook-funktiota samaan tapaan kuin esim. moneen kertaan käyttämämme useState ja useEffect. Kuten muistamme osasta 1, hook-funktioiden käyttöön liittyy tiettyjä [sääntöjä](/osa1/monimutkaisempi_tila_reactin_debuggaus#hookien-saannot).

### Uudelleenohjaus

Näkymän <i>Users</i> routeen liittyy vielä eräs mielenkiintoinen detalji:

```js
<Route path="/users" element={user ? <Users /> : <Navigate replace to="/login" />} />
```

Jos käyttäjä ei ole kirjautuneena, ei renderöidäkään näkymää <i>Users</i> vaan sen sijaan <i>uudelleenohjataan</i> käyttäjä komponentin [Navigate](https://reactrouter.com/en/main/components/navigate) avulla kirjautumisnäkymään:

```js
<Navigate replace to="/login" />
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

  const padding = {
    padding: 5
  }

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

      <Routes>
        <Route path="/notes/:id" element={<Note notes={notes} />} />  
        <Route path="/notes" element={<Notes notes={notes} />} />   
        <Route path="/users" element={user ? <Users /> : <Navigate replace to="/login" />} />
        <Route path="/login" element={<Login onLogin={login} />} />
        <Route path="/" element={<Home />} />      
      </Routes>
    </Router>      
      <div>
        <br />
        <em>Note app, Department of Computer Science 2023</em>
      </div>
    </div>
  )
}
```

Komponentti renderöi myös kokonaan komponentin <i>Router</i> ulkopuolella olevan web-sovelluksille tyypillisen <i>footer</i>-elementin eli sivuston pohjalla olevan osan, joka on näkyvillä riippumatta siitä, mikä komponentti sovelluksen reititetyssä osassa näytetään.

### Parametrisoitu route revisited

Sovelluksessa on eräs hieman ikävä seikka. Komponentti _Note_ saa propseina <i>kaikki muistiinpanot</i>, vaikka se näyttää niistä ainoastaan sen, jonka <i>id</i> vastaa URL:n parametrisoitua osaa:

```js
const Note = ({ notes }) => { 
  const id = useParams().id
  const note = notes.find(n => n.id === Number(id))
  // ...
}
```

Olisiko sovellusta mahdollista muuttaa siten, että _Note_ saisi propsina ainoastaan näytettävän muistiinpanon:

```js
const Note = ({ note }) => {
  return (
    <div>
      <h2>{note.content}</h2>
      <div>{note.user}</div>
      <div><strong>{note.important ? 'important' : ''}</strong></div>
    </div>
  )
}
```

Eräs tapa muuttaa sovellusta olisi selvittää näytettävän muistiinpanon <i>id</i> komponentissa <i>App</i> React Routerin hook-funktion [useMatch](https://reactrouter.com/en/main/hooks/use-match) avulla.

<i>useMatch</i>-hookin käyttö ei ole mahdollista samassa komponentissa, joka määrittelee sovelluksen reititettävän osan. Siirretäänkin <i>Router</i>-komponenttien käyttö komponentin <i>App</i> ulkopuolelle:

```js
ReactDOM.createRoot(document.getElementById('root')).render(
  <Router> // highlight-line
    <App />
  </Router> // highlight-line
)
```

Komponentti <i>App</i> muuttuu seuraavasti:

```js
import {
  // ...
  useMatch  // highlight-line
} from 'react-router-dom'

const App = () => {
  // ...

 // highlight-start
  const match = useMatch('/notes/:id')

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

      <Routes>
        <Route path="/notes/:id" element={<Note note={note} />} />   // highlight-line
        <Route path="/notes" element={<Notes notes={notes} />} />   
        <Route path="/users" element={user ? <Users /> : <Navigate replace to="/login" />} />
        <Route path="/login" element={<Login onLogin={login} />} />
        <Route path="/" element={<Home />} />      
      </Routes>   

      <div>
        <em>Note app, Department of Computer Science 2023</em>
      </div>
    </div>
  )
}    
```

Joka kerta kun komponentti renderöidään eli käytännössä myös aina kun sovelluksen osoiterivillä oleva URL vaihtuu, suoritetaan komento

```js
const match = useMatch('/notes/:id')
```

Jos URL on muotoa _/notes/:id_ eli vastaa yksittäisen muistiinpanon URL:ia, saa muuttuja <i>match</i> arvokseen olion, jonka polun parametroitu osa eli muistiinpanon <i>id</i> voidaan selvittää. Näin saadaan haettua renderöitävä muistiinpano:

```js
const note = match 
  ? notes.find(note => note.id === Number(match.params.id))
  : null
```

Lopullinen koodi on kokonaisuudessaan [täällä](https://github.com/fullstack-hy/misc/blob/master/router-app-v2.js).

</div>

<div class="tasks">

### Tehtävät 7.1.-7.3.

Jatketaan anekdoottien parissa. Ota seuraaviin tehtäviin pohjaksi repositoriossa <https://github.com/fullstack-hy2020/routed-anecdotes> oleva Reduxiton anekdoottisovellus.

Jos kloonaat projektin olemassaolevan Git-repositorion sisälle, <i>poista kloonatun sovelluksen Git-konfiguraatio</i>:

```bash
cd routed-anecdotes   // eli mene ensin kloonatun repositorion hakemistoon
rm -rf .git
```

Sovellus käynnistyy normaaliin tapaan, mutta joudut ensin asentamaan sovelluksen riippuvuudet:

```bash
npm install
npm run dev
```

#### 7.1: routed anecdotes, step1

Lisää sovellukseen React Router siten, että <i>Menu</i>-komponentissa olevia linkkejä klikkailemalla saadaan säädeltyä näytettävää näkymää.

Sovelluksen juuressa eli polulla _/_ näytetään anekdoottien lista:

![](../../assets/teht/40.png)

Pohjalla oleva <i>Footer</i>-komponentti tulee näyttää aina.

Uuden anekdootin luominen tapahtuu esim. polulla <i>create</i>:

![](../../assets/teht/41.png)

#### 7.2: routed anecdotes, step2

Toteuta sovellukseen yksittäisen anekdootin tiedot näyttävä näkymä:

![](../../assets/teht/42.png)

Yksittäisen anekdootin sivulle navigoidaan klikkaamalla anekdootin nimeä:

![](../../assets/teht/43.png)

#### 7.3: routed anecdotes, step3

Luomislomakkeen oletusarvoinen toiminnallisuus on melko hämmentävä, sillä kun lomakkeen avulla luodaan uusi muistiinpano, mitään ei näytä tapahtuvan.

Paranna toiminnallisuutta siten, että luomisen jälkeen siirrytään automaattisesti kaikkien anekdoottien näkymään <i>ja</i> käyttäjälle näytetään viiden sekunnin ajan onnistuneesta lisäyksestä kertova notifikaatio:

![](../../assets/teht/44.png)

</div>
