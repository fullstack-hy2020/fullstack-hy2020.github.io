---
mainImage: ../../../images/part-12.svg
part: 12
letter: b
lang: zh
---

<div class="content">


In the previous section we used two different base images: ubuntu and node and did some manual work to get a simple "Hello, World!" running. The basic tools we learned during that process are extremely useful. In this section, we will learn how to build containers and configure environments for our own applications. How these can be managed for both React frontend and node backend applications and in addition take a quick peek at other possible backend options you may encounter.
在上一节中，我们使用了两个不同的基础镜像：ubuntu 和 node，并做了一些手动操作来获得一个简单的“Hello, World！”运行。我们在这个过程中学到的基本工具非常有用。在本节中，我们将学习如何为我们自己的应用程序构建容器和配置环境。如何为 React 前端和node后端应用程序管理这些，另外快速浏览一下您可能遇到的其他可能的后端选项。

### Dockerfile

<!-- Instead of modifying a container by copying files inside there we can create a new image that contains the "Hello, World!" application. The tool for this is the Dockerfile. Dockerfile is a simple text file that contains all of the instructions for creating an image. Let's create an example Dockerfile from the "Hello, World!" application. -->
我们可以创建一个包含“Hello, World!”应用的新镜像，而不是通过复制其中的文件来修改容器。工具是 Dockerfile。 Dockerfile 是一个简单的文本文件，其中包含创建镜像的所有说明。让我们从“Hello, World!”应用程序创建一个示例 Dockerfile。

<!-- If you did not already, create a directory on your own machine and create a file called Dockerfile. Let's also put a index.js containing _console.log('Hello, World!')_ next to the Dockerfile. Your directory structure should look like this: -->
如果您还没有，请在您自己的机器上创建一个目录并创建一个名为 Dockerfile 的文件。我们还在 Dockerfile 旁边放置一个包含 _console.log('Hello, World!')_ 的 index.js。您的目录结构应如下所示：

```
├── index.js
└── Dockerfile
```

<!-- inside that Dockerfile we will tell the image 3 things:

1. Use the node:16 as the base for our image, we want everything node 16 contains to be available for this image.
2. Include the index.js inside the image, so we don't need to manually copy it into the container
3. When we run a container from the image, use node to execute the index.js file. -->

在该 Dockerfile 中，我们将告诉镜像 3 件事：

1. 使用 node:16 作为我们镜像的基础，我们希望node 16 包含的所有内容都可用于该镜像。
2. 将 index.js 包含在镜像中，这样我们就不需要手动复制到容器中了
3. 当我们从镜像运行容器时，使用 node 执行 index.js 文件。

`Dockerfile`

```Dockerfile
FROM node:16

WORKDIR /usr/src/app

COPY ./index.js ./index.js

CMD node index.js
```

<!-- FROM instruction will tell us that the base is node:16. COPY instruction will copy the file to the file. And CMD instructs what will be executed when _docker run_ is used. CMD is the _default_ command that can then be overwritten with the parameter given after image name. See _docker run --help_ if you forgot. -->
FROM 指令会告诉我们基础是 node:16。 COPY 指令将文件复制到文件中。 CMD 指示使用 _docker run_ 时将执行什么。 CMD 是_default_ 命令，然后可以用镜像名称后给出的参数覆盖。如果您忘记了，请参阅 _docker run --help_。

<!-- I included one additional instruction, WORKDIR makes sure we don't interfere with the contents that the image already had. It will ensure all of the following commands will be in the container in directory /usr/src/app, if the directory doesn't exist it will create it.  -->
我添加了一个额外的指令，WORKDIR 确保我们不会干扰镜像已有的内容。它将确保以下所有命令都位于目录 /usr/src/app 中的容器中，如果该目录不存在，它将创建它。

<!-- If we do not specify a WORKDIR we risk overwriting unrelated, but important files by accident. If you check the root (_/_) of the node:16 with _docker run node:16 ls_ image you can notice all of the directories and files that are already included in the image. That is due to the fact that we use node as the base image. The node image already contained all of those files, we just added our own.  -->
如果我们不指定 WORKDIR，我们就有可能意外覆盖无关但重要的文件。如果您使用 _docker run node:16 ls_ image 检查 node:16 的根 (_/_)，您可以注意到镜像中已包含的所有目录和文件。这是因为我们使用node作为基础镜像。node镜像已经包含所有这些文件，我们只是添加了我们自己的文件。

<!-- Now we can use the command _docker build_ to build an image based on the Dockerfile. Let's spice up the command with one additional flag: _-t_, this will help us name the image: -->
现在我们可以使用命令 _docker build_ 来构建基于 Dockerfile 的镜像。让我们用一个额外的标志为命令：_-t_，这将帮助我们命名镜像：

```
$ docker build -t fs-hello-world . 
[+] Building 3.9s (8/8) FINISHED
...
```

<!-- So the result is "docker please build with tag fs-hello-world the Dockerfile in this directory". You can point to any Dockerfile, but in our case simple dot will mean the Dockerfile in this directory. After the build finished you can run it with _docker run fs-hello-world_. -->

所以结果是“docker please build with tag fs-hello-world the Dockerfile in this directory”。您可以指向任何 Dockerfile，但在我们的示例中，简单的点表示此目录中的 Dockerfile。构建完成后，您可以使用 _docker run fs-hello-world_ 运行它。

<!-- Images are just files. They can be moved around, downloaded and deleted. You can list the images you have locally with _docker image ls_, delete them with _docker image rm_. See what other command you have available with _docker image --help_. -->
镜像只是文件。它们可以四处移动、下载和删除。您可以使用 _docker image ls_ 列出您在本地拥有的镜像，使用 _docker image rm_ 删除它们。查看您可以使用 _docker image --help_ 的其他命令。

### More meaningful image
更有意义的镜像

<!-- Moving an express server to a container should be as simple as moving the "Hello, World!" application. The only difference is that there are more files. Thankfully _COPY_ instruction can handle all that. Let's delete the index.js and create a new express server. Lets use express-generator to create a basic express application. -->
将 express 服务器移动到容器应该就像移动“Hello, World!”应用程序一样简单。唯一的区别是有更多的文件。幸运的是 _COPY_ 指令可以处理所有这些。让我们删除 index.js 并创建一个新的 Express 服务器。让我们使用 express-generator 创建一个基本的 express 应用程序。

```console
$ npx express-generator
  ...
  
  install dependencies:
    $ npm install

  run the app:
    $ DEBUG=playground:* npm start
```

<!-- First, let's run the application to get an idea of what we just created. Note that the command to run the application may be different from you, my directory was called playground. -->
首先，让我们运行应用程序以了解我们刚刚创建的内容。请注意，运行应用程序的命令可能与您不同，我的目录名为 playground。

```console
$ npm install

$ DEBUG=playground:* npm start

  playground:server Listening on port 3000 +0ms
```

<!-- Great, so now we can navigate to [http://localhost:3000](http://localhost:3000) and the app is running there. -->
太好了，现在我们可以导航到 [http://localhost:3000](http://localhost:3000) 并且应用程序运行起来了。

<!-- Containerizing that should be easy based on the previous example.

1. Use node as base
2. Set working directory so we don't interfere with the contents of the base image
3. Copy ALL of the files in this directory to the image
4. Start with DEBUG=playground:* npm start -->

基于前面的示例，容器化应该很容易。

1. 以node为基础
2. 设置工作目录，这样我们就不会干扰基础镜像的内容
3. 将这个目录下的所有文件复制到镜像中
4. 从 DEBUG=playground:* npm start 开始

`Dockerfile`

```Dockerfile
FROM node:16

WORKDIR /usr/src/app

COPY . .

CMD DEBUG=playground:* npm start
```

<!-- Let's build the image from that, _docker build -t express-server ._ and run it with _docker run -p 3123:3000 express-server_. The _-p_ flag will inform docker that a port from the host machine should be opened and directed to a port in the container. And the format is _-p host:application_. -->

让我们从中构建镜像，_docker build -t express-server ._ 并使用 _docker run -p 3123:3000 express-server_ 运行它。 _-p_ 标志将通知 docker 应该打开来自主机的端口并将其定向到容器中的端口。格式为 _-p host:application_

```console
$ docker run -p 3123:3000 express-server

> playground@0.0.0 start
> node ./bin/www

Tue, 29 Jun 2021 10:55:10 GMT playground:server Listening on port 3000
```

<!-- > If yours doesn't work, skip to the next section where I explain why it doesn't work (even if you followed the steps). -->

> 如果您的不起作用，请跳到下一部分，我将解释为什么它不起作用（即使您是按照步骤操作的）。

<!-- Looks like it is working! Let's test it by sending a GET request to [http://localhost:3123/](http://localhost:3123/). -->
看起来跑起来了！ 让我们通过向 [http://localhost:3123/](http://localhost:3123/) 发送 GET 请求来测试它。

<!-- Shutting it down is a headache at the moment, use another terminal and _docker kill_ command to kill the application. The _docker kill_ will send a kill signal (SIGKILL) to the application to force it to shut down. As an argument it needs the name or id of the container. -->

目前关闭它是一个头痛的问题，使用另一个终端和 _docker kill_ 命令来杀死应用程序。 _docker kill_ 将向应用程序发送终止信号 (SIGKILL) 以强制其关闭。 作为参数，它需要容器的名称或 ID。

<!-- Here I choose to kill it with the ID. The beginning of the ID is enough for docker to know which container I mean. -->
这里我选择用ID杀掉。 ID的开头几位足以让docker知道我指的是哪个容器。

```
$ docker container ls
  CONTAINER ID   IMAGE            COMMAND                  CREATED         STATUS         PORTS                                       NAMES
  48096ca3ffec   express-server   "docker-entrypoint.s…"   9 seconds ago   Up 6 seconds   0.0.0.0:3123->3000/tcp, :::3123->3000/tcp   infallible_booth

$ docker kill 48
  48
```

<!-- In the future let's just use the same port outside of the container as the application runs in. This is just so we don't have to remember which one we happened to choose. -->
将来，让我们在容器外使用与应用程序运行相同的端口。这样我们就不必记住我们碰巧选择了哪个端口。

#### Fixing potential issues we created by copy-pasting
修复我们通过复制粘贴引入的潜在问题

<!-- There are a few steps we need to change to create a more comprehensive Dockerfile. It may even be that the above example doesn't work in all cases because we skipped a step. -->

我们需要更改几个步骤以创建更全面的 Dockerfile。甚至可能是因为我们跳过了一个步骤，所以上面的例子并不适用于所有情况。

<!-- We ran npm install on our machines, **node package manager** may install operating system specific dependencies during install step. As we use the COPY instruction to copy all of the node_modules into the image we may move non-functional parts as well. -->

我们在我们的机器上运行 npm install，**node package manager** 可能会在安装步骤中安装操作系统特定的依赖项。当我们使用 COPY 指令将所有 node_modules 复制到镜像中时，我们也可以移动非功能部分。

<!-- This is critical to think about when we build our images. It's best to do most things such as to run _npm install_ inside the container. -->
当我们构建镜像时，考虑这一点至关重要。最好做大多数事情，例如在容器内运行 _npm install_。

<!-- The file .dockerignore is very similar to .gitignore, you can use that to prevent unwanted files from being copied to your image. For example the contents could be -->
文件 .dockerignore 与 .gitignore 非常相似，您可以使用它来防止不需要的文件被复制到您的镜像中。例如，内容可能是

```
.dockerignore
.gitignore
node_modules
Dockerfile
```

<!-- However, in our case dockerignore isn't the only thing required. We will need to install the dependencies during the build step. -->
然而，在我们的例子中 dockerignore 并不是唯一需要的东西。我们需要在构建步骤中安装依赖项。

`Dockerfile`

```Dockerfile
COPY . .

RUN npm install

CMD DEBUG=playground:* npm start
```

<!-- Instead of using npm install, npm offers a much better tool for installing dependencies, the _ci_ command. -->
与使用 npm install 不同，npm 提供了一个更好的工具来安装依赖项，即 _ci_ 命令。

<!-- Differences between ci and install:

- install may update the package-lock.json
- install may install different version of a dependency if you have ^ or ~ in the version of the dependency.

- ci will delete the node_modules folder before installing anything
- ci will follow the package-lock.json and does not alter any files -->

ci 和 install 的区别：

- install 可能会更新 package-lock.json
- install 可能会安装不同版本的依赖项，如果您在依赖项的版本中有 ^ 或 ~ 。
- ci 将在安装任何东西之前删除 node_modules 文件夹
- ci 将遵循 package-lock.json 并且不改变任何文件

<!-- So in short: _ci_ creates realiable builds, while _install_ is the one to use when you want to install new dependencies. -->
简而言之：_ci_ 创建可实现的构建，而 _install_ 是您想要安装新依赖项时使用的构建。

<!-- As we are not installing anything new during the build step, and we don't want the versions to suddenly change, we will use _ci_ -->
由于我们在构建步骤中没有安装任何新的东西，而且我们不希望版本突然改变，我们将使用 _ci_

`Dockerfile`

```Dockerfile
COPY . .

RUN npm ci

CMD DEBUG=playground:* npm start
```

<!-- Even better, we can use _npm ci --only-production_ to not waste time installing development dependencies. -->

更好的是，我们可以使用 _npm ci --only-production_ 来不浪费时间安装开发依赖项。

<!-- > As you noticed in the comparison list; npm ci will delete the node_modules folder so creating the .dockerignore did not matter. However, .dockerignore is an amazing tool when you want to optimize your build process. We will talk briefly about these optimizations later. -->

> 正如您在比较列表中所注意到的； npm ci 将删除 node_modules 文件夹，因此创建 .dockerignore 无关紧要。但是，当您想要优化构建过程时，.dockerignore 是一个了不起的工具。稍后我们将简要讨论这些优化。

<!-- Now the Dockerfile should work again, try it with _docker build -t express-server . && docker run -p 3000:3000 express-server_ -->

现在 Dockerfile 应该可以再次工作了，用 _docker build -t express-server . && docker run -p 3000:3000 express-server_ 试试吧。

<!-- We set an environment variable _DEBUG=playground:*_ during CMD for the npm start. However, with Dockerfiles we could also use the instruction ENV to set environment variables. Let's do that. -->

我们在 npm start 的 CMD 期间设置了一个环境变量 _DEBUG=playground:*_。但是，使用 Dockerfiles 我们也可以使用指令 ENV 来设置环境变量。让我们这样做。

`Dockerfile`

```Dockerfile
ENV DEBUG=playground:*

CMD npm start
```

<!-- > <i>If you're wondering what the DEBUG environment variable does, read [here](http://expressjs.com/en/guide/debugging.html#debugging-express).</i> -->

如果你好奇什么是DEBUG 环境变量，可以阅读[这里](http://expressjs.com/en/guide/debugging.html#debugging-express).

#### Dockerfile best practices
Dockerfile 最佳实践


<!-- There are 2 rules of thumb you should follow when creating images:

1. Try to create as **secure** of an image as possible
2. Try to create as **small** of an image as possible -->

<!-- Smaller images are more secure by having less attack surface area. And smaller images move faster in deployment pipelines. -->
创建镜像时应遵循 2 条经验法则：

1. 尝试创建尽可能**安全**的镜像
2. 尝试创建尽可能**小的**镜像

较小的镜像由于具有较少的攻击面而更安全。 
较小的镜像在部署管道中移动得更快。

<!-- Snyk has a great list of 10 best practices, read them [here](https://snyk.io/blog/10-best-practices-to-containerize-nodejs-web-applications-with-docker/). -->
Snyk 列出了 10 个最佳实践，请在 [此处](https://snyk.io/blog/10-best-practices-to-containerize-nodejs-web-applications-with-docker/)阅读它们。

<!-- One big neglection we did was having the application running as root instead of using an user. Let's do a final fix to the Dockerfile: -->
我们所做的一大漏洞是让应用程序以 root 身份运行，而不是使用用户身份运行。 让我们对 Dockerfile 做最后的修复：

`Dockerfile`

```Dockerfile
USER node
  
WORKDIR /usr/src/app

COPY --chown=node:node . .
```

</div>
  
<div class="tasks">

### Exercise 12.4.
练习 12.4

#### Exercise 12.4: Containerizing a node application
练习 12.4：容器化node应用程序

<!-- The following repository contains an express application in the express-app directory: [part12-containers-applications](https://github.com/fullstack-hy2020/part12-containers-applications). You do not need the other directory yet. Copy the contents into your own repository. The express-app directory includes a README on how to start the application. -->

以下存储库在 express-app 目录中包含一个 express 应用程序：[part12-containers-applications](https://github.com/fullstack-hy2020/part12-containers-applications)。 您还不需要其他目录。 将内容复制到您自己的存储库中。 express-app 目录包含关于如何启动应用程序的 README。

<!-- Get the visit counter in root of the application working while the application is running inside the container. -->
当应用程序在容器内运行时，获取应用程序根目录中的访问计数器。

</div>
  
<div class="content">

#### Using docker-compose

<!-- In the previous section we created express-server and knew that it runs in port 3000, and ran it with _docker build -t express-server . && docker run -p 3000:3000 express-server_. This already looks like something you would need to put into a script to remember. Fortunately docker offers us a better solution. -->
在上一节中，我们创建了 express-server 并且知道它运行在 3000 端口，并使用 _docker build -t express-server . && docker run -p 3000:3000 express-server_ 运行它。这看起来像是您需要放入脚本中才能记住的东西。 幸运的是 docker 为我们提供了更好的解决方案。

<!-- Docker-compose is another amazing tool, which can help us manage containers. We are going to start using docker-compose as we learn more about containers as it will help us save some time with the configuration. -->

Docker-compose 是另一个了不起的工具，它可以帮助我们管理容器。 随着我们对容器的了解更多，我们将开始使用 docker-compose，因为它将帮助我们节省一些配置时间。

<!-- Install the docker-compose tool from this link: [https://docs.docker.com/compose/install/](https://docs.docker.com/compose/install/). -->
从此链接安装 docker-compose 工具：[https://docs.docker.com/compose/install/](https://docs.docker.com/compose/install/)。

<!-- Let's check that it works: -->
让我们检查它是否有效：

```
$ docker-compose -v
docker-compose version 1.29.2, build 5becea4c
```

<!-- And now we can turn the spell into a yaml file: -->
现在我们可以将这些“咒语”转换为 yaml 文件：

`docker-compose.yml`

```yaml
services:
  app:                    # The name of the service, can be anything
    image: express-server # Declares which image to use
    build: .              # Declares where to build if image is not found
    ports:                # Declares the ports to publish
      - 3000:3000
```

<!-- Save this file as **docker-compose.yml** and place it next to the Dockerfile, at the root of the project. -->
将此文件另存为 **docker-compose.yml** 并将其放在项目根目录下的 Dockerfile 旁边。

<!-- Now we can use _docker-compose up_ to build and run the application. If we want to rebuild the image we can use _docker-compose up --build_. -->
现在我们可以使用 _docker-compose up_ 来构建和运行应用程序。 如果我们想重建镜像，我们可以使用 _docker-compose up --build_。

<!-- You can also run the application in the background with _docker-compose up -d_ (_-d_ for detached) and close it with _docker-compose down_. -->
您还可以使用 _docker-compose up -d_（_-d_ 表示分离）在后台运行应用程序，并使用 _docker-compose down_ 关闭它。

<!-- Creating files like this that <i>declare</i> what you want instead of script files that you need to run in a specific order / a specific number of times is often a great practice. -->

创建这样的文件<i>声明</i>你想要什么，而不是你需要以特定顺序/特定次数运行的脚本文件，这通常是一个很好的做法。

</div>

<div class="tasks">

### Exercise 12.5.
练习12.5

#### Exercise 12.5: docker-compose
练习12.5： docker-compose

<!-- Create a docker-compose file that works with the node application from the previous exercise. -->
创建一个 docker-compose 文件，该文件适用于上一个练习中的node应用程序。

<!-- The visit counter is the only feature that is required to be working. -->
访问计数器是唯一需要工作的功能。

</div>

<div class="content">

### Utilizing containers when developing software
在开发软件时使用容器

<!-- When you are developing software, containerization can be used in various ways to improve your quality of life. One of the most useful cases is by bypassing the need to install and configure tools twice. -->
在开发软件时，可以通过多种方式使用容器化来提高您的生活质量。 最有用的情况之一是绕过两次安装和配置工具的需要。

<!-- It may not be the best option to move your entire development environment into a container, but if that's what you want it's possible. We will revisit this idea at the end of this part. But until then, <i>run the node application itself outside of containers</i>. -->
将整个开发环境移动到容器中可能不是最佳选择，但如果这是您想要的，是可能的。 我们将在这一部分的结尾重新审视这个想法。 但在那之前，<i>在容器之外运行node应用程序</i>。

<!-- The application we met in the previous exercises can use MongoDB. Let's explore [Docker Hub](https://hub.docker.com/) to find a mongodb image. Docker Hub is the default place where docker pulls the images from, you can use other registries as well, but since we are already knee-deep in docker I chose that one. With a quick search there I found [https://hub.docker.com/_/mongo](https://hub.docker.com/_/mongo) -->
我们在前面练习中的应用程序可以使用 MongoDB。 让我们探索 [Docker Hub](https://hub.docker.com/) 以找到一个 mongodb 镜像。 Docker Hub 是 docker 从中提取镜像的默认位置，您也可以使用其他注册表，但由于我们已经深入了解 docker，因此我选择了那个。 通过快速搜索，我找到了 [https://hub.docker.com/_/mongo](https://hub.docker.com/_/mongo)

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

<!-- The environment variables defined here are explained in the docker hub page: -->
这里定义的环境变量在docker hub页面中有说明：

<!-- > These variables, used in conjunction, create a new user and set that user's password. This user is created in the admin authentication database and given the role of root, which is a "superuser" role. -->
> 这些变量结合使用，可创建新用户并设置该用户的密码。该用户是在 admin 身份验证数据库中创建的，并被赋予 root 角色，这是一个“超级用户”角色。

<!-- And since we're only using it in development at the moment we can leave them like that. The last environment variable *MONGO\_INITDB\_DATABASE* will tell mongo to create a database with that name. Let's save that as the docker-compose.yml in the directory. -->
因为我们目前只在开发中使用它，所以我们可以这样离开它们。最后一个环境变量 *MONGO\_INITDB\_DATABASE* 将告诉 mongo 使用该名称创建一个数据库。让我们将其保存为目录中的 docker-compose.yml。

<!-- Now start the mongo with _docker-compose up -d_, it will run it in the background and you can view the logs with _docker-compose logs -f_, the _-f will ensure we <i>follow</i> the logs. -->
现在使用 _docker-compose up -d_ 启动 mongo，它将在后台运行它，您可以使用 _docker-compose logs -f_ 查看日志，_-f_ 将确保我们<i>关注</i>日志.

<!-- As said previously, now we do not want to run the node application inside a container. We'll explore that option in the future but for now it's easier to develop the application if it's not in a container. -->
如前所述，现在我们不想在容器内运行node应用程序。我们将在未来探索该选项，但现在如果应用程序不在容器中，则开发应用程序会更容易。

<!-- Run the good old npm install first and let's start the application with the relevant environment variable, you can modify the code to set them as the defaults or use .env file. I'll just throw them in with the start to help you copy-paste. -->
首先运行旧的 npm install 并让我们使用相关的环境变量启动应用程序，您可以修改代码将它们设置为默认值或使用 .env 文件。我会在开始时将它们扔进去以帮助您复制粘贴。

```
$ MONGO_URL=mongodb://localhost:3456/the_database npm run dev
```

<!-- This won't be enough; we need to create a user to be authorized inside of the container. The url http://localhost:3000/todos leads to an authentication error. -->
这还不够；我们需要在容器内创建一个要授权的用户。 url http://localhost:3000/todos 导致身份验证错误。

#### Bind mount
绑定挂载点

<!-- In the MongoDB Docker Hub page under "Initializing a fresh instance" is the info on how to execute js to initialize the database and an user for it. -->
在“初始化新实例”下的 MongoDB Docker Hub 页面中，是有关如何执行 js 以初始化数据库及其用户的信息。

<!-- Let's create a file _mongo-init.js_ and place it in the mongo directory of the express project. -->
让我们创建一个文件 _mongo-init.js_ 并将其放在 express 项目的 mongo 目录中。

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

<!-- It will initialize the database with an user and a few todos. Now we just need to get it inside the container at startup. -->
它将使用用户和一些待办事项初始化数据库。 现在我们只需要在启动时将它放入容器中。

<!-- We could create a new image FROM mongo and COPY the file inside or we can use a bind mount to mount the init-mongo.js to the container. Let's do the latter. -->
我们可以 FROM mongo 创建一个新镜像并 COPY 里面的文件，或者我们可以使用绑定挂载将 init-mongo.js 挂载到容器。 让我们做后者。

<!-- With _container run_ we can add _-v_ flag with the syntax _-v FILE-IN-HOST:FILE-IN-CONTAINER_, but let's skip that and add it to the docker-compose.yml. The format is the same, first host and then container: -->

使用 _container run_，我们可以使用语法 _-v FILE-IN-HOST:FILE-IN-CONTAINER_ 添加 _-v_ 标志，但让我们跳过它并将其添加到 docker-compose.yml。 格式是一样的，先是主机，然后是容器：

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

<!-- Mounting the file will mean that the mongo-init file in the mongo folder is the same as the mongo-init file in the containers /docker-entrypoint-initdb.d directory. Changes to either file will be available in the other. -->
挂载文件将意味着 mongo 文件夹中的 mongo-init 文件与容器 /docker-entrypoint-initdb.d 目录中的 mongo-init 文件相同。 对任一文件的更改将在另一个文件中可用。

<!-- Run _docker-compose down --volumes_ to ensure that nothing is left and start from a clean slate with _docker-compose up_ to initialize the database. -->
运行 _docker-compose down --volumes_ 以确保没有留下任何东西，然后使用 _docker-compose up_ 从干净的板子开始初始化数据库。

<!-- Now starting the express application with the correct environment variable should work: -->
现在使用正确的环境变量启动 express 应用程序应该可以工作：

```
$ MONGO_URL=mongodb://the_username:the_password@localhost:3456/the_database npm run dev
```

<!-- Let's check that the http://localhost:8000/todos returns all todos. It should return the two todos we initialized. We can use postman to test the basic functionality for todos like delete todo. -->
让我们检查 http://localhost:8000/todos 是否返回所有待办事项。它应该返回我们初始化的两个 todos。我们可以使用 postman 来测试 todos 的基本功能，比如删除 todo。

#### Persisting data with volumes
使用卷持久化数据

<!-- By default containers are not going to persist our data. When you close the mongo container you may or may not be able to get the data back. -->
默认情况下，容器不会保存我们的数据。当您关闭 mongo 容器时，您可能无法取回数据。

<!-- This is a rare case in which it actually does preserve the data as the developers who made the docker image for Mongo have defined a volume to be used: [https://github.com/docker-library/mongo/blob/cb8a419053858e510fc68ed2d69415b3e50011cb/4.4/Dockerfile#L113](https://github.com/docker-library/mongo/blob/cb8a419053858e510fc68ed2d69415b3e50011cb/4.4/Dockerfile#L113) This line will instruct docker to preserve the data in those directories. -->

这是一种罕见的情况，它实际上确实保留了数据，因为为 Mongo 制作 docker 镜像的开发人员已经定义了一个要使用的卷：[https://github.com/docker-library/mongo/blob/cb8a419053858e510fc68ed2d69415b3e50011cb/ 4.4/Dockerfile#L113](https://github.com/docker-library/mongo/blob/cb8a419053858e510fc68ed2d69415b3e50011cb/4.4/Dockerfile#L113) 这一行将指示 docker 保存这些目录中的数据

<!-- There are two distinct methods to store the data: 
  1. Declaring a location in your filesystem (called bind mount)
  2. Letting docker decide where to store the data (volume) -->
有两种不同的方法来存储数据：
  1. 在你的文件系统中声明一个位置（称为绑定挂载）
  2. 让docker决定数据的存储位置（volume）

<!-- I prefer the first choice in most cases whenever you really need to avoid deleting the data. Let's see both in action with docker-compose; -->
在大多数情况下，当您确实需要避免删除数据时，我更喜欢第一个选择。让我们看看两者在 docker-compose 中的作用；

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

<!-- The above will create a directory called _mongo_data_ to your local filesystem, and map it into the container as _/data/db_. This means the data in _/data/db_ is stored outside of the container but still accessible by the container! Just remember to add the directory to .gitignore. -->
以上将创建一个名为 _mongo_data_ 的目录到您的本地文件系统，并将其映射到容器中作为 _/data/db_。 这意味着 _/data/db_ 中的数据存储在容器之外，但容器仍然可以访问！ 请记住将目录添加到.gitignore。

<!-- Another great method is by using a named volume: -->
另一个很好的方法是使用命名卷：

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

<!-- Now the volume is created, but managed by docker. After starting the application (_docker-compose up_) you can list the volumes with _docker volume ls_, inspect one of them with _docker volume inspect_ and even delete them with _docker volume rm_. It's still stored in your local filesystem but figuring out <i>where</i> may not be as trivial as with the previous option. -->

现在卷已创建，但由 docker 管理。 启动应用程序 (_docker-compose up_) 后，您可以使用 _docker volume ls_ 列出卷，使用 _docker volume inspect_ 检查其中之一，甚至使用 _docker volume rm_ 删除它们。 它仍然存储在您的本地文件系统中，但找出 <i>where</i> 可能不像使用前一个选项那么简单。 

</div>

<div class="tasks">

### Exercise 12.6.
练习 12.6

#### Exercise 12.6: Little bit of mongodb coding
练习 12.6：一点点 mongodb 编码

<!-- The todo express application is missing both get one and update.  -->
todo express 应用程序缺少 get one 和 update。

<!-- Fix get one to return one todo with and id, and update to update one todo with an id. -->
修复 get one 返回一个 todo with 和 id，以及 update 以更新一个 id 的 todo。

</div>

<div class="content">

### Debugging issues in containers
调试容器中的问题

<!-- >  When coding you most likely end up in a situation where everything is broken. 

> \- Matti Luukkainen -->

> 编码时，您很可能会遇到一切都搞砸的情况。
> \- Matti Luukkainen

<!-- We need to learn new tools for debugging. When code has a bug you may often be in a state where at least something works so you can work forward from that. Configuration most often is in either of the two states: 1. working or 2. broken. We'll go over a few tools to help when your application is in the latter state. -->
我们需要学习新的调试工具。当代码有错误时，您可能经常处于至少某些东西可以工作的状态，因此您可以继续前进。配置最常处于两种状态之一：1. 工作或者 2. 崩溃。当您的应用程序处于后一种状态时，我们将介绍一些工具来提供帮助。

<!-- The most difficult thing about this is that configuration is often broken when it's not finished. So when you write a long docker-compose.yml or Dockerfile and it does not work, you really need to take a moment and think about the various ways you could confirm something is working. -->
最困难的是，配置经常在未完成时被破坏。因此，当您编写了很长的 docker-compose.yml 或 Dockerfile 并且它不起作用时，您真的需要花点时间思考一下可以确认某些东西是否正常工作的各种方法。

<!-- <i>Question Everything</i> is still applicable here. As said in part 3: The key is to be systematic. Since the problem can exist anywhere, <i>you must question everything</i>, and eliminate all possibilities one by one. -->
<i>质疑一切</i>在这里仍然适用。如第 3 部分所述：关键是要系统化。既然问题可能存在于任何地方，那么<i>你必须质疑一切</i>，并一一排除所有的可能性。

<!-- For myself the most important method of debugging is stopping and really thinking about what I'm trying to accomplish instead of just bashing my head at the problem. Often there is a simple alternate solution or quick google search that will get me moving forward.  -->
对我自己来说，最重要的调试方法是停下来真正思考我想要完成的事情，而不是仅仅在问题上猛烈抨击。通常有一个简单的替代解决方案或快速的谷歌搜索可以让我继续前进。

#### exec

<!-- The docker command _exec_ is a heavy hitter. It can be used to jump right into a container when it's running. That's it. -->
docker 命令 _exec_ 是一个重武器。它可用于在运行时直接跳入容器。就是这样。

<!-- Let's start a web server, nginx, in the background and do a little bit of debugging to get it running and displaying the message "Hello, exec!" in our browser. Nginx is, among other things, a server capable of serving static html files. It has a default index.html that we can replace. -->
让我们在后台启动 Web 服务器 nginx 并进行一些调试以使其运行并显示消息“Hello，exec！”在我们的浏览器中。 Nginx 是一个能够提供静态 html 文件的服务器。它有一个我们可以替换的默认 index.html。

```console
$ docker container run -d nginx
```

<!-- Ok, now where should we go with our browser? Is it even running? We know how to answer the latter. -->
好的，现在我们应该用浏览器去哪里？它甚至在运行吗？我们知道如何回答后者。

```console
$ docker container ls
CONTAINER ID   IMAGE           COMMAND                  CREATED              STATUS                      PORTS     NAMES
3f831a57b7cc   nginx           "/docker-entrypoint.…"   About a minute ago   Up About a minute           80/tcp    keen_darwin
```

<!-- Yes! It seems to listen on port 80, as output by the previous command. -->
是的！它似乎侦听端口 80，作为上一个命令的输出。

<!-- Let's shut it down and restart with the _-p_ flag to have our browser access it. -->
让我们关闭它并使用 _-p_ 标志重新启动以让我们的浏览器访问它。

```console
$ docker container stop keen_darwin
$ docker container rm keen_darwin

$ docker container run -d -p 8080:80 nginx
```

<!-- Let's see the app in http://localhost:8080. It seems the app is showing the wrong message! Let's hop right into the container and fix the message. Keep your browser open, we won't need to shut down the container for this fix. We will execute bash inside the container, the flags _-it_ will ensure that we can interact with the container: -->
让我们在 http://localhost:8080 中查看应用程序。该应用程序似乎显示错误消息！让我们直接跳入容器并修复消息。保持浏览器打开，我们不需要为此修复关闭容器。我们将在容器内执行 bash，标志 _-it_ 将确保我们可以与容器交互：

```console
$ docker container ls
CONTAINER ID   IMAGE     COMMAND                  CREATED              STATUS              PORTS                                   NAMES
7edcb36aff08   nginx     "/docker-entrypoint.…"   About a minute ago   Up About a minute   0.0.0.0:8080->80/tcp, :::8080->80/tcp   wonderful_ramanujan

$ docker exec -it wonderful_ramanujan bash
root@7edcb36aff08:/#
```

<!-- Now that we are in, we need to find the faulty file and replace it. Quick Google tells us that file itself is _/usr/share/nginx/html/index.html_. -->
现在我们进入了，我们需要找到有问题的文件并替换它。 Quick Google 告诉我们文件本身是 _/usr/share/nginx/html/index.html_。

<!-- Let's move to the directory and delete the file -->
让我们移动到目录并删除文件

```console
root@7edcb36aff08:/# cd /usr/share/nginx/html/
root@7edcb36aff08:/# rm index.html
```

<!-- Now if we go to http://localhost:8080/ we know that we deleted the correct file. Let's replace it with one containing the correct contents: -->
现在，如果我们访问 http://localhost:8080/ 我们知道我们删除了正确的文件。让我们用一个包含正确内容的替换它：

```console
root@7edcb36aff08:/# echo "Hello, exec!" > index.html
```

<!-- Refresh the page and our message is displayed! -->
刷新页面并显示我们的消息！

</div>

<div class="tasks">

### Exercise 12.7.
练习 12.7

#### Exercise 12.7: Mongo command-line interface
练习 12.7：Mongo 命令行界面

<!-- While the mongodb from the previous exercise is running access the database with mongo command-line interface (cli) using docker exec and add a new todo using the cli. -->
当上一个练习中的 mongodb 正在运行时，使用 mongo 命令行界面 (cli) 使用 docker exec 访问数据库，并使用 cli 添加新的待办事项。

<!-- The command to open cli when inside the container is simply "mongo" -->
在容器内打开 cli 的命令只是简单的“mongo”

<!-- The mongo cli will require the username and password flags to authenticate correctly: -u root -p example, the values are from the docker-compose.yml. -->
mongo cli 将需要用户名和密码标志才能正确验证： -u root -p ，值来自 docker-compose.yml。

<!-- * Step 1: Run mongodb
* Step 2: Use docker exec to get inside the container
* Step 3: Open mongo cli -->

* 第 1 步：运行mongodb
* 第 2 步：使用docker exec进入容器
* 第 3 步：打开 mongo cli

When you have connected to the mongo cli you can ask it to show dbs inside:
当您连接到 mongo cli 后，您可以要求它在里面显示 dbs：

```console
> show dbs
admin         0.000GB
config         0.000GB
local         0.000GB
the_database  0.000GB
```

<!-- To access the correct database: -->
要访问正确的数据库：

```console
> use the_database
```

<!-- And finally to find out the collections: -->
最后找出集合：

```console
> show collections
todos
```

<!-- We can now access the data in those collections: -->
我们现在可以访问这些集合中的数据：

```
> db.todos.find({})
{ "_id" : ObjectId("611e54b688ddbb7e84d3c46b"), "text" : "Write code", "done" : true }
{ "_id" : ObjectId("611e54b688ddbb7e84d3c46c"), "text" : "Learn about containers", "done" : false }
```

<!-- Use the documentation [here](https://docs.mongodb.com/v4.4/reference/method/db.collection.insertOne/#mongodb-method-db.collection.insertOne) to insert one new todo with the text: "Increase the number of tools in my toolbelt" with status done as false! -->
使用[这个](https://docs.mongodb.com/v4.4/reference/method/db.collection.insertOne/#mongodb-method-db.collection.insertOne) 文档插入一个带有文本的新待办事项：“增加我工具带中的工具数量”，状态为 false！

</div>

<div class="content">

### Redis

<!-- Redis has nothing to do with containers. But since we are already able to add <i>any</i> 3rd party service to your applications, why not learn about a new one. -->
Redis 与容器无关。但是既然我们已经能够向您的应用程序添加<i>任何</i> 三方服务，为什么不了解一个新的服务。

<!-- Redis is a data store. So just like mongo it can be used to store data. The difference is that Redis stores key-value data. And it is by default in-memory which means that it does not store data persistently. -->
Redis 是一个数据存储。所以就像 mongo 一样，它可以用来存储数据。不同的是Redis存储的是key-value数据。它默认在内存中，这意味着它不会持久存储数据。

<!-- An excellent use case for Redis is to use it as a cache. Caches are often used to store data that is otherwise slow to fetch, and save it until it's no longer valid and then fetch the data and store it to the cache. -->
Redis 的一个很好的用例是将其用作缓存。缓存通常用于存储在其他情况下获取速度较慢的数据，并将其保存到不再有效，然后获取数据并将其存储到缓存中。

</div>

<div class="tasks">

### Exercises 12.8. - 12.10.
练习 12.8 - 12.10

#### Exercise 12.8: Setup redis to project
练习 12.8：设置 redis 到项目

<!-- The application will be able to use redis by giving it the REDIS_URL environment variable. Find and read through the Docker Hub page for redis, add it to the docker-compose.yml by defining another service after mongo: -->
应用程序将能够通过给它 REDIS_URL 环境变量来使用 redis。查找并通读redis的Docker Hub页面，通过在mongo之后定义另一个服务将其添加到docker-compose.yml中：

`docker-compose.yml`

```yml
services:
  mongo:
    ...
  redis:
    ???
```

<!-- Since the Docker Hub page doesn't have all info we can use Google to aid us. The default port for redis is found by doing so: -->
由于 Docker Hub 页面没有所有信息，我们可以使用 Google 来帮助我们。通过这样做可以找到 redis 的默认端口：

![](../../images/12/redis_port_by_google.png)

<!-- The application will not start using redis by itself. You will need to require the config by adding -->
应用程序不会自己开始使用 redis。您需要通过添加来要求配置

```js
const redis = require('../redis')
```

<!-- to the express server. The next exercise will require redis to be available and configured correctly. -->
到express服务器。下一个练习将要求 redis 可用并正确配置。

#### Exercise 12.9:
练习 12.9：

<!-- The project already has [https://www.npmjs.com/package/redis](https://www.npmjs.com/package/redis) installed and two functions "promisified" - getAsync and setAsync. -->
该项目已经安装了 [https://www.npmjs.com/package/redis](https://www.npmjs.com/package/redis) 和两个函数“promisified”——getAsync 和 setAsync。

<!-- - setAsync function takes in key and value, using the key to store the value. -->

<!-- - getAsync function takes in key and returns the value in a promise. -->

- setAsync 函数接收键和值，使用键来存储值。

- getAsync 函数接受键并在承诺中返回值。

<!-- Implement a todo counter: -->
实现一个待办事项计数器：

<!-- - Step 1: Whenever a request is sent to add a todo, increment the counter by one.
- Step 2: Create a GET /statistics endpoint where you can ask the usage metadata. The format should be the following JSON: -->

- 第 1 步：每当发送添加待办事项的请求时，将计数器加 1。
- 第 2 步：创建一个 GET /statistics 端点，您可以在其中询问使用情况元数据。格式应为以下 JSON：

```json
{
  added_todos: 0,
}
```

#### Exercise 12.10:
  
<!-- Like we did with mongo we can do with redis. Use redis command-line interface to edit the value in the database.  -->
就像我们用 mongo 做的那样，我们可以用 redis 做。使用 redis 命令行界面编辑数据库中的值。

<!-- The command to open the redis cli is "redis-cli". -->
打开redis cli的命令是“redis-cli”。

<!-- You can find the key you used with _[KEYS *](https://redis.io/commands/keys)_ -->

您可以通过 _[KEYS *](https://redis.io/commands/keys)_ 找到您使用的key

<!-- And set the value with _[SET](https://redis.io/commands/set)_, giving it the key and then the value -->
并用 _[SET](https://redis.io/commands/set)_ 设置值，给它键和值

<!-- And finally set the value of the counter to 9001. -->
最后将计数器的值设置为 9001。

<!-- Make sure that the new value works by using your application. Refresh the application and see that it has the new number, and the redis cli shows new number when asking with _[GET](https://redis.io/commands/get)_, giving it the key -->

使用您的应用程序确保新值有效。刷新应用程序，看到它有新号码，给它一个key，redis cli在用_[GET](https://redis.io/commands/get)_询问时显示新号码

</div>

<div class="content">

#### Persisting data with Redis
使用 Redis 持久化数据

<!-- In the previous section I said that <i>by default</i> Redis does not persist the data. However, the persistence is easy to toggle on. We will only need to start the redis with a different command, as instructed by the docker hub page: -->
在上一节中，我说<i>默认</i> Redis 不会持久化数据。但是，持久性很容易切换。我们只需要按照 docker hub 页面的指示使用不同的命令启动 redis：

`docker-compose.yml`

```yml
services:
  redis:
    # Everything else
    command: ['redis-server', '--appendonly', 'yes'] # Overwrite the CMD
    volumes: # Declare the volume
      - ./redis_data:/data
```

<!-- Remember to add the directory to .gitignore. -->
请记住将目录添加到 .gitignore。

#### Other functionality Redis has
Redis 的其他功能

<!-- In addition to the most basic get & set Redis can automatically expire keys. And manage multiple key value pairs at the same time. -->
除了最基本的 get & set Redis 还可以自动使键过期。并同时管理多个键值对。

<!-- In addition to the key-value features Redis can also be used to Publish messages and Subscribe to messages (PubSub or Publish-subscribe pattern). Publish-subscribe is great for having multiple applications communicate with each other. Redis works as the message broker between two or more applications, where one of them is publishing messages by sending them to redis, and the other is subscribed to those messages. -->
除了键值特性之外，Redis 还可以用于发布消息和订阅消息（发布订阅或发布订阅模式）。发布订阅非常适合让多个应用程序相互通信。 Redis 充当两个或多个应用程序之间的消息代理，其中一个通过将消息发送到 redis 来发布消息，另一个订阅这些消息。

</div>

<div class="tasks">

### Exercises 12.11.
练习 12.11  
#### Exercise 12.11: Persisting data in redis
在 redis 中持久化数据

<!-- Do not yet create volume for redis. Ensure that the data is not persisted by default, that is, after running after running _docker-compose down_ and _docker-compose up_ the the counter value is not anymore set. -->
还没有为 redis 创建卷。确保数据默认不持久化，即运行_docker-compose down_和_docker-compose up_后运行后不再设置计数器值。

<!-- Create a volume for redis data and make sure that the data survives after running _docker-compose down_ and _docker-compose up_ -->
为 redis 数据创建一个卷，并确保在运行 _docker-compose down_ 和 _docker-compose up_ 后数据仍然存在

</div>
