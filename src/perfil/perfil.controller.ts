import { Controller, Get, Post, Put, Delete, Param, Query, Body } from '@nestjs/common';
import { PerfilService } from './perfil.service';

@Controller('v1/perfiles')
export class PerfilController {
  constructor(private readonly perfilService: PerfilService) {}

  @Get('listar')
  getPerfiles(@Query('correo') correo: string) {
    return this.perfilService.getPerfiles(correo);
  }

  @Post('crear')
  crearPerfil(@Body() body: { nombre: string; avatarUrl: string; usuarioCorreo: string; esMenor?: boolean; pin?: string }) {
    return this.perfilService.crearPerfil(body.nombre, body.avatarUrl, body.usuarioCorreo, body.esMenor, body.pin);
  }

  @Post('guardar-lote')
  crearLote(@Body() body: any[]) {
    return this.perfilService.crearLote(body);
  }

  @Put('actualizar/:id')
  editarPerfil(@Param('id') id: string, @Body() body: { nombre?: string; avatarUrl?: string; pin?: string }) {
    return this.perfilService.editarPerfil(id, body.nombre, body.avatarUrl, body.pin);
  }

  @Delete(':id')
  eliminarPerfil(@Param('id') id: string) {
    return this.perfilService.eliminarPerfil(id);
  }
}
