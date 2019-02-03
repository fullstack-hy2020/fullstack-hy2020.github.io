---
mainImage: ../../images/part-7.svg
part: 7
letter: c
---

<div class="content">
## Webpack

React on ollut jossain määrin kuuluisa siitä, että sovelluskehityksen edellyttämien työkalujen konfigurointi on ollut hyvin hankalaa. Kiitos [create-react-app](https://github.com/facebookincubator/create-react-app):in, sovelluskehitys Reactilla on kuitenkin nykyään tuskatonta, parempaa työskentelyflowta on tuskin ollut koskaan Javascriptillä tehtävässä selainpuolen sovelluskehityksessä.

Emme voi kuitenkaan turvautua ikuisesti create-react-app:in magiaan ja nyt onkin aika selvittää mitä kaikkea taustalla on. Avainasemassa React-sovelluksen toimintakuntoon saattamisessa on [webpack](https://webpack.js.org/)-niminen työkalu.

### bundlaus

Olemme toteuttaneet sovelluksia jakamalla koodin moduuleihin, joita on _importattu_ niitä tarvitseviin paikkoihin. Vaikka ES6-moduulit ovatkin Javascript-standardissa määriteltyjä, ei mikään selain vielä osaa käsitellä moduuleihin jaettua koodia.

Selainta varten moduuleissa oleva koodi _bundlataan_, eli siitä muodostetaan yksittäinen, kaiken koodin sisältävä tiedosto. Kun veimme Reactilla toteutetun frontendin tuotantoon osan 3 luvussa [Frontendin tuotantoversio](/osa3#frontendin-tuotantoversio), suoritimme bundlauksen komennolla _npm run build_. Konepellin alla kyseinen npm-skripti suorittaa bundlauksen webpackia hyväksi käyttäen. Tuloksena on joukko hakemistoon _build_ sijoitettavia tiedostoja:

<pre>
├── asset-manifest.json
├── favicon.ico
├── index.html
├── manifest.json
├── service-worker.js
└── static
    ├── css
    │   ├── main.1b1453df.css
    │   └── main.1b1453df.css.map
    └── js
        ├── main.54f11b10.js
        └── main.54f11b10.js.map
</pre>

Hakemiston juuressa oleva sovelluksen "päätiedosto" _index.html_ lataa _script_-tagin avulla bundlatun Javascript-tiedoston:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>React App</title>
    <link href="/static/css/main.1b1453df.css" rel="stylesheet" />
  </head>
  <body>
    <div id="root"></div>
    <script type="text/javascript" src="/static/js/main.54f11b10.js"></script>
  </body>
</html>
```

Kuten esimerkistä näemme, create-react-app:illa tehdyssä sovelluksessa bundlataan Javascriptin lisäksi sovelluksen CSS-määrittelyt tiedostoon _static/css/main.1b1453df.css_

Käytännössä bundlaus tapahtuu siten, että sovelluksen Javascriptille määritellään alkupiste, usein tiedosto _index.js_, ja bundlauksen yhteydessä webpack ottaa mukaan kaiken koodin mitä alkupiste importtaa, sekä importattujen koodien importtaamat koodit, jne.

Koska osa importeista on kirjastoja, kuten React, Redux ja Axios, bundlattuun javascript-tiedostoon tulee myös kaikkien näiden sisältö.

> Vanha tapa jakaa sovelluksen koodi moneen tiedostoon perustui siihen, että _index.html_ latasi kaikki sovelluksen tarvitsemat erilliset Javascript-tiedostot script-tagien avulla. Tämä on kuitenkin tehotonta, sillä jokaisen tiedoston lataaminen aiheuttaa pienen overheadin ja nykyään pääosin suositaankin koodin bundlaamista yksittäiseksi tiedostoksi.

Tehdään nyt React-projektille sopiva webpack-konfiguraatio kokonaan käsin.

Luodaan projektia varten hakemisto ja sen sisälle seuraavat hakemistot (dist ja src) sekä tiedostot:

<pre>
├── dist
├── package.json
├── src
│   └── index.js
└── webpack.config.js
</pre>

Tiedoston _package.json_ sisältö voi olla esim. seuraava:

```json
{
  "name": "webpack-osa7",
  "version": "0.0.1",
  "description": "practising webpack",
  "scripts": {},
  "license": "MIT"
}
```

Asennetaan webpack komennolla

```bash
npm install --save-dev webpack webpack-cli
```

Webpackin toiminta konfiguroidaan tiedostoon _webpack.config.js_, laitetaan sen alustavaksi sisällöksi seuraava

```bash
const path = require('path')

const config = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.js'
  }
}
module.exports = config
```

Määritellään sitten npm-skripti _build_ jonka avulla bundlaus suoritetaan

```bash
// ...
"scripts": {
  "build": "webpack --mode=development"
},
// ...
```

Lisätään hieman koodia tiedostoon _src/index.js_:

```js
const hello = name => {
  console.log(`hello ${name}`);
};
```

Kun nyt suoritamme komennon _npm run build_ webpack bundlaa koodin. Tuloksena on hakemistoon _dist_ sijoitettava tiedosto _main.js_:

![](../images/7/1.png)

Tiedostossa on paljon erikoisen näköistä tavaraa. Lopussa on mukana myös kirjoittamamme koodi.

Lisätään hakemistoon _src_ tiedosto _App.js_ ja sille sisältö

```js
const App = () => {
  return null;
};

export default App;
```

Importataan ja käytetään modulia _App_ tiedostossa _index.js_

```js
import App from './App';

const hello = name => {
  console.log(`hello ${name}`);
};

App();
```

Kun nyt suoritamme bundlauksen komennolla _npm run build_ huomaamme webpackin havainneen molemmat tiedostot:

![](../images/7/2.png)

Kirjoittamamme koodi löytyy melko kryptisesti muotoiltuna bundlen lopussa:

```js
/***/ "./src/App.js":
/*!********************!*\
  !*** ./src/App.js ***!
  \********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\nconst App = () => {\n  return null;\n};\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (App);\n\n//# sourceURL=webpack:///./src/App.js?");

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _App__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./App */ \"./src/App.js\");\n\n\nconst hello = name => {\n  console.log(`hello ${name}`);\n};\n\nObject(_App__WEBPACK_IMPORTED_MODULE_0__[\"default\"])();\n\n//# sourceURL=webpack:///./src/index.js?");
```

### Konfiguraatiotiedosto

Katsotaan nyt tarkemmin konfiguraation _webpack.config.js_ tämänhetkistä sisältöä:

```js
const path = require('path');

const config = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.js',
  },
};
module.exports = config;
```

Konfiguraatio on Javascriptia ja tapahtuu eksporttaamalla määrittelyt sisältävä olio Noden moduulisyntaksilla.

Tämän hetkinen minimaalinen määrittely on aika ilmeinen, kenttä [entry](https://webpack.js.org/concepts/#entry) kertoo sen tiedoston, mistä bundlaus aloitetaan.

Kenttä [output](https://webpack.js.org/concepts/#output) taas kertoo minne muodostettu bundle sijoitetaan. Kohdehakemisto täytyy määritellä _absoluuttisena polkuna_, se taas onnistuu helposti [path.resolve](https://nodejs.org/docs/latest-v8.x/api/path.html#path_path_resolve_paths)-metodilla. [\_\_dirname](https://nodejs.org/docs/latest/api/globals.html#globals_dirname) on Noden globaali muuttuja, joka viittaa nykyiseen hakemistoon.

### Webpack 4

Helmikuun viimeisten päivien aikana julkaistu Webpackin versio 4 on vähentänyt välttämättömän konfiguroinnin määrää määrittelemällä Webpackille joukon oletusarvoisia konfiguraatioita.

Konfiguraatiossamme _entryllä_ ja _outputilla_ on niiden oletusarvo, eli voisimme myös jättää ne määrittelemättä, ja tiedoston _webpack.config.js_ sisällöksi kävisi:

```js
const config = {};
module.exports = config;
```

Jätämme kuitenkin _entryn_ ja _outputin_ määrittelyt tiedostoon.

### Reactin bundlaaminen

Muutetaan sitten sovellus minimalistiseksi React-sovellukseksi. Asennetaan tarvittavat kirjastot

```bash
npm install --save react react-dom
```

Liitetään tavanomaiset loitsut tiedostoon _index.js_

```js
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

ReactDOM.render(<App />, document.getElementById('root'));
```

ja muutetaan _App.js_ muotoon

```react
import React from 'react'

const App = () => (
  <div>hello webpack</div>
)

export default App
```

Tarvitsemme sovellukselle myös "pääsivuna" toimivan tiedoston _dist/index.html_ joka lataa _script_-tagin avulla bundlatun Javascriptin:

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

Kun bundlaamme sovelluksen, törmäämme kuitenkin ongelmaan

![](../images/7/3.png)

### Loaderit

Webpack mainitsee että saatamme tarvita _loaderin_ tiedoston _App.js_ käsittelyyn. Webpack ymmärtää itse vain Javascriptia ja vaikka se saattaa meiltä matkan varrella olla unohtunutkin, käytämme Reactia ohjelmoidessamme [JSX](https://facebook.github.io/jsx/):ää näkymien renderöintiin, eli esim. seuraava

```react
const App = () => (
  <div>hello webpack</div>
)
```

ei ole "normaalia" Javascriptia, vaan JSX:n tarjoama syntaktinen oikotie määritellä _div_-tagiä vastaava React-elementti.

[Loaderien](https://webpack.js.org/concepts/loaders/) avulla on mahdollista kertoa webpackille miten tiedostot tulee käsitellä ennen niiden bundlausta.

Määritellään projektiimme Reactin käyttämän JSX:n normaaliksi Javascriptiksi muuntava loaderi:

```js
const config = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        query: {
          presets: ['react'],
        },
      },
    ],
  },
};
```

Loaderit määritellään kentän _module_ alle sijoitettavaan taulukkoon _rules_.

Yksittäisen loaderin määrittely on kolmiosainen:

```js
{
  test: /\.js$/,
  loader: 'babel-loader',
  query: {
    presets: ['react']
  }
}
```

Kenttä _test_ määrittelee että käsitellään _.js_-päätteisiä tiedostoja, _loader_ kertoo että käsittely tapahtuu [babel-loader](https://github.com/babel/babel-loader):illa. Kenttä _query_ taas antaa loaderille sen toimintaa ohjaavia parametreja.

Asennetaan loader ja sen tarvitsemat kirjastot _kehitysaikaiseksi riippuvuudeksi_:

```bash
npm install --save-dev babel-core babel-loader babel-preset-react
```

Nyt bundlaus onnistuu.

Jos katsomme bundlattua koodia, huomaamme, että komponentti _App_ on muuttunut muotoon

```js
const App = () =>
  react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
    'div',
    null,
    'hello webpack'
  );
```

Eli JSX-syntaksin sijaan komponentit luodaan pelkällä Javascriptilla käyttäen Reactin funktiota [createElement](https://reactjs.org/docs/react-without-jsx.html).

Sovellusta voi nyt kokeilla avaamalla tiedoston dist/index.html* selaimen \_open file* -toiminnolla:

![](../assets/7/4.png)

Tässä on jo melkein kaikki mitä tarvitsemme React-sovelluskehitykseen.

### Transpilaus

Prosessista, joka muuttaa Javascriptia muodosta toiseen käytetään englanninkielistä termiä [transpiling](https://en.wiktionary.org/wiki/transpile), joka taas on termi, joka viittaa koodin kääntämiseen (compile) sitä muuntamalla (transform). Suomenkielisen termin puuttuessa käytämme prosessista tällä kurssilla nimitystä _transpilaus_.

Edellisen luvun konfiguraation avulla siis _transpiloimme_ JSX:ää sisältävän Javascriptin normaaliksi Javascriptiksi tämän hetken johtavan työkalun [babelin](https://babeljs.io/) avulla.

Kuten osassa 1 jo mainittiin, läheskään kaikki selaimet eivät vielä osaa Javascriptin uusimpien versioiden ES6:n ja ES7:n ominaisuuksia ja tämän takia koodi yleensä transpiloidaan käyttämään vanhempaa Javascript-syntaksia ES5:ttä.

Babelin suorittama transpilointiprosessi määritellään _pluginien_ avulla. Käytännössä useimmiten käytetään valmiita [presetejä](https://babeljs.io/docs/plugins/), eli useamman sopivan pluginin joukkoja.

Tällä hetkellä sovelluksemme transpiloinnissa käytetään presetiä [react](https://babeljs.io/docs/plugins/preset-react/):

```js
{
  test: /\.js$/,
  loader: 'babel-loader',
  query: {
    presets: ['react']
  }
}
```

Otetaan käyttöön preset [env](https://babeljs.io/docs/plugins/preset-env/), joka sisältää kaiken hyödyllisen, minkä avulla uusimman standardin mukainen koodi saadaan transpiloitua ES5-standardin mukaiseksi koodiksi:

```js
{
  test: /\.js$/,
  loader: 'babel-loader',
  query: {
    presets: ['env', 'react']
  }
}
```

Preset asennetaan komennolla

```js
npm install babel-preset-env --save-dev
```

Kun nyt transpiloimme koodin, muuttuu se vanhan koulukunnan Javascriptiksi. Komponentin _App_ määrittely näyttää seuraavalta:

```js
var App = function App() {
  return _react2.default.createElement('div', null, 'hello webpack');
};
```

Muuttujan määrittely tapahtuu avainsanan _var_ avulla, sillä ES5 ei tunne avainsanaa _const_. Myöskään nuolifunktiot eivät ole käytössä, joten funktiomäärittely käyttää avainsanaa _function_.

### CSS

Lisätään sovellukseemme hieman CSS:ää. Tehdään tiedosto _src/index.css_

```css
.container {
  margin: 10;
  background-color: #dee8e4;
}
```

Määritellään tyyli käytettäväksi komponentissa _App_

```react
const App = () => (
  <div className="container">
    hello webpack
  </div>
)
```

ja importataan se tiedostossa _index.js_

```js
import './index.css';
```

Transpilointi hajoaa, ja CSS:ää varten onkin otettava käyttöön [css](https://webpack.js.org/loaders/css-loader/)- ja [style](https://webpack.js.org/loaders/style-loader/)-loaderit:

```js
{
  rules: [
    {
      test: /\.js$/,
      loader: 'babel-loader',
      query: {
        presets: ['env', 'react'],
      },
    },
    {
      test: /\.css$/,
      loaders: ['style-loader', 'css-loader'],
    },
  ];
}
```

[css-loaderin](https://webpack.js.org/loaders/css-loader/) tehtävänä on ladata _CSS_-tiedostot, ja [style-loader](https://webpack.js.org/loaders/style-loader/) generoi koodiin CSS:t sisältävän _style_-elementin.

Näin konfiguroituna CSS-määrittelyt sisällytetään sovelluksen Javascriptin sisältävään tiedostoon _main.js_. Sovelluksen päätiedostossa _index.html_ ei siis ole tarvetta erikseen ladata CSS:ää.

CSS voidaan tarpeen vaatiessa myös generoida omaan tiedostoonsa esim. [mini-css-extract-pluginin](https://github.com/webpack-contrib/mini-css-extract-plugin) avulla.

Kun loaderit asennetaan

```bash
npm install style-loader css-loader --save-dev
```

bundlaus toimii taas ja sovellus saa uudet tyylit.

### Webpack-dev-server

Sovelluskehitys onnistuu jo, mutta development workflow on suorastaan hirveä (alkaa jo muistuttaa Javalla tapahtuvaa sovelluskehitystä...), muutosten jälkeen koodin on bundlattava ja selain uudelleenladattava jos haluamme testata koodia.

Ratkaisun tarjoaa [webpack-dev-server](https://webpack.js.org/guides/development/#using-webpack-dev-server). Asennetaan se komennolla

```bash
npm install --save-dev webpack-dev-server
```

Määritellään dev-serverin käynnistävä npm-skripti:

```bash
{
  // ...
  "scripts": {
    "build": "webpack --mode=development",
    "start": "webpack-dev-server --mode=development"
  },
  // ...
}
```

Lisätään tiedostoon _webpack.config.js_ kenttä _devServer_

```js
const config = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.js',
  },
  devServer: {
    contentBase: path.resolve(__dirname, 'dist'),
    compress: true,
    port: 3000,
  },
  // ...
};
```

Komento _npm start_ käynnistää nyt dev-serverin porttiin, eli sovelluskehitys tapahtuu avaamalla tuttuun tapaan selain osoitteeseen <http://localhost:3000>. Kun teemme koodiin muutoksia, reloadaa selain automaattisesti itsensä.

Päivitysprosessi on nopea, dev-serveriä käytettäessä webpack ei bundlaa koodia normaaliin tapaan tiedostoksi _main.js_, bundlauksen tuotos on olemassa ainoastaan keskusmuistissa.

Laajennetaan koodia muuttamalla komponentin _App_ määrittelyä seuraavasti:

```react
class App extends React.Component {
  constructor() {
    super()
    this.state = {
      counter: 0
    }
  }

  render() {
    return (
      <div className="container">
        <p>hello webpack {this.state.counter} clicks</p>
        <button onClick={()=>this.setState({counter: this.state.counter+1})}>click</button>
      </div>
    )
  }
}
```

Kannattaa huomata, että virheviestit eivät renderöidy selaimeen kuten create-react-app:illa tehdyissä sovelluksissa, eli on seurattava tarkasti konsolia:

![](../images/7/5.png)

Sovellus toimii hyvin ja kehitys on melko sujuvaa.

### Sourcemappaus

Erotetaan napin klikkauksenkäsittelijä omaksi funktioksi:

```react
class App extends React.Component {
  constructor() {
    super()
    this.state = {
      counter: 0
    }
  }

  onClick() {
    this.setState({ counter: this.state.counter + 1 })
  }

  render() {
    return (
      <div className="container">
        <p>hello webpack {this.state.counter} clicks</p>
        <button onClick={this.onClick}>click</button>
      </div>
    )
  }
}
```

Sovellus ei enää toimi, ja konsoli kertoo virheestä

![](../images/7/6.png)

Tiedämme tietenkin nyt että virhe on metodissa onClick, mutta jos olisi kyse suuremmasta sovelluksesta, on virheilmoitus sikäli hyvin ikävä, että sen ilmoittama paikka:

<pre>
App.js:38 Uncaught TypeError: Cannot read property 'setState' of undefined
    at onClick (App.js:38)
</pre>

ei vastaa alkuperäisen koodin virheen sijaintia. Jos klikkaamme virheilmoitusta, huomaamme, että näytettävä koodi on jotain ihan muuta kuin kirjoittamamme koodi:

![](../images/7/6a.png)

Haluamme tietenkin, että virheilmoitusten yhteydessä näytetään kirjoittamamme koodi.

Korjaus on onneksi hyvin helppo, pyydetään webpackia generoimaan bundlelle ns. [source map](https://webpack.js.org/configuration/devtool/), jonka avulla bundlea suoritettaessa tapahtuva virhe on mahdollista _mäpätä_ alkuperäisen koodin vastaavaan kohtaan.

Source map saadaan generoitua lisäämällä konfiguraatioon kenttä _devtool_ ja sen arvoksi 'source-map':

```js
const config = {
  entry: './src/index.js',
  output: {
    // ...
  },
  devServer: {
    // ...
  },
  devtool: 'source-map',
  // ..
};
```

Konfiguraatioiden muuttuessa webpack tulee käynnistää uudelleen, on tosin mahdollista konfiguroida webpack tarkkailemaan konfiguraatioiden muutoksia, mutta emme tee sitä.

Nyt virheilmoitus on hyvä

![](../assets/7/7.png)

Source mapin käyttö mahdollistaa myös chromen debuggerin luontevan käytön

![](../assets/7/8.png)

Kyseinen virhe on siis jo [osasta 1](/osa1#metodien-käyttö-ja-this) tuttu this:in kadottaminen. Korjataan ongelma määrittelemällä metodi uudelleen meille jo kovin tutulla syntaksilla:

```js
onClick = () => {
  this.setState({ counter: this.state.counter + 1 });
};
```

Tästä aiheutuu kuitenkin virheilmoitus

![](../assets/7/9.png)

Virhe johtuu siitä, että käyttämämme syntaksi ei ole vielä mukana Javascriptin uusimmassa standardissa ES7. Saamme syntaksin käyttöön asentamalla [transform-class-properties](https://babeljs.io/docs/plugins/transform-class-properties/)-pluginin komennolla

```bash
npm install babel-plugin-transform-class-properties --save-dev
```

ja kehottamalla _babel-loader_:ia käyttämään pluginia:

```js
{
  test: /\.js$/,
  loader: 'babel-loader',
  query: {
    presets: ['env', 'react'],
    plugins: [require('babel-plugin-transform-class-properties')]
  }
}
```

### Koodin minifiointi

Kun sovellus viedään tuotantoon, on siis käytössä tiedostoon _main.js_ webpackin generoima koodi. Vaikka sovelluksemme sisältää omaa koodia vain muutaman rivin, on tiedoston _main.js_ koko 557450 tavua, sillä se sisältää myös kaiken React-kirjaston koodin. Tiedoston koollahan on sikäli väliä, että selain joutuu lataamaan tiedoston kun sovellusta aletaan käyttämään. Nopeilla internetyhteyksillä 557450 tavua ei sinänsä ole ongelma, mutta jos mukaan sisällytetään enemmän kirjastoja, alkaa sovelluksen lataaminen pikkuhiljaa hidastua etenkin mobiilikäytössä.

Jos tiedoston sisältöä tarkastelee, huomaa että sitä voisi optimoida huomattavasti koon suhteen esim. poistamalla kommentit. Tiedostoa ei kuitenkaan kannata lähteä optimoimaan käsin, sillä tarkoitusta varten on olemassa monia työkaluja.

Javascript-tiedostojen optimointiprosessista käytetään nimitystä _minifiointi_. Alan johtava työkalu tällä hetkellä lienee [UglifyJS](http://lisperator.net/uglifyjs/).

Webpackin versiosta 4 alkaen pluginia ei ole tarvinnut konfiguroida erikseen, riittää että muutetaan tiedoston _package.json_ määrittelyä siten, että koodin bundlaus tapahtuu _production_-moodissa:

```json
{
  "name": "webpack-osa7",
  "version": "0.0.1",
  "description": "practising webpack",
  "scripts": {
    "build": "webpack --mode=production",
    "start": "webpack-dev-server --mode=development"
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

Kun sovellus bundlataan uudelleen, pienenee tuloksena oleva _main.js_ mukavasti

```bash
-rw-r--r--  1 mluukkai  984178727  101944 Mar  3 21:29 main.js
```

Minifioinnin lopputulos on kuin vanhan liiton c-koodia, kommentit ja jopa turhat välilyönnit ja rivinvaihdot on poistettu ja muuttujanimet ovat yksikirjaimisia:

```js
function h(){if(!d){var e=u(p);d=!0;for(var t=c.length;t;){for(s=c,c=[];++f<t;)s&&s[f].run();f=-1,t=c.length}s=null,d=!1,function(e){if(o===clearTimeout)return clearTimeout(e);if((o===l||!o)&&clearTimeout)return o=clearTimeout,clearTimeout(e);try{o(e)}catch(t){try{return o.call(null,e)}catch(t){return o.call(this,e)}}}(e)}}a.nextTick=function(e){var t=new Array(arguments.length-1);if(arguments.length>1)
```

### Sovelluskehitys- ja tuotantokonfiguraatio

Lisätään sovellukselle backend. Käytetään jo tutuksi käynyttä muistiinpanoja tarjoavaa palvelua.

Talletetaan seuraava sisältö tiedostoon _db.json_

```json
{
  "notes": [
    {
      "important": true,
      "content": "HTML on helppoa",
      "id": "5a3b8481bb01f9cb00ccb4a9"
    },
    {
      "important": false,
      "content": "Mongo osaa tallettaa oliot",
      "id": "5a3b920a61e8c8d3f484bdd0"
    }
  ]
}
```

Tarkoituksena on konfiguroida sovellus webpackin avulla siten, että paikallisesti sovellusta kehitettäessä käytetään backendina portissa 3001 toimivaa json-serveriä.

Bundlattu tiedosto laitetaan sitten käyttämään todellista, osoitteessa <https://radiant-plateau-25399.herokuapp.com/api/notes> olevaa backendia.

Asennetaan _axios_, käynnistetään json-server ja muokataan komponenttia _App_ seuraavasti:

```react
class App extends React.Component {
  constructor() {
    super()
    this.state = {
      counter: 0,
      noteCount: 0
    }
  }

  componentDidMount() {
    axios.get('http://localhost:3001/notes').then(result => {
      this.setState({ noteCount: result.data.length })
    })
  }

  onClick = () => {
    this.setState({ counter: this.state.counter + 1 })
  }

  render() {
    return (
      <div className="container">
        <p>hello webpack {this.state.counter} clicks</p>
        <button onClick={this.onClick}>click</button>
        <p>{this.state.noteCount} notes in server</p>
      </div>
    )
  }
}
```

Koodissa on nyt kovakoodattuna sovelluskehityksessä käytettävän palvelimen osoite. Miten saamme osoitteen hallitusti muutettua osoittamaan internetissä olevaan backendiin bundlatessamme koodin?

Muutetaan _webpack.config.js_ oliosta [funktioksi](https://webpack.js.org/configuration/configuration-types/#exporting-a-function):

```js
const path = require('path');

const config = (env, argv) => {
  return {
    entry: './src/index.js',
    output: {
      // ...
    },
    devServer: {
      // ...
    },
    devtool: 'source-map',
    module: {
      // ...
    },
    plugins: [
      // ...
    ],
  };
};

module.exports = config;
```

Määrittely on muuten täysin sama, mutta aiemmin eksportattu olio on nyt määritellyn funktion paluuarvo. Funktio saa parametrit _env_ ja _argv_, joista jälkimmäisen avulla saamme selville npm-skriptissä määritellyn _moden_.

Webpackin [DefinePlugin](https://webpack.js.org/plugins/define-plugin/):in avulla voimme määritellä globaaleja _vakioarvoja_, joita on mahdollista käyttää bundlattavassa koodissa. Määritellään nyt vakio _BACKEND_URL_, joka saa eri arvon riippuen siitä ollaanko kehitysympäristössä vai tehdäänkö tuotantoon sopivaa bundlea:

```bash
const path = require('path')
const webpack = require('webpack')

const config = (env, argv) => {
  console.log('argv', argv.mode)

  const backend_url = argv.mode === 'production'
    ? 'https://radiant-plateau-25399.herokuapp.com/api/notes'
    : 'http://localhost:3001/notes'

  return {
    entry: './src/index.js',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'main.js'
    },
    devServer: {
      contentBase: path.resolve(__dirname, "dist"),
      compress: true,
      port: 3000
    },
    devtool: 'source-map',
    module: {
      // ...
    },
    plugins: [
      new webpack.DefinePlugin({
        BACKEND_URL: JSON.stringify(backend_url)
      })
    ]
  }

}

module.exports = config
```

Määriteltyä vakiota käytetään koodissa seuraavasti:

```js
componentDidMount() {
  axios.get(BACKEND_URL)
    .then(result => {
      this.setState({noteCount: result.data.length})
    })
}
```

Jos kehitys- ja tuotantokonfiguraatio eriytyvät paljon, saattaa olla hyvä idea [eriyttää konfiguraatiot](https://webpack.js.org/guides/production/) omiin tiedostoihinsa.

Tuotantoversiota eli bundlattua sovellusta on mahdollista kokeilla lokaalisti suorittamalla komento

```bash
npx static-server
```

hakemistossa _dist_ jolloin sovellus käynnistyy oletusarvoisesti osoitteeseen <http://localhost:9080>.

### Polyfill

Sovelluksemme on valmis ja toimii muiden selaimien kohtuullisen uusilla versiolla, mutta Internet Explorerilla sovellus ei toimi. Syynä tähän on se, että _axiosin_ ansiosta koodissa käytetään [Promiseja](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise), mikään IE:n versio ei kuitenkaan niitä tue:

![](../assets/7/13.png)

On paljon muutakin standardissa määriteltyjä asioita, joita IE ei tue, esim. niinkin harmiton komento kuin taulukoiden [find](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find) ylittää IE:n kyvyt:

![](../assets/7/14.png)

Tälläisessä tilanteessa normaali koodin transpilointi ei auta, sillä transpiloinnissa koodia käännetään uudemmasta Javascript-syntaksista vanhempaan, selaimien paremmin tukemaan syntaksiin. Promiset ovat syntaktisesti täysin IE:n ymmärrettävissä, IE:ltä vain puuttuu toteutus promisesta, samoin on tilanne taulukoiden suhteen, IE:llä taulukoiden _find_ on arvoltaan _undefined_.

Jos haluamme sovelluksen IE-yhteensopivaksi, tarvitsemme [polyfilliä](https://remysharp.com/2010/10/08/what-is-a-polyfill), eli koodia, joka lisää puuttuvan toiminnallisuuden vanhempiin selaimiin.

Polyfillaus on mahdollista hoitaa [Webpackin ja Babelin avulla](https://babeljs.io/docs/usage/polyfill/) tai asentamalla yksi monista tarjolla olevista polyfill-kirjastoista.

Esim. kirjaston [promise-polyfill](https://www.npmjs.com/package/promise-polyfill) tarjoaman polyfillin käyttö on todella helppoa, koodiin lisätään seuraava:

```js
import PromisePolyfill from 'promise-polyfill';

if (!window.Promise) {
  window.Promise = PromisePolyfill;
}
```

Jos globaalia _Promise_-olioa ei ole olemassa, eli selain ei tue promiseja, sijoitetaan polyfillattu promise globaaliin muuttujaan. Jos polyfillattu promise on hyvin toteutettu, muun koodin pitäisi toimia ilman ongelmia.

Kattavahko lista olemassaolevista polyfilleistä löytyy [täältä](https://github.com/Modernizr/Modernizr/wiki/HTML5-Cross-browser-Polyfills).

Selaimien yhteensopivuus käytettävien API:en suhteen kannattaakin tarkistaa esim. [https://caniuse.com](https://caniuse.com)-sivustolta tai [Mozillan sivuilta](https://developer.mozilla.org/en-US/).

### Eject

Create-react-app käyttää taustalla webpackia. Jos peruskonfiguraatio ei riitä, on projektit mahdollista [ejektoida](https://github.com/facebook/create-react-app/blob/master/packages/react-scripts/template/README.md#npm-run-eject), jolloin kaikki konepellin alla oleva magia häviää, ja konfiguraatiot tallettuvat hakemistoon _config_ ja muokattuun _package.json_-tiedostoon.

Jos create-react-app:illa tehdyn sovelluksen ejektoi, paluuta ei ole, sen jälkeen kaikesta konfiguroinnista on huolehdittava itse. Konfiguraatiot eivät ole triviaaleimmasta päästä ja create-react-appin ja ejektoinnin sijaan parempi vaihtoehto saattaa joskus olla tehdä itse koko webpack-konfiguraatio.

Ejektoidun sovelluksen konfiguraatioiden lukeminen on suositeltavaa ja sangen opettavaista!
</div>


