---
mainImage: ../../images/part-0.svg
part: 0
letter: a
---

<div class="content">

Kurssilla tutustutaan Javascriptilla tapahtuvaan moderniin websovelluskehitykseen. Pääpaino on React-kirjaston avulla toteutettavissa single page -sovelluksissa, ja niitä tukevissa Node.js:llä toteutetuissa REST-rajapinnoissa.

Kurssilla käsitellään myös sovellusten testaamista, konfigurointia ja suoritusympäristöjen hallintaa sekä NoSQL-tietokantoja.

### Oletetut esitiedot

Osallistujilta edellytetään vahvaa ohjelmointirutiinia, web-ohjelmoinnin ja tietokantojen perustuntemusta, git-versionhallintajärjestelmän peruskäytön hallintaa, kykyä pitkäjänteiseen työskentelyyn sekä valmiutta omatoimiseen tiedonhakuun ja ongelmanratkaisuun.

Osallistuminen ei kuitenkaan edellytä kurssilla käsiteltävien tekniikoiden tai Javascript-kielen hallintaa.

### Kurssimateriaali

Kurssimateriaali on tarkoitettu luettavaksi osa kerrallaan "alusta loppuun". Materiaalin seassa on tehtäviä, jotka on sijoiteltu siten, että kunkin tehtävän tekemiseen pitäsi olla riittävät tekniset valmiudet sitä edeltävässä materiaalissa. Voit siis tehdä tehtäviä sitä mukaan kun niitä tulee materiaalissa vastaan. Voi myös olla, että koko osan tehtävät kannattaa tehdä vasta sen jälkeen, kun olet ensin lukenut osan alusta loppuun kertaalleen. Useissa osissa tehtävät ovat samaa ohjelmaa laajentavia pienistä osista koostuvia kokonaisuuksia. Muutamia tehtävien ohjelmia kehitetään eteenpäin useamman osan aikana.

Materiaali perustuu muutamien osasta osaan vaihtuvien esimerkkiohjelmien asteittaiseen laajentamiseen. Materiaali toiminee parhaiten, jos kirjoitat samalla koodin myös itse ja teet koodiin myös pieniä modifikaatioita. Materiaalin käyttämien ohjelmien koodin eri vaiheiden tilanteita on tallennettu GitHubiin.

### Suoritustapa

Kurssi koostuu kahdeksasta osasta, joista ensimmäinen on historiallisista syistä numero nolla. Osat voi tulkita löyhästi ajatellen viikoiksi. Osia kuitenkin ilmestyy nopeampaa tahtia, ja suoritusnopeuskin on melko vapaa.

Materiaalissa osasta <i>n</i> osaan <i>n+1</i> eteneminen ei ole mielekästä ennen kuin riittävä osaaminen osan <i>n</i> asioista on saavutettu. Kurssilla sovelletaankin pedagogisin termein <i>tavoiteoppimista</i>, [engl. mastery learning](https://en.wikipedia.org/wiki/Mastery_learning) ja on tarkoitus, että etenet seuraavaan osaan vasta, kun riittävä määrä edellisen osan tehtävistä on tehty.

Oletuksena on, että teet kunkin osan tehtävistä <i>ainakin ne</i> jotka eivät ole merkattu tähdellä. Myös tähdellä merkatut tehtävät vaikuttavat arvosteluun, mutta niiden tekemättäjättäminen ei aiheuta liian suuria esteitä seuraavan osan (tähdellä merkkaamattomien) tehtävien tekemiseen.

Osien **deadlinet** ovat maanantaisin klo 23:59, poikkeuksena kaksi viimeistä osaa, joiden deadline on sunnuntai klo 23:59:

| osa            | deadline&nbsp; &nbsp; |
| -------------- | :-------------------: |
| osa 0 ja osa 1 |        ma 21.1.         |
| osa 2          |        ma 28.1.         |
| osa 3          |        ma 4.2.          |
| osa 4          |        ma 11.2.         |
| osa 5          |        ma 18.2.         |
| osa 6          |        su 3.3.          |
| osa 7          |        su 3.3.          |

Tämän kurssin eri osiin jo tehtyjen palautusten ajankäyttöstatistiikan näet [tehtävien palautussovelluksesta](https://studies.cs.helsinki.fi/courses/#fullstack2019).

### Arvosteluperusteet

Kurssin oletusarvoinen laajuus on 5 opintopistettä. Arvosana määräytyy kaikkien tehtyjen tehtävien perusteella, myös tähdellä merkityt "vapaavalintaiset" tehtävät siis vaikuttavat arvosanaan. Noin 50% deadlineen mennessä tehdyistä tehtävistä tuo arvosanan 1 ja 80% arvosanan 5. Kurssin lopussa on koe, joka on suoritettava hyväksytysti. Koe ei kuitenkaan vaikuta arvosanaan.

Kurssilta on mahdollisuus ansaita lisäopintopisteitä. Jos teet 87.5% kurssin tehtävistä, saat yhden lisäopintopisteen. Tekemällä 95% tehtävistä saat 2 lisäopintopistettä.

### Arvosanarajat

Tarkemmat arvosanarajat määritellään siinä vaiheessa kun kurssin tehtävien yhteenlaskettu määrä on selvillä.

### Aiemmin suoritetun kurssin täydentäminen

Jos olet suorittanut kurssin vuonna 2018 alle 7 opintoviikon laajuisena, voit täydentää nyt suoritustasi. Käytännössä täydentäminen tapahtuu siten, että voit korvata tämän kurssin <i>osia</i> viime vuonna suorittamasi kurssin aikana palauttamillasi osilla. Eli jos olet suorittanut kurssin esim. avoimen yliopiston kautta kolmen opintopisteen laajuisena, voit korvata vanhan suorituksesi osilla 0-3 tämän kurssin osat 0-3. 

Voit korvata ainoastaan kokonaisia osia, eli jos teit viime vuonna esim. 50% jonkin osan tehtävistä, et voi tällä kurssilla jatkaa samaa osaa. Viime vuotisten osien "hyväksiluku" tapahtuu tehtävien palautussovelluksella

### Tehtävien palauttaminen

Tehtävät palautetaan GitHubin kautta ja merkitsemällä tehdyt tehtävät [palautussovellukseen](https://studies.cs.helsinki.fi/courses/#fullstack2019).

Jos palautat eri osien tehtäviä samaan repositorioon, käytä järkevää hakemistojen nimentää.

Tehtävät palautetaan **yksi osa kerrallaan**. Kun olet palauttanut osan tehtävät, et voi enää palauttaa saman osan tekemättä jättämiäsi tehtäviä.

GitHubiin palautettuja tehtäviä tarkastetaan [MOSS](https://theory.stanford.edu/~aiken/moss/)-plagiaattitunnistusjärjestelmän avulla. Jos GitHubista löytyy kurssin mallivastausten koodia tai useammalta opiskelijalta löytyy samaa koodia, käsitellään tilanne yliopiston [vilppikäytäntöjen](https://blogs.helsinki.fi/alakopsaa/opettajalle/epailen-opiskelijaa-vilpista-mita-tehda/) mukaan.

Suurin osa tehtävistä on moniosaisia, samaa ohjelmaa pala palalta rakentavia kokonaisuuksia. Tälläisissä tehtäväsarjoissa ohjelman lopullisen version palauttaminen riittää, voit toki halutessasi tehdä commitin jokaisen tehtävän jälkeisestä tilanteesta, mutta se ei ole välttämätöntä.

### Alkutoimet

Tällä kurssilla suositellaan Chrome-selaimen käyttöä, sillä se tarjoaa parhaan välineistön web-sovelluskehitystä ajatellen.

Kurssin tehtävät palautetaan GitHubiin, joten Git tulee olla asennettuna ja sitä on syytä osata käyttää. Ohjeita Gitin käyttämiseen löytyy muunmuassa [täältä](https://github.com/mluukkai/ohjelmistotekniikka2018/blob/master/tehtavat/viikko1.md#gitin-alkeet).

Asenna myös joku järkevä web-devausta tukeva tekstieditori, enemmän kuin suositeltava valinta on [Visual studio code](https://code.visualstudio.com/).

Älä koodaa nanolla, Notepadilla tai Geditillä. Myöskään NetBeans ei ole omimmillaan Web-devauksessa ja se on myös turhan raskas verrattuna esim. Visual Studio Codeen.

Asenna koneeseesi heti myös [Node.js](https://nodejs.org/en/). Materiaali on tehty versiolla 10.0, älä asenna mitään sitä vanhempaa versiota, kaiken tosin pitäisi toimia jos konellasi on Nodesta vähintään versio 8.0. Asennusohjeita on koottu [tänne](/asennusohjeita).

Noden myötä koneelle asentuu myös Node package manager [npm](https://www.npmjs.com/get-npm), jota tulemme tarvitsemaan kurssin aikana aktiivisesti. Tuoreen noden kera asentuu myös [npx](https://www.npmjs.com/package/npx), jota tarvitaan myös muutaman kerran.

### Typoja materiaalissa

Jos löydät kirjoitusvirheen tai jokin asia on ilmaistu epäselvästi tai kielioppisääntöjen vastaisesti, tee <i>pull request</i> repositoriossa <https://github.com/fullstack-hy2019/fullstack-hy2019.github.io> olevaan kurssimateriaaliin. Esim. tämän sivun markdown-muotoinen lähdekoodi löytyy repositorion alta osoitteesta <https://github.com/fullstack-hy2019/fullstack-hy2019.github.io/blob/source/src/content/osa0/osa0a.md>

Materiaalin jokaisen osan alalaidassa on linkki <em>Ehdota muutosta materiaalin sisältöön</em>, jota klikkaamalla pääset suoraan editoimaan sivun lähdekoodia.

</div>
