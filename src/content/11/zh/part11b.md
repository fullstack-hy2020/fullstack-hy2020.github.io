---
mainImage: ../../../images/part-11.svg
part: 11
letter: b
lang: zh
---

<div class="content">

<!-- Before we start playing with GitHub Actions, let's have a look at what they are and how do they work.-->
 在我们开始玩GitHub动作之前，让我们先看看它们是什么，它们是如何工作的。

<!-- GitHub Actions work on a basis of [workflows](https://docs.github.com/en/free-pro-team@latest/actions/learn-github-actions/introduction-to-github-actions#workflows). A workflow is a series of [jobs](https://docs.github.com/en/free-pro-team@latest/actions/learn-github-actions/introduction-to-github-actions#jobs) that are run when a certain triggering [event](https://docs.github.com/en/free-pro-team@latest/actions/learn-github-actions/introduction-to-github-actions#events) happens. The jobs that are run then themselves contain instructions for what GitHub Actions should do.-->
 GitHub 动作的工作基础是 [工作流](https://docs.github.com/en/free-pro-team@latest/actions/learn-github-actions/introduction-to-github-actions#workflows)。工作流程是一系列的[工作](https://docs.github.com/en/free-pro-team@latest/actions/learn-github-actions/introduction-to-github-actions#jobs)，当某个触发的[事件](https://docs.github.com/en/free-pro-team@latest/actions/learn-github-actions/introduction-to-github-actions#events)发生时就会运行。运行的作业本身就包含了GitHub Actions应该做什么的指令。

<!-- A typical execution of a workflow looks like this:-->
 一个典型的工作流程的执行是这样的。

<!-- - Triggering event happens (for example, there is a push to the main branch).-->
 - 触发事件发生（例如，有一个推送到主分支）。
<!-- - The workflow with that trigger is executed.-->
 - 带有该触发器的工作流被执行。
<!-- - Cleanup-->
 - 清理

### Basic needs

<!-- In general, to have CI operate on a repository, we need a few things:-->
 一般来说，要让 CI 在一个版本库上运行，我们需要一些东西。

<!-- - A repository (obviously)-->
 - 一个版本库（显然）。
<!-- - Some definition of what the CI needs to do:-->
 - CI需要做什么的一些定义。
<!--   This can be in the form of a specific file inside the repository or it can be defined in the CI system-->
 这可以是版本库中特定文件的形式，也可以是CI系统中的定义。
<!-- - The CI needs to be aware that the repository (and the file within it) exist-->
 - CI需要知道版本库（和其中的文件）的存在。
<!-- - The CI needs to be able to access the repository-->
 - CI需要能够访问该版本库
<!-- - The CI needs permissions to perform the actions it is supposed to be able to do:-->
 - CI需要权限来执行它应该能做的动作。
<!--   For example, if the CI needs to be able to deploy to a production environment, it needs <i>credentials</i> for that environment.-->
 例如，如果 CI 需要能够部署到生产环境，它需要该环境的<i>证书</i>。

<!-- That's the traditional model at least, we'll see in a minute how GitHub Actions short-circuit some of these steps or rather make it such that you don't have to worry about them!-->
 这至少是传统的模式，我们将在一分钟内看到GitHub Actions如何绕过其中的一些步骤，或者说让你不必担心这些问题

<!-- GitHub Actions have a great advantage over self-hosted solutions: the repository is hosted with the CI provider. In other words, Github provides both the repository and the CI platform. This means that if we've enabled actions for a repository, GitHub is already aware of the fact that we have workflows defined and what those definitions look like.-->
 与自我托管的解决方案相比，GitHub Actions 有一个很大的优势：仓库由 CI 供应商托管。换句话说，Github同时提供仓库和CI平台。这意味着，如果我们为一个仓库启用了行动，GitHub已经知道我们定义了工作流程，以及这些定义是什么样子的。

</div>

<div class="tasks">

### Exercise 11.2.

<!-- In most exercises of this part, we are building a CI/CD pipeline for a small project found in [this example project repository](https://github.com/smartlyio/fullstackopen-cicd).-->
 在这部分的大部分练习中，我们正在为[这个例子的项目库](https://github.com/smartlyio/fullstackopen-cicd)中的一个小项目建立一个CI/CD管道。

#### 11.2 The example project

<!-- The first thing you'll want to do is to fork the example repository under your name. What it essentially does is it creates a copy of the repository under your GitHub user profile for your use.-->
 你要做的第一件事是用你的名字分叉这个例子库。它的作用是在你的 GitHub 用户配置文件下创建一个仓库的副本供你使用。

<!-- To fork the repository, you can click on the Fork button in the top-right area of the repository view next to the Star button:-->
 要分叉该版本库，你可以点击版本库视图右上角明星按钮旁边的分叉按钮。

![](../../images/11/1.png)

<!-- Once you've clicked on the Fork button, GitHub will start the creation of a new repository called <code>{github_username}/full-stack-open-pokedex</code>.-->
 一旦你点击了分叉按钮，GitHub就会开始创建一个新的仓库，名为<code>{github_username}/full-stack-open-pokedex</code>。

<!-- Once the process has been finished, you should be redirected to your brand new repository:-->
 一旦这个过程完成，你应该被重定向到你的全新仓库。

![](../../images/11/2.png)

<!-- Clone the project now to your machine. As always, when starting with a new code, the most obvious place to look first is the file <code>package.json</code>-->
 现在克隆项目到你的机器上。像往常一样，当开始使用一个新的代码时，最明显的地方就是<code>package.json</code>文件。

<!-- Try now the following:-->
 现在尝试以下操作。
<!-- - install dependencies (by running <code>npm install</code>)-->
 - 安装依赖项(通过运行<code>npm install</code>)
<!-- - start the code in development mode-->
 - 在开发模式下启动代码
<!-- - run tests-->
 - 运行测试
<!-- - lint the code-->
 - 对代码进行润色

<!-- You might notice that project contains some broken tests and linting errors. **Just leave them as they are for now.** We will get around those later in the exercises.-->
 你可能会注意到该项目包含一些破碎的测试和刷新错误。**我们将在后面的练习中解决这些问题。

<!-- As you might remember from [part 3](/en/part3/deploying_app_to_internet#frontend-production-build), the React code <i>should not</i> be run in development mode once it is deployed in production. Try now the following-->
 你可能还记得[第三章节](/en/part3/deploying_app_to_internet#frontend-production-build)，React代码<i>不应该</i>在开发模式下运行，一旦它被部署到生产中。现在试试下面的方法
<!-- - create a production <i>build</i> of the project-->
 - 创建一个项目的生产<i>build</i>。
<!-- - run the production version locally-->
 - 在本地运行该生产版本

<!-- Also for these two tasks, there are ready-made npm scripts in the project!-->
 同样对于这两项任务，项目中也有现成的npm脚本!

<!-- Study the structure of the project for a while. As you notice both the frontend and the backend code is now [in the same repository](/en/part7/class_components_miscellaneous#frontend-and-backend-in-the-same-repository). In earlier parts of the course we had a separate repository for both, but having those in the same repository makes things much simpler when setting up a CI environment.-->
 研究一下这个项目的结构。正如你所注意到的，前端和后端代码现在都[在同一个仓库](/en/part7/class_components_miscellaneous#frontend-and-backend-in-the-same-repository)。在课程的早期部分，我们为二者建立了单独的仓库，但在建立CI环境时，将它们放在同一个仓库里会使事情变得更简单。

<!-- In contrast to most projects in this course, the frontend code <i>does not use</i> create-react-app, but it has a relatively simple [webpack](/en/part7/webpack) configuration that takes care of creating the development environment and creating the production bundle.-->
 与本课程中的大多数项目相反，前端代码<i>没有使用</i>create-react-app，但它有一个相对简单的[webpack](/en/part7/webpack)配置，负责创建开发环境和创建生产包。

</div>

<div class="content">

### Getting started with workflows

<!-- The core component of creating CI/CD pipelines with GitHub Actions is something called a [Workflow](https://docs.github.com/en/free-pro-team@latest/actions/learn-github-actions/introduction-to-github-actions#workflows). Workflows are process flows that you can set up in your repository to run automated tasks such as building, testing, linting, releasing, and deploying to name a few! The hierarchy of a workflow looks as follows:-->
 使用GitHub Actions创建CI/CD管道的核心组件是一个叫做[工作流](https://docs.github.com/en/free-pro-team@latest/actions/learn-github-actions/introduction-to-github-actions#workflows)的东西。工作流是你可以在你的版本库中设置的流程，以运行自动化任务，如构建、测试、刷新、发布和部署，仅举几个例子工作流的层次结构看起来如下。

<!-- Workflow-->
 工作流

<!-- - Job-->
 - 工作
<!--   - Step-->
 - 步骤
<!--   - Step-->
 - 步骤
<!-- - Job-->
 - 工作
<!--   - Step-->
 - 步骤

<!-- Each workflow must specify at least one [Job](https://docs.github.com/en/free-pro-team@latest/actions/learn-github-actions/introduction-to-github-actions#jobs), which contains a set of [Steps](https://docs.github.com/en/free-pro-team@latest/actions/learn-github-actions/introduction-to-github-actions#steps) to perform individual tasks. The jobs will be run in parallel and the steps in each job will be executed sequentially.-->
 每个工作流必须指定至少一个[作业](https://docs.github.com/en/free-pro-team@latest/actions/learn-github-actions/introduction-to-github-actions#jobs)，其中包含一组[步骤](https://docs.github.com/en/free-pro-team@latest/actions/learn-github-actions/introduction-to-github-actions#steps)来执行单个任务。作业将被并行运行，每个作业中的步骤将被按顺序执行。

<!-- Steps can vary from running a custom command to using pre-defined actions, thus the name GitHub Actions. You can create [customized actions](https://docs.github.com/en/free-pro-team@latest/actions/creating-actions) or use any actions published by the community, which are plenty, but let's get back to that later!-->
步骤可以从运行自定义命令到使用预先定义的行动，因此被称为GitHub行动。你可以创建[自定义动作](https://docs.github.com/en/free-pro-team@latest/actions/creating-actions)或使用社区发布的任何动作，这些动作很多，但让我们稍后再来讨论这个问题!

<!-- For GitHub to recognize your workflows, they must be specified in <code>.github/workflows</code> folder in your repository. Each Workflow is its own separate file which needs to be configured using the <code>YAML</code> data-serialization language.-->
 为了让GitHub识别你的工作流，它们必须被指定在你的仓库的<code>.github/workflows</code>文件夹中。每个工作流都是它自己的独立文件，需要使用<code>YAML</code>数据序列化语言进行配置。

<!-- YAML is a recursive acronym for "YAML Ain't Markup Language". As the name might hint its goal is to be human-readable and it is commonly used for configuration files. You will notice below that it is indeed very easy to understand!-->
YAML是 "YAML Ain't Markup Language "的递归首字母缩写。正如它的名字所暗示的那样，它的目标是人类可读的，它通常被用于配置文件。你会注意到下面的内容，它确实非常容易理解!

<!-- Notice that indentations are important in YAML. You can learn more about the syntax [here](https://docs.ansible.com/ansible/latest/reference_appendices/YAMLSyntax.html).-->
 注意，缩进在YAML中是很重要的。你可以了解更多关于语法的信息[这里](https://docs.ansible.com/ansible/latest/reference_appendices/YAMLSyntax.html)。

<!-- A basic workflow contains three elements in a YAML document. These three elements are:-->
 在YAML文档中，一个基本的工作流程包含三个元素。这三个元素是

<!-- - name: Yep, you guessed it, the name of the workflow-->
 - 名称：是的，你猜对了，工作流的名称
<!-- - (on) triggers: The events that trigger the workflow to be executed-->
 - （关于）触发器。触发该工作流执行的事件
<!-- - jobs: The separate jobs that the workflow will execute (a basic workflow might contain only one job).-->
 - 工作。工作流将执行的独立作业（一个基本的工作流可能只包含一个作业）。

<!-- A simple workflow definition looks like this:-->
 一个简单的工作流定义如下所示：

```yml
name: Hello World!

on:
  push:
    branches:
      - master

jobs:
  hello_world_job:
    runs-on: ubuntu-20.04
    steps:
      - name: Say hello
        run: |
          echo "Hello World!"
```

<!-- In this example, the trigger is a push to the main branch, which in our project is called <i>master</i>. (Your main branch could be called <i>main</i> or <i>master</i>).  There is one job named <i>hello\_world\_job</i>, it will be run in a virtual environment with Ubuntu 20.04. The job has just one step named "Say hello", which will run the <code>echo "Hello World!"</code> command in the shell.-->
 在这个例子中，触发器是推送到主分支，在我们的项目中被称为<i>master</i>。(你的主分支可以叫<i>main</i>或<i>master</i>)。  有一个名为<i>hello_world/job</i>的工作，它将在Ubuntu 20.04的虚拟环境中运行。这个作业只有一个步骤，名为 "Say hello"，它将在shell中运行<code>echo "Hello World!"</code>命令。

<!-- So you may ask, when does GitHub trigger a workflow to be started? There are plenty of [options](https://docs.github.com/en/free-pro-team@latest/actions/reference/events-that-trigger-workflows) to choose from, but generally speaking, you can configure a workflow to start once:-->
 所以你可能会问，GitHub什么时候会触发工作流的启动？有很多[选项](https://docs.github.com/en/free-pro-team@latest/actions/reference/events-that-trigger-workflows)可以选择，但一般来说，你可以将工作流配置为启动一次。

<!-- - An <i>event on GitHub</i> occurs such as when someone pushes a commit to a repository or when an issue or pull request is created-->
 - GitHub上的一个<i>事件</i>发生，比如有人向仓库推送了一个提交，或者创建了一个问题或拉动请求
<!-- - A <i>scheduled event</i>, that is specified using the [cron]( https://en.wikipedia.org/wiki/Cron)-syntax, happens-->
 - 一个使用[cron](https://en.wikipedia.org/wiki/Cron)语法指定的<i>计划事件</i>发生了
<!-- - An <i>external event</i> occurs, for example, a command is performed in an external application such as [Slack](https://slack.com/) or [Discord](https://discord.com/) messaging app-->
 - 发生一个<i>外部事件</i>，例如，在一个外部应用中执行一个命令，如[Slack](https://slack.com/)或[Discord](https://discord.com/)消息应用

<!-- To learn more about which events can be used to trigger workflows, please refer to GitHub Action's [documentation](https://docs.github.com/en/free-pro-team@latest/actions/reference/events-that-trigger-workflows).-->
 要了解更多关于哪些事件可以用来触发工作流程，请参考GitHub Action的[文档](https://docs.github.com/en/free-pro-team@latest/actions/reference/events-that-trigger-workflows)。


</div>

<div class="tasks">

### Exercises 11.3-11.4.

<!-- To tie this all together, let us now get Github Actions up and running in the example project!-->
 为了将这一切联系起来，现在让我们在示例项目中启动并运行Github Action!

#### 11.3 Hello world!

<!-- Create a new Workflow which outputs "Hello World!" to the user. For the setup, you should create the directory <code>.github/workflows</code> and a file <code>hello.yml</code> to your repository.-->
 创建一个新的工作流，向用户输出 "Hello World！"。对于设置，你应该创建目录<code>.github/workflows</code>和一个文件<code>hello.yml</code>到你的仓库。

<!-- To see what your GitHub Action workflow has done, you can navigate to the **Actions** tab in GitHub where you should see the workflows in your repository and the steps they implement. The output of your Hello World workflow should look something like this with a properly configured workflow.-->
 要看你的GitHub行动工作流程做了什么，你可以导航到GitHub中的**行动**标签，在那里你应该看到你的仓库中的工作流程和它们实现的步骤。如果工作流程配置得当，"你好，世界 "工作流程的输出应该是这样的。

![A properly configured Hello World workflow](../../images/11/3.png)

<!-- You should see the "Hello World!" message as an output. If that's the case then you have successfully gone through all the necessary steps. You have your first GitHub Actions workflow active!-->
 你应该看到 "Hello World!"信息作为输出。如果是这样的话，那么你已经成功地完成了所有必要的步骤。你的第一个GitHub Actions工作流已经激活了!

<!-- Note that GitHub Actions also gives you information what is the exact environment (operating system, and it's [setup](https://github.com/actions/virtual-environments/blob/ubuntu18/20201129.1/images/linux/Ubuntu1804-README.md)) where your workflow is run. This is important since if something surprising happens, it makes debugging so much easier if you can reproduce all the steps in your machine!-->
 注意，GitHub Actions 还会告诉你工作流运行的具体环境（操作系统和它的 [setup](https://github.com/actions/virtual-environments/blob/ubuntu18/20201129.1/images/linux/Ubuntu1804-README.md)）是什么。这很重要，因为如果发生了令人惊讶的事情，如果你能在你的机器上重现所有的步骤，那么调试就会容易得多

#### 11.4 Date and directory contents

<!-- Extend the workflow with steps that print the date and current directory content in long format.-->
 用长格式打印日期和当前目录内容的步骤来扩展工作流程。

<!-- Both of these are easy steps, and just running commands [date](https://man7.org/linux/man-pages/man1/date.1.html) and [ls](https://man7.org/linux/man-pages/man1/ls.1.html) will do the trick.-->
这两个步骤都很简单，只要运行命令[date](https://man7.org/linux/man-pages/man1/date.1.html)和[ls](https://man7.org/linux/man-pages/man1/ls.1.html)就可以了。

<!-- Your workflow should now look like this-->
 你的工作流程现在应该是这样的

![Date and dir content in workflow](../../images/11/4.png)

<!-- As the output of command <code>ls -l</code> shows, by default, the virtual environment that runs our workflow <i>does not</i> have any code!-->
 正如命令<code>ls -l</code>的输出显示，默认情况下，运行我们工作流程的虚拟环境<i>没有</i>任何代码!

</div>

<div class="content">

### Setting up lint, test and build steps

<!-- After completing the first exercises, you should have a simple but pretty useless workflow set up. Let's make our workflow do something useful.-->
 在完成第一个练习后，你应该有一个简单但相当无用的工作流设置。让我们来让我们的工作流做一些有用的事情。

<!-- Let's implement a Github Action that will lint the code. If the checks don't pass, Github Actions will show a red status.-->
 让我们实现一个Github动作，对代码进行检查。如果检查没有通过，Github行动将显示红色状态。

<!-- At start, the workflow that we will save to file <code>pipeline.yml</code> looks like this:-->
 开始时，我们将保存在文件<code>pipeline.yml</code>中的工作流程是这样的。

```js
name: Deployment pipeline

on:
  push:
    branches:
      - master

jobs:
```

<!-- Before we can run a command to lint the code, we have to perform a couple of actions to set up the environment of the job.-->
 在我们运行命令对代码进行润色之前，我们必须执行几个动作来设置工作的环境。

#### Setting up the environment

<!-- Setting up the environment is an important task while configuring a pipeline. We're going to use an <code>ubuntu-20.04</code> virtual environment because this is the version of Ubuntu we're going to be running in production.-->
 设置环境是配置管道时的一项重要任务。我们将使用一个<code>ubuntu-20.04</code>虚拟环境，因为这是我们将在生产中运行的Ubuntu版本。

<!-- It is important to replicate the same environment in CI as in production as closely as possible, to avoid situations where the same code works differently in CI and production, which would effectively defeat the purpose of using CI.-->
 在CI中尽可能地复制与生产中相同的环境是很重要的，以避免相同的代码在CI和生产中工作不同的情况，这将有效地挫败使用CI的目的。

<!-- Next, we list the steps in the "build" job that the CI would need to perform. As we noticed in the last exercise, by default the virtual environment does not have any code in it, so we need to <i>checkout the code</i> from the repository.-->
 接下来，我们列出CI需要执行的 "构建 "工作中的步骤。正如我们在上一个练习中注意到的，默认情况下，虚拟环境中没有任何代码，所以我们需要<i>从仓库中签出代码</i>。

<!-- This an easy step:-->
这是一个简单的步骤。

```js
name: Deployment pipeline

on:
  push:
    branches:
      - master

jobs:
  simple_deployment_pipeline: // highlight-line
    runs-on: ubuntu-20.04 // highlight-line
    steps: // highlight-line
      - uses: actions/checkout@v3  // highlight-line
```

<!-- The [uses](https://docs.github.com/en/free-pro-team@latest/actions/reference/workflow-syntax-for-github-actions#jobsjob_idstepsuses) keyword tells the workflow to run a specific <i>action</i>. An action is a reusable piece of code, like a function. Actions can be defined in your repository in a separate file or you can use the ones available in public repositories.-->
 [uses](https://docs.github.com/en/free-pro-team@latest/actions/reference/workflow-syntax-for-github-actions#jobsjob_idstepsuses)关键词告诉工作流要运行一个特定的<i>动作</i>。行动是一段可重复使用的代码，就像一个函数。行动可以在你的版本库中定义为一个单独的文件，也可以使用公共版本库中的行动。

<!-- Here we're using a public action [actions/checkout](https://github.com/actions/checkout) and we specify a version (<code>@v3</code>) to avoid potential breaking changes if the action gets updated. The <code>checkout</code> action does what the name implies: it checkouts the project source code from git.-->
 这里我们使用一个公共动作[actions/checkout](https://github.com/actions/checkout)，我们指定了一个版本(<code>@v3</code>)，以避免在动作被更新时可能出现的破坏性变化。<code>checkout</code>动作就像它的名字所暗示的那样：它从git检查项目的源代码。

<!-- Secondly, as the application is written in JavaScript, Node.js must be set up to be able to utilize the commands that are specified in <code>package.json</code>. To set up Node.js, [actions/setup-node](https://github.com/actions/setup-node) action can be used. Version <code>16</code> is selected because it is the version the application is using in the production environment.-->
 其次，由于应用是用JavaScript编写的，Node.js必须被设置为能够利用<code>package.json</code>中指定的命令。要设置Node.js，可以使用[actions/setup-node](https://github.com/actions/setup-node) 动作。版本<code>16</code>被选中，因为它是应用在生产环境中使用的版本。

```js
# name and trigger not shown anymore...

jobs:
  simple_deployment_pipeline:
    runs-on: ubuntu-20.04
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v2 // highlight-line
        with: // highlight-line
          node-version: '16' // highlight-line
```

<!-- As we can see, the [with](https://docs.github.com/en/free-pro-team@latest/actions/reference/workflow-syntax-for-github-actions#jobsjob_idstepswith) keyword is used to give a "parameter" to the action. Here the parameter specifies the version of Node.js we want to use.-->
 我们可以看到，[with](https://docs.github.com/en/free-pro-team@latest/actions/reference/workflow-syntax-for-github-actions#jobsjob_idstepswith)关键字被用来给动作提供一个 "参数"。这里的参数指定了我们要使用的Node.js的版本。


<!-- Lastly, the dependencies of the application must be installed. Just like on your own machine we execute <code>npm install</code>. The steps in the job should now look something like-->
 最后，必须安装应用的依赖项。就像在你自己的机器上，我们执行<code>npm install</code>。工作中的步骤现在看起来应该是这样的

```js
jobs:
  simple_deployment_pipeline:
    runs-on: ubuntu-20.04
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v2
        with:
          node-version: '16'
      - name: npm install  // highlight-line
        run: npm install  // highlight-line
```

<!-- Now the environment should be completely ready for the job to run actual important tasks in!-->
 现在环境应该完全准备好了，以便作业在其中运行实际的重要任务!

#### Lint

<!-- After the environment has been set up we can run all the scripts from <code>package.json</code> like we would on our own machine. To lint the code all you have to do is add a step to run the <code>npm run eslint</code> command.-->
 环境建立后，我们可以像在自己的机器上一样，运行<code>package.json</code>中所有的脚本。要对代码进行检查，你所要做的就是添加一个步骤来运行<code>npm run eslint</code>命令。

```js
jobs:
  simple_deployment_pipeline:
    runs-on: ubuntu-20.04
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v2
        with:
          node-version: '16'
      - name: npm install
        run: npm install
      - name: lint  // highlight-line
        run: npm run eslint // highlight-line
```

</div>

<div class="tasks">

### Exercises 11.5.-11.9.

#### 11.5 Linting workflow

<!-- Implement or <i>copy-paste</i> the "Lint" workflow and commit it to the repository. Use a new <i>yml</i> file for this workflow, you may call it e.g. <i>pipeline.yml</i>.-->
 执行或<i>复制-粘贴</i>"Lint "工作流程，并将其提交到版本库中。为这个工作流程使用一个新的<i>yml</i>文件，你可以称它为例如<i>pipeline.yml</i>。

<!-- Push your code and navigate to "Actions" tab and click on your newly created workflow on the left. You should see that the workflow run has failed:-->
 推送你的代码，并导航到 "行动 "选项卡，在左边点击你新创建的工作流。你应该看到工作流运行失败了。

![Linting to workflow](../../images/11/5.png)

#### 11.6 Fix the code

<!-- There are some issues with the code that you will need to fix. Open up the workflow logs and investigate what is wrong.-->
 代码中存在一些问题，你需要加以解决。打开工作流程的日志，调查一下哪里出了问题。

<!-- A couple of hints. One of the errors is best to be fixed by specifying proper <i>env</i> for linting, see [here](/en/part3/validation_and_es_lint#lint) how it can be done . One of the complaints concerning <code>console.log</code> statement could be taken care of by simply silencing the rule for that specific line. Ask google how to do it.-->
 有几个提示。其中一个错误最好通过为linting指定适当的<i>env</i>来解决，见[这里](/en/part3/validation_and_es_lint#lint)如何做。关于<code>console.log</code>语句的投诉之一，可以通过简单地沉默该特定行的规则来解决。问问google怎么做吧。

<!-- Make the necessary changes to the source code so that the lint workflow passes. Once you commit new code the workflow will run again and you will see updated output where all is green again:-->
 对源代码进行必要的修改，使lint工作流通过。一旦你提交了新的代码，工作流就会再次运行，你会看到更新的输出，所有的东西都是绿色的。

![Lint error fixed](../../images/11/6.png)

#### 11.7 Building and testing

<!-- Let's expand on the previous workflow that currently does the linting of the code. Edit the workflow and similarly to the lint command add commands for build and test. After this step outcome should look like this-->
 让我们在之前的工作流程上进行扩展，该工作流程目前正在对代码进行刷新。编辑工作流程，并在lint命令的基础上增加build和test的命令。这一步之后，结果应该是这样的

![tests fail...](../../images/11/7.png)

<!-- As you might have guessed, there are some problems in code...-->
 正如你可能已经猜到的，代码中存在一些问题...

#### 11.8 Back to green

<!-- Investigate which test fails and fix the issue in the code (do not change the tests).-->
 调查哪个测试失败了，在代码中修复这个问题（不要改变测试）。

<!-- Once you have fixed all the issues and the Pokedex is bug-free, the workflow run will succeed and show green!-->
 一旦你修复了所有的问题，并且Pokedex没有错误，工作流程的运行就会成功，并且显示为绿色!

![tests fixed](../../images/11/8.png)

#### 11.9 Simple end to end -tests

<!-- The current set of tests use [Jest](https://jestjs.io/) to ensure that the React components work as intended. This is exactly the same thing that is done in section [Testing React apps](/en/part5/testing_react_apps) of part 5.-->
 目前的测试集使用[Jest](https://jestjs.io/)来确保React组件按预期工作。这与第5章节的[Testing React apps](/en/part5/testing_react_apps)所做的事情完全一样。

<!-- Testing components in isolation is quite useful but that still does not ensure that the system as a whole works as we wish. To have more confidence about this, let us write a couple of really simple end to end -tests with the [Cypress](https://www.cypress.io/) library similarly what we do in section [End to end testing](/en/part5/end_to_end_testing) of part 5.-->
 孤立地测试组件是相当有用的，但这仍然不能确保系统作为一个整体按照我们的意愿工作。为了对此更有信心，让我们用[Cypress](https://www.cypress.io/)库写几个真正简单的端到端测试，就像我们在第五章节的[端到端测试](/en/part5/end_to_end_testing)中做的那样。

<!-- So, setup Cypress (you'll find [here](/en/part5/end_to_end_testing/) all info you need) and use this test at first:-->
 所以，设置Cypress（你会发现[这里](/en/part5/end_to_end_testing/)你需要的所有信息）并首先使用这个测试。

```js
describe('Pokedex', function() {
  it('front page can be opened', function() {
    cy.visit('http://localhost:5000')
    cy.contains('ivysaur')
    cy.contains('Pokémon and Pokémon character names are trademarks of Nintendo.')
  })
})
```

<!-- Define a npm script <code>test:e2e</code> for running the e2e tests from the command line.-->
 定义一个npm脚本 <code>test:e2e</code> 用于从命令行运行e2e测试。

<!-- **Note** do not include the word <i>spec</i> in the Cypress test file name, that would cause also Jest to run it, and it might cause problems.-->
 **注意**不要在Cypress测试文件名中包含<i>spec</i>这个词，那样也会导致Jest运行它，而且可能会引起问题。

<!-- **Another thing to note** is that despite the page renders the Pokemon names by starting with a capital letter, the names are actually written with lower case letters in the source, so it is <code>ivysaur</code> instead of <code>Ivysaur</code>!-->
 **另一件需要注意的事情是**尽管页面上渲染的小精灵名字是以大写字母开始的，但实际上在源文件中这些名字是以小写字母书写的，所以是<code>ivysaur</code>而不是<code>Ivysaur</code>!

<!-- Ensure that the test passes locally. Remember that the Cypress tests _assume that the application is up and running_ when you run the test! If you have forgotten the details (that happened to me too!), please see [part 5](/en/part5/end_to_end_testing) how to get up and running with Cypress.-->
 确保测试在本地通过。请记住，Cypress测试_假设当你运行测试时，应用已经启动并运行了_!如果你忘记了细节（我也遇到过这种情况！），请看[第5章节](/en/part5/end_to_end_testing)如何使用Cypress启动和运行。

<!-- Once the end to end test works in your machine, include it in the GitHub Action workflow. By far the easiest way to do that is to use the ready-made action [cypress-io/github-action](https://github.com/cypress-io/github-action). The step that suits us is the following:-->
 一旦端到端测试在你的机器上运行，将其纳入GitHub行动工作流程。到目前为止，最简单的方法是使用现成的行动[cypress-io/github-action](https://github.com/cypress-io/github-action)。适合我们的步骤如下。

```js
- name: e2e tests
  uses: cypress-io/github-action@v2
  with:
    command: npm run test:e2e
    start: npm run start-prod
    wait-on: http://localhost:5000
```

<!-- Three options are used. [command](https://github.com/cypress-io/github-action#custom-test-command) specifies how to run Cypress tests. [start](https://github.com/cypress-io/github-action#start-server) gives npm script that starts the server and [wait-on](https://github.com/cypress-io/github-action#wait-on) says that before the tests are run, the server should have started in url <http://localhost:5000>.-->
 使用了三个选项。[command](https://github.com/cypress-io/github-action#custom-test-command)指定如何运行Cypress测试。[start](https://github.com/cypress-io/github-action#start-server)给出了启动服务器的npm脚本，[wait-on](https://github.com/cypress-io/github-action#wait-on)表示在运行测试之前，服务器应该已经在url <http://localhost:5000>中启动。

<!-- Once you are sure that the pipeline works, write another test that ensures that one can navigate from the main page to the page of a particular Pokemon, e.g. <i>ivysaur</i>. The test does not need to be a complex one, just check that when you navigate a link, the page has some right content, such as the string <i>chlorophyll</i> in the case of <i>ivysaur</i>.-->
 一旦你确定管道工作，写另一个测试，确保人们可以从主页面导航到一个特定的小精灵的页面，例如<i>ivysaur</i>。这个测试不需要很复杂，只需检查当你浏览一个链接时，该页面有一些正确的内容，例如在<i>ivysaur</i>的情况下，字符串<i>chlorophyll</i>。

<!-- **Note** also the Pokemon abilities are written with lower case letters, the capitalization is done in CSS, so <i>do not</i> search eg. for <i>Chlorophyll</i> but <i>chlorophyll</i>.-->
 **注意**口袋妖怪的能力也是用小写字母写的，大写字母是在CSS中完成的，所以<i>不要</i>搜索例如<i>Chlorophyll</i>，而是<i>chlorophyll</i>。

<!-- **Note2** that you should not try <i>bulbasaur</i>, for some reason the page of that particular Pokemon does not work properly...-->
 **注意2**，你不应该尝试<i>bulbasaur</i>，由于某些原因，该特定小精灵的页面不能正常工作......

<!-- The end result should be something like this-->
 最后的结果应该是这样的

![e2e tests](../../images/11/9.png)

<!-- End to end -tests are nice since they give us confidence that software works from the end user's perspective. The price we have to pay is the slower feedback time. Now executing the whole workflow takes quite much longer.-->
 端到端测试是很好的，因为它们从最终用户的角度给了我们软件工作的信心。我们必须付出的代价是较慢的反馈时间。现在执行整个工作流程需要相当长的时间。

</div>
