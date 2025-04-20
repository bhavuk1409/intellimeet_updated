
import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
  return (
    <main className="flex h-screen w-full items-center justify-center bg-black relative overflow-hidden">
      
      <div className="absolute inset-0 z-0">
        
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-radial from-blue-900/30 to-transparent opacity-60 animate-pulse-slow"></div>
        
       
        <div className="floating-dots"></div>
        
        
        <div className="glow-effect"></div>
        
       
        <div className="grid-lines"></div>
        
        
        <div className="absolute top-[15%] left-[20%] w-48 h-48 rounded-full bg-gradient-to-r from-purple-500/30 to-blue-500/30 blur-2xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-[15%] right-[20%] w-56 h-56 rounded-full bg-gradient-to-r from-blue-500/30 to-teal-500/30 blur-2xl animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-[60%] left-[10%] w-52 h-52 rounded-full bg-gradient-to-r from-pink-500/30 to-purple-500/30 blur-2xl animate-pulse-slow" style={{ animationDelay: '3s' }}></div>
        
        
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 via-transparent to-purple-900/10"></div>
      </div>
      
      <div className="z-10">
        <SignUp 
          signInUrl="/sign-in"
          redirectUrl="/"
          appearance={{
            elements: {
              formButtonPrimary: "bg-[#007AFF] rounded-md hover:shadow-xl text-base font-medium py-3 w-full",
              card: "bg-[#000000] border-none shadow-2xl px-6 py-6 max-w-md w-full"
            }
          }}
        />
      </div>
    </main>
  );
} 
  