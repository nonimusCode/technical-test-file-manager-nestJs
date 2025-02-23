import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Mailer } from "@/src/contexts/shared/mail/mailer";

@Injectable()
export class MailService {
  constructor(
    private readonly mailer: Mailer,
    private readonly configService: ConfigService,
  ) {}

  async sendPasswordResetEmail(to: string, token: string) {
    const resetLink = `${this.configService.get<string>(
      "FRONTEND_URL",
    )}/reset-password?token=${token}`;

    const htmlContent = `
      <h2>Recuperación de contraseña</h2>
      <p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
      <a href="${resetLink}" target="_blank">${resetLink}</a>
      <p>Si no solicitaste este cambio, ignora este mensaje.</p>
    `;

    await this.mailer.sendMail(to, "Recuperación de contraseña", htmlContent);
  }
}
