---
title: osa 2
subTitle: Web-sovellusten toiminnan perusteet
path: /osa2/perusteet
mainImage: ../images/osa2.png
part: 2
letter: a
partColor: dark-orange
---

<div class="content">

### Muutama huomio

### setState on asynkrooninen

Muutamat ovat jo törmänneet siihen, että **React kutsuu funktiota setState asynkroonisesti**, eli jos meillä on seuraava koodi

```js
console.log(this.state.counter);
this.setState({ counter: 55 });
console.log(this.state.counter);
```

tulostavat molemmat rivit saman arvon, sillä Reactin tila **ei saa uutta arvoa** heti komennon _this.setState_ jälkeen, vaan vasta sitten kun suorituksen alla oleva metodi on suoritettu loppuun ja _setState_ on saanut mahdollisuuden suoritukselle.

### console.log

_Mikä erottaa kokeneen ja kokemattoman Javascript-ohjelmoijan? Kokeneet käyttävät 10-100 kertaa enemmän console.logia_.

Paradoksaalista kyllä tämä näyttää olevan tilanne, vaikka kokematon ohjelmoija oikeastaan tarvitsisi console.logia (tai jotain muita debuggaustapoja) huomattavissa määrin kokenutta enemmän.

Eli kun joku ei toimi, älä arvaile vaan logaa tai käytä jotain muita debuggauskeinoja.

**HUOM** kun käytät komentoa _console.log_ debuggaukseen, älä yhdistele asioita "javamaisesti" plussalla, eli sen sijaan että kirjoittaisit

```js
console.log('propsin arvo on' + props);
```

erottele tulostettavat asiat pilkulla:

```js
console.log('propsin arvo on', props);
```

Jos yhdistät merkkijonoon olion, tuloksena on suhteellisen hyödytön tulostusmuoto

```bash
propsin arvo on [Object object]
```

kun taas pilkulla erotellessa saat tulostettavat asiat developer-konsoliin oliona, jonka sisältöä on mahdollista tarkastella.

### Tapahtumankäsittely revisited

Pajan ja telegrammin havaintojen perusteella tapahtumankäsittely on osoittautunut haastavaksi.

Osassa 1 on nyt uusi luku [tapahtumankäsittely revisited](/osa1#tapahtumankäsittely-revisited) joka käy aihepiiriä läpi.

### Visual Studio Coden snippetit

VS Codeen on helppo määritellä "snippettejä", eli Netbeansin "sout":in tapaisia oikoteitä yleisesti käytettyjen koodinpätkien generointiin. Ohje snippetien luomiseen [täällä](https://github.com/FullStack-HY/FullStack-Hy.github.io/blob/master/snippet_ohje.md)

VS Code -plugineina löytyy myös hyödyllisiä valmiiksi määriteltyjä snippettejä, esim.
[tämä](https://marketplace.visualstudio.com/items?itemName=xabikos.ReactSnippets)

### Pakolliset tehtävät, tehtävien vaikutus arvosanaan

Joissain yhteyksissä on ollut pientä epäselvyyttä mitä tiettyjen tehtävien pakollisuus tarkoittaa, ja mikä ei-pakollisten tehtävien rooli on. Tarkennusta asiaan tehtävien sivun [alussa](/tehtävät)

### Linkkivinkit

Kurssisivun alaisuudessa on nyt [osio](https://fullstack-hy.github.io/linkit/), jonne kaikkien toivotaan lisäilevän hyödylliseksi kokemiaan linkkejä. Lisääminen onnistuu tekemällä pull request [tänne](https://github.com/FullStack-HY/FullStack-Hy.github.io/blob/master/linkit.md)

Kun lisäät linkin, laita linkin yhteyteen pieni kuvaus mitä linkin takaa löytyy.

</div>
