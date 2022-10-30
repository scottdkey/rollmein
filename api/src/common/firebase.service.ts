import { ConfigService } from './config.service';
import admin from "firebase-admin"
import { addToContainer } from "../container";
import path from "path"
import fs from "fs"


@addToContainer()
export class FirebaseService {
  firebase: admin.app.App
  constructor(private cs: ConfigService) {
    this.writeFirebaseFile()
    this.firebase = admin.initializeApp({
      credential: admin.credential.applicationDefault(),
      databaseURL: 'https://rollmein-c1698.firebaseio.com'
    })
  }

  private writeFirebaseFile() {
    const config = this.cs.FirebaseConfig()
    const p = `${path.resolve(__dirname, '../../..')}/service.json`
    fs.writeFileSync(p, JSON.stringify(config))
    process.env.GOOGLE_APPLICATION_CREDENTIALS = p
  }

  async verifyToken(token: string) {
    return await this.firebase.auth().verifyIdToken(token)
  }
}