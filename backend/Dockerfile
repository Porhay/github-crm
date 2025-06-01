FROM node:18

WORKDIR /usr/src/app

# Install global NestJS CLI
RUN npm install -g @nestjs/cli

# Copy only package files to leverage Docker cache
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy rest of the source code
COPY . .

EXPOSE 80

CMD ["npm", "run", "start:debug"]
