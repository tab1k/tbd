# Stage 1: build the app using Node
FROM node:18 AS build

WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./
RUN npm install

# Копируем исходный код и собираем фронтенд
COPY . .
RUN npm run build

# Stage 2: Serve the app with Nginx
FROM nginx:1.25

# Копируем собранные файлы из предыдущего stage
COPY --from=build /app/dist /usr/share/nginx/html

# Копируем конфигурацию Nginx
COPY nginx/default.conf /etc/nginx/conf.d/

# Убедимся, что Nginx слушает на порту 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
