---
mainImage: ../../../images/part-0.svg
part: 0
letter: a
lang: fi
---

<div class="content">

Kurssilla tutustutaan Javascriptilla tapahtuvaan moderniin websovelluskehitykseen. Pääpaino on React-kirjaston avulla toteutettavissa single page -sovelluksissa, ja niitä tukevissa Node.js:llä toteutetuissa REST-rajapinnoissa. Kurssilla on mukana GraphQL, joka on Facebookin kehittämä REST:ille vaihtoehtoinen tapa rajapintojen toteutukseen.

Kurssilla käsitellään myös sovellusten testaamista, konfigurointia ja suoritusympäristöjen hallintaa sekä NoSQL-tietokantoja.

### Oletetut esitiedot

Osallistujilta edellytetään vahvaa ohjelmointirutiinia, web-ohjelmoinnin ja tietokantojen perustuntemusta, git-versionhallintajärjestelmän peruskäytön hallintaa, kykyä pitkäjänteiseen työskentelyyn sekä valmiutta omatoimiseen tiedonhakuun ja ongelmanratkaisuun.

Osallistuminen ei kuitenkaan edellytä kurssilla käsiteltävien tekniikoiden tai Javascript-kielen hallintaa.

### Kurssimateriaali

Kurssimateriaali on tarkoitettu luettavaksi osa kerrallaan "alusta loppuun". Materiaalin seassa on tehtäviä, jotka on sijoiteltu siten, että kunkin tehtävän tekemiseen pitäisi olla riittävät tekniset valmiudet sitä edeltävässä materiaalissa. Voit siis tehdä tehtäviä sitä mukaan kun niitä tulee materiaalissa vastaan. Voi myös olla, että koko osan tehtävät kannattaa tehdä vasta sen jälkeen, kun olet ensin lukenut osan alusta loppuun kertaalleen. Useissa osissa tehtävät ovat samaa ohjelmaa laajentavia pienistä osista koostuvia kokonaisuuksia. Muutamia tehtävien ohjelmia kehitetään eteenpäin useamman osan aikana.

Materiaali perustuu muutamien osasta osaan vaihtuvien esimerkkiohjelmien asteittaiseen laajentamiseen. Materiaali toiminee parhaiten, jos kirjoitat samalla koodin myös itse ja teet koodiin myös pieniä modifikaatioita. Materiaalin käyttämien ohjelmien koodin eri vaiheiden tilanteita on tallennettu GitHubiin.

### Suoritustapa

Kurssi koostuu yhdeksästä osasta, joista ensimmäinen on historiallisista syistä numero nolla. Osat voi tulkita löyhästi ajatellen viikoiksi. Osia kuitenkin ilmestyy nopeampaa tahtia, ja suoritusnopeuskin on melko vapaa.

Materiaalissa osasta <i>n</i> osaan <i>n+1</i> eteneminen ei ole mielekästä ennen kuin riittävä osaaminen osan <i>n</i> asioista on saavutettu. Kurssilla sovelletaankin pedagogisin termein <i>tavoiteoppimista</i>, [engl. mastery learning](https://en.wikipedia.org/wiki/Mastery_learning) ja on tarkoitus, että etenet seuraavaan osaan vasta, kun riittävä määrä edellisen osan tehtävistä on tehty.

Oletuksena on, että teet kunkin osan tehtävistä <i>ainakin ne</i> jotka eivät ole merkattu tähdellä. Myös tähdellä merkatut tehtävät vaikuttavat arvosteluun, mutta niiden tekemättä jättäminen ei aiheuta liian suuria esteitä seuraavan osan (tähdellä merkkaamattomien) tehtävien tekemiseen.

Osien **deadlinet** ovat maanantaisin klo 23:59, poikkeuksena kaksi viimeistä osaa, joiden deadline on lauantaina klo 23:59.

| osa            | deadline&nbsp; &nbsp; |
| -------------- | :-------------------: |
| osa 0          |        ma 20.1.       |
| osa 1          |        ma 27.1.       |
| osa 2          |        ma 3.2.        |
| osa 3          |        ma 10.2.       |
| osa 4          |        ma 17.2.       |
| osa 5          |        ma 24.2.       |
| osa 6          |        ma 2.3.        |
| osa 7          |        su 15.3.       |
| osa 8          |        su 15.3.       |

Tämän kurssin eri osiin jo tehtyjen palautusten ajankäyttöstatistiikan näet [tehtävien palautussovelluksesta](https://study.cs.helsinki.fi/stats/courses/fullstack2020/).

### Arvosteluperusteet

Kurssin oletusarvoinen laajuus on 5 opintopistettä. Arvosana määräytyy kaikkien tehtyjen tehtävien perusteella, myös tähdellä merkityt "vapaavalintaiset" tehtävät siis vaikuttavat arvosanaan. Noin 50% deadlineen mennessä tehdyistä tehtävistä tuo arvosanan 1 ja 80% arvosanan 5. Kurssin lopussa on koe, joka on suoritettava hyväksytysti. Koe ei kuitenkaan vaikuta arvosanaan.

Koe pidetään tiistaina 3.3. klo 9 saleissa A111 ja B123. Kokeeseen on ilmoittauduttava viimeistään 10 päivää ennen koetta

Kurssilta on mahdollisuus ansaita lisäopintopisteitä. Jos teet 87.5% kurssin tehtävistä, saat yhden lisäopintopisteen. Tekemällä 95% tehtävistä saat 2 lisäopintopistettä. 

### Arvosanarajat: 5-7 opintopisteen suoritus

5-7 opintopisteen laajuisen suorituksen opintopistemäärä ja arvosana määräytyy kurssin <b>osien 0-7</b> kaikkien tehtyjen tehtävien (myös tähdellä merkittyjen) perusteella.

Arvosana/opintopisterajat:

| tehtäviä     | opintopisteitä | arvosana | 
| ------------ | :------------: | :------: |
| 139          |       7        | 5        |
| 128          |       6        | 5        |
| 117          |       5        | 5        |
| 106          |       5        | 4        |
| 95           |       5        | 3        |
| 84           |       5        | 2        |
| 73           |       5        | 1        |

Suoritukseen edellytetään tehtävien lisäksi hyväksytysti suoritettu koe.

#### 8 opintopisteen suoritus

Suorittamalla vähintään 22/26 tehtävää kurssin kahdeksannesta, GraphQL:ää käsittelevästä osasta, voit laajentaa suoritustasi yhdellä opintopisteellä. Voit tehdä GraphQL:ää käsittelevän osuuden periaatteessa jo osan 5 jälkeen sillä sen sisältö ei riipu osista 6 ja 7.

Osassa 8 tehtyjen tehtävien lukumäärä ei vaikuta kurssin 5-7 opintopisteen laajuuteen laskettavien tehtävien määrään.

### Aiemmin suoritetun kurssin täydentäminen

Jos olet jo suorittanut kurssin joko MOOC:ina tai Yliopiston kurssina, voit täydentää nyt suoritustasi.

Käytännössä täydentäminen tapahtuu siten, että voit korvata tämän kurssin <i>osia</i> aiemmin suorittamasi kurssin aikana palauttamillasi osilla. Eli jos olet suorittanut kurssin esim. avoimen yliopiston kautta kolmen opintopisteen laajuisena, voit korvata vanhan suorituksesi osilla 0-3 tämän kurssin osat 0-3. Ainoastaan peräkkäisten osien korvaaminen onnistuu, eli et voi korvata esim. osia 0 ja 2 mutta tehdä nyt osaa 1.

Voit korvata ainoastaan kokonaisia osia, eli jos teit aiemmalla kurssilla esim. 50% jonkin osan tehtävistä, et voi tällä kurssilla jatkaa samaa osaa.

Jos haluat hyväksilukea vanhan suorituksesi, lähetä emailia osoitteeseen matti.luukkainen@helsinki.fi 

Jos olet tehnyt jo aiemmin kurssin kokeen (poislukien avoimen yliopiston 3 opintopisteen laajuuden koe) ja laajennat suoritustasi nyt, ei uusi kokeeseen osallistuminen enää ole tarpeen.

### Tehtävien palauttaminen

Tehtävät palautetaan GitHubin kautta ja merkitsemällä tehdyt tehtävät [palautussovellukseen](https://study.cs.helsinki.fi/stats/courses/fullstack2020).

Jos palautat eri osien tehtäviä samaan repositorioon, käytä järkevää hakemistojen nimentää. Voit toki tehdä jokaisen osan omaankin repositorioon, kaikki käy. Jos käytät privaattirepositoriota tehtävien palautukseen, liitä repositoriolle collaboratoriksi <i>mluukkai</i>

Tehtävät palautetaan **yksi osa kerrallaan**. Kun olet palauttanut osan tehtävät, et voi enää palauttaa saman osan tekemättä jättämiäsi tehtäviä.

GitHubiin palautettuja tehtäviä tarkastetaan plagiaattitunnistusjärjestelmän avulla. Jos GitHubista löytyy kurssin mallivastausten koodia tai useammalta opiskelijalta löytyy samaa koodia, käsitellään tilanne yliopiston [vilppikäytäntöjen](https://blogs.helsinki.fi/alakopsaa/opettajalle/epailen-opiskelijaa-vilpista-mita-tehda/) mukaan.

Suurin osa tehtävistä on moniosaisia, samaa ohjelmaa pala palalta rakentavia kokonaisuuksia. Tällaisissa tehtäväsarjoissa ohjelman lopullisen version palauttaminen riittää, voit toki halutessasi tehdä commitin jokaisen tehtävän jälkeisestä tilanteesta, mutta se ei ole välttämätöntä.

### Full stack -harjoitustyö

Avoimen yliopiston tarjonnassa on 1-10 opintopisteen laajuinen Full Stack -harjoitustyö, johon voit halutessasi osallistua suoritettuasi tämän kurssin vähintään 5 opintopisteen laajuisena.

Harjoitustyössä toteutetaan vapaavalintainen sovellus Reactilla ja/tai Nodella. Myös React Nativella toteutettu mobiilisovellus on mahdollinen.

Harjoitustyön opintopistemäärä määrittyy käytettyjen työtuntien mukaan, yksi opintopiste vastaa 17.5 tuntia. Työ arvostellaan skaalalla hyväksytty/hylätty.

Harjoitustyö on mahdollista tehdä myös pari- tai ryhmätyönä.

Lisää tietoa harjoitustyöstä avoimen yliopiston [sivulla](https://courses.helsinki.fi/fi/aytkt21010).

### Alkutoimet

Tällä kurssilla suositellaan Chrome-selaimen käyttöä, sillä se tarjoaa parhaan välineistön web-sovelluskehitystä ajatellen.

Kurssin tehtävät palautetaan GitHubiin, joten Git tulee olla asennettuna ja sitä on syytä osata käyttää. Ohjeita Gitin käyttämiseen löytyy muun muassa [täältä](https://github.com/mluukkai/ohjelmistotekniikka-kevat2019/blob/master/tehtavat/viikko1.md#gitin-alkeet).

Asenna myös joku järkevä web-devausta tukeva tekstieditori, enemmän kuin suositeltava valinta on [Visual Studio Code](https://code.visualstudio.com/).

Älä koodaa nanolla, Notepadilla tai Geditillä. Myöskään NetBeans ei ole omimmillaan Web-devauksessa ja se on myös turhan raskas verrattuna esim. Visual Studio Codeen.

Asenna koneeseesi heti myös [Node.js](https://nodejs.org/en/). Materiaali on tehty versiolla 10.18, älä asenna mitään sitä vanhempaa versiota. Asennusohjeita on koottu [tänne](https://github.com/fullstack-hy2019/misc/blob/master/asennusohjeita.md).

Noden myötä koneelle asentuu myös [npm](https://www.npmjs.com/get-npm) (alunperin lyhennelmä <i>Node Package Manager</i> -nimelle), jota tulemme tarvitsemaan kurssin aikana aktiivisesti. Tuoreen Noden kera asentuu myös [npx](https://www.npmjs.com/package/npx), jota tarvitaan myös muutaman kerran.

### Typoja materiaalissa

Jos löydät kirjoitusvirheen tai jokin asia on ilmaistu epäselvästi tai kielioppisääntöjen vastaisesti, tee <i>pull request</i> repositoriossa <https://github.com/fullstack-hy2020/fullstack-hy2020.github.io> olevaan kurssimateriaaliin. Esim. tämän sivun Markdown-muotoinen lähdekoodi löytyy repositoryn alta osoitteesta <https://github.com/fullstack-hy2020/fullstack-hy2020.github.io/blob/source/src/content/0/fi/osa0a.md>

Materiaalin jokaisen osan alalaidassa on linkki <em>Ehdota muutosta materiaalin sisältöön</em>, jota klikkaamalla pääset suoraan editoimaan sivun lähdekoodia.

</div>
