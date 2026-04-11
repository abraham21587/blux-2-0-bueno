import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('registrar')
  registrar(@Body() body: { correo: string; password: string; telefono?: string }) {
    return this.authService.registrar(body.correo, body.password, body.telefono);
  }

  @Post('login')
  login(@Body() body: { correo: string; password: string }) {
    return this.authService.login(body.correo, body.password);
  }

  @Post('recuperar/solicitar')
  solicitarCodigo(@Body() body: { correo: string }) {
    return this.authService.solicitarCodigo(body.correo);
  }

  @Post('recuperar/verificar')
  verificarCodigo(@Body() body: { correo: string; codigo: string }) {
    return this.authService.verificarCodigo(body.correo, body.codigo);
  }

  @Post('recuperar/cambiar')
  cambiarContraseña(@Body() body: { correo: string; codigo: string; newPassword: string }) {
    return this.authService.cambiarContraseña(body.correo, body.codigo, body.newPassword);
  }
}