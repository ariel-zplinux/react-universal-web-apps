# Test project with MERN stack

A basic application that extracts and aggregates data, then display it.

Using Mongo Express React and Nodejs.

Stack
-----

- Nodejs (>= v6)
- Nvm
- Express
- React
- Flux
- Mongodb
- React Router
- React Markdown
- React Paginate
- Axios 
- Mongoose
- Babel
- Webpack
- Gulp
- Docker
- Docker-compose

Quick Start
-----------

```shell
$ git clone https://github.com/ariel-zplinux/data-extractor-mern.git
$ cd data-extractor-mern
$ npm install
$ npm run prepare && npm start
```

Or with Docker and Docker-compose (after changing dbURI from 'localhost' to 'mongo' in app/infra/db-manager.js)

Rem: it works, but there is a blocking bug, not resolved yet, regarding clients per user agent pagination.
```shell
$ git clone https://github.com/ariel-zplinux/data-extractor-mern.git
$ cd data-extractor-mern
$ docker-compose build
$ docker-compose up
```


NPM Commands
------------

|Command|Description|
|---|---|
|npm start|Start server @**localhost:6001**| 
|npm run prepare|Prepare data|

API endpoints
-------------


|HTTP Method|Url|Parameters|Description|
|---|---|---|---|
|GET|/api/menu||Get menu|
|GET|/api/clients-per-user-device||Get clients per user device|
|GET|/api/clients-per-user-agent| offset, limit|Get clients per user agent|
|GET|/api/duration-per-user-device||Get duration per user device|
|GET|/api/data/:id||Get detailed data|

Links
-----

- Server side rendering - [https://www.smashingmagazine.com/2016/03/server-side-rendering-react-node-express/](https://www.smashingmagazine.com/2016/03/server-side-rendering-react-node-express/)
- MERN boilerplate - [https://github.com/zen-js-code/react-universal-web-apps/](https://github.com/zen-js-code/react-universal-web-apps/)
- Readme inspiration - [https://github.com/r-park/soundcloud-redux](https://github.com/r-park/soundcloud-redux)
- React markdown - [https://github.com/rexxars/react-markdown](https://github.com/rexxars/react-markdown)
- React paginate - [https://github.com/AdeleD/react-paginate](https://github.com/AdeleD/react-paginate)
