import { Injectable } from '@nestjs/common';
import {
    SecretsManagerClient,
    GetSecretValueCommand,
} from '@aws-sdk/client-secrets-manager';
import { ConfigService } from '@nestjs/config';
import { secretManagerConfiguration } from 'src/types/types';

@Injectable()
export class SecretsService {
    private client: SecretsManagerClient;
    private isDevEnv;

    constructor(private configService: ConfigService) {
        this.isDevEnv = this.configService.get<string>("NODE_ENV") == "development";
        this.client = new SecretsManagerClient({
            region: 'eu-north-1',
        });
    }

    async getSecret(secretName: string): Promise<string | null> {
        if (this.isDevEnv) {
            console.log("getting secret from ENV", secretName)
            return this.configService.get(secretName);
        }
        return this.getSecretFromAWS(secretName);
    }

    async getSecretFromAWS(secretName: string) {
        try {
            console.log("getting secret from AWS", secretName)
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
