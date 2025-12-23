---
mainImage: ../../../images/part-6.svg
part: 6
letter: d
lang: fi
---

<div class="content">

Tarkastellaan osan lopussa vielä muutamaa erilaista tapaa sovelluksen tilan hallintaan.

Jatketaan muistiinpano-sovelluksen parissa. Otetaan fokukseen palvelimen kanssa tapahtuva kommunikointi. Aloitetaan sovellus puhtaalta pöydältä. Ensimmäinen versio on seuraava:

```js
const App = () => {
  const addNote = async (event) => {
    event.preventDefault()
    const content = event.target.note.value
    event.target.note.value = ''
    console.log(content)
  }

  const toggleImportance = (note) => {
    console.log('toggle importance of', note.id)
  }

  const notes = []

  return (
    <div>
      <h2>Notes app</h2>
      <form onSubmit={addNote}>
        <input name="note" />
        <button type="submit">add</button>
      </form>
      {notes.map((note) => (
        <li key={note.id} onClick={() => toggleImportance(note)}>
          {note.content}
          <strong> {note.important ? 'important' : ''}</strong>
        </li>
      ))}
    </div>
  )
}

export default App
```

Alkuvaiheen koodi on GitHubissa repositorion [https://github.com/fullstack-hy2020/query-notes](https://github.com/fullstack-hy2020/query-notes/tree/part6-0) branchissa <i>part6-0</i>.

### Palvelimella olevan datan hallinta React Query ‑kirjaston avulla

Hyödynnämme nyt [React Query](https://tanstack.com/query/latest) ‑kirjastoa palvelimelta haettavan datan säilyttämiseen ja hallinnointiin. Kirjaston uusimmasta versiosta käytetään myös nimitystä TanStack Query mutta pitäydymme vanhassa tutussa nimessä.

Asennetaan kirjasto komennolla

```bash
npm install @tanstack/react-query
```

Tiedostoon <i>main.jsx</i> tarvitaan muutama lisäys, jotta kirjaston funktiot saadaan välitettyä koko sovelluksen käyttöön:

```js
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query' // highlight-line

import App from './App.jsx'

const queryClient = new QueryClient() // highlight-line

createRoot(document.getElementById('root')).render(
  <QueryClientProvider client={queryClient}> // highlight-line
    <App />
  </QueryClientProvider> // highlight-line
)
```

Käytetään aiemmista osista tuttuun tapaan [JSON Serveriä](https://github.com/typicode/json-server) simuloimaan backendin toimintaa. JSON Server on valmiiksi konfiguroituna esimerkkiprojektiin, ja projektin juuressa on tiedosto <i>db.json</i>, joka sisältää oletuksena kaksi muistiinpanoa. Voimme siis käynnistää serverin suoraan komennolla: 

```js
npm run server
```

Voimme nyt hakea muistiinpanot komponentissa <i>App</i>. Koodi laajenee seuraavasti:

```js
import { useQuery } from '@tanstack/react-query' // highlight-line

const App = () => {
  const addNote = async (event) => {
    event.preventDefault()
    const content = event.target.note.value
    event.target.note.value = ''
    console.log(content)
  }

  const toggleImportance = (note) => {
    console.log('toggle importance of', note.id)
  }

  // highlight-start
  const result = useQuery({
    queryKey: ['notes'],
    queryFn: async () => {
      const response = await fetch('http://localhost:3001/notes')
      if (!response.ok) {
        throw new Error('Failed to fetch notes')
      }
      return await response.json()
    }
  })
 
  console.log(JSON.parse(JSON.stringify(result)))
 
  if (result.isLoading) {
    return <div>loading data...</div>
  }
 
  const notes = result.data
  // highlight-end

  return (
    // ...
  )
}
```

Datan hakeminen palvelimelta tapahtuu edellisen luvun tapaan Fetch APIn <i>fetch</i>-metodilla. Metodikutsu on kuitenkin nyt kääritty [useQuery](https://tanstack.com/query/latest/docs/react/reference/useQuery)-funktiolla muodostetuksi [kyselyksi](https://tanstack.com/query/latest/docs/react/guides/queries). <i>useQuery</i>-funktiokutsun parametrina on olio, jolla on kentät <i>queryKey</i> ja <i>queryFn</i>. Kentän <i>queryKey</i> arvona on taulukko, joka sisältää merkkijonon <i>notes</i>. Se toimii [avaimena](https://tanstack.com/query/latest/docs/react/guides/query-keys) määriteltyyn kyselyyn, eli muistiinpanojen listaan.

Funktion <i>useQuery</i> paluuarvo on olio, joka kertoo kyselyn tilan. Konsoliin tehty tulostus havainnollistaa tilannetta:

![](../../images/6/60new.png)

Eli ensimmäistä kertaa komponenttia renderöitäessä kysely on vielä tilassa <i>loading</i>, eli siihen liittyvä HTTP-pyyntö on kesken. Tässä vaiheessa renderöidään ainoastaan:

```
<div>loading data...</div>
```

HTTP-pyyntö kuitenkin valmistuu niin nopeasti, että tekstiä eivät edes tarkkasilmäisimmät ehdi näkemään. Kun pyyntö valmistuu, renderöidään komponentti uudelleen. Kysely on toisella renderöinnillä tilassa <i>success</i>, ja kyselyolion kenttä <i>data</i> sisältää pyynnön palauttaman datan, eli muistiinpanojen listan, joka renderöidään ruudulle.

Sovellus siis hakee datan palvelimelta ja renderöi sen ruudulle käyttämättä ollenkaan luvuissa 2-5 käytettyjä Reactin hookeja <i>useState</i> ja <i>useEffect</i>. Palvelimella oleva data on nyt kokonaisuudessaan React Query ‑kirjaston hallinnoinnin alaisuudessa, ja sovellus ei tarvitse ollenkaan Reactin <i>useState</i>-hookilla määriteltyä tilaa!

Siirretään varsinaisen HTTP-pyynnön tekevä funktio omaan tiedostoonsa <i>src/requests.js</i>:

```js
const baseUrl = 'http://localhost:3001/notes'

export const getNotes = async () => {
  const response = await fetch(baseUrl)
  if (!response.ok) {
    throw new Error('Failed to fetch notes')
  }
  return await response.json()
}
```

Komponentti <i>App</i> yksinkertaistuu nyt seuraavasti:

```js
import { useQuery } from '@tanstack/react-query'
import { getNotes } from './requests' // highlight-line

const App = () => {
  // ...

  const result = useQuery({
    queryKey: ['notes'],
    queryFn: getNotes // highlight-line
  })

  // ...
}
```

Sovelluksen tämän hetken koodi on [GitHubissa](https://github.com/fullstack-hy2020/query-notes/tree/part6-1) branchissa <i>part6-1</i>.

### Datan vieminen palvelimelle React Queryn avulla

Data haetaan jo onnistuneesti palvelimelta. Huolehditaan seuraavaksi siitä, että lisätty ja muutettu data tallennetaan palvelimelle. Aloitetaan uusien muistiinpanojen lisäämisestä.

Tehdään tiedostoon <i>requests.js</i> funktio <i>createNote</i> uusien muistiinpanojen talletusta varten:

```js
const baseUrl = 'http://localhost:3001/notes'

export const getNotes = async () => {
  const response = await fetch(baseUrl)
  if (!response.ok) {
    throw new Error('Failed to fetch notes')
  }
  return await response.json()
}

// highlight-start
export const createNote = async (newNote) => {
  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newNote)
  }
 
  const response = await fetch(baseUrl, options)
 
  if (!response.ok) {
    throw new Error('Failed to create note')
  }
 
  return await response.json()
}
// highlight-end
```

Komponentti <i>App</i> muuttuu seuraavasti

```js
import { useQuery, useMutation } from '@tanstack/react-query' // highlight-line
import { getNotes, createNote } from './requests' // highlight-line

const App = () => {
  //highlight-start
  const newNoteMutation = useMutation({
    mutationFn: createNote,
  })
  // highlight-end

  const addNote = async (event) => {
    event.preventDefault()
    const content = event.target.note.value
    event.target.note.value = ''
    newNoteMutation.mutate({ content, important: true }) // highlight-line
  }

  //

}
```

Uuden muistiinpanon luomista varten määritellään siis [mutaatio](https://tanstack.com/query/latest/docs/react/guides/mutations) funktion [useMutation](https://tanstack.com/query/latest/docs/react/reference/useMutatio) avulla:

```js
const newNoteMutation = useMutation({
  mutationFn: createNote,
})
```

Parametrina on tiedostoon <i>requests.js</i> lisäämämme funktio, joka lähettää Fetch APIn avulla uuden muistiinpanon palvelimelle.

Tapahtumakäsittelijä <i>addNote</i> suorittaa mutaation kutsumalla mutaatio-olion funktiota <i>mutate</i> ja antamalla uuden muistiinpanon parametrina:

```js
newNoteMutation.mutate({ content, important: true })
```

Ratkaisumme on hyvä. Paitsi se ei toimi. Uusi muistiinpano kyllä tallettuu palvelimelle, mutta se ei päivity näytölle.

Jotta saamme renderöityä myös uuden muistiinpanon, meidän on kerrottava React Querylle, että kyselyn, jonka avaimena on merkkijono <i>notes</i>, vanha tulos tulee mitätöidä eli
[invalidoida](https://tanstack.com/query/latest/docs/react/guides/invalidations-from-mutations).

Invalidointi on onneksi helppoa, se voidaan tehdä kytkemällä mutaatioon sopiva <i>onSuccess</i>-takaisinkutsufunktio:

```js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query' // highlight-line
import { getNotes, createNote } from './requests'

const App = () => {
  const queryClient = useQueryClient() // highlight-line

  const newNoteMutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {  // highlight-line
      queryClient.invalidateQueries({ queryKey: ['notes'] }) // highlight-line
    }, // highlight-line
  })

  // ...
}
```

Kun mutaatio on nyt suoritettu onnistuneesti, suoritetaan funktiokutsu

```js
queryClient.invalidateQueries({ queryKey: ['notes'] })
```

Tämä taas saa aikaan sen, että React Query päivittää automaattisesti kyselyn, jonka avain on  <i>notes</i> eli hakee muistiinpanot palvelimelta. Tämän seurauksena sovellus renderöi ajantasaisen palvelimella olevan tilan, eli myös lisätty muistiinpano renderöityy.

Toteutetaan vielä muistiinpanojen tärkeyden muutos. Lisätään tiedostoon <i>requests.js</i> muistiinpanojen päivityksen hoitava funktio:

```js
export const updateNote = async (updatedNote) => {
  const options = {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedNote)
  }

  const response = await fetch(`${baseUrl}/${updatedNote.id}`, options)

  if (!response.ok) {
    throw new Error('Failed to update note')
  }

  return await response.json()
}
```

Myös muistiinpanon päivittäminen tapahtuu mutaation avulla. Komponentti <i>App</i> laajenee seuraavasti:

```js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getNotes, createNote, updateNote } from './requests' // highlight-line

const App = () => {
  const queryClient = useQueryClient()

  const newNoteMutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] })
    }
  })

  // highlight-start
  const updateNoteMutation = useMutation({
    mutationFn: updateNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] })
    }
  })
  // highlight-end

  const addNote = async (event) => {
    event.preventDefault()
    const content = event.target.note.value
    event.target.note.value = ''
    newNoteMutation.mutate({ content, important: true })
  }

  const toggleImportance = (note) => {
    updateNoteMutation.mutate({...note, important: !note.important }) // highlight-line
  }

  // ...
}
```

Eli jälleen luotiin mutaatio, joka invalidoi kyselyn <i>notes</i>, jotta päivitetty muistiinpano saadaan renderöitymään oikein. Mutaation käyttö on helppoa, metodi <i>mutate</i> saa parametrikseen muistiinpanon, jonka tärkeys on vaihdettu vanhan arvon negaatioon.

Sovelluksen tämän hetken koodi on [GitHubissa](https://github.com/fullstack-hy2020/query-notes/tree/part6-2) branchissa <i>part6-2</i>.

### Suorituskyvyn optimointi

Sovellus toimii hyvin, ja koodikin on suhteellisen yksinkertaista. Erityisesti yllättää muistiinpanojen listan muutoksen toteuttamisen helppous. Esim. kun muutamme muistiinpanon tärkeyttä, riittää kyselyn <i>notes</i> invalidointi siihen, että sovelluksen data päivittyy:

```js
const updateNoteMutation = useMutation({
  mutationFn: updateNote,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['notes'] }) // highlight-line
  }
})
```

Tästä on toki seurauksena se, että sovellus tekee muistiinpanon muutoksen aiheuttavan PUT-pyynnön jälkeen uuden GET-pyynnön, jonka avulla se hakee palvelimelta kyselyn datan:

![](../../images/6/61new.png)

Jos sovelluksen hakema datamäärä ei ole suuri, ei asialla ole juurikaan merkitystä. Selainpuolen toiminnallisuuden kannaltahan ylimääräisen HTTP GET ‑pyynnön tekeminen ei juurikaan haittaa, mutta joissain tilanteissa se saattaa rasittaa palvelinta.

Tarvittaessa on myös mahdollista optimoida suorituskykyä [päivittämällä itse](https://tanstack.com/query/latest/docs/react/guides/updates-from-mutation-responses) React Queryn ylläpitämää kyselyn tilaa.

Muutos uuden muistiinpanon lisäävän mutaation osalta on seuraavassa:

```js
const App = () => {
  const queryClient = useQueryClient()

  const newNoteMutation = useMutation({
    mutationFn: createNote,
    // highlight-start
    onSuccess: (newNote) => {
      const notes = queryClient.getQueryData(['notes'])
      queryClient.setQueryData(['notes'], notes.concat(newNote))
    // highlight-end
    }
  })

  // ...
}
```

Eli <i>onSuccess</i>-takaisinkutsussa ensin luetaan <i>queryClient</i>-olion avulla olemassaoleva kyselyn <i>notes</i> tila ja päivitetään sitä lisäämällä mukaan uusi muistiinpano, joka saadaan takaisunkutsufunktion parametrina. Parametrin arvo on funktion <i>createNote</i> palauttama arvo, jonka määriteltiin tiedostossa <i>requests.js</i> seuraavasti:

```js
export const createNote = async (newNote) => {
  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newNote)
  }

  const response = await fetch(baseUrl, options)

  if (!response.ok) {
    throw new Error('Failed to create note')
  }

  return await response.json()
}
```

Samankaltainen muutos olisi suhteellisen helppoa tehdä myös muistiinpanon tärkeyden muuttavaan mutaatioon, jätämme sen kuitenkin vapaaehtoiseksi harjoitustehtäväksi.

Kiinnitetään lopuksi huomio erikoiseen yksityiskohtaan. React Query hakee kaikki muistiinpanot uudestaan, jos siirrymme selaimessa toiselle välilehdelle ja sen jälkeen palaamme sovelluksen välilehdelle. Tämän voi havaita Developer Consolen network-välilehdeltä:

![](../../images/6/62new-2025.png)

Mistä on kyse? Hieman [dokumentaatiota](https://tanstack.com/query/latest/docs/react/reference/useQuery)
tutkimalla huomataan, että React Queryn kyselyjen oletusarvoinen toiminnallisuus on se, että kyselyt (joiden tila on <i>stale</i>) päivitetään kun <i>window focus</i> vaihtuu. Voimme halutessamme kytkeä toiminnallisuuden pois luomalla kyselyn seuraavasti:

```js
const App = () => {
  // ...
  const result = useQuery({
    queryKey: ['notes'],
    queryFn: getNotes,
    refetchOnWindowFocus: false // highlight-line
  })

  // ...
}
```

Konsoliin tehtävillä tulostuksilla voit tarkkailla sitä miten usein React Query aiheuttaa sovelluksen uudelleenrenderöinnin. Nyrkkisääntönä on se, että uudelleenrenderöinti tapahtuu vähintään aina kun sille on tarvetta, eli kun kyselyn tila muuttuu. Voit lukea lisää asiasta esim. [täältä](https://tkdodo.eu/blog/react-query-render-optimizations).

Sovelluksen lopullinen koodi on [GitHubissa](https://github.com/fullstack-hy2020/query-notes/tree/part6-3) branchissa <i>part6-3</i>.

React Query on monipuolinen kirjasto joka jo nyt nähdyn perusteella yksinkertaistaa sovellusta. Tekeekö React Query monimutkaisemmat tilanhallintaratkaisut kuten esim. Reduxin tarpeettomaksi? Ei. React Query voi joissain tapauksissa korvata osin sovelluksen tilan, mutta kuten [dokumentaatio](https://tanstack.com/query/latest/docs/react/guides/does-this-replace-client-state) toteaa

- React Query is a <i>server-state library</i>, responsible for managing asynchronous operations between your server and client
- Redux, etc. are <i>client-state libraries</i> that can be used to store asynchronous data, albeit inefficiently when compared to a tool like React Query

React Query on siis kirjasto, joka ylläpitää frontendissä <i>palvelimen tilaa</i>, eli toimii ikäänkuin välimuistina sille, mitä palvelimelle on talletettu. React Query yksinkertaistaa palvelimella olevan datan käsittelyä, ja voi joissain tapauksissa eliminoida tarpeen sille, että palvelimella oleva data haettaisiin frontendin tilaan. Useimmat React-sovellukset tarvitsevat palvelimella olevan datan tilapäisen tallettamisen lisäksi myös jonkun ratkaisun sille, miten frontendin muu tila (esim. lomakkeiden tai notifikaatioiden tila) käsitellään.

</div>

<div class="tasks">

### Tehtävät 6.20.-6.22.

Tehdään nyt anekdoottisovelluksesta uusi, React Query ‑kirjastoa hyödyntävä versio. Ota lähtökohdaksesi
[täällä](https://github.com/fullstack-hy2020/query-anecdotes) oleva projekti. Projektissa on valmiina asennettuna JSON Server, jonka toimintaa on hieman modifioitu. Käynnistä palvelin komennolla <i>npm run server</i>.

Käytä pyyntöjen tekemiseen Fetch APIa. 

HUOM. Osa 6 on päivitetty 12.10.2025 käyttämään Fetch APIa, joka esitellään osassa 6c. Jos olet aloittanut osan läpikäymisen ennen tätä päivämäärää, voit halutessasi käyttää tehtävissä vielä Axiosta.

#### Tehtävä 6.20

Toteuta anekdoottien hakeminen palvelimelta React Queryn avulla.

Sovelluksen tulee toimia siten, että jos palvelimen kanssa kommunikoinnissa ilmenee ongelmia, tulee näkyviin ainoastaan virhesivu:

![](../../images/6/65new.png)

Löydät ohjeen virhetilanteen havaitsemiseen [täältä](https://tanstack.com/query/latest/docs/react/guides/queries).

Voit simuloida palvelimen kanssa tapahtuvaa ongelmaa esim. sammuttamalla JSON Serverin. Huomaa, että kysely on ensin jonkin aikaa tilassa <i>isLoading</i> sillä epäonnistuessaan React Query yrittää pyyntöä muutaman kerran ennen kuin se toteaa, että pyyntö ei onnistu. Voit halutessasi määritellä, että uudelleenyrityksiä ei tehdä:

```js
const result = useQuery(
  {
    queryKey: ['anecdotes'],
    queryFn: getAnecdotes,
    retry: false
  }
)
```

tai, että pyyntöä yritetään uudelleen esim. vain kerran:

```js
const result = useQuery(
  {
    queryKey: ['anecdotes'],
    queryFn: getAnecdotes,
    retry: 1
  }
)
```

#### Tehtävä 6.21

Toteuta uusien anekdoottien lisääminen palvelimelle React Queryn avulla. Sovelluksen tulee automaattisesti renderöidä lisätty anekdootti. Huomaa, että anekdootin sisällön pitää olla vähintään 5 merkkiä pitkä, muuten palvelin ei hyväksy POST pyyntöä. Virheiden käsittelystä ei tarvitse nyt välittää.

#### Tehtävä 6.22

Toteuta anekdoottien äänestäminen hyödyntäen jälleen React Queryä. Sovelluksen tulee automaattisesti renderöidä äänestetyn anekdootin kasvatettu äänimäärä.

</div>

<div class="content">

### useReducer

Vaikka sovellus siis käyttäisi React Queryä, tarvitaan siis yleensä jonkinlainen ratkaisu selaimen muun tilan (esimerkiksi lomakkeiden) hallintaan. Melko usein <i>useState</i>:n avulla muodostettu tila on riittävä ratkaisu. Reduxin käyttö on toki mahdollista mutta on olemassa myös muita vaihtoehtoja.

Tarkastellaan yksinkertaista laskurisovellusta. Sovellus näyttää laskurin arvon, ja tarjoaa kolme nappia laskurin tilan päivittämiseen:

![](../../images/6/63new.png)

Toteutetaan laskurin tilan hallinta Reactin sisäänrakennetun [useReducer](https://react.dev/reference/react/useReducer)-hookin tarjoamalla Reduxin kaltaisella tilanhallintamekanismilla. 

Sovelluksen lähtötilanteen koodi on [GitHubissa](https://github.com/fullstack-hy2020/hook-counter/tree/part6-1) branchissa <i>part6-1</i>. Tiedosto <i>App.jsx</i> näyttää seuraavalta:

```js
import { useReducer } from 'react'

const counterReducer = (state, action) => {
  switch (action.type) {
    case 'INC':
      return state + 1
    case 'DEC':
      return state - 1
    case 'ZERO':
      return 0
    default:
      return state
  }
}

const App = () => {
  const [counter, counterDispatch] = useReducer(counterReducer, 0)

  return (
    <div>
      <div>{counter}</div>
      <div>
        <button onClick={() => counterDispatch({ type: 'INC' })}>+</button>
        <button onClick={() => counterDispatch({ type: 'DEC' })}>-</button>
        <button onClick={() => counterDispatch({ type: 'ZERO' })}>0</button>
      </div>
    </div>
  )
}

export default App
```

<i>useReducer</i> siis tarjoaa mekanismin, jonka avulla sovellukselle voidaan luoda tila. Parametrina tilaa luotaessa annetaan tilan muutosten hallinnan hoitava reduserifunktio, sekä tilan alkuarvo:

```js
const [counter, counterDispatch] = useReducer(counterReducer, 0)
```

Tilan muutokset hoitava reduserifunktio on täysin samanlainen Reduxin reducerien kanssa, eli funktio saa parametrikseen nykyisen tilan, sekä tilanmuutoksen tekemän actionin. Funktio palauttaa actionin tyypin ja mahdollisen sisällön perusteella päivitetyn uuden tilan:

```js
const counterReducer = (state, action) => {
  switch (action.type) {
    case 'INC':
      return state + 1
    case 'DEC':
      return state - 1
    case 'ZERO':
      return 0
    default:
      return state
  }
}
```

Esimerkissämme actioneilla ei ole muuta kuin tyyppi. Jos actionin tyyppi on <i>INC</i>, kasvattaa se tilan arvoa yhdellä jne. Reduxin reducerien tapaan actionin mukana voi myös olla mielivaltaista dataa, joka yleensä laitetaan actionin kenttään <i>payload</i>.

Funktio <i>useReducer</i> palauttaa taulukon, jonka kautta päästään käsiksi tilan nykyiseen arvoon (taulukon ensimmäinen alkio), sekä <i>dispatch</i>-funktioon (taulukon toinen alkio), jonka avulla tilaa voidaan muuttaa:

```js
const App = () => {
  const [counter, counterDispatch] = useReducer(counterReducer, 0)  // highlight-line

  return (
    <div>
      <div>{counter}</div> // highlight-line
      <div>
        <button onClick={() => counterDispatch({ type: 'INC' })}>+</button> // highlight-line
        <button onClick={() => counterDispatch({ type: 'DEC' })}>-</button>
        <button onClick={() => counterDispatch({ type: 'ZERO' })}>0</button>
      </div>
    </div>
  )
}
```

Tilan muutos tapahtuu siis täsmälleen kuten Reduxia käytettäessä, dispatch-funktiolle annetaan parametriksi sopiva tilaa muuttava action:

```js
counterDispatch({ type: "INC" })
```

### Tilan välittäminen propseina

Kun sovellus jaetaan useaan komponenttiin, laskurin arvo sekä sen hallintaan käytettävä dispatch-funktio on välitettävä jotenkin myös muille komponenteille. Eräs ratkaisu on välittää nämä tuttuun tapaan propseina.

Määritellään sovellukselle erillinen <i>Display</i>-komponentti, jonka vastuulla on laskurin arvon näyttäminen. Tiedoston <i>src/components/Display.jsx</i> sisällöksi tulee:

```js
const Display = ({ counter }) => {
  return <div>{counter}</div>
}

export default Display
```

Määritellään lisäksi <i>Button</i>-komponentti, joka vastaa sovelluksen painikkeista:

```js
const Button = ({ dispatch, type, label }) => {
  return (
    <button onClick={() => dispatch({ type })}>
      {label}
    </button>
  )
}

export default Button
```

Tiedosto <i>App.jsx</i> muuttuu seuraavasti:

```js
import { useReducer } from 'react'

import Button from './components/Button' // highlight-line
import Display from './components/Display' // highlight-line

const counterReducer = (state, action) => {
  switch (action.type) {
    case 'INC':
      return state + 1
    case 'DEC':
      return state - 1
    case 'ZERO':
      return 0
    default:
      return state
  }
}

const App = () => {
  const [counter, counterDispatch] = useReducer(counterReducer, 0)

  return (
    <div>
      <Display counter={counter} /> // highlight-line
      <div>
        // highlight-start
        <Button dispatch={counterDispatch} type="INC" label="+" />
        <Button dispatch={counterDispatch} type="DEC" label="-" />
        <Button dispatch={counterDispatch} type="ZERO" label="0" />
        // highlight-end
      </div>
    </div>
  )
}
```

Sovellus on nyt jaettu useampaan komponenttiin. Tilanhallinta on määritelty tiedostossa <i>App.jsx</i>, josta tilanhallintaan tarvittavat arvot ja funktiot välitetään lapsikomponenteille propseina.

Ratkaisu toimii, mutta ei ole optimaalinen. Jos komponenttirakenne monimutkaistuu, tulee esim dispatcheria välittää propsien avulla monen komponentin kautta sitä tarvitseville komponenteille siitäkin huolimatta, että komponenttipuussa välissä olevat komponentit eivät dispatcheria tarvitsisikaan. Tästä ilmiöstä käytetään nimitystä <i>prop drilling</i>.

### Kontekstin käyttö tilan välittämiseen

Reactin sisäänrakennettu [Context API](https://react.dev/learn/passing-data-deeply-with-context) tuo tilanteeseen ratkaisun. Reactin konteksti on eräänlainen sovelluksen globaali tila, johon on mahdollista antaa suora pääsy mille tahansa komponentille.

Luodaan sovellukseen nyt konteksti, joka tallettaa laskurin tilanhallinnan.

Konteksti luodaan Reactin hookilla [createContext](https://react.dev/reference/react/createContext). Luodaan konteksti tiedostoon <i>src/CounterContext.jsx</i>:

```js
import { createContext } from 'react'

const CounterContext = createContext()

export default CounterContext
```

Komponentti <i>App</i> voi nyt <i>tarjota</i> kontekstin sen alikomponenteille seuraavasti:

```js
import { useReducer } from 'react'

import Button from './components/Button'
import Display from './components/Display'
import CounterContext from './CounterContext' // highlight-line

// ...

const App = () => {
  const [counter, counterDispatch] = useReducer(counterReducer, 0)

  return (
    <CounterContext.Provider value={{ counter, counterDispatch }}>  // highlight-line
      <Display /> // highlight-line
      <div>
        // highlight-start
        <Button type="INC" label="+" />
        <Button type="DEC" label="-" />
        <Button type="ZERO" label="0" />
        // highlight-end
      </div>
    </CounterContext.Provider> // highlight-line
  )
}
```

Kontekstin tarjoaminen siis tapahtuu käärimällä lapsikomponentit komponentin <i>CounterContext.Provider</i> sisälle ja asettamalla kontekstille sopiva arvo.

Kontekstin arvoksi annetaan nyt olio, jolla on attribuutit <i>counter</i> ja <i>counterDispatch</i>. Kenttä <i>counter</i> sisältää laskimen arvon ja <i>counterDispatch</i> arvon muuttamiseen käytettävän <i>dispatch</i>-funktion.

Muut komponentit saavat nyt kontekstin käyttöön hookin [useContext](https://react.dev/reference/react/useContext) avulla. <i>Display</i>-komponentti muuttuu seuraavasti:

```js
import { useContext } from 'react' // highlight-line
import CounterContext from './CounterContext' // highlight-line

const Display = () => {  // highlight-line
  const { counter } = useContext(CounterContext) // highlight-line

  return <div>{counter}</div>
}
```

<i>Display</i>-komponentti ei siis tarvitse enää propseja, vaan se saa laskurin arvon käyttöönsä kutsumalla <i>useContext</i>-hookia, jolle se antaa argumentiksi <i>CounterContext</i>-olion.

Vastaavasti <i>Button</i>-komponentti muuttuu muotoon: 

```js
import { useContext } from 'react' // highlight-line
import CounterContext from './CounterContext' // highlight-line

const Button = ({ type, label }) => {  // highlight-line
  const { counterDispatch } = useContext(CounterContext) // highlight-line

  return (
    <button onClick={() => counterDispatch({ type })}> // highlight-line
      {label}
    </button>
  )
}
```

Komponentit saavat siis näin tietoonsa kontekstin tarjoajan siihen asettaman sisällön. Tässä tapauksessa kontekstina on olio, jolla on laskurin arvoa kuvaava kenttä <i>counter</i> sekä laskurin tilaa muuttavaa dispatch-funktiota kuvaava kenttä <i>counterDispatch</i>. 

Komponentit ottavat käyttöönsä tarvitsemansa attribuutit käyttäen hyödykseen JavaScriptin destrukturointisyntaksia:

```js
const { counter } = useContext(CounterContext)
```

Sovelluksen tämänhetkinen koodi on GitHubissa repositorion [https://github.com/fullstack-hy2020/hook-counter](https://github.com/fullstack-hy2020/hook-counter/tree/part6-2) branchissa <i>part6-2</i>.

### Laskurikontekstin määrittely omassa tiedostossa

Sovelluksessamme on vielä sellainen ikävä piirre, että laskurin tilanhallinnan toiminnallisuus on määritelty osin komponentissa <i>App</i>. Siirretään nyt kaikki laskuriin liittyvä tiedostoon <i>CounterContext.jsx</i>:

```js
import { createContext, useReducer } from 'react'

const counterReducer = (state, action) => {
  switch (action.type) {
    case 'INC':
      return state + 1
    case 'DEC':
      return state - 1
    case 'ZERO':
      return 0
    default:
      return state
  }
}

const CounterContext = createContext()

export const CounterContextProvider = (props) => {
  const [counter, counterDispatch] = useReducer(counterReducer, 0)

  return (
    <CounterContext.Provider value={{ counter, counterDispatch }}>
      {props.children}
    </CounterContext.Provider>
  )
}

export default CounterContext
```

Tiedosto exporttaa nyt kontekstia vastaavan olion <i>CounterContext</i> lisäksi komponentin <i>CounterContextProvider</i> joka on käytännössä kontekstin tarjoaja (context provider), jonka arvona on laskuri ja sen tilanhallintaan käytettävä dispatcheri.

Otetaan kontekstin tarjoaja käyttöön tiedostossa <i>main.jsx</i>

```js
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import App from './App'
import { CounterContextProvider } from './CounterContext' // highlight-line

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CounterContextProvider> // highlight-line
      <App />
    </CounterContextProvider> // highlight-line
  </StrictMode>
)

```

Nyt laskurin arvon ja toiminnallisuuden määrittelevä konteksti on <i>kaikkien</i> sovelluksen komponenttien käytettävissä.

Komponentti <i>App</i> yksinkertaistuu seuraavaan muotoon:

```js
import Button from './components/Button'
import Display from './components/Display'

const App = () => {
  return (
    <div>
      <Display />
      <div>
        <Button type="INC" label="+" />
        <Button type="DEC" label="-" />
        <Button type="ZERO" label="0" />
      </div>
    </div>
  )
}

export default App
```

Kontekstia käytetään edelleen samalla tavalla, eikä muihin kompoentteihin tarvita muutoksia. Esimerkiksi komponentti <i>Button</i> on siis määritelty seuraavasti:

```js
import { useContext } from 'react'
import CounterContext from '../CounterContext'

const Button = ({ type, label }) => {
  const { counterDispatch } = useContext(CounterContext)

  return (
    <button onClick={() => counterDispatch({ type })}>
      {label}
    </button>
  )
}

export default Button
```

Ratkaisu on varsin tyylikäs. Koko sovelluksen tila eli laskurin arvo ja sen hallintaan tarkoitettu koodi on nyt eristetty tiedostoon <i>CounterContext</i>. Komponentit saavat käyttöönsä juuri tarvitsemansa osan kontekstia <i>useContext</i>-hookia ja JavaScriptin destrukturointi-syntaksia käyttäen.

Sovelluksen lopullinen koodi on GitHubissa repositorion [https://github.com/fullstack-hy2020/hook-counter](https://github.com/fullstack-hy2020/hook-counter/tree/part6-3) branchissa <i>part6-3</i>.

</div>


<div class="tasks">

### Tehtävät 6.23.-6.24.

#### Tehtävä 6.23.

Sovelluksessa on valmiina komponentti <i>Notification</i> käyttäjälle tehtävien notifikaatioiden näyttämistä varten.

Toteuta sovelluksen notifikaation tilan hallinta useReducer-hookin ja contextin avulla. Notifikaatio kertoo kun uusi anekdootti luodaan tai anekdoottia äänestetään:

![](../../images/6/66new.png)

Notifikaatio näytetään viiden sekunnin ajan.

#### Tehtävä 6.24.

Kuten tehtävässä 6.20 todettiin, palvelin vaatii, että lisättävän anekdootin sisällön pituus on vähintään 5 merkkiä. Toteuta nyt lisäämisen yhteyteen virheenkäsittely. Käytännössä riittää, että näytät epäonnistuneen lisäyksen yhteydessä käyttäjälle notifikaation:

![](../../images/6/67new.png)

Virhetilanne kannattaa käsitellä sille rekisteröidyssä takaisinkutsufunktiossa, ks [täältä](https://tanstack.com/query/latest/docs/react/reference/useMutation) miten rekisteröit funktion.

Tämä oli osan viimeinen tehtävä ja on aika pushata koodi GitHubiin sekä merkata tehdyt tehtävät [palautussovellukseen](https://studies.cs.helsinki.fi/stats/courses/fullstackopen).

</div>

<div class="content">

### Tilanhallintaratkaisun valinta

Luvuissa 1-5 kaikki sovelluksen tilanhallinta hoidettiin Reactin hookin <i>useState</i> avulla. Backendiin tehtävät asynkroniset kutsut edellyttivät joissain tilanteissa hookin <i>useEffect</i> käyttöä. Mitään muuta ei periaatteessa tarvita.

Hienoisena ongelmana <i>useState</i>-hookilla luotuun tilaan perustuvassa ratkaisussa on se, että jos jotain osaa sovelluksen tilasta tarvitaan useissa sovelluksen komponenteissa, tulee tila ja sen muuttamiseksi tarvittavat funktiot välittää propsien avulla kaikille tilaa käsitteleville komponenteille. Joskus propseja on välitettävä usean komponentin läpi, ja voi olla, että matkan varrella olevat komponentit eivät edes ole tilasta millään tavalla kiinnostuneita. Tästä hieman ikävästä ilmiöstä käytetään nimitystä <i>prop drilling</i>.

Aikojen saatossa React-sovellusten tilanhallintaan on kehitelty muutamiakin vaihtoehtoisia ratkaisuja, joiden avulla ongelmallisia tilanteinta (esim. prop drilling) saadaan helpotettua. Mikään ratkaisu ei kuitenkaan ole ollut "lopullinen", kaikilla on omat hyvät ja huonot puolensa, ja uusia ratkaisuja kehitellään koko ajan.

Aloittelijaa ja kokenuttakin web-kehittäjää tilanne saattaa hämmentää. Mitä ratkaisua tulisi käytää?

Yksinkertaisessa sovelluksessa <i>useState</i> on varmasti hyvä lähtökohta. Jos sovellus kommunikoi palvelimen kanssa, voi kommunikoinnin hoitaa lukujen 1-5 tapaan itse sovelluksen tilaa hyödyntäen. Viime aikoina on kuitenkin yleistynyt se, että kommunikointi ja siihen liittyvä tilanhallinta siirretään ainakin osin React Queryn (tai jonkun muun samantapaisen kirjaston) hallinnoitavaksi. Jos useState ja sen myötä aiheutuva prop drilling arveluttaa, voi kontekstin käyttö olla hyvä vaihtoehto. On myös tilanteita, joissa osa tilasta voi olla järkevää hoitaa useStaten ja osa kontekstien avulla.

Kaikkien kattavimman ja järeimmän tilanhallintaratkaisun tarjoaa Redux, joka on eräs tapa toteuttaa ns. [Flux](https://facebookarchive.github.io/flux/)-arkkitehtuuri. Redux on hieman vanhempi kuin tässä aliosassa esitetyt ratkaisut. Reduxin jähmeys onkin ollut motivaationa monille uusille tilanhallintaratkaisuille kuten tässä osassa esittelemällemme Reactin <i>useReducer</i>:ille. Osa Reduxin jäykkyyteen kohdistuvasta kritiikistä tosin on jo vanhentunut [Redux Toolkit](https://redux-toolkit.js.org/):in ansiosta.

Vuosien saatossa on myös kehitelty muita Reduxia vastaavia tilantahallintakirjastoja, kuten esim. uudempi tulokas [Recoil](https://recoiljs.org/) ja hieman iäkkäämpi [MobX](https://mobx.js.org/). [Npm trendsien](https://npmtrends.com/mobx-vs-recoil-vs-redux) perusteella Redux kuitenkin dominoi edelleen selvästi, ja näyttää itse asiassa vaan kasvattavan etumatkaansa:

![](../../images/6/64new.png)

Myöskään Reduxia ei ole pakko käyttää sovelluksessa kokonaisvaltaisesti. Saattaa olla mielekästä hoitaa esim. sovellusten lomakkeiden datan tallentaminen Reduxin ulkopuolella, erityisesti niissä tilanteissa, missä lomakkeen tila ei vaikuta muuhun sovellukseen. Myös Reduxin ja React Queryn yhteiskäyttö samassa sovelluksessa on täysin mahdollista.

Kysymys siitä mitä tilanhallintaratkaisua tulisi käyttää ei ole ollenkaan suoraviivainen. Yhtä oikeaa vastausta on mahdotonta antaa, ja on myös todennäköistä, että valittu tilanhallintaratkaisu saattaa sovelluksen kasvaessa osoittautua siinä määrin epäoptimaaliseksi, että tilanhallinnan ratkaisuja täytyy vaihtaa vaikka sovellus olisi jo ehditty viedä tuotantokäyttöön.

</div>
