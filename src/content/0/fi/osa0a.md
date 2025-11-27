---
mainImage: ../../../images/part-0.svg
part: 0
letter: a
lang: fi
---

<div class="content">

Kurssilla tutustutaan JavaScriptilla tapahtuvaan moderniin web-sovelluskehitykseen. Pääpaino on React-kirjaston avulla toteutettavissa single page ‑sovelluksissa ja niitä tukevissa Node.js:llä toteutetuissa REST- ja GraphQL-rajapinnoissa. Kurssi sisältää myös osat, joissa tutustutaan TypeScriptiin, React Nativeen ja jatkuvaan integraatioon.

Kurssilla käsitellään myös sovellusten testaamista, konttiteknologiaa, konfigurointia ja suoritusympäristöjen hallintaa sekä tietokantoja.

### Oletetut esitiedot

Osallistujilta edellytetään vahvaa ohjelmointirutiinia, web-ohjelmoinnin ja tietokantojen perustuntemusta, Git-versionhallintajärjestelmän peruskäytön hallintaa, kykyä pitkäjänteiseen työskentelyyn sekä valmiutta omatoimiseen tiedonhakuun ja ongelmanratkaisuun.

Osallistuminen ei kuitenkaan edellytä kurssilla käsiteltävien tekniikoiden tai JavaScript-kielen hallintaa.

### Kurssimateriaali

Kurssimateriaali on tarkoitettu luettavaksi osa kerrallaan "alusta loppuun". Materiaalin seassa on tehtäviä, jotka on sijoiteltu siten, että kunkin tehtävän tekemiseen pitäisi olla riittävät tekniset valmiudet sitä edeltävässä materiaalissa. Voit siis tehdä tehtäviä sitä mukaa, kun niitä tulee materiaalissa vastaan. Voi myös olla, että koko osan tehtävät kannattaa tehdä vasta sen jälkeen, kun olet ensin lukenut osan alusta loppuun kertaalleen. Useissa osissa tehtävät ovat samaa ohjelmaa laajentavia pienistä osista koostuvia kokonaisuuksia. Muutamia tehtävien ohjelmia kehitetään eteenpäin useamman osan aikana.

Materiaali perustuu muutamien osasta osaan vaihtuvien esimerkkiohjelmien asteittaiseen laajentamiseen. Materiaali toiminee parhaiten, jos kirjoitat samalla koodin myös itse ja teet koodiin myös pieniä modifikaatioita. Materiaalin käyttämien ohjelmien koodin eri vaiheiden tilanteita on tallennettu GitHubiin.

### Suoritustapa

Kurssi koostuu neljästätoista osasta, joista ensimmäinen on historiallisista syistä numero nolla. Osat voi tulkita löyhästi ajatellen viikoiksi, mutta voit suorittaa kurssin itsellesi parhaiten sopivalla rytmillä.

Materiaalissa osasta <i>n</i> osaan <i>n+1</i> eteneminen ei ole mielekästä ennen kuin riittävä osaaminen osan <i>n</i> asioista on saavutettu. Kurssilla sovelletaankin pedagogisin termein <i>tavoiteoppimista</i>, [engl. mastery learning](https://en.wikipedia.org/wiki/Mastery_learning) ja on tarkoitus, että etenet seuraavaan osaan vasta, kun riittävä määrä edellisen osan tehtävistä on tehty.

Oletuksena on, että teet osien 1–4 tehtävistä <i>ainakin ne</i>, joita ei ole merkattu tähdellä. Myös tähdellä merkatut tehtävät vaikuttavat arvosteluun, mutta niiden tekemättä jättäminen ei aiheuta liian suuria esteitä seuraavan osan (tähdellä merkkaamattomien) tehtävien tekemiseen. Osissa 5- ei tähtiä ole, sillä osien tehtävillä ei ole suurta riippuvuutta aiempiin osiin. 

Etenemisnopeus kurssilla on vapaa.

Tämän kurssin eri osiin jo tehtyjen palautusten ajankäyttöstatistiikan näet [tehtävien palautussovelluksesta](https://studies.cs.helsinki.fi/stats/courses/fullstackopen).

### Apua tehtävien tekoon?

Kurssilla ei tällä hetkellä ole varsinaista opetusta, mutta tehtäviin voi yrittää kysyä apua kurssin keskustelukanavalla Discordissa <a target='_blank' href='https://study.cs.helsinki.fi/discord/join/fullstack'>https://study.cs.helsinki.fi/discord/join/fullstack</a>. Discordissa kurssiin liittyvää keskustelua varten on kanava fullstack_general ja osa-kohtaiset kanavat (muut fullstack-alkuiset kanavat). Huomaa, että Discordin <i>chat-kanava ei ole kurssiin liittyvää keskustelua varten</i>.

Huom: kaikki epäasialliset, halventavat ja jotain ihmisryhmää syrjivät kommentit kanavalla ovat kiellettyjä, ja tällaisten kommenttien esittäjät poistetaan kanavalta.

### Osat ja suorittaminen

Full Stack –opinnot koostuvat ydinkurssista sekä useista lisäosista.  Voit suorittaa opinnot 5-14 opintopisteen laajuisena. 

#### Osat 0-5 (ydinkurssi) - Full Stack ‑websovelluskehitys (5 op, CSM141081)

Suorituksen opintopistemäärä ja arvosana määräytyvät kurssin osien 0–7 kaikkien tehtyjen tehtävien (myös tähdellä merkittyjen) perusteella.

Arvosana/opintopisterajat:

| tehtäviä     | opintopisteitä | arvosana | 
| ------------ | :------------: | :------: |
| 138          |       7        | 5        |
| 127          |       6        | 5        |
| 116          |       5        | 5        |
| 105          |       5        | 4        |
| 94           |       5        | 3        |
| 83           |       5        | 2        |
| 72           |       5        | 1        |

Jos haluat kurssista virallisen suoritusmerkinnän, kuuluu kurssiin myös koe. Hyväksytty suoritus edellyttää kokeen läpäisemistä, koe ei kuitenkaan vaikuta arvosanaan. Lisää tietoa kurssikokeesta [täällä](/osa0/yleista/#kurssikoe).

Voit osallistua kokeeseen vasta siinä vaiheessa, kun olet tehnyt riittävästi tehtäviä 5 opintopisteen suoritukseen. Käytännössä kokeeseen ei kuitenkaan kannata osallistua heti, kun riittävä tehtäväpistemäärä on suoritettu. Koe on sisällöltään sama riippumatta siitä, onko suorituksesi laajuus 5–14 opintopistettä. Koe ei vaikuta kurssilta saamaasi arvosanaan. Kokeen läpipääsyyn riittää 75 % kokeen tarjolla olevista pisteistä.

#### Osa 6 - Full Stack ‑websovelluskehitys, lisäosa 1 (1 op, CSM141082)
Suorittamalla vähintään 127 tehtävää kurssin osista 0–7 ydinkurssin suorittamisen yhteydessä, voit laajentaa suoritustasi yhdellä opintopisteellä. 
-	Tee vähintään 127 tehtävää osista 0–7. 
-	[Ilmoittaudu tähän osaan Avoimen yliopiston kautta.](https://www.avoin.helsinki.fi/palvelut/esittely.aspx?s=otm-abc0a702-3d35-496f-87b9-5c7845a9367b)
-	[Pyydä suoritusmerkintää](https://fullstackopen.com/osa0/yleista#suoritusmerkinnan-pyytaminen) tästä osasta. 

#### Osa 7 - Full Stack ‑websovelluskehitys, lisäosa 2 (1 op, CSM141083)

Suorittamalla vähintään 138 tehtävää kurssin osista 0–7 ydinkurssin suorittamisen yhteydessä, voit laajentaa suoritustasi yhdellä opintopisteellä. 
-	Tee vähintään 138 tehtävää osista 0–7. 
-	[Ilmoittaudu tähän osaan Avoimen yliopiston kautta.](https://www.avoin.helsinki.fi/palvelut/esittely.aspx?s=otm-3149cc5e-8d83-4471-8eba-870093a2f01f)
-	[Pyydä suoritusmerkintää](https://fullstackopen.com/osa0/yleista#suoritusmerkinnan-pyytaminen) tästä osasta. 

#### Osa 8 - Full Stack ‑websovelluskehitys: GraphQL (1 op, CSM14113)

Suorittamalla vähintään 22/26 tehtävää kurssin kahdeksannesta, GraphQL:ää käsittelevästä osasta, voit laajentaa suoritustasi yhdellä opintopisteellä. Voit tehdä GraphQL:ää käsittelevän osuuden periaatteessa jo osan 5 jälkeen, sillä sen sisältö ei riipu osista 6 ja 7.
-	Tee vähintään 22/26 tehtävää osasta 8. 
-	[Ilmoittaudu tähän osaan Avoimen yliopiston kautta.](https://www.avoin.helsinki.fi/palvelut/esittely.aspx?s=otm-4b912f04-d928-4a2d-aed7-8d8b2cefd397)
-	[Pyydä suoritusmerkintää](https://fullstackopen.com/osa0/yleista#suoritusmerkinnan-pyytaminen) tästä osasta. 

#### Osa 9 - Full Stack ‑websovelluskehitys: TypeScript (1 op, CSM14110, englanniksi)

Suorittamalla vähintään 24/30 tehtävää kurssin yhdeksännestä, TypeScriptiä käsittelevästä osasta, voit laajentaa suoritustasi yhdellä opintopisteellä. Osa kannattaa suorittaa vasta sen jälkeen, kun olet tehnyt osat 0–7.

-	Tee vähintään 24/30 tehtävää osasta 9.
-	[Ilmoittaudu tähän osaan Avoimen yliopiston kautta.](https://www.avoin.helsinki.fi/palvelut/esittely.aspx?s=otm-8d68ba22-4d46-479c-8990-32ddc83f5a5f)
-	[Pyydä suoritusmerkintää](https://fullstackopen.com/osa0/yleista#suoritusmerkinnan-pyytaminen) tästä osasta. 

#### Osa 10 - Full Stack ‑websovelluskehitys: React Native (2 op, CSM14111, englanniksi)

Suorittamalla 25 tehtävää kurssin kymmenennestä, React Nativea käsittelevästä osasta, voit laajentaa suoritustasi kahdella opintopisteellä. Lisätietoja osan esitietovaatimuksista, tehtävien palauttamisesta ja opintopisteistä löydät [osasta 10](/en/part10/introduction_to_react_native).

-	Tee vähintään 25 tehtävää osasta 10. 
-	[Ilmoittaudu tähän osaan Avoimen yliopiston kautta.](https://www.avoin.helsinki.fi/palvelut/esittely.aspx?s=otm-e859336d-9d63-47ac-9906-a7da74cae32d)
-	[Pyydä suoritusmerkintää](https://fullstackopen.com/osa0/yleista#suoritusmerkinnan-pyytaminen) tästä osasta. 

#### Osa 11 - Full Stack ‑websovelluskehitys: jatkuva integraatio (1 op, CSM14112, englanniksi)

Suorittamalla kaikki kurssin yhdennentoista, jatkuvaa integraatiota käsittelevän osan tehtävät, voit laajentaa suoritustasi yhdellä opintopisteellä.
Lisätietoja osan esitietovaatimuksista ja tehtävien palauttamisesta löydät [osasta 11](/en/part11).
-	Tee kaikki tehtävät osasta 11.
-	[Ilmoittaudu tähän osaan Avoimen yliopiston kautta.](https://www.avoin.helsinki.fi/palvelut/esittely.aspx?s=otm-33f0ce21-ff95-42e1-9581-2c75ea3dd2a5)
-	[Pyydä suoritusmerkintää](https://fullstackopen.com/osa0/yleista#suoritusmerkinnan-pyytaminen) tästä osasta. 

#### Osa 12 - Full Stack  ‑websovelluskehitys: konttiteknologia (1 op, CSM141084, englanniksi)

Suorittamalla kaikki kurssin kahdennentoista, konttiteknologiaa käsittelevän osan tehtävät, voit laajentaa suoritustasi yhdellä opintopisteellä.
Lisätietoja osan esitietovaatimuksista ja tehtävien palauttamisesta löydät [osasta 12](/en/part12).
-	Tee kaikki tehtävät osasta 12.
-	[Ilmoittaudu tähän osaan Avoimen yliopiston kautta.](https://www.avoin.helsinki.fi/palvelut/esittely.aspx?s=otm-fd32902f-3941-4963-b73b-8408cff02ae2)
-	[Pyydä suoritusmerkintää](https://fullstackopen.com/osa0/yleista#suoritusmerkinnan-pyytaminen) tästä osasta. 

#### Osa 13 - Full Stack  ‑websovelluskehitys: relaatiotietokannat (1 op, CSM14114)

Suorittamalla kaikki kurssin kolmannentoista, relaatiotietokantojen käyttöä käsittelevän osan tehtävät, voit laajentaa suoritustasi yhdellä opintopisteellä.
Lisätietoja osan esitietovaatimuksista ja tehtävien palauttamisesta löydät [osasta 13](/osa13).
-	Tee kaikki tehtävät osasta 13.
-	[Ilmoittaudu tähän osaan Avoimen yliopiston kautta.](https://www.avoin.helsinki.fi/palvelut/esittely.aspx?s=otm-be8081bc-e7c1-4d82-9d7c-f1fbc3a519bc)
-	[Pyydä suoritusmerkintää](https://fullstackopen.com/osa0/yleista#suoritusmerkinnan-pyytaminen) tästä osasta. 

### Suoritusohjeet pähkinänkuoressa

Kurssin suoritusohjeet pähkinänkuoressa (5 op ydinkurssi CSM141081) 

- Tee tehtävät. Palauta vastauksesi [palautussovelluksen](https://studies.cs.helsinki.fi/stats/courses/fullstackopen) kautta.
- Ilmoittaudu kurssille. Pääset ilmoittautumaan palautussovelluksesta löytyvän [linkin](/osa0/yleista#kurssikoe) kautta sen jälkeen kun olet palauttanut riittävän määrän tehtäviä. 
- Tallenna Helsingin yliopiston opiskelijanumerosi palautussovellukseen. Lue lisää [täältä](/osa0/yleista/#suoritusmerkinnan-pyytaminen)
- Tee kurssikoe palautusjärjestelmässä, lue lisää [täältä](/osa0/yleista#kurssikoe).
- Pyydä suoritusmerkintää palautussovelluksessa. Lue lisää [täältä](/osa0/yleista#suoritusmerkinnan-pyytaminen)

Kurssin suoritusohjeet pähkinänkuoressa (Osat 6–13) 

- Tee tehtävät. Palauta vastauksesi palautussovelluksen kautta. Huomaa, että osat 8–13 palautetaan palautussovelluksessa erillisiin kurssi-instansseihin.
- Ilmoittaudu kurssille. Pääset ilmoittautumaan kurssimateriaalista (ks. [Osat ja suorittaminen](/osa0/yleista#osat-ja-suorittaminen)) löytyvän ilmoittautumislinkin kautta.  Ilmoittaudu erikseen kuhunkin osaan. 
- Pyydä suoritusmerkintää palautussovelluksessa. Lue lisää [täältä](/osa0/yleista#suoritusmerkinnan-pyytaminen)

### Tehtävien palauttaminen

Tehtävät palautetaan GitHubin kautta ja merkitsemällä tehdyt tehtävät [palautussovellukseen](https://studies.cs.helsinki.fi/stats/courses/fullstackopen).

Jos palautat eri osien tehtäviä samaan repositorioon, käytä järkevää hakemistojen nimentää. Voit toki tehdä jokaisen osan omaankin repositorioon, kaikki käy. Jos käytät privaattirepositoriota tehtävien palautukseen, liitä repositoriolle collaboratoriksi <i>mluukkai</i>

Tehtävät palautetaan **yksi osa kerrallaan**. Kun olet palauttanut osan tehtävät, et voi enää palauttaa saman osan tekemättä jättämiäsi tehtäviä.

GitHubiin palautettuja tehtäviä tarkastetaan plagiaattitunnistusjärjestelmän avulla. Jos GitHubista löytyy kurssin mallivastausten koodia tai useammalta opiskelijalta löytyy samaa koodia, käsitellään tilanne yliopiston [vilppikäytäntöjen](https://guide.student.helsinki.fi/fi/artikkeli/mita-ovat-vilppi-ja-plagiointi) mukaan.

Suurin osa tehtävistä on moniosaisia, samaa ohjelmaa pala palalta rakentavia kokonaisuuksia. Tällaisissa tehtäväsarjoissa ohjelman lopullisen version palauttaminen riittää. Voit toki halutessasi tehdä commitin jokaisen tehtävän jälkeisestä tilanteesta, mutta se ei ole välttämätöntä.

### Kurssikoe

Virallinen kurssisuoritus edellyttää, että teet hyväksyttävästi kurssin osia 1–5 käsittelevän kokeen. 

Koe tehdään tehtävien palautusjärjestelmässä. Pääset tekemään kokeen seuraavia ohjeita seuraamalla:

- Tee Avoimen yliopiston kurssi-ilmoittautuminen
- Pääset ilmoittautumaan [palautussovelluksesta](https://studies.cs.helsinki.fi/stats/courses/fullstackopen/submissions) löytyvän linkin kautta sen jälkeen, kun olet palauttanut riittävän määrän tehtäviä:

![](../../images/0/enroll1.png)

Tallenna Helsingin Yliopiston opiskelijanumerosi [palautussovellukseen](https://studies.cs.helsinki.fi/stats/myinfo) ilmoittautumisen jälkeen:

![](../../images/0/28b.png)

Saat selville opiskelijanumerosi [täällä](/osa0/yleista#miten-saan-selville-helsingin-yliopiston-opiskelijanumeroni) kuvatulla tavalla.

Tämän jälkeen pääset tekemään kokeen palautusjärjestelmässä:

![](../../images/0/enroll3.png)

Koeaika on 120 minuuttia. Jos koesuoritus hyväksytään, saat seuraavan vahvistuksen:

![](../../images/0/enroll4.png)

Jos et pääse kokeesta läpi, voit yrittää uudelleen viikon kuluttua.

Jos pääset kokeesta läpi ja et halua tehdä enempää tehtäviä, voit mennä palautussovelluksen my submissions ‑välilehdelle ja pyytää suorituksen rekisteröintiä:

![](../../images/0/enroll5a.png)

Muista painaa isoa, sinistä nappia, jotta suorituksesi rekisteröidään!

Huomaa, että joudut painamaan nappia vielä toisen kerran:

![](../../images/0/button2.png)

Kun nappia on painettu tarpeeksi monta kertaa, näet seuraavan tekstin:

> <i>University credit registration in progress...</i>

### Suoritusmerkinnän pyytäminen

Jos haluat kurssilta virallisen suorituksen, tallenna <b>Helsingin yliopiston</b> opiskelijanumerosi [palautussovellukseen](https://studies.cs.helsinki.fi/stats/courses/fullstackopen): 

![](../../images/0/28b.png)

Jos et ole Helsingin yliopiston opiskelija, saat opiskelijanumeron ilmoittautumalla kurssille [Avoimen yliopiston](/osa0/yleista/#kokeeseen-ilmoittautuminen) jälkeen [täällä](/osa0/yleista#miten-saan-selville-helsingin-yliopiston-opiskelijanumeroni) kuvatulla tavalla.

Saat suoritusmerkinnän sen jälkeen kun olet tehnyt hyväksyttävään suoritukseen oikeuttavan määrän tehtäviä, suorittanut kokeen hyväksytysti ja ilmoittanut palautussovelluksessa olevasi valmis kurssin suorituksen kanssa:

![](../../images/0/enroll5a.png)

Paina siis sinistä nappia: "I have completed the course ..."!

Huomaa, että joudut painamaan nappia vielä toisen kerran:

![](../../images/0/button2.png)

Kun nappia on painettu tarpeeksi monta kertaa, näet seuraavan tekstin:

> <i>University credit registration in progress...</i>

**Huomaa**, että suoritusmerkintää ei voida kirjata, jos et ole ilmoittautunut kaikkiin suorittamiisi osiin, katso [täältä](/osa0/yleista#osat-ja-suorittaminen) ohjeet ilmoittautumiseen.

Arvosana siirtyy Helsingin yliopiston opintorekisteriin Sisuun ja [Opintopolkuun](https://opintopolku.fi/oma-opintopolku/) neljän viikon sisällä suoritusmerkintäpyynnön jälkeen. Heinäkuu saattaa aiheuttaa viiveen suorituksen kirjaamiseen.

Kun suoritusmerkintä on kirjattu, näet palautussovelluksessa tekstin

> <i>University credits registered, see the course page how to get a transcript if you need one</i>
### Miten saan selville Helsingin yliopiston opiskelijanumeroni?

Kun ilmoittaudut ensimmäistä kertaa Avoimen yliopiston kautta jollekin kurssille, sinulle luodaan Helsingin yliopiston opiskelijanumero. <i>**Varmista siis että olet ilmoittautunut kurssille, ennen kuin alat selvittää opiskelijanumeroasi.**</i>

Voit selvittää oman opiskelijanumerosi seuraavilla tavoilla: 

#### A) Sisu 

  - Jos sinulla on Helsingin yliopiston käyttäjätunnus, löydät opiskelijanumerosi Helsingin yliopiston opintotietojärjestelmä Sisusta omien tietojesi yhteydestä:
     
  - Kirjaudu Sisuun Helsingin yliopiston käyttäjätunnuksellasi.  
  - Valitse Omat tiedot 
  - Valitse välilehti: Henkilötiedot 

#### B) Ilmoittautumisen vahvistusviesti 

Kurssi-ilmoittautumisesi yhteydessä sinulle lähetään sähköpostivahvistus ilmoittamaasi sähköpostiosoitteeseen. Tässä viestissä on joko suoraan opiskelijanumerosi tai linkki, jonka kautta pääset sen näkemään.  

#### C) Yhteydenotto opintoneuvontaan 

Jos sinulla on ongelmia selvittää opiskelijanumerosi yllä olevilla tavoilla, voit myös lähettää sähköpostia opintoneuvontaan. <i>**Varmista että olet ilmoittautunut kurssille Avoimen yliopiston kautta ennen yhteydenottoa!**</i>

Kerro sähköpostissa  
- mille kurssille olet ilmoittautunut, 
- nimesi ja  
- syntymäaikasi. 

Opiskelijaneuvonnan sähköpostiosoite: avoin-student@helsinki.fi  
 
Ja vielä muistutus: <i>**varmista, että olet ilmoittautunut kurssille Avoimen yliopiston kautta ennen yhteydenottoa!**</i>

### Kurssitodistus

Riippumatta siitä, ilmoittaudutko Avoimen yliopiston kurssille ja teetkö kurssikokeen, saat ladattua kurssitodistuksen palautussovelluksesta siinä vaiheessa, kun tekemiesi tehtävien lukumäärä oikeuttaa kurssisuoritukseen.

![](../../images/0/29.png)

### Virallisen opintosuoritusotteen tilaaminen

Voit tilata virallisen opintosuoritusotteen heti, kun kurssisuorituksesi on rekisteröity (tiedot näkyvät esimerkiksi valtakunnallisessa [Oma Opintopolku](https://opintopolku.fi/oma-opintopolku/) –palvelussa). 

Tilaa suoritusote opiskelijapalveluiden [e-lomakkeen](https://elomake.helsinki.fi/lomakkeet/132797/lomake.html) kautta. Tällöin sähköinen opintosuoritusote toimitetaan sinulle sähköpostitse.

Toimittamalla virallisen opintosuoritusotteen omaan korkeakouluusi, saat opintopisteet rekisteröityä sinne. Huomaa, että jokainen korkeakoulu päättää itse toisessa korkeakoulussa suoritettujen opintojen hyväksiluvusta tutkintoon.

### Ei enää vuosittaisia versioita

Kurssilla ei ole enää vuosittaisia versiota. Kurssi on siis käynnissä koko ajan. Jokaista kurssin osaa päivitetään vähintään kerran vuodessa. Päivitykset ovat useimmiten pieniä, kirjastoversiot nostetaan ajan tasalle ja tekstiä parannellaan. Myös isompia päivityksiä tapahtuu välillä.

Muutoksista huolimatta <i>kaikki jo tehdyt palautukset säilyvät voimassa</i>, eli voit jatkaa kurssia päivityksistä huolimatta normaaliin tapaan.

Viimeaikaisia isompia muutoksia
- Osa 6 (12.10.2025): Jest korvattu Vitestillä. Axios korvattu Fetch API:lla.
- Osa 5 (21.8.2025): React päivitetty versioon 19. Proptypes ja forwardRef poistuneet käytöstä. Eslint-konfiguraatiot päivitetty
- Osa 4 (13.8.2025): Express päivitetty versioon 5 ja kirjasto express-async-errors poistettu osasta 4b
- Osa 9 (28.8.2024): Zod-kirjasto datan validointiin
- Osa 3 (20.6.2024): ESLint-konfiguraatiot päivitetty
- Osa 12 (21.3.2024): Create React app korvattu Vitellä
- Osat 3-5 (helmi-maaliskuu 2024): Testaukseen käytetyt kirjastot muutettu
- Osa 10 (26.2.2024): Kirjastoversiot päivitetty
- Osa 11 (16.1.2024): Esimerkkiprojektin riippuvuudet päivitetty

### Aiemmin suoritetun kurssin täydentäminen

Jos olet jo suorittanut kurssin joko MOOC:ina tai yliopiston kurssina, voit täydentää suoritustasi.

#### Full Stack Open ‑kurssin aiempien vuosien suorituksen täydentäminen

Voit jatkaa siitä, mihin jäit! Jos haluat tehdä kokonaan uudelleen jonkin osan tehtävät, ota yhteyttä email matti.luukkainen@helsinki.fi tai Discord <i>mluukkai</i>. Kerro GitHub-tunnuksesi sekä mitkä osat palautuksista haluat poistettavan.

#### Helsingin yliopiston kurssin täydentäminen

Jos haluat jatkaa Helsingin yliopiston kurssiversion suoritustasi, ota yhteyttä email matti.luukkainen@helsinki.fi tai Discord <i>mluukkai</i>. 

### Full stack ‑harjoitustyö

Avoimen yliopiston tarjonnassa on 5, 7 tai 10 opintopisteen laajuinen Full Stack ‑harjoitustyö, johon voit halutessasi osallistua suoritettuasi tämän kurssin vähintään 5 opintopisteen laajuisena.

Harjoitustyössä toteutetaan vapaavalintainen sovellus Reactilla ja/tai Nodella. Myös React Nativella toteutettu mobiilisovellus on mahdollinen.

Harjoitustyön opintopistemäärä määrittyy käytettyjen työtuntien mukaan – yksi opintopiste vastaa 17,5 tuntia. Työ arvostellaan skaalalla hyväksytty/hylätty.

Harjoitustyö on mahdollista tehdä myös pari- tai ryhmätyönä.

Harjoitustyöstä on lisää tietoa [täällä](https://github.com/fullstack-hy2020/misc/blob/master/harjoitustyo.md).

### Haastattelulupaus

Kurssin yhteistyökumppaneista [Houston Inc](https://houston-inc.com/), [Terveystalo](https://www.terveystalo.com/en/) ja [Smartly.io](https://www.smartly.io/) ovat antaneet <i>haastattelulupauksen</i> kaikille kurssin sekä projektin täydessä laajuudessa (14+10 op) suorittaneille.

Haastattelulupaus tarkoittaa, että opiskelija voi halutessaan ilmoittautua työhaastatteluun haastattelulupauksen antaneelle yritykselle. 

Kun olet suorittanut haastattelulupaukseen oikeuttavan määrän kurssia, ota yhteyttä matti.luukkainen@helsinki.fi ja pyydä ohjeita haastattelulupaukseen osallistumiseen.

### Alkutoimet

Tällä kurssilla suositellaan Chrome-selaimen käyttöä, sillä se tarjoaa parhaan välineistön web-sovelluskehitystä ajatellen.

Kurssin tehtävät palautetaan GitHubiin, joten Git tulee olla asennettuna ja sitä on syytä osata käyttää. Ohjeita Gitin käyttämiseen löytyy muun muassa [täältä](https://github.com/mluukkai/ohjelmistotekniikka-kevat2019/blob/master/tehtavat/viikko1.md#gitin-alkeet).

Asenna myös joku järkevä web-devausta tukeva tekstieditori. Enemmän kuin suositeltava valinta on [Visual Studio Code](https://code.visualstudio.com/).

Älä koodaa nanolla, Notepadilla tai Geditillä. Myöskään NetBeans ei ole omimmillaan web-devauksessa, ja se on myös turhan raskas verrattuna esim. Visual Studio Codeen.

Asenna koneeseesi heti myös [Node.js](https://nodejs.org/en/). Materiaalia ollaan päivittämässä Noden versioon v22. Osat 0-6 on tehty käyttäen Noden versiota 22, osa 10 käyttäen versiota 20.11.0 ja loput osat käyttäen versiota 18.13.0. Käytä aina vähintään yhtä tuoretta Node-versiota. Asennusohjeita on [Node.js:n sivuilla](https://nodejs.org/en/download/package-manager/).

Noden myötä koneelle asentuu myös [npm](https://www.npmjs.com/get-npm) (alunperin lyhennelmä <i>Node Package Manager</i> ‑nimelle), jota tulemme tarvitsemaan kurssin aikana aktiivisesti. Tuoreen Noden kera asentuu myös [npx](https://www.npmjs.com/package/npx), jota tarvitaan myös muutaman kerran.

### Typoja materiaalissa

Jos löydät kirjoitusvirheen tai jokin asia on ilmaistu epäselvästi tai kielioppisääntöjen vastaisesti, tee <i>pull request</i> repositoriossa <https://github.com/fullstack-hy2020/fullstack-hy2020.github.io> olevaan kurssimateriaaliin. Esim. tämän sivun Markdown-muotoinen lähdekoodi on osoitteessa <https://github.com/fullstack-hy2020/fullstack-hy2020.github.io/blob/source/src/content/0/fi/osa0a.md>

Materiaalin jokaisen osan alalaidassa on linkki <em>Ehdota muutosta materiaalin sisältöön</em>, jota klikkaamalla pääset suoraan editoimaan sivun lähdekoodia.

Materiaalissa on paljon linkkejä monenlaisiin syventäviin materiaaleihin. Jos löydät toimimattoman linkin, ehdota korvausta tai jos et löydä korvaavaa linkkiä, pingaa kurssihenkilökuntaa Discordissa.

</div>
