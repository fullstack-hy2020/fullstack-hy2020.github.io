---
mainImage: ../../../images/part-12.svg
part: 12
letter: a
lang: zh
---

<div class="content">

<!-- Software development includes the whole lifecycle from envisioning the software to programming and to releasing it to the end-users and even maintaining it. This part will introduce containers, a modern tool utilized in the latter parts of the software lifecycle.-->
软件开发包括从设想软件到编程再到将其发布给最终用户甚至维护的整个生命周期。本部分将介绍容器，一种用于软件生命周期后期的现代工具。

<!-- Containers encapsulate your application into a single package. This package will then include all of the dependencies with the application. As a result, each container can run isolated from the other containers.-->
容器将您的应用程序封装到单个包中。此包将包括应用程序的所有依赖项。因此，每个容器都可以与其他容器隔离运行。

<!-- Containers prevent the application inside from accessing files and resources of the device. Developers can give the contained applications permission to access files and specify available resources. More accurately, containers are OS-level virtualization. The easiest-to-compare technology is a virtual machine (VM). VMs are used to run multiple operating systems on a single physical machine. They have to run the whole operating system, whereas a container runs the software using the host operating system. The resulting difference between VMs and containers is that there is hardly any overhead when running containers; they only need to run a single process.-->
容器可以防止内部应用程序访问设备的文件和资源。开发人员可以给包含的应用程序授予访问文件的权限，并指定可用的资源。更准确地说，容器是OS级虚拟化。最容易比较的技术是虚拟机（VM）。VM用于在单台物理机上运行多个操作系统。它们必须运行整个操作系统，而容器只需要使用主机操作系统运行软件。因此，VM和容器之间的差异在于运行容器几乎没有任何开销；它们只需要运行一个进程。

<!-- As containers are relatively lightweight, at least compared to virtual machines, they can be quick to scale. And as they isolate the software running inside, it enables the software to run identically almost anywhere. As such, they are the go-to option in any cloud environment or application with more than a handful of users.-->
由于容器相对较轻量，至少与虚拟机相比，它们可以快速扩展。此外，由于它们隔离其内部运行的软件，因此可以使软件在几乎任何地方都以相同的方式运行。因此，它们是任何具有多个用户的云环境或应用程序的首选选项。

<!-- Cloud services like AWS, Google Cloud, and Microsoft Azure all support containers in multiple different forms. These include AWS Fargate and Google Cloud Run, both of which run containers as serverless - where the application container does not even need to be running if it is not used. You can also install container runtime on most machines and run containers there yourself - including your own machine.-->
云服务，如AWS，Google Cloud和Microsoft Azure都支持多种不同形式的容器。其中包括AWS Fargate和Google Cloud Run，它们都以无服务器的形式运行容器——甚至应用容器在没有使用时甚至不需要运行。您还可以在大多数计算机上安装容器运行时，并在那里自行运行容器——包括您自己的计算机。

<!-- So containers are used in cloud environment and even during development. What are the benefits of using containers? Here are two common scenarios:-->
所以容器在云环境甚至在开发中都被使用。使用容器有什么好处？下面是两个常见的场景：

<i>Scenario 1: You are developing a new application that needs to run on the same machine as a legacy application. Both require different versions of Node installed.</i>

<!-- You can probably use nvm, virtual machines, or dark magic to get them running at the same time. However, containers are an excellent solution as you can run both applications in their respective containers. They are isolated from each other and do not interfere.-->
你可能可以使用nvm、虚拟机或者黑魔法来让它们同时运行。然而，容器是一个很棒的解决方案，因为你可以在各自的容器中运行这两个应用程序。它们彼此隔离，不会相互干扰。

<i>Scenario 2: Your application runs on your machine. You need to move the application to a server.</i>

<!-- It is not uncommon that the application just does not run on the server despite it works just fine on your machine. It may be due to some missing dependency or other differences in the environments. Here containers are an excellent solution since you can run the application in the same execution environment both on your machine and on the server. It is not perfect: different hardware can be an issue, but you can limit the differences between environments.-->
它在服务器上无法运行，尽管在你的机器上可以正常运行，这并不少见。这可能是由于环境中缺少的依赖项或其他差异造成的。在这里，容器是一个很好的解决方案，因为你可以在你的机器和服务器上使用相同的执行环境来运行应用程序。这并不完美：不同的硬件可能是一个问题，但是你可以限制环境之间的差异。

<!-- Sometimes you may hear about the <i>"Works in my container"</i> issue. The phrase describes a situation in which the application works fine in a container running on your machine but breaks when the container is started on a server. The phrase is a play on the infamous <i>"Works on my machine"</i> issue, which containers are often promised to solve. The situation also is most likely a usage error.-->
有时你可能会听到关于<i>"我的容器内的工作"</i>问题。这句话描述的是一种情况，即应用程序在你的机器上运行的容器中正常工作，但在服务器上启动容器时就会出错。这句话是对著名的<i>"我的机器上的工作"</i>问题的一种改编，容器通常被承诺可以解决这个问题。这种情况很可能是用法错误。

### About this part

<!-- In this part, the focus of our attention will not be on the JavaScript code. Instead, we are interested in the configuration of the environment in which the software is executed. As a result, the exercises may not contain any coding, the applications are available to you through GitHub and your tasks will include configuring them. The exercises are to be submitted to <i>a single GitHub repository</i> which will include all of the source code and configuration you do during this part.-->
在这一部分，我们的关注重点不会放在JavaScript代码上。相反，我们感兴趣的是软件执行环境的配置。因此，练习可能不包含任何编码，应用程序可通过GitHub获得，您的任务将包括配置它们。练习应提交到<i>一个GitHub存储库</i>，其中将包含您在此部分进行的所有源代码和配置。

<!-- You will need basic knowledge of Node, Express, and React. Only the core parts, 1 through 5, are required to be completed before this part.-->
你需要对Node、Express和React有基本的了解。在这一部分之前，只需要完成1至5的核心部分。

</div>

<div class="tasks">

### Exercise 12.1
### <i>Warning</i>

<!-- Since we are stepping right outside of our comfort zone as JavaScript developers, this part may require you to take a detour and familiarize yourself with shell / command line / command prompt / terminal before getting started.-->
自从我们作为JavaScript开发人员踏出了舒适圈，这一部分可能需要你转向，先熟悉shell/命令行/命令提示/终端，然后再开始。

<!-- If you have only ever used a graphical user interface and never touched e.g. Linux or terminal on Mac, or if you get stuck in the first exercises we recommend doing the Part 1 of "Computing tools for CS studies" first: <https://tkt-lapio.github.io/en/>. Skip the section for "SSH connection" and Exercise 11. Otherwise, it includes everything you are going to need to get started here!-->
如果你只曾使用过图形用户界面，从未触碰过Linux或Mac的终端，或者在第一个练习中遇到了困难，我们建议先完成《计算机科学研究的计算工具》的第一部分：<https://tkt-lapio.github.io/en/>。跳过“SSH连接”部分和练习11。否则，它包含了你在这里开始所需要的一切！

#### Exercise 12.1: Using a computer (without graphical user interface)

<!-- Step 1: Read the text below the Warning header.-->
# 警告
阅读以下警告：
1. 千万不要尝试自行维修电器或电器附件。
2. 请勿在湿润的或潮湿的环境中使用电器。
3. 请勿将电器放置在火源附近。
4. 如果电器损坏或发生故障，请立即停止使用，并向专业人士寻求帮助。

<!-- Step 2: Download this [repository](https://github.com/fullstack-hy2020/part12-containers-applications) and make it your submission repository for this part.-->
步骤2：下载[此仓库](https://github.com/fullstack-hy2020/part12-containers-applications)，并将其作为本部分的提交仓库。

<!-- Step 3: Run <i>curl http://helsinki.fi</i> and save the output into a file. Save that file into your repository as file <i>script-answers/exercise12_1.txt</i>. The directory <i>script-answers</i> was created in the previous step.-->
第三步：运行<i>curl http://helsinki.fi</i>并将输出保存到一个文件中。将该文件保存到你的存储库中，文件名为<i>script-answers/exercise12_1.txt</i>。在上一步中已经创建了<i>script-answers</i>目录。

</div>
<div class="content">

### Submitting exercises and earning credits

<!-- Submit the exercises via the [submissions system](https://studies.cs.helsinki.fi/stats/) just like in the previous parts. Exercises in this part are submitted <i>to its [own course instance](https://studies.cs.helsinki.fi/stats/courses/fs-containers)</i>.-->
提交作业请使用[提交系统](https://studies.cs.helsinki.fi/stats/)，就像之前的部分一样。本部分的作业要提交<i>到它自己的[课程实例](https://studies.cs.helsinki.fi/stats/courses/fs-containers)</i>中。

<!-- Completing this part on containers will get you 1 credit. Note that you need to do all the exercises for earning the credit or the certificate.-->
完成本部分关于容器的内容可以获得1分。注意，为了获得学分或证书，你需要完成所有练习。

<!-- Once you have completed the exercises and want to get the credits, let us know through the exercise submission system that you have completed the course:-->
一旦您完成了练习，想要获得学分，请通过练习提交系统告知我们您已完成课程：

![Submitting exercises for credits](../../images/10/23.png)

<!-- You can download the certificate for completing this part by clicking one of the flag icons. The flag icon corresponds to the language of the certificate.-->
你可以点击其中一个旗帜图标来下载完成这部分的证书。旗帜图标对应证书的语言。

### Tools of the trade

<!-- The basic tools you are going to need vary between operating systems:-->
**不同的操作系统所需的基本工具有所不同：**

<!-- * [WSL 2 terminal](https://docs.microsoft.com/en-us/windows/wsl/install-win10) on Windows-->
* [WSL 2 终端](https://docs.microsoft.com/zh-cn/windows/wsl/install-win10) 在 Windows 上
<!-- * Terminal on Mac-->
Mac 终端
<!-- * Command Line on a Linux-->
System

在Linux系统上的命令行

### Installing everything required for this part

<!-- We will begin by installing the required software. The installation step will be one of the possible obstacles. As we are dealing with OS-level virtualization, the tools will require superuser access on the computer. They will have access to your operating systems kernel.-->
我们将从安装所需的软件开始。安装步骤将是可能的障碍之一。由于我们正在处理操作系统级虚拟化，因此这些工具将需要计算机上的超级用户访问权限。他们将访问您的操作系统内核。

<!-- The material is built around [Docker](https://www.docker.com/), a set of products that we will use for containerization and the management of containers. Unfortunately, if you can not install Docker you probably can not complete this part.-->
材料是围绕[Docker](https://www.docker.com/)构建的，这是一组我们将用于容器化和容器管理的产品。不幸的是，如果您无法安装Docker，您可能无法完成此部分。

<!-- As the install instructions depend on your operating system, you will have to find the correct install instructions from the link below. Note that they may have multiple different options for your operating system.-->
根据您的操作系统，安装说明会有所不同，您需要从下面的链接中找到正确的安装说明。请注意，您的操作系统可能有多个不同的选项。


<!-- - [Get Docker](https://docs.docker.com/get-docker/)-->
- [获取Docker](https://docs.docker.com/get-docker/)

<!-- Now that that headache is hopefully over, let''s make sure that our versions match. Yours may have a bit higher numbers than here:-->
现在这个头痛希望已经结束了，让我们确保我们的版本匹配。你的可能会有比这里更高的数字：

```bash
$ docker -v
Docker version 20.10.5, build 55c4c88
```

### Containers and images

<!-- There are two core concepts in this part: <i>container</i> and <i>image</i>. They are easy to confuse with one another.-->
<i>容器</i>和<i>镜像</i>是本部分的两个核心概念，容易混淆。

<!-- A <i>container</i> is a runtime instance of an <i>image</i>.-->
一个<i>容器</i>是<i>镜像</i>的运行时实例。

<!-- Both of the following statements are true:-->
两个以下声明均为真：
1. 我们正在努力解决这个问题。
2. 我们已经解决了这个问题。

<!-- - Images include all of the code, dependencies and instructions on how to run the application-->
图片包括所有的代码，依赖项和运行应用程序的指令。
<!-- - Containers package software into standardized units-->
for development, deployment, and scaling

容器将软件打包成标准单元，用于开发、部署和扩展。

<!-- It is no wonder they are easily mixed up.-->
它们容易混淆也就不足为奇了。

<!-- To help with the confusion, almost everyone uses the word container to describe both. But you can never actually build a container or download one since containers only exist during runtime. Images, on the other hand, are **immutable** files. As a result of the immutability, you can not edit an image after you have created one. However, you can use existing images to create <i>a new image</i> by adding new layers on top of the existing ones.-->
为了帮助消除混淆，几乎每个人都使用容器这个词来描述它们两个。但是你永远不能真正构建一个容器或者下载一个，因为容器只在运行时存在。另一方面，图像是**不可变**的文件。由于不可变性，你在创建一个图像后就不能编辑它。但是，你可以使用现有的图像来创建<i>一个新的图像</i>，通过在现有的图层上添加新的图层。

<!-- Cooking metaphor:-->
烹饪比喻：

> 烹饪就像是精心创作一首歌曲，你需要把不同的元素组合在一起，以创造出一种独特的口感。

<!-- * Image is pre-cooked, frozen treat.-->
* 图像是预先烹饪的冷冻美食。
<!-- * Container is the delicious treat.-->
* 容器是美味的款待。

<!-- [Docker](https://www.docker.com/) is the most popular containerization technology and pioneered the standards most containerization technologies use today. In practice, Docker is a set of products that help us to manage images and containers. This set of products will enable us to leverage all of the benefits of containers. For example, the Docker engine will take care of turning the immutable files called images into containers.-->
[Docker](https://www.docker.com/) 是最受欢迎的容器化技术，开创了大多数容器化技术今天使用的标准。 实际上，Docker 是一组产品，可帮助我们管理镜像和容器。 这组产品将使我们能够利用容器的所有优势。 例如，Docker 引擎将负责将不可变的文件（称为镜像）转换为容器。

<!-- For managing the Docker containers, there is also a tool called [Docker Compose](https://docs.docker.com/compose/) that allows one to **orchestrate** (control) multiple containers at the same time. In this part we shall use Docker Compose to set up a complex local development environment. In the final version of the development environment that we set up, even installing the Node to our machine is not a requirement anymore.-->
对于管理Docker容器，还有一个叫做[Docker Compose](https://docs.docker.com/compose/)的工具，可以让人同时控制多个容器。在这一部分，我们将使用Docker Compose来设置一个复杂的本地开发环境。在我们设置的最终版本的开发环境中，甚至不再需要将Node安装到我们的计算机上了。

<!-- There are several concepts we need to go over. But we will skip those for now and learn about Docker first!-->
有几个概念我们需要梳理一下，但我们暂时跳过它们，先来学习Docker吧！

<!-- Let us start with the command <i>docker container run</i> that is used to run images within a container. The command structure is the following: _container run <i>IMAGE-NAME</i>_ that we will tell Docker to create a container from an image. A particularly nice feature of the command is that it can run a container even if the image to run is not downloaded on our device yet.-->
让我们从<i>docker container run</i>命令开始，该命令用于在容器中运行映像。 命令结构如下：_container run <i>IMAGE-NAME</i>_ 我们将告诉Docker从映像创建容器。 该命令的一个特别好的功能是，即使要运行的映像尚未下载到我们的设备上，也可以运行容器。

<!-- Let us run the command-->
让我们运行命令

```bash
$ docker container run hello-world
```

<!-- There will be a lot of output, but let''s split it into multiple sections, which we can decipher together. The lines are numbered by me so that it is easier to follow the explanation. Your output will not have the numbers.-->
1. 这里会有很多输出，但是让我们把它分成多个部分，我们可以一起解读。为了便于跟踪解释，我给每行加上了编号。你的输出不会有编号。

```bash
1. Unable to find image 'hello-world:latest' locally
2. latest: Pulling from library/hello-world
3. b8dfde127a29: Pull complete
4. Digest: sha256:5122f6204b6a3596e048758cabba3c46b1c937a46b5be6225b835d091b90e46c
5. Status: Downloaded newer image for hello-world:latest
```

<!-- Because the image <i>hello-world</i> was not found on our machine, the command first downloaded it from a free registry called [Docker Hub](https://hub.docker.com/). You can see the Docker Hub page of the image with your browser here: [https://hub.docker.com/_/hello-world](https://hub.docker.com/_/hello-world)-->
因为在我们的机器上没有找到图像<i>hello-world</i>，命令首先从一个叫做[Docker Hub](https://hub.docker.com/)的免费注册表中下载它。您可以使用浏览器在此处查看该图像的Docker Hub页面：[https://hub.docker.com/_/hello-world](https://hub.docker.com/_/hello-world)

<!-- The first part of the message states that we did not have the image "hello-world:latest" yet. This reveals a bit of detail about images themselves; image names consist of multiple parts, kind of like an URL. An image name is in the following format:-->
{image-name}:{tag}.

第一部分消息表明我们还没有图像“hello-world：latest”。这揭示了一些有关图像本身的细节；图像名称由多个部分组成，有点像URL。图像名称的格式如下：{image-name}：{tag}。

<!-- - _registry/organisation/image:tag_-->
_注册表/组织/图像：标签_

<!-- In this case the 3 missing fields defaulted to:-->
在这种情况下，3个缺失字段默认为：
<!-- - _index.docker.io/library/hello-world:latest_-->
_index.docker.io/library/hello-world:latest_

_index.docker.io/library/hello-world:最新_

<!-- The second row shows the organisation name, "library" where it will get the image. In the Docker Hub url, the "library" is shortened to _.-->
第二行显示组织名称“library”，它将从此处获取镜像。在Docker Hub url中，“library”被简写为_。

<!-- The 3rd and 5th rows only show the status. But the 4th row may be interesting: each image has a unique digest based on the <i>layers</i> from which the image is built. In practice, each step or command that was used in building the image creates a unique layer. The digest is used by Docker to identify that an image is the same. This is done when you try to pull the same image again.-->
第3行和第5行只显示状态。但第4行可能会有趣：每个图像都有一个唯一的摘要，基于构建该图像的<i>层</i>。实际上，在构建图像时使用的每个步骤或命令都会创建一个唯一的层。摘要由Docker用来识别图像是相同的。这是在您尝试再次拉取相同的图像时完成的。

<!-- So the result of using the command was a pull and then output information about the **image**. After that, the status told us that a new version of hello-world:latest was indeed downloaded. You can try pulling the image with _docker image pull hello-world_ and see what happens.-->
结果使用该命令将**图像**拉取下来，并输出相关信息。然后，状态提示我们确实下载了hello-world:latest的新版本。你可以尝试使用`docker image pull hello-world`拉取图像，看看会发生什么。

<!-- The following output was from the container itself. It also explains what happened when we ran _docker container run hello-world_.-->
以下输出来自容器本身，它还解释了当我们执行 _docker container run hello-world_ 时发生了什么。

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

<!-- The output contains a few new things for us to learn. <i>Docker daemon</i> is a background service that makes sure the containers are running, and we use the <i>Docker client</i> to interact with the daemon. We now have interacted with the first image and created a container from the image. During the execution of that container, we received the output.-->
输出包含一些新的东西供我们学习。<i>Docker 守护进程</i>是一个后台服务，确保容器正在运行，我们使用<i>Docker 客户端</i>与守护进程进行交互。我们现在已经与第一个镜像交互，并从镜像创建了一个容器。在执行该容器期间，我们收到了输出。

</div>

<div class="tasks">

### Exercise 12.2

<!-- Some of these exercises do not require you to write any code or configurations to a file.-->
有些练习不需要你写任何代码或配置到文件中。
<!-- In these exercises you should use [script](https://man7.org/linux/man-pages/man1/script.1.html) command to record the commands you have used; try it yourself with _script_ to start recording, _echo "hello"_ to generate some output, and _exit_ to stop recording. It saves your actions into a file named "typescript" (that has nothing to do with the TypeScript programming language, the name is just a coincidence).-->
在这些练习中，你应该使用[script](https://man7.org/linux/man-pages/man1/script.1.html)命令来记录你使用过的命令；尝试用_script_开始录制，_echo "hello"_ 生成一些输出，_exit_停止录制。它会将你的操作保存到一个名为"typescript"的文件中（与TypeScript编程语言没有关系，名字只是巧合）。

<!-- If _script_ does not work, you can just copy-paste all commands you used into a text file.-->
如果脚本不起作用，你可以把你使用的所有命令复制粘贴到一个文本文件中。

#### Exercise 12.2: Running your second container

<!-- > Use _script_ to record what you do, save the file as script-answers/exercise12_2.txt-->
使用脚本记录你做的事情，将文件保存为script-answers/exercise12_2.txt

<!-- The hello-world output gave us an ambitious task to do. Do the following-->
**给我们一个雄心勃勃的任务来完成，hello-world输出。**

<!-- Step 1. Run an Ubuntu container with the command given by hello-world-->
第一步：使用 hello-world 给出的命令运行 Ubuntu 容器

<!-- The step 1 will connect you straight into the container with bash. You will have access to all of the files and tools inside of the container. The following steps are run within the container:-->
第1步将您直接连接到具有bash的容器中。您将可以访问容器中的所有文件和工具。以下步骤在容器中运行：

<!-- Step 2. Create directory <i>/usr/src/app</i>-->
第二步：创建目录<i>/usr/src/app</i>

<!-- Step 3. Create a file <i>/usr/src/app/index.js</i>-->
第三步：创建一个文件<i>/usr/src/app/index.js</i>

<!-- Step 4. Run <i>exit</i> to quit from the container-->
第4步：运行<i>exit</i>从容器中退出

<!-- Google should be able to help you with creating directories and files.-->
Google 应该能够帮助你创建目录和文件。

</div>

<div class="content">

### Ubuntu image

<!-- The command you just used to run the Ubuntu container, _docker container run -it ubuntu bash_, contains a few additions to the previously run hello-world. Let's see the --help to get a better understanding. I'll cut some of the output so we can focus on the relevant parts.-->
你刚刚用来执行Ubuntu容器的指令`docker container run -it ubuntu bash`，比之前执行的hello-world多了一些东西。让我们看一下--help来更好地了解它。我将把一些输出减少，以便我们可以专注于相关部分。

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

<!-- The two options, or flags, _-it_ make sure we can interact with the container. After the options, we defined that image to run is _ubuntu_. Then we have the command _bash_ to be executed inside the container when we start it.-->
两个选项，或者标志，`-it` 确保我们可以与容器交互。在选项之后，我们定义要运行的镜像是`ubuntu`。然后，我们有命令`bash`在启动容器时在其中执行。

<!-- You can try other commands that the ubuntu image might be able to execute. As an example try _docker container run --rm ubuntu ls_. The _ls_ command will list all of the files in the directory and _--rm_ flag will remove the container after execution. Normally containers are not deleted automatically.-->
你可以尝试ubuntu镜像可以执行的其他命令。例如试试 _docker container run --rm ubuntu ls_。_ls_ 命令将列出目录中的所有文件，而 _--rm_ 标志将在执行后删除容器。通常情况下容器不会自动删除。

<!-- Let''s continue with our first Ubuntu container with the **index.js** file inside of it. The container has stopped running since we exited it. We can list all of the containers with _container ls -a_, the _-a_ (or --all) will list containers that have already been exited.-->
让我们继续我们的第一个Ubuntu容器，里面有**index.js**文件。容器在我们退出后就停止运行了。我们可以用_container ls -a_列出所有容器，_-a_（或--all）会列出已经退出的容器。

```bash
$ docker container ls -a
CONTAINER ID   IMAGE     COMMAND   CREATED          STATUS                            NAMES
b8548b9faec3   ubuntu    "bash"    3 minutes ago    Exited (0) 6 seconds ago          hopeful_clarke
```

<!-- > <i>Editor''s note: that the command _docker container ls_ has also a shorter form _docker ps_</i>, I prefer the shorter one.-->
> <i>编辑者提示：命令_docker container ls_也有一个简短的形式_docker ps_，我更喜欢简短的形式。</i>

<!-- We have two options when addressing a container. The identifier in the first column can be used to interact with the container almost always. Plus, most commands accept the container name as a more human-friendly method of working with them. The name of the container was automatically generated to be **"hopeful_clarke"** in my case.-->
我们在处理容器时有两种选择。第一列中的标识符可以用来与容器交互，几乎总是如此。此外，大多数命令都接受容器名称作为一种更友好的工作方法。我的情况下，容器的名称被自动生成为**"hopeful_clarke"**。

<!-- The container has already exited, yet we can start it again with the start command that will accept the id or name of the container as a parameter: _start <i>CONTAINER-ID-OR-CONTAINER-NAME</i>_.-->
容器已经退出了，但我们可以使用start命令再次启动它，该命令接受容器ID或容器名称作为参数：_start <i>CONTAINER-ID-OR-CONTAINER-NAME</i>_ 。

```bash
$ docker start hopeful_clarke
hopeful_clarke
```

<!-- The start command will start the same container we had previously. Unfortunately, we forgot to start it with the flag _--interactive_ (that can also be written _-i_) so we can not interact with it.-->
`start` 命令会启动我们之前已经有的容器。不幸的是，我们忘记用 `--interactive` 标记（也可以写作 `-i`）启动它，所以我们无法与它进行交互。

<!-- The container is actually up and running as the command _container ls -a_ shows, but we just can not communicate with it:-->
容器实际上已经启动，正如命令`container ls -a`所显示的那样，但我们无法与它进行通信：

```bash
$ docker container ls -a
CONTAINER ID   IMAGE     COMMAND   CREATED          STATUS                            NAMES
b8548b9faec3   ubuntu    "bash"    7 minutes ago    Up (0) 15 seconds ago            hopeful_clarke
```

<!-- Note that we can also execute the command without the flag _-a_ to see just those containers that are running:-->
注意，我们也可以在不加 _-a_ 标志的情况下执行此命令，以查看正在运行的容器：

```bash
$ docker container ls
CONTAINER ID   IMAGE     COMMAND   CREATED          STATUS             NAMES
8f5abc55242a   ubuntu    "bash"    8 minutes ago    Up 1 minutes       hopeful_clarke
```

<!-- Let''s kill it with the _kill <i>CONTAINER-ID-OR-CONTAINER-NAME</i>_ command and try again.-->
让我们用`kill CONTAINER-ID-OR-CONTAINER-NAME`命令来终止它，然后再试一次。

```bash
$ docker kill hopeful_clarke
hopeful_clarke
```

<!-- _docker kill_ sends a [signal SIGKILL](https://man7.org/linux/man-pages/man7/signal.7.html) to the process forcing it to exit, and that causes the container to stop. We can check it''s status with _container ls -a_:-->
_docker kill_ 向进程发送[信号 SIGKILL](https://man7.org/linux/man-pages/man7/signal.7.html)，强制它退出，从而导致容器停止。我们可以使用 _container ls -a_ 检查它的状态：

```bash
$ docker container ls -a
CONTAINER ID   IMAGE     COMMAND   CREATED             STATUS                     NAMES
b8548b9faec3   ubuntu     "bash"   26 minutes ago      Exited 2 seconds ago       hopeful_clarke
```

<!-- Now let us start the container again, but this time in interactive mode:-->
现在让我们再次启动容器，但这次是以互动模式：

```bash
$ docker start -i hopeful_clarke
root@b8548b9faec3:/#
```

<!-- Let''s edit the file <i>index.js</i> and add in some JavaScript code to execute. We are just missing the tools to edit the file. [Nano](https://www.nano-editor.org/) will be a good text editor for now. The install instructions were found from the first result of Google. We will omit using sudo since we are already root.-->
让我们编辑文件<i>index.js</i>并添加一些JavaScript代码以执行。我们只是缺少编辑文件的工具。[Nano](https://www.nano-editor.org/)将是一个很好的文本编辑器。安装说明是从Google的第一个结果中找到的。由于我们已经是root，我们将省略使用sudo。

```bash
root@b8548b9faec3:/# apt-get update
root@b8548b9faec3:/# apt-get -y install nano
root@b8548b9faec3:/# nano /usr/src/app/index.js
```

<!-- Now we have Nano installed and can start editing files!-->
现在我们已经安装了Nano，可以开始编辑文件了！

</div>

<div class="tasks">

### Exercise 12.3 - 12.4

#### Exercise 12.3: Ubuntu 101

<!-- > Use _script_ to record what you do, save the file as script-answers/exercise12_3.txt-->
使用脚本记录你做了什么，将文件保存为script-answers/exercise12_3.txt

<!-- Edit the _/usr/src/app/index.js_ file inside the container with the now installed Nano and add the following line-->
of code

编辑容器中现在安装的Nano中的_/usr/src/app/index.js_文件，并添加以下代码行：

```js
console.log('Hello World')
```

<!-- If you are not familiar with Nano you can ask for help in the chat or Google.-->
如果你不熟悉Nano，你可以在聊天室或谷歌上寻求帮助。

#### Exercise 12.4: Ubuntu 102

<!-- > Use _script_ to record what you do, save the file as script-answers/exercise12_4.txt-->
使用脚本记录你的操作，将档案储存为script-answers/exercise12_4.txt

<!-- Install Node while inside the container and run the index file with _node /usr/src/app/index.js_ in the container.-->
在容器内安装Node，并使用`node /usr/src/app/index.js`在容器中运行index文件。

<!-- The instructions for installing Node are sometimes hard to find, so here is something you can copy-paste:-->
# 安装Node的说明有时很难找到，所以这里有一些可以复制粘贴的内容：

```
curl -sL https://deb.nodesource.com/setup_14.x | sudo -E bash -
sudo apt-get install -y nodejs
```

```bash
curl -sL https://deb.nodesource.com/setup_16.x | bash
apt install -y nodejs
```

<!-- You will need to install the _curl_ into the container. It is installed in the same way as you did with _nano_.-->
你需要在容器中安装_curl_。安装方式与你安装_nano_一样。

<!-- After the installation, ensure that you can run your code inside the container with command-->
`docker run hello-world`.

在安装之后，请确保你可以使用命令`docker run hello-world`在容器中运行你的代码。

```
root@b8548b9faec3:/# node /usr/src/app/index.js
Hello World
```

</div>

<div class="content">

### Other Docker commands

<!-- Now that we have Node installed in the container, we can execute JavaScript in the container! Let''s create a new image from the container. The command-->
to create a new image is `docker commit`.

现在我们已经在容器中安装了Node，我们可以在容器中执行JavaScript！让我们从容器中创建一个新的镜像。创建新镜像的命令是`docker commit`。

```bash
commit CONTAINER-ID-OR-CONTAINER-NAME NEW-IMAGE-NAME
```

<!-- will create a new image that includes the changes we have made. You can use _container diff_ to check for the changes between the original image and container before doing so.-->
我们将创建一个新的镜像，其中包含我们所做的更改。在这之前，您可以使用_容器diff_来检查原始镜像和容器之间的更改。

```bash
$ docker commit hopeful_clarke hello-node-world
```

<!-- You can list your images with _image ls_:-->
你可以使用`image ls`来列出你的图片：

```bash
$ docker image ls
REPOSITORY                                      TAG         IMAGE ID       CREATED         SIZE
hello-node-world                                latest      eef776183732   9 minutes ago   252MB
ubuntu                                          latest      1318b700e415   2 weeks ago     72.8MB
hello-world                                     latest      d1165f221234   5 months ago    13.3kB
```

<!-- You can now run the new image as follows:-->
现在可以按照以下方式运行新图像：

```bash
docker run -it hello-node-world bash
root@4d1b322e1aff:/# node /usr/src/app/index.js
```

<!-- There are multiple ways to achieve the same conclusion. Let''s go through a better solution. We will clean the slate with _container rm_ to remove the old container.-->
有多种方式可以达到同样的结论。让我们来看看一个更好的解决方案。我们将用_container rm_清除旧容器来清空板子。

```bash
$ docker container ls -a
CONTAINER ID   IMAGE     COMMAND   CREATED          STATUS                  NAMES
b8548b9faec3   ubuntu    "bash"    31 minutes ago   Exited (0) 9 seconds ago               hopeful_clarke

$ docker container rm hopeful_clarke
hopeful_clarke
```

<!-- Create a file <i>index.js</i> to your current directory and write _console.log('Hello, World')_ inside it. No need for containers yet.-->
在当前目录下创建一个文件<i>index.js</i>，并在里面写入 _console.log('Hello, World')_。暂时不需要容器。

<!-- Next, let's skip installing Node altogether. There are plenty of useful Docker images in Docker Hub ready for our use. Let's use the image [https://hub.docker.com/_/Node](https://hub.docker.com/_/Node), which has Node already installed. We only need to pick a version.-->
接下来，我们完全可以不用安装Node。Docker Hub上有许多有用的Docker镜像可供我们使用。让我们使用[https://hub.docker.com/_/Node](https://hub.docker.com/_/Node)镜像，它已经安装了Node。我们只需要选择一个版本即可。

<!-- By the way, the _container run_ accepts _--name_ flag that we can use to give a name for the container.-->
顺便提一句，`container run`接受`--name`标志，我们可以用它来为容器起个名字。

```bash
$ docker container run -it --name hello-node node:16 bash
```

<!-- Let us create a directory for the code inside the container:-->
让我们为容器内的代码创建一个目录：

```
root@77d1023af893:/# mkdir /usr/src/app
```

<!-- While we are inside the container on this terminal, open another terminal and use the _container cp_ command to copy file from your own machine to the container.-->
当我们在这个终端的容器内时，另外打开一个终端，使用 _container cp_ 命令将文件从您自己的机器复制到容器中。

```bash
$ docker container cp ./index.js hello-node:/usr/src/app/index.js
```

<!-- And now we can run _node /usr/src/app/index.js_ in the container. We can commit this as another new image, but there is an even better solution. The next section will be all about building your images like a pro.-->
现在我们可以在容器中运行 _node /usr/src/app/index.js_ 。我们可以把这提交为另一个新的镜像，但还有一个更好的解决方案。接下来的部分将全部关于如何像专业人士一样构建你的镜像。

</div>
