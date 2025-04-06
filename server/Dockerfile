FROM node:18-alpine

# Set the working directory inside the container to the mounted volume directory
WORKDIR /app/server

# Copy the entrypoint script into the container
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Expose port 8080
EXPOSE 8080

# Execute the entrypoint script when the container starts
CMD ["/entrypoint.sh"]