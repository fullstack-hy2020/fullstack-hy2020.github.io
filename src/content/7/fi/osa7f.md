---
mainImage: ../../../images/part-7.svg
part: 7
letter: f
lang: fi
---

<div class="content">

Kurssin seitsemännessä osassa on lukujen [React-router](/osa7/react_router) ja [custom-hookit](/osa7/custom_hookit) kahdeksan tehtävän lisäksi 13 tehtävää, joissa jatketaan osissa 4 ja 5 tehtyä Bloglist-sovellusta.  Osa seuraavassa olevista tehtävistä on toisistaan riippumattomia "featureita", eli tehtäviä ei tarvitse tehdä järjestyksessä, voit jättää osan aivan hyvin toteuttamatta.

Voit ottaa pohjaksi oman sovelluksesi sijaan myös mallivastauksen koodin.

Useimmat tämän osan tehtävistä vaativat olemassaolevan koodin refaktoroimista. Tämä on tilanne käytännössä aina sovelluksia laajennettaessa, eli vaikka refaktorointi voi olla hankalaa ja ikävääkin, on kyseessä oleellinen taito.

Hyvä neuvo niin refaktorointiin kuin uudenkin koodin kirjoittamiseen on <i>pienissä askelissa eteneminen</i>, koodia ei kannata hajottaa totaalisesti refaktorointia tehdessä pitkäksi aikaa, se on käytännössä varma resepti hermojen menettämiseen.

</div>

<div class="tasks">

### Tehtävät 7.9.-7.21.

#### 7.9: redux, step1

Siirry käyttämään React-komponenttien tilan sijaan Reduxia sovelluksen tilan hallintaan.

Muuta tässä tehtävässä notifikaatio käyttämään Reduxia.

#### 7.10: redux, step2

<i>Tämä ja seuraava kaksi osaa ovat kohtuullisen työläitä, mutta erittäin opettavaisia.</i>

Kirjautumisen ja uuden blogin luomisen lomakkeiden tilaa voit halutessasi hallita edelleen Reactin tilan avulla. 

Siirrä blogien tietojen talletus Reduxiin. Tässä tehtävässä riittää, että sovellus näyttää olemassa olevat blogit ja, että uuden blogin luominen onnistuu.

#### 7.11: redux, step3

Laajenna ratkaisua siten, että blogien "liketys" ja poisto toimivat.

#### 7.12: redux, step4

Siirrä myös kirjautuneen käyttäjän tietojen talletus Reduxiin.

#### 7.13: käyttäjien näkymä

Tee sovellukseen näkymä, joka näyttää kaikkiin käyttäjiin liittyvät perustietot:

![](../../images/7/41.png)

#### 7.14: yksittäisen käyttäjän näkymä

Tee sovellukseen yksittäisen käyttäjän näkymä, jolta selviää mm. käyttäjän lisäämät blogit

![](../../images/7/44.png)

Näkymään päästään klikkaamalla nimeä kaikkien käyttäjien näkymästä

![](../../images/7/43.png)

<i>**Huom:**</i> törmäät tätä tehtävää tehdessäsi lähes varmasti seuraavaan virheeseen

![](../../images/7/42ea.png)

vika ilmenee jos uudelleenlataat sivun ollessasi yksittäisen käyttäjän sivulla. 

Vian syynä on se, että jos mennään suoraan jonkin käyttäjän sivulle, eivät käyttäjien tiedot ole vielä ehtineet palvelimelta React-sovellukseen. Ongelman voi kiertää ehdollisella renderöinnillä:

```js
const User = () => {
  const user = ...
  // highlight-start
  if (!user) {
    return null
  }
  // highlight-end

  return (
    <div>
      // ...
    </div>
  )
}
```

#### 7.15: blogin näkymä

Toteuta sovellukseen oma näkymä yksittäisille blogeille. Näkymä voi näyttää seuraavalta

![](../../images/7/45.png)

Näkymään päästään klikkaamalla blogin nimeä kaikkien blogien näkymästä

![](../../images/7/46.png)

Tämän tehtävän jälkeen tehtävässä 5.6 toteutettua toiminnallisuutta ei enää tarvita, eli kaikkien blogien näkymässä yksittäisten blogien detaljien ei enää tarvitse avautua klikattaessa.

#### 7.16: navigointi

Tee sovellukseen navigaatiomenu

![](../../images/7/47.png)

#### 7.17: kommentit, step1

Tee sovellukseen mahdollisuus blogien kommentointiin:

![](../../images/7/48.png)

Kommentit ovat anonyymejä, eli ne eivät liity järjestelmän käyttäjiin.

Tässä tehtävässä riittää, että frontend osaa näyttää blogilla olevat backendin kautta lisätyt kommentit.

Sopiva rajapinta kommentin luomiseen on osoitteeseen <i>api/blogs/:id/comments</i> tapahtuva HTTP POST -pyyntö.

#### 7.18: kommentit, step2

Laajenna sovellusta siten, että kommentointi onnistuu frontendista käsin:

![](../../images/7/49.png)

#### 7.19: tyylit, step1

Tee sovelluksesi ulkoasusta tyylikkäämpi jotain kurssilla esiteltyä tapaa käyttäen

#### 7.20: tyylit, step2

Jos käytät tyylien lisäämiseen noin tunnin aikaa, merkkaa myös tämä tehtävä tehdyksi.

#### 7.21: Kurssipalaute

Anna kurssille palautetta moodlessa.

Tämä oli osan viimeinen tehtävä ja on aika pushata koodi githubiin sekä merkata tehdyt tehtävät [palautussovellukseen](https://studies.cs.helsinki.fi/stats/courses/fullstackopen).


</div>
