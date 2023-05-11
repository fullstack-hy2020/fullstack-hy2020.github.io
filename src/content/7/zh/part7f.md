---
mainImage: ../../../images/part-7.svg
part: 7
letter: f
lang: zh
---

<div class="content">

<!-- In addition to the eight exercises in the [React router](/en/part7/react_router) and [custom hooks](en/part7/custom_hooks) sections of this seventh part of the course material, 13 exercises continue our work on the Bloglist application that we worked on in parts four and five of the course material. Some of the following exercises are "features" that are independent of one another, meaning that there is no need to finish the exercises in any particular order. You are free to skip over a part of the exercises if you wish to do so. Quite many of the exercises are applying the advanced state management technique (Redux, React Query and context) covered in part [part 6](/en/part6).-->
此第七章节课程材料中的[React 路由](/en/part7/react_router)和[自定义钩子](en/part7/custom_hooks)部分除了八个练习之外，还有13个练习继续我们对第四和第五章节课程材料中的Bloglist应用程序的工作。其中一些练习是相互独立的“功能”，这意味着没有必要按照特定顺序完成练习。您可以自由跳过某些练习。许多练习都应用了第[六部分](/en/part6)中涵盖的高级状态管理技术（Redux，React Query和context）。

<!-- If you do not want to use your Bloglist application, you are free to use the code from the model solution as a starting point for these exercises.-->
如果你不想使用你的Bloglist应用程序，你可以自由使用模型解决方案中的代码作为这些练习的起点。

<!-- Many of the exercises in this part of the course material will require the refactoring of existing code. This is a common reality of extending existing applications, meaning that refactoring is an important and necessary skill even if it may feel difficult and unpleasant at times.-->
许多本课程材料的练习都需要重构现有的代码。这是扩展现有应用程序的一个常见现实，这意味着重构是一项重要且必要的技能，即使有时候可能感到困难和不愉快。

<!-- One good piece of advice for both refactoring and writing new code is to take <i>baby steps</i>. Losing your sanity is almost guaranteed if you leave the application in a completely broken state for long periods while refactoring.-->
一条好的建议无论是重构还是编写新代码都是<i>一步一步来</i>。如果你在重构的时候把应用程序完全搞坏了，那么你几乎可以确定会失去理智。

</div>

<div class="tasks">

### Exercises 7.9.-7.21.

#### 7.9: automatic code formatting

<!-- In the previous parts, we used ESLint to ensure that code follows the defined conventions.  [Prettier](https://prettier.io/) is yet another approach for the same. According to the documentation, Prettier is <i>an opinionated code formatter</i>, that is, Prettier not only controls the code style but also formats the code according to the definition.-->
在前面的部分中，我们使用ESLint来确保代码遵循定义的约定。[Prettier](https://prettier.io/)是另一种方法。根据文档，Prettier是一种<i>有意见的代码格式化器</i>，也就是说，Prettier不仅控制代码风格，还根据定义格式化代码。

<!-- Prettier is easy to integrate into the code editor so that when the code is saved, it is automatically formatted correctly.-->
Prettier 很容易集成到代码编辑器中，这样当代码保存时，它就会自动格式化正确。

<!-- Take Prettier to use in your app and configure it to work with your editor.-->
使用 Prettier 在您的应用中并配置它与您的编辑器一起工作。

### State management: Redux

<i>There are two alternative versions to choose for exercises 7.10-7.13: you can do the state management of the application either using Redux or React Query and Context</i>. If you want to maximize your learning, you should do both versions!

#### 7.10: Redux, step1

<!-- Refactor the application to use Redux to manage the notification data.-->
重构应用以使用Redux来管理通知数据。

#### 7.11: Redux, step2

<i>Note</i> that this and the next two exercises are quite laborious but incredibly educational.

<!-- Store the information about blog posts in the Redux store. In this exercise, it is enough that you can see the blogs in the backend and create a new blog.-->
将博客文章的信息存储在Redux存储库中。 在本次练习中，只要您能在后端看到博客，并创建新博客就足够了。

<!-- You are free to manage the state for logging in and creating new blog posts by using the internal state of React components.-->
你可以使用 React 组件的内部状态来自由管理登录和创建新博客文章的状态。

#### 7.12: Redux, step3

<!-- Expand your solution so that it is again possible to like and delete a blog.-->
扩展您的解决方案，使再次可以喜欢和删除博客。

#### 7.13: Redux, step4

<!-- Store the information about the signed-in user in the Redux store.-->
将登录用户的信息存储在Redux store中。

### State management: React Query and context

<i>There are two alternative versions to choose for exercises 7.10-7.13: you can do the state management of the application either using Redux or React Query and Context</i>.

#### 7.10: React Query and context step1

<!-- Refactor the app to use the useReducer-hook and context to manage the notification data.-->
重构应用以使用useReducer钩子和上下文来管理通知数据。

#### 7.11: React Query and context step2

<!-- Use React Query to manage the state for blogs. For this exercise, it is sufficient that the application displays existing blogs and that the creation of a new blog is successful.-->
使用React Query来管理博客的状态。对于这个练习，只要应用程序显示现有的博客，并且新建博客成功即可。

<!-- You are free to manage the state for logging in and creating new blog posts by using the internal state of React components.-->
你可以使用React组件的内部状态来自由管理登录状态和创建新博客文章。

#### 7.12: React Query and context step3

<!-- Expand your solution so that it is again possible to like and delete a blog.-->
扩展你的解决方案，使得再次可以喜欢和删除博客。

#### 7.13: React Query and context step4

<!-- Use the useReducer-hook and context to manage the data for the logged in user.-->
使用`useReducer`钩子和上下文来管理已登录用户的数据。

### Views

<!-- The rest of the tasks are common to both the Redux and React Query versions.-->
其余的任务对于Redux和React Query版本都是一样的。

#### 7.14: Users view

<!-- Implement a view to the application that displays all of the basic information related to users:-->
实现一个对应用程序的视图，显示所有与用户相关的基本信息：

![browser blogs with users table showing blogs created](../../images/7/41.png)

#### 7.15: Individual user view

<!-- Implement a view for individual users that displays all of the blog posts added by that user:-->
实现一个为个人用户显示所有添加的博客文章的视图：

![browser blogs showing users added blogs](../../images/7/44.png)

<!-- You can access the view by clicking the name of the user in the view that lists all users:-->
你可以通过点击列出所有用户的视图中用户的名字来访问视图。

![browser blogs showing clickable users](../../images/7/43.png)

<i>**NB:**</i> you will almost certainly stumble across the following error message during this exercise:

![browser TypeError cannot read property name of undefined](../../images/7/42ea.png)

<!-- The error message will occur if you refresh the page for an individual user.-->
如果你刷新页面，会出现错误消息，这是针对个人用户的。

<!-- The cause of the issue is that, when we navigate directly to the page of an individual user, the React application has not yet received the data from the backend. One solution for fixing the problem is to use conditional rendering:-->
原因是，当我们直接导航到单个用户的页面时，React应用程序尚未从后端接收数据。解决问题的一个解决方案是使用条件渲染：

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
实现一个单独的博客文章视图。你可以按照以下示例来模型你的视图布局：

![browser blogs showing single blog via URL /blogs/number](../../images/7/45.png)

<!-- Users should be able to access the view by clicking the name of the blog post in the view that lists all of the blog posts.-->
用户应该能够通过点击列出所有博客文章的视图中博客文章名称来访问该视图。

![browser showing blogs are clickable](../../images/7/46.png)

<!-- After you''re done with this exercise, the functionality that was implemented in exercise 5.7 is no longer necessary. Clicking a blog post no longer needs to expand the item in the list and display the details of the blog post.-->
完成本练习后，练习5.7中实现的功能不再是必要的。点击博客文章不再需要展开列表中的项目并显示博客文章的详细信息。

#### 7.17: Navigation

<!-- Implement a navigation menu for the application:-->
实施应用程序的导航菜单：

![browser blogs navigation navigation menu](../../images/7/47.png)

#### 7.18: comments, step1

<!-- Implement the functionality for commenting on blog posts:-->
实现对博客文章的评论功能：

![browser blogs showing list of comments for a blog](../../images/7/48.png)

<!-- Comments should be anonymous, meaning that they are not associated with the user who left the comment.-->
评论应该是匿名的，意思是它们不与留下评论的用户相关联。

<!-- In this exercise, it is enough for the frontend to only display the comments that the application receives from the backend.-->
在这个练习中，前端只需要显示应用程序从后端收到的评论就足够了。

<!-- An appropriate mechanism for adding comments to a blog post would be an HTTP POST request to the <i>api/blogs/:id/comments</i> endpoint.-->
一个合适的机制来为博客文章添加评论可以是发送HTTP POST请求到<i>api/blogs/:id/comments</i>端点。

#### 7.19: comments, step2

<!-- Extend your application so that users can add comments to blog posts from the frontend:-->
扩展你的应用程序，使用户可以从前端向博客文章添加评论：

![browser showing comments added via frontend](../../images/7/49.png)

#### 7.20: Styles, step1

<!-- Improve the appearance of your application by applying one of the methods shown in the course material.-->
按照课程资料中所示的方法之一，改善您的应用程序的外观。

#### 7.21: Styles, step2

<!-- You can mark this exercise as finished if you use an hour or more for styling your application.-->
你可以把这个练习标记为完成，如果你花费一个小时或更多时间来设计你的应用程序。

<!-- This was the last exercise for this part of the course and it's time to push your code to GitHub and mark all of your finished exercises to the [exercise submission system](https://studies.cs.helsinki.fi/stats/courses/fullstackopen).-->
这是本部分课程的最后一个练习，是时候将你的代码推送到GitHub，并将所有已完成的练习提交到[练习提交系统](https://studies.cs.helsinki.fi/stats/courses/fullstackopen)了。

</div>
