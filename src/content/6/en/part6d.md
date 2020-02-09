---
mainImage: ../../../images/part-5.svg
part: 6
letter: e
lang: en
---

<div class="content">

We have come a long way in this course and, finally, we have come to the point at which we are using React "the right way", meaning React only focuses on generating the views, and the application state is separated completely from the React components and passed on to Redux, its actions, and its reducers.

What about the _useState_-hook, which provides components with their own state? Does it have any role if an application is using Redux or some other external state management solution? If the application has more complicated forms, it may be beneficial to implement their local state using the state provided by the _useState_ function. One can, of course, have Redux manage the state of the forms, however, if the state of the form is only relevant when filling the form (e.g. for validation) it may be wise to leave the management of state to the component responsible for the form.

The final version of the code for the application can be found on [github](https://github.com/fullstack-hy2020/redux-notes/tree/part6-7) in the branch <i>part6-7</i>.

</div>

<div class="tasks">

#### 6.13 Better anecdotes, step11

The <i>redux store</i> is currently passed to all of the components through props.

Add the [react-redux](https://github.com/reactjs/react-redux) package to your application, and modify the <i>AnecdoteList</i> so that it accesses the store's state with the help of the _connect_ function.

Voting for and creating new anecdotes **does not need to work** after this exercise.

The <i>mapStateToProps</i> function you will need in this exercise is approximately the following:

```js
const mapStateToProps = (state) => {
  // sometimes it is useful to console log from mapStateToProps
  console.log(state)
  return {
    anecdotes: state.anecdotes,
    filter: state.filter
  }
}
```

#### 6.14 Better anecdotes, step12

Do the same for the <i>Filter</i> and <i>AnecdoteForm</i> components.

#### 6.15 Better anecdotes, step13

Change the <i>AnecdoteList</i> component so that the voting for anecdotes works again, and also refactor the <i>Notification</i> component to use connect.

Remove the redundant passing of the store's state via props by simplifying the <i>App</i> component into the following form:

```js
const App = () => {
  return (
    <div>
      <h1>Programming anecdotes</h1>
      <Notification />
      <AnecdoteForm />
      <AnecdoteList />
    </div>
  )
}
```

#### 6.16* Better anecdotes, step14

Change your application so that the <i>AnecdoteList</i> component only receives a single prop based on the store's state. Construct the filtered list of anecdotes as shown in the [Presentational/Container revisited](/en/part6/many_reducers_connect#presentational-container-revisited) section in this part of the course material.


As a result, the <i>AnecdoteList</i> component should get simplified into the following form:

```js
const AnecdoteList = (props) => {
  const vote = (id) => {
    // ...
  }

  return (
    <div>
      {props.anecdotesToShow.map(anecdote => // highlight-line
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote.id)}>vote</button>
          </div>
        </div>
      )}
    </div>
  )
}
```

</div>

<div class="tasks">

This was the last exercise for this part of the course and it's time to push your code to GitHub and mark all of your finished exercises to the [exercise submission system](https://github.com/fullstack-hy2020).


</div>