# Official Node.js image to build the React app
FROM node:18 AS build

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .


COPY nginx.conf /etc/nginx/conf.d/default.conf

RUN npm run build

# Official Nginx image to serve the React app
FROM nginx:alpine

# Copy the build output from the previous stage to the Nginx web root
COPY --from=build /app/build /usr/share/nginx/html

# Expose port 80 to the outside world
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]