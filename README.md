# Simple chat with MERN stack

A basic chat application that allows:

- to send and read messages
- to see connected users

Using Mongo Express React, Nodejs, Flux and Socket.io.

Stack
-----

- Nodejs (>= v6)
- Socket.io
- Nvm
- Express
- React
- Flux
- Mongodb
- React Router
- Axios 
- Mongoose
- Babel
- Webpack
- Gulp
- Random-name

Quick Start
-----------


```shell
$ git clone https://github.com/ariel-zplinux/simple-chat.git
$ cd simplechat
$ npm install
$ npm start
```

ps: you should change SERVER_URL in app/synchronisation/SyncClient.js to your WAN or LAN address.

NPM Commands
------------

|Command|Description|
|---|---|
|npm start|Start server @**localhost:6001**| 
|npm install|Install dependencies |

API endpoints
-------------


|HTTP Method|Url|Parameters|Description|
|---|---|---|---|
|GET|/api/messages||Get messages|
|POST|/api/message/new|content, username|Add a new message|
|GET|/api/users||Get users|
|GET|/api/user/new||Connect a new user and generate a name|
|PUT|/api/user/update|name, id|Change username|
|DELETE|/api/user/delete/:id|id|Disconnect and delete a user|

Links
-----

- Server side rendering - [https://www.smashingmagazine.com/2016/03/server-side-rendering-react-node-express/](https://www.smashingmagazine.com/2016/03/server-side-rendering-react-node-express/)
- MERN boilerplate - [https://github.com/zen-js-code/react-universal-web-apps/](https://github.com/zen-js-code/react-universal-web-apps/)
- Readme inspiration - [https://github.com/r-park/soundcloud-redux](https://github.com/r-park/soundcloud-redux)
- Flux tutorial - [http://blog.andrewray.me/flux-for-stupid-people/](http://blog.andrewray.me/flux-for-stupid-people/)
- Socket.io tutorial - [https://openclassrooms.com/courses/ultra-fast-applications-using-node-js/socket-io-let-s-go-to-real-time](https://openclassrooms.com/courses/ultra-fast-applications-using-node-js/socket-io-let-s-go-to-real-time)
