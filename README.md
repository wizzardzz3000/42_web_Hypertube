# 42_web_Hypertube
A Netflix-like web app to search and stream movies using BitTorrent protocol

## Summary

- [Intro](#intro)
  - [Stack](#stack)
  - [Features](#features)
- [Home](#home)
- [Languages](#languages)
  - [Multiple languages UI](#multiple-languages-ui)
  - [Multiple languages subtitles](#multiple-languages-subtitles)
- [User account](#user-account)
  - [User creation and authentication](#user-creation-and-authentication)
  - [Forgot and change of password](#forgot-and-change-of-password)
  - [User profile](#user-profile)
   - [Information edition](#information-edition)
    - [Profile picture](#profile-picture)
    - [Movies seen](#movies-seen)
    - [Following](#following)
   - [Edit email and password](#edit-email-and-password)
   - [Delete account](#delete-account)
- [Movies search](#movies-search)
  - [Display list](#display-list)
  - [Search terms](#search-terms)
    -[Filters](#filters)
- [Movie](#movie)
  - [Movie details](#movie-details)
  - [Comments](#comments)
  - [Movie playback](#movie-playback)
    - [Movie player](#movie-player)
    - [Subtitles](#subtitles)
    - [Movie conversion](#movie-conversion)
    - [Additional features](#additional-features)
      - [Default browser functionalities support](#default-browser-functionalities-support)
      - [Movie re-stream and deletion](#movie-re-stream-and-deletion)
- [Responsive design](#responsive-design)
- [Configuration and additionnal security](#configuration-and-additionnal-security)
  - [Database](#database)
  - [Security](#security)

## Intro

Objective of this project is to create a complete streaming website that allow users to search and watch movies using BitTorrent protocol

Team of 3: Raphaël ([GitHub](https://github.com/M4sterCiel)), Lucas ([GitHub](https://github.com/lcordenod)) and I.

### Stack

- Node JS (Express)
- React JS (w/ Hooks and Contexts APIs)
- Materialize CSS and Material UI Front libraries
- MongoDB w/ Mongoose
- JSON web tokens
- Axios for API requests
- Passport for OAuth
- torrent-stream for streaming
- ffmpeg for video conversion

### Features

Hypertube project handles:
- User creation and authentication using tokens and sessions
- OAuthentication via Twitter, Google, Facebook and 42
- User profile with basic information, profile picture, movies seen as well as users following
- User profile edition (password, details, preferences)
- App fully available in 3 languages (French, English and Spanish)
- Movies suggestions by rating (w/ movies seen identified on page)
- Movies search by name, filters (release year, rating, genre)
- Movie pages with details on cast, summary, duration and torrents, quality, sources available
- Movies streaming with multiple qualities available (720p/1080p)
- Movies subtitles available in up to 3 languages (French, English, Spanish)
- Movie format conversion (to webm) while downloading movie for browser support
- Default player functionalities including download and PiP
- Smart movie download checks to avoid downloading same movie again and help with streaming speed
- Movies downloaded deletion after one month
- Email notifications for authentication and password reset (with auth key)
- Change and reset of email/forgot password with ID validation
- Profile, pictures deletion and user DB cleanup
- Responsive design from mobile to desktop/tablet
- User input and upload checks (front/backend)
- Password hashing (Whirlpool)
- HTML/Javascript/SQL injections prevention

Discover more details below.

## Home

![Hyperflix home](https://user-images.githubusercontent.com/45239771/67023566-4c5efc00-f103-11e9-99e5-424d5e06d288.jpg)
<p align=center><i>Hyperflix home</i></p>

## Languages

### Multiple languages UI

User interface is available in 3 languages:
* English
* French
* Spanish

User can edit its language when logged out and when logged in as well. English is the default language when arriving on the app while being logged out.
When user registers, the language he is using will be kept for when he will log in for the first time, there is continuity. Although, once set in its logged in profile, the language will be saved, so when he connects again, he will retrieve his language as well.

### Multiple languages subtitles

I give more details about it further down but as well as being translated, the app also offers subtitbles in French, Spanish and English to users when they are available for the movie played. The movie played is available only in its original language.

## User account

### User creation and authentication

User input has been secured on front and back end with immediate feedback for front end input validation. Also password security has been taken seriously with multiple layers of complexity validated on the go, including:
- A lowercase letter
- A uppercase letter
- A number
- A minimum of 8 characters

Password will be hashed (sha512) with a salt for 5 iterations first before being saved in the DB.

![Register](https://user-images.githubusercontent.com/45239771/67024447-b75d0280-f104-11e9-87bd-b78ac3fab4ec.png)
<p align=center><i>Register</i></p>

Before saving user, several checks will also be runned in the background, including:

- Verifying if user already exists
- Verifying if email is already used
- Verifying (as said earlier) if input is in the right format required

Once user is created, he will be receive an email to verify his account, while account isn't validated, he wont be able to access the app (a message will be displayed to inform him).

User can also choose to register/login with:
* Facebook
* Twitter
* Google
* 42 intra

If username/email already exists, account will be merge and user will be able to connect via multiple methods.

### Forgot and change of password

If user has forgotten his password, he will be able to reset it using his email or username, a link will be sent to his email address.

The reset of password link will have a unique ID, which will be the latest link sent, others will be made deprecated. This provides security to prevent intruders from resetting someone else password.

### User profile

User profiles are accessible via the `/user/username` url, so this means that each user has his own profile link and can share it. Also if user is on his own profile, he will be able to edit it, while if he is on someone else profile, he can follow that user.

![User profile](https://user-images.githubusercontent.com/45239771/67024802-4d912880-f105-11e9-80f4-417b987005a6.gif)
<p align=center><i>User profile</i></p>

#### Information edition

User can edit his profile information after his account creation, he can edit:
- Firstname
- Lastname
- Username
- Email (private, hidden from profile)
- Language

If he edits his username, he will be redirected seamlessly to his new profile url.

##### Profile picture

User will necessarily have a profile picture, he sets it on registration and can edit after logging in.

##### Movies seen

Users can retrieve their movies seen on their profile page, they can also what other profiles viewed. Once a movie is view, it will be automatically added to its movies seen list (no refresh needed).

##### Following

Users can also follow each other in order to retrieve easily profiles that they like or want to store on their profile. This will also be shown in a "Following" category on profiles following others, if following no one, the category won't be shown until someone is followed.

Users can also unfollow users so that these profiles no longer appear in their following section on their profile.

#### Edit email and password

User is able to modify his email and password from the account settings modal, password will be hashed.

#### Delete account

User is able to delete his account as well, this will remove him from database and other users no longer will be available to see his profile, nor following him.

## Movies search

### Display list

![Search](https://user-images.githubusercontent.com/45239771/67025070-b082bf80-f105-11e9-8d92-e3cfa9d71945.jpg)
<p align=center><i>Search</i></p>

Once registered and logged, users will be able to search for movies on the platform. By default, they will get a list of suggestions of movies based on the best ratings. Movies already seen will be marked with an "eye" watched pin.

#### Search terms

![Search result](https://user-images.githubusercontent.com/45239771/67025138-cf815180-f105-11e9-82bf-201ee41433bb.jpg)
<p align=center><i>Search result</i></p>

User is able to search a movie by entering completely or partly the name of the movie. If movies match his search term, a list will be returned to him ordered by default of the sorting he picked.

##### Filters

User can also refine its search by selecting filters:
- Range of release years
- Range of ratings
- Genre

## Movie

### Movie details

![Movie details](https://user-images.githubusercontent.com/45239771/67025626-a1504180-f106-11e9-8187-85e29f5ed0af.jpg)
<p align=center><i>Movie details</i></p>

When clicking on a movie, user will access a movie page to get more details about the movie including:
* Movie poster
* Release in theater
* Duration
* Director
* Cast
* Summary

He will also see the list of sources available for that movie with the different qualities (720p/1080p).

### Comments

![Comments](https://user-images.githubusercontent.com/45239771/67026064-61d62500-f107-11e9-93ca-873be8898669.jpg)
<p align=center><i>Comments</i></p>

Comments help users get a glimpse of the movie and see what users think about it or about the sources. By clicking on a username from a comment posted, user will access the profile of the user that left the comment.

### Movie playback

#### Movie player

![Movie player](https://user-images.githubusercontent.com/45239771/67026295-c2fdf880-f107-11e9-8b20-b3fa403b8dcd.jpg)
<p align=center><i>Movie player</i></p>

When user picks a source from the selector, the download and stream of the movie will start with the quality and source selected.

The player will progressively get the packages we give it to play so that user can also move the playback of the movie ahead and we will prioritize packages of the movie file from there so that he won't have to wait for the full download of the movie to move into the movie.

#### Subtitles

We also get the subtitles of the movie when the user starts streaming the movie, we store subtitles in 3 languages (French, English, Spanish) when they are available from opensubtitles API.

User can select them from the player, they will be synchronized with the movie as we display them according to the stream progress.

#### Movie conversion

When the format of the movie isn't supported by default by the browser, we convert the movie to the webm format using ffmpeg library. The playback of the movie is slown down so user has to wait for the download/conversion to catch up.

We also added a delay when the movie source that needs to be converted is selected in order to give the player time to get the beginning with the movie.

#### Additional features

##### Default browser functionalities support

We are using default HTML 5 browser which has:
* Support of PiP
* Support of file download

##### Movie re-stream and deletion

In order to avoid streaming multiple times the same movie, when a movie to be streamed is available on our server, we use this file for streaming instead of downloading it again in order to improve speed and storage.

Also files downloaded on the server will be deleted one month after the last stream to save space and avoid saturating the server.

## Responsive design

The platform has been completely designed with Responsive Design in mind with multiple breakpoints to accommodate most common screen sizes (from iPhone 5 range to desktop/tablet resolutions):
* From 320px to 1730px

![Responsive examples 1](https://user-images.githubusercontent.com/45239771/67100731-7e826380-f1c0-11e9-88e8-06d720f6a04b.jpg)<p align=center><i>Responsive examples 1</i></p>

![Responsive examples 2](https://user-images.githubusercontent.com/45239771/67100735-7fb39080-f1c0-11e9-9dbf-e0766a906d48.jpg)<p align=center><i>Responsive examples 2</i></p>

Here are a few examples of the user experience on mobile:

<p align="center">
  <img width="340" height="730" src="https://user-images.githubusercontent.com/45239771/67096139-c2249f80-f1b7-11e9-980d-05269c2debe7.gif"><p align=center><i>Responsive user profile</i></p>
</p>

<p align="center">
  <img width="340" height="730" src="https://user-images.githubusercontent.com/45239771/67098976-69f09c00-f1bd-11e9-80cf-98363103e988.gif"><p align=center><i>Responsive movie page</i></p>
</p>

## Configuration and additionnal security

### Database

Database is running on MongoDB and we use MongoDB Atlas Interface to manage/host it online.

### Security

Application is protected against:
* HTML/Javascript injections -> using input checks and sanitizing (mongo-sanitize) input
* Malware upload -> using upload checks
* Password breaches -> using sha512 and salt hashing
* Cross-site request forgery -> using unique IDs with expiration (password reset, email validation)
* Cross-site resource sharing -> using authentication validation, tokens as well as sessions (logged out users limited)
