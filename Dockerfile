FROM node:22-alpine

WORKDIR /src

COPY package.json /src/
COPY package-lock.json /src/
RUN npm ci --omit=dev
COPY . /src/

CMD ["npm", "start"]
