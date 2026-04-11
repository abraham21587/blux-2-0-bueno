import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PerfilController } from './perfil.controller';
import { PerfilService } from './perfil.service';
import { PerfilSchema } from '../models/Perfil';

@Module({
  imports: [
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    MongooseModule.forFeature([{ name: 'Perfil', schema: PerfilSchema }]),
  ],
  controllers: [PerfilController],
  providers: [PerfilService],
})
export class PerfilModule {}
