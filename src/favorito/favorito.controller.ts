import { Controller, Get, Post, Delete, Query, Body } from '@nestjs/common';
import { FavoritoService } from './favorito.service';

@Controller('v1/favoritos')
export class FavoritoController {
  constructor(private readonly favoritoService: FavoritoService) {}

  @Get('mis-favoritos')
  getFavoritos(@Query('correo') correo: string) {
    return this.favoritoService.getFavoritos(correo);
  }

  @Post('agregar')
  agregarFavorito(@Body() body: { correo: string; contenidoId: string }) {
    return this.favoritoService.agregarFavorito(body.correo, body.contenidoId);
  }

  @Delete('eliminar')
  eliminarFavorito(@Body() body: { correo: string; contenidoId: string }) {
    return this.favoritoService.eliminarFavorito(body.correo, body.contenidoId);
  }
}
