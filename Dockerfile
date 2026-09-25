FROM nginx:alpine

# Install Node.js runtime for Midtrans Core API proxy
RUN apk add --no-cache nodejs

WORKDIR /app

# Copy built static frontend
COPY dist /usr/share/nginx/html

# Copy Nginx reverse proxy configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy API server and activation links data
COPY api-server /app/api-server
COPY data /app/data

# Copy entrypoint script
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 80
CMD ["/entrypoint.sh"]
