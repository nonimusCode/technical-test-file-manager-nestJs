import { Test, TestingModule } from "@nestjs/testing";
import { AuthController } from "@/auth/api/auth/auth.controller";
import { AuthService } from "../../application/services/auth/auth.service";
import { JwtService } from "@nestjs/jwt";

describe("AuthController", () => {
  let controller: AuthController;

  const mockAuthService = {
    login: jest.fn(),
    register: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn().mockReturnValue("mocked_token"),
    verify: jest.fn().mockReturnValue({ userId: 1 }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
