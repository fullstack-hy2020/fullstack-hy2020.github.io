---
mainImage: ../../../images/part-12.svg
part: 12
letter: b
lang: zh
---

<div class="content">


<!-- In the previous section, we used two different base images: ubuntu and node and did some manual work to get a simple "Hello, World!" running. The tools and commands we learned during that process will be helpful. In this section, we will learn how to build images and configure environments for our applications. We will start with a regular Express/Node.js backend and build on top of that with other services, including a MongoDB database.-->
在上一节中，我们使用了两种不同的基础镜像：ubuntu和node，并通过一些手动工作来让一个简单的“Hello，World！”运行起来。我们在这个过程中学到的工具和命令会很有帮助。在本节中，我们将学习如何构建镜像和为我们的应用程序配置环境。我们将从一个常规的Express/Node.js后端开始，并在其上构建其他服务，包括MongoDB数据库。

### Dockerfile

<!-- Instead of modifying a container by copying files inside, we can create a new image that contains the "Hello, World!" application. The tool for this is the Dockerfile. Dockerfile is a simple text file that contains all of the instructions for creating an image. Let's create an example Dockerfile from the "Hello, World!" application.-->
替代通过复制文件到容器内修改容器，我们可以创建一个包含"Hello, World!"应用的新镜像。这个工具就是Dockerfile。Dockerfile是一个简单的文本文件，包含了创建镜像所需的所有指令。让我们从"Hello, World!"应用来创建一个示例Dockerfile。

<!-- If you did not already, create a directory on your machine and create a file called <i>Dockerfile</i> inside that directory. Let's also put an <i>index.js</i> containing _console.log('Hello, World!'')_ next to the Dockerfile. Your directory structure should look like this:-->
如果你还没有，在你的机器上创建一个目录，并在该目录中创建一个名为<i>Dockerfile</i>的文件。 我们还可以在Dockerfile旁边放一个<i>index.js</i>，其中包含_console.log('Hello, World!')_。 你的目录结构应该如下所示：

```
├── index.js
└── Dockerfile
```

<!-- inside that Dockerfile we will tell the image three things:-->
在Dockerfile里，我们会告诉镜像三件事：

<!-- - Use the node:16 as the base for our image-->
使用节点：16作为我们的图像基础
<!-- - Include the index.js inside the image, so we don''t need to manually copy it into the container-->
将index.js包含在图像中，这样我们就不需要手动将其复制到容器中了。
<!-- - When we run a container from the image, use Node to execute the index.js file.-->
当我们从镜像运行容器时，使用Node执行index.js文件。

<!-- The wishes above will translate into a basic Dockerfile. The best location to place this file is usually at the root of the project.-->
以上的愿望将转化为基本的Dockerfile。最佳的放置此文件的位置通常是项目的根目录。

<!-- The resulting <i>Dockerfile</i> looks like this:-->
结果的<i>Dockerfile</i>看起来像这样：

```Dockerfile
FROM node:16

WORKDIR /usr/src/app

COPY ./index.js ./index.js

CMD node index.js
```

<!-- FROM instruction will tell Docker that the base for the image should be node:16. COPY instruction will copy the file <i>index.js</i> from the host machine to the file with the same name in the image. CMD instruction tells what happens when _docker run_ is used. CMD is the default command that can then be overwritten with the parameter given after the image name. See _docker run --help_ if you forgot.-->
FROM：告诉Docker镜像的基础应该是node：16。COPY指令将主机机器上的文件<i>index.js</i>复制到镜像中同名的文件中。CMD指令告诉_docker run_被使用时会发生什么。CMD是可以被图像名称后面的参数覆盖的默认命令。如果您忘记了，请参阅_docker run --help_。

<!-- The WORKDIR instruction was slipped in to ensure we don't interfere with the contents of the image. It will guarantee all of the following commands will have <i>/usr/src/app</i> set as the working directory. If the directory doesn't exist in the base image, it will be automatically created.-->
WORKDIR 指令被插入以确保我们不会干扰镜像的内容。它将保证所有以下命令都将 <i>/usr/src/app</i> 设置为工作目录。如果该目录在基础镜像中不存在，它将被自动创建。

<!-- If we do not specify a WORKDIR, we risk overwriting important files by accident. If you check the root (_/_) of the node:16 image with _docker run node:16 ls_, you can notice all of the directories and files that are already included in the image.-->
如果我们没有指定一个WORKDIR，我们就有可能会意外地覆盖重要文件。如果你用`docker run node:16 ls`检查node:16镜像的根(_/_)，你就会注意到所有包含在镜像中的目录和文件。

<!-- Now we can use the command _docker build_ to build an image based on the Dockerfile. Let's spice up the command with one additional flag: _-t_, this will help us name the image:-->
现在我们可以使用命令_docker build_根据Dockerfile构建一个镜像。让我们使用一个额外的标志来丰富这个命令：_-t_，这将帮助我们给镜像命名。

```bash
$ docker build -t fs-hello-world .
[+] Building 3.9s (8/8) FINISHED
...
```

<!-- So the result is "Docker please build with tag (you may think the tag to be the name of the resulting image) fs-hello-world the Dockerfile in this directory". You can point to any Dockerfile, but in our case, a simple dot will mean the Dockerfile in <i>this</i> directory. That is why the command ends with a period. After the build is finished, you can run it with _docker run fs-hello-world_:-->
所以结果是"Docker请使用标签（您可以将标签视为生成的镜像的名称）fs-hello-world在这个目录中构建Dockerfile"。您可以指向任何Dockerfile，但是在我们的例子中，简单的点意味着<i>这个</i>目录中的Dockerfile。这就是为什么命令以句号结尾。构建完成后，您可以使用_docker run fs-hello-world_运行它：

```bash
$ docker run fs-hello-world
Hello, World
```

<!-- As images are just files, they can be moved around, downloaded and deleted. You can list the images you have locally with _docker image ls_, delete them with _docker image rm_. See what other command you have available with _docker image --help_.-->
当图像只是文件时，它们可以移动，下载和删除。您可以使用_docker image ls_列出本地拥有的图像，使用_docker image rm_删除它们。使用_docker image --help_查看您可用的其他命令。

<!-- One more thing: in above it was mentioned that the default command, defined by the CMD in the Dockerfile, can be overridden if needed. We could e.g. open a bash session to the container and observe it's content:-->
最后一件事：在上面提到，Dockerfile中定义的CMD默认命令可以在需要时被覆盖。例如，我们可以打开一个bash会话来观察容器的内容：

```bash
$ docker run -it fs-hello-world bash
root@2932e32dbc09:/usr/src/app# ls
index.js
root@2932e32dbc09:/usr/src/app#
```

### More meaningful image

<!-- Moving an Express server to a container should be as simple as moving the "Hello, World!" application inside a container. The only difference is that there are more files. Thankfully _COPY_ instruction can handle all that. Let's delete the index.js and create a new Express server. Lets use [express-generator](https://expressjs.com/en/starter/generator.html) to create a basic Express application skeleton.-->
移动一个Express服务到容器里应该和移动"Hello, World!"应用程序到容器里一样简单。唯一的不同之处在于文件数量更多。幸运的是，_COPY_指令可以处理所有这些。让我们删除index.js并创建一个新的Express服务器。让我们使用[express-generator](https://expressjs.com/en/starter/generator.html)来创建一个基本的Express应用程序骨架。

```bash
$ npx express-generator
  ...

  install dependencies:
    $ npm install

  run the app:
    $ DEBUG=playground:* npm start
```

<!-- First, let's run the application to get an idea of what we just created. Note that the command to run the application may be different from you, my directory was called playground.-->
首先，让我们运行应用程序，以便了解我们刚刚创建的内容。注意，运行应用程序的命令可能与您不同，我的目录被称为playground。

```bash
$ npm install
$ DEBUG=playground:* npm start
  playground:server Listening on port 3000 +0ms
```

<!-- Great, so now we can navigate to [http://localhost:3000](http://localhost:3000) and the app is running there.-->
好的，现在我们可以导航到[http://localhost:3000](http://localhost:3000)，应用程序就在那里运行了。

<!-- Containerizing that should be relatively easy based on the previous example.-->
容器化应该根据先前的例子相对容易。

<!-- - Use node as base-->
使用节点作为基础
<!-- - Set working directory so we don''t interfere with the contents of the base image-->
设置工作目录，以免干扰基础镜像的内容
<!-- - Copy ALL of the files in this directory to the image-->
directory

复制这个目录中的所有文件到图像目录中
<!-- - Start with DEBUG=playground:* npm start-->
DEBUG=playground:* npm start 
调试=操场：* npm开始


<!-- Let's place the following Dockerfile at the root of the project:-->
让我们把下面的Dockerfile放在项目的根目录：

```Dockerfile
FROM node:16

WORKDIR /usr/src/app

COPY . .

CMD DEBUG=playground:* npm start
```

<!-- Let's build the image from the Dockerfile with a command, _docker build -t express-server ._ and run it with _docker run -p 3123:3000 express-server_. The _-p_ flag will inform Docker that a port from the host machine should be opened and directed to a port in the container. The format for is _-p host-port:application-port_.-->
让我们用一个命令从Dockerfile构建镜像，`docker build -t express-server .`，并用`docker run -p 3123:3000 express-server`来运行它。`-p`标志将告诉Docker，主机机器上的一个端口应该被打开并重定向到容器中的一个端口。格式为`-p host-port:application-port`。

```bash
$ docker run -p 3123:3000 express-server

> playground@0.0.0 start
> node ./bin/www

Tue, 29 Jun 2021 10:55:10 GMT playground:server Listening on port 3000
```

<!-- > If yours doesn''t work, skip to the next section. There is an explanation why it may not work even if you followed the steps correctly.-->
如果你的不起作用，跳到下一节。即使你按照步骤正确操作，也有可能不起作用的解释。

<!-- The application is now running! Let's test it by sending a GET request to [http://localhost:3123/](http://localhost:3123/).-->
应用程序现在正在运行！让我们通过发送GET请求到[http://localhost:3123/](http://localhost:3123/)来测试它。

<!-- Shutting it down is a headache at the moment. Use another terminal and _docker kill_ command to kill the application. The _docker kill_ will send a kill signal (SIGKILL) to the application to force it to shut down. It needs the name or id of the container as an argument.-->
关闭它现在是一个头痛。使用另一个终端和`docker kill`命令来杀死应用程序。`docker kill`将发送一个杀死信号(SIGKILL)到应用程序，强制它关闭。它需要容器的名称或ID作为参数。

<!-- By the way, when using id as the argument, the beginning of the ID is enough for Docker to know which container we mean.-->
顺便提一句，当使用ID作为参数时，只需要ID的开头就足以让Docker知道我们指的是哪个容器了。

```bash
$ docker container ls
  CONTAINER ID   IMAGE            COMMAND                  CREATED         STATUS         PORTS                                       NAMES
  48096ca3ffec   express-server   "docker-entrypoint.s…"   9 seconds ago   Up 6 seconds   0.0.0.0:3123->3000/tcp, :::3123->3000/tcp   infallible_booth

$ docker kill 48
  48
```

<!-- In the future, let's use the same port on both sides of _-p_. Just so we don't have to remember which one we happened to choose.-->
未来，让我们在_-p_的两边都使用同一个端口，这样我们就不用记住我们恰巧选择了哪一个。

#### Fixing potential issues we created by copy-pasting

<!-- There are a few steps we need to change to create a more comprehensive Dockerfile. It may even be that the above example doesn''t work in all cases because we skipped an important step.-->
有几个步骤我们需要改变来创建一个更全面的Dockerfile。甚至可能上面的例子并不能在所有情况下都起作用，因为我们跳过了一个重要的步骤。

<!-- When we ran npm install on our machine, in some cases the **Node package manager** may install operating system specific dependencies during the install step. We may accidentally move non-functional parts to the image with the COPY instruction. This can easily happen if we copy the <i>node_modules</i> directory into the image.-->
当我们在机器上运行npm install时，在某些情况下，**节点软件包管理器**可能会在安装步骤中安装操作系统特定的依赖项。我们可能会意外地将非功能部件移动到COPY指令的图像中。如果我们将<i>node_modules</i>目录复制到图像中，这很容易发生。

<!-- This is a critical thing to keep in mind when we build our images. It's best to do most things, such as to run _npm install_ during the build process <i>inside the container</i> rather than doing those prior to building. The easy rule of thumb is to only copy files that you would push to GitHub. Build artefacts or dependencies should not be copied since those can be installed during the build process.-->
这是在构建我们的镜像时要牢记的一件关键的事情。最好在容器内部执行大多数操作，例如运行_npm install_，而不是在构建之前进行这些操作。简单的经验法则是只复制你会推送到GitHub的文件。构建成果或依赖项不应该被复制，因为这些可以在构建过程中安装。

<!-- We can use <i>.dockerignore</i> to solve the problem. The file .dockerignore is very similar to .gitignore, you can use that to prevent unwanted files from being copied to your image. The file should be placed next to the Dockerfile. Here is a possible content of a <i>.dockerignore</i>-->
file:

我们可以使用<i>.dockerignore</i>来解决这个问题。.dockerignore文件与.gitignore文件非常相似，你可以使用它来防止不需要的文件被复制到你的镜像中。该文件应该放在Dockerfile旁边。以下是一个<i>.dockerignore</i>文件可能的内容：

```
.dockerignore
.gitignore
node_modules
Dockerfile
```

<!-- However, in our case the .dockerignore isn''t the only thing required. We will need to install the dependencies during the build step. The _Dockerfile_ changes to:-->
然而，在我们的情况下，`.dockerignore`不是唯一需要的东西。我们将在构建步骤期间安装依赖项。_Dockerfile_更改为：

```Dockerfile
FROM node:16

WORKDIR /usr/src/app

COPY . .

RUN npm install # highlight-line

CMD DEBUG=playground:* npm start
```

<!-- The npm install can be risky. Instead of using npm install, npm offers a much better tool for installing dependencies, the _ci_ command.-->
npm 安装可能有风险。npm 提供了一个更好的工具来安装依赖，即_ci_命令，而不是使用 npm install。

<!-- Differences between ci and install:-->
## 区别：ci 和 install
- **ci**：持续集成（Continuous Integration），是一种软件开发实践，即团队开发成员经常集成他们的工作，通常每个成员每天至少集成一次。每次集成都通过自动化的构建（build），测试（tests）和部署（deploy）过程来验证，从而尽早地发现集成错误。
- **install**：安装是指将软件安装到计算机上，使其能够正常运行，以满足用户的需求。安装过程中，可能需要用户按照提示操作，完成安装配置，以达到正确使用软件的目的。

<!-- - install may update the package-lock.json-->
安装可能会更新`package-lock.json`。
<!-- - install may install a different version of a dependency if you have ^ or ~ in the version of the dependency.-->
安装可能会安装依赖项的不同版本，如果依赖项的版本中有^或~。

<!-- - ci will delete the node_modules folder before installing anything-->
- ci 在安装任何东西之前会删除 node_modules 文件夹。
<!-- - ci will follow the package-lock.json and does not alter any files-->
ci 将遵循 package-lock.json，不会改变任何文件。

<!-- So in short: _ci_ creates reliable builds, while _install_ is the one to use when you want to install new dependencies.-->
所以简而言之：_ci_ 创建可靠的构建，而 _install_ 是当你想安装新的依赖时使用的。

<!-- As we are not installing anything new during the build step, and we don''t want the versions to suddenly change, we will use _ci_:-->
正因为我们在构建步骤中没有安装任何新的东西，而且我们不希望版本突然改变，所以我们将使用_ci_：

```Dockerfile
FROM node:16

WORKDIR /usr/src/app

COPY . .

RUN npm ci # highlight-line

CMD DEBUG=playground:* npm start
```

<!-- Even better, we can use _npm ci --only=production_ to not waste time installing development dependencies.-->
更好的是，我们可以使用 _npm ci --only=production_ 来不浪费时间安装开发依赖关系。

<!-- > As you noticed in the comparison list; npm ci will delete the node_modules folder so creating the .dockerignore did not matter. However, .dockerignore is an amazing tool when you want to optimize your build process. We will talk briefly about these optimizations later.-->
> 如你从比较列表中注意到的；npm ci 会删除 node_modules 文件夹，因此创建 .dockerignore 没有什么意义。然而，当你想要优化你的构建过程时，.dockerignore 是一个很棒的工具。我们稍后会简单谈谈这些优化。

<!-- Now the Dockerfile should work again, try it with _docker build -t express-server . && docker run -p 3123:3000 express-server_-->
现在Dockerfile应该可以再次正常工作，试试 _docker build -t express-server . && docker run -p 3123:3000 express-server_

<!-- > Note that we are here chaining two bash commands with &&. We could get (nearly) the same effect by running both commands separately. When chaining commands with && if one command fails, the next ones in the chain will not be executed.-->
> 注意我们此处用&&来连接两个bash命令。我们可以单独运行这两个命令来达到（几乎）相同的效果。当用&&连接命令时，如果一个命令失败，那么链中的其他命令将不会被执行。

<!-- We set an environment variable _DEBUG=playground:*_ during CMD for the npm start. However, with Dockerfiles we could also use the instruction ENV to set environment variables. Let's do that:-->
我们在CMD中设置了一个环境变量_DEBUG=playground:*_用于npm start。但是，我们也可以使用指令ENV来设置环境变量。让我们来做吧：

```Dockerfile
FROM node:16

WORKDIR /usr/src/app

COPY . .

RUN npm ci

ENV DEBUG=playground:* # highlight-line

CMD npm start # highlight-line
```

<!-- > <i>If you''re wondering what the DEBUG environment variable does, read [here](http://expressjs.com/en/guide/debugging.html#debugging-express).</i>-->
> 如果你想知道DEBUG环境变量的作用，可以参考[这里](http://expressjs.com/en/guide/debugging.html#debugging-express)。

#### Dockerfile best practices

<!-- There are 2 rules of thumb you should follow when creating images:-->
1. 使用高质量的图片
2. 保证图片尺寸适合你的内容

<!-- - Try to create as **secure** of an image as possible-->
尽可能创建一个**安全**的图像
<!-- - Try to create as **small** of an image as possible-->
尽量创建**小**的图像

<!-- Smaller images are more secure by having less attack surface area, and smaller images also move faster in deployment pipelines.-->
小型的图像拥有较少的攻击面积，因此更加安全，而且小型的图像在部署管道中传输更快。

<!-- Snyk has a great list of 10 best practices for Node/Express containerization. Read those [here](https://snyk.io/blog/10-best-practices-to-containerize-nodejs-web-applications-with-docker/).-->
Snyk有一个很棒的Node/Express容器化十大最佳实践清单。[点击这里](https://snyk.io/blog/10-best-practices-to-containerize-nodejs-web-applications-with-docker/)阅读。

<!-- One big carelessness we have left is running the application as root instead of using a user with lower privileges. Let's do a final fix to the Dockerfile:-->
一个我们遗留下来的大疏忽是以root用户而不是使用拥有较低权限的用户来运行应用程序。让我们对Dockerfile做一个最终修复：

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

<!-- The repository you cloned or copied in the [first exercise](/en/part12/introduction_to_containers#exercise-12-1) contains a todo-app. See the todo-app/todo-backend and read through the README. We will not touch the todo-frontend yet.-->
你在[第一个练习](/en/part12/introduction_to_containers#exercise-12-1)中克隆或复制的存储库包含一个todo-app。请参阅todo-app/todo-backend并阅读README。我们现在不会接触todo-frontend。

<!-- Step 1. Containerize the todo-backend by creating a <i>todo-app/todo-backend/Dockerfile</i> and building an image.-->
步骤1. 通过创建<i>todo-app/todo-backend/Dockerfile</i>并构建镜像来容器化todo-backend。

<!-- Step 2. Run the todo-backend image with the correct ports open. Make sure the visit counter increases when used through a browser in http://localhost:3000/ (or some other port if you configure so)-->
步骤2. 使用正确的端口运行todo-backend镜像。确保在浏览器中访问http://localhost:3000/（或者如果您配置其他端口，则访问其他端口）时，访问计数器会增加。

<!-- Tip: Run the application outside of a container to examine it before starting to containerize.-->
提示：在开始容器化之前，先在容器外运行应用程序以进行检查。

</div>

<div class="content">

### Using Docker compose

<!-- In the previous section, we created an Express server and knew that it runs in port 3000, and ran it with _docker build -t express-server . && docker run -p 3000:3000 express-server_. This already looks like something you would need to put into a script to remember. Fortunately, Docker offers us a better solution.-->
在前一节中，我们创建了一个Express服务器，知道它运行在端口3000，并用`docker build -t express-server . && docker run -p 3000:3000 express-server`运行它。这看起来像你需要把它放进一个脚本来记住。幸运的是，Docker为我们提供了一个更好的解决方案。

<!-- [Docker compose](https://docs.docker.com/compose/) is another fantastic tool, which can help us to manage containers. Let's start using compose as we learn more about containers as it will help us save some time with the configuration.-->
[Docker Compose](https://docs.docker.com/compose/)是另一个奇妙的工具，它可以帮助我们管理容器。随着我们对容器的了解越来越深入，让我们开始使用Compose来帮助我们节省配置的时间。

<!-- Now we can turn the previous spell into a yaml file. The best part about yaml files is that you can save these to a Git repository!-->
现在我们可以把之前的spell转换成yaml文件。最棒的是，你可以把这些文件保存到Git仓库中！

<!-- Create the file **docker-compose.yml** and place it at the root of the project, next to the Dockerfile. The file content is-->
as follows:

在项目的根目录下创建**docker-compose.yml**文件，并将其放置在Dockerfile旁边。文件内容如下：

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
# 英文原文
The meaning of each line is explained as a comment. If you want to see the full specification see the [documentation](https://docs.docker.com/compose/compose-file/compose-file-v3/).

# 中文翻译
每一行的意思都会在注释中解释。如果想查看完整的规范，可以参见[文档](https://docs.docker.com/compose/compose-file/compose-file-v3/)。

<!-- Now we can use _docker compose up_ to build and run the application. If we want to rebuild the images we can use _docker compose up --build_.-->
现在我们可以使用_docker compose up_来构建和运行应用程序。如果我们想重新构建镜像，可以使用_docker compose up --build_。

<!-- You can also run the application in the background with _docker compose up -d_ (_-d_ for detached) and close it with _docker compose down_.-->
你也可以用 _docker compose up -d_ (_-d_ 表示分离) 在后台运行应用程序，用 _docker compose down_ 关闭它。

<!-- > <i>Note that some older Docker versions (especially in Windows ) do not support the  command _docker compose_. One way to circumvent this problem is to [install](https://docs.docker.com/compose/install/) the stand alone command _docker-compose_ that works mostly similarly to _docker compose_. However, the preferable fix is to update the Docker to a more recent version.</i>-->
> <i>注意，一些较旧的 Docker 版本（特别是在 Windows 上）不支持命令 _docker compose_。解决这个问题的一种方法是安装独立的命令 _docker-compose_，它的工作方式与 _docker compose_ 类似。但是，更好的解决方案是将 Docker 升级到更新的版本。</i>

<!-- Creating files like _docker-compose.yml_ that <i>declare</i> what you want instead of script files that you need to run in a specific order / a specific number of times is often a great practice.-->
创建像_docker-compose.yml_这样的文件，<i>声明</i>你想要什么，而不是需要按照特定顺序/特定次数运行的脚本文件，通常是一个很好的做法。

</div>

<div class="tasks">

### Exercise 12.6.

#### Exercise 12.6: Docker compose

<!-- Create a <i>todo-app/todo-backend/docker-compose.yml</i> file that works with the Node application from the previous exercise.-->
创建一个<i>todo-app/todo-backend/docker-compose.yml</i>文件，它能够与前面练习中的Node应用一起工作。

<!-- The visit counter is the only feature that is required to be working.-->
访问计数器是唯一需要正常工作的功能。

</div>

<div class="content">

### Utilizing containers in development

<!-- When you are developing software, containerization can be used in various ways to improve your quality of life. One of the most useful cases is by bypassing the need to install and configure tools twice.-->
当你开发软件时，容器化可以用于多种方式来改善你的生活质量。其中最有用的一种情况就是无需两次安装和配置工具。

<!-- It may not be the best option to move your entire development environment into a container, but if that's what you want it's certainly possible. We will revisit this idea at the end of this part. But until then, <i>run the Node application itself outside of containers</i>.-->
可能把你的整个开发环境移植到容器中不是最好的选择，但如果你这样想的话，当然是可行的。我们会在本部分结束时重新审视这个想法。但在此之前，<i>把Node应用本身放在容器之外运行</i>。

<!-- The application we met in the previous exercises uses MongoDB. Let's explore [Docker Hub](https://hub.docker.com/) to find a MongoDB image. Docker Hub is the default place where Docker pulls the images from, you can use other registries as well, but since we are already knee-deep in Docker it's a good choice. With a quick search, we can find [https://hub.docker.com/_/mongo](https://hub.docker.com/_/mongo)-->
在之前的练习中我们碰到的应用程序使用MongoDB。让我们探索[Docker Hub](https://hub.docker.com/)来找到一个MongoDB镜像。Docker Hub是Docker拉取图像的默认位置，您也可以使用其他注册表，但由于我们已经深陷于Docker中，因此它是一个不错的选择。通过快速搜索，我们可以找到[https://hub.docker.com/_/mongo](https://hub.docker.com/_/mongo)

<!-- Create a new yaml called <i>todo-app/todo-backend/docker-compose.dev.yml</i> that looks like following:-->
创建一个新的yaml文件，叫做<i>todo-app/todo-backend/docker-compose.dev.yml</i>，内容如下：

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
两个上面定义的环境变量的含义在Docker Hub页面上有解释：

<!-- > <i>These variables, used in conjunction, create a new user and set that user's password. This user is created in the admin authentication database and given the role of root, which is a "superuser" role.</i>-->
> <i>这些变量结合在一起，创建一个新用户并设置该用户的密码。 这个用户在管理员验证数据库中创建，并赋予根角色，这是一个“超级用户”角色。</i>

<!-- The last environment variable *MONGO\_INITDB\_DATABASE* will tell MongoDB to create a database with that name.-->
最后一个环境变量*MONGO\_INITDB\_DATABASE*将告诉MongoDB创建一个同名的数据库。

<!-- You can use _-f_ flag to specify a <i>file</i> to run the Docker Compose command with e.g.-->
你可以使用 _-f_ 标志来指定一个 <i>文件</i> 来运行 Docker Compose 命令，例如。

```bash
docker compose -f docker-compose.dev.yml up
```

<!-- Now that we may have multiple it's useful.-->
现在我们可能有多个它，这很有用。

<!-- Now start the MongoDB with _docker compose -f docker-compose.dev.yml up -d_. With _-d_ it will run it in the background. You can view the output logs with _docker compose -f docker-compose.dev.yml logs -f_. There the _-f_ will ensure we <i>follow</i> the logs.-->
现在使用 `docker compose -f docker-compose.dev.yml up -d` 启动 MongoDB。使用 `-d` 将其在后台运行。您可以使用 `docker compose -f docker-compose.dev.yml logs -f` 查看输出日志。其中 `-f` 将确保我们<i>跟踪</i>日志。

<!-- As said previously, currently we <strong>do not</strong> want to run the Node application inside a container. Developing while the application itself is inside a container is a challenge. We will explore that option later in this part.-->
正如之前所说，我们<strong>不想</strong>将Node应用程序放在容器中运行。在应用程序本身在容器中开发是一个挑战。我们将在本节的后面探索这个选项。

<!-- Run the good old _npm install_ first on your machine to set up the Node application. Then start the application with the relevant environment variable. You can modify the code to set them as the defaults or use the .env file. There is no hurt in putting these keys to GitHub since they are only used in your local development environment. I''ll just throw them in with the _npm run dev_ to help you copy-paste.-->
首先在您的机器上运行传统的`npm install`，以设置Node应用程序。然后使用相关环境变量启动应用程序。您可以修改代码将它们设置为默认值，或使用.env文件。将这些键放到GitHub上没有任何损害，因为它们只在本地开发环境中使用。我会在`npm run dev`中把它们放进去，以帮助您复制粘贴。

```bash
$ MONGO_URL=mongodb://localhost:3456/the_database npm run dev
```

<!-- This won''t be enough; we need to create a user to be authorized inside of the container. The url http://localhost:3000/todos leads to an authentication error:-->
这还不够；我们需要在容器内创建一个用户才能授权。URL http://localhost:3000/todos 导致认证错误：

```bash
[nodemon] 2.0.12
[nodemon] to restart at any time, enter `rs`
[nodemon] watching path(s): *.*
[nodemon] watching extensions: js,mjs,json
[nodemon] starting `node ./bin/www`
/Users/mluukkai/dev/fs-ci-lokakuu/repo/todo-app/todo-backend/node_modules/mongodb/lib/cmap/connection.js:272
          callback(new MongoError(document));
                   ^
MongoError: command find requires authentication
    at MessageStream.messageHandler (/Users/mluukkai/dev/fs-ci-lokakuu/repo/todo-app/todo-backend/node_modules/mongodb/lib/cmap/connection.js:272:20)
```

### Bind mount and initializing the database

<!-- In the [MongoDB Docker Hub](https://hub.docker.com/_/mongo) page under "Initializing a fresh instance" is the info on how to execute JavaScript to initialize the database and an user for it.-->
在[MongoDB Docker Hub](https://hub.docker.com/_/mongo) 页面下的“初始化新实例”中有如何执行JavaScript来初始化数据库和用户的信息。

<!-- The exercise project has file <i>todo-app/todo-backend/mongo/mongo-init.js</i> with contents:-->
<i>todo-app/todo-backend/mongo/mongo-init.js</i> 的内容如下：

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
这个文件将使用用户和几个todos初始化数据库。接下来，我们需要在启动时将其放入容器中。

<!-- We could create a new image FROM mongo and COPY the file inside, or we can use a [bind mount](https://docs.docker.com/storage/bind-mounts/) to mount the file <i>mongo-init.js</i> to the container. Let's do the latter.-->
我们可以从Mongo建立一个新的映像档并复制文件内部，或者我们可以使用[挂载](https://docs.docker.com/storage/bind-mounts/)将文件<i>mongo-init.js</i>挂载到容器中。让我们做后者吧。

<!-- Bind mount is the act of binding a file (or directory) on the host machine to a file (or directory) in the container. A bind mount is done by adding a _-v_ flag with _container run_. The syntax is _-v FILE-IN-HOST:FILE-IN-CONTAINER_. Since we already learned about Docker Compose let's skip that. The bind mount is declared under key <i>volumes</i> in docker-compose-yml. Otherwise the format is the same, first host and then container:-->
绑定挂载是把主机上的文件（或目录）绑定到容器中的文件（或目录）的行为。使用 _-v_ 标记和 _container run_ 命令可以实现绑定挂载。语法为 _-v FILE-IN-HOST:FILE-IN-CONTAINER_。由于我们已经学习了 Docker Compose，我们就跳过这一步吧。绑定挂载在 docker-compose-yml 文件中的 <i>volumes</i> 键下声明。格式也是一样的，先是主机，然后是容器：

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
绑定挂载的结果是，宿主机器的mongo文件夹中的<i>mongo-init.js</i>文件与容器的/docker-entrypoint-initdb.d目录中的<i>mongo-init.js</i>文件相同。对两个文件的任何更改都将在另一个文件中可用。我们在运行时不需要做任何更改，但这将是容器软件开发的关键。

<!-- Run _docker compose -f docker-compose.dev.yml down --volumes_ to ensure that nothing is left and start from a clean slate with _docker compose -f docker-compose.dev.yml up_ to initialize the database.-->
运行`docker compose -f docker-compose.dev.yml down --volumes`以确保不留下任何东西，然后从一个干净的状态开始，使用`docker compose -f docker-compose.dev.yml up`来初始化数据库。

<!-- If you see an error like this:-->
如果你看到这样的错误：

```bash
mongo_database | failed to load: /docker-entrypoint-initdb.d/mongo-init.js
mongo_database | exiting with code -3
```

<!-- you may have a read permission problem. They are not uncommon when dealing with volumes. In the above case, you can use _chmod a+r mongo-init.js_, which will give everyone read access to that file. Be careful when using _chmod_ since granting more privileges can be a security issue. Use the _chmod_ only on the mongo-init.js on your computer.-->
你可能有一个读取权限问题。在处理卷时，这种情况并不罕见。在上述情况下，你可以使用`chmod a+r mongo-init.js`，这将给每个人提供对该文件的读取权限。当使用`chmod`时要小心，因为授予更多权限可能会造成安全问题。仅在你的计算机上的`mongo-init.js`上使用`chmod`。

<!-- Now starting the Express application with the correct environment variable should work:-->
现在使用正确的环境变量启动Express应用程序应该能够正常工作：

```bash
$ MONGO_URL=mongodb://the_username:the_password@localhost:3456/the_database npm run dev
```

<!-- Let's check that the http://localhost:3000/todos returns all todos. It should return the two todos we initialized. We can and should use Postman to test the basic functionality of the app, such as adding or deleting a todo.-->
让我们检查http://localhost:3000/todos是否返回所有待办事项。它应该返回我们初始化的两个待办事项。我们可以也应该使用Postman来测试应用程序的基本功能，例如添加或删除待办事项。

### Persisting data with volumes

<!-- By default, containers are not going to preserve our data. When you close the Mongo container you may or may not be able to get the data back.-->
默认情况下，容器不会保存我们的数据。关闭Mongo容器后，可能无法恢复数据。

<!-- This is a rare case in which it does preserve the data as the developers who made the Docker image for Mongo have defined a volume to be used: [https://github.com/docker-library/mongo/blob/cb8a419053858e510fc68ed2d69415b3e50011cb/4.4/Dockerfile#L113](https://github.com/docker-library/mongo/blob/cb8a419053858e510fc68ed2d69415b3e50011cb/4.4/Dockerfile#L113) This line will instruct Docker to preserve the data in those directories.-->
这是一个罕见的情况，因为为Mongo开发的Docker镜像定义了一个要使用的卷：[https://github.com/docker-library/mongo/blob/cb8a419053858e510fc68ed2d69415b3e50011cb/4.4/Dockerfile#L113](https://github.com/docker-library/mongo/blob/cb8a419053858e510fc68ed2d69415b3e50011cb/4.4/Dockerfile#L113) 这一行指令会指示Docker保留这些目录中的数据。

<!-- There are two distinct methods to store the data:-->
有两种不同的方法来存储数据：
<!-- - Declaring a location in your filesystem (called [bind mount](https://docs.docker.com/storage/bind-mounts/))-->
声明文件系统中的一个位置（称为[绑定挂载](https://docs.docker.com/storage/bind-mounts/)）
<!-- - Letting Docker decide where to store the data ([volume](https://docs.docker.com/storage/volumes/))-->
- 让Docker决定存储数据的位置（[卷](https://docs.docker.com/storage/volumes/)）

<!-- I prefer the first choice in most cases whenever you <i>really</i> need to avoid deleting the data. Let's see both in action with docker compose:-->
我在大多数情况下都会偏好第一个选择，只要你<i>真正</i>需要避免删除数择。让我们用docker compose来看看两者的实际操作：

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
上面将会在您的本地文件系统中创建一个叫做 *mongo\_data* 的目录，并将其映射到容器中的 _/data/db_ 。这意味着 _/data/db_ 中存储的数据是存储在容器之外，但仍然可以被容器访问！只需要记住把这个目录添加到 .gitignore 中即可。

<!-- A similar outcome can be achieved with a named volume:-->
与命名卷可以实现类似的结果：

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

<!-- Now the volume is created but managed by Docker. After starting the application (_docker compose -f docker-compose.dev.yml up_) you can list the volumes with _docker volume ls_, inspect one of them with _docker volume inspect_ and even delete them with _docker volume rm_:-->
现在，卷已经被Docker创建和管理了。在启动应用程序（`docker compose -f docker-compose.dev.yml up`）之后，你可以使用`docker volume ls`列出卷，使用`docker volume inspect`检查其中一个，甚至使用`docker volume rm`删除它们：

```bash
$ docker volume ls
DRIVER    VOLUME NAME
local     todo-backend_mongo_data
$ docker volume inspect todo-backend_mongo_data
[
    {
        "CreatedAt": "2022-10-04T12:52:11Z",
        "Driver": "local",
        "Labels": {
            "com.docker.compose.project": "todo-backend",
            "com.docker.compose.version": "1.29.2",
            "com.docker.compose.volume": "mongo_data"
        },
        "Mountpoint": "/var/lib/docker/volumes/todo-backend_mongo_data/_data",
        "Name": "todo-backend_mongo_data",
        "Options": null,
        "Scope": "local"
    }
]
```

<!-- The named volume is still stored in your local filesystem but figuring out <i>where</i> may not be as trivial as with the previous option.-->
本名称的卷仍存储在您的本地文件系统中，但弄清<i>位置</i>可能不像之前的选项那么简单。

</div>

<div class="tasks">

### Exercise 12.7.

#### Exercise 12.7: Little bit of MongoDB coding

<!-- Note that this exercise assumes that you have done all the configurations made in the material after exercise 12.5. You should still run the todo-app backend <i>outside a container</i>; just the MongoDB is containerized for now.-->
注意，本练习假定你已经完成了练习 12.5 后的所有配置。你仍然应该在容器外<i>运行todo-app后端</i>；目前只有MongoDB被容器化了。

<!-- The todo application has no proper implementation of routes for getting one todo (GET <i>/todos/:id</i>) and updating one todo (PUT <i>/todos/:id</i>). Fix the code.-->
应用程序的Todo没有正确实现获取一个Todo（GET <i>/todos/:id</i>）和更新一个Todo（PUT <i>/todos/:id</i>）的路由。修复代码。

</div>

<div class="content">

### Debugging issues in containers

<!-- > <i>When coding, you most likely end up in a situation where everything is broken.</i>-->
> <i>当编码时，你很可能会遇到一切都崩溃的情况。</i>

<!-- > \- Matti Luukkainen-->
>\- 马蒂·卢坎宁

<!-- When developing with containers, we need to learn new tools for debugging, since we can not just "console.log" everything. When code has a bug, you may often be in a state where at least something works, so you can work forward from that. Configuration most often is in either of two states: 1. working or 2. broken. We will go over a few tools that can help when your application is in the latter state.-->
当使用容器开发时，我们需要学习新的调试工具，因为我们不能只是“console.log”一切。当代码出现错误时，你可能经常处于至少有一些东西可以正常工作的状态，因此你可以从那里继续工作。配置通常处于两种状态：1.正常工作或2.崩溃。我们将介绍一些可以在你的应用程序处于后者状态时帮助你的工具。

<!-- When developing software, you can safely progress step by step, all the time verifying that what you have coded behaves as expected. Often, this is not the case when doing configurations. The configuration you may be writing can be broken until the moment it is finished. So when you write a long docker-compose.yml or Dockerfile and it does not work, you need to take a moment and think about the various ways you could confirm something is working.-->
当开发软件时，您可以安全地逐步进行，一直验证您编码的内容是否符合预期。 通常，这在做配置时不是这种情况。 您可能正在编写的配置可能会在完成之前就已经损坏。 因此，当您编写一个长的docker-compose.yml或Dockerfile，而它不起作用时，您需要花一点时间思考您可以确认某些内容正在工作的各种方法。

<i>Question Everything</i> is still applicable here. As said in [part 3](/en/part3/saving_data_to_mongo_db): The key is to be systematic. Since the problem can exist anywhere, <i>you must question everything</i>, and eliminate all possible sources of error one by one.

<!-- For myself, the most valuable method of debugging is stopping and thinking about what I''m trying to accomplish instead of just bashing my head at the problem. Often there is a simple, alternate, solution or quick google search that will get me moving forward.-->
对于我自己来说，最有价值的调试方法是停下来思考我想要实现的目标，而不是简单地把头撞在问题上。通常有一个简单的替代解决方案或快速的谷歌搜索可以让我继续前进。

#### exec

<!-- The Docker command [exec](https://docs.docker.com/engine/reference/commandline/exec/) is a heavy hitter. It can be used to jump right into a container when it's running.-->
Docker 命令 [exec](https://docs.docker.com/engine/reference/commandline/exec/) 是一个重要的命令。它可以用来在容器运行时立即跳入容器。

<!-- Let's start a web server in the background and do a little bit of debugging to get it running and displaying the message "Hello, exec!" in our browser. Let's choose [Nginx](https://www.nginx.com/) which is, among other things, a server capable of serving static HTML files. It has a default index.html that we can replace.-->
让我们在后台启动一个web服务器，做一点调试，让它能够运行并在我们的浏览器中显示出“Hello, exec！”的消息。让我们选择[Nginx](https://www.nginx.com/)，它是一个能够提供静态HTML文件的服务器，它有一个默认的index.html，我们可以替换它。

```bash
$ docker container run -d nginx
```

<!-- Ok, now the questions are:-->
好的，现在问题是：

<!-- - Where should we go with our browser?-->
我们应该用浏览器去哪里？
<!-- - Is it even running?-->
- 它甚至还在运行吗？

<!-- We know how to answer the latter: by listing the running containers.-->
我们知道如何回答后者：通过列出运行的容器。

```bash
$ docker container ls
CONTAINER ID   IMAGE           COMMAND                  CREATED              STATUS                      PORTS     NAMES
3f831a57b7cc   nginx           "/docker-entrypoint.…"   About a minute ago   Up About a minute           80/tcp    keen_darwin
```

<!-- Yes! We got the first question answered as well. It seems to listen on port 80, as seen on the output above.-->
是的！我们也回答了第一个问题。看起来它在端口80上监听，如上面的输出所示。

<!-- Let's shut it down and restart with the _-p_ flag to have our browser access it.-->
让我们关闭它，并用_-p_标志重新启动，以便我们的浏览器访问它。

```bash
$ docker container stop keen_darwin
$ docker container rm keen_darwin

$ docker container run -d -p 8080:80 nginx
```

<!-- > <i>**Editor's note_** when doing development, it is **essential** to constantly follow the container logs. I'm usually not running containers in a detached mode (that is with -d) since it requires a bit of an extra effort to open the logs.-->
> <i>**编辑者提示**：在开发过程中，**至关重要**的是要不断地关注容器日志。我通常不会以分离模式（即使用-d）运行容器，因为这需要额外的精力来打开日志。
<!-- >-->
I'm sorry

> 抱歉
<!-- > When I'm 100% sure that everything works... no, when I'm 200% sure, then I might relax a bit and start the containers in detached mode. Until everything again falls apart and it is time to open the logs again.</i>-->
当我100%确定一切都运行正常...不，当我200%确定的时候，我可能会放松一下，开始以脱离模式运行容器。直到一切又再次崩溃，又是时候打开日志了。

<!-- Let's look at the app by going to http://localhost:8080. It seems that the app is showing the wrong message! Let's hop right into the container and fix this. Keep your browser open, we won''t need to shut down the container for this fix. We will execute bash inside the container, the flags _-it_ will ensure that we can interact with the container:-->
让我们通过访问http://localhost:8080来看看这个应用程序，看起来这个应用程序显示的是错误的信息！让我们直接跳进容器里来修复这个问题。保持你的浏览器打开，我们不需要关闭容器来进行这个修复。我们将在容器内执行bash，标志_-it_将确保我们可以与容器进行交互：

```bash
$ docker container ls
CONTAINER ID   IMAGE     COMMAND                  CREATED              STATUS              PORTS                                   NAMES
7edcb36aff08   nginx     "/docker-entrypoint.…"   About a minute ago   Up About a minute   0.0.0.0:8080->80/tcp, :::8080->80/tcp   wonderful_ramanujan

$ docker exec -it wonderful_ramanujan bash
root@7edcb36aff08:/#
```

<!-- Now that we are in, we need to find the faulty file and replace it. Quick Google tells us that file itself is _/usr/share/nginx/html/index.html_.-->
现在我们已经进入，我们需要找到有问题的文件并替换它。快速的谷歌告诉我们该文件本身是_/usr/share/nginx/html/index.html_。

<!-- Let's move to the directory and delete the file-->
让我们移动到该目录并删除该文件.

```bash
root@7edcb36aff08:/# cd /usr/share/nginx/html/
root@7edcb36aff08:/# rm index.html
```

<!-- Now, if we go to http://localhost:8080/ we know that we deleted the correct file. The page shows 404. Let's replace it with one containing the correct contents:-->
现在，如果我们访问http：//localhost：8080/，我们知道我们删除了正确的文件。页面显示404。让我们用一个包含正确内容的文件来替换它：

```bash
root@7edcb36aff08:/# echo "Hello, exec!" > index.html
```

<!-- Refresh the page, and our message is displayed! Now we know how exec can be used to interact with the containers. Remember that all of the changes are lost when the container is deleted. To preserve the changes, you must use _commit_ just as we did in [previous section](/en/part12/introduction_to_containers#other-docker-commands).-->
刷新页面，我们的消息就会显示出来！现在我们知道如何使用exec来与容器进行交互。请记住，当容器被删除时，所有的更改都会丢失。要保留更改，就必须像我们在[上一节](/en/part12/introduction_to_containers#other-docker-commands)中所做的那样使用_commit_。

</div>

<div class="tasks">

### Exercise 12.8.

#### Exercise 12.8: Mongo command-line interface

<!-- > Use _script_ to record what you do, save the file as script-answers/exercise12_8.txt-->
使用脚本记录你所做的，将档案储存为script-answers/exercise12_8.txt

<!-- While the MongoDB from the previous exercise is running, access the database with Mongo command-line interface (CLI). You can do that using docker exec. Then add a new todo using the CLI.-->
而前面练习中的MongoDB正在运行时，使用Mongo命令行界面（CLI）访问数据库。 您可以使用docker exec来完成。 然后使用CLI添加新的待办事项。

<!-- The command to open CLI when inside the container is _mongosh_-->
命令在容器内打开CLI是_mongosh_

<!-- The Mongo CLI will require the username and password flags to authenticate correctly. Flags _-u root -p example_ should work, the values are from the docker-compose.dev.yml.-->
Mongo CLI 需要用户名和密码标志才能正确认证。标志 _-u root -p example_ 应该可以工作，这些值来自 docker-compose.dev.yml。

<!-- * Step 1: Run MongoDB-->
第一步：运行MongoDB
<!-- * Step 2: Use docker exec to get inside the container-->
**步骤2：使用docker exec 进入容器**
<!-- * Step 3: Open Mongo cli-->
第三步：打开Mongo cli

<!-- When you have connected to the Mongo cli you can ask it to show dbs inside:-->
当您已连接到Mongo cli时，您可以要求它显示内部的dbs：

```bash
> show dbs
admin         0.000GB
config        0.000GB
local         0.000GB
the_database  0.000GB
```

<!-- To access the correct database:-->
访问正确的数据库：

```bash
> use the_database
```

<!-- And finally to find out the collections:-->
最后，找出收藏品：

```bash
> show collections
todos
```

<!-- We can now access the data in those collections:-->
我们现在可以访问这些集合中的数据：

```bash
> db.todos.find({})
[
  {
    _id: ObjectId("633c270ba211aa5f7931f078"),
    text: 'Write code',
    done: false
  },
  {
    _id: ObjectId("633c270ba211aa5f7931f079"),
    text: 'Learn about containers',
    done: false
  }
]
```

<!-- Insert one new todo with the text: "Increase the number of tools in my toolbelt" with status done as false. Consult the [documentation](https://docs.mongodb.com/v4.4/reference/method/db.collection.insertOne/#mongodb-method-db.collection.insertOne) to see how the addition is done.-->
插入一个新的待办事项，文本为：“增加我的工具袋中的工具数量”，状态为未完成。参考[文档](https://docs.mongodb.com/v4.4/reference/method/db.collection.insertOne/#mongodb-method-db.collection.insertOne)了解如何添加。

<!-- Ensure that you see the new todo both in the Express app and when querying from Mongo CLI.-->
确保您既可以在Express应用中看到新的待办事项，也可以从Mongo CLI查询。

</div>

<div class="content">

### Redis

<!-- [Redis](https://redis.io/) is a [key-value](https://redis.com/nosql/key-value-databases/) database. In contrast to eg. MongoDB, the data stored to a key-value storage has a bit less structure, there are eg. no collections or tables, it just contains junks of data that can be fetched based on the <i>key</i> that was attached to the data  (the <i>value</i>).-->
[Redis](https://redis.io/) 是一个[键值](https://redis.com/nosql/key-value-databases/)数据库。与MongoDB等不同，存储到键值存储中的数据结构略微简单，没有集合或表，它只包含可以根据附加到数据的<i>键</i>（<i>值</i>）获取的数据块。

<!-- By default Redis works <i>in-memory</i>, which means that it does not store data persistently.-->
默认情况下，Redis <i>在内存中</i>工作，这意味着它不会持久存储数据。

<!-- An excellent use case for Redis is to use it as a <i>cache</i>. Caches are often used to store data that is otherwise slow to fetch and save the data until it's no longer valid. After the cache becomes invalid, you would then fetch the data again and store it in the cache.-->
Redis 很适合用作<i>缓存</i>。缓存常用来存储获取较慢的数据，直到数据失效。当缓存失效后，你可以重新获取数据，并存储到缓存中。

<!-- Redis has nothing to do with containers. But since we are already able to add <i>any</i> 3rd party service to your applications, why not learn about a new one.-->
Redis 与容器无关。但是既然我们已经能够将<i>任何</i>第三方服务添加到应用程序中，为什么不学习一个新的呢？

</div>

<div class="tasks">

### Exercises 12.9. - 12.11.

#### Exercise 12.9: Set up Redis for the project

<!-- The Express server has already been configured to use Redis, and it is only missing the *REDIS_URL* environment variable. The application will use that environment variable to connect to the Redis. Read through the [Docker Hub page for Redis](https://hub.docker.com/_/redis), add Redis to the <i>todo-app/todo-backend/docker-compose.dev.yml</i> by defining another service after mongo:-->
Express服务器已经配置好使用Redis，只缺少*REDIS_URL*环境变量。应用程序将使用该环境变量连接到Redis。阅读[Docker Hub页面上的Redis](https://hub.docker.com/_/redis)，在<i>todo-app/todo-backend/docker-compose.dev.yml</i>中定义另一个服务来添加Redis，该服务在mongo之后：

```yml
services:
  mongo:
    ...
  redis:
    ???
```

<!-- Since the Docker Hub page doesn''t have all the info, we can use Google to aid us. The default port for Redis is found by doing so:-->
因为Docker Hub页面没有所有的信息，我们可以使用Google来帮助我们。可以通过以下方式找到Redis的默认端口：

![](../../images/12/redis_port_by_google.png)

<!-- We won''t have any idea if the configuration works unless we try it. The application will not start using Redis by itself, that shall happen in next exercise.-->
我们除非试用一下，否则就不知道配置是否有效。应用程序不会自动使用Redis，这个要在下一个练习中完成。

<!-- Once Redis is configured and started, restart the backend and give it the <i>REDIS\_URL</i>, that has the form <i>redis://host:port</i>-->
一旦Redis配置和启动完毕，重启后端，并给它提供形式为<i>redis://host:port</i>的<i>REDIS\_URL</i>。

```bash
$ REDIS_URL=insert-redis-url-here MONGO_URL=mongodb://the_username:the_password@localhost:3456/the_database npm run dev
```

<!-- You can now test the configuration by adding the line-->
`hello world` to the file.

你现在可以通过添加一行`hello world`到文件中来测试配置了。

```js
const redis = require('../redis')
```

<!-- to the Express server eg. in file <i>routes/index.js</i>. If nothing happens, the configuration is done right. If not, the server crashes:-->
若没有任何事情发生，则配置已经完成。若不然，服务器就会崩溃：将以下文字从英文翻译为中文，保持markdown格式：对于Express服务器，例如在<i>routes/index.js</i>文件中。

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
该项目已经安装了[https://www.npmjs.com/package/redis](https://www.npmjs.com/package/redis)，并且已经"promisified"了两个函数 - getAsync 和 setAsync。

<!-- - setAsync function takes in key and value, using the key to store the value.-->
- `setAsync` 函数接受 `key` 和 `value`，使用 `key` 来存储 `value`。

<!-- - getAsync function takes in key and returns the value in a promise.-->
- getAsync 函数接受键并以承诺的形式返回值。

<!-- Implement a todo counter that saves the number of created todos to Redis:-->
实现一个Todo计数器，将创建的Todo数量保存到Redis中：

<!-- - Step 1: Whenever a request is sent to add a todo, increment the counter by one.-->
- 第一步：每当发送一个添加待办事项的请求时，将计数器加一。
<!-- - Step 2: Create a GET /statistics endpoint where you can ask the usage metadata. The format should be the following JSON:-->
步骤2：创建一个GET /statistics端点，您可以请求使用元数据。格式应为以下JSON：

```json
{
  "added_todos": 0
}
```

#### Exercise 12.11:

<!-- > Use _script_ to record what you do, save the file as script-answers/exercise12_11.txt-->
使用脚本记录你所做的，将文件保存为script-answers/exercise12_11.txt

<!-- If the application does not behave as expected, a direct access to the database may be beneficial in pinpointing problems. Let us try out how [redis-cli](https://redis.io/topics/rediscli) can be used to access the database.-->
如果应用程序的行为不符合预期，直接访问数据库可能有助于确定问题所在。让我们试一试[redis-cli](https://redis.io/topics/rediscli)如何用来访问数据库。

<!-- - Go to the Redis container with _docker exec_ and open the redis-cli.-->
使用 _docker exec_ 去 Redis 容器，然后打开 redis-cli。
<!-- - Find the key you used with _[KEYS *](https://redis.io/commands/keys)_-->
找到你使用的键，[_KEYS\*_](https://redis.io/commands/keys)
<!-- - Check the value of the key with command [GET](https://redis.io/commands/get)-->
使用[GET](https://redis.io/commands/get)命令检查键的值
<!-- - Set the value of the counter to 9001, find the right command from [here](https://redis.io/commands/)-->
设置计数器的值为9001，从[这里](https://redis.io/commands/)找到正确的命令：

`SET counter 9001`
<!-- - Make sure that the new value works by refreshing the page http://localhost:3000/statistics-->
确保新值通过刷新页面 http://localhost:3000/statistics 来运作。
<!-- - Create a new todo with Postman and ensure from redis-cli that the counter has increased accordingly-->
使用Postman创建一个新的todo，并确保从redis-cli中计数器已经相应增加。
<!-- - Delete the key from cli and ensure that counter works when new todos are added-->
删除cli中的键，并确保当新的todos添加时，计数器正常工作。

</div>

<div class="content">

### Persisting data with Redis

<!-- In the previous section, it was mentioned that <i>by default</i> Redis does not persist the data. However, the persistence is easy to toggle on. We only need to start the Redis with a different command, as instructed by the [Docker hub page](https://hub.docker.com/_/redis):-->
在前面的章节中，提到了默认情况下，Redis不会持久化数据。然而，持久化很容易开启。我们只需要按照[Docker hub页面](https://hub.docker.com/_/redis)的指示，以不同的命令启动Redis即可：

```yml
services:
  redis:
    # Everything else
    command: ['redis-server', '--appendonly', 'yes'] # Overwrite the CMD
    volumes: # Declare the volume
      - ./redis_data:/data
```

<!-- The data will now be persisted to directory <i>redis_data</i> of the host machine.-->
将数据现在持久化到主机机器的<i>redis_data</i> 目录中。
<!-- Remember to add the directory to .gitignore!-->
记得将该目录添加到`.gitignore`！

#### Other functionality of Redis

<!-- In addition to the GET, SET and DEL operations on keys and values, Redis can do also a quite a lot more. It can for example automatically expire keys, that is a very useful feature when Redis is used as a cache.-->
此外，除了对键和值的GET、SET和DEL操作外，Redis还可以做更多的事情。例如，它可以自动过期键，当Redis用作缓存时，这是一个非常有用的功能。

<!-- Redis can also be used to implement so called [publish-subscribe](https://en.wikipedia.org/wiki/Publish%E2%80%93subscribe_pattern) (or PubSub) pattern that is a asynchronous communication mechanism for distributed software. In this scenario Redis works as a <i>message broker</i> between two or more services. Some of the services are <i>publishing</i> messages by sending those to Redis, that on arrival of a message, informs the parties that have <i>subscribed</i> to those messages.-->
Redis 也可以用来实现所谓的[发布-订阅](https://en.wikipedia.org/wiki/Publish%E2%80%93subscribe_pattern)（或PubSub）模式，这是一种分布式软件的异步通信机制。在这种情况下，Redis充当两个或更多服务之间的<i>消息代理</i>。一些服务通过将消息发送到Redis来<i>发布</i>消息，当收到消息时，会通知已<i>订阅</i>这些消息的各方。

</div>

<div class="tasks">

### Exercise 12.12.

#### Exercise 12.12: Persisting data in Redis

<!-- Check that the data is not persisted by default: after running _docker compose -f docker-compose.dev.yml down_ and _docker compose -f docker-compose.dev.yml up_ the counter value is reset to 0.-->
检查数据默认情况下不会被持久化：在运行`docker compose -f docker-compose.dev.yml down`和`docker compose -f docker-compose.dev.yml up`之后，计数器的值会重置为0。

<!-- Then create a volume for Redis data (by modifying <i>todo-app/todo-backend/docker-compose.dev.yml </i>) and make sure that the data survives after running _docker compose -f docker-compose.dev.yml down_ and _docker compose -f docker-compose.dev.yml up_.-->
然后为Redis数据创建一个卷（通过修改<i>todo-app/todo-backend/docker-compose.dev.yml </i>），并确保在运行_docker compose -f docker-compose.dev.yml down_和_docker compose -f docker-compose.dev.yml up_之后数据能够存活。

</div>
