import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";

interface GoogleAuthButtonProps {
  onCredential: (credential: string) => Promise<void>;
  onError: (message: string) => void;
}

interface GoogleCredentialResponse {
  credential?: string;
}

interface GoogleAccountsId {
  initialize: (options: {
    client_id: string;
    callback: (response: GoogleCredentialResponse) => void;
  }) => void;
  renderButton: (
    element: HTMLElement,
    options: { theme: string; size: string; text: string; shape: string; width: string },
  ) => void;
}

declare global {
  interface Window {
    google?: {
      accounts: {
        id: GoogleAccountsId;
      };
    };
  }
}

const GOOGLE_SCRIPT_ID = "google-identity-services";

const GoogleAuthButton = ({ onCredential, onError }: GoogleAuthButtonProps) => {
  const buttonRef = useRef<HTMLDivElement>(null);
  const [isReady, setIsReady] = useState(false);
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  useEffect(() => {
    if (!clientId) return;

    const renderGoogleButton = () => {
      if (!buttonRef.current || !window.google?.accounts.id) return;

      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: async (response) => {
          if (!response.credential) {
            onError("Google did not return a valid credential.");
            return;
          }

          await onCredential(response.credential);
        },
      });

      buttonRef.current.innerHTML = "";
      window.google.accounts.id.renderButton(buttonRef.current, {
        theme: "outline",
        size: "large",
        text: "continue_with",
        shape: "pill",
        width: "320",
      });
      setIsReady(true);
    };

    const existingScript = document.getElementById(GOOGLE_SCRIPT_ID);
    if (existingScript) {
      renderGoogleButton();
      return;
    }

    const script = document.createElement("script");
    script.id = GOOGLE_SCRIPT_ID;
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = renderGoogleButton;
    script.onerror = () => onError("Unable to load Google authentication. Please try again.");
    document.body.appendChild(script);
  }, [clientId, onCredential, onError]);

  if (!clientId) {
    return (
      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={() => onError("Google authentication is not configured. Add VITE_GOOGLE_CLIENT_ID.")}
      >
        Continue with Google
      </Button>
    );
  }

  return (
    <div className="flex w-full justify-center">
      {!isReady && (
        <Button type="button" variant="outline" className="w-full" disabled>
          Loading Google...
        </Button>
      )}
      <div ref={buttonRef} className={isReady ? "flex justify-center" : "hidden"} />
    </div>
  );
};

export default GoogleAuthButton;
