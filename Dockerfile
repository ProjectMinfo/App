# Utiliser une image Node.js légère
FROM node:alpine

# Installer http-server globalement
RUN npm install -g http-server

# Créer un répertoire pour les fichiers
WORKDIR /app

# Copier les fichiers statiques dans le conteneur
COPY ./build /app

# Exposer le port 8080
EXPOSE 80

# Lancer le serveur http-server
CMD ["http-server", "-p", "80"]
