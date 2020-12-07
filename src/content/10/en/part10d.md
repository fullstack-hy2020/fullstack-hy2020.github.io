---
mainImage: ../../../images/part-10.svg
part: 10
letter: d
lang: en
---

<div class="content">

Now that we have established a good foundation for our project, it is time to start expanding it. In this section you can put to use all the React Native knowledge you have gained so far. Along with expanding our application we will cover some new areas, such as testing, and additional resources.

### Testing React Native applications

To start testing code of any kind, the first thing we need is a testing framework, which we can use to run a set of test cases and inspect their results. For testing a JavaScript application, [Jest](https://jestjs.io/) is a popular candidate for such testing framework. For testing an Expo based React Native application with Jest, Expo provides a set of Jest configuration in a form of [jest-expo](https://github.com/expo/expo/tree/master/packages/jest-expo) preset. In order to use ESLint in the Jest's test files, we also need the [eslint-plugin-jest](https://www.npmjs.com/package/eslint-plugin-jest) plugin for ESLint. Let's get started by installing the packages:

```shell
npm install --save-dev jest jest-expo eslint-plugin-jest
```

To use the jest-expo preset in Jest, we need to add the following Jest configuration to the <i>package.json</i> file along with the <i>test</i> script:

```javascript
{
  // ...
  "scripts": {
    // other scripts...
    "test": "jest" // highlight-line
  },
  // highlight-start
  "jest": {
    "preset": "jest-expo",
    "transform": {
      "^.+\\.jsx?$": "babel-jest"
    },
    "transformIgnorePatterns": [
      "node_modules/(?!(jest-)?react-native|react-clone-referenced-element|@react-native-community|expo(nent)?|@expo(nent)?/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|@sentry/.*|react-router-native)"
    ]
  },
  // highlight-end
  // ...
}
```

The <em>transform</em> option tells Jest to transform <i>.js</i> and <i>.jsx</i> files with the [Babel](https://babeljs.io/) compiler. The <em>transformIgnorePatterns</em> option is for ignoring certain directories in the <i>node_modules</i> directory while transforming files. This Jest configuration is almost identical to the one proposed in the Expo's [documentation](https://docs.expo.io/guides/testing-with-jest/).

To use the eslint-plugin-jest plugin in ESLint, we need to include it in the plugins and extensions array in the <i>.eslintrc</i> file:

```javascript
{
  "plugins": ["react", "jest"],
  "extends": ["eslint:recommended", "plugin:react/recommended", "plugin:jest/recommended"], // highlight-line
  "parser": "babel-eslint",
  "env": {
    "browser": true
  },
  "rules": {
    "react/prop-types": "off"
  }
}
```

To see that the setup is working, create a directory <i>\_\_tests\_\_</i> in the <i>src</i> directory and in the created directory create a file <i>example.js</i>. In that file, add this simple test:

```javascript
describe('Example', () => {
  it('works', () => {
    expect(1).toBe(1);
  });
});
```

Now, let's run our example test by running <em>npm test</em>. The command's output should indicate that the test located in the <i>src/\_\_tests\_\_/example.js</i> file is passed.

### Organizing tests

Organizing test files in a single <i>\_\_tests\_\_</i> directory is one approach in organizing the tests. When choosing this approach, it is recommended to put the test files in their corresponding subdirectories just like the code itself. This means that for example tests related to components are in the <i>components</i> directory, tests related to utilities are in the <i>utils</i> directory, and so on. This will result in the following structure:

```
src/
  __tests__/
    components/
      AppBar.js
      RepositoryList.js
      ...
    utils/
      authStorage.js
      ...
    ...
```

Another approach is to organize the tests near the implementation. This means that for example, the test file containing tests for the <em>AppBar</em> component is in the same directory as the component's code. This will result in the following structure:

```
src/
  components/
    AppBar/
      AppBar.test.jsx
      index.jsx
    ...
  ...
```

In this example, the component's code is in the <i>index.jsx</i> file and the test in the <i>AppBar.test.jsx</i> file. Note that in order to Jest finding your test files you either have to put them into a <i>\_\_tests\_\_</i> directory, use the <i>.test</i> or <i>.spec</i> suffix, or [manually configure](https://jestjs.io/docs/en/configuration#testmatch-arraystring) the global patterns.

### Testing components

Now that we have managed to set up Jest and run a very simple test, it is time to find out how to test components. As we know, testing components requires a way to serialize a component's render output and simulate firing different kind of events, such as pressing a button. For these purposes, there is the [Testing Library](https://testing-library.com/docs/intro) family, which provides libraries for testing user interface components in different platforms. All of these libraries share similar API for testing user interface components in a user-centric way.

In [part 5](/en/part5/testing_react_apps) we got familiar with one of these libraries, the [React Testing Library](https://testing-library.com/docs/react-testing-library/intro). Unfortunately, this library is only suitable for testing React web applications. Luckily, there exists a React Native counterpart for this library, which is the [React Native Testing Library](https://callstack.github.io/react-native-testing-library/). This is the library we will be using while testing our React Native application's components. The good news is, that these libraries share a very similar API, so there aren't too many new concepts to learn. In addition to the React Native Testing Library, we need a set of React Native specific Jest matchers such as <em>toHaveTextContent</em> and <em>toHaveProp</em>. These matchers are provided by the [jest-native](https://github.com/testing-library/jest-native) library. Before getting into the details, let's install these packages:

```shell
npm install --save-dev @testing-library/react-native @testing-library/jest-native
```

To be able to use these matchers we need to extend the Jest's <em>expect</em> object. This can be done by using a global setup file. Create a file <i>setupTests.js</i> in the root directory of your project, that is, the same directory where the <i>package.json</i> file is located. In that file add the following line:

```javascript
import '@testing-library/jest-native/extend-expect';
```

Next, configure this file as a setup file in the Jest's configuration in the <i>package.json</i> file (note that the <em>\<rootDir></em> in the path is intentional and there is no need to replace it):

```javascript
{
  // ...
  "jest": {
    "preset": "jest-expo",
    "transform": {
      "^.+\\.jsx?$": "babel-jest"
    },
    "transformIgnorePatterns": [
      "node_modules/(?!(jest-)?react-native|react-clone-referenced-element|@react-native-community|expo(nent)?|@expo(nent)?/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|@sentry/.*|react-router-native)"
    ],
    "setupFilesAfterEnv": ["<rootDir>/setupTests.js"] // highlight-line
  }
  // ...
}
```

The main concepts of the React Native Testing Library are the [queries](https://callstack.github.io/react-native-testing-library/docs/api-queries) and [firing events](https://callstack.github.io/react-native-testing-library/docs/api#fireevent). Queries are used to extract a set of nodes from the component that is rendered using the [render](https://callstack.github.io/react-native-testing-library/docs/api#render) function. Queries are useful in tests where we expect for example some text, such as the name of a repository, to be present in the rendered component. To get hold of specific nodes easily, you can tag nodes with the <em>testID</em> prop, and query it with the [getByTestId](https://callstack.github.io/react-native-testing-library/docs/api-queries#bytestid) function. Every React Native core component accepts the <em>testID</em> prop. Here is an example of how to use the queries:

```javascript
import React from 'react';
import { Text, View } from 'react-native';
import { render } from '@testing-library/react-native';

const Greeting = ({ name }) => {
  return (
    <View>
      {/* This node is tagged with the testID prop */}
      <Text testID="greetingText">Hello {name}!</Text>
    </View>
  );
};

describe('Greeting', () => {
  it('renders a greeting message based on the name prop', () => {
    const { debug, getByTestId } = render(<Greeting name="Kalle" />);

    debug();

    expect(getByTestId('greetingText')).toHaveTextContent('Hello Kalle!');
  });
});
```

The <em>render</em> function returns the queries and additional helpers, such as the <em>debug</em> function. The [debug](https://callstack.github.io/react-native-testing-library/docs/api#debug) function prints the rendered React tree in a user-friendly format. Use it if you are unsure what the React tree rendered by the <em>render</em> function looks like. We acquire the <em>Text</em> node tagged with the <em>testID</em> prop by using the <em>getByTestId</em> function. For all available queries, check the React Native Testing Library's [documentation](https://callstack.github.io/react-native-testing-library/docs/api-queries). The <em>toHaveTextContent</em> matcher is used to assert that the node's textual content is correct. The full list of available React Native specific matchers can be found in the [documentation](https://github.com/testing-library/jest-native#matchers) of the jest-native library. Jest's [documentation](https://jestjs.io/docs/en/expect) contains every universal Jest matcher.

The second very important React Native Testing Library concept is firing events. We can fire an event in a provided node by using the [fireEvent](https://callstack.github.io/react-native-testing-library/docs/api#fireevent) object's methods. This is useful for example typing text into a text field or pressing a button. Here is an example of how to test submitting a simple form:

```javascript
import React, { useState } from 'react';
import { Text, TextInput, TouchableWithoutFeedback, View } from 'react-native';
import { render, fireEvent } from '@testing-library/react-native';

const Form = ({ onSubmit }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = () => {
    onSubmit({ username, password });
  };

  return (
    <View>
      <View>
        <TextInput
          value={username}
          onChangeText={(text) => setUsername(text)}
          placeholder="Username"
          testID="usernameField"
        />
      </View>
      <View>
        <TextInput
          value={password}
          onChangeText={(text) => setPassword(text)}
          placeholder="Password"
          testID="passwordField"
        />
      </View>
      <View>
        <TouchableWithoutFeedback onPress={handleSubmit} testID="submitButton">
          <Text>Submit</Text>
        </TouchableWithoutFeedback>
      </View>
    </View>
  );
};

describe('Form', () => {
  it('calls function provided by onSubmit prop after pressing the submit button', () => {
    const onSubmit = jest.fn();
    const { getByTestId } = render(<Form onSubmit={onSubmit} />);

    fireEvent.changeText(getByTestId('usernameField'), 'kalle');
    fireEvent.changeText(getByTestId('passwordField'), 'password');
    fireEvent.press(getByTestId('submitButton'));

    expect(onSubmit).toHaveBeenCalledTimes(1);

    // onSubmit.mock.calls[0][0] contains the first argument of the first call
    expect(onSubmit.mock.calls[0][0]).toEqual({
      username: 'kalle',
      password: 'password',
    });
  });
});
```

In this test, we want to test that after filling the form's fields using the <em>fireEvent.changeText</em> method and pressing the submit button using the <em>fireEvent.press</em> method, the <em>onSubmit</em> callback function is called correctly. To inspect whether the <em>onSubmit</em> function is called and with which arguments, we can use a [mock function](https://jestjs.io/docs/en/mock-function-api). Mock functions are functions with preprogrammed behavior such as a specific return value. In addition, we can create expectations for the mock functions such as "expect the mock function to have been called once". The full list of available expectations can be found in the Jest's [expect documentation](https://jestjs.io/docs/en/expect).

Before heading further into the world of testing React Native applications, play around with these examples by adding a test file in the <i>\_\_tests\_\_</i> directory we created earlier.

### Handling dependencies in tests

Components in the previous examples are quite easy to test because they are more or less <i>pure</i>. Pure components don't depend on <i>side effects</i> such as network requests or using some native API such as the AsyncStorage. The <em>Form</em> component is much less pure than the <em>Greeting</em> component because its state changes can be counted as a side effect. Nevertheless, testing it isn't too difficult.

Next, let's have a look at a strategy for testing components with side effects. Let's pick the <em>RepositoryList</em> component from our application as an example. At the moment the component has one side effect, which is a GraphQL query for fetching the reviewed repositories. The current implementation of the <em>RepositoryList</em> component looks something like this:

```javascript
const RepositoryList = () => {
  const { repositories } = useRepositories();

  const repositoryNodes = repositories
    ? repositories.edges.map((edge) => edge.node)
    : [];

  return (
    <FlatList
      data={repositoryNodes}
      // ...
    />
  );
};

export default RepositoryList;
```

The only side effect is the use of the <em>useRepositories</em> hook, which sends a GraphQL query. There are a few ways to test this component. One way is to mock the Apollo Client's responses as instructed in the Apollo Client's [documentation](https://www.apollographql.com/docs/react/development-testing/testing/). A more simple way is to assume that the <em>useRepositories</em> hook works as intended (preferably through testing it) and extract the components "pure" code into another component, such as the <em>RepositoryListContainer</em> component:

```javascript
export const RepositoryListContainer = ({ repositories }) => {
  const repositoryNodes = repositories
    ? repositories.edges.map((edge) => edge.node)
    : [];

  return (
    <FlatList
      data={repositoryNodes}
      // ...
    />
  );
};

const RepositoryList = () => {
  const { repositories } = useRepositories();

  return <RepositoryListContainer repositories={repositories} />;
};

export default RepositoryList;
```

Now, the <em>RepositoryList</em> component contains only the side effects and its implementation is quite simple. We can test the <em>RepositoryListContainer</em> component by providing it with paginated repository data through the <em>repositories</em> prop and checking that the rendered content has the correct information. This can be achieved by tagging the required <em>RepositoryItem</em> component's nodes with <em>testID</em> props.

</div>

<div class="tasks">

### Exercises 10.17. - 10.18.

#### Exercise 10.17: testing the reviewed repositories list

Implement a test that ensures that the <em>RepositoryListContainer</em> component renders repository's name, description, language, forks count, stargazers count, rating average, and review count correctly. Remember that you can use the [toHaveTextContent](https://github.com/testing-library/jest-native#tohavetextcontent) matcher to check whether a node has certain textual content. You can use the [getAllByTestId](https://callstack.github.io/react-native-testing-library/docs/api-queries#getallby) query to get all nodes with a certain <em>testID</em> prop as an array. If you are unsure what is being rendered, use the [debug](https://callstack.github.io/react-native-testing-library/docs/api#debug) function to see the serialized rendering result.

Use this as a base for your test:

```javascript
describe('RepositoryList', () => {
  describe('RepositoryListContainer', () => {
    it('renders repository information correctly', () => {
      const repositories = {
        pageInfo: {
          totalCount: 8,
          hasNextPage: true,
          endCursor:
            'WyJhc3luYy1saWJyYXJ5LnJlYWN0LWFzeW5jIiwxNTg4NjU2NzUwMDc2XQ==',
          startCursor: 'WyJqYXJlZHBhbG1lci5mb3JtaWsiLDE1ODg2NjAzNTAwNzZd',
        },
        edges: [
          {
            node: {
              id: 'jaredpalmer.formik',
              fullName: 'jaredpalmer/formik',
              description: 'Build forms in React, without the tears',
              language: 'TypeScript',
              forksCount: 1619,
              stargazersCount: 21856,
              ratingAverage: 88,
              reviewCount: 3,
              ownerAvatarUrl:
                'https://avatars2.githubusercontent.com/u/4060187?v=4',
            },
            cursor: 'WyJqYXJlZHBhbG1lci5mb3JtaWsiLDE1ODg2NjAzNTAwNzZd',
          },
          {
            node: {
              id: 'async-library.react-async',
              fullName: 'async-library/react-async',
              description: 'Flexible promise-based React data loader',
              language: 'JavaScript',
              forksCount: 69,
              stargazersCount: 1760,
              ratingAverage: 72,
              reviewCount: 3,
              ownerAvatarUrl:
                'https://avatars1.githubusercontent.com/u/54310907?v=4',
            },
            cursor:
              'WyJhc3luYy1saWJyYXJ5LnJlYWN0LWFzeW5jIiwxNTg4NjU2NzUwMDc2XQ==',
          },
        ],
      };

      // Add your test code here
    });
  });
});
```

You can put the test file where you please. However, it is recommended to follow one of the ways of organizing test files introduced earlier. Use the <em>repositories</em> variable as the repository data for the test. There should be no need to alter the variable's value. Note that the repository data contains two repositories, which means that you need to check that both repositories' information is present.

#### Exercise 10.18: testing the sign in form

Implement a test that ensures that filling the sign in form's username and password fields and pressing the submit button <i>will call</i> the <em>onSubmit</em> handler with <i>correct arguments</i>. The <i>first argument</i> of the handler should be an object representing the form's values. You can ignore the other arguments of the function. Remember that the [fireEvent](https://callstack.github.io/react-native-testing-library/docs/api#fireevent) methods can be used for triggering events and a [mock function](https://jestjs.io/docs/en/mock-function-api) for checking whether the <em>onSubmit</em> handler is called or not.

You don't have to test any Apollo Client or AsyncStorage related code which is in the <em>useSignIn</em> hook. As in the previous exercise, extract the pure code into its own component and test it in the test.

Note that Formik's form submissions are <i>asynchronous</i> so expecting the <em>onSubmit</em> function to be called immediately after pressing the submit button won't work. You can get around this issue by making the test function an async function using the <em>async</em> keyword and using the React Native Testing Library's [waitFor](https://callstack.github.io/react-native-testing-library/docs/api#waitfor) helper function. The <em>waitFor</em> function can be used to wait for expectations to pass. If the expectations don't pass within a certain period, the function will throw an error. Here is a rough example of how to use it:

```javascript
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
// ...

describe('SignIn', () => {
  describe('SignInContainer', () => {
    it('calls onSubmit function with correct arguments when a valid form is submitted', async () => {
      // render the SignInContainer component, fill the text inputs and press the submit button

      await waitFor(() => {
        // expect the onSubmit function to have been called once and with a correct first argument
      });
    });
  });
});
```

You might face the following warning messages: <em>Warning: An update to Formik inside a test was not wrapped in act(...)</em>. This happens because <em>fireEvent</em> method calls cause asynchronous calls in Formik's internal logic. You can get rid of these messages by wrapping each of the <em>fireEvent</em> method calls with the [act](https://www.native-testing-library.com/docs/next/api-main#act) function like this:

```javascript
await act(async () => {
  // call the fireEvent method here
});
```

</div>

<div class="content">

### Extending our application

It is time to put everything we have learned so far to good use and start extending our application. Our application still lacks a few important features such as reviewing a repository and registering a user. The upcoming exercises will focus on these essential features.

</div>

<div class="tasks">

### Exercises 10.19. - 10.24.

#### Exercise 10.19: the single repository view

Implement a view for a single repository, which contains the same repository information as in the reviewed repositories list but also a button for opening the repository in GitHub. It would be a good idea to reuse the <em>RepositoryItem</em> component used in the <em>RepositoryList</em> component and display the GitHub repository button for example based on a boolean prop.

The repository's URL is in the <em>url</em> field of the <em>Repository</em> type in the GraphQL schema. You can fetch a single repository from the Apollo server with the <em>repository</em> query. The query has a single argument, which is the id of the repository. Here's a simple example of the <em>repository</em> query:

```javascript
{
  repository(id: "jaredpalmer.formik") {
    id
    fullName
    url
  }
}
```

As always, test your queries in the GraphQL playground first before using them in your application. If you are unsure about the GraphQL schema or what are the available queries, open either the <i>docs</i> or <i>schema</i> tab in the GraphQL playground. If you have trouble using the id as a variable in the query, take a moment to study the Apollo Client's [documentation](https://www.apollographql.com/docs/react/data/queries/) on queries.

To learn how to open a URL in a browser, read the Expo's [Linking API documentation](https://docs.expo.io/workflow/linking/). You will need this feature while implementing the button for opening the repository in GitHub.

The view should have its own route. It would be a good idea to define the repository's id in the route's path as a path parameter, which you can access by using the [useParams](https://reacttraining.com/react-router/native/api/Hooks/useparams) hook. The user should be able to access the view by pressing a repository in the reviewed repositories list. You can achieve this by for example wrapping the <em>RepositoryItem</em> with a [TouchableOpacity](https://reactnative.dev/docs/touchableopacity) component in the <em>RepositoryList</em> component and using <em>history.push</em> method to change the route in an <em>onPress</em> event handler. You can access the <em>history</em> object with the [useHistory](https://reacttraining.com/react-router/native/api/Hooks/usehistory) hook.

The final version of the single repository view should look something like this:

![Application preview](../../images/10/13.jpg)

#### Exercise 10.20: repository's review list

Now that we have a view for a single repository, let's display repository's reviews there. Repository's reviews are in the <em>reviews</em> field of the <em>Repository</em> type in the GraphQL schema. <em>reviews</em> is a similar paginated list as in the <em>repositories</em> query. Here's an example of getting reviews of a repository:

```javascript
{
  repository(id: "jaredpalmer.formik") {
    id
    fullName
    reviews {
      edges {
        node {
          id
          text
          rating
          createdAt
          user {
            id
            username
          }
        }
      }
    }
  }
}
```

Review's <em>text</em> field contains the textual review, <em>rating</em> field a numeric rating between 0 and 100, and <em>createdAt</em> the date when the review was created. Review's <em>user</em> field contains the reviewer's information, which is of type <em>User</em>.

We want to display reviews as a scrollable list, which makes [FlatList](https://reactnative.dev/docs/flatlist) a suitable component for the job. To display the previous exercise's repository's information at the top of the list, you can use the <em>FlatList</em> components [ListHeaderComponent](https://reactnative.dev/docs/flatlist#listheadercomponent) prop. You can use the [ItemSeparatorComponent](https://reactnative.dev/docs/flatlist#itemseparatorcomponent) to add some space between the items like in the <em>RepositoryList</em> component. Here's an example of the structure:

```javascript
const RepositoryInfo = ({ repository }) => {
  // Repository's information implemented in the previous exercise
};

const ReviewItem = ({ review }) => {
  // Single review item
};

const SingleRepository = () => {
  // ...

  return (
    <FlatList
      data={reviews}
      renderItem={({ item }) => <ReviewItem review={item} />}
      keyExtractor={({ id }) => id}
      ListHeaderComponent={() => <RepositoryInfo repository={repository} />}
      // ...
    />
  );
};

export default SingleRepository;
```

The final version of the repository's reviews list should look something like this:

![Application preview](../../images/10/14.jpg)

The date under the reviewer's username is the creation date of the review, which is in the <em>createdAt</em> field of the <em>Review</em> type. The date format should be user-friendly such as <i>date.month.year</i>. You can for example install the [date-fns](https://date-fns.org/) library and use the [format](https://date-fns.org/v2.13.0/docs/format) function for formatting the creation date.

The round shape of the rating's container can be achieved with the <em>borderRadius</em> style property. You can make it round by fixing the container's <em>width</em> and <em>height</em> style property and setting the border-radius as <em>width / 2</em>.

#### Exercise 10.21: the review form

Implement a form for creating a review using Formik. The form should have four fields: repository owner's GitHub username (for example "jaredpalmer"), repository's name (for example "formik"), a numeric rating, and a textual review. Validate the fields using Yup schema so that it contains the following validations:

- Repository owner's username is a required string
- Repository's name is a required string
- Rating is a required number between 0 and 100
- Review is a optional string

Explore Yup's [documentation](https://github.com/jquense/yup#yup) to find suitable validators. Use sensible error messages with the validators. The validation message can be defined as the validator method's <em>message</em> argument. You can make the review field expand to multiple lines by using <em>TextInput</em> component's [multiline](https://reactnative.dev/docs/textinput#multiline) prop.

You can create a review using the <em>createReview</em> mutation. Check this mutation's arguments in the _docs_ tab in the GraphQL playground. You can use the [useMutation](https://www.apollographql.com/docs/react/api/react-hooks/#usemutation) hook to send a mutation to the Apollo Server.

After a successful <em>createReview</em> mutation, redirect the user to the repository's view you implemented in the previous exercise. This can be done with the <em>history.push</em> method after you have obtained the history object using the [useHistory](https://reacttraining.com/react-router/native/api/Hooks/usehistory) hook. The created review has a <em>repositoryId</em> field which you can use to construct the route's path.

To prevent getting cached data with the <em>repository</em> query in the single repository view, use the _cache-and-network_ [fetch policy](https://www.apollographql.com/docs/react/data/queries/#configuring-fetch-logic) in the query. It can be used with the <em>useQuery</em> hook like this:

```javascript
useQuery(GET_REPOSITORY, {
  fetchPolicy: 'cache-and-network',
  // Other options
});
```

Note that only <i>an existing public GitHub repository</i> can be reviewed and a user can review the same repository <i>only once</i>. You don't have to handle these error cases, but the error payload includes specific codes and messages for these errors. You can try out your implementation by reviewing one of your own public repositories or any other public repository.

The review form should be accessible through the app bar. Create a tab to the app bar with a label "Create a review". This tab should only be visible to users who have signed in. You will also need to define a route for the review form.

The final version of the review form should look something like this:

![Application preview](../../images/10/15.jpg)

This screenshot has been taken after invalid form submission to present what the form should look like in an invalid state.

#### Exercise 10.22: the sign up form

Implement a sign up form for registering a user using Formik. The form should have three fields: username, password, and password confirmation. Validate the form using Yup schema so that it contains the following validations:

- Username is a required string with a length between 1 and 30
- Password is a required string with a length between 5 and 50
- Password confirmation matches the password

The password confirmation field's validation can be a bit tricky, but it can be done for example by using the [oneOf](https://github.com/jquense/yup#mixedoneofarrayofvalues-arrayany-message-string--function-schema-alias-equals) and [ref](https://github.com/jquense/yup#yuprefpath-string-options--contextprefix-string--ref) methods like suggested in [this issue](https://github.com/jaredpalmer/formik/issues/90#issuecomment-354873201).

You can create a new user by using the <em>createUser</em> mutation. Find out how this mutation works by exploring the documentation in the GraphQL playground. After a successful <em>createUser</em> mutation, sign the created user in by using the <em>useSignIn</em> hook as we did in the sign in the form. After the user has been signed in, redirect the user to the reviewed repositories list view.

The user should be able to access the sign-up form through the app bar by pressing a "Sign up" tab. This tab should only be visible to users that aren't signed in.

The final version of the sign up form should look something like this:

![Application preview](../../images/10/16.jpg)

This screenshot has been taken after invalid form submission to present what the form should look like in an invalid state.

#### Exercise 10.23: sorting the reviewed repositories list

At the moment repositories in the reviewed repositories list are ordered by the date of repository's first review. Implement a feature that allows users to select the principle, which is used to order the repositories. The available ordering principles should be:

- Latest repositories. The repository with the latest first review is on the top of the list. This is the current behavior and should be the default principle.
- Highest rated repositories. The repository with the <i>highest</i> average rating is on the top of the list.
- Lowest rated repositories. The repository with the <i>lowest</i> average rating is on the top of the list.

The <em>repositories</em> query used to fetch the reviewed repositories has an argument called <em>orderBy</em>, which you can use to define the ordering principle. The argument has two allowed values: <em>CREATED_AT</em> (order by the date of repository's first review) and <em>RATING_AVERAGE</em>, (order by the repository's average rating). The query also has an argument called <em>orderDirection</em> which can be used to change the order direction. The argument has two allowed values: <em>ASC</em> (ascending, smallest value first) and <em>DESC</em> (descending, biggest value first).

The selected ordering principle state can be maintained for example using the React's [useState](https://reactjs.org/docs/hooks-reference.html#usestate) hook. The variables used in the <em>repositories</em> query can be given to the <em>useRepositories</em> hook as an argument.

You can use for example [react-native-picker](https://www.npmjs.com/package/react-native-picker-select) library, or [React Native Paper](https://callstack.github.io/react-native-paper/) library's [Menu](https://callstack.github.io/react-native-paper/menu.html) component to implement the ordering principle's selection. You can use the <em>FlatList</em> component's [ListHeaderComponent](https://reactnative.dev/docs/flatlist#listheadercomponent) prop to provide the list with a header containing the selection component.

The final version of the feature, depending on the selection component in use, should look something like this:

![Application preview](../../images/10/17.jpg)

#### Exercise 10.24: filtering the reviewed repositories list

The Apollo Server allows filtering repositories using the repository's name or the owner's username. This can be done using the <em>searchKeyword</em> argument in the <em>repositories</em> query. Here's an example of how to use the argument in a query:

```javascript
{
  repositories(searchKeyword: "ze") {
    edges {
      node {
        id
        fullName
      }
    }
  }
}
```

Implement a feature for filtering the reviewed repositories list based on a keyword. Users should be able to type in a keyword into a text input and the list should be filtered as the user types. You can use a simple <em>TextInput</em> component or something a bit fancier such as React Native Paper's [Searchbar](https://callstack.github.io/react-native-paper/searchbar.html) component as the text input. Put the text input component in the <em>FlatList</em> component's header.

To avoid a multitude of unnecessary requests while the user types the keyword fast, only pick the latest input after a short delay. This technique is often referred to as [debouncing](https://lodash.com/docs/4.17.15#debounce). [use-debounce](https://www.npmjs.com/package/use-debounce) library is a handy hook for debouncing a state variable. Use it with a sensible delay time, such as 500 milliseconds. Store the text input's value by using the <em>useState</em> hook and the pass the debounced value to the query as the value of the <em>searchKeyword</em> argument.

You probably face an issue that the text input component loses focus after each keystroke. This is because the content provided by the <em>ListHeaderComponent</em> prop is constantly unmounted. This can be fixed by turning the component rendering the <em>FlatList</em> component into a class component and defining the header's render function as a class property like this:

```javascript
export class RepositoryListContainer extends React.Component {
  renderHeader = () => {
    // this.props contains the component's props
    const props = this.props;
    
    // ...
  
    return (
      <RepositoryListHeader
      // ...
      />
    );
  };

  render() {
    return (
      <FlatList
        // ...
        ListHeaderComponent={this.renderHeader}
      />
    );
  }
}
```

The final version of the filtering feature should look something like this:

![Application preview](../../images/10/18.jpg)

</div>

<div class="content">

### Cursor-based pagination

When an API returns an ordered list of items from some collection, it usually returns a subset of the whole set of items to reduce the required bandwidth and to decrease the memory usage of the client applications. The desired subset of items can be parameterized so that the client can request for example the first twenty items on the list after some index. This technique is commonly referred to as <i>pagination</i>. When items can be requested after a certain item defined by a <i>cursor</i>, we are talking about <i>cursor-based pagination</i>.

So cursor is just a serialized presentation of an item in an ordered list. Let's have a look at the paginated repositories returned by the <em>repositories</em> query using the following query:

```javascript
{
  repositories(first: 2) {
    edges {
      node {
        id
        fullName
        createdAt
      }
      cursor
    }
    pageInfo {
      endCursor
      startCursor
      totalCount
      hasNextPage
    }
  }
}
```

The <em>first</em> argument tells the API to return only the first two repositories. Here's an example of a result of the query:

```javascript
{
  "data": {
    "repositories": {
      "edges": [
        {
          "node": {
            "id": "zeit.next.js",
            "fullName": "zeit/next.js",
            "createdAt": "2020-05-15T11:59:57.557Z"
          },
          "cursor": "WyJ6ZWl0Lm5leHQuanMiLDE1ODk1NDM5OTc1NTdd"
        },
        {
          "node": {
            "id": "zeit.swr",
            "fullName": "zeit/swr",
            "createdAt": "2020-05-15T11:58:53.867Z"
          },
          "cursor": "WyJ6ZWl0LnN3ciIsMTU4OTU0MzkzMzg2N10="
        }
      ],
      "pageInfo": {
        "endCursor": "WyJ6ZWl0LnN3ciIsMTU4OTU0MzkzMzg2N10=",
        "startCursor": "WyJ6ZWl0Lm5leHQuanMiLDE1ODk1NDM5OTc1NTdd",
        "totalCount": 10,
        "hasNextPage": true
      }
    }
  }
}
```

In the result object, we have the <em>edges</em> array containing items with <em>node</em> and <em>cursor</em> attributes. As we know, the <em>node</em> contains the repository itself. The <em>cursor</em> on the other is a Base64 encoded representation of the node. It contains the repository's id and date of repository's creation as a timestamp. This is the information we need to point to the item when they are ordered by the creation time of the repository. The <em>pageInfo</em> contains information such as the cursor of the first and the last item in the array.

Let's say that we want to get the next set of items <i>after</i> the last item of the current set, which is the "zeit/swr" repository. We can set the <em>after</em> argument of the query as the value of the <em>endCursor</em> like this:

```javascript
{
  repositories(first: 2, after: "WyJ6ZWl0LnN3ciIsMTU4OTU0MzkzMzg2N10=") {
    edges {
      node {
        id
        fullName
        createdAt
      }
      cursor
    }
    pageInfo {
      endCursor
      startCursor
      totalCount
      hasNextPage
    }
  }
}
```

Now that we have the next two items and we can keep on doing this until the <em>hasNextPage</em> has the value <em>false</em>, meaning that we have reached the end of the list. To dig deeper into cursor-based pagination, read Shopify's article [Pagination with Relative Cursors](https://engineering.shopify.com/blogs/engineering/pagination-relative-cursors). It provides great details on the implementation itself and the benefits over the traditional index-based pagination.

### Infinite scrolling

Vertically scrollable lists in mobile and desktop applications are commonly implemented using a technique called <i>infinite scrolling</i>. The principle of infinite scrolling is quite simple:

- Fetch the initial set of items
- When the user reaches the last item, fetch the next set of items after the last item

The second step is repeated until the user gets tired of scrolling or some scrolling limit is exceeded. The name "infinite scrolling" refers to the way the list seems to be infinite - the user can just keep on scrolling and new items keep on appearing on the list.

Let's have a look at how this works in practice using the Apollo Client's <em>useQuery</em> hook. Apollo Client has a great [documentation](https://www.apollographql.com/docs/react/data/pagination/#cursor-based) on implementing the cursor-based pagination. Let's implement infinite scrolling for the reviewed repositories list as an example.

First, we need to know when the user has reached the end of the list. Luckily, the <em>FlatList</em> component has a prop [onEndReached](https://reactnative.dev/docs/flatlist#onendreached), which will call the provided function once the user has scrolled to the last item on the list. You can change how early the <em>onEndReach</em> callback is called using the [onEndReachedThreshold](https://reactnative.dev/docs/flatlist#onendreachedthreshold) prop. Alter the <em>RepositoryList</em> component's <em>FlatList</em> component so that it calls a function once the end of the list is reached:

```javascript
export const RepositoryListContainer = ({
  repositories,
  onEndReach,
  /* ... */,
}) => {
  const repositoryNodes = repositories
    ? repositories.edges.map((edge) => edge.node)
    : [];

  return (
    <FlatList
      data={repositoryNodes}
      // ...
      onEndReached={onEndReach}
      onEndReachedThreshold={0.5}
    />
  );
};

const RepositoryList = () => {
  // ...

  const { repositories } = useRepositories(/* ... */);

  const onEndReach = () => {
    console.log('You have reached the end of the list');
  };

  return (
    <RepositoryListContainer
      repositories={repositories}
      onEndReach={onEndReach}
      // ...
    />
  );
};

export default RepositoryList;
```

Try scrolling to the end of the reviewed repositories list and you should see the message in the logs.

Next, we need to fetch more repositories once the end of the list is reached. This can be achieved using the [fetchMore](https://www.apollographql.com/docs/react/data/pagination/#cursor-based) function provided by the <em>useQuery</em> hook. Let's alter the <em>useRepositories</em> hook so that it returns a decorated <em>fetchMore</em> function, which calls the actual <em>fetchMore</em> function with the <em>endCursor</em> and updates the query correctly with the fetched data:

```javascript
const useRepositories = (variables) => {
  const { data, loading, fetchMore, ...result } = useQuery(GET_REPOSITORIES, {
    variables,
    // ...
  });

  const handleFetchMore = () => {
    const canFetchMore =
      !loading && data && data.repositories.pageInfo.hasNextPage;

    if (!canFetchMore) {
      return;
    }

    fetchMore({
      query: GET_REPOSITORIES,
      variables: {
        after: data.repositories.pageInfo.endCursor,
        ...variables,
      },
      updateQuery: (previousResult, { fetchMoreResult }) => {
        const nextResult = {
          repositories: {
            ...fetchMoreResult.repositories,
            edges: [
              ...previousResult.repositories.edges,
              ...fetchMoreResult.repositories.edges,
            ],
          },
        };

        return nextResult;
      },
    });
  };

  return {
    repositories: data ? data.repositories : undefined,
    fetchMore: handleFetchMore,
    loading,
    ...result,
  };
};
```

Make sure you have the <em>pageInfo</em> and the <em>cursor</em> fields in your <em>repositories</em> query as described in the pagination examples. You will also need to include the <em>after</em> and <em>first</em> arguments for the query.

The <em>handleFetchMore</em> function will call the Apollo Client's <em>fetchMore</em> function if there are more items to fetch, which is determined by the <em>hasNextPage</em> property. We also want to prevent fetching more items if fetching is already in process. In this case, <em>loading</em> will be <em>true</em>. In the <em>fetchMore</em> function we are providing the query with an <em>after</em> variable, which receives the latest <em>endCursor</em> value. In the <em>updateQuery</em> we will merge the previous edges with the fetched edges and update the query so that the <em>pageInfo</em> contains the latest information.

The final step is to call the <em>fetchMore</em> function in the <em>onEndReach</em> handler:

```javascript
const RepositoryList = () => {
  // ...

  const { repositories, fetchMore } = useRepositories({
    first: 8,
    // ...
  });

  const onEndReach = () => {
    fetchMore();
  };

  return (
    <RepositoryListContainer
      repositories={repositories}
      onEndReach={onEndReach}
      // ...
    />
  );
};

export default RepositoryList;
```

Use a relatively small <em>first</em> argument value such as 8 while trying out the infinite scrolling. This way you don't need to review too many repositories. You might face an issue that the <em>onEndReach</em> handler is called immediately after the view is loaded. This is most likely because the list contains so few repositories that the end of the list is reached immediately. You can get around this issue by increasing the value of <em>first</em> argument. Once you are confident that the infinite scrolling is working, feel free to use a larger value for the <em>first</em> argument.

</div>

<div class="tasks">

### Exercises 10.25.-10.27.

#### Exercise 10.25: infinite scrolling for the repository's reviews list

Implement infinite scrolling for the repository's reviews list. The <em>Repository</em> type's <em>reviews</em> field has the <em>first</em> and <em>after</em> arguments similar to the <em>repositories</em> query. <em>ReviewConnection</em> type also has the <em>pageInfo</em> field just like the <em>RepositoryConnection</em> type.

Here's an example query:

```javascript
{
  repository(id: "jaredpalmer.formik") {
    id
    fullName
    reviews(first: 2, after: "WyIxYjEwZTRkOC01N2VlLTRkMDAtODg4Ni1lNGEwNDlkN2ZmOGYuamFyZWRwYWxtZXIuZm9ybWlrIiwxNTg4NjU2NzUwMDgwXQ==") {
      edges {
        node {
          id
          text
          rating
          createdAt
          repositoryId
          user {
            id
            username
          }
        }
        cursor
      }
      pageInfo {
        endCursor
        startCursor
        totalCount
        hasNextPage
      }
    }
  }
}
```

As with the reviewed repositories list, use a relatively small <em>first</em> argument value while you are trying out the infinite scrolling. You might need to create a few new users and use them to create a few new reviews to make the reviews list long enough to scroll. Set the value of the <em>first</em> argument high enough so that the <em>onEndReach</em> handler isn't called immediately after the view is loaded, but low enough so that you can see that more reviews are fetched once you reach the end of the list. Once everything is working as intended you can use a larger value for the <em>first</em> argument.

#### Exercise 10.26: the user's reviews view

Implement a feature which allows user to see their reviews. Once signed in, the user should be able to access this view by pressing a "My reviews" tab in the app bar. Implementing an infinite scrolling for the review list is _optional_ in this exercise. Here is what the review list view should roughly look like:

![Application preview](../../images/10/20.jpg)

Remember that you can fetch the authorized user from the Apollo Server with the <em>authorizedUser</em> query. This query returns a <em>User</em> type, which has a field <em>reviews</em>. If you have already implemented a reusable <em>authorizedUser</em> query in your code, you can customize this query to fetch the <em>reviews</em> field conditionally. This can be done using GraphQL's [include](https://graphql.org/learn/queries/#directives) directive.

Let's say that the current query is implemented roughly in the following manner:

```javascript
const GET_AUTHORIZED_USER = gql`
  query {
    authorizedUser {
      # user fields...
    }
  }
`;
```

You can provide the query with an <em>includeReviews</em> argument an use that with the <em>include</em> directive:

```javascript
const GET_AUTHORIZED_USER = gql`
  query getAuthorizedUser($includeReviews: Boolean = false) {
    authorizedUser {
      # user fields...
      reviews @include(if: $includeReviews) {
        edges {
          node {
            # review fields...
          }
          cursor
        }
        pageInfo {
          # page info fields...
        }
      }
    }
  }
`;
```

The <em>includeReviews</em> argument has a default value of <em>false</em>, because we don't want to cause additional server overhead unless we explicitly want to fetch authorize user's reviews. The principle of the <em>include</em> directive is quite simple: if the value of the <em>if</em> argument is <em>true</em>, include the field, otherwise omit it.

#### Exercise 10.27: review actions

Now that user can see their reviews, let's add some actions to the reviews. Under each review on the review list, there should be two buttons. One button is for viewing the review's repository. Pressing this button should take the user to the single repository review implemented in the previous exercise. The other button is for deleting the repository. Pressing this button should delete the review. Here is what the actions should roughly look like:

![Application preview](../../images/10/21.jpg)

Pressing the delete button should be followed by a confirmation alert. If the user confirms the deletion, the review is deleted. Otherwise, the deletion is discarded. You can implement the confirmation using the [Alert](https://reactnative.dev/docs/alert) module. Note that calling the <em>Alert.alert</em> method won't open any window in Expo web preview. Use either Expo mobile app or an emulator to see the what the alert window looks like.

Here is the confirmation alert that should pop out once the user presses the delete button:

![Application preview](../../images/10/22.jpg)

You can delete a review using the <em>deleteReview</em> mutation. This mutation has a single argument, which is the id of the review to be deleted. After the mutation has been performed, the easiest way to update the review list's query is to call the [refetch](https://www.apollographql.com/docs/react/data/queries/#refetching) function. 

This was the last exercise in this section. It's time to push your code to GitHub and mark all of your finished exercises to the [exercise submission system](https://studies.cs.helsinki.fi/stats/courses/fs-react-native-2020). Note that exercises in this section should be submitted to the part 4 in the exercise submission system.
</div>

<div class="content">

### Additional resources

As we are getting closer to the end of this part, let's take a moment to look at some additional React Native related resources. [Awesome React Native](https://github.com/jondot/awesome-react-native) is an extremely encompassing curated list of React Native resources such as libraries, tutorials, and articles. Because the list is exhaustively long, let's have a closer look at few of its highlights

#### React Native Paper

> Paper is a collection of customizable and production-ready components for React Native, following Google’s Material Design guidelines.

[React Native Paper](https://callstack.github.io/react-native-paper/) is for React Native what [Material-UI](https://material-ui.com/) is for React web applications. It offers a wide range of high-quality UI components and support for [custom themes](https://callstack.github.io/react-native-paper/theming.html). [Setting up](https://callstack.github.io/react-native-paper/getting-started.html) React Native Paper for Expo based React Native applications is quite simple, which makes it possible to use it in the upcoming exercises if want to give it a go.

#### Styled-components

> Utilising tagged template literals (a recent addition to JavaScript) and the power of CSS, styled-components allows you to write actual CSS code to style your components. It also removes the mapping between components and styles – using components as a low-level styling construct could not be easier!

[Styled-components](https://styled-components.com/) is a library for styling React components using [CSS-in-JS](https://en.wikipedia.org/wiki/CSS-in-JS) technique. In React Native we are already used to defining component's styles as a JavaScript object, so CSS-in-JS is not so uncharted territory. However, the approach of styled-components is quite different from using the <em>StyleSheet.create</em> method and the <em>style</em> prop.

In styled-components component's styles are defined with the component using a feature called [tagged template literal](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals#Tagged_templates) or a plain JavaScript object. Styled-components makes it possible to define new style properties for component based on its props _at runtime_. This brings many possibilities, such as seamlessly switching between a light and a dark theme. It also has a full [theming support](https://styled-components.com/docs/advanced#theming). Here is an example of creating a <em>Text</em> component with style variations based on props:

```javascript
import React from 'react';
import styled from 'styled-components/native';
import { css } from 'styled-components';

const FancyText = styled.Text`
  color: grey;
  font-size: 14px;

  ${({ isBlue }) =>
    isBlue &&
    css`
      color: blue;
    `}

  ${({ isBig }) =>
    isBig &&
    css`
      font-size: 24px;
      font-weight: 700;
    `}
`;

const Main = () => {
  return (
    <>
      <FancyText>Simple text</FancyText>
      <FancyText isBlue>Blue text</FancyText>
      <FancyText isBig>Big text</FancyText>
      <FancyText isBig isBlue>
        Big blue text
      </FancyText>
    </>
  );
};
```

Because styled-components processes the style definitions, it is possible to use CSS-like snake case syntax with the property names and units in property values. However, units don't have any effect because property values are internally unitless. For more information on styled-components, head out to the [documentation](https://styled-components.com/docs).

#### React-spring

> react-spring is a spring-physics based animation library that should cover most of your UI related animation needs. It gives you tools flexible enough to confidently cast your ideas into moving interfaces.

[React-spring](https://www.react-spring.io/) is a library that provides a clean [hook API](https://www.react-spring.io/docs/hooks/basics) for animating React Native components.

#### React Navigation

> Routing and navigation for your React Native apps

[React Navigation](https://reactnavigation.org/) is a routing library for React Native. It shares some similarities with the React Router library we have been using during this and earlier parts. However, unlike React Router, React Navigation offers more native features such as native gestures and animations to transition between views.

### Closing words

That's it, our application is ready. Good job! We have learned many new concepts during our journey such as setting up our React Native application using Expo, using React Native's core components and adding style to them, communicating with the server, and testing React Native applications. The final piece of the puzzle would be to deploy the application to the Apple App Store and Google Play Store.

Deploying the application is entirely <i>optional</i> and it isn't quite trivial, because you also need to fork and deploy the [rate-repository-api](https://github.com/fullstack-hy2020/rate-repository-api). For the React Native application itself, you first need to create either iOS or Android builds by following Expo's [documentation](https://docs.expo.io/distribution/building-standalone-apps/). Then you can upload these builds to either Apple App Store or Google Play Store. Expo has a [documentation](https://docs.expo.io/distribution/uploading-apps/) for this as well.

</div>
