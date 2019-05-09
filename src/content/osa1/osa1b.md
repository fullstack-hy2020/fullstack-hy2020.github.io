---
mainImage: ../../images/part-1.svg
part: 1
letter: b
---

<div class="content">

Kurssin aikana on websovelluskehityksen rinnalla tavoite ja tarve oppia riittävässä määrin Javascriptiä.

Javascript on kehittynyt viime vuosina nopeaan tahtiin, ja käytämme kurssilla kielen uusimpien versioiden piirteitä. Javascript-standardin virallinen nimi on [ECMAScript](https://en.wikipedia.org/wiki/ECMAScript). Tämän hetken tuorein versio on kesäkuussa 2017 julkaistu [ES9](https://www.ecma-international.org/ecma-262/9.0/index.html), toiselta nimeltään ECMAScript 2018.

Selaimet eivät vielä osaa kaikkia Javascriptin uusimpien versioiden ominaisuuksia. Tämän takia selaimessa suoritetaan useimmiten koodia joka on käännetty (englanniksi <i>transpiled</i>) uudemmasta Javascriptin versiosta johonkin vanhempaan, laajemmin tuettuun versioon.

Tällä hetkellä johtava tapa tehdä transpilointi on [Babel](https://babeljs.io/). Create-react-app:in avulla luoduissa React-sovelluksissa on valmiiksi konfiguroitu automaattinen transpilaus. Katsomme kurssin [osassa 7](/osa7) tarkemmin miten transpiloinnin konfigurointi tapahtuu.

[Node.js](https://nodejs.org/en/) on melkein missä vaan, mm. palvelimilla toimiva, Googlen [chrome V8](https://developers.google.com/v8/)-javascriptmoottoriin perustuva Javascript-suoritusympäristö. Harjoitellaan hieman Javascriptiä Nodella. Tässä oletetaan, että koneellasi on Node.js:stä vähintään versio <i>v8.10.0</i>. Noden tuoreet versiot osaavat suoraan Javascriptin uusia versioita, joten koodin transpilaus ei ole tarpeen.

Koodi kirjoitetaan <i>.js</i>-päätteiseen tiedostoon, ja suoritetaan komennolla <em>node tiedosto.js</em>

Koodia on mahdollisuus kirjoittaa myös Node.js-konsoliin, joka aukeaa kun kirjoitat komentorivillä _node_ tai myös selaimen developer toolin konsoliin. Chromen uusimmat versiot osaavat suoraan transpiloimatta [melko hyvin](http://kangax.github.io/compat-table/es2016plus/) Javascriptin uusiakin piirteitä.

Javascript muistuttaa nimensä ja syntaksinsa puolesta läheisesti Javaa. Perusmekanismeiltaan kielet kuitenkin poikkeavat radikaalisti. Java-taustalta tultaessa Javascriptin käyttäytyminen saattaa aiheuttaa hämmennystä, varsinkin jos kielen piirteistä ei viitsitä ottaa selvää.

Tietyissä piireissä on myös ollut suosittua yrittää "simuloida" Javascriptilla eräitä Javan piirteitä ja ohjelmointitapoja. En suosittele.

### Muuttujat

Javascriptissä on muutama tapa määritellä muuttujia:

```js
const x = 1
let y = 5

console.log(x, y)   // tulostuu 1, 5
y += 10
console.log(x, y)   // tulostuu 1, 15
y = 'teksti'
console.log(x, y)   // tulostuu 1, teksti
x = 4               // aiheuttaa virheen
```

[const](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/const) ei oikeastaan määrittele muuttujaa vaan <i>vakion</i>, jonka arvoa ei voi enää muuttaa. [let](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let) taas määrittelee normaalin muuttujan.

Esimerkistä näemme myös, että muuttujan tallettaman tiedon tyyppi voi vaihtaa tyyppiä suorituksen aikana, _y_ tallettaa aluksi luvun ja lopulta merkkijonon.

Javascriptissa on myös mahdollista määritellä muuttujia avainsanan [var](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/var) avulla. Var oli pitkään ainoa tapa muuttujien määrittelyyn, const ja let tulivat kieleen mukaan vasta versiossa ES6. Var toimii tietyissä tilanteissa [eri](https://medium.com/craft-academy/javascript-variables-should-you-use-let-var-or-const-394f7645c88f) [tavalla](http://www.jstips.co/en/javascript/keyword-var-vs-let/) kuin useimpien muiden kielien muuttujien määrittely. Tällä kurssilla varin käyttö ei ole suositeltavaa eli käytä aina const:ia tai let:iä!

Lisää aiheesta esim. youtubessa [var, let and const - ES6 JavaScript Features](https://youtu.be/sjyJBL5fkp8)

### Taulukot

[Taulukko](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) ja muutama esimerkki sen käytöstä

```js
const t = [1, -1, 3]

t.push(5)

console.log(t.length) // tulostuu 4
console.log(t[1])     // tulostuu -1

t.forEach(value => {
  console.log(value)  // tulostuu 1, -1, 3, 5 omille riveilleen
})                    
```

Huomattavaa esimerkissä on se, että taulukon sisältöä voi muuttaa, vaikka se on määritelty _const_:ksi. Koska taulukko on olio, viittaa muuttuja koko ajan samaan olioon. Olion sisältö muuttuu sitä mukaa kuin taulukkoon lisätään uusia alkioita.

Eräs tapa käydä taulukon alkiot läpi on esimerkissä käytetty _forEach_, joka saa parametrikseen nuolisyntaksilla määritellyn <i>funktion</i>

```js
value => {
  console.log(value)
}
```

forEach kutsuu funktiota <i>jokaiselle taulukon alkiolle</i> antaen taulukon yksittäisen alkion aina parametrina. forEachin parametrina oleva funktio voi saada myös [muita parametreja](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach).

Edellisessä esimerkissä taulukkoon lisättiin uusi alkio metodilla [push](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/push). Reactin yhteydessä sovelletaan usein funktionaalisen ohjelmoinnin tekniikoita, jonka eräs piirre on käyttää <i>muuttumattomia</i> (engl. [immutable](https://en.wikipedia.org/wiki/Immutable_object)) tietorakenteita. React-koodissa kannattaakin mieluummin käyttää metodia [concat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/concat), joka ei lisää alkiota taulukkoon vaan luo uuden taulukon, jossa on lisättävä alkio sekä vanhan taulukon sisältö:

```js
const t = [1, -1, 3]

const t2 = t.concat(5)

console.log(t)  // tulostuu [1, -1, 3]
console.log(t2) // tulostuu [1, -1, 3, 5]
```

Metodikutsu _t.concat(5)_ ei siis lisää uutta alkiota vanhaan taulukkoon, vaan palauttaa uuden taulukon, joka sisältää vanhan taulukon alkioiden lisäksi uuden alkion.

Taulukoille on määritelty runsaasti hyödyllisiä operaatioita. Katsotaan pieni esimerkki metodin [map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) käytöstä.

```js
const t = [1, 2, 3]

const m1 = t.map(value => value * 2)
console.log(m1)   // tulostuu [2, 4, 6]
```

Map muodostaa taulukon perusteella <i>uuden taulukon</i>, jonka jokainen alkio luodaan map:in parametrina olevan funktion avulla, esimerkin tapauksessa kertomalla alkuperäinen luku kahdella.

Map voi muuttaa taulukon myös täysin erilaiseen muotoon:

```js
const m2 = t.map(value => '<li>' + value + '</li>')
console.log(m2)  
// tulostuu [ '<li>1</li>', '<li>2</li>', '<li>3</li>' ]
```

Eli lukuja sisältävästä taulukosta tehdään map-metodin avulla HTML-koodia sisältävä taulukko. Tulemmekin kurssin [osassa2](/osa2) näkemään, että mapia käytetään Reactissa todella usein.

Taulukon yksittäisiä alkioita on helppo sijoittaa muuttujiin [destrukturoivan](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment) sijoituslauseen avulla:

```js
const t = [1, 2, 3, 4, 5]

const [first, second, ...rest] = t

console.log(first, second)  // tulostuu 1, 2
console.log(rest)           // tulostuu [3, 4 ,5]
```

Eli muuttujiin _first_ ja _second_ tulee sijoituksen ansiosta taulukon kaksi ensimmäistä lukua. Muuttujaan _rest_ "kerätään" sijoituksesta jäljellejääneet luvut omaksi taulukoksi.

### Oliot

Javascriptissä on muutama tapa määritellä olioita. Erittäin yleisesti käytetään [olioliteraaleja](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Grammar_and_types#Object_literals), eli määritellään olio luettelemalla sen kentät (englanniksi property) aaltosulkeiden sisällä:

```js
const object1 = {
  name: 'Arto Hellas',
  age: 35,
  education: 'Filosofian tohtori',
}

const object12 = {
  name: 'Full Stack -websovelluskehitys',
  level: 'aineopinto',
  size: 5,
}

const object3 = {
  name: {
    first: 'Juha',
    last: 'Tauriainen',
  },
  grades: [2, 3, 5, 3],
  department: 'TKTL',
}
```

Kenttien arvot voivat olla tyypiltään mitä vaan, lukuja, merkkijonoja, taulukoita, olioita...

Olioiden kenttiin viitataan pistenotaatiolla, tai hakasulkeilla:

```js
console.log(object1.name)         // tulostuu Arto Hellas
const fieldName = 'age' 
console.log(object1[fieldName])   // tulostuu 35
```

Olioille voidaan lisätä kenttiä myös lennossa joko pistenotaation tai hakasulkeiden avulla:

```js
object1.address = 'Tapiola'
object1['secret number'] = 12341
```

Jälkimmäinen lisäyksistä on pakko tehdä hakasulkeiden avulla, sillä pistenotaatiota käytettäessä <i>secret number</i> ei kelpaa kentän nimeksi.

Javascriptissä olioilla voi luonnollisesti olla myös metodeja. Emme kuitenkaan tarvitse tällä kurssilla ollenkaan itse määriteltyjä metodillisia olioita, joten asiaa ei tällä kurssilla käsitellä kuin lyhyesti.

Olioita on myös mahdollista määritellä ns. konstruktorifunktioiden avulla, jolloin saadaan aikaan hieman monien ohjelmointikielten, esim. Javan luokkia (class) muistuttava mekanismi. Javascriptissä ei kuitenkaan ole luokkia samassa mielessä kuin olio-ohjelmointikielissä. Kieleen on kuitenkin lisätty versiosta ES6 alkaen <i>luokkasyntaksi</i>, joka helpottaa tietyissä tilanteissa olio-ohjelmointikielimäisten luokkien esittämistä.

### Funktiot

Olemme jo tutustuneet ns. nuolifunktioiden määrittelyyn. Täydellinen eli "pitkän kaavan" mukaan menevä tapa nuolifunktion määrittelyyn on seuraava

```js
const sum = (p1, p2) => {
  console.log(p1)
  console.log(p2)
  return p1 + p2
}
```

ja funktiota kutsutaan kuten olettaa saattaa

```js
const result = sum(1, 5)
console.log(result)
```

Jos parametreja on vain yksi, voidaan sulut jättää määrittelystä pois:

```js
const square = p => {
  console.log(p)
  return p * p
}
```

Jos funktio sisältää ainoastaan yhden lausekkeen, ei aaltosulkeita tarvita. Tällöin funktio palauttaa ainoan lausekkeensa arvon. Eli jos poistetaan konsoliin tulostus, voidaan edellinen funktio ilmaista lyhyemmin seuraavasti:

```js
const square = p => p * p
```

Tämä muoto on erityisen kätevä käsiteltäessä taulukkoja esim. map-metodin avulla:

```js
const t = [1, 2, 3]
const tSquared = t.map(p => p * p)
// tSquared on nyt [1, 4, 9]
```

Nuolifunktio on tullut Javascriptiin vasta muutama vuosi sitten version [ES6](http://es6-features.org/) myötä. Tätä ennen ainoa tapa funktioiden määrittelyyn oli avainsanan _function_ käyttö.

Määrittelytapoja on kaksi, funktiolle voidaan antaa [function declaration](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function) -tyyppisessä määrittelyssä <i>nimi</i>, jonka avulla funktioon voidaan viitata:

```js
function product(a, b) {
  return a * b
}

const vastaus = product(2, 6)
```

Toinen tapa on tehdä määrittely [funktiolausekkeena](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/function). Tällöin funktiolle ei tarvitse antaa nimeä ja määrittely voi sijaita muun koodin seassa:

```js
const average = function(a, b) {
  return (a + b) / 2
}

const vastaus = average(2, 5)
```

Määrittelemme tällä kurssilla kaikki funktiot nuolisyntaksin avulla.

</div>

<div class="tasks">
  <h3>Tehtäviä</h3>

<i>Jatkamme edellisissä tehtävissä aloitetun ohjelman rakentamista, voit siis tehdä koodin samaan projektiin, palautuksessa ollaan kiinnostuneita ainoastaan ohjelman lopullisesta versiosta.</i>

**Protip:** voit kohdata ohjelmoidessasi ongelmia sen suhteen missä muodossa komponentin saamat <i>propsit</i> ovat. Hyvä keino varmistua asiasta on tulostaa propsit konsoliin, esim. seuraavasti:

```js
const Header = (props) => {
  console.log(props) // highlight-line
  return <h1>{props.course}</h1>
}
```

  <h4>1.3: kurssitiedot step3</h4>

Siirrytään käyttämään sovelluksessamme oliota. Muuta komponentin <i>App</i> muuttujamäärittelyt seuraavaan muotoon ja muuta sovelluksen kaikkia osia niin, että se taas toimii:

```js
const App = () => {
  const course = 'Half Stack -sovelluskehitys'
  const part1 = {
    name: 'Reactin perusteet',
    exercises: 10
  }
  const part2 = {
    name: 'Tiedonvälitys propseilla',
    exercises: 7
  }
  const part3 = {
    name: 'Komponenttien tila',
    exercises: 14
  }

  return (
    <div>
      ...
    </div>
  )
}
```

  <h4>1.4: kurssitiedot step4</h4>

Ja laitetaan oliot taulukkoon, eli muuta  <i>App</i> :in muuttujamäärittelyt seuraavaan muotoon ja muuta sovelluksen kaikki osat vastaavasti:

```js
const App = () => {
  const course = 'Half Stack -sovelluskehitys'
  const parts = [
    {
      name: 'Reactin perusteet',
      exercises: 10
    },
    {
      name: 'Tiedonvälitys propseilla',
      exercises: 7
    },
    {
      name: 'Komponenttien tila',
      exercises: 14
    }
  ]

  return (
    <div>
      ...
    </div>
  )
}
```

**HUOM:** tässä vaiheessa <i>voit olettaa, että taulukossa on aina kolme alkiota</i>, eli taulukkoa ei ole pakko käydä läpi looppaamalla. Palataan taulukossa olevien olioiden perusteella tapahtuvaan komponenttien renderöintiin asiaan tarkemmin kurssin [seuraavassa osassa](../osa2).

Älä kuitenkaan välitä eri olioita komponentista <i>App</i> sen sisältämiin komponentteihin <i>Content</i> ja <i>Total</i> erillisinä propseina, vaan suoraan taulukkona:

```js
const App = () => {
  // const-määrittelyt

  return (
    <div>
      <Header course={...} />
      <Content parts={parts} />
      <Total parts={parts} />
    </div>
  )
}
```

  <h4>1.5: kurssitiedot step5</h4>

Viedään muutos vielä yhtä askelta pidemmälle, eli tehdään kurssista ja sen osista yksi Javascript-olio. Korjaa kaikki mikä menee rikki.

```js
const App = () => {
  const course = {
    name: 'Half Stack -sovelluskehitys',
    parts: [
      {
        name: 'Reactin perusteet',
        exercises: 10
      },
      {
        name: 'Tiedonvälitys propseilla',
        exercises: 7
      },
      {
        name: 'Komponenttien tila',
        exercises: 14
      }
    ]
  }

  return (
    <div>
      ...
    </div>
  )
}
```

</div>

<div class="content">

### Olioiden metodit ja this

Koska käytämme tällä kurssilla Reactin hookit sisältävää versiota, meidän ei kurssin aikana tarvitse määritellä ollenkaan olioita, joilla on metodeja. **Tämän luvun asiat siis eivät ole kurssin kannalta relevantteja**, mutta varmasti monella tapaa hyödyllisiä tietää. Käytettäessä "vanhempaa Reactia", tämän luvun asiat on hallittava.

Nuolifunktiot ja avainsanan _function_ avulla määritellyt funktiot poikkeavat radikaalisti siitä miten ne käyttäytyvät olioon itseensä viittaavan avainsanan [this](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this) suhteen.

Voimme liittää oliolle metodeja määrittelemällä niille kenttiä, jotka ovat funktioita:

```js
const arto = {
  name: 'Arto Hellas',
  age: 35,
  education: 'Filosofian tohtori',
  greet: function() {
    console.log('hello, my name is', this.name)
  },
}

arto.greet()  // tulostuu hello, my name is Arto Hellas
```

metodeja voidaan liittää olioille myös niiden luomisen jälkeen:

```js
const arto = {
  name: 'Arto Hellas',
  age: 35,
  education: 'Filosofian tohtori',
  greet: function() {
    console.log('hello, my name is', this.name)
  },
}

// highlight-start
arto.growOlder = function() {
  this.age += 1
}
// highlight-end

console.log(arto.age)   // tulostuu 35
arto.growOlder()
console.log(arto.age)   // tulostuu 36
```

Muutetaan olioa hiukan

```js
const arto = {
  name: 'Arto Hellas',
  age: 35,
  education: 'Filosofian tohtori',
  greet: function() {
    console.log('hello, my name is', this.name)
  },
  // highlight-start
  doAddition: function(a, b) {
    console.log(a + b)
  },
  // highlight-end
}

arto.doAddition(1, 4) // tulostuu 5

const referenceToAdditon = arto.doAddition
referenceToAdditon(10, 15) // tulostuu 25
```

Oliolla on nyt metodi _doAddition_, joka osaa laskea parametrina annettujen lukujen summan. Metodia voidaan kutsua normaaliin tapaan olion kautta <em>arto.doAddition(1, 4)</em> tai tallettamalla <i>metodiviite</i> muuttujaan ja kutsumalla metodia muuttujan kautta <em>referenceToAdditon(10, 15)</em>.

Jos yritämme samaa metodille _greet_, aiheutuu ongelmia:

```js
arto.greet()       // tulostuu hello, my name is Arto Hellas

const referenceToGreet = arto.greet
referenceToGreet() // konsoliin tulostuu virheilmoitus
```

Kutsuttaessa metodia viitteen kautta, on metodi kadottanut tiedon siitä mikä oli alkuperäinen _this_. Toisin kuin melkein kaikissa muissa kielissä, Javascriptissa [this](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this):n arvo määrittyy sen mukaan <i>miten metodia on kutsuttu</i>. Kutsuttaessa metodia viitteen kautta, _this_:in arvoksi tulee ns. [globaali objekti](https://developer.mozilla.org/en-US/docs/Glossary/Global_object) ja lopputulos ei ole yleensä ollenkaan se, mitä sovelluskehittäjä olettaa.

This:in kadottaminen aiheuttaa Javascriptillä ohjelmoidessa monia potentiaalisia ongelmia. Eteen tulee erittäin usein tilanteita, missä Reactin/Noden (oikeammin ilmaistuna selaimen Javascript-moottorin) tulee kutsua joitain ohjelmoijan määrittelemien olioiden metodeja. Tällä kurssilla kuitenkin säästymme näiltä ongelmilta, sillä käytämme ainoastaan "thissitöntä" Javascriptia.

Eräs this:in katoamiseen johtava tilanne tulee esim. jos pyydetään Artoa tervehtimään sekunnin kuluttua metodia [setTimeout](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setTimeout) hyväksikäyttäen.

```js
const arto = {
  name: 'Arto Hellas',
  greet: function() {
    console.log('hello, my name is', this.name)
  },
}

setTimeout(arto.greet, 1000)  // highlight-line
```

Javascriptissa this:in arvo siis määräytyy siitä miten metodia on kutsuttu. setTimeoutia käytettäessä metodia kutsuu Javascript-moottori ja this viittaa Timeout-olioon.

On useita mekanismeja, joiden avulla alkuperäinen _this_ voidaan säilyttää, eräs näistä on metodin [bind](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind) käyttö:

```js
setTimeout(arto.greet.bind(arto), 1000)
```

Komento <em>arto.greet.bind(arto)</em> luo uuden funktion, missä se on sitonut _this_:in tarkoittamaan Artoa riippumatta siitä missä ja miten metodia kutsutaan.

[Nuolifunktioiden](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions) avulla on mahdollista ratkaista eräitä this:iin liittyviä ongelmia. Olioiden metodeina niitä ei kuitenkaan kannata käyttää, sillä silloin _this_ ei toimi ollenkaan. Palaamme nuolifunktioiden this:in käyttäytymiseen myöhemmin.

Jos haluat ymmärtää paremmin javascriptin _this_:in toimintaa, löytyy internetistä runsaasti materiaalia aiheesta. Esim. [egghead.io](https://egghead.io):n 20 minuutin screencastsarja [Understand JavaScript's this Keyword in Depth](https://egghead.io/courses/understand-javascript-s-this-keyword-in-depth) on erittäin suositeltava!

### Luokat

Kuten aiemmin mainittiin, Javascriptissä ei ole olemassa olio-ohjelmointikielten luokkamekanismia. Javascriptissa on kuitenkin ominaisuuksia, jotka mahdollistavat olio-ohjelmoinnin [luokkien](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes) "simuloinnin". Emme mene nyt sen tarkemmin Javascriptin olioiden taustalla olevaan [prototyyppiperintämekanismiin](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Inheritance_and_the_prototype_chain).

Tutustutaan nyt pikaisesti ES6:n myötä Javascriptiin tulleeseen <i>luokkasyntaksiin</i>, joka helpottaa oleellisesti luokkien (tai luokan kaltaisten asioiden) määrittelyä Javascriptissa.

Seuraavassa on määritelty "luokka" Person ja sille kaksi Person-oliota:

```js
class Person {
  constructor(name, age) {
    this.name = name
    this.age = age
  }
  greet() {
    console.log('hello, my name is', this.name)
  }
}

const arto = new Person('Arto Hellas', 35)
arto.greet()

const juhq = new Person('Juha Tauriainen', 48)
juhq.greet()
```

Syntaksin osalta luokat ja niistä luodut oliot muistuttavat erittäin paljon esim. Javan luokkia ja olioita. Käyttäytymiseltäänkin ne ovat aika lähellä Javan olioita. Perimmiltään kyseessä on kuitenkin edelleen Javascriptin [prototyyppiperintään](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/Inheritance) perustuvista olioista. Molempien olioiden todellinen tyyppi on _Object_ sillä Javascriptissä ei perimmiltään ole muita tyyppejä kuin [Boolean, Null, Undefined, Number, String, Symbol ja Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures)

Luokkasyntaksin tuominen Javascriptiin on osin kiistelty lisäys, ks. esim. [Not Awesome: ES6 Classes](https://awesomeopensource.com/project/joshburgess/not-awesome-es6-classes) tai [Is “Class” In ES6 The New “Bad” Part?](https://medium.com/@rajaraodv/is-class-in-es6-the-new-bad-part-6c4e6fe1ee65)

ES6:n luokkasyntaksia käytetään paljon "vanhassa" Reactissa ja Node.js:ssä ja siksi sen tunteminen on tälläkin kurssilla paikallaan. Koska käytämme kurssilla Reactin uutta [hook](https://reactjs.org/docs/hooks-intro.html)-ominaisuutta, meidän ei ole tarvetta käyttää kurssilla ollenkaan Javascriptin luokkasyntaksia.

### Javascript-materiaalia

Javascriptistä löytyy verkosta suuret määrät sekä hyvää että huonoa materiaalia. Tällä sivulla lähes kaikki Javascriptin ominaisuuksia käsittelevät linkit ovat [Mozillan Javascript -materiaaliin](https://developer.mozilla.org/en-US/docs/Web/JavaScript).

Mozillan sivuilta kannattaa lukea oikeastaan välittömästi [A re-introduction to JavaScript (JS tutorial)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/A_re-introduction_to_JavaScript).

Jos haluat tutustua todella syvällisesti Javascriptiin, löytyy internetistä ilmaiseksi mainio kirjasarja [You-Dont-Know-JS](https://github.com/getify/You-Dont-Know-JS).

[egghead.io](https://egghead.io):lla on tarjolla runsaasti laadukkaita screencasteja Javascriptista, Reactista ym. kiinnostavasta. Valitettavasti materiaali on osittain maksullista.

</div>
