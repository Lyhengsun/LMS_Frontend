FROM node:22.12.0 AS builder

# Set the working directory
WORKDIR /app

COPY package*.json ./

# Install production dependencies
RUN yarn install

# Copy the rest of the application files
COPY . .

# Build the application
RUN yarn build

### Run stage :This stage creates a lightweight image containing only the files needed to run the application.
FROM node:22.12.0-bullseye-slim AS runner

# Copies specific directories from the builder stage, These files are all the runner needs to serve the Next.js application.
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/static ./.next/static

# Expose the Next.js default port
EXPOSE 3000

ENV AUTH_URL=https://www.learningsite.com

ENV SECURE=true

ENV NODE_ENV=production

# Start the Next.js app
CMD ["node", "./server.js"]