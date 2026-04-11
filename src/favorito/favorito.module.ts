import { Module } from '@nestjs/common';
import { FavoritoService } from './favorito.service';
import { FavoritoController } from './favorito.controller';

@Module({
  providers: [FavoritoService],
  controllers: [FavoritoController]
})
export class FavoritoModule {}
