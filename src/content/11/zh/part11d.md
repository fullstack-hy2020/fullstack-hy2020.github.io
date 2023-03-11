---
mainImage: ../../../images/part-11.svg
part: 11
letter: d
lang: zh
---

<div class="content">

<!-- Your main branch of the code should always remain <i>green</i>. Being green means that all the steps of your build pipeline should complete successfully: the project should build successfully, tests should run without errors, and the linter shouldn't have anything to complain about, etc.-->
 你的代码的主分支应该始终保持<i>绿色</i>。绿色意味着你的构建管道的所有步骤都应该成功完成：项目应该成功构建，测试应该无误运行，并且linter不应该有任何产生警告，等等。

<!-- Why is this important? You will likely deploy your code to production specifically from your main branch. Any failures in the main branch would mean that new features cannot be deployed to production until the issue is sorted out. Sometimes you will discover a nasty bug in production that was not caught by the CI/CD pipeline. In these cases, you want to be able to roll the production environment back to a previous commit in a safe manner.-->
 为什么这很重要？你可能会专门从主分支将代码部署到生产中。主分支中的任何故障都意味着在问题解决之前，新功能无法部署到生产中。有时，你会在生产中发现一个讨厌的错误，而CI/CD管线却没有发现。在这种情况下，你希望能够以安全的方式将生产环境回滚到之前的提交。

<!-- How do you keep your main branch green then? Avoid committing any changes directly to the main branch. Instead, commit your code on a branch based on the freshest possible version of the main branch. Once you think the branch is ready to be merged into the main you create a GitHub Pull Request (also referred to as <abbr title="Pull Request">PR</abbr>).-->
 那你如何保持主分支的绿色？避免将任何修改直接提交到主分支。相反，在一个基于主分支的最新版本的分支上提交代码。一旦你认为该分支可以合并到主分支，你就创建一个 GitHub 拉动请求（也被称为 <abbr title="拉动请求">PR</abbr>）。

### Working with Pull Requests

<!-- Pull requests are a core part of the collaboration process when working on any software project with at least two contributors. When making changes to a project you checkout a new branch locally, make and commit your changes, push the branch to the remote repository (in our case to GitHub) and create a pull request for someone to review your changes before those can be merged into the main branch.-->
 在任何至少有两个贡献者的软件项目上工作时，拉取请求是协作过程的核心部分。当对项目进行修改时，你要在本地检出一个新的分支，做出并提交你的修改，将该分支推送到远程仓库（在我们的例子中是推送到GitHub），并创建一个拉动请求，让别人在你的修改被合并到主分支之前进行审查。

<!-- There are several reasons why using pull requests and getting your code reviewed by at least one other person is always a good idea.-->
 为什么使用拉动请求并让至少一个人审查你的代码总是一个好主意，有几个原因。
<!-- - Even a seasoned developer can often overlook some issues in their code: we all know of the tunnel vision effect.-->
 - 即使是经验丰富的开发者也会经常忽略他们代码中的一些问题：我们都知道隧道视野效应。
<!-- - A reviewer can have a different perspective and offer a different point of view.-->
 - 评审员可以有不同的视角，提供不同的观点。
<!-- - After reading through your changes, at least one other developer will be familiar with the changes you've made.-->
 - 在读完你的修改后，至少有一个其他开发者会熟悉你所做的修改。
<!-- - Using PRs allows you to automatically run all tasks in your CI pipeline before the code gets to the main branch. GitHub Actions provides a trigger for pull requests.-->
 - 使用PR可以让你在代码进入主分支之前自动运行CI管道中的所有任务。GitHub Actions为拉取请求提供了一个触发器。

<!-- You can configure your GitHub repository in such a way that pull requests cannot be merged until they are approved.-->
 你可以配置你的GitHub仓库，使拉动请求在被批准之前不能被合并。

![Compare & pull request](../../images/11/part11d_00.png)

<!-- To open a new pull request, open your branch in GitHub and click on the green "Compare & pull request" button at the top. You will be presented with a form where you can fill in the pull request description.-->
 要打开一个新的拉动请求，在GitHub中打开你的分支，点击顶部的绿色 "比较和拉动请求 "按钮。你会看到一个表格，你可以在其中填写拉动请求的描述。

![Open a new pull request](../../images/11/part11d_01.png)

<!-- GitHub's pull request interface presents a description and the discussion interface. At the bottom, it displays all the CI checks (in our case each of our Github Actions) that are configured to run for each PR and the statuses of these checks. A green board is what you aim for! You can click on Details of each check to view details and run logs.-->
 GitHub's pull request界面渲染的是描述和讨论界面。在底部，它显示了为每个PR配置的所有CI检查（在我们的例子中是每个Github行动），以及这些检查的状态。绿板是你的目标你可以点击每个检查的细节来查看细节和运行日志。

<!-- All the workflows we looked at so far were triggered by commits to the main branch. To make the workflow run for each pull request we would have to update the trigger part of the workflow. We use the "pull_request" trigger for branch "master" (our main branch) and limit the trigger to events "opened" and "synchronize". Basically, this means, that the workflow will run when a PR into the main branch is opened or updated.-->
 到目前为止，我们所看到的所有工作流程都是由对主分支的提交触发的。要使工作流为每个拉动请求运行，我们必须更新工作流的触发部分。我们对 "主 "分支（我们的主分支）使用 "pull_request "触发器，并将该触发器限制为 "打开 "和 "同步 "事件。基本上，这意味着，当主分支的PR被打开或更新时，工作流就会运行。

<!-- So let us change events that [trigger](https://docs.github.com/en/free-pro-team@latest/actions/reference/events-that-trigger-workflows) of the workflow as follows:-->
 因此，让我们改变工作流程的[触发](https://docs.github.com/en/free-pro-team@latest/actions/reference/events-that-trigger-workflows)事件如下。

```js
on:
  push:
    branches:
      - master
  pull_request: // highlight-line
    branches: [master] // highlight-line
    types: [opened, synchronize] // highlight-line
```

<!-- We shall soon make it impossible to push the code directly to the main branch, but in the meantime, let us still run the workflow also for all the possible direct pushes to the main branch.-->
 我们很快就会使代码无法直接推送到主分支，但与此同时，让我们仍然为所有可能直接推送到主分支的工作流程运行。

</div>

<div class="tasks">

### Exercises 11.13-11.14.

<!-- Our workflow is doing a nice job of ensuring good code quality, but since it is run on commits to the main branch, it's catching the problems too late!-->
 我们的工作流在确保良好的代码质量方面做得很好，但由于它是在提交到主分支的过程中运行的，所以它发现问题的时间太晚了

#### 11.13 Pull request

<!-- Update the trigger of the existing workflow as suggested above to run on new pull requests to your main branch.-->
 按照上面的建议，更新现有工作流的触发器，使其在主干分支的新拉取请求上运行。

<!-- Create a new branch, commit your changes, and open a pull request to your main branch.-->
 创建一个新的分支，提交你的修改，并向主分支发出拉取请求。

<!-- If you have not worked with branches before, check [e.g. this tutorial](https://www.atlassian.com/git/tutorials/using-branches) to get started.-->
 如果你以前没有使用过分支，可以查看[例如这个教程](https://www.atlassian.com/git/tutorials/using-branches)来开始。

<!-- Note that when you open the pull request, make sure that you select here your <i>own</i> repository as the destination <i>base repository</i>. By default, the selection is the original repository by smartly and you **do not want** to do that:-->
 注意，当你打开拉取请求时，确保在这里选择你的<i>自己的</i>仓库作为目标<i>基础仓库</i>。默认情况下，选择的是智能的原始仓库，你**不希望**这样做。

![](../../images/11/15a.png)

<!-- In the "Conversation" tab of the pull request you should see your latest commit(s) and the yellow status for checks in progress:-->
 在拉动请求的 "对话 "标签中，你应该看到你的最新提交和正在进行的检查的黄色状态。

![](../../images/11/16.png)

<!-- Once the checks have been run, the status should turn to green. Make sure all the checks pass. Do not merge your branch yet, there's still one more thing we need to improve on our pipeline.-->
 一旦检查完成，状态应该转为绿色。确保所有的检查都通过了。先不要合并你的分支，我们还有一件事需要改进，那就是我们的管道。

#### 11.14 Run deployment step only for the main branch

<!-- All looks good, but there is actually a pretty serious problem with the current workflow. All the steps, including the deployment, are run also for pull requests. This is surely something we do not want!-->
 一切看起来都很好，但实际上目前的工作流程有一个相当严重的问题。所有的步骤，包括部署，都是为拉取请求而进行的。这肯定是我们不希望看到的。

<!-- Fortunately, there is an easy solution for the problem! We can add an [if](https://docs.github.com/en/free-pro-team@latest/actions/reference/workflow-syntax-for-github-actions#jobsjob_idif) condition to the deployment step, which ensures that the step is executed only when the code is being merged or pushed to the main branch.-->
 幸运的是，这个问题有一个简单的解决方案!我们可以在部署步骤中添加一个[if](https://docs.github.com/en/free-pro-team@latest/actions/reference/workflow-syntax-for-github-actions#jobsjob_idif)条件，确保该步骤只在代码被合并或推送到主分支时执行。

<!-- The workflow [context](https://docs.github.com/en/free-pro-team@latest/actions/reference/context-and-expression-syntax-for-github-actions#contexts) gives various kinds of information about the code the workflow is run.-->
 工作流[context](https://docs.github.com/en/free-pro-team@latest/actions/reference/context and-expression-syntax-for-github-actions#contexts)给出了工作流运行的代码的各种信息。

<!-- The relevant information is found in [GitHub context](https://docs.github.com/en/actions/learn-github-actions/contexts#github-context), the field <i>event_name</i> tells us what is the "name" of the event that triggered the workflow. When a pull request is merged, the name of the event is somehow paradoxically <i>push</i>, the same event that happens when pushing the code to the repository. Thus, we get the desired behavior by adding the following condition to the step that deploys the code:-->
相关信息在[GitHub context](https://docs.github.com/en/actions/learn-github-actions/contexts#github-context)中找到，字段<i>event_name</i>告诉我们触发工作流的事件的 "名字 "是什么。当拉动请求被合并时，事件的名称在某种程度上是矛盾的<i>push</i>，与推送代码到仓库时的事件相同。因此，我们通过在部署代码的步骤中添加以下条件来获得所需的行为。

```js
if: ${{ github.event_name == 'push' }}
```

<!-- Push some more code to your branch, and ensure that the deployment step <i>is not executed</i> anymore. Then merge the branch to the main branch and make sure that the deployment happens.-->
 再推送一些代码到你的分支，并确保部署步骤<i>不再执行</i>。然后将该分支合并到主分支，确保部署发生。

</div>

<div class="content">

### Versioning

<!-- The most important purpose of versioning is to uniquely identify the software we're running and the code associated with it.-->
 版本管理最重要的目的是唯一地识别我们正在运行的软件和与之相关的代码。

<!-- The ordering of versions is also an important piece of information. For example, if the current release has broken critical functionality and we need to identify the <i>previous version</i> of the software so that we can roll back the release back to a stable state.-->
版本的排序也是一个重要的信息。例如，如果当前的版本破坏了关键功能，我们需要识别软件的<i>前一版本</i>，这样我们就可以将该版本回滚到稳定状态。

#### Semantic Versioning and Hash Versioning

<!-- How an application is versioned is sometimes called a versioning strategy. We'll look at and compare two such strategies.-->
 一个应用如何进行版本管理，有时被称为版本策略。我们将看一看并比较两个这样的策略。

<!-- The first one is [semantic versioning](https://semver.org/), where a version is in the form <code>{major}.{minor}.{patch}</code>. For example, if the version is <code>1.2.3</code>, it has <code>1</code> as the major version, <code>2</code> is the minor version, and <code>3</code> is the patch version.-->
 第一种是[语义版本管理](https://semver.org/)，版本的形式是<code>{major}.{minor}.{patch}</code>。例如，如果版本是<code>1.2.3</code>，它有<code>1</code>作为主要版本，<code>2</code>是次要版本，<code>3</code>是补丁版本。

<!-- In general, changes that fix the functionality without changing how the application works from the outside are <code>patch</code> changes, changes that make small changes to functionality (as viewed from the outside) are <code>minor</code> changes and changes that completely change the application (or major functionality changes) are <code>major</code> changes. The definitions of each of these terms can vary from project to project.-->
 一般来说，修复功能而不从外部改变应用的工作方式的变化是<code>patch</code>变化，对功能进行小的改变（从外部看）的变化是<code>minor</code>变化，完全改变应用的变化（或主要功能变化）是<code>major</code>变化。这些术语的定义可能因项目而异。

<!-- For example, npm-libraries are following the semantic versioning. At the time of writing this text (3rd March 2022) the most recent version of React is [17.0.2](https://reactjs.org/versions/), so the major version is 17 which is has been bumped up two patch steps, the minor version is still 0.-->
 例如，npm-libraries遵循的是语义上的版本划分。在写这篇文字的时候（2022年3月3日），React的最新版本是[17.0.2](https://reactjs.org/versions/)，所以主要版本是17，已经提升了两个补丁级别，次要版本仍然是0。

<i>Hash versioning</i> (also sometimes known as SHA versioning) is quite different. The version "number" in hash versioning is a hash (that looks like a random string) derived from the contents of the repository and the changes introduced in this commit. In git, this is already done for you as the commit hash that is unique for any change set.

<!-- Hash versioning is almost always used in conjunction with automation. It's a pain (and error-prone) to copy 32 character long version numbers around to make sure that everything is correctly deployed.-->
哈希版本控制几乎总是与自动化结合使用。拷贝32个字符的长版本号，以确保所有东西都被正确部署，是件很痛苦的事（而且容易出错）。

#### But what does the version point to?

<!-- Determining what code is in a given version is important and the way this is achieved is again quite different between semantic and hash versioning. In hash versioning (at least in git) it's as simple as looking up the commit based on the hash. This will let us know exactly what code is deployed with which version.-->
 确定一个给定的版本中有哪些代码是很重要的，而实现这一目标的方式在语义版本控制和哈希版本控制之间又有很大的不同。在哈希版本管理中（至少在git中），这就像根据哈希查找提交一样简单。这将让我们确切地知道哪些代码是用哪个版本部署的。

<!-- It's a little more complicated when using semantic versioning and there are several ways to approach the problem. These boil down to three possible approaches: something in the code itself, something in the repo or repo metadata, something completely outside the repo.-->
 在使用语义版本管理时，情况就比较复杂了，有几种方法可以解决这个问题。这些方法归结为三种可能的方法：代码本身的东西、 repo或 repo元数据中的东西、完全在 repo之外的东西。

<!-- While we won't cover the last option on the list (since that's a rabbit hole all on its own), it's worth mentioning that this can be as simple as a spreadsheet that lists the Semantic Version and the commit it points to.-->
 虽然我们不会讨论清单上的最后一个选项（因为这本身就是一个兔子洞），但是值得一提的是，这可以是一个简单的电子表格，列出语义版本及其指向的提交。

<!-- For the two repository based approaches, the approach with something in the code usually boils down to a version number in a file and the repo/metadata approach usually relies on [tags](https://www.atlassian.com/git/tutorials/inspecting-a-repository/git-tag) or (in the case of GitHub) releases. In the case of tags or releases, this is relatively simple, the tag or release points to a commit, the code in that commit is the code in the release.-->
 对于这两种基于存储库的方法来说，在代码中包含某些内容的方法通常可以归结为文件中的版本号，而存储库/元数据方法通常依赖于[tags](https://www.atlassian.com/git/tutorials/inspecting-a-repository/git-tag)或者（在GitHub的情况下）发布。在标签或版本的情况下，这相对简单，标签或版本指向一个提交，该提交中的代码就是该版本中的代码。

#### Version order

<!-- In semantic versioning, even if we have version bumps of different types (major, minor, or patch) it's still quite easy to put the releases in order: 1.3.7 comes before 2.0.0 which itself comes before 2.1.5 which comes before 2.2.0. A list of releases (conveniently provided by a package manager or GitHub) is still needed to know what the last version is but it's easier to look at that list and discuss it: It's easier to say "We need to roll back to 3.2.4" than to try communicate a hash in person.-->
 在语义版本管理中，即使我们有不同类型的版本跳跃（major、minor或patch），要把这些版本按顺序排列还是相当容易的。1.3.7在2.0.0之前，而2.0.0本身在2.1.5之前，而2.1.5在2.2.0之前。要知道最后一个版本是什么，仍然需要一个版本列表（由软件包管理器或GitHub提供，很方便），但看这个列表和讨论它更容易。说 "我们需要回滚到3.2.4 "比当面沟通一个哈希值更容易。

<!-- That's not to say that hashes are inconvenient: if you know which commit caused the particular problem, it's easy enough to look back through a git history and get the hash of the previous commit. But if you have two hashes, say <code>d052aa41edfb4a7671c974c5901f4abe1c2db071</code> and <code>12c6f6738a18154cb1cef7cf0607a681f72eaff3</code>, you really can not say which become earlier in history, you need something more, such as the git log that reveals the ordering.-->
 这并不是说哈希值是不方便的：如果你知道哪个提交导致了特定的问题，很容易通过git历史回看并获得前一个提交的哈希值。但如果你有两个哈希值，比如<code>d052aa41edfb4a7671c974c5901f4abe1c2db071</code>和<code>12c6f6738a18154cb1cef7cf0607a681f72eaff3</code>，你真的不能说哪个在历史上变得更早，你需要更多东西，比如揭示排序的git日志。

#### Comparing the Two

<!-- We've already touched on some of the advantages and disadvantages of the two versioning methods discussed above but it's perhaps useful to address where they'd each likely be used.-->
 我们已经谈到了上面讨论的两种版本管理方法的一些优势和劣势，但是解决它们各自可能被使用的地方也许是有用的。

<!-- Semantic Versioning works well when deploying services where the version number could be of significance or might actually be looked at. As an example, think of the JavaScript libraries that you're using. If you're using version 3.4.6 of a particular library, and there's an update available to 3.4.8, if the library uses semantic versioning, you could (hopefully) safely assume that you're ok to upgrade without breaking anything. If the version jumps to 4.0.1 then maybe it's not such a safe upgrade.-->
 Semantic Versioning（语义版本控制）在部署版本号可能具有重要意义或者实际上可能被查看的服务时，效果很好。举个例子，想想你正在使用的JavaScript库。如果你正在使用某个特定库的3.4.6版本，而现在有了3.4.8版本的更新，那么如果该库使用了语义版本管理，你就可以（希望）安全地假定，你可以在不破坏任何东西的情况下进行升级。如果版本跳转到4.0.1，那么也许就不是那么安全的升级了。

<!-- Hash versioning is very useful where most commits are being built into artifacts (e.g. runnable binaries or Docker images) that are themselves uploaded or stored. As an example, if your testing requires building your package into an artifact, uploading it to a server, and running tests against it, it would be convenient to have hash versioning as it would prevent accidents.-->
 哈希版本管理在大多数提交被构建到工件（例如可运行的二进制文件或Docker镜像）中的情况下非常有用，这些工件本身被上传或存储。举个例子，如果你的测试需要将你的包构建成一个工件，上传到服务器上，然后针对它进行测试，那么采用哈希版本控制就很方便，因为它可以防止意外。

<!-- As an example think that you're working on version 3.2.2 and you have a failing test, you fix the failure and push the commit but as you're working in your branch, you're not going to update the version number. Without hash versioning, the artifact name may not change. If there's an error in uploading the artifact, maybe the tests run again with the older artifact (since it's still there and has the same name) and you get the wrong test results. If the artifact is versioned with the hash, then the version number *must* change on every commit and this means that if the upload fails, there will be an error since the artifact you told the tests to run against does not exist.-->
 举个例子，你在3.2.2版本上工作，你有一个失败的测试，你修复了这个失败并推送了提交，但由于你在你的分支中工作，你不会更新版本号。如果没有哈希版本管理，工件的名称可能不会改变。如果在上传工件时有错误，可能测试会用旧的工件再次运行（因为它还在那里，并且有相同的名字），你会得到错误的测试结果。如果工件是用哈希值定义的，那么版本号*必须*在每次提交时改变，这意味着如果上传失败，会有一个错误，因为你告诉测试要运行的工件不存在。

<!-- Having an error happen when something goes wrong is almost always preferable to having a problem silently ignored in CI.-->
 在出错时发生错误几乎总是比在CI中默默地忽略一个问题要好。

#### Best of Both Worlds

<!-- From the comparison above, it would seem that the semantic versioning makes sense for releasing software while hash-based versioning (or artifact naming) makes more sense during development. This doesn't necessarily cause a conflict.-->
 从上面的比较来看，语义版本管理对发布软件有意义，而基于哈希的版本管理（或工件命名）在开发期间更有意义。这不一定会造成冲突。

<!-- Think of it this way: versioning boils down to a technique that points to a specific commit and says "We'll give this point a name, it's name will be 3.5.5". Nothing is preventing us from also referring to the same commit by its hash.-->
 这样想吧：版本管理归结为一种技术，它指向一个特定的提交，并说 "我们将给这个点一个名字，它的名字将是3.5.5"。没有什么可以阻止我们用哈希值来指代同一个提交。

<!-- There is a catch. We discussed at the beginning of this part that we always have to know exactly what is happening with our code, for example, we need to be sure that we have tested the code we want to deploy. Having two parallel versioning (or naming) conventions can make this a little more difficult.-->
 有一个问题。我们在这一部分的开头讨论过，我们总是要知道我们的代码到底发生了什么，例如，我们需要确定我们已经测试了我们想要部署的代码。有两个平行的版本（或命名）惯例会使这个问题变得有点困难。

<!-- For example, when we have a project that uses hash-based artifact builds for testing, it's always possible to track the result of every build, lint, and test to a specific commit and developers know the state their code is in. This is all automated and transparent to the developers. They never need to be aware of the fact that the CI system is using the commit hash underneath to name build and test artifacts. When the developers merge their code to the main branch, again the CI takes over. This time, it will build and test all the code and give it a semantic version number all in one go. It attaches the version number to the relevant commit with a git tag.-->
 例如，当我们有一个项目使用基于哈希的工件构建进行测试时，总是可以跟踪每一个构建、lint和测试的结果到一个特定的提交，开发人员知道他们的代码处于什么状态。这些都是自动化的，对开发者来说是透明的。他们不需要知道CI系统正在使用下面的提交哈希值来命名构建和测试工件的事实。当开发人员将他们的代码合并到主分支时，CI再次接管。这一次，它将构建和测试所有的代码，并一次性给它一个语义上的版本号。它用一个git标签把版本号附在相关的提交上。

<!-- In the case above, the software we release is tested because the CI system makes sure that tests are run on the code it is about to tag. It would not be incorrect to say that the project uses semantic versioning and simply ignore that the CI system tests individual developer branches/PRs with a hash-based naming system. We do this because the version we care about (the one that is released) is given a semantic version.-->
 在上述案例中，我们发布的软件是经过测试的，因为CI系统确保对它要标记的代码进行测试。如果说该项目使用了语义上的版本管理，而简单地忽略了CI系统用基于哈希的命名系统来测试各个开发者分支/PR，这并不是不正确的。我们这样做是因为我们所关心的版本（被发布的版本）被赋予了一个语义版本。

</div>

<div class="tasks">

### Exercises 11.15-11.16.

<!-- Let's extend our workflow so that it will automatically increase (bump) the version when a pull request is merged into the main branch and [tag](https://www.atlassian.com/git/tutorials/inspecting-a-repository/git-tag) the release with the version number. We will use an open source action developed by a third-party: [anothrNick/github-tag-action](https://github.com/anothrNick/github-tag-action).-->
 让我们扩展我们的工作流程，以便当一个拉动请求被合并到主分支时，它会自动增加（bump）版本，并[tag](https://www.atlassian.com/git/tutorials/inspecting-a-repository/git-tag)用版本号发布。我们将使用一个由第三方开发的开源动作。[anothrNick/github-tag-action](https://github.com/anothrNick/github-tag-action)。

#### 11.15 Adding versioning

<!-- We will extend our workflow with one more step:-->
 我们将用多一个步骤来扩展我们的工作流程。

```js
- name: Bump version and push tag
  uses: anothrNick/github-tag-action@1.36.0
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

<!-- We're passing an environmental variable <code>secrets.GITHUB\_TOKEN</code> to the action. As it is third-party action, it needs the token for authentication in your repository. You can read more [here](https://docs.github.com/en/actions/configuring-and-managing-workflows/authenticating-with-the-github_token) about authentication in GitHub Actions.-->
 我们将环境变量<code>secrets.GITHUB\_TOKEN</code>传递给该行动。由于它是第三方行动，它需要在你的存储库中进行认证的令牌。你可以[在这里](https://docs.github.com/en/actions/configuring-and-managing-workflows/authenticating-with-the-github_token)阅读更多关于GitHub Actions中的认证。

<!-- The [anothrNick/github-tag-action](https://github.com/anothrNick/github-tag-action) action can accept multiple environmental variables. These variables modify the way the action tags your releases. You can look at these in the [README](https://github.com/anothrNick/github-tag-action) and see what suits your needs.-->
 [anothrNick/github-tag-action](https://github.com/anothrNick/github-tag-action) 动作可以接受多个环境变量。这些变量可以修改行动对你的版本进行标记的方式。你可以在[README](https://github.com/anothrNick/github-tag-action)中查看这些变量，看看什么适合你的需要。

<!-- As you can see from the documentation by default your releases will receive a *minor* bump, meaning that the middle number will be incremented.-->
 正如你从文档中看到的，默认情况下，你的版本会收到一个*小的凸起，意味着中间的数字会被增加。

<!-- Modify the configuration above so that each new version is by default a _patch_ bump in the version number, so that by default, the last number is increased.-->
 修改上面的配置，使每个新的版本默认是一个_补丁_版本号的提升，所以默认情况下，最后的数字会被增加。

<!-- Remember that we want only to bump the version when the change happens to the main branch! So add a similar <code>if</code> condition to prevent version bumps on pull request as was done in [Exercise 11.14](/en/part11/keeping_green#exercises-11-13-11-14) to prevent deployment on pull request related events.-->
 记住，我们只想在主分支发生变化时提升版本。因此，添加一个类似的<code>if</code>条件，以防止在pull request上的版本颠簸，就像在[练习11.14](/en/part11/keeping_green#exercises-11-13-11-14)中做的那样，防止在pull request相关的事件上进行部署。

<!-- Complete now the workflow. Do not just add it as another step, but configure it as a separate job that [depends](https://docs.github.com/en/actions/using-workflows/advanced-workflow-features#creating-dependent-jobs) on the job that takes care of linting, testing and deployment. So change your workflow definition as follows:-->
 现在完成工作流程。不要只是把它作为另一个步骤加入，而是把它配置成一个单独的工作，[依赖于](https://docs.github.com/en/actions/using-workflows/advanced-workflow-features#creating-dependent-jobs)负责打针、测试和部署的工作。因此，请修改你的工作流程定义如下。

```yml
name: Deployment pipeline

on:
  push:
    branches:
      - master
  pull_request:
    branches: [master]
    types: [opened, synchronize]

jobs:
  simple_deployment_pipeline:
    runs-on: ubuntu-20.04
    steps:
      // steps here
  tag_release:
    needs: [simple_deployment_pipeline]
    runs-on: ubuntu-20.04
    steps:
      // steps here
```

<!-- As was mentioned [earlier](/en/part11/getting_started_with_git_hub_actions#getting-started-with-workflows) jobs of a workflow are executed in parallel but since we want the linting, testing and deployment to be done first, we set a dependency that the <i>tag\_release</i> waits the another job to execute first since we do not want to tag the release unless it passes tests and is deployed.-->
 正如[前面](/en/part11/getting_started_with_git_hub_actions#getting-started-with-workflows)提到的那样，工作流中的作业是并行执行的，但由于我们希望先完成打样、测试和部署，所以我们设置了一个依赖关系，即<i>tag/_release</i>等待另一个作业先执行，因为我们不希望在发布版通过测试并被部署之前对其进行打样。

<!-- If you're uncertain of the configuration, you can set  <code>DRY_RUN</code> to <code>true</code>, which will make the action output the next version number without creating or tagging the release!-->
 如果你对配置不确定，你可以将<code>DRY_RUN</code>设置为<code>true</code>，这将使该动作输出下一个版本号，而不需要创建或标记发布版!

<!-- Once the workflow runs successfully, the repository mentions that there are some <i>tags</i>:-->
一旦工作流程运行成功，版本库就会提到有一些<i>标签</i>。

![Releases](../../images/11/17.png)

<!-- And by clicking it, you can see all the tags (that is the git mechanism to mark a release) listed:-->
 点击它，你可以看到列出的所有标签（也就是git标记发布的机制）。

![Releases](../../images/11/18.png)

#### 11.16 Skipping a commit for tagging and deployment

<!-- In general the more often you deploy the main branch to production, the better. However, there might be some valid reasons sometimes to skip a particular commit or a merged pull request to becoming tagged and released to production.-->
 一般来说，你越是频繁地将主分支部署到生产中，就越好。然而，有时可能会有一些合理的理由，跳过某个特定的提交或合并的拉动请求，使之成为标记并发布到生产中。

<!-- Modify your setup so that if a commit message in a pull request contains _#skip_, the merge will not be deployed to production and it is not tagged with a version number.-->
 修改你的设置，如果拉动请求中的提交信息包含_#skip_，那么合并后的请求将不会被部署到生产中，也不会被标记上版本号。

<!-- **Hints:**-->
 **提示：**

<!-- The easiest way to implement this is to alter the [if](https://docs.github.com/en/free-pro-team@latest/actions/reference/workflow-syntax-for-github-actions#jobsjob_idstepsif) conditions of the relevant steps. Similarly to [exercise 11-14](/en/part11/keeping_green#exercises-11-13-11-14) you can get the relevant information from the [GitHub context](https://docs.github.com/en/free-pro-team@latest/actions/reference/context-and-expression-syntax-for-github-actions#github-context) of the workflow.-->
 实现这一点的最简单方法是改变相关步骤的[if](https://docs.github.com/en/free-pro-team@latest/actions/reference/workflow-syntax-for-github-actions#jobsjob_idstepsif) 条件。与[练习11-14](/en/part11/keeping_green#exercises-11-13-11-14)类似，你可以从工作流的[GitHub上下文](https://docs.github.com/en/free-pro-team@latest/actions/reference/context-and-expression-syntax-for-github-actions#github-context)获取相关信息。

<!-- You might take this as a starting point:-->
 你可以把它作为一个起点。

```js
name: Testing stuff

on:
  push:
    branches:
      - main

jobs:
  a_test_job:
    runs-on: ubuntu-20.04
    steps:
      - uses: actions/checkout@v2
      - name: github context
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

<!-- See what gets printed in the workflow log!-->
 看看工作流日志中会打印出什么!

<!-- Note that you can access the commits and commit messages <i>only when pushing or merging to the main branch</i>, so for pull requests the <code>github.event.commits</code> is empty. It is anyway not needed, since we want to skip the step altogether for pull requests.-->
 注意，你只能在<i>推送或合并到主分支时访问提交和提交信息</i>，所以对于拉取请求，<code>github.event.commits</code>是空的。反正也不需要，因为我们想对拉取请求完全跳过这一步。

<!-- You most likely need functions [contains](https://docs.github.com/en/actions/learn-github-actions/expressions#contains) and [join](https://docs.github.com/en/actions/learn-github-actions/expressions#join) for your if condition.-->
 你很可能需要函数 [contains](https://docs.github.com/en/actions/learn-github-actions/expressions#contains) 和 [join](https://docs.github.com/en/actions/learn-github-actions/expressions#join) 作为你的if条件。

<!-- Developing workflows is not easy, and quite often the only option is trial and error. It might actually be advisable to have a separate repository for getting the configuration right, and when it is done, to copy the right configurations to the actual repository.-->
 开发工作流程并不容易，很多时候，唯一的选择是试验和错误。实际上，最好是有一个单独的仓库来获得正确的配置，当它完成后，将正确的配置复制到实际的仓库中。

<!-- It would also be possible to install a tool such as [act](https://github.com/nektos/act) that makes it possible to run your workflows locally. In case you end up to more involved use cases, e.g. by creating your [own custom actions](https://docs.github.com/en/free-pro-team@latest/actions/creating-actions) going through the burden of setting up a tool such as act is most likely worth the trouble.-->
 也可以安装一个工具，如[act](https://github.com/nektos/act)，使其有可能在本地运行你的工作流程。如果你最终涉及到更多的用例，例如通过创建你的[自己的自定义动作](https://docs.github.com/en/free-pro-team@latest/actions/creating-actions)，通过设置一个像act这样的工具的负担，很可能是值得的。

</div>

<div class="content">

### A note about using third party actions

<!-- When using a third party action such that <i>github-tag-action</i> it might be a good idea to specify the used version with hash instead of using a version number. The reason for this is that the version number, that is implemented with a git tag can in principle be <i>moved</i>. So today's version 1.33.0 might be a different code that is at the next week the version 1.33.0!-->
 当使用第三方动作，如<i>github-tag-action</i>时，用哈希值指定所使用的版本而不是使用版本号可能是一个好主意。这样做的原因是，用git标签实现的版本号原则上可以<i>移动</i>。所以今天的1.33.0版本可能是一个不同的代码，而下周的版本是1.33.0!

<!-- However, the code in commit with a particular hash does not change in any circumstances, so if we want to be 100% sure about the code we use, it is safest to use the hash.-->
 然而，在任何情况下，带有特定哈希值的提交代码都不会改变，所以如果我们想100%确定我们使用的代码，使用哈希值是最安全的。

<!-- The version [1.33.0](https://github.com/anothrNick/github-tag-action/releases) of the action corresponds to commit with hash <code>eca2b69f9e2c24be7decccd0f15fdb1ea5906598</code>, so we might want to change our configuration as follows:-->
 动作的版本[1.33.0](https://github.com/anothrNick/github-tag-action/releases)对应于带有哈希值的提交 <code>eca2b69f9e2c24be7decccd0f15fdb1ea5906598</code>，所以我们可能要改变我们的配置如下。

```js
    - name: Bump version and push tag
      uses: anothrNick/github-tag-action@eca2b69f9e2c24be7decccd0f15fdb1ea5906598  // highlight-line
      env:
        GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

<!-- When we use actions provided by GitHub we trust them not to mess with version tags and to thoroughly test their code.-->
 当我们使用GitHub提供的操作时，我们相信他们不会乱用版本标签，并且会彻底测试他们的代码。

<!-- In the case of third-party actions, the code might end up being buggy or even malicious. Even when the author of the open-source code does not have the intention of doing something bad, they might end up leaving their credentials on a post-it note in a cafe, and then who knows what might happen.-->
 在第三方动作的情况下，代码最终可能是有缺陷的，甚至是恶意的。即使开源代码的作者没有做坏事的意图，他们最终也可能把他们的证书留在咖啡馆的便条上，然后谁知道会发生什么。

<!-- By pointing to the hash of a specific commit we can be sure that the code we use when running the workflow will not change because changing the underlying commit and its contents would also change the hash.-->
 通过指向特定提交的哈希值，我们可以确保运行工作流时使用的代码不会改变，因为改变底层提交及其内容也会改变哈希值。

### Keep the main branch protected

<!-- GitHub allows you to set up protected branches. It is important to protect your most important branch that should never be broken: <i>master</i>/<i>main</i>. In repository settings, you can choose between several levels of protection. We will not go over all of the protection options, you can learn more about them in GitHub documentation. Requiring pull request approval when merging into the main branch is one of the options we mentioned earlier.-->
 GitHub允许你设置受保护的分支。保护你最重要的分支是很重要的，它不应该被破坏。<i>master</i>/<i>main</i>。在版本库设置中，你可以选择几个级别的保护。我们不会详述所有的保护选项，你可以在 GitHub 文档中了解更多信息。合并到主分支时要求拉取请求批准是我们前面提到的选项之一。

<!-- From CI point of view, the most important protection is requiring status checks to pass before a PR can be merged into the main branch. This means that if you have set up GitHub actions to run e.g. linting and testing tasks, then until all the lint errors are fixed and all the tests pass the PR cannot be merged. Because you are the administrator for your repository, you will see an option to override the restriction. However, non-administrators will not have this option.-->
 从 CI 的角度来看，最重要的保护措施是要求在 PR 合并到主干分支之前必须通过状态检查。这意味着，如果你设置了GitHub动作来运行例如linting和测试任务，那么在所有lint错误被修复和所有测试通过之前，PR不能被合并。因为你是仓库的管理员，你会看到一个选项来覆盖这个限制。然而，非管理员就没有这个选项了。

![Unmergeable PR](../../images/11/part11d_03.png)

<!-- To set up protection for your main branch, navigate to repository "Settings" from the top menu inside the repository. In the left-side menu select "Branches". Click "Add rule" button next to "Branch protection rules". Type a branch name pattern ("master" or "main" will do nicely) and select the protection you would want to set up. At least "Require status checks to pass before merging" is necessary for you to fully utilize the power of GitHub Actions. Under it, you should also check "Require branches to be up to date before merging" and select all of the status checks that should pass before a PR can be merged.-->
 要为你的主分支设置保护，在版本库的顶部菜单中导航到版本库的 "设置"。在左边的菜单中选择 "Branches"。点击 "分支保护规则 "旁边的 "添加规则 "按钮。输入一个分支名称模式（"master "或 "main "就可以了），并选择你想设置的保护。至少 "要求在合并前通过状态检查 "是必要的，这样才能充分利用 GitHub Actions 的力量。在它下面，你还应该勾选 "要求分支在合并前是最新的"，并选择所有在合并 PR 前应该通过的状态检查。

![Branch protection rule](../../images/11/part11d_04.png)

</div>

<div class="tasks">

### Exercise 11.17

#### 11.17 Adding protection to your main branch

<!-- Add protection to your <i>master</i> (or <i>main</i>) branch.-->
 为你的<i>master</i>（或<i>main</i>）分支添加保护。

<!-- You should protect it to:-->
 你应该保护它。
<!-- - Require all pull request to be approved before merging-->
 - 要求所有拉动请求在合并前被批准
<!-- - Require all status checks to pass before merging-->
 - 要求所有状态检查在合并前通过

<!-- Do not yet check <i>Include administrators</i>. If you do that, you need somebody else to review your pull requests to get the code released!-->
 还不要检查<i>包括管理员</i>。如果你这样做了，你就需要其他人来审查你的拉动请求，以获得代码的发布

</div>
