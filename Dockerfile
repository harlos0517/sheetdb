FROM node:20-alpine
RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app
WORKDIR /home/node/app
COPY package*.json ./
USER node
RUN node -v
RUN npm -v
RUN yarn --version
RUN yarn install --production
COPY --chown=node:node . .
EXPOSE 8000 8000
CMD [ "yarn", "prod" ]
