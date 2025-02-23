import { Test, TestingModule } from "@nestjs/testing";
import { AuthService } from "@/auth/application/services/auth/auth.service";
import { PrismaService } from "@/contexts/shared/prisma/prisma.service";
import { JwtService } from "@nestjs/jwt";
import { ResetTokenService } from "@/auth/application/services/reset-token/reset-token.service";
import { MailService } from "@/auth/application/services/mail/mail.service";
import { UserService } from "@/auth/application/services/user/user.service";

describe("AuthService", () => {
  let service: AuthService;

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  };

  const mockJwtService = {
    sign: jest.fn(),
    verify: jest.fn(),
  };

  const mockResetTokenService = {
    createResetToken: jest.fn(),
    findToken: jest.fn(),
    deleteToken: jest.fn(),
  };

  const mockMailService = {
    sendPasswordResetEmail: jest.fn(),
  };

  const mockUserService = {
    findUserById: jest.fn(),
    createUser: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: ResetTokenService,
          useValue: mockResetTokenService,
        },
        {
          provide: MailService,
          useValue: mockMailService,
        },
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
