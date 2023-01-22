---
mainImage: ../../../images/part-3.svg
part: 3
letter: b
lang: en
---

<div class="content">

Next, let's connect the frontend we made in [part 2](/en/part2) to our own backend.

In the previous part, the frontend could ask for the list of notes from the json-server we had as a backend, from the address <http://localhost:3001/notes>.
Our backend has a slightly different URL structure now, as the notes can be found at <http://localhost:3001/api/notes>.
Let's change the attribute **baseUrl** in the <i>src/services/notes.js</i> like so:

```js
import axios from 'axios'
const baseUrl = 'http://localhost:3001/api/notes' //highlight-line

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

// ...

export default { getAll, create, update }
```

Now frontend's GET request to <http://localhost:3001/api/notes> does not work for some reason:

![Get request showing error in dev tools](../../images/3/3ae.png)

What's going on here? We can access the backend from a browser and from postman without any problems.

### Same origin policy and CORS

The issue lies with a thing called `same origin policy`. A URL's origin is defined by the combination of protocol (AKA scheme), hostname, and port.

```text
http://example.com:80/index.html
  
protocol: http
host: example.com
port: 80
```

When you visit a website (i.e <http://catwebsites.com>), the browser issues a request to the server on which the webiste (catwebsites.com) is hosted.
The response sent by the server is an HTML file that may contain one or more references to external assets/resources hosted either on the same server that <i>catwebsites.com</i> is hosted on or a different website.
When the browser sees reference(s) to a URL in the source HTML, it issues a request.
If the request is issued using the URL that the source HTML was fetched from, then the browser processes the response without any issues.
However, if the resource is fetched using a URL that doesn't share the same origin(scheme, host, port) as the source HTML, the browser will have to check the `Access-Control-Allow-origin` response header.
If it contains `*` or the URL of the source HTML, the browser will process the response, otherwise the browser will refuse to process it and throw an error.
  
The <strong>same-origin policy</strong> is a security mechanism implemented by browsers in order to prevent session hijacking among other security vulnerabilities.

In order to enable legitimate cross-origin requests (requests to URLs that don't share the same origin) W3C came up with a mechanism called <strong>CORS</strong>(Cross-Origin Resource Sharing). According to [Wikipedia](https://en.wikipedia.org/wiki/Cross-origin_resource_sharing):

> <i>Cross-origin resource sharing (CORS) is a mechanism that allows restricted resources (e.g. fonts) on a web page to be requested from another domain outside the domain from which the first resource was served.
A web page may freely embed cross-origin images, stylesheets, scripts, iframes, and videos.
Certain "cross-domain" requests, notably Ajax requests, are forbidden by default by the same-origin security policy.</i>

The problem is that, by default, the JavaScript code of an application that runs in a browser can only communicate with a server in the same [origin](https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy).
Because our server is in localhost port 3001, while our frontend is in localhost port 3000, they do not have the same origin.

Keep in mind, that [same-origin policy](https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy) and CORS are not specific to React or Node.
They are universal principles regarding the safe operation of web applications.

We can allow requests from other <i>origins</i> by using Node's [cors](https://github.com/expressjs/cors) middleware.

In your backend repository, install <i>cors</i> with the command

```bash
npm install cors
```

take the middleware to use and allow for requests from all origins:

```js
const cors = require('cors')

app.use(cors())
```

And the frontend works! However, the functionality for changing the importance of notes has not yet been implemented on the backend.

You can read more about CORS from [Mozilla's page](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS).

The setup of our app looks now as follows:

![diagram of react app and browser](../../images/3/100.png)

The react app running in the browser now fetches the data from node/express-server that runs in localhost:3001.

### Application to the Internet

Now that the whole stack is ready, let's move our application to the internet.

There are an ever-growing number of services that can be used to host an app on the internet.
The developer-friendly services like PaaS (i.e. Platform as a Service) take care of installing the execution environment (e.g. Node.js) and could also provide various services such as databases.

For a decade, [Heroku](http://heroku.com) was dominating the PaaS scene. Unfortunately the free tier Heroku ended at 27th November 2022.
This is very unfortunate for many developers, especially students. Heroku is still very much a viable option if you are willing to spend some money.
They also have [a student program](https://www.heroku.com/students) that provides some free credits.

We are now introducing two services [Fly.io](https://fly.io/) and [Render](https://render.com/) that both have a (limited) free plan.
Fly.io is our "official" hosting service since it can be for sure used also on the parts 11 and 13 of the course.
Render will be fine at least for the other parts of this course.

Note that despite using the free tier only, Fly.io <i>might</i> require one to enter their credit card details.
At the moment Render can be used without a credit card.

Render might be a bit easier to use since it does not require any software to be installed on your machine.

There are also some other free options hosting options that work well for this course, at least for all parts other than part 11 (CI/CD) that might have one tricky exercise for other platforms.

Some course participants have also used the following

- [Railway](https://railway.app/)
- [Cyclic](https://www.cyclic.sh/)
- [Replit](https://replit.com)
- [CodeSandBox](https://codesandbox.io)

If you know some other good and easy-to-use services for hosting NodeJS, please let us know!

For both Fly.io and Render, we need to change the definition of the port our application uses at the bottom of the <i>index.js</i> file like so:

```js
const PORT = process.env.PORT || 3001  // highlight-line
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
```

Now we are using the port defined in the [environment variable](https://en.wikipedia.org/wiki/Environment_variable) *PORT* or port 3001 if the environment variable *PORT* is undefined.
Fly.io and Render configure the application port based on that environment variable.

#### Fly.io

<i>Note that you may need to give your credit card number to Fly.io even if you are using only the free tier!</i>
There have actually been conflicting reports about this, it is known for a fact that some of the students in this course are using Fly.io without entering the credit card info.
At the moment [Render](https://render.com/) can be used without a credit card.

By default, everyone gets two free virtual machines that can be used for running two apps at the same time.

If you decide to use [Fly.io](https://fly.io/) begin by installing their flyctl executable following [this guide](https://fly.io/docs/hands-on/install-flyctl/).
After that, you should [create a Fly.io account](https://fly.io/docs/hands-on/sign-up/).

Start by [authenticating](https://fly.io/docs/hands-on/sign-in/) via the command line with the command

```bash
fly auth login
```

*Note* if the command *fly* does not work on your machine, you can try the longer version *flyctl*.
E.g. on MacOS, both forms of the command work.

<i>If you do not get the flyctl to work in your machine, you could try Render (see next section), it does not require anything to be installed in your machine.</i>

Initializing an app happens by running the following command in the root directory of the app

```bash
fly launch
```

Give the app a name or let Fly.io auto-generate one.
Pick a region where the app will be run.
Do not create a Postgres database for the app and do not create an Upstash Redis database, since these are not needed.
  
The last question is "Would you like to deploy now?".
We should answer "no" since we are not quite ready yet.

Fly.io creates a file <i>fly.toml</i> in the root of your app where the app is configured. To get the app up and running we <i>might</i> need to do a small addition to the part [env] of the configuration:

```bash
[env]
  PORT = "8080" # add this

[experimental]
  auto_rollback = true

[[services]]
  http_checks = []
  internal_port = 8080 
  processes = ["app"]
```

We have now defined in the part [env] that environment variable PORT will get the correct port (defined in part [services]) where the app should create the server. Note that the definition might be already there, but some times it has been missing.

We are now ready to deploy the app to the Fly.io servers. That is done with the following command:

```bash
fly deploy
```

If all goes well, the app should now be up and running.
You can open it in the browser with the command

```bash
fly open
```

After the initial setup, when the app code has been updated, it can be deployed to production with the command

```bash
fly deploy
```

A particularly important command is *fly logs*.
This command can be used to view server logs.
It is best to keep logs always visible!


**Note:** In some cases (the cause is so far unknown) running Fly.io commands especially on Windows WSL has caused problems.
If the following command just hangs

```bash
flyctl ping -o personal
```

your computer can not for some reason connect to Fly.io.
If this happens to you, [this](https://github.com/fullstack-hy2020/misc/blob/master/fly_io_problem.md) describes one possible way to proceed.

If the output of the below command looks like this:

```bash
$ flyctl ping -o personal
35 bytes from fdaa:0:8a3d::3 (gateway), seq=0 time=65.1ms
35 bytes from fdaa:0:8a3d::3 (gateway), seq=1 time=28.5ms
35 bytes from fdaa:0:8a3d::3 (gateway), seq=2 time=29.3ms
...
```

then there are no connection problems!

#### Render

The following assumes that the [sign in](https://dashboard.render.com/) has been made with a GitHub account.

After signing in, let us create a new "web service":

![creating new web service in render](../../images/3/r1.png)

The app repository is then connected to Render:

![enter public git repository url in render](../../images/3/r2.png)

The connecting seem to require that the app reopository is public.

Next we will define the basic configurations. If the app is <i>not</i> at the root of the repository the <i>Root directory</i> needs to be given a proper value:

![providing root directory in render deploy options](../../images/3/r3.png)

After this, the app starts up in the Render. The dashboard tells us the app state and the url where the app is running:

![render showing app state and logs starting up](../../images/3/r4.png)

According to the [documentation](https://render.com/docs/deploys) every commit to GitHub should redeploy the app. For some reason this is not always working.

Fortunately, it is also possible to manually redeploy the app:

![manual redeploy option in render](../../images/3/r5.png)

Also, the app logs can be seen in the dashboard:

![seeing the render app there](../../images/3/r7.png)

We notice now from the logs that the app has been started in the port 10000. The app code gets the right port through the environment variable PORT so it is essential that the file <i>index.js</i> has been updated as follows:

```js
const PORT = process.env.PORT || 3001  // highlight-line
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
```

### Frontend production build

So far we have been running React code in <i>development mode</i>.
In development mode the application is configured to give clear error messages, immediately render code changes to the browser, and so on.

When the application is deployed, we must create a [production build](https://reactjs.org/docs/optimizing-performance.html#use-the-production-build) or a version of the application which is optimized for production.

A production build of applications created with <i>create-react-app</i> can be created with the command [npm run build](https://github.com/facebookincubator/create-react-app#npm-run-build-or-yarn-build).

Let's run this command from the <i>root of the frontend project</i>.

This creates a directory called <i>build</i> (which contains the only HTML file of our application, <i>index.html</i> ) which contains the directory <i>static</i>.
[Minified](<https://en.wikipedia.org/wiki/Minification_(programming)>) version of our application's JavaScript code will be generated in the <i>static</i> directory.
Even though the application code is in multiple files, all of the JavaScript will be minified into one file.
All of the code from all of the application's dependencies will also be minified into this single file.

The minified code is not very readable.
The beginning of the code looks like this:

```js
!function(e){function r(r){for(var n,f,i=r[0],l=r[1],a=r[2],c=0,s=[];c<i.length;c++)f=i[c],o[f]&&s.push(o[f][0]),o[f]=0;for(n in l)Object.prototype.hasOwnProperty.call(l,n)&&(e[n]=l[n]);for(p&&p(r);s.length;)s.shift()();return u.push.apply(u,a||[]),t()}function t(){for(var e,r=0;r<u.length;r++){for(var t=u[r],n=!0,i=1;i<t.length;i++){var l=t[i];0!==o[l]&&(n=!1)}n&&(u.splice(r--,1),e=f(f.s=t[0]))}return e}var n={},o={2:0},u=[];function f(r){if(n[r])return n[r].exports;var t=n[r]={i:r,l:!1,exports:{}};return e[r].call(t.exports,t,t.exports,f),t.l=!0,t.exports}f.m=e,f.c=n,f.d=function(e,r,t){f.o(e,r)||Object.defineProperty(e,r,{enumerable:!0,get:t})},f.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})
```

### Serving static files from the backend

One option for deploying the frontend is to copy the production build (the <i>build</i> directory) to the root of the backend repository and configure the backend to show the frontend's <i>main page</i> (the file <i>build/index.html</i>) as its main page.

We begin by copying the production build of the frontend to the root of the backend.
With a Mac or Linux computer, the copying can be done from the frontend directory with the command

```bash
cp -r build ../backend
```

If you are using a Windows computer, you may use either [copy](https://www.windows-commandline.com/windows-copy-command-syntax-examples/) or [xcopy](https://www.windows-commandline.com/xcopy-command-syntax-examples/) command instead.
Otherwise, simply copy and paste.

The backend directory should now look as follows:

![bash screenshot of ls showing build directory](../../images/3/27new.png)

To make express show <i>static content</i>, the page <i>index.html</i> and the JavaScript, etc., it fetches, we need a built-in middleware from express called [static](http://expressjs.com/en/starter/static-files.html).

When we add the following amidst the declarations of middlewares

```js
app.use(express.static('build'))
```

whenever express gets an HTTP GET request it will first check if the <i>build</i> directory contains a file corresponding to the request's address.
If a correct file is found, express will return it.

Now HTTP GET requests to the address <i>www.serversaddress.com/index.html</i> or <i>www.serversaddress.com</i> will show the React frontend.
GET requests to the address <i>www.serversaddress.com/api/notes</i> will be handled by the backend's code.

Because of our situation, both the frontend and the backend are at the same address, we can declare *baseUrl* as a [relative](https://www.w3.org/TR/WD-html40-970917/htmlweb.html#h-5.1.2) URL.
This means we can leave out the part declaring the server.

```js
import axios from 'axios'
const baseUrl = '/api/notes' // highlight-line

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

// ...
```

After the change, we have to create a new production build and copy it to the root of the backend repository.

The application can now be used from the <i>backend</i> address <http://localhost:3001>:

![Notes application screenshot](../../images/3/28new.png)

Our application now works exactly like the [single-page app](/en/part0/fundamentals_of_web_apps#single-page-app) example application we studied in part 0.

When we use a browser to go to the address <http://localhost:3001>, the server returns the <i>index.html</i> file from the <i>build</i> repository.
The summarized contents of the file are as follows:

```html
<head>
  <meta charset="utf-8"/>
  <title>React App</title>
  <link href="/static/css/main.f9a47af2.chunk.css" rel="stylesheet">
</head>
<body>
  <div id="root"></div>
  <script src="/static/js/1.578f4ea1.chunk.js"></script>
  <script src="/static/js/main.104ca08d.chunk.js"></script>
</body>
</html>
```

The file contains instructions to fetch a CSS stylesheet defining the styles of the application, and two <i>script</i> tags that instruct the browser to fetch the JavaScript code of the application - the actual React application.

The React code fetches notes from the server address <http://localhost:3001/api/notes> and renders them to the screen.
The communications between the server and the browser can be seen in the <i>Network</i> tab of the developer console:

![Network tab of notes application on backend](../../images/3/29new.png)

The setup that is ready for a product deployment looks as follows:

![diagram of deployment ready react app](../../images/3/101.png)

Unlike when running the app in a development environment, everything is now in the same node/express-backend that runs in localhost:3001.
When the browser goes to the page, the file <i>index.html</i> is rendered.
That causes the browser to fetch the product version of the React app.
Once it starts to run, it fetches the json-data from the address localhost:3001/api/notes.

### The whole app to the internet

After ensuring that the production version of the application works locally, commit the production build of the frontend to the backend repository, and push the code to GitHub again.

If you are using Render a push to GitHub <i>might</i> be enough.
If the automatic deployment does not work, select the "manual deploy" from the Render dashboard.

In the case of Fly.io the new deployment is done with the command

```bash
fly deploy
```

The application works perfectly, except we haven't added the functionality for changing the importance of a note to the backend yet.

![screenshot of notes application](../../images/3/30new.png)

Our application saves the notes to a variable.
If the application crashes or is restarted, all of the data will disappear.

The application needs a database.
Before we introduce one, let's go through a few things.

The setup looks like now as follows:

![diagram of react app on heroku with a database](../../images/3/102.png)

The node/express-backend now resides in the Fly.io/Render server.
When the root address is accessed, the browser loads and executes the React app that fetches the json-data from the Fly.io/Render server.

### Streamlining deploying of the frontend

To create a new production build of the frontend without extra manual work, let's add some npm-scripts to the <i>package.json</i> of the backend repository.

#### Fly.io script

The script looks like this

```json
{
  "scripts": {
    // ...
    "build:ui": "rm -rf build && cd ../part2-notes/ && npm run build && cp -r build ../notes-backend",
    "deploy": "fly deploy",
    "deploy:full": "npm run build:ui && npm run deploy",    
    "logs:prod": "fly logs"
  }
}
```

The script *npm run build:ui* builds the frontend and copies the production version under the backend repository.
*npm run deploy* releases the current backend to Fly.io.

*npm run deploy:full* combines these two scripts.

There is also a script *npm run logs:prod* to show the Fly.io logs.

Note that the directory paths in the script <i>build:ui</i> depend on the location of repositories in the file system.

#### Render

In case of Render, the scripts look like the following

```json
{
  "scripts": {
    //...
    "build:ui": "rm -rf build && cd ../frontend && npm run build && cp -r build ../backend",
    "deploy:full": "npm run build:ui && git add . && git commit -m uibuild && git push"
  }
}
```

The script *npm run build:ui* builds the frontend and copies the production version under the backend repository.
*npm run deploy:full* contains also the necessary <i>git</i> commands to update the backend repository.

Note that the directory paths in the script <i>build:ui</i> depend on the location of repositories in the file system.

>**NB**  On Windows, npm scripts are executed in cmd.exe as the default shell which does not support bash commands.
For the above bash commands to work, you can change the default shell to Bash (in the default Git for Windows installation) as follows:

```md
npm config set script-shell "C:\\Program Files\\git\\bin\\bash.exe"
```

Another option is the use of [shx](https://www.npmjs.com/package/shx).

### Proxy

Changes on the frontend have caused it to no longer work in development mode (when started with command *npm start*), as the connection to the backend does not work.

![Network dev tools showing a 404 on getting notes](../../images/3/32new.png)

This is due to changing the backend address to a relative URL:

```js
const baseUrl = '/api/notes'
```

Because in development mode the frontend is at the address <i>localhost:3000</i>, the requests to the backend go to the wrong address <i>localhost:3000/api/notes</i>.
The backend is at <i>localhost:3001</i>.

If the project was created with create-react-app, this problem is easy to solve.
It is enough to add the following declaration to the <i>package.json</i> file of the frontend repository.

```bash
{
  "dependencies": {
    // ...
  },
  "scripts": {
    // ...
  },
  "proxy": "http://localhost:3001"  // highlight-line
}
```

After a restart, the React development environment will work as a [proxy](https://create-react-app.dev/docs/proxying-api-requests-in-development/).
If the React code does an HTTP request to a server address at <i><http://localhost:3000></i> not managed by the React application itself (i.e. when requests are not about fetching the CSS or JavaScript of the application), the request will be redirected to the server at <i><http://localhost:3001></i>.

Now the frontend is also fine, working with the server both in development- and production mode.

A negative aspect of our approach is how complicated it is to deploy the frontend.
Deploying a new version requires generating a new production build of the frontend and copying it to the backend repository.
This makes creating an automated [deployment pipeline](https://martinfowler.com/bliki/DeploymentPipeline.html) more difficult.
Deployment pipeline means an automated and controlled way to move the code from the computer of the developer through different tests and quality checks to the production environment.
Building a deployment pipeline is the topic of [part 11](https://fullstackopen.com/en/part11) of this course.

There are multiple ways to achieve this (for example placing both backend and frontend code [in the same repository](https://github.com/mars/heroku-cra-node) ) but we will not go into those now.

In some situations, it may be sensible to deploy the frontend code as its own application.
With apps created with create-react-app it is [straightforward](https://github.com/mars/create-react-app-buildpack).

The current backend code can be found on [Github](https://github.com/fullstack-hy2020/part3-notes-backend/tree/part3-3), in the branch <i>part3-3</i>.
The changes in frontend code are in <i>part3-1</i> branch of the [frontend repository](https://github.com/fullstack-hy2020/part2-notes/tree/part3-1).

</div>

<div class="tasks">

### Exercises 3.9-3.11

The following exercises don't require many lines of code.
They can however be challenging, because you must understand exactly what is happening and where, and the configurations must be just right.

#### 3.9 phonebook backend step9

Make the backend work with the phonebook frontend from the exercises of the previous part.
Do not implement the functionality for making changes to the phone numbers yet, that will be implemented in exercise 3.17.

You will probably have to do some small changes to the frontend, at least to the URLs for the backend.
Remember to keep the developer console open in your browser.
If some HTTP requests fail, you should check from the <i>Network</i>-tab what is going on.
Keep an eye on the backend's console as well.
If you did not do the previous exercise, it is worth it to print the request data or <i>request.body</i> to the console in the event handler responsible for POST requests.

#### 3.10 phonebook backend step10

Deploy the backend to the internet, for example to Fly.io or Render.

Test the deployed backend with a browser and Postman or VS Code REST client to ensure it works.

**PRO TIP:** When you deploy your application to Internet, it is worth it to at least in the beginning keep an eye on the logs of the application **AT ALL TIMES**.

Create a README.md at the root of your repository, and add a link to your online application to it.

#### 3.11 phonebook full stack

Generate a production build of your frontend, and add it to the internet application using the method introduced in this part.

**NB** If you use Render, make sure the directory <i>build</i> is not gitignored

Also, make sure that the frontend still works locally (in development mode when started with command *npm start*).

If you have problems getting the app working make sure that your directory structure matches [the example app](https://github.com/fullstack-hy2020/part3-notes-backend/tree/part3-3).

</div>
