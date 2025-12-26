import "../styles/pages.scss";
import MainLayout from "../layouts/MainLayout.tsx";
import { useLocation } from "react-router-dom";
import { IMAGES } from "../lib/images.ts";

function DownloadPhoto() {
  const image = useLocation().state?.image;
  const downloadImage = () => {
    if (!image) return;
    const link = document.createElement("a");
    link.href = image;
    link.download = "my_photo_with_chota_bheem.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const shareImage = async () => {
    if (!image) return;

    try {
      // Fetch the blob from the blob URL
      const response = await fetch(image);
      const blob = await response.blob();
      const file = new File([blob], "my_photo_with_chota_bheem.png", {
        type: "image/png",
      });

      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          text: `Check out my photo with Chota Bheem!\n\nDownload your own photo frame at https://thedigitalapps.com/nissin-chhota-bheem/game/photo-frame-game/`,
          files: [file],
        });
      } else {
        alert("Sharing not supported on this browser.");
      }
    } catch (error) {
      console.error("Error sharing", error);
      alert("Error sharing image. Please try downloading instead.");
    }
  };

  return (
    <MainLayout className="common-page">
      <div className="common-content">
        <h1 className="common-heading lh-50 mb1">
          <span className="heading-line heading-line-1 orange-font">
            AWESOME
          </span>
        </h1>
        <div className="image-section">
          {image ? (
            <img src={image} alt="Downloaded" />
          ) : (
            <p>No image available</p>
          )}
        </div>
        <button className="btn mt-2" onClick={downloadImage}>
          Download
        </button>
        <div className="share-section">
          <p>Share with your Friends </p>
          <img
            src={IMAGES.Icon_Share}
            alt="Share Icon"
            role="button"
            onClick={shareImage}
          />
        </div>
      </div>
    </MainLayout>
  );
}

export default DownloadPhoto;
