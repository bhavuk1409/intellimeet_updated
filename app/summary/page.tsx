'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

const SummaryPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const recordingUrl = searchParams.get('recordingUrl');
  const [summary, setSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [apiResponse, setApiResponse] = useState<any>(null);
  const [directApiResult, setDirectApiResult] = useState<any>(null);
  const [directApiLoading, setDirectApiLoading] = useState<boolean>(false);
  const [directApiError, setDirectApiError] = useState<string | null>(null);

  useEffect(() => {
    if (recordingUrl) {
      console.log('Recording URL:', recordingUrl);
      fetchSummary(recordingUrl);
    } else {
      console.error('No recording URL found in query parameters');
      setError('No recording URL provided. Please go back and try again.');
    }
  }, [recordingUrl]);

  // Test the API directly
  const testDirectApi = async () => {
    if (!recordingUrl) return;
    
    setDirectApiLoading(true);
    setDirectApiError(null);
    
    try {
      console.log('Testing API directly:', recordingUrl);
      
      const response = await fetch('http://127.0.0.1:8000/process_video', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ url: recordingUrl }),
      });
      
      console.log('Direct API response status:', response.status);
      
      let result;
      try {
        result = await response.json();
      } catch (e) {
        result = await response.text();
      }
      
      setDirectApiResult(result);
      
      if (!response.ok) {
        setDirectApiError(`API responded with status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error testing API directly:', error);
      setDirectApiError(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setDirectApiLoading(false);
    }
  };

  const fetchSummary = async (recordingUrl: string) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Making API request via proxy to summarize:', recordingUrl);
      
      // Use our Next.js API route instead of calling the external API directly
      const response = await fetch('/api/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: recordingUrl }),
      });
      
      console.log('API response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API error response:', errorText);
        throw new Error(`API responded with status: ${response.status}. Details: ${errorText}`);
      }
      
      const data = await response.json();
      console.log('API response data:', data);
      setApiResponse(data);
      
      if (data.summary) {
        setSummary(data.summary);
      } else if (data.result) {
        setSummary(data.result);
      } else if (data.message) {
        setSummary(data.message);
      } else {
        setSummary(JSON.stringify(data, null, 2));
      }
    } catch (error) {
      console.error('Error fetching summary:', error);
      setError(`Failed to fetch summary: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  // Function to retry the API call
  const retryFetch = () => {
    if (recordingUrl) {
      fetchSummary(recordingUrl);
    }
  };

  return (
    <div className="p-6 text-white max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-3 inline-block text-transparent bg-clip-text">Meeting Summary</h1>
        <button 
          onClick={() => router.push('/recordings')}
          className="ios-button flex items-center gap-2 bg-dark-3 rounded-full px-6 py-3 hover:bg-dark-4 ios-transition"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Back to Recordings
        </button>
      </div>
      
      {recordingUrl && (
        <div className="mb-6 flex flex-wrap gap-3">
          <a 
            href={recordingUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="ios-button flex items-center bg-gradient-to-r from-blue-1 to-blue-2 text-white rounded-full px-6 py-3"
          >
            <svg className="mr-2" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="5 3 19 12 5 21 5 3"/>
            </svg>
            View Original Recording
          </a>
          <a 
            href="http://127.0.0.1:8000/docs" 
            target="_blank" 
            rel="noopener noreferrer"
            className="ios-button flex items-center bg-gradient-to-r from-gray-1 to-gray-2 text-white rounded-full px-6 py-3"
          >
            <svg className="mr-2" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
            </svg>
            Open API Docs
          </a>
          <button 
            onClick={retryFetch}
            className="ios-button flex items-center bg-gradient-to-r from-purple-1 to-pink-1 text-white rounded-full px-6 py-3"
          >
            <svg className="mr-2" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 2v6h-6M3 12a9 9 0 0 1 15-6.7L21 8M3 22v-6h6M21 12a9 9 0 0 1-15 6.7L3 16"/>
            </svg>
            Retry Summary
          </button>
        </div>
      )}
      
      {error && (
        <div className="glassmorphism2 p-6 mb-6 rounded-ios-lg">
          <p className="text-lg text-red-1 font-medium mb-4">{error}</p>
          <div className="flex flex-wrap gap-3 mt-4">
            <button 
              onClick={retryFetch}
              className="ios-button bg-gradient-to-r from-blue-1 to-blue-2 text-white rounded-full px-6 py-3"
            >
              Retry
            </button>
            <a 
              href={`http://127.0.0.1:8000/docs`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="ios-button inline-block bg-gradient-to-r from-green-1 to-green-1/80 text-white rounded-full px-6 py-3"
            >
              Try API Docs Directly
            </a>
          </div>
          {recordingUrl && (
            <div className="mt-6 p-6 bg-dark-4 rounded-ios">
              <p className="mb-4 font-medium">Manual API Test:</p>
              <div className="space-y-3">
                <p className="text-sm">1. Open <a href="http://127.0.0.1:8000/docs" target="_blank" rel="noopener noreferrer" className="text-blue-1 underline">API Docs</a></p>
                <p className="text-sm">2. Click on POST /process_video</p>
                <p className="text-sm">3. Click "Try it out" button</p>
                <p className="text-sm">4. Paste this URL in the request body:</p>
                <pre className="bg-dark-1 p-4 rounded-ios text-xs mt-2 mb-3 overflow-auto">{JSON.stringify({ url: recordingUrl }, null, 2)}</pre>
                <p className="text-sm">5. Click "Execute" button</p>
              </div>
            </div>
          )}
        </div>
      )}
      
      {loading ? (
        <div className="glassmorphism2 flex flex-col items-center justify-center p-10 rounded-ios-lg">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-1 mb-6"></div>
          <p className="text-xl font-medium mb-2">Generating summary...</p>
          <p className="text-sm text-gray-1">This may take a few moments</p>
        </div>
      ) : summary ? (
        <div className="glassmorphism2 p-8 rounded-ios-lg">
          <h2 className="text-xl font-medium mb-6 bg-gradient-to-r from-white to-gray-3 inline-block text-transparent bg-clip-text">Meeting Summary</h2>
          <p className="text-lg whitespace-pre-line leading-relaxed">{summary}</p>
        </div>
      ) : !error && (
        <div className="glassmorphism2 p-8 rounded-ios-lg text-center">
          <p className="text-xl">Preparing to summarize the meeting...</p>
        </div>
      )}
      
      {apiResponse && (
        <div className="mt-8 p-6 glassmorphism2 rounded-ios">
          <details>
            <summary className="cursor-pointer text-sm text-gray-1 font-medium pb-2">Debug Information</summary>
            <pre className="mt-4 text-xs overflow-auto max-h-96 p-4 bg-dark-1 rounded-ios">
              {JSON.stringify(apiResponse, null, 2)}
            </pre>
          </details>
        </div>
      )}
      
      {/* Direct API Test Form */}
      {recordingUrl && (
        <div className="mt-8 glassmorphism2 rounded-ios">
          <details>
            <summary className="cursor-pointer text-base font-medium p-6">
              Direct API Test Tool
            </summary>
            <div className="px-6 pb-6">
              <p className="text-sm text-gray-1 mb-4">
                Use this tool to test the API directly if the proxy approach isn't working:
              </p>
              
              <div className="flex flex-wrap gap-3 mt-5">
                <button 
                  onClick={async () => {
                    try {
                      // Open in a new window for testing
                      window.open(`http://127.0.0.1:8000/docs#/default/process_video_process_video_post`, '_blank');
                    } catch (error) {
                      console.error('Error opening docs:', error);
                    }
                  }}
                  className="ios-button bg-blue-1 text-white rounded-full px-5 py-2 text-sm"
                >
                  1. Open API Docs
                </button>
                
                <button 
                  onClick={() => {
                    // Copy the URL to clipboard
                    navigator.clipboard.writeText(recordingUrl);
                    alert('Recording URL copied to clipboard!');
                  }}
                  className="ios-button bg-green-1 text-white rounded-full px-5 py-2 text-sm"
                >
                  2. Copy Recording URL
                </button>
                
                <button
                  onClick={() => {
                    // Copy the formatted JSON
                    navigator.clipboard.writeText(JSON.stringify({ url: recordingUrl }, null, 2));
                    alert('JSON payload copied to clipboard!');
                  }}
                  className="ios-button bg-purple-1 text-white rounded-full px-5 py-2 text-sm"
                >
                  3. Copy JSON Body
                </button>

                <button
                  onClick={testDirectApi}
                  disabled={directApiLoading}
                  className="ios-button bg-orange-1 text-white rounded-full px-5 py-2 text-sm disabled:opacity-50"
                >
                  {directApiLoading ? 'Testing...' : 'Test API Directly'}
                </button>
              </div>
              
              <div className="mt-6 bg-dark-1 p-4 rounded-ios">
                <p className="text-sm font-medium mb-2">JSON body to use:</p>
                <pre className="bg-dark-4 p-3 rounded-ios text-xs overflow-auto">
                  {JSON.stringify({ url: recordingUrl }, null, 2)}
                </pre>
              </div>

              {directApiLoading && (
                <div className="mt-6 flex items-center">
                  <div className="animate-spin mr-3 h-4 w-4 border-t-2 border-b-2 border-blue-1 rounded-full"></div>
                  <p>Testing API directly...</p>
                </div>
              )}

              {directApiError && (
                <div className="mt-6 p-4 bg-red-1 bg-opacity-10 rounded-ios border border-red-1 border-opacity-20">
                  <p className="text-sm font-medium mb-1 text-red-1">Error testing API directly:</p>
                  <p className="text-xs">{directApiError}</p>
                </div>
              )}

              {directApiResult && (
                <div className="mt-6">
                  <p className="text-sm font-medium mb-3">Direct API Result:</p>
                  <pre className="bg-dark-4 p-4 rounded-ios text-xs overflow-auto max-h-64">
                    {typeof directApiResult === 'string' 
                      ? directApiResult 
                      : JSON.stringify(directApiResult, null, 2)
                    }
                  </pre>
                </div>
              )}
            </div>
          </details>
        </div>
      )}
    </div>
  );
};

export default SummaryPage; 