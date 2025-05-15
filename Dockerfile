# Official Node.js image to build the React app
FROM node:18 AS build

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

ARG REACT_APP_WEATHER_API_KEY
ENV REACT_APP_WEATHER_API_KEY=$REACT_APP_WEATHER_API_KEY
ENV NODE_ENV=production

RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 to the outside world
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]