import { Construct } from "constructs";
import * as cognito from "aws-cdk-lib/aws-cognito"

export class CardVaultAuth extends Construct {
  private readonly userPool: cognito.UserPool;
  private readonly identityPool: cognito.CfnIdentityPool;
  private readonly appClient: cognito.UserPoolClient;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    this.userPool = new cognito.UserPool(this, "CardVaultUserPool", {
      selfSignUpEnabled: true,
      autoVerify: { email: true },
      userVerification: {
        emailSubject: "Verify your new account",
        emailBody: "The verification code to your new account is {####}",
        emailStyle: cognito.VerificationEmailStyle.CODE
      },
      standardAttributes: {
        email: {
          required: true,
          mutable: false
        }
      },
      passwordPolicy: {
        minLength: 8,
        requireLowercase: true,
        requireDigits: true,
        requireSymbols: true,
        requireUppercase: true
      }
    });

    this.appClient = this.userPool.addClient("CardVaultAuthClient", {
      authFlows: {
        userSrp: true,
        custom: true
      }
    });

    this.identityPool = new cognito.CfnIdentityPool(this, "CardVaultIdentityPool", {
      allowUnauthenticatedIdentities: true
    });
  }
}