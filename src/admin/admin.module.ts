import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { UsuarioSchema } from '../models/Usuario';
import { ContenidoSchema } from '../models/Contenido';
import { FavoritoSchema } from '../models/Favorito';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Usuario', schema: UsuarioSchema },
      { name: 'Contenido', schema: ContenidoSchema },
      { name: 'Favorito', schema: FavoritoSchema },
    ]),
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
