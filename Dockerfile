# Usa una imagen base de Node.js
FROM node:22-alpine

# Crea el directorio de trabajo
WORKDIR /app

# Copia solo package.json y package-lock.json primero para aprovechar la cache de Docker
COPY package*.json ./

# Instala dependencias
RUN npm install

# Copia el resto de la aplicación
COPY . .

# Expone el puerto (por defecto 3001)
EXPOSE 3001

# Comando para iniciar la API
CMD ["node", "server.js"]
