---
mainImage: ../../images/part-5.svg
part: 5
letter: b
---

<div class="content">


## Kirjautumislomakkeen näyttäminen vain tarvittaessa

Muutetaan sovellusta siten, että kirjautumislomaketta ei oletusarvoisesti näytetä:

![](../assets/5/3.png)

Lomake aukeaa, jos käyttäjä painaa nappia _login_:

![](../assets/5/4.png)

Napilla _cancel_ käyttäjä saa tarvittaessa suljettua lomakkeen.

Aloitetaan eristämällä kirjautumislomake omaksi komponentikseen:

```html
const LoginForm = ({ handleSubmit, handleChange, username, password }) => {
return (
<div>
  <h2>Kirjaudu</h2>

  <form onSubmit="{handleSubmit}">
    <div>
      käyttäjätunnus
      <input value="{username}" onChange="{handleChange}" name="username" />
    </div>
    <div>
      salasana
      <input
        type="password"
        name="password"
        value="{password}"
        onChange="{handleChange}"
      />
    </div>
    <button type="submit">kirjaudu</button>
  </form>
</div>
) }
```

Reactin [suosittelemaan tyyliin](https://reactjs.org/docs/lifting-state-up.html) tila ja tilaa käsittelevät funktiot on kaikki määritelty komponentin ulkopuolella ja välitetään komponentille propseina.

Huomaa, että propsit otetaan vastaan _destrukturoimalla_, eli sen sijaan että määriteltäisiin

```html
const LoginForm = (props) => {
  return (
      <form onSubmit={props.handleSubmit}>
        <div>
          käyttäjätunnus
          <input
            value={props.username}
            onChange={props.handleChange}
            name="username"
          />
        </div>
        // ...
        <button type="submit">kirjaudu</button>
      </form>
    </div>
  )
}
```

jolloin muuttujan _props_ kenttiin on viitattava muuttujan kautta esim. _props.handleSubmit_, otetaan kentät suoraan vastaan omiin muuttujiinsa.

Nopea tapa toiminnallisuuden toteuttamiseen on muuttaa komponentin _App_ käyttämä funktio _loginForm_ seuraavaan muotoon:

```react
const loginForm = () => {
  const hideWhenVisible = { display: this.state.loginVisible ? 'none' : '' }
  const showWhenVisible = { display: this.state.loginVisible ? '' : 'none' }

  return (
    <div>
      <div style={hideWhenVisible}>
        <button onClick={e => this.setState({ loginVisible: true })}>log in</button>
      </div>
      <div style={showWhenVisible}>
        <LoginForm
          username={this.state.username}
          password={this.state.password}
          handleChange={this.handleLoginFieldChange}
          handleSubmit={this.login}
        />
        <button onClick={e => this.setState({ loginVisible: false })}>cancel</button>
      </div>
    </div>
  )
}
```

Komponentin _App_ tilaan on nyt lisätty kenttä _loginVisible_ joka määrittelee sen näytetäänkö kirjautumislomake.

Näkyvyyttä säätelevää tilaa vaihdellaan kahden napin avulla, molempiin on kirjoitettu tapahtumankäsittelijän koodi suoraan:

```react
<button onClick={e => this.setState({ loginVisible: true })}>log in</button>

<button onClick={e => this.setState({ loginVisible: false })}>cancel</button>
```

Komponenttien näkyvyys on määritelty asettamalla komponentille CSS-määrittely, jossa [display](https://developer.mozilla.org/en-US/docs/Web/CSS/display)-propertyn arvoksi asetetaan _none_ jos komponentin ei haluta näkyvän:

```html
const hideWhenVisible = { display: this.state.loginVisible ? 'none' : '' } const
showWhenVisible = { display: this.state.loginVisible ? '' : 'none' } // ...

<div style="{hideWhenVisible}">// nappi</div>

<div style="{showWhenVisible}">// lomake</div>
```

Käytössä on taas kysymysmerkkioperaattori, eli jos _this.state.loginVisible_ on _true_, tulee napin CSS-määrittelyksi

```css
display: 'none';
```

jos _this.state.loginVisible_ on _false_, ei _display_ saa mitään (napin näkyvyyteen liittyvää) arvoa.

Hyödynsimme mahdollisuutta määritellä React-komponenteille koodin avulla [inline](https://react-cn.github.io/react/tips/inline-styles.html)-tyylejä. Palaamme asiaan tarkemmin seuraavassa osassa.

## Komponentin lapset, eli this.props.children

Kirjautumislomakkeen näkyvyyttä ympäröivän koodin voi ajatella olevan oma looginen kokonaisuutensa ja se onkin hyvä eristää pois komponentista _App_ omaksi komponentikseen.

Tavoitteena on luoda komponentti _Togglable_, jota käytetään seuraavalla tavalla:

```html
<Togglable buttonLabel="login">
  <LoginForm
    username={this.state.username}
    password={this.state.password}
    handleChange={this.handleLoginFieldChange}
    handleSubmit={this.login}
  />
</Togglable>
```

Komponentin käyttö poikkeaa aiemmin näkemistämme siinä, että käytössä on nyt avaava ja sulkeva tagi, joiden sisällä määritellään toinen komponentti eli _LoginForm_. Reactin terminologiassa _LoginForm_ on nyt komponentin _Togglable_ lapsi.

_Togglablen_ avaavan ja sulkevan tagin sisälle voi sijoittaa lapsiksi mitä tahansa React-elementtejä, esim.:

```html
<Togglable buttonLabel="paljasta">
  <p>tämä on aluksi piilossa</p>
  <p>toinen salainen rivi</p>
</Togglable>
```

Komponentin koodi on seuraavassa:

```react
class Togglable extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      visible: false
    }
  }

  toggleVisibility = () => {
    this.setState({visible: !this.state.visible})
  }

  render() {
    const hideWhenVisible = { display: this.state.visible ? 'none' : '' }
    const showWhenVisible = { display: this.state.visible ? '' : 'none' }

    return (
      <div>
        <div style={hideWhenVisible}>
          <button onClick={this.toggleVisibility}>{this.props.buttonLabel}</button>
        </div>
        <div style={showWhenVisible}>
          {this.props.children}
          <button onClick={this.toggleVisibility}>cancel</button>
        </div>
      </div>
    )
  }
}
```

Mielenkiintoista ja meille uutta on [this.props.children](https://reactjs.org/docs/glossary.html#propschildren), jonka avulla koodi viittaa komponentin lapsiin, eli avaavan ja sulkevan tagin sisällä määriteltyihin React-elementteihin.

Tällä kertaa lapset ainoastaan renderöidään komponentin oman renderöivän koodin seassa:

```html
<div style="{showWhenVisible}">
  {this.props.children}
  <button onClick="{this.toggleVisibility}">cancel</button>
</div>
```

Toisin kuin "normaalit" propsit, _children_ on Reactin automaattisesti määrittelemä, aina olemassa oleva propsi. Jos komponentti määritellään automaattisesti suljettavalla eli _/>_ loppuvalla tagilla, esim.

```html
<Note
  key={note.id}
  note={note}
  toggleImportance={this.toggleImportanceOf(note.id)}
/>
```

on _this.props.children_ tyhjä taulukko.

Komponentti _Togglable_ on uusiokäytettävä ja voimme käyttää sitä tekemään myös uuden muistiinpanon luomisesta huolehtivan formin vastaavalla tavalla tarpeen mukaan näytettäväksi.

Eristetään ensin muistiinpanojen luominen omaksi komponentiksi

```react
const NoteForm = ({ onSubmit, handleChange, value}) => {
  return (
    <div>
      <h2>Luo uusi muistiinpano</h2>

      <form onSubmit={onSubmit}>
        <input
          value={value}
          onChange={handleChange}
        />
        <button type="submit">tallenna</button>
      </form>
    </div>
  )
}
```

ja määritellään lomakkeen näyttävä koodi komponentin _Togglable_ sisällä

```html
<Togglable buttonLabel="new note">
  <NoteForm
    onSubmit={this.addNote}
    value={this.state.newNote}
    handleChange={this.handleNoteChange}
  />
</Togglable>
```

## ref eli viite komponenttiin

Ratkaisu on melko hyvä, haluaisimme kuitenkin parantaa sitä erään seikan osalta.

Kun uusi muistiinpano luodaan, olisi loogista jos luomislomake menisi piiloon. Nyt lomake pysyy näkyvillä. Lomakkeen piilottamiseen sisältyy kuitenkin pieni ongelma, sillä näkyvyyttä kontrolloidaan _Togglable_-komponentin tilassa olevalla muuttujalla ja komponentissa määritellyllä metodilla _toggleVisibility_. Miten pääsemme niihin käsiksi komponentin ulkopuolelta?

Koska React-komponentit ovat Javascript-olioita, on niiden metodeja mahdollista kutsua jos komponenttia vastaavaan olioon onnistutaan saamaan viite.

Eräs keino viitteen saamiseen on React-komponenttien attribuutti [ref](https://reactjs.org/docs/refs-and-the-dom.html#adding-a-ref-to-a-class-component).

Muutetaan lomakkeen renderöivää koodia seuraavasti:

```bash
<div>
  <Togglable buttonLabel="new note" ref={component => this.noteForm = component}>
    <NoteForm
      ...
    />
  </Togglable>
</div>
```

Kun komponentti _Togglable_ renderöidään, suorittaa React ref-attribuutin sisällä määritellyn funktion:

```js
component => (this.noteForm = component);
```

parametrin _component_ arvona on viite komponenttiin. Funktio tallettaa viitteen muuttujaan _this.noteForm_ eli _App_-komponentin kenttään _noteForm_.

Nyt mistä tahansa komponentin _App_ sisältä on mahdollista päästä käsiksi uusien muistiinpanojen luomisen sisältävään _Togglable_-komponenttiin.

Voimme nyt piilottaa lomakkeen kutsumalla _this.noteForm.toggleVisibility()_ samalla kun uuden muistiinpanon luominen tapahtuu:

```js
addNote = e => {
  e.preventDefault();
  this.noteForm.toggleVisibility();

  // ..
};
```

Refeille on myös [muita käyttötarkoituksia](https://reactjs.org/docs/refs-and-the-dom.html) kuin React-komponentteihin käsiksi pääseminen.

Sovelluksen tämänhetkinen koodi on kokonaisuudessaan [githubissa](https://github.com/fullstack-hy2019part2-notes/tree/part5-4), tagissa _part5-4_.

### Huomio komponenteista

Kun Reactissa määritellään komponentti

```js
class Togglable extends React.Component {
  // ...
}
```

ja otetaan se käyttöön seuraavasti

```react
<div>
  <Togglable buttonLabel="1" ref={component => this.t1 = component}>
    ensimmäinen
  </Togglable>

  <Togglable buttonLabel="2" ref={component => this.t2 = component}>
    toinen
  </Togglable>

  <Togglable buttonLabel="3" ref={component => this.t3 = component}>
    kolmas
  </Togglable>
</div>
```

syntyy _kolme erillistä komponenttiolioa_, joilla on kaikilla oma tilansa:

![](../assets/5/5.png)

_ref_-attribuutin avulla on talletettu viite jokaiseen komponenttiin muuttujiin _this.t1_, _this.t2_ ja _this.t3_.

## Tehtäviä

Tee nyt tehtävät [5.5-5.10](/tehtävät#komponenttien-näyttäminen-vain-tarvittaessa)

## PropTypes

Komponentti _Togglable_ olettaa, että sille määritellään propsina _buttonLabel_ napin teksti. Jos määrittely unohtuu

```html
<Togglable> buttonLabel unohtui... </Togglable>
```

Sovellus kyllä toimii, mutta selaimeen renderöityy hämäävästi nappi, jolla ei ole mitään tekstiä.

Haluaisimmekin varmistaa että jos _Togglable_-komponenttia käytetään, on propsille "pakko" antaa arvo.

Kirjaston olettamat ja edellyttämät propsit ja niiden tyypit voidaan määritellä kirjaston [prop-types](https://github.com/facebook/prop-types) avulla. Asennetaan kirjasto

```bash
npm install --save prop-types
```

_buttonLabel_ voidaan määritellä _pakolliseksi_ string-tyyppiseksi propsiksi seuraavasti

```react
import PropTypes from 'prop-types'

class Togglable extends React.Component {
  // ...
}

Togglable.propTypes = {
  buttonLabel: PropTypes.string.isRequired
}
```

Jos propsia ei määritellä, seurauksena on konsoliin tulostuva virheilmoitus

![](../assets/5/6.png)

Koodi kuitenkin toimii edelleen, eli mikään ei pakota määrittelemään propseja PropTypes-määrittelyistä huolimatta. On kuitenkin erittäin epäprofessionaalia jättää konsoliin _mitään_ punaisia tulosteita.

Määritellään Proptypet myös _LoginForm_-komponentille:

```react
import PropTypes from 'prop-types'

const LoginForm = ({ handleSubmit, handleChange, username, password }) => {
  return (
    // ...
  )
}

LoginForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  handleChange: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired
}
```

Funktionaalisen komponentin proptypejen määrittely tapahtuu samalla tavalla kuin luokkaperustaisten.

Jos propsin tyyppi on väärä, esim. yritetään määritellä propsiksi _handleChange_ merkkijono, seurauksena on varoitus:

![](../assets/5/7.png)

Luokkaperustaisille komponenteille PropTypet on mahdollista määritellä myös _luokkamuuttujina_, seuraavalla syntaksilla:

```react
import PropTypes from 'prop-types'

class Togglable extends React.Component {
  static propTypes = {
    buttonLabel: PropTypes.string.isRequired
  }

  // ...
}
```

Muuttujamäärittelyn edessä oleva _static_ määrittelee nyt, että _propTypes_-kenttä on nimenomaan komponentin määrittelevällä luokalla _Togglable_ eikä luokan instansseilla. Oleellisesti ottaen kyseessä on ainoastaan Javascriptin vielä standardoimattoman [ominaisuuden](https://github.com/tc39/proposal-class-fields) mahdollistava syntaktinen oikotie määritellä seuraava:

```js
Togglable.propTypes = {
  buttonLabel: PropTypes.string.isRequired,
};
```

Surffatessasi internetissä saatat vielä nähdä ennen Reactin versiota 0.16 tehtyjä esimerkkejä, joissa PropTypejen käyttö ei edellytä erillistä kirjastoa. Versiosta 0.16 alkaen PropTypejä ei enää määritelty React-kirjastossa itsessään ja kirjaston _prop-types_ käyttö on pakollista.

## Tehtäviä

Tee nyt tehtävä [5.11](/tehtävät#proptypet)



</div>