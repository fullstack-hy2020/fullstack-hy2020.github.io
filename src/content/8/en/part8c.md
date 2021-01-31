---
mainImage: ../../../images/part-8.svg
part: 8
letter: c
lang: en
---

<div class="content">


We will now add user management to our application, but let's first start using a database for storing data.

### Mongoose and Apollo


Install mongoose and mongoose-unique-validator:

```bash
npm install mongoose mongoose-unique-validator
```


We will imitate what we did in parts [3](/en/part3/saving_data_to_mongo_db) and [4](/en/part4/structure_of_backend_application_introduction_to_testing).


The person schema has been defined as follows:

```js
const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    minlength: 5
  },
  phone: {
    type: String,
    minlength: 5
  },
  street: {
    type: String,
    required: true,
    minlength: 5
  },
  city: {
    type: String,
    required: true,
    minlength: 3
  },
})

module.exports = mongoose.model('Person', schema)
```


We also included a few validations. _required: true_, which ensures that value exists, is actually redundant as just using GraphQL ensures that the fields exist. However it is good to also keep validation in the database. 


We can get the application to mostly work with the following changes: 

```js
const { ApolloServer, UserInputError, gql } = require('apollo-server')
const mongoose = require('mongoose')
const Person = require('./models/person')

const MONGODB_URI = 'mongodb+srv://fullstack:halfstack@cluster0-ostce.mongodb.net/graphql?retryWrites=true'

console.log('connecting to', MONGODB_URI)

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message)
  })

const typeDefs = gql`
  ...
`

const resolvers = {
  Query: {
    personCount: () => Person.collection.countDocuments(),
    allPersons: (root, args) => {
      // filters missing
      return Person.find({})
    },
    findPerson: (root, args) => Person.findOne({ name: args.name })
  },
  Person: {
    address: root => {
      return {
        street: root.street,
        city: root.city
      }
    }
  },
  Mutation: {
    addPerson: (root, args) => {
      const person = new Person({ ...args })
      return person.save()
    },
    editNumber: async (root, args) => {
      const person = await Person.findOne({ name: args.name })
      person.phone = args.phone
      return person.save()
    }
  }
}
```


The changes are pretty straightforward. However there are a few noteworthy things. As we remember, in Mongo the identifying field of an object is called <i>_id</i> and we previously had to parse the name of the field to <i>id</i> ourselves. Now GraphQL can do this automatically. 


Another noteworthy thing is that the resolver functions now return a <i>promise</i>, when they previously returned normal objects. When a resolver returns a promise, Apollo server [sends back](https://www.apollographql.com/docs/apollo-server/data/data/#resolver-results) the value which the promise resolves to. 



For example if the following resolver function is executed, 

```js
allPersons: (root, args) => {
  return Person.find({})
},
```


Apollo server waits for the promise to resolve, and returns the result. So Apollo works roughly like this:

```js
Person.find({}).then( result => {
  // return the result 
})
```


Let's complete the _allPersons_ resolver so it takes the optional parameter _phone_ into account:

```js
Query: {
  // ..
  allPersons: (root, args) => {
    if (!args.phone) {
      return Person.find({})
    }

    return Person.find({ phone: { $exists: args.phone === 'YES'  }})
  },
},
```


So if the query has not been given a parameter _phone_, all persons are returned. If the parameter has the value <i>YES</i>, the result of the query

```js
Person.find({ phone: { $exists: true }})
```


is returned, so the objects in which the field _phone_ has a value. If the parameter has the value <i>NO</i>, the query returns the objects in which the _phone_ field has no value: 

```js
Person.find({ phone: { $exists: false }})
```

### Validation


As well as in GraphQL, the input is now validated using the validations defined in the mongoose-schema. For handling possible validation errors in the schema, we must add an error handling _try/catch_-block to the _save_-method. When we end up in the catch, we throw a suitable exception: 

```js
Mutation: {
  addPerson: async (root, args) => {
      const person = new Person({ ...args })

      try {
        await person.save()
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        })
      }
      return person
  },
    editNumber: async (root, args) => {
      const person = await Person.findOne({ name: args.name })
      person.phone = args.phone

      try {
        await person.save()
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        })
      }
      return person
    }
}
```

The code of the backend can be found on [Github](https://github.com/fullstack-hy2020/graphql-phonebook-backend/tree/part8-4), branch <i>part8-4</i>.


### User and log in

Let's add user management to our application. For simplicity's sake, let's assume that all users have the same password which is hardcoded to the system. It would be straightforward to save individual passwords for all users following the principles from [part 4](/en/part4/user_administration), but because our focus is on GraphQL, we will leave out all that extra hassle this time. 

The user schema is as follows: 

```js
const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 3
  },
  friends: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Person'
    }
  ],
})

module.exports = mongoose.model('User', schema)
```


Every user is connected to a bunch of other persons in the system through the _friends_ field. The idea is that when a user, e.g. <i>mluukkai</i>, adds a person, e.g. <i>Arto Hellas</i>, to the list, the person is added to their _friends_ list. This way logged in users can have their own, personalized, view in the application. 


Logging in and identifying the user are handled the same way we used in [part 4](/en/part4/token_authentication) when we used REST, by using tokens. 


Let's extend the schema like so: 

```js
type User {
  username: String!
  friends: [Person!]!
  id: ID!
}

type Token {
  value: String!
}

type Query {
  // ..
  me: User
}

type Mutation {
  // ...
  createUser(
    username: String!
  ): User
  login(
    username: String!
    password: String!
  ): Token
}
```


The query _me_ returns the currently logged in user. New users are created with the _createUser_ mutation, and logging in happens with _login_ -mutation.


The resolvers of the mutations are as follows: 

```js
const jwt = require('jsonwebtoken')

const JWT_SECRET = 'NEED_HERE_A_SECRET_KEY'

Mutation: {
  // ..
  createUser: (root, args) => {
    const user = new User({ username: args.username })

    return user.save()
      .catch(error => {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        })
      })
  },
  login: async (root, args) => {
    const user = await User.findOne({ username: args.username })

    if ( !user || args.password !== 'secred' ) {
      throw new UserInputError("wrong credentials")
    }

    const userForToken = {
      username: user.username,
      id: user._id,
    }

    return { value: jwt.sign(userForToken, JWT_SECRET) }
  },
},
```


The new user mutation is straightforward. The log in mutation checks if the username/password pair is valid. And if it is indeed valid, it returns a jwt-token familiar from [part 4](/en/part4/token_authentication).


Just like in the previous case with REST, the idea now is that a logged in user adds a token they receive upon log in to all of their requests. And just like with REST, the token is added to GraphQL queries using the <i>Authorization</i> header.


In the GraphQL-playground the header is added to a query like so

![](../../images/8/24.png)


Let's now expand the definition of the _server_ object by adding a third parameter [context](https://www.apollographql.com/docs/apollo-server/data/data/#context-argument) to the constructor call:

```js
const server = new ApolloServer({
  typeDefs,
  resolvers,
  // highlight-start
  context: async ({ req }) => {
    const auth = req ? req.headers.authorization : null
    if (auth && auth.toLowerCase().startsWith('bearer ')) {
      const decodedToken = jwt.verify(
        auth.substring(7), JWT_SECRET
      )

      const currentUser = await User.findById(decodedToken.id).populate('friends')
      return { currentUser }
    }
  }
  // highlight-end
})
```


The object returned by context is given to all resolvers as their <i>third parameter</i>. Context is the right place to do things which are shared by multiple resolvers, like [user identification](https://blog.apollographql.com/authorization-in-graphql-452b1c402a9?_ga=2.45656161.474875091.1550613879-1581139173.1549828167).


So our code sets the object corresponding to the user who made the request to the _currentUser_ field of the context. If there is no user connected to the request, the value of the field is undefined. 


The resolver of the _me_ query is very simple, it just returns the logged in user it receives in the _currentUser_ field of the third parameter of the resolver, _context_. It's worth noting that if there is no logged in user, i.e. there is no valid token in the header attached to the request, the query returns <i>null</i>:

```js
Query: {
  // ...
  me: (root, args, context) => {
    return context.currentUser
  }
},
```

### Friends list


Let's complete the application's backend so that adding and editing persons requires logging in, and added persons are automatically added to the friends list of the user. 


Let's first remove all persons not in anyone's friends list from the database. 


_addPerson_ mutation changes like so:

```js
Mutation: {
  addPerson: async (root, args, context) => {
    const person = new Person({ ...args })
    const currentUser = context.currentUser

    if (!currentUser) {
      throw new AuthenticationError("not authenticated")
    }

    try {
      await person.save()
      currentUser.friends = currentUser.friends.concat(person)
      await currentUser.save()
    } catch (error) {
      throw new UserInputError(error.message, {
        invalidArgs: args,
      })
    }

    return person
  },
  //...
}
```


If a logged in user cannot be found from the context, an _AuthenticationError_ is thrown. Creating new persons is now done with _async/await_ syntax, because if the operation is successful, the created person is added to the friends list of the user. 


Let's also add functionality for adding an existing user to your friends list. The mutation is as follows: 

```js
type Mutation {
  // ...
  addAsFriend(
    name: String!
  ): User
}
```


And the mutations resolver:

```js
  addAsFriend: async (root, args, { currentUser }) => {
    const nonFriendAlready = (person) => 
      !currentUser.friends.map(f => f._id).includes(person._id)

    if (!currentUser) {
      throw new AuthenticationError("not authenticated")
    }

    const person = await Person.findOne({ name: args.name })
    if ( nonFriendAlready(person) ) {
      currentUser.friends = currentUser.friends.concat(person)
    }

    await currentUser.save()

    return currentUser
  },
```


Note how the resolver <i>destructures</i> the logged in user from the context. So instead of saving _currentUser_ to a separate variable in a function

```js
addAsFriend: async (root, args, context) => {
  const currentUser = context.currentUser
```


it is received straight in the parameter definition of the function:

```js
addAsFriend: async (root, args, { currentUser }) => {
```


The code of the backend can be found on [Github](https://github.com/fullstack-hy2020/graphql-phonebook-backend/tree/part8-5) branch <i>part8-5</i>.


</div>

<div class="tasks">

### Exercises 8.13.-8.16.

#### 8.13: Database, part 1


Change the library application so that it saves the data to a database. You can find the <i>mongoose schema</i> for books and authors from [here](https://github.com/fullstack-hy2020/misc/blob/master/library-schema.md).


Let's change the book graphql schema a little

```js
type Book {
  title: String!
  published: Int!
  author: Author!
  genres: [String!]!
  id: ID!
}
```  


so that instead of just the author's name, the book object contains all the details of the author. 


You can assume that the user will not try to add faulty books or authors, so you don't have to care about validation errors. 


The following things do <i>not</i> have to work just yet

 - _allBooks_ query with parameters
 -  <i>bookCount</i> field of an author object
 -  _author_ field of a book
 - _editAuthor_ mutation

#### 8.14: Database, part 2

Complete the program so that all queries (except _allBooks_ with the parameter _author_ ) and mutations work. 

You might find this [useful](https://docs.mongodb.com/manual/reference/operator/query/in/).

#### 8.15 Database, part 3


Complete the program so that database validation errors (e.g. too short book title or author name) are handled sensibly. This means that they cause _UserInputError_ with a suitable error message to be thrown. 


#### 8.16 user and logging in


Add user management to your application. Expand the schema like so:

```js
type User {
  username: String!
  favoriteGenre: String!
  id: ID!
}

type Token {
  value: String!
}

type Query {
  // ..
  me: User
}

type Mutation {
  // ...
  createUser(
    username: String!
    favoriteGenre: String!
  ): User
  login(
    username: String!
    password: String!
  ): Token
}
```


Create resolvers for query _me_ and the new mutations _createUser_ and 
_login_. Like in the course material, you can assume all users have the same hardcoded password. 


Make the mutations _addBook_ and _editAuthor_ possible only if the request includes a valid token. 

(Don't worry about fixing the frontend for the moment.)

</div>
