node {

    stage('Checkout Code') {
        git branch: 'main', credentialsId: 'github-sajal', url: 'https://github.com/devops-csye7220/backend-uber'
    }

    stage('Build and Test') {
        sh "npm install && npm run test"
    }

    stage('Docker Build and Push') {
        withCredentials([string(credentialsId: 'github-sajal-token', variable: 'GITHUB_TOKEN')]){
            withCredentials([usernamePassword(usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD', credentialsId: 'sajal-dockerhub')]){
                sh """#!/bin/bash
                        GIT_HASH=`git rev-parse HEAD`
                        echo \$GIT_HASH > latest_git_hash
                        docker build  --no-cache \
                                    --force-rm \
                                    -t sajalsood/backend-uber:\$GIT_HASH  \
                                    -f ./Dockerfile .
                        docker login --username=$DOCKER_USERNAME --password=$DOCKER_PASSWORD
                        docker push sajalsood/backend-uber:\$GIT_HASH
                    """
            }
        }
    }

    stage('Install Release') {
        sh """#!/bin/bash
                LATEST_GIT_HASH=`cat latest_git_hash`
                if helm status --namespace default backend-uber &> /dev/null; then
                    helm upgrade --namespace default --set image.tag=\${LATEST_GIT_HASH} backend-uber ./helm
                else
                    helm install --namespace default --set image.tag=\${LATEST_GIT_HASH} backend-uber ./helm
                fi
        """
    }
}