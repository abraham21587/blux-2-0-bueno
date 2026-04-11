import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IPerfil } from '../models/Perfil';

@Injectable()
export class PerfilService {
  constructor(@InjectModel('Perfil') private perfilModel: Model<IPerfil>) {}

  async getPerfiles(correo: string) {
    if (!correo) throw new BadRequestException('Correo requerido.');
    return this.perfilModel.find({ usuarioCorreo: correo.toLowerCase() });
  }

  async crearPerfil(
    nombre: string,
    avatarUrl: string,
    usuarioCorreo: string,
    esMenor?: boolean,
    pin?: string,
  ) {
    if (!nombre || !usuarioCorreo)
      throw new BadRequestException('Nombre y correo son requeridos.');
    const cantidad = await this.perfilModel.countDocuments({
      usuarioCorreo: usuarioCorreo.toLowerCase(),
    });
    if (cantidad >= 5)
      throw new BadRequestException('Máximo 5 perfiles por usuario.');
    return this.perfilModel.create({
      nombre,
      avatarUrl: avatarUrl || 'https://i.pravatar.cc/150',
      usuarioCorreo: usuarioCorreo.toLowerCase(),
      esMenor: esMenor ?? false,
      pin: pin || '',
    });
  }

  async crearLote(perfiles: any[]) {
    if (!Array.isArray(perfiles) || perfiles.length === 0)
      throw new BadRequestException('Se esperaba un array de perfiles.');
    if (perfiles.length > 5)
      throw new BadRequestException('Máximo 5 perfiles por lote.');
    return this.perfilModel.insertMany(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      perfiles.map((p) => ({
        ...p,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
        usuarioCorreo: p.usuarioCorreo?.toLowerCase(),
      })),
    );
  }

  async editarPerfil(
    id: string,
    nombre?: string,
    avatarUrl?: string,
    pin?: string,
  ) {
    const perfil = await this.perfilModel.findByIdAndUpdate(
      id,
      {
        ...(nombre && { nombre }),
        ...(avatarUrl && { avatarUrl }),
        ...(pin !== undefined && { pin }),
      },
      { new: true, runValidators: true },
    );
    if (!perfil) throw new NotFoundException('Perfil no encontrado.');
    return perfil;
  }

  async eliminarPerfil(id: string) {
    const perfil = await this.perfilModel.findByIdAndDelete(id);
    if (!perfil) throw new NotFoundException('Perfil no encontrado.');
    return { mensaje: 'Perfil eliminado.' };
  }
}
