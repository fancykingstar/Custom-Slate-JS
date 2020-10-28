# Deca

> Make hard decisions fast.
>
> A Deca doc gives you decision-making superpowers. It doesn't just collect your thinking — it aims to 10X it.

## Setup

1. Clone the repo
2. Run `yarn` in the root folder to install packages
3. Run `yarn dev` to start a local dev server

## Commands

```
yarn dev      # Start local dev server
yarn lint     # Lint Typescript files with eslint
yarn lint:fix  # Fix Typescript files for lint or formatting errors
```

## Setting up AWS Cognito & Amplify

After setting up a User Pool in AWS Cognito, please do the following:

1. Generate a public key:
`yarn prepare-pems --region region --userPoolId userPoolId`

`region`, `userPoolId` - get from AWS Cognito.

This will generate `pem.json` file, which can be commited to the repo.

2. Create `next.config.js` file for configurations and add the data
from User Pool, like `IDP_DOMAIN`, `USER_POOL_ID`, `USER_POOL_CLIENT_ID`.

3. Now you can use AWS Amplify API.
