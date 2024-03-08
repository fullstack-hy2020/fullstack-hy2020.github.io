---
mainImage: ../../../images/part-7.svg
part: 7
letter: f
lang: zh
---

<div class="content">

<!-- In addition to the eight exercises in the [React router](/en/part7/react_router) and [custom hooks](en/part7/custom_hooks) sections of this seventh part of the course material, there are 13 exercises that continue our work on the Bloglist application that we worked on in parts four and five of the course material. Some of the following exercises are "features" that are independent of one another, meaning that there is no need to finish the exercises in any particular order. You are free to skip over a part of the exercises if you wish to do so.-->
 除了本教材第七章节的[React路由器](/en/part7/react_router)和[自定义钩子](en/part7/custom_hooks)部分的八个练习外，还有13个练习，继续我们在第四和第五章节教材中进行的Bloglist应用的工作。下面的一些练习是相互独立的 "功能"，意味着不需要按照任何特定的顺序完成练习。如果你想跳过一部分练习，你可以自由选择。

<!-- If you do not want to use your own Bloglist application, you are free to use the code from the model solution as a starting point for these exercises.-->
 如果你不想使用你自己的Bloglist应用，你可以自由地使用模型解决方案的代码作为这些练习的起点。

<!-- Many of the exercises in this part of the course material will require the refactoring of existing code. This is a common reality of extending existing applications, meaning that refactoring is an important and necessary skill even if it may feel difficult and unpleasant at times.-->
 这部分教材中的许多练习都需要对现有代码进行重构。这是扩展现有应用的一个常见的现实，这意味着重构是一个重要和必要的技能，即使它有时会感到困难和不愉快。

<!-- One good piece of advice for both refactoring and writing new code is to take <i>baby steps</i>. Losing your sanity is almost guaranteed if you leave the application in a completely broken state for long periods of time while refactoring.-->
对于重构和编写新代码，一个很好的建议是采取<i>小步快跑</i>。如果你在重构时让应用长时间处于完全崩溃的状态，几乎可以保证失去理智。

</div>

<div class="tasks">

### Exercises 7.9.-7.21.

#### 7.9: automatic code formatting

<!-- In the previous parts we used ESLint to ensure that code to follows the defined conventions.  [Prettier](https://prettier.io/) is yet another approach for the same. According to the documentation Prettier is <i>an opinionated code formatter</i>, that is, Prettier does not only control the code style but it also formats the code according to the definition.-->
 在前面的部分中，我们使用ESLint来确保代码遵循定义的惯例。  [Prettier](https://prettier.io/)是另一种相同的方法。根据文档，Prettier是<i>一个有意见的代码格式化器</i>，也就是说，Prettier不仅控制代码风格，而且还根据定义格式化代码。

<!-- Prettier is easy to integrate to the code editor, so that when the code is saved, it is automatically formatted correctly.-->
 Prettier很容易集成到代码编辑器中，所以当代码被保存时，它将自动被正确地格式化。

<!-- Take Prettier to use in your app and configure it to work with your editor.-->
拿着Prettier在你的应用中使用，并配置它与你的编辑器一起工作。

#### 7.10: redux, step1

<!-- Refactor the application from using internal React component state to using Redux for the application's state management.-->
 重构应用，从使用内部React组件的状态到使用Redux进行应用的状态管理。

<!-- Change the application's notifications to use Redux at this point of the exercise set.-->
在练习集的这一点上将应用的通知改为使用Redux。

#### 7.11: redux, step2

<i>Note</i> that this and the next two exercises are quite laborious but incredibly educational.

<!-- Store the information about blog posts in the Redux store. In this exercise, it is enough that you can see the blogs in the backend and create a new blog.-->
将博客文章的信息存储在Redux商店中。在这个练习中，只要你能在后端看到博客并创建一个新的博客就足够了。

<!-- You are free to manage the state for logging in and creating new blog posts by using the internal state of React components.-->
你可以通过使用React组件的内部状态来自由管理登录和创建新博客文章的状态。

#### 7.12: redux, step3

<!-- Expand your solution so that it is again possible to like and delete a blog.-->
扩展你的解决方案，这样又可以喜欢和删除一个博客。

#### 7.13: redux, step4

<!-- Store the information about the signed-in user in the Redux store.-->
在Redux商店中存储登录用户的信息。

#### 7.14: Users view

<!-- Implement a view to the application that displays all of the basic information related to users:-->
为应用实现一个视图，显示所有与用户相关的基本信息。

![](../../images/7/41.png)

#### 7.15: Individual user view

<!-- Implement a view for individual users that displays all of the blog posts added by that user:-->
 为单个用户实现一个视图，显示该用户添加的所有博客文章。

![](../../images/7/44.png)

<!-- You can access the view by clicking the name of the user in the view that lists all users:-->
 你可以通过点击列出所有用户的视图中的用户名称来访问该视图。

![](../../images/7/43.png)

<i>**NB:**</i> you will almost certainly stumble across the following error message during this exercise:

![](../../images/7/42ea.png)

<!-- The error message will occur if you refresh the page for an individual user.-->
 如果你刷新单个用户的页面，会出现错误信息。

<!-- The cause of the issue is that, when we navigate directly to the page of an individual user, the React application has not yet received the data from the backend. One solution for fixing the problem is to use conditional rendering:-->
 这个问题的原因是，当我们直接导航到单个用户的页面时，React应用还没有从后端收到数据。解决这个问题的一个办法是使用条件渲染。

```js
const User = () => {
  const user = ...
  // highlight-start
  if (!user) {
    return null
  }
  // highlight-end

  return (
    <div>
      // ...
    </div>
  )
}
```

#### 7.16: Blog view

<!-- Implement a separate view for blog posts. You can model the layout of your view after the following example:-->
 为博客文章实现一个单独的视图。你可以按照下面的例子来模拟你的视图的布局。

![](../../images/7/45.png)

<!-- Users should be able to access the view by clicking the name of the blog post in the view that lists all of the blog posts.-->
 用户应该能够通过点击列出所有博文的视图中的博文名称来访问该视图。

![](../../images/7/46.png)

<!-- After you're done with this exercise, the functionality that was implemented in exercise 5.7 is no longer necessary. Clicking a blog post no longer needs to expand the item in the list and display the details of the blog post.-->
 在你完成这个练习后，练习5.7中实现的功能就不再需要了。点击一个博客文章不再需要在列表中展开该项目并显示该博客文章的细节。

#### 7.17: Navigation

<!-- Implement a navigation menu for the application:-->
 为应用实现一个导航菜单。

![](../../images/7/47.png)

#### 7.18: comments, step1

<!-- Implement the functionality for commenting on blog posts:-->
 实现对博客文章发表评论的功能。

![](../../images/7/48.png)

<!-- Comments should be anonymous, meaning that they are not associated to the user who left the comment.-->
 评论应该是匿名的，也就是说，它们与留下评论的用户没有关联。

<!-- In this exercise, it is enough for the frontend to only display the comments that the application receives from the backend.-->
在这个练习中，前端只显示应用从后端收到的评论就足够了。

<!-- An appropriate mechanism for adding comments to a blog post would be an HTTP POST request to the <i>api/blogs/:id/comments</i> endpoint.-->
 为博客文章添加评论的适当机制是向<i>api/blogs/:id/comments</i>端点发出HTTP POST请求。

#### 7.19: comments, step2

<!-- Extend your application so that users can add comments to blog posts from the frontend:-->
 扩展你的应用，使用户可以从前端向博客文章添加评论。

![](../../images/7/49.png)

#### 7.20: Styles, step1

<!-- Improve the appearance of your application by applying one of the methods shown in the course material.-->
通过应用教材中显示的方法之一来改善你的应用的外观。

#### 7.21: Styles, step2

<!-- You can mark this exercise as finished if you use an hour or more for styling your application.-->
 如果你用一个小时或更多的时间来设计你的应用的风格，你可以把这个练习标记为完成。

<!-- This was the last exercise for this part of the course and it's time to push your code to GitHub and mark all of your finished exercises to the [exercise submission system](https://studies.cs.helsinki.fi/stats/courses/fullstackopen).-->
 这是这部分课程的最后一个练习，是时候把你的代码推送到GitHub，并把你所有完成的练习标记到[练习提交系统](https://studies.cs.helsinki.fi/stats/courses/fullstackopen)。

</div>
