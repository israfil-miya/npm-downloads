import { Module } from '@nestjs/common';
import { DownloadCountController } from './download-count.controller';
import { DownloadCountService } from './download-count.service';

@Module({
  controllers: [DownloadCountController],
  providers: [DownloadCountService],
})
export class DownloadCountModule {}
