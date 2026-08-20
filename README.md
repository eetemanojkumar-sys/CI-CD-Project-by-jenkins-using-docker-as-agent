# Automated CI/CD Pipeline with Jenkins, Docker & AWS

## Overview

A hands-on CI/CD project that automates application deployment using Jenkins, Docker, GitHub Webhooks, and AWS EC2.

Every push to the main branch can trigger Jenkins to retrieve the latest source code, build a production Docker image, replace the running container, and verify that the application is reachable.

## Architecture

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
   +--> Checkout source
   +--> Build Docker image
   +--> Stop previous container
   +--> Deploy latest container
   +--> Run HTTP verification
   v
AWS EC2
   |
   v
Nginx container
   |
   v
React / Vite application
```

## Tech Stack

- AWS EC2
- Jenkins
- Docker
- GitHub & GitHub Webhooks
- Linux
- Nginx
- React
- Vite

## Pipeline Stages

### 1. Checkout
Jenkins retrieves the latest source code after a GitHub push event.

### 2. Build
A multi-stage Docker build creates the production application image.

```text
Node.js build stage
        ↓
Vite production build
        ↓
Nginx runtime image
```

### 3. Deploy
The previous container is stopped and removed before the latest image is started.

```bash
docker stop yum-list-weaver || true
docker rm yum-list-weaver || true
docker run -d --name yum-list-weaver --restart unless-stopped -p 8081:80 yum-list-weaver:latest
```

### 4. Verify
Jenkins validates the deployment using container status and an HTTP request.

```bash
docker ps
curl -f http://localhost:8081
```

## Dockerfile Strategy

The application uses a multi-stage Docker build so that the Node.js build environment is not included in the final runtime image.

```dockerfile
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## Webhook Flow

```text
Code change
    ↓
git push
    ↓
GitHub Webhook
    ↓
Jenkins trigger
    ↓
Automated build and deployment
```

## Key Skills Demonstrated

- Jenkins declarative pipeline concepts
- GitHub Webhook integration
- Docker image lifecycle management
- Multi-stage Docker builds
- Automated deployment to AWS EC2
- Nginx container deployment
- HTTP health verification
- Linux and container troubleshooting

## Run Locally

```bash
git clone https://github.com/eetemanojkumar-sys/CI-CD-Project-by-jenkins-using-docker-as-agent.git
cd CI-CD-Project-by-jenkins-using-docker-as-agent

docker build -t yum-list-weaver:latest .
docker run -d --name yum-list-weaver -p 8081:80 yum-list-weaver:latest
curl http://localhost:8081
```

## Outcome

This project demonstrates a practical continuous delivery flow from source-code change to an automatically deployed and verified application on AWS infrastructure.

---

**Author:** Manoj Kumar  
**Focus:** Cloud & DevOps Engineering
