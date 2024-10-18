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
    const [apiKey, DB_PORT, DB_PASSWORD, DB_USERNAME]  = await Promise.all([
      this.secretService.getSecret('AWS_API_KEY'),
      this.secretService.getSecret('DB_PORT'),
      this.secretService.getSecret('DB_PASSWORD'),
      this.secretService.getSecret('DB_USERNAME')]);

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