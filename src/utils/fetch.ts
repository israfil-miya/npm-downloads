import axios, { AxiosResponse } from "axios";

const baseUrl = "https://api.npmjs.org";

interface Download {
  day: string;
  downloads: number;
}

interface DownloadCountsResponse {
  downloads: Download[];
}

// Retry function with exponential backoff
export const retry = async <T>(
  fn: () => Promise<T>,
  retries = 3,
  delay = 1000
): Promise<T> => {
  try {
    return await fn();
  } catch (err) {
    if (retries === 0) throw err;
    console.log(`Retrying in ${delay}ms...`);
    await new Promise((resolve) => setTimeout(resolve, delay));
    return retry(fn, retries - 1, delay * 2);
  }
};

// Function to fetch download counts from NPM API
export const fetchDownloadCounts = async (
  packageName: string,
  from: string,
  until: string
): Promise<AxiosResponse<DownloadCountsResponse>> => {
  const url = `${baseUrl}/downloads/range/${from}:${until}/${packageName}`;
  console.log(`Fetching data from URL: ${url}`);
  return retry(() =>
    axios.get<DownloadCountsResponse>(url, { timeout: 10000 })
  );
};
