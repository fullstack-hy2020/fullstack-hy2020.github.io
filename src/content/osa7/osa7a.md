---
mainImage: ../../images/part-7.svg
part: 7
letter: a
---

<div class="content">

Palataan osan 6 jälkeen jälleen Reduxittoman Reactin pariin.

On erittäin tyypillistä, että web-sovelluksissa on navigaatiopalkki, jonka avulla on mahdollista vaihtaa sovelluksen näkymää. Muistiinpanosovelluksemme voisi sisältää pääsivun:

![](../assets/6/6.png)

ja omat sivunsa muistiinpanojen ja käyttäjien tietojen näyttämiseen:

![](../assets/6/7.png)

[Vanhan koulukunnan websovelluksessa](/osa0#perinteinen-web-sovellus) sovelluksen näyttämän sivun vaihto tapahtui siten että selain teki palvelimelle uuden HTTP GET -pyynnön ja renderöi sitten palvelimen palauttaman näkymää vastaavan HTML-koodin.

Single page appeissa taas ollaan todellisuudessa koko ajan samalla sivulla, ja selaimessa suoritettava Javascript-koodi luo illuusion eri "sivuista". Jos näkymää vaihdettaessa tehdään HTTP-kutsuja, niiden avulla haetaan ainoastaan JSON-muotoista dataa jota uuden näkymän näyttäminen ehkä edellyttää.

Navigaatiopalkki ja useita näkymiä sisältävä sovellus on erittäin helppo toteuttaa Reactilla.

Seuraavassa on eräs tapa:

```js
const Home = () => (
  <div> <h2>TKTL notes app</h2> </div>
)

const Notes = () => (
  <div> <h2>Notes</h2> </div>
)

const Users = () => (
  <div> <h2>Users</h2> </div>
)

class App extends React.Component {
  constructor() {
    super()
    this.state = {
      page: 'home'
    }
  }

  toPage = (page) => (event) => {
    event.preventDefault()
    this.setState({ page })
  }

  render() {
    const content = () => {
      if (this.state.page === 'home') {
        return <Home />
      } else if (this.state.page === 'notes') {
        return <Notes />
      } else if (this.state.page === 'users') {
        return <Users />
      }
    }

    return (
      <div>
        <div>
          <a href="" onClick={ this.toPage('home') }>home</a> &nbsp;
          <a href="" onClick={ this.toPage('notes') }>notes</a> &nbsp;
          <a href="" onClick={ this.toPage('users') }>users</a>
        </div>

        {content()}
      </div>
    )
  }
}
```

Eli jokainen näkymä on toteutettu omana komponenttinaan ja sovelluksen tilassa pidetään tieto siitä, minkä näkymää vastaava komponentti menupalkin alla näytetään.

**Huom:** navigointivalikossa oleva _&amp;nbsp;_ tarkoittaa _a_-tagien väliin sjijoitettavaa välilyöntiä. CSS:n käyttö olisi luonnollisesti parempi tapa sivun ulkoasun muotoilulle mutta nyt tyydymme quick'n'dirty-ratkaisuun.

Menetelmä ei kuitenkaan ole optimaalinen. Kuten kuvista näkyy, sivuston osoite pysyy samana vaikka välillä ollaankin eri näkymässä. Jokaisella näkymällä tulisi kuitenkin olla oma osoitteensa, jotta esim. bookmarkien tekeminen olisi mahdollista. Sovelluksessamme ei myöskään selaimen _back_-painike toimi loogisesti, eli _back_ ei vie edelliseksi katsottuun sovelluksen näkymään vaan jonnekin ihan muualle. Jos sovellus kasvaisi suuremmaksi ja sinne haluttaisiin esim. jokaiselle käyttäjälle sekä muistiinpanolle oma yksittäinen näkymänsä, itse koodattu _reititys_ eli sivuston navigaationhallinta menisi turhan monimutkaiseksi.

Reactissa on onneksi valmis komponentti [React router](https://github.com/ReactTraining/react-router) joka tarjoaa erinomaisen ratkaisun React-sovelluksen navigaation hallintaan.

Muutetaan ylläoleva sovellus käyttämään React routeria. Asennetaan React router komennolla

```bash
npm install --save react-router-dom
```

React routerin tarjoama reititys saadaan käyttöön muuttamalla sovellusta seuraavasti:

```js
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'

class App extends React.Component {

  render() {
    return (
      <div>
        <Router>
          <div>
            <div>
              <Link to="/">home</Link> &nbsp;
              <Link to="/notes">notes</Link> &nbsp;
              <Link to="/users">users</Link>
            </div>
            <Route exact path="/" render={() => <Home />} />
            <Route path="/notes" render={() => <Notes />} />
            <Route path="/users" render={() => <Users />} />
          </div>
        </Router>
      </div>
    )
  }
}
```

Reititys, eli komponenttien ehdollinen, selaimen _urliin perustuva_ renderöinti otetaan käyttöön sijoittamalla komponentteja _Router_-komponentin lapsiksi, eli _Router_-tagien sisälle.

Huomaa, että vaikka komponenttiin viitataan nimellä _Router_ kyseessä on [BrowserRouter](https://reacttraining.com/react-router/web/api/BrowserRouter), sillä
importtaus tapahtuu siten, että importattava olio uudelleennimetään:

```js
import { BrowserRouter as Router ... } from 'react-router-dom'
```

Manuaalin mukaan

> _BrowserRouter_ is a _Router_ that uses the HTML5 history API (pushState, replaceState and the popstate event) to keep your UI in sync with the URL.

Normaalisti selain lataa uuden sivun osoiterivillä olevan urlin muuttuessa. [HTML5 history API](https://css-tricks.com/using-the-html5-history-api/):n avulla _BrowserRouter_ kuitenkin mahdollistaa sen, että selaimen osoiterivillä olevaa urlia voidaan käyttää React-sovelluksen sisäiseen "reitittämiseen", eli vaikka osoiterivillä oleva url muuttuu, sivun sisältöä manipuloidaan ainoastaan Javascriptillä ja selain ei lataa uutta sisältöä palvelimelta. Selaimen toiminta back- ja forward-toimintojen ja bookmarkien tekemisen suhteen on kuitenkin loogista, eli toimii kuten perinteisillä web-sivuilla.

Routerin sisälle määritellään selaimen osoiteriviä muokkaavia _linkkejä_ komponentin [Link](https://reacttraining.com/react-router/web/api/Link) avulla. Esim.

```bash
<Link to="/notes">notes</Link>
```

luo sovellukseen linkin, jonka teksti on _notes_ ja jonka klikkaaminen vaihtaa selaimen osoiteriville urliksi _/notes_.

Selaimen urliin perustuen renderöitävät komponentit määritellään komponentin [Route](https://reacttraining.com/react-router/web/api/Route) avulla. Esim.

```bash
<Route path="/notes" render={() => <Notes />} />
```

määrittelee, että jos selaimen osoiteena on _/notes_, renderöidään komponentti _Notes_.

Sovelluksen juuren, eli osoitteen _/_ määritellään renderöivän komponentti _Home_:

```bash
<Route exact path="/" render={() => <Home />} />
```

joudumme käyttämään routen _path_ attribuutin edessä määrettä _exact_, muuten _Home_ renderöityy kaikilla muillakin poluilla, sillä juuri _/_ on kaikkien muiden polkujen _alkuosa_.

### parametroitu route

Tarkastellaan sitten hieman modifioitua versiota edellisestä esimerkistä. Esimerkin koodi kokonaisuudessaan on [täällä](https://github.com/FullStack-HY/FullStack-Hy.github.io/wiki/router-esimerkki).

Sovellus sisältää nyt viisi eri näkymää, joiden näkyvyyttä kontrolloidaan routerin avulla. Edellisestä esimerkistä tuttujen komponenttien _Home_, _Notes_ ja _Users_ lisäksi mukana on kirjautumisnäkymää vastaava _Login_ ja yksittäisen muistiinpanon näkymää vastaava _Note_.

_Home_ ja _Users_ ovat kuten aiemmassa esimerkissä. _Notes_ on hieman monimutkaisempi, se renderöi propseina saamansa muistiinpanojen listan siten, että jokaisen muistiinpanon nimi on klikattavissa

![](../assets/6/8.png)

Nimen klikattavuus on toteutettu komponentilla _Link_ ja esim. muistiinpanon, jonka id on 3 nimen klikkaaminen aiheuttaa selaimen osoitteen arvon päivittymisen muotoon _notes/3_:

```js
const Notes = ({notes}) => (
  <div>
    <h2>Notes</h2>
    <ul>
      {notes.map(note=>
        <li key={note.id}>
          <Link to={`/notes/${note.id}`}>{note.content}</Link>
        </li>
      )}
    </ul>
  </div>
)
```

Kun selain siirtyy muistiinpanon yksilöivään osoitteeseen, esim. _notes/3_, renderöidään komponentti _Note_:

```js
const Note = ({note}) => {
  return(
  <div>
    <h2>{note.content}</h2>
    <div>{note.user}</div>
    <div><strong>{note.important ? 'tärkeä' : ''}</strong></div>
  </div>
)}
```

Tämä tapahtuu laajentamalla komponentissa _App_ olevaa reititystä seuraavasti:

```bash
<div>
  <Router>
    <div>
      <div>
        <Link to="/">home</Link> &nbsp;
        <Link to="/notes">notes</Link> &nbsp;
        <Link to="/users">users</Link> &nbsp;
      </div>

      <Route exact path="/" render={() => <Home />} />
      <Route exact path="/notes" render={() =>
        <Notes notes={this.state.notes} />}
      />
      <Route exact path="/notes/:id" render={({match}) =>
        <Note note={noteById(match.params.id)} />}
      />
    </div>
  </Router>
</div>
```

Kaikki muistiinpanon renderöivään routeen on lisätty määre _exact path="/notes"_ sillä muuten se renderöityisi myös _/notes/3_-muotoisten polkujen yhteydessä.

Yksittäisen muistiinpanon näkymän renderöivä route määritellään "expressin tyyliin" merkkaamalla reitin parametrina oleva osa merkinnällä _:id_

```js
<Route exact path="/notes/:id" />
```

Renderöityvän komponentin määrittävä _render_-attribuutti pääsee käsiksi id:hen parametrinsa [match](https://reacttraining.com/react-router/web/api/match) avulla seuraavasti:

```js
render={({match}) => <Note note={noteById(match.params.id)} />}
```

Muuttujassa _match.params.id_ olevaa id:tä vastaava muistiinpano selvitetään apufunktion _noteById_ avulla

```js
const noteById = (id) =>
  this.state.notes.find(note => note.id === Number(id))
```

renderöityvä _Note_-komponentti saa siis propsina urlin yksilöivää osaa vastaavan muistiinpanon.

### history

Sovellukseen on myös toteutettu erittäin yksinkertainen kirjautumistoiminto. Jos sovellukseen ollaan kirjautuneena, talletetaan tieto kirjautuneesta käyttäjästä komponentin _App_ tilaan _this.state.user_.

Mahdollisuus _Login_-näkymään navigointiin renderöidään menuun ehdollisesti

```bash
<Router>
  <div>
    <div>
      <Link to="/">home</Link> &nbsp;
      <Link to="/notes">notes</Link> &nbsp;
      <Link to="/users">users</Link> &nbsp;
      {this.state.user
        ? <em>{this.state.user} logged in</em>
        : <Link to="/login">login</Link>
      }
    </div>
  ...
  </div>
</Router>
```

eli jos käyttäjä on kirjaantunut, renderöidäänkin linkin _Login_ sijaan kirjautuneen käyttäjän käyttäjätunnus:

![](../assets/6/9.png)

Kirjautumisen toteuttamiseen liittyy eräs mielenkiintoinen seikka. Kirjaantumislomakkeelle mennään selaimen osoitteen ollessa _/login_. Toiminnallisuuden määrittelevä Route on seuraavassa

```bash
<Route path="/login" render={({history}) =>
  <Login history={history} onLogin={this.login} />}
/>
```

Routen render-attribuutissa määritelty metodi ottaa nyt vastaan olion [history](https://reacttraining.com/react-router/web/api/history), joka tarjoaa mm. mahdollisuuden manipuloida selaimen osoiterivin arvoa ohjelmallisesti.

Renderöitävälle _Login_-näkymälle annetaan parametriksi _history_-olio ja kirjautumisen komponentin _App_ tilaan synkronoiva funktio _this.login_:

```bash
<Login history={history} onLogin={this.login}/>}
```

Komponentin koodi seuraavassa

```js
const Login = ({onLogin, history}) => {
  const onSubmit = (event) => {
    event.preventDefault()
    onLogin(event.target.username.value)
    history.push('/')
  }
  return (
    <div>
      <h2>login</h2>
      <form onSubmit={onSubmit}>
        <div>
          username: <input />
        </div>
        <div>
          password: <input type="password" />
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  )
}
```

Kirjautumisen yhteydessä funktiossa _onSubmit_ kutsutaan [history](https://reacttraining.com/react-router/web/api/history)-olion metodia _push_. Käytetty komento <code>history.push('/')</code> saa aikaan sen, että selaimen osoiteriville tulee osoitteeksi _/_ ja sovellus renderöi osoitetta vastaavan komponentin _Home_.

### redirect

Näkymän _Users_ routeen liittyy vielä eräs mielenkiintoinen detalji:

```bash
<Route path="/users" render={() =>
  this.state.user
    ? <Users />
    : <Redirect to="/login" />
  }/>
```

Jos käyttäjä ei ole kirjautuneena, ei renderöidäkään näkymää _Users_ vaan sen sijaan _uudelleenohjataan_ käyttäjä _Redirect_-komponentin avulla kirjautumisnäkymään

```js
<Redirect to="/login" />
```

Todellisessa sovelluksessa olisi kenties parempi olla kokonaan näyttämättä navigaatiovalikossa kirjautumista edellyttäviä näkymiä jos käyttäjä ei ole kirjautunut sovellukseen.

Seuraavassa vielä komponentin _App_ koodi kokonaisuudessaan:

```js
class App extends React.Component {
  constructor() {
    super()
    this.state = {
      notes: [
        {
          id: 1,
          content: 'HTML on helppoa',
          important: true,
          user: 'Matti Luukkainen'
        },
        // ...
      ],
      user: null
    }
  }

  login = (user) => {
    this.setState({user})
  }

  render() {
    const noteById = (id) =>
      this.state.notes.find(note => note.id === Number(id))

    return (
      <div>
        <Router>
          <div>
            <div>
              <Link to="/">home</Link> &nbsp;
              <Link to="/notes">notes</Link> &nbsp;
              <Link to="/users">users</Link> &nbsp;
              {this.state.user
                ? <em>{this.state.user} logged in</em>
                : <Link to="/login">login</Link>
              }
            </div>

            <Route exact path="/" render={() => <Home />} />
            <Route exact path="/notes" render={() => <Notes notes={this.state.notes}/>} />
            <Route exact path="/notes/:id" render={({match}) =>
              <Note note={noteById(match.params.id)} />}
            />
            <Route path="/users" render={() =>
              this.state.user
                ? <Users />
                : <Redirect to="/login" />
              }/>
            <Route path="/login" render={({history}) =>
              <Login history={history} onLogin={this.login} />}
            />
          </div>
        </Router>
        <div>
          <em>Note app, Department of Computer Science 2018</em>
        </div>
      </div>
    )
  }
}
```

Render-metodissa määritellään myös kokonaan _Router_:in ulkopuolella oleva nykyisille web-sovelluksille tyypillinen _footer_-elementti, eli sivuston pohjalla oleva osa, joka on näkyvillä riippumatta siitä mikä komponentti sovelluksen reititetyssä osassa näytetään.

**Huom:** edellä olevassa esimerkissä käytetään React Routerin versiota 4.2.6. Jos ja kun etsit esimerkkejä internetistä, kannattaa varmistaa, että niissä käytetään Routerista vähintään versiota 4.0. Nelosversio ei ole ollenkaan alaspäinyhteensopiva kolmosen kanssa, eli vanhaa React Routeria käyttävä koodi on täysin käyttökelvotonta Routerin versiota 4 käytettäessä.

# tehtäviä

Tee nyt tehtävät [6.16-6.18](/tehtävät#router)
