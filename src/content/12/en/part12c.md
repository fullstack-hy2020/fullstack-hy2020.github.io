---
mainImage: ../../../images/part-12.svg
part: 12
letter: c
lang: en
---

<div class="content">

### React

Let's create and containerize a react application next. I'll choose npm as the package manager even though create-react-app defaults to yarn.

```
$ npx create-react-app hello-front --use-npm
  ...

  Happy hacking!
```

The create-react-app already installed all dependencies for us, so we did not need to run npm install here.

The next step is to turn the code, js and modules, into production-ready static files. Create-react-app already has build as an npm script so let's use that:

```
$ npm run build
  ...

  Creating an optimized production build...
  ...
  The build folder is ready to be deployed.
  ...
```

Great! Final step is figuring a way to use a server to serve the static files. As you may know we could use our [express.static](https://expressjs.com/en/starter/static-files.html) with the express server to serve static files. I'll leave that as an exercise, instead we are going to go ahead and start writing our Dockerfile.

`Dockerfile`

```Dockerfile
FROM node:16

WORKDIR /usr/src/app

COPY . .

RUN npm ci

RUN npm run build
```

That looks about right, let's build it and see if we are on the right track, our goal is to have the build succeed without errors. Then we will use bash to check inside of the container to see if the files are there.

```
$ docker build . -t hello-front
  [+] Building 172.4s (10/10) FINISHED 

$ docker run -it hello-front bash

root@98fa9483ee85:/usr/src/app# ls
  Dockerfile  README.md  build  node_modules  package-lock.json  package.json  public  src

root@98fa9483ee85:/usr/src/app# ls build/
  asset-manifest.json  favicon.ico  index.html  logo192.png  logo512.png  manifest.json  robots.txt  static
```

A valid option for serving static files now that we already have node in the container is [serve](https://www.npmjs.com/package/serve). Let's try installing serve and serving the static files while we are inside the container.

```
root@98fa9483ee85:/usr/src/app# npm install -g serve

  added 88 packages, and audited 89 packages in 6s

root@98fa9483ee85:/usr/src/app# serve build

   ┌───────────────────────────────────┐
   │                                   │
   │   Serving!                        │
   │                                   │
   │   Local:  http://localhost:5000   │
   │                                   │
   └───────────────────────────────────┘

```

Great! Let's ctrl+c and exit out and then add those to our Dockerfile.

```
  ^C
  INFO: Gracefully shutting down. Please wait...

root@98fa9483ee85:/usr/src/app# exit
  exit
```

The installation of serve turns into a RUN so that the dependency is installed during the build process. And the command to serve build directory will be the command to start the software with.

`Dockerfile`

```Dockerfile
...
RUN npm install -g serve

CMD ["serve", "build"]
```

And then build _docker build -t hello-front ._ and run it _docker run -p 5000:5000 hello-front_. The app will then be available in http://localhost:5000.

### Using multiple stages

While serve is a <i>valid</i> option we can do better. With containers a good goal is to create the containers so that they do not contain anything irrelevant so that they have a small number of dependencies and are less likely to break or become vulnerable over time. 

Multi-stage builds are designed for splitting the build process into multiple stages. Conventional options for stages are build stage and test stage. The main goal for using stages is to limit the size of the image. Smaller images are faster to upload and download and they help reduce the number of vulnerabilities your software may have.

With multi-stage builds a tried and true solution like [nginx](https://en.wikipedia.org/wiki/Nginx), can be used to serve static files without a lot of headache. The docker hub [page for nginx](https://hub.docker.com/_/nginx) tells us the required info to open the ports and "Hosting some simple static content".

Let's use the previous Dockerfile but change the FROM to include the name of the stage:

`Dockerfile`

```Dockerfile
# The first FROM is now a stage called build-stage
FROM node:16 AS build-stage

WORKDIR /usr/src/app

COPY . .

RUN npm ci

RUN npm run build

# This is a new stage, everything before this is gone, except the files we want to COPY
FROM nginx:1.20-alpine

# COPY the directory build from build-stage to /usr/share/nginx/html
# The target location here was found from the docker hub page
COPY --from=build-stage /usr/src/app/build /usr/share/nginx/html

```

Now we have declared the build stage and only move the relevant files, the build directory with static content, into an image that is ready to serve the static content.

The default port will be 80 for nginx, so something like _-p 8000:80_ will work.

Multi-stage builds also include some internal optimizations that may affect your builds. As an example, multi-stage builds skip stages that are not used. If we wish to use a stage to replace a part of a build pipeline, like testing or notifications, we must pass **some** data to the following stages. In some cases this is justified: copy the code from testing stage to build stage ensuring that you are building the tested code.

</div>

<div class="tasks">

### Exercises 12.13 - 12.14.

#### Exercise 12.13: Todo application frontend

> In this exercise, submit <i>at least</i> the Dockerfile you created.

The following repository contains an react application in the react-app directory. 

<https://github.com/fullstack-hy2020/part12-containers-applications/tree/main/react-app>

Copy the contents into your own repository. The react-app directory includes a README on how to start the application.

Containerize the application and use [ENV](https://docs.docker.com/engine/reference/builder/#env) instruction to pass *REACT\_APP\_BACKEND\_URL* to the application and run it with the backend. Backend can be running outside a container.

#### Exercise 12.14: Testing during build process

> In this exercise, submit the entire React application, with the Dockerfile.

We can use multiple stages to do testing during the build process. The build process will fail as the tests fail.

Extract a component `Todo` that represents a single todo. Write a test for the new component add run it the build process. You can add a new stage for the test if you wish to do so.

</div>

<div class="content">

### Developing in containers

Let's move the todo application development to a container. There are a few reasons why you would want to do that:

1. To keep the environment similar between development and production to avoid bugs that appear only in production environment
2. To avoid differences between developers and their own environments that lead difficulties in application development
3. To help new team members hop in by having them only be required to install container runtime

These are great reasons. The tradeoff is that we may encounter some unconventional behavior when we aren't running the applications like we are used to. We will need to do at least two things to move the application to a container:

1. Start the application in development mode
2. Access the files with vscode

And let's start with the frontend. Since the Dockerfile will be significantly different to the production Dockerfile let's create a new one called _dev.Dockerfile_. Let's just place this new file in the root of the project.

Starting the create-react-app in development mode should be easy, lets start with the following:

`dev.Dockerfile`

```Dockerfile
FROM node:16

WORKDIR /usr/src/app

COPY . .

# Change npm ci to npm install since we are going to be in development mode
RUN npm install

# npm start is the command to start the application in development mode
CMD ["npm", "start"]
```
 
During build the flag _-f_ will be used to tell which file to use, it would otherwise default to Dockerfile, so _docker build -f ./dev.Dockerfile -t hello-front-dev ._ will build the image. The create-react-app will be served in port 3000, so you can test that it works by running a container with that port published.

The second task, accessing the files with vscode, is not done yet. There are at least two ways of doing this: 
  1. [The Visual Studio Code Remote - Containers extension](https://code.visualstudio.com/docs/remote/containers) 
  2. Volumes, the same thing we used to preserve data with the database

Let's go over the latter since that will work with other editors as well. Let's do a trial run with the flag _-v_ and if that works then we will move the configuration to a docker-compose file. To use the _-v_ we will need to tell it the current directory. The command _pwd_ should output the path to the current directory for you. Try this with _echo $(pwd)_ in your command line. We can use that as the left side for _-v_ to map current directory to the inside of the container or you can use the full directory path.

```
$ docker run -p 3000:3000 -v "$(pwd):/usr/src/app/" hello-front-dev

  Compiled successfully!

  You can now view hello-front in the browser.
```

Now we can simply edit the src/App.js and the changes should be hot-loaded to the browser.

Next let's move that config to a docker-compose.yml. That file should be at the root of the project as well.

`docker-compose.yml`

```yml
services:
  app:
    image: hello-front-dev
    build:
      context: . # The context will pick this directory as the "build context"
      dockerfile: dev.Dockerfile # This will simply tell which dockerfile to read
    volumes:
      - ./:/usr/src/app # The path can be relative, so ./ is enough to say "the same location as the docker-compose.yml"
    ports:
      - 3000:3000
    container_name: hello-front-dev # This will name the container hello-front-dev
```

With this _docker-compose up_ can run the application in development mode. You don't even need node installed to develop it!

Installing new dependencies is a headache for a development setup like this. One of the better options is to install the new dependency **inside** the container. So instead of doing e.g. _npm install axios_, you have to do it in the running container e.g. _docker exec hello-front-dev npm install axios_. Or add it to the package.json and run _docker build_ again.

### Communication between containers in a docker network

The docker-compose tool sets up a network between the containers and includes a DNS to easily connect two containers to one another. Let's add a new service to the docker-compose and we can see how the network and DNS work.

<i>Busybox</i> is a small executable with multiple tools you may need. It is called "The Swiss Army Knife of Embedded Linux" and we definitely can use it to our advantage.

It can be used to debug our configurations. So if you get lost in the later exercises of this section you should use BusyBox to find out what works and what doesn't. Let's use it to explore what I just said. That containers are inside a network and you can easily connect between them.

`docker-compose.yml`
```yml
services:
  app:
    image: hello-front-dev
    build:
      context: .
      dockerfile: dev.Dockerfile
    volumes:
      - ./:/usr/src/app
    ports:
      - 3000:3000
    container_name: hello-front-dev

  debug-helper:
    image: busybox
```

The busybox won't have any process running inside so that we could exec in there. Because of that the output of _docker-compose up_ will also look like this:

```
$ docker-compose up
  Pulling debug-helper (busybox:)...
  latest: Pulling from library/busybox
  8ec32b265e94: Pull complete
  Digest: sha256:b37dd066f59a4961024cf4bed74cae5e68ac26b48807292bd12198afa3ecb778
  Status: Downloaded newer image for busybox:latest
  Starting hello-front-dev          ... done
  Creating react-app_debug-helper_1 ... done
  Attaching to react-app_debug-helper_1, hello-front-dev
  react-app_debug-helper_1 exited with code 0
  
  hello-front-dev | 
  hello-front-dev | > react-app@0.1.0 start
  hello-front-dev | > react-scripts start
```

This is completely expected as it's just a toolbox. Let's use it to send a request to hello-front-dev and see how the DNS works. While the hello-front-dev is running I'll use [wget](https://en.wikipedia.org/wiki/Wget) since it's simple and included in busybox to send a request from the debug-helper to hello-front-dev.

Wget requires the flag _-O_ with _-_ will output the response to the stdout. And then we'll just add the url: _wget -O - URL_. With docker-compose we can use _docker-compose run SERVICE COMMAND_ to run a service with a specific command.

```
$ docker-compose run debug-helper wget -O - http://hello-front-dev:3000

  Creating react-app_debug-helper_run ... done
  Connecting to hello-front-dev:3000 (172.26.0.2:3000)
  writing to stdout
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="utf-8" />
      ...
```

The URL is really the interesting part here. We simply said to connect to the other service and to that port. The port does not need to be published for other services in the same network to be able to connect to it. The "ports" in docker-compose.yml is only for external access.

Let's do a few alterations to the docker-compose to emphasize this:

`docker-compose.yml`
```yml
services:
  app:
    image: hello-front-dev
    build:
      context: .
      dockerfile: dev.Dockerfile
    volumes:
      - ./:/usr/src/app
    ports:
      - 3210:3000
    container_name: hello-front-dev

  debug-helper:
    image: busybox
```

With _docker-compose up_ the application is available in <http://localhost:3210>. But still _docker-compose run debug-helper wget -O - http://hello-front-dev:3000_ works.

![](../../images/12/busybox_networking_drawio.png)

As above image illustrates the _docker-compose run_ asks debug-helper to send the request within the 
network. While the browser would send the request from outside of the network.

Now that you know how easy it is to find other services in a docker-compose.yml and we have nothing to debug we can remove the debug-helper and revert the ports to 3000:3000 in our _docker-compose.yml_.

</div>
<div class="tasks">

### Exercise 12.15

#### Exercise 12.15: Run todo-back in a development container

Use the volumes and nodemon to enable development of the backend while it is running inside a container.

You will also need to rethink the connections between backend and mongo / redis. Thankfully docker-compose can include environment variables that will be passed to the application:

```yaml
services:
  server:
    image: ...
    volumes:
      - ...
    ports:
      - ...
    environment: 
      - REDIS_URL=//localhost:3000
      - MONGO_URL=mongodb://the_username:the_password@localhost:3456/the_database
```

> The urls (localhost) are purposefully wrong, you will need to set the correct values

Here is a possibly helpful image:

![](../../images/12/ex_12_15_backend_drawio.png)

</div>
<div class="content">

#### Communications between containers in a more ambitious environment

Next we will add a reverse proxy to our docker-compose. A reverse proxy will be the single point of entry to our application and we can hide multiple servers behind it. The final goal will be to set both the react application and the express application behind the reverse proxy. There are multiple different options, here are some examples ordered by initial release from newer to older: Traefik, Caddy, Nginx and Apache.

Let's pick Nginx, the docker hub page is [here](https://hub.docker.com/_/nginx). Create a file nginx.conf in the project root and take this template for a configuration. We will need to do minor edits to have our application running:

`nginx.conf`

```conf
# events is required, but defaults are ok
events { }

# A http server, listening at port 80
http {
  server {
    listen 80;

    # Requests starting with root (/) are handled
    location / {
      # The following 3 lines are required for the hot loading to work (websocket).
      proxy_http_version 1.1;
      proxy_set_header Upgrade $http_upgrade;
      proxy_set_header Connection 'upgrade';
      
      # Requests are directed to http://localhost:3000
      proxy_pass http://localhost:3000;
    }
  }
}
```

And next add Nginx to the docker-compose file. Add a volume as instructed in the docker hub page where the right side is _:/etc/nginx/nginx.conf:ro_, the final ro declares that the volume will be <i>read-only</i>.

`docker-compose.yml`

```yml
  nginx:
    image: nginx:1.20.1
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
    ports:
      - 8080:80
    container_name: reverse-proxy
```

with that added we can run docker-compose up and see what happens.

```
$ docker ps
CONTAINER ID   IMAGE             COMMAND                  CREATED         STATUS         PORTS                                       NAMES
a02ae58f3e8d   nginx:1.20.1      "/docker-entrypoint.…"   4 minutes ago   Up 4 minutes   0.0.0.0:8080->80/tcp, :::8080->80/tcp       reverse-proxy
5ee0284566b4   hello-front-dev   "docker-entrypoint.s…"   4 minutes ago   Up 4 minutes   0.0.0.0:3000->3000/tcp, :::3000->3000/tcp   hello-front-dev
```

Connecting to http://localhost:8080 will lead to a familiar looking page with 502 status. 

This is because directing requests to http://localhost:3000 leads to nowhere as the nginx container does not have any application running in port 3000. By definition localhost refers to the current computer used to access it. With containers localhost is unique for each container, leading to the container itself.

Let's test this by going inside the nginx container and using curl to send a request to the application itself. In our usage curl is similar to wget, but won't need any flags.

```
$ docker exec -it reverse-proxy bash  

root@374f9e62bfa8:/# curl http://localhost:80
  <html>
  <head><title>502 Bad Gateway</title></head>
  ...
```

To help us docker-compose set up a network when we ran docker-compose up and had all of the containers join the network. A DNS makes sure we can find the other container. The containers are each given two names: the service name and the container name.

Since we are inside the container now we can also test the DNS! Let's curl the service name (app) in port 3000

```html
root@374f9e62bfa8:/# curl http://app:3000
  <!DOCTYPE html>
  <html lang="en">
    <head>
    ...
    <meta
      name="description"
      content="Web site created using create-react-app"
    />
    ...
```

That is it! Let's replace the proxy_pass address in nginx.conf with that one.

If you are still encountering 503, make sure that the create-react-app has been built first. You can read the logs output from the docker-compose up.

</div>

<div class="tasks">

### Exercises 12.16. - 12.18.

#### Exercise 12.16: Setup nginx in front of todo-front

> In this exercise, submit the entire development environment, including the development Dockerfile AND docker-compose.yml.

Create a development docker-compose yml with nginx and our todo react-app.

![](../../images/12/ex_12_16_nginx_front.png)

You should use the following structure to make the next exercise easier:

```console
├── react-app
└── docker-compose.dev.yml
```

You can use _-f_ flag to specify a file in case you want to have multiple, e.g. _docker-compose -f docker-compose.dev.yml up_

#### Exercise 12.17: Setup nginx in front of todo-back

> In this exercise, submit the entire development environment, including the development Dockerfile AND docker-compose.yml.

Add the express-app to the development docker-compose yml in development mode.

Add a new location to the nginx.conf so that requests to /api are proxied to the backend. Something like this should do the trick:

```conf
  server {
    listen 80;

    # Requests starting with root (/) are handled
    location / {
      # The following 3 lines are required for the hot loading to work (websocket).
      proxy_http_version 1.1;
      proxy_set_header Upgrade $http_upgrade;
      proxy_set_header Connection 'upgrade';
      
      # Requests are directed to http://localhost:3000
      proxy_pass http://localhost:3000;
    }

    # Requests starting with /api are handled
    location /api {
      ...
    }
  }
```

The *proxy\_pass* directive has an interesting feature with a trailing slash. As we are using the path _/api_ for location but the backend application only answers in paths _/_ or _/todos_ we will want the _/api_ to be removed from the request. In other words even though the browser will send a GET request to _/api/todos/1_ we want the nginx to proxy the request to _/todos/1_. This is done by adding a trailing slash _/_ to the url at the end of *proxy\_pass*.

This is a [common issue](https://serverfault.com/questions/562756/how-to-remove-the-path-with-an-nginx-proxy-pass)

![](../../images/12/nginx_trailing_slash_stackoverflow.png)

This illustratrates what we are looking for:

![](../../images/12/ex_12_17_nginx_back.png)

Please use the following structure for this exercise:

```console
├── express-app
├── react-app
└── docker-compose.dev.yml
```

#### Exercise 12.18: Connect todo-front to todo-back

> In this exercise, submit the entire development environment, including both express and react applications, Dockerfiles and docker-compose.yml.

Make sure that the todo-front works with todo-back. It will require changes to the *REACT\_APP\_BACKEND\_URL* environmental variable.

If you already got this working during a previous exercise you may skip this.

</div>

<div class="content">

### Tools for Production

Containers are fun tools to use in development, but the best use case for them is in the production environment. There are a number of more powerful tools than docker-compose to run containers in production.

Tools like Kubernetes allow us to manage containers on a completely new level. It basically hides away the physical machines and allows us developers to worry less about the infrastructure.

If you are interested in learning more in depth about containers come to the [DevOps with Docker](https://devopswithdocker.com) course and you can find more about Kubernetes in the advanced 5 credit [DevOps with Kubernetes](https://devopswithkubernetes.com) course. You should now have the skills to complete both of them.

</div>

<div class="tasks">

### Exercises 12.19.

#### Exercise 12.19:

> In this exercise, submit the entire production environment, including both express and react applications, Dockerfiles and docker-compose.yml.

Create a production docker-compose.yml with all of the services, nginx, react-app, express-app, mongodb and redis.

Please use the following structure for this exercise:

```console
├── express-app
├── react-app
└── docker-compose.yml
```

This was the last exercise in this section. It's time to push your code to GitHub and mark all of your finished exercises to the [exercise submission system](https://studies.cs.helsinki.fi/stats).

</div>
