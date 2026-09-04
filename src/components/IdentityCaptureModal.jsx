import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Camera,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  X,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200 selection:bg-[#164A29] selection:text-[#79C267]">
      <div className="bg-[#071008] rounded-md w-full max-w-lg border border-[#1A2E1E] overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="p-5 bg-[#164A29] text-[#F2F0E8] flex items-center justify-between shrink-0 border-b border-[#79C267]/30">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded bg-[#050805] border border-[#1A2E1E] flex items-center justify-center text-[#79C267]">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-serif tracking-tight">
                Identity Verification Photo
              </h3>
              <p className="text-xs font-mono text-[#79C267]">
                Live capture for 1:1 Mandi arrival verification
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="p-2 rounded bg-[#050805] hover:bg-[#0A120C] text-[#A6ADA3] hover:text-[#F2F0E8] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4 overflow-y-auto flex-1 text-center bg-[#050805]">
          {cameraError ? (
            <div className="p-6 bg-red-950/40 rounded-sm border border-red-900/60 text-center space-y-3 font-mono">
              <AlertCircle className="w-10 h-10 text-red-400 mx-auto" />
              <h4 className="text-sm font-serif text-red-300">
                Camera Permission Required
              </h4>
              <p className="text-xs text-red-300/80">{cameraError}</p>
              <button
                onClick={startCamera}
                className="px-5 py-2.5 rounded-sm bg-red-900 text-red-100 text-xs font-mono uppercase tracking-wider hover:bg-red-800 transition-colors"
              >
                Retry Camera Access
              </button>
            </div>
          ) : !capturedImage ? (
            <div className="space-y-4">
              {/* Guidance Info Banner */}
              <div className="p-3 bg-[#071008] rounded-sm border border-[#1A2E1E] text-xs text-[#A6ADA3] font-mono flex items-center justify-between text-left">
                <div className="flex items-center gap-2">
                  <Sun className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>
                    Position face inside the oval. Avoid direct sunlight glare &
                    ensure only one person is visible.
                  </span>
                </div>
              </div>

              {/* Video Camera Viewport & Overlay */}
              <div className="relative w-full aspect-[4/3] bg-black rounded-sm overflow-hidden border border-[#1A2E1E] flex items-center justify-center">
                <video
                  ref={videoRef}
                  playsInline
                  muted
                  className="w-full h-full object-cover scale-x-[-1]"
                />
                <canvas ref={canvasRef} className="hidden" />

                {/* Face Alignment Oval Guide */}
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                  <div
                    className={`w-48 h-64 sm:w-56 sm:h-72 rounded-[50%] border-2 transition-all duration-300 ${
                      qualityState.isValid
                        ? "border-[#79C267] bg-[#79C267]/10"
                        : "border-amber-500/50 bg-amber-500/5"
                    }`}
                  />
                </div>

                {/* Realtime Live Quality Status Chip */}
                <div className="absolute top-3 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-sm bg-[#050805]/90 border border-[#1A2E1E] text-[#F2F0E8] text-xs font-mono flex items-center gap-2">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      qualityState.isValid
                        ? "bg-[#79C267] animate-pulse"
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
                className={`w-full py-3.5 rounded-sm font-mono text-xs uppercase tracking-widest border transition-all cursor-pointer ${
                  qualityState.isValid
                    ? "bg-[#164A29] hover:bg-[#12351F] text-[#F2F0E8] border-[#79C267]/30"
                    : "bg-[#071008] text-[#A6ADA3]/40 border-[#1A2E1E] cursor-not-allowed"
                }`}
              >
                <Camera className="w-4 h-4 text-[#79C267] inline-block mr-2" />
                <span>
                  {qualityState.isValid
                    ? "Capture Identity Photo"
                    : "Align Face to Capture"}
                </span>
              </button>
            </div>
          ) : (
            /* PREVIEW CAPTURED PHOTO SCREEN */
            <div className="space-y-4 font-mono">
              <div className="relative w-48 h-48 mx-auto rounded-sm overflow-hidden border-2 border-[#79C267]">
                <img
                  src={capturedImage}
                  alt="Farmer Identity Capture"
                  className="w-full h-full object-cover scale-x-[-1]"
                />
                <div className="absolute bottom-2 right-2 p-1.5 rounded bg-[#164A29] text-[#79C267]">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              </div>

              <div className="p-3 bg-[#12351F]/60 rounded-sm border border-[#79C267]/30 text-xs text-[#79C267] font-mono flex items-center justify-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#79C267]" />
                <span>
                  Identity photo captured ✓ (128-d Feature Vector Encoded)
                </span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleRetake}
                  className="flex-1 py-3 rounded-sm border border-[#1A2E1E] text-xs font-mono text-[#A6ADA3] hover:text-[#F2F0E8] transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  <RefreshCw className="w-4 h-4 text-[#79C267]" />
                  <span>Retake Photo</span>
                </button>

                <button
                  type="button"
                  onClick={handleConfirmPhoto}
                  className="flex-1 py-3 rounded-sm bg-[#164A29] hover:bg-[#12351F] text-[#F2F0E8] text-xs font-mono uppercase tracking-wider border border-[#79C267]/30 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#79C267]" />
                  <span>Confirm Photo</span>
                </button>
              </div>
            </div>
          )}

          <p className="text-[10px] text-[#A6ADA3] font-mono">
            Privacy Protected • Biometric features encrypted and referenced
            exclusively to this booking ID.
          </p>
        </div>
      </div>
    </div>
  );
}

