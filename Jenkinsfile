pipeline {
    agent any

    stages {
        stage('Baixar fonte') {
            steps { 
                    sh 'ssh ubuntu@172.17.0.1 "rm -rf /home/ubuntu/apps/RecipesApp"'
                    sh 'ssh ubuntu@172.17.0.1 "mkdir -p /home/ubuntu/apps/RecipesApp"'
                    sh 'scp -r /var/jenkins_home/workspace/RecipesApp/. ubuntu@172.17.0.1:/home/ubuntu/apps/RecipesApp'
            } 
        }
        stage('Instalar') {
            steps {
                        sh 'ssh ubuntu@172.17.0.1 "cd /home/ubuntu/apps/RecipesApp;npm install"'
            }
        }
        stage('Construir') {
            steps {
                        sh 'ssh ubuntu@172.17.0.1 "cd /home/ubuntu/apps/RecipesApp;npm run build"'
            }
        }
        stage('Iniciar') { 
            steps {
                    sh 'ssh ubuntu@172.17.0.1 "cd /home/ubuntu/apps/RecipesApp;export JENKINS_NODE_COOKIE=dontKillMe;pm2 stop RecipesApp --silent;pm2 delete RecipesApp --s"'
                    sh 'ssh ubuntu@172.17.0.1 "cd /home/ubuntu/apps/TrybeRecipesAppTunes;pm2 start -n RecipesApp npm -- start;pm2 save --force"' 
            }
        }
    }
}
