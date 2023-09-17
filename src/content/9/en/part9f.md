---
mainImage: ../../../images/part-9.svg
part: 9
letter: f
lang: en
---

<div class="tasks">

**NOTE**: this is the old section about Patientor frontend that was replaced 12th February 2023, with [this chapter](/en/part9/grande_finale_patientor). In the change, the Patientor frontend structure was refactored to a simpler form that makes it much easier to focus on learning TypeScript.

If you have started doing the exercises with the old Patientor, you may continue with this section. If not, then it is recommended to use the "new" patientor. This section remains here for a couple of weeks.
</div>

<div class="content">

### Working with an existing codebase

When diving into an existing codebase for the first time, it is good to get an overall view of the conventions and structure of the project. You can start your research by reading the <i>README.md</i> in the root of the repository. Usually, the README contains a brief description of the application and the requirements for using it, as well as how to start it for development.
If the README is not available or someone has "saved time" and left it as a stub, you can take a peek at the <i>package.json</i>.
It is always a good idea to start the application and click around to verify you have a functional development environment.

You can also browse the folder structure to get some insight into the application's functionality and/or the architecture used. These are not always clear, and the developers might have chosen a way to organize code that is not familiar to you. The [sample project](https://github.com/fullstack-hy2020/old-patientor) used in the rest of this part is organized, feature-wise. You can see what pages the application has, and some general components, e.g. modals and state. Keep in mind that the features may have
different scopes. For example, modals are visible UI-level components whereas the state is comparable to business logic and keeps the data organized under the hood for the rest of the app to use.

TypeScript provides types for what kind of data structures, functions, components, and state to expect.  You can try looking for <i>types.ts</i> or something similar to get started. VSCode is a big help and simply highlighting variables and parameters can provide quite a lot of insight. All this naturally depends on how types are used in the project.

If the project has unit, integration or end-to-end tests, reading those is most likely beneficial. Test cases are your most important tool when refactoring or adding new features to the application. You want to make sure not to break any existing features when hammering around the code. TypeScript can also give you guidance with argument and return types when changing the code.

Remember that reading code is a skill in itself, so don't worry if you don't understand the code on your first readthrough.  The code may have a lot of corner cases, and pieces of logic may have been added here and there throughout its development cycle. It is hard to imagine what kind of problems the previous developer has wrestled with. Think of it all like [growth rings in trees](https://en.wikipedia.org/wiki/Dendrochronology#Growth_rings). Understanding everything requires digging deep into the code and business domain requirements. The more code you read, the better you will be at understanding it. You will most likely read far more code than you are going to produce throughout your life.

### Patientor frontend

It's time to get our hands dirty finalizing the frontend for the backend we built in [exercises 9.8.-9.13](/en/part9/typing_the_express_app).

Before diving into the code, let us start both the frontend and the backend.

If all goes well, you should see a patient listing page. It fetches a list of patients from our backend, and renders it to the screen as a simple table. There is also a button for creating new patients on the backend. As we are using mock data instead of a database, the data will not persist - closing the backend will delete all the data we have added. UI design has not been a strong point of the creators, so let's disregard the UI for now.

After verifying that everything works, we can start studying the code. All the interesting stuff resides in the <i>src</i> folder. For your convenience, there is already a <i>types.ts</i> file for basic types used in the app, which you will have to extend or refactor in the exercises.

In principle, we could use the same types for both backend and frontend, but usually, the frontend has different data structures and use cases for the data, which causes the types to be different.
For example, the frontend has a state and may want to keep data in objects or maps whereas the backend uses an array. The frontend might also not need all the fields of a data object saved in the backend, and it may need to add some new fields to use for rendering.

The folder structure looks as follows:

![vscode folder structure for patientor](../../images/9/34a.png)

As you would expect, there are currently two main components: *AddPatientModal* and *PatientListPage*. The <i>state</i> folder contains state handling for the frontend.
The main functionality of the code in the <i>state</i> folder is to keep our data in one place and offer simple actions to alter the state of our app.

### State handling

Let's study the state handling a bit closer as a lot of stuff seems to be happening under the hood and it differs a bit from the methods used in the course so far.

The state management is built using the React Hooks [useContext](https://react.dev/reference/react/useContext) and [useReducer](https://react.dev/reference/react/useReducer). This is quite a good setup because we know the app will be rather small and we don't want to use <i>redux</i> or other similar libraries for state management.
There are a lot of good materials, like [this article](https://medium.com/@seantheurgel/react-hooks-as-state-management-usecontext-useeffect-usereducer-a75472a862fe), about this approach to state management.

The approach taken in this app uses the React [context](https://reactjs.org/docs/context.html) that, according to its documentation:

> <i>... is designed to share data that can be considered "global" for a tree of React components, such as the current authenticated user, theme, or preferred language.</i>

In our case, the "global", shared data is the application state <i>and</i> the dispatch function that is used to make changes to data. In many ways, our code works much like the Redux-based state management we used in [part 6](/en/part6), but is more lightweight since it does not require the use of any external libraries. This part assumes that you are at least familiar with the way Redux works, e.g. you should have covered at least [the first section](/en/part6/flux_architecture_and_redux) of part 6.

The [context](https://reactjs.org/docs/context.html) of our application has a tuple containing the app state and the dispatcher for changing the state.
The application state is typed as follows:

```js
export type State = {
  patients: { [id: string]: Patient };
};
```

The state is an object with one key, *patients*, which has a [dictionary](https://www.typescriptlang.org/docs/handbook/2/indexed-access-types.html) or simply put an object with string keys and with *Patient* objects as values. The index can only be a *string* or a *number* as you can access the object values using those. This enforces that the state conforms to the form we want, and prevents developers from misusing the state.

But be aware of one thing! When a type is declared like the type for *patients*, TypeScript does not have any way of knowing if the key you are trying to access exists or not. So if we were to try to access a patient by a non-existing id, the compiler would think that the returned value is of type *Patient* and no error would be thrown when trying to access its properties:

```js
const myPatient = state.patients['non-existing-id'];
console.log(myPatient.name); // no error, TypeScript believes that myPatient is of type Patient
```

To fix this, we could define the type for patient values to be a union of *Patient* and *undefined* in the following way:

```js
export type State = {
  patients: { [id: string]: Patient | undefined };
};
```

That would cause the compiler to give the following warning:

```js
const myPatient = state.patients['non-existing-id'];
console.log(myPatient.name); // error, Object is possibly 'undefined'
```

This type of additional type security is always good to implement if you e.g. use data from external sources or use the value of a user input to access data in your code. But if you are sure that you only handle data that actually exists, then there is no one stopping you from using the first presented solution.

Even though we are not using them in this course part, it is good to mention that a more type-strict way would be to use [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) objects, to which you can declare a type for both the key and the content. The Map's accessor function *get()* always returns a union of the declared value type and undefined, so TypeScript automatically requires you to perform validity checks on data retrieved from a map:

```js
interface State {
  patients: Map<string, Patient>;
}
...
const myPatient = state.patients.get('non-existing-id'); // type for myPatient is now Patient | undefined 
console.log(myPatient.name); // error, Object is possibly 'undefined'

console.log(myPatient?.name); // valid code, but will log 'undefined'
```

Just like with redux, all state manipulation is done by a reducer. It is defined in the file <i>reducer.ts</i> along with the type *Action*, which looks as follows:

```js
export type Action =
  | {
      type: "SET_PATIENT_LIST";
      payload: Patient[];
    }
  | {
      type: "ADD_PATIENT";
      payload: Patient;
    };
```

The reducer looks quite similar to the ones we wrote in [part 6](/en/part6/many_reducers#combined-reducers) before we started to use the Redux Toolkit. It changes the state for each type of action:

```js
export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_PATIENT_LIST":
      return {
        ...state,
        patients: {
          ...action.payload.reduce(
            (memo, patient) => ({ ...memo, [patient.id]: patient }),
            {}
          ),
          ...state.patients
        }
      };
    case "ADD_PATIENT":
      return {
        ...state,
        patients: {
          ...state.patients,
          [action.payload.id]: action.payload
        }
      };
    default:
      return state;
  }
};
```

The main difference is that the state is now a dictionary (or an object), instead of the array that we used in [part 6](/en/part6/flux_architecture_and_redux#pure-functions-immutable).

There are a lot of things happening in the file <i>state.tsx</i>, which takes care of setting up the context.
The main ingredient is the [useReducer](https://react.dev/reference/react/useReducer) hook
used to create the state and the dispatch function, and pass them on to the [context provider](https://react.dev/reference/react/createContext#provider):

```js
export const StateProvider = ({
  reducer,
  children
}: StateProviderProps) => {
  const [state, dispatch] = useReducer(reducer, initialState); // highlight-line
  return (
    <StateContext.Provider value={[state, dispatch]}>  // highlight-line
      {children}
    </StateContext.Provider>
  );
};
```

The provider makes the *state* and the *dispatch* functions available in all of the components, thanks to the setup in <i>index.tsx</i>:

```js
import { reducer, StateProvider } from "./state";

ReactDOM.render(
  <StateProvider reducer={reducer}>
    <App />
  </StateProvider>, 
  document.getElementById('root')
);
```

It also defines the *useStateValue* hook:

```js
export const useStateValue = () => useContext(StateContext);
```

and the components that need to access the state or dispatcher use it to get hold of those:

```js
import { useStateValue } from "../state";

// ...

const PatientListPage = () => {
  const [{ patients }, dispatch] = useStateValue();
  // ...
}
```

Don't worry if this seems confusing; it will be until you have studied the [context's documentation](https://reactjs.org/docs/context.html) and its use in [state management](https://medium.com/@seantheurgel/react-hooks-as-state-management-usecontext-useeffect-usereducer-a75472a862fe). You do not need to understand all this completely to do the exercises!

It is quite common that when you start working on an existing codebase, you do not understand 100% of what happens under the hood in the beginning. If the app has been properly structured (and it has a proper set of tests), you can trust that if you make careful modifications, the app still works despite not understanding all the internal mechanisms. Over time, you will get a grasp on the more unfamiliar parts, but it does not happen overnight when working with a large codebase.

### Patient listing page

Let's go through the <i>PatientListPage/index.tsx</i> as you can take inspiration from there to help you fetch data from the backend and update the application's state.
*PatientListPage* uses our custom hook to inject the state and the dispatcher for updating it.
When we list the patients, we only need to destructure the *patients* property from the state:

```js
import { useStateValue } from "../state";

const PatientListPage = () => {
  const [{ patients }, dispatch] = useStateValue();
  // ...
}
```

We also use the app state created with the *useState* hook for managing modal visibility and form error handling:

```js
const [modalOpen, setModalOpen] = React.useState<boolean>(false);
const [error, setError] = React.useState<string | undefined>();
```

We give the *useState* hook a type parameter, which is then applied to the actual state. So *modalOpen* is a *boolean* while *error* has the type *string | undefined*.
Both set functions returned by the *useState* hook are functions that accept only arguments according to the type parameter given, eg. the exact type for *setModalOpen* function is `React.Dispatch<React.SetStateAction<boolean>>`.

We also have the *openModal* and *closeModal* helper functions for better readability and convenience:

```js
const openModal = (): void => setModalOpen(true);

const closeModal = (): void => {
  setModalOpen(false);
  setError(undefined);
};
```

The frontend's types are based on what you have created when developing the backend in the previous part.

When the component *App* mounts, it fetches patients from the backend using [Axios](https://github.com/axios/axios). Note how we are giving the *axios.get* function a type parameter to describe the type of the response data:

````js
React.useEffect(() => {
  axios.get<void>(`${apiBaseUrl}/ping`);

  const fetchPatientList = async () => {
    try {
      const { data: patients } = await axios.get<Patient[]>(
        `${apiBaseUrl}/patients`
      );
      dispatch({ type: "SET_PATIENT_LIST", payload: patients });
    } catch (error: unknown) {
      let errorMessage = 'Something went wrong.'
      if(axios.isAxiosError(error) && error.response) {
        errorMessage += ' Error: ' + error.response.data.message;
      }
      console.error(errorMessage);
    }
  };
  fetchPatientList();
}, [dispatch]);
````

**A word of warning!** Passing a type parameter to Axios will not validate any data. It is quite dangerous especially if you are using external APIs. You can create custom validation functions that take in the whole payload and return the correct type, or you can use a type guard. Both are valid options. Many libraries also provide validation through different kinds of schemas (e.g. [io-ts](https://gcanti.github.io/io-ts/)). For simplicity's sake, we will continue to trust our work and trust that we will get data of the correct form from the backend.

As our app is quite small, we will update the state by simply calling the *dispatch* function provided to us by the *useStateValue* hook.
The compiler helps by making sure that we dispatch actions according to our *Action* type with a predefined type string and payload:

```js
dispatch({ type: "SET_PATIENT_LIST", payload: patients });
```

</div>

<div class="tasks">

### Exercises 9.20-9.22

We will soon add a new type for our app, *Entry*, which represents a lightweight patient journal entry. It consists of a journal text, i.e. a *description*, a creation date, information regarding the specialist who created it and possible diagnosis codes. Diagnosis codes map to the ICD-10 codes returned from the <i>/api/diagnoses</i> endpoint. Our naive implementation will be that a patient has an array of entries.

Before going into this, let us do some preparatory work.

#### 9.20: patientor, step1

Create an endpoint <i>/api/patients/:id</i>  that returns all of the patient information for one patient, including the array of patient entries that is still empty for all the patients. For the time being, expand the backend types as follows:

```js
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Entry {
}

export interface Patient {
  id: string;
  name: string;
  ssn: string;
  occupation: string;
  gender: Gender;
  dateOfBirth: string;
  entries: Entry[] // highlight-line
}

export type PublicPatient = Omit<Patient, 'ssn' | 'entries'>;  // highlight-line
```

The response should look as follows:

![browser showing entries blank array when accessing patient](../../images/9/38a.png)

#### 9.21: patientor, step2

Create a page for showing a patient's full information in the frontend.

The user should be able to access a patient's information by clicking the patient's name.

Fetch the data from the endpoint created in the previous exercise. After fetching the patient information from the backend, add the fetched information to the application's state. Do not fetch the information if it already is in the app state (i.e. if the user is visiting the same patient's information many times).

Since we now have the state in the context, you'll need to define a new action type for updating an individual patient's data.

The Application uses [MaterialUI](https://material-ui.com/) for styling, which we covered in [part 7](/en/part7/more_about_styles). You may also use it for the new components but that is up to you since our main focus now is TypeScript.

The Application also uses [React Router](https://reactrouter.com/en/main/start/tutorial) to control which view is visible in the frontend. You might want to have a look at [part 7](/en/part7/react_router) if you don't yet have a grasp on how the router works.

The result could look like this:

![browser showing patientor with one patient](../../images/9/39x.png)

Example uses [Material UI Icons](https://mui.com/components/material-icons/) to represent genders.

**Note** that to access the id in the URL, you need to give [useParams](https://reactrouter.com/en/main/hooks/use-params) a proper type argument:

```js
const { id } = useParams<{ id: string }>();
```

#### 9.22: Patientor, step3

Currently, we create *action* objects wherever we dispatch actions, e.g. the *App* component has the following:

```js
dispatch({
  type: "SET_PATIENT_LIST", payload: patientListFromApi
});
```

Define [action creator functions](/en/part6/flux_architecture_and_redux#action-creators) in the file <i>src/state/reducer.ts</i> and refactor the code to use them.

For example, the *App* should become like the following:

```js
import { useStateValue, setPatientList } from "./state";

// ...

dispatch(setPatientList(patientListFromApi));
```

</div>

<div class="content">

### Full entries

In [exercise 9.10](/en/part9/typing_an_express_app#exercises-9-10-9-11) we implemented an endpoint for fetching information about various diagnoses, but we are still not using that endpoint at all.
Since we now have a page for viewing a patient's information, it would be nice to expand our data a bit.
Let's add an *Entry* field to our patient data so that a patient's data contains their medical entries, including possible diagnoses.

Let's ditch our old patient seed data from the backend and start using [this expanded format](https://github.com/fullstack-hy/misc/blob/master/patients.ts).

**Notice:** This time, the data is not in the .json format but instead in the .ts format. You should already have the complete *Gender* and *Patient* types implemented, so only correct the paths where they are imported from if needed.

Let us now create a proper *Entry* type based on the data we have.

If we take a closer look at the data, we can see that the entries are quite different from one another. For example, let's take a look at the first two entries:

```js
{
  id: 'd811e46d-70b3-4d90-b090-4535c7cf8fb1',
  date: '2015-01-02',
  type: 'Hospital',
  specialist: 'MD House',
  diagnosisCodes: ['S62.5'],
  description:
    "Healing time appr. 2 weeks. patient doesn't remember how he got the injury.",
  discharge: {
    date: '2015-01-16',
    criteria: 'Thumb has healed.',
  }
}
...
{
  id: 'fcd59fa6-c4b4-4fec-ac4d-df4fe1f85f62',
  date: '2019-08-05',
  type: 'OccupationalHealthcare',
  specialist: 'MD House',
  employerName: 'HyPD',
  diagnosisCodes: ['Z57.1', 'Z74.3', 'M51.2'],
  description:
    'Patient mistakenly found himself in a nuclear plant waste site without protection gear. Very minor radiation poisoning. ',
  sickLeave: {
    startDate: '2019-08-05',
    endDate: '2019-08-28'
  }
}
```

Immediately, we can see that while the first few fields are the same, the first entry has a *discharge* field and the second entry has *employerName* and *sickLeave* fields.
All the entries seem to have some fields in common, but some fields are entry-specific.

When looking at the *type*, we can see that there are three kinds of entries: *OccupationalHealthcare*, *Hospital* and *HealthCheck*.
This indicates we need three separate types. Since they all have some fields in common, we might just want to create a base entry interface that we can extend with the different fields in each type.

When looking at the data, it seems that the fields *id*, *description*, *date* and *specialist* are something that can be found in each entry. On top of that, it seems that *diagnosisCodes* is only found in one *OccupationalHealthcare* and one *Hospital* type entry. Since it is not always used even in those types of entries, it is safe to assume that the field is optional. We could consider adding it to the *HealthCheck* type as well
since it might just not be used in these specific entries.

So our *BaseEntry* from which each type could be extended would be the following:

```js
interface BaseEntry {
  id: string;
  description: string;
  date: string;
  specialist: string;
  diagnosisCodes?: string[];
}
```

If we want to finetune it a bit further, since we already have a *Diagnosis* type defined in the backend, we might just want to refer to the code field of the *Diagnosis* type directly in case its type ever changes.
We can do that like so:

```js
interface BaseEntry {
  id: string;
  description: string;
  date: string;
  specialist: string;
  diagnosisCodes?: Array<Diagnosis['code']>;
}
```

As you might remember, _Array<Type>_ is just an alternative way to say *Type[]*. In cases like this, it is just much clearer to use the array convention since the other option would be to define the type by saying *Diagnosis['code'][]* which starts to look a bit strange.

Now that we have the *BaseEntry* defined, we can start creating the extended entry types we will actually be using. Let's start by creating the *HealthCheckEntry* type.

Entries of type *HealthCheck* contain the field *HealthCheckRating*, which is an integer from 0 to 3, zero meaning *Healthy* and 3 meaning *CriticalRisk*. This is a perfect case for an enum definition.
With these specifications we could write a *HealthCheckEntry* type definition like so:

```js
export enum HealthCheckRating {
  "Healthy" = 0,
  "LowRisk" = 1,
  "HighRisk" = 2,
  "CriticalRisk" = 3
}

interface HealthCheckEntry extends BaseEntry {
  type: "HealthCheck";
  healthCheckRating: HealthCheckRating;
}
```

Now we only need to create the *OccupationalHealthcareEntry* and *HospitalEntry* types so we can combine them in a union and export them as an Entry type like this:

```js
export type Entry =
  | HospitalEntry
  | OccupationalHealthcareEntry
  | HealthCheckEntry;
```

An important point concerning unions is that, when you use them with *Omit* to exclude a property, it works in a possibly unexpected way. Suppose we want to remove the *id* from each *Entry*. We could think of using *Omit<Entry, 'id'>*, but [it wouldn't work as we might expect](https://github.com/microsoft/TypeScript/issues/42680). In fact, the resulting type would only contain the common properties, but not the ones they don't share. A possible workaround is to define a special Omit-like function to deal with such situations:

```ts
// Define special omit for unions
type UnionOmit<T, K extends string | number | symbol> = T extends unknown ? Omit<T, K> : never;
// Define Entry without the 'id' property
type EntryWithoutId = UnionOmit<Entry, 'id'>;
```

</div>

<div class="tasks">

### Exercises 9.23-9.26

#### 9.23: Patientor, step4

Define the types *OccupationalHealthcareEntry* and *HospitalEntry* so that those conform with the example data. Ensure that your backend returns the entries properly when you go to an individual patient's route:

![browser shoiwing entries json data properly for patient](../../images/9/40.png)

Use types properly in the backend! For now, there is no need to do a proper validation for all the fields of the entries in the backend, it is enough e.g. to check that the field *type* has a correct value.

#### 9.24: Patientor, step5

Extend a patient's page in the frontend to list the *date*, *description* and *diagnoseCodes* of the patient's entries.

You can use the same type definition for an *Entry* in the frontend. For these exercises, it is enough to just copy/paste the definitions from the backend to the frontend.

Your solution could look like this:

![browser showing list of diagnosis codes for patient](../../images/9/41.png)

#### 9.25: Patientor, step6

Fetch and add diagnoses to the application state from the <i>/api/diagnoses</i> endpoint. Use the new diagnosis data to show the descriptions for patient's diagnosis codes:

![browser showing list of codes and their descriptions for patient ](../../images/9/42.png)

#### 9.26: Patientor, step7

Extend the entry listing on the patient's page to include the Entry's details with a new component that shows the rest of the information of the patient's entries distinguishing different types from each other.

You could use eg. [Icons](https://mui.com/components/material-icons/) or some other [Material UI](https://mui.com/) component to get appropriate visuals for your listing.

You should use a *switch case*-based rendering and <i>exhaustive type checking</i> so that no cases can be forgotten.

Like this:

![vscode showing error for healthCheckEntry not being assignable to type never](../../images/9/35c.png)

The resulting entries in the listing <i>could</i> look something like this:

![browser showing list of entries and their details in a nicer format](../../images/9/36x.png)

</div>

<div class="content">

### Add patient form

Form handling can sometimes be quite a nuisance in React. That's why we have decided to utilize the [Formik](https://formik.org/docs/overview) package for our app's add patient form. Here's a small intro from Formik's documentation:

> Formik is a small library that helps you with the 3 most annoying parts:
>
> - Getting values in and out of form state
> - Validation and error messages
> - Handling form submission
>
> By colocating all of the above in one place, Formik will keep things organized - making testing, refactoring, and reasoning about your forms a breeze.

The code for the form can be found from <i>src/AddPatientModal/AddPatientForm.tsx</i> and some form field helpers can be found from <i>src/AddPatientModal/FormField.tsx</i>.

Looking at the top of the <i>AddPatientForm.tsx</i> you can see we have created a type for our form values, which we have simply called *PatientFormValues*. The type is a modified version of the *Patient* type with the *id* and *entries* properties omitted. We don't want the user to be able to submit those when creating a new patient. The *id* is created by the backend and *entries* can only be added for existing patients.

```js
export type PatientFormValues = Omit<Patient, "id" | "entries">;
```

Next, we declare the props for our form component:

```js
interface Props {
  onSubmit: (values: PatientFormValues) => void;
  onCancel: () => void;
}
```

As you can see, the component requires two props: *onSubmit* and *onCancel*.
Both are callback functions that return *void*. The *onSubmit* function should receive an
object of type *PatientFormValues* as an argument so that the callback can handle our form values.

Looking at the *AddPatientForm* function component, you can see we have bound the *Props* as our component's props, and we destructure *onSubmit* and *onCancel* from those props.

```js
export const AddPatientForm = ({ onSubmit, onCancel }: Props) => {
  // ...
}
```

Now before we continue, let's take a look at our form helpers in <i>FormField.tsx</i>.
If you check what is exported from the file, you'll find the type *GenderOption* and the function components *SelectField* and *TextField*.

Let's take a closer look at *SelectField* and the types around it.
First, we create a generic type for each option object that contains a value and a label for that value. These are the kind of option objects we want to allow on our form in the select field.
Since the only options we want to allow are different genders, we set that the *value* should be of type *Gender*.

```js
export type GenderOption = {
  value: Gender;
  label: string;
};
```

In <i>AddPatientForm.tsx</i>, we use the *GenderOption* type for the *genderOptions* variable, declaring it to be an array containing objects of type *GenderOption*:

```js
const genderOptions: GenderOption[] = [
  { value: Gender.Male, label: "Male" },
  { value: Gender.Female, label: "Female" },
  { value: Gender.Other, label: "Other" }
];
```

Next, look at the type *SelectFieldProps*. It defines the type for the props of our *SelectField* component. There, you can see that *options* is an array of *GenderOption* types.

```js
type SelectFieldProps = {
  name: string;
  label: string;
  options: GenderOption[];
};
```

The function component *SelectField* in itself looks a bit cryptic but it just renders the label, a select element, and all given option elements (or, actually, their labels and values).

```jsx
const FormikSelect = ({ field, ...props }: FieldProps) =>
  <Select {...field} {...props} />;

export const SelectField = ({ name, label, options }: SelectFieldProps) => (
  <>
    <InputLabel>{label}</InputLabel>
    <Field
      fullWidth
      style={{ marginBottom: "0.5em" }}
      label={label}
      component={FormikSelect}
      name={name}
    >
      {options.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label || option.value}
        </MenuItem>
      ))}
    </Field>
  </>
);
```

Now let's move on to the *TextField* component. The component renders a TextFieldMUI that is a [Material UI TextField](https://mui.com/components/text-fields/) with a label:

```jsx
interface TextProps extends FieldProps {
  label: string;
  placeholder: string;
}

export const TextField = ({ field, label, placeholder }: TextProps) => (
  <div style={{ marginBottom: "1em" }}>
    <TextFieldMUI
      fullWidth
      label={label}
      placeholder={placeholder}
      {...field}
    />
    <Typography variant="subtitle2" style={{ color: "red" }}>
      <ErrorMessage name={field.name} />
    </Typography>
  </div>
);
```

Note that we use the Formik [ErrorMessage](https://formik.org/docs/api/errormessage) component to render an error message for the input when needed.
The component does everything under the hood, and we don't need to specify what it should do.

It would also be possible to get hold of the error messages within the component by using the prop *form*:

```jsx
export const TextField = ({ field, label, placeholder, form }: TextProps) => {
  console.log(form.errors); 
  // ...
}
```

Now, back to the actual form component in <i>AddPatientForm.tsx</i>.
The function component *AddPatientForm* renders a [Formik component](https://formik.org/docs/api/formik). The Formik component is a wrapper, which requires two props: *initialValues* and *onSubmit*. The role of the props is quite self-explanatory.
The Formik wrapper keeps a track of your form's state, and then exposes it and a few reusable methods and event handlers to your form via props.

We are also using an optional *validate* prop that expects a validation function and returns an object containing possible errors. Here, we only check that our text fields are not falsy, but it could easily contain e.g. some validation for the social security number format or something like that. The error messages defined by this function can then be displayed on the corresponding field's ErrorMessage component.

First, have a look at the entire component. We will later discuss the different parts in detail.

```jsx
interface Props {
  onSubmit: (values: PatientFormValues) => void;
  onCancel: () => void;
}

export const AddPatientForm = ({ onSubmit, onCancel }: Props) => {
  return (
    <Formik
      initialValues={{
        name: "",
        ssn: "",
        dateOfBirth: "",
        occupation: "",
        gender: Gender.Other
      }}
      onSubmit={onSubmit}
      validate={values => {
        const requiredError = "Field is required";
        const errors: { [field: string]: string } = {};
        if (!values.name) {
          errors.name = requiredError;
        }
        if (!values.ssn) {
          errors.ssn = requiredError;
        }
        if (!values.dateOfBirth) {
          errors.dateOfBirth = requiredError;
        }
        if (!values.occupation) {
          errors.occupation = requiredError;
        }
        return errors;
      }}
    >
      {({ isValid, dirty }) => {
        return (
          <Form className="form ui">
            <Field
              label="Name"
              placeholder="Name"
              name="name"
              component={TextField}
            />
            <Field
              label="Social Security Number"
              placeholder="SSN"
              name="ssn"
              component={TextField}
            />
            <Field
              label="Date Of Birth"
              placeholder="YYYY-MM-DD"
              name="dateOfBirth"
              component={TextField}
            />
            <Field
              label="Occupation"
              placeholder="Occupation"
              name="occupation"
              component={TextField}
            />
            <SelectField
              label="Gender"
              name="gender"
              options={genderOptions}
            />
            <Grid>
              <Grid item>
                <Button
                  color="secondary"
                  variant="contained"
                  style={{ float: "left" }}
                  type="button"
                  onClick={onCancel}
                >
                  Cancel
                </Button>
              </Grid>
              <Grid item>
                <Button
                  style={{ float: "right" }}
                  type="submit"
                  variant="contained"
                  disabled={!dirty || !isValid}
                >
                  Add
                </Button>
              </Grid>
            </Grid>
          </Form>
        );
      }}
    </Formik>
  );
};

export default AddPatientForm;
```

As a child of our Formik wrapper, we have a <i>function</i> that returns the form contents.
We use Formik's [Form](https://formik.org/docs/api/form) to render the actual form element. Inside the Form element, we use our *TextField* and *SelectField* components that we created in <i>FormField.tsx</i>.

Lastly, we create two buttons: one for canceling the form submission and one for submitting the form. The cancel button calls the *onCancel* callback straight away when clicked.
The submit button triggers Formik's onSubmit event, which in turn uses the *onSubmit* callback from the component's props. The submit button is enabled only if the form is <i>valid</i> and <i>dirty</i>, which means that the user has edited some of the fields.

We handle form submission through Formik, because it allows us to call the validation function before performing the actual submission. If the validation function returns any errors, the submission is canceled.

The buttons are set inside a Material UI [Grid](https://mui.com/components/grid/#main-content) to set them next to each other easily.

```jsx
<Grid>
  <Grid item>
    <Button
      color="secondary"
      variant="contained"
      style={{ float: "left" }}
      type="button"
      onClick={onCancel}
    >
      Cancel
    </Button>
  </Grid>
  <Grid item>
    <Button
      style={{ float: "right" }}
      type="submit"
      variant="contained"
      disabled={!dirty || !isValid}
    >
      Add
    </Button>
  </Grid>
</Grid>
```

The *onSubmit* callback has been passed all the way down from our patient list page.
It sends an HTTP POST request to our backend, adds the patient returned from the backend to our app's state and closes the modal.
If the backend returns an error, the error is displayed on the form.

Here is our submit function:

```js
const submitNewPatient = async (values: FormValues) => {
  try {
    const { data: newPatient } = await axios.post<Patient>(
      `${apiBaseUrl}/patients`,
      values
    );
    dispatch({ type: "ADD_PATIENT", payload: newPatient });
    closeModal();
  } catch (error: unknown) {
    let errorMessage = 'Something went wrong.'
    if(axios.isAxiosError(error) && error.response) {
      console.error(error.response.data);
      errorMessage = error.response.data.error;
    }
    setError(errorMessage);
  }
};
```

With this material, you should be able to complete the rest of this part's exercises. When in doubt, try reading the existing code to find clues on how to proceed!

</div>

<div class="tasks">

### Exercises 9.27-9.31

#### 9.27: Patientor, step8

We have established that patients can have different kinds of entries. We don't yet have any way of adding entries to patients in our app, so, at the moment, it is pretty useless as an electronic medical record.

Your next task is to add endpoint <i>/api/patients/:id/entries</i> to your backend, through which you can POST an entry for a patient.

Remember that we have different kinds of entries in our app, so our backend should support all those types and check that at least all required fields are given for each type.

#### 9.28: Patientor, step9

Now that our backend supports adding entries, we want to add the corresponding functionality to the frontend. In this exercise, you should add a form for adding an entry to a patient. An intuitive place for accessing the form would be on a patient's page.

In this exercise, it is enough to **support <i>one</i> entry type**, and you do not have to handle any errors. It is enough if a new entry can be created when the form is filled with valid data.

Upon a successful submit, the new entry should be added to the correct patient and the patient's entries on the patient page should be updated to contain the new entry.

If you like, you can re-use some of the code from the <i>Add patient</i> form for this exercise, but this is not a requirement.

Note that the file [FormField.tsx](https://github.com/fullstack-hy2020/patientor/blob/master/src/AddPatientModal/FormField.tsx#L58) has a ready-made component called *DiagnosisSelection* that can be used for setting the field *diagnoses*.

It can be used as follows:

```js
const AddEntryForm = ({ onSubmit, onCancel }: Props) => {
  const [{ diagnoses }] = useStateValue() // highlight-line

  return (
    <Formik
      initialValues={{
        /// ...
      }}
      onSubmit={onSubmit}
      validate={values => {
        /// ...
      }}
    >
    {({ isValid, dirty, setFieldValue, setFieldTouched }) => { // highlight-line

      return (
        <Form className="form ui">
          // ...

          // highlight-start
          <DiagnosisSelection
            setFieldValue={setFieldValue}
            setFieldTouched={setFieldTouched}
            diagnoses={Object.values(diagnoses)}
          />    
          // highlight-end

          // ...
        </Form>
      );
    }}
  </Formik>
  );
};
```

With small tweaks on types, the readily made component *SelectField* can be used for the health check rating.

#### 9.29: Patientor, step10

Extend your solution so that it displays an error message if some required values are missing or formatted incorrectly.

#### 9.30: Patientor, step11

Extend your solution so that it supports <i>two</i> entry types and displays an error message if some required values are missing or formatted incorrectly. You do not need to care about possible errors in the server's response.

The easiest but surely not the most elegant way to do this exercise is to have a separate form for each different entry type. Getting the types to work properly might be a slight challenge if you use just a single form.

Note that if you need to alter the shown form based on user selections, you can access the form values using the parameter *values* of the rendering function:

```js
<Formik
  initialValues={}
  onSubmit={onSubmit}
  validate={}
>
  {({ isValid, dirty, setFieldValue, setFieldTouched, values }) => { // highlight-line
    console.log(values); // highlight-line
    return (
      <Form className="form ui">
      </Form>
    );
  }}
</Formik>
```

#### 9.31: Patientor, step12

Extend your solution so that it supports <i>all the entry types</i> and displays an error message if some required values are missing or formatted incorrectly. You do not need to care about possible errors in the server's response.

</div>
