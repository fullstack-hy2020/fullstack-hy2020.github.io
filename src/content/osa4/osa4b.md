---
title: osa 4
subTitle: Node.js -sovellusten testaus
path: /osa4/node-testaus
mainImage: ../../images/osa5.png
part: 4
letter: b
partColor: yellow
---

<div class="content">

### Testejä ja backendin refaktorointia

Koodia refaktoroidessa vaanii aina [regression](https://en.wikipedia.org/wiki/Regression_testing) vaara, eli on olemassa riski, että jo toimineet ominaisuudet hajoavat. Tehdäänkin muiden operaatioiden refaktorointi siten, että ennen koodin muutosta tehdään jokaiselle API:n routelle sen toiminnallisuuden varmistavat testit.

Aloitetaan lisäysoperaatiosta. Tehdään testi, joka lisää uuden muistiinpanon ja tarkistaa, että API:n palauttamien muistiinpanojen määrä kasvaa, ja että lisätty muistiinpano on palautettujen joukossa:

```js
test('a valid note can be added ', async () => {
  const newNote = {
    content: 'async/await yksinkertaistaa asynkronisten funktioiden kutsua',
    important: true,
  };

  await api
    .post('/api/notes')
    .send(newNote)
    .expect(200)
    .expect('Content-Type', /application\/json/);

  const response = await api.get('/api/notes');

  const contents = response.body.map(r => r.content);

  expect(response.body.length).toBe(initialNotes.length + 1);
  expect(contents).toContain(
    'async/await yksinkertaistaa asynkronisten funktioiden kutsua'
  );
});
```

Kuten odotimme ja toivoimme, menee testi läpi.

Tehdään myös testi, joka varmistaa, että muistiinpanoa, jolle ei ole asetettu sisältöä, ei talleteta

```js
test('note without content is not added ', async () => {
  const newNote = {
    important: true,
  };

  const initialNotes = await api.get('/api/notes');

  await api
    .post('/api/notes')
    .send(newNote)
    .expect(400);

  const response = await api.get('/api/notes');

  expect(response.body.length).toBe(initialNotes.length);
});
```

Testi ei mene läpi.

Käy ilmi, että myös operaation suoritus postman tai Visual Studio Coden REST clientillä johtaa virhetilanteeseen. Koodissa on siis bugi.

> **Huom:** testejä tehdessä täytyy aina varmistua siitä, että testi testaa oikeaa asiaa, ja usein ensimmäistä kertaa testiä tehdessä se että testi ei mene läpi tarkoittaa sitä, että testi on tehty väärin. Myös päinvastaista tapahtuu, eli testi menee läpi mutta koodissa onkin virhe, eli testi ei testaa sitä mitä sen piti testata. Tämän takia testit kannattaa aina "testata" rikkomalla koodi ja varmistamalla, että testi huomaa koodiin tehdyt virheet.

Kun suoritamme operaation postmanilla konsoli paljastaa, että kyseessä on _Unhandled promise rejection_, eli koodi ei käsittele promisen virhetilannetta:

<pre>
Server running on port 3001
Method: POST
Path:   /api/notes/
Body:   { important: true }
---
(node:28657) UnhandledPromiseRejectionWarning: Unhandled promise rejection (rejection id: 1): Error: Can't set headers after they are sent.
(node:28657) [DEP0018] DeprecationWarning: Unhandled promise rejections are deprecated. In the future, promise rejections that are not handled will terminate the Node.js process with a non-zero exit code.
</pre>

Kuten jo edellisessä osassa mainittiin, tämä ei ole hyvä idea. Kannattaakin aloittaa lisäämällä promise-ketjuun metodilla _catch_ virheenkäsittelijä, joka tulostaa konsoliin virheen syyn:

```js
notesRouter.post('/', (request, response) => {
  // ...

  note
    .save()
    .then(note => {
      return formatNote(note)
    })
    .then(formattedNote => {
      response.json(formattedNote)
    })
    .catch(error => {
      console.log(error)
      response.status(500).json({ error: 'something went wrong...' })
    })
```

Konsoliin tulostuu seuraava virheilmoitus

<pre>
Error: Can't set headers after they are sent.
    at validateHeader (_http_outgoing.js:489:11)
    at ServerResponse.setHeader (_http_outgoing.js:496:3)
</pre>

Aloittelijalle virheilmoitus ei välttämättä kerro paljoa, mutta googlaamalla virheilmoituksella, pieni etsiminen tuottaisi jo tuloksen.

Kyse on siitä, että koodi kutsuu _response_-olion metodia _send_ kaksi kertaa, tai oikeastaan koodi kutsuu metodia _json_, joka kutsuu edelleen metodia _send_.

Kaksi kertaa tapahtuva _send_-kutsu johtuu siitä, että koodin alun _if_-lauseessa on ongelma:

```js
notesRouter.post('/', (request, response) => {
  const body = request.body

  if (body.content === undefined) {
    response.status(400).json({ error: 'content missing' })
    // suoritus jatkuu!
  }

  //...
}
```

kun koodi kutsuu <code>response.status(400).json(...)</code> suoritus jatkaa koodin alla olevaa osaan ja se taas aiheuttaa uuden <code>response.json()</code>-kutsun.

Korjataan ongelma lisäämällä _if_-lauseeseen _return_:

```js
notesRouter.post('/', (request, response) => {
  const body = request.body

  if (body.content === undefined) {
    return response.status(400).json({ error: 'content missing' })
  }

  //...
}
```

Edellisen osan lopussa koodi oli vielä oikein, mutta siirtäessämme osan alussa koodia tiedostosta _index.js_ uuteen paikkaan, on _return_ kadonnut matkalta.

Promiseja käyttävä koodi toimii nyt ja testitkin menevät läpi. Olemme valmiit muuttamaan koodin käyttämään async/await-syntaksia.

Koodi muuttuu seuraavasti (huomaa, että käsittelijän alkuun on laitettava määre _async_):

```js
notesRouter.post('/', async (request, response) => {
  const body = request.body;

  if (body.content === undefined) {
    return response.status(400).json({ error: 'content missing' });
  }

  const note = new Note({
    content: body.content,
    important: body.important === undefined ? false : body.important,
    date: new Date(),
  });

  const savedNote = await note.save();
  response.json(formatNote(savedNote));
});
```

Koodiin jää kuitenkin pieni ongelma: virhetilanteita ei nyt käsitellä ollenkaan. Miten niiden suhteen tulisi toimia?

</div>
