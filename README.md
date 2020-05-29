# Start API

In the project directory, you can run:

### `npm run dev`

Runs the app in the development mode.<br />
Open [http://localhost:5000](http://localhost:5000) to test it in the browser.

# Endpoints

## Auth

* Register new user
    ```
    POST: /api/users/register/
    ```
* Login user
    ```
    POST: /api/users/login/
    ```

## Users

* Show all users
    ```
    GET: /api/users/
    ```
* View an user profile
    ```
    GET: /api/users/:slug/
* Edit profile of logged user
    ```
    PUT: /api/users/:slug/
    ```
* Add specialities to logged user
    ```
    POST: /api/users/add-new-speciality/
    ```
* Remove specialities to logged user
    ```
    POST: /api/users/remove-speciality/
    ```

## Roles

* Show all roles
    ```
    GET: /api/roles/
    ```
* Create new Role
    ```
    POST: /api/roles/
    ```

## Specialities

* Show all specialities
    ```
    GET: /api/roles/
    ```
* Create new Role
    ```
    POST: /api/roles/
    ```
