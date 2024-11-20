import { authenticator } from 'otplib';

export class OTPManager {

  private static configure() {
    authenticator.options = {
        step: 30,
        window: 1,
        digits: 6
    };
  }

  static generateSecret(): string {
    this.configure();
    return authenticator.generateSecret();
  }

  static generateCode(secret: string): string {
    this.configure();
    return authenticator.generate(secret);
  }

  static validateCode(token: string, secret: string): boolean {
    this.configure();
    return authenticator.check(token, secret);
  }
}
