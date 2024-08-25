# NPM Downloads

This project provides a **REST API** to fetch and aggregate download counts for NPM packages over a specified date range. The API handles the limitations of the NPM download counts endpoint by breaking large date ranges into smaller chunks.

## Limitations of NPM's Download Counts API

NPM's download counts API has the following limitations:

- **Date Range Limitation:** The API does not support querying download counts over long date ranges in a single request. This is due to constraints on the maximum period for which data can be retrieved in one call.
- **Rate Limiting:** The API has rate limits that can affect how frequently data can be fetched.

## How These Limitations Are Addressed

1. **Chunking Date Ranges:** To handle the date range limitation, the date range is divided into smaller chunks (up to **18 months** each by default). This ensures that each API request only covers a manageable time period, allowing us to aggregate data over the full range by making multiple requests.
2. **Retry Logic:** Implemented retry logic with exponential backoff to handle occasional failures due to rate limiting or network issues. This ensures robustness and reliability of the data fetching process.

## API Endpoint

### Fetch Download Counts

#### Endpoint: `/api/download-counts`

#### Method: `GET`

#### Query Parameters:

- `package`: Comma-separated list of NPM package names.
- `from`: Start date in `YYYY-MM-DD` format.
- `until`: End date in `YYYY-MM-DD` format.

#### Example Request:

```
GET /api/download-counts?package=package1,package2&from=2022-04-01&until=2024-08-25
```

#### Response:

The response will include download counts for each package within the specified date range. It will also include the total download counts and sorted data by date.

#### Example Response:

```js
{
  "package1": {
    "totalDownloads": 123456,
    "downloadsByDate": {
      "2022-04-01": 1000,
      "2022-04-02": 1200,
      // more date-wise counts
    }
  },
  "package2": {
    "totalDownloads": 654321,
    "downloadsByDate": {
      "2022-04-01": 1500,
      "2022-04-02": 1800,
      // more date-wise counts
    }
  }
}
```

## Setup

### Prerequisites

- Node.js (v16 or later)
- TypeScript

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/israfil-miya/npm-downloads
   ```
2. Navigate to the project directory:
   ```
   cd npm-downloads
   ```
3. Install dependencies:
   ```
   npm i -g pnpm
   pnpm i
   ```
4. Start the server:
   ```
   pnpm start
   ```
   The server will start on port `3000` (or the port specified in the `PORT` environment variable).

## Contributing

Contributions are welcome! Please feel free to open issues or submit pull requests.
