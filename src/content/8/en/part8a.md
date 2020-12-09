---
mainImage: ../../../images/part-8.svg
part: 8
letter: a
lang: en
---

<div class="content">


REST, familiar to us from the previous parts of the course, has long been the most prevalent way to implement the interfaces servers offer for browsers, and in general the integration between different applications on the web. 


In the recent years [GraphQL](http://graphql.org/), developed by Facebook, has become popular for communication between web applications and servers. 


The GraphQL philosophy is very different from REST. REST is <i>resource based</i>. Every resource, for example a <i>user</i> has its own address which identifies it, for example <i>/users/10</i>. All operations done to the resource are done with HTTP requests to its URL. The action depends on the used HTTP-method. 


The resource basedness of REST works well in most situations. However, it can be a bit awkward sometimes. 


Let's assume our bloglist application contains social media like functionality, and we would e.g. want to show a list of all the blogs the users who have commented on the blogs we follow have added. 


If the server implemented a REST API, we would probably have to do multiple HTTP-requests from the browser before we had all the data we wanted. The requests would also return a lot of unnecessary data, and the code on the browser would probably be quite complicated. 


If this was an often used functionality, there could be a REST-endpoint for it. If there were a lot of these kinds of scenarios however, it would become very laborious to implement REST-endpoints for all of them. 


A GraphQL server is well suited for these kinds of situations. 


The main principle of GraphQL is, that the code on the browser forms a <i>query</i> describing the data wanted, and sends it to the API with an HTTP POST request. Unlike REST, all GraphQL queries are sent to the same address, and their type is POST.


The data described in the above scenario could be fetched with (roughly) the following query: 

```bash
query FetchBlogsQuery {
  user(username: "mluukkai") {
    followedUsers {
      blogs {
        comments {
          user {
            blogs {
              title
            }
          }
        }
      }
    }
  }
}
```



The servers response would be about the following JSON-object: 

```bash
{
  "data": {
    "followedUsers": [
      {
        "blogs": [
          {
            "comments": [
              {
                "user": {
                  "blogs": [
                    {
                      "title": "Goto considered harmful"
                    },
                    {
                      "title": "End to End Testing with Cypress is most enjoyable"
                    },
                    {
                      "title": "Navigating your transition to GraphQL"
                    },
                    {
                      "title": "From REST to GraphQL"
                    }
                  ]
                }
              }
            ]
          }
        ]
      }
    ]
  }
}
```


The application logic stays simple, and the code on the browser gets exactly the data it needs with a single query. 

### Schemas and queries


We will get to know the basics of GraphQL by implementing a GraphQL version of the phonebook application from parts 2 and 3. 


In the heart of all GraphQL applications is a [schema](https://graphql.org/learn/schema/), which describes the data sent between the client and the server. The initial schema for our phonebook is as follows: 

```js
type Person {
  name: String!
  phone: String
  street: String!
  city: String!
  id: ID! 
}

type Query {
  personCount: Int!
  allPersons: [Person!]!
  findPerson(name: String!): Person
}
```


The schema describes two [types](https://graphql.org/learn/schema/#type-system). The first type, <i>Person</i>, determines that persons have five fields. Four of the fields are type  <i>String</i>, which is one of the [scalar types](https://graphql.org/learn/schema/#scalar-types) of GraphQL. 
All of the String fields, except <i>phone</i>, must be given a value. This is marked by the exclamation mark on the schema. The type of the field <i>id</i> is <i>ID</i>. <i>ID</i> fields are strings, but GraphQL ensures they are unique.  



The second type is a [Query](https://graphql.org/learn/schema/#the-query-and-mutation-types). Practically every GraphQL schema describes a Query, which tells what kind of queries can be made to the API. 


The phonebook describes three different queries. _personCount_ returns an integer, _allPersons_ returns a list of <i>Person</i> objects and <i>findPerson</i> is given a string parameter and it returns a <i>Person</i> object. 

Again exclamation marks are used to mark which return values and parameters are <i>Non-Null</i>. _personCount_ will, for sure, return an integer. The query _findPerson_ must be given a string as a parameter. The query returns a <i>Person</i>-object or <i>null</i>. _allPersons_ returns a list of <i>Person</i> objects, and the list does not contain any <i>null</i>-values. 

So the schema describes what queries the client can send to the server, what kind of parameters the queries can have, and what kind of data the queries return. 


The simplest of the queries, _personCount_, looks as follows: 

```js
query {
  personCount
}
```

Assuming our applications has saved the information of three people, the response would look like this: 

```js
{
  "data": {
    "personCount": 3
  }
}
```

The query fetching the information of all of the people, _allPersons_, is a bit more complicated. Because the query returns a list of <i>Person</i>-objects, the query must describe 
<i>which [fields](https://graphql.org/learn/queries/#fields)</i> of the objects the query returns:
```js
query {
  allPersons {
    name
    phone
  }
}
```

The response could look like this: 

```js
{
  "data": {
    "allPersons": [
      {
        "name": "Arto Hellas",
        "phone": "040-123543"
      },
      {
        "name": "Matti Luukkainen",
        "phone": "040-432342"
      },
      {
        "name": "Venla Ruuska",
        "phone": null
      }
    ]
  }
}
```

A query can be made to return any field described in the schema. For example the following would also be possible: 

```js
query {
  allPersons{
    name
    city
    street
  }
}
```

The last example shows a query which requires a parameter, and returns the details of one person. 

```js
query {
  findPerson(name: "Arto Hellas") {
    phone 
    city 
    street
    id
  }
}
```

So first the parameter is described in round brackets, and then the fields of the return value object are listed in curly brackets. 

The response is like this: 

```js
{
  "data": {
    "findPerson": {
      "phone": "040-123543",
      "city": "Espoo",
      "street": "Tapiolankatu 5 A"
      "id": "3d594650-3436-11e9-bc57-8b80ba54c431"
    }
  }
}
```

The return value was marked as nullable, so if we search for the details of an unknown

```js
query {
  findPerson(name: "Donald Trump") {
    phone 
  }
}
```

the return value is <i>null</i>.

```js
{
  "data": {
    "findPerson": null
  }
}
```

As you can see, there is a direct link between a GraphQL query and  the returned JSON object. One can think that the query describes what kind of data it wants as a response. 
The difference to REST queries is stark. With REST, the URL and the type of the request have nothing to do with the form of the return data. 


GraphQL query describes only the data moving between a server and the client. On the server the data can be organized and saved any way we like. 


Despite its name, GraphQL does not actually have anything to do with databases. It does not care how the data is saved. 
The data a GraphQL API uses can be saved into a relational database, document database, or to other servers which GraphQL-server can access with for example REST. 

### Apollo server

Let's implement a GraphQL-server with today's leading library [Apollo -server](https://www.apollographql.com/docs/apollo-server/).

Create a new npm-project with _npm init_ and install the required dependencies.

```bash
npm install apollo-server graphql
```

The initial code is as follows: 

```js
const { ApolloServer, gql } = require('apollo-server')

let persons = [
  {
    name: "Arto Hellas",
    phone: "040-123543",
    street: "Tapiolankatu 5 A",
    city: "Espoo",
    id: "3d594650-3436-11e9-bc57-8b80ba54c431"
  },
  {
    name: "Matti Luukkainen",
    phone: "040-432342",
    street: "Malminkaari 10 A",
    city: "Helsinki",
    id: '3d599470-3436-11e9-bc57-8b80ba54c431'
  },
  {
    name: "Venla Ruuska",
    street: "Nallemäentie 22 C",
    city: "Helsinki",
    id: '3d599471-3436-11e9-bc57-8b80ba54c431'
  },
]

const typeDefs = gql`
  type Person {
    name: String!
    phone: String
    street: String!
    city: String! 
    id: ID!
  }

  type Query {
    personCount: Int!
    allPersons: [Person!]!
    findPerson(name: String!): Person
  }
`

const resolvers = {
  Query: {
    personCount: () => persons.length,
    allPersons: () => persons,
    findPerson: (root, args) =>
      persons.find(p => p.name === args.name)
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`)
})
```

The heart of the code is an _ApolloServer_, which is given two parameters

```js
const server = new ApolloServer({
  typeDefs,
  resolvers,
})
```

The first parameter, _typeDefs_, contains the GraphQL schema. 

The second parameter is an object, which contains the [resolvers](https://www.apollographql.com/docs/tutorial/resolvers/) of the server. These are the code, which defines <i>how</i> GraphQL queries are responded to. 

The code of the resolvers is the following: 

```js
const resolvers = {
  Query: {
    personCount: () => persons.length,
    allPersons: () => persons,
    findPerson: (root, args) =>
      persons.find(p => p.name === args.name)
  }
}
```

As you can see, the resolvers correspond to the queries described in the schema. 

```js
type Query {
  personCount: Int!
  allPersons: [Person!]!
  findPerson(name: String!): Person
}
```

So there is a field under <i>Query</i> for every query described in the schema. 

The query 

```js
query {
  personCount
}
```

Has the resolver

```js
() => persons.length
```

So the response to the query is the length of the array _persons_.

The query which fetches all persons

```js
query {
  allPersons {
    name
  }
}
```

has a resolver which returns <i>all</i> objects from the _persons_ array. 

```js
() => persons
```

### GraphQL-playground

When Apollo-server is run on development mode (_node filename.js_), it starts a [GraphQL-playground](https://www.apollographql.com/docs/apollo-server/testing/graphql-playground/) to address [http://localhost:4000/graphql](http://localhost:4000/graphql). This is very useful for a developer, and can be used to make queries to the server. 

Let's try it out

![](../../images/8/1.png)

Sometimes the Playground requires you to be quite pedantic. If the syntax of a query is wrong, the error message is quite unnoticeable and nothing happens when you press go. 

![](../../images/8/2.png)

The result from the previous query stays visible on the right side of the playground even when the current query is faulty. 

By pointing at the right place on the line with the errors, you can see the error message

![](../../images/8/3.png)

If the playground seems to be stuck, refreshing the page usually helps. 

By clicking the text <i>DOCS</i> on the right, the playground shows the GraphQL schema of the server. 

![](../../images/8/4e.png)

### Parameters of a resolver


The query fetching a single person

```js
query {
  findPerson(name: "Arto Hellas") {
    phone 
    city 
    street
  }
}
```


has a resolver which differs from the previous ones because it is given <i>two parameters</i>:

```js
(root, args) => persons.find(p => p.name === args.name)
```


The second parameter, _args_, contains the parameters of the query. 
The resolver then returns from the array _persons_ the person whose name is the same as the value of <i>args.name</i>. 
The resolver does not need the first parameter _root_.
 

 
 In fact all resolver functions are given [four parameters](https://www.graphql-tools.com/docs/resolvers#resolver-function-signature). With JavaScript the parameters don't have to be defined, if they are not needed. We will be using the first and the third parameter of a resolver later in this part. 

### The default resolver


When we do a query, for example

```js
query {
  findPerson(name: "Arto Hellas") {
    phone 
    city 
    street
  }
}
```

the server knows to send back exactly the fields required by the query. How does that happen?

A GraphQL-server must define resolvers for <i>each</i> field of each  type in the schema. 
We have so far only defined resolvers for fields of the type <i>Query</i>, so for each query of the application. 

Because we did not define resolvers for the fields of the type <i>Person</i>, Apollo has defined [default resolvers](https://www.graphql-tools.com/docs/resolvers/#default-resolver) for them. 
They work like the one shown below: 


```js
const resolvers = {
  Query: {
    personCount: () => persons.length,
    allPersons: () => persons,
    findPerson: (root, args) => persons.find(p => p.name === args.name)
  },
  // highlight-start
  Person: {
    name: (root) => root.name,
    phone: (root) => root.phone,
    street: (root) => root.street,
    city: (root) => root.city,
    id: (root) => root.id
  }
  // highlight-end
}
```


The default resolver returns the value of the corresponding field of the object. The object itself can be accessed through the first parameter of the resolver, _root_.


If the functionality of the default resolver is enough, you don't need to define your own. It is also possible to define resolvers for only some fields of a type, and let the default resolvers handle the rest. 


We could for example define, that the address of all persons is 
<i>Manhattan New York</i> by hard coding the following to the resolvers of the street and city fields of the type <i>Person</i>.

```js
Person: {
  street: (root) => "Manhattan",
  city: (root) => "New York"
}
```

### Object within an object


Let's modify the schema a bit

```js
  // highlight-start
type Address {
  street: String!
  city: String! 
}
  // highlight-end

type Person {
  name: String!
  phone: String
  address: Address!   // highlight-line
  id: ID!
}

type Query {
  personCount: Int!
  allPersons: [Person!]!
  findPerson(name: String!): Person
}
```


so a person now has a field with the type <i>Address</i>, which contains the street and the city. 


The queries requiring the address change into

```js
query {
  findPerson(name: "Arto Hellas") {
    phone 
    address {
      city 
      street
    }
  }
}
```


and the response now is a person object, which <i>contains</i> an address object. 

```js
{
  "data": {
    "findPerson": {
      "phone": "040-123543",
      "address":  {
        "city": "Espoo",
        "street": "Tapiolankatu 5 A"
      }
    }
  }
}
```


We still save the persons in the server the same way we did before. 

```js
let persons = [
  {
    name: "Arto Hellas",
    phone: "040-123543",
    street: "Tapiolankatu 5 A",
    city: "Espoo",
    id: "3d594650-3436-11e9-bc57-8b80ba54c431"
  },
  // ...
]
```


So the person-objects saved in the server are not exactly the same as GraphQL type <i>Person</i> objects described in the schema. 


Contrary to the type <i>Person</i>, the <i>Address</i> type does not have an <i>id</i> field, because they are not saved into their own data structure in the server. 


Because the objects saved in the array do not have a field <i>address</i>, the default resolver is not sufficient enough. 
Let's add a resolver for the field <i>address</i> of type <i>Person</i>: 

```js
const resolvers = {
  Query: {
    personCount: () => persons.length,
    allPersons: () => persons,
    findPerson: (root, args) =>
      persons.find(p => p.name === args.name)
  },
  // highlight-start
  Person: {
    address: (root) => {
      return { 
        street: root.street,
        city: root.city
      }
    }
  }
  // highlight-end
}
```


So every time a <i>Person</i> object is returned, the fields <i>name</i>, <i>phone</i> and <i>id</i> are returned using their default resolvers, but the field <i>address</i> is formed by using a self defined resolver. The parameter _root_ of the resolver function is the person-object, so the street and the city of the address can be taken from its fields. 


The current code of the application can be found on [ Github](https://github.com/fullstack-hy2020/graphql-phonebook-backend/tree/part8-1), branch <i>part8-1</i>.

### Mutations


Let's add a functionality for adding new persons to the phonebook. In GraphQL, all operations which cause a change are done with [mutations](https://graphql.org/learn/queries/#mutations). Mutations are described in the schema as the keys of type <i>Mutation</i>.


The schema for a mutation for adding a new person looks as follows: 

```js
type Mutation {
  addPerson(
    name: String!
    phone: String
    street: String!
    city: String!
  ): Person
}
```


The Mutation is given the details of the person as parameters. The parameter <i>phone</i> is the only one which is nullable. The Mutation also has a return value. The return value is type <i>Person</i>, the idea being that the details of the added person are returned if the operation is successful and if not, null. Value for the field <i>id</i> is not given as a parameter. Generating an id is better left for the server. 


Mutations also require a resolver: 

```js
const { v1: uuid } = require('uuid')

// ...

const resolvers = {
  // ...
  Mutation: {
    addPerson: (root, args) => {
      const person = { ...args, id: uuid() }
      persons = persons.concat(person)
      return person
    }
  }
}
```


The mutation adds the object given to it as a parameter _args_ to the array _persons_, and returns the object it added to the array. 


The <i>id</i> field is given a unique value using the [uuid](https://github.com/kelektiv/node-uuid#readme) library. 


A new person can be added with the following mutation

```js
mutation {
  addPerson(
    name: "Pekka Mikkola"
    phone: "045-2374321"
    street: "Vilppulantie 25"
    city: "Helsinki"
  ) {
    name
    phone
    address{
      city
      street
    }
    id
  }
}
```


Note, that the person is saved to the _persons_ array as 

```js
{
  name: "Pekka Mikkola",
  phone: "045-2374321",
  street: "Vilppulantie 25",
  city: "Helsinki",
  id: "2b24e0b0-343c-11e9-8c2a-cb57c2bf804f"
}
```


But the response to the mutation is 

```js
{
  "data": {
    "addPerson": {
      "name": "Pekka Mikkola",
      "phone": "045-2374321",
      "address": {
        "city": "Helsinki",
        "street": "Vilppulantie 25"
      },
      "id": "2b24e0b0-343c-11e9-8c2a-cb57c2bf804f"
    }
  }
}
```


So the resolver of the <i>address</i> field of the <i>Person</i> type formats the response object to the right form. 

### Error handling


If we try to create a new person, but the parameters do not correspond with the schema description, the server gives an error message: 

![](../../images/8/5.png)


So some of the error handling can be automatically done with GraphQL [validation](https://graphql.org/learn/validation/).


However GraphQL cannot handle everything automatically. For example stricter rules for data sent to a Mutation have to be added manually.
The errors from those rules are handled by [the error handling mechanism of Apollo Server](https://www.apollographql.com/docs/apollo-server/data/errors).


Let's block adding the same name to the phonebook multiple times: 

```js
const { ApolloServer, UserInputError, gql } = require('apollo-server') // highlight-line

// ...

const resolvers = {
  // ..
  Mutation: {
    addPerson: (root, args) => {
      // highlight-start
      if (persons.find(p => p.name === args.name)) {
        throw new UserInputError('Name must be unique', {
          invalidArgs: args.name,
        })
      }
      // highlight-end

      const person = { ...args, id: uuid() }
      persons = persons.concat(person)
      return person
    }
  }
}
```


So if the name to be added already exists in the phonebook, throw _UserInputError_ error. 

![](../../images/8/6.png)


The current code of the application can be found on [ Github](https://github.com/fullstack-hy2020/graphql-phonebook-backend/tree/part8-2), branch <i>part8-2</i>.

### Enum


Let's add a possibility to filter the query returning all persons with the parameter <i>phone</i> so, that it returns only persons with a phone number

```js
query {
  allPersons(phone: YES) {
    name
    phone 
  }
}
```


or persons without a phone number 

```js
query {
  allPersons(phone: NO) {
    name
  }
}
```


The schema changes like so: 

```js
// highlight-start
enum YesNo {
  YES
  NO
}
// highlight-end

type Query {
  personCount: Int!
  allPersons(phone: YesNo): [Person!]! // highlight-line
  findPerson(name: String!): Person
}
```


The type <i>YesNo</i> is GraphQL [enum](https://graphql.org/learn/schema/#enumeration-types), or an enumerable, with two possible values <i>YES</i> or <i>NO</i>. In the query _allPersons_ the parameter _phone_  has the type <i>YesNo</i>, but is nullable. 


The resolver changes like so:

```js
Query: {
  personCount: () => persons.length,
  // highlight-start
  allPersons: (root, args) => {
    if (!args.phone) {
      return persons
    }

    const byPhone = (person) =>
      args.phone === 'YES' ? person.phone : !person.phone

    return persons.filter(byPhone)
  },
  // highlight-end
  findPerson: (root, args) =>
    persons.find(p => p.name === args.name)
},
```

### Changing a phone number


Let's add a mutation for changing the phone number of a person. The schema of this mutation looks as follows:

```js
type Mutation {
  addPerson(
    name: String!
    phone: String
    street: String!
    city: String!
  ): Person
  // highlight-start
  editNumber(
    name: String!
    phone: String!
  ): Person
  // highlight-end
}
```


and is done by a resolver:

```js
Mutation: {
  // ...
  editNumber: (root, args) => {
    const person = persons.find(p => p.name === args.name)
    if (!person) {
      return null
    }

    const updatedPerson = { ...person, phone: args.phone }
    persons = persons.map(p => p.name === args.name ? updatedPerson : p)
    return updatedPerson
  }   
}
```


The mutation finds the person to be updated by the field <i>name</i>.

The current code of the application can be found on [Github](https://github.com/fullstack-hy2020/graphql-phonebook-backend/tree/part8-3), branch <i>part8-3</i>.

### More on queries


With GraphQL it is possible to combine multiple fields of type <i>Query</i>, or "separate queries" into one query. For example the following query returns both the amount of persons in the phonebook and their names: 

```js
query {
  personCount
  allPersons {
    name
  }
}
```


The response looks as follows

```js
{
  "data": {
    "personCount": 3,
    "allPersons": [
      {
        "name": "Arto Hellas"
      },
      {
        "name": "Matti Luukkainen"
      },
      {
        "name": "Venla Ruuska"
      }
    ]
  }
}
```


Combined query can also use the same query multiple times. You must however give the queries alternative names like so

```js
query {
  havePhone: allPersons(phone: YES){
    name
  }
  phoneless: allPersons(phone: NO){
    name
  }
}
```


The response looks like

```js
{
  "data": {
    "havePhone": [
      {
        "name": "Arto Hellas"
      },
      {
        "name": "Matti Luukkainen"
      }
    ],
    "phoneless": [
      {
        "name": "Venla Ruuska"
      }
    ]
  }
}
```


In some cases it might be beneficial to name the queries. This is the case especially when the queries or mutations have [parameters](https://graphql.org/learn/queries/#variables). We will get into parameters soon. 


If there are multiple queries, Playground asks you to choose which of them to run:

![](../../images/8/7.png)

</div>

<div class="tasks">

### Exercises 8.1.-8.7.


Through the exercises, we will implement a GraphQL backend for a small library. 
Start with [this file](https://github.com/fullstack-hy2020/misc/blob/master/library-backend.js). Remember to _npm init_ and to install dependencies!

Note that the code does not initially work since the schema definition is not complete.

#### 8.1: The number of books and authors


Implement queries _bookCount_ and _authorCount_ which return the number of books and the number of authors. 

The query 

```js
query {
  bookCount
  authorCount
}
```


should return

```js
{
  "data": {
    "bookCount": 7,
    "authorCount": 5
  }
}
```

#### 8.2: All books 


Implement query _allBooks_, which returns the details of all books. 


In the end, the user should be able to do the following query:

```js
query {
  allBooks { 
    title 
    author
    published 
    genres
  }
}
```

#### 8.3: All authors


Implement query _allAuthors_, which returns the details of all authors. The response should include a field _bookCount_ containing the number of books the author has written. 


For example the query

```js
query {
  allAuthors {
    name
    bookCount
  }
}
```


should return

```js
{
  "data": {
    "allAuthors": [
      {
        "name": "Robert Martin",
        "bookCount": 2
      },
      {
        "name": "Martin Fowler",
        "bookCount": 1
      },
      {
        "name": "Fyodor Dostoevsky",
        "bookCount": 2
      },
      {
        "name": "Joshua Kerievsky",
        "bookCount": 1
      },
      {
        "name": "Sandi Metz",
        "bookCount": 1
      }
    ]
  }
}
```

#### 8.4: Books of an author


Modify the _allBooks_ query so, that a user can give an optional parameter <i>author</i>. The response should include only books written by that author. 

For example query

```js
query {
  allBooks(author: "Robert Martin") {
    title
  }
}
```


should return

```js
{
  "data": {
    "allBooks": [
      {
        "title": "Clean Code"
      },
      {
        "title": "Agile software development"
      }
    ]
  }
}
```

#### 8.5: Books by genre

Modify the query _allBooks_ so that a user can give an optional parameter <i>genre</i>. The response should include only books of that genre. 


For example query

```js
query {
  allBooks(genre: "refactoring") {
    title
    author
  }
}
```

should return

```js
{
  "data": {
    "allBooks": [
      {
        "title": "Clean Code",
        "author": "Robert Martin"
      },
      {
        "title": "Refactoring, edition 2",
        "author": "Martin Fowler"
      },
      {
        "title": "Refactoring to patterns",
        "author": "Joshua Kerievsky"
      },
      {
        "title": "Practical Object-Oriented Design, An Agile Primer Using Ruby",
        "author": "Sandi Metz"
      }
    ]
  }
}
```


The query must work when both optional parameters are given: 

```js
query {
  allBooks(author: "Robert Martin", genre: "refactoring") {
    title
    author
  }
}
```

#### 8.6: Adding a book


Implement mutation _addBook_, which can be used like this:

```js
mutation {
  addBook(
    title: "NoSQL Distilled",
    author: "Martin Fowler",
    published: 2012,
    genres: ["database", "nosql"]
  ) {
    title,
    author
  }
}
```


The mutation works even if the author is not already saved to the server:

```js
mutation {
  addBook(
    title: "Pimeyden tango",
    author: "Reijo Mäki",
    published: 1997,
    genres: ["crime"]
  ) {
    title,
    author
  }
}
```


If the author is not yet saved to the server, a new author is added to the system. The birth years of authors are not saved to the server yet, so the query

```js
query {
  allAuthors {
    name
    born
    bookCount
  }
}
```


returns

```js
{
  "data": {
    "allAuthors": [
      // ...
      {
        "name": "Reijo Mäki",
        "born": null,
        "bookCount": 1
      }
    ]
  }
}
```

#### 8.7: Updating the birth year of an author


Implement mutation _editAuthor_, which can be used to set a birth year for an author. The mutation is used like so

```js
mutation {
  editAuthor(name: "Reijo Mäki", setBornTo: 1958) {
    name
    born
  }
}
```


If the correct author is found, the operation returns the edited author:

```js
{
  "data": {
    "editAuthor": {
      "name": "Reijo Mäki",
      "born": 1958
    }
  }
}
```


If the author is not in the system, <i>null</i> is returned: 

```js
{
  "data": {
    "editAuthor": null
  }
}
```

</div>


