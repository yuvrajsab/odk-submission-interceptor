# ODK Submission Interceptor

## Description

This is an interceptor service for ODK form submission. i.e as soon as a submission comes you can handle it how ever you want.

## Pre-requisite

```bash
cp .env.sample .env
```

And update `.env` file according to your environment.

## Setup

This project supports docker, you can easily setup it using just a single command.

```bash
docker-compose up
```

> Or you go for manually setting it up without docker.

## Installation

```bash
$ yarn install
```

## Running the app

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Test

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```
