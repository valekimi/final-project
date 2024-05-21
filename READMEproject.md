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
The component is divided in 2 parts: Create tasks / Task List

Create Task:
Imported REF to create reactive variables.
REACTIVE VARIABLES: newTaskTitle and newTaskDescription, with this the user will create a new task.
Input fields for task title and description with "v-model" binding to reactive variables.
Form has "@submit.prevent" to call the handleSubmit function which creates a new task object with title, description, and user ID. Calls taskStore.addTask(newTask) to add the task to the store. Calls taskStore.fetchTasks(userStore.user.id) to refresh the task list.
Submit button to add the task.

Task List:
computed Properties: loops of filteredTasks to display tasks, based on user ID, that are not complete or completed.
Similar structure for the options to edit, delete, or move the task back to to-do.

- Edit Task:
function toggleEditMode: toggles the edit mode for a task and sets temporary variables for the title and description.

- Save changes:
function saveChanges: saves the edited task title and description, updates the task in the store, and exits edit mode.

- Cancel Edit:
function cancelEdit: Exits edit mode without saving changes.

- Mark Complete / Back to-do:
function markComplete: marks a task as complete, updates it in the store, and refreshes the task list.
function backToTodo: marks a completed task as incomplete, updates it in the store, and refreshes the task list.

- Delete task:
function deleteTask: asks for confirmation, then deletes the specified task and refreshes the task list.


### ProdileView.vue

Imported components: NavBar, Profile Default, Profile Edit.
Same as in Auth. If the user has a profile, with show the profile information, otherwise will throw an alternative message. This functionality is possible thanks to a toggle function using "v-if" and "v-else". The profile information is displayed if userProfile is not null.
The @edit event on ProfileDefault triggers the function to switch to edit with function toggleEdit.

### ProfileDefault.vue

onMounted function checks if a user is logged in (userStore.user).
If a user is logged in, it fetches the user's profile data using userStore.fetchUserProfile(userStore.user.id).
The fetched profile data is then stored in the userProfile variable.
Emit is defined to emit an edit event. It is used when user wants to edit the profile.

### ProfileEdit.vue

Emit is defined to emit cancel and save events. 
Function toggleEdit switches the state from viewing to editing the profile.
Input elements bound to avatarUrl, username, name, and website using v-model.
handleProfileUpdate Function prepares the updated data and calls userStore.updateUserProfile to update the profile.

### NavBar.vue

It contains an heading with a router-link to the home page (/). This makes the "Task-it" clickable, navigating the user back to the homepage.
A profile section with a router-link to the profile page (/profile). This allows users to click and navigate to their profile page.
A button that calls the logOut method from userStore when clicked, handles user session termination and any necessary clean-up actions.

=========================

## DAILY PROGRESS:

- Day 1: understand project structure, insert first HTML and CSS in Auth view, creating component sign up and sign in
- Day 2: connecting components with view and add logic, implement the log out funcionality connected with sign in and sign up
- Day 3: created task component and add login to add new task in the To Do list, also fetching existing tasks, adjusted the date/time format
- Day 4: added option to delete, mark as complete, edit, save the edit - a task
- Day 5: fixed issue with password and confirming password. Add alert if user already signed up with an email - tried to assigned own user tasks but failed
- Day 6: fixed issue to assign task per user, also fixed issue delete card after refresh, responsive, added profile page
- Day 7: Connected the profile with supabase to upload new user information 
- Day 8: Fixed small issue around the website: Profile avatar_url, Success alert, etc... Deploy failure.
- Day 9: Presentation & Readme