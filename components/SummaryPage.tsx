'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

const SummaryPage = () => {
  const searchParams = useSearchParams();
  const recordingUrl = searchParams.get('recordingUrl');
  const [summary, setSummary] = useState<string | null>(null);

  useEffect(() => {
    if (recordingUrl) {
      fetchSummary(recordingUrl);
    }
  }, [recordingUrl]);

  const fetchSummary = async (recordingUrl: string) => {
    try {
      const response = await fetch(
        `YOUR_SUMMARIZATION_API_ENDPOINT`, // Replace with your actual API URL
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: recordingUrl }),
        }
      );
      const data = await response.json();
      setSummary(data.summary);
    } catch (error) {
      console.error('Error fetching summary:', error);
      setSummary('Failed to fetch summary.');
    }
  };

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-bold mb-4">Meeting Summary</h1>
      {summary ? (
        <p className="text-lg">{summary}</p>
      ) : (
        <p className="text-lg">Loading summary...</p>
      )}
    </div>
  );
};

export default SummaryPage;
