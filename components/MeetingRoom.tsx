
'use client';

import { useState } from 'react';
import {
  CallControls,
  CallParticipantsList,
  CallStatsButton,
  CallingState,
  PaginatedGridLayout,
  SpeakerLayout,
  useCallStateHooks,
  useCall,
} from '@stream-io/video-react-sdk';
import { useRouter, useSearchParams } from 'next/navigation';
import { Users, LayoutList, MessageCircle, UserPlus } from 'lucide-react';
import { toast } from 'sonner';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';

import Loader from './Loader';
import EndCallButton from './EndCallButton';
import ChatPanel from './ChatPanel';
import { cn } from '@/lib/utils';

type CallLayoutType = 'grid' | 'speaker-left' | 'speaker-right';

const MeetingRoom = () => {
  const searchParams = useSearchParams();
  const isPersonalRoom = !!searchParams.get('personal');
  const router = useRouter();
  const [layout, setLayout] = useState<CallLayoutType>('speaker-left');
  const [showParticipants, setShowParticipants] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const { useCallCallingState } = useCallStateHooks();
  const call = useCall();

  const callingState = useCallCallingState();
  const meetingLink = typeof window !== 'undefined' ? window.location.href : '';

  if (callingState !== CallingState.JOINED) return <Loader />;

  const CallLayout = () => {
    switch (layout) {
      case 'grid':
        return <PaginatedGridLayout />;
      case 'speaker-right':
        return <SpeakerLayout participantsBarPosition="left" />;
      default:
        return <SpeakerLayout participantsBarPosition="right" />;
    }
  };

  return (
    <section className="relative h-screen w-full overflow-hidden pt-4 text-white">
      <div className="relative flex size-full items-center justify-center">
        <div className="flex size-full max-w-[1000px] items-center">
          <CallLayout />
        </div>
        <div
          className={cn('h-[calc(100vh-86px)] hidden ml-2', {
            'show-block': showParticipants,
          })}
        >
          <CallParticipantsList onClose={() => setShowParticipants(false)} />
        </div>
      </div>

      {/* Chat Panel */}
      <ChatPanel 
        isOpen={showChat} 
        onClose={() => setShowChat(false)}
        call={call}
      />
      
      <div className="fixed bottom-0 flex w-full items-center justify-center gap-3 px-4 pb-3">
        <CallControls onLeave={() => router.push(`/`)} />

        
        <DropdownMenu>
          <div className="flex items-center">
            <DropdownMenuTrigger className="cursor-pointer rounded-2xl bg-[#19232d] px-4 py-2 hover:bg-[#4c535b]">
              <LayoutList size={20} className="text-white" />
            </DropdownMenuTrigger>
          </div>
          <DropdownMenuContent className="border-dark-1 bg-dark-1 text-white">
            {['Grid', 'Speaker-Left', 'Speaker-Right'].map((item, index) => (
              <div key={index}>
                <DropdownMenuItem
                  onClick={() =>
                    setLayout(item.toLowerCase() as CallLayoutType)
                  }
                >
                  {item}
                </DropdownMenuItem>
                <DropdownMenuSeparator className="border-dark-1" />
              </div>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Chat Button */}
        <button onClick={() => setShowChat((prev) => !prev)}>
          <div className={cn(
            "cursor-pointer rounded-2xl px-4 py-2 flex items-center gap-1",
            showChat 
              ? "bg-blue-600 hover:bg-blue-700" 
              : "bg-[#19232d] hover:bg-[#4c535b]"
          )}>
            <MessageCircle size={20} />
            <span className="hidden md:inline text-sm">Chat</span>
          </div>
        </button>

        
        <Dialog>
          <DialogTrigger asChild>
            <button>
              <div className="cursor-pointer rounded-2xl bg-[#19232d] px-4 py-2 hover:bg-[#4c535b] flex items-center gap-1">
                <UserPlus size={20} />
                <span className="hidden md:inline text-sm">Invite</span>
              </div>
            </button>
          </DialogTrigger>
          <DialogContent className="bg-[#1a1a1a] text-white border border-white/10 max-w-sm rounded-2xl p-6">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold mb-4">Invite Participants</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div className="grid gap-2 rounded-md bg-[#111] px-4 py-2 text-sm">
                <span className="truncate max-w-[80%]">{meetingLink}</span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(meetingLink);
                    toast.success('Link copied!');
                  }}
                  className="text-blue-400 hover:underline text-xs whitespace-nowrap"
                >
                  Copy
                </button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        
        <button onClick={() => setShowParticipants((prev) => !prev)}>
          <div className={cn(
            "cursor-pointer rounded-2xl px-4 py-2 flex items-center gap-1",
            showParticipants 
              ? "bg-blue-600 hover:bg-blue-700" 
              : "bg-[#19232d] hover:bg-[#4c535b]"
          )}>
            <Users size={20} />
            <span className="hidden md:inline text-sm">Participants</span>
          </div>
        </button>

        
        {!isPersonalRoom && <EndCallButton />}
      </div>
    </section>
  );
};

export default MeetingRoom;


