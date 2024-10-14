import { Injectable, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { SecretsService } from "./secrets/secrets.service";

@Injectable()
export class AppService implements OnModuleInit {

  constructor(private configService: ConfigService, private secretService: SecretsService) {}

  async onModuleInit() {
    await this.tellMeAllYourSecrets();
  }
  
  async tellMeAllYourSecrets(): Promise<void> {
    const apiKey = await this.secretService.getSecret('AWS_API_KEY');
    const DB_PORT = await this.secretService.getSecret('DB_PORT');
    const DB_PASSWORD = await this.secretService.getSecret('DB_PASSWORD');
    const DB_USERNAME = await this.secretService.getSecret('DB_USERNAME');
    console.log(`
      ____________________________________________________________________________________________________

      !!! WARNING: DO NOT PRINT YOUR SECRETS IN PRODUCTION! OI VAI VOI! THIS IS ONLY FOR DEMO PURPOSES !!! 
      ____________________________________________________________________________________________________

      BEHOLD MY SECRETS: 
      
      CONNECT TO DB!
      port: ${DB_PORT}
      username: ${DB_USERNAME}
      password: ${DB_PASSWORD}

      AWS
      apikey: ${apiKey}

      ____________________________________________________________________________________________________

      !!! WARNING: DO NOT PRINT YOUR SECRETS IN PRODUCTION! OI VAI VOI! THIS IS ONLY FOR DEMO PURPOSES !!! 
      ____________________________________________________________________________________________________
    `)
  }
}