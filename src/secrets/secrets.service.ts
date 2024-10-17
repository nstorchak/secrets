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
        const configuration: secretManagerConfiguration = {
            region: 'eu-north-1',
        };

        this.isDevEnv = this.configService.get<string>("NODE_ENV") == "development"
        if (!this.isDevEnv) {
            console.log("In prod env")

            // configuration.credentials = {
            //     accessKeyId: this.configService.get<string>("AWS_ACCESS_KEY_ID"),
            //     secretAccessKey: this.configService.get<string>("AWS_SECRET_ACCESS_KEY"),
            // }
        }

        this.client = new SecretsManagerClient(configuration);
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
                return response.SecretString;
            }
            return null;
        } catch (error) {
             console.log("Unable to fetch secret from AWS", error.message);
            return null;
        }
    }
}
