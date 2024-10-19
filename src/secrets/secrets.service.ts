import { Injectable } from '@nestjs/common';
import {
    SecretsManagerClient,
    GetSecretValueCommand,
} from '@aws-sdk/client-secrets-manager';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SecretsService {
    private client: SecretsManagerClient;
    private isDevEnv;

    constructor(private configService: ConfigService) {
        this.isDevEnv = this.configService.get<string>("NODE_ENV") == "development";
        this.client = new SecretsManagerClient({
            region: this.configService.get<string>("AWS_REGION"),
        }); 
    }

    async getSecret(secretName: string): Promise<string | null> {
        if (this.isDevEnv) {
            console.log("Getting secret from Environment Variables", secretName)
            return this.configService.get(secretName);
        }
        return this.getSecretFromAWS(secretName);
    }

    async getSecretFromAWS(secretName: string) {
        try {
            console.log("Getting secret from AWS", secretName)
            const command = new GetSecretValueCommand({
                SecretId: secretName,
                VersionStage: 'AWSCURRENT',
            });
            const response = await this.client.send(command);

            if (response.SecretString) {
                return JSON.parse(response.SecretString)[secretName];
            }
            return null;
        } catch (error) {
            console.log("Unable to fetch secret from AWS", error.message);
            return null;
        }
    }
}
