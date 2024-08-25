interface DateRangeChunk {
  from: string;
  until: string;
}

// Function to divide date range into chunks of up to (default = 18 months)
export const divideDateRangeIntoChunks = (
  startDate: string,
  endDate: string,
  monthsRange: number = 18,
): DateRangeChunk[] => {
  const chunks: DateRangeChunk[] = [];
  let currentEndDate = new Date(endDate);
  const start = new Date(startDate);

  while (currentEndDate > start) {
    const chunkStartDate = new Date(currentEndDate);
    chunkStartDate.setMonth(currentEndDate.getMonth() - monthsRange);

    if (chunkStartDate < start) {
      chunkStartDate.setTime(start.getTime());
    }

    chunks.push({
      from: chunkStartDate.toISOString().split("T")[0],
      until: currentEndDate.toISOString().split("T")[0],
    });

    currentEndDate = new Date(chunkStartDate);
    currentEndDate.setDate(currentEndDate.getDate() - 1);
  }

  return chunks;
};
