---
mainImage: ../../../images/part-12.svg
part: 12
letter: a
lang: en
---

<div class="content">

According to wikipedia software development includes the whole lifecycle from envisioning software to programming to releasing the software and even maintaining it. This part will introduce containers, a modern tool utilized in the latter parts of the software lifecycle.

Containers encapsulate your application into a single package. This package will then include all of the dependencies with the application so that each container can run isolated from each other.

Containers can be compared to virtual machines (VM) which are used to run multiple operating systems on a single physical machine. Containers are OS-level virtualization which means, among other things, that they allow applications to access only the container's contents and resources given to that container. Whereas VMs run an entire operating system a container runs the software using the host operating system. The resulting difference between VMs and containers is that there is little overhead when running containers; they only need to run a single process.

As containers are relatively lightweight, at least compared to virtual machines, they can be quick to scale. And they isolate the software running inside enabling the software to run identically almost anywhere. As such they are the go to option in any cloud environment or application with more than a handful of users.

Cloud services like AWS, Google Cloud and Microsoft Azure all support containers in multiple different forms. As an example, AWS Fargate and Google Cloud Run run containers as serverless - where the application container does not even need to be running if it is not used. You can also install container runtime on most machines and run containers there yourself - including your personal machine. 

So containers are used in clouds and development. What are the benefits of using one? Here are two fairly relatable and common scenarios:

> Scenario 1: You are developing a new application that needs to run on the same machine as a legacy application. Both require different versions of Node installed.

You can probably use nvm, virtual machines or some sort of dark magic to get them running at the same time. However, containers are an excellent solution as you can run both applications in their respective containers. They are isolated from each other and do not interfere.

> Scenario 2: Your application runs on your machine. You need to move the application to a server.

It is not uncommon that the application just does not run there. It may be due to some missing dependency or other differences in the environments. Here containers are an excellent solution since you can run the application in the same environment (container) both on your machine and on the server. It is not perfect: different machines may have different hardware, but you can limit the number of differences between environments.

Sometimes you may hear about the “Works in my container” issue - this is often a usage error.

### About this part ###

In this part, the focus of our attention will not be on the software code. Instead, we are interested in the configuration of the environment in which the software is executed. As a result, the exercises may not contain any coding, the applications are available to you through GitHub and your tasks will include configuring them. The exercises are to be submitted to <i>a single GitHub repository</i> which will include all of the source code and configuration you do during this part.

Only the core parts, 1 through 5, are required to be completed before this part. As you will need basic knowledge of Node, Express and React.

# Warning

Since we are stepping right outside of our comfort zone as JavaScript developers this part may require you to do a detour and familiarize yourself with shell / command line / command prompt / terminal before getting started.

If you've only ever used a graphical user interface and never touched e.g. linux or terminal on mac or get stuck in the first exercises I recommend doing the Part 1 of "Computing tools for CS studies" first: <https://tkt-lapio.github.io/en/>. Skip the section for "SSH connection" and Exercise 11. Otherwise it includes everything you're going to need to get started here! 

### Submitting exercises and earning credits ###

Exercises are submitted via the [submissions system](https://studies.cs.helsinki.fi/stats/) just like in the previous parts. Note that, exercises in this part are submitted <i>to a different course instance</i>.

This part on containers is 1 credit.

Once you have completed the exercises and want to get the credits, let us know through the exercise submission system that you have completed the course:

![Submitting exercises for credits](../../images/10/23.png)

You can download the certificate for completing this part by clicking one of the flag icons. The flag icon corresponds to the certificate's language.

### Installing everything required for this part ###

To make sure that you are ready to start with this part let's begin by installing the required software. This will be one of the largest obstacle for us, since the tools will require superuser access on the computer. This is due to the fact that the tools will have access to your operating systems kernel. We will talk more about what this means in the next section.

The material is built around Docker, a set of products that we will use for containerization and for the management of containers.

Depending on your operating system choose install instructions from the link below. Note that they may have multiple different options for your operating system. 

- [Get Docker](https://docs.docker.com/get-docker/)

Now that that headache is hopefully over let's make sure that our versions match. Yours might be a bit higher than here:

```bash
$ docker -v
Docker version 20.10.5, build 55c4c88
```

### Containers and images

There are two core concepts when starting with containers and they are easy to confuse:

**Container** is a runtime instance of an **image**.

So while we can say "Containers package software into standardized units" we can also say "Images include all of the code, dependencies and instructions on how to run the application" which sounds a lot like "Images package software" as well.

To help with the confusion everyone just talks about containers. But you can never **actually** build a container or download one, since they only exist runtime. Images on the other hand are **immutable** files. They can not be changed but they can be created and they can be used to create new images by adding new **layers** on top of the existing ones.

Cooking metaphor:

* Image is pre-cooked, frozen treat.
* Container is the delicious treat.

[Docker](https://www.docker.com/) is the most popular containerization technology and pioneered the standard most use now. It will enable us to leverage all of the benefits of containers. Docker is a set of products that help us manage images and containers. The docker engine will take care of turning the immutable files, images, into containers.

For managing the docker containers, there is also [Docker Compose](https://docs.docker.com/compose/). It is used to **orchestrate** (control) multiple containers at the same time. We will use Docker Compose to set up complex local development environments quickly. For the final version of our node development environment, we will try to eliminate the need to install Node.

There are a number of concepts we need to go over, but we will skip those for now and learn about Docker first! One of my favorite features is the capability to handle running containers even if they are not yet downloaded on our device.

The command structure is the following: _container run <i>IMAGE-NAME</i>_. So we will tell docker to create a container from an image.

```bash
§ docker container run hello-world
```

There will be a lot of output but I will split it into multiple sections that we can decipher it together. The lines are numbered by me so that it is easier to follow the explanation, your output will not have the numbers:

```bash
1. Unable to find image 'hello-world:latest' locally
2. latest: Pulling from library/hello-world
3. b8dfde127a29: Pull complete
4. Digest: sha256:5122f6204b6a3596e048758cabba3c46b1c937a46b5be6225b835d091b90e46c
5. Status: Downloaded newer image for hello-world:latest
```

It's downloaded a new image for hello-world from "Docker Hub". You can see the docker hub page for the image with your browser here: [https://hub.docker.com/_/hello-world](https://hub.docker.com/_/hello-world)

The first part of the message states that we did not have "hello-world:latest" yet. This reveals a bit of detail about images themselves; image names consist of multiple parts, kind of like an url. An image name is in the following format: 

- _registry/organisation/image:tag_

In this case the 3 missing fields defaulted to: 
- _index.docker.io/library/hello-world:latest_

Second row shows the organisation name, "library" where it will get the image. In the Docker Hub url the "library" is shortened to _.

The 3rd and 5th rows only show the status. But 4th row may be interesting: each image has a unique digest based on the layers. The digest is used by docker to identify that an image is the same if you try to pull it again.

So it did some pulling and then output information about the **image**. It then gave the status that a new version of hello-world:latest was indeed downloaded. You can try pulling the image with _docker image pull hello-world_.

The following output was from the container itself. It also explains what happened when we ran _docker container run hello-world_.

```bash
Hello from Docker!
This message shows that your installation appears to be working correctly.

To generate this message, Docker took the following steps:
 1. The Docker client contacted the Docker daemon.
 2. The Docker daemon pulled the "hello-world" image from the Docker Hub.
    (amd64)
 3. The Docker daemon created a new container from that image which runs the
    executable that produces the output you are currently reading.
 4. The Docker daemon streamed that output to the Docker client, which sent it
    to your terminal.

To try something more ambitious, you can run an Ubuntu container with:
 $ docker container run -it ubuntu bash

Share images, automate workflows, and more with a free Docker ID:
 https://hub.docker.com/

For more examples and ideas, visit:
 https://docs.docker.com/get-started/
```

The output contains a few new things for us to learn. Docker daemon is a background service that makes sure the containers are running, and we use the docker client to interact with the daemon. What we just did is we ran a container that contained the hello-world application and saw what it printed out.

</div>

<div class="tasks">

### Exercise 12.1

#### Before exercises

Some of these exercises do not generate anything for you to submit.

Instead use [script](https://man7.org/linux/man-pages/man1/script.1.html) to record commands you have used; try it yourself with _script -r_ to start recording, _echo "hello"_ to generate some output, and _exit_ to stop recording. It saves your actions into a file names "typescript".

You can playback the "typescript" file with _script -p typescript_. 

If script does not work or you can't get the playback working, just copypaste all commands you used into a text file.

#### Exercise 12.1: Running your second container

> Use _script_ to record what you do, save the generated file into the repository as your answer.

The hello-world output gave us an "ambitious" task to do. Do the following

Step 1. Run an Ubuntu container with the command given by hello-world

The step 1 will connect you straight into the container with bash. You will have an access to all the files and tools inside.

Step 2. Create directory `/usr/src/app`

Step 3. Create a file `/usr/src/app/index.js`

Step 4. Run `exit` to quit from the container

Google should be able to help you with creating directories and files.

</div>

<div class="content">

### Ubuntu image

The command you just used to run the ubuntu container, _docker container run -it ubuntu bash_, contains a few additions to our hello-world. Let's see the --help to get a better understanding. I'll cut some of the output so we can focus on the relevant parts.

```bash
$ docker container run --help

Usage:  docker container run [OPTIONS] IMAGE [COMMAND] [ARG...]
Run a command in a new container

Options:
  ...
  -i, --interactive                    Keep STDIN open even if not attached
  -t, --tty                            Allocate a pseudo-TTY
  ...
```

The options, or flags, _-it_ make sure we can interact with the container. And after the image, in this case ubuntu, we have the command to be executed inside the container when we start it. You can try other commands that the ubuntu image might have the tools for, for example, try _docker container run --rm ubuntu ls_. The *ls* command will list all of the files in the directory and _--rm_ will remove the container after execution.

Let's continue with our first ubuntu container with the **index.js** file inside of it. It has stopped running since we exited it. We can list all of the containers with _container ls -a_, the _-a_ (or --all) will list containers that have already been exited.

```bash
$ docker container ls -a
CONTAINER ID   IMAGE     COMMAND   CREATED          STATUS                       PORTS     NAMES
b8548b9faec3   ubuntu    "bash"    3 minutes ago    Exited (0) 6 seconds ago               hopeful_clarke
```

The identifier can be used to interact with the container. Although most commands accept the container name as well. The name of the container was automatically generated to be **"hopeful_clarke"** in my case.

The container has already exited, but we can start it again with the start command that will accept the id or name of the container as parameter: _start <i>CONTAINER-ID-OR-CONTAINER-NAME</i>_.

```bash
$ docker start hopeful_clarke
root@b8548b9faec3:/#
```

The start command will start the same container we had previously. Unfortunately, we forgot to start it with the flag _--interactive_ so we can not interact with it. Let's kill it with the _kill <i>CONTAINER-ID-OR-CONTAINER-NAME</i>_ command and try again.

```bash
$ docker container ls -a
CONTAINER ID   IMAGE     COMMAND   CREATED          STATUS                      PORTS     NAMES
b8548b9faec3   ubuntu    "bash"    13 minutes ago   Up 47 seconds                         hopeful_clarke

$ docker kill hopeful_clarke
hopeful_clarke

$ docker start -i hopeful_clarke
root@b8548b9faec3:/#
```

Let's edit the index.js and add something to execute. We are just missing the tools to edit the file with. Nano will be a good text editor for now. Google should give us the install instructions. We will just omit using sudo since we are already root.

```
root@b8548b9faec3:/# apt-get update
...

root@b8548b9faec3:/# apt-get -y install nano
...

root@b8548b9faec3:/# nano /usr/src/app/index.js
```

Now we have nano installed and can start editing files!
</div>

<div class="tasks">

### Exercise 12.2 - 12.3

#### Exercise 12.2: Ubuntu 101

> Use _script_ to record what you do, save the generated file into the repository as your answer.

Edit the _/usr/src/app/index.js_ file inside the container with the now installed nano and add the following line

```javascript
console.log('Hello World')
```

If Nano isn't familiar you can ask in the chat or google.

#### Exercise 12.3: Ubuntu 102

> Use _script_ to record what you do, save the generated file into the repository as your answer.

Install Node while inside the container and run the index file with _node /usr/src/app/index.js_ in the container.

The instructions for installing Node are sometimes hard to find so here is something you can copy-paste:

```bash
curl -sL https://deb.nodesource.com/setup_16.x | bash
apt install -y nodejs
```

You will need to install the _curl_ into the container. It is installed in the same way as you did with _nano_.

</div>

<div class="content">

### Other docker commands

Now that we have node installed in the container we can execute _node /usr/src/app/index.js_ in the container! Let's create a new image from the container. The _commit <i>CONTAINER-ID-OR-CONTAINER-NAME</i> <i>NEW-IMAGE-NAME</i>_ will create a new image that includes the changes we have made. You can use _container diff_ to check for the changes between the original image and container before doing so.

```console
$ docker commit hopeful_clarke hello-node-world
```

You can list your images with _image ls_:
 
```console
$ docker-fs docker image ls
REPOSITORY                                      TAG         IMAGE ID       CREATED         SIZE
hello-node-world                                latest      eef776183732   9 minutes ago   252MB
ubuntu                                          latest      1318b700e415   2 weeks ago     72.8MB
hello-world                                     latest      d1165f221234   5 months ago    13.3kB
``` 
 
You can now run the new image as follows:
 
```console
docker run -it hello-node-world bash
root@4d1b322e1aff:/# node /usr/src/app/index.js
```

There are multiple ways to achieve the same conclusion. Let's go through a better solution starting by running _container rm_ to remove the old container.

```bash
$ docker container ls -a
CONTAINER ID   IMAGE     COMMAND   CREATED          STATUS                       PORTS     NAMES
b8548b9faec3   ubuntu    "bash"    31 minutes ago   Exited (0) 9 seconds ago               hopeful_clarke

$ docker container rm hopeful_clarke
hopeful_clarke
```

Create the index.js file and write _console.log('Hello, World')_ inside it. No need for containers yet.

Next let's skip installing node altogether. Since docker images are found in Docker Hub we can use this [https://hub.docker.com/_/node](https://hub.docker.com/_/node). That image has node already installed, and we only need to pick a version. 

By the way, the _container run_ accepts _--name_ flag that we can use to give a name for the container.

```bash
$ docker container run -it --name hello-node node:16 bash
```

While we are inside the container on this terminal, open another terminal and use the _container cp_ command to copy file from your own machine to the container.

```bash
$ docker cp ./index.js hello-node:/usr/src/app/index.js
```

And now we can run _node /usr/src/app/index.js_ in the container.

</div>
