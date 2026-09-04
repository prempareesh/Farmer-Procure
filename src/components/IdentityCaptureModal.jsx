import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Camera,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  X,
  Sparkles,
  Sun,
} from "lucide-react";
import { analyzeFrame, extractFaceEmbedding } from "../utils/faceVerification";
import { useApp } from "../context/AppContext";

export default function IdentityCaptureModal({
  isOpen,
  onClose,
  onPhotoCaptured,
  currentPhotoData = null,
}) {
  const { t } = useApp();

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const animFrameRef = useRef(null);

  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState("");
  const [capturedImage, setCapturedImage] = useState(
    currentPhotoData?.photoUrl || null,
  );
  const [capturedEmbedding, setCapturedEmbedding] = useState(
    currentPhotoData?.embedding || null,
  );

  // Quality check state
  const [qualityState, setQualityState] = useState({
    isValid: false,
    status: "INITIALIZING",
    message: "Initializing camera...",
    faceBox: null,
  });

  const stopCamera = useCallback(() => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  }, []);

  const runQualityCheck = useCallback(() => {
    if (!videoRef.current || !canvasRef.current || !cameraActive) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    if (video.readyState === video.HAVE_ENOUGH_DATA) {
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const analysis = analyzeFrame(canvas);
      setQualityState(analysis);
    }

    animFrameRef.current = requestAnimationFrame(runQualityCheck);
  }, [cameraActive]);

  const startCamera = useCallback(async () => {
    setCameraError("");
    setCapturedImage(null);
    setCapturedEmbedding(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 640 },
          height: { ideal: 480 },
        },
        audio: false,
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setCameraActive(true);
      }
    } catch (err) {
      console.warn("Camera access error:", err);
      setCameraError(
        "Camera permission denied or camera unavailable. Please enable camera access in browser settings.",
      );
      setCameraActive(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen && !capturedImage) {
      startCamera();
    } else if (!isOpen) {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [isOpen, capturedImage, startCamera, stopCamera]);

  useEffect(() => {
    if (cameraActive) {
      animFrameRef.current = requestAnimationFrame(runQualityCheck);
    }
    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [cameraActive, runQualityCheck]);

  const handleCapturePhoto = () => {
    if (!canvasRef.current || !qualityState.isValid) return;

    const canvas = canvasRef.current;
    const photoUrl = canvas.toDataURL("image/jpeg", 0.85);
    const embedding = extractFaceEmbedding(canvas, qualityState.faceBox);

    setCapturedImage(photoUrl);
    setCapturedEmbedding(embedding);
    stopCamera();
  };

  const handleRetake = () => {
    setCapturedImage(null);
    setCapturedEmbedding(null);
    startCamera();
  };

  const handleConfirmPhoto = () => {
    if (!capturedImage) return;
    onPhotoCaptured({
      photoUrl: capturedImage,
      embedding: capturedEmbedding,
      capturedAt: new Date().toISOString(),
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-[#E0ECE0] overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="p-5 bg-gradient-to-r from-[#1B4318] to-[#2E7D32] text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-[#F9A825]">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black tracking-tight">
                Identity Verification Photo
              </h3>
              <p className="text-xs text-emerald-100 font-semibold">
                Live capture for 1:1 Mandi arrival verification
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4 overflow-y-auto flex-1 text-center">
          {cameraError ? (
            <div className="p-6 bg-red-50 rounded-2xl border border-red-200 text-center space-y-3">
              <AlertCircle className="w-10 h-10 text-red-600 mx-auto" />
              <h4 className="text-sm font-bold text-red-900">
                Camera Permission Required
              </h4>
              <p className="text-xs text-red-700">{cameraError}</p>
              <button
                onClick={startCamera}
                className="px-5 py-2 rounded-xl bg-red-600 text-white text-xs font-bold hover:bg-red-700 transition-colors"
              >
                Retry Camera Access
              </button>
            </div>
          ) : !capturedImage ? (
            <div className="space-y-3">
              {/* Guidance Info Banner */}
              <div className="p-3 bg-[#FAF8F2] rounded-2xl border border-amber-200 text-xs text-amber-900 font-semibold flex items-center justify-between text-left">
                <div className="flex items-center gap-2">
                  <Sun className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>
                    Position face inside the oval. Avoid direct sunlight glare &
                    ensure only one person is visible.
                  </span>
                </div>
              </div>

              {/* Video Camera Viewport & Overlay */}
              <div className="relative w-full aspect-[4/3] bg-black rounded-2xl overflow-hidden shadow-inner flex items-center justify-center">
                <video
                  ref={videoRef}
                  playsInline
                  muted
                  className="w-full h-full object-cover scale-x-[-1]"
                />
                <canvas ref={canvasRef} className="hidden" />

                {/* Subtle Face Alignment Oval Guide */}
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                  <div
                    className={`w-48 h-64 sm:w-56 sm:h-72 rounded-[50%] border-2 transition-all duration-300 ${
                      qualityState.isValid
                        ? "border-emerald-400 bg-emerald-500/10 shadow-[0_0_20px_rgba(52,211,153,0.4)]"
                        : "border-amber-400/70 bg-amber-500/5"
                    }`}
                  />
                </div>

                {/* Realtime Live Quality Status Chip */}
                <div className="absolute top-3 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-full bg-black/70 backdrop-blur-md text-white text-xs font-bold flex items-center gap-2 shadow-lg">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      qualityState.isValid
                        ? "bg-emerald-400 animate-pulse"
                        : "bg-amber-400"
                    }`}
                  />
                  <span>{qualityState.message}</span>
                </div>
              </div>

              {/* Primary Capture Action Button */}
              <button
                type="button"
                onClick={handleCapturePhoto}
                disabled={!qualityState.isValid}
                className={`w-full py-3.5 rounded-2xl text-xs font-black shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  qualityState.isValid
                    ? "bg-[#1B4318] hover:bg-[#2E7D32] text-white active:scale-95"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                <Camera className="w-4 h-4 text-[#F9A825]" />
                <span>
                  {qualityState.isValid
                    ? "Capture Identity Photo"
                    : "Align Face to Capture"}
                </span>
              </button>
            </div>
          ) : (
            /* PREVIEW CAPTURED PHOTO SCREEN */
            <div className="space-y-4">
              <div className="relative w-48 h-48 mx-auto rounded-3xl overflow-hidden border-4 border-[#2E7D32] shadow-xl">
                <img
                  src={capturedImage}
                  alt="Farmer Identity Capture"
                  className="w-full h-full object-cover scale-x-[-1]"
                />
                <div className="absolute bottom-2 right-2 p-1.5 rounded-full bg-[#2E7D32] text-white">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              </div>

              <div className="p-3 bg-[#E8F5E9] rounded-2xl border border-[#A5D6A7] text-xs text-[#1B4318] font-extrabold flex items-center justify-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#2E7D32]" />
                <span>
                  Identity photo captured ✓ (128-d Feature Vector Encoded)
                </span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleRetake}
                  className="flex-1 py-3 rounded-xl border border-gray-300 text-xs font-bold text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Retake Photo</span>
                </button>

                <button
                  type="button"
                  onClick={handleConfirmPhoto}
                  className="flex-1 py-3 rounded-xl bg-[#1B4318] hover:bg-[#2E7D32] text-white text-xs font-black shadow-md transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#F9A825]" />
                  <span>Confirm Photo</span>
                </button>
              </div>
            </div>
          )}

          <p className="text-[10px] text-gray-400 font-medium">
            Privacy Protected • Biometric features encrypted and referenced
            exclusively to this booking ID.
          </p>
        </div>
      </div>
    </div>
  );
}
