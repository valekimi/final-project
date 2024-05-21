# PROJECT - Task Manager

Technologies involved: VS Code / Vue.js 3 with Composition API / Vite / Pinia / EsLint / Prettier / Router / Supabase 2 / HTML / CSS / Javascript / Git / Trello / GitHub / Chat GPT / Netlify / Zoom / Slack

===

### App.vue:

All the website will be displayed here through a ROUTER VIEW which allows the component to dynamically load based on the route.
Imported userStore and taskStore = instances in PINIA stores.
ON MOUNTED HOOK is asynchronous to handle async operations like fetching data.
FETCH user data using AWAIT to wait the fetch operation completition.
If user data is available and tasks are fetched, redirects to the home path '/'.


### Auth.vue:

First view that the user will see when landing. Here the user see one of the 2 components: Sign In it is already registered, or Sign up if has already an account. This functionality is possible thanks to a toggle function using "v-if" and "v-else".


### SignIn.vue:

Imported REF to create reactive variables.
REACTIVE VARIABLES: email and password that the user will input through the form.
Form has "@submit.prevent" to call the signIn function.
Email and Password input fields have "v-model" binding to the reactive variables which are used to attempt to sign in the user.
Submit button to trigger the sign-in process.
On successful sign-in, fetches the user's tasks and navigates to the Dashboard.


### SignUp.vue:

Imported REF to create reactive variables.
REACTIVE VARIABLES: email, password, and confirmPassword, that the user will input through the form.
Form has "@submit.prevent" to call the handleSignUn function.
Email, Password and confirmPassword input fields have "v-model" binding to the reactive variables which are used to attempt to sign up the user.
Submit button to trigger the sign-up process.
Compares password and confirmPassword values. If passwords match, tries to sign up with email.value, password.value.
On successful sign-up, sets showSuccessPopup to true which inform user to check the inbox and confirm email.
If passwords do not match, sets errorMessage to 'Passwords do not match.'


### Dashboard.vue:

Main view where the user will manage the tasks.
Imported NavBar and Task components.


### Task.vue:

In this component user will be able to manage the tasks.
The component is divided in 2 parts: Create tasks / Existing tasks

Create Task:
Imported REF to create reactive variables.
REACTIVE VARIABLES: newTaskTitle and newTaskDescription, with this the user will create a new task.
Input fields for task title and description with "v-model" binding to reactive variables.
Form has "@submit.prevent" to call the handleSubmit function which creates a new task object with title, description, and user ID. Calls taskStore.addTask(newTask) to add the task to the store. Calls taskStore.fetchTasks(userStore.user.id) to refresh the task list.
Submit button to add the task.

Existing tasks:



Create Task
===
Edit Task
===
Mark Complete
===
Delete task
===
Profile
===
Edit Profile
===
Log Out

=========================

##DAILY PROGRESS:

- Day 1: understand project structure, insert first HTML and CSS in Auth view, creating component sign up and sign in
- Day 2: connecting components with view and add logic, implement the log out funcionality connected with sign in and sign up
- Day 3: created task component and add login to add new task in the To Do list, also fetching existing tasks, adjusted the date/time format
- Day 4: added option to delete, mark as complete, edit, save the edit - a task
- Day 5: fixed issue with password and confirming password. Add alert if user already signed up with an email - tried to assigned own user tasks but failed
- Day 6: fixed issue to assign task per user, also fixed issue delete card after refresh, responsive, added profile page
- Day 7: Connected the profile with supabase to upload new user information 
- Day 8: Fixed small issue around the website: Profile avatar_url, Success alert, etc... Deploy failure.
- Day 9: Presentation & Readme