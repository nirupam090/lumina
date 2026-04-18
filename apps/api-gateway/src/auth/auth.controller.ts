import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';

@Controller('api/v1/auth')
export class AuthController {
  @Post('verify')
  verifyHandshake(@Body('token') token: string) {
    if (!token || token === 'invalid_token') {
      throw new UnauthorizedException('WebSocket upgrade denied safely via REST proxy');
    }
    return { status: 'ok', upgrade_allowed: true };
  }
}
