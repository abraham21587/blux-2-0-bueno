import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IFavorito } from '../models/Favorito';
import { IContenido } from '../models/Contenido';

@Injectable()
export class FavoritoService {
  constructor(
    @InjectModel('Favorito') private favoritoModel: Model<IFavorito>,
    @InjectModel('Contenido') private contenidoModel: Model<IContenido>
  ) {}

  async getFavoritos(correo: string) {
    if (!correo) throw new BadRequestException('Correo requerido.');
    return this.favoritoModel.find({ usuarioCorreo: correo.toLowerCase() });
  }

  async agregarFavorito(correo: string, contenidoId: string) {
    if (!correo || !contenidoId) throw new BadRequestException('Faltan datos: correo y contenidoId son requeridos.');
    const contenido = await this.contenidoModel.findById(contenidoId);
    if (!contenido) throw new NotFoundException('Contenido no encontrado.');
    const existe = await this.favoritoModel.findOne({ usuarioCorreo: correo.toLowerCase(), contenidoId });
    if (existe) throw new BadRequestException('Ya está en favoritos.');
    return this.favoritoModel.create({
      usuarioCorreo: correo.toLowerCase(),
      contenidoId,
      titulo: contenido.titulo,
      imagen: contenido.imagen,
      url:    contenido.url,
      tipo:   contenido.tipo
    });
  }

  async eliminarFavorito(correo: string, contenidoId: string) {
    if (!correo || !contenidoId) throw new BadRequestException('Faltan datos.');
    const fav = await this.favoritoModel.findOneAndDelete({ usuarioCorreo: correo.toLowerCase(), contenidoId });
    if (!fav) throw new NotFoundException('Favorito no encontrado.');
    return { mensaje: 'Eliminado de favoritos.' };
  }
}