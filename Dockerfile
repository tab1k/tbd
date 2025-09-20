# Используем официальную версию Node.js 20
FROM node:20

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем vite глобально
RUN npm install -g vite

# Устанавливаем остальные зависимости
RUN npm install --legacy-peer-deps

# Копируем все остальные файлы проекта
COPY . .

# Открываем порт
EXPOSE 3000

# Запускаем приложение
CMD ["npm", "run", "dev"]
