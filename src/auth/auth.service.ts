import {
  Injectable,
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IUsuario } from '../models/Usuario';
import { enviarCodigo } from '../utils/mailer';

@Injectable()
export class AuthService {
  private codigos: Record<string, { codigo: string; expira: number }> = {};

  constructor(@InjectModel('Usuario') private usuarioModel: Model<IUsuario>) {}

  async registrar(correo: string, password: string, telefono?: string) {
    if (!correo || !password)
      throw new BadRequestException('Correo y contraseña son obligatorios.');
    const existe = await this.usuarioModel.findOne({
      correo: correo.toLowerCase(),
    });
    if (existe)
      throw new BadRequestException('Este correo ya está registrado.');
    await this.usuarioModel.create({ correo, contraseña: password, telefono });
    return { mensaje: 'Usuario registrado exitosamente.' };
  }

  async login(correo: string, password: string) {
    if (!correo || !password)
      throw new UnauthorizedException('Correo y contraseña son obligatorios.');
    const user = await this.usuarioModel.findOne({
      correo: correo.toLowerCase(),
    });
    if (!user || user.contraseña !== password)
      throw new UnauthorizedException('Credenciales incorrectas.');
    return {
      mensaje: `Bienvenid@ ${user.correo}`,
      rol: user.rol,
      id: user._id,
    };
  }

  async solicitarCodigo(correo: string) {
    if (!correo) throw new BadRequestException('Correo requerido.');
    const user = await this.usuarioModel.findOne({
      correo: correo.toLowerCase(),
    });
    if (!user) throw new NotFoundException('Correo no registrado.');
    const codigo = Math.floor(100000 + Math.random() * 900000).toString();
    this.codigos[correo.toLowerCase()] = {
      codigo,
      expira: Date.now() + 10 * 60 * 1000,
    };
    await enviarCodigo(correo, codigo);
    return { mensaje: 'Código enviado al correo.' };
  }

  verificarCodigo(correo: string, codigo: string) {
    const entrada = this.codigos[correo?.toLowerCase()];
    if (!entrada) throw new BadRequestException('No hay código solicitado.');
    if (Date.now() > entrada.expira) {
      delete this.codigos[correo.toLowerCase()];
      throw new BadRequestException('El código expiró.');
    }
    if (entrada.codigo !== codigo)
      throw new BadRequestException('Código incorrecto.');
    return { mensaje: 'Código válido.' };
  }

  async cambiarContraseña(correo: string, codigo: string, newPassword: string) {
    const entrada = this.codigos[correo?.toLowerCase()];
    if (!entrada || entrada.codigo !== codigo || Date.now() > entrada.expira)
      throw new BadRequestException('Código inválido o expirado.');
    const user = await this.usuarioModel.findOne({
      correo: correo.toLowerCase(),
    });
    if (!user) throw new NotFoundException('Usuario no encontrado.');
    user.contraseña = newPassword;
    await user.save();
    delete this.codigos[correo.toLowerCase()];
    return { mensaje: 'Contraseña actualizada exitosamente.' };
  }

  async cambiarContraseñaDirecto(correo: string, newPassword: string) {
    if (!correo || !newPassword)
      throw new BadRequestException('Correo y nueva contraseña son obligatorios.');
    if (newPassword.length < 8)
      throw new BadRequestException('La contraseña debe tener al menos 8 caracteres.');
    const user = await this.usuarioModel.findOne({
      correo: correo.toLowerCase(),
    });
    if (!user) throw new NotFoundException('Correo no registrado.');
    user.contraseña = newPassword;
    await user.save();
    return { mensaje: 'Contraseña actualizada exitosamente.' };
  }
}