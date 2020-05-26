# Docker Notes
(Here's the original video)[https://www.youtube.com/watch?v=YFl2mCHdv24] that I used to learn Docker. Covers a lot of the important stuff in about 12 minutes

# Are they Virtual Machines or what?
- No docker is not a virtual machine, it uses the host machine's kernal (VMs are more separated than that)
- A container is *like* a virtual machine but it's not quite as intense
- Honestly, i think it's easiest (if over simplified) to pretend is a tiny linux machine that's running inside your laptop that you can throw into the metaphorical trashcan when it starts acting up. And it will.

# Images
- A container is a running instance of an *image*
  - which is the the OS, application code, and all configs wrapped up in a single file
- Images are defined using a `Dockerfile`, which is a text file with a list steps to perform to create the image
  - it is case sensitive and has no file extension
- It will do things like load in your code, load other images to build on, and load packages
- It's important to know that images can build on top of other images, in our example we'll use a base Node image
- This is like loading packages, it just avoids everyone rebuilding the wheel all the time
- Always use officially supported images from docker hub: https://hub.docker.com/_/node/

# Loading an image
- In your `Dockerfile` the first line is usually loading an image:

```dockerfile
# ./Dockerfile

FROM node:12.16.3
```

- that `FROM` command is saying to load the node version 12.16.3
- node: is the image we're pulling from. You can also get more specific like `node:14.3.0-stretch` which will load node as well as a specific version or size of linux.
  - The default is [alpine](https://sweetcode.io/linux-distributions-optimized-hosting-docker/), which should be fine, so you won't need to specify
- Dockerfile commands are always capital by convention

## Getting your new env right
- The next step in the `Dockerfile` is creating any directories that you need to:

```dockerfile
RUN mkdir -p /usr/app/
WORKDIR /usr/app
```

- `RUN` executes code inside the docker container, and here we're just creating a /usr/app/ directory
- Remember, our base image is just a bare bones linux machine and node installed, nothing else, we'll need to make any modifications ourselves
- Next step is mainly convenience, we're just using `WORKDIR` to set our current working directoring from this point on to be our new directory
- If you had to do any other linux work (like installing something) it would probably be done here with a `RUN` command

## Copying files
- Now that linux is happy, we need to load in our actual code:

```dockerfile
COPY ./src ./src/
COPY ./package*.json ./
```

- `COPY` just ...copies files. the first argument is the file's location on your local machine relative to your Dockerfile, and the second is the location in docker
  - (remember our WORKDIR is /usr/app/)
- Like the `cp` command, you don't have to make a dir before copying something into it.
  - also notice that I'm pulling in both package.json and and package-lock, that `*` is a simple wildcard
- It's important to note

## Exposing ports
- we aren't using any `EXPOSE` in our file, because we don't need to
- A misconception is that you NEED it, but that's not actually the case
- This article on [the `EXPOSE` command explains it](https://we-are.bookmyshow.com/understanding-expose-in-dockerfile-266938b6a33d)
- Basically, expose isn't for your host to talk to a container, but for other containers inside the docker network to talk to each other

## Env vars
- One way to pass env vars into your project is through `ENV` command, however you can also pass in an `env_file` on the command line, here is a [nice article explaining env vars](https://vsupalov.com/docker-arg-env-variable-guide/)

## The starting command
- Last but not least, we need to actually tell our container what to do once it starts, we do this with the `CMD` keyword, and it takes an array that makes up the command, it basically just starts the server

# Building and running the image
- With the `Dockerfile` finsihed, it's time to actually build our image and run it

## Building
- To build it do:

```bash
docker build -t node-server .
```

- build creates our new image, -t lets us specify a name, and `.` is telling docker where the actual `Dockerfile` is (so in this case it's in our root directory where we ran the command)
- First time you build is definitely the longest since it has to download our base Node image

## Running
- To run your container, just do:

```bash
# This would just start the app and take over your terminal - less than ideal
docker run -p 8001:8000 node-server

# This runs it in detached mode
docker run -p 8001:8000 -d node-server
```

- The -p flag tells what port you want to map your host machine to. So we are mapping the host's 8001 port to our docker machine's 8000 port, it's host:docker.
  - Now when we go to localhost:8001, we will see our docker container
  - They can be the same, I just wanted to make sure you knew which was host and which was docker
  - We need to map a port because we need some way for our machine to talk to the docker machine
- the -d flag is also important, since it runs the container in detached mode
  - Without this flag, the container would eat up the terminal.
  - You *should* be able to ctrl-c to get out of the container, but that may not always work, so you'll have to stop it from the outside
- Remember, this builds the image, but it does not start a container, that is a separate command

## Checking the status
- To see what containers are running or exist use:
```bash
# Show any currently running contaners
docker ps

# Show all containers, even those not running
docker ps -a
```
- remember
docker stop (in general use this one)
docker kill
docker rm

## Checking logs
- Starting in detached mode means you can't see the logs from the container.
- That's fine, there's a separate command to see logs
```bash
# print container logs once
docker logs 6ca9880f34a0

# Keep a live update on logs as they come in
docker logs --follow 6ca9880f34a0
docker logs -f 6ca9880f34a0
```
- Just enter the container id from the ps command
- use the -f flag to stay keep the logs open and get any new logs printed to the screen automatically


## Getting into a container
- from time to time it may be necessary to go into a running container
- To do this run:

```bash
# this will let you do whatever
docker exec -it 78520307d7a7 bash

# You can also just run specific commands
docker exec -it 78520307d7a7 npm install
```

- If you just use the `bash` command, you can do anything inside the linux environment
- Sometimes you just need to run a specific command, you can do that as well

# Updating Code
- To see updates, stop the container, build a new image, then run the new image.
- That is terrible, so instead use something called 'volumes'
- Volumes are directories that will auto update inside the docker container if they change on the host machine

```bash
docker run -d -p 8001:8000 -v /Users/mikecronin/projects/docker-basics-1-container/src:/usr/app/src node-server
```

- when using volumes, make sure you build the image before uploading it anywhere.
- Volumes just let the local copy of docker see things, they don't actually load in new files with the build
- Our command line is getting kind of cluttered...So it's time to start thinkin about using Docker Compose to manage this container and more

# Other things to know
- containers will stop by themselves if the task is done (like test containers) and the container will stop, so you should have one process per container
- It's fine to have containers do just one thing, like run tests or build assets, and then close out
- This whole file is full of good stuff to know...but you'll likely never interact with docker like this. In dev, you'll want to use docker compose. The things to pay attention to are the parts about writing a Dockerfile, and not so much running the container
