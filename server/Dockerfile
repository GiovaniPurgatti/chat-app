# Usar uma imagem base do Node.js
FROM node:20

# Definir o diretório de trabalho dentro do contêiner
WORKDIR /app

# Copiar o package.json e yarn.lock
COPY package.json package-lock.json ./

# Instalar as dependências usando Yarn
RUN npm install

# Copiar o restante do código do backend
COPY . .

# Reinstalar dependências para garantir compatibilidade com o ambiente Linux
RUN npm install --force

# Expor a porta que o backend vai rodar
EXPOSE 3333

# Comando para rodar o backend
CMD ["npm","run", "dev"]