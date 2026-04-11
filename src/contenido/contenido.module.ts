import { Module } from '@nestjs/common';
import { ContenidoService } from './contenido.service';
import { ContenidoController } from './contenido.controller';

@Module({
  providers: [ContenidoService],
  controllers: [ContenidoController]
})
export class ContenidoModule {}
