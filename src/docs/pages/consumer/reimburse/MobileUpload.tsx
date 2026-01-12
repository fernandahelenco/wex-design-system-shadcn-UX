import { useState, useEffect, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { WexCard } from "@/components/wex/wex-card";
import { WexButton } from "@/components/wex/wex-button";
import { WexAlert } from "@/components/wex/wex-alert";
import { Upload, CheckCircle2, Camera, Image } from "lucide-react";

/**
 * Mobile Upload Page
 * 
 * Simple mobile-optimized page for uploading receipts via phone.
 * Stores uploaded file in sessionStorage with session ID for desktop sync.
 */
export default function MobileUpload() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = searchParams.get("session");
  const [file, setFile] = useState<File | null>(null);
  const [uploaded, setUploaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Redirect if no session ID
    if (!sessionId) {
      navigate("/reimburse");
    }
  }, [sessionId, navigate]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      // Validate file type
      const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "application/pdf"];
      if (!validTypes.includes(selectedFile.type)) {
        setError("Please upload a JPG, PNG, or PDF file");
        return;
      }

      // Validate file size (10MB max)
      if (selectedFile.size > 10 * 1024 * 1024) {
        setError("File size must be less than 10MB");
        return;
      }

      setFile(selectedFile);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!file || !sessionId) return;

    try {
      // Convert file to base64 for storage
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Data = reader.result as string;
        
        // Store file data in sessionStorage
        const fileData = {
          name: file.name,
          size: `${(file.size / 1024).toFixed(0)} KB`,
          type: file.type,
          data: base64Data,
          timestamp: Date.now(),
        };

        const storageKey = `reimburse-upload-${sessionId}`;
        sessionStorage.setItem(storageKey, JSON.stringify(fileData));
        
        setUploaded(true);
        
        // Auto-close after 2 seconds
        setTimeout(() => {
          window.close();
        }, 2000);
      };

      reader.onerror = () => {
        setError("Failed to read file. Please try again.");
      };

      reader.readAsDataURL(file);
    } catch (err) {
      setError("Failed to upload file. Please try again.");
    }
  };

  if (!sessionId) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#F1FAFE] p-4">
      <div className="max-w-md mx-auto pt-8">
        <WexCard>
          <WexCard.Content className="p-6 space-y-6">
            {/* Header */}
            <div className="text-center space-y-2">
              <h1 className="text-2xl font-bold text-foreground">Upload Receipt</h1>
              <p className="text-sm text-muted-foreground">
                Take a photo or select from your gallery
              </p>
            </div>

            {/* Success Message */}
            {uploaded && (
              <WexAlert intent="success">
                <CheckCircle2 className="h-4 w-4" />
                <WexAlert.Title>Upload successful!</WexAlert.Title>
                <WexAlert.Description>
                  Your receipt has been uploaded. You can close this page and return to your desktop.
                </WexAlert.Description>
              </WexAlert>
            )}

            {/* Error Message */}
            {error && (
              <WexAlert intent="destructive">
                <WexAlert.Title>Upload failed</WexAlert.Title>
                <WexAlert.Description>{error}</WexAlert.Description>
              </WexAlert>
            )}

            {/* File Input */}
            {!uploaded && (
              <div className="space-y-4">
                {/* Camera Button */}
                <input
                  ref={cameraInputRef}
                  type="file"
                  accept="image/*,.pdf"
                  capture="environment"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <WexButton
                  type="button"
                  intent="primary"
                  size="lg"
                  className="w-full h-16"
                  onClick={() => {
                    cameraInputRef.current?.click();
                  }}
                >
                  <Camera className="h-5 w-5 mr-2" />
                  Take Photo
                </WexButton>

                {/* Gallery Button */}
                <input
                  ref={galleryInputRef}
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <WexButton
                  type="button"
                  intent="outline"
                  size="lg"
                  className="w-full h-16"
                  onClick={() => {
                    galleryInputRef.current?.click();
                  }}
                >
                  <Image className="h-5 w-5 mr-2" />
                  Choose from Gallery
                </WexButton>

                {/* Selected File Display */}
                {file && (
                  <div className="space-y-3">
                    <div className="rounded-lg border-2 border-primary/20 bg-primary/5 p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                          <Upload className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">
                            {file.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {(file.size / 1024).toFixed(0)} KB
                          </p>
                        </div>
                      </div>
                    </div>

                    <WexButton
                      type="button"
                      intent="primary"
                      size="lg"
                      className="w-full"
                      onClick={handleUpload}
                    >
                      Upload Receipt
                    </WexButton>
                  </div>
                )}
              </div>
            )}
          </WexCard.Content>
        </WexCard>
      </div>
    </div>
  );
}

