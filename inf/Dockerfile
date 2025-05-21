FROM node:23.4 as builder

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY ./src ./src
COPY public ./public
COPY index.html ./index.html
COPY .env.prod ./.env
COPY postcss.config.js ./postcss.config.js
COPY tailwind.config.js ./tailwind.config.js
COPY vite.config.js ./vite.config.js
RUN npm run build

FROM nginx:alpine
RUN rm -rf /usr/share/nginx/html/*
COPY --from=builder /app/dist /usr/share/nginx/html
COPY ./inf/nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]