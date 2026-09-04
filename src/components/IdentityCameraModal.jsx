import React, { useState, useRef, useEffect } from "react";
import {
  X,
  Camera,
  RefreshCw,
  CheckCircle2,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";
import { useApp } from "../context/AppContext";

export default function IdentityCameraModal({ isOpen, onClose, onConfirm }) {
  const { t } = useApp();
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [cameraError, setCameraError] = useState(false);
  const [hasConsent, setHasConsent] = useState(false);

  useEffect(() => {
    if (isOpen && hasConsent && !capturedImage) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [isOpen, hasConsent, capturedImage]);

  const startCamera = async () => {
    setCameraError(false);
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: "user",
        },
        audio: false,
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch {
      setCameraError(true);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  const handleCapture = () => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth || 640;
      canvas.height = videoRef.current.videoHeight || 480;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
      setCapturedImage(dataUrl);
      stopCamera();
    } else {
      // Fallback placeholder image if camera is unavailable
      setCapturedImage("/hero_farmer.jpg");
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
    if (hasConsent) {
      startCamera();
    }
  };

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm(capturedImage || "/hero_farmer.jpg");
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#050805]/90 backdrop-blur-md animate-in fade-in selection:bg-[#79C267] selection:text-[#050805]">
      <div className="relative w-full max-w-md bg-[#071008] text-[#E8E7DE] border border-[#1A2E1E] shadow-2xl overflow-hidden space-y-4 p-6 font-mono">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#1A2E1E] pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 border border-[#79C267]/30 bg-[#164A29]/40 text-[#79C267] flex items-center justify-center">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-serif text-[#F2F0E8]">
                {t("identityVerificationTitle")}
              </h3>
              <p className="text-[11px] font-mono text-[#A6ADA3]">
                {t("takePhotoSub")}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 border border-[#1A2E1E] bg-[#050805] hover:bg-[#164A29] text-[#A6ADA3] hover:text-[#F2F0E8] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Explicit Consent Step */}
        {!hasConsent ? (
          <div className="bg-[#050805] p-5 border border-[#1A2E1E] space-y-4 text-xs">
            <div className="flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-[#79C267] shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="font-serif text-[#F2F0E8] text-sm">
                  Privacy & Photo Verification Consent
                </h4>
                <p className="text-[#A6ADA3] leading-relaxed font-mono text-[11px]">
                  {t("privacyNoticeText")}
                </p>
              </div>
            </div>
            <button
              onClick={() => setHasConsent(true)}
              className="w-full py-3 bg-[#164A29] hover:bg-[#12351F] border border-[#79C267]/40 text-[#F2F0E8] font-mono text-xs uppercase tracking-wider transition-colors cursor-pointer"
            >
              I Consent & Enable Camera
            </button>
          </div>
        ) : (
          /* Camera Preview & Capture Area */
          <div className="space-y-4">
            <div className="relative w-full h-64 bg-[#050805] border border-[#1A2E1E] overflow-hidden flex items-center justify-center">
              {capturedImage ? (
                <img
                  src={capturedImage}
                  alt="Captured Farmer Photo"
                  className="w-full h-full object-cover"
                />
              ) : cameraError ? (
                <div className="text-center p-4 space-y-2">
                  <AlertCircle className="w-8 h-8 text-amber-400 mx-auto" />
                  <p className="text-xs font-mono text-[#F2F0E8]">
                    {t("cameraPermissionError")}
                  </p>
                  <button
                    onClick={handleCapture}
                    className="px-3 py-1.5 border border-[#1A2E1E] bg-[#164A29] text-[#F2F0E8] text-[11px] font-mono uppercase tracking-wider cursor-pointer"
                  >
                    Use Sample Photo Fallback
                  </button>
                </div>
              ) : (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            {/* Actions */}
            {!capturedImage ? (
              <button
                onClick={handleCapture}
                className="w-full py-3 bg-[#164A29] hover:bg-[#12351F] border border-[#79C267]/40 text-[#F2F0E8] font-mono text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Camera className="w-4 h-4 text-[#79C267]" />
                <span>{t("capturePhotoBtn")}</span>
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={handleRetake}
                  className="flex-1 py-3 border border-[#1A2E1E] bg-[#050805] hover:bg-[#164A29] text-[#A6ADA3] hover:text-[#F2F0E8] font-mono text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>{t("retakeBtn")}</span>
                </button>
                <button
                  onClick={handleConfirm}
                  className="flex-1 py-3 bg-[#164A29] hover:bg-[#12351F] border border-[#79C267]/40 text-[#F2F0E8] font-mono text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#79C267]" />
                  <span>{t("confirmPhotoBtn")}</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
