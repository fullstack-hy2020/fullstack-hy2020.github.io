---
mainImage: ../../../images/part-4.svg
part: 4
letter: c
lang: en
---

<div class="content">


We want to add user authentication and authorization to our application. Users should be stored in the database and every note should be linked to the user who created it. Deleting and editing a note should only be allowed for the user who created it.


Let's start by adding information about users to the database. There is a one-to-many relationship between the user (<i>User</i>) and notes (<i>Note</i>):

![](https://yuml.me/a187045b.png)


If we were working with a relational database the implementation would be straightforward. Both resources would have their separate database tables, and the id of the user who created a note would be stored in the notes table as a foreign key.


When working with document databases the situation is a bit different, as there are many different ways of modeling the situation.


The existing solution saves every note in the <i>notes collection</i> in the database. If we do not want to change this existing collection, then the natural choice is to save users in their own collection,  <i>users</i> for example.


Like with all document databases, we can use object id's in Mongo to reference documents in other collections. This is similar to using foreign keys in relational databases.


Traditionally document databases like Mongo do not support  <i>join queries</i> that are available in relational databases,  used for aggregating data from multiple tables. However starting from version 3.2. Mongo has supported [lookup aggregation queries](https://docs.mongodb.com/manual/reference/operator/aggregation/lookup/). We will not be taking a look at this functionality in this course.


If we need a functionality similar to join queries, we will implement it in our application code by making multiple queries. In certain situations Mongoose can take care of joining and aggregating data, which gives the appearance of a join query. However, even in these situations Mongoose makes multiple queries to the database in the background.


### References across collections


If we were using a relational database the note would contain a <i>reference key</i> to the user who created it. In document databases we can do the same thing. 


Let's assume that the <i>users</i> collection contains two users:

```js
[
  {
    username: 'mluukkai',
    _id: 123456,
  },
  {
    username: 'hellas',
    _id: 141414,
  },
];
```


The <i>notes</i> collection contains three notes that all have a <i>user</i> field that references a user in the <i>users</i> collection:

```js
[
  {
    content: 'HTML is easy',
    important: false,
    _id: 221212,
    user: 123456,
  },
  {
    content: 'The most important operations of HTTP protocol are GET and POST',
    important: true,
    _id: 221255,
    user: 123456,
  },
  {
    content: 'A proper dinosaur codes with Java',
    important: false,
    _id: 221244,
    user: 141414,
  },
]
```


Document databases do not demand the foreign key to be stored in the note resources, it could <i>also</i> be stored in the users collection, or even both:

```js
[
  {
    username: 'mluukkai',
    _id: 123456,
    notes: [221212, 221255],
  },
  {
    username: 'hellas',
    _id: 141414,
    notes: [221244],
  },
]
```


Since users can have many notes, the related ids are stored in an array in the <i>notes</i> field.


Document databases also offer a radically different way of organizing the data: In some situations it might be beneficial to nest the entire notes array as a part of the documents in the users collection:

```js
[
  {
    username: 'mluukkai',
    _id: 123456,
    notes: [
      {
        content: 'HTML is easy',
        important: false,
      },
      {
        content: 'The most important operations of HTTP protocol are GET and POST',
        important: true,
      },
    ],
  },
  {
    username: 'hellas',
    _id: 141414,
    notes: [
      {
        content:
          'A proper dinosaur codes with Java',
        important: false,
      },
    ],
  },
]
```


In this schema notes would be tightly nested under users and the database would not generate ids for them.


The structure and schema of the database is not as self-evident as it was with relational databases. The chosen schema must be one which supports the use cases of the application the best. This is not a simple design decision to make, as all use cases of the applications are not known when the design decision is made.


Paradoxically, schema-less databases like Mongo require developers to make far more radical design decisions about data organization at the beginning of the project than relational databases with schemas. On average, relational databases offer a more-or-less suitable way of organizing data for many applications.


### Mongoose schema for users


In this case, we make the decision to store the ids of the notes created by the user in the user document. Let's define the model for representing a user in the <i>models/user.js</i> file:

```js
const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  username: String,
  name: String,
  passwordHash: String,
  notes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Note'
    }
  ],
})

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    // the passwordHash should not be revealed
    delete returnedObject.passwordHash
  }
})

const User = mongoose.model('User', userSchema)

module.exports = User
```


The ids of the notes are stored within the user document as an array of Mongo ids. The definition is as follows:

```js
{
  type: mongoose.Schema.Types.ObjectId,
  ref: 'Note'
}
```


The type of the field is <i>ObjectId</i> that references <i>note</i>-style documents. Mongo does not inherently know that this is a field that references notes, the syntax is purely related to and defined by Mongoose.


Let's expand the schema of the note defined in the <i>model/note.js</i> file so that the note contains information about the user who created it:

```js
const noteSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
    minlength: 5
  },
  date: Date,
  important: Boolean,
  // highlight-start
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
  // highlight-end
})
```


In stark contrast to the conventions of relational databases, <i>references are now stored in both documents</i>: the note references the user who created it, and the user has an array of references to all of the notes created by them.


### Creating users


Let's implement a route for creating new users. Users have a unique <i>username</i>, a <i>name</i> and something called a <i>passwordHash</i>. The password hash is the output of a [one-way hash function](https://en.wikipedia.org/wiki/Cryptographic_hash_function) applied to the user's password. It is never wise to store unencrypted plain text passwords in the database!


Let's install the [bcrypt](https://github.com/kelektiv/node.bcrypt.js) package for generating the password hashes:

```bash
npm install bcrypt
```


Creating new users happens in compliance with the RESTful conventions discussed in [part 3](/en/part3/node_js_and_express#rest), by making an HTTP POST request to the <i>users</i> path.


Let's define a separate <i>router</i> for dealing with users in a new <i>controllers/users.js</i> file. Let's take the router into use in our application in the <i>app.js</i> file, so that it handles requests made to the <i>/api/users</i> url:

```js
const usersRouter = require('./controllers/users')

// ...

app.use('/api/users', usersRouter)
```


The contents of the file that defines the router are as follows:

```js
const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.post('/', async (request, response) => {
  const body = request.body

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(body.password, saltRounds)

  const user = new User({
    username: body.username,
    name: body.name,
    passwordHash,
  })

  const savedUser = await user.save()

  response.json(savedUser)
})

module.exports = usersRouter
```


The password sent in the request is <i>not</i> stored in the database. We store the <i>hash</i> of the password that is generated with the _bcrypt.hash_ function.


The fundamentals of [storing passwords](https://codahale.com/how-to-safely-store-a-password/) are outside the scope of this course material. We will not discuss what the magic number 10 assigned to the [saltRounds](https://github.com/kelektiv/node.bcrypt.js/#a-note-on-rounds) variable means, but you can read more about it in the linked material.


Our current code does not contain any error handling or input validation for verifying that the username and password are in the desired format.


The new feature can and should initially be tested manually with a tool like Postman. However testing things manually will quickly become too cumbersome, especially once we implement functionality that enforces usernames to be unique.


It takes much less effort to write automated tests, and it will make the development of our application much easier.


Our initial tests could look like this:

```js
const bcrypt = require('bcrypt')
const User = require('../models/user')

//...

describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })
})
```


The tests use the <i>usersInDb()</i> helper function that we implemented in the <i>tests/test_helper.js</i> file. The function is used to help us verify the state of the database after a user is created:

```js
const User = require('../models/user')

// ...

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

module.exports = {
  initialNotes,
  nonExistingId,
  notesInDb,
  usersInDb,
}
```


The <i>beforeEach</i> block adds a user with the username <i>root</i> to the database. We can write a new test that verifies that a new user with the same username can not be created:

```js
describe('when there is initially one user in db', () => {
  // ...

  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('`username` to be unique')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })
})
```


The test case obviously will not pass at this point. We are essentially practicing [test-driven development (TDD)](https://en.wikipedia.org/wiki/Test-driven_development), where tests for new functionality are written before the functionality is implemented.


Let's validate the uniqueness of the username with the help of Mongoose validators. As we mentioned in exercise [3.19](/en/part3/validation_and_es_lint#exercises-3-19-3-21), Mongoose does not have a built-in validator for checking the uniqueness of a field. We can find a ready-made solution for this from the [mongoose-unique-validator](https://www.npmjs.com/package/mongoose-unique-validator) npm package. Let's install it:

```bash
npm install mongoose-unique-validator
```


We must make the following changes to the schema defined in the <i>models/user.js</i> file:

```js
const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator') // highlight-line

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true  // highlight-line
  },
  name: String,
  passwordHash: String,
  notes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Note'
    }
  ],
})

userSchema.plugin(uniqueValidator) // highlight-line

// ...
```

We could also implement other validations into the user creation. We could check that the username is long enough, that the username only consists of permitted characters, or that the password is strong enough. Implementing these functionalities is left as an optional exercise.


Before we move onward, let's add an initial implementation of a route handler that returns all of the users in the database:

```js
usersRouter.get('/', async (request, response) => {
  const users = await User.find({})
  response.json(users)
})
```

The list looks like this:

![](../../images/4/9.png)


You can find the code for our current application in its entirety in the <i>part4-7</i> branch of [this github repository](https://github.com/fullstack-hy2020/part3-notes-backend/tree/part4-7).

### Creating a new note

The code for creating a new note has to be updated so that the note is assigned to the user who created it.

Let's expand our current implementation so, that the information about the user who created a note is sent in the <i>userId</i> field of the request body:

```js
const User = require('../models/user') //highlight-line

//...

notesRouter.post('/', async (request, response, next) => {
  const body = request.body

  const user = await User.findById(body.userId) //highlight-line

  const note = new Note({
    content: body.content,
    important: body.important === undefined ? false : body.important,
    date: new Date(),
    user: user._id //highlight-line
  })

  const savedNote = await note.save()
  user.notes = user.notes.concat(savedNote._id) //highlight-line
  await user.save()  //highlight-line
  
  response.json(savedNote)
})
```

It's worth noting that the <i>user</i> object also changes. The <i>id</i> of the note is stored in the <i>notes</i> field:

```js
const user = await User.findById(body.userId)

// ...

user.notes = user.notes.concat(savedNote._id)
await user.save()
```

Let's try to create a new note

![](../../images/4/10e.png)

The operation appears to work. Let's add one more note and then visit the route for fetching all users:

![](../../images/4/11e.png)

We can see that the user has two notes. 

Likewise, the ids of the users who created the notes can be seen when we visit the route for fetching all notes:

![](../../images/4/12e.png)

### Populate

We would like our API to work in such a way, that when an HTTP GET request is made to the <i>/api/users</i> route, the user objects would also contain the contents of the user's notes, and not just their id. In a relational database, this functionality would be implemented with a <i>join query</i>.

As previously mentioned, document databases do not properly support join queries between collections, but the Mongoose library can do some of these joins for us. Mongoose accomplishes the join by doing multiple queries, which is different from join queries in relational databases which are <i>transactional</i>, meaning that the state of the database does not change during the time that the query is made. With join queries in Mongoose, nothing can guarantee that the state between the collections being joined is consistent, meaning that if we make a query that joins the user and notes collections, the state of the collections may change during the query.


The Mongoose join is done with the [populate](http://mongoosejs.com/docs/populate.html) method. Let's update the route that returns all users first:

```js
usersRouter.get('/', async (request, response) => {
  const users = await User  // highlight-line
    .find({}).populate('notes') // highlight-line

  response.json(users)
})
```


The [populate](http://mongoosejs.com/docs/populate.html) method is chained after the <i>find</i> method making the initial query. The parameter given to the populate method defines that the <i>ids</i> referencing <i>note</i> objects in the <i>notes</i> field of the <i>user</i> document will be replaced by the referenced <i>note</i> documents.

The result is almost exactly what we wanted:

![](../../images/4/13ea.png)

We can use the populate parameter for choosing the fields we want to include from the documents. The selection of fields is done with the Mongo [syntax](https://docs.mongodb.com/manual/tutorial/project-fields-from-query-results/#return-the-specified-fields-and-the-id-field-only):

```js
usersRouter.get('/', async (request, response) => {
  const users = await User
    .find({}).populate('notes', { content: 1, date: 1 })

  response.json(users)
});
```

The result is now exactly like we want it to be:

![](../../images/4/14ea.png)

Let's also add a suitable population of user information to notes:

```js
notesRouter.get('/', async (request, response) => {
  const notes = await Note
    .find({}).populate('user', { username: 1, name: 1 })

  response.json(notes)
});
```


Now the user's information is added to the <i>user</i> field of note objects.

![](../../images/4/15ea.png)


It's important to understand that the database does not actually know that the ids stored in the <i>user</i> field of notes reference documents in the user collection.

The functionality of the <i>populate</i> method of Mongoose is based on the fact that we have defined "types" to the references in the Mongoose schema with the <i>ref</i> option:

```js
const noteSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
    minlength: 5
  },
  date: Date,
  important: Boolean,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
})
```

You can find the code for our current application in its entirety in the <i>part4-8</i> branch of [this github repository](https://github.com/fullstack-hy2020/part3-notes-backend/tree/part4-8).

</div>
