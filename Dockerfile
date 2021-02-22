FROM node:15 as builder
WORKDIR app
COPY package.json yarn.lock ./
RUN npm install
COPY . ./
RUN yarn build:react


FROM nginx:alpine as server
COPY nginx.conf /etc/nginx/nginx.conf
RUN rm -rf /usr/share/nginx/html/*
COPY --from=builder /app/build /usr/share/nginx/html
EXPOSE 80 80
