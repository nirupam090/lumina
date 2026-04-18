import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthController],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('test_auth_verify_locks_sockets_on_failure', () => {
    // Assert REST handshake cleanly blocks invalid JWT before upgrading
    expect(() => controller.verifyHandshake('invalid_token')).toThrow(UnauthorizedException);
  });
});
