import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import axios from 'axios';
import { IContenido } from '../models/Contenido';

interface TwitchStream {
  user_name: string;
  user_login: string;
  title: string;
  thumbnail_url: string;
  game_name: string;
  viewer_count: number;
}

@Injectable()
export class ContenidoService {
  constructor(
    @InjectModel('Contenido') private contenidoModel: Model<IContenido>,
  ) {}

  private async getTwitchToken(): Promise<string> {
    const url = `https://id.twitch.tv/oauth2/token?client_id=${process.env.TWITCH_CLIENT_ID}&client_secret=${process.env.TWITCH_CLIENT_SECRET}&grant_type=client_credentials`;
    const res = await axios.post<{ access_token: string }>(url);
    return res.data.access_token;
  }

  private formatearStream(s: TwitchStream) {
    return {
      id: s.user_login,
      titulo: s.title,
      canal: s.user_name,
      tipo: 'LIVE',
      url: `https://twitch.tv/${s.user_login}`,
      imagen: s.thumbnail_url.replace('{width}x{height}', '600x338'),
      seccion: s.game_name || 'Streaming',
      viewers: s.viewer_count,
    };
  }

  async getHome() {
    const catalogo = await this.contenidoModel.find().sort({ createdAt: -1 });
    let en_vivo: any[] = [];
    try {
      const token = await this.getTwitchToken();
      const res = await axios.get<{ data: TwitchStream[] }>(
        'https://api.twitch.tv/helix/streams?first=50',
        {
          headers: {
            'Client-ID': process.env.TWITCH_CLIENT_ID,
            Authorization: `Bearer ${token}`,
          },
        },
      );
      en_vivo = res.data.data.map((s) => this.formatearStream(s));
    } catch (e: any) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      console.warn('Twitch no disponible:', e.message);
    }
    return { catalogo, en_vivo };
  }

  async getCatalogo(tipo?: string, seccion?: string) {
    const filtro: any = {};
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (tipo) filtro.tipo = tipo;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (seccion) filtro.seccion = seccion;
    return this.contenidoModel.find(filtro).sort({ createdAt: -1 });
  }

  async getContenidoById(id: string) {
    const item = await this.contenidoModel.findById(id);
    if (!item) throw new NotFoundException('Contenido no encontrado.');
    return item;
  }

  async getEnVivo() {
    const token = await this.getTwitchToken();
    const res = await axios.get<{ data: TwitchStream[] }>(
      'https://api.twitch.tv/helix/streams?first=20',
      {
        headers: {
          'Client-ID': process.env.TWITCH_CLIENT_ID,
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return res.data.data.map((s) => this.formatearStream(s));
  }

  async buscar(query: string) {
    if (!query) return [];
    return this.contenidoModel
      .find({
        $or: [
          { titulo: { $regex: query, $options: 'i' } },
          { descripcion: { $regex: query, $options: 'i' } },
          { genero: { $regex: query, $options: 'i' } },
        ],
      })
      .limit(30);
  }

  async agregar(body: any) {
    return this.contenidoModel.create(body);
  }

  async editar(id: string, body: any) {
    const item = await this.contenidoModel.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });
    if (!item) throw new NotFoundException('Contenido no encontrado.');
    return item;
  }

  async eliminar(id: string) {
    const item = await this.contenidoModel.findByIdAndDelete(id);
    if (!item) throw new NotFoundException('Contenido no encontrado.');
    return { mensaje: 'Contenido eliminado.' };
  }
}
