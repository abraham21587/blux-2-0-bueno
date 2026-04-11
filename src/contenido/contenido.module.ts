import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ContenidoController } from './contenido.controller';
import { ContenidoService } from './contenido.service';
import { ContenidoSchema } from '../models/Contenido';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Contenido', schema: ContenidoSchema }])
  ],
  controllers: [ContenidoController],
  providers: [ContenidoService],
})
export class ContenidoModule {}
