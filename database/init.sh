#!/bin/bash
# Start mongod with replica set option in the background
mongod --replSet rs0 --bind_ip_all &

# Wait for MongoDB to start
sleep 5

# Initiate the replica set using mongosh without authentication parameters
mongosh --eval 'rs.initiate({_id:"rs0", members:[{_id:0, host:"172.17.0.1:27017"}]})'

# Keep the container running
tail -f /dev/null