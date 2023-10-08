# Video Demo Link

[`Watch it on YouTube`](https://youtu.be/jnQlGCDws3c)


# `NOTE`
If you're planning to run this app locally, YOU MUST SETUP YOUR POSTGRESQL SERVER AND UPDATE URL IN .ENV FILE. OTHERWISE IT SIMPLY WON'T RUN. THE SCHEMA FOR DB TABLE IS IN QUERY FILE.


# 🧭 Table of contents

- [Introduction](#Introduction)
- [🚀 Quick Start](#Quick-Start)
- [What this App Uses](#What-this-App-uses)
	- [`Frontend`](#Frontend)
	- [`Backend`](#Backend)
	- [`Database`](#Database)
- [Where is this Deployed](#Where-is-this-App-deployed)
- [Future Plans](#Future-Aspirations-for-this-App)
- [FAQs](#FAQ)


# Introduction

This is our Project for Submission in the Hackathon `Devheat-2022`.

This is an app(web and android) which can help to locate dustbins in nearby area.

# Quick Start

📄 Clone or fork this repo and change current directory to `undefined-DevHeat-2022`:

```sh
git clone https://github.com/theanuragshukla/BINLocator-GDSCSolutionChallenge-2023.git
```

💿 Install all dependencies:

```sh
cd BINLocator-GDSCSolutionChallenge-2023
npm install
```

✏ Rename `.env.example` to `.env` in the project folder and provide your `SECRET-KEY` and `DATABASE_URL`. 
Example:

```jsx
JWT_SECRET_KEY = xxxx-xxxx-xxxx-xxxx
```

🚴‍♂️ Run your App:

```sh
npm start
```

# What this App uses

### This App has three main parts 
- [`Frontend`](#Frontend)
- [`Backend`](#Backend)
- [`Database`](#Database)


# Frontend

This App uses `HTML`,`CSS` and `Javascript` at its core for frontend applications.
This App runs on and rendered by  a `Nodejs` server.

# Backend

At the `Backend` of this App , A `Nodejs` server is running, which manages all the `requests` and `responses` from the user. 

This App Uses Some Node_Modules in order to work properly which includes:
- `pg`
  - Connect to Database
  - Perform DB queries
- `BCryptJS`
  - Encrypt Passwords before storing in DB
  - Match Passwords on Login
- `jsonwebtoken`
  - Sign auth cookies
  - Verify cookies on each request
  - validate user login credentials
  - set expiry on Login Cookies
- `Express`
  - create a web-server
  - handles request and response


# Database

This app uses `PostgreSQL` for all its database needs. This App uses DB to:
 
 - Store User Information
 - Implement Login, Signup and auth
 - store dustbin locations

# Where is this App deployed

Currently this dApp is deployed on Render as  [https://binlocator.onrender.com](https://binlocator.onrender.com).

# Future Aspirations for this App

There are some features which can be added in future:
 - sorting of locations based on distance
 - integrated directions
 - etc.
 

# FAQ

### Q1. Why this webApp uses Cookies ?

This App uses cookies to store encrypted AuthToken, which is required for Authentication,

### Q2. Why do you need camera and Location Permissions ?

- Location permission is used to detect your location and show nearby dustbins.
- camera permissions is required for taking pictures while adding new bins.

