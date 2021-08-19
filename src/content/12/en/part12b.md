---
mainImage: ../../../images/part-10.svg
part: 12
letter: b
lang: en
---

<div class="content">


In the previous section we used two different base images: ubuntu and node and did some manual work to get a simple "Hello, World!" running. The basic tools we learned during that process are extremely useful. In this section, we will learn how to build containers and configure environments for our own applications. How these can be managed for both React frontend and node backend applications and in addition take a quick peek at other possible backend options you may encounter.

### Dockerfile

Instead of modifying a container by copying files inside there we can create a new image that contains the "Hello, World!" application. The tool for this is the Dockerfile. Dockerfile is a simple text file that contains all of the instructions for creating an image. Let's create an example Dockerfile from the "Hello, World!" application.

Create a file called Dockerfile, put it next to the index.js containing `console.log('Hello, World!')` your directory structure should look like this:

```
├── index.js
└── Dockerfile
```

inside that Dockerfile we will tell the image 3 things:

1. Use the node:16 as the base for our image, we want everything node 16 contains to be available for this image.
2. Include the index.js inside the image, so we don't need to manually copy it into the container
3. When we run a container from the image, use node to execute the index.js file.

```Dockerfile
FROM node:16

WORKDIR /usr/src/app

COPY ./index.js ./index.js

CMD node index.js
```

FROM instruction will tell us that the base is node:16. COPY instruction will copy the file to the file. And CMD instructs what will be executed when `docker run` is used. CMD is the _default_ command that can then be overwritten with the parameter given after image name. See `docker run --help` if you forgot.

I included one additional instruction, WORKDIR makes sure we don't interfere with the contents that the image already had. It will ensure all of the following commands will be in the container in directory /usr/src/app, if the directory doesn't exist it will create it. 

If we do not specify a WORKDIR we risk overwriting unrelated, but important files by accident. If you check the root `/` of the node:16 with `docker run node:16 ls` image you can notice all of the directories and files that are already included in the image. That is due to the fact that we use node as the base image. The node image already contained all of those files, we just added our own. 

Now we can use the command `docker build` to build an image based on the Dockerfile. Let's spice up the command with one additional flag: `-t`, this will help us name the image:

```
$ docker build -t fs-hello-world . 
[+] Building 3.9s (8/8) FINISHED
...
```

So that is docker please build with tag fs-hello-world the Dockerfile in this directory. You can point to any Dockerfile, but in our case simple dot will mean "this right here". After that is done you can run it with `docker run fs-hello-world`.

Images are just files. They can be moved around, downloaded and deleted. You can list the images you have locally with `docker image ls`, delete them with `docker image rm`. See what other command you have available with `docker image --help`.

### More meaningful image

Moving an express server to a container should be as simple as moving the "Hello, World!" application. The only difference is that there are more files. Thankfully `COPY` instruction can handle all that. Let's delete the index.js and create a new express server. Lets use express-generator to create a basic express application.

```
$ npx express-generator
  ...
  
  install dependencies:
    $ npm install

  run the app:
    $ DEBUG=playground:* npm start
```

First, let's run the application to get an idea of what we just created. Note that the command to run the application may be different from you, my directory was called playground.

```
$ npm install

$ DEBUG=playground:* npm start

  playground:server Listening on port 3000 +0ms
```

Great, so now we can navigate to <localhost:3000> and the app is running there.

Containerizing that should be easy based on the previous example.

1. Use node as base
2. Set working directory so we don't interfere with the contents of the base image
3. Copy ALL of the files in this directory to the image
4. Start with DEBUG=playground:* npm start

```Dockerfile
FROM node:16

WORKDIR /usr/src/app

COPY . .

CMD DEBUG=playground:* npm start
```

Let's build the image from that, `docker build -t express-server .` and run it with `docker run -p 3123:3000 express-server`. The _-p_ flag will inform docker that a port from the host machine should be opened and directed to a port in the container. So the format is _-p host:application_.

```
$ docker run -p 3123:3000 express-server

> playground@0.0.0 start
> node ./bin/www

Tue, 29 Jun 2021 10:55:10 GMT playground:server Listening on port 3000
```

> If yours doesn't work, skip to the next section where I explain why it doesn't work (even if you followed the steps).

Looks like it is working! Let's test it by sending a GET request to `http://localhost:3123/`.

Shutting it down is a headache at the moment, use another terminal and `docker kill` command to kill the application. The `docker kill` will send a kill signal (SIGKILL) to the application to force it to shut down. As an argument it needs the name or id of the container.

Here I choose to kill it with the ID. The beginning of the ID is enough for docker to know which container I mean.

```
$ docker container ls
  CONTAINER ID   IMAGE            COMMAND                  CREATED         STATUS         PORTS                                       NAMES
  48096ca3ffec   express-server   "docker-entrypoint.s…"   9 seconds ago   Up 6 seconds   0.0.0.0:3123->3000/tcp, :::3123->3000/tcp   infallible_booth

$ docker kill 48
  48
```

In the future let's just use the same port outside of the container as the application runs in. This is just so we don't have to remember which one we happened to choose.

#### Fixing potential issues we created by copy-pasting

There are a few steps we need to change to create a more comprehensive Dockerfile. It may even be that the above example doesn't work in all cases because we skipped a step.

We ran npm install on our machines, **node package manager** may install operating system specific dependencies during install step. As we use the COPY instruction to copy all of the node_modules into the image we may move non-functional parts as well.

This is critical to think about when we build our images. It's best to do most things such as to run `npm install` inside the container.

The file .dockerignore is very similar to .gitignore, you can use that to prevent unwanted files from being copied to your image. For example the contents could be

```
.dockerignore
.gitignore
node_modules
Dockerfile
```

However, in our case dockerignore isn't the only thing required. We will need to install the dependencies during the build step.

```Dockerfile
COPY . .

RUN npm install

CMD DEBUG=playground:* npm start
```

Instead of using npm install, npm offers a much better tool for installing dependencies, the `ci` command.

Differences between ci and install:

- install may update the package-lock.json
- install may install different version of a dependency if you have ^ or ~ in the version of the dependency.

- ci will delete the node_modules folder before installing anything
- ci will follow the package-lock.json and does not alter any files

So in short: `ci` creates realiable builds, while `install` is the one to use when you want to install new dependencies.

As we are not installing anything new during the build step, and we don't want the versions to suddenly change, we will use `ci`

```Dockerfile
COPY . .

RUN npm ci

CMD DEBUG=playground:* npm start
```

Even better, we can use `npm ci --only-production` to not waste time installing development dependencies.

> As you noticed in the comparison list; npm ci will delete the node_modules folder so creating the .dockerignore did not matter. However, .dockerignore is an amazing tool when you want to optimize your build process. We will talk briefly about these optimizations later.

Now the Dockerfile should work again, try it with `docker build -t express-server . && docker run -p 3000:3000 express-server`

We set an environment variable `DEBUG=playground:*` during CMD for the npm start. However, with Dockerfiles we could also use the instruction ENV to set environment variables. Let's do that.

```Dockerfile
ENV DEBUG=playground:*

CMD npm start
```

> If you're wondering what the DEBUG environment variable does, read [here](http://expressjs.com/en/guide/debugging.html#debugging-express).

#### Dockerfile best practices

There are 2 rules of thumb you should follow when creating images:

1. Try to create as **secure** of an image as possible
2. Try to create as **small** of an image as possible

Smaller images are more secure by having less attack surface area. And smaller images move faster in deployment pipelines.

Snyk has a great list of 10 best practices, read them [here](https://snyk.io/blog/10-best-practices-to-containerize-nodejs-web-applications-with-docker/).

One big neglection we did was having the application running as root instead of using an user. Let's do a final fix to the Dockerfile:

```Dockerfile
USER node
  
WORKDIR /usr/src/app

COPY --chown=node:node . .
```

</div>
  
<div class="tasks">

### Exercise 12.4.

#### Exercise 12.4: Containerizing a node application

The following repository contains an express application in the express-app directory. You do not need the other directory yet. Copy the contents into your own repository. The express-app directory includes a README on how to start the application.

Get the visit counter in root of the application working inside the container.

</div>
  
<div class="content">

#### Using docker-compose

In the previous section we created express-server and knew that it runs in port 3000, and ran it with `docker build -t express-server . && docker run -p 3000:3000 express-server`. This already looks like something you'd need to put into a script to remember. Fortunately docker offers us a better solution.

Docker-compose is another amazing tool, which can help us manage containers. We are going to start using docker-compose as we learn more about containers as it will help us save some time with the configuration.

Install the docker-compose tool from this link: [https://docs.docker.com/compose/install/](https://docs.docker.com/compose/install/).

Let's check that it works:

```
$ docker-compose -v
docker-compose version 1.29.2, build 5becea4c
```

And now we can turn the spell into a yaml file:

```yaml
services:
  app:                    # The name of the service, can be anything
    image: express-server # Declares which image to use
    build: .              # Declares where to build if image is not found
    ports:                # Declares the ports to publish
      - 3000:3000
```

Save this file as **docker-compose.yml** and place it next to the Dockerfile, at the root of the project.

Now we can use `docker-compose up` to build and run the application. If we want to rebuild the image we can use `docker-compose up --build`.

You can also run the application in the background with `docker-compose up -d` (-d for detached) and close it with `docker-compose down`.

Creating files like this that *declare* what you want instead of script files that you need to run in a specific order / a specific number of times is often a great practice.

</div>

<div class="tasks">

### Exercise 12.5.

#### Exercise 12.5: docker-compose

Create a docker-compose file that works with the node application from the previous exercise.

The visit counter is the only feature that is required to be working.

</div>

<div class="content">

### Utilizing containers when developing software

When you are developing software, containerization can be used in various ways to improve your quality of life. One of the most useful cases is by bypassing the need to install and configure tools twice.

It may not be the best option to move your entire development environment into a container, but if that's what you want it's possible. We will revisit this idea at the end of this part. But until then, **run the node application itself outside of containers**.

The application we met in the previous exercise can use MongoDB. Let's explore [Docker Hub](https://hub.docker.com/) to find a mongodb image. Docker Hub is the default place where docker pulls the images from, you can use other registries as well, but since we are already knee-deep in docker I chose that one. With a quick search there I found [https://hub.docker.com/_/mongo](https://hub.docker.com/_/mongo)

```yml
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

The environment variables defined here are explained in the docker hub page:

> These variables, used in conjunction, create a new user and set that user's password. This user is created in the admin authentication database and given the role of root, which is a "superuser" role.

And since we're only using it in development at the moment we can leave them like that. The last environment variable MONGO_INITDB_DATABASE will tell mongo to create a database with that name. Let's save that as the docker-compose.yml in the directory.

**TODO**: tässä vaiheessa varmaan pitää mongo käynnistää?
  
**TODO**: seuraavassa tulee vähän puun takaa, että sovellus käynnistetäänkin normaalisti, sitä voisi tähdentää ja ehkä muistuttaa että pitää tehdä *npm instal*
  
Let's start the application with the relevant environment variable, you can modify the code to set them as the defaults or use .env file. I'll just throw them in with the start to help you copy-paste.

```
$ MONGO_URL=mongodb://localhost:3456/the_database npm run dev
```

This won't be enough; we need to create a user to be authorized inside of the container. The url http://localhost:3000/todos leads to an authentication error.

#### Bind mount

In the MongoDB Docker Hub page under "Initializing a fresh instance" is the info on how to execute js to initialize the database and an user for it.

Let's create a file `mongo-init.js` and place it in the mongo directory of the express project.

**mongo-init.js**
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

It will initialize the database with an user and a few todos. Now we just need to get it inside the container at startup.

We could create a new image FROM mongo and COPY the file inside or we can use a bind mount to mount the init-mongo.js to the container. Let's do the latter.

With `container run` we can add *-v* flag with the syntax `-v file_in_host_filesystem:file_in_container`, but let's skip that and add it to the docker-compose.yml:

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

Mounting the file will mean that the mongo-init file in the mongo folder is the same as the mongo-init file in the containers /docker-entrypoint-initdb.d directory. Changes to either file will be available in the other.

Run `docker-compose down --volumes` to ensure that nothing is left and start from a clean slate with `docker-compose up` to initialize the database.

Now starting the express application with the correct environment variable should work:

```
$ MONGO_URL=mongodb://the_username:the_password@localhost:3456/the_database npm run dev
```

Let's check that the `http://localhost:8000/todos` returns all todos. It should return the two todos we initialized. We can use postman to test the basic functionality for todos like delete todo.

#### Persisting data with volumes

By default containers are not going to persist our data. When you close the mongo container you may or may not be able to get the data back.

This is a rare case in which it actually does preserve the data as the developers who made the docker image for Mongo have defined a volume to be used: [https://github.com/docker-library/mongo/blob/cb8a419053858e510fc68ed2d69415b3e50011cb/4.4/Dockerfile#L113](https://github.com/docker-library/mongo/blob/cb8a419053858e510fc68ed2d69415b3e50011cb/4.4/Dockerfile#L113) This line will instruct docker to preserve the data in those directories.

There are two distinct methods to store the data: 
  1. Declaring a location in your filesystem (called bind mount)
  2. Letting docker decide where to store the data (volume)

I prefer the first choice in most cases whenever you really need to avoid deleting the data. Let's see both in action with docker-compose;

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

The above will create a directory called `mongo_data` to your local filesystem, and map it into the container as `/data/db`. This means the data in `/data/db` is stored outside of the container but still accessible by the container! Just remember to add the directory to .gitignore.

Another great method is by using a named volume:

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

Now the volume is created, but managed by docker. After starting the application (`docker-compose up`) you can list the volumes with `docker volume ls`, inspect one of them with `docker volume inspect` and even delete them with `docker volume rm`. It's still stored in your local filesystem but figuring out may not be as trivial as with the previous option.

</div>

<div class="tasks">

### Exercise 12.6.

#### Exercise 12.6: Code something mongo related

The todo express application is missing both get one and update. 

Fix get one to return one todo with and id, and update to update one todo with an id.

</div>

<div class="content">

### Redis

Redis has nothing to do with containers. But since we are already able to add *any* 3rd party service to your applications, why not learn about a new one.

Redis is a data store. So like mongo it can be used to store data. The difference is that Redis stores key-value data. And it is by default in-memory which means that it does not store data persistently.

An excellent use case for Redis is to use it as a cache. Caches are often used to store data that is otherwise slow to fetch, and save it until it's no longer valid and then fetch the data and store it to the cache.

</div>

<div class="tasks">

### Exercises 12.7. - 12.9.

#### Exercise 12.7: Setup redis to project

The application will be able to use redis by giving it the REDIS_URL environment variable. Find and read through the Docker Hub page for redis, add it to the docker-compose.yml by defining another service after mongo:
```yml
services:
  mongo:
    ...
  redis:
    ???
```

**TODO** maybe some help needed since redis dockerhub page not very verbose
  - what is the default port
  - how to ensure that redis works?
  
One way to check conf is to include 
  
```js
const redis = require('../redis')
```

to the express server  
  
#### Exercise 12.8:

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

#### Exercise 12.9:
  
**TODO**  
 
When coding you most likely end up to the situation when everything is fucked up. 
  
Use `docker exec` and execute `redis-cli` in the redis container. Ensure that
- you see the counter value that the application is increasing
- change the counter value and ensure that the change is visible in application 
  
</div>

<div class="content">

#### Persisting data with Redis

In the previous section I said that *by default* Redis does not persist the data. However, the persistence is easy to toggle on. We will only need to start the redis with a different command, as instructed by the docker hub page:

**docker-compose.yml**
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

In addition to the most basic get & set Redis can automatically expire keys. And manage multiple key value pairs at the same time.

In addition to the key-value features Redis can also be used to Publish messages and Subscribe to messages (PubSub or Publish-subscribe pattern). Publish-subscribe is great for having multiple applications communicate with each other. Redis works as the message broker between two or more applications, where one of them is publishing messages by sending them to redis, and the other is subscribed to those messages.

</div>

<div class="tasks">

### Exercises 12.10.
  
#### Exercise 12.10: Persisting data in redis
  
Do not yet create volume for redis. Ensure that the data is not persisted by default, that is, after running after running `docker-compose down` and `docker-compose up` the the counter value is not anymore set.
  
Create a volume for redis data and make sure that the data survives after running `docker-compose down` and `docker-compose up`
  
</div>
