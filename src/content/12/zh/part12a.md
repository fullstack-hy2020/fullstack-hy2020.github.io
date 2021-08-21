---
mainImage: ../../../images/part-10.svg
part: 12
letter: a
lang: zh
---

<div class="content">

<!-- According to wikipedia software development includes the whole lifecycle from envisioning software to programming to releasing the software and even maintaining it. This part will introduce containers, a modern tool utilized in the latter parts of the software lifecycle. -->
根据维基百科的定义，软件开发包含了软件从编程到发布的整个生命周期，甚至还包含了运维阶段。这一章我们会引入容器的概念，这一流行的工具通常会在软件生命周期的后半段应用到。

<!-- Containers encapsulate your application into a single package. This package will then include all of the dependencies with the application so that each container can run isolated from each other. -->
容器将你的应用包装在一个单独的包中。这个包会包含该应用所有的依赖，因此每一个容器是可以单独运行的。

<!-- Containers can be compared to virtual machines (VM) which are used to run multiple operating systems on a single physical machine. Containers are OS-level virtualization which means, among other things, that they allow applications to access only the container's contents and resources given to that container. Whereas VMs run an entire operating system a container runs the software using the host operating system. The resulting difference between VMs and containers is that there is little overhead when running containers; they only need to run a single process. -->
容器可以与虚拟机（VM）来比较，虚拟机会用来在单台物理机上运行多种操作系统。容器是在操作系统层面的虚拟化，也就是说，在所有其他的环境中，他们只能允许应用访问容器中的内容和资源。虚拟机却运行了整个操作系统，而容器仅仅是将软件运行在了宿主机的操作系统中。也就是说，容器和虚拟机的区别是，容器仅仅需要很少的一部分额外开销来运行；它们仅仅需要跑在一个单独的进程中。

<!-- As containers are relatively lightweight, at least compared to virtual machines, they can be quick to scale. And they isolate the software running inside enabling the software to run identically almost anywhere. As such they are the go to option in any cloud environment or application with more than a handful of users. -->
容器是相对轻量的，至少与虚拟机比较而言，他们扩展起来更迅速。而且它能将软件在内部运行，使得软件能够运行在完全相同的环境中。这些特点使得它是云环境或者多用户下的首选方案。

<!-- Cloud services like AWS, Google Cloud and Microsoft Azure all support containers in multiple different forms. As an example, AWS Fargate and Google Cloud Run run containers as serverless - where the application container does not even need to be running if it is not used. You can also install container runtime on most machines and run containers there yourself - including your personal machine.  -->
类似AWS、Google 云、微软 Azure 的云服务都不同方式地支持容器。比如AWS Fargate 与Google Cloud Run 会将容器作为serverless服务-也就是应用容器在不需要的时候压根不需要运行。你也可以将容器运行环境安装在大多数的机器中，并自己运行容器——包括能装到你的个人机中。

<!-- So containers are used in clouds and development. What are the benefits of using one? Here are two fairly relatable and common scenarios: -->

所以说容器通常运行在云环境和开发环境中。这么做的收益是什么呢？有两个典型的场景：

<!-- > Scenario 1: You are developing a new application that needs to run on the same machine as a legacy application. Both require different versions of Node installed. -->

> 场景一： 你正在开发一个新的应用，它需要和你的遗留应用跑在同一个机器中。而且依赖的是不同的Node 版本。

<!-- You can probably use nvm, virtual machines or some sort of dark magic to get them running at the same time. However, containers are an excellent solution as you can run both applications in their respective containers. They are isolated from each other and do not interfere. -->
你可以使用nvm，虚拟机或者其他一些黑科技来让他们同时运行。但是，容器一个完美的解决方案，因为你可以让应用跑在自己的容器中。他们是互相独立且不会互相干扰。

<!-- > Scenario 2: Your application runs on your machine. You need to move the application to a server. -->
> 场景2: 你的应用跑在自己的机器中，你需要把它迁移到服务器上。

<!-- It is not uncommon that the application just does not run there. It may be due to some missing dependency or other differences in the environments. Here containers are an excellent solution since you can run the application in the same environment (container) both on your machine and on the server. It is not perfect: different machines may have different hardware, but you can limit the number of differences between environments. -->
应用很常见在迁移到服务器上运转不起来。可能是由于环境缺失了依赖。而容器是一个完美的解决方案，因为你可以在自己的机器和服务器上创建一个相同的环境（容器环境）。这并不完美：不同的机器可能会有不同的硬件，但你可以限制不同环境的资源数量。

<!-- Sometimes you may hear about the “Works in my container” issue - this is often a usage error. -->
有时你可能听到“在我的容器上明明是好用的”这个问题。这通常是使用错误。

### About this part ###
【关于本章】

<!-- In this part, the focus of our attention will not be on the software code. Instead, we are interested in the configuration of the environment in which the software is executed. As a result, the exercises may not contain any coding, the applications are available to you through GitHub and your tasks will include configuring them. The exercises are to be submitted to <i>a single GitHub repository</i> which will include all of the source code and configuration you do during this part. -->
本章中，我们的重点不会放在代码上。相反，我们把重点放在对软件运行的环境配置中。因此，联系可能不包含任何编码，你可以通过Githab访问应用，你的任务就是配置它们。联系提交到一个<i>单独的Github 仓库</i>，该仓库将包含此源码和本章中的配置。

<!-- Only the core parts, 1 through 5, are required to be completed before this part. As you will need basic knowledge of Node, Express and React. -->
只有核心的 章节，也就是1到5章是本章节的前置章节。因为你需要Node、Express 和React的 基础知识。

### Submitting exercises and earning credits ###
提交联系并获得学分

Exercises are submitted via the [submissions system](https://studies.cs.helsinki.fi/stats/) just like in the previous parts. Note that, exercises in this part are submitted <i>to a different course instance</i>.
练习通过 [submissions system](https://studies.cs.helsinki.fi/stats/) 提交，与之前章节是一样的。注意，此章节的联系提交到<i>一个不同的课程实例</i>中。

This part on containers is 1 credit.
本章节关于容器，价值1学分。

<!-- Once you have completed the exercises and want to get the credits, let us know through the exercise submission system that you have completed the course: -->
你完成联系并想要获得学分，请通过联系提交系统告诉我们你已经完成了课程：

![Submitting exercises for credits](../../images/10/23.png)

<!-- You can download the certificate for completing this part by clicking one of the flag icons. The flag icon corresponds to the certificate's language. -->
你可以通过单击小旗图标来下载完成此章节的认证。小旗图标代表了认证通过。

### Installing everything required for this part ###
安装本章节所需要的所有内容

<!-- To make sure that you are ready to start with this part let's begin by installing the required software. This will be one of the largest obstacle for us, since the tools will require superuser access on the computer. This is due to the fact that the tools will have access to your operating systems kernel. We will talk more about what this means in the next section. -->
为了确保你准备好开始这一章节，让我们先安装所需的软件。这将是我们最大的障碍之一，因为这些工具需要在计算机上具有超级用户访问权限。因为这些工具可以访问您的操作系统内核。我们将在下一节中讨论这里面的含义。

<!-- The material is built around Docker, a set of products that we will use for containerization and for the management of containers. -->
该教材是围绕 Docker 构建，Docker 是一个我们用于容器化和容器管理的产品。

<!-- Depending on your operating system choose install instructions from the link below. Note that they may have multiple different options for your operating system.  -->
根据您的操作系统，从下面的链接中选择安装说明。请注意，对于您的操作系统，可能有多个不同的选项。

- [Get Docker](https://docs.docker.com/get-docker/)

<!-- Now that that headache is hopefully over let's make sure that our versions match. Yours might be a bit higher than here: -->
既然头疼的问题已经解决，让我们确保我们的版本匹配。你的版本号可能比这里高一点：

```bash
$ docker -v
Docker version 20.10.5, build 55c4c88
```

### Containers and images
容器和镜像

<!-- There are two core concepts when starting with containers and they are easy to confuse: -->
开始使用容器时有两个核心概念，它们很容易混淆：

<!-- **Container** is a runtime instance of an **image**. -->
**Container容器** 是 **image镜像** 的运行时实例。

<!-- So while we can say "Containers package software into standardized units" we can also say "Images include all of the code, dependencies and instructions on how to run the application" which sounds a lot like "Images package software" as well. -->
因此，虽然我们可以说“容器将软件打包成标准化单元”，但我们也可以说“镜像包括所有代码、依赖项和有关如何运行应用程序的说明”，这听起来也很像“镜像打包软件”。

<!-- To help with the confusion everyone just talks about containers. But you can never **actually** build a container or download one, since they only exist runtime. Images on the other hand are **immutable** files. They can not be changed but they can be created and they can be used to create new images by adding new **layers** on top of the existing ones. -->
为了帮助解决歧义，虽然每个人都只谈论容器。但是你永远不能**事实上**构建一个容器或下载一个容器，因为它们只存在于运行时。另一方面，镜像是**不可变**文件。它们无法更改，但可以创建，并且可以通过在现有的 层 之上添加新的 ** 层** 来创建新镜像。

<!-- Cooking metaphor: -->
烹饪比喻：

<!-- * Image is pre-cooked, frozen treat. -->
<!-- * Container is the delicious treat. -->
* 镜像是预先煮熟的冷冻食品。
* 容器是美味佳肴。

<!-- [Docker](https://www.docker.com/) is the most popular containerization technology and pioneered the standard most use now. It will enable us to leverage all of the benefits of containers. Docker is a set of products that help us manage images and containers. The docker engine will take care of turning the immutable files, images, into containers. -->
[Docker](https://www.docker.com/) 是最流行的容器化技术，开创了现在最常用的标准。它将使我们能够利用容器的所有好处。 Docker 是一组帮助我们管理镜像和容器的产品。 docker 引擎将负责将不可变文件、镜像转换为容器。

<!-- For managing the docker containers, there is also [Docker Compose](https://docs.docker.com/compose/). It is used to **orchestrate** (control) multiple containers at the same time. We will use Docker Compose to set up complex local development environments quickly. For the final version of our node development environment, we will try to eliminate the need to install Node. -->
为了管理 docker 容器，还有 [Docker Compose](https://docs.docker.com/compose/)。它用于同时**编排**（控制）多个容器。我们将使用 Docker Compose 快速搭建复杂的本地开发环境。对于我们的 node 开发环境的最终版本，我们将尝试消除安装 Node.js 的需要。

<!-- There are a number of concepts we need to go over, but we will skip those for now and learn about Docker first! One of my favorite features is the capability to handle running containers even if they are not yet downloaded on our device. -->
有许多概念我们需要复习，但我们现在将跳过这些并首先了解 Docker！我最喜欢的功能之一是能够处理正在运行的容器，即使它们尚未下载到我们的设备上。

<!-- The command structure is the following: _container run <i>IMAGE-NAME</i>_. So we will tell docker to create a container from an image. -->
命令结构如下：_container run <i>IMAGE-NAME</i>_。这样我们会告诉 docker 从一个镜像创建一个容器。

```bash
§ docker container run hello-world
```

<!-- There will be a lot of output but I will split it into multiple sections that we can decipher it together. The lines are numbered by me so that it is easier to follow the explanation, your output will not have the numbers: -->
会有很多输出，但我会将它分成多个部分，我们可以一起破译它。这些行由我编号，以便更容易理解解释，您的输出将没有这些编号：

```bash
1. Unable to find image 'hello-world:latest' locally
2. latest: Pulling from library/hello-world
3. b8dfde127a29: Pull complete
4. Digest: sha256:5122f6204b6a3596e048758cabba3c46b1c937a46b5be6225b835d091b90e46c
5. Status: Downloaded newer image for hello-world:latest
```

<!-- It's downloaded a new image for hello-world from "Docker Hub". You can see the docker hub page for the image with your browser here: [https://hub.docker.com/_/hello-world](https://hub.docker.com/_/hello-world) -->
它从“Docker Hub”下载了一个新的 hello-world 镜像。您可以在此处使用浏览器查看镜像的 docker hub 页面：[https://hub.docker.com/_/hello-world](https://hub.docker.com/_/hello-world) 

<!-- The first part of the message states that we did not have "hello-world:latest" yet. This reveals a bit of detail about images themselves; image names consist of multiple parts, kind of like an url. An image name is in the following format:  -->
消息的第一部分指出我们还没有“hello-world:latest”。这揭示了镜像本身的一些细节；镜像名称由多个部分组成，有点像 url。镜像名称采用以下格式：

- _registry/organisation/image:tag_

<!-- In this case the 3 missing fields defaulted to:  -->
<!-- - _index.docker.io/library/hello-world:latest_ -->
在这种情况下，3 个缺失的字段默认为：
- _index.docker.io/library/hello-world:latest_

Second row shows the organisation name, "library" where it will get the image. In the Docker Hub url the "library" is shortened to _.
第二行显示组织名称，“库”，它将在其中获取镜像。在 Docker Hub url 中，“库”缩短为 _。

<!-- The 3rd and 5th rows only show the status. But 4th row may be interesting: each image has a unique digest based on the layers. The digest is used by docker to identify that an image is the same if you try to pull it again. -->
第 3 行和第 5 行仅显示状态。但是第 4 行可能很有趣：每个镜像都有一个基于层的唯一数字签名。如果您再次尝试拉取镜像，docker 会使用签名来识别该镜像是否相同。

<!-- So it did some pulling and then output information about the **image**. It then gave the status that a new version of hello-world:latest was indeed downloaded. You can try pulling the image with _docker image pull hello-world_. -->
于是它会做出一些拉取动作，并打印出 **镜像** 的信息。然后给出了下载了新版本 hello-world:latest 的状态。你可以使用拉取镜像的命令_docker image pull hello-world_。

<!-- The following output was from the container itself. It also explains what happened when we ran _docker container run hello-world_. -->
以下输出来自容器本身。它同时还解释了当我们运行 _docker container run hello-world_ 时发生了什么。

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

<!-- The output contains a few new things for us to learn. Docker daemon is a background service that makes sure the containers are running, and we use the docker client to interact with the daemon. What we just did is we ran a container that contained the hello-world application and saw what it printed out. -->
输出包含了一些我们需要学习的新内容。Docker 守护进程是一个确保容器正常运行的后台服务，我们使用docker 客户端与守护进程进行交互。我们刚刚所做的事运行一个包含 hello-world 应用的容器并查看它的打印内容。

</div>

<div class="tasks">

### Exercise 12.1
练习12.1

#### Exercise 12.1: Running your second container
练习12.1： 运行你的第二个容器

<!-- The hello-world output gave us an "ambitious" task to do. Do the following -->
hello-word 的输出为我们衍生出了“雄心勃勃”的任务。执行以下操作：

<!-- Step 1. Run an Ubuntu container with the command given by hello-world

The step 1 will connect you straight into the container with bash. You will have an access to all the files and tools inside.

Step 2. Create directory `/usr/src/app`

Step 3. Create a file `/usr/src/app/index.js`

Step 4. Run `exit` to quit from the container

Google should be able to help you with creating directories and files. -->

步骤1. 使用hello-word 给出的命令运行一个Ubuntu 容器。

步骤2. 创建一个目录 `/usr/src/app`

步骤3. 创建一个文件 `/usr/src/app/index.js`

步骤4. 运行 `exit` 来退出容器

Google 可以帮助你创建目录和文件。

</div>

<div class="content">

### Ubuntu image
Ubuntu 镜像

<!-- The command you just used to run the ubuntu container, _docker container run -it ubuntu bash_, contains a few additions to our hello-world. Let's see the --help to get a better understanding. I'll cut some of the output so we can focus on the relevant parts. -->
刚刚用于运行ubuntu 容器的命令，_docker container run -it ubuntu bash_ 与hello-world相比包含了一些额外的信息。让我们输入 --help 来获取更多解释。我会裁剪一些输出信息，以便于我们可以专注于相关章节。

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

<!-- The options, or flags, _-it_ make sure we can interact with the container. And after the image, in this case ubuntu, we have the command to be executed inside the container when we start it. You can try other commands that the ubuntu image might have the tools for, for example, try _docker container run --rm ubuntu ls_. The *ls* command will list all of the files in the directory and _--rm_ will remove the container after execution. -->
选项参数，或者说标志， _-it_ 会确保我们能够与容器交互。在镜像后面，本例时ubuntu，当我们启动它时，我们有要在容器内执行的命令。你可以尝试ubuntu镜像可能具有的其他命令，比如 _docker container run --rm ubuntu ls_ 。 *ls* 命令会列出目录中所有的文件，_--rm_执行后 会删除容器。

<!-- Let's continue with our first ubuntu container with the **index.js** file inside of it. It has stopped running since we exited it. We can list all of the containers with _container ls -a_, the _-a_ (or --all) will list containers that have already been exited. -->
让我们继续我们的第一个ubuntu容器，其中包含了 **index.js** 文件。自从我们退出它后它就停止运行了。我们可以使用 _container ls -a_ 列出所有容器，  _-a_ (或 --all)将列出已经退出的容器。

```bash
$ docker container ls -a
CONTAINER ID   IMAGE     COMMAND   CREATED          STATUS                       PORTS     NAMES
b8548b9faec3   ubuntu    "bash"    3 minutes ago    Exited (0) 6 seconds ago               hopeful_clarke
```

<!-- The identifier can be used to interact with the container. Although most commands accept the container name as well. The name of the container was automatically generated to be **"hopeful_clarke"** in my case. -->

标识符可以用来与容器进行交互。虽然大多数命令接受容器名称。在我的例子中，容器被自动命名为 **"hopeful_clarke"** 。

<!-- The container has already exited, but we can start it again with the start command that will accept the id or name of the container as parameter: _start <i>CONTAINER-ID-OR-CONTAINER-NAME</i>_. -->

容器已经退出，但是我们可以再次启动它， 该命令将接受容器的id 或名称作为参数_start <i>CONTAINER-ID-OR-CONTAINER-NAME</i>_。

```bash
$ docker start hopeful_clarke
root@b8548b9faec3:/#
```

<!-- The start command will start the same container we had previously. Unfortunately, we forgot to start it with the flag _--interactive_ so we can not interact with it. Let's kill it with the _kill <i>CONTAINER-ID-OR-CONTAINER-NAME</i>_ command and try again. -->

start 命令会启动我们之前相同的容器。不幸的事，我们忘记了使用标志  _--interactive_ 来启动它，所以我们无法与它进行交互。让我们使用  _kill <i>CONTAINER-ID-OR-CONTAINER-NAME</i>_ 命令杀掉它，并再启动一遍。

```bash
$ docker container ls -a
CONTAINER ID   IMAGE     COMMAND   CREATED          STATUS                      PORTS     NAMES
b8548b9faec3   ubuntu    "bash"    13 minutes ago   Up 47 seconds                         hopeful_clarke

$ docker kill hopeful_clarke
hopeful_clarke

$ docker start -i hopeful_clarke
root@b8548b9faec3:/#
```

<!-- Let's edit the index.js and add something to execute. We are just missing the tools to edit the file with. Nano will be a good text editor for now. Google should give us the install instructions. We will just omit using sudo since we are already root. -->

让我们编辑 index.js 并添加些要执行的内容。我们只是缺少编辑文件的工具。Nono 是一个不错的选择。Google 能够查到安装指引。我们已经是root 用户，会省略使用sudo。

```
root@b8548b9faec3:/# apt-get update
...

root@b8548b9faec3:/# apt-get -y install nano
...

root@b8548b9faec3:/# nano /usr/src/app/index.js
```

Now we have nano installed and can start editing files!
现在我们已经安装了nano 并可以开始编辑文件了。

</div>

<div class="tasks">

### Exercise 12.2 - 12.3
练习12.2-12.3

#### Exercise 12.2: Ubuntu 101
练习12.2 Ubuntu 101

<!-- Edit the _/usr/src/app/index.js_ file inside the container with the now installed nano and add the following line -->
使用刚安装的nono编辑容器中的 _/usr/src/app/index.js_  文件，添加如下行。

```javascript
console.log('Hello World')
```

<!-- If Nano isn't familiar you can ask in the chat or google. -->
如果你不熟悉nano 的使用可以在聊天里询问或咨询谷歌。

#### Exercise 12.3: Ubuntu 102
练习12.3 Ubuntu 102

<!-- Install Node while inside the container and run the index file with _node /usr/src/app/index.js_ in the container. -->
在容器中安装Node 并运行index 文件：_node /usr/src/app/index.js_ 

<!-- The instructions for installing Node are sometimes hard to find so here is something you can copy-paste: -->
安装Node 的说明不太好找，所以你可以直接拷贝粘贴下面的命令：

```bash
curl -sL https://deb.nodesource.com/setup_16.x | bash
apt install -y nodejs
```

</div>

<div class="content">

### Other docker commands
其他Docker 命令

<!-- Now that we have node installed in the container we can execute _node /usr/src/app/index.js_ in the container! Let's create a new image from the container. The _commit <i>CONTAINER-ID-OR-CONTAINER-NAME</i> <i>NEW-IMAGE-NAME</i>_ will create a new image that includes the changes we have made. You can use _container diff_ to check for the changes between the original image and container before doing so. -->
目前我们已经在容器中安装了node ，并可以运行 _node /usr/src/app/index.js_  了！ 让我们从容器中创建一个新的镜像。 命令 _commit <i>CONTAINER-ID-OR-CONTAINER-NAME</i> <i>NEW-IMAGE-NAME</i>_ 会创建一个新的镜像，镜像里包含了我们的修改。你可以使用 _container diff_ 来检查原始镜像和容器的不同。

```console
$ docker commit hopeful_clarke hello-node-world
```

<!-- You can list your images with _image ls_: -->
 你可以利用 _image ls_ 来列出你的镜像。

```console
$ docker-fs docker image ls
REPOSITORY                                      TAG         IMAGE ID       CREATED         SIZE
hello-node-world                                latest      eef776183732   9 minutes ago   252MB
ubuntu                                          latest      1318b700e415   2 weeks ago     72.8MB
hello-world                                     latest      d1165f221234   5 months ago    13.3kB
``` 
 
<!-- You can now run the new image as follows: -->
 现在你可以用如下命令来运行一个新的镜像了：

```console
docker run -it hello-node-world bash
root@4d1b322e1aff:/# node /usr/src/app/index.js
```

<!-- There are multiple ways to achieve the same conclusion. Let's go through a better solution starting by running _container rm_ to remove the old container. -->
有多种方式可以达到相同的结果。我们首先使用 _container rm_  删除老的容器。

```bash
$ docker container ls -a
CONTAINER ID   IMAGE     COMMAND   CREATED          STATUS                       PORTS     NAMES
b8548b9faec3   ubuntu    "bash"    31 minutes ago   Exited (0) 9 seconds ago               hopeful_clarke

$ docker container rm hopeful_clarke
hopeful_clarke
```

<!-- Create the index.js file and write _console.log('Hello, World')_ inside it. No need for containers yet. -->
创建一个文件，并写入 _console.log('Hello, World')_ ，先没有必要创建容器。

<!-- Next let's skip installing node altogether. Since docker images are found in Docker Hub we can use this [https://hub.docker.com/_/node](https://hub.docker.com/_/node). That image has node already installed, and we only need to pick a version.  -->
下面让我们跳过安装node 的步骤。因为docker 镜像能在 Docker Hub [https://hub.docker.com/_/node](https://hub.docker.com/_/node) 中找到，包含node镜像已经有了，我们只需要选择一个版本即可

<!-- By the way, the _container run_ accepts _--name_ flag that we can use to give a name for the container. -->
此外，_container run_ 接受 _--name_  标志我们可以给容器起一个名字。

```bash
$ docker container run -it --name hello-node node:16 bash
```

<!-- While we are inside the container on this terminal, open another terminal and use the _container cp_ command to copy file from your own machine to the container. -->

由于我们现在在当前容器的终端，我们打开另外一个终端，使用 _container cp_  命令来从宿主机拷贝文件到容器。

```bash
$ docker cp ./index.js hello-node:/usr/src/app/index.js
```

<!-- And now we can run _node /usr/src/app/index.js_ in the container. -->
现在我们可以在容器中运行 _node /usr/src/app/index.js_  了。

</div>
