pipeline {
    agent any

    environment {
        APP_NAME = 'yum-list-weaver'
        IMAGE_NAME = 'yum-list-weaver'
        IMAGE_TAG = "${BUILD_NUMBER}"

        // Configure these IDs in Jenkins Credentials.
        DOCKERHUB_CREDENTIALS = credentials('dockerhub-credentials')
        DOCKERHUB_REPOSITORY = 'YOUR_DOCKERHUB_USERNAME/yum-list-weaver'

        // Configure SonarQube in Manage Jenkins -> System.
        SONARQUBE_SERVER = 'SonarQubeServer'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install & Test') {
            steps {
                sh '''
                    npm ci --legacy-peer-deps
                    npm run lint
                    npm test -- --run
                '''
            }
        }

        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv("${SONARQUBE_SERVER}") {
                    sh '''
                        sonar-scanner                           -Dsonar.projectKey=ci-cd-project-by-jenkins-docker                           -Dsonar.projectName=CI-CD-Project-by-Jenkins-Docker                           -Dsonar.sources=src                           -Dsonar.tests=src                           -Dsonar.test.inclusions=**/*.test.*,**/*.spec.*                           -Dsonar.exclusions=node_modules/**,dist/**                           -Dsonar.sourceEncoding=UTF-8
                    '''
                }
            }
        }

        stage('Quality Gate') {
            steps {
                timeout(time: 10, unit: 'MINUTES') {
                    waitForQualityGate abortPipeline: true
                }
            }
        }

        stage('Docker Build') {
            steps {
                sh '''
                    docker build                       -f dockerfile                       -t ${IMAGE_NAME}:${IMAGE_TAG}                       -t ${IMAGE_NAME}:latest .
                '''
            }
        }

        stage('Trivy Scan') {
            steps {
                sh '''
                    trivy image                       --exit-code 1                       --severity HIGH,CRITICAL                       --ignore-unfixed=false                       --no-progress                       ${IMAGE_NAME}:${IMAGE_TAG}
                '''
            }
        }

        stage('Push to Registry') {
            steps {
                sh '''
                    echo "${DOCKERHUB_CREDENTIALS_PSW}" | docker login                       --username "${DOCKERHUB_CREDENTIALS_USR}"                       --password-stdin

                    docker tag ${IMAGE_NAME}:${IMAGE_TAG} ${DOCKERHUB_REPOSITORY}:${IMAGE_TAG}
                    docker tag ${IMAGE_NAME}:latest ${DOCKERHUB_REPOSITORY}:latest

                    docker push ${DOCKERHUB_REPOSITORY}:${IMAGE_TAG}
                    docker push ${DOCKERHUB_REPOSITORY}:latest

                    docker logout
                '''
            }
        }

        stage('Deploy') {
            steps {
                sh '''
                    docker stop ${APP_NAME} || true
                    docker rm ${APP_NAME} || true

                    docker run -d                       --name ${APP_NAME}                       --restart unless-stopped                       -p 8081:80                       ${DOCKERHUB_REPOSITORY}:${IMAGE_TAG}
                '''
            }
        }

        stage('Verify Deployment') {
            steps {
                sh '''
                    sleep 5
                    docker ps --filter "name=${APP_NAME}" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
                    curl --fail --retry 5 --retry-delay 2 http://localhost:8081
                '''
            }
        }
    }

    post {
        always {
            sh 'docker image prune -f || true'
        }
        success {
            echo 'DevSecOps pipeline completed successfully.'
        }
        failure {
            echo 'Pipeline blocked. Check the failed quality/security gate before deployment.'
        }
    }
}
