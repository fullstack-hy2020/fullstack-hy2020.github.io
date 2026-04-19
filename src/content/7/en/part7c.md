---
mainImage: ../../../images/part-7.svg
part: 7
letter: c
lang: en
---

<div class="content">

### Class Components

During the course, we have only used React components having been defined as JavaScript functions. This was not possible without the [hook](https://reactjs.org/docs/hooks-intro.html) functionality that came with version 16.8 of React. Before, when defining a component that uses state, one had to define it using JavaScript's [Class](https://reactjs.org/docs/state-and-lifecycle.html#converting-a-function-to-a-class) syntax.

It is beneficial to at least be familiar with Class Components to some extent since the world contains a lot of old React code, which will probably never be completely rewritten using the updated syntax.

Let's get to know the main features of Class Components by producing yet another very familiar anecdote application. We store the anecdotes in the file <i>db.json</i> using <i>json-server</i>. The contents of the file are taken from [here](https://github.com/fullstack-hy/misc/blob/master/anecdotes.json).

The initial version of the Class Component looks like this

```js
import React from 'react'

class App extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div>
        <h1>anecdote of the day</h1>
      </div>
    )
  }
}

export default App
```

The component now has a [constructor](https://react.dev/reference/react/Component#constructor), in which nothing happens at the moment, and contains the method [render](https://react.dev/reference/react/Component#render). As one might guess, render defines how and what is rendered to the screen.

Let's define a state for the list of anecdotes and the currently-visible anecdote. In contrast to when using the [useState](https://react.dev/reference/react/useState) hook, Class Components only contain one state. So if the state is made up of multiple "parts", they should be stored as properties of the state. The state is initialized in the constructor:

```js
class App extends React.Component {
  constructor(props) {
    super(props)

    // highlight-start
    this.state = {
      anecdotes: [],
      current: 0
    }
    // highlight-end
  }

  render() {
  // highlight-start
    if (this.state.anecdotes.length === 0) {
      return <div>no anecdotes...</div>
    }
  // highlight-end

    return (
      <div>
        <h1>anecdote of the day</h1>
        // highlight-start
        <div>
          {this.state.anecdotes[this.state.current].content}
        </div>
        <button>next</button>
        // highlight-end
      </div>
    )
  }
}
```

The component state is in the instance variable <i>this.state</i>. The state is an object having two properties. <i>this.state.anecdotes</i> is the list of anecdotes and <i>this.state.current</i> is the index of the currently-shown anecdote.

In Functional components, the right place for fetching data from a server is inside an [effect hook](https://react.dev/reference/react/useEffect), which is executed when a component renders or less frequently if necessary, e.g. only in combination with the first render.

The [lifecycle methods](https://react.dev/reference/react/Component#adding-lifecycle-methods-to-a-class-component) of Class Components offer corresponding functionality. The correct place to trigger the fetching of data from a server is inside the lifecycle method [componentDidMount](https://react.dev/reference/react/Component#componentdidmount), which is executed once right after the first time a component renders:

```js
class App extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      anecdotes: [],
      current: 0
    }
  }

  // highlight-start
  componentDidMount = () => {
    axios.get('http://localhost:3001/anecdotes').then(response => {
      this.setState({ anecdotes: response.data })
    })
  }
  // highlight-end

  // ...
}
```

The callback function of the HTTP request updates the component state using the method [setState](https://react.dev/reference/react/Component#setstate). The method only touches the keys that have been defined in the object passed to the method as an argument. The value for the key <i>current</i> remains unchanged.

Calling the method setState always triggers the rerender of the Class Component, i.e. calling the method <i>render</i>.

We'll finish off the component with the ability to change the shown anecdote. The following is the code for the entire component with the addition highlighted:

```js
class App extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      anecdotes: [],
      current: 0
    }
  }

  componentDidMount = () => {
    axios.get('http://localhost:3001/anecdotes').then(response => {
      this.setState({ anecdotes: response.data })
    })
  }

  // highlight-start
  handleClick = () => {
    const current = Math.floor(
      Math.random() * this.state.anecdotes.length
    )
    this.setState({ current })
  }
  // highlight-end

  render() {
    if (this.state.anecdotes.length === 0 ) {
      return <div>no anecdotes...</div>
    }

    return (
      <div>
        <h1>anecdote of the day</h1>
        <div>{this.state.anecdotes[this.state.current].content}</div>
        <button onClick={this.handleClick}>next</button> // highlight-line
      </div>
    )
  }
}
```

For comparison, here is the same application as a Functional component:

```js
const App = () => {
  const [anecdotes, setAnecdotes] = useState([])
  const [current, setCurrent] = useState(0)

  useEffect(() =>{
    axios.get('http://localhost:3001/anecdotes').then(response => {
      setAnecdotes(response.data)
    })
  },[])

  const handleClick = () => {
    setCurrent(Math.round(Math.random() * (anecdotes.length - 1)))
  }

  if (anecdotes.length === 0) {
    return <div>no anecdotes...</div>
  }

  return (
    <div>
      <h1>anecdote of the day</h1>
      <div>{anecdotes[current].content}</div>
      <button onClick={handleClick}>next</button>
    </div>
  )
}
```

In the case of our example, the differences were minor. The biggest difference between Functional components and Class components is mainly that the state of a Class component is a single object, and that the state is updated using the method <i>setState</i>, while in Functional components the state can consist of multiple different variables, with all of them having their own update function.

In 2026, Class Components are largely a historical artifact. All modern React development uses Functional components with hooks, and there is no rational reason to reach for a Class component when writing new code. The React documentation itself treats Class components as a legacy API.

### Error boundary

Even though Class Components are largely obsolete, there is one situation where you still cannot avoid them: [error boundaries](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary). An error boundary is a component that catches JavaScript errors anywhere in its child component tree and displays a fallback UI instead of crashing the whole application. As of 2026, React has not yet introduced a hook-based alternative for this, so error boundaries must still be implemented as Class components.

An error boundary looks like this:

```js
import React from 'react'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught an error', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div>
          <h2>Something went wrong.</h2>
          <p>{this.state.error.message}</p>
          <button onClick={() => this.setState({ hasError: false, error: null })}>
            try again
          </button>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
```

The two key lifecycle methods are <i>getDerivedStateFromError</i>, which updates state so the next render shows the fallback UI, and <i>componentDidCatch</i>, which is a good place to log the error to an error reporting service.

You can wrap any part of your component tree with an error boundary to contain failures to that subtree:

```js
const App = () => {
  return (
    <div>
      <ErrorBoundary>
        <Notes />
      </ErrorBoundary>
      <ErrorBoundary>
        <Persons />
      </ErrorBoundary>
    </div>
  )
}
```

If <i>Notes</i> throws an error, only that section shows the fallback. <i>Persons</i> continues to work normally.

Because this is the one remaining use case for Class components, many projects use  the [react-error-boundary](https://github.com/bvaughn/react-error-boundary) library, which wraps the class-based machinery behind a convenient Functional component API so you never have to write a Class component yourself.

### Frontend and backend in the same repository

During the course, we have created the frontend and backend into separate repositories. This is a very typical approach. However, we did the deployment by [copying](/en/part3/deploying_app_to_internet#serving-static-files-from-the-backend) the bundled frontend code into the backend repository. A possibly better approach would have been to deploy the frontend code separately.

Sometimes the entire application is put into a single repository. A common and clean way to do this with a modern stack is to keep the Vite frontend in a <i>client</i> directory and the Express backend in a <i>server</i> directory, each with their own <i>package.json</i>. The root of the repository gets a third <i>package.json</i> that acts as a convenience wrapper with scripts to run both together.

A minimal layout of such a [repository](https://github.com/fullstack-hy2020/monorepo) looks like this:

```
app/
  package.json        (root, scripts only)
  client/
    package.json      (Vite + React)
    vite.config.js
    src/
      App.jsx
  server/
    package.json      (Express)
    index.js
```

The Express server in <i>server/index.js</i> serves the API and, in production, also serves the built frontend from the <i>client/dist</i> directory:

```js
const express = require('express')
const path = require('path')

const app = express()

app.use(express.json())

app.get('/api/ping', (req, res) => {
  res.json({ message: 'pong', time: new Date().toISOString() })
})

// serve the built Vite frontend in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')))
  app.get('/*splat', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'))
  })
}

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`server running on port ${PORT}`))
```

During development, the Vite dev server runs on its own port and needs to forward API requests to Express. This is configured in <i>client/vite.config.js</i>:

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:3001',
    },
  },
})
```

With the proxy in place, a frontend fetch to <i>/api/ping</i> is automatically forwarded to the Express server during development, so you never have to hard-code the backend URL.

The root <i>package.json</i> ties everything together with a couple of scripts:

```json
{
  "scripts": {
    "dev": "concurrently \"npm run dev --prefix server\" \"npm run dev --prefix client\"",
    "build": "npm run build --prefix client",
    "start": "NODE_ENV=production npm start --prefix server"
  },
  "devDependencies": {
    "concurrently": "^8.0.0"
  }
}
```

There are couple things interesting here.

The <i>dev</i> script uses [concurrently](https://github.com/open-cli-tools/concurrently), a small utility that runs multiple commands at the same time and merges their output into a single terminal stream. Without it you would have to open two separate terminals, one for the backend and one for the frontend. 

The <i>--prefix</i> flag tells npm which subdirectory to treat as the working directory for that command, so <i>npm run dev --prefix server</i> is equivalent to <i>cd server && npm run dev</i>. 

Running <i>npm run dev</i> from the root therefore starts both the Vite dev server and Express in parallel with a single command. In this mode, Vite serves the frontend with hot module replacement: when you edit a React component, the browser updates instantly without a full page reload. The Express server runs separately and the Vite proxy forwards <i>/api</i> requests to it.

Running <i>npm run build</i> compiles the frontend into the <i>client/dist</i> directory. After that, <i>npm start</i> sets <i>NODE_ENV=production</i> and starts Express, which picks up the static files from <i>client/dist</i> and serves both the API and the frontend from a single port. This is the setup you would use when deploying to a server.

Because each part of the project has its own <i>package.json</i>, you need to be explicit about which one you are targeting when installing new packages. The same <i>--prefix</i> flag works for <i>npm install</i> as well:

```bash
npm install axios --prefix client     # add to the frontend
npm install mongoose --prefix server  # add to the backend
```

Alternatively, you can simply <i>cd</i> into the directory and run <i>npm install</i> from there as you normally would.

### Organization of code in React application

In most applications during this course, we followed the convention of placing components in a <i>components</i> directory, hooks in <i>hooks</i>, and server communication code in <i>services</i>. For the BlogList app that might look like this:

```
src/
  App.jsx
  components/
    Blog.jsx
    BlogList.jsx
    LoginForm.jsx
    Notification.jsx
  hooks/
    useField.js
  services/
    blogs.js
    users.js
  stores/
    blogStore.js
    notificationStore.js
```

This flat, type-based grouping works well for small applications. 

When the app uses routing, it is common to add a <i>pages</i> directory (sometimes called <i>views</i>) for the top-level route components, keeping reusable UI components in <i>components</i>. This convention is used by frameworks such as [Next.js](https://nextjs.org/docs/pages/building-your-application/routing) and is described in the [React FAQ on file structure](https://legacy.reactjs.org/docs/faq-structure.html):

```
src/
  App.jsx
  pages/
    HomePage.jsx
    BlogPage.jsx
    UserPage.jsx
  components/
    Blog.jsx
    BlogList.jsx
    LoginForm.jsx
    Notification.jsx
  hooks/
    useField.js
  services/
    blogs.js
    users.js
  stores/
    blogStore.js
    notificationStore.js
```

As the codebase grows further, however, a change to a single feature may still touch files scattered across every directory, and both <i>components</i> and <i>pages</i> can become hard to navigate.

A common response to this is to group files by <i>feature</i> instead. The [Feature-Sliced Design](https://feature-sliced.design/) methodology formalises this approach, and the [bulletproof-react](https://github.com/alan2207/bulletproof-react) project is a widely-referenced example of applying it in practice:

```
src/
  App.jsx
  features/
    blogs/
      Blog.jsx
      BlogList.jsx
      blogService.js
      blogStore.js
    users/
      UserList.jsx
      userService.js
    notifications/
      Notification.jsx
      notificationStore.js
  hooks/
    useField.js
```

Everything related to blogs lives together, so adding or changing a feature means working in one place rather than several. There is no single correct way to organize a larger project, and the right choice depends on the size and nature of the application.

### Changes on the server

The applications we build during this course fetch data from the server when the page loads and after user actions, but they have no way of learning about changes made by other users. If a fellow user adds a new blog post, our frontend simply does not know about it until the page is refreshed. How can we keep the UI in sync with a server that changes independently?

The simplest approach is [polling](https://en.wikipedia.org/wiki/Polling_(computer_science)): the frontend repeatedly asks the server for fresh data at a fixed interval, for example using [setInterval](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setInterval). Polling is easy to implement but wasteful, because most requests return nothing new.

A cleaner alternative is [WebSockets](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API), which open a persistent two-way connection between the browser and the server. The server can then push updates to connected clients the moment something changes, without the client having to ask. WebSockets are now supported by all modern browsers.

Working directly with the WebSocket API can be cumbersome. The [Socket.io](https://socket.io/) library wraps it with a higher-level API and adds automatic reconnection and other conveniences.

In [part 8](/en/part8) we look at GraphQL, which includes a subscription mechanism that lets the server notify clients about data changes in a structured way.

### React/node-application security

So far during the course, we have not touched on information security much. We do not have much time for this now either, but fortunately, University of Helsinki has a MOOC course [Securing Software](https://cybersecuritybase.mooc.fi/module-2.1) for this important topic.

We will, however, take a look at some things specific to this course.

The Open Web Application Security Project, otherwise known as [OWASP](https://www.owasp.org), publishes an annual list of the most common security risks in Web applications. The most recent list can be found [here](https://owasp.org/Top10/). The same risks can be found from one year to another.

At the top of the list, we find <i>injection</i>, which means that e.g. text sent using a form in an application is interpreted completely differently than the software developer had intended. The most famous type of injection is probably [SQL injection](https://stackoverflow.com/questions/332365/how-does-the-sql-injection-from-the-bobby-tables-xkcd-comic-work).

For example, imagine that the following SQL query is executed in a vulnerable application:

```js
let query = "SELECT * FROM Users WHERE name = '" + userName + "';"
```

Now let's assume that a malicious user <i>Arto Hellas</i> would define their name as

```
Arto Hell-as'; DROP TABLE Users; --
```

so that the name would contain a single quote <code>'</code>, which is the beginning and end character of a SQL string. As a result of this, two SQL operations would be executed, the second of which would destroy the database table <i>Users</i>:

```sql
SELECT * FROM Users WHERE name = 'Arto Hell-as'; DROP TABLE Users; --'
```

SQL injections are prevented using [parameterized queries](https://security.stackexchange.com/questions/230211/why-are-stored-procedures-and-prepared-statements-the-preferred-modern-methods-f). With them, user input isn't mixed with the SQL query, but the database itself inserts the input values at placeholders in the query (usually <code>?</code>):

```js
execute("SELECT * FROM Users WHERE name = ?", [userName])
```

Injection attacks are also possible in NoSQL databases. However, mongoose prevents them by [sanitizing](https://zanon.io/posts/nosql-injection-in-mongodb) the queries. More on the topic can be found e.g. [here](https://web.archive.org/web/20220901024441/https://blog.websecurify.com/2014/08/hacking-nodejs-and-mongodb.html).

<i>Cross-site scripting (XSS)</i> is an attack where it is possible to inject malicious JavaScript code into a legitimate web application. The malicious code would then be executed in the browser of the victim. If we try to inject the following into e.g. the notes application:

```html
<script>
  alert('Evil XSS attack')
</script>
```

the code is not executed, but is only rendered as 'text' on the page:

![browser showing notes with XSS attempt](../../images/7/32e.png)

since React [takes care of sanitizing data in variables](https://legacy.reactjs.org/docs/introducing-jsx.html#jsx-prevents-injection-attacks). Some versions of React [have been vulnerable](https://medium.com/dailyjs/exploiting-script-injection-flaws-in-reactjs-883fb1fe36c1) to XSS attacks. The security holes have of course been patched, but there is no guarantee that there couldn't be any more.

One needs to remain vigilant when using libraries; if there are security updates to those libraries, it is advisable to update those libraries in one's applications. Security updates for Express are found in the [library's documentation](https://expressjs.com/en/advanced/security-updates.html) and the ones for Node are found in [this blog](https://nodejs.org/en/blog/vulnerability/).

You can check how up-to-date your dependencies are using the command

```bash
npm outdated --depth 0
```

The one-year-old project that is used in [part 9](/en/part9) of this course already has quite a few outdated dependencies:

![npm outdated output of patientor](../../images/7/33x.png)

The dependencies can be brought up to date by updating the file <i>package.json</i>. The best way to do that is by using a tool called <i>npm-check-updates</i>. It can be installed globally by running the command:

```bash
npm install -g npm-check-updates
```

Using this tool, the up-to-dateness of dependencies is checked in the following way:

```bash
$ npm-check-updates
Checking ...\my-app\package.json
[====================] 11/11 100%

 @testing-library/react       ^14.0.0  →  ^15.0.0
 @testing-library/user-event  ^14.4.3  →  ^14.5.2
 react                        ^18.2.0  →  ^19.0.0
 vite                          ^5.0.0  →   ^6.0.0

Run ncu -u to upgrade package.json
```

The file <i>package.json</i> is brought up to date by running the command <i>ncu -u</i>.

```bash
$ ncu -u
Upgrading ...\my-app\package.json
[====================] 11/11 100%

 @testing-library/react       ^14.0.0  →  ^15.0.0
 @testing-library/user-event  ^14.4.3  →  ^14.5.2
 react                        ^18.2.0  →  ^19.0.0
 vite                          ^5.0.0  →   ^6.0.0

Run npm install to install new versions.
```

Then it is time to update the dependencies by running the command <i>npm install</i>. However, old versions of the dependencies are not necessarily a security risk.

The npm [audit](https://docs.npmjs.com/cli/audit) command can be used to check the security of dependencies. It compares the version numbers of the dependencies in your application to a list of the version numbers of dependencies containing known security threats in a centralized error database.

Running <i>npm audit</i> on the same project, it prints a long list of complaints and suggested fixes.
Below is a part of the report:

```js
$ patientor npm audit

... many lines removed ...

url-parse  <1.5.2
Severity: moderate
Open redirect in url-parse - https://github.com/advisories/GHSA-hh27-ffr2-f2jc
fix available via `npm audit fix`
node_modules/url-parse

ws  6.0.0 - 6.2.1 || 7.0.0 - 7.4.5
Severity: moderate
ReDoS in Sec-Websocket-Protocol header - https://github.com/advisories/GHSA-6fc8-4gx4-v693
ReDoS in Sec-Websocket-Protocol header - https://github.com/advisories/GHSA-6fc8-4gx4-v693
fix available via `npm audit fix`
node_modules/webpack-dev-server/node_modules/ws
node_modules/ws

120 vulnerabilities (102 moderate, 16 high, 2 critical)

To address issues that do not require attention, run:
  npm audit fix

To address all issues (including breaking changes), run:
  npm audit fix --force
```

After only one year, the code is full of small security threats. Luckily, there are only 2 critical threats.  Let's run <i>npm audit fix</i> as the report suggests:

```js
$ npm audit fix

+ mongoose@5.9.1
added 19 packages from 8 contributors, removed 8 packages and updated 15 packages in 7.325s
fixed 354 of 416 vulnerabilities in 20047 scanned packages
  1 package update for 62 vulns involved breaking changes
  (use `npm audit fix --force` to install breaking changes; or refer to `npm audit` for steps to fix these manually)
```

62 threats remain because, by default, <i>audit fix</i> does not update dependencies if their <i>major</i> version number has increased.  Updating these dependencies could lead to the whole application breaking down.

The source for the critical bug is the library [immer](https://github.com/immerjs/immer)

```js
immer  <9.0.6
Severity: critical
Prototype Pollution in immer - https://github.com/advisories/GHSA-33f9-j839-rf8h
fix available via `npm audit fix --force`
Will install react-scripts@5.0.0, which is a breaking change
```

Running <i>npm audit fix --force</i> would upgrade the library version but would also upgrade the library <i>react-scripts</i> and that would potentially break down the development environment. So we will leave the library upgrades for later...

One of the threats mentioned in the list from OWASP is <i>Broken Authentication</i> and the related <i>Broken Access Control</i>. The token-based authentication we have been using is fairly robust if the application is being used on the traffic-encrypting HTTPS protocol. When implementing access control, one should e.g. remember to not only check a user's identity in the browser but also on the server. Bad security would be to prevent some actions to be taken only by hiding the execution options in the code of the browser.

On Mozilla's MDN, there is a very good [Website security guide](https://developer.mozilla.org/en-US/docs/Learn/Server-side/First_steps/Website_security), which brings up this very important topic:

![screenshot of website security from MDN](../../images/7/34.png)

The documentation for Express includes a section on security: [Production Best Practices: Security](https://expressjs.com/en/advanced/best-practice-security.html), which is worth a read. It is also recommended to add a library called [Helmet](https://helmetjs.github.io/) to the backend. It includes a set of middleware that eliminates some security vulnerabilities in Express applications.

Using the ESlint [security-plugin](https://github.com/nodesecurity/eslint-plugin-security) is also worth doing.

### Current trends

Finally, let's take a look at some technology of tomorrow (or, actually, already today), and the directions in which Web development is heading.

#### Typed versions of JavaScript

The [dynamic typing](https://developer.mozilla.org/en-US/docs/Glossary/Dynamic_typing) of JavaScript can lead to subtle bugs that are only discovered at runtime. In part 5, we touched on [PropTypes](/en/part5/props_children_and_proptypes#prop-types) as a way to add runtime type checks to component props, but PropTypes have largely fallen out of use as the ecosystem has moved toward [static type checking](https://en.wikipedia.org/wiki/Type_system#Static_type_checking).

[TypeScript](https://www.typescriptlang.org/), developed by Microsoft, has become the de facto standard for typed JavaScript. It catches type errors at compile time rather than at runtime, provides excellent editor tooling, and is now used by the majority of new React projects. TypeScript is covered in [part 9](/en/part9).

#### Server-side rendering and React Server Components

React components do not have to run in the browser. They can also be rendered on the [server](https://react.dev/reference/react-dom/server), which sends ready-made HTML to the client instead of a blank page that JavaScript must fill in. This <i>server-side rendering</i> (SSR) improves perceived load time and is important for Search Engine Optimization (SEO), since search engine crawlers see fully rendered content without having to execute JavaScript.

The more recent and significant development is [React Server Components](https://react.dev/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023#react-server-components) (RSC), introduced in React 18 and now a core part of the React architecture. A Server Component runs exclusively on the server and is never sent to the browser as JavaScript. It can read directly from a database or file system, keep secrets out of the client bundle, and stream its output to the browser. The browser receives these components as rendered data, not as executable code. <i>Client Components</i>, annotated with <code>'use client'</code>, still run in the browser and handle interactivity as before. In an RSC application most components are Server Components by default, with Client Components used only where user interaction is needed.

[Next.js](https://nextjs.org/) has become the standard framework for building React applications that require server-side behaviour. Its App Router (introduced in Next.js 13) is built around React Server Components and provides file-based routing, nested layouts, server actions for mutating data, and built-in support for static generation and incremental static regeneration. In 2026, Next.js is the first choice for any React project where SSR, SEO, or full-stack capabilities matter.

#### Microservice architecture

During this course, we have only scratched the surface of the server end of things. In our applications, we had a <i>monolithic</i> backend, meaning one application making up a whole and running on a single server, serving only a few API endpoints.

As the application grows, the monolithic backend approach starts turning problematic both in terms of performance and maintainability.

A [microservice architecture](https://martinfowler.com/articles/microservices.html) (microservices) is a way of composing the backend of an application from many separate, independent services, which communicate with each other over the network. An individual microservice's purpose is to take care of a particular logical functional whole. In a pure microservice architecture, the services do not use a shared database.

For example, the bloglist application could consist of two services: one handling the user and another taking care of the blogs. The responsibility of the user service would be user registration and user authentication, while the blog service would take care of operations related to the blogs.

The image below visualizes the difference between the structure of an application based on a microservice architecture and one based on a more traditional monolithic structure:

![microservices vs traditional approach diagram](../../images/7/36.png)

The role of the frontend (enclosed by a square in the picture) does not differ much between the two models. There is often a so-called [API gateway](http://microservices.io/patterns/apigateway) between the microservices and the frontend, which provides an illusion of a more traditional "everything on the same server" API. [Netflix](https://medium.com/netflix-techblog/optimizing-the-netflix-api-5c9ac715cf19), among others, uses this type of approach.

Microservice architectures emerged and evolved for the needs of large internet-scale applications. The trend was set by Amazon far before the appearance of the term microservice. The critical starting point was an email sent to all employees in 2002 by Amazon CEO Jeff Bezos:

> All teams will henceforth expose their data and functionality through service interfaces.
>
> Teams must communicate with each other through these interfaces.
>
> There will be no other form of inter-process communication allowed: no direct linking, no direct reads of another team’s data store, no shared-memory model, no back-doors whatsoever. The only communication allowed is via service interface calls over the network.
>
> It doesn’t matter what technology you use.
>
> All service interfaces, without exception, must be designed from the ground up to be externalize-able. That is to say, the team must plan and design to be able to expose the interface to developers in the outside world.
>
> No exceptions.
>
> Anyone who doesn’t do this will be fired. Thank you; have a nice day!

Nowadays, one of the biggest forerunners in the use of microservices is [Netflix](https://www.infoq.com/presentations/netflix-chaos-microservices).

The use of microservices has steadily been gaining hype to be kind of a [silver bullet](https://en.wikipedia.org/wiki/No_Silver_Bullet) of today, which is being offered as a solution to almost every kind of problem. However, there are several challenges when it comes to applying a microservice architecture, and it might make sense to go [monolith first](https://martinfowler.com/bliki/MonolithFirst.html) by initially making a traditional all-encompassing backend. Or maybe [not](https://martinfowler.com/articles/dont-start-monolith.html). There are a bunch of different opinions on the subject. Both links lead to Martin Fowler's site; as we can see, even the wise are not entirely sure which one of the right ways is more right.

Unfortunately, we cannot dive deeper into this important topic during this course. Even a cursory look at the topic would require at least 5 more weeks.

#### Serverless

After the release of Amazon's [lambda](https://aws.amazon.com/lambda/) service at the end of 2014, a new trend started to emerge in web application development: [serverless](https://serverless.com/).

The main thing about lambda, and nowadays also Google's [Cloud functions](https://cloud.google.com/functions/) as well as [similar functionality in Azure](https://azure.microsoft.com/en-us/services/functions/), is that it enables <i>the execution of individual functions</i> in the cloud. Before, the smallest executable unit in the cloud was a single <i>process</i>, e.g. a runtime environment running a Node backend.

E.g. Using Amazon's [API gateway](https://aws.amazon.com/api-gateway/) it is possible to make serverless applications where the requests to the defined HTTP API get responses directly from cloud functions. Usually, the functions already operate using stored data in the databases of the cloud service.

Serverless is not about there not being a server in applications, but about how the server is defined. Software developers can shift their programming efforts to a higher level of abstraction as there is no longer a need to programmatically define the routing of HTTP requests, database relations, etc., since the cloud infrastructure provides all of this. Cloud functions also lend themselves to creating a well-scaling system, e.g. Amazon's Lambda can execute a massive amount of cloud functions per second. All of this happens automatically through the infrastructure and there is no need to initiate new servers, etc.

### Useful libraries and further reading

The JavaScript developer community has produced a large variety of useful libraries. Before writing something from scratch it is always worth checking whether a well-maintained solution already exists.

You can take advantage of your React know-how when developing mobile applications using [React Native](https://reactnative.dev/), which is the topic of [part 10](/en/part10) of the course.

The course itself continues beyond part 7: [part 8](/en/part8) covers GraphQL, [part 9](/en/part9) TypeScript, [part 10](/en/part10) React Native, [part 11](/en/part11) CI/CD, and [part 12](/en/part12) containers. The full course contents are listed on the [course page](/en/#course-contents).

The following external resources are good places to go deeper on React patterns, code quality, and the broader ecosystem:

- [Patterns.dev](https://www.patterns.dev/) covers modern React and JavaScript patterns in depth. For a curated collection of React-specific techniques, [React bits](https://vasanthk.gitbooks.io/react-bits/) is a useful companion.
- [Overreacted](https://overreacted.io/) is the blog of Dan Abramov, one of the original React core team members. The articles go deep into React's design decisions and mental models, and are worth reading even when they are a few years old.
- [Kent C. Dodds](https://kentcdodds.com/blog) writes extensively about React best practices, testing, and component design. His posts on testing philosophy in particular have shaped how the community thinks about frontend tests.
- [Tao of React](https://alexkondov.com/tao-of-react/) is a short, opinionated guide to structuring React applications that covers components, state, props, and project layout in a pragmatic way.
- [Reactiflux](https://www.reactiflux.com/) is a large React developer community on Discord, and a good place to ask questions after the course ends. Many open-source libraries maintain their own channels there.

</div>
