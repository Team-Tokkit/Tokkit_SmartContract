FROM node:18

WORKDIR /app

COPY . .

RUN npm install

EXPOSE 8545

CMD ["npx", "hardhat", "node"]
