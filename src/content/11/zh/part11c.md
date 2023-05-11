---
mainImage: ../../../images/part-11.svg
part: 11
letter: c
lang: zh
---

<div class="content">

<!-- Having written a nice application it's time to think about how we're going to deploy it to the use of real users.-->
写了一个不错的应用程序之后，是时候考虑一下如何将它部署到真正的用户中去了。

<!-- In [part 3](/en/part3/deploying_app_to_internet) of this course, we did this by simply running a single command from terminal to get the code up and running the servers of the cloud provider [Fly.io](https://fly.io/) or [Render](hhttps://render.com/).-->
在本课程的[第三章节](/en/part3/deploying_app_to_internet)中，我们只需从终端运行一个单个命令就可以将代码部署到云端提供商[Fly.io](https://fly.io/)或[Render](hhttps://render.com/)的服务器上。

<!-- It is pretty simple to release software in Fly.io and Render at least compared to many other types of hosting setups but it still contains risks: nothing prevents us from accidentally releasing broken code to production.-->
Fly.io 和 Render 至少比起许多其他类型的托管设置来说，发布软件相当简单，但仍然存在风险：没有任何东西可以阻止我们不小心将损坏的代码发布到生产环境中。

<!-- Next, we''re going to look at the principles of making a deployment safely and some of the principles of deploying software on both a small and large scale.-->
接下来，我们将讨论安全部署的原则以及在小规模和大规模部署软件的原则。

### Anything that can go wrong...

<!-- We''d like to define some rules about how our deployment process should work but before that, we have to look at some constraints of reality.-->
我们想定义一些关于我们的部署过程应该如何工作的规则，但在此之前，我们必须先考虑一些现实的约束。

<!-- One on the phrasing of Murphy's Law holds that:-->
**一句关于墨菲定律的表述是：**

如果有可能出错，那么它就一定会出错。
<!--   "Anything that can go wrong will go wrong."-->
「凡事都有可能出错。」

<!-- It's important to remember this when we plan out our deployment system. Some of the things we'll need to consider could include:-->
这在我们计划部署系统时很重要要记住。我们需要考虑的事情可能包括：
<!--  - What if my computer crashes or hangs during deployment?-->
- 如果我的电脑在部署期间崩溃或卡住怎么办？
<!--  - I''m connected to the server and deploying over the internet, what happens if my internet connection dies?-->
- 我已经连接上服务器，正在通过互联网部署，如果我的互联网连接断开了会发生什么？
<!--  - What happens if any specific instruction in my deployment script/system fails?-->
- 如果我的部署脚本/系统中的任何特定指令失败了会发生什么？
<!--  - What happens if, for whatever reason, my software doesn't work as expected on the server I'm deploying to? Can I roll back to a previous version?-->
如果出于某种原因，我的软件在我部署的服务器上无法正常工作，会发生什么？我可以回滚到以前的版本吗？
<!--  - What happens if a user does an HTTP request to our software just before we do deployment (we didn''t have time to send a response to the user)?-->
如果用户在我们部署软件之前就发出了一个HTTP请求（我们没有时间给用户发送响应），会发生什么？

<!-- These are just a small selection of what can go wrong during a deployment, or rather, things that we should plan for. Regardless of what happens, our deployment system should **never** leave our software in a broken state. We should also always know (or be easily able to find out) what state a deployment is in.-->
这只是部署中可能出现的一小部分问题，或者说，我们应该做好计划。无论发生什么，我们的部署系统**永远不应**将软件置于损坏状态。我们也应该始终知道（或者很容易找到）部署的状态。

<!-- Another important rule to remember when it comes to deployments (and CI in general) is:-->
另一个重要的规则，在部署（和一般的持续整合）时要记住的是：
<!--   "Silent failures are **very** bad!"-->
**默默的失败是非常糟糕的！**

<!-- This doesn't mean that failures need to be shown to the users of the software, it means we need to be aware if anything goes wrong. If we are aware of a problem, we can fix it. If the deployment system doesn't give any errors but fails, we may end up in a state where we believe we have fixed a critical bug but the deployment failed, leaving the bug in our production environment and us unaware of the situation.-->
这并不意味着需要向软件用户展示失败，而是我们需要意识到任何出错的情况。如果我们意识到有问题，我们可以修复它。如果部署系统没有任何错误但失败了，我们可能最终会处于一种状态，即我们相信已经修复了一个关键的 bug，但部署失败了，使得 bug 留在我们的生产环境中，而我们不知道这种情况。

### What does a good deployment system do?

<!-- Defining definitive rules or requirements for a deployment system is difficult, let's try anyway:-->
定义一个部署系统的明确规则或要求是很困难的，但我们还是尝试一下：
<!--  - Our deployment system should be able to fail gracefully at **any** step of the deployment.-->
我们的部署系统应该能够在部署的**任何**一步优雅地失败。
<!--  - Our deployment system should **never** leave our software in a broken state.-->
我们的部署系统**永远不应**使我们的软件处于损坏状态。
<!--  - Our deployment system should let us know when a failure has happened. It's more important to notify about failure than about success.-->
我们的部署系统应该让我们知道失败发生时。通知失败比通知成功更重要。
<!--  - Our deployment system should allow us to roll back to a previous deployment-->
我们的部署系统应该允许我们回滚到以前的部署。
<!--    - Preferably this rollback should be easier to do and less prone to failure than a full deployment-->
最好这个回滚比完整部署更容易实现，也更不容易出错。
<!--    - Of course, the best option would be an automatic rollback in case of deployment failures-->
- 当然，最好的选择是在部署失败时自动回滚。
<!--  - Our deployment system should handle the situation where a user makes an HTTP request just before/during a deployment.-->
我们的部署系统应该处理用户在部署前/期间发出HTTP请求的情况。
<!--  - Our deployment system should make sure that the software we are deploying meets the requirements we have set for this (e.g. don't deploy if tests haven't been run).-->
我们的部署系统应该确保我们部署的软件符合我们为此设定的要求（例如，如果没有运行测试，则不要部署）。

<!-- Let's define some things we **want** in this hypothetical deployment system too:-->
让我们定义一些我们**想要**在这个假设的部署系统中的东西：
<!--  - We would like it to be fast-->
我们希望它能快速完成。
<!--  - We''d like to have no downtime during the deployment (this is distinct from the requirement we have for handling user requests just before/during the deployment).-->
我们希望在部署期间没有停机时间（这与我们在部署之前/期间处理用户请求的要求是不同的）。

<!-- Next we will have three sets of exercises for automazing the deployment with GitHub Actions, one for [Fly.io](https://fly.io/), another one for [Render](https://render.com/) and finally the good old [Heroku](https://heroku.com). The process of deployment is always specific to the particular cloud provider, so you can also do the both the exercise sets if you want to see the differences how these services work with respect to deployments.-->
接下来我们将有三组用于用GitHub Actions自动部署的练习，一个是[Fly.io](https://fly.io/)，另一个是[Render](https://render.com/)，最后是老牌[Heroku](https://heroku.com/)。部署过程总是特定于特定的云提供商，因此您也可以完成两个练习集，以便查看这些服务在部署方面的差异。

</div>

<div class="tasks">

### Exercises 11.10-11.12. (Fly.io)

<!-- Before going to the below exercises, you should setup your application in [Fly.io](https://fly.io/) hosting service like the one we did in [part 3](/en/part3/deploying_app_to_internet#application-to-the-internet).-->
在开始下面的练习之前，您应该在[Fly.io](https://fly.io/)托管服务中像我们在[第3章节](/en/part3/deploying_app_to_internet#application-to-the-internet)中所做的那样设置您的应用程序。

<!-- If you rather want to use other hosting options, there is an alternative set of exercises for [Render](http://localhost:8000/en/part11/deployment#exercises-11-10-11-12-render) and for [Heroku](/en/part11/deployment#exercises-11-10-11-12-heroku).-->
如果您更喜欢使用其他托管选项，[Render](http://localhost:8000/en/part11/deployment#exercises-11-10-11-12-render) 和 [Heroku](/en/part11/deployment#exercises-11-10-11-12-heroku) 均有一套替代练习。

<!-- In contrast to part 3 now we <i>do not deploy the code</i> to Fly.io ourselves (with the command <i>flyctl deploy</i>), we let the GitHub Actions workflow do that for us!-->
相比起第三章节，我们<i>不再自己部署代码</i>到Fly.io上（使用命令<i>flyctl deploy</i>），我们让GitHub Actions工作流来帮我们完成！

<!-- Create a new app in Fly.io and after that generate a Fly.io API token with command-->
line

在Fly.io上创建一个新的应用，然后使用命令行生成Fly.io API令牌。

```bash
flyctl auth token
```

<!-- You''ll need the token soon for your deployment workflow!-->
你很快就需要令牌来部署工作流程了！

<!-- Before setting up the deployment pipeline let us ensure that a manual deployment with the command <i>flyctl deploy</i> works.-->
在设置部署管道之前，让我们确保使用命令<i>flyctl deploy</i>可以进行手动部署。

<!-- You most likely need to do at least three changes. Firstly, define the Node version to use in the file <i>package.json</i> to match one used in your machine. For me it is 16.19.1:-->
首先，在文件<i>package.json</i>中定义要使用的Node版本，以匹配您的机器使用的版本。对我来说是16.19.1：

```json
{
  // highlight-start
  "engines": {
    "node": "16.19.1"
  },
  // highlight-end
  "name": "fullstackopen-cicd",
  "version": "1.0.0",
  "description": "Full Stack Open",
  // ...
}
```

<!-- The configuration file <i>fly.toml</i> should also be modified to include the following:-->
<i>fly.toml</i> 配置文件也应该被修改以包括以下内容：

```yml
[deploy]
  release_command = "npm run build"

[processes]
  app = "node app.js"

[build]
  [build.args]
    NODE_VERSION = "16.19.1"
```

<!-- Besides these, we should also move _webpack_ from _devDependencies_ to _dependencies_ since our build step requires it to be installed:-->
除此之外，我们还应该将_webpack_从_devDependencies_移动到_dependencies_，因为我们的构建步骤需要它被安装。

```json
{
  // ...
  "dependencies": {
    "webpack": "^4.43.0",
  }
}
```

<!-- The <i>release\_command</i> under [deploy](https://fly.io/docs/reference/configuration/) now ensures that the production built will be done before starting up the app. In [processes](https://fly.io/docs/reference/configuration/#the-processes-section) we define the command that starts the application. Without these changes Fly.io just starts the React dev server and that causes it to shut down since the app itself does not start up.-->
<i>release\_command</i> 根据[部署](https://fly.io/docs/reference/configuration/)现在确保在启动应用程序之前完成生产构建。在[过程](https://fly.io/docs/reference/configuration/#the-processes-section)中，我们定义启动应用程序的命令。没有这些更改，Fly.io只会启动React开发服务器，这会导致它关闭，因为应用程序本身没有启动。

<!-- Here the <i>app</i> refers to the application process that is started up in the [services](https://fly.io/docs/reference/configuration/#the-services-sections) section:-->
这里的<i>应用程序</i>指的是在[服务](https://fly.io/docs/reference/configuration/#the-services-sections)部分启动的应用程序过程：

```yml
[[services]]
  http_checks = []
  internal_port = 8080
  processes = ["app"]  # highlight-line
```

#### 11.10 Deploying your application to Fly.io

<!-- Before starting this exercise, make sure that the manual deployment with the command <i>flyctl deploy</i> works!-->
<i>在开始这个练习之前，请确保使用命令 <i>flyctl deploy</i> 手动部署可以正常工作！</i>

<!-- Extend the workflow with a step to deploy your application to Fly.io by following the advice given [here](https://fly.io/docs/app-guides/continuous-deployment-with-github-actions/).-->
扩展工作流，按照[这里](https://fly.io/docs/app-guides/continuous-deployment-with-github-actions/)给出的建议，添加一个步骤将应用部署到Fly.io。

<!-- You need the authorization token that you just created for the deployment. The proper way to pass it's value to GitHub Actions is to use repository secrets:-->
你需要刚刚创建的用于部署的授权令牌。向GitHub Actions传递它的值的正确方法是使用存储库秘密：

![repo secret](../../images/11/10f.png)

<!-- Now the workflow can access the token value as follows:-->
现在工作流程可以按如下方式访问令牌值：

```
${{secrets.FLY_API_TOKEN}}
```

<!-- If all goes well, your workflow log should look a bit like this:-->
如果一切顺利，您的工作流日志应该看起来有点像这样：

![](../../images/11/11.png)

<!-- You can then try the app with a browser, but most likely you run into a problem. If we read carefully [the section 'Application to the Internet' in part 3](/en/part3/deploying_app_to_internet#application-to-the-internet)-->
of this guide, we can find the solution.

你可以用浏览器试用这个应用，但很可能会遇到问题。如果仔细阅读[本指南第三章节的「将应用部署到互联网」一节](/en/part3/deploying_app_to_internet#application-to-the-internet)，我们就可以找到解决方案。

<!-- **Remember** that it is always essential to keep an eye on what is happening in server logs when playing around with product deployments, so use <code>flyctl logs</code> early and use it often. No, use it all the time!-->
**记住**，当玩转产品部署时，总是必须密切关注服务器日志上发生的事情，因此尽早使用<code>flyctl logs</code>，并经常使用它。不，一直使用它！

#### 11.11 Health check and rollback

<!-- Each deployment in Fly.io creates a [release](https://fly.io/docs/flyctl/releases/). Releases can be checked from the command line:-->
每次在Fly.io上的部署都会创建一个[发布](https://fly.io/docs/flyctl/releases/)。可以从命令行检查发布：

```bash
$ flyctl releases
VERSION	STABLE	TYPE    	STATUS   	DESCRIPTION            	USER           	DATE
v13    	true  	release 	succeeded	Deploy image           	mluukkai@iki.fi	30m6s ago
v12    	true  	release 	succeeded	Deploy image           	mluukkai@iki.fi	51m30s ago
v11    	true  	release 	succeeded	Deploy image           	mluukkai@iki.fi	59m25s ago
v10    	true  	release 	succeeded	Deploy image           	mluukkai@iki.fi	1h6m ago
```

<!-- It is essential to ensure that a deployment ends up to a <i>succeeding</i> release, where the app is in healthy functional state. Fortunately Fly.io has several configuration options that take care of the application health check.-->
<i>确保部署最终发布成功，应用处于健康的功能状态是至关重要的。幸运的是，Fly.io有几个配置选项可以处理应用程序健康检查。</i>

<!-- The default fly.toml has already a section [-->
source]

[源] 部分已经有默认的fly.toml
<!-- services.tcp_checks](https://fly.io/docs/reference/configuration/#services-tcp_checks)-->
## 服务.tcp_checks

tcp_checks 指令允许您指定一组 TCP 检查，以检查代理的后端服务是否可用。如果检查失败，则代理将拒绝流量，您可以配置可选的超时和重试次数。检查的结果将被缓存，并且当检查失败时，将自动重试检查。

**服务.tcp_checks**

tcp_checks指令允许您指定一组TCP检查，以检查代理的后端服务是否可用。如果检查失败，则代理将拒绝流量，您可以配置可选的超时和重试次数。检查的结果将被缓存，并且当检查失败时，将自动重试检查。

```yml
  [[services.tcp_checks]]
    grace_period = "1s"
    interval = "15s"
    restart_limit = 0
    timeout = "2s"
```

<!-- This section defines a basic health check of the deployment. The TCP check ensures that the virtual machine where the app resides is up and running and reachable from outside, by opening a [TCP](https://en.wikipedia.org/wiki/Transmission_Control_Protocol) connection to the virtual machine.-->
这一节定义了部署的基本健康检查。TCP检查确保应用程序所在的虚拟机处于运行状态，并且可以从外部通过[TCP](https://en.wikipedia.org/wiki/Transmission_Control_Protocol)连接到虚拟机。

<!-- This check notices if something is fundamentally broken in the configurations. E.g. in my case for the app of this part, it took several trials until I got the app up and running:-->
这个检查通知如果配置中有什么基本上是破坏的。例如，在我的情况下，对于这部分的应用程序，直到我把应用程序起来运行，它花了几次试验：

```bash
$ fly releases
VERSION	STABLE	TYPE    	STATUS   	DESCRIPTION            	USER           	DATE
v4     	true  	release 	succeeded	Deploy image           	mluukkai@iki.fi	5h39m ago
v3     	false 	release 	failed   	Deploy image           	mluukkai@iki.fi	5h50m ago
v2     	false 	release 	failed   	Deploy image           	mluukkai@iki.fi	5h57m ago
v1     	false 	release 	failed   	Deploy image           	mluukkai@iki.fi	6h12m ago
v0     	false 	release 	failed   	Deploy image           	mluukkai@iki.fi	6h19m ago
```

<!-- So finally in the 5th deployment (version v4) I got the configuration right and that ended in a succeeding release.-->
最后在第5次部署(版本v4)中，我正确地配置了它，最终发布成功了。

<!-- Besides the rudimentary TCP health check, it is extremely beneficial to have also some "application level" health checks ensuring that the app for real is in functional state. One possibility for this is a HTTP-level check defined in section [services.http_checks](https://fly.io/docs/reference/configuration/#services-tcp_checks) that can be used to ensure that the app is responding to the HTTP requests.-->
除了基本的TCP健康检查之外，进行一些“应用程序级别”的健康检查以确保应用程序真正处于功能状态是极其有益的。其中一种可能性是在[services.http_checks](https://fly.io/docs/reference/configuration/#services-tcp_checks)中定义的HTTP级别检查，可用于确保应用程序正在响应HTTP请求。

<!-- Add a simple endpoint for doing an application health check to the backend. You may e.g. copy this code:-->
在后端添加一个简单的端点用于做应用程序健康检查。你可以比如复制以下代码：

```js
app.get('/health', (req, res) => {
  res.send('ok')
})
```

<!-- Configure then a [HTTP-check](https://fly.io/docs/reference/configuration/#services-http_checks) that ensures the health of the depyments based on the HTTP request to the defined health check endpoint.-->
配置一个[HTTP-check](https://fly.io/docs/reference/configuration/#services-http_checks)，根据对定义的健康检查端点的HTTP请求，确保部署的健康状态。

<!-- Note that the default fly.toml has defined that <i>http\_checks</i> is an empty array. You need to remove this line when you are adding a manually defined HTTP-check:-->
注意，默认的fly.toml中已经定义了<i>http\_checks</i>是一个空数组。当您添加一个手动定义的HTTP检查时，您需要删除此行：

```yml
[[services]]
  http_checks = [] # highlight-line
```

<!-- It might also be a good idea to have a dummy endpoint in the app that makes it possible to do some code changes and to ensure that the deployed version has really changed:-->
也许有一个虚拟端点在应用中也是一个好主意，这样可以做一些代码更改，并确保部署的版本确实发生了变化：

```js
app.get('/version', (req, res) => {
  res.send('1') // change this string to ensure a new version deployed
})
```

<!-- Ensure that Actions notices if a deployment breaks your application:-->
确保Actions能够注意到如果部署破坏了你的应用程序:

![](../../images/11/12f.png)

<!-- You may simulate this e.g. as follows:-->
你可以像下面这样模拟：

```js
app.get('/health', (req, res) => {
  throw 'error...'
  // eslint-disable-next-line no-unreachable
  res.send('ok')
})
```

<!-- As can be seen in the command line, when a deployment fails, Fly.io rolls back to the previous working release:-->
在命令行中可以看到，当部署失败时，Fly.io会回滚到之前的可用发布版本：

```bash
$ fly releases
VERSION	STABLE	TYPE    	STATUS   	DESCRIPTION            	USER           	DATE
v15    	true  	rollback	succeeded	Reverting to version 13	               	16m48s ago
v14    	false 	release 	failed   	Deploy image           	mluukkai@iki.fi	21m53s ago
v13    	true  	release 	succeeded	Deploy image           	mluukkai@iki.fi	30m6s ago
v12    	true  	release 	succeeded	Deploy image           	mluukkai@iki.fi	51m30s ago
v11    	true  	release 	succeeded	Deploy image           	mluukkai@iki.fi	59m25s ago
v10    	true  	release 	succeeded	Deploy image           	mluukkai@iki.fi	1h6m ago
```

<!-- So despite the problems in the release, the app stays functional!-->
所以，尽管发布存在问题，但该应用仍然可以正常使用！

<!-- Before moving to next exercise, fix your deployment and ensure that the application works again as intended.-->
在进入下一个练习之前，修复你的部署，确保应用程序再次按预期正常工作。

#### 11.12. Custom health check

<!-- Besides TCP and HTTP based health checks, Fly.io allows to use very flexible shell script based health checks. The feature is still undocumented but e.g. [this](https://community.fly.io/t/verifying-services-script-checks-is-supported/1464) shows you how to use it.-->
除了基于TCP和HTTP的健康检查，Fly.io还允许使用非常灵活的基于shell脚本的健康检查。 该功能仍未文档化，但例如[此](https://community.fly.io/t/verifying-services-script-checks-is-supported/1464)会向您展示如何使用它。

<!-- Create a file <i>health\_check.sh</i> with the following content:-->
创建一个文件 <i>health\_check.sh</i>，内容如下：

```bash
#!/bin/bash

echo "Hello from shell script"

exit 1 # exit status 1 means that the script "fails"
```

<!-- Give it execution permissions (Google or see e.g. [this](https://www.guru99.com/file-permissions.html) to find out how) and ensure that you can run it from the command line:-->
给它执行权限（可以搜索Google或参考[此处](https://www.guru99.com/file-permissions.html)了解如何操作），并确保可以从命令行运行它。

```bash
$ ./health_check.sh
Hello from shell script
```

<!-- Define a health check to your app that runs the script in the file <i>health\_check.sh</i>. Ensure that this health check and deployment fails. After that, change the script as follows:-->
定义一个对你的应用程序进行健康检查的脚本，该脚本位于文件<i>health\_check.sh</i>中。确保此健康检查和部署失败。然后，更改脚本如下：

```bash
#!/bin/bash

echo "Hello from shell script"

exit 0  # exit status 0 means that the script "succeeds"
```

<!-- Ensure now that the deployment works. Note that to get the path to the script file right, it may be beneficial to log in to your virtual machine console to see where the files reside. Logging in is done with the command-->
"ssh username@hostname".

确保现在部署可以正常工作。注意，为了正确获取脚本文件的路径，可能有利于登录到虚拟机控制台来查看文件所在的位置。登录使用命令“ssh username@hostname”。

```bash
flyctl ssh console -t YOUR_AUTH_TOKEN
```

<!-- Now when you know that the script based health check works, it is time to define the real health check.-->
现在当你知道基于脚本的健康检查工作时，是时候定义真正的健康检查了。

<i>Write a script ensuring the health check endpoint (that is, the GET request to '/health') not only works, but also returns the correct string 'ok'.</i>

<!-- You probably should use [curl](https://curl.se/) in the script to do the HTTP request. You most likely need to Google how to get hold to the returned string and compare it with the expected value 'ok'.-->
你可能应该在脚本中使用[curl](https://curl.se/)来执行HTTP请求。你最有可能需要谷歌如何获得返回的字符串并与预期值'ok'进行比较。

<!-- By default _curl_ does not exist in the Fly.io virtual machine. You can install it by adding the following line in the file _Dockerfile_ that gets created in your project root directory when Fly.io app is set up:-->
默认情况下，_curl_ 不存在于Fly.io虚拟机中。您可以通过在Fly.io应用程序设置时在项目根目录中创建的_Dockerfile_文件中添加以下行来安装它：

```bash
# ...

FROM debian:bullseye

RUN apt-get update; apt install -y curl // highlight-line

LABEL fly_launch_runtime="nodejs"

COPY --from=builder /root/.volta /root/.volta
COPY --from=builder /app /app

WORKDIR /app
ENV NODE_ENV production
ENV PATH /root/.volta/bin:$PATH

CMD [ "npm", "run", "start" ]
```

<!-- It is <strong>strongly advisable</strong> to check first locally that the script works since so many things can go wrong in it, and when run in GitHub Action, you can not do any debug printing. If and <i> when</i> things do not work as intended, it is also a very good idea to log in to the virtual machine (with <i>flyctl ssh console</i>) and check that the script works when ran manually there.-->
<strong>强烈建议</strong>首先本地检查脚本是否有效，因为脚本中可能会出现许多问题，而在GitHub Action中运行时，您无法进行任何调试打印。如果（<i>当</i>）事情没有按预期运行，登录虚拟机（使用<i>flyctl ssh console</i>）并手动检查脚本是否有效也是一个非常好的主意。

<!-- *Note* that in order to test the script in the virtual machine, you should have the script in your local directory when you make a successful deployment. So if your deployment fails, the script will not be uploaded to the Fly.io server. So in case of problems, comment out the script based health check from fly.toml and do a deployment to get your script to the virtual machine.-->
*注意*，为了在虚拟机中测试脚本，您应该在成功部署时将脚本放在本地目录中。因此，如果部署失败，脚本将不会上传到Fly.io服务器。因此，如果遇到问题，请注释fly.toml中的脚本健康检查，然后进行部署以将脚本传送到虚拟机。

<!-- Our script based health check is hardly meaningful in real life since it does essentially the same that is achievable with the simple HTTP check. The example here is just to show that the mechanism exists. Unlike with HTTP checks, with script based health checks you can in principle write an arbitrarily compiled and many sided health check to your app, should you need one.-->
我们基于脚本的健康检查在实际生活中几乎没有意义，因为它基本上和简单的HTTP检查所能实现的是一样的。这里的例子只是为了显示这种机制的存在。与HTTP检查不同，使用脚本基础的健康检查，原则上可以根据需要为你的应用编写复杂的、多方面的健康检查。

</div>

<div class="tasks">

### Exercises 11.10-11.12. (Render)

<!-- If you rather want to use other hosting options, there is an alternative set of exercises for [Fly.io](/en/part11/deployment/#exercises-11-10-11-12-fly-io) and for [Heroku](/en/part11/deployment#exercises-11-10-11-12-heroku).-->
如果你想使用其他的托管选项，有一套替代练习可供[Fly.io](/en/part11/deployment/#exercises-11-10-11-12-fly-io)和[Heroku](/en/part11/deployment#exercises-11-10-11-12-heroku)使用。

#### 11.10 Deploying your application to Render

<!-- Set up your application in [Render](render.com). The setup is now not quite as straightforward as in [part 3](/en/part3/deploying_app_to_internet#application-to-the-internet). You have to carefully think about what should go to these settings:-->
在[Render](render.com)中设置你的应用程序。 现在设置不像[第3章节](/en/part3/deploying_app_to_internet#application-to-the-internet)那么直接。 你必须仔细思考这些设置应该放置什么：

![](../../images/11/render1.png)

<!-- If you need to run several commands in the build or start command, you may use a simple shell script for that.-->
如果你需要在构建或启动命令中运行几个命令，你可以使用一个简单的shell脚本来完成。

<!-- Create eg. a file <i>build_step.sh</i> with the following content:-->
创建一个文件 <i>build_step.sh</i>，内容如下：

```bash
#!/bin/bash

echo "Build script"

# add the commands here
```

<!-- Give it execution permissions (Google or see e.g. [this](https://www.guru99.com/file-permissions.html) to find out how) and ensure that you can run it from the command line:-->
给它执行权限（可以使用谷歌或参考[此链接](https://www.guru99.com/file-permissions.html)来了解如何操作），并确保可以从命令行运行它。

```bash
$ ./build_step.sh
Build script
```

<!-- You also need to open the <i>Advanced settings</i> and turn the auto-deploy off since we want to control the deployment in the GitHub Actions:-->
你还需要打开<i>高级设置</i>并关闭自动部署，因为我们想在GitHub Actions中控制部署。

![](../../images/11/render2.png)

<!-- Ensure now that you get the app up and running. Use the <i>Manual deploy</i>.-->
确保现在你可以让应用程序正常运行。使用<i>手动部署</i>。

<!-- Most likely things will fail at the start, so remember to keep the <i>Logs</i> open all the time.-->
大概事情一开始就会失败，所以记得一直保持<i>日志</i>开放。

#### 11.11 Automatic deployments

<!-- Go now to GitHub Actions [marketplace](https://github.com/marketplace) and search for action for our purposes. You might search with <i>render deploy</i>. There are several actions to choose from. You can pick any. Quite often the best choice is the one with the most stars. It is also a good idea to look if the action is actively maintained (time of the last release) and does it have many open issues or pull requests.-->
现在去GitHub Actions [市场](https://github.com/marketplace)搜索我们的用途的action。你可以用<i>render deploy</i>来搜索。有几个action可供选择。你可以选择任何一个。通常最好的选择是拥有最多星星的那个。同时也有必要看看action是否经常维护（最近一次发布的时间），是否有许多打开的问题或拉取请求。

<!-- Set up the action to your workflow and ensure that every commit that pass all the checks results in a new deployment. Note that you need Render API key and the app service id for the deployment. See [here](https://render.com/docs/api) how the API key is generated. You can get the service id from the URL of the Render dashboard of your app. The end of the URL (starting with _srv-_) is the id:-->
设置您的工作流程的动作，确保每个通过所有检查的提交都会导致新的部署。注意，您需要Render API密钥和应用服务ID才能进行部署。参见[这里](https://render.com/docs/api)了解如何生成API密钥。您可以从您应用程序的Render仪表板的URL中获取服务ID。URL的结尾（以_srv-_开头）就是ID：

```bash
https://dashboard.render.com/web/srv-crandomcharachtershere
```
<!-- Alternatively you could just use [Render Deploy Hook](https://render.com/docs/deploy-hooks) which is a private url to trigger the deployment. You can get it from your app settings ![fsorender1](https://user-images.githubusercontent.com/47830671/230722899-1ebb414e-ae1e-4a5e-a7b8-f376c4f1ca4d.png).-->
另外，您也可以使用[Render部署钩子](https://render.com/docs/deploy-hooks)，这是一个私有URL来触发部署。您可以从应用设置中获取它！ ![fsorender1](https://user-images.githubusercontent.com/47830671/230722899-1ebb414e-ae1e-4a5e-a7b8-f376c4f1ca4d.png)。
<!-- DON''T USE the plain url in your pipeline. Instead create github secrets for your key and service id: ![fsorender2](https://user-images.githubusercontent.com/47830671/230723138-77d027be-3162-4697-987e-b654bc710187.png)-->
不要在你的管道中使用普通的url，而是为你的密钥和服务ID创建Github密钥：![fsorender2](https://user-images.githubusercontent.com/47830671/230723138-77d027be-3162-4697-987e-b654bc710187.png)
<!-- Then you can use them like this:-->
然后你可以这样使用它们：
``` bash
    main:
    name: Deploy to Render
    runs-on: ubuntu-latest
    steps:
      - name: Trigger deployment
        run: curl https://api.render.com/deploy/srv-${{ secrets.RENDER_SERVICE_ID }}?key=${{ secrets.RENDER_API_KEY }}
```


<!-- The deployment takes some time. See the events tab of the Render dashboard to see when the new deployment is ready:-->
部署需要一些时间。查看Render仪表板的事件选项卡，以查看新部署何时准备就绪：

![](../../images/11/render3.png)

<!-- It might be a good idea to have a dummy endpoint in the app that makes it possible to do some code changes and to ensure that the deployed version has really changed:-->
可能有个好主意，在应用程序中添加一个虚拟端点，使得可以做一些代码更改，并确保已部署的版本确实发生了变化：

```js
app.get('/version', (req, res) => {
  res.send('1') // change this string to ensure a new version deployed
})
```

#### 11.12 Health check

<!-- All tests pass and the new version of the app gets automatically deployed to Render so everything seems to be in order. But does the app really work? Besides the checks done in the deployment pipeline, it is extremely beneficial to have also some "application level" health checks ensuring that the app for real is in a functional state.-->
所有测试都通过，新版本的应用程序自动部署到Render，一切似乎都正常。但是应用程序真的有效吗？除了部署管道中所做的检查之外，还有一些“应用程序级别”的健康检查，可以确保应用程序真正处于功能状态，这是极其有益的。

<!-- Add a simple endpoint for doing an application health check to the backend. You may e.g. copy this code:-->
添加一个简单的端点用于应用程序健康检查后端。例如，你可以复制此代码：

```js
app.get('/health', (req, res) => {
  res.send('ok')
})
```

<!-- Commit the code and push it to GitHub. Ensure that you can access the health check endpoint of your app.-->
提交代码并将其推送到GitHub。确保您可以访问应用程序的健康检查端点。

<!-- Configure now a <i>Health Check Path</i> to your app. The configuration is done in the settings tab of the Render dashboard.-->
配置现在一个<i>健康检查路径</i>到您的应用程序。配置在Render仪表板的设置选项卡中完成。

<!-- Make a change in your code, push it to GitHub, and ensure that the deployment succeeds.-->
更改你的代码，将其推送到GitHub，并确保部署成功。

<!-- Note that you can see the log of deployment by clicking the most recent deployment in the events tab.-->
点击事件标签中最近一次部署，您可以查看部署日志。

<!-- When you are set up with the health check, simulate a broken deployment by changing the code as follows:-->
当你完成健康检查设置之后，通过以下方式改变代码来模拟一次损坏的部署：

```js
app.get('/health', (req, res) => {
  throw 'error...'
  // eslint-disable-next-line no-unreachable
  res.send('ok')
})
```

<!-- Push the code to GitHub and ensure that a broken version does not get deployed and the previous version of the app keeps running.-->
推送代码到GitHub，确保不会部署坏版本，并且之前的应用程序保持运行。

<!-- Before moving on, fix your deployment and ensure that the application works again as intended.-->
在继续前进之前，请修复你的部署并确保应用程序再次按预期工作。

</div>

<div class="tasks">

### Exercises 11.10-11.12. (Heroku)

<!-- Before going to the below exercises, you should setup your application in [Heroku](heroku.com) hosting service like the one we did in [part 3](/en/part3/deploying_app_to_internet#application-to-the-internet).-->
在做下面的练习之前，你应该像我们在[第三章节](/en/part3/deploying_app_to_internet#application-to-the-internet)中所做的那样，在[Heroku](heroku.com)托管服务上设置你的应用程序。

<!-- If you rather want to use other hosting options, there is an alternative set of exercises for [Fly.io](/en/part11/deployment/#exercises-11-10-11-12-fly-io) and for [Render](/en/part11/deployment#exercises-11-10-11-12-render).-->
如果您想使用其他主机选项，还有另一套针对[Fly.io](/en/part11/deployment/#exercises-11-10-11-12-fly-io)和[Render](/en/part11/deployment#exercises-11-10-11-12-render)的练习。

<!-- In contrast to part 3 now we <i>do not push the code</i> to Heroku ourselves, we let the Github Actions workflow do that for us!-->
在与第3章节形成对比的是，我们<i>不再自己把代码推送到Heroku上</i>，而是让Github Actions工作流来为我们完成这项任务！

<!-- Ensure now that you have [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli#download-and-install) installed and login to Heroku using the CLI with <code>heroku login</code>.-->
确保现在您已经安装[Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli#download-and-install)，并使用CLI通过<code>heroku login</code>登录Heroku。

<!-- Create a new app in Heroku using the  CLI: <code>heroku create --region eu {your-app-name}</code>, pick a [region](https://devcenter.heroku.com/articles/regions) close to your own location! (You can also leave the app blank and Heroku will create an app name for you.)-->
使用CLI在Heroku上创建一个新应用：<code>heroku create --region eu {your-app-name}</code>，选择一个[地区](https://devcenter.heroku.com/articles/regions)靠近你自己的位置！（你也可以留空应用，Heroku会为你创建一个应用名称。）

<!-- Generate an API token for your Heroku profile using command <code>heroku authorizations:create</code>, and save the credentials to a local file but <i>**do not push those to GitHub**</i>!-->
使用命令 <code>heroku authorizations:create</code> 为你的 Heroku 配置生成一个 API 令牌，并将凭据保存到本地文件中，但<i>**不要推送到 GitHub 上**</i>！

<!-- You''ll need the token soon for your deployment workflow. See more information at about Heroku tokens [here](https://devcenter.heroku.com/articles/platform-api-quickstart).-->
你很快就需要一个令牌来完成部署工作流程。更多关于Heroku令牌的信息请参见[这里](https://devcenter.heroku.com/articles/platform-api-quickstart)。

#### 11.10 Deploying your application to Heroku

<!-- Extend the workflow with a step to deploy your application to Heroku.-->
增加一个步骤，将你的应用程序部署到Heroku。

<!-- The below assumes that you use the ready-made Heroku deploy action [AkhileshNS/heroku-deploy](https://github.com/AkhileshNS/heroku-deploy) that has been developed by the community.-->
以下假设您使用社区开发的准备好的Heroku部署操作[AkhileshNS/heroku-deploy](https://github.com/AkhileshNS/heroku-deploy)。

<!-- You need the authorization token that you just created for the deployment. The proper way to pass it's value to GitHub Actions is to use repository secrets:-->
你需要刚刚创建的授权令牌来部署。正确的传递它的值给GitHub Actions的方式是使用存储库秘密：

![repo secret](../../images/11/10x.png)

<!-- Now the workflow can access the token value as follows:-->
现在工作流可以按照以下方式访问令牌值：

```
${{secrets.HEROKU_API_KEY}}
```

<!-- If all goes well, your workflow log should look a bit like this:-->
如果一切顺利，你的工作流日志应该看起来有点像这样：

![](../../images/11/11.png)

<!-- You can then try the app with a browser, but most likely you run into a problem. If we read carefully [the section 'Application to the Internet' in part 3](/en/part3/deploying_app_to_internet#application-to-the-internet) we notice that Heroku assumes that the repository has a file called <i>Procfile</i> that tells Heroku how to start the application.-->
你可以用浏览器试用该应用，但很可能会遇到问题。如果我们仔细阅读[第3章节的“应用程序上网”一节](/en/part3/deploying_app_to_internet#application-to-the-internet)，我们会注意到Heroku假定存储库中有一个叫做<i>Procfile</i>的文件，它告诉Heroku如何启动应用程序。

<!-- So, add a proper Procfile and ensure that the application starts properly.-->
所以，添加一个合适的`Procfile`，确保应用程序启动正常。

<!-- **Remember** that it is always essential to keep an eye on what is happening in server logs when playing around with product deployments, so use <code>heroku logs</code> early and use it often. No, use it all the time!-->
**记住**，在玩弄产品部署时，总是必须密切留意伺服器日志中发生的事情，因此要早早使用<code>heroku logs</code>，而且要经常使用它。不，要一直使用它！

#### 11.11 Health check

<!-- Before moving on let us expand the workflow with one more step, a check that ensures that the application is up and running after the deployment.-->
在继续前，让我们增加一个步骤来扩展工作流程，即进行一个检查，以确保部署后应用程序正常运行。

<!-- Actually a separate workflow step is not needed, since the action-->
is already part of the existing workflow

实际上，不需要单独的工作流步骤，因为该操作已经是现有工作流的一部分。
<!-- [deploy-to-heroku](https://github.com/marketplace/actions/deploy-to-heroku) contains an option that takes care of it.-->
# 部署到Heroku 
[部署到Heroku](https://github.com/marketplace/actions/deploy-to-heroku) 包含一个选项可以处理它。

<!-- Add a simple endpoint for doing an application health check to the backend. You may e.g. copy this code:-->
添加一个简单的端点来检查应用程序的健康状况到后端。例如，可以复制这段代码：

```js
app.get('/health', (req, res) => {
  res.send('ok')
})
```

<!-- It might also be a good idea to have a dummy endpoint in the app that makes it possible to do some code changes and to ensure that the deployed version has really changed:-->
也许在应用中添加一个虚拟端点是个好主意，这样可以做一些代码更改，并确保部署的版本确实发生了变化：

```js
app.get('/version', (req, res) => {
  res.send('1') // change this string to ensure a new version deployed
})
```

<!-- Look now from the [documentation](https://github.com/marketplace/actions/deploy-to-heroku) how to include the health check in the deployment step. Use the created endpoint for the health check url. You most likely need also the <i>checkstring</i> option to get the check working.-->
现在从[文档](https://github.com/marketplace/actions/deploy-to-heroku)中查看如何在部署步骤中包含健康检查。使用创建的端点作为健康检查URL。您可能还需要<i>checkstring</i>选项才能使检查工作。

<!-- Ensure that Actions notices if a deployment breaks your application. You may simulate this e.g. by writing a wrong startup command to Procfile:-->
确保Actions能够及时注意到部署破坏了你的应用程序。例如，你可以通过给Procfile写入错误的启动命令来模拟这种情况：

![](../../images/11/12x.png)

<!-- Before moving to next exercise, fix your deployment and ensure that the application works again as intended.-->
在进入下一个练习之前，修复你的部署，确保应用程序再次按预期正常工作。

#### 11.12. Rollback

<!-- If the deployment results in a broken application, the best thing to do is to <i>roll back</i> to the previous release. Luckily Heroku makes this pretty easy. Every deployment to Heroku results in a [release](https://blog.heroku.com/releases-and-rollbacks#releases). You can see your application's releases with the command <code>heroku releases</code>:-->
如果部署导致应用程序出现故障，最好的办法是<i>回滚</i>到以前的发布版本。幸运的是，Heroku使这一切变得相当容易。每次部署到Heroku都会产生一个[发布](https://blog.heroku.com/releases-and-rollbacks#releases)。您可以使用命令<code>heroku releases</code>查看应用程序的发布版本：

```js
$ heroku releases
=== calm-wildwood-40210 Releases - Current: v8
v8  Deploy de15fc2b  mluukkai@iki.fi  2022/03/02 19:14:22 +0200 (~ 8m ago)
v7  Deploy 8748a04e  mluukkai@iki.fi  2022/03/02 19:06:28 +0200 (~ 16m ago)
v6  Deploy a617a93d  mluukkai@iki.fi  2022/03/02 19:00:02 +0200 (~ 23m ago)
v5  Deploy 70f9b219  mluukkai@iki.fi  2022/03/02 18:48:47 +0200 (~ 34m ago)
v4  Deploy 0b2db00d  mluukkai@iki.fi  2022/03/02 17:53:24 +0200 (~ 1h ago)
v3  Deploy f1cd250b  mluukkai@iki.fi  2022/03/02 17:44:32 +0200 (~ 1h ago)
v2  Enable Logplex   mluukkai@iki.fi  2022/03/02 17:00:26 +0200 (~ 2h ago)
v1  Initial release  mluukkai@iki.fi  2022/03/02 17:00:25 +0200 (~ 2h ago)
```

<!-- One can quickly do a [rollback](https://blog.heroku.com/releases-and-rollbacks#rollbacks) to a release with just a single command from commandline.-->
一句命令就可以快速从命令行[回滚](https://blog.heroku.com/releases-and-rollbacks#rollbacks)到一个发布版本。

<!-- What is even better, is that the action [deploy-to-heroku](https://github.com/marketplace/actions/deploy-to-heroku) can take care of the rollback for us!-->
更棒的是，[deploy-to-heroku](https://github.com/marketplace/actions/deploy-to-heroku) 这个动作可以为我们负责回滚！

<!-- So read again the [documentation](https://github.com/marketplace/actions/deploy-to-heroku) and modify the workflow to prevent a broken deployment altogether. You can again simulate a broken deployment with breaking the Procfile:-->
那么再次阅读[文档](https://github.com/marketplace/actions/deploy-to-heroku)，并修改工作流程以防止完全破坏部署。您可以再次通过破坏Procfile来模拟破坏部署：

![](../../images/11/13x.png)

<!-- Ensure that the application stays still operational despite a broken deployment.-->
确保应用程序在部署失败的情况下仍能继续运行。

<!-- Note that despite the automatic rollback operation, the build fails and when this happens in real life it is <i> essential</i> to find what caused the problem and fix it quickly. As usual, the best place to start finding out the cause of the problem is to study Heroku logs:-->
注意，尽管自动回滚操作已执行，但构建仍然失败，当这种情况发生在现实生活中时，<i>至关重要</i>的是要找出导致该问题的原因并迅速解决。 通常，找出问题原因的最佳起点是研究Heroku日志：

![](../../images/11/14.png)

</div>
