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

      console.log("Recording object:", recording);
      console.log("Recording URL:", recordingUrl);
      
      // Extract the recording ID (without file extension)
      const recordingIdMatch = recordingUrl.match(/\/([^\/]+?)(\.[^\.]+)?$/);
      const recordingId = recordingIdMatch ? recordingIdMatch[1] : '';
      console.log("Extracted recording ID:", recordingId);

      // Try multiple approaches to extract the call ID
      let callId;
      
      // Approach 1: Try direct properties on the recording object
      if ((recording as any).call_id) {
        callId = (recording as any).call_id;
        console.log("Call ID from call_id property:", callId);
      } 
      // Approach 2: Check callId property
      else if ((recording as any).callId) {
        callId = (recording as any).callId;
        console.log("Call ID from callId property:", callId);
      }
      // Approach 3: Check call object
      else if ((recording as any).call?.id) {
        callId = (recording as any).call.id;
        console.log("Call ID from call.id property:", callId);
      }
      // Approach 4: Parse from URL format /calls/{callId}/recordings/{recordingId}
      else {
        // Parse URL to extract call ID
        try {
          const urlObj = new URL(recordingUrl);
          const pathSegments = urlObj.pathname.split('/').filter(Boolean);
          
          // Check different URL patterns
          // Pattern: /calls/{callId}/recordings/{recordingId}
          const callsIndex = pathSegments.findIndex(segment => segment === 'calls');
          if (callsIndex >= 0 && callsIndex < pathSegments.length - 1) {
            callId = pathSegments[callsIndex + 1];
            console.log("Call ID extracted from URL pattern /calls/{callId}/:", callId);
          } 
          // Fallback: Just take the segment before the last one
          else {
            callId = pathSegments.slice(-2)[0];
            console.log("Call ID from second-to-last URL segment:", callId);
          }
        } catch (e) {
          // Simpler fallback if URL parsing fails
          callId = recordingUrl.split('/').slice(-2)[0];
          console.log("Call ID from fallback URL splitting:", callId);
        }
      }
      
      if (!callId) {
        toast({
          title: "Error",
          description: "Could not determine call ID for this recording",
          variant: "destructive"
        });
        return;
      }

      // Remove the recording from the UI first for immediate feedback
      setRecordings((prev) => prev.filter((rec) => rec.url !== recordingUrl));
      
      // Call the API to delete the recording permanently
      console.log(`Calling API to delete recording: ${recordingUrl} with callId: ${callId}`);
      const response = await fetch(`/api/recordings?url=${encodeURIComponent(recordingUrl)}&callId=${callId}`, {
        method: 'DELETE',
      });
      
      // Log the raw response for debugging
      console.log("API response status:", response.status);
      
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
        description: result.local_only 
          ? "Recording removed from view. Refresh may restore it." 
          : "Recording deleted successfully"
      });
      
      // Force refresh of recordings from server to ensure our UI is in sync
      if (!result.local_only && client) {
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