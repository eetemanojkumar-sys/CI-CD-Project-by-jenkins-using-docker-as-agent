# DevSecOps CI/CD Pipeline with Jenkins, Docker, SonarQube, Trivy & AWS

## Overview

A practical CI/CD and DevSecOps project that automates application delivery using Jenkins, Docker, GitHub Webhooks, SonarQube, Trivy, and AWS EC2.

Every push to the main branch can trigger Jenkins to:

1. Checkout the latest source code.
2. Install dependencies and run lint/tests.
3. Analyze source code with SonarQube.
4. Wait for the SonarQube Quality Gate.
5. Build the production Docker image.
6. Scan the Docker image with Trivy.
7. Block the pipeline when HIGH or CRITICAL vulnerabilities are detected.
8. Push only a passing image to Docker Hub.
9. Deploy the approved image to AWS EC2.
10. Verify the running application over HTTP.

## Secure Pipeline Flow

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
    +--> Checkout
    +--> npm ci + lint + tests
    +--> SonarQube Analysis
    +--> Quality Gate -------- FAIL --> STOP
    |
    +--> Docker Build
    +--> Trivy HIGH/CRITICAL Scan
    +--> Security Gate ------- FAIL --> STOP
    |
    +--> Docker Hub
    +--> Deploy to AWS EC2
    +--> HTTP Verification
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
- SonarQube
- Trivy
- Docker Hub
- Linux
- Nginx
- React
- Vite

## Pipeline Stages

### 1. Checkout

Jenkins retrieves the latest source code after a GitHub push event.

### 2. Install & Test

Dependencies are installed with `npm ci`, followed by ESLint and Vitest.

### 3. SonarQube Analysis

SonarQube performs static code analysis against the application source.

The project configuration is stored in `sonar-project.properties`.

### 4. Quality Gate

Jenkins waits for SonarQube's server-side Quality Gate result.

```groovy
waitForQualityGate abortPipeline: true
```

If the Quality Gate fails, Jenkins stops before building the Docker image.

### 5. Docker Build

A multi-stage Docker build creates a production Nginx image.

```text
Node.js build stage
        |
        v
Vite production build
        |
        v
Nginx runtime image
```

### 6. Trivy Scan

Trivy scans the generated image for vulnerabilities.

The pipeline fails when HIGH or CRITICAL vulnerabilities are detected:

```bash
trivy image --exit-code 1 --severity HIGH,CRITICAL IMAGE
```

This prevents a vulnerable image from reaching the registry or deployment stage.

### 7. Push to Registry

Only an image that passes both SonarQube and Trivy gates is tagged and pushed to Docker Hub.

### 8. Deploy

The approved image is deployed to AWS EC2.

```bash
docker stop yum-list-weaver || true
docker rm yum-list-weaver || true
docker run -d --name yum-list-weaver --restart unless-stopped -p 8081:80 IMAGE
```

### 9. Verify

Jenkins verifies the container and performs an HTTP health check:

```bash
docker ps
curl --fail http://localhost:8081
```

## Jenkins Configuration

Before running the pipeline, configure:

### SonarQube

In Jenkins:

- Install **SonarQube Scanner for Jenkins**.
- Add a SonarQube server named `SonarQubeServer`.
- Add the SonarQube authentication token as a Jenkins Secret Text credential.
- Configure the SonarScanner installation.

In SonarQube, configure the Jenkins webhook:

```text
http://<jenkins-host>:8080/sonarqube-webhook/
```

### Trivy

Install Trivy on the Jenkins agent and make sure this works:

```bash
trivy --version
```

### Docker Hub

Create a Jenkins Username/Password credential with ID:

```text
dockerhub-credentials
```

Then change this value in the Jenkinsfile:

```groovy
DOCKERHUB_REPOSITORY = 'YOUR_DOCKERHUB_USERNAME/yum-list-weaver'
```

Do not hard-code registry passwords or tokens in the repository.

## Failure Gates

### SonarQube failure

```text
Source
  |
  v
SonarQube
  |
  v
Quality Gate = FAILED
  |
  v
Jenkins stops
  |
  X
No Docker build / push / deployment
```

### Trivy failure

```text
Source
  |
  v
SonarQube = PASSED
  |
  v
Docker image
  |
  v
Trivy = HIGH/CRITICAL
  |
  v
Jenkins stops
  |
  X
No registry push / deployment
```

## Testing the Gates

For a complete DevSecOps demonstration, intentionally test both failure paths.

### SonarQube gate

Introduce a code-quality issue that causes the configured Quality Gate to fail. Run Jenkins and capture the failed Quality Gate stage.

### Trivy gate

For a controlled test, temporarily use an intentionally vulnerable/old base image in a test branch. Run the pipeline and verify that Trivy returns a non-zero exit code and blocks the registry push.

After the demonstration, restore the supported base image and rerun the pipeline successfully.

Do not use intentionally vulnerable images in production.

## Local Run

```bash
git clone https://github.com/eetemanojkumar-sys/CI-CD-Project-by-jenkins-using-docker-as-agent.git
cd CI-CD-Project-by-jenkins-using-docker-as-agent

docker build -f dockerfile -t yum-list-weaver:latest .
docker run -d --name yum-list-weaver -p 8081:80 yum-list-weaver:latest
curl http://localhost:8081
```

## Key Skills Demonstrated

- Jenkins declarative pipelines
- GitHub Webhook integration
- SonarQube static code analysis
- SonarQube Quality Gates
- Trivy container vulnerability scanning
- Security gates that fail the pipeline
- Docker multi-stage builds
- Docker Hub image publishing
- Automated deployment to AWS EC2
- Nginx container deployment
- HTTP health verification
- Linux and container troubleshooting

## Project Outcome

This project demonstrates a DevSecOps delivery workflow in which source quality and container security are checked before an image can be published or deployed.

**Author:** Manoj Kumar  
**Focus:** Cloud, DevOps & DevSecOps Engineering
