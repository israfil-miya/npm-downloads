import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { DownloadCountModule } from './download-count/download-count.module';

@Module({
  imports: [DownloadCountModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
