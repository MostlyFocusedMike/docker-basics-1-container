# docker-basics-1-container
Learn the basics of docker by deploying a single container to Heroku

# Deployment to Heroku

```bash
heroku container:push web -a docker-test-mostly # That -a is app, put in your name
```

Deployment

```bash
# Build latest version of image
docker build -t node-server .

# Push up the image to the container registry (Heroku's registry)
heroku container:push web -a docker-test-mostly # That -a is app, put in your name

# Tell Heroku to use the most recent image
heroku container:release web -a docker-test-mostly
```