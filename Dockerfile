# Official Node.js image to build the React app
FROM node:18 AS build

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
ENV NODE_ENV=production

# Build arguments (passed at build time)
ARG REACT_APP_RAILWAY_PUBLIC_DOMAIN
ARG REACT_APP_WEATHER_API_KEY

# Set as environment variables (available at build and runtime)
ENV REACT_APP_RAILWAY_PUBLIC_DOMAIN=$REACT_APP_RAILWAY_PUBLIC_DOMAIN
ENV REACT_APP_WEATHER_API_KEY=$REACT_APP_WEATHER_API_KEY

RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 to the outside world
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]