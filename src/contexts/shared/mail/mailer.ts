import nodemailer from "nodemailer";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class Mailer {
  private transporter;

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: this.configService.get<string>("EMAIL_USER"),
        pass: this.configService.get<string>("EMAIL_PASS"),
      },
    });
  }

  async sendMail(to: string, subject: string, html: string) {
    try {
      await this.transporter.sendMail({
        from: `"Soporte" <${this.configService.get<string>("EMAIL_USER")}>`,
        to,
        subject,
        html,
      });
    } catch (error) {
      console.error("Error enviando el correo:", error);
      throw new Error("No se pudo enviar el correo electrónico.");
    }
  }
}
