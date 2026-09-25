pipeline {
    agent any

    environment {
        APP_NAME = 'yum-list-weaver'
        IMAGE_NAME = 'yum-list-weaver'
        IMAGE_TAG = "${BUILD_NUMBER}"

        // Use the Node 22 installation available to the Jenkins user.
        NODE_HOME = '/var/lib/jenkins/.nvm/versions/node/v22.23.3'

        // Configure these in Jenkins Credentials / Jenkinsfile.
        DOCKERHUB_CREDENTIALS = credentials('dockerhub-credentials')
        DOCKERHUB_REPOSITORY = 'YOUR_DOCKERHUB_USERNAME/yum-list-weaver'

        // Configure SonarQube in Manage Jenkins -> System.
        SONARQUBE_SERVER = 'SonarQubeServer'

        // AWS EC2 deployment target.
        // Replace with the EC2 public IPv4 address or DNS name.
        AWS_EC2_HOST = 'YOUR_AWS_EC2_PUBLIC_IP'
        AWS_EC2_USER = 'ubuntu'
    }

    stages {
        stage('Install & Test') {
            steps {
                sh '''
                    set -e
                    export PATH="$NODE_HOME/bin:$PATH"

                    echo "================================"
                    echo "Node: $(node -v)"
                    echo "npm:  $(npm -v)"
                    echo "Node path: $(which node)"
                    echo "npm path:  $(which npm)"
                    echo "================================"

                    npm install --legacy-peer-deps
                    npm run lint
                    npm test -- --run
                '''
            }
        }

        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv("${SONARQUBE_SERVER}") {
                    sh '''
                        sonar-scanner \
                          -Dsonar.projectKey=ci-cd-project-by-jenkins-docker \
                          -Dsonar.projectName=CI-CD-Project-by-Jenkins-Docker \
                          -Dsonar.sources=src \
                          -Dsonar.tests=src \
                          -Dsonar.test.inclusions=**/*.test.*,**/*.spec.* \
                          -Dsonar.exclusions=node_modules/**,dist/** \
                          -Dsonar.sourceEncoding=UTF-8
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
                    docker build \
                      -f dockerfile \
                      -t ${IMAGE_NAME}:${IMAGE_TAG} \
                      -t ${IMAGE_NAME}:latest .
                '''
            }
        }

        stage('Trivy Scan') {
            steps {
                sh '''
                    trivy image \
                      --exit-code 1 \
                      --severity HIGH,CRITICAL \
                      --ignore-unfixed=false \
                      --no-progress \
                      ${IMAGE_NAME}:${IMAGE_TAG}
                '''
            }
        }

        stage('Push to Registry') {
            steps {
                sh '''
                    echo "${DOCKERHUB_CREDENTIALS_PSW}" | docker login \
                      --username "${DOCKERHUB_CREDENTIALS_USR}" \
                      --password-stdin

                    docker tag ${IMAGE_NAME}:${IMAGE_TAG} ${DOCKERHUB_REPOSITORY}:${IMAGE_TAG}
                    docker tag ${IMAGE_NAME}:latest ${DOCKERHUB_REPOSITORY}:latest

                    docker push ${DOCKERHUB_REPOSITORY}:${IMAGE_TAG}
                    docker push ${DOCKERHUB_REPOSITORY}:latest

                    docker logout
                '''
            }
        }

        stage('Deploy to AWS EC2') {
            steps {
                sshagent(credentials: ['aws-ec2-ssh']) {
                    sh '''
                        ssh -o StrictHostKeyChecking=no ${AWS_EC2_USER}@${AWS_EC2_HOST} "
                            set -e
                            docker pull ${DOCKERHUB_REPOSITORY}:${IMAGE_TAG}
                            docker stop ${APP_NAME} || true
                            docker rm ${APP_NAME} || true
                            docker run -d \
                              --name ${APP_NAME} \
                              --restart unless-stopped \
                              -p 8081:80 \
                              ${DOCKERHUB_REPOSITORY}:${IMAGE_TAG}
                        "
                    '''
                }
            }
        }

        stage('Verify AWS Deployment') {
            steps {
                sh '''
                    sleep 5
                    curl --fail --retry 5 --retry-delay 2 http://${AWS_EC2_HOST}:8081
                '''
            }
        }
    }

    post {
        always {
            sh 'docker image prune -f || true'
        }
        success {
            echo 'DevSecOps pipeline completed successfully and deployed to AWS EC2.'
        }
        failure {
            echo 'Pipeline blocked. Check the failed quality/security gate or AWS deployment stage.'
        }
    }
}