import { Request, Response } from "express";
import { divideDateRangeIntoChunks } from "../utils/date";
import { fetchDownloadCounts } from "../utils/fetch";

interface AggregatedDownloadCounts {
  totalDownloads: number;
  downloadsByDate: Record<string, number>;
}

// Function to fetch and aggregate download counts
export const fetchAndAggregateDownloadCounts = async (
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
      data.downloads.forEach((download) => {
        const date = download.day;
        if (results[date]) {
          results[date] += download.downloads;
        } else {
          results[date] = download.downloads;
        }
        totalDownloads += download.downloads;
      });
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

// Route handler for download counts
export const downloadCountsHandler = async (req: Request, res: Response) => {
  const { package: packageNames, from, until } = req.query;

  if (!packageNames || !from || !until) {
    return res.status(400).json({ error: "Missing required parameters" });
  }

  console.log(
    `Fetching download counts for packages: ${packageNames} from ${from} to ${until}`,
  );

  const packages = (packageNames as string).split(",");
  const results: Record<string, any> = {};

  for (const packageName of packages) {
    try {
      results[packageName] = await fetchAndAggregateDownloadCounts(
        packageName,
        from as string,
        until as string,
      );
    } catch (error: any) {
      console.error(
        `Failed to fetch or process data for ${packageName}: ${error.message}`,
      );
      results[packageName] = {
        error: `Failed to fetch or process data for ${packageName}`,
      };
    }
  }

  console.log(`Processing finished. Returning aggregated data for packages.`);

  res.json(results);
};
