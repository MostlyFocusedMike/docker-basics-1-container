# Docker Compose
[Original video this was based on](https://www.youtube.com/watch?v=Qw9zlE3t8Ko)
- Docker is great for containers, but you will quickly need more than one, and organizing them via the command line is a pain
- Docker Compose is a great way to work locally becuase
  1. It lets you configure each container in a file and not command line
  2. It takes care of multi-container networking automatically
  3. It allows you to start mutliple containers at once
- Docker Compose is just an easier way, and basically all of it's commands are just command line arguments you already know, that get written to a file

# The compose file
- Must be called `docker-compose.yml`
- Must start with a version number, 3 is the latest, but 2 is also common
- [.yml guide](https://docs.ansible.com/ansible/latest/reference_appendices/YAMLSyntax.html)

```yml
version: "3"

services:
  web:
    build: '.'
    command: nodemon src/backend/server.js
    ports:
      - '8001:8000'
    environment:
      - DEV_DB_HOST=local_pg_db
      - DEV_DB_PORT=5432
      - DEV_DB_USER=root
      - DEV_DB_PSWD=root
      - DEV_DB_NAME=heroku_local
      - NODE_ENV=development
      - USER
    volumes:
      - ./public/:/usr/app/public/
      - ./src/:/usr/app/src/
      - ./package.json:/usr/app/package.json
    container_name: web-container
```

## services
- each container will be a service, and it is defined under "services", so here we have a service called `web`

## build/image
- This is the location of the Dockerfile, relative to the compose file, for the service
- For things like DBs, it's common that you wouldn't actually have a dockerfile, just a remote image. In that case, you just tell the compose file where to pull with the `image` command:

```yml
local_pg_db:
    image: postgres:9.6-alpine
```

## command
- this is the containers new starting command, and it will override the Dockerfile's `CMD`
- So in dev, we don't want `node src...` but rather `nodemon src...`
- Note that this is why we install it in our Dockerfile, even though that file never uses it
  - Without loading it into our container, then we could not call it in compose
  - Remember, compose is just dealing with containers in a friendlier way, the fundamentals of Docker still apply

## ports
- Exactly the same as the `-p` command line argument, just the host-port:docker-port

## environment
- These are environment variables, and it's important to know that in local dev, they will override the environment variables set in the Dockerfile (so NODE_ENV will be development )
- You can also use an env_file:

```yml
env_file: api.env
```
- this can be called anything, but it will pull in all the standard env variables
- Checkour the docs for what [a `.env` file is for](https://docs.docker.com/compose/environment-variables/)
- You can also pull in variables from your local environment, here we are doing that with `USER`, by not providing a value in the compose file

## volumes
- This is just where all you volumes go, but what's great is that unlike the command line `-v` argument, you can use relative file paths from the compose file, not absolute filepaths
- Volumes will be created on the docker container if they don't exists, or replace whatever does exists so be careful to always make sure necessary files are copied into your container in the Dockerfile and aren't just volumes
- Also, make sure to build your container before pushing, any changes in volumes aren't stored in the Docker build automatically

## container-name
- With docker, this was usually just a random string, and would change with each new build (you could specify with --name in the docker run command, technically)
- Now, for clarity, you can just name your containers here so that they are always consistent


# Building and running
- It's super easy, once your compose file is done:

```bash
docker-compose up -d --build

# just build
docker-compose build

# just up
docker-compose up -d
```

- That command will bring up and force a build on all containers in the compose file at once
- You can also build individual containers (this will save time if you have a lot)

```bash
docker-compose up -d web tests redis
```

## Starting and stopping
- It's super easy:

```bash
docker-compose stop

docker-compose start
```

- You can also remove containers with:

```bash
docker-compose down
```

## logs
```bash
# all
docker-compose logs -f

# for specific
docker-compose logs-f web
```

## Getting into a container
```bash
docker-compose exec web bash
```
- You just use the specific service name instead of the container name, no flags needed

# When do you build
- If you make any change to your compose file, you should rebuild your containers using the above `up --build` command
- If you ever need to rerun anything from a Dockerfile, that is also when you would rebuild, like after you npm install for instance
- If you're pulling in env variables from your local environment and you update your local environment, you can just stop and start a container.
  - But if you are defining the values in the actual compose file, you will need to rebuild