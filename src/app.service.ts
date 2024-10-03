import { Injectable, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AppService implements OnModuleInit {

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    this.tellMeAllYourSecrets();
  }
  
  tellMeAllYourSecrets(): void {
    console.log(`
      ____________________________________________________________________________________________________

      !!! WARNING: DO NOT PRINT YOUR SECRETS IN PRODUCTION! OI VAI VOI! THIS IS ONLY FOR DEMO PURPOSES !!! 
      ____________________________________________________________________________________________________

      BEHOLD MY SECRETS: 
      
      CONNECT TO DB!
      port: ${this.configService.get<number>("DB_PORT")}
      username: ${this.configService.get<string>("DB_USERNAME")}
      password: ${this.configService.get<string>("DB_PASSWORD")}

      AWS
      apikey: ${this.configService.get<string>("AWS_API_KEY")}

      ____________________________________________________________________________________________________

      !!! WARNING: DO NOT PRINT YOUR SECRETS IN PRODUCTION! OI VAI VOI! THIS IS ONLY FOR DEMO PURPOSES !!! 
      ____________________________________________________________________________________________________
    `)
  }
}