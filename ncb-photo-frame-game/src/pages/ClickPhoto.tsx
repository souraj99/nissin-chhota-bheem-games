import "../styles/pages.scss";
import "./ClickPhoto.scss";
import MainLayout from "../layouts/MainLayout.tsx";
import { useLocation, useNavigate } from "react-router-dom";
import { PHOTO_FRAMES } from "../lib/images.ts";
import { useState, useRef, useEffect } from "react";
import { ROUTES } from "../lib/consts.ts";

const LOADING_MESSAGES = [
  "Creating your memory...",
  "Adding magic touch...",
  "Almost there...",
];

function ClickPhoto() {
  const location = useLocation();
  const navigate = useNavigate();
  const frameData = location.state?.frame;
  const matchedFrameImage = PHOTO_FRAMES.find(
    (frame) => frame.id === frameData?.id
  );

  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLoading) {
      interval = setInterval(() => {
        setLoadingMessageIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageDataUrl = e.target?.result as string;
        setCapturedImage(imageDataUrl);
        mergeImageWithFrame(imageDataUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleConfirm = () => {
    navigate(ROUTES.DOWNLOAD, {
      state: { image: capturedImage },
      replace: true,
    });
  };

  const mergeImageWithFrame = async (imageDataUrl: string) => {
    setIsLoading(true);
    setLoadingMessageIndex(0);

    try {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Load captured photo
      const photoImg = new Image();
      photoImg.src = imageDataUrl;
      await new Promise((resolve) => (photoImg.onload = resolve));

      // Load frame
      const frameImg = new Image();
      frameImg.src = matchedFrameImage?.image || "";
      await new Promise((resolve) => (frameImg.onload = resolve));

      // Set canvas size to frame dimensions
      canvas.width = frameImg.width;
      canvas.height = frameImg.height;

      // Calculate photo dimensions to fit inside frame
      const frameAspect = frameImg.width / frameImg.height;
      const photoAspect = photoImg.width / photoImg.height;

      let drawWidth = canvas.width;
      let drawHeight = canvas.height;
      let offsetX = 0;
      let offsetY = 0;

      if (photoAspect > frameAspect) {
        drawWidth = canvas.height * photoAspect;
        offsetX = (canvas.width - drawWidth) / 2;
      } else {
        drawHeight = canvas.width / photoAspect;
        offsetY = (canvas.height - drawHeight) / 2;
      }

      // Draw photo first
      ctx.drawImage(photoImg, offsetX, offsetY, drawWidth, drawHeight);

      // Draw frame on top
      ctx.drawImage(frameImg, 0, 0, canvas.width, canvas.height);

      // Convert to blob with high quality
      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((b) => resolve(b as Blob), "image/png", 1.0);
      });

      const mergedImageUrl = URL.createObjectURL(blob);
      setCapturedImage(mergedImageUrl);
    } catch (error) {
      console.error("Error merging images:", error);
      alert("Error processing image. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
      fileInputRef.current.click();
    }
  };

  const handleBack = () => {
    window.history.back();
  };

  return (
    <MainLayout className="common-page click-photo-page">
      <div className="common-content">
        <h1 className="common-heading lh-50">
          <span className="heading-line heading-small orange-font">
            {capturedImage ? "LOOKING" : "SAY"}
          </span>{" "}
          <br />
          <span className="heading-line heading-line-1 orange-font">
            {capturedImage ? "GREAT" : "CHEESE"}
          </span>
        </h1>

        <div className="photo-merge-container">
          {isLoading ? (
            <div className="loading-overlay">
              <div className="spinner"></div>
              <p className="loading-message">
                {LOADING_MESSAGES[loadingMessageIndex]}
              </p>
            </div>
          ) : capturedImage ? (
            <div className="photo-frame merged">
              <img src={capturedImage} alt="Merged Photo" />
            </div>
          ) : (
            <div className="photo-frame">
              <img
                src={matchedFrameImage?.image || ""}
                alt={matchedFrameImage?.name || "Photo Frame"}
              />
            </div>
          )}
        </div>

        {capturedImage ? (
          <button className="btn " onClick={handleConfirm}>
            Confirm
          </button>
        ) : (
          <>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFileUpload}
              style={{ display: "none" }}
              id="camera-input"
            />
            <label htmlFor="camera-input" className="btn ">
              Click Selfie
            </label>
          </>
        )}

        <button
          className="btn transparent"
          onClick={capturedImage ? handleRetake : handleBack}
        >
          {capturedImage ? "Retake" : "Back"}
        </button>
      </div>

      <canvas ref={canvasRef} style={{ display: "none" }} />
    </MainLayout>
  );
}

export default ClickPhoto;
