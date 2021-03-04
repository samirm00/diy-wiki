# diy-wiki

> A simple server allows the user get a pge , create a page , get all pages , get all tag names and get all file names contains tag names

---

## Data

> describe the data used in your project.
>
> - what properties?
> - what types?
> - what are array entries like?
>   Data are collection of arrays

---

## User Story Dependencies

![Story Dependency Diagram](img/userStories.png)

---

<!--## WIREFRAME

![wireframe]()
-->

---

## 0.Setup

- fork the repo `diy-wiki`
- turn on GitHub pages
- create a project board
- write the first strategy plan
- install the dependencies `npm install`
- install the dependencies and run build for the `client`

---

## 1. get an existing page

**As a user I want to be able to get an existing page**

### REPO

- This user story is developed on branch `1-getPage`.
- This branch is merged to `master` branch after completion.

### Task A

`server.js`

- this issue devolved on a branch `1-getPage`.
- use the params `:slug` to get the file name
- read the file Asynchronously
- send the file contents in the response
- in case of error , send the message `the page doesn't existed`

---

## 2. create a new page

**As a user I want to be able to create a new page**

### REPO

- This user story is developed on branch `2-createPage`.
- This branch is merged to `master` branch after completion.

### Task A

`server.js`

- this issue developed on a branch `2-createPage`
- get the page name using params`slug`
- get the page contents from the request body
- write to the new page Asynchronously
- send `ok` response
- catch the error in the `catch block`

---

## 3.get all pages

**As a user I want to be able to get all pages**

### REPO

- This user story is developed on branch `3-getAll`.
- This branch is merged to `master` branch after completion.

### Task A

`server.js`

- this issue developed on a branch `3-getAll`
- use `readDir` asynchronously to read all the page names
- keep only the file name and remove the extension `.md`
- send an array of all files names

---

## 4.get all pages contains tag names

**As a user I want to be able to get all pages contains tag names**

### REPO

- This user story is developed on branch `4-pageWithTag`.
- This branch is merged to `master` branch after completion.

### Task A

`server.js`

- this issue developed on a branch `4-pagesWithTag`
- read the directory which contains all the files asynchronously
- for each file get the file name and the file contents
- if the file contains include `tag` then push the file name to `fileNameWithTag`array
- send status `ok` with the array of the files name with tags

---

## 5.get all tag names

**As a user I want to be able to get all tag names**

### REPO

- This user story is developed on branch `5-getAllTag`.
- This branch is merged to `master` branch after completion.

### Task A

`server.js`

- this issue developed on a branch `5-getAllTag`
- read the directories which contains all the files
- for each files read the file contents then search for match with `#`
- then check if the tag name doesn't existed already if not then push to the array of tag names
- send status `ok` , with array of all tag names

---
