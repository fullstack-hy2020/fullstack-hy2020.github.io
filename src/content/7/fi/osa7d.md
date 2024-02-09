---
mainImage: ../../../images/part-7.svg
part: 7
letter: d
lang: fi
---

<div class="content">

React oli alkuaikoina jossain määrin kuuluisa siitä, että sovelluskehityksen edellyttämien työkalujen konfigurointi oli hyvin hankalaa. Tilannetta helpottamaan kehitettiin [Create React App](https://github.com/facebookincubator/create-react-app):in, joka poisti konfigurointiin liittyvät ongelmat. Kurssillakin käytettävä [Vite](https://vitejs.dev/) on viime aikoina korvannut Create React Appin uusissa sovelluksissa.

Sekä Vite että Create React App hyödyntävät varsinaisen työn tekemiseen <i>bundlereita</i>. Tutustumme nyt Create React Appin käyttämään [Webpack](https://webpack.js.org/)-nimiseen bundleriin. Webpack oli vuosia ylivoimaisesti suosituin bundler-ohjelmisto. Viime aikoina on kuitenkin syntynyt useita uuden sukupolven bundlereita kuten Viten käyttämä [esbuild](https://esbuild.github.io/), jotka ovat Webpackia huomattavasti nopeampia ja helppokäyttöisempiä. Esim. esbuildista kuitenkin puuttuu vielä eräitä hyödyllisiä ominaisuuksia (kuten selaimessa olevan koodin hotreload), joten tutustumme seuraavassa bundlereiden vanhaan hallitsijaan Webpackiin.

### Bundlaus

Olemme toteuttaneet sovelluksia jakamalla koodin moduuleihin, joita on <i>importattu</i> niitä tarvitseviin paikkoihin. Vaikka ES6-moduulit ovatkin JavaScript-standardissa määriteltyjä, eivät vanhemmat selaimet vielä osaa käsitellä moduuleihin jaettua koodia.

Selainta varten moduuleissa oleva koodi <i>bundlataan</i>, eli siitä muodostetaan yksittäinen, kaiken koodin sisältävä tiedosto. Kun veimme Reactilla toteutetun frontendin tuotantoon osan 3 luvussa [Frontendin tuotantoversio](/osa3/sovellus_internetiin#frontendin-tuotantoversio), suoritimme bundlauksen komennolla _npm run build_. Konepellin alla kyseinen npm-skripti suorittaa bundlauksen, ja tuloksena on joukko hakemistoon <i>dist</i> sijoitettavia tiedostoja:

<pre>
├── assets
│   ├── index-d526a0c5.css
│   ├── index-e92ae01e.js
│   └── react-35ef61ed.svg
├── index.html
└── vite.svg
</pre>

Hakemiston dist juuressa oleva sovelluksen "päätiedosto" <i>index.html</i> lataa <i>script</i>-tagin avulla bundlatun JavaScript-tiedoston:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vite + React</title>
    <script type="module" crossorigin src="/assets/index-e92ae01e.js"></script>
    <link rel="stylesheet" href="/assets/index-d526a0c5.css">
  </head>
  <body>
    <div id="root"></div>
    
  </body>
</html>
```

Kuten esimerkistä näemme, Vitellä tehdyssä sovelluksessa bundlataan JavaScriptin lisäksi sovelluksen CSS-määrittelyt tiedostoon <i>/assets/index-d526a0c5.csss</i>.

Käytännössä bundlaus tapahtuu siten, että sovelluksen JavaScriptille määritellään alkupiste, usein tiedosto <i>index.js</i>, ja bundlauksen yhteydessä webpack ottaa mukaan kaiken koodin mitä alkupiste importtaa, importattujen koodien importtaamat koodit jne.

Koska osa importeista on kirjastoja kuten React, Redux tai Axios, bundlattuun JavaScript-tiedostoon tulee myös kaikkien näiden sisältö.

> Vanha tapa jakaa sovelluksen koodi moneen tiedostoon perustui siihen, että <i>index.html</i> latasi kaikki sovelluksen tarvitsemat erilliset JavaScript-tiedostot script-tagien avulla. Tämä on kuitenkin tehotonta, sillä jokaisen tiedoston lataaminen aiheuttaa pienen overheadin ja pääosin nykyään suositaankin koodin bundlaamista yksittäiseksi tiedostoksi.

Tehdään nyt React-projektille sopiva webpack-konfiguraatio kokonaan käsin.

Luodaan projektia varten hakemisto ja sen sisälle hakemistot (<i>build</i> ja <i>src</i>) sekä seuraavat tiedostot:

<pre>
├── build
├── package.json
├── src
│   └── index.js
└── webpack.config.js
</pre>

Tiedoston <i>package.json</i> sisältö voi olla esim. seuraava:

```json
{
  "name": "webpack-osa7",
  "version": "0.0.1",
  "description": "practising webpack",
  "scripts": {},
  "license": "MIT"
}
```

Asennetaan webpack:

```js
npm install --save-dev webpack webpack-cli
```

Webpackin toiminta konfiguroidaan tiedostoon <i>webpack.config.js</i>. Laitetaan sen alustavaksi sisällöksi seuraava:

```js
const path = require('path')

const config = () => {
  return {
    entry: './src/index.js',
    output: {
      path: path.resolve(__dirname, 'build'),
      filename: 'main.js'
    }
  }
}

module.exports = config
```

**Huom:** määrittely olisi mahdollista tehdä funktion sijaan myös suoraan oliona:

```js
const path = require('path')

const config = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'main.js'
  }
}

module.exports = config
```

Olio riittää monissa tilanteissa, mutta tulemme myöhemmin tarvitsemaan tiettyjä ominaisuuksia, jotka edellyttävät sen että määrittely on tehty funktiona.

Määritellään sitten npm-skripti <i>build</i>, jonka avulla bundlaus suoritetaan:

```js
// ...
"scripts": {
  "build": "webpack --mode=development"
},
// ...
```

Lisätään hieman koodia tiedostoon <i>src/index.js</i>:

```js
const hello = name => {
  console.log(`hello ${name}`)
}
```

Kun nyt suoritamme komennon _npm run build_, webpack bundlaa koodin. Tuloksena on hakemistoon <i>build</i> sijoitettava tiedosto <i>main.js</i>:

![](../../images/7/19x.png)

Tiedostossa on paljon erikoisen näköistä tavaraa. Lopussa on mukana myös kirjoittamamme koodi:

```js
eval("const hello = name => {\n  console.log(`hello ${name}`)\n}\n\n//# sourceURL=webpack://webpack-osa7/./src/index.js?");
```

Lisätään hakemistoon <i>src</i> tiedosto <i>App.js</i> ja sille sisältö:

```js
const App = () => {
  return null
}

export default App
```

Importataan moduuli <i>App</i> ja käytetään sitä tiedostossa <i>index.js</i>:

```js
import App from './App';

const hello = name => {
  console.log(`hello ${name}`)
}

App()
```

Kun nyt suoritamme bundlauksen komennolla _npm run build_, huomaamme webpackin havainneen molemmat tiedostot:

![](../../images/7/20x.png)

Kirjoittamamme koodi löytyy erittäin kryptisesti muotoiltuna bundlen lopusta:

![](../../images/7/20z.png)

### Konfiguraatiotiedosto

Katsotaan nyt tarkemmin konfiguraation <i>webpack.config.js</i> tämänhetkistä sisältöä:

```js
const path = require('path')

const config = () => {
  return {
    entry: './src/index.js',
    output: {
      path: path.resolve(__dirname, 'build'),
      filename: 'main.js'
    }
  }
}

module.exports = config
```

Konfiguraatio on JavaScriptia ja tapahtuu eksporttaamalla määrittelyt palauttava funktio Noden moduulisyntaksilla.

Tämänhetkinen minimaalinen määrittely on aika ilmeinen. Kenttä [entry](https://webpack.js.org/concepts/#entry) kertoo sen tiedoston, mistä bundlaus aloitetaan.

Kenttä [output](https://webpack.js.org/concepts/#output) taas kertoo minne muodostettu bundle sijoitetaan. Kohdehakemisto täytyy määritellä <i>absoluuttisena polkuna</i>, mikä onnistuu helposti [path.resolve](https://nodejs.org/docs/latest-v8.x/api/path.html#path_path_resolve_paths)-metodilla. [\_\_dirname](https://nodejs.org/docs/latest/api/globals.html#globals_dirname) on Noden globaali muuttuja, joka viittaa nykyiseen hakemistoon.

### Reactin bundlaaminen

Muutetaan sitten sovellus minimalistiseksi React-sovellukseksi. Asennetaan tarvittavat kirjastot:

```bash
npm install react react-dom
```

Liitetään tavanomaiset loitsut tiedostoon <i>index.js</i>

```js
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

ReactDOM.createRoot(document.getElementById('root')).render(<App />)
```

ja muutetaan <i>App.js</i> muotoon

```js
import React from 'react' // tarvitsemme importin nyt myös kompontentin määrittelyn yhteydessä

const App = () => {
  return (
    <div>
      hello webpack
    </div>
  )
}

export default App
```

Tarvitsemme sovellukselle myös "pääsivuna" toimivan tiedoston <i>build/index.html</i>, joka lataa <i>script</i>-tagin avulla bundlatun JavaScriptin:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>React App</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="text/javascript" src="./main.js"></script>
  </body>
</html>
```

Kun bundlaamme sovelluksen, törmäämme kuitenkin ongelmaan:

![](../../images/7/21x.png)

### Loaderit

Webpack mainitsee, että saatamme tarvita <i>loaderin</i> tiedoston <i>App.js</i> käsittelyyn. Webpack ymmärtää itse vain JavaScriptia, ja vaikka se saattaa meiltä matkan varrella olla unohtunutkin, käytämme Reactia ohjelmoidessamme [JSX](https://facebook.github.io/jsx/):ää näkymien renderöintiin, eli esim. seuraava

```js
const App = () => {
  return (
    <div>
      hello webpack
    </div>
  )
}
```

ei ole "normaalia" JavaScriptia, vaan JSX:n tarjoama syntaktinen oikotie määritellä <i>div</i>-tagia vastaava React-elementti.

[Loaderien](https://webpack.js.org/concepts/loaders/) avulla on mahdollista kertoa webpackille miten tiedostot tulee käsitellä ennen niiden bundlausta.

Määritellään projektiimme Reactin käyttämän JSX:n normaaliksi JavaScriptiksi muuntava loaderi:

```js
const path = require('path')

const config = () => {
  return {
    entry: './src/index.js',
    output: {
      path: path.resolve(__dirname, 'build'),
      filename: 'main.js'
    },
      // highlight-start
    module: {
      rules: [
        {
          test: /\.js$/,
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-react'],
          },
        },
      ],
    },
      // highlight-end
  }
}

module.exports = config
```

Loaderit määritellään kentän <i>module</i> alle sijoitettavaan taulukkoon <i>rules</i>.

Yksittäisen loaderin määrittely on kolmiosainen:

```js
{
  test: /\.js$/,
  loader: 'babel-loader',
  options: {
    presets: ['@babel/preset-react']
  }
}
```

Kenttä <i>test</i> määrittelee, että käsitellään <i>.js</i>-päätteisiä tiedostoja. Kenttä <i>loader</i> kertoo, että käsittely tapahtuu [Babel Loader](https://github.com/babel/babel-loader):illa. Kenttä <i>options</i> taas antaa loaderille sen toimintaa ohjaavia parametreja.

Asennetaan loader ja sen tarvitsemat kirjastot <i>kehitysaikaisiksi riippuvuuksiksi</i>:

```js
npm install @babel/core babel-loader @babel/preset-react --save-dev
```

Nyt bundlaus onnistuu.

Jos katsomme bundlattua koodia ja editoimme hieman koodin ulkoasua, huomaamme, että komponentti <i>App</i> on muuttunut muotoon

```js
const App = () =>
  react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
    'div',
    null,
    'hello webpack'
  )
```

Eli JSX-syntaksin sijaan komponentit luodaan pelkällä JavaScriptilla käyttäen Reactin funktiota [createElement](https://reactjs.org/docs/react-without-jsx.html).

Sovellusta voi nyt kokeilla avaamalla tiedoston <i>build/index.html</i> selaimen <i>open file</i> ‑toiminnolla:

![](../../images/7/22.png)

On kuitenkin huomionarvoista, että jos sovelluksemme sisältää <i>async/await</i>-toiminnallisuutta, selaimeen ei joillain selaimilla renderöidy mitään. [Konsoliin tulostuneen virheviestin googlaaminen](https://stackoverflow.com/questions/33527653/babel-6-regeneratorruntime-is-not-defined) valaisee asiaa. Ongelma korjaantuu asentamalla kirjastot [core-js](https://www.npmjs.com/package/core-js) ja [regenerator-runtime](https://www.npmjs.com/package/regenerator-runtime)

```bash
npm install core-js regenerator-runtime
```

ja importtaamalla ne tiedostossa <i>index.js</i>:

```js
import 'core-js/stable/index.js'
import 'regenerator-runtime/runtime.js'
```

Tässä on jo melkein kaikki mitä tarvitsemme React-sovelluskehitykseen.

### Transpilaus

Prosessista, joka muuttaa JavaScriptia muodosta toiseen käytetään englanninkielistä termiä [transpiling](https://en.wiktionary.org/wiki/transpile), joka taas on termi, joka viittaa koodin kääntämiseen (compile) sitä muuntamalla (transform). Suomenkielisen termin puuttuessa käytämme prosessista tällä kurssilla nimitystä <i>transpilaus</i>.

Edellisen luvun konfiguraation avulla siis <i>transpiloimme</i> JSX:ää sisältävän JavaScriptin normaaliksi JavaScriptiksi tämän hetken johtavan työkalun [Babelin](https://babeljs.io/) avulla.

Kuten osassa 1 jo mainittiin, läheskään kaikki selaimet eivät vielä osaa JavaScriptin uusimpien versioiden ES6:n ja ES7:n ominaisuuksia, ja tämän takia koodi yleensä transpiloidaan käyttämään vanhempaa JavaScript-syntaksi ES5:ttä.

Babelin suorittama transpilointiprosessi määritellään <i>pluginien</i> avulla. Käytännössä useimmiten käytetään valmiita [presetejä](https://babeljs.io/docs/plugins/) eli useamman sopivan pluginin joukkoja.

Tällä hetkellä sovelluksemme transpiloinnissa käytetään presetiä [@babel/preset-react](https://babeljs.io/docs/plugins/preset-react/):

```js
{
  test: /\.js$/,
  loader: 'babel-loader',
  options: {
    presets: ['@babel/preset-react'] // highlight-line
  }
}
```

Otetaan käyttöön preset [@babel/preset-env](https://babeljs.io/docs/plugins/preset-env/), joka sisältää kaiken hyödyllisen, minkä avulla uusimman standardin mukainen koodi saadaan transpiloitua ES5-standardin mukaiseksi koodiksi:

```js
{
  test: /\.js$/,
  loader: 'babel-loader',
  options: {
    presets: ['@babel/preset-env', '@babel/preset-react'] // highlight-line
  }
}
```

Preset asennetaan komennolla

```js
npm install @babel/preset-env --save-dev
```

Kun nyt transpiloimme koodin, muuttuu se vanhan koulukunnan JavaScriptiksi. Komponentin <i>App</i> määrittely näyttää seuraavalta:

```js
var App = function App() {
  return _react2.default.createElement('div', null, 'hello webpack')
};
```

Muuttujan määrittely tapahtuu avainsanan _var_ avulla, sillä ES5 ei tunne avainsanaa _const_. Myöskään nuolifunktiot eivät ole käytössä, joten funktiomäärittely käyttää avainsanaa _function_.

### CSS

Lisätään sovellukseemme hieman CSS:ää. Tehdään tiedosto <i>src/index.css</i>:

```css
.container {
  margin: 10;
  background-color: #dee8e4;
}
```

Määritellään tyyli käytettäväksi komponentissa <i>App</i>

```js
const App = () => {
  return (
    <div className="container">
      hello webpack
    </div>
  )
}
```

ja importataan se tiedostossa <i>index.js</i>:

```js
import './index.css'
```

Transpilointi hajoaa:

![](../../images/7/23x.png)

CSS:ää varten onkin otettava käyttöön [css](https://webpack.js.org/loaders/css-loader/)- ja [style](https://webpack.js.org/loaders/style-loader/)-loaderit:

```js
{
  rules: [
    {
      test: /\.js$/,
      loader: 'babel-loader',
      options: {
        presets: ['@babel/preset-react', '@babel/preset-env'],
      },
    },
    // highlight-start
    {
      test: /\.css$/,
      use: ['style-loader', 'css-loader'],
    },
    // highlight-end
  ];
}
```

[css-loaderin](https://webpack.js.org/loaders/css-loader/) tehtävänä on ladata <i>CSS</i>-tiedostot, ja [style-loader](https://webpack.js.org/loaders/style-loader/) generoi koodiin CSS:t sisältävän <i>style</i>-elementin.

Näin konfiguroituna CSS-määrittelyt sisällytetään sovelluksen JavaScriptin sisältävään tiedostoon <i>main.js</i>. Sovelluksen päätiedostossa <i>index.html</i> ei siis ole tarvetta erikseen ladata CSS:ää.

CSS voidaan tarpeen vaatiessa myös generoida omaan tiedostoonsa esim. [mini-css-extract-pluginin](https://github.com/webpack-contrib/mini-css-extract-plugin) avulla.

Kun loaderit asennetaan

```js
npm install style-loader css-loader --save-dev
```

bundlaus toimii taas ja sovellus saa uudet tyylit.

### Webpack-dev-server

Sovelluskehitys onnistuu jo, mutta development workflow on suorastaan hirveä (alkaa jo muistuttaa Javalla tapahtuvaa sovelluskehitystä...). Muutosten jälkeen koodi on bundlattava ja selain uudelleenladattava jos haluamme testata koodia.

Ratkaisun tarjoaa [webpack-dev-server](https://webpack.js.org/guides/development/#using-webpack-dev-server). Asennetaan se komennolla

```js
npm install --save-dev webpack-dev-server
```

Määritellään dev-serverin käynnistävä npm-skripti:

```js
{
  // ...
  "scripts": {
    "build": "webpack --mode=development",
    "start": "webpack serve --mode=development" // highlight-line
  },
  // ...
}
```

Lisätään tiedostoon <i>webpack.config.js</i> kenttä <i>devServer</i>:

```js
const config = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'main.js',
  },
  // highlight-start
  devServer: {
    static: path.resolve(__dirname, 'build'),
    compress: true,
    port: 3000,
  },
  // highlight-end
  // ...
};
```

Komento _npm start_ käynnistää nyt dev-serverin porttiin, eli sovelluskehitys tapahtuu avaamalla tuttuun tapaan selain osoitteeseen <http://localhost:3000>. Kun teemme koodiin muutoksia, reloadaa selain automaattisesti itsensä.

Päivitysprosessi on nopea, sillä dev-serveriä käytettäessä webpack ei bundlaa koodia normaaliin tapaan tiedostoksi <i>main.js</i>, vaan bundlauksen tuotos on olemassa ainoastaan keskusmuistissa.

Laajennetaan koodia muuttamalla komponentin <i>App</i> määrittelyä seuraavasti:

```js
import React, { useState } from 'react'
import './index.css'

const App = () => {
  const [counter, setCounter] = useState(0)

  return (
    <div className="container">
      hello webpack {counter} clicks
      <button onClick={() => setCounter(counter + 1)}>
        press
      </button>
    </div>
  )
}

export default App
```

Sovellus toimii hyvin ja kehitys on melko sujuvaa.

### Sourcemappaus

Erotetaan napin klikkauksenkäsittelijä omaksi funktiokseen ja talletetaan tilaan <i>values</i> laskurin aiemmat arvot:

```js
const App = () => {
  const [counter, setCounter] = useState(0)
  const [values, setValues] = useState() // highlight-line

  const handleClick = () => {
    setCounter(counter + 1)
    setValues(values.concat(counter)) // highlight-line
  }

  return (
    <div className="container">
      hello webpack {counter} clicks
      <button onClick={handleClick}> // highlight-line
        press
      </button>
    </div>
  )
}
```

Sovellus ei enää toimi, ja konsoli kertoo virheestä:

![](../../images/7/25.png)

Tiedämme tietenkin nyt, että virhe on metodissa onClick, mutta jos olisi kyse suuremmasta sovelluksesta, on virheilmoitus sikäli hyvin ikävä, että sen ilmoittama paikka

<pre>
App.js:27 Uncaught TypeError: Cannot read property 'concat' of undefined
    at handleClick (App.js:27)
</pre>

ei vastaa alkuperäisen koodin virheen sijaintia. Jos klikkaamme virheilmoitusta, huomaamme, että näytettävä koodi on jotain ihan muuta kuin kirjoittamamme koodi:

![](../../images/7/26.png)

Haluamme tietenkin, että virheilmoitusten yhteydessä näytetään kirjoittamamme koodi.

Korjaus on onneksi hyvin helppo. Pyydetään webpackia generoimaan bundlelle ns. [source map](https://webpack.js.org/configuration/devtool/), jonka avulla bundlea suoritettaessa tapahtuva virhe on mahdollista <i>mäpätä</i> alkuperäisen koodin vastaavaan kohtaan.

Source map saadaan generoitua lisäämällä konfiguraatioon kenttä <i>devtool</i> ja sen arvoksi 'source-map':

```js
const config = {
  entry: './src/index.js',
  output: {
    // ...
  },
  devServer: {
    // ...
  },
  devtool: 'source-map', // highlight-line
  // ..
};
```

Konfiguraatioiden muuttuessa webpack tulee käynnistää uudelleen. On tosin mahdollista konfiguroida webpack tarkkailemaan konfiguraatioiden muutoksia, mutta emme tee sitä.

Nyt virheilmoitus on hyvä

![](../../images/7/27.png)

sillä se viittaa itse kirjoittamaamme koodiin:

![](../../images/7/27eb.png)

Source mapin käyttö mahdollistaa myös Chromen debuggerin luontevan käytön:

![](../../images/7/28.png)

Korjataan bugi alustamalla tila <i>values</i> tyhjäksi taulukoksi:

```js
const App = () => {
  const [counter, setCounter] = useState(0)
  const [values, setValues] = useState([])
  // ...
}
```

### Koodin minifiointi

Kun sovellus viedään tuotantoon, on siis käytössä tiedostoon <i>main.js</i> webpackin generoima koodi. Vaikka sovelluksemme sisältää omaa koodia vain muutaman rivin, on tiedoston <i>main.js</i> koko 1009487 tavua, sillä se sisältää myös kaiken React-kirjaston koodin. Tiedoston koollahan on sikäli väliä, että selain joutuu lataamaan tiedoston kun sovellusta aletaan käyttämään. Nopeilla internetyhteyksillä 1009487 tavua ei sinänsä ole ongelma, mutta jos mukaan sisällytetään enemmän kirjastoja, alkaa sovelluksen lataaminen pikkuhiljaa hidastua etenkin mobiilikäytössä.

Tiedoston sisältöä tarkastelemalla huomaa, että tiedostoa voisi optimoida huomattavasti koon suhteen esim. poistamalla kommentit. Tiedostoa ei kuitenkaan kannata lähteä optimoimaan käsin, sillä tarkoitusta varten on olemassa monia työkaluja.

JavaScript-tiedostojen optimointiprosessista käytetään nimitystä <i>minifiointi</i>. Alan johtava työkalu tällä hetkellä lienee [UglifyJS](http://lisperator.net/uglifyjs/).

Webpackin versiosta 4 alkaen pluginia ei ole tarvinnut konfiguroida erikseen. Riittää, että muutetaan tiedoston <i>package.json</i> määrittelyä siten, että koodin bundlaus tapahtuu <i>production</i>-moodissa:

```json
{
  "name": "webpack-osa7",
  "version": "0.0.1",
  "description": "practising webpack",
  "scripts": {
    "build": "webpack --mode=production", // highlight-line
    "start": "webpack serve --mode=development"
  },
  "license": "MIT",
  "dependencies": {
    // ...
  },
  "devDependencies": {
    // ...
  }
}
```

Kun sovellus bundlataan uudelleen, pienenee tuloksena oleva <i>main.js</i> mukavasti:

```js
$ ls -l build/main.js
-rw-r--r--  1 mluukkai  ATKK\hyad-all  146237 Feb  7 15:58 build/main.js
```

Minifioinnin lopputulos on kuin vanhan liiton C-koodia. Kommentit ja jopa turhat välilyönnit ja rivinvaihdot on poistettu ja muuttujanimet ovat yksikirjaimisia:

```js
function h(){if(!d){var e=u(p);d=!0;for(var t=c.length;t;){for(s=c,c=[];++f<t;)s&&s[f].run();f=-1,t=c.length}s=null,d=!1,function(e){if(o===clearTimeout)return clearTimeout(e);if((o===l||!o)&&clearTimeout)return o=clearTimeout,clearTimeout(e);try{o(e)}catch(t){try{return o.call(null,e)}catch(t){return o.call(this,e)}}}(e)}}a.nextTick=function(e){var t=new Array(arguments.length-1);if(arguments.length>1)
```

### Sovelluskehitys- ja tuotantokonfiguraatio

Lisätään sovellukselle backend. Käytetään jo tutuksi käynyttä muistiinpanoja tarjoavaa palvelua.

Talletetaan seuraava sisältö tiedostoon <i>db.json</i>:

```json
{
  "notes": [
    {
      "important": true,
      "content": "HTML is easy",
      "id": "5a3b8481bb01f9cb00ccb4a9"
    },
    {
      "important": false,
      "content": "Mongo can save js objects",
      "id": "5a3b920a61e8c8d3f484bdd0"
    }
  ]
}
```

Tarkoituksena on konfiguroida sovellus webpackin avulla siten, että paikallisesti sovellusta kehitettäessä käytetään backendina portissa 3001 toimivaa JSON Serveriä.

Bundlattu tiedosto laitetaan sitten käyttämään todellista, osoitteessa <https://notes2023.fly.dev/api/notes> olevaa backendia.

Asennetaan <i>Axios</i>, käynnistetään JSON Server ja tehdään tarvittavat lisäykset sovellukseen. Vaihtelun vuoksi muistiinpanojen hakeminen palvelimelta on toteutettu [custom hookin](/osa7/custom_hookit) _useNotes_ avulla:

```js
import React, { useState, useEffect } from 'react'
import axios from 'axios'

// highlight-start
const useNotes = (url) => {
  const [notes, setNotes] = useState([])

  useEffect(() => {
    axios.get(url).then(response => {
      setNotes(response.data)
    })
  }, [url])

  return notes
}
// highlight-end

const App = () => {
  const [counter, setCounter] = useState(0)
  const [values, setValues] = useState([])
  const url = 'https://notes2023.fly.dev/api/notes'
  const notes = useNotes(url) // highlight-line

  const handleClick = () => {
    setCounter(counter + 1)
    setValues(values.concat(counter))
  }

  return (
    <div className="container">
      hello webpack {counter} clicks
      <button onClick={handleClick} >press</button>
      <div>{notes.length} notes on server {url}</div> // highlight-line
    </div>
  )
}

export default App
```

Koodissa on nyt kovakoodattuna sovelluskehityksessä käytettävän palvelimen osoite. Miten saamme osoitteen hallitusti muutettua osoittamaan Internetissä olevaan backendiin bundlatessamme koodin?

Webpackin konfiguraatiofunktiolla on kaksi parametria, <i>env</i> ja <i>argv</i>, joista jälkimmäisen avulla saamme selville npm-skriptissä määritellyn <i>moden</i>:

```js
const path = require('path')

const config = (env, argv) => { // highlight-line
  console.log('argv.mode:', argv.mode)
  return {
    // ...
  }
}

module.exports = config
```

Nyt voimme siis halutessamme säätää Webpackin toimimaan eri tavalla riippuen siitä onko sovelluksen käyttöympäristö eli "mode" arvoltaan production vai development.

Webpackin [DefinePlugin](https://webpack.js.org/plugins/define-plugin/):in avulla voimme määritellä globaaleja <i>vakioarvoja</i>, joita on mahdollista käyttää bundlattavassa koodissa. Määritellään nyt vakio <i>BACKEND\_URL</i>, joka saa eri arvon riippuen siitä ollaanko kehitysympäristössä vai tehdäänkö tuotantoon sopivaa bundlea:

```js
const path = require('path')
const webpack = require('webpack') // highlight-line

const config = (env, argv) => {
  console.log('argv.mode:', argv.mode)

  // highlight-start
  const backend_url = argv.mode === 'production'
    ? 'https://notes2023.fly.dev/api/notes'
    : 'http://localhost:3001/notes'
  // highlight-end

  return {
    entry: './src/index.js',
    output: {
      path: path.resolve(__dirname, 'build'),
      filename: 'main.js'
    },
    devServer: {
      static: path.resolve(__dirname, 'build'),
      compress: true,
      port: 3000,
    },
    devtool: 'source-map',
    module: {
      // ...
    },
    // highlight-start
    plugins: [
      new webpack.DefinePlugin({
        BACKEND_URL: JSON.stringify(backend_url)
      })
    ]
    // highlight-end
  }
}

module.exports = config
```

Määriteltyä vakiota käytetään koodissa seuraavasti:

```js
const App = () => {
  const [counter, setCounter] = useState(0)
  const [values, setValues] = useState([])
  const notes = useNotes(BACKEND_URL) // highlight-line

  // ...
  return (
    <div className="container">
      hello webpack {counter} clicks
      <button onClick={handleClick} >press</button>
      <div>{notes.length} notes on server {BACKEND_URL}</div> // highlight-line
    </div>
  )
}
```

Nyt siis jos sovellus on käynnistetty komennolla _npm start_ development-moodissa, hakee se muistiinpanot osoitteesta http://localhost:3001/notes. Komennolla _npm run build_ bundlattu versio taas käyttää osoitetta https://notes2023.fly.dev/api/notes muistiinpanojen hakemiseen.

Jos kehitys- ja tuotantokonfiguraatio eriytyvät paljon, saattaa olla hyvä idea [eriyttää konfiguraatiot](https://webpack.js.org/guides/production/) omiin tiedostoihinsa.

Tuotantoversiota eli bundlattua sovellusta on mahdollista kokeilla lokaalisti suorittamalla komento

```js
npx static-server
```

hakemistossa <i>build</i>, jolloin sovellus käynnistyy oletusarvoisesti osoitteeseen <http://localhost:9080>.

### Polyfill

Sovelluksemme on valmis ja toimii muiden selaimien kohtuullisen uusilla versiolla, mutta Internet Explorerilla sovellus ei toimi. Syynä tähän on se, että _Axiosin_ ansiosta koodissa käytetään [Promiseja](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise), mutta mikään IE:n versio ei kuitenkaan niitä tue:

![](../../images/7/29.png)

On paljon muitakin standardissa määriteltyjä asioita, joita IE ei tue. Esim. niinkin harmiton komento kuin taulukoiden [find](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find) ylittää IE:n kyvyt:

![](../../images/7/30.png)

Tälläisessä tilanteessa normaali koodin transpilointi ei auta, sillä transpiloinnissa koodia käännetään uudemmasta JavaScript-syntaksista vanhempaan, selaimien paremmin tukemaan syntaksiin. Promiset ovat syntaktisesti täysin IE:n ymmärrettävissä, IE:ltä vain puuttuu toteutus Promisesta. Samoin on tilanne taulukoiden suhteen, IE:llä taulukoiden _find_ on arvoltaan <i>undefined</i>.

Jos haluamme sovelluksen IE-yhteensopivaksi, tarvitsemme [polyfilliä](https://remysharp.com/2010/10/08/what-is-a-polyfill) eli koodia, joka lisää puuttuvan toiminnallisuuden vanhempiin selaimiin.

Polyfillaus on mahdollista hoitaa [Webpackin ja Babelin avulla](https://babeljs.io/docs/usage/polyfill/) tai asentamalla yksi monista tarjolla olevista polyfill-kirjastoista.

Esim. kirjaston [Promise Polyfill](https://www.npmjs.com/package/promise-polyfill) tarjoaman polyfillin käyttö on todella helppoa lisäämällä koodiin seuraava:

```js
import PromisePolyfill from 'promise-polyfill'

if (!window.Promise) {
  window.Promise = PromisePolyfill
}
```

Jos globaalia _Promise_-olioa ei ole olemassa eli selain ei tue Promiseja, sijoitetaan polyfillattu Promise globaaliin muuttujaan. Jos polyfillattu Promise on hyvin toteutettu, muun koodin pitäisi toimia ilman ongelmia.

Kattavahko lista olemassaolevista polyfilleistä löytyy [täältä](https://github.com/Modernizr/Modernizr/wiki/HTML5-Cross-browser-Polyfills).

Selaimien yhteensopivuus käytettävien API:en suhteen kannattaakin tarkistaa esim. [https://caniuse.com](https://caniuse.com)-sivustolta tai [Mozillan sivuilta](https://developer.mozilla.org/en-US/).

</div>
