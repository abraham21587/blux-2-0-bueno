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
import { ContenidoService } from './contenido.service';

@Controller('v1/flux')
export class ContenidoController {
  constructor(private readonly contenidoService: ContenidoService) {}

  @Get('home')
  getHome() {
    return this.contenidoService.getHome();
  }

  @Get('catalogo')
  getCatalogo(
    @Query('tipo') tipo?: string,
    @Query('seccion') seccion?: string,
  ) {
    return this.contenidoService.getCatalogo(tipo, seccion);
  }

  @Get('catalogo/:id')
  getContenidoById(@Param('id') id: string) {
    return this.contenidoService.getContenidoById(id);
  }

  @Get('en-vivo')
  getEnVivo() {
    return this.contenidoService.getEnVivo();
  }

  @Get('buscar')
  buscar(@Query('query') query: string) {
    return this.contenidoService.buscar(query);
  }

  @Post('admin/agregar')
  agregar(@Body() body: any) {
    return this.contenidoService.agregar(body);
  }

  @Put('admin/editar/:id')
  editar(@Param('id') id: string, @Body() body: any) {
    return this.contenidoService.editar(id, body);
  }

  @Delete('admin/eliminar/:id')
  eliminar(@Param('id') id: string) {
    return this.contenidoService.eliminar(id);
  }
}
