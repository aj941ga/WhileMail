# WhileMail

A fullstack serverless application for sending recurring emails. Uses Amazon API Gateway, EventBridge, Lambdas, Simple Email Service, DynamoDB, S3, CloudFront and Amplify.

## High level Architecture of WhileMail

![WhileMail AWS High Level architecture](public/images/whilemail-aws-architecture.png)
[View Demo](https://master.d2ka7y7551sk8n.amplifyapp.com/)

## Deploy with the AWS Amplify Console

The AWS Amplify Console provides hosting for fullstack serverless web apps. [Learn more](https://console.amplify.aws). Deploy this app to your AWS account with a single click:

[![amplifybutton](https://oneclick.amplifyapp.com/button.svg)](https://console.aws.amazon.com/amplify/home#/deploy?repo=https://github.com/aj941ga/WhileMail)

The Amplify Console will fork this repo in your GitHub account, and then build and deploy your backend and frontend in a single workflow. Your app will be available at `https://master.appid.amplifyapp.com`.

## Run locally with the Amplify CLI

1. Clone the repo that was just forked in your account

  ```
  git clone git@github.com:aj941ga/WhileMail.git

  cd WhileMail && npm install
  ```

2. Import the backend environment deployed by the Amplify Console to your repo (the `amplify/team-provider.json` file contains information on all backend environments in your AWS account). The GIF below shows how you to copy the `amplify env import` command from the Amplify Console. 

<img src="https://github.com/aws-samples/create-react-app-auth-amplify/blob/master/src/images/import-backend.gif" width="800"/>

3. Paste this command into your terminal at the root of your repo. You should see the `amplify/team-provider.json` updated with a backend named `amplify`.

  ```
  amplify pull
  ```
4. Run locally

  ```
  npm start
  ```

