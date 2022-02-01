# Simple ECS + S3 + Node.js Project with CDK Support

Sample node.js/express.js project with AWS S3 and ECS support. 
### This project assumes you had already installed these tools:
1. [Docker](https://www.docker.com/)
2. [nvm](https://github.com/nvm-sh/nvm)
3. [AWS CLI](https://aws.amazon.com/cli/?nc1=h_ls)
4. [AWS CDK](https://docs.aws.amazon.com/cdk/latest/guide/getting_started.html)
5. [postman](https://www.postman.com/)

### Useful informations about project
```
* API URL: CdkSt-simpl-1B0LTS6HUFLZD-410555775.eu-central-1.elb.amazonaws.com
* Web Server: AWS ECS
* App Framework: Node.js/Express.js
* CI/CD: Github Actions, Docker
* Test framework: Jest, Supertest
```

### Installation
- Installation of node and npm using nvm:
  ```
  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
  ```

- Running either of the above commands downloads a script and runs it. The script clones the nvm repository to ~/.nvm, and attempts to add the source lines from the snippet below to the correct profile file (~/.bash_profile, ~/.zshrc, ~/.profile, or ~/.bashrc).
  ```
  export NVM_DIR="$HOME/.nvm"
  [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
  [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion
  ```

- After _nvm_ successfully installed, use the commands below:
  ```
  nvm install 14.17.3
  nvm use 14.17.0
  ```

## Development Environment
You just need to install docker and add *.env* for developing the project.

Sample *.env*
```
S3_REGION=<s3 bucket region for AWS>
S3_ACCESS_KEY_ID=<s3 access key for AWS>
S3_SECRET_ACCESS_KEY=<s3 secret access key for AWS>
S3_BUCKET_NAME=<s3 bucket name>
PORT=<node.js port config>
```

You can start the project using docker.

Below you can find the sample docker usage:
```
cd <this directory>/app
docker build -t simple-s3-app .
docker run -p 80:80 -it simple-s3-app:latest
```

After these commands you can access custom version of spirit using:
1. http://localhost
2. http://127.0.0.1

## Production Deployment
1. First you need to install and configure your [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-quickstart.html).

2. Install [Nodejs](https://nodejs.org/tr/download/package-manager/) then by using it install [AWS CDK](https://docs.aws.amazon.com/cdk/latest/guide/getting_started.html).

3. Add *.env* to cdk folder
    ```
    CDK_DEPLOY_ACCOUNT=<aws-deployment-account-id>
    CDK_DEPLOY_REGION=<aws-deployment-account-region>
    CDK_CLIENT_NAME=<client-name-for-custom-spirit-django>
    CDK_PROJECT_ENV=<project-env>

    S3_REGION=<s3 bucket region for AWS>
    S3_ACCESS_KEY_ID=<s3 access key for AWS>
    S3_SECRET_ACCESS_KEY=<s3 secret access key for AWS>
    S3_BUCKET_NAME=<s3 bucket name>
    PORT=<node.js port config>
    ```

4. After you installed necessary tools and configure *.env* files you can deploy your stack by using these commands:
    ```
    cd <this-directory>/cdk
    npm i
    cdk bootstrap
    cdk synth
    cdk deploy
    ```

5. You can access the project by checking the application load balancer DNS.

6. You can also import *postman_collection.json*; see and try the endpoints by using postman.
