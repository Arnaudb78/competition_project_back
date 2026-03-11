import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ModuleModule } from './modules/module/module.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { UploadModule } from './modules/upload/upload.module';
import { AccountModule } from './modules/account/account.module';
import { GroupModule } from './modules/group/group.module';
import { QuestionModule } from './modules/question/question.module';
import { ReplayModule } from './modules/replay/replay.module';
import { ClipModule } from './modules/clip/clip.module';
import { EventModule } from './modules/event/event.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>('MONGODB_URI'),
      }),
    }),
    ModuleModule,
    UserModule,
    AuthModule,
    UploadModule,
    AccountModule,
    GroupModule,
    QuestionModule,
    ReplayModule,
    ClipModule,
    EventModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
