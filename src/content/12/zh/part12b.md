---
mainImage: ../../../images/part-12.svg
part: 12
letter: b
lang: zh
---

<div class="content">


<!-- In the previous section, we used two different base images: ubuntu and node and did some manual work to get a simple "Hello, World!" running. The tools and commands we learned during that process will be helpful. In this section, we will learn how to build images and configure environments for our applications. We will start with a regular Express/Node.js backend and build on top of that with other services, including a MongoDB database. -->
在上一节中，我们使用了两个不同的基础镜像：ubuntu 和 node，并做了一些手动操作来获得一个简单的“Hello, World！”运行。我们在这个过程中学到的工具和命令很有用。在本节中，我们将学习如何为我们自己的应用程序构建容器和配置环境。我们会从一个常规的 Express/Node.js 后端程序开始，在其之上构建其他服务，包括MongoDB 数据库。

### Dockerfile

<!-- Instead of modifying a container by copying files inside, we can create a new image that contains the "Hello, World!" application. The tool for this is the Dockerfile. Dockerfile is a simple text file that contains all of the instructions for creating an image. Let's create an example Dockerfile from the "Hello, World!" application. -->
我们可以创建一个包含“Hello, World!”应用的新镜像，而不是通过复制其中的文件来修改容器。工具是 Dockerfile。 Dockerfile 是一个简单的文本文件，其中包含创建镜像的所有说明。让我们从“Hello, World!”应用程序创建一个示例 Dockerfile。

<!-- If you did not already, create a directory on your machine and create a file called <i>Dockerfile</i> inside that directory. Let's also put an <i>index.js</i> containing _console.log('Hello, World!')_ next to the Dockerfile. Your directory structure should look like this: -->
如果您还没有，请在您自己的机器上创建一个目录并在其中创建一个名为 <i>Dockerfile</i> 的文件。我们还在 Dockerfile 旁边放置一个包含 _console.log('Hello, World!')_ 的 <i>index.js</i>。您的目录结构应如下所示：

```
├── index.js
└── Dockerfile
```

<!-- inside that Dockerfile we will tell the image three things:

- Use the node:16 as the base for our image
- Include the index.js inside the image, so we don't need to manually copy it into the container
- When we run a container from the image, use node to execute the index.js file. -->

在该 Dockerfile 中，我们将告诉镜像 3 件事：

- 使用 node:16 作为我们镜像的基础，我们希望node 16 包含的所有内容都可用于该镜像。
- 将 index.js 包含在镜像中，这样我们就不需要手动复制到容器中了
- 当我们从镜像运行容器时，使用 node 执行 index.js 文件。

<!-- The wishes above will translate into a basic Dockerfile. The best location to place this file is usually at the root of the project.  -->
以上的愿望会被翻译成基本的Dockerfile。Dockerfile 最好的位置通常是在项目的根目录。

<!-- The resulting <i>Dockerfile</i> looks like this: -->
<i>Dockerfile</i> 的编辑结果如下：

```Dockerfile
FROM node:16

WORKDIR /usr/src/app

COPY ./index.js ./index.js

CMD node index.js
```

<!-- FROM instruction will tell Docker that the base for the image should be node:16. COPY instruction will copy the file <i>index.js</i> from the host machine to the file with the same name in the image. CMD instruction tells what happens when _docker run_ is used. CMD is the default command that can then be overwritten with the parameter given after the image name. See _docker run --help_ if you forgot. -->
FROM 指令会告诉我们的基础镜像是 node:16。 COPY 指令将<i>index.js</i>文件从宿主机复制到镜像中，并使用相同的文件名。 CMD 指令说明 _docker run_ 时将执行什么。 CMD 是默认命令，可以用镜像名称后给出的参数覆盖。如果您忘记了，请参阅 _docker run --help_。

<!-- The WORKDIR instruction was slipped in to ensure we don't interfere with the contents of the image. It will guarantee all of the following commands will have <i>/usr/src/app</i> set as the working directory. If the directory doesn't exist in the base image, it will be automatically created. -->
WORKDIR 指令确保我们不会干扰镜像已有的内容。它将确保以下所有命令都位于目录 <i>/usr/src/app</i> 中执行，如果该目录不存在于基础镜像中，会自动创建。

<!-- If we do not specify a WORKDIR, we risk overwriting important files by accident. If you check the root (_/_) of the node:16 image with _docker run node:16 ls_, you can notice all of the directories and files that are already included in the image.  -->
如果我们不指定 WORKDIR，我们就有可能意外覆盖无关但重要的文件。如果您使用 _docker run node:16 ls_ image 检查 node:16 的根 (_/_)，您可以注意到镜像中已包含的所有目录和文件。这是因为我们使用node作为基础镜像。node镜像已经包含所有这些文件，我们只是添加了我们自己的文件。

<!-- Now we can use the command _docker build_ to build an image based on the Dockerfile. Let's spice up the command with one additional flag: _-t_, this will help us name the image: -->
现在我们可以使用命令 _docker build_ 来构建基于 Dockerfile 的镜像。让我们用一个额外的标志为命令：_-t_，这将帮助我们命名镜像：

```bash
$ docker build -t fs-hello-world . 
[+] Building 3.9s (8/8) FINISHED
...
```

<!-- So the result is "docker please build with tag fs-hello-world the Dockerfile in this directory". You can point to any Dockerfile, but in our case, a simple dot will mean the Dockerfile in <i>this</i> directory. That is why the command ends with a period. After the build is finished, you can run it with _docker run fs-hello-world_. -->

所以结果是“docker please build with tag fs-hello-world the Dockerfile in this directory”。您可以指向任何 Dockerfile，但在我们的示例中，简单地点表示<i>此</i>目录中的 Dockerfile，这也是为什么该命令以点号结尾。构建完成后，您可以使用 _docker run fs-hello-world_ 运行它。

<!-- As images are just files, they can be moved around, downloaded and deleted. You can list the images you have locally with _docker image ls_, delete them with _docker image rm_. See what other command you have available with _docker image --help_. -->
由于镜像只是文件，它们可以四处移动、下载和删除。您可以使用 _docker image ls_ 列出您在本地拥有的镜像，使用 _docker image rm_ 删除它们。查看您可以使用 _docker image --help_ 的其他命令。

### More meaningful image
更有意义的镜像

<!-- Moving an Express server to a container should be as simple as moving the "Hello, World!" application inside a container. The only difference is that there are more files. Thankfully _COPY_ instruction can handle all that. Let's delete the index.js and create a new Express server. Lets use [express-generator](https://expressjs.com/en/starter/generator.html) to create a basic Express application skeleton. -->
将 Express 服务器移动到容器应该就像移动“Hello, World!”应用到容器中一样简单。唯一的区别是有更多的文件。幸运的是 _COPY_ 指令可以处理所有这些。让我们删除 index.js 并创建一个新的 Express 服务器。让我们使用 [express-generator](https://expressjs.com/en/starter/generator.html) 创建一个基本的 Express 骨架应用程序。

```bash
$ npx express-generator
  ...
  
  install dependencies:
    $ npm install

  run the app:
    $ DEBUG=playground:* npm start
```

<!-- First, let's run the application to get an idea of what we just created. Note that the command to run the application may be different from you, my directory was called playground. -->
首先，让我们运行应用程序以了解我们刚刚创建的内容。请注意，运行应用程序的命令可能与您不同，我的目录名为 playground。

```bash
$ npm install
$ DEBUG=playground:* npm start
  playground:server Listening on port 3000 +0ms
```

<!-- Great, so now we can navigate to [http://localhost:3000](http://localhost:3000) and the app is running there. -->
太好了，现在我们可以导航到 [http://localhost:3000](http://localhost:3000) 并且应用程序运行起来了。

<!-- Containerizing that should be relatively easy based on the previous example.

- Use node as base
- Set working directory so we don't interfere with the contents of the base image
- Copy ALL of the files in this directory to the image
- Start with DEBUG=playground:* npm start


Let's place the following Dockerfile at the root of the project:-->

基于前面的示例，容器化相对应该很容易。

- 以node为基础
- 设置工作目录，这样我们就不会干扰基础镜像的内容
- 将这个目录下的所有文件复制到镜像中
- 从 DEBUG=playground:* npm start 开始


让我们将下面的Dockerfile 放到项目的根目录中：


```Dockerfile
FROM node:16

WORKDIR /usr/src/app

COPY . .

CMD DEBUG=playground:* npm start
```

<!-- Let's build the image from the Dockerfile with a command, _docker build -t express-server ._ and run it with _docker run -p 3123:3000 express-server_. The _-p_ flag will inform Docker that a port from the host machine should be opened and directed to a port in the container. The format for is _-p host-port:application-port_. -->

让我们从Dockerfile中构建镜像，使用命令 _docker build -t express-server ._ 并使用 _docker run -p 3123:3000 express-server_ 运行它。 _-p_ 标志将通知 Docker 应该打开来自主机的端口并将其定向到容器中的端口。格式为 _-p host-port:application-port_

```bash
$ docker run -p 3123:3000 express-server

> playground@0.0.0 start
> node ./bin/www

Tue, 29 Jun 2021 10:55:10 GMT playground:server Listening on port 3000
```

<!-- > If yours doesn't work, skip to the next section. There is an explanation why it may not work even if you followed the steps correctly. -->

> 如果您的不起作用，请跳到下一部分，我将解释为什么即使您是按照步骤操作的，它仍可能不起作用。

<!-- The application is now running! Let's test it by sending a GET request to [http://localhost:3123/](http://localhost:3123/).-->
应用运行起来了！ 让我们通过向 [http://localhost:3123/](http://localhost:3123/) 发送 GET 请求来测试它。

<!-- Shutting it down is a headache at the moment. Use another terminal and _docker kill_ command to kill the application. The _docker kill_ will send a kill signal (SIGKILL) to the application to force it to shut down. It needs the name or id of the container as an argument. -->

目前关闭它是一个头痛的问题，使用另一个终端和 _docker kill_ 命令来杀死应用程序。 _docker kill_ 将向应用程序发送终止信号 (SIGKILL) 以强制其关闭。 作为参数，它需要容器的名称或 ID。

<!-- By the way, when using id as the argument, the beginning of the ID is enough for Docker to know which container we mean. -->
通过这种方式，当使用id作为参数，ID的开头几位足以让Docker知道我指的是哪个容器。

```bash
$ docker container ls
  CONTAINER ID   IMAGE            COMMAND                  CREATED         STATUS         PORTS                                       NAMES
  48096ca3ffec   express-server   "docker-entrypoint.s…"   9 seconds ago   Up 6 seconds   0.0.0.0:3123->3000/tcp, :::3123->3000/tcp   infallible_booth

$ docker kill 48
  48
```

<!-- In the future, let's use the same port on both sides of _-p_. Just so we don't have to remember which one we happened to choose. -->
将来，我们会在容器外使用与应用程序运行相同的端口， 使用 _-p_ 参数。这样我们就不必记住我们碰巧选择了哪个端口。

#### Fixing potential issues we created by copy-pasting
修复我们通过复制粘贴引入的潜在问题

<!-- There are a few steps we need to change to create a more comprehensive Dockerfile. It may even be that the above example doesn't work in all cases because we skipped an important step. -->

我们需要更改几个步骤以创建更全面的 Dockerfile。甚至可能是因为我们跳过了一个重要的步骤，所以上面的例子并不适用于所有情况。

<!-- When we ran npm install on our machine, in some cases **node package manager** may install operating system specific dependencies during the install step. We may accidentally move non-functional parts to the image with the COPY instruction. This can easily happen if we copy the <i>node_modules</i> directory into the image. -->

当我们在我们的机器上运行 npm install，某些情况下，**node package manager** 可能会在安装步骤中安装操作系统特定的依赖项。我们可能不小心使用 COPY 指令将不相关的内容复制到镜像中，比如常见的我们可能将所有 node_modules 复制到镜像中时。

<!-- This is a critical thing to keep in mind when we build our images. It's best to do most things, such as to run _npm install_ during the build process <i>inside the container</i> rather than doing those prior to building. The easy rule of thumb is to only copy files that you would push to GitHub. Build artefacts or dependencies should not be copied since those can be installed during the build process. -->
当我们构建镜像时，考虑这一点至关重要。最好在镜像中做大多数事情，例如<i>在容器内</i>运行 _npm install_， 而不是在构建镜像前做这些事情，最简单的衡量标准就是你会把什么文件push 到GitHub，那就打到镜像中。手动打包结果或依赖不应当拷贝进去，那些可以在构建阶段再去安装。

<!-- We can use <i>.dockerignore</i> to solve the problem. The file .dockerignore is very similar to .gitignore, you can use that to prevent unwanted files from being copied to your image. The file should be placed next to the Dockerfile. Here is a possible content of a <i>.dockerignore</i> -->
我们可以使用文件 <i>.dockerignore</i>来解决这个问题。 .dockerignore 与 .gitignore 非常相似，您可以使用它来防止不需要的文件被复制到您的镜像中。文件应当和Dockerfile放到一起，以下可能是 <i>.dockerignore</i> 的内容：

```
.dockerignore
.gitignore
node_modules
Dockerfile
```

<!-- However, in our case the .dockerignore isn't the only thing required. We will need to install the dependencies during the build step. The _Dockerfile_ changes to: -->
然而，在我们的例子中 .dockerignore 并不是唯一需要的东西。我们需要在构建步骤中安装依赖项，因此 _Dockerfile_ 文件内容改为：

```Dockerfile
FROM node:16

WORKDIR /usr/src/app

COPY . .

RUN npm install # highlight-line

CMD DEBUG=playground:* npm start
```

<!-- The npm install can be risky. Instead of using npm install, npm offers a much better tool for installing dependencies, the _ci_ command. -->
npm install 有一定风险。因此不使用 npm install，npm 提供了一个更好的工具来安装依赖项，即 _ci_ 命令。

<!-- Differences between ci and install:

- install may update the package-lock.json
- install may install a different version of a dependency if you have ^ or ~ in the version of the dependency.

- ci will delete the node_modules folder before installing anything
- ci will follow the package-lock.json and does not alter any files -->

ci 和 install 的区别：

- install 可能会更新 package-lock.json
- install 可能会安装一个不同版本的依赖项，如果您在依赖项的版本中有 ^ 或 ~ 。
- ci 将在安装任何东西之前删除 node_modules 文件夹
- ci 将遵循 package-lock.json 并且不改变任何文件

<!-- So in short: _ci_ creates reliable builds, while _install_ is the one to use when you want to install new dependencies. -->
简而言之：_ci_ 创建可信的构建，而 _install_ 是您想要安装新依赖项时使用的构建。

<!-- As we are not installing anything new during the build step, and we don't want the versions to suddenly change, we will use _ci_:-->
由于我们在构建步骤中没有安装任何新的东西，而且我们不希望版本突然改变，我们将使用 _ci_：

```Dockerfile
FROM node:16

WORKDIR /usr/src/app

COPY . .

RUN npm ci # highlight-line

CMD DEBUG=playground:* npm start
```

<!-- Even better, we can use _npm ci --only-production_ to not waste time installing development dependencies. -->

更好的是，我们可以使用 _npm ci --only-production_ 来不浪费时间安装开发依赖项。

<!-- > As you noticed in the comparison list; npm ci will delete the node_modules folder so creating the .dockerignore did not matter. However, .dockerignore is an amazing tool when you want to optimize your build process. We will talk briefly about these optimizations later. -->

> 正如您在比较列表中所注意到的； npm ci 将删除 node_modules 文件夹，因此创建 .dockerignore 无关紧要。但是，当您想要优化构建过程时，.dockerignore 是一个了不起的工具。稍后我们将简要讨论这些优化。

<!-- Now the Dockerfile should work again, try it with _docker build -t express-server . && docker run -p 3000:3000 express-server_ -->

现在 Dockerfile 应该可以再次工作了，用 _docker build -t express-server . && docker run -p 3000:3000 express-server_ 试试吧。

<!-- > Note that we are here chaining two bash commands with &&. We could get (nearly) the same effect by running both commands separately. When chaining commands with && if one command fails, the next ones in the chain will not be executed. -->
> 注意我们这里将两个命令用 && 连接起来了。我们使用分开的命令，可以得到（几乎）相同的结果。被 && 连接起来的命令如果一个失败了，则下一个不会被执行。

<!-- We set an environment variable _DEBUG=playground:*_ during CMD for the npm start. However, with Dockerfiles we could also use the instruction ENV to set environment variables. Let's do that: -->
我们在 npm start 的 CMD 期间设置了一个环境变量 _DEBUG=playground:*_。但是，使用 Dockerfiles 我们也可以使用指令 ENV 来设置环境变量。让我们这样做：

```Dockerfile
FROM node:16

WORKDIR /usr/src/app

COPY . .

RUN npm ci 

ENV DEBUG=playground:* # highlight-line

CMD npm start # highlight-line
```

<!-- > <i>If you're wondering what the DEBUG environment variable does, read [here](http://expressjs.com/en/guide/debugging.html#debugging-express).</i> -->

如果你好奇什么是DEBUG 环境变量，可以阅读[这里](http://expressjs.com/en/guide/debugging.html#debugging-express).

#### Dockerfile best practices
Dockerfile 最佳实践


<!-- There are 2 rules of thumb you should follow when creating images:

- Try to create as **secure** of an image as possible
- Try to create as **small** of an image as possible -->

<!-- Smaller images are more secure by having less attack surface area, and smaller images also move faster in deployment pipelines.-->
创建镜像时应遵循 2 条经验法则：

- 尝试创建尽可能**安全**的镜像
- 尝试创建尽可能**小的**镜像

较小的镜像由于具有较少的攻击面而更安全，而且较小的镜像在部署管道中会运行得更快。

<!-- Snyk has a great list of 10 best practices for node/express containerization. Read those [here](https://snyk.io/blog/10-best-practices-to-containerize-nodejs-web-applications-with-docker/).-->
Snyk 列出了 10 个 node/express 容器化过程中的最佳实践，请在 [此处](https://snyk.io/blog/10-best-practices-to-containerize-nodejs-web-applications-with-docker/)阅读它们。

<!-- One big carelessness we have left is running the application as root instead of using a user with lower privileges. Let's do a final fix to the Dockerfile: -->
我们所做的一大的缺陷是让应用程序以 root 身份运行，而不是使用较低权限的用户身份运行。 让我们对 Dockerfile 做最后的修复：

```Dockerfile
FROM node:16

USER node # highlight-line
  
WORKDIR /usr/src/app

COPY --chown=node:node . .  # highlight-line

RUN npm ci 

ENV DEBUG=playground:*

CMD npm start
```

### Exercise 12.5.
练习 12.5

#### Exercise 12.5: Containerizing a Node application
练习 12.5：容器化一个Node应用程序

<!-- The repository you cloned or copied in the first exercise contains a todo-app. See the todo-app/todo-backend and read through the README. We will not touch the todo-frontend yet. -->
第一个练习中，你clone 或拷贝的仓库是一个todo 应用，查看 todo-app/todo-backend 并阅读README， 我们暂时不会触及 。

<!-- Step 1. Containerize the todo-backend by creating a <i>todo-app/todo-backend/Dockerfile</i> and building an image. -->
步骤一 容器化你的应用，创建一个 <i>todo-app/todo-backend/Dockerfile</i> 的Dockerfile 并构建镜像。

<!-- Step 2. Run the todo-backend image with the correct ports open. Make sure the visit counter increases when used through a browser in http://localhost:3000/ (or some other port if you configure so) -->
步骤二 运行镜像并开放正确的端口。确保使用浏览器访问 http://localhost:3000/ 计数器会正确增加（或者访问你配置的其他端口）。

<!-- Tip: Run the application outside of a container to examine it before starting to containerize. -->
技巧：启动容器前，在容器外运行应用来检查。

<!-- Get the visit counter in root of the application working while the application is running inside the container. -->
当应用程序在容器内运行时，获取应用程序根目录中的访问计数器。

</div>
  
<div class="content">

### Using docker-compose

<!-- In the previous section, we created express-server and knew that it runs in port 3000, and ran it with _docker build -t express-server . && docker run -p 3000:3000 express-server_. This already looks like something you would need to put into a script to remember. Fortunately, Docker offers us a better solution. -->
在上一节中，我们创建了 express-server 并且知道它运行在 3000 端口，并使用 _docker build -t express-server . && docker run -p 3000:3000 express-server_ 运行它。这看起来像是您需要放入脚本中才能记住的东西。 幸运的是  Docker 为我们提供了更好的解决方案。

<!-- [Docker-compose](https://docs.docker.com/compose/) is another fantastic tool, which can help us manage containers. Let's start using docker-compose as we learn more about containers as it will help us save some time with the configuration. -->

 [Docker-compose](https://docs.docker.com/compose/) 是另一个了不起的工具，它可以帮助我们管理容器。 随着我们对容器的了解更多，我们会使用 docker-compose，因为它将帮助我们节省一些配置时间。

<!-- Install the docker-compose tool from this link: [https://docs.docker.com/compose/install/](https://docs.docker.com/compose/install/). -->
从此链接安装 docker-compose 工具：[https://docs.docker.com/compose/install/](https://docs.docker.com/compose/install/)。

<!-- Let's check that it works: -->
让我们检查它是否有效：

```bash
$ docker-compose -v
docker-compose version 1.29.2, build 5becea4c
```

<!-- And now we can turn the previous spell into a yaml file. The best part about yaml files is that you can save these to a Git repository! -->
现在我们可以将之前这些“咒语”转换为 yaml 文件。用yaml 文件最棒的部分是你可以将这些内容存储到Git 仓库中：

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

<!-- The meaning of each line is explained as a comment. If you want to see the full specification see the [documentation](https://docs.docker.com/compose/compose-file/compose-file-v3/).-->
这些行的解释已经写在注释中了。如果你想看完整的标准，参见[文档](https://docs.docker.com/compose/compose-file/compose-file-v3/)

<!-- Now we can use _docker-compose up_ to build and run the application. If we want to rebuild the images we can use _docker-compose up --build_. -->
现在我们可以使用 _docker-compose up_ 来构建和运行应用程序。 如果我们想重建镜像，我们可以使用 _docker-compose up --build_。

<!-- You can also run the application in the background with _docker-compose up -d_ (_-d_ for detached) and close it with _docker-compose down_. -->
您还可以使用 _docker-compose up -d_（_-d_ 表示分离）在后台运行应用程序，并使用 _docker-compose down_ 关闭它。

<!-- Creating files like this that <i>declare</i> what you want instead of script files that you need to run in a specific order / a specific number of times is often a great practice. -->

创建这样的文件<i>声明</i>你想要什么，而不是你需要以特定顺序/特定次数运行的脚本文件，这通常是一个很好的做法。

</div>

<div class="tasks">

### Exercise 12.6.
练习12.6

#### Exercise 12.6: docker-compose
练习12.6： docker-compose

<!-- Create a <i>todo-app/todo-backend/docker-compose.yml</i> file that works with the node application from the previous exercise.
 -->
创建一个 <i>todo-app/todo-backend/docker-compose.yml</i> 的 docker-compose 文件，该文件适用于上一个练习中的node应用程序。

<!-- The visit counter is the only feature that is required to be working. -->
访问计数器是唯一需要工作的功能。

</div>

<div class="content">

###  Utilizing containers in development
在开发环境中使用容器

<!-- When you are developing software, containerization can be used in various ways to improve your quality of life. One of the most useful cases is by bypassing the need to install and configure tools twice. -->
在开发软件时，可以通过多种方式使用容器化来提高您的生活质量。 最有用的情况之一是绕过两次安装和配置工具的需要。

<!-- It may not be the best option to move your entire development environment into a container, but if that's what you want it's possible. We will revisit this idea at the end of this part. But until then, <i>run the node application itself outside of containers</i>. -->
将整个开发环境移动到容器中可能不是最佳选择，但如果这是您想要的，是可能的。 我们将在这一部分的结尾重新审视这个想法。 但在那之前，<i>在容器之外运行node应用程序</i>。

<!-- The application we met in the previous exercises uses MongoDB. Let's explore [Docker Hub](https://hub.docker.com/) to find a MongoDB image. Docker Hub is the default place where Docker pulls the images from, you can use other registries as well, but since we are already knee-deep in Docker it's a good choice. With a quick search, we can find [https://hub.docker.com/_/mongo](https://hub.docker.com/_/mongo) -->
我们在前面练习中的应用程序使用 MongoDB。 让我们探索 [Docker Hub](https://hub.docker.com/) 以找到一个 MongoDB 镜像。 Docker Hub 是 Docker 从中提取镜像的默认位置，您也可以使用其他仓库，但由于我们已经深入了解 Docker，因此它是个不错的选项。 通过快速搜索，我可以找到 [https://hub.docker.com/_/mongo](https://hub.docker.com/_/mongo)

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

<!-- The meaning of the two first environment variables defined above is explained on the Docker Hub page:-->
上述前两个环境变量的含义在Docker Hub 页面中有说明：

<!-- > <i>These variables, used in conjunction, create a new user and set that user's password. This user is created in the admin authentication database and given the role of root, which is a "superuser" role.</i> -->
> <i>这些变量结合使用，可创建新用户并设置该用户的密码。该用户是在 admin 身份验证数据库中创建的，并被赋予 root 角色，这是一个“超级用户”角色。</i>

<!-- The last environment variable *MONGO\_INITDB\_DATABASE* will tell MongoDB to create a database with that name.  -->
最后的环境变量 *MONGO\_INITDB\_DATABASE* 会告诉MongoDB 创建一个同名的数据库。

<!-- You can use _-f_ flag to specify a <i>file</i> to run the Docker Compose command with e.g. _docker-compose -f docker-compose.dev.yml up_. Now that we may have multiple it's useful. -->

你可以使用 _-f_ 参数来指定一个 <i>文件</i> 来运行Docker Compose 命令，例如 。 这样如果我们可能有多个文件，就十分有用。

<!-- Now start the MongoDB with _docker-compose -f docker-compose.dev.yml up -d_. With _-d_ it will run it in the background. You can view the output logs with _docker-compose -f docker-compose.dev.yml logs -f_. There the _-f_ will ensure we <i>follow</i> the logs. -->
现在使用 __docker-compose -f docker-compose.dev.yml up -d_ 启动 MongoDB，它将在后台运行它，您可以使用 _docker-compose -f docker-compose.dev.yml logs -f_ 查看日志，_-f_ 将确保我们<i>滚动</i>日志.

<!-- As said previously, currently we <strong>do not</strong> want to run the Node application inside a container. Developing while the application itself is inside a container is a challenge. We will explore that option in the later in this part. -->
如前所述，现在我们<strong>不想</strong>在容器内运行node应用程序。开发跑在自己容器中的应用是一个挑战。我们会在本章后面讨论相关方案。

<!-- Run the good old _npm install_ first on your machine to set up the Node application. Then start the application with the relevant environment variable. You can modify the code to set them as the defaults or use the .env file. There is no hurt in putting these keys to GitHub since they are only used in your local development environment. I'll just throw them in with the _npm run dev_ to help you copy-paste. -->
首先运行以前的 _npm install_ 来运行起Node应用。然后用相关的环境变量启动应用程序。您可以修改代码将它们设置为默认值或使用 .env 文件。这些文件上传到Github 也是没有风险的，因为它只能用在你的开发环境中。我会在 _npm run dev_ 时将它们放进去，帮助你复制粘贴。

```bash
$ MONGO_URL=mongodb://localhost:3456/the_database npm run dev
```

<!-- This won't be enough; we need to create a user to be authorized inside of the container. The url http://localhost:3000/todos leads to an authentication error. -->
这还不够；我们需要在容器内创建一个要授权的用户。 url http://localhost:3000/todos 导致身份验证错误：

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
绑定挂载点与初始化数据库

<!-- In the [MongoDB Docker Hub](https://hub.docker.com/_/mongo) page under "Initializing a fresh instance" is the info on how to execute JavaScript to initialize the database and an user for it. -->
在[MongoDB Docker Hub](https://hub.docker.com/_/mongo) 页面， “Initializing a fresh instance 初始化新实例” 是有关如何执行 JavaScript 以初始化数据库及其用户的信息。

<!-- The exercise project has file <i>todo-app/todo-backend/mongo/mongo-init.js</i> with contents: -->
练习中有一个文件 <i>todo-app/todo-backend/mongo/mongo-init.js</i> 内容如下：


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

<!-- This file will initialize the database with a user and a few todos. Next, we need to get it inside the container at startup. -->
该文件将使用用户和一些待办事项初始化数据库。 接下来，我们只需要在启动时将它放入容器中。

<!-- We could create a new image FROM mongo and COPY the file inside, or we can use a <i>bind mount</i> to mount the file <i>mongo-init.js</i> to the container. Let's do the latter. -->
我们可以利用 FROM mongo 创建一个新镜像并 COPY 里面的文件，或者我们可以使用<i>绑定挂载</i>将 <i>mongo-init.js</i> 挂载到容器。让我们用后面这个方法。

<!-- Bind mount is the act of binding a file on the host machine to a file in the container. We could add a _-v_ flag with _container run_. The syntax is _-v FILE-IN-HOST:FILE-IN-CONTAINER_. Since we already learned about Docker Compose let's skip that. The bind mount is declared under key <i>volumes</i> in docker-compose. Otherwise the format is the same, first host and then container: -->

挂载是将一个宿主机的文件绑定到容器中，我们可以添加 _-v_  参数到 _container run_ 命令中。 语法是 _-v FILE-IN-HOST:FILE-IN-CONTAINER_ 。由于我们已经学过了Docker Compose，我们省略这步。在 docker-compose 中，挂载是被定义在 <i>volumes</i> 中的。格式是一样的，先试host，然后是容器：

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

<!-- The result of the bind mount is that the file <i>mongo-init.js</i> in the mongo folder of the host machine is the same as the <i>mongo-init.js</i> file in the container's /docker-entrypoint-initdb.d directory. Changes to either file will be available in the other. We don't need to make any changes during runtime. But this will be the key to software development in containers. -->
挂载的结果是宿主机里mongo 文件夹中 <i>mongo-init.js</i> 的文件与容器中的 /docker-entrypoint-initdb.d 文件夹下的 <i>mongo-init.js</i>同步了。某个发生了变化会同步到另一个中。在运行时不需要做出任何修改。但对容器中的开发来说这是关键。


<!-- Run _docker-compose -f docker-compose.dev.yml down --volumes_ to ensure that nothing is left and start from a clean slate with _docker-compose -f docker-compose.dev.yml up_ to initialize the database. -->
运行 _docker-compose -f docker-compose.dev.yml down --volumes_ 确保没有落下的内容，并从一个干净的启动 _docker-compose -f docker-compose.dev.yml up_  来初始化数据库。

<!-- If you see an error like this: -->
如果你看到了如下报错：

```bash
mongo_database | failed to load: /docker-entrypoint-initdb.d/mongo-init.js
mongo_database | exiting with code -3
```

<!-- you may have a read permission problem. They are not uncommon when dealing with volumes. In the above case, you can use _chmod a+r mongo-init.js_, which will give everyone read access to that file. Be careful when using _chmod_ since granting more privileges can be a security issue. Use the _chmod_ only on the mongo-init.js on your computer. -->
你可能遇到了权限问题。在处理挂载卷的问题上，这个很常见，在上面的例子中，你可以使用  _chmod a+r mongo-init.js_ ， 会给每个人读该文件的读权限。在使用 _chmod_ 要小心，因为给过多的权限会有安全问题。仅在 mongo-init.js 文件上使用 _chmod_ 。 


<!-- Now starting the express application with the correct environment variable should work: -->
现在使用正确的环境变量启动 express 应用程序应该可以工作：

```bash
$ MONGO_URL=mongodb://the_username:the_password@localhost:3456/the_database npm run dev
```

<!-- Let's check that the http://localhost:3000/todos returns all todos. It should return the two todos we initialized. We can and should use Postman to test the basic functionality of the app, such as adding or deleting a todo. -->
我们检查 http://localhost:3000/todos 是否能返回所有待办事项。它应该返回我们初始化的两个 todos。我们可以，并且应当使用 Postman 来测试 todos 的基本功能，比如添加或删除 一个todo。

### Persisting data with volumes
使用卷持久化数据

<!-- By default, containers are not going to preserve our data. When you close the mongo container you may or may not be able to get the data back. -->
默认情况下，容器不会保存我们的数据。当您关闭 mongo 容器时，您可能无法取回数据。

<!-- This is a rare case in which it does preserve the data as the developers who made the Docker image for Mongo have defined a volume to be used: [https://github.com/docker-library/mongo/blob/cb8a419053858e510fc68ed2d69415b3e50011cb/4.4/Dockerfile#L113](https://github.com/docker-library/mongo/blob/cb8a419053858e510fc68ed2d69415b3e50011cb/4.4/Dockerfile#L113) This line will instruct Docker to preserve the data in those directories. -->

这是一种罕见的情况，它实际上确实保留了数据，因为为 Mongo 制作 Docker 镜像的开发人员已经定义了一个要使用的卷：[https://github.com/docker-library/mongo/blob/cb8a419053858e510fc68ed2d69415b3e50011cb/ 4.4/Dockerfile#L113](https://github.com/docker-library/mongo/blob/cb8a419053858e510fc68ed2d69415b3e50011cb/4.4/Dockerfile#L113) 这一行将指示 Docker 保存这些目录中的数据

<!-- There are two distinct methods to store the data: 
- Declaring a location in your filesystem (called bind mount)
- Letting Docker decide where to store the data (volume) -->
有两种不同的方法来存储数据：
- 在你的文件系统中声明一个位置（称为绑定挂载）
- 让 Docker决定数据的存储位置（volume）

<!-- I prefer the first choice in most cases whenever you <i>really</i> need to avoid deleting the data. Let's see both in action with docker-compose: -->
在大多数情况下，当您<i>确实</i>需要避免删除数据时，我更喜欢第一个选择。让我们看看两者在 docker-compose 中的作用：

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
      MONGO_INITDB_DATABASE: the_database
    volumes:
      - ./mongo/mongo-init.js:/docker-entrypoint-initdb.d/mongo-init.js
      - ./mongo_data:/data/db # highlight-line
```


<!-- The above will create a directory called *mongo\_data* to your local filesystem and map it into the container as _/data/db_. This means the data in _/data/db_ is stored outside of the container but still accessible by the container! Just remember to add the directory to .gitignore. -->
以上将创建一个名为 *mongo\_data* 的目录到您的本地文件系统，并将其映射到容器中作为 _/data/db_。 这意味着 _/data/db_ 中的数据存储在容器之外，但容器仍然可以访问！ 请记住将目录添加到.gitignore。

<!-- A similar outcome can be achieved with a named volume: -->
一个类似很好的方法是使用命名卷：

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
      MONGO_INITDB_DATABASE: the_database
    volumes:
      - ./mongo/mongo-init.js:/docker-entrypoint-initdb.d/mongo-init.js
      - mongo_data:/data/db # highlight-line

volumes:
  mongo_data:
```

<!-- Now the volume is created but managed by Docker. After starting the application (_docker-compose -f docker-compose.dev.yml up_) you can list the volumes with _docker volume ls_, inspect one of them with _docker volume inspect_ and even delete them with _docker volume rm_. It's still stored in your local filesystem but figuring out <i>where</i> may not be as trivial as with the previous option. -->

现在卷已创建，但由 Docker 管理。 启动应用程序 (_docker-compose -f docker-compose.dev.yml up_) 后，您可以使用 _docker volume ls_ 列出卷，使用 _docker volume inspect_ 检查其中之一，甚至使用 _docker volume rm_ 删除它们。 它仍然存储在您的本地文件系统中，但找出 <i>where</i> 可能不像使用前一个选项那么简单。 

</div>

<div class="tasks">

### Exercise 12.7.
练习 12.7

#### Exercise 12.7: Little bit of MongoDB coding
练习 12.6：一点点 MongoDB 编码


<!-- Note that this exercise assumes that you have done all the configurations made in material after the exercise 12.5. You should still run the todo-app backend <i>outside a container</i> just the MongoDB is containerized for now. -->
注意，该练习假设你已经完成了所有练习12.5后教材中所有的配置。你应当让todo应用后台运行在<i>容器外部</i>，MongoDB现在要做容器化了。

<!-- The todo application has no proper implementation of routes for getting one todo (GET <i>/todos/:id</i>) and updating one todo (PUT <i>/todos/:id</i>). Fix the code.  -->
Todo 应用没有合适的实现来获取一个Todo (GET <i>/todos/:id</i>) 或者更新一个Todo(PUT <i>/todos/:id</i>)。

</div>

<div class="content">

### Debugging issues in containers
调试容器中的问题

<!-- > When coding, you most likely end up in a situation where everything is broken. 

> \- Matti Luukkainen -->

> <i>编码时，您很可能会遇到一切都搞砸的情况。</i>
> \- Matti Luukkainen

<!-- When developing with containers, we need to learn new tools for debugging since we can not just "console.log" everything. When code has a bug, you may often be in a state where at least something works so you can work forward from that. Configuration most often is in either of the two states: 1. working or 2. broken. We will go over a few tools that can help when your application is in the latter state. -->
当利用容器进行开发时，由于我们只会无脑 "console.log" 我们需要学习新的调试工具。当代码有错误时，您可能经常处于至少某些东西可以工作的状态，因此您可以继续前进。配置最常处于两种状态之一：1. 好用 2. 崩溃。当您的应用程序处于后一种状态时，我们将介绍一些工具来提供帮助。

<!-- When developing software, you can safely progress step by step, all the time verifying that what you have coded behaves as expected. Often, this is not the case when doing configurations. The configuration you may be writing can be broken until the moment it is finished. So when you write a long docker-compose.yml or Dockerfile and it does not work, you need to take a moment and think about the various ways you could confirm something is working. -->
当开发软件时，你可以按程序安全地一步步做，随时验证你的代码是否像预期那样输出。但通常在配置的时候可能这行不通。配置可能是你在写完时才会发现它是否会崩溃。因此，当您编写了很长的 docker-compose.yml 或 Dockerfile 并且它不起作用时，您真的需要花点时间思考一下可以确认某些东西是否正常工作的各种方法。

<!-- <i>Question Everything</i> is still applicable here. As said in [part 3](/en/part3/saving_data_to_mongo_db): The key is to be systematic. Since the problem can exist anywhere, <i>you must question everything</i>, and eliminate all possible sources of error one by one. -->
<i>质疑一切</i>在这里仍然适用。如[第 3 章](/zh/part3/saving_data_to_mongo_db)所述：关键是要系统化。既然问题可能存在于任何地方，那么<i>你必须质疑一切</i>，并一一排除所有导致错误的可能性。

<!-- For myself, the most valuable method of debugging is stopping and thinking about what I'm trying to accomplish instead of just bashing my head at the problem. Often there is a simple, alternate, solution or quick google search that will get me moving forward.   -->
对我自己来说，最有价值的调试方法是停下来真正思考我想要完成的事情，而不是仅仅在问题上猛烈死磕。通常有一个简单的、可替代的解决方案，或快速的谷歌搜索可以让我继续前进。

#### exec

<!-- The Docker command [exec](https://docs.docker.com/engine/reference/commandline/exec/) is a heavy hitter. It can be used to jump right into a container when it's running. -->
Docker 命令 [exec](https://docs.docker.com/engine/reference/commandline/exec/) 是一个重武器。它可用于在运行时直接跳入容器。

<!-- Let's start a web server in the background and do a little bit of debugging to get it running and displaying the message "Hello, exec!" in our browser. Let's choose [Nginx](https://www.nginx.com/) which is, among other things, a server capable of serving static HTML files. It has a default index.html that we can replace. -->
让我们在后台启动 Web 服务器，并进行一些调试以使其运行并显示消息“Hello，exec！”在我们的浏览器中。 我们选择[Nginx](https://www.nginx.com/)，Nginx 是一个能够提供静态 html 文件的服务器。它有一个我们可以替换的默认 index.html。

```bash
$ docker container run -d nginx
```

Ok, now the questions are:

- Where should we go with our browser? 
- Is it even running? 

好的，现在问题来了：
- 我们应该用浏览器去哪里？
- 它还在运行吗？我们知道如何回答后者。

<!-- We know how to answer the latter: by listing the running containers. -->
我们知道如何回答后面这个问题：监听正在运行的容器。

```bash
$ docker container ls
CONTAINER ID   IMAGE           COMMAND                  CREATED              STATUS                      PORTS     NAMES
3f831a57b7cc   nginx           "/docker-entrypoint.…"   About a minute ago   Up About a minute           80/tcp    keen_darwin
```

<!-- Yes! We got the first question answered as well. It seems to listen on port 80, as seen on the output above. -->
是的！我们同时回答了第一个问题。从上面的输出来看，它似乎侦听端口 80。

<!-- Let's shut it down and restart with the _-p_ flag to have our browser access it. -->
让我们关闭它并使用 _-p_ 标志重新启动以让我们的浏览器访问它。

```bash
$ docker container stop keen_darwin
$ docker container rm keen_darwin

$ docker container run -d -p 8080:80 nginx
```

<!-- Let's look at the app by going to http://localhost:8080. It seems the app is showing the wrong message! Let's hop right into the container and fix the it. Keep your browser open, we won't need to shut down the container for this fix. We will execute bash inside the container, the flags _-it_ will ensure that we can interact with the container:-->
让我们在 http://localhost:8080 中查看应用程序。该应用程序似乎显示错误消息！让我们直接跳入容器并修复它。保持浏览器打开，我们不需要为此修复关闭容器。我们将在容器内执行 bash，标志 _-it_ 将确保我们可以与容器交互：

```bash
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

```bash
root@7edcb36aff08:/# cd /usr/share/nginx/html/
root@7edcb36aff08:/# rm index.html
```

<!-- Now, if we go to http://localhost:8080/ we know that we deleted the correct file. The page shows 404. Let's replace it with one containing the correct contents:-->
现在，如果我们访问 http://localhost:8080/ 。我们知道我们删除了正确的文件，页面显示404。让我们用一个包含正确内容的替换它：

```bash
root@7edcb36aff08:/# echo "Hello, exec!" > index.html
```

<!-- Refresh the page, and our message is displayed! Now we know how exec can be used to interact with the containers. Remember that all of the changes are lost when the container is deleted. To preserve the changes, you must use _commit_ just as we did in [previous section](/en/part12/introduction_to_containers#other-docker-commands). -->
刷新页面，我们的消息正确显示了！现在我们知道exec 如何使用来与容器进行交互。记住所有的修改会在容器删除后丢失。为了保存修改，必须使用 _commit_ ，就像 [之前章节](/en/part12/introduction_to_containers#other-docker-commands)讲的那样。

</div>

<div class="tasks">

### Exercise 12.8.
练习 12.8

#### Exercise 12.8: Mongo command-line interface
练习 12.8：Mongo 命令行界面
<!-- > Use _script_ to record what you do, save the file as script-answers/exercise12_8.txt -->
使用_script_ 来记录你的操作，将生成的文件保存到script-answers/exercise12_8.txt 文件中。
<!-- While the MongoDB from the previous exercise is running, access the database with mongo command-line interface (CLI). You can do that using docker exec. Then add a new todo using the CLI. -->
当上一个练习中的 MongoDB 正在运行时，使用 mongo 命令行界面 (CLI)。 你可以使用 docker exec 访问数据库，并使用 CLI 添加新的待办事项。

<!-- The command to open CLI when inside the container is _mongo_ -->
在容器内打开 CLI 的命令只是简单的 _mongo_

<!--The mongo CLI will require the username and password flags to authenticate correctly. Flags _-u root -p example_ should work, the values are from the docker-compose.dev.yml. -->
mongo CLI 将需要用户名和密码标志才能正确验证：Flags _-u root -p example_ 应该好用，值来自 docker-compose.dev.yml。

<!-- * Step 1: Run MongoDB
* Step 2: Use docker exec to get inside the container
* Step 3: Open mongo cli -->

* 第 1 步：运行 MongoDB
* 第 2 步：使用docker exec进入容器
* 第 3 步：打开 mongo cli

<!-- When you have connected to the mongo cli you can ask it to show dbs inside: -->
当您连接到 mongo cli 后，您可以要求它在里面显示 dbs：

```bash
> show dbs
admin         0.000GB
config         0.000GB
local         0.000GB
the_database  0.000GB
```

<!-- To access the correct database: -->
要访问正确的数据库：

```bash
> use the_database
```

<!-- And finally to find out the collections: -->
最后找出集合：

```bash
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

<!-- Insert one new todo with the text: "Increase the number of tools in my toolbelt" with status done as false. Consult the [documentation](https://docs.mongodb.com/v4.4/reference/method/db.collection.insertOne/#mongodb-method-db.collection.insertOne) to see how the addition is done. -->
插入一个带有文本的新待办事项："增加我工具带中的工具数量"，状态为 false！访问[这个](https://docs.mongodb.com/v4.4/reference/method/db.collection.insertOne/#mongodb-method-db.collection.insertOne) 文档来查看额外信息。

<!-- Ensure that you see the new todo both in the express app and when querying from mongo CLI. -->

确保你能够看到新的todo，在express 应用和利用mongo CLI 访问数据库时都能看到。

</div>

<div class="content">

### Redis

<!-- [Redis](https://redis.io/) is a [key-value](https://redis.com/nosql/key-value-databases/) database. In contrast to eg. MongoDB the data stored to a key-value storage has a bit less structure, there are eg. no collections or tables, it just contains junks of data that can be fetched based on the <i>key</i> that was attached to the data  (the <i>value</i>). -->
[Redis](https://redis.io/) 是一个[key-value](https://redis.com/nosql/key-value-databases/) 数据库。与例如MongoDB相比，数据是存储在键值存储中的，是更小的数据结构，没有例如集合或表的概念，只有一堆待取的带 <i>key</i> 的数据（也就是 <i>value</i>）。

<!-- An excellent use case for Redis is to use it as a <i>cache</i>. Caches are often used to store data that is otherwise slow to fetch and save the data until it's no longer valid. After the cache becomes invalid, you would then fetch the data again and store it in the cache. -->
Redis 的一个很好的用例是将其用作<i>缓存</i>。缓存通常用于存储在其他情况下获取速度较慢的数据，并将其保存到不再有效。当其不再有效时，需要再次获取数据并将其存储到缓存中。

<!-- Redis has nothing to do with containers. But since we are already able to add <i>any</i> 3rd party service to your applications, why not learn about a new one. -->
Redis 与容器无关。但是既然我们已经能够向您的应用程序添加<i>任何</i> 三方服务，为什么不了解一个新的服务呢。

</div>

<div class="tasks">

### Exercises 12.9. - 12.11.
练习 12.9 - 12.11

#### Exercise 12.9: Setup redis to project
练习 12.9：设置 redis 到项目

<!-- The Express server has already been configured to use Redis, and it is only missing the *REDIS_URL* environment variable. The application will use that environment variable to connect to the Redis. Read through the [Docker Hub page for Redis](https://hub.docker.com/_/redis), add Redis to the <i>todo-app/todo-backend/docker-compose.dev.yml</i> by defining another service after mongo: -->

Express 服务器已经配置好来使用Redis了，现在只是缺少 *REDIS_URL* 环境变量。应用会使用该环境变量来连接到Redis。通读 [Docker Hub page for Redis](https://hub.docker.com/_/redis) ，将Redis 添加到 <i>todo-app/todo-backend/docker-compose.dev.yml</i> ，在mongo服务后面添加定义内容。


```yml
services:
  mongo:
    ...
  redis:
    ???
```

<!-- Since the Docker Hub page doesn't have all info, we can use Google to aid us. The default port for Redis is found by doing so: -->
由于 Docker Hub 页面没有所有信息，我们可以使用 Google 来帮助我们。通过这样做可以找到 Redis 的默认端口：

![](../../images/12/redis_port_by_google.png)

<!-- We won't have any idea if the configuration works unless we try it. The application will not start using Redis by itself, that shall happen in next exercise. -->
我们只有尝试，否则没法确定配置是否好用。应用不会自己使用Redis，下个练习中会这么做。

<!-- Once Redis is configured and started, restart the backend and give it the <i>REDIS\_URL</i>, that has the form <i>redis://host:port</i> -->
一旦Redis 配置好并且启动了，重启后台并修改 <i>REDIS\_URL</i> ，形式例如<i>redis://host:port</i>

```bash
$ REDIS_URL=insert-redis-url-here MONGO_URL=mongodb://localhost:3456/the_database npm run dev
```

<!-- You can now test the configuration by adding the line -->
你现在可以测试配置了，添加如下行

```js
const redis = require('../redis')
```

<!-- to the Express server eg. in file <i>routes/index.js</i>. If nothing happens, the configuration is done right. If not, the server crashes: -->
到 Express服务器，例如在文件  <i>routes/index.js</i> 中。如果啥也没发生，配置就是正确的，否则服务器就挂了。

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
练习 12.10：

<!-- The project already has [https://www.npmjs.com/package/redis](https://www.npmjs.com/package/redis) installed and two functions "promisified" - getAsync and setAsync. -->
该项目已经安装了 [https://www.npmjs.com/package/redis](https://www.npmjs.com/package/redis) 和两个函数“promisified”——getAsync 和 setAsync。

<!-- - setAsync function takes in key and value, using the key to store the value. -->

<!-- - getAsync function takes in key and returns the value in a promise. -->

- setAsync 函数接收键和值，使用键来存储值。

- getAsync 函数接受键并在承诺中返回值。

<!-- Implement a todo counter that saves the number of created todos to Redis: -->
实现一个待办事项计数器，将创建代办的数量存入Redis：

<!-- - Step 1: Whenever a request is sent to add a todo, increment the counter by one.
- Step 2: Create a GET /statistics endpoint where you can ask the usage metadata. The format should be the following JSON: -->

- 第 1 步：每当发送添加待办事项的请求时，将计数器加 1。
- 第 2 步：创建一个 GET /statistics 端点，您可以在其中询问使用情况元数据。格式应为以下 JSON：

```json
{
  "added_todos": 0,
}
```

#### Exercise 12.11:
  
<!-- > Use _script_ to record what you do, save the file as script-answers/exercise12_11.txt -->
使用 _script_ 来记录你的所得，将文件保存到 script-answers/exercise12_11.txt

<!-- If the application does not behave as expected, a direct access to the database may be beneficial in pinpointing problems. Let us try out how [redis-cli](https://redis.io/topics/rediscli) can be used to access the database. -->
如果应用运行情况与预期不同，一个直接访问数据库的方式可能精准地找到问题。我们尝试使用 [redis-cli](https://redis.io/topics/rediscli) 来访问Redis 数据库

<!-- - Go to the redis container with _docker exec_ and open the redis-cli.
- Find the key you used with _[KEYS *](https://redis.io/commands/keys)_ 
- Check the value of the key with command [GET](https://redis.io/commands/get)
- Set the value of the counter to 9001, find the right command from [here](https://redis.io/commands/) 
- Make sure that the new value works by refreshing the page http://localhost:3000/statistics
- Create a new todo with postman and ensure from redis-cli that the counter has increased accordingly
- Delete the key from cli and ensure that counter works when new todos are added -->

- 利用 _docker exec_ 去redis 容器中，并打开redis-cli。
- 通过 _[KEYS *](https://redis.io/commands/keys)_ 找到您使用的key
- 用 _[GET](https://redis.io/commands/get)_ 检查key的value。
- 到9001设置计数器的值，从 [这里](https://redis.io/commands/) 找到正确的命令。
- 确保刷新页面 会更新值。
- 利用postman 创建一个新的todo，并确保利用redis-cli 发现计数器如愿增加
- 从cli中删除key，并确保计数器生效。


</div>

<div class="content">

#### Persisting data with Redis
使用 Redis 持久化数据

<!-- In the previous section, it was mentioned that <i>by default</i> Redis does not persist the data. However, the persistence is easy to toggle on. We only need to start the Redis with a different command, as instructed by the [Docker hub page](https://hub.docker.com/_/redis): -->
在上一节中，提到过 <i>默认设置下</i> Redis 不会持久化数据。但是，持久化很容易打开。我们只需要按照  [Docker hub page](https://hub.docker.com/_/redis) 页面的指示使用不同的命令启动 Redis：

```yml
services:
  redis:
    # Everything else
    command: ['redis-server', '--appendonly', 'yes'] # Overwrite the CMD
    volumes: # Declare the volume
      - ./redis_data:/data
```

<!-- The data will now be persisted to directory <i>redis_data</i> of the host machine.  -->
数据现在会持久化到宿主机的 <i>redis_data</i> 文件夹下了。

<!-- Remember to add the directory to .gitignore. -->
请记住将目录添加到 .gitignore。

#### Other functionality Redis has
Redis 的其他功能

<!-- In addition to the GET, SET and DEL operations on keys and values, Redis can do also a quite a lot more. It can for example automatically expire keys, that is a very useful feature when Redis is used as a cache. -->
除了最基本的对key和value的 GET, SET 和 DEL 操作，Redis 还能做许多其他工作。比如 Redis 还可以自动使键自动过期，这在Redis 作为缓存使用时是一个很有用的特性。

<!-- Redis can also be used to implement so called [publish-subscribe](https://en.wikipedia.org/wiki/Publish%E2%80%93subscribe_pattern) (or PubSub) pattern that is a asynchronous communication mechanism for distributed applications. In this scenario Redis works as a <i>message broker</i> between two or more applications. Some of the applications are <i>publishing</i> messages by sending those to Redis, that on arrival of a message, informs the parties that have <i>subscribed</i> to those messages.  -->

Redis 还可以用于发布消息和订阅消息[publish-subscribe](https://en.wikipedia.org/wiki/Publish%E2%80%93subscribe_pattern)（也叫PubSub）模式。这是对分布式应用的异步通讯机制。在该场景下，Redis 充当两个或多个应用程序之间的<i>消息代理</i>，其中一个通过将消息发送到 redis 来<i>发布</i>消息，另一个<i>订阅</i>这些消息。

</div>

<div class="tasks">

### Exercises 12.12.
练习 12.12  
#### Exercise 12.12: Persisting data in redis
在 redis 中持久化数据

<!-- Check that the data is not persisted by default: after running _docker-compose -f docker-compose.dev.yml down_ and _docker-compose -f docker-compose.dev.yml up_ the counter value is reset to 0. -->

注意数据默认不持久化，即运行_docker-compose -f docker-compose.dev.yml down_ 和 _docker-compose -f docker-compose.dev.yml up_ 后运行后计数器的值重置为0。

<!-- Then create a volume for Redis data (by mofifying <i>todo-app/todo-backend/docker-compose.dev.yml </i>) and make sure that the data survives after running _docker-compose -f docker-compose.dev.yml down_ and _docker-compose -f docker-compose.dev.yml up_. -->

下面为 redis 数据创建一个卷（通过修改 <i>todo-app/todo-backend/docker-compose.dev.yml </i> 实现）并确保数据在运行了 _docker-compose -f docker-compose.dev.yml down_ 和 _docker-compose -f docker-compose.dev.yml up_ 之后仍能保存。

</div>
