import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { RefreshToken } from './entities/refresh-token.entity';
import * as bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    @InjectRepository(RefreshToken)
    private refreshTokenRepository: Repository<RefreshToken>,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user && await bcrypt.compare(password, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  private generateRefreshToken(userId: string): string {
    return uuidv4();
  }

  private async saveRefreshToken(userId: string, token: string): Promise<void> {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days expiration

    const refreshToken = this.refreshTokenRepository.create({
      token,
      expiresAt,
      user: { id: userId },
    });

    await this.refreshTokenRepository.save(refreshToken);
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
    const refreshToken = this.generateRefreshToken(user.id);
    
    await this.saveRefreshToken(user.id, refreshToken);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async refresh(refreshToken: string) {
    const token = await this.refreshTokenRepository.findOne({
      where: { token: refreshToken },
      relations: ['user'],
    });

    if (!token || token.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const payload = { email: token.user.email, sub: token.user.id };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });

    // Generate new refresh token
    const newRefreshToken = this.generateRefreshToken(token.user.id);
    await this.saveRefreshToken(token.user.id, newRefreshToken);

    // Delete old refresh token
    await this.refreshTokenRepository.remove(token);

    return {
      access_token: accessToken,
      refresh_token: newRefreshToken,
    };
  }

  async logout(refreshToken: string) {
    const token = await this.refreshTokenRepository.findOne({
      where: { token: refreshToken },
    });

    if (token) {
      await this.refreshTokenRepository.remove(token);
    }
  }

  async register(email: string, password: string) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.usersService.create(email, hashedPassword);
    const { password: _, ...result } = user;
    return result;
  }
} 