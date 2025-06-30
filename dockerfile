# Base image
FROM node:18-alpine

# Arbeitsverzeichnis setzen
WORKDIR /app

# Abhängigkeiten installieren
COPY package*.json ./
RUN npm install

# App-Dateien kopieren
COPY . .

# App builden
RUN npm run build

# Port öffnen (Next.js Standard)
EXPOSE 3000

# Startbefehl
CMD ["npm", "start"]
