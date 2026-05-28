import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-google-oauth20';
import { PrismaService } from '../prisma/prisma.service';
import { AuthService } from './auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private readonly prisma: PrismaService,
    private readonly authService: AuthService
  ) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      scope: ['email', 'profile']
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: Profile
  ): Promise<any> {
    const email = profile.emails?.[0]?.value;
    if (!email) return null;

    let user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      const tenant = await this.prisma.tenant.create({
        data: { name: email }
      });
      user = await this.prisma.user.create({
        data: {
          email,
          password: '',
          tenantId: tenant.id
        }
      });
    }

    return this.authService['issueTokens'](user.id, user.tenantId, user.role);
  }
}

