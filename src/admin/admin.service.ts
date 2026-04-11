import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IUsuario } from '../models/Usuario';
import { IContenido } from '../models/Contenido';
import { IFavorito } from '../models/Favorito';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel('Usuario') private usuarioModel: Model<IUsuario>,
    @InjectModel('Contenido') private contenidoModel: Model<IContenido>,
    @InjectModel('Favorito') private favoritoModel: Model<IFavorito>
  ) {}

  private verificarAdmin(correoAdmin: string) {
    if (correoAdmin !== process.env.ADMIN_EMAIL)
      throw new ForbiddenException('No tienes permisos de administrador.');
  }

  async getUsuarios(correoAdmin: string) {
    this.verificarAdmin(correoAdmin);
    return this.usuarioModel.find({}, 'correo telefono rol createdAt').sort({ createdAt: -1 });
  }

  async getUsuarioById(correoAdmin: string, id: string) {
    this.verificarAdmin(correoAdmin);
    const usuario = await this.usuarioModel.findById(id, 'correo telefono rol createdAt');
    if (!usuario) throw new NotFoundException('Usuario no encontrado.');
    return usuario;
  }

  async cambiarRol(correoAdmin: string, correo: string, nuevoRol: string) {
    this.verificarAdmin(correoAdmin);
    if (!['USER', 'ADMIN', 'MOD'].includes(nuevoRol))
      throw new ForbiddenException('Rol inválido. Usa: USER, ADMIN o MOD.');
    const user = await this.usuarioModel.findOneAndUpdate(
      { correo: correo?.toLowerCase() },
      { rol: nuevoRol },
      { new: true }
    );
    if (!user) throw new NotFoundException('Usuario no encontrado.');
    return { mensaje: `Rol actualizado a ${nuevoRol}.`, usuario: user.correo };
  }

  async eliminarUsuario(correoAdmin: string, id: string) {
    this.verificarAdmin(correoAdmin);
    const user = await this.usuarioModel.findByIdAndDelete(id);
    if (!user) throw new NotFoundException('Usuario no encontrado.');
    await this.favoritoModel.deleteMany({ usuarioCorreo: user.correo });
    return { mensaje: 'Usuario eliminado correctamente.' };
  }

  async eliminarContenido(correoAdmin: string, id: string) {
    this.verificarAdmin(correoAdmin);
    const contenido = await this.contenidoModel.findByIdAndDelete(id);
    if (!contenido) throw new NotFoundException('Contenido no encontrado.');
    return { mensaje: 'Contenido eliminado.' };
  }

  async getStats(correoAdmin: string) {
    this.verificarAdmin(correoAdmin);
    const [totalUsuarios, totalContenido, totalFavoritos] = await Promise.all([
      this.usuarioModel.countDocuments(),
      this.contenidoModel.countDocuments(),
      this.favoritoModel.countDocuments()
    ]);
    const porTipo = await this.contenidoModel.aggregate([
      { $group: { _id: '$tipo', cantidad: { $sum: 1 } } }
    ]);
    return { totalUsuarios, totalContenido, totalFavoritos, porTipo };
  }
}
