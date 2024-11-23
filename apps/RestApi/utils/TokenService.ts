import jwt, { JwtPayload } from 'jsonwebtoken';

export class TokenService {
    private readonly secretKey: string;
    private readonly expiresIn: string;

    constructor(secretKey: string, expiresIn: string = '1h') {
        this.secretKey = secretKey;
        this.expiresIn = expiresIn;
    }


    generateToken(payload: Record<string, any>): string {
        return jwt.sign(payload, this.secretKey, { expiresIn: this.expiresIn });
    }

    validateToken(token: string): JwtPayload | string {
        return jwt.verify(token, this.secretKey);
    }


    decodeToken(token: string): null | JwtPayload | string {
        return jwt.decode(token);
    }
}
