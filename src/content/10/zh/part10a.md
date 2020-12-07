---
mainImage: ../../../images/part-1.svg
part: 10
letter: a
lang: zh
---

<div class="content">
<!-- 
Traditionally, developing native iOS and Android applications has required the developer to use platform-specific programming languages and development environments. For iOS development, this means using Objective C or Swift and for Android development using JVM based languages such as Java, Scala or Kotlin. Releasing an application for both these platforms technically requires to develop two separate applications with different programming languages. This requires lots of development resources. -->

传统开发中，如果开发原生的iOS 以及 Android 应用，需要开发者使用平台特定的编程语言与编程环境。对于iOS开发来说，就是Objective C或者Swift，而对于Android 开发者来说，就是基于JVM的语言，例如Java 、Scala 或者 Kotlin。发布一个这两个平台通用的应用，需要利用不同的开发语言开发两个独立的应用。这就需要许多的开发资源。

<!-- One of the popular approaches to unify the platform-specific development has been to utilize the browser as the rendering engine. [Cordova](https://cordova.apache.org/) is one of the most popular platforms for building cross-platform applications. It allows developing multi-platform applications using standard web technologies - HTML5, CSS3, and JavaScript. However, Cordova applications are running within a embedded browser window in the user's device. That is why these applications can not achieve neither the performance of the look-and-feel of native applications that utilize actual native user interface components. -->

一种普遍的方式是统一一下平台特定的开发，利用浏览器作为渲染引擎。 [Cordova](https://cordova.apache.org/) 就是最构建这种跨平台应用场景下受欢迎的平台之一。它允许使用标准的Web 技术栈——HTML5、CSS3和JavaScript 来开发跨平台应用。但是， Cordova 应用实际上是运行在用户终端的一个内嵌的浏览器窗口中的。这也就是为什么这种应用不能有原生的用户界面组件那样的性能与使用感受。

<!-- [React Native](https://reactnative.dev/) is a framework for developing native Android and iOS applications using JavaScript and React. It provides a set of cross-platform components that behind the scenes utilize the platform's native components. Using React Native allows us to bring all the familiar features of React such as JSX, components, props, state, and hooks into native application development. On top of that we are able to utilize many familiar libraries in React ecosystem such as [react-redux](https://react-redux.js.org/), [react-apollo](https://github.com/apollographql/react-apollo), [react-router](https://reacttraining.com/react-router/core/guides/quick-start) and many more. -->

[React Native](https://reactnative.dev/) 是一种利用JavaScript 和React 开发原生Android 和iOS应用的框架。它提供了一系列跨平台的组件，从而解耦了特定平台的原生组件。使用React Native 能够让我们使用React 熟悉的特性，比如JSX、组件、props、状态以及hooks，把它们运用到原生应用的开发中。在这之上，我们能够利用许多React 生态中原生的类库，比如[react-redux](https://react-redux.js.org/), [react-apollo](https://github.com/apollographql/react-apollo), [react-router](https://reacttraining.com/react-router/core/guides/quick-start) 等等。

<!-- The speed of development and gentle learning curve for developers familiar with React is one of the most important benefits of React Native. Here's a motivational quote from Coinbase's article [Onboarding thousands of users with React Native](https://blog.coinbase.com/onboarding-thousands-of-users-with-react-native-361219066df4) on the benefits of React Native: -->

开发的效率以及面向熟悉React开发人员的平滑的学习曲线是React Native 带来的最重要的收益。有一句来自Coinbase 文章[Onboarding thousands of users with React Native](https://blog.coinbase.com/onboarding-thousands-of-users-with-react-native-361219066df4) 的引用，它是这么描述React Native 的收益的：

<!-- > If we were to reduce the benefits of React Native to a single word, it would be “velocity”. On average, our team was able to onboard engineers in less time, share more code (which we expect will lead to future productivity boosts), and ultimately deliver features faster than if we had taken a purely native approach. -->

> 如果我们要将React Native 带来的收益凝结成一个词语，那就是“速度”。平均来说，我们的团队能够在短时间内招募到工程师，分享更多的代码（这样我们就能有更高的产出效率），这比使用一个纯原生方法来说，能够带来更快的最终交付。

### About this part
关于本章

<!-- During this part, we will learn how to build an actual React Native application from bottom up. We will learn concepts such what are React Native's core components, how to create beautiful user interfaces, how to communicate with a server and how to test a React Native application. -->
在这一章中，我们会从0到1学习如何创建一个真实的React Native 应用。我们会学习更多的概念，例如什么是React Native的核心组件；我们如何创建漂亮的用户界面；我们如何与服务端通信以及如何测试一个React Native 应用。

<!-- We will be developing an application for rating [GitHub](https://github.com/) repositories. Our application will have features such as, sorting and filtering reviewed repositories, registering a user, logging in and creating a review for a repository. The back end for the application will be provided for us so that we can solely focus on the React Native development. The final version of our application will look something like this: -->

我们会创建一个为[GitHub](https://github.com/) 仓库投票的应用。我们的应用会有以下基本功能，例如排序、过滤已经评论的仓库，注册用户，登录以及为仓库创建一条评论。应用的后台会提前提供给我们，这样我们可以专注于React Native 的开发。我们应用的最终版本会像如下这样。

![Application preview](../../images/10/4.png)

<!-- All the exercises in this part have to be submitted into <i>a single GitHub repository</i> which will eventually contain the entire source code of your application. There will be model solutions available for each section of this part which you can use to fill in incomplete submissions. This part is structured based on the idea that you develop your application as you progress in the material. So <i>do not</i> wait until the exercises to start the development. Instead, develop your application in the same pace as the material progresses. -->

这一章的所有练习需要提交到一个<i>单独的Github 仓库</i>中，最终会包含整个应用的所有代码。每一小节会有模型的解决方法，这样你就可以完成未完成的任务了。这一章的设计考虑到了随着教材的推进你开发应用的想法的延伸，所以<i>不要</i>等到练习开始时才着手去开发。而是应该跟随着课程的进展边学习边开发。

<!-- This part will heavily rely on concepts covered in the previous parts. Before starting this part you will need basic knowledge of JavaScript, React and GraphQL. Deep knowledge of server-side development is not required and all the server-side code is provided for you. However, we will be making network requests from your React Native applications, for example, using GraphQL queries. The recommended parts to complete before this part are [part 1](/en/part1), [part 2](/en/part2), [part 5](/en/part5), [part 7](/en/part7) and [part 8](/en/part8). -->

这一章的内容会严重依赖之前几章的概念。因此开始本章节时，你需要JavaScript 、 React 以及GraphQL的基本知识。没必要对服务端深入了解，因为所有的服务端代码是提前提供给你的。但是，我们要通过React Native 应用来构建网络请求，比如说，使用GraphQL 查询。这就建议你在完成本章节之前，完成掉[第一章](/zh/part1)，[第二章](/zh/part2)，[第五章](/zh/part5)，[第七章](/zh/part7)，[第八章](/zh/part8)

### Submitting exercises and earning credits
提交练习并获得学分

<!-- Exercises are submitted via the [submissions system](https://studies.cs.helsinki.fi/stats/courses/fs-react-native-2020) just like in the previous parts. Note that, exercises in this part are submitted <i>to a different course instance</i> than in parts 0-9. The parts 1-4 in the submission system refer to the sections a-d in this part. This means that you will be submitting exercises a single section at a time starting with this section, "Introduction to React Native", which is part 1 in the submission system. -->
练习可以像之前章节那样通过[提交系统](https://studies.cs.helsinki.fi/stats/courses/fs-react-native-2020)提交。注意，本章的练习是提交到与0-9章<i>不同的课程单元</i>。提交系统中的1-4部分是指的本章的a-d部分。也就是说你一次提交一个部分，“React Native 介绍”， 是提交系统中的part 1。

<!-- During this part you will earn credits based on the number of exercises you complete. Completing <i>at least 19 exercises</i> in this part will earn you <i>1 credit</i>. Completing <i>at least 26 exercises</i> in this part will earn you <i>2 credits</i>. -->

通过这个章节的学习，会根据你完成的练习数量获得学分。完成本章的<i>19个练习</i>会获得<i>1学分</i>。完成<i>所有的练习</i>会获得<i>2学分</i>。

<!-- Once you have completed the exercises and want to get the credits, let us know through the exercise submission system that you have completed the course: -->

一旦你完成了对应的练习并希望获得学分，通过练习提交系统让我们知道你已经完成了课程：

<!-- Note that the "exam done in Moodle" note refers to the [Full Stack Open course's exam](https://fullstackopen.com/en/part0/general_info#sign-up-for-the-exam), which <i>has to be completed</i> before you can earn credits from this part. -->

注意“在Moodle中完成考试“ 可以参考  [Full Stack Open course's exam](https://fullstackopen.com/en/part0/general_info#sign-up-for-the-exam) ，在你从本章节获得学分前<i>必须完成</i>

通过这个章节的学习，会根据你完成的练习数量获得学分。完成本章的<i>19个练习</i>会获得<i>1学分</i>。完成<i>所有的练习</i>会获得<i>2学分</i>。

<!-- You can download the certificate for completing this part by clicking one of the flag icons. The flag icon corresponds to the certificate's language. Note that you must have completed at least one credit worth of exercises before you can download the certificate. -->

通过完成本章的内容，点击本章的旗按钮，你就可以下载认证证书了。旗标代表了特定的语言。注意你必须至少完成价值1学分的练习才能够下载证书。

### Initializing the application
应用的初始化

<!-- To get started with our application we need to set up our development environment. We have learned from previous parts that there are useful tools for setting up React applications quickly such as Create React App. Luckily React Native has these kinds of tools as well. -->
在应用启动前我们需要搭建我们的开发环境。我们已经根据之前的章节已经了解到，有许多有用的工具来迅速创建React 应用，例如Create React App。幸运的是React Native 也拥有这类工具。

<!-- For the development of our application, we will be using [Expo](https://docs.expo.io/versions/latest/). Expo is a platform that eases the setup, development, building, and deployment of React Native applications. Let's get started with Expo by installing the <i>expo-cli</i> command-line interface: -->
在我们的应用开发中，使用到的是 [Expo](https://docs.expo.io/versions/latest/)。Expo 是一个简化了React Native 应用的安装、开发、构建以及部署的平台。我们通过安装<i>expo-cli</i>命令行工具来开始吧：

```shell
npm install --global expo-cli
```

<!-- Next, we can initialize our project in a <i>rate-repository-app</i> directory by running the following command: -->
下一步，我们在 <i>rate-repository-app</i> 文件夹中运行如下命令，来初始化我们的项目：

```shell
expo init rate-repository-app --template expo-template-blank@sdk-38
```

<!-- After running this command Expo will ask you to choose a template for the project. Within the <i>Managed workflow</i> section, choose the <i>blank</i> option (the one with the description "a minimal app as clean as an empty canvas"). -->
<!-- 在运行了这个命令后，Expo 会询问你为该项目选择一个模版。在<i>Managed workflow</i>部分，选择<i>blank</i> 选项（描述为“一个最小的app，就是个空画布”a minimal app as clean as an empty canvas） -->

<!-- Note, that the <em>@sdk-38</em> sets the project's <i>Expo SDK version to 38</i>, which supports <i>React Native version 0.62</i>. Using other Expo SDK version might cause you trouble while following this material. Also, Expo has few limitations when compared to plain React Native CLI, more on them [here](https://docs.expo.io/introduction/why-not-expo/). However, these limitations have no effect on the application implemented in the material.-->

注意， <em>@sdk-38</em> 将项目的Expo SDK 的 版本设置为38，它支持 <i>React Native version 0.62</i>。 使用其他的Expo SDK版本在接下来的教程中可能会导致一些错误。此外，与纯净的React Native 命令行相比，Expo有一些限制，可以参考 [这里](https://docs.expo.io/introduction/why-not-expo/)。但是这些限制对教材中应用的实现来说并没有影响。

<!-- Now that our application has been initialized, open the created <i>rate-repository-app</i> directory with an editor such as [Visual Studio Code](https://code.visualstudio.com/). The structure should be more or less the following: -->

现在我们的应用已经初始化了，用编辑器（比如[Visual Studio Code](https://code.visualstudio.com/)）打开创建好的<i>rate-repository-app</i>文件夹，应用结构大致如下：

![Project structure](../../images/10/1.png)

<!-- We might spot some familiar files and directories such as <i>package.json</i> and <i>node_modules</i>. On top of those, the most relevant files are <i>app.json</i> file which contains Expo related configuration and <i>App.js</i> which is the root component of our application. <i>Do not</i> rename or move the <i>App.js</i> file because by default Expo imports it to [register the root component](https://docs.expo.io/versions/latest/sdk/register-root-component/). -->

我们会看到一些熟悉的文件或文件夹，比如<i>package.json</i> 和 <i>node_modules</i>。除了这些，我们最关心的文件是<i>app.json</i>，它包含了Expo 相关的配置以及<i>App.js</i>，它是我们应用的根组件。<i>不要</i>重命名或者移动<i>App.js</i>文件，因为默认情况下，Expo 会导入到[注册根组件](https://docs.expo.io/versions/latest/sdk/register-root-component/)中。
<!-- Let's have look at <i>scripts</i> section of the <i>package.json</i> file which has the following scripts: -->
让我们看一下<i>package.json</i>文件中的 <i>scripts</i> 部分：

```javascript
{
  // ...
  "scripts": {
    "start": "expo start",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "web": "expo start --web",
    "eject": "expo eject"
  },
  // ...
}
```

<!-- Running the script <em>npm start</em> starts the [Metro bundler](https://facebook.github.io/metro/) which is a JavaScript bundler for React Native. It can be described as the [Webpack](https://webpack.js.org/) of the React Native ecosystem. In addition to the Metro bundler, <i>Expo development tools</i> should be open in a browser window at [http://localhost:19002](http://localhost:19002). Expo development tools are a useful set of tools for viewing the application logs and starting the application in an emulator or in Expo's mobile application. We will get to emulators and Expo's mobile application soon, but first, let's start our application in a web browser by clicking the <i>Run in web browser</i> link: -->

运行<em>npm start</em>命令启动了[Metro bundler](https://facebook.github.io/metro/)，它是React Native 的一个JavaScript bundler。它可以认为是React Native 生态的[Webpack](https://webpack.js.org/)。除了Metro bundler， <i>Export 开发工具</i>会在浏览器中新打开一个窗口 [http://localhost:19002](http://localhost:19002)。Expo 开发工具是一组有用的工具集，能够观察应用日志并在模拟器或Expo的移动应用中启动应用。我们很快就讲到模拟器和Expo的移动应用了，让我们点击浏览器中的<i>Run in web browser</i> 链接来启动我们的应用吧。

![Expo DevTools](../../images/10/2.png)

<!-- After clicking the link we should soon see the text defined in the <i>App.js</i> file in a browser window. Open the <i>App.js</i> file with an editor and make a small change to the text in the <em>Text</em> component. After saving the file you should be able to see that the changes you have made into the code are visible in the browser window. -->
在点击了这个链接后我们会很快在浏览器窗口中看到<i>App.js</i>文件中定义的文本。用编辑器打开<i>App.js</i>文件，并在 <em>Text</em> 组件中修改一下文本内容。在保存了文件后你会很快就会在浏览器窗口中看到之前的改变。

### Setting up the development environment
构建开发环境

<!-- We have had the first glance of our application using the Expo's browser view. Although the browser view is quite usable, it is still a quite poor simulation of the native environment. Let's have a look at the alternatives we have regarding the development environment. -->
我们已经在Expo的浏览器试图中一窥我们应用的芳容。虽然浏览器视图很有用，但仍是一个十分简陋的原生环境的模拟。既然说到了开发环境，让我们看一下其替代品。

<!-- Android and iOS devices such as tablets and phones can be emulated in computers using specific <i>emulators</i>. This is very useful for developing native applications. macOS users can use both Android and iOS emulators with their computers. Users of other operating systems such as Linux or Windows have to settle for Android emulators. Next, depending on your operating system follow one of these instructions on setting up an emulator: -->

Android 和iOS 设备，比如平板或者手机，可以通过电脑中特定的模拟器来模拟。这是一个对原生应用开发来说十分有用的工具。MacOS用户可以用电脑同时使用Android 和iOS模拟器。其他操作系统的用户比如Linux 或Windows需要适配Android 模拟器。下一步，取决于你的操作系统，跟随下面的操作指引来搭建模拟器。
- [利用 Android Studio 构建Android 模拟器 ](https://docs.expo.io/versions/v37.0.0/workflow/android-studio-emulator/) (任何操作系统)

- [利用 Xcode 构建iOS 模拟器](https://docs.expo.io/versions/v37.0.0/workflow/ios-simulator/) (macOS 操作系统)
<!-- 
- [Set up Android emulator with Android Studio](https://docs.expo.io/versions/v37.0.0/workflow/android-studio-emulator/) (any operating system)

- [Set up iOS simulator with Xcode](https://docs.expo.io/versions/v37.0.0/workflow/ios-simulator/) (macOS operating system) -->

<!-- After you have set up the emulator and it is running, start the Expo development tools as we did before, by running <em>npm start</em>. Depending on the emulator you are running either click the <i>Run on Android device/emulator</i> or <i>Run on iOS simulator</i> link. After clicking the link, Expo should connect to the emulator and you should eventually see the application in your emulator. Be patient, this might take a while. -->

在构建完模拟器，并且运转良好后，通过运行<em>npm start</em> 命令，像之前那样开启Expo 开发工具。取决于你所使用的模拟器，单击<i>Run on Android device/emulator</i> 或者 <i>Run on iOS simulator</i>。在单击了链接后，Expo 应该链接到模拟器了，你会最终看到应用运行到了模拟器中。耐心，这通常会花点时间。

<!-- In addition to emulators, there is one extremely useful way to develop React Native applications with Expo, the Expo mobile app. With Expo mobile app you can preview your application using your actual mobile device, which provides a bit more concrete development experience compared to emulators. To get started, install the Expo mobile app by following the instructions in the [Expo's documentation](https://docs.expo.io/versions/latest/get-started/installation/#2-mobile-app-expo-client-for-ios). Note that the Expo mobile app can only open your application if your mobile device is connected to <i>the same local network</i> (e.g. connected to the same Wi-Fi network) as the computer you are using for development.-->

除了模拟器，还有一个十分有用的方式来用Expo开发React Native 应用，就是Expo 移动app。利用Expo 移动app 你可以用真实的移动设备预览你的应用，与模拟器相比，能够提供更加真实的开发体验。首先，通过以下步骤安装Expo 移动app： [Expo's documentation](https://docs.expo.io/versions/latest/get-started/installation/#2-mobile-app-expo-client-for-ios)。注意 只有当你的手机设备和你的开发电脑连接到 <i>相同的网络</i>（比如说连接到同一个Wi-Fi网络）， Expo 移动 app 才能打开你的应用。

<!-- When the Expo mobile app is finished installing, open it up. Next, if the Expo development tools is not already running, start it by running <em>npm start</em>. In the bottom left corner of the development tools, you should be able to see a QR code. Within the Expo mobile app, press <i>Scan QR Code</i> and scan the QR code displayed in the development tools. The Expo mobile app should start building the JavaScript bundle and after it is finished you should be able to see your application. Now, every time you want to reopen your application in the Expo mobile app, you should be able to access the application without scanning the QR code by pressing it in the <i>Recently opened</i> list in the <i>Projects</i> view. -->

当Expo 移动应用完成了安装，打开它。下一步，如果Expo 开发工具并没有启动，通过<em>npm start</em> 启动应用。在开发工具的左下角。你应该能看到一个二维码，在Expo 移动App 中，点击扫描二维码，并扫描开发工具中的二维码，Expo 移动应用会开始构建JavaScript 包，打包完成后你应该能够看到你的应用了。现在只要你想要在Expo 移动应用中重新打开你的应用，你应当能够无需二维码，通过点击项目视图中的最近访问来访问应用。

</div>

<div class="tasks">

### Exercise 10.1
练习10.1

#### Exercise 10.1: initializing the application
练习10.1 初始化应用

<!-- Initialize your application with Expo command-line interface and set up the development environment either using an emulator or Expo's mobile app. It is recommended to try both and find out which development environment is the most suitable for you. The name of the application is not that relevant, you can, for example, go with <i>rate-repository-app</i>. -->

用Expo命令行初始化你的应用，并构建开发环境，使用模拟器或者Expo的移动应用都可以。建议两种方法都试一下，来看看哪种开发方法最适合你。应用的名称并不重要，你可以起，比如说，<i>rate-repository-app</i>

<!-- To submit this exercise and all the future exercises you need to [create a new GitHub repository](https://github.com/new). The name of the repository can be for example the name of the application you initialized with <em>expo init</em>. Now that the repository is created, run <em>git init</em> within your application's root directory to make sure that the directory is initialized as a Git repository. Next, to add the created repository as the remote run <em>git remote add origin git@github.com:<YOUR_GITHUB_USERNAME>/<NAME_OF_YOUR_REPOSITORY>.git</em> (remember to replace the placeholder values in the command). Finally, just commit and push your changes into the repository and you are all done. -->
为了提交这个练习以及所有将来的练习，你需要[创建一个新的GitHub 仓库](https://github.com/new)。仓库的名称可以与你利用<em>expo init</em>初始化应用起的名称一致。一旦仓库创建好后，在应用根目录运行<em>git init</em>来确保当前目录被初始化成了一个Git 仓库。 然后，将Github上刚创建的仓库作为远程仓库，运行 <em>git remote add origin git@github.com:<YOUR_GITHUB_USERNAME>/<NAME_OF_YOUR_REPOSITORY>.git</em> （记得将这里的占位符替换成你的真实信息）。最后提交并上传你的修改到仓库中，就完成了。

</div>

<div class="content">

### ESLint

<!-- Now that we are somewhat familiar with the development environment let's enhance our development experience even further by configuring a linter. We will be using [ESLint](https://eslint.org/) which is already familiar to us from the previous parts. Let's get started by installing the dependencies: -->
现在我们多少熟悉了开发环境，让我们通过配置代码格式化，来增强一下我们的开发体验。我们会使用[ESLint](https://eslint.org/) 在之前的几个项目中，我们已经对它很熟悉了。让我们用如下方式来安装依赖。

```shell
npm install --save-dev eslint babel-eslint eslint-plugin-react
```

<!-- Next, let's add the ESLint configuration into a <i>.eslintrc</i> file into the <i>rate-repository-app</i> directory with the following content: -->
然后，我们增加一个ESLint 配置，写入<i>rate-repository-app</i> 文件夹的<i>.eslintrc</i> 文件中，内容如下：

```javascript
{
  "plugins": ["react"],
  "settings": {
    "react": {
      "version": "detect"
    }
  },
  "extends": ["eslint:recommended", "plugin:react/recommended"],
  "parser": "babel-eslint",
  "env": {
    "browser": true
  },
  "rules": {
    "react/prop-types": "off",
    "semi": "error"
  }
}
```

<!-- And finally, let's add a <em>lint</em> script to the <i>package.json</i> file to check the linting rules in specific files: -->
最后，让我们在 <i>package.json</i> 文件中增加一个<em>lint</em> 脚本，来在指定的文件中检查lint规则：

```javascript
{
  // ...
  "scripts": {
    "start": "expo start",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "web": "expo start --web",
    "eject": "expo eject",
    "lint": "eslint ./src/**/*.{js,jsx} App.js --no-error-on-unmatched-pattern"
  },
  // ...
}
```

<!-- In contrast to parts 1-8, we are using semicolons to terminate lines now, so we have added the rule [semi](https://eslint.org/docs/rules/semi) to check that. -->
对比1-8 章节，我们现在使用分号来作为行结束符了，我们加入了[semi](https://eslint.org/docs/rules/semi)来检查它。

<!-- Now we can check that the linting rules are obeyed in JavaScript files in the <i>src</i> directory and in the <i>App.js</i> file by running <em>npm run lint</em>. We will be adding our future code to the <i>src</i> directory but because we haven't added any files there yet, we need the <eM>no-error-on-unmatched-pattern</em> flag. Also if possible integrate ESLint with your editor. If you are using Visual Studio Code you can do that by, going to the extensions section and checking that the ESLint extension is installed and enabled: -->
现在我们可以检查src 目录中的JavaScript 文件以及App.js 文件是否遵循了格式化规则，运行<em>npm run lint</em>。我们会将接下来的代码写到src 目录中，但由于我们还并没有增加任何文件，我们需要<em>no-error-on-unmatched-pattern</em> 配置项。也可以将ESLint 集成到你的编辑器中。如果你正在使用Visual Studio Code 你可以到扩展模块中检查是否安装了ESLint 插件，并已经启用。

![Visual Studio Code ESLint extensions](../../images/10/3.png)

<!-- The provided ESLint configuration contains only the basis for the configuration. Feel free to improve the configuration and add new plugins if you feel like it. -->
ESLint 配置仅仅包含了基础配置。如果想要增强配置，或增加新的插件，随你所愿。

</div>

<div class="tasks">

### Exercise 10.2

#### Exercise 10.2: setting up the ESLint
搭建ESLint

<!-- Set up ESLint in your project so that you can perform linter checks by running <em>npm run lint</em>. To get most of linting it is also recommended to integrate ESLint with your editor. -->
在项目中搭建ESLint，你就可以执行<em>npm run lint</em> 来进行格式化检查。为了获得最佳的格式化效果，建议集成ESLint 到编辑器中。

</div>

<div class="content">

### Viewing logs
查看日志

<!-- Expo development tools can be used to display the log messages of the running application. Error and warning level messages are also visible in the emulator and the mobile app interface. Error messages will pop out as a red overlay whereas warning messages can be expanded by pressing the yellow alert dialog at the bottom of the screen. For debugging purposes, we can use the familiar <em>console.log</em> method to write debugging messages to the log. -->

Expo 开发工具可以被用作来展示运行中程序的log信息。错误和警告级别的信息在模拟器中和移动应用界面也能看到。错误信息会作为一个红色的浮层弹出，警告信息可以通过点击屏幕底部黄色的警告对话框来展开。为了Debug，我们可以使用熟悉的 <em>console.log</em> 方法来写debug 信息到日志中。

<!-- Let's try this in practice. Start the Expo development tools by running <em>npm start</em> and open the application with either emulator or the mobile app. When the application is running you should be able to see your connected devices under the "Metro Bundler" in the top left corner of the developments tools: -->

让我们实践一把。运行<em>npm start</em>，启动Expo 开发工具，并打开应用，模拟器或移动应用都可以。当应用运行起来，你应当能在左上角的开发工具栏中的Metro Bundler看到连接的设备信息。

![Expo development tools](../../images/10/9.png)

<!-- Click on the device to open its logs. Next, open the <i>App.js</i> file and add a <em>console.log</em> message to the <em>App</em> component. After saving the file, you should be able to see your message in the logs. -->

点击设备并打开日志，然后打开<i>App.js</i> 文件，增加一个<em>console.log</em> 信息到<em>App</em> 组件中。保存文件，你应该能够在log中看到添加的信息了。

### Using the debugger
使用调试器

<!-- Inspecting messages logged from the code with the <em>console.log</em> method can be handy, but sometimes finding bugs or understanding how the application works require us to see the bigger picture. We might, for example, be interested in what is the state and the props of a certain component, or what is the response of a certain network request. In the previous parts, we have used the browser's developer tools for this kind of debugging. [React Native Debugger](https://docs.expo.io/workflow/debugging/#react-native-debugger) is a tool that offers a similar set of debugging features for React Native applications. -->
使用<em>console.log</em>方法检查一些代码中的信息是十分容易上手的，但有时找bug或理解应用如何运行，需要我们看得更宏观一些。比如说我们可能对某个特定组件的属性和状态感兴趣，或者某一次网络请求的返回。在之前的章节中，我们使用了浏览器的开发者工具来做这种debug。[React Native Debugger](https://docs.expo.io/workflow/debugging/#react-native-debugger) 是一个提供了类似的一系列debug特性的工具集来debug React Native 应用。

<!-- Let's get started by installing React Native Debugger with the help of the [installation instructions](https://github.com/jhen0409/react-native-debugger#installation). Once the installation is complete, start the React Native Debugger, open a new debugger window (shortcuts: <em>Command+T</em> on macOS, <em>Ctrl+T</em> on Linux/Windows) and set the React Native packager port to <em>19001</em>. -->
让我们参考[installation instructions](https://github.com/jhen0409/react-native-debugger#installation) 来安装React Native Debugger。安装一旦完成，启动React Native Debugger，打开一个新的debug 窗口（快捷键参考：macOS是<em>Command+T</em>，Linux/Windows 是 <em>Ctrl+T</em> ），并将React Native 的packager 端口设置为 <em>19001</em>。

<!-- Next, we need to start our application and connect to the debugger. Start the application by running <em>npm start</em>. Once the application is running, open it with either an emulator or the Expo mobile app. Inside the emulator or the Expo mobile app, open the developer menu by following the [instructions](https://docs.expo.io/workflow/debugging/#developer-menu) in the Expo's documentation. From the developer menu, select <i>Debug remote JS</i> to connect to the debugger. Now, you should be able to see the application's component tree in the debugger: -->
接下来，我们需要启动我们的应用，并连接到debugger。通过<em>npm start</em>启动应用。一旦应用启动，在模拟器或Expo 移动app中打开它。在模拟器或Expo 移动app中，根据 [instructions](https://docs.expo.io/workflow/debugging/#developer-menu)  文档的指示打开开发者菜单。在开发者菜单中，选择<i>Debug remote JS</i> 来连接到debugger。现在你可以在debugger中看到应用的组件树了：

![React Native Debugger](../../images/10/24.png)

<!-- You can use the debugger to inspect the component's state and props as well as <i>change</i> them. Try finding the <em>Text</em> component rendered by the <em>App</em> component using the debugger. You can either use the search or go through the component tree. Once you have found the <em>Text</em> component in the tree, click it, and change the value of the <em>children</em> prop. The change should be automatically visible in the application's preview. -->
你可以使用debugger 来检查组件的状态和属性，以及 <i>改变</i>它们也是可以的。尝试使用debugger找到<em>App</em> 组件渲染的<em>Text</em>。你可以使用搜索或者直接从组件树中找到。一旦你在树中找到了<em>Text</em> 组件，点击它，并修改它的 <em>children</em> 属性值。你应当能在应用的预览中看到它的自动变化了。

<!-- For more useful React Native application debugging tools, head out to the Expo's [debugging documentation](https://docs.expo.io/workflow/debugging). -->
更多有用的React Native 应用的debug 工具，可以访问Expo的 [debugging documentation](https://docs.expo.io/workflow/debugging)。

</div>