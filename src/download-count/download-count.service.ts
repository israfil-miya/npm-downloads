import { Injectable } from '@nestjs/common';
import { divideDateRangeIntoChunks } from 'src/utils/date';
import { fetchDownloadCounts } from 'src/utils/fetch';

interface AggregatedDownloadCounts {
  totalDownloads: number;
  downloadsByDate: Record<string, number>;
}

@Injectable()
export class DownloadCountService {
  // Function to fetch and aggregate download counts
  fetchAndAggregateDownloadCounts = async (
    packageName: string,
    from: string,
    until: string,
  ): Promise<AggregatedDownloadCounts> => {
    const dateChunks = divideDateRangeIntoChunks(from, until);
    const results: Record<string, number> = {};
    let totalDownloads = 0;

    for (const { from, until } of dateChunks) {
      const { data } = await fetchDownloadCounts(packageName, from, until);

      if (data && data.downloads) {
        (data.downloads as Array<{ day: string; downloads: number }>).forEach(
          (download) => {
            const date = download.day;
            if (results[date]) {
              results[date] += download.downloads;
            } else {
              results[date] = download.downloads;
            }
            totalDownloads += download.downloads;
          },
        );
      }
    }

    // Sort dates and aggregate results
    const sortedDates = Object.keys(results).sort(
      (a, b) => new Date(a).getTime() - new Date(b).getTime(),
    );
    const sortedResults: Record<string, number> = {};
    sortedDates.forEach((date) => {
      sortedResults[date] = results[date];
    });

    return {
      totalDownloads,
      downloadsByDate: sortedResults,
    };
  };
}
