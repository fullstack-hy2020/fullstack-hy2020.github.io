---
mainImage: ../../../images/part-5.svg
part: 5
letter: b
lang: fi
---

<div class="content">

### Kirjautumislomakkeen näyttäminen vain tarvittaessa

Muutetaan sovellusta siten, että kirjautumislomaketta ei oletusarvoisesti näytetä:

![Oletusarvoisesti sovellus näytää ainoastaan muistiinpanojen listan sekä napin "log in"](../../images/5/10e.png)

Lomake aukeaa, jos käyttäjä painaa nappia <i>login</i>:

![Kun nappia "log in" painetaan, avautuu kirjaantumislomake (jolla kentät username ja password sekä nappi kirjautumisen tekemiseen). Näkyviin tulee myös nappi "cancel", jota painamalla kirjaantumislomake suljetaan tekemättä kirjautumista](../../images/5/11e.png)

Napilla <i>cancel</i> käyttäjä saa tarvittaessa suljettua lomakkeen.

Aloitetaan eristämällä kirjautumislomake omaksi komponentikseen:

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

Tila ja tilaa käsittelevät funktiot on kaikki määritelty komponentin ulkopuolella ja ne välitetään komponentille propseina.

Huomaa, että propsit otetaan vastaan <i>destrukturoimalla</i>, eli sen sijaan että määriteltäisiin

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

jolloin muuttujan _props_ kenttiin on viitattava muuttujan kautta esim. _props.handleSubmit_, otetaan kentät suoraan vastaan omiin muuttujiinsa.

Nopea tapa toiminnallisuuden toteuttamiseen on muuttaa komponentin <i>App</i> käyttämä funktio _loginForm_ seuraavaan muotoon:

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

Komponentin <i>App</i> tilaan on nyt lisätty totuusarvo <i>loginVisible</i>, joka määrittelee sen, näytetäänkö kirjautumislomake.

Näkyvyyttä säätelevää tilaa vaihdellaan kahden napin avulla, joihin molempiin on kirjoitettu tapahtumankäsittelijän koodi suoraan:

```js
<button onClick={() => setLoginVisible(true)}>log in</button>

<button onClick={() => setLoginVisible(false)}>cancel</button>
```

Komponenttien näkyvyys on määritelty asettamalla komponentille [inline](/osa2/tyylien_lisaaminen_react_sovellukseen#inline-tyylit)-tyyleinä CSS-määrittely, jossa [display](https://developer.mozilla.org/en-US/docs/Web/CSS/display)-propertyn arvoksi asetetaan <i>none</i> jos komponentin ei haluta näkyvän:

```js
const hideWhenVisible = { display: loginVisible ? 'none' : '' }
const showWhenVisible = { display: loginVisible ? '' : 'none' }

<div style={hideWhenVisible}>
  // nappi
</div>

<div style={showWhenVisible}>
  // lomake
</div>
```

Käytössä on kysymysmerkkioperaattori eli jos _loginVisible_ on <i>true</i>, tulee napin CSS-määrittelyksi

```css
display: 'none';
```

Jos _loginVisible_ on <i>false</i>, ei <i>display</i> saa mitään napin näkyvyyteen liittyvää arvoa.

### Komponentin lapset eli props.children

Kirjautumislomakkeen näkyvyyttä ympäröivän koodin voi ajatella olevan oma looginen kokonaisuutensa, ja se onkin hyvä eristää pois komponentista <i>App</i> omaksi komponentikseen.

Tavoitteena on luoda komponentti <i>Togglable</i>, jota käytetään seuraavalla tavalla:

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

Komponentin käyttö poikkeaa aiemmin näkemistämme siinä, että käytössä on nyt avaava ja sulkeva tagi, joiden sisällä määritellään toinen komponentti eli <i>LoginForm</i>. Reactin terminologiassa <i>LoginForm</i> on nyt komponentin <i>Togglable</i> lapsi.

<i>Togglablen</i> avaavan ja sulkevan tagin sisälle voi sijoittaa lapsiksi mitä tahansa React-elementtejä, esim.:

```js
<Togglable buttonLabel="paljasta">
  <p>tämä on aluksi piilossa</p>
  <p>toinen salainen rivi</p>
</Togglable>
```

Komponentin koodi on tällainen:

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
        {props.children} //highlight-line
        <button onClick={toggleVisibility}>cancel</button>
      </div>
    </div>
  )
}

export default Togglable
```

Mielenkiintoista ja meille uutta on [props.children](https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children), jonka avulla koodi viittaa komponentin lapsiin eli avaavan ja sulkevan tagin sisällä määriteltyihin React-elementteihin.

Tällä kertaa lapset ainoastaan renderöidään komponentin oman renderöivän koodin seassa:

```js
<div style={showWhenVisible}>
  {props.children}
  <button onClick={toggleVisibility}>cancel</button>
</div>
```

Toisin kuin "normaalit" propsit, <i>children</i> on Reactin automaattisesti määrittelemä, aina olemassa oleva propsi. Jos komponentti määritellään automaattisesti suljettavalla eli _/>_ loppuvalla tagilla, esim.

```js
<Note
  key={note.id}
  note={note}
  toggleImportance={() => toggleImportanceOf(note.id)}
/>
```

on <i>props.children</i> tyhjä taulukko.

Komponentti <i>Togglable</i> on uusiokäytettävä, ja voimme käyttää sitä tekemään myös uuden muistiinpanon luomisesta huolehtivan formin vastaavalla tavalla tarpeen mukaan näytettäväksi.

Eristetään ensin muistiinpanojen luominen omaksi komponentiksi

```js
const NoteForm = ({ onSubmit, handleChange, value }) => {
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

export default NoteForm
```

ja määritellään lomakkeen näyttävä koodi komponentin <i>Togglable</i> sisällä

```js
<Togglable buttonLabel="new note">
  <NoteForm
    onSubmit={addNote}
    value={newNote}
    handleChange={handleNoteChange}
  />
</Togglable>
```

Sovelluksen tämänhetkinen koodi on kokonaisuudessaan [GitHubissa](https://github.com/fullstack-hy2020/part2-notes-frontend/tree/part5-4), branchissa <i>part5-4</i>.

### Lomakkeiden tila

Koko sovelluksen tila on nyt sijoitettu komponenttiin _App_. 

Reactin dokumentaatio antaa seuraavan [ohjeen](https://react.dev/learn/sharing-state-between-components) tilan sijoittamisesta:

> <i>Often, several components need to reflect the same changing data. We recommend lifting the shared state up to their closest common ancestor.</i>

Jos mietitään lomakkeiden tilaa eli esimerkiksi uuden muistiinpanon sisältöä sillä hetkellä kun muistiinpanoa ei vielä ole luotu, ei komponentti _App_ oikeastaan tarvitse niitä mihinkään, ja voisimme aivan hyvin siirtää lomakkeisiin liittyvän tilan niitä vastaaviin komponentteihin.

Muistiinpanon luomisesta huolehtiva komponentti muuttuu seuraavasti:

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

**HUOM** muutimme samalla sovelluksen toimintaa siten, että uudet muistiinpanot ovat oletusarvoisesti tärkeitä, eli <i>important</i> saa arvon <i>true</i>.

Tilan muuttuja <i>newNote</i> ja sen muutoksesta huolehtiva tapahtumankäsittelijä on siirretty komponentista _App_ lomakkeesta huolehtivaan komponenttiin.

Propseja on enää yksi eli funktio _createNote_, jota lomake kutsuu kun uusi muistiinpano luodaan.

Komponentti _App_ yksinkertaistuu, koska tilasta <i>newNote</i> ja sen käsittelijäfunktiosta on päästy eroon. Uuden muistiinpanon luomisesta huolehtiva funktio _addNote_ saa suoraan parametriksi uuden muistiinpanon ja funktio on ainoa props, joka välitetään lomakkeelle:

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
  return (
    <div>
      <h1>Notes</h1>
      // ...

      <Togglable buttonLabel="new note">
        <NoteForm createNote={addNote} /> // highlight-line
      </Togglable>

      // ...
      <Footer />
    </div>
  )
}
```

Vastaava muutos voitaisiin tehdä myös kirjautumislomakkeelle, mutta jätämme sen vapaaehtoiseksi harjoitustehtäväksi.

Sovelluksen tämänhetkinen koodi on kokonaisuudessaan [GitHubissa](https://github.com/fullstack-hy2020/part2-notes-frontend/tree/part5-5), branchissa <i>part5-5</i>.

### ref eli viite komponenttiin

Ratkaisu on melko hyvä, mutta haluamme kuitenkin parantaa sitä. Kun uusi muistiinpano luodaan, olisi loogista jos luomislomake menisi piiloon. Nyt lomake pysyy näkyvillä. Lomakkeen piilottamiseen sisältyy kuitenkin pieni ongelma, sillä näkyvyyttä kontrolloidaan <i>Togglable</i>-komponentin tilassa olevalla muuttujalla <i>visible</i>. Eräs ratkaisu tähän olisi siirtää Togglable-komponentin tilan kontrollointi komponentin ulkopuolelle. Emme kuitenkaan nyt tee sitä, sillä haluamme että komponentti on itse vastuussa tilastaan. Meidän on siis etsittävä jokin muu ratkaisu, ja löydettävä mekanismi komponentin tilan muuttamiseen ulkopuolelta käsin.

On useita erilaisia tapoja toteuttaa pääsy komponentin funktioihin sen ulkopuolelta. Käytetään nyt Reactin [ref](https://react.dev/learn/referencing-values-with-refs)-mekanismia, joka tarjoaa eräänlaisen viitteen komponenttiin.

Tehdään komponenttiin <i>App</i> seuraavat muutokset:

```js
import { useState, useEffect, useRef } from 'react' // highlight-line

const App = () => {
  // ...
  const noteFormRef = useRef() // highlight-line

  return (
    // ...
    <Togglable buttonLabel='new note' ref={noteFormRef}>  // highlight-line
      <NoteForm createNote={addNote} />
    </Togglable>
    // ...
  )
}
```

[useRef](https://react.dev/reference/react/useRef) hookilla luodaan ref <i>noteFormRef</i>, joka kiinnitetään muistiinpanojen luomislomakkeen sisältävälle <i>Togglable</i>-komponentille. Nyt siis muuttuja <i>noteFormRef</i> toimii viitteenä komponenttiin.

Komponenttia <i>Togglable</i> laajennetaan seuraavasti

```js
import { useState, useImperativeHandle } from 'react' // highlight-line

const Togglable = (props) => { // highlight-line
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

// highlight-start
  useImperativeHandle(props.ref, () => {
    return { toggleVisibility }
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
}

export default Togglable
```

Komponentti tarjoaa [useImperativeHandle](https://react.dev/reference/react/useImperativeHandle)-hookin avulla sisäisesti määritellyn funktionsa <i>toggleVisibility</i> ulkopuolelta kutsuttavaksi.

Voimme nyt piilottaa lomakkeen kutsumalla <i>noteFormRef.current.toggleVisibility()</i> samalla kun uuden muistiinpanon luominen tapahtuu:

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

Käyttämämme [useImperativeHandle](https://react.dev/reference/react/useImperativeHandle) on siis React hook, jonka avulla komponentille voidaan määrittää funktioita, joita on mahdollista kutsua sen ulkopuolelta.

Käyttämämme kikka komponentin tilan muuttamiseksi toimii, mutta se vaikuttaa hieman ikävältä. Saman olisi saanut aavistuksen siistimmin toteutettua "vanhan Reactin" class-komponenteilla, joihin tutustumme osassa 7. Tämä on toistaiseksi ainoa tapaus, jossa Reactin hook-syntaksiin nojaava ratkaisu on aavistuksen likaisemman oloinen kuin class-komponenttien tarjoama ratkaisu.

Refeille on myös [muita käyttötarkoituksia](https://react.dev/learn/manipulating-the-dom-with-refs) kuin React-komponentteihin käsiksi pääseminen.

Sovelluksen tämänhetkinen koodi on kokonaisuudessaan [GitHubissa](https://github.com/fullstack-hy2020/part2-notes-frontend/tree/part5-6), branchissa <i>part5-6</i>.

### Huomio komponenteista

Kun Reactissa määritellään komponentti

```js
const Togglable = () => {
  // ...
}
```

ja otetaan se käyttöön

```js
<div>
  <Togglable buttonLabel="1" ref={togglable1}>
    ensimmäinen
  </Togglable>

  <Togglable buttonLabel="2" ref={togglable2}>
    toinen
  </Togglable>

  <Togglable buttonLabel="3" ref={togglable3}>
    kolmas
  </Togglable>
</div>
```

syntyy <i>kolme erillistä komponenttiolioa</i>, joilla on kaikilla oma tilansa:

![Kuva havainnollistaa, että selain renderöi kolme erillistä komponenttia, jotka voivat olla toisistaan riippumatta "togglattuina" näkyville](../../images/5/12.png)

<i>ref</i>-attribuutin avulla on talletettu viite jokaiseen komponentin muuttujaan <i>togglable1</i>, <i>togglable2</i> ja <i>togglable3</i>.

### Full stack ‑sovelluskehittäjän päivitetty vala

Liikkuvien osien määrä nousee. Samalla kasvaa myös todennäköisyys sille, että päädymme tilanteeseen, missä etsimme vikaa täysin väärästä paikasta. Systemaattisuutta on siis lisättävä vielä pykälän verran. 

Full stack ‑ohjelmointi on <i>todella</i> hankalaa, ja sen takia lupaan hyödyntää kaikkia ohjelmointia helpottavia keinoja:

- pidän selaimen konsolin koko ajan auki
- tarkkailen säännöllisesti selaimen network-välilehdeltä, että frontendin ja backendin välinen kommunikaatio tapahtuu oletusteni mukaan
- tarkkailen säännöllisesti palvelimella olevan datan tilaa, ja varmistan että frontendin lähettämä data siirtyy sinne kuten oletin
- pidän silmällä tietokannan tilaa: varmistan että backend tallentaa datan sinne oikeaan muotoon
- etenen pienin askelin
- <i>kun epäilen että bugi on frontendissa, varmistan että backend toimii varmasti</i>
- <i>kun epäilen että bugi on backendissa, varmistan että frontend toimii varmasti</i>
- käytän koodissa ja testeissä runsaasti _console.log_-komentoja varmistamaan sen, että varmasti ymmärrän jokaisen kirjoittamani rivin, sekä etsiessäni koodista tai testeistä mahdollisia ongelman aiheuttajia
- jos koodini ei toimi, en kirjoita enää yhtään lisää koodia, vaan alan poistamaan toiminnan rikkoneita rivejä tai palaan suosiolla tilanteeseen, missä koodi vielä toimi
- jos testit eivät mene läpi, varmistan että testien testaama toiminnallisuus varmasti toimii sovelluksessa
- kun kysyn apua kurssin Discord-kanavalla, tai muualla internetissä, muotoilen kysymyksen järkevästi, esim. [täällä](/en/part0/general_info#how-to-get-help-in-discord) esiteltyyn tapaan

</div>

<div class="tasks">

### Tehtävät 5.5.-5.11.

#### 5.5 blogilistan frontend, step5

Tee blogin luomiseen käytettävästä lomakkeesta ainoastaan tarvittaessa näytettävä osan 5 luvun [Kirjautumislomakkeen näyttäminen vain tarvittaessa](/osa5/props_children_ja_proptypet#kirjautumislomakkeen-nayttaminen-vain-tarvittaessa) tapaan. Voit halutessasi hyödyntää osassa 5 määriteltyä komponenttia <i>Togglable</i>.

Lomake ei ole oletusarvoisesti näkyvillä:

![Oletusarvoisesti näytetään ainoastaan nappi "create new blog"](../../images/5/13ae.png)

Klikkaamalla nappia <i>create new blog</i> lomake aukeaa:

![kun nappia painetaan, avautuu uuden blogin luomisen mahdollistava komponentti joka sisältää napin cancel, jota painamalla lomakkeen voi piilottaa](../../images/5/13be.png)

Lomakkeen tulee sulkeutua, kun <i>cancel</i>-painiketta painetaan tai kun uusi blogi luodaan.

#### 5.6 blogilistan frontend, step6

Eriytä uuden blogin luomisesta huolehtiva lomake omaan komponenttiinsa (jos et jo ole niin tehnyt), ja siirrä kaikki uuden blogin luomiseen liittyvä tila komponentin vastuulle. 

Komponentin tulee siis toimia samaan tapaan kuin tämän osan [materiaalin](https://fullstack-hy2020.github.io/osa5/props_children_ja_proptypet#lomakkeiden-tila) komponentin <i>NoteForm</i>.

#### 5.7 blogilistan frontend, step7

Lisää yksittäiselle blogille nappi, jonka avulla voi kontrolloida, näytetäänkö kaikki blogiin liittyvät tiedot.

Klikkaamalla nappia sen täydelliset tiedot aukeavat:

![Oletusarvoisesti kustakin blogista näytetään nimi ja kirjoittaja sekä nappi view. Nappia painamalla näytetään myös blogin url, sen likejen määrä, nappi "likettämiseen" sekä blogin lisännyt käyttäjä ja nappi tarkempien tietojen piilottamiseen.](../../images/5/13ea.png)

Uusi napin klikkaus pienentää näkymän.

Napin <i>like</i> ei tässä vaiheessa tarvitse tehdä mitään.

Kuvassa on myös käytetty hieman CSS:ää parantamaan sovelluksen ulkoasua.

Tyylejä voidaan määritellä osan 2 tapaan helposti [inline](/osa2/tyylien_lisaaminen_react_sovellukseen#inline-tyylit)-tyyleinä seuraavasti:

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
    <div style={blogStyle}>  // highlight-line
      <div> 
        {blog.title} {blog.author}
      </div>
      // ...
  </div>
)}
```

**Huom:** Vaikka tämän tehtävän toiminnallisuus on melkein samanlainen kuin komponentin <i>Togglable</i> tarjoama toiminnallisuus, ei Togglable kuitenkaan sovi tarkoitukseen sellaisenaan. Helpoin ratkaisu lienee lisätä blogille tila, joka kontrolloi sitä missä muodossa blogi näytetään.

#### 5.8: blogilistan frontend, step8

Toteuta like-painikkeen toiminnallisuus. Like lisätään backendiin blogin yksilöivään urliin tapahtuvalla _PUT_-pyynnöllä.

Koska backendin operaatio korvaa aina koko blogin, joudut lähettämään operaation mukana blogin kaikki kentät. Eli jos seuraavaa blogia liketetään,

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

tulee palvelimelle tehdä PUT-pyyntö osoitteeseen <i>/api/blogs/5a43fde2cbd20b12a2c34e91</i> ja sisällyttää pyynnön mukaan seuraava data:

```js
{
  user: "5a43e6b6c37f3d065eaaa581",
  likes: 1,
  author: "Joel Spolsky",
  title: "The Joel Test: 12 Steps to Better Code",
  url: "https://www.joelonsoftware.com/2000/08/09/the-joel-test-12-steps-to-better-code/"
}
```

#### 5.9*: blogilistan frontend, step9

Huomaamme, että jotain on pielessä. Kun blogia liketetään, ei blogin lisääjän nimeä näytetä enää blogin tarkempien tietojen joukossa:

![](../../images/5/59put.png)

Kun selain uudelleenladataan, lisääjän tieto tulee näkyviin. Tämä ei ole hyväksyttävää, selvitä missä vika on ja tee tarvittava korjaus.

On toki mahdollista, että olet jo tehnyt kaiken oikein, ja ongelmaa ei koodissasi ilmene. Tässä tapauksessa voit siirtyä eteenpäin.

#### 5.10: blogilistan frontend, step10

Järjestä sovellus näyttämään blogit <i>likejen</i> mukaisessa suuruusjärjestyksessä. Järjestäminen onnistuu taulukon metodilla [sort](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort).

#### 5.11: blogilistan frontend, step11

Lisää nappi blogin poistamiselle. Toteuta myös poiston tekevä logiikka.

Ohjelmasi voi näyttää esim. seuraavalta:

![Blogin tarkemman näkymän (avautuu kun painetaan view) mukana on nappi delete, jota painamalla blogin voi poistaa. Poisto varmistetaan window.confirm:n avulla toteutetulla dialogilla](../../images/5/14ea.png)

Kuvassa näkyvä poiston varmistus on helppo toteuttaa funktiolla [window.confirm](https://developer.mozilla.org/en-US/docs/Web/API/Window/confirm).

Näytä poistonappi ainoastaan jos kyseessä on kirjautuneen käyttäjän lisäämä blogi.

</div>

<div class="content">

### ESLint

Konfiguroimme osassa 3 koodin tyylistä huolehtivan [ESLintin](/osa3/validointi_ja_es_lint) backendiin. Otetaan nyt ESLint käyttöön myös frontendissa.

Vite on asentanut projektille ESLintin valmiiksi, joten ei tarvitse muuta kuin muokata tiedostossa <i>eslint.config.js</i> oleva konfiguraatio halutun kaltaiseksi.


Muutetaan tiedoston <i>eslint.config.js</i> sisältöä seuraavasti:

```js
import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'

export default [
  { ignores: ['dist'] },
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module'
      }
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh
    },
    rules: {
      ...js.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true }
      // highlight-start
      ],
      indent: ['error', 2],
      'linebreak-style': ['error', 'unix'],
      quotes: ['error', 'single'],
      semi: ['error', 'never'],
      eqeqeq: 'error',
      'no-trailing-spaces': 'error',
      'object-curly-spacing': ['error', 'always'],
      'arrow-spacing': ['error', { before: true, after: true }],
      'no-console': 'off'
      //highlight-end
    }
  }
]
```

HUOM: Jos käytät Visual Studio Codea yhdessä ESLint-laajennuksen kanssa, saatat joutua muokkaamaan VS Coden asetuksia, jotta linttaus toimii oikein. Jos näet virheen <i>Failed to load plugin react: Cannot find module 'eslint-plugin-react'</i>, tarvitaan lisäkonfiguraatiota. Seuraavan rivin lisääminen <i>settings.json</i>-tiedostoon voi auttaa:

```js
"eslint.workingDirectories": [{ "mode": "auto" }]
```

Katso lisätietoja [täältä](https://github.com/microsoft/vscode-eslint/issues/880#issuecomment-578052807).

Tuttuun tapaan voit suorittaa linttauksen joko komentoriviltä komennolla 

```bash 
npm run lint
```

tai editorin Eslint-pluginia hyväksikäyttäen.

Sovelluksen tämänhetkinen koodi on kokonaisuudessaan [GitHubissa](https://github.com/fullstack-hy2020/part2-notes-frontend/tree/part5-7), branchissa <i>part5-7</i>.

</div>

<div class="tasks">

### Tehtävä 5.12.

#### 5.12: blogilistan frontend, step12

Ota projektiin käyttöön ESLint. Määrittele haluamasi kaltainen konfiguraatio. Korjaa kaikki lint-virheet.

Vite on asentanut projektille ESLintin valmiiksi, joten ei tarvita muuta kun sopiva konfiguraatio tiedostoon <i>eslint.config.js</i>.

</div>
