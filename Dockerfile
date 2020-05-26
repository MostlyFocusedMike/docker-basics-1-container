# this is where docker gets the node image from
FROM node:12.16.3

# code executes in the command line INSIDE the docker container
RUN mkdir -p /usr/app/
# -p just lets mkdir create a parent directory

# set your working directory so that . is now /usr/src/app
WORKDIR /usr/app

# this copies everything you need into from local into your docker container to start
COPY ./src ./src/
COPY ./public ./public/
COPY ./package*.json ./
COPY ./knexfile.js ./

# we aren't using nodemon here, but we will need it for the docker-compose
RUN npm install -g nodemon
RUN npm i
# We need to use the ./public files to build up our actual assets
RUN npx react-scripts build

# Set an environment variable
# dockerfile will override it
ENV NODE_ENV production

CMD ["node", "./src/backend/server.js"]