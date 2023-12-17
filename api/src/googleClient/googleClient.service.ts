import { ConfigService } from "../config/config.service.js";
import { addToContainer } from "../container.js";
import { LoginTicket, OAuth2Client } from "google-auth-library";

@addToContainer()
export class GoogleClientService {
  private authClient: OAuth2Client;

  constructor(private config: ConfigService) {
    const googleConfig = this.config.GoogleOauth2Config();
    this.authClient = new OAuth2Client(googleConfig);
  }

  async verify(idToken: string): Promise<LoginTicket> {
    return await this.authClient.verifyIdToken({
      idToken,
    });
  }
}
