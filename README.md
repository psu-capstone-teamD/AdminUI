![](https://travis-ci.org/psu-capstone-teamD/AdminUI.svg?branch=master) [![Coverage Status](https://coveralls.io/repos/github/psu-capstone-teamD/AdminUI/badge.svg?branch=master)](https://coveralls.io/github/psu-capstone-teamD/AdminUI?branch=master)

# AdminUI

AdminUI is a front end site used to create Broadcast Exchange Format(BXF) that is used as a schedule for playing videos.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

Node.js, npm, bower, an Amazon Web Services account, AWS Cognito Identity Pool, AWS S3 bucket are required to get started.

* [Node.js](https://nodejs.org) - The server-side solution for JavaScript and responding to certain HTTP requests
* [npm](https://www.npmjs.com) - Node Dependency Management
* [bower](https://bower.io) - Angular Dependency Management

### Installing

A step by step series of examples that tell you have to get a development environment running

Say what the step will be

```
npm install
```

Followed by

```
bower install
```

Set your AWS Cognito Identity Pool and S3 Bucket/Region in S3Service.js. And gateway URL in LambdaService.js for your backend media processing POST request.

And finally

```
node server.js
```

To launch the node server on port 8080.

Point your browser to http://localhost:8080 to begin.

## Running the tests

This project uses Gulp for automated testing. Testing can be performed by running:

```
gulp test
```

## Deployment

To deploy this to a live system you will need an AWS S3 bucket for file uploads

## Built With

* [Bootstrap](http://www.dropwizard.io/1.0.2/docs/) - The web framework used
* [Angular](https://maven.apache.org/) - Front-end JS framwork
* [Node](https://rometools.github.io/rome/) - Back-end JS framework
* [AWS SDK](https://github.com/aws/aws-sdk-js) - Used for backend AWS services 

## Authors

* **Tyler Burdsall** - [iamtheburd](https://github.com/iamtheburd)
* **Andre Mukhsia** - [mukhsia](https://github.com/mukhsia)
* **Charlie Juszczak** - [cjuszczak](https://github.com/cjuszczak)
* **Scott Pickthorn** - [scott-pickthorn](https://github.com/scott-pickthorn)

See also the list of [contributors](https://github.com/orgs/psu-capstone-teamD/people) who participated in other parts of this project.

## License

This project is licensed under the MIT License.

