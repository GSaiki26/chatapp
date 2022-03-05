FROM node:17
WORKDIR /app

COPY package*.json ./
COPY yarn.lock ./
RUN yarn install
# RUN npm install

COPY . .
CMD yarn run dev
# CMD yarn run start