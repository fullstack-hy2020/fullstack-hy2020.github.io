---
mainImage: ../../../images/part-12.svg
part: 12
letter: b
lang: en
---

<div class="content">


In the previous section, we used two different base images: ubuntu and node and did some manual work to get a simple "Hello, World!" running. The tools and commands we learned during that process will be helpful. In this section, we will learn how to build images and configure environments for our applications. We will start with a regular Express/Node.js backend. We will build on top of that with a few services such as a database.

### Dockerfile

Instead of modifying a container by copying files inside, we can create a new image that contains the "Hello, World!" application. The tool for this is the Dockerfile. Dockerfile is a simple text file that contains all of the instructions for creating an image. Let's create an example Dockerfile from the "Hello, World!" application.

If you did not already, create a directory on your machine and create a file called <i>Dockerfile</i> inside that directory. Let's also put an <i>index.js</i> containing _console.log('Hello, World!')_ next to the Dockerfile. Your directory structure should look like this:

```
├── index.js
└── Dockerfile
```

inside that Dockerfile we will tell the image three things:

- Use the node:16 as the base for our image
- Include the index.js inside the image, so we don't need to manually copy it into the container
- When we run a container from the image, use node to execute the index.js file.

The wishes above will translate into a basic Dockerfile. The best location to place this file is usually at the root of the project. 

The resulting <i>Dockerfile</i> looks like this:

```Dockerfile
FROM node:16

WORKDIR /usr/src/app

COPY ./index.js ./index.js

CMD node index.js
```

FROM instruction tells us that the base image is node:16. COPY instruction will copy the file <i>index.js</i> from the host machine to the file with same name in the image. CMD instruction tells what happens when _docker run_ is used. CMD is the default command that can then be overwritten with the parameter given after the image name. See _docker run --help_ if you forgot.

I included one additional instruction, WORKDIR, to make sure we don't interfere with the contents that the image already had. It will ensure all of the following commands will have <i>/usr/src/app</i> set as the working directory. If the directory doesn't exist in the image, it will be created. 

If we do not specify a WORKDIR we risk overwriting important files by accident. If you check the root (_/_) of the node:16 with _docker run node:16 ls_ image you can notice all of the directories and files that are already included in the image since we use the node:16 as the base image.

Now we can use the command _docker build_ to build an image based on the Dockerfile. Let's spice up the command with one additional flag: _-t_, this will help us name the image:

```
$ docker build -t fs-hello-world . 
[+] Building 3.9s (8/8) FINISHED
...
```

So the result is "docker please build with tag fs-hello-world the Dockerfile in this directory". You can point to any Dockerfile, but in our case, simple dot will mean the Dockerfile in <i>this</i> directory, that is why the command ends with a dot. After the build is finished you can run it with _docker run fs-hello-world_.

As images are just files, they can be moved around, downloaded and deleted. You can list the images you have locally with _docker image ls_, delete them with _docker image rm_. See what other command you have available with _docker image --help_.

### More meaningful image

Moving an Express server to a container should be as simple as moving the "Hello, World!" application inside a container. The only difference is that there are more files. Thankfully _COPY_ instruction can handle all that. Let's delete the index.js and create a new express server. Lets use [express-generator](https://expressjs.com/en/starter/generator.html) to create a basic Express application skeleton.

```bash
$ npx express-generator
  ...
  
  install dependencies:
    $ npm install

  run the app:
    $ DEBUG=playground:* npm start
```

First, let's run the application to get an idea of what we just created. Note that the command to run the application may be different from you, my directory was called playground.

```bash
$ npm install
$ DEBUG=playground:* npm start
  playground:server Listening on port 3000 +0ms
```

Great, so now we can navigate to [http://localhost:3000](http://localhost:3000) and the app is running there.

Containerizing that should be relatively easy based on the previous example.

- Use node as base
- Set working directory so we don't interfere with the contents of the base image
- Copy ALL of the files in this directory to the image
- Start with DEBUG=playground:* npm start

Let's place the following Dockerfile at the root of the project:

```Dockerfile
FROM node:16

WORKDIR /usr/src/app

COPY . .

CMD DEBUG=playground:* npm start
```

Let's build the image from that with command, _docker build -t express-server ._ and run it with _docker run -p 3123:3000 express-server_. The _-p_ flag will inform Docker that a port from the host machine should be opened and directed to a port in the container, the format is _-p host:application_.

```console
$ docker run -p 3123:3000 express-server

> playground@0.0.0 start
> node ./bin/www

Tue, 29 Jun 2021 10:55:10 GMT playground:server Listening on port 3000
```

> If yours doesn't work, skip to the next section. There I explain why it doesn't work even if you followed the steps correctly.

The application is now running! Let's test it by sending a GET request to [http://localhost:3123/](http://localhost:3123/).

Shutting it down is a headache at the moment. Use another terminal and _docker kill_ command to kill the application. The _docker kill_ will send a kill signal (SIGKILL) to the application to force it to shut down. As an argument it needs the name or id of the container.

Here I choose to kill it with the ID. The beginning of the ID is enough for docker to know which container I mean.

```
$ docker container ls
  CONTAINER ID   IMAGE            COMMAND                  CREATED         STATUS         PORTS                                       NAMES
  48096ca3ffec   express-server   "docker-entrypoint.s…"   9 seconds ago   Up 6 seconds   0.0.0.0:3123->3000/tcp, :::3123->3000/tcp   infallible_booth

$ docker kill 48
  48
```

In the future, let's use the same port on both sides of _-p_. Just so we don't have to remember which one we happened to choose.

#### Fixing potential issues we created by copy-pasting

There are a few steps we need to change to create a more comprehensive Dockerfile. It may even be that the above example doesn't work in all cases because we skipped an important step.

When we ran npm install on our machine, in some cases **node package manager** may install operating system specific dependencies during the install step. We may accidentally move non-functional parts to the image with the COPY instruction. This can easily happen if we copy the <i>node_modules</i> directory into the image.

This is a critical thing to keep in mind when we build our images. It's best to do most things, such as to run _npm install_ during the build process <i>inside the container</i> rather than doing those in host macihne. The easy rule of thumb is to only copy the files that make sense to push into Github. Build artefacts or dependencies should not be copied since those can be installed during the build process.

We can use <i>.dockerignore</i> to solve the problem. The file .dockerignore is very similar to .gitignore, you can use that to prevent unwanted files from being copied to your image. The file should be placed next to the Dockerfile. Here is a possible content of <i>.dockerignore</i>

```
.dockerignore
.gitignore
node_modules
Dockerfile
```

However, in our case the .dockerignore isn't the only thing required. We will need to install the dependencies during the build step. _Dockerfile_ changes to:

```bash
FROM node:16

WORKDIR /usr/src/app

COPY . .

RUN npm install // highlight-line

CMD DEBUG=playground:* npm start
```

The npm install can be risky. Instead of using npm install, npm offers a much better tool for installing dependencies, the _ci_ command.

Differences between ci and install:

- install may update the package-lock.json
- install may install a different version of a dependency if you have ^ or ~ in the version of the dependency.

- ci will delete the node_modules folder before installing anything
- ci will follow the package-lock.json and does not alter any files

So in short: _ci_ creates reliable builds, while _install_ is the one to use when you want to install new dependencies.

As we are not installing anything new during the build step, and we don't want the versions to suddenly change, we will use _ci_:

```bash
FROM node:16

WORKDIR /usr/src/app

COPY . .

RUN npm ci // highlight-line

CMD DEBUG=playground:* npm start
```

Even better, we can use _npm ci --only-production_ to not waste time installing development dependencies.

> As you noticed in the comparison list; npm ci will delete the node_modules folder so creating the .dockerignore did not matter. However, .dockerignore is an amazing tool when you want to optimize your build process. We will talk briefly about these optimizations later.

Now the Dockerfile should work again, try it with _docker build -t express-server . && docker run -p 3000:3000 express-server_

> Note that we are here chaining two bash commands with &&. We could get (nearly) the same effect by running both commands separately. When chaining commands with && if one command fails, the next ones in the chain will not be executed.

We set an environment variable _DEBUG=playground:*_ during CMD for the npm start. However, with Dockerfiles we could also use the instruction ENV to set environment variables. Let's do that:

```bash
FROM node:16

WORKDIR /usr/src/app

COPY . .

RUN npm ci 

ENV DEBUG=playground:* // highlight-line

CMD npm start // highlight-line
```

> <i>If you're wondering what the DEBUG environment variable does, read [here](http://expressjs.com/en/guide/debugging.html#debugging-express).</i>

#### Dockerfile best practices

There are 2 rules of thumb you should follow when creating images:

- Try to create as **secure** of an image as possible
- Try to create as **small** of an image as possible

Smaller images are more secure by having less attack surface area, and smaller images also move faster in deployment pipelines.

Snyk has a great list of 10 best practices for node/express containerization, read those [here](https://snyk.io/blog/10-best-practices-to-containerize-nodejs-web-applications-with-docker/).

One big carelessness we have left is having the application running as root instead of using a user with less priviledges. Let's do a final fix to the Dockerfile:

```bash
FROM node:16

USER node // highlight-line
  
WORKDIR /usr/src/app

COPY --chown=node:node . .  // highlight-line

RUN npm ci 

ENV DEBUG=playground:*

CMD npm start
```

</div>
  
<div class="tasks">

### Exercise 12.5.

#### Exercise 12.5: Containerizing a node application

> In this exercise, submit <i>at least</i> the Dockerfile you created.

The following repository contains an express application in the express-app directory: [part12-containers-applications](https://github.com/fullstack-hy2020/part12-containers-applications). You do not need the other directory yet. Copy the contents into your own repository. The express-app directory includes a README on how to start the application.

Step 1. Containerize the application by creating a Dockerfile and building an image.

Step 2. Run the image with the correct ports open. Make sure the visit counter increases when used through a browser.

Tip: Run the application outside of a container to examine it before starting to containerize.

</div>
  
<div class="content">

### Using docker-compose

In the previous section, we created express-server and knew that it runs in port 3000, and ran it with _docker build -t express-server . && docker run -p 3000:3000 express-server_. This already looks like something you would need to put into a script to remember. Fortunately, Docker offers us a better solution.

[Docker-compose](https://docs.docker.com/compose/) is another fantastic tool, which can help us manage containers. Let's start using docker-compose as we learn more about containers as it will help us save some time with the configuration.

Install the docker-compose tool from this link: [https://docs.docker.com/compose/install/](https://docs.docker.com/compose/install/).

Let's check that it works:

```
$ docker-compose -v
docker-compose version 1.29.2, build 5becea4c
```

And now we can turn the previous spell into a yaml file. The best part about yaml files is that you can save these to a Git repository!

Create file **docker-compose.yml** and place it next to the Dockerfile, at the root of the project. The file content is

```yaml
version: '3.8'            # Version 3.8 is quite new and should work

services:
  app:                    # The name of the service, can be anything
    image: express-server # Declares which image to use
    build: .              # Declares where to build if image is not found
    ports:                # Declares the ports to publish
      - 3000:3000
```

The meaning of each line is explained as a comment. If you want to see the full specification see the [documentation](https://docs.docker.com/compose/compose-file/compose-file-v3/).

Now we can use _docker-compose up_ to build and run the application. If we want to rebuild the images we can use _docker-compose up --build_.

You can also run the application in the background with _docker-compose up -d_ (_-d_ for detached) and close it with _docker-compose down_.

Creating files like this that <i>declare</i> what you want instead of script files that you need to run in a specific order / a specific number of times is often a great practice.

</div>

<div class="tasks">

### Exercise 12.6.

#### Exercise 12.6: docker-compose

> For this exercise, submit <i>at least</i> the docker-compose.yml you created.

Create a docker-compose file that works with the node application from the previous exercise.

The visit counter is the only feature that is required to be working.

</div>

<div class="content">

### Utilizing containers when developing software

When you are developing software, containerization can be used in various ways to improve your quality of life. One of the most useful cases is by bypassing the need to install and configure tools twice.

It may not be the best option to move your entire development environment into a container, but if that's what you want it's possible. We will revisit this idea at the end of this part. But until then, <i>run the node application itself outside of containers</i>.

The application we met in the previous exercises can use MongoDB. Let's explore [Docker Hub](https://hub.docker.com/) to find a mongodb image. Docker Hub is the default place where docker pulls the images from, you can use other registries as well, but since we are already knee-deep in docker I chose that one. With a quick search I found [https://hub.docker.com/_/mongo](https://hub.docker.com/_/mongo)

`docker-compose.yml`

```yml
version: '3.8'

services:
  mongo:
    image: mongo
    ports:
     - 3456:27017
    environment:
      MONGO_INITDB_ROOT_USERNAME: root
      MONGO_INITDB_ROOT_PASSWORD: example
      MONGO_INITDB_DATABASE: the_database
```

The environment variables defined above are explained on the Docker Hub page:

> These variables, used in conjunction, create a new user and set that user's password. This user is created in the admin authentication database and given the role of root, which is a "superuser" role.

And since we are only using it in development we can leave them like that. The last environment variable *MONGO\_INITDB\_DATABASE* will tell mongo to create a database with that name. Let's save that as the docker-compose.yml in the directory.

Now start the mongo with _docker-compose up -d_, it will run it in the background and you can view the logs with _docker-compose logs -f_, the _-f will ensure we <i>follow</i> the logs.

As said previously, now we do not want to run the Node application inside a container. Developing while the application itself is inside a container is a challenge. We will explore that option in the future.

Run the good old _npm install_ first on your own machine. Then let's start the application with the relevant environment variable. You can modify the code to set them as the defaults or use the .env file. There is no hurt in putting these keys to GitHub since they are only used in your local development environment. I'll just throw them in with the _npm run dev_ to help you copy-paste.

```
$ MONGO_URL=mongodb://localhost:3456/the_database npm run dev
```

This won't be enough; we need to create a user to be authorized inside of the container. The url http://localhost:3000/todos leads to an authentication error.

#### Bind mount

In the MongoDB Docker Hub page under "Initializing a fresh instance" is the info on how to execute js to initialize the database and an user for it.

Let's create a file _mongo-init.js_ and place it in the mongo directory of the express project.

`mongo-init.js`

```javascript
db.createUser({
  user: 'the_username',
  pwd: 'the_password',
  roles: [
    {
      role: 'dbOwner',
      db: 'the_database',
    },
  ],
});

db.createCollection('todos');

db.todos.insert({ text: 'Write code', done: true });
db.todos.insert({ text: 'Learn about containers', done: false });
```

It will initialize the database with a user and a few todos. Next, we need to get it inside the container at startup.

We could create a new image FROM mongo and COPY the file inside. Or we can use a bind mount to mount the init-mongo.js to the container. Let's do the latter.

Bind mount is the act of binding a file on the host machine to a file in the container. We can add a _-v_ flag with _container run_. The syntax is _-v FILE-IN-HOST:FILE-IN-CONTAINER_. But since we already learned about Docker Compose let's skip that. The bind mount is declared under "volumes" in docker-compose. Otherwise the format is the same, first host and then container:

`docker-compose.yml`

```yml
  mongo:
    image: mongo
    ports:
     - 3456:27017
    environment:
      MONGO_INITDB_ROOT_USERNAME: root
      MONGO_INITDB_ROOT_PASSWORD: example
      MONGO_INITDB_DATABASE: the_database
    volumes:
      - ./mongo/mongo-init.js:/docker-entrypoint-initdb.d/mongo-init.js
```

The result is that the mongo-init file in the mongo folder is the same as the mongo-init file in the containers /docker-entrypoint-initdb.d directory. Changes to either file will be available in the other. We don't need to make any changes during runtime. But this will be the key to software development in containers.

Run _docker-compose down --volumes_ to ensure that nothing is left and start from a clean slate with _docker-compose up_ to initialize the database.

If you see an error like this:

```
mongo_database | failed to load: /docker-entrypoint-initdb.d/mongo-init.js
mongo_database | exiting with code -3
```

you may have a read permission problem. They are not uncommon when dealing with volumes. In the above case, you can use _chmod a+r mongo-init.js_, which will give everyone read access to that file. Be careful when using _chmod_ since granting more privileges can be a security issue. Use the _chmod_ only on the mongo-init.js on your computer.

Now starting the express application with the correct environment variable should work:

```
$ MONGO_URL=mongodb://the_username:the_password@localhost:3456/the_database npm run dev
```

Let's check that the http://localhost:8000/todos returns all todos. It should return the two todos we initialized. We can use Postman to test the basic functionality for todos like delete todo.

#### Persisting data with volumes

By default, containers are not going to preserve our data. When you close the mongo container you may or may not be able to get the data back.

This is a rare case in which it does preserve the data as the developers who made the docker image for Mongo have defined a volume to be used: [https://github.com/docker-library/mongo/blob/cb8a419053858e510fc68ed2d69415b3e50011cb/4.4/Dockerfile#L113](https://github.com/docker-library/mongo/blob/cb8a419053858e510fc68ed2d69415b3e50011cb/4.4/Dockerfile#L113) This line will instruct Docker to preserve the data in those directories.

There are two distinct methods to store the data: 
  1. Declaring a location in your filesystem (called bind mount)
  2. Letting Docker decide where to store the data (volume)

I prefer the first choice in most cases whenever you **really** need to avoid deleting the data. Let's see both in action with docker-compose;

`docker-compose.yml`

```yml
services:
  mongo:
    image: mongo
    ports:
     - 3456:27017
    environment:
      MONGO_INITDB_ROOT_USERNAME: root
      MONGO_INITDB_ROOT_PASSWORD: example
      MONGO_INITDB_DATABASE: database
    volumes:
      - ./mongo/mongo-init.js:/docker-entrypoint-initdb.d/mongo-init.js
      - ./mongo_data:/data/db
```

The above will create a directory called _mongo_data_ to your local filesystem and map it into the container as _/data/db_. This means the data in _/data/db_ is stored outside of the container but still accessible by the container! Just remember to add the directory to .gitignore.

A similiar outcome can be had with a named volume:

`docker-compose.yml`

```yml
services:
  mongo:
    image: mongo
    ports:
     - 3456:27017
    environment:
      MONGO_INITDB_ROOT_USERNAME: root
      MONGO_INITDB_ROOT_PASSWORD: example
      MONGO_INITDB_DATABASE: database
    volumes:
      - ./mongo/mongo-init.js:/docker-entrypoint-initdb.d/mongo-init.js
      - mongo_data:/data/db

volumes:
  mongo_data:
```

Now the volume is created but managed by Docker. After starting the application (_docker-compose up_) you can list the volumes with _docker volume ls_, inspect one of them with _docker volume inspect_ and even delete them with _docker volume rm_. It's still stored in your local filesystem but figuring out <i>where</i> may not be as trivial as with the previous option.

</div>

<div class="tasks">

### Exercise 12.7.

#### Exercise 12.7: Little bit of mongodb coding

> In this exercise, submit the entire express application with the Dockerfile AND docker-compose.yml.

The todo express application is missing both _get one_ and _update_. 

Fix _get one_ to return one todo with and id, and _update_ to update one todo with an id.

</div>

<div class="content">

### Debugging issues in containers

> When coding, you most likely end up in a situation where everything is broken. 

> \- Matti Luukkainen

We need to learn new tools for debugging. When code has a bug you may often be in a state where at least something works so you can work forward from that. Configuration most often is in either of the two states: 1. working or 2. broken. We'll go over a few tools to help when your application is in the latter state.

The most difficult thing about this is that configuration is often broken when it's not finished. So when you write a long docker-compose.yml or Dockerfile and it does not work, you need to take a moment and think about the various ways you could confirm something is working.

<i>Question Everything</i> is still applicable here. As said in part 3: The key is to be systematic. Since the problem can exist anywhere, <i>you must question everything</i>, and eliminate all possibilities one by one.

For myself the most important method of debugging is stopping and thinking about what I'm trying to accomplish instead of just bashing my head at the problem. Often there is a simple alternate solution or quick google search that will get me moving forward. 


#### exec

The docker command _exec_ is a heavy hitter. It can be used to jump right into a container when it's running. That's it.

Let's start a web serverin the background and do a little bit of debugging to get it running and displaying the message "Hello, exec!" in our browser. Let's choose Nginx. Nginx is, among other things, a server capable of serving static HTML files. It has a default index.html that we can replace.

```console
$ docker container run -d nginx
```

Ok, now the questions are:

1. Where should we go with our browser? 
2. Is it even running? 

We know how to answer the latter: by listing the running containers.

```console
$ docker container ls
CONTAINER ID   IMAGE           COMMAND                  CREATED              STATUS                      PORTS     NAMES
3f831a57b7cc   nginx           "/docker-entrypoint.…"   About a minute ago   Up About a minute           80/tcp    keen_darwin
```

Yes! We got the first question answered as well. It seems to listen on port 80, as seen on the output above.

Let's shut it down and restart with the _-p_ flag to have our browser access it.

```console
$ docker container stop keen_darwin
$ docker container rm keen_darwin

$ docker container run -d -p 8080:80 nginx
```

Let's look at the app by going to http://localhost:8080. It seems the app is showing the wrong message! Let's hop right into the container and fix the it. Keep your browser open, we won't need to shut down the container for this fix. We will execute bash inside the container, the flags _-it_ will ensure that we can interact with the container:

```console
$ docker container ls
CONTAINER ID   IMAGE     COMMAND                  CREATED              STATUS              PORTS                                   NAMES
7edcb36aff08   nginx     "/docker-entrypoint.…"   About a minute ago   Up About a minute   0.0.0.0:8080->80/tcp, :::8080->80/tcp   wonderful_ramanujan

$ docker exec -it wonderful_ramanujan bash
root@7edcb36aff08:/#
```

Now that we are in, we need to find the faulty file and replace it. Quick Google tells us that file itself is _/usr/share/nginx/html/index.html_.

Let's move to the directory and delete the file

```console
root@7edcb36aff08:/# cd /usr/share/nginx/html/
root@7edcb36aff08:/# rm index.html
```

Now if we go to http://localhost:8080/ we know that we deleted the correct file. The page shows 404. Let's replace it with one containing the correct contents:

```console
root@7edcb36aff08:/# echo "Hello, exec!" > index.html
```

Refresh the page and our message is displayed! So exec can be used to interact with the containers. Remember that all of the changes are lost when the container is deleted so if you want to preserve them you can use _commit_.

</div>

<div class="tasks">

### Exercise 12.8.

#### Exercise 12.8: Mongo command-line interface

> Use _script_ to record what you do, save the generated file into the repository as your answer.

While the MongoDB from the previous exercise is running access the database with mongo command-line interface (CLI). You can do that using docker exec. Then add a new todo using the CLI.

The command to open CLI when inside the container is _mongo_

The mongo CLI will require the username and password flags to authenticate correctly. Flags _-u root -p example_ should work, the values are from the docker-compose.yml.

* Step 1: Run mongodb
* Step 2: Use docker exec to get inside the container
* Step 3: Open mongo cli

When you have connected to the mongo cli you can ask it to show dbs inside:

```console
> show dbs
admin         0.000GB
config         0.000GB
local         0.000GB
the_database  0.000GB
```

To access the correct database:

```console
> use the_database
```

And finally to find out the collections:

```console
> show collections
todos
```

We can now access the data in those collections:

```
> db.todos.find({})
{ "_id" : ObjectId("611e54b688ddbb7e84d3c46b"), "text" : "Write code", "done" : true }
{ "_id" : ObjectId("611e54b688ddbb7e84d3c46c"), "text" : "Learn about containers", "done" : false }
```

Use the documentation [here](https://docs.mongodb.com/v4.4/reference/method/db.collection.insertOne/#mongodb-method-db.collection.insertOne) to insert one new todo with the text: "Increase the number of tools in my toolbelt" with status done as false!

</div>

<div class="content">

### Redis

Redis has nothing to do with containers. But since we are already able to add <i>any</i> 3rd party service to your applications, why not learn about a new one.

Redis is a data store. So just like MongoDB, it can be used to store data. The difference is that Redis stores key-value data. And it is by default in-memory, which means that it does not store data persistently.

An excellent use case for Redis is to use it as a cache. Caches are often used to store data that is otherwise slow to fetch, and save it until it's no longer valid and then fetch the data and store it to the cache.

</div>

<div class="tasks">

### Exercises 12.9. - 12.11.

#### Exercise 12.9: Setup Redis to project

> In this exercise, submit the entire express application, with the Dockerfile AND docker-compose.yml.

The application will be able to use Redis by giving it the *REDIS_URL* environment variable. Find and read through the [Docker Hub page for redis](https://hub.docker.com/_/redis), add it to the docker-compose.yml by defining another service after mongo:

`docker-compose.yml`

```yml
services:
  mongo:
    ...
  redis:
    ???
```

Since the Docker Hub page doesn't have all info we can use Google to aid us. The default port for Redis is found by doing so:

![](../../images/12/redis_port_by_google.png)

We won't have any idea if the configuration works unless we try it. The application will not start using Redis by itself. You will need to require the config by adding something along the lines of

```js
const redis = require('../redis')
```

to the express server. You may also move to the next exercise. The next exercise will require Redis to be available and configured correctly.
  
#### Exercise 12.10:

> In this exercise, submit the entire express application with the Dockerfile AND docker-compose.yml.

The project already has [https://www.npmjs.com/package/redis](https://www.npmjs.com/package/redis) installed and two functions "promisified" - getAsync and setAsync.

- setAsync function takes in key and value, using the key to store the value.

- getAsync function takes in key and returns the value in a promise.

Implement a todo counter:

- Step 1: Whenever a request is sent to add a todo, increment the counter by one.
- Step 2: Create a GET /statistics endpoint where you can ask the usage metadata. The format should be the following JSON:

```json
{
  added_todos: 0,
}
```

#### Exercise 12.11:

> Use _script_ to record what you do, save the generated file into the repository as your answer.

Like we did with MongoDB we can do with Redis. Use Redis command-line interface to edit the value in the database. 

The command to open the Redis CLI is _redis-cli_.

You can find the key you used with _[KEYS *](https://redis.io/commands/keys)_

And set the value with _[SET](https://redis.io/commands/set)_, giving it the key and then the value

As the last step, set the value of the counter to 9001.

Make sure that the new value works by using your application. Refresh the application and see that it has the new number, and the redis cli shows new number when asking with _[GET](https://redis.io/commands/get)_, giving it the key
  
</div>

<div class="content">

#### Persisting data with Redis

In the previous section, I said that <i>by default</i> Redis does not persist the data. However, the persistence is easy to toggle on. We will only need to start the Redis with a different command, as instructed by the docker hub page:

`docker-compose.yml`
```yml
services:
  redis:
    # Everything else
    command: ['redis-server', '--appendonly', 'yes'] # Overwrite the CMD
    volumes: # Declare the volume
      - ./redis_data:/data
```

Remember to add the directory to .gitignore.

#### Other functionality Redis has

In addition to the most basic get & set, Redis can automatically expire keys. And manage multiple key-value pairs at the same time.

Redis can also be used to Publish messages and Subscribe to messages (PubSub or Publish-subscribe pattern). Publish-subscribe is great for having multiple applications communicate with each other. Redis works as the message broker between two or more applications, where one of them is publishing messages by sending them to Redis, and the other one is subscribed to those messages. We will not explore messaging further in this part.

</div>

<div class="tasks">

### Exercise 12.12.
  
#### Exercise 12.12: Persisting data in redis

> In this exercise, submit the entire express application, with the Dockerfile AND docker-compose.yml.

Check that the data is not persisted by default: after running _docker-compose down_ and _docker-compose up_ the counter value is reset to 0.

Then create a volume for redis data and make sure that the data survives after running _docker-compose down_ and _docker-compose up_.

</div>
