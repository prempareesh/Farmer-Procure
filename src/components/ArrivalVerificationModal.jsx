import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Camera,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ShieldCheck,
  RefreshCw,
  X,
  User,
  Sun,
} from "lucide-react";
import {
  analyzeFrame,
  extractFaceEmbedding,
  compareFaceEmbeddings,
} from "../utils/faceVerification";
import { useApp } from "../context/AppContext";

export default function ArrivalVerificationModal({
  isOpen,
  onClose,
  booking,
  onVerificationComplete,
}) {
  const { user, identityVerifications, verifyArrivalIdentity, t } = useApp();

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const animFrameRef = useRef(null);

  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState("");
  const [capturedArrivalPhoto, setCapturedArrivalPhoto] = useState(null);
  const [verifying, setVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);
  const [staffRemarks, setStaffRemarks] = useState("");

  // Quality check state
  const [qualityState, setQualityState] = useState({
    isValid: false,
    status: "INITIALIZING",
    message: "Initializing camera...",
    faceBox: null,
  });

  // Find linked booking identity capture
  const existingRecord = identityVerifications.find(
    (v) =>
      v.bookingId === (booking?.booking_id || booking?.id) ||
      v.booking_id === (booking?.booking_id || booking?.id),
  );

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
    setCapturedArrivalPhoto(null);
    setVerificationResult(null);

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
      console.warn("Staff arrival camera access error:", err);
      setCameraError(
        "Camera permission denied or camera unavailable. Please enable camera access in browser settings.",
      );
      setCameraActive(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen && !capturedArrivalPhoto) {
      startCamera();
    } else if (!isOpen) {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [isOpen, capturedArrivalPhoto, startCamera, stopCamera]);

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

  const handleCaptureArrivalPhoto = async () => {
    if (!canvasRef.current || !qualityState.isValid || !booking) return;

    const canvas = canvasRef.current;
    const arrivalPhotoUrl = canvas.toDataURL("image/jpeg", 0.85);
    const arrivalEmbedding = extractFaceEmbedding(canvas, qualityState.faceBox);

    setCapturedArrivalPhoto(arrivalPhotoUrl);
    stopCamera();

    setVerifying(true);
    try {
      // 1:1 Cosine Similarity Face Comparison
      const bookingEmbedding =
        existingRecord?.bookingFaceEmbedding ||
        existingRecord?.booking_face_embedding ||
        null;

      const comparison = compareFaceEmbeddings(
        bookingEmbedding,
        arrivalEmbedding,
        0.7,
      );
      setVerificationResult(comparison);

      // Persist verification result to Supabase & Context State
      const res = await verifyArrivalIdentity(
        booking.id || booking.booking_id,
        {
          arrivalPhotoUrl,
          arrivalEmbedding,
          verificationStatus: comparison.status,
          verificationScore: comparison.score,
          reviewRequired: comparison.reviewRequired,
          staffRemarks: staffRemarks || comparison.message,
        },
      );

      if (onVerificationComplete) {
        onVerificationComplete(res);
      }
    } catch (err) {
      console.warn("Arrival face comparison error:", err);
    } finally {
      setVerifying(false);
    }
  };

  const handleStaffManualConfirm = async (forcedStatus = "VERIFIED") => {
    if (!booking) return;
    setVerifying(true);
    try {
      const res = await verifyArrivalIdentity(
        booking.id || booking.booking_id,
        {
          arrivalPhotoUrl: capturedArrivalPhoto,
          verificationStatus: forcedStatus,
          verificationScore: verificationResult?.score || 0.85,
          reviewRequired: false,
          staffRemarks:
            staffRemarks || `Manual Staff Override by ${user?.name || "Staff"}`,
        },
      );

      if (onVerificationComplete) {
        onVerificationComplete(res);
      }
      onClose();
    } catch (err) {
      console.warn("Manual staff override error:", err);
    } finally {
      setVerifying(false);
    }
  };

  const handleRetake = () => {
    setCapturedArrivalPhoto(null);
    setVerificationResult(null);
    startCamera();
  };

  if (!isOpen || !booking) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#050805]/90 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#071008] text-[#E8E7DE] rounded-none w-full max-w-lg border border-[#1A2E1E] shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-5 bg-[#0A180D] border-b border-[#1A2E1E] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 border border-[#79C267]/30 bg-[#164A29]/40 flex items-center justify-center text-[#79C267]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-serif font-normal text-[#F2F0E8] tracking-wide">
                Mandi Gate Arrival Verification
              </h3>
              <p className="text-[11px] font-mono text-[#A6ADA3]">
                Token #{booking.tokenDisplay || "P001"} • {booking.farmerName} ({booking.farmerId})
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="p-1.5 border border-[#1A2E1E] bg-[#050805] hover:bg-[#164A29] text-[#A6ADA3] hover:text-[#F2F0E8] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4 overflow-y-auto flex-1 text-center font-mono">
          {/* Booking Info Card */}
          <div className="p-4 bg-[#050805] border border-[#1A2E1E] text-xs grid grid-cols-2 gap-3 text-left">
            <div>
              <span className="text-[10px] text-[#A6ADA3] uppercase block tracking-wider">
                Farmer Name
              </span>
              <span className="text-[#F2F0E8] font-serif text-sm">
                {booking.farmerName}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-[#A6ADA3] uppercase block tracking-wider">
                Farmer ID
              </span>
              <span className="text-[#79C267] font-mono">
                {booking.farmerId}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-[#A6ADA3] uppercase block tracking-wider">
                Token Number
              </span>
              <span className="text-[#F2F0E8] font-serif text-sm">
                #{booking.tokenDisplay}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-[#A6ADA3] uppercase block tracking-wider">
                Crop / Quantity
              </span>
              <span className="text-[#79C267]">
                {booking.crop} ({booking.quantity} Qtl)
              </span>
            </div>
          </div>

          {cameraError ? (
            <div className="p-6 bg-[#1C0A0A] border border-red-900/50 text-center space-y-3">
              <AlertTriangle className="w-8 h-8 text-red-400 mx-auto" />
              <h4 className="text-sm font-serif text-red-200">
                Camera Access Error
              </h4>
              <p className="text-xs text-red-300 font-mono">{cameraError}</p>
              <button
                onClick={startCamera}
                className="px-4 py-2 bg-red-950 hover:bg-red-900 border border-red-700 text-red-200 text-xs font-mono uppercase tracking-wider transition-colors cursor-pointer"
              >
                Retry Live Camera
              </button>
            </div>
          ) : !capturedArrivalPhoto ? (
            <div className="space-y-3">
              {/* Guidance Info Banner */}
              <div className="p-3 bg-[#050805] border border-[#1A2E1E] text-xs text-[#A6ADA3] flex items-center justify-between text-left">
                <div className="flex items-center gap-2">
                  <Sun className="w-4 h-4 text-[#79C267] shrink-0" />
                  <span className="text-[11px]">
                    Capture live arrival photo of farmer at Mandi Gate for 1:1 facial comparison.
                  </span>
                </div>
              </div>

              {/* Video Camera Viewport & Overlay */}
              <div className="relative w-full aspect-[4/3] bg-[#050805] border border-[#1A2E1E] overflow-hidden flex items-center justify-center">
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
                    className={`w-48 h-64 sm:w-56 sm:h-72 border transition-all duration-300 ${
                      qualityState.isValid
                        ? "border-[#79C267] bg-[#79C267]/10 shadow-[0_0_20px_rgba(121,194,103,0.3)]"
                        : "border-[#1A2E1E] bg-black/40"
                    }`}
                  />
                </div>

                {/* Realtime Live Quality Status Chip */}
                <div className="absolute top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-[#071008]/90 border border-[#1A2E1E] text-[#F2F0E8] text-xs font-mono flex items-center gap-2">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      qualityState.isValid
                        ? "bg-[#79C267] animate-pulse"
                        : "bg-amber-500"
                    }`}
                  />
                  <span>{qualityState.message}</span>
                </div>
              </div>

              {/* Primary Capture Button */}
              <button
                type="button"
                onClick={handleCaptureArrivalPhoto}
                disabled={!qualityState.isValid}
                className={`w-full py-3 border text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  qualityState.isValid
                    ? "bg-[#164A29] hover:bg-[#12351F] text-[#F2F0E8] border-[#79C267]/40"
                    : "bg-[#050805] text-[#A6ADA3]/40 border-[#1A2E1E] cursor-not-allowed"
                }`}
              >
                <Camera className="w-4 h-4 text-[#79C267]" />
                <span>
                  {qualityState.isValid
                    ? "Capture Arrival Photo & Verify"
                    : "Align Farmer Face"}
                </span>
              </button>
            </div>
          ) : (
            /* VERIFICATION RESULT SCREEN */
            <div className="space-y-4">
              {verifying ? (
                <div className="p-8 text-center space-y-3 bg-[#050805] border border-[#1A2E1E]">
                  <div className="w-8 h-8 border-2 border-[#79C267] border-t-transparent animate-spin mx-auto" />
                  <p className="text-xs font-mono text-[#A6ADA3]">
                    Comparing arrival capture against booking biometric features...
                  </p>
                </div>
              ) : verificationResult ? (
                <div className="space-y-4">
                  {/* Status Banner */}
                  {verificationResult.status === "VERIFIED" && (
                    <div className="p-4 bg-[#0A180D] border border-[#79C267]/40 text-left space-y-1">
                      <div className="flex items-center gap-2 text-[#79C267] font-serif text-base">
                        <CheckCircle2 className="w-5 h-5 text-[#79C267]" />
                        <span>IDENTITY VERIFIED (1:1 MATCH)</span>
                      </div>
                      <p className="text-xs text-[#A6ADA3] font-mono">
                        Match Confidence: <strong className="text-[#F2F0E8]">High</strong> • Biometric Score: {verificationResult.score}
                      </p>
                    </div>
                  )}

                  {verificationResult.status === "REVIEW_REQUIRED" && (
                    <div className="p-4 bg-[#1C1608] border border-amber-500/40 text-left space-y-1">
                      <div className="flex items-center gap-2 text-amber-300 font-serif text-base">
                        <AlertTriangle className="w-5 h-5 text-amber-400" />
                        <span>BORDERLINE MATCH — STAFF REVIEW REQUIRED</span>
                      </div>
                      <p className="text-xs text-amber-200/80 font-mono">
                        Match Confidence: <strong className="text-[#F2F0E8]">Medium (Borderline)</strong> • Biometric Score: {verificationResult.score}
                      </p>
                    </div>
                  )}

                  {verificationResult.status === "FAILED" && (
                    <div className="p-4 bg-[#1C0A0A] border border-red-500/40 text-left space-y-1">
                      <div className="flex items-center gap-2 text-red-400 font-serif text-base">
                        <XCircle className="w-5 h-5 text-red-400" />
                        <span>IDENTITY VERIFICATION FAILED</span>
                      </div>
                      <p className="text-xs text-red-300/80 font-mono">
                        Match Confidence: <strong className="text-red-200">Low</strong> • Arrival face does not match booking capture.
                      </p>
                    </div>
                  )}

                  {/* Staff Remarks */}
                  <div className="text-left space-y-1">
                    <label className="block text-[11px] font-mono text-[#A6ADA3] uppercase tracking-wider">
                      Staff Inspection Remarks (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Physical Aadhaar verified at gate"
                      value={staffRemarks}
                      onChange={(e) => setStaffRemarks(e.target.value)}
                      className="w-full px-3 py-2 bg-[#050805] border border-[#1A2E1E] text-xs font-mono text-[#F2F0E8] focus:outline-none focus:border-[#79C267]"
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 pt-2">
                    <button
                      type="button"
                      onClick={handleRetake}
                      className="px-4 py-2.5 border border-[#1A2E1E] bg-[#050805] hover:bg-[#164A29] text-xs font-mono uppercase text-[#A6ADA3] hover:text-[#F2F0E8] flex items-center gap-1.5 cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Retry</span>
                    </button>

                    {verificationResult.status === "VERIFIED" ? (
                      <button
                        type="button"
                        onClick={() => onClose()}
                        className="flex-1 py-2.5 bg-[#164A29] hover:bg-[#12351F] border border-[#79C267]/40 text-[#F2F0E8] text-xs font-mono uppercase tracking-wider cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <CheckCircle2 className="w-4 h-4 text-[#79C267]" />
                        <span>Proceed to Quality Check →</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleStaffManualConfirm("VERIFIED")}
                        className="flex-1 py-2.5 bg-amber-950 hover:bg-amber-900 border border-amber-700/60 text-amber-200 text-xs font-mono uppercase tracking-wider cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <ShieldCheck className="w-4 h-4" />
                        <span>Staff Manual Override →</span>
                      </button>
                    )}
                  </div>
                </div>
              ) : null}
            </div>
          )}

          <p className="text-[10px] text-[#A6ADA3]/60 font-mono">
            1:1 Live Biometric Verification • Recorded in SHA-256 Tamper-Evident Mandi Audit Trail.
          </p>
        </div>
      </div>
    </div>
  );
}
