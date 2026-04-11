import {
  Controller,
  Get,
  Put,
  Delete,
  Param,
  Query,
  Body,
} from '@nestjs/common';
import { AdminService } from './admin.service';

@Controller('v1/admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('usuarios')
  getUsuarios(@Query('correoAdmin') correoAdmin: string) {
    return this.adminService.getUsuarios(correoAdmin);
  }

  @Get('usuarios/:id')
  getUsuarioById(
    @Query('correoAdmin') correoAdmin: string,
    @Param('id') id: string,
  ) {
    return this.adminService.getUsuarioById(correoAdmin, id);
  }

  @Put('rol')
  cambiarRol(
    @Query('correoAdmin') correoAdmin: string,
    @Body() body: { correo: string; nuevoRol: string },
  ) {
    return this.adminService.cambiarRol(
      correoAdmin,
      body.correo,
      body.nuevoRol,
    );
  }

  @Delete('usuarios/:id')
  eliminarUsuario(
    @Query('correoAdmin') correoAdmin: string,
    @Param('id') id: string,
  ) {
    return this.adminService.eliminarUsuario(correoAdmin, id);
  }

  @Delete('contenido/:id')
  eliminarContenido(
    @Query('correoAdmin') correoAdmin: string,
    @Param('id') id: string,
  ) {
    return this.adminService.eliminarContenido(correoAdmin, id);
  }

  @Get('stats')
  getStats(@Query('correoAdmin') correoAdmin: string) {
    return this.adminService.getStats(correoAdmin);
  }
}
