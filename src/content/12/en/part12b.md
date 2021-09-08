---
mainImage: ../../../images/part-12.svg
part: 12
letter: b
lang: en
---

<div class="content">


In the previous section we used two different base images: ubuntu and node and did some manual work to get a simple "Hello, World!" running. The basic tools we learned during that process are extremely useful. In this section, we will learn how to build containers and configure environments for our own applications. How these can be managed for both React frontend and node backend applications and in addition take a quick peek at other possible backend options you may encounter.

### Dockerfile

Instead of modifying a container by copying files inside there we can create a new image that contains the "Hello, World!" application. The tool for this is the Dockerfile. Dockerfile is a simple text file that contains all of the instructions for creating an image. Let's create an example Dockerfile from the "Hello, World!" application.

If you did not already, create a directory on your own machine and create a file called Dockerfile. Let's also put a index.js containing _console.log('Hello, World!')_ next to the Dockerfile. Your directory structure should look like this:

```
├── index.js
└── Dockerfile
```

inside that Dockerfile we will tell the image 3 things:

1. Use the node:16 as the base for our image, we want everything node 16 contains to be available for this image.
2. Include the index.js inside the image, so we don't need to manually copy it into the container
3. When we run a container from the image, use node to execute the index.js file.

This will translate into a basic Dockerfile.

`Dockerfile`

```Dockerfile
FROM node:16

WORKDIR /usr/src/app

COPY ./index.js ./index.js

CMD node index.js
```

FROM instruction will tell us that the base is node:16. COPY instruction will copy the file to the file. And CMD instructs what will be executed when _docker run_ is used. CMD is the _default_ command that can then be overwritten with the parameter given after image name. See _docker run --help_ if you forgot.

I included one additional instruction, WORKDIR makes sure we don't interfere with the contents that the image already had. It will ensure all of the following commands will be in the container in directory /usr/src/app, if the directory doesn't exist it will create it. 

If we do not specify a WORKDIR we risk overwriting unrelated, but important files by accident. If you check the root (_/_) of the node:16 with _docker run node:16 ls_ image you can notice all of the directories and files that are already included in the image. That is due to the fact that we use node as the base image. The node image already contained all of those files, we just added our own. 

Now we can use the command _docker build_ to build an image based on the Dockerfile. Let's spice up the command with one additional flag: _-t_, this will help us name the image:

```
$ docker build -t fs-hello-world . 
[+] Building 3.9s (8/8) FINISHED
...
```

So the result is "docker please build with tag fs-hello-world the Dockerfile in this directory". You can point to any Dockerfile, but in our case simple dot will mean the Dockerfile in this directory. After the build finished you can run it with _docker run fs-hello-world_.

Images are just files. They can be moved around, downloaded and deleted. You can list the images you have locally with _docker image ls_, delete them with _docker image rm_. See what other command you have available with _docker image --help_.

### More meaningful image

Moving an express server to a container should be as simple as moving the "Hello, World!" application. The only difference is that there are more files. Thankfully _COPY_ instruction can handle all that. Let's delete the index.js and create a new express server. Lets use express-generator to create a basic express application.

```console
$ npx express-generator
  ...
  
  install dependencies:
    $ npm install

  run the app:
    $ DEBUG=playground:* npm start
```

First, let's run the application to get an idea of what we just created. Note that the command to run the application may be different from you, my directory was called playground.

```console
$ npm install

$ DEBUG=playground:* npm start

  playground:server Listening on port 3000 +0ms
```

Great, so now we can navigate to [http://localhost:3000](http://localhost:3000) and the app is running there.

Containerizing that should be easy based on the previous example.

1. Use node as base
2. Set working directory so we don't interfere with the contents of the base image
3. Copy ALL of the files in this directory to the image
4. Start with DEBUG=playground:* npm start

`Dockerfile`

```Dockerfile
FROM node:16

WORKDIR /usr/src/app

COPY . .

CMD DEBUG=playground:* npm start
```

Let's build the image from that, _docker build -t express-server ._ and run it with _docker run -p 3123:3000 express-server_. The _-p_ flag will inform docker that a port from the host machine should be opened and directed to a port in the container. And the format is _-p host:application_.

```console
$ docker run -p 3123:3000 express-server

> playground@0.0.0 start
> node ./bin/www

Tue, 29 Jun 2021 10:55:10 GMT playground:server Listening on port 3000
```

> If yours doesn't work, skip to the next section where I explain why it doesn't work (even if you followed the steps).

Looks like it is working! Let's test it by sending a GET request to [http://localhost:3123/](http://localhost:3123/).

Shutting it down is a headache at the moment, use another terminal and _docker kill_ command to kill the application. The _docker kill_ will send a kill signal (SIGKILL) to the application to force it to shut down. As an argument it needs the name or id of the container.

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

This is critical to think about when we build our images. It's best to do most things such as to run _npm install_ inside the container.

The file .dockerignore is very similar to .gitignore, you can use that to prevent unwanted files from being copied to your image. For example the contents could be

```
.dockerignore
.gitignore
node_modules
Dockerfile
```

However, in our case dockerignore isn't the only thing required. We will need to install the dependencies during the build step.

`Dockerfile`

```Dockerfile
COPY . .

RUN npm install

CMD DEBUG=playground:* npm start
```

Instead of using npm install, npm offers a much better tool for installing dependencies, the _ci_ command.

Differences between ci and install:

- install may update the package-lock.json
- install may install different version of a dependency if you have ^ or ~ in the version of the dependency.

- ci will delete the node_modules folder before installing anything
- ci will follow the package-lock.json and does not alter any files

So in short: _ci_ creates realiable builds, while _install_ is the one to use when you want to install new dependencies.

As we are not installing anything new during the build step, and we don't want the versions to suddenly change, we will use _ci_

`Dockerfile`

```Dockerfile
COPY . .

RUN npm ci

CMD DEBUG=playground:* npm start
```

Even better, we can use _npm ci --only-production_ to not waste time installing development dependencies.

> As you noticed in the comparison list; npm ci will delete the node_modules folder so creating the .dockerignore did not matter. However, .dockerignore is an amazing tool when you want to optimize your build process. We will talk briefly about these optimizations later.

Now the Dockerfile should work again, try it with _docker build -t express-server . && docker run -p 3000:3000 express-server_

We set an environment variable _DEBUG=playground:*_ during CMD for the npm start. However, with Dockerfiles we could also use the instruction ENV to set environment variables. Let's do that.

`Dockerfile`

```Dockerfile
ENV DEBUG=playground:*

CMD npm start
```

> <i>If you're wondering what the DEBUG environment variable does, read [here](http://expressjs.com/en/guide/debugging.html#debugging-express).</i>

#### Dockerfile best practices

There are 2 rules of thumb you should follow when creating images:

1. Try to create as **secure** of an image as possible
2. Try to create as **small** of an image as possible

Smaller images are more secure by having less attack surface area. And smaller images move faster in deployment pipelines.

Snyk has a great list of 10 best practices, read them [here](https://snyk.io/blog/10-best-practices-to-containerize-nodejs-web-applications-with-docker/).

One big neglection we did was having the application running as root instead of using an user. Let's do a final fix to the Dockerfile:

`Dockerfile`

```Dockerfile
USER node
  
WORKDIR /usr/src/app

COPY --chown=node:node . .
```

</div>
  
<div class="tasks">

### Exercise 12.4.

#### Exercise 12.4: Containerizing a node application

> In this exercise, submit <i>at least</i> the Dockerfile you created.

The following repository contains an express application in the express-app directory: [part12-containers-applications](https://github.com/fullstack-hy2020/part12-containers-applications). You do not need the other directory yet. Copy the contents into your own repository. The express-app directory includes a README on how to start the application.

Step 1. Containerize the application by creating a Dockerfile and building an image.

Step 2. Run the image with the correct ports open. Make sure the visit counter increases when used through a browser.

Tip: Run the application outside of a container to examine it before starting to containerize.

</div>
  
<div class="content">

#### Using docker-compose

In the previous section we created express-server and knew that it runs in port 3000, and ran it with _docker build -t express-server . && docker run -p 3000:3000 express-server_. This already looks like something you would need to put into a script to remember. Fortunately docker offers us a better solution.

Docker-compose is another amazing tool, which can help us manage containers. We are going to start using docker-compose as we learn more about containers as it will help us save some time with the configuration.

Install the docker-compose tool from this link: [https://docs.docker.com/compose/install/](https://docs.docker.com/compose/install/).

Let's check that it works:

```
$ docker-compose -v
docker-compose version 1.29.2, build 5becea4c
```

And now we can turn the spell into a yaml file:

`docker-compose.yml`

```yaml
version: '3.8'            # Version 3.8 is quite new and should work

services:
  app:                    # The name of the service, can be anything
    image: express-server # Declares which image to use
    build: .              # Declares where to build if image is not found
    ports:                # Declares the ports to publish
      - 3000:3000
```

Save this file as **docker-compose.yml** and place it next to the Dockerfile, at the root of the project.

Now we can use _docker-compose up_ to build and run the application. If we want to rebuild the image we can use _docker-compose up --build_.

You can also run the application in the background with _docker-compose up -d_ (_-d_ for detached) and close it with _docker-compose down_.

Creating files like this that <i>declare</i> what you want instead of script files that you need to run in a specific order / a specific number of times is often a great practice.

</div>

<div class="tasks">

### Exercise 12.5.

#### Exercise 12.5: docker-compose

> In this exercise, submit <i>at least</i> the docker-compose.yml you created.

Create a docker-compose file that works with the node application from the previous exercise.

The visit counter is the only feature that is required to be working.

</div>

<div class="content">

### Utilizing containers when developing software

When you are developing software, containerization can be used in various ways to improve your quality of life. One of the most useful cases is by bypassing the need to install and configure tools twice.

It may not be the best option to move your entire development environment into a container, but if that's what you want it's possible. We will revisit this idea at the end of this part. But until then, <i>run the node application itself outside of containers</i>.

The application we met in the previous exercises can use MongoDB. Let's explore [Docker Hub](https://hub.docker.com/) to find a mongodb image. Docker Hub is the default place where docker pulls the images from, you can use other registries as well, but since we are already knee-deep in docker I chose that one. With a quick search there I found [https://hub.docker.com/_/mongo](https://hub.docker.com/_/mongo)

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

The environment variables defined here are explained in the docker hub page:

> These variables, used in conjunction, create a new user and set that user's password. This user is created in the admin authentication database and given the role of root, which is a "superuser" role.

And since we're only using it in development at the moment we can leave them like that. The last environment variable *MONGO\_INITDB\_DATABASE* will tell mongo to create a database with that name. Let's save that as the docker-compose.yml in the directory.

Now start the mongo with _docker-compose up -d_, it will run it in the background and you can view the logs with _docker-compose logs -f_, the _-f will ensure we <i>follow</i> the logs.

As said previously, now we do not want to run the node application inside a container. We'll explore that option in the future but for now it's easier to develop the application if it's not in a container.

Run the good old npm install first and let's start the application with the relevant environment variable, you can modify the code to set them as the defaults or use .env file. I'll just throw them in with the start to help you copy-paste.

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

It will initialize the database with an user and a few todos. Now we just need to get it inside the container at startup.

We could create a new image FROM mongo and COPY the file inside or we can use a bind mount to mount the init-mongo.js to the container. Let's do the latter.

With _container run_ we can add _-v_ flag with the syntax _-v FILE-IN-HOST:FILE-IN-CONTAINER_, but let's skip that and add it to the docker-compose.yml. The format is the same, first host and then container:

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

Mounting the file will mean that the mongo-init file in the mongo folder is the same as the mongo-init file in the containers /docker-entrypoint-initdb.d directory. Changes to either file will be available in the other.

Run _docker-compose down --volumes_ to ensure that nothing is left and start from a clean slate with _docker-compose up_ to initialize the database.

Now starting the express application with the correct environment variable should work:

```
$ MONGO_URL=mongodb://the_username:the_password@localhost:3456/the_database npm run dev
```

Let's check that the http://localhost:8000/todos returns all todos. It should return the two todos we initialized. We can use postman to test the basic functionality for todos like delete todo.

#### Persisting data with volumes

By default containers are not going to persist our data. When you close the mongo container you may or may not be able to get the data back.

This is a rare case in which it actually does preserve the data as the developers who made the docker image for Mongo have defined a volume to be used: [https://github.com/docker-library/mongo/blob/cb8a419053858e510fc68ed2d69415b3e50011cb/4.4/Dockerfile#L113](https://github.com/docker-library/mongo/blob/cb8a419053858e510fc68ed2d69415b3e50011cb/4.4/Dockerfile#L113) This line will instruct docker to preserve the data in those directories.

There are two distinct methods to store the data: 
  1. Declaring a location in your filesystem (called bind mount)
  2. Letting docker decide where to store the data (volume)

I prefer the first choice in most cases whenever you really need to avoid deleting the data. Let's see both in action with docker-compose;

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

The above will create a directory called _mongo_data_ to your local filesystem, and map it into the container as _/data/db_. This means the data in _/data/db_ is stored outside of the container but still accessible by the container! Just remember to add the directory to .gitignore.

Another great method is by using a named volume:

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

Now the volume is created, but managed by docker. After starting the application (_docker-compose up_) you can list the volumes with _docker volume ls_, inspect one of them with _docker volume inspect_ and even delete them with _docker volume rm_. It's still stored in your local filesystem but figuring out <i>where</i> may not be as trivial as with the previous option.

</div>

<div class="tasks">

### Exercise 12.6.

#### Exercise 12.6: Little bit of mongodb coding

> In this exercise, submit the entire express application, with the Dockerfile AND docker-compose.yml.

The todo express application is missing both get one and update. 

Fix get one to return one todo with and id, and update to update one todo with an id.

</div>

<div class="content">

### Debugging issues in containers

> When coding you most likely end up in a situation where everything is broken. 

> \- Matti Luukkainen

We need to learn new tools for debugging. When code has a bug you may often be in a state where at least something works so you can work forward from that. Configuration most often is in either of the two states: 1. working or 2. broken. We'll go over a few tools to help when your application is in the latter state.

The most difficult thing about this is that configuration is often broken when it's not finished. So when you write a long docker-compose.yml or Dockerfile and it does not work, you really need to take a moment and think about the various ways you could confirm something is working.

<i>Question Everything</i> is still applicable here. As said in part 3: The key is to be systematic. Since the problem can exist anywhere, <i>you must question everything</i>, and eliminate all possibilities one by one.

For myself the most important method of debugging is stopping and really thinking about what I'm trying to accomplish instead of just bashing my head at the problem. Often there is a simple alternate solution or quick google search that will get me moving forward. 

#### exec

The docker command _exec_ is a heavy hitter. It can be used to jump right into a container when it's running. That's it.

Let's start a web server, nginx, in the background and do a little bit of debugging to get it running and displaying the message "Hello, exec!" in our browser. Nginx is, among other things, a server capable of serving static html files. It has a default index.html that we can replace.

```console
$ docker container run -d nginx
```

Ok, now where should we go with our browser? Is it even running? We know how to answer the latter.

```console
$ docker container ls
CONTAINER ID   IMAGE           COMMAND                  CREATED              STATUS                      PORTS     NAMES
3f831a57b7cc   nginx           "/docker-entrypoint.…"   About a minute ago   Up About a minute           80/tcp    keen_darwin
```

Yes! It seems to listen on port 80, as output by the previous command.

Let's shut it down and restart with the _-p_ flag to have our browser access it.

```console
$ docker container stop keen_darwin
$ docker container rm keen_darwin

$ docker container run -d -p 8080:80 nginx
```

Let's see the app in http://localhost:8080. It seems the app is showing the wrong message! Let's hop right into the container and fix the message. Keep your browser open, we won't need to shut down the container for this fix. We will execute bash inside the container, the flags _-it_ will ensure that we can interact with the container:

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

Now if we go to http://localhost:8080/ we know that we deleted the correct file. Let's replace it with one containing the correct contents:

```console
root@7edcb36aff08:/# echo "Hello, exec!" > index.html
```

Refresh the page and our message is displayed!

</div>

<div class="tasks">

### Exercise 12.7.

#### Exercise 12.7: Mongo command-line interface

> Use _script_ to record what you do, save the generated file into the repository as your answer.

While the mongodb from the previous exercise is running access the database with mongo command-line interface (cli) using docker exec and add a new todo using the cli.

The command to open cli when inside the container is simply "mongo"

The mongo cli will require the username and password flags to authenticate correctly: -u root -p example, the values are from the docker-compose.yml.

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

Redis is a data store. So just like mongo it can be used to store data. The difference is that Redis stores key-value data. And it is by default in-memory which means that it does not store data persistently.

An excellent use case for Redis is to use it as a cache. Caches are often used to store data that is otherwise slow to fetch, and save it until it's no longer valid and then fetch the data and store it to the cache.

</div>

<div class="tasks">

### Exercises 12.8. - 12.10.

#### Exercise 12.8: Setup redis to project

> In this exercise, submit the entire express application, with the Dockerfile AND docker-compose.yml.

The application will be able to use redis by giving it the REDIS_URL environment variable. Find and read through the Docker Hub page for redis, add it to the docker-compose.yml by defining another service after mongo:

`docker-compose.yml`

```yml
services:
  mongo:
    ...
  redis:
    ???
```

Since the Docker Hub page doesn't have all info we can use Google to aid us. The default port for redis is found by doing so:

![](../../images/12/redis_port_by_google.png)

The application will not start using redis by itself. You will need to require the config by adding
  
```js
const redis = require('../redis')
```

to the express server. The next exercise will require redis to be available and configured correctly.
  
#### Exercise 12.9:

> In this exercise, submit the entire express application, with the Dockerfile AND docker-compose.yml.

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

#### Exercise 12.10:

> Use _script_ to record what you do, save the generated file into the repository as your answer.

Like we did with mongo we can do with redis. Use redis command-line interface to edit the value in the database. 

The command to open the redis cli is "redis-cli".

You can find the key you used with _[KEYS *](https://redis.io/commands/keys)_

And set the value with _[SET](https://redis.io/commands/set)_, giving it the key and then the value

And finally set the value of the counter to 9001.

Make sure that the new value works by using your application. Refresh the application and see that it has the new number, and the redis cli shows new number when asking with _[GET](https://redis.io/commands/get)_, giving it the key
  
</div>

<div class="content">

#### Persisting data with Redis

In the previous section I said that <i>by default</i> Redis does not persist the data. However, the persistence is easy to toggle on. We will only need to start the redis with a different command, as instructed by the docker hub page:

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

In addition to the most basic get & set Redis can automatically expire keys. And manage multiple key value pairs at the same time.

In addition to the key-value features Redis can also be used to Publish messages and Subscribe to messages (PubSub or Publish-subscribe pattern). Publish-subscribe is great for having multiple applications communicate with each other. Redis works as the message broker between two or more applications, where one of them is publishing messages by sending them to redis, and the other is subscribed to those messages.

</div>

<div class="tasks">

### Exercises 12.11.
  
#### Exercise 12.11: Persisting data in redis

> In this exercise, submit the entire express application, with the Dockerfile AND docker-compose.yml.

Check that the data is not persisted by default: after running _docker-compose down_ and _docker-compose up_ the counter value is reset to 0.

Then create a volume for redis data and make sure that the data survives after running _docker-compose down_ and _docker-compose up_.

</div>
