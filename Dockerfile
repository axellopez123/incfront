FROM node:18-alpine as build

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install && \
    npx update-browserslist-db@latest && \
    npm cache clean --force


COPY . .

RUN npm install

RUN rm -rf dist && npm run build && \
    echo "Build completo" && \
    ls -lah /app/dist && \
    cat /app/dist/index.html | grep script

FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80