import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FavoritoController } from './favorito.controller';
import { FavoritoService } from './favorito.service';
import { FavoritoSchema } from '../models/Favorito';
import { ContenidoSchema } from '../models/Contenido';

@Module({
  imports: [
    MongooseModule.forFeature([
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      { name: 'Favorito', schema: FavoritoSchema },
      { name: 'Contenido', schema: ContenidoSchema },
    ]),
  ],
  controllers: [FavoritoController],
  providers: [FavoritoService],
})
export class FavoritoModule {}
