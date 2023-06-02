# HangOut

<br>



## Description

A interactive website where users can create hangout posts to meet with friends, see popular hangouts and interact with them to confirm their presence.



<br>

## User Stories

- **404** - As a user I want to see a 404 page when I go to a page that doesn’t exist so that I know it was my fault
- **500** - As a user I want to see an error page so that I know that it is not my fault
- **homepage** - As a user I want to be able to access the homepage that includes a feed with all of my friends' hangout posts. 
- **navbar** - As a user I want to see a navbar present all the time with links to access profile and created hangouts (when logged in), and explore (when not logged in).
- **sign up** - As a user I want to sign up on the web page so that I can create and interact with hangout posts.
- **login** - As a user I want to be able to log in on the web page so that I can get back to my account.
- **logout** - As a user I want to be able to log out from the web page so that I can make sure no one will access my account.
- **edit user** - As a user I want to be able to edit my profile; profile picture with a default anonymous one.

- **explore** - As a user I want to be able to explore hangouts and filter them.

- **add hangout** - As a user I want to be able to create a hangout and post it.
- **hangout details** - As a user I want to be able to see details of every hangout, including a full description and images
- **edit hangout** - As a user I want to be able to edit my hangouts.
- **delete hangout** - As a user I want to be able to delete my hangouts.

- **add comment** - As a user I want to be able to create a comment of a hangout and post it.
- **edit comment** - As a user I want to be able to edit my comments.
- **delete comment** - As a user I want to be able to delete my comments.



<br>



# Client / Frontend

## React Router Routes (React App)

| Path                         | Component            | Permissions                | Behavior                                                  |
| ---------------------------- | -------------------- | -------------------------- | --------------------------------------------------------- |
| `/login`                     | LoginPage            | anon only `<AnonRoute>`    | Login form, navigates to home page after login.           |
| `/signup`                    | SignupPage           | anon only  `<AnonRoute>`   | Signup form, navigates to home page after signup.         |
| `/`                          | HomePage             | public `<Route>`           | Home page with basic information and signup/login                                                 |
| `/user-profile`              | ProfilePage          | user only `<PrivateRoute>` | User profile for the current user.             |
| `/user-profile/edit`         | EditProfilePage      | user only `<PrivateRoute>` | Edit user profile form.                                   |
| `/hangouts/create`           | AddHangout | user only `<PrivateRoute>` | Create new hangout post.                               |
| `/hangouts`               | YourHangouts   | user only `<PrivateRoute>` | Created hangouts list.                                         |
| `/hangouts/:hangoutId` | HangoutDetailsPage | user only `<PrivateRoute>` | Hangout details. Shows preview information plus full description and images. |
| `/hangouts/edit/:hangoutId`    | EditHangoutPage    | user only `<PrivateRoute>` | Edit hangout details.                                    |
| `/comments/create/:hangoutId`    | AddComment         | user only `<PrivateRoute>` | Add a comment to a specific hangout.                                 |
| `/comments/edit/:hangoutId`    | EditComment         | user only `<PrivateRoute>` | Edit a comment of a specific hangout.                                 |




## Components

Pages:

- LoginPage

- SignupPage

- HomePage

- ProfilePage

- EditProfilePage

- AddHangout

- EditHangoutPage

- YourHangouts

- AllHangouts

- HangoutDetailsPage

  

Components:

- NavBar
- Button
- Footer
- AddComment
- EditComment






## Services

- **Auth Service**

  - `authService` :
    - `.login(user)`
    - `.signup(user)`
    - `.logout()`
    - `.validate()`

- **User Service**

  - `userService` :
    - `.updateCurrentUser(id, userData)`
    - `.getCurrentUser()`

- **Hangout Service**

  - `hangoutService` :
    - `.postYourHangout(data)`
    - `.getYourHangouts()`
    - `.getAllHangouts()`
    - `.getOneHangout(hangoutId)`
    - `.putYourHangout(hangoutId)`
    - `.deleteYourHangout(hangoutId)`


- **Comment Service**

  - `commentService` :
    - `.postYourComment(hangoutId)`
    - `.editYourComment(commentId)`
    - `.deleteYourComment(commentId)`

  



<br>


# Server / Backend


## Models

**User model**

```javascript
{
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  profileImage: { type: String },
  createdHangouts: [ { type: Schema.Types.ObjectId, ref:'Hangout' } ]
  createdComments: [ { type: Schema.Types.ObjectId, ref:'Comment' } ]
}
```



**Hangout model**

```javascript
 {
   userCreated: { type: Schema.Types.ObjectId, ref:'User' }
   title: { type: String, required: true },
   description: { type: String },
   location: { type: String },
   date: { type: Date },
   images: [ {type: String} ]
   comments: [ {type: Schema.Types.ObjectId, ref: 'Comment'} ]

   usersAttending: [{ type: Schema.Types.ObjectId, ref:'User' }]
 }
```



**Comment model**

```javascript
{
  userCreated: { type: Schema.Types.ObjectId, ref:'User' },
  content: {type: String},
}
```




<br>


## API Endpoints (backend routes)

| HTTP Method | URL                    | Request Body                 | Success status | Error Status | Description                                                  |
| ----------- | ---------------------- | ---------------------------- | -------------- | ------------ | ------------------------------------------------------------ |
| GET         | `/auth/profile    `    | Saved session                | 200            | 404          | Check if user is logged in and return profile page           |
| POST        | `/auth/signup`         | {name, email, password}      | 201            | 404          | Checks if fields not empty (422) and user not exists (409), then create user with encrypted password, and store user in session |
| POST        | `/auth/login`          | {username, password}         | 200            | 401          | Checks if fields not empty (422), if user exists (404), and if password matches (404), then stores user in session |
| POST        | `/auth/logout`         |                              | 204            | 400          | Logs out the user                                            |
| GET         | `/api/hangouts`     |                              |                | 400          | Show your hangouts                                         |
| GET         | `/api/hangouts/:hangoutId` |                              |                |              | Show specific hangout                                     |
| POST        | `/api/hangouts`     | { title, description, location, date, images }       | 201            | 400          | Create and post a new hangout                             |
| PUT         | `/api/hangouts/:hangoutId` | {  title, description, location, date, images }       | 200            | 400          | Edit hangout                                              |
| DELETE      | `/api/hangouts/:hangoutId` |                              | 201            | 400          | delete hangout                                            |
| GET         | `/api/hangouts/:hangoutId/comments`     |                              |                |              | show comments of specific hangout                                         |
| POST        | `/api/hangouts/:hangoutId/comments`         | { content }  | 200            | 404          | add comment                                                   |
| PUT         | `/api/hangouts/:hangoutId/comments/:commentId`     | { content }                | 201            | 400          | edit comment                                                  |
| DELETE      | `/api/players/:hangoutId/comments/:commentId`     |                              | 200            | 400          | delete comment                                                |

<br>

## API's

<br>

## Packages
cloudinary
react-router-dom
material-ui
styled-components
react-toastify


<br>


## Links

### Trello/Kanban

[Link to your trello board](https://trello.com/invite/b/RC1jA0uW/ATTIfebffd5ac0d2b36132c1565728a8e2edD5240C8C/hangout-fullstack-application)

### Git

The url to your repository and to your deployed project

[Client repository Link]()

[Server repository Link]()

[Deployed App Link]()

### Slides

[Slides Link]() - The url to your *public* presentation slides

### Contributors

FirstName LastName - <github-username> - <linkedin-profile-link>

FirstName LastName - <github-username> - <linkedin-profile-link>