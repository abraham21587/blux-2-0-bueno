import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ContenidoModule } from './contenido/contenido.module';
import { PerfilModule } from './perfil/perfil.module';
import { FavoritoModule } from './favorito/favorito.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [AuthModule, ContenidoModule, PerfilModule, FavoritoModule, AdminModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}







