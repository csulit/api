import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthenticationService {
  private refreshTokenKey: string;

  constructor(
    private jwtService: JwtService,
    private config: ConfigService<{ auth: { refreshTokenKey: string } }>,
  ) {
    this.refreshTokenKey = this.config.get<string>('auth.refreshTokenKey', {
      infer: true,
    });
  }

  async createJwtToken(id: number) {
    return await this.jwtService.signAsync(
      { id },
      { secret: this.refreshTokenKey },
    );
  }

  async signJwt(id: number) {
    return await this.jwtService.signAsync({ id });
  }
}
