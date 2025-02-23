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
      <div style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px; background-color: #f9f9f9;">
        <h2 style="color: #333;">🔑 Recuperación de contraseña</h2>
        
        <p>Hola,</p>
        <p>Recibimos una solicitud para restablecer tu contraseña. Si realizaste esta solicitud, haz clic en el botón de abajo:</p>
  
        <p style="text-align: center;">
          <a href="${resetLink}" target="_blank" style="background-color: #007bff; color: white; text-decoration: none; padding: 10px 15px; border-radius: 5px; display: inline-block;">
            Restablecer contraseña
          </a>
        </p>
  
        <p>O también puedes copiar y pegar el siguiente enlace en tu navegador:</p>
        <p style="word-break: break-all;"><a href="${resetLink}" target="_blank">${resetLink}</a></p>
  
        <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;" />
  
        <p>Si no solicitaste un cambio de contraseña, ignora este mensaje. Tu cuenta sigue segura.</p>
  
        <p style="font-size: 12px; color: #666;">
          📩 Este es un correo automático, por favor no respondas a este mensaje.  
          <br />Si necesitas ayuda, contáctanos en <a href="mailto:soporte@tuempresa.com">soporte@tuempresa.com</a>.
        </p>
  
        <p style="font-size: 12px; color: #666; text-align: center;">
          &copy; ${new Date().getFullYear()} Tu Empresa | Todos los derechos reservados.
        </p>
      </div>
    `;

    await this.mailer.sendMail(
      to,
      "🔑 Recuperación de contraseña",
      htmlContent,
    );
  }
}
