import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Query,
  Res,
} from '@nestjs/common';
import type { Response } from 'express';
import { DownloadCountService } from './download-count.service';

@Controller('download-count')
export class DownloadCountController {
  constructor(private readonly downloadCountService: DownloadCountService) {}

  @Get()
  async index(
    @Res() res: Response,
    @Query() query: { package: string; from: string; until: string },
  ) {
    const { package: packageNames, from, until } = query;

    if (!packageNames || !from || !until) {
      throw new HttpException(
        'Missing required parameters',
        HttpStatus.BAD_REQUEST,
      );
    }

    console.log(
      `Fetching download counts for packages: ${packageNames} from ${from} to ${until}`,
    );

    const packages = packageNames.split(',');
    const results: Record<string, any> = {};

    for (const packageName of packages) {
      try {
        results[packageName] =
          await this.downloadCountService.fetchAndAggregateDownloadCounts(
            packageName,
            from,
            until,
          );
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        console.error(
          `Failed to fetch or process data for ${packageName}: ${message}`,
        );
        results[packageName] = {
          error: `Failed to fetch or process data for ${packageName}`,
        };
      }
    }

    console.log(`Processing finished. Returning aggregated data for packages.`);

    const hasErrors = Object.values(results).some(
      (result) => 'error' in result,
    );

    if (hasErrors) {
      const allFailed = Object.values(results).every(
        (result) => 'error' in result,
      );
      if (allFailed) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(results);
      } else {
        // Partial success: some succeeded, some failed
        return res.status(207).json(results);
      }
    } else {
      return res.status(HttpStatus.OK).json(results);
    }
  }
}
