"use client";

import Image from "next/image";

import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { avatarImages } from "@/constants";
import { useToast } from "./ui/use-toast";

interface MeetingCardProps {
  title: string;
  date: string;
  icon: string;
  isPreviousMeeting?: boolean;
  buttonIcon1?: string;
  buttonText?: string;
  handleClick: () => void;
  link: string;
  buttonIcon2?: string;
  buttonText2?: string;
  handleClick2?: () => void;
  isRecording?: boolean;
  handleDelete?: () => void;
}

const MeetingCard = ({
  icon,
  title,
  date,
  isPreviousMeeting,
  buttonIcon1,
  handleClick,
  link,
  buttonText,
  buttonIcon2,
  buttonText2,
  handleClick2,
  isRecording,
  handleDelete,
}: MeetingCardProps) => {
  const { toast } = useToast();

  return (
    <section className="ios-card group flex min-h-[300px] w-full flex-col justify-between p-6 ios-shadow ios-transition bg-dark-3 border border-gray-1 border-opacity-5 xl:max-w-[568px]">
      <article className="flex flex-col gap-5">
        <div className="flex items-start gap-3">
          <div className="flex-center size-12 rounded-full bg-dark-4 group-hover:animate-ios-bounce ios-fill shrink-0">
            <div className="flex-center size-10 rounded-full bg-gradient-to-br from-blue-1/10 to-purple-1/10">
              <Image src={icon} alt="meeting type" width={24} height={24} />
            </div>
          </div>
          <div className="flex flex-col flex-1 overflow-hidden">
            <h1 
              title={title} 
              className="text-xl font-bold ios-gradient-text break-all hyphens-auto"
              style={{
                wordWrap: "break-word",
                maxWidth: "100%",
                display: "block"
              }}
            >
              {title}
            </h1>
            <p className="text-sm font-normal text-gray-1">{date}</p>
          </div>
          
          {isRecording && handleDelete && (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                if (confirm("Are you sure you want to delete this recording? This action cannot be undone.")) {
                  handleDelete();
                }
              }}
              className="ml-auto flex-center size-10 rounded-full bg-dark-4 hover:bg-red-500/20 ios-transition shrink-0"
              aria-label="Delete recording"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500">
                <path d="M3 6h18"></path>
                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                <line x1="10" y1="11" x2="10" y2="17"></line>
                <line x1="14" y1="11" x2="14" y2="17"></line>
              </svg>
            </button>
          )}
        </div>
      </article>
      
      <article className="mt-4">
        <div className="relative flex w-full max-sm:hidden">
          {avatarImages.map((img, index) => (
            <div 
              key={index} 
              className={cn(
                "relative rounded-full overflow-hidden border-2 border-dark-3", 
                { 
                  "ml-[-16px]": index > 0 
                }
              )}
              style={{ zIndex: 10 - index }}
            >
              <Image
                src={img}
                alt="attendees"
                width={40}
                height={40}
                className="size-10 object-cover"
              />
            </div>
          ))}
          <div className="flex-center ml-[-16px] size-10 rounded-full border-2 border-dark-3 bg-dark-4 text-sm font-medium z-0">
            +5
          </div>
        </div>
      </article>
      
      {!isPreviousMeeting && (
        <div className="flex flex-wrap gap-3 mt-5">
          <Button 
            onClick={handleClick} 
            className="ios-button bg-gradient-to-r from-blue-1 to-blue-2 text-white border-none shadow-ios rounded-full ios-fill"
          >
            {buttonIcon1 && (
              <Image src={buttonIcon1} alt="feature" width={20} height={20} className="mr-2" />
            )}
            {buttonText}
          </Button>
          
          <Button
            onClick={() => {
              navigator.clipboard.writeText(link);
              toast({
                title: "Link Copied",
                description: "Meeting link has been copied to clipboard"
              });
            }}
            className="ios-button bg-dark-4 text-white hover:bg-dark-4/80 rounded-full ios-fill"
          >
            <Image
              src="/icons/copy.svg"
              alt="copy"
              width={16}
              height={16}
              className="mr-2"
            />
            Copy Link
          </Button>
          
          <Button 
            onClick={handleClick2} 
            className="ios-button bg-gradient-to-r from-green-1 to-green-1/80 text-white border-none shadow-ios rounded-full ios-fill"
          >
            {buttonIcon2 && (
              <Image src={buttonIcon2} alt="AI Summarize" width={20} height={20} className="mr-2" />
            )}
            {buttonText2}
          </Button>
        </div>
      )}
    </section>
  );
};

export default MeetingCard;
