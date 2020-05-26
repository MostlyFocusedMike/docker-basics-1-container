# this is where docker gets the node image from
FROM node:12.16.3

# code executes in the command line INSIDE the docker container
RUN mkdir -p /usr/app/
# -p just lets mkdir create a parent directory

# set your working directory so that . is now /usr/src/app
WORKDIR /usr/app

# this copies everything you need into from local into your docker container to start
COPY ./src ./src/
COPY ./package*.json ./
COPY ./knexfile.js ./

# we aren't using nodemon here, but we will need it for the docker-compose
RUN npm install -g nodemon
RUN npm i

# Set an environment variable
# dockerfile will override
ENV NODE_ENV production

CMD ["node", "./src/backend/server.js"]