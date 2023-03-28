FROM node:16

RUN npm install -g yarn

WORKDIR /app

COPY frontend/package.json frontend/yarn.lock /app/frontend/
COPY backend/package.json backend/yarn.lock /app/backend/
COPY client/package.json client/yarn.lock /app/client/
COPY core/package.json core/yarn.lock /app/core/

RUN cd /app/frontend && yarn install
RUN cd /app/backend && yarn install
RUN cd /app/client && yarn install
RUN cd /app/core && yarn install

COPY frontend /app/frontend
COPY backend /app/backend
COPY client /app/client
COPY core /app/core