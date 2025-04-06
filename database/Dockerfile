FROM mongo:6.0

# Copy the custom OpenSSL configuration into the container
COPY openssl.cnf /etc/ssl/openssl.cnf

# Copy the replica set initialization script
COPY init.sh /init.sh
RUN chmod +x /init.sh

CMD ["/init.sh"]