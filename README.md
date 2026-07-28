# Automated CI/CD Pipeline with Jenkins, Docker & AWS

## Project Overview

This project implements an automated **CI/CD pipeline using Jenkins, Docker, GitHub Webhooks, and AWS EC2**.

The pipeline automatically retrieves application source code from GitHub, builds a Docker image, deploys the application as an Nginx container, and verifies the deployment.

A **GitHub Webhook** automatically triggers Jenkins whenever new code is pushed to the repository.

The application was deployed and tested on an **AWS EC2 instance**.

---

## Architecture

```text
                      Developer
                          |
                          | git push
                          v
                    GitHub Repository
                          |
                          | Webhook
                          v
                       Jenkins
                          |
              +-----------+-----------+
              |                       |
              v                       v
        Checkout Code          Build Docker Image
                                      |
                                      v
                               Deploy Container
                                      |
                                      v
                              Verify Deployment
                                      |
                                      v
                                   Docker
                                      |
                                      v
                              Nginx Container
                                      |
                                      v
                                  AWS EC2
                                      |
                                      v
                               Web Application
```

---

## Technologies Used

- AWS EC2
- Jenkins
- Docker
- GitHub
- GitHub Webhooks
- Git
- Linux
- Nginx
- React
- Vite

---

## CI/CD Workflow

The automated pipeline follows this workflow:

```text
Developer
   |
   | git push
   v
GitHub
   |
   | Webhook
   v
Jenkins
   |
   v
Checkout
   |
   v
Build Docker Image
   |
   v
Deploy Container
   |
   v
Verify Deployment
   |
   v
Application Live
```

Whenever a new commit is pushed to the `main` branch, GitHub sends a webhook request to Jenkins.

Jenkins then automatically starts the CI/CD pipeline without requiring a manual **Build Now** operation.

---

## Jenkins Pipeline Stages

### Checkout

Jenkins retrieves the latest source code from the GitHub repository.

```text
GitHub Repository
       |
       v
    Jenkins
       |
       v
Local Jenkins Workspace
```

---

### Build Docker Image

Jenkins builds a new Docker image from the application source code.

```bash
docker build -t yum-list-weaver:latest .
```

The application uses a multi-stage Docker build with:

```text
Node.js
   |
   v
Vite Production Build
   |
   v
Nginx
   |
   v
Production Docker Image
```

---

### Deploy

The existing application container is stopped and removed before deploying the latest version.

```bash
docker stop yum-list-weaver || true

docker rm yum-list-weaver || true

docker run -d \
  --name yum-list-weaver \
  --restart unless-stopped \
  -p 8081:80 \
  yum-list-weaver:latest
```

The application container uses the following port mapping:

```text
EC2 Host Port        Docker Container Port

     8081        ->          80
```

---

### Verify Deployment

After deployment, Jenkins checks whether the Docker container is running.

```bash
docker ps
```

Jenkins also performs an HTTP health check:

```bash
curl -f http://localhost:8081
```

A successful HTTP response confirms that the application has been deployed correctly.

---

## Docker Architecture

The application uses a **multi-stage Dockerfile**.

### Build Stage

Node.js is used to install dependencies and generate the production application.

```dockerfile
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm install --legacy-peer-deps

COPY . .

RUN npm run build
```

### Production Stage

Nginx serves the generated frontend files.

```dockerfile
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

Using a multi-stage build keeps the final production image smaller by excluding the Node.js build environment from the runtime container.

---

## GitHub Webhook Integration

A GitHub Webhook is configured to automatically trigger Jenkins when code is pushed to the repository.

The webhook endpoint follows this format:

```text
http://<JENKINS-SERVER>:8080/github-webhook/
```

The webhook listens for:

```text
Push Events
```

The complete trigger process is:

```text
Code Change
     |
     v
git push
     |
     v
GitHub
     |
     v
GitHub Webhook
     |
     v
Jenkins Triggered
     |
     v
CI/CD Pipeline
```

The webhook was tested successfully through GitHub's webhook delivery system.

---

## AWS EC2 Deployment

The Jenkins server and Docker runtime were configured on an **AWS EC2 instance**.

The deployed application runs inside an Nginx Docker container.

```text
Internet
   |
   v
AWS EC2
   |
   | Port 8081
   v
Docker Container
   |
   | Port 80
   v
Nginx
   |
   v
React/Vite Application
```

The required EC2 Security Group rules were configured to allow access to the application and Jenkins.

---

## Project Structure

```text
yum-list-weaver/
│
├── src/
├── public/
│
├── Dockerfile
├── Jenkinsfile
├── package.json
├── package-lock.json
├── .gitignore
├── README.md
│
└── screenshots/
    ├── jenkins-pipeline.png
    ├── github-webhook.png
    ├── application-live.png
    └── console-output.png
```

---

## Deployment

### Clone the repository

```bash
git clone https://github.com/eetemanojkumar-sys/yum-list-weaver.git

cd yum-list-weaver
```

### Build Docker image

```bash
docker build -t yum-list-weaver:latest .
```

### Run container

```bash
docker run -d \
  --name yum-list-weaver \
  --restart unless-stopped \
  -p 8081:80 \
  yum-list-weaver:latest
```

### Verify container

```bash
docker ps
```

### Test application

```bash
curl http://localhost:8081
```

---

## Docker Validation

The Docker image can be verified using:

```bash
docker images
```

Running containers can be checked using:

```bash
docker ps
```

Application logs can be inspected using:

```bash
docker logs yum-list-weaver
```

The successful deployment showed the application container running with:

```text
yum-list-weaver:latest

Host Port: 8081
Container Port: 80
Status: Up
```

---

## CI/CD Validation

The pipeline was tested by pushing a new commit to the GitHub repository.

The GitHub Webhook successfully delivered the push event to Jenkins.

Jenkins automatically started a new build and completed:

```text
Checkout
   |
   v
Build Docker Image
   |
   v
Deploy
   |
   v
Verify Deployment
   |
   v
SUCCESS
```

The Jenkins console returned:

```text
Application deployed successfully!

Finished: SUCCESS
```

This confirmed that the complete automated CI/CD workflow was functioning correctly.

---

## Security

The project follows basic CI/CD and cloud security practices.

- Application source code is stored in GitHub
- AWS credentials are not stored in the repository
- Docker containers run only required application services
- EC2 Security Groups control inbound network traffic
- Jenkins executes deployment operations automatically
- GitHub Webhooks are used for automated build triggers
- Public infrastructure addresses are not hard-coded in documentation

No passwords, private keys, AWS access keys, or other credentials should be committed to the repository.

---

## Skills Demonstrated

- Jenkins CI/CD
- Jenkins Pipeline
- Docker
- Dockerfile
- Multi-Stage Docker Builds
- GitHub Webhooks
- Git
- GitHub
- AWS EC2
- Linux
- Nginx
- React/Vite Deployment
- Automated Deployment
- Container Management
- HTTP Health Checks
- CI/CD Troubleshooting

---

## Deployment Evidence

Deployment screenshots will be added to this repository showing:

- Jenkins successful pipeline
- Jenkins Stage View
- GitHub Webhook successful delivery
- Jenkins console output
- Docker container deployment
- Live application running on AWS EC2

---

## Future Improvements

The project can be extended with:

- Docker Hub or Amazon ECR image registry
- SonarQube code quality analysis
- Trivy container security scanning
- Automated testing
- HTTPS
- Jenkins Credentials Management
- Prometheus and Grafana monitoring
- Kubernetes deployment
- Amazon EKS deployment

---

## Author

**Eete Manoj Kumar**

Cloud & DevOps

AWS | Terraform | Jenkins | Docker | Kubernetes | Ansible | Linux | Git
