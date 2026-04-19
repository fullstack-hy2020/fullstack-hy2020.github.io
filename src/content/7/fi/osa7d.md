---
mainImage: ../../../images/part-7.svg
part: 7
letter: d
lang: fi
---

<div class="content">

React oli alkuaikoina tunnettu siitä, että sovelluskehityksen työkalujen konfigurointi oli hyvin hankalaa. Tilanteen helpottamiseksi kehitettiin [Create React App](https://github.com/facebookincubator/create-react-app), joka poisti konfigurointiin liittyvät ongelmat. Tällä kurssilla käytettävä [Vite](https://vitejs.dev/) on sittemmin syrjäyttänyt Create React Appin uusien React-sovellusten konfiguroinnin standardina.

Sekä Vite että Create React App käyttävät <i>bundlereita</i> varsinaiseen työhön. Tässä osiossa tarkastelemme lähemmin, mitä bundlerit oikeastaan tekevät, miten Vite toimii konepellin alla ja miten sitä voidaan konfiguroida eri tilanteisiin. Tutustumme lyhyesti myös [esbuildiin](https://esbuild.github.io/), matalan tason bundleriin, jota Vite itse käyttää sisäisest.

> #### Entä Webpack?
>
> [Webpack](https://webpack.js.org/) oli hallitseva bundleri suurimman osan 2010-luvusta ja se on edelleen vanhemmissa projekteissa. Myös tämä kurssi käsitteli Webpackia kevääseen 2026 asti.
>
> Uuden projektin käynnistämistä Webpackilla vuonna 2026 ei kuitenkaan suositella. Sen konfigurointi on monimutkaista, ja modernit työkalut kuten Vite tarjoavat huomattavasti paremman kehittäjäkokemuksen. Webpack-konfiguraatiota ei käsitellä tällä kurssilla.

### Bundlaus

Olemme toteuttaneet sovelluksia jakamalla koodin moduuleihin, joita on importattu niitä tarvitseviin paikkoihin. Vaikka ES6-moduulit ovatkin JavaScript-standardissa määriteltyjä, eivät vanhemmat selaimet vielä osaa käsitellä moduuleihin jaettua koodia.

Tästä syystä moduuleihin jaettu koodi <i>bundlataan</i> tuotantoa varten, eli lähdekooditiedostot muunnetaan ja yhdistetään optimoiduksi yksittäiseksi, kaiken koodin sisältäväksi tiedostoksi.

Kun aiemmissa osissa suoritimme komennon <i>npm run build</i>, Vite suoritti tämän bundlauksen. Tulos löytyy <i>dist</i>-hakemistosta:

```
├── assets
│   ├── index-d526a0c5.css
│   ├── index-e92ae01e.js
│   └── react-35ef61ed.svg
├── index.html
└── vite.svg
```

Juuressa oleva <i>index.html</i> lataa bundlatun JavaScriptin <i>script</i>-tagilla:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vite + React</title>
    <script type="module" crossorigin src="/assets/index-e92ae01e.js"></script> // highlight-line
    <link rel="stylesheet" href="/assets/index-d526a0c5.css">  // highlight-line
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>
```

Kuten esimerkistä näemme, Vitellä tehdyssä sovelluksessa bundlataan JavaScriptin lisäksi sovelluksen CSS-määrittelyt tiedostoon <i>/assets/index-d526a0c5.csss</i>.

Käytännössä bundlaus tapahtuu siten, että sovelluksen JavaScriptille määritellään alkupiste, joka on Vite-sovelluksissa tiedosto <i>main</i>.js, ja bundlauksen yhteydessä Vite ottaa mukaan kaiken koodin mitä alkupiste importtaa, importattujen koodien importtaamat koodit jne.

Koska osa importeista on kirjastoja kuten React, Redux tai Axios, bundlattuun JavaScript-tiedostoon tulee myös kaikkien näiden sisältö.

> Vanha tapa jakaa sovelluksen koodi moneen tiedostoon perustui siihen, että index.html latasi kaikki sovelluksen tarvitsemat erilliset JavaScript-tiedostot script-tagien avulla. Tämä on kuitenkin tehotonta, sillä jokaisen tiedoston lataaminen aiheuttaa pienen overheadin ja pääosin nykyään suositaankin koodin bundlaamista yksittäiseksi tiedostoksi.

### Miten Vite toimii

Vitellä on kaksi selvästi erilaista toiminnallista moodia.

**Kehitystila** (<i>npm run dev</i>) ei bundlaa koodiasi lainkaan. Sen sijaan Vite käynnistää kehitysserverin, joka tarjoaa lähdekooditiedostot natiiveina ES-moduuleina suoraan selaimelle, jotka moderni selain pystyy importata. Tästä syystä Vite käynnistyy erittäin nopeasti projektin koosta riippumatta.

Poikkeuksen muodostavat sovelluksen riippuvuudet, jota bundlataan esbuildin avulla. Tämä ratkaisee kaksi ongelmaa: monet npm-paketit ovat edelleen CommonJS-muodossa (jota selaimet eivät voi käyttää natiivisti), ja jotkut kirjastot koostuvat sadoista pienistä sisäisistä tiedostoista, jotka muuten aiheuttaisivat satoja erillisiä pyyntöjä. esbuild muuntaa ja yhdistelee ne, tallentaa tuloksen levylle välimuistiin, ja seuraavat käynnistykset ovat lähes välittömiä.

**Tuotantotila** (<i>npm run build</i>) käyttää [Rollup](https://rollupjs.org/)ia bundlaukseen esbuildin hoitaessa edelleen muita tehtäviä kuten transpilointia (JSX, TypeScript) ja minifiointia. Rollup on suunniteltu alusta alkaen ES-moduuleille, ja sisältää useita optimointeja, jotka voivat merkittävästi pienentää bundlen kokoa.

Vastuunjako, esbuild nopeudesta, Rollup bundlen laadusta, on keskeinen osa Viten suunnittelua.

> Saatat miettiä, miksi Vite ei käytä esbuildia myös tuotantobundlaukseen, ottaen huomioon kuinka nopea se on. Syy on se, että esbuildin bundlauksen tulos, vaikkakin oikea, tuottaa heikommin optimoituja tuloksia haastavimmissa konfiguraatioissa. Rollupin tulos on ennustettavampaa ja paremmin viritettyä todellisten sovellusten monimutkaisille riippuvuusgraafeille. Viten tekijät [ovat ilmoittaneet](https://vitejs.dev/guide/why.html#why-not-bundle-with-esbuild) aikovansa siirtyä esbuildiin tuotantobundlauksessa, kun esbuild on kehittynyt riittävästi.

### esbuildiin tutustuminen

Jotta saamme paremman käsityksen bundlaamisesta ja siihen liittyvästä, rakennetaan minimaalinen React-ympäristö käyttäen [esbuildia](https://esbuild.github.io/).


Luodaan ensin yksinkertainen React-sovellus seuraavalla hakemistorakenteella:

```
├── dist
│   └── index.html
├── src
│   ├── index.jsx
│   └── App.jsx
└── package.json
```

Asennetaan ensin React ja <i>react-dom</i>:

```bash
npm install react react-dom
```

Asennetaan myös <i>esbuild</i>:

```bash
npm install --save-dev esbuild
```

Lisätään aluksi kaksi skriptiä <i>package.json</i>-tiedostoon:

```json
{
  "scripts": {
    "build": "esbuild src/main.jsx --bundle --outfile=dist/main.js --jsx=automatic",
    "serve": "npx serve dist"
  },
  // ...
}
```

Sovellusta varten tarvitaan tiedoston <i>dist/index.html</i>, joka lataa JavaScript-bundlen:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>esbuild app</title>
  </head>
  <body>
    <div id="root"></div>
    <script src="./main.js"></script>
  </body>
</html>
```

Sovelluksen "sisääntulopiste", eli <i>src/main.jsx</i> on vanha tuttu:

```jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

ReactDOM.createRoot(document.getElementById('root')).render(<App />)
```

Yksinkertainen sovelluskomponentti <i>src/App.jsx</i> on seuraavanlainen:

```jsx
import React, { useState } from 'react'

const App = () => {
  const [counter, setCounter] = useState(0)

  return (
    <div>
      <p>count: {counter}</p>
      <button onClick={() => setCounter(counter + 1)}>increment</ button>
    </div>
  )
}

export default App
```

Nyt voimme bundlata sovelluksen:

```bash
npm run build
```

Tulostus on yksittäinen <i>dist/main.js</i>-tiedosto, joka sisältää sovelluksen lähdekoodin yhdessä React-kirjaston kanssa bundlattuna.

Voimme suorittaa bundlatun sovelluksen komennolla <i>npm run serve</i>. Komento käyttää [serve](https://www.npmjs.com/package/serve)-pakettia käynnistääkseen paikallisen staattisten tiedostojen palvelimen <i>dist</i>-hakemistolle, jolloin sovellus on saatavilla osoitteessa <i>http://localhost:3000</i>:

![](../../images/7/es1.png)

esbuild tukee myös [minifiointia](https://en.wikipedia.org/wiki/Minification_(programming)) komentoriviparametrien avulla. Minifiointi poistaa koodista välilyönnit ja kommentit, lyhentää muuttujanimiä ja soveltaa muita kokooptimointeja. Bundle on huomattavan suuri, koska se sisältää koko React-kirjaston. Minifiointi pienentää sen kokoa merkittävästi.

Otetaan nyt käyttöön minifiointi:

```json
{
  "scripts": {
    "build": "esbuild src/main.jsx --bundle --minify --outfile=dist/main.js --jsx=automatic",  // highlight-line
    "serve": "npx serve dist"
  }
}
```

Minifiointi pienentää bundlen koon noin 1,1 megatavusta noin 190 kilotavuun, pienennys on siis merkittävä!

Minifioinnissa on kuitenkin haittapuoli. Jos sovellus aiheuttaa suoritusaikaisen virheen, selaimen kehittäjätyökalut viittaavat minifioituun koodiin, jota on lähes mahdoton lukea:

![](../../images/7/es2.png)

Ratkaisu on [source map](https://developer.mozilla.org/en-US/docs/Glossary/Source_map) eli oheistiedosto (<i>dist/main.js.map</i>), joka tallentaa, miten jokainen minifioidun bundlen rivi vastaa alkuperäistä lähdekoodia. Kun se on käytössä, virheilmotus viittaa minifioidun koodin lukukelvottoman koodin sijaan bundlaamattomaan lähdekoodiin.

Voimme ottaa source mapit käyttöön lisäämällä <i>--sourcemap</i>-lipun:

```json
{
  "scripts": {
    "build": "esbuild src/main.jsx --bundle --minify --sourcemap --outfile=dist/main.js --jsx=automatic",  // highlight-line
    "serve": "npx serve dist"
  }
}
```

Nyt virhe on ymmärrettävä:

![](../../images/7/es3.png)

Huomaa, että source mapit ovat todella hyödyllisiä kehityksen ja debuggauksen aikana, mutta ne kannattaa yleensä jättää pois julkisesta tuotantobuildista. Koska source map sisältää alkuperäisen lähdekoodin, kuka tahansa, joka avaa selaimen kehittäjätyökalut, voi lukea minifioimattoman koodin. Jos tästä on haittaa, tulee <i>--sourcemap</i>-valinta jättää pois tuotantobuild-komennosta.

### Transpilaus

Bundlauksen ohella esbuild suorittaa myös toisen keskeisen tehtävän: <i>transpilauksen</i>. Transpilaus tarkoittaa lähdekoodin muuntamista yhdestä JavaScript-muodosta toiseen, tyypillisesti modernista tai laajennetusta syntaksista tavalliseksi JavaScriptiksi, jonka selaimet voivat suorittaa.

Selaimet ymmärtävät tavallista JavaScriptiä, mutta JSX ei ole kelvollista JavaScriptiä, yksikään selain ei voi suorittaa sitä suoraan. Jos koodissa on esimerkiksi

```jsx
const element = <App />
```

tulee koodi transpiloida sellaiseen muotoon, jonka selain voi suorittaa:

```js
const element = React.createElement(App, null)
```

Tästä syystä transpilaus on pakollinen vaihe kaikissa React-projekteissa, ei valinnainen optimointi. esbuild suorittaa sen automaattisesti bundlauksen yhteydessä. <i>--jsx=automatic</i>-valinnan ansiosta esbuild käsittelee JSX:n ilman ulkoisia työkaluja. Vanhassa Webpack-pohjaisessa työnkulussa piti asentaa ja konfiguroida [Babel](https://babeljs.io/) ja siihen liittyvät paketit JSX:n transpilointia varten. esbuildilla <i>.jsx</i>-päätteiset tiedostot transpiloidaan automaattisesti.

### Kehitysympäristö

Sovelluskehitys onnistuu jo, mutta development workflow on suorastaan hirveä. Muutosten jälkeen koodi on bundlattava komennolla <i>npm run build</i> ja selain uudelleenladattava jos haluamme testata koodia.

esbuildin sisäänrakennettu [kehitysserveri](https://esbuild.github.io/api/#serve) ratkaisee ongelman. Lisätään <i>dev</i>-skripti <i>package.json</i>-tiedostoon:

```json
{
  "scripts": {
    "build": "esbuild src/main.jsx --bundle --minify --sourcemap --outfile=dist/main.js --jsx=automatic",
    "serve": "npx serve dist",
    "dev": "esbuild src/main.jsx --bundle --outfile=dist/main.js --jsx=automatic --servedir=./dist --watch" // highlight-line
  }
}
```

Komennon <i>npm run dev</i> suorittaminen tekee saa aikaan kaksi asiaa. Ensinnäkin [--watch](https://esbuild.github.io/api/#watch) käskee esbuildia tarkkailemaan kaikkia importattuja lähdekooditiedostoja muutosten varalta ja rakentamaan bundlen automaattisesti uudelleen aina kun jokin niistä tallennetaan. Toiseksi [--servedir](https://esbuild.github.io/api/#serve) käynnistää HTTP-palvelimen, joka tarjoaa <i>dist</i>-hakemiston sisällön, eli <i>index.html</i>:n ja juuri rakennetun <i>main.js</i>:n – osoitteessa <i>http://localhost:8000</i>.

<i>--servedir</i>-valinta on se, joka saa molemmat osat toimimaan yhdessä: ilman sitä esbuild vain rakentaisi uuden bundlen uudelleen watch-tilassa. Sen kanssa palvelin tarjoaa aina viimeisimmän bundlen, joten sovelluskehittäjän tarvitsee vain päivittää selain tiedoston tallentamisen jälkeen.

Huomaa, että toisin kuin Viten kehitysserveri, esbuild ei tue hot module reloadia. Lähdekoodin muutokset vaativat manuaalisen selaimen päivityksen tullakseen voimaan.

Nyt  meillä on selkeämpi käsitys siitä, mitä bundlaus ja transpilaus perimmiltään tarkoittavat, palataan Viten pariin ja katsotaan vielä, muutamia tapoja sen konfigurointiin.

### Viten konfigurointi

Suurimmassa osassa React-projekteja Vite toimii ilman minkäänlaista konfigurointia. Kun käyttäytymistä kuitenkin täytyy mukauttaa, se tapahtuu muokkaamalla tiedostoa <i>vite.config.js</i>.

Minimaalinen Vite-konfiguraatio React-projektille näyttää tältä:

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
```

<i>@vitejs/plugin-react</i>-plugin  mahdollistaa JSX-syntaksin käsittelyn, nopean uudelleenlatauksen (hot module replacement, joka säilyttää komponenttien tilan päivitysten välillä) sekä muut React-kehitykseen tarvittavat ominaisuudet.

#### Kehitysserverin konfigurointi

Kehitysserverin portin ja muita asetuksia voidaan konfiguroida <i>server</i>-avaimen alla:

```js
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,        // avaa selain automaattisesti
  },
})
```

#### API-pyyntöjen proxytys

Paikallisessa kehityksessä React-sovellus pyörii tyypillisesti yhdessä portissa (esim. 3000) ja backend toisessa (esim. 3001). Selaimen same-origin-policy estäisi normaalisti pyyntöjen tekemisen niiden välillä. Viten proxy-asetus ratkaisee tämän ilman CORS-konfigurointia backendissä:

```js
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
})
```

Tällä konfiguraatiolla Viten kehitysserveri välittää automaattisesti kaikki React-sovelluksen tekemät pyynnöt esim. osoitteeseen <i>/api/notes</i> osoitteeseen <i>http://localhost:3001/api/notes</i>. Frontend-koodin ei koskaan tarvitse sisällyttää <i>localhost:3001</i>-osoitetta URL-osoitteisiinsa kehityksen aikana.

#### Ympäristömuuttujat

Vitellä on sisäänrakennettu tuki ympäristömuuttujille <i>.env</i>-tiedostojen avulla.

Luodaan <i>.env</i>-tiedosto projektin juureen:

```
VITE_BACKEND_URL=http://localhost:3001/api/notes
```

Ja <i>.env.production</i>-tiedosto tuotantoarvoille:

```
VITE_BACKEND_URL=https://myapp.fly.dev/api/notes
```

Kaikkien selaimelle näkyvien ympäristömuuttujien täytyy alkaa etuliitteellä <i>VITE_</i>. Muuttujat ilman tätä etuliitettä pysyvät vain palvelinpuolella, eikä niitä sisällytetä bundleen. Tämä on tietoinen turvallisuustoimenpide, joka estää salaisuuksien vahingollisen vuotamisen.

Muuttujaan pääsee käsiksi sovelluskoodissa <i>import.meta.env</i>:n kautta:

```js
const App = () => {
  const notes = useNotes(import.meta.env.VITE_BACKEND_URL)

  return (
    <div>
      {notes.length} notes on server {import.meta.env.VITE_BACKEND_URL}
    </div>
  )
}
```

Vite valitsee automaattisesti oikean <i>.env</i>-tiedoston moden perusteella:

- <i>npm run dev</i> käyttää tiedostoja <i>.env</i> ja <i>.env.development</i>
- <i>npm run build</i> käyttää tiedostoja <i>.env</i> ja <i>.env.production</i>

#### Transpilaus

Vite hoitaa koodin transpilauksen automaattisesti. Kehityksen aikana esbuild transpiloi TypeScript- ja JSX-koodisi tarpeen mukaan. Se on tarpeeksi nopea tekemään tämän tiedostokohtaisesti ilman havaittavaa viivettä. Tuotantobuildien aikana Rollup hoitaa bundlauksen esbuildin hoitaessa transpilauksen.

Viten oletustranspilointikohde on modernit selaimet, jotka tukevat natiiveja ES-moduuleita (Chrome 87+, Firefox 78+, Safari 14+, Edge 88+). Jos on tarvetta tukea vanhempia selaimia, on mahdollista konfiguroida kohde eksplisiittisesti ja lisätä <i>@vitejs/plugin-legacy</i>-pluginin:

```bash
npm install --save-dev @vitejs/plugin-legacy
```

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import legacy from '@vitejs/plugin-legacy'

export default defineConfig({
  plugins: [
    react(),
    legacy({
      targets: ['defaults', 'not IE 11'],
    }),
  ],
})
```

Legacy-plugin generoi automaattisesti erillisen bundlen vanhemmille selaimille Babelin avulla.

#### CSS

Vite käsittelee CSS:n ilman minkäänlaista konfigurointia, kun CSS-tiedosto importataan JavaScriptistä:

```js
import './index.css'
```

Vite käsittelee sen ja sisällyttää sen buildiin. Tuotannossa CSS extraktoidaan erilliseen tiedostoon. Kehityksen aikana se injektoidaan <i>&lt;style&gt;</i>-tagien kautta hot reload -tuella.

Vite tukee myös natiivisti [CSS Moduleita](https://github.com/css-modules/css-modules) sekä CSS-esiprosesoreja kuten [Sass](https://sass-lang.com/).

#### Minifiointi

Komennon <i>npm run build</i> suorituksen yhteydessä Vite minifioi muodostettavan bundlen. Minifiointi poistaa välilyönnit ja kommentit, lyhentää muuttujanimiä ja soveltaa muita kokooptimointeja. Tuloksena on paljon pienempi tiedosto, joka latautuu nopeammin selaimessa.

Vite käyttää esbuildia JavaScript-minifiointiin ja sisäänrakennettua CSS-minifioijaa tyylitiedostoille.

#### Source mapit

Kehityksessä Vite generoi source mapit automaattisesti. Tuotantobuildeja varten ne voidaan ottaa käyttöön eksplisiittisesti:

```js
export default defineConfig({
  plugins: [react()],
  build: {
    sourcemap: true,
  },
})
```

#### Pluginit

Viten toiminnallisuutta laajennetaan [plugineilla](https://vite.dev/plugins/). Plugin-ekosysteemi on kasvanut nopeasti ja kattaa useimmat yleiset tarpeet. Joitakin laajasti käytettyjä plugineja ovat:

- <i>@vitejs/plugin-react</i> — React-tuki (JSX, fast refresh)
- <i>@vitejs/plugin-legacy</i> — vanhojen selainten tuki
- <i>vite-plugin-svgr</i> — SVG-tiedostojen importtaus React-komponentteina
- <i>rollup-plugin-visualizer</i> — bundlen koon analyysi

Pluginit määritellään <i>plugins</i>-taulukossa <i>vite.config.js</i>-tiedostossa. Ne noudattavat samaa rajapintaa kuin Rollup-pluginit, joten monet Rollup-pluginit toimivat myös Vitessä.

#### Polyfillsit

<i>Polyfill</i> on koodi, joka toteuttaa ominaisuuden selaimille, jotka eivät sitä natiivisti tue. Transpilaus yksin ei riitä ominaisuuksille, jotka ovat syntaktisesti kelvollisia mutta toteuttamattomia. Esimerkiksi selain saattaa jäsentää <i>Promise</i>n oikein mutta sillä ei ole toteutusta sille.

Vitessä polyfillit hoitaa <i>@vitejs/plugin-legacy</i>-plugin, joka sisällyttää automaattisesti tarvittavat polyfillit selainkohteidesi perusteella. 

Selaintuen olemassaolo tietyille API:ille on mahdollista tarkastaa osoitteesta [https://caniuse.com](https://caniuse.com) tai [Mozillan MDN-dokumentaatiosta](https://developer.mozilla.org/).

</div>

