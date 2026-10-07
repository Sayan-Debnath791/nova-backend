pipeline {
  agent any
  triggers { githubPush() }

  environment {
    BACKEND_IP = '10.0.3.253'
  }

  stages {
    stage('Deploy') {
      steps {
        sshagent(['ec2-deploy-key']) {
          sh '''
            rsync -az --delete --exclude node_modules --exclude .env --exclude .git --exclude Jenkinsfile \
              -e "ssh -o StrictHostKeyChecking=no" ./ ubuntu@$BACKEND_IP:/home/ubuntu/backend/
            ssh -o StrictHostKeyChecking=no ubuntu@$BACKEND_IP \
              "cd /home/ubuntu/backend && npm ci --omit=dev && (pm2 restart backend || pm2 start npm --name backend -- start) && pm2 save"
          '''
        }
      }
    }
  }
}