FROM node:14-alpine

# set working directory
WORKDIR /app

# # add `/app/node_modules/.bin` to $PATH
# ENV PATH /app/node_modules/.bin:$PATH

COPY package*.json ./

RUN npm install
# RUN npm install --silent && mv node_modules ../

# COPY . .

EXPOSE 3000

# USER node

# CMD ["npm", "start"]

# CMD tail -f /dev/null
