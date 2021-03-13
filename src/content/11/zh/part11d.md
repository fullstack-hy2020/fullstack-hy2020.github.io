---
mainImage: ../../../images/part-11.svg
part: 11
letter: d
lang: zh
---

<div class="content">

<!-- Your main branch of the code should always remain <i>green</i>. Being green means that all the steps of your build pipeline should complete successfully: the project should build successfully, tests should run without errors, and the linter shouldn't have anything to complain about, etc. -->
代码的主分支应该始终保持<i>绿色</i>。绿色意味着构建管道的所有步骤都应该成功完成: 项目应该成功构建，测试应该在没有错误的情况下运行，代码检查应该没有任何可以抱怨的东西，等等。


<!-- Why is this important? You will likely deploy your code to production specifically from your main branch. Any failures in the main branch would mean that new features cannot be deployed to production until the issue is sorted out. Sometimes you will discover a nasty bug in production that was not caught by the CI/CD pipeline. In these cases, you want to be able to roll the production environment back to a previous commit in a safe manner. -->
为什么这很重要？您可能会将代码部署到生产环境中，特别是从您的主分支。主分支中的任何故障都意味着在问题解决之前不能将新特性部署到生产环境中。有时您会发现生产中的一个讨厌的错误，这个错误没有被 CI/CD 管道捕捉到。在这些情况下，您希望能够以安全的方式将生产环境回滚到以前的提交。

<!-- How do you keep your main branch green then? Avoid committing any changes directly to the main branch. Instead, commit your code on a branch based on the freshest possible version of the main branch. Once you think the branch is ready to be merged into the master you create a GitHub Pull Request (also referred to as <abbr title="Pull Request">PR</abbr>). -->
那么你们如何保持你们的主分支的绿色呢？避免直接向主分支提交任何更改。相反，应该基于主分支的最新版本在分支上提交代码。一旦您认为分支已经准备好合并到主控中，您将创建一个 GitHub Pull Request (也称为 <abbr title="Pull Request">PR</abbr>)。

### Working with Pull Requests
使用PR

<!-- Pull requests are a core part of the collaboration process when working on any software project with at least two contributors. When making changes to a project you checkout a new branch locally, make and commit your changes, push the branch to the remote repository (in our case to GitHub) and create a pull request for someone to review your changes before those can be merged into the master branch. -->
在至少有两个贡献者参与的任何软件项目中，PR都是协作过程的核心部分。当对一个项目进行更改时，您需要在本地签出一个新的分支，进行并提交您的更改，将分支推送到远程代码库(在我们的例子中是 GitHub) ，并创建一个 PR，让其他人查看您的更改，然后再将这些更改合并到主分支中。

<!-- There are several reasons why using pull requests and getting your code reviewed by at least one other person is always a good idea. -->
有几个原因可以解释为什么使用PR并让至少一个其他人审查您的代码总是一个好主意。
<!-- - Even a seasoned developer can often overlook some issues in their code: we all know of the tunnel vision effect.
- A reviewer can have a different perspective and offer a different point of view.
- After reading through your changes, at least one other developer will be familiar with the changes you've made.
- Using PRs allows you to automatically run all tasks in your CI pipeline before the code gets to the master branch. GitHub Actions provides a trigger for pull requests. -->

- 即使是经验丰富的开发人员也经常会忽略代码中的一些问题: 我们都知道“隧道视野效应”。
- 评论者可以有不同的观点，提出不同的观点。
- 在阅读了您的更改之后，至少还有一个开发人员会熟悉您所做的更改。
- 使用 PRs 允许您在代码到达主分支之前自动运行 CI 管道中的所有任务。提供了一个PR的触发器。


<!-- You can configure your GitHub repository in such a way that pull requests cannot be merged until they are approved. -->
您可以以这样的方式配置您的 GitHub 代码库，即在请求得到批准之前不能合并请求。

![Compare & pull request](../../images/11/part11d_00.png)

<!-- To open a new pull request, open your branch in GitHub and click on the green "Compare & pull request" button at the top. You will be presented with a form where you can fill in the pull request description. -->
要打开一个新的PR，在 GitHub 中打开你的分支，然后点击顶部绿色的"Compare & pull request"按钮。您将看到一个表单，您可以在其中填写PR描述。

![Open a new pull request](../../images/11/part11d_01.png)

<!-- GitHub's pull request interface presents a description and the discussion interface. At the bottom, it displays all the CI checks (in our case each of our Github Actions) that are configured to run for each PR and the statuses of these checks. A green board is what you aim for! You can click on Details of each check to view details and run logs. -->
GitHub 的 pull 请求接口提供了描述和讨论接口。在底部，它显示了所有的 CI 检查(在我们的例子中，每个 Github Actions) ，这些检查被配置为为每个 PR 和这些检查的状态运行。一个绿色的板是你的目标！您可以单击每次检查的详细信息以查看详细信息并运行日志。


<!-- All the workflows we looked at so far were triggered by commits to master branch. To make the workflow run for each pull request we would have to update the trigger part of the workflow. We use the "pull_request" trigger for branch "master" and limit the trigger to events "opened" and "synchronize". Basically, this means, that the workflow will run when a PR into master is opened or updated. -->
到目前为止我们看到的所有工作流都是由提交到 master 分支触发的。要使工作流为每个请求运行，我们必须更新工作流的触发器部分。我们对分支“master”使用“pull_request”触发器，并将触发器限制为“ opened”和“synchronize”事件。基本上，这意味着，工作流在 PR 到master 打开或更新时将运行。

<!-- So let us change events that [trigger](https://docs.github.com/en/free-pro-team@latest/actions/reference/events-that-trigger-workflows) of the workflow as follows: -->
因此，让我们将触发[trigger](https://docs.github.com/en/free-pro-team@latest/actions/reference/events-that-trigger-workflows)工作流的事件更改如下:

```js
on:
  push:
    branches:
      - master
  pull_request: // highlight-line
    branches: [master] // highlight-line
    types: [opened, synchronize] // highlight-line
```

<!-- We shall soon make it impossible to push the code directly to master, but in the meantime, let us still run the workflow also for all the possible direct pushes to master. -->
我们很快就不可能把代码直接推给master 分支，但同时，让我们仍然运行工作流以及为所有可能的直接推给master 分支。


</div>

<div class="tasks">

### Exercises 11.14-11.15.

<!-- Our workflow is doing a nice job of ensuring good code quality, but since it is run on commits to master, it's catching the problems too late! -->
我们的工作流在确保良好的代码质量方面做得很好，但是由于它是在提交到 master 上运行的，因此它发现问题的时间太晚了！

#### 11.14 pull request

<!-- Update the trigger of the existing workflow as suggested above to run on new pull requests to master. -->
按照上面的建议更新现有工作流的触发器，以便在新的请求上运行。


<!-- Create a new branch, commit your changes, and open a pull request to master. -->
创建一个新的分支，提交您的更改，并打开一个PR到master。

<!-- If you have not worked with branches before, check [e.g. this tutorial](https://www.atlassian.com/git/tutorials/using-branches) to get started. -->
如果您以前没有使用过分支，请查看[本教程](https://www.atlassian.com/git/tutorials/using-branches)以开始。

<!-- Note that when you open the pull request, make sure that you select here your <i>own</i> repository as the destination <i>base repository</i>. By default, the selection is the original repository by smartly and you **do not want** to do that: -->
请注意，当您打开PR时，请确保您在这里选择您<i>自己的</i>代码库作为目标<i>基础代码库</i>。默认情况下，选择的是最初的代码库，你**不想**这样做:


![](../../images/11/15a.png)

<!-- In the "Conversation" tab of the pull request you should see your latest commit(s) and the yellow status for checks in progress: -->
在PR的“Conversation”选项卡中，您应该看到您的最新提交和正在进行的检查的黄色状态:

![](../../images/11/16.png)

<!-- Once the checks have been run, the status should turn to green. Make sure all the checks pass. Do not merge your branch yet, there's still one more thing we need to improve on our pipeline. -->
一旦检查已经运行，状态应该转为绿色。确保所有的检查都通过。先不要合并您的分支，还有一件事情，我们需要改善我们的管道。

#### 11.15 run deployment step only for master branch

<!-- All looks good, but there is actually a pretty serious problem with the current workflow. All the steps, including the deployment, are run also for pull requests. This is surely something we do not want! -->
看起来都不错，但实际上当前的工作流程存在一个相当严重的问题。所有的步骤，包括部署，都是针对PR运行的。这肯定是我们不想要的东西！

<!-- Fortunately, there is an easy solution for the problem! We can add an [if](https://docs.github.com/en/free-pro-team@latest/actions/reference/workflow-syntax-for-github-actions#jobsjob_idif) condition to the deployment step, which ensures that the step is executed only when the code is being merged or pushed to master. -->
幸运的是，这个问题有一个简单的解决方案！我们可以在部署步骤中添加一个 [if](https://docs.github.com/en/free-pro-team@latest/actions/reference/workflow-syntax-for-github-actions#jobsjob_idif)  条件，这样可以确保只有当代码被合并或推送到master 时才执行该步骤。

<!-- The workflow [context](https://docs.github.com/en/free-pro-team@latest/actions/reference/context-and-expression-syntax-for-github-actions#contexts) gives various kinds of information about the code the workflow is run. -->
工作流上下文[context](https://docs.github.com/en/free-pro-team@latest/actions/reference/context-and-expression-syntax-for-github-actions#contexts)提供了有关运行工作流的代码的各种信息。


<!-- The relevant information is found in [github context](https://docs.github.com/en/free-pro-team@latest/actions/reference/context-and-expression-syntax-for-github-actions#github-context), the field <i>event_name</i> tells what is the "name" of the event that triggered the workflow. When a pull request is merged, the name of the event is somehow paradoxically <i>push</i>, the same event that happens when pushing the code to the repository. Thus, we get the desired behavior by adding the following condition to the step that deploys the code: -->
在 [github context](https://docs.github.com/en/free-pro-team@latest/actions/reference/context-and-expression-syntax-for-github-actions#github-context)中可以找到相关信息，字段<i>event_name</i> 告诉触发工作流的事件的“名称”是什么。当合并PR时，事件的名称是 push，这与将代码推送到代码库时发生的事件相同。因此，我们通过在部署代码的步骤中添加以下条件来获得所需的行为:


```js
if: ${{ github.event_name == 'push' }}
```

<!-- Push some more code to your branch, and ensure that the deployment step <i>is not executed</i> anymore. Then merge the branch to master and make sure that the deployment happens. -->
将更多的代码推送到分支，并确保 <i>不再执行</i>部署步骤。然后将分支合并到 master 中，并确保发生部署。

</div>

<div class="content">

### Versioning
版本控制

<!-- The most important purpose of versioning is to uniquely identify the software we're running and the code associated with it.  -->
版本控制最重要的目的是唯一地标识我们正在运行的软件以及与之相关的代码。


<!-- The ordering of versions is also an important piece of information. For example, if the current release has broken critical functionality and we need to identify the <i>previous version</i> of the software so that we can roll back the release back to a stable state. -->
版本的排序也是一个重要的信息。例如，如果当前版本破坏了关键功能，我们需要识别软件的前一个版本，以便我们可以将该版本回滚到稳定状态。

#### Semantic Versioning and Hash Versioning
语义版本控制和散列版本控制

<!-- How an application is versioned is sometimes called a versioning strategy. We'll look at and compare two such strategies. -->
如何对应用程序进行版本控制有时被称为版本控制策略。


<!-- The first one is [semantic versioning](https://semver.org/), where a version is in the form <code>{major}.{minor}.{patch}</code>. For example, if the version is <code>1.2.3</code>, it has <code>1</code> as the major version, <code>2</code> is the minor version, and <code>3</code> is the patch version. -->
第一个是语义版本控制 [semantic versioning](https://semver.org/)，其中一个 <code>{major}.{minor}.{patch}</code>。例如，如果版本是<code>1.2.3</code>，那么它的主版本是<code>1</code>，次版本是<code>2</code>，补丁版本是<code>3</code>。

<!-- In general, changes that fix the functionality without changing how the application works from the outside are <code>patch</code> changes, changes that make small changes to functionality (as viewed from the outside) are <code>minor</code> changes and changes that completely change the application (or major functionality changes) are <code>major</code> changes. The definitions of each of these terms can vary from project to project.  -->
一般来说，在不改变应用程序外部工作方式的情况下修改功能的变更是修补程序<code>patch</code>的变更，对功能进行微小<code>minor</code> 变更的变更(从外部看)是微小变更，完全改变应用程序的变更(或主要功能变更)是<code>主要</code>变更。这些术语的定义可能因项目而异。

<!-- For example, npm-libraries are following the semantic versioning. At the time of writing this text (7th December 2020) the most recent version of React is [17.0.1](https://reactjs.org/versions/), so the major version is 17 which is quite recent and it has just been bumped up one patch step, the minor version is still 0. -->
例如，npm-library 遵循语义版本控制。在写这篇文章的时候(2020年12月7日) ，React 的最新版本是[17.0.1](https://reactjs.org/versions/)，所以主版本是17，这是相当新的，它只是被提升了一个补丁步骤，次要版本仍然是0。


<!-- <i>Hash versioning</i> (also sometimes known as SHA versioning) is quite different. The version "number" in hash versioning is a hash (that looks like a random string) derived from the contents of the repository and the changes introduced in this commit. In git, this is already done for you as the commit hash that is unique for any change set. -->
<i>散列版本控制</i>(有时也称为 SHA 版本控制)是完全不同的。哈希版本控制中的版本“ number”是一个哈希(看起来像是一个随机字符串) ，它派生自代码库的内容以及在这次提交中引入的更改。在 git 中，这已经完成了，因为提交散列对于任何更改集都是唯一的。

<!-- Hash versioning is almost always used in conjunction with automation. It's a pain (and error-prone) to copy 32 character long version numbers around to make sure that everything is correctly deployed. -->
散列方式到版本控制几乎总是与自动化结合使用。复制32个字符长的版本号以确保所有内容都被正确部署是一件痛苦的事情(并且容易出错)。

#### But what does the version point to?
那这个版本指向了什么呢？

<!-- Determining what code is in a given version is important and the way this is achieved is again quite different between semantic and hash versioning. In hash versioning (at least in git) it's as simple as looking up the commit based on the hash. This will let us know exactly what code is deployed with which version. -->
确定给定版本中的代码非常重要，而实现这一点的方式在语义版本和散列版本之间又是完全不同的。在散列版本控制中(至少在 git 中) ，它就像基于散列查找提交一样简单。这将让我们确切地知道哪个版本部署了哪些代码。


<!-- It's a little more complicated when using semantic versioning and there are several ways to approach the problem. These boil down to three possible approaches: something in the code itself, something in the repo or repo metadata, something completely outside the repo. -->
在使用语义版本控制时，情况会稍微复杂一些，有几种方法可以解决这个问题。这些可以归结为三种可能的方法: 代码本身，repo或 repo到元数据，repo之外的东西。


<!-- While we won't cover the last option on the list (since that's a rabbit hole all on its own), it's worth mentioning that this can be as simple as a spreadsheet that lists the Semantic Version and the commit it points to. -->
虽然我们不会讨论列表中的最后一个选项(因为它本身就是一个兔子洞) ，但值得一提的是，这可以像列出语义版本和它指向的 commit 的电子表格一样简单。


<!-- For the two repo based approaches, the approach with something in the code usually boils down to a version number in a file and the repo/metadata approach usually relies on [tags](https://www.atlassian.com/git/tutorials/inspecting-a-repository/git-tag) or (in the case of GitHub) releases. In the case of tags or releases, this is relatively simple, the tag or release points to a commit, the code in that commit is the code in the release. -->
对于两种基于 repo 的方法，代码中包含某些内容的方法通常可以归结为文件中的版本号，而 repo/metadata 方法通常依赖于[tags](https://www.atlassian.com/git/tutorials/inspecting-a-repository/git-tag) 或(对于 GitHub) release。对于tag或release，这相对简单，tag或release点指向一个commit，commit中的代码就是release中的代码。

#### Version order
版本顺序

<!-- In semantic versioning, even if we have version bumps of different types (major, minor, or patch) it's still quite easy to put the releases in order: 1.3.7 comes before 2.0.0 which itself comes before 2.1.5 which comes before 2.2.0. A list of releases (conveniently provided by a package manager or GitHub) is still needed to know what the last version is but it's easier to look at that list and discuss it: It's easier to say "We need to roll back to 3.2.4" than to try communicate a hash in person. -->
在语义版本控制中，即使我们有不同类型的版本碰撞(主版本、次版本或补丁版本) ，我们仍然可以很容易地将发布按顺序排列: 1.3.7在2.0.0之前，而2.0.0本身在2.1.5之前，2.2.0之前。仍然需要一个版本列表(由软件包管理器或 GitHub 方便地提供)来知道最后的版本是什么，但是查看这个列表并讨论它更容易: 说“我们需要回滚到3.2.4”比亲自尝试传递一个散列更容易。


<!-- That's not to say that hashes are inconvenient: if you know which commit caused the particular problem, it's easy enough to look back through a git history and get the hash of the previous commit. But if you have two hashes, say <code>d052aa41edfb4a7671c974c5901f4abe1c2db071</code> and <code>12c6f6738a18154cb1cef7cf0607a681f72eaff3</code>, you really can not say which become earlier in history, you need something more, such as the git log that reveals the ordering. -->
这并不是说散列不方便: 如果您知道是哪个提交导致了特定的问题，那么查看 git 的历史记录并获得前一个提交的散列就很容易了。但是如果你有两个哈希，比如 <code>d052aa41edfb4a7671c974c5901f4abe1c2db071</code>和<code>12c6f6738a18154cb1cef7cf0607a681f72eaff3</code>，你真的不能说哪个在历史上变得更早，你需要更多的东西，比如显示排序的日志。

#### Comparing the Two
两者的比较

<!-- We've already touched on some of the advantages and disadvantages of the two versioning methods discussed above but it's perhaps useful to address where they'd each likely be used. -->
我们已经谈到了上面讨论的两种版本控制方法的一些优点和缺点，但是也许解决它们各自可能被使用的地方是有用的。

<!-- Semantic Versioning works well when deploying services where the version number could be of significance or might actually be looked at. As an example, think of the Javascript libraries that you're using. If you're using version 3.4.6 of a particular library, and there's an update available to 3.4.8, if the library uses semantic versioning, you could (hopefully) safely assume that you're ok to upgrade without breaking anything. If the version jumps to 4.0.1 then maybe it's not such a safe upgrade. -->
语义版本控制在部署版本号可能很重要或者可能实际被关注的服务时工作得很好。举个例子，想想你正在使用的 Javascript 库。如果您正在使用某个特定库的3.4.6版本，并且3.4.8有一个可用的更新，如果该库使用语义版本控制，那么您可以(希望)安全地假设您可以在不破坏任何东西的情况下进行升级。如果这个版本升级到4.0.1，那么它可能不是一个安全的升级。

<!-- Hash versioning is very useful where most commits are being built into artifacts (e.g. runnable binaries or Docker images) that are themselves uploaded or stored. As an example, if your testing requires building your package into an artifact, uploading it to a server, and running tests against it, it would be convenient to have hash versioning as it would prevent accidents.  -->
散列版本非常有用，因为大多数提交都被构建到打包中(例如可运行的二进制文件或 Docker 镜像)中，而这些打包本身又是上传或存储的。例如，如果您的测试需要将您的包构建到一个打包中，上传到服务器，并针对它运行测试，那么使用散列版本控制将会非常方便，因为这样可以防止意外。

<!-- As an example think that you're working on version 3.2.2 and you have a failing test, you fix the failure and push the commit but as you're working in your branch, you're not going to update the version number. Without hash versioning, the artifact name may not change. If there's an error in uploading the artifact, maybe the tests run again with the older artifact (since it's still there and has the same name) and you get the wrong test results. If the artifact is versioned with the hash, then the version number *must* change on every commit and this means that if the upload fails, there will be an error since the artifact you told the tests to run again does not exist. -->
例如，假设您正在开发版本3.2.2，并且有一个失败的测试，您将修复失败并推迟提交，但是当您在您的分支中工作时，您将不会更新版本号。如果不进行散列版本控制，则打包名称可能不会更改。如果上传打包时出现错误，那么测试可能会使用较旧的工件再次运行(因为它仍然存在并且具有相同的名称) ，并且您会得到错误的测试结果。如果工件使用散列进行版本控制，那么版本号*必须*在每次提交时更改，这意味着如果上传失败，将会有一个错误，因为您告诉测试再次运行的打包不存在。


<!-- Having an error happen when something goes wrong is almost always preferable to having a problem silently ignored in CI. -->
快速失败几乎总是比在 CI 中默默忽略问题要好。

#### Best of Both Worlds
两全其美的方法

<!-- From the comparison above, it would seem that the semantic versioning makes sense for releasing software while hash-based versioning (or artifact naming) makes more sense during development. This doesn't necessarily cause a conflict. -->
从上面的比较中可以看出，语义版本控制对于发布软件是有意义的，而基于散列的版本控制(或者打包命名)在开发过程中更有意义。这并不一定会引起冲突。

<!-- Think of it this way: versioning boils down to a technique that points to a specific commit and says "We'll give this point a name, it's name will be 3.5.5". Nothing is preventing us from also referring to the same commit by its hash. -->
可以这样想: 版本控制可以归结为一种技术，它指向一个特定的提交，并说“我们将为这个点命名，它的名字将是3.5.5”。没有什么能够阻止我们也通过其散列来提及同样的承诺。

<!-- There is a catch. We discussed at the beginning of this part that we always have to know exactly what is happening with our code, for example, we need to be sure that we have tested the code we want to deploy. Having two parallel versioning (or naming) conventions can make this a little more difficult. -->
这里有一个陷阱。我们在本部分的开头讨论了我们总是需要知道我们的代码到底发生了什么，例如，我们需要确保我们已经测试了我们想要部署的代码。有两个并行的版本控制(或者命名)约定会使这个过程更加困难一些。

<!-- For example, when we have a project that uses hash-based artifact builds for testing, it's always possible to track the result of every build, lint, and test to a specific commit and developers know the state their code is in. This is all automated and transparent to the developers. They never need to be aware of the fact that the CI system is using the commit hash underneath to name build and test artifacts. When the developers merge their code to master, again the CI takes over. This time, it will build and test all the code and give it a semantic version number all in one go. It attaches the version number to the relevant commit with a git tag. -->
例如，当我们的项目使用基于散列的工件构建进行测试时，总是可以跟踪每个构建、 lint 和测试到特定提交的结果，开发人员知道他们的代码所处的状态。这对于开发人员来说是完全自动化和透明的。他们永远不需要知道 CI 系统使用底层的提交散列来命名构建和测试工件。当开发人员将他们的代码合并到掌握中时，CI 再次接管了一切。这一次，它将构建和测试所有的代码，并一次性给它一个语义版本号。它使用 git 标记将版本号附加到相关的提交。


<!-- In the case above, the software we release is tested because the CI system makes sure that tests are run on the code it is about to tag. It would not be incorrect to say that the project uses semantic versioning and simply ignore that the CI system tests individual developer branches/PRs with a hash-based naming system. We do this because the version we care about (the one that is released) is given a semantic version. -->
在上面的例子中，我们发布的软件是经过测试的，因为 CI 系统确保测试是在要标记的代码上运行的。如果说项目使用了语义版本控制，并且完全忽略了 CI 系统使用基于散列的命名系统测试单个开发人员分支/PRs，那么这种说法是正确的。我们这样做是因为我们所关心的版本(发布的版本)被赋予了一个语义版本。

</div>

<div class="tasks">

### Exercises 11.16-11.17.

<!-- Let's extend our workflow so that it will automatically increase (bump) the version when a pull request is merged into master and [tag](https://www.atlassian.com/git/tutorials/inspecting-a-repository/git-tag) the release with the version number. We will use an open source action developed by a third-party: [anothrNick/github-tag-action](https://github.com/anothrNick/github-tag-action).  -->
让我们扩展我们的工作流，这样当一个PR被合并到主版本中时，它将自动增加(碰撞)版本，并用版本号[tag](https://www.atlassian.com/git/tutorials/inspecting-a-repository/git-tag)发行版。我们将使用第三方开发的开源操作:[anothrNick/github-tag-action](https://github.com/anothrNick/github-tag-action)。

#### 11.16 Adding versioning
添加版本控制

<!-- We will extend our workflow with one step: -->
我们将通过一个步骤扩展我们的工作流:

```js
- name: Bump version and push tag
  uses: anothrNick/github-tag-action@1.33.0
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

<!-- We're passing an environmental variable <code>secrets.GITHUB\_TOKEN</code> to the action. As it is third-party action, it needs the token for authentication in your repository. You can read more [here](https://docs.github.com/en/actions/configuring-and-managing-workflows/authenticating-with-the-github_token) about authentication in GitHub Actions. -->
我们将一个环境变量 <code>secrets.GITHUB\_TOKEN</code>  传递给action。由于它是第三方操作，因此需要在代码库中使用该标记进行身份验证。你可以在 GitHub Actions 中阅读更多关于认证的[内容](https://docs.github.com/en/actions/configuring-and-managing-workflows/authenticating-with-the-github_token) 。


<!-- The [anothrNick/github-tag-action](https://github.com/anothrNick/github-tag-action) action can accept multiple environmental variables. These variables modify the way the action tags your releases. You can look at these in the [README](https://github.com/anothrNick/github-tag-action) and see what suits your needs.  -->
[anothrNick/github-tag-action](https://github.com/anothrNick/github-tag-action) 操作可以接受多个环境变量。这些变量可以修改动作标记发布的方式。您可以在 [README](https://github.com/anothrNick/github-tag-action) 中查看这些内容，看看哪些内容适合您的需要。


<!-- As you can see from the documentation by default your releases will receive a *minor* bump, meaning that the middle number will be incremented. -->
正如您在文档中看到的，默认情况下，您的发行版将会收到一个*小*冲突，这意味着中间的数字将会增加。

<!-- Modify the configuration above so that each new version is by default a _patch_ bump in the version number, so that by default, the last number is increased.  -->
修改上面的配置，使每个新版本在缺省情况下都是版本号上的 _补丁_ 冲突，这样，在缺省情况下，最后一个版本号会增加。


<!-- Remember that we want only to bump the version when the change happens to master branch! So add a similar <code>if</code> condition to prevent version bumps on pull request as was done in [Exercise 11.15](/en/part11/keeping_green#exercises-11-14-15) to prevent deployment on pull request releated events. -->
 请记住，我们只想在主分支发生变化时撞版本！所以像[练习11.15](/zh/part11/keeping_green#exercises-11-14-15)中那样，添加一个类似的<code>if</code>条件来防止版本冲突以防止对PR进行部署时发生的相关事件。


<!-- Complete the workflow and try it out!  -->
完成工作流并试用它！

<!-- If you're uncertain of the configuration, you can set  <code>DRY_RUN</code> to <code>true</code>, which will make the action output the next version number without creating or tagging the release! -->
如果您不确定配置，您可以将 <code>DRY_RUN</code> 设置为 <code>true</code>，这将使操作输出下一个版本号，而无需创建或标记发行版！

<!-- Once the workflow runs successfully, the repository mentions that there are some <i>tags</i>: -->
一旦工作流程成功运行，仓库提到有一些<i>tags</i>:

![Releases](../../images/11/17.png)

<!-- And by clicking it, you can see all the tags (that is the git mechanism to mark a release) listed: -->
点击它，你可以看到所有的标签(这是 git 标记发布的机制) :

![Releases](../../images/11/18.png)


<!-- **Note:** I ended up having this error in the tagging action: -->
**注意:** 我最终在标记动作中出现了这个错误:

![Releases](../../images/11/19.png)

<!-- A quick (but perhaps a bit dirty) way to solve the problem was to checkout the repository once again just before the tagging step: -->
解决这个问题的一个快速(但可能有点不优雅)的方法是在标记步骤之前再次签出代码库:

```js
  - uses: actions/checkout@v2 // highlight-line
  - name: Bump version and push tag
    uses: anothrNick/github-tag-action@1.33.0
    env:
      GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

<!-- A better option would perhaps be another job that takes care of tagging. -->

#### 11.17 Skipping a commit for tagging and deployment
跳过标签和部署的提交

<!-- In general the more often you deploy the master to production, the better. However, there might be some valid reasons sometimes to skip a particular commit or a merged pull request to becoming tagged and released to production. -->
一般来说，越经常地将主控程序部署到生产环境中，效果就越好。但是，有时可能有一些正当的理由跳过特定的提交或合并的PR，以便成为标记并发布到生产环境中。


<!-- Modify your setup so that if a commit message in a pull request contains _#skip_, the merge will not be deployed to production and it is not tagged with a version number. -->
修改您的设置，以便如果PR中的提交消息包含 _#skip_，则不会将 merge 部署到生产环境中，也不会用版本号标记它。


**Hints:**  
**提示:**

<!-- The easiest way to implement this is to alter the [if](https://docs.github.com/en/free-pro-team@latest/actions/reference/workflow-syntax-for-github-actions#jobsjob_idstepsif) confitions of the relevant steps. Similarly to [exercise 11-15](/en/part11/keeping_green#exercises-11-14-15) you can get the relevant information from the [github context](https://docs.github.com/en/free-pro-team@latest/actions/reference/context-and-expression-syntax-for-github-actions#github-context) of the workflow. -->
实现这一点的最简单方法是修改相关步骤的 [if](https://docs.github.com/en/free-pro-team@latest/actions/reference/workflow-syntax-for-github-actions#jobsjob_idstepsif) 配置。与[练习11-15](/en/part11/keeping_green#exercises-11-14-15)类似，您可以从工作流的 [github context](https://docs.github.com/en/free-pro-team@latest/actions/reference/context-and-expression-syntax-for-github-actions#github-context) 中获得相关信息。


You might take this as a starting point:
你可以把这个作为一个起点:

```js
name: Testing stuff

on:
  push:
    branches:
      - master

jobs:
  a_test_job:
    runs-on: ubuntu-18.04
    steps:
      - uses: actions/checkout@v2
      - name: gihub context
        env:
          GITHUB_CONTEXT: ${{ toJson(github) }}
        run: echo "$GITHUB_CONTEXT"
      - name: commits
        env:
          COMMITS: ${{ toJson(github.event.commits) }}
        run: echo "$COMMITS"
      - name: commit messages
        env:
          COMMIT_MESSAGES: ${{ toJson(github.event.commits.*.message) }}
        run: echo "$COMMIT_MESSAGES"
```

<!-- See what gets printed in the workflow log! -->
看看在工作流日志中打印了什么！

<!-- Note that you can access the commits and commit messages <i>only when pushing or merging to master</i>, so for pull requests the <code>github.event.commits</code> is empty. It is anyway not needed, since we want to skip the step altogether for pull requests.  -->
请注意，<i>只有在将提交和提交消息推送或合并到 master 时</i>，才能访问提交和提交消息，因此对于 pull request，<code>github.event.commits</code> 是空的。无论如何，这是不需要的，因为我们希望跳过这一步完全为PR。

<!-- You most likely need functions [contains](https://docs.github.com/en/free-pro-team@latest/actions/reference/context-and-expression-syntax-for-github-actions#contains) and [join](https://docs.github.com/en/free-pro-team@latest/actions/reference/context-and-expression-syntax-for-github-actions#join) for your if condition. -->
对于 if 条件，您很可能需要 [contains](https://docs.github.com/en/free-pro-team@latest/actions/reference/context-and-expression-syntax-for-github-actions#contains) 和 [join](https://docs.github.com/en/free-pro-team@latest/actions/reference/context-and-expression-syntax-for-github-actions#join) 函数。


<!-- Developing workflows is not easy, and quite often the only option is trial and error. It might actually be advisable to have a separate repository for getting the configuration right, and when it is done, to copy the right configurations to the actual repository. -->
开发工作流并不容易，通常唯一的选择就是尝试和错误。实际上，建立一个单独的代码库来获得正确的配置可能是明智的，当这样做时，将正确的配置复制到实际的代码库。

<!-- It would also be possible to install a tool such as [act](https://github.com/nektos/act) that makes it possible to run your workflows locally. In case you end up to more involved use cases, e.g. by creating your [own custom actions](https://docs.github.com/en/free-pro-team@latest/actions/creating-actions) going through the burden of setting up a tool such as act is most likely worth the trouble.  -->
还可以安装一个工具，比如 [act](https://github.com/nektos/act) ，使您可以在本地运行工作流。如果您最终遇到了更复杂的用例，例如，通过创建[您自己的定制操作](https://docs.github.com/en/free-pro-team@latest/actions/creating-actions)来完成设置工具的负担，比如 act，这样的麻烦很可能是值得的。



</div>

<div class="content">

### A note about using third party actions
关于使用第三方操作的注意事项

<!-- When using a third party action such that <i>github-tag-action</i> it might be a good idea to specify the used version with hash instead of using a version number. The reason for this is that the version number, that is implemented with a git tag can in principle be <i>moved</i>. So today's version 1.33.0 might be a different code that is at the next week the version 1.33.0!  -->
当使用第三方操作(如 <i>github-tag-action</i>)时，最好使用 hash 指定所使用的版本，而不要使用版本号。原因是，使用 git 标记实现的版本号，原则上可以<i>moved</i>。所以今天的版本1.33.0可能是一个不同的代码，在下周的版本1.33.0！

<!-- However, the code in commit with a particular hash does not change in any circumstances, so if we want to be 100% sure about the code we use, it is safest to use the hash.  -->
然而，给定的hash在任何情况下都不会改变，所以如果我们想要100% 确定我们使用的代码，最安全的方法是使用散列。


<!-- The version [1.33.0](https://github.com/anothrNick/github-tag-action/releases) of the action corresponds to commit with hash <code>eca2b69f9e2c24be7decccd0f15fdb1ea5906598</code>, so we might want to change our configuration as follows: -->
操作的[1.33.0](https://github.com/anothrNick/github-tag-action/releases)版本对应于通过 hash <code>eca2b69f9e2c24be7decccd0f15fdb1ea5906598</code>提交，因此我们可能希望更改我们的配置如下:

```js
    - name: Bump version and push tag
      uses: anothrNick/github-tag-action@eca2b69f9e2c24be7decccd0f15fdb1ea5906598  // highlight-line
      env:
        GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```


<!-- When we use actions provided by GitHub we trust them not to mess with version tags and to thoroughly test their code. -->
当我们使用 GitHub 提供的操作时，我们相信它们不会扰乱版本标签，并且会彻底测试它们的代码。

<!-- In the case of third-party actions, the code might end up being buggy or even malicious. Even when the author of the open-source code does not have the intention of doing something bad, they might end up leaving their credentials on a post-it note in a cafe, and then who knows what might happen. -->
在第三方操作的情况下，代码可能会出现错误，甚至是恶意的。即使开源代码的作者没有做坏事的意图，他们也可能最终在咖啡馆的便利贴上留下自己的证书，然后谁知道会发生什么。

<!-- By pointing to the hash of a specific commit we can be sure that the code we use when running the workflow will not change because changing the underlying commit and its contents would also change the hash. -->
通过指向特定提交的散列，我们可以确保我们在运行工作流时使用的代码不会发生更改，因为更改基本提交及其内容也会更改散列。


### Keep master protected
保护好master 分支

<!-- GitHub allows you to set up protected branches. It is important to protect your most important branch that should never be broken: master. In repository settings, you can choose between several levels of protection. We will not go over all of the protection options, you can learn more about them in GitHub documentation. Requiring pull request approval when merging into master is one of the options we mentioned earlier. -->
GitHub 允许你设置受保护的分支。保护你最重要的一个分支是非常重要的，这个分支永远不会被打破: master 分支。在代码库设置中，您可以在多个级别的保护之间进行选择。我们不会介绍所有的保护选项，您可以在 GitHub 文档中了解更多关于它们的信息。在合并到主服务器时需要PR批准是我们前面提到的选项之一。


<!-- From CI point of view, the most important protection is requiring status checks to pass before a PR can be merged into master. This means that if you have set up GitHub actions to run e.g. linting and testing tasks, then until all the lint errors are fixed and all the tests pass the PR cannot be merged. Because you are the administrator for your repository, you will see an option to override the restriction. However, non-administrators will not have this option. -->
从 CI 的角度来看，最重要的保护是要求状态检查通过之前，PR可以合并到master 。这意味着，如果你已经设置了 GitHub 的操作来运行，例如: linting 和 testing tasks，那么直到所有的 lint 错误都被修复并且所有的测试都通过了 PR 才能合并。因为您是代码库的管理员，所以您将看到一个覆盖限制的选项。但是，非管理员将不会有这个选项。

![Unmergeable PR](../../images/11/part11d_03.png)

<!-- To set up protection for your master branch, navigate to repository "Settings" from the top menu inside the repository. In the left-side menu select "Branches". Click "Add rule" button next to "Branch protection rules". Type a branch name pattern ("master" will do nicely) and select the protection you would want to set up. At least "Require status checks to pass before merging" is necessary for you to fully utilize the power of GitHub Actions. Under it, you should also check "Require branches to be up to date before merging" and select all of the status checks that should pass before a PR can be merged.  -->
若要为主分支设置保护，请从代码库内的顶部菜单导航到代码库“设置”。在左侧菜单中选择“分支”。单击“分支保护规则”旁边的“添加规则”按钮。键入一个分支名称模式(“ master”将很好) ，并选择您想要设置的保护。至少“在合并之前需要通过状态检查”对于你充分利用 GitHub Actions 的能力是必要的。在这个选项下，你还应该选中“要求分支在合并之前是最新的” ，并选择所有在合并 PR 之前应该通过的状态检查。


![Branch protection rule](../../images/11/part11d_04.png)


</div>

<div class="tasks">

### Exercise 11.18

#### 11.18 Adding master protection
添加主分支的保护

<!-- Add protection to your master branch. -->
为你的主分支添加保护。

<!-- You should protect it to: -->
你应该如下保护它:
<!-- - Require all pull request to be approved before merging -->
<!-- - Require all status checks to pass before merging -->
- 要求在合并前批准所有PR
- 在合并前要求通过所有状态检查

<!-- Do not yet check <i>Include administrators</i>. If you do that, you need somebody else to review your pull requests to get the code released! -->
不要选择<i>Include administrators</i>。如果您这样做，您需要其他人审查您的PR，以获得代码发布！

</div>