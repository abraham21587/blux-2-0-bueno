import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Query,
  Body,
} from '@nestjs/common';
import { PerfilService } from './perfil.service';

@Controller('v1/perfiles')
export class PerfilController {
  constructor(private readonly perfilService: PerfilService) {}

  @Get('listar')
  getPerfiles(@Query('correo') correo: string) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
    return this.perfilService.getPerfiles(correo);
  }

  @Post('crear')
  crearPerfil(
    @Body()
    body: {
      nombre: string;
      avatarUrl: string;
      usuarioCorreo: string;
      esMenor?: boolean;
      pin?: string;
    },
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
    return this.perfilService.crearPerfil(
      body.nombre,
      body.avatarUrl,
      body.usuarioCorreo,
      body.esMenor,
      body.pin,
    );
  }

  @Post('guardar-lote')
  crearLote(@Body() body: any[]) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
    return this.perfilService.crearLote(body);
  }

  @Put('actualizar/:id')
  editarPerfil(
    @Param('id') id: string,
    @Body() body: { nombre?: string; avatarUrl?: string; pin?: string },
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
    return this.perfilService.editarPerfil(
      id,
      body.nombre,
      body.avatarUrl,
      body.pin,
    );
  }

  @Delete(':id')
  eliminarPerfil(@Param('id') id: string) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
    return this.perfilService.eliminarPerfil(id);
  }
}
