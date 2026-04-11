import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsuarioSchema } from '../models/Usuario';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Usuario', schema: UsuarioSchema }])
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
