
# Node.js REST API with MongoDB and Docker

This project provides a REST API built with Node.js and Express.js, utilizing MongoDB as the database. It includes features for user authentication and template management, all containerized using Docker for easy setup and deployment.

## 🏗 Project Structure

```
.
├── app/
│   └── server/
│       ├── config/
│       │   ├── arcjet.js
│       │   ├── db.js
│       │   ├── env.js
│       │   └── index.js
│       ├── controllers/
│       │   ├── auth.controller.js
│       │   └── template.controller.js
│       ├── middlewares/
│       │   ├── arcjet.middleware.js
│       │   ├── auth.middleware.js
│       │   └── error.middleware.js
│       ├── models/
│       │   ├── template.model.js
│       │   └── user.model.js
│       ├── routes/
│       │   ├── auth.routes.js
│       │   ├── index.router.js
│       │   └── template.route.js
│       ├── utils/
│       │   ├── default.user.js
│       │   ├── function.encryption.js
│       │   ├── function.pagination.js
│       │   └── function.required.js
│       ├── package.json
│       ├── server.js
│       └── entrypoint.sh
├── database/
│   ├── Dockerfile
│   ├── init.sh
│   └── openssl.cnf
├── server/
│   ├── Dockerfile
│   └── entrypoint.sh 
└── docker-compose.yml
```
---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/NimAce0312/node-docker.git
cd  node-docker
```

### 2. Start the Containers

```bash
sudo docker compose up
```

- API server runs on: http://localhost:8080
- MongoDB exposed on: localhost:27017

To run in the background:

```bash
sudo docker compose up -d
```

To view logs after running in the background (replace `<container-name>` with `server` or `database`):

```bash
sudo docker logs -f <container-name>
```

### 🧠 MongoDB Connection String

```
mongodb://172.17.0.1:27017/node-js?authSource=admin&replicaSet=rs0
```
### 🛠 Installing Packages

To install a new Node.js package (e.g., axios):

```bash
sudo docker exec -it <server-container-name> npm install axios
```

Replace `<server-container-name>` with the actual name of your server container (you can find this using `docker ps`). Changes made in the container's mounted volume (`app/server`) will be reflected in your local `app/server` directory.

---

## ⚙️ API Endpoints

The API follows a versioning scheme with the base URL `/api/v1`.

### Authentication

- `POST /api/v1/auth/register`: Registers a new user.
- `POST /api/v1/auth/login`: Logs in an existing user and returns a JWT.

### Templates

- `GET /api/v1/templates`: Retrieves a list of templates (paginated).
- `POST /api/v1/templates`: Creates a new template (requires authentication and admin role).
- `PUT /api/v1/templates/:id`: Updates an existing template (requires authentication and admin role).
- `DELETE /api/v1/templates/:id`: Deletes a template (requires authentication and admin role).

---

## 🛀 Cleaning Up

To stop and remove the Docker containers:

```bash
sudo docker compose down
```

This command will stop the running containers and remove them, along with any networks and volumes created by the `docker-compose.yml` file.

---

## 🛠 Technologies Used

- **Node.js**: JavaScript runtime environment.
- **Express.js**: Web application framework for Node.js.
- **MongoDB**: NoSQL database.
- **Mongoose**: MongoDB object modeling tool for Node.js.
- **Docker**: Platform for containerizing applications.
- **Docker Compose**: Tool for defining and managing multi-container Docker applications.
- **jsonwebtoken**: Library for creating and verifying JWTs.
- **bcryptjs**: Library for password hashing.
- **dotenv**: Library for loading environment variables from a `.env` file.
- **slugify**: Library for generating URL-friendly slugs.
- **@arcjet/node**: Library for security features like bot detection and rate limiting.

---

## 🔑 Environment Variables

The application uses environment variables for configuration. You can configure these variables in the `.env.development` file located in the root of your project. Some of the key environment variables include:

- `ENVIRONMENT`: The environment the application is running in (e.g., development).
- `PORT`: The port the server will listen on (default: 8080).
- `DB_URI`: The MongoDB connection URI.
- `JWT_SECRET`: Secret key for JWT signing.
- `JWT_EXPIRES_IN`: Expiration time for JWTs.
- `ARCJET_KEY`: API key for Arcjet service.
- `ADMIN_USERNAME`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`: Credentials for the default admin user.

Make sure to create a `.env.development` file based on the variables mentioned above.