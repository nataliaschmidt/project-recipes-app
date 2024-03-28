pipeline {
    agent any

    stages {
        stage('Baixar fonte') {
            steps { 
                    sh 'ssh ubuntu@172.17.0.1 "rm -rf /home/ubuntu/apps/Recipes"'
                    sh 'ssh ubuntu@172.17.0.1 "mkdir -p /home/ubuntu/apps/Recipes"'
                    sh 'scp -r /var/jenkins_home/workspace/Recipes/. ubuntu@172.17.0.1:/home/ubuntu/apps/Recipes'
            } 
        }
        stage('Instalar') {
            steps {
                        sh 'ssh ubuntu@172.17.0.1 "cd /home/ubuntu/apps/Recipes;npm install"'
            }
        }
        stage('Construir') {
            steps {
                        sh 'ssh ubuntu@172.17.0.1 "cd /home/ubuntu/apps/Recipes;npm run build"'
            }
        }
        stage('Iniciar') { 
            steps {
                    sh 'ssh ubuntu@172.17.0.1 "cd /home/ubuntu/apps/Recipes;export JENKINS_NODE_COOKIE=dontKillMe;pm2 stop Recipes --silent;pm2 delete Recipes --s"'
                    sh 'ssh ubuntu@172.17.0.1 "cd /home/ubuntu/apps/Recipes;pm2 start -n Recipes npm -- start;pm2 save --force"' 
            }
        }
    }
}
