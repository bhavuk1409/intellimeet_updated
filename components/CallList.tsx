'use client';

import { Call, CallRecording, useStreamVideoClient } from '@stream-io/video-react-sdk';

import Loader from './Loader';
import { useGetCalls } from '@/hooks/useGetCalls';
import MeetingCard from './MeetingCard';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from './ui/use-toast';

const CallList = ({ type }: { type: 'ended' | 'upcoming' | 'recordings' }) => {
  const router = useRouter();
  const client = useStreamVideoClient();
  const { toast } = useToast();
  const { endedCalls, upcomingCalls, callRecordings, isLoading } =
    useGetCalls();
  const [recordings, setRecordings] = useState<CallRecording[]>([]);

  const getCalls = () => {
    switch (type) {
      case 'ended':
        return endedCalls;
      case 'recordings':
        return recordings;
      case 'upcoming':
        return upcomingCalls;
      default:
        return [];
    }
  };

  const getNoCallsMessage = () => {
    switch (type) {
      case 'ended':
        return 'No Previous Calls';
      case 'upcoming':
        return 'No Upcoming Calls';
      case 'recordings':
        return 'No Recordings';
      default:
        return '';
    }
  };

  useEffect(() => {
    const fetchRecordings = async () => {
      const callData = await Promise.all(
        callRecordings?.map((meeting) => meeting.queryRecordings()) ?? [],
      );

      const recordings = callData
        .filter((call) => call.recordings.length > 0)
        .flatMap((call) => call.recordings);

      setRecordings(recordings);
    };

    if (type === 'recordings') {
      fetchRecordings();
    }
  }, [type, callRecordings]);
  
  const handleDeleteRecording = async (recordingUrl: string) => {
    try {
      // Find the recording to get its metadata
      const recording = recordings.find(rec => rec.url === recordingUrl);
      if (!recording) {
        toast({
          title: "Error",
          description: "Could not find recording information",
          variant: "destructive"
        });
        return;
      }

      // Get the call ID - it might be available as a property or we can extract it from the URL
      // Different versions of the SDK might have different property names
      const callId = (recording as any).call_id || 
                    (recording as any).callId || 
                    recording.url.split('/').slice(-2)[0]; // Extract from URL as fallback

      // Remove the recording from the UI first for immediate feedback
      setRecordings((prev) => prev.filter((rec) => rec.url !== recordingUrl));
      
      // Call the API to delete the recording permanently
      const response = await fetch(`/api/recordings?url=${encodeURIComponent(recordingUrl)}&callId=${callId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        // If the API call fails, show an error and revert the UI change
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete recording');
      }
      
      const result = await response.json();
      console.log('Deletion result:', result);
      
      // If we get here, the deletion was successful
      toast({
        title: "Success",
        description: "Recording deleted successfully"
      });
      
      // Force refresh of recordings from server to ensure our UI is in sync
      if (client) {
        setTimeout(() => {
          const fetchRecordings = async () => {
            const callData = await Promise.all(
              callRecordings?.map((meeting) => meeting.queryRecordings()) ?? [],
            );
      
            const recordings = callData
              .filter((call) => call.recordings.length > 0)
              .flatMap((call) => call.recordings);
      
            setRecordings(recordings);
          };
          
          fetchRecordings();
        }, 1000); // Slight delay to allow server to process the deletion
      }
      
    } catch (error) {
      console.error("Error deleting recording:", error);
      
      // Revert the UI changes since the deletion failed
      const fetchRecordings = async () => {
        const callData = await Promise.all(
          callRecordings?.map((meeting) => meeting.queryRecordings()) ?? [],
        );
  
        const recordings = callData
          .filter((call) => call.recordings.length > 0)
          .flatMap((call) => call.recordings);
  
        setRecordings(recordings);
      };
      
      fetchRecordings();
      
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete recording",
        variant: "destructive"
      });
    }
  };

  if (isLoading) return <Loader />;

  const calls = getCalls();
  const noCallsMessage = getNoCallsMessage();

  return (
    <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
      {calls && calls.length > 0 ? (
        calls.map((meeting: Call | CallRecording) => (
          <MeetingCard
            key={type === 'recordings' ? (meeting as CallRecording).url : (meeting as Call).id}
            icon={
              type === 'ended'
                ? '/icons/previous.svg'
                : type === 'upcoming'
                  ? '/icons/upcoming.svg'
                  : '/icons/recordings.svg'
            }
            title={
              (meeting as Call).state?.custom?.description ||
              (meeting as CallRecording).filename ||
              'No Description'
            }
            date={
              (meeting as Call).state?.startsAt?.toLocaleString() ||
              (meeting as CallRecording).start_time?.toLocaleString()
            }
            isPreviousMeeting={type === 'ended'}
            link={
              type === 'recordings'
                ? (meeting as CallRecording).url
                : `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${(meeting as Call).id}`
            }
            buttonIcon1={type === 'recordings' ? '/icons/play.svg' : undefined}
            buttonText={type === 'recordings' ? 'Play' : 'Start'}
            handleClick={
              type === 'recordings'
                ? () => router.push(`${(meeting as CallRecording).url}`)
                : () => router.push(`/meeting/${(meeting as Call).id}`)
            }
            buttonIcon2={type === 'recordings' ? '/icons/ai-robot.svg' : undefined}
            buttonText2={type === 'recordings' ? 'Summarise' : 'Start'}
            handleClick2={
              type === 'recordings'
                ? () => router.push(`/summary?recordingUrl=${encodeURIComponent((meeting as CallRecording).url)}`)
                : () => router.push(`/meeting/${(meeting as Call).id}`)
            }
            isRecording={type === 'recordings'}
            handleDelete={type === 'recordings' ? () => handleDeleteRecording((meeting as CallRecording).url) : undefined}
          />
        ))
      ) : (
        <h1 className="text-2xl font-bold text-white">{noCallsMessage}</h1>
      )}
    </div>
  );
};

export default CallList;