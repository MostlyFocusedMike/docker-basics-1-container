# docker-basics-1-container
Learn the basics of docker by deploying a single container to Heroku
- Please read the Docker and Docker-Compose notes first, this main file is mostly about the actual deployment process to Heroku

# Deployment to Heroku
- It is super simple to deploy a container to Heroku
- Go to heroku and create a new web app, mine is docker-test-mostly
- Build your image, push it up to the container registry, and then release it!

```bash
# make sure you are logged in
heroku login

# You also need to login to the container registry
heroku container:login

# Build latest version of image
docker build -t node-server .

# Push up the image to the container registry (Heroku's registry)
heroku container:push web -a docker-test-mostly
# That -a is app, put in your app's name

# Tell Heroku to use the most recent image
heroku container:release web -a docker-test-mostly
```

- You don't need to log in every time, you just need to make sure that you are logged in
- The overall idea here is that we are going to take our built image and place it in a registy
- The registry we are using in this case to make it easy is Heroku, but you don't have to
  - A common place is AWS for instance
- Once the image is built, you notice you're telling Heroku `web`, that is just the process type of the Heroku dyno, and it needs to know that for its own services
- the -a flag is the specific app name

## Heroku and DBs
- For local env, we can just use a postgress container, but once it's on Heroku, they want you to use their Postgres addon service
- You can add this on the site or via the command line
- It doesn't really change much, just notice that the connection process changes in knex for the two different environments


## NODE_ENV
- Really not sure what I'm doing wrong, but you'll notice that I manually set the `NODE_ENV` in my Dockerfile
- According to certain sites, Heroku should set this, like it does for `PORT`, however for some reason it was not
- To be safe, I manually set it myself, but that shouldn't be necessary

## Getting into the container to run migrations and seeds
- To get into your container, you can do it from your site dashboard, next to the `open app` button, there is a `more` button, click that and select `run console`
- You can either run a single command or `bash` to get an interactive environment
- from the command line it's just

```bash
heroku run bash -a docker-test-mostly
```

## Package.json scripts
- It's very common to have 2 versions for container commands: the local and the prod:

```json
    "migrate": "npx knex migrate:latest",
    "_migrate": "docker-compose exec web npm run migrate",
```
- the underscore version is just what you run locally to get into the container first
- The "real" command doesn't have docker-compose in it becuase it gets run in production, which is already inside a container