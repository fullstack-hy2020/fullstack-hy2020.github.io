---
mainImage: ../../../images/part-12.svg
part: 12
letter: b
lang: zh
---

<div class="content">


<!-- In the previous section, we used two different base images: ubuntu and node and did some manual work to get a simple "Hello, World!" running. The tools and commands we learned during that process will be helpful. In this section, we will learn how to build images and configure environments for our applications. We will start with a regular Express/Node.js backend and build on top of that with other services, including a MongoDB database.-->
 在上一节中，我们使用了两个不同的基础镜像：ubuntu和node，并做了一些手工工作来获得一个简单的 "Hello, World!"运行。在这个过程中，我们学到的工具和命令将是有帮助的。在本节中，我们将学习如何为我们的应用构建镜像和配置环境。我们将从一个普通的Express/Node.js后端开始，在此基础上建立其他服务，包括MongoDB数据库。

### Dockerfile

<!-- Instead of modifying a container by copying files inside, we can create a new image that contains the "Hello, World!" application. The tool for this is the Dockerfile. Dockerfile is a simple text file that contains all of the instructions for creating an image. Let's create an example Dockerfile from the "Hello, World!" application.-->
 我们可以创建一个包含 "Hello, World!"应用的新镜像，而不是通过复制里面的文件来修改一个容器。这方面的工具是Dockerfile。Dockerfile是一个简单的文本文件，包含创建镜像的所有指令。让我们从 "Hello, World!"应用创建一个Dockerfile的例子。

<!-- If you did not already, create a directory on your machine and create a file called <i>Dockerfile</i> inside that directory. Let's also put an <i>index.js</i> containing _console.log('Hello, World!')_ next to the Dockerfile. Your directory structure should look like this:-->
 如果你还没有，在你的机器上创建一个目录，并在该目录下创建一个名为<i>Dockerfile</i>的文件。让我们也在Dockerfile旁边放一个<i>index.js</i>，包含_console.log(''Hello, World!')_。你的目录结构应该是这样的。

```
├── index.js
└── Dockerfile
```

<!-- inside that Dockerfile we will tell the image three things:-->
 在这个Docker文件中，我们将告诉镜像三件事。

<!-- - Use the node:16 as the base for our image-->
 - 使用node:16作为我们镜像的基础
<!-- - Include the index.js inside the image, so we don't need to manually copy it into the container-->
 - 在镜像中包含index.js，这样我们就不需要手动将其复制到容器中。
<!-- - When we run a container from the image, use node to execute the index.js file.-->
 - 当我们从镜像中运行一个容器时，使用node来执行index.js文件。

<!-- The wishes above will translate into a basic Dockerfile. The best location to place this file is usually at the root of the project.-->
 上面的愿望将转化为一个基本的Docker文件。放置这个文件的最佳位置通常是在项目的根部。

<!-- The resulting <i>Dockerfile</i> looks like this:-->
 产生的<i>Dockerfile</i>如下所示：

```Dockerfile
FROM node:16

WORKDIR /usr/src/app

COPY ./index.js ./index.js

CMD node index.js
```

<!-- FROM instruction will tell Docker that the base for the image should be node:16. COPY instruction will copy the file <i>index.js</i> from the host machine to the file with the same name in the image. CMD instruction tells what happens when _docker run_ is used. CMD is the default command that can then be overwritten with the parameter given after the image name. See _docker run --help_ if you forgot.-->
 FROM指令将告诉Docker，镜像的基础应该是node:16。COPY指令将把主机上的文件<i>index.js</i>复制到镜像中的同名文件。CMD指令讲述了使用_docker run_时的情况。CMD是默认的指令，然后可以用镜像名称后给出的参数来覆盖。如果你忘记了，请看_docker run --help_。

<!-- The WORKDIR instruction was slipped in to ensure we don't interfere with the contents of the image. It will guarantee all of the following commands will have <i>/usr/src/app</i> set as the working directory. If the directory doesn't exist in the base image, it will be automatically created.-->
 WORKDIR指令是为了确保我们不干扰镜像的内容而悄悄加入的。它将保证所有下面的命令都将<i>/usr/src/app</i>设置为工作目录。如果该目录不存在于基本镜像中，它将被自动创建。

<!-- If we do not specify a WORKDIR, we risk overwriting important files by accident. If you check the root (_/_) of the node:16 image with _docker run node:16 ls_, you can notice all of the directories and files that are already included in the image.-->
 如果我们不指定一个WORKDIR，我们就有可能意外地覆盖重要的文件。如果你用_docker run node:16 ls_检查node:16镜像的根（_/_），你可以注意到所有已经包含在镜像中的目录和文件。

<!-- Now we can use the command _docker build_ to build an image based on the Dockerfile. Let's spice up the command with one additional flag: _-t_, this will help us name the image:-->
 现在我们可以使用命令_docker build_来构建一个基于Docker文件的镜像。让我们用一个额外的标志来完善这个命令。_-t_，这将帮助我们命名镜像。

```bash
$ docker build -t fs-hello-world .
[+] Building 3.9s (8/8) FINISHED
...
```

<!-- So the result is "docker please build with tag fs-hello-world the Dockerfile in this directory". You can point to any Dockerfile, but in our case, a simple dot will mean the Dockerfile in <i>this</i> directory. That is why the command ends with a period. After the build is finished, you can run it with _docker run fs-hello-world_.-->
 所以结果是 "docker please build with tag fs-hello-world the Dockerfile in this directory"。你可以指向任何Docker文件，但在我们的例子中，一个简单的点将意味着<i>这个</i>目录中的Docker文件。这就是为什么该命令以句号结束。构建完成后，你可以用_docker run fs-hello-world_运行它。

<!-- As images are just files, they can be moved around, downloaded and deleted. You can list the images you have locally with _docker image ls_, delete them with _docker image rm_. See what other command you have available with _docker image --help_.-->
 由于图像只是文件，它们可以被随意移动、下载和删除。你可以用_docker image ls_列出你在本地的图像，用_docker image rm_删除它们。用_docker image --help_查看你还有哪些可用的命令。

### More meaningful image

<!-- Moving an Express server to a container should be as simple as moving the "Hello, World!" application inside a container. The only difference is that there are more files. Thankfully _COPY_ instruction can handle all that. Let's delete the index.js and create a new Express server. Lets use [express-generator](https://expressjs.com/en/starter/generator.html) to create a basic Express application skeleton.-->
 把Express服务器移到一个容器里应该和把 "Hello, World!"应用移到一个容器里一样简单。唯一的区别是，有更多的文件。幸好_COPY_ 指令可以处理所有这些。让我们删除index.js并创建一个新的Express服务器。让我们使用[express-generator](https://expressjs.com/en/starter/generator.html)来创建一个基本的Express应用骨架。

```bash
$ npx express-generator
  ...

  install dependencies:
    $ npm install

  run the app:
    $ DEBUG=playground:* npm start
```

<!-- First, let's run the application to get an idea of what we just created. Note that the command to run the application may be different from you, my directory was called playground.-->
 首先，让我们运行这个应用来了解一下我们刚刚创建的东西。注意，运行应用的命令可能与你不同，我的目录被称为playground。

```bash
$ npm install
$ DEBUG=playground:* npm start
  playground:server Listening on port 3000 +0ms
```

<!-- Great, so now we can navigate to [http://localhost:3000](http://localhost:3000) and the app is running there.-->
 很好，所以现在我们可以导航到[http://localhost:3000](http://localhost:3000)，应用正在那里运行。

<!-- Containerizing that should be relatively easy based on the previous example.-->
 基于之前的例子，容器化应该是比较容易的。

<!-- - Use node as base-->
 - 使用节点作为基础
<!-- - Set working directory so we don't interfere with the contents of the base image-->
 - 设置工作目录，这样我们就不会干扰到基础镜像的内容了
<!-- - Copy ALL of the files in this directory to the image-->
 - 把这个目录下的所有文件都复制到镜像上
<!-- - Start with DEBUG=playground:* npm start-->
 - 用DEBUG=playground:* npm start开始。


<!-- Let's place the following Dockerfile at the root of the project:-->
 让我们把下面的Docker文件放在项目的根目录下。

```Dockerfile
FROM node:16

WORKDIR /usr/src/app

COPY . .

CMD DEBUG=playground:* npm start
```

<!-- Let's build the image from the Dockerfile with a command, _docker build -t express-server ._ and run it with _docker run -p 3123:3000 express-server_. The _-p_ flag will inform Docker that a port from the host machine should be opened and directed to a port in the container. The format for is _-p host-port:application-port_.-->
 让我们用_docker build -t express-server ._的命令从Docker文件中构建镜像，然后用_docker run -p 3123:3000 express-server_运行它。_-p_标志将通知Docker，主机上的一个端口应该被打开并指向容器中的一个端口。其格式是_-p host-port:application-port_。

```bash
$ docker run -p 3123:3000 express-server

> playground@0.0.0 start
> node ./bin/www

Tue, 29 Jun 2021 10:55:10 GMT playground:server Listening on port 3000
```

<!-- > If yours doesn't work, skip to the next section. There is an explanation why it may not work even if you followed the steps correctly.-->
 > 如果你的标记不起作用，跳到下一节。这里有一个解释，为什么即使你正确地遵循了这些步骤，它也可能不工作。

<!-- The application is now running! Let's test it by sending a GET request to [http://localhost:3123/](http://localhost:3123/).-->
 应用现在正在运行!让我们通过向[http://localhost:3123/](http://localhost:3123/)发送一个GET请求来测试它。

<!-- Shutting it down is a headache at the moment. Use another terminal and _docker kill_ command to kill the application. The _docker kill_ will send a kill signal (SIGKILL) to the application to force it to shut down. It needs the name or id of the container as an argument.-->
 目前，关闭它是一个令人头痛的问题。使用另一个终端和_docker kill_命令来杀死这个应用。_docker kill_将向应用发送一个杀戮信号（SIGKILL），迫使它关闭。它需要容器的名称或ID作为参数。

<!-- By the way, when using id as the argument, the beginning of the ID is enough for Docker to know which container we mean.-->
 顺便说一下，当使用id作为参数时，ID的开头足以让Docker知道我们指的是哪个容器。

```bash
$ docker container ls
  CONTAINER ID   IMAGE            COMMAND                  CREATED         STATUS         PORTS                                       NAMES
  48096ca3ffec   express-server   "docker-entrypoint.s…"   9 seconds ago   Up 6 seconds   0.0.0.0:3123->3000/tcp, :::3123->3000/tcp   infallible_booth

$ docker kill 48
  48
```

<!-- In the future, let's use the same port on both sides of _-p_. Just so we don't have to remember which one we happened to choose.-->
 在未来，让我们在_-p_的两边使用相同的端口。这样我们就不必记住我们碰巧选择了哪一个。

#### Fixing potential issues we created by copy-pasting

<!-- There are a few steps we need to change to create a more comprehensive Dockerfile. It may even be that the above example doesn't work in all cases because we skipped an important step.-->
 为了创建一个更全面的Docker文件，我们需要改变几个步骤。甚至可能因为我们跳过了一个重要的步骤，上面的例子并不是在所有情况下都有效。

<!-- When we ran npm install on our machine, in some cases **node package manager** may install operating system specific dependencies during the install step. We may accidentally move non-functional parts to the image with the COPY instruction. This can easily happen if we copy the <i>node_modules</i> directory into the image.-->
当我们在机器上运行npm安装时，在某些情况下，**节点包管理器**可能会在安装步骤中安装操作系统的特定依赖。我们可能会不小心用COPY指令将非功能性的部分转移到镜像中。如果我们把<i>node_modules</i>目录复制到镜像中，这很容易发生。

<!-- This is a critical thing to keep in mind when we build our images. It's best to do most things, such as to run _npm install_ during the build process <i>inside the container</i> rather than doing those prior to building. The easy rule of thumb is to only copy files that you would push to GitHub. Build artefacts or dependencies should not be copied since those can be installed during the build process.-->
 当我们建立镜像时，这是一个需要记住的关键问题。最好是在构建过程中做大多数事情，比如在容器内运行_npm install_，而不是在构建前做这些事情。简单的经验法则是，只复制你要推送到GitHub的文件。构建工件或依赖关系不应该被复制，因为它们可以在构建过程中被安装。

<!-- We can use <i>.dockerignore</i> to solve the problem. The file .dockerignore is very similar to .gitignore, you can use that to prevent unwanted files from being copied to your image. The file should be placed next to the Dockerfile. Here is a possible content of a <i>.dockerignore</i>-->
 我们可以使用<i>.dockerignore</i>来解决这个问题。.dockerignore这个文件与.gitignore非常相似，你可以用它来防止不需要的文件被复制到你的镜像中。该文件应该放在Dockerfile的旁边。下面是一个可能的<i>.dockerignore</i>的内容

```
.dockerignore
.gitignore
node_modules
Dockerfile
```

<!-- However, in our case the .dockerignore isn't the only thing required. We will need to install the dependencies during the build step. The _Dockerfile_ changes to:-->
 然而，在我们的案例中，.dockerignore并不是唯一需要的东西。我们将需要在构建步骤中安装依赖项。_Dockerfile_改变为。

```Dockerfile
FROM node:16

WORKDIR /usr/src/app

COPY . .

RUN npm install # highlight-line

CMD DEBUG=playground:* npm start
```

<!-- The npm install can be risky. Instead of using npm install, npm offers a much better tool for installing dependencies, the _ci_ command.-->
 npm的安装可能会有风险。与其使用npm install，npm提供了一个更好的安装依赖项的工具，即_ci_命令。

<!-- Differences between ci and install:-->
 ci和install之间的区别。

<!-- - install may update the package-lock.json-->
 - install可能会更新package-lock.json
<!-- - install may install a different version of a dependency if you have ^ or ~ in the version of the dependency.-->
 - install 可能会安装不同版本的依赖关系，如果你在依赖关系的版本里有 ^ 或 ~。

<!-- - ci will delete the node_modules folder before installing anything-->
 - 在安装任何东西之前，ci会删除node_modules文件夹
<!-- - ci will follow the package-lock.json and does not alter any files-->
 - ci将遵循package-lock.json，不改变任何文件。

<!-- So in short: _ci_ creates reliable builds, while _install_ is the one to use when you want to install new dependencies.-->
 所以简而言之：_ci_创建可靠的构建，而_install_是在你想安装新的依赖时使用的。

<!-- As we are not installing anything new during the build step, and we don't want the versions to suddenly change, we will use _ci_:-->
 由于我们在构建步骤中没有安装任何新的东西，而且我们不希望版本突然改变，我们将使用_ci_。

```Dockerfile
FROM node:16

WORKDIR /usr/src/app

COPY . .

RUN npm ci # highlight-line

CMD DEBUG=playground:* npm start
```

<!-- Even better, we can use _npm ci --only=production_ to not waste time installing development dependencies.-->
 甚至更好的是，我们可以使用_npm ci --only=production_来不浪费时间安装开发依赖。

<!-- > As you noticed in the comparison list; npm ci will delete the node_modules folder so creating the .dockerignore did not matter. However, .dockerignore is an amazing tool when you want to optimize your build process. We will talk briefly about these optimizations later.-->
 > 正如你在对比列表中注意到的；npm ci会删除node_modules文件夹，所以创建.dockerignore并不重要。然而，当你想优化你的构建过程时，.dockerignore是一个了不起的工具。我们将在后面简要地谈一谈这些优化。

<!-- Now the Dockerfile should work again, try it with _docker build -t express-server . && docker run -p 3000:3000 express-server_-->
 现在Docker文件应该又能工作了，用_docker build -t express-server . && docker run -p 3000:3000 express-server_试试。

<!-- > Note that we are here chaining two bash commands with &&. We could get (nearly) the same effect by running both commands separately. When chaining commands with && if one command fails, the next ones in the chain will not be executed.-->
 > 注意，我们在这里用&&连接了两个bash命令。我们可以通过单独运行这两个命令来获得（几乎）同样的效果。当用&&串联命令时，如果一个命令失败了，串联中的下一个命令将不会被执行。

<!-- We set an environment variable _DEBUG=playground:*_ during CMD for the npm start. However, with Dockerfiles we could also use the instruction ENV to set environment variables. Let's do that:-->
 我们在CMD中为npm启动设置了一个环境变量_DEBUG=playground:*_。然而，通过Dockerfiles，我们也可以使用指令ENV来设置环境变量。让我们这么做吧。

```Dockerfile
FROM node:16

WORKDIR /usr/src/app

COPY . .

RUN npm ci

ENV DEBUG=playground:* # highlight-line

CMD npm start # highlight-line
```

<!-- > <i>If you're wondering what the DEBUG environment variable does, read [here](http://expressjs.com/en/guide/debugging.html#debugging-express).</i>-->
 > <i>如果你想知道DEBUG环境变量的作用，请阅读[这里](http://expressjs.com/en/guide/debugging.html#debugging-express)。</i>。

#### Dockerfile best practices

<!-- There are 2 rules of thumb you should follow when creating images:-->
 在创建图像时，你应该遵循两条经验法则。

<!-- - Try to create as **secure** of an image as possible-->
 - 尽量创建一个**安全的**的图像
<!-- - Try to create as **small** of an image as possible-->
 - 尽量创造一个**小的图像

<!-- Smaller images are more secure by having less attack surface area, and smaller images also move faster in deployment pipelines.-->
 较小的映像由于具有较少的攻击表面积而更加安全，较小的映像在部署管道中也移动得更快。

<!-- Snyk has a great list of 10 best practices for node/express containerization. Read those [here](https://snyk.io/blog/10-best-practices-to-containerize-nodejs-web-applications-with-docker/).-->
 Snyk有一个伟大的清单，列出了节点/表达式容器化的10个最佳实践。阅读这些[这里](https://snyk.io/blog/10-best-practices-to-containerize-nodejs-web-applications-with-docker/)。

<!-- One big carelessness we have left is running the application as root instead of using a user with lower privileges. Let's do a final fix to the Dockerfile:-->
 我们还有一个很大的疏忽，就是以root身份运行应用，而不是使用一个权限较低的用户。让我们对Docker文件做一个最后的修正。

```Dockerfile
FROM node:16

WORKDIR /usr/src/app

COPY --chown=node:node . .  # highlight-line

RUN npm ci

ENV DEBUG=playground:*

USER node # highlight-line

CMD npm start
```

</div>

<div class="tasks">

### Exercise 12.5.

#### Exercise 12.5: Containerizing a Node application

<!-- The repository you cloned or copied in the first exercise contains a todo-app. See the todo-app/todo-backend and read through the README. We will not touch the todo-frontend yet.-->
 你在第一个练习中克隆或复制的仓库包含一个todo-app。请看todo-app/todo-backend并通读README。我们暂时不碰todo-frontend。

<!-- Step 1. Containerize the todo-backend by creating a <i>todo-app/todo-backend/Dockerfile</i> and building an image.-->
 步骤1.通过创建一个<i>todo-app/todo-backend/Dockerfile</i>和构建一个镜像，将todo-backend容器化。

<!-- Step 2. Run the todo-backend image with the correct ports open. Make sure the visit counter increases when used through a browser in http://localhost:3000/ (or some other port if you configure so)-->
 第2步。在打开正确的端口的情况下运行todo-backend镜像。确保通过浏览器使用 http://localhost:3000/ （或其他端口，如果你这样配置）时，访问计数器会增加。

<!-- Tip: Run the application outside of a container to examine it before starting to containerize.-->
 提示。在开始容器化之前，在容器外运行应用来检查它。

</div>

<div class="content">

### Using docker-compose

<!-- In the previous section, we created express-server and knew that it runs in port 3000, and ran it with _docker build -t express-server . && docker run -p 3000:3000 express-server_. This already looks like something you would need to put into a script to remember. Fortunately, Docker offers us a better solution.-->
 在上一节中，我们创建了express-server，并知道它在3000端口运行，然后用_docker build -t express-server . && docker run -p 3000:3000 express-server_运行它。这看起来已经是你需要放到脚本中去记忆的东西了。幸运的是，Docker为我们提供了一个更好的解决方案。

<!-- [Docker-compose](https://docs.docker.com/compose/) is another fantastic tool, which can help us manage containers. Let's start using docker-compose as we learn more about containers as it will help us save some time with the configuration.-->
 [Docker-compose](https://docs.docker.com/compose/)是另一个神奇的工具，它可以帮助我们管理容器。让我们开始使用docker-compose，因为它可以帮助我们节省一些配置的时间，当我们学习更多关于容器的知识。

<!-- Install the docker-compose tool from this link: [https://docs.docker.com/compose/install/](https://docs.docker.com/compose/install/).-->
 从这个链接安装docker-compose工具： [https://docs.docker.com/compose/install/](https://docs.docker.com/compose/install/)

<!-- Let's check that it works:-->
 让我们检查一下它是否工作。

```bash
$ docker-compose -v
docker-compose version 1.29.2, build 5becea4c
```

<!-- And now we can turn the previous spell into a yaml file. The best part about yaml files is that you can save these to a Git repository!-->
 现在我们可以把之前的咒语变成一个yaml文件。关于yaml文件最好的部分是你可以把这些文件保存到Git仓库里

<!-- Create file **docker-compose.yml** and place it at the root of the project, next to the Dockerfile. The file content is-->
 创建文件**docker-compose.yml**，并把它放在项目的根目录下，紧挨着Docker文件。该文件内容为

```yaml
version: '3.8'            # Version 3.8 is quite new and should work

services:
  app:                    # The name of the service, can be anything
    image: express-server # Declares which image to use
    build: .              # Declares where to build if image is not found
    ports:                # Declares the ports to publish
      - 3000:3000
```

<!-- The meaning of each line is explained as a comment. If you want to see the full specification see the [documentation](https://docs.docker.com/compose/compose-file/compose-file-v3/).-->
 每一行的含义都以注释的形式解释。如果你想看到完整的规范，请看[文档](https://docs.docker.com/compose/compose-file/compose-file-v3/)。

<!-- Now we can use _docker-compose up_ to build and run the application. If we want to rebuild the images we can use _docker-compose up --build_.-->
 现在我们可以使用_docker-compose up_来构建和运行该应用。如果我们想重建图像，可以使用_docker-compose up --build_。

<!-- You can also run the application in the background with _docker-compose up -d_ (_-d_ for detached) and close it with _docker-compose down_.-->
 你也可以用_docker-compose up -d_ (_-d_表示分离)在后台运行应用，用_docker-compose down_关闭它。

<!-- Creating files like this that <i>declare</i> what you want instead of script files that you need to run in a specific order / a specific number of times is often a great practice.-->
 创建像这样的文件，<i>声明</i>你想要的东西，而不是你需要按特定顺序/特定次数运行的脚本文件，通常是一个很好的做法。

</div>

<div class="tasks">

### Exercise 12.6.

#### Exercise 12.6: docker-compose

<!-- Create a <i>todo-app/todo-backend/docker-compose.yml</i> file that works with the node application from the previous exercise.-->
 创建一个<i>todo-app/todo-backend/docker-compose.yml</i>文件，与之前练习中的节点应用一起使用。

<!-- The visit counter is the only feature that is required to be working.-->
 访问计数器是唯一需要工作的功能。

</div>

<div class="content">

### Utilizing containers in development

<!-- When you are developing software, containerization can be used in various ways to improve your quality of life. One of the most useful cases is by bypassing the need to install and configure tools twice.-->
 当你在开发软件时，容器化可以用各种方式来提高你的生活质量。最有用的情况之一是绕过了两次安装和配置工具的需要。

<!-- It may not be the best option to move your entire development environment into a container, but if that's what you want it's possible. We will revisit this idea at the end of this part. But until then, <i>run the node application itself outside of containers</i>.-->
 把你的整个开发环境移到一个容器中可能不是最好的选择，但如果这是你想要的，那是可行的。我们将在本章节的最后重新审视这个想法。但在那之前，<i>在容器之外运行node应用本身</i>。

<!-- The application we met in the previous exercises uses MongoDB. Let's explore [Docker Hub](https://hub.docker.com/) to find a MongoDB image. Docker Hub is the default place where Docker pulls the images from, you can use other registries as well, but since we are already knee-deep in Docker it's a good choice. With a quick search, we can find [https://hub.docker.com/_/mongo](https://hub.docker.com/_/mongo)-->
 我们在前面的练习中遇到的应用使用MongoDB。让我们探索[Docker Hub](https://hub.docker.com/)，找到一个MongoDB镜像。Docker Hub是Docker拉取镜像的默认地点，你也可以使用其他注册表，但由于我们已经深入到Docker中，所以这是一个不错的选择。通过快速搜索，我们可以找到[https://hub.docker.com/_/mongo](https://hub.docker.com/_/mongo)

<!-- Create a new yaml called <i>todo-app/todo-backend/docker-compose.dev.yml</i> that looks like following:-->
 创建一个新的yaml，名为<i>todo-app/todo-backend/docker-compose.dev.yml</i>，看起来如下。

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

<!-- The meaning of the two first environment variables defined above is explained on the Docker Hub page:-->
 上面定义的两个第一环境变量的含义在Docker Hub页面上有解释。

<!-- > <i>These variables, used in conjunction, create a new user and set that user's password. This user is created in the admin authentication database and given the role of root, which is a "superuser" role.</i>-->
 > <i>这些变量结合起来使用，可以创建一个新的用户并设置该用户的密码。这个用户在管理员认证数据库中被创建，并被赋予root的角色，这是一个 "超级用户 "角色。</i>

<!-- The last environment variable *MONGO\_INITDB\_DATABASE* will tell MongoDB to create a database with that name.-->
 最后一个环境变量*MONGO\_INITDB\_DATABASE*将告诉MongoDB以该名称创建一个数据库。

<!-- You can use _-f_ flag to specify a <i>file</i> to run the Docker Compose command with e.g. _docker-compose -f docker-compose.dev.yml up_. Now that we may have multiple it's useful.-->
你可以使用_-f_标志来指定一个<i>文件</i>来运行Docker Compose命令，例如：_docker-compose -f docker-compose.dev.yml up_。现在，我们可能有多个它's useful.

<!-- Now start the MongoDB with _docker-compose -f docker-compose.dev.yml up -d_. With _-d_ it will run it in the background. You can view the output logs with _docker-compose -f docker-compose.dev.yml logs -f_. There the _-f_ will ensure we <i>follow</i> the logs.-->
 现在用_docker-compose -f docker-compose.dev.yml up -d_启动MongoDB。使用_-d_，它将在后台运行。你可以用_docker-compose -f docker-compose.dev.yml logs -f_查看输出日志。那里的_-f_将确保我们<i>遵循</i>日志。

<!-- As said previously, currently we <strong>do not</strong> want to run the Node application inside a container. Developing while the application itself is inside a container is a challenge. We will explore that option in the later in this part.-->
 如前所述，目前我们<strong>不</strong>想在容器中运行Node应用。在应用本身处于容器内时进行开发是一个挑战。我们将在本章节的后面探讨这个选项。

<!-- Run the good old _npm install_ first on your machine to set up the Node application. Then start the application with the relevant environment variable. You can modify the code to set them as the defaults or use the .env file. There is no hurt in putting these keys to GitHub since they are only used in your local development environment. I'll just throw them in with the _npm run dev_ to help you copy-paste.-->
 首先在你的机器上运行老式的_npm install_来设置Node应用。然后用相关的环境变量启动应用。你可以修改代码，将它们设置为默认值，或者使用.env文件。把这些密钥放到GitHub上没有什么坏处，因为它们只在你的本地开发环境中使用。我只是把它们和_npm run dev_放在一起，帮助你复制粘贴。

```bash
$ MONGO_URL=mongodb://localhost:3456/the_database npm run dev
```

<!-- This won't be enough; we need to create a user to be authorized inside of the container. The url http://localhost:3000/todos leads to an authentication error:-->
 这还不够，我们需要创建一个用户，以便在容器中获得授权。url http://localhost:3000/todos 导致了一个认证错误。

```bash
[nodemon] 2.0.12
[nodemon] to restart at any time, enter `rs`
[nodemon] watching path(s): *.*
[nodemon] watching extensions: js,mjs,json
[nodemon] starting `node ./bin/www`
(node:37616) UnhandledPromiseRejectionWarning: MongoError: command find requires authentication
    at MessageStream.messageHandler (/Users/mluukkai/opetus/docker-fs/container-app/express-app/node_modules/mongodb/lib/cmap/connection.js:272:20)
    at MessageStream.emit (events.js:314:20)
```

### Bind mount and initializing the database

<!-- In the [MongoDB Docker Hub](https://hub.docker.com/_/mongo) page under "Initializing a fresh instance" is the info on how to execute JavaScript to initialize the database and an user for it.-->
 在[MongoDB Docker Hub](https://hub.docker.com/_/mongo)页面的 "初始化一个新实例 "下有关于如何执行JavaScript来初始化数据库和用户的信息。

<!-- The exercise project has file <i>todo-app/todo-backend/mongo/mongo-init.js</i> with contents:-->
 练习项目有文件<i>todo-app/todo-backend/mongo/mongo-init.js</i>，内容如下。

```js
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

<!-- This file will initialize the database with a user and a few todos. Next, we need to get it inside the container at startup.-->
 这个文件将用一个用户和一些todos来初始化数据库。接下来，我们需要在启动时将其放入容器中。

<!-- We could create a new image FROM mongo and COPY the file inside, or we can use a <i>bind mount</i> to mount the file <i>mongo-init.js</i> to the container. Let's do the latter.-->
 我们可以创建一个新的镜像 FROM mongo 并将文件复制到里面，或者我们可以使用 <i>bind mount</i> 将文件 <i>mongo-init.js</i> 挂到容器中。让我们来做后者。

<!-- Bind mount is the act of binding a file on the host machine to a file in the container. We could add a _-v_ flag with _container run_. The syntax is _-v FILE-IN-HOST:FILE-IN-CONTAINER_. Since we already learned about Docker Compose let's skip that. The bind mount is declared under key <i>volumes</i> in docker-compose. Otherwise the format is the same, first host and then container:-->
 绑定挂载是将主机上的文件与容器中的文件绑定的行为。我们可以用_container run_添加一个_-v_标志。语法是_-v FILE-IN-HOST:FILE-IN-CONTAINER_。因为我们已经学习了Docker Compose，所以我们跳过这个。绑定挂载在docker-compose的<i>volumes</i>键下声明。否则格式是一样的，先是主机，然后是容器。

```yml
  mongo:
    image: mongo
    ports:
     - 3456:27017
    environment:
      MONGO_INITDB_ROOT_USERNAME: root
      MONGO_INITDB_ROOT_PASSWORD: example
      MONGO_INITDB_DATABASE: the_database
      # highlight-start
    volumes:
      - ./mongo/mongo-init.js:/docker-entrypoint-initdb.d/mongo-init.js
      # highlight-end
```

<!-- The result of the bind mount is that the file <i>mongo-init.js</i> in the mongo folder of the host machine is the same as the <i>mongo-init.js</i> file in the container's /docker-entrypoint-initdb.d directory. Changes to either file will be available in the other. We don't need to make any changes during runtime. But this will be the key to software development in containers.-->
 绑定挂载的结果是，主机的mongo文件夹中的文件<i>mongo-init.js</i>与容器的/docker-entrypoint-initdb.d目录中的<i>mongo-init.js</i>文件相同。对任何一个文件的修改都可以在另一个文件中使用。我们不需要在运行时做任何改变。但这将是在容器中开发软件的关键。

<!-- Run _docker-compose -f docker-compose.dev.yml down --volumes_ to ensure that nothing is left and start from a clean slate with _docker-compose -f docker-compose.dev.yml up_ to initialize the database.-->
 运行_docker-compose -f docker-compose.dev.yml down --volumes_以确保没有任何东西被留下，然后用_docker-compose -f docker-compose.dev.yml up_从一张白纸开始初始化数据库。

<!-- If you see an error like this:-->
 如果你看到类似这样的错误。

```bash
mongo_database | failed to load: /docker-entrypoint-initdb.d/mongo-init.js
mongo_database | exiting with code -3
```

<!-- you may have a read permission problem. They are not uncommon when dealing with volumes. In the above case, you can use _chmod a+r mongo-init.js_, which will give everyone read access to that file. Be careful when using _chmod_ since granting more privileges can be a security issue. Use the _chmod_ only on the mongo-init.js on your computer.-->
 你可能有一个读取权限问题。在处理卷的时候，它们并不罕见。在上述情况下，你可以使用_chmod a+r mongo-init.js_，这将给予每个人对该文件的读取权限。使用_chmod_时要小心，因为授予更多的权限可能是一个安全问题。只在你电脑上的mongo-init.js上使用_chmod_。

<!-- Now starting the express application with the correct environment variable should work:-->
 现在用正确的环境变量启动Express应用应该可以了。

```bash
$ MONGO_URL=mongodb://the_username:the_password@localhost:3456/the_database npm run dev
```

<!-- Let's check that the http://localhost:3000/todos returns all todos. It should return the two todos we initialized. We can and should use Postman to test the basic functionality of the app, such as adding or deleting a todo.-->
 让我们检查一下 http://localhost:3000/todos 是否返回所有的 todos。它应该返回我们初始化的两个todos。我们可以而且应该使用Postman来测试应用的基本功能，比如添加或删除一个todos。

### Persisting data with volumes

<!-- By default, containers are not going to preserve our data. When you close the mongo container you may or may not be able to get the data back.-->
 默认情况下，容器是不会保存我们的数据的。当你关闭mongo容器时，你可能会也可能不会拿回数据。

<!-- This is a rare case in which it does preserve the data as the developers who made the Docker image for Mongo have defined a volume to be used: [https://github.com/docker-library/mongo/blob/cb8a419053858e510fc68ed2d69415b3e50011cb/4.4/Dockerfile#L113](https://github.com/docker-library/mongo/blob/cb8a419053858e510fc68ed2d69415b3e50011cb/4.4/Dockerfile#L113) This line will instruct Docker to preserve the data in those directories.-->
这是一种罕见的情况，它确实保留了数据，因为为Mongo制作Docker镜像的开发者已经定义了一个要使用的卷。[https://github.com/docker-library/mongo/blob/cb8a419053858e510fc68ed2d69415b3e50011cb/4.4/Dockerfile#L113](https://github.com/docker-library/mongo/blob/cb8a419053858e510fc68ed2d69415b3e50011cb/4.4/Dockerfile#L113) 这一行将指示Docker保留这些目录中的数据。

<!-- There are two distinct methods to store the data:-->
 有两种不同的方法来存储数据。
<!-- - Declaring a location in your filesystem (called bind mount)-->
 - 在你的文件系统中声明一个位置(称为绑定挂载)
<!-- - Letting Docker decide where to store the data (volume)-->
 - 让Docker决定存储数据的位置（卷）。

<!-- I prefer the first choice in most cases whenever you <i>really</i> need to avoid deleting the data. Let's see both in action with docker-compose:-->
 在大多数情况下，只要你<i>真的</i>需要避免删除数据，我更喜欢第一种选择。让我们看看这两种方式在docker-compose中的应用。

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
    volumes:
      - ./mongo/mongo-init.js:/docker-entrypoint-initdb.d/mongo-init.js
      - ./mongo_data:/data/db # highlight-line
```

<!-- The above will create a directory called *mongo\_data* to your local filesystem and map it into the container as _/data/db_. This means the data in _/data/db_ is stored outside of the container but still accessible by the container! Just remember to add the directory to .gitignore.-->
 上面将在你的本地文件系统中创建一个名为*mongo/data*的目录，并将其映射到容器中的_/data/db_。这意味着_/data/db_中的数据被存储在容器之外，但仍然可以被容器访问!只要记得把这个目录添加到.gitignore中。

<!-- A similar outcome can be achieved with a named volume:-->
 类似的结果也可以用一个命名的卷来实现。

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
    volumes:
      - ./mongo/mongo-init.js:/docker-entrypoint-initdb.d/mongo-init.js
      - mongo_data:/data/db # highlight-line

volumes:
  mongo_data:
```

<!-- Now the volume is created but managed by Docker. After starting the application (_docker-compose -f docker-compose.dev.yml up_) you can list the volumes with _docker volume ls_, inspect one of them with _docker volume inspect_ and even delete them with _docker volume rm_. It's still stored in your local filesystem but figuring out <i>where</i> may not be as trivial as with the previous option.-->
 现在卷被创建，但由Docker管理。启动应用（_docker-compose -f docker-compose.dev.yml up_）后，你可以用_docker volume ls_列出卷，用_docker volume inspect_检查其中一个，甚至用_docker volume rm_删除它们。它仍然存储在你的本地文件系统中，但找出<i>哪里</i>可能不像以前的选项那样简单。

</div>

<div class="tasks">

### Exercise 12.7.

#### Exercise 12.7: Little bit of MongoDB coding

<!-- Note that this exercise assumes that you have done all the configurations made in material after the exercise 12.5. You should still run the todo-app backend <i>outside a container</i> just the MongoDB is containerized for now.-->
 注意，这个练习假定你已经完成了练习12.5之后的材料中的所有配置。你仍然应该在容器外运行todo-app后端<i></i>，只是MongoDB暂时被容器化。

<!-- The todo application has no proper implementation of routes for getting one todo (GET <i>/todos/:id</i>) and updating one todo (PUT <i>/todos/:id</i>). Fix the code.-->
 todo应用没有正确实现获取一个todo（GET <i>/todos/:id</i>）和更新一个todo（PUT <i>/todos/:id</i>）的路由。修复代码。

</div>

<div class="content">

### Debugging issues in containers

<!-- > <i>When coding, you most likely end up in a situation where everything is broken.</i>-->
 > <i>在编码时，你很可能最终陷入一切都被破坏的境地。</i>。

<!-- > \- Matti Luukkainen-->
 > `- Matti Luukkainen

<!-- When developing with containers, we need to learn new tools for debugging since we can not just "console.log" everything. When code has a bug, you may often be in a state where at least something works so you can work forward from that. Configuration most often is in either of the two states: 1. working or 2. broken. We will go over a few tools that can help when your application is in the latter state.-->
 当使用容器开发时，我们需要学习新的调试工具，因为我们不能只是 "console.log "一切。当代码出现错误时，你可能经常处于这样一种状态，即至少有一些东西在工作，所以你可以从那里继续工作。配置最经常处于两种状态中的一种。1.工作或2.损坏。我们将介绍一些工具，当你的应用处于后一种状态时，它们可以提供帮助。

<!-- When developing software, you can safely progress step by step, all the time verifying that what you have coded behaves as expected. Often, this is not the case when doing configurations. The configuration you may be writing can be broken until the moment it is finished. So when you write a long docker-compose.yml or Dockerfile and it does not work, you need to take a moment and think about the various ways you could confirm something is working.-->
 当开发软件时，你可以安全地一步一步地前进，一直验证你所编码的东西是否符合预期。通常，在做配置的时候，情况并非如此。你所写的配置可能在完成的那一刻才会被破坏。因此，当你写了很长的docker-compose.yml或Dockerfile而它没有工作时，你需要花点时间，想一想你可以通过各种方式来确认某些东西是否工作。

<i>Question Everything</i> is still applicable here. As said in [part 3](/en/part3/saving_data_to_mongo_db): The key is to be systematic. Since the problem can exist anywhere, <i>you must question everything</i>, and eliminate all possible sources of error one by one.

<!-- For myself, the most valuable method of debugging is stopping and thinking about what I'm trying to accomplish instead of just bashing my head at the problem. Often there is a simple, alternate, solution or quick google search that will get me moving forward.-->
 对我自己来说，最有价值的调试方法是停下来思考我想完成的任务，而不是一味地对着问题乱撞。通常情况下，有一个简单的、备用的解决方案或快速的谷歌搜索会让我继续前进。

#### exec

<!-- The Docker command [exec](https://docs.docker.com/engine/reference/commandline/exec/) is a heavy hitter. It can be used to jump right into a container when it's running.-->
 Docker命令[exec](https://docs.docker.com/engine/reference/commandline/exec/)是一个重击手。它可以用来在一个容器运行时直接跳入它。

<!-- Let's start a web server in the background and do a little bit of debugging to get it running and displaying the message "Hello, exec!" in our browser. Let's choose [Nginx](https://www.nginx.com/) which is, among other things, a server capable of serving static HTML files. It has a default index.html that we can replace.-->
 让我们在后台启动一个Web服务器，做一点调试，让它运行并在浏览器中显示 "Hello, exec!"的信息。让我们选择[Nginx](https://www.nginx.com/)，除此之外，它是一个能够提供静态HTML文件的服务器。它有一个默认的index.html，我们可以替换它。

```bash
$ docker container run -d nginx
```

<!-- Ok, now the questions are:-->
 好的，现在的问题是。

<!-- - Where should we go with our browser?-->
 - 我们的浏览器应该去哪里？
<!-- - Is it even running?-->
 -它甚至在运行吗？

<!-- We know how to answer the latter: by listing the running containers.-->
 我们知道如何回答后者：通过列出运行中的容器。

```bash
$ docker container ls
CONTAINER ID   IMAGE           COMMAND                  CREATED              STATUS                      PORTS     NAMES
3f831a57b7cc   nginx           "/docker-entrypoint.…"   About a minute ago   Up About a minute           80/tcp    keen_darwin
```

<!-- Yes! We got the first question answered as well. It seems to listen on port 80, as seen on the output above.-->
 是的!我们也得到了第一个问题的答案。从上面的输出中可以看出，它似乎是在监听80端口。

<!-- Let's shut it down and restart with the _-p_ flag to have our browser access it.-->
 让我们把它关闭，然后用_-p_标志重新启动，让我们的浏览器访问它。

```bash
$ docker container stop keen_darwin
$ docker container rm keen_darwin

$ docker container run -d -p 8080:80 nginx
```

<!-- Let's look at the app by going to http://localhost:8080. It seems the app is showing the wrong message! Let's hop right into the container and fix the it. Keep your browser open, we won't need to shut down the container for this fix. We will execute bash inside the container, the flags _-it_ will ensure that we can interact with the container:-->
 让我们到http://localhost:8080，看看这个应用。看来这个应用显示了错误的信息!让我们直接跳到容器中去，解决这个问题。保持你的浏览器打开，我们不需要为这个修复而关闭容器。我们将在容器中执行bash，标志_-it_将确保我们能与容器进行交互。

```bash
$ docker container ls
CONTAINER ID   IMAGE     COMMAND                  CREATED              STATUS              PORTS                                   NAMES
7edcb36aff08   nginx     "/docker-entrypoint.…"   About a minute ago   Up About a minute   0.0.0.0:8080->80/tcp, :::8080->80/tcp   wonderful_ramanujan

$ docker exec -it wonderful_ramanujan bash
root@7edcb36aff08:/#
```

<!-- Now that we are in, we need to find the faulty file and replace it. Quick Google tells us that file itself is _/usr/share/nginx/html/index.html_.-->
 现在我们已经进入了，我们需要找到有问题的文件并替换它。快速的谷歌告诉我们这个文件本身是_/usr/share/nginx/html/index.html_。

<!-- Let's move to the directory and delete the file-->
 让我们移动到该目录并删除该文件

```bash
root@7edcb36aff08:/# cd /usr/share/nginx/html/
root@7edcb36aff08:/# rm index.html
```

<!-- Now, if we go to http://localhost:8080/ we know that we deleted the correct file. The page shows 404. Let's replace it with one containing the correct contents:-->
 现在，如果我们去http://localhost:8080/，我们知道我们删除了正确的文件。该页面显示404。让我们用一个包含正确内容的文件来替换它。

```bash
root@7edcb36aff08:/# echo "Hello, exec!" > index.html
```

<!-- Refresh the page, and our message is displayed! Now we know how exec can be used to interact with the containers. Remember that all of the changes are lost when the container is deleted. To preserve the changes, you must use _commit_ just as we did in [previous section](/en/part12/introduction_to_containers#other-docker-commands).-->
 刷新页面，我们的信息就显示出来了!现在我们知道exec是如何被用来与容器交互的。记住，当容器被删除时，所有的变化都会丢失。为了保留这些变化，你必须使用_commit_，就像我们在[上一节](/en/part12/introduction_to_containers#other-docker-commands)中所做的那样。

</div>

<div class="tasks">

### Exercise 12.8.

#### Exercise 12.8: Mongo command-line interface

<!-- > Use _script_ to record what you do, save the file as script-answers/exercise12_8.txt-->
 > 使用_script_来记录你所做的事情，将文件保存为script-answers/exercise12_8.txt

<!-- While the MongoDB from the previous exercise is running, access the database with mongo command-line interface (CLI). You can do that using docker exec. Then add a new todo using the CLI.-->
 当前面练习中的MongoDB在运行时，用mongo命令行界面（CLI）访问该数据库。你可以用docker exec来做。然后用CLI添加一个新的todo。

<!-- The command to open CLI when inside the container is _mongo_-->
 在容器内打开CLI的命令是_mongo_。

<!-- The mongo CLI will require the username and password flags to authenticate correctly. Flags _-u root -p example_ should work, the values are from the docker-compose.dev.yml.-->
 mongo CLI将需要用户名和密码标志来正确认证。标志_-u root -p example_应该可以，这些值来自docker-compose.dev.yml。

<!-- * Step 1: Run MongoDB-->
 * 第一步：运行MongoDB
<!-- * Step 2: Use docker exec to get inside the container-->
 * 第2步：使用docker exec来进入容器内部
<!-- * Step 3: Open mongo cli-->
 * 第3步：打开mongo cli。

<!-- When you have connected to the mongo cli you can ask it to show dbs inside:-->
 当你连接到mongo cli，你可以要求它显示里面的dbs。

```bash
> show dbs
admin         0.000GB
config         0.000GB
local         0.000GB
the_database  0.000GB
```

<!-- To access the correct database:-->
 要访问正确的数据库。

```bash
> use the_database
```

<!-- And finally to find out the collections:-->
 最后要找出数据库的集合。

```bash
> show collections
todos
```

<!-- We can now access the data in those collections:-->
 我们现在可以访问这些集合中的数据。

```bash
> db.todos.find({})
{ "_id" : ObjectId("611e54b688ddbb7e84d3c46b"), "text" : "Write code", "done" : true }
{ "_id" : ObjectId("611e54b688ddbb7e84d3c46c"), "text" : "Learn about containers", "done" : false }
```

<!-- Insert one new todo with the text: "Increase the number of tools in my toolbelt" with status done as false. Consult the [documentation](https://docs.mongodb.com/v4.4/reference/method/db.collection.insertOne/#mongodb-method-db.collection.insertOne) to see how the addition is done.-->
 插入一个新的todo，内容为"增加我的工具带中的工具数量"，完成状态为假。请参考[文档](https://docs.mongodb.com/v4.4/reference/method/db.collection.insertOne/#mongodb-method-db.collection.insertOne)以了解如何增加。

<!-- Ensure that you see the new todo both in the Express app and when querying from Mongo CLI.-->
 确保你在Express应用中和从Mongo CLI查询时都能看到这个新的todo。

</div>

<div class="content">

### Redis

<!-- [Redis](https://redis.io/) is a [key-value](https://redis.com/nosql/key-value-databases/) database. In contrast to eg. MongoDB the data stored to a key-value storage has a bit less structure, there are eg. no collections or tables, it just contains junks of data that can be fetched based on the <i>key</i> that was attached to the data  (the <i>value</i>).-->
 [Redis](https://redis.io/)是一个[key-value](https://redis.com/nosql/key-value-databases/)数据库。与MongoDB相比，存储在键值存储中的数据结构较少，例如没有集合或表，它只包含一些数据，可以根据附加在数据上的<i>key</i>（<i>value</i>）来获取。

<!-- By default Redis works <i>in-memory</i>, which means that it does not store data persistently.-->
 默认情况下，Redis在内存中工作，这意味着它不会持久性地存储数据。

<!-- An excellent use case for Redis is to use it as a <i>cache</i>. Caches are often used to store data that is otherwise slow to fetch and save the data until it's no longer valid. After the cache becomes invalid, you would then fetch the data again and store it in the cache.-->
 Redis的一个很好的用例是把它作为一个<i>缓存</i>。缓存通常被用来存储数据，否则获取和保存数据的速度会很慢，直到它不再有效。在缓存失效后，你会再次获取数据并将其存储在缓存中。

<!-- Redis has nothing to do with containers. But since we are already able to add <i>any</i> 3rd party service to your applications, why not learn about a new one.-->
 Redis与容器毫无关系。但既然我们已经能够在你的应用中添加<i>任何</i>第三方服务，为什么不了解一个新的服务呢。

</div>

<div class="tasks">

### Exercises 12.9. - 12.11.

#### Exercise 12.9: Set up Redis for the project

<!-- The Express server has already been configured to use Redis, and it is only missing the *REDIS_URL* environment variable. The application will use that environment variable to connect to the Redis. Read through the [Docker Hub page for Redis](https://hub.docker.com/_/redis), add Redis to the <i>todo-app/todo-backend/docker-compose.dev.yml</i> by defining another service after mongo:-->
 Express服务器已经被配置为使用Redis，它只缺少*REDIS_URL*环境变量。应用将使用该环境变量来连接到Redis。阅读[Docker Hub的Redis页面](https://hub.docker.com/_/redis)，将Redis添加到<i>todo-app/todo-backend/docker-compose.dev.yml</i>中，在mongo之后定义另一个服务。

```yml
services:
  mongo:
    ...
  redis:
    ???
```

<!-- Since the Docker Hub page doesn't have all the info, we can use Google to aid us. The default port for Redis is found by doing so:-->
 由于Docker Hub页面没有所有的信息，我们可以用谷歌来帮助我们。通过这样做可以找到Redis的默认端口。

![](../../images/12/redis_port_by_google.png)

<!-- We won't have any idea if the configuration works unless we try it. The application will not start using Redis by itself, that shall happen in next exercise.-->
 除非我们尝试，否则我们不会知道这个配置是否有效。应用不会自己开始使用Redis，这将在下一个练习中发生。

<!-- Once Redis is configured and started, restart the backend and give it the <i>REDIS\_URL</i>, that has the form <i>redis://host:port</i>-->
 一旦Redis被配置并启动，重新启动后端并给它一个<i>REDIS\_URL</i>，其形式为<i>redis://host:port</i>。

```bash
$ REDIS_URL=insert-redis-url-here MONGO_URL=mongodb://localhost:3456/the_database npm run dev
```

<!-- You can now test the configuration by adding the line-->
 你现在可以通过在Express服务器上添加以下一行来测试该配置

```js
const redis = require('../redis')
```

<!-- to the Express server eg. in file <i>routes/index.js</i>. If nothing happens, the configuration is done right. If not, the server crashes:-->
到Express服务器上，例如，在文件<i>routes/index.js</i>中。如果没有发生什么，说明配置是正确的。如果没有，服务器就会崩溃。

```bash
events.js:291
      throw er; // Unhandled 'error' event
      ^

Error: Redis connection to localhost:637 failed - connect ECONNREFUSED 127.0.0.1:6379
    at TCPConnectWrap.afterConnect [as oncomplete] (net.js:1144:16)
Emitted 'error' event on RedisClient instance at:
    at RedisClient.on_error (/Users/mluukkai/opetus/docker-fs/container-app/express-app/node_modules/redis/index.js:342:14)
    at Socket.<anonymous> (/Users/mluukkai/opetus/docker-fs/container-app/express-app/node_modules/redis/index.js:223:14)
    at Socket.emit (events.js:314:20)
    at emitErrorNT (internal/streams/destroy.js:100:8)
    at emitErrorCloseNT (internal/streams/destroy.js:68:3)
    at processTicksAndRejections (internal/process/task_queues.js:80:21) {
  errno: -61,
  code: 'ECONNREFUSED',
  syscall: 'connect',
  address: '127.0.0.1',
  port: 6379
}
[nodemon] app crashed - waiting for file changes before starting...
```

#### Exercise 12.10:

<!-- The project already has [https://www.npmjs.com/package/redis](https://www.npmjs.com/package/redis) installed and two functions "promisified" - getAsync and setAsync.-->
 该项目已经安装了[https://www.npmjs.com/package/redis](https://www.npmjs.com/package/redis)和两个 "承诺 "的函数--getAsync和setAsync。

<!-- - setAsync function takes in key and value, using the key to store the value.-->
 - setAsync函数接收键和值，用键来存储值。

<!-- - getAsync function takes in key and returns the value in a promise.-->
 - getAsync函数接收键并在一个承诺中返回值。

<!-- Implement a todo counter that saves the number of created todos to Redis:-->
 实现一个todo计数器，将创建的todos的数量保存到Redis。

<!-- - Step 1: Whenever a request is sent to add a todo, increment the counter by one.-->
 - 第1步：每当发送一个添加todo的请求时，将计数器增量为1。
<!-- - Step 2: Create a GET /statistics endpoint where you can ask the usage metadata. The format should be the following JSON:-->
 - 第2步：创建一个GET /statistics端点，在那里你可以询问使用情况元数据。其格式应该是以下JSON。

```json
{
  "added_todos": 0,
}
```

#### Exercise 12.11:

<!-- > Use _script_ to record what you do, save the file as script-answers/exercise12_11.txt-->
 > 使用_script_来记录你所做的，将文件保存为script-answers/exercise12_11.txt

<!-- If the application does not behave as expected, a direct access to the database may be beneficial in pinpointing problems. Let us try out how [redis-cli](https://redis.io/topics/rediscli) can be used to access the database.-->
 如果应用的行为不符合预期，直接访问数据库可能有利于准确定位问题。让我们试试如何使用[redis-cli](https://redis.io/topics/rediscli)来访问数据库。

<!-- - Go to the redis container with _docker exec_ and open the redis-cli.-->
 - 用_docker exec_进入redis容器，打开redis-cli。
<!-- - Find the key you used with _[KEYS *](https://redis.io/commands/keys)_-->
 - 用_[KEYS *](https://redis.io/commands/keys)_找到你使用的键。
<!-- - Check the value of the key with command [GET](https://redis.io/commands/get)-->
 - 用[GET](https://redis.io/commands/get)命令检查该键的值
<!-- - Set the value of the counter to 9001, find the right command from [here](https://redis.io/commands/)-->
 - 将计数器的值设为9001，从[这里](https://redis.io/commands/)找到正确的命令
<!-- - Make sure that the new value works by refreshing the page http://localhost:3000/statistics-->
 - 通过刷新页面，确保新的值能够发挥作用 http://localhost:3000/statistics
<!-- - Create a new todo with postman and ensure from redis-cli that the counter has increased accordingly-->
 - 用postman创建一个新的todo，并从redis-cli中确保计数器有相应的增加。
<!-- - Delete the key from cli and ensure that counter works when new todos are added-->
 - 从cli中删除键，并确保当新的todos被添加时计数器工作。

</div>

<div class="content">

### Persisting data with Redis

<!-- In the previous section, it was mentioned that <i>by default</i> Redis does not persist the data. However, the persistence is easy to toggle on. We only need to start the Redis with a different command, as instructed by the [Docker hub page](https://hub.docker.com/_/redis):-->
 在上一节中提到，<i>默认情况下</i>Redis并不持久化数据。然而，持久化是很容易切换的。我们只需要按照[Docker hub page](https://hub.docker.com/_/redis)的指示，用一个不同的命令来启动Redis。

```yml
services:
  redis:
    # Everything else
    command: ['redis-server', '--appendonly', 'yes'] # Overwrite the CMD
    volumes: # Declare the volume
      - ./redis_data:/data
```

<!-- The data will now be persisted to directory <i>redis_data</i> of the host machine.-->
 数据现在将被持久化到主机的<i>redis_data</i>目录。
<!-- Remember to add the directory to .gitignore!-->
 记得将该目录添加到.gitignore!

#### Other functionality of Redis

<!-- In addition to the GET, SET and DEL operations on keys and values, Redis can do also a quite a lot more. It can for example automatically expire keys, that is a very useful feature when Redis is used as a cache.-->
 除了对键和值的GET、SET和DEL操作外，Redis还可以做很多事情。例如，它可以自动过期键，当Redis被用作缓存时，这是一个非常有用的功能。

<!-- Redis can also be used to implement so called [publish-subscribe](https://en.wikipedia.org/wiki/Publish%E2%80%93subscribe_pattern) (or PubSub) pattern that is a asynchronous communication mechanism for distributed applications. In this scenario Redis works as a <i>message broker</i> between two or more applications. Some of the applications are <i>publishing</i> messages by sending those to Redis, that on arrival of a message, informs the parties that have <i>subscribed</i> to those messages.-->
 Redis也可以用来实现所谓的[发布-订阅](https://en.wikipedia.org/wiki/Publish%E2%80%93subscribe_pattern)(或PubSub)模式，这是一种分布式应用的异步通信机制。在这种情况下，Redis作为两个或多个应用之间的<i>消息代理</i>工作。一些应用通过向Redis发送消息来<i>发布</i>消息，当消息到达时，Redis会通知已经<i>订阅</i>这些消息的各方。

</div>

<div class="tasks">

### Exercise 12.12.

#### Exercise 12.12: Persisting data in Redis

<!-- Check that the data is not persisted by default: after running _docker-compose -f docker-compose.dev.yml down_ and _docker-compose -f docker-compose.dev.yml up_ the counter value is reset to 0.-->
 检查数据是否默认不被持久化：在运行_docker-compose -f docker-compose.dev.yml down_和_docker-compose -f docker-compose.dev.yml up_之后，计数器值被重置为0。

<!-- Then create a volume for Redis data (by modifying <i>todo-app/todo-backend/docker-compose.dev.yml </i>) and make sure that the data survives after running _docker-compose -f docker-compose.dev.yml down_ and _docker-compose -f docker-compose.dev.yml up_.-->
 然后为Redis数据创建一个卷（通过modifying <i>todo-app/todo-backend/docker-compose.dev.yml </i>），并确保数据在运行_docker-compose -f docker-compose.dev.yml down_和_docker-compose -f docker-compose.dev.yml up_之后仍然存在。

</div>
