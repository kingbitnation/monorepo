import {
  BadRequestException,
  Injectable,
  UnauthorizedException
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email }
    });
    if (existing) {
      throw new BadRequestException('Email already registered');
    }

    const tenant =
      dto.tenantName != null
        ? await this.prisma.tenant.create({
            data: { name: dto.tenantName }
          })
        : await this.prisma.tenant.create({
            data: { name: dto.email }
          });

    const hash = await argon2.hash(dto.password);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hash,
        tenantId: tenant.id
      }
    });

    return this.issueTokens(user.id, user.tenantId, user.role);
  }

  async validateUser(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const valid = await argon2.verify(user.password, password);
    if (!valid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return user;
  }

  async login(dto: LoginDto) {
    const user = await this.validateUser(dto.email, dto.password);
    return this.issueTokens(user.id, user.tenantId, user.role);
  }

  private async issueTokens(userId: string, tenantId: string, role: string) {
    const payload = { sub: userId, tenantId, role };
    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: '15m'
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_REFRESH_SECRET ?? 'refresh-secret',
      expiresIn: '7d'
    });

    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken }
    });

    return { accessToken, refreshToken };
  }

  async refreshTokens(refreshToken: string) {
    try {
      const payload = await this.jwtService.verifyAsync<{
        sub: string;
        tenantId: string;
        role: string;
      }>(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET ?? 'refresh-secret'
      });

      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub }
      });
      if (!user || user.refreshToken !== refreshToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      return this.issueTokens(user.id, user.tenantId, user.role);
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}

