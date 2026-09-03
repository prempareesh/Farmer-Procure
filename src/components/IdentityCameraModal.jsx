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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in selection:bg-[#2E7D32] selection:text-white">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden space-y-4 p-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center font-bold">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-[#111827]">
                {t("identityVerificationTitle")}
              </h3>
              <p className="text-[11px] text-gray-500 font-medium">
                {t("takePhotoSub")}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Explicit Consent Step */}
        {!hasConsent ? (
          <div className="bg-[#FAFBF8] p-5 rounded-2xl border border-gray-200 space-y-4 text-xs">
            <div className="flex items-start gap-3">
              <ShieldCheck className="w-6 h-6 text-[#2E7D32] shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="font-bold text-gray-900">
                  Privacy & Photo Verification Consent
                </h4>
                <p className="text-gray-600 leading-relaxed">
                  {t("privacyNoticeText")}
                </p>
              </div>
            </div>
            <button
              onClick={() => setHasConsent(true)}
              className="w-full py-3 rounded-xl bg-[#1B4318] hover:bg-[#2E7D32] text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
            >
              I Consent & Enable Camera
            </button>
          </div>
        ) : (
          /* Camera Preview & Capture Area */
          <div className="space-y-4">
            <div className="relative w-full h-64 bg-gray-900 rounded-2xl overflow-hidden flex items-center justify-center border border-gray-200">
              {capturedImage ? (
                <img
                  src={capturedImage}
                  alt="Captured Farmer Photo"
                  className="w-full h-full object-cover"
                />
              ) : cameraError ? (
                <div className="text-center p-4 space-y-2">
                  <AlertCircle className="w-8 h-8 text-amber-400 mx-auto" />
                  <p className="text-xs font-bold text-white">
                    {t("cameraPermissionError")}
                  </p>
                  <button
                    onClick={handleCapture}
                    className="px-3 py-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white text-[11px] font-bold cursor-pointer"
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
                className="w-full py-3.5 rounded-xl bg-[#1B4318] hover:bg-[#2E7D32] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
              >
                <Camera className="w-4 h-4" />
                <span>{t("capturePhotoBtn")}</span>
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={handleRetake}
                  className="flex-1 py-3 rounded-xl border border-gray-300 text-gray-700 font-bold text-xs hover:bg-gray-50 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>{t("retakeBtn")}</span>
                </button>
                <button
                  onClick={handleConfirm}
                  className="flex-1 py-3 rounded-xl bg-[#2E7D32] hover:bg-[#1B4318] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
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
