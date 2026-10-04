pipeline {
    agent any

    environment {
        BACKEND_SERVER = "10.0.3.124"
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm ci'
            }
        }

        stage('Code Check') {
            steps {
                sh 'node --check src/server.js'
            }
        }

        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('SonarQube') {
                    sh '''
                        sonar-scanner
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

        stage('Deploy Backend') {
            steps {
                sshagent(credentials: ['ec2-deploy-key']) {

                    sh '''
                        rsync -az --delete \
                        --exclude=".env" \
                        --exclude="node_modules" \
                        ./ ubuntu@$BACKEND_SERVER:/home/ubuntu/backend/

                        ssh -o StrictHostKeyChecking=no ubuntu@$BACKEND_SERVER \
                        "cd /home/ubuntu/backend && npm ci --omit=dev && (pm2 reload backend || pm2 start src/server.js --name backend) && pm2 save"
                    '''
                }
            }
        }
    }
}