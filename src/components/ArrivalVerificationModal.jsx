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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-[#E0ECE0] overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-[#1B4318] to-[#2E7D32] text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-[#F9A825]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black tracking-tight">
                Mandi Gate Arrival Face Verification
              </h3>
              <p className="text-xs text-emerald-100 font-semibold">
                Token #{booking.tokenDisplay || "P001"} • {booking.farmerName} (
                {booking.farmerId})
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
          {/* Booking Info Card */}
          <div className="p-3.5 bg-[#FAF8F2] rounded-2xl border border-gray-200 text-xs font-semibold grid grid-cols-2 gap-2 text-left">
            <div>
              <span className="text-[10px] text-gray-400 font-bold uppercase block">
                Farmer Name
              </span>
              <span className="text-gray-900 font-black">
                {booking.farmerName}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-gray-400 font-bold uppercase block">
                Farmer ID
              </span>
              <span className="text-[#1B4318] font-mono font-black">
                {booking.farmerId}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-gray-400 font-bold uppercase block">
                Token Number
              </span>
              <span className="text-gray-900 font-black">
                #{booking.tokenDisplay}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-gray-400 font-bold uppercase block">
                Crop / Quantity
              </span>
              <span className="text-[#2E7D32] font-black">
                {booking.crop} ({booking.quantity} Qtl)
              </span>
            </div>
          </div>

          {cameraError ? (
            <div className="p-6 bg-red-50 rounded-2xl border border-red-200 text-center space-y-3">
              <AlertTriangle className="w-10 h-10 text-red-600 mx-auto" />
              <h4 className="text-sm font-bold text-red-900">
                Camera Access Error
              </h4>
              <p className="text-xs text-red-700">{cameraError}</p>
              <button
                onClick={startCamera}
                className="px-5 py-2 rounded-xl bg-red-600 text-white text-xs font-bold hover:bg-red-700 transition-colors"
              >
                Retry Live Camera
              </button>
            </div>
          ) : !capturedArrivalPhoto ? (
            <div className="space-y-3">
              {/* Guidance Info Banner */}
              <div className="p-3 bg-[#FAF8F2] rounded-2xl border border-amber-200 text-xs text-amber-900 font-semibold flex items-center justify-between text-left">
                <div className="flex items-center gap-2">
                  <Sun className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>
                    Capture live arrival photo of the farmer at Mandi Gate for
                    1:1 facial verification.
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

                {/* Face Alignment Oval Guide */}
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

              {/* Primary Capture Button */}
              <button
                type="button"
                onClick={handleCaptureArrivalPhoto}
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
                    ? "Capture Arrival Photo & Verify"
                    : "Align Farmer Face"}
                </span>
              </button>
            </div>
          ) : (
            /* VERIFICATION RESULT SCREEN */
            <div className="space-y-4">
              {verifying ? (
                <div className="p-8 text-center space-y-3">
                  <div className="w-12 h-12 border-4 border-[#2E7D32] border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="text-xs font-bold text-gray-700">
                    Comparing arrival capture against booking biometric
                    features...
                  </p>
                </div>
              ) : verificationResult ? (
                <div className="space-y-4">
                  {/* Status Banner */}
                  {verificationResult.status === "VERIFIED" && (
                    <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-300 text-left space-y-1">
                      <div className="flex items-center gap-2 text-[#1B4318] font-black text-sm">
                        <CheckCircle2 className="w-5 h-5 text-[#2E7D32]" />
                        <span>IDENTITY VERIFIED (1:1 MATCH)</span>
                      </div>
                      <p className="text-xs text-emerald-800 font-semibold">
                        Match Confidence:{" "}
                        <strong className="font-bold">High</strong> • Biometric
                        Score: {verificationResult.score}
                      </p>
                    </div>
                  )}

                  {verificationResult.status === "REVIEW_REQUIRED" && (
                    <div className="p-4 bg-amber-50 rounded-2xl border border-amber-300 text-left space-y-1">
                      <div className="flex items-center gap-2 text-amber-900 font-black text-sm">
                        <AlertTriangle className="w-5 h-5 text-amber-600" />
                        <span>BORDERLINE MATCH — STAFF REVIEW REQUIRED</span>
                      </div>
                      <p className="text-xs text-amber-800 font-semibold">
                        Match Confidence:{" "}
                        <strong className="font-bold">
                          Medium (Borderline)
                        </strong>{" "}
                        • Biometric Score: {verificationResult.score}
                      </p>
                    </div>
                  )}

                  {verificationResult.status === "FAILED" && (
                    <div className="p-4 bg-red-50 rounded-2xl border border-red-300 text-left space-y-1">
                      <div className="flex items-center gap-2 text-red-900 font-black text-sm">
                        <XCircle className="w-5 h-5 text-red-600" />
                        <span>IDENTITY VERIFICATION FAILED</span>
                      </div>
                      <p className="text-xs text-red-800 font-semibold">
                        Match Confidence:{" "}
                        <strong className="font-bold">Low</strong> • Arrival
                        face does not match booking capture.
                      </p>
                    </div>
                  )}

                  {/* Staff Remarks */}
                  <div>
                    <label className="block text-left text-xs font-bold text-gray-700 mb-1">
                      Staff Inspection Remarks (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Physical Aadhaar verified at gate"
                      value={staffRemarks}
                      onChange={(e) => setStaffRemarks(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-medium bg-white focus:outline-none focus:border-[#2E7D32]"
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 pt-2">
                    <button
                      type="button"
                      onClick={handleRetake}
                      className="px-4 py-2.5 rounded-xl border border-gray-300 text-xs font-bold text-gray-700 hover:bg-gray-100 flex items-center gap-1 cursor-pointer"
                    >
                      <RefreshCw className="w-4 h-4" />
                      <span>Retry Capture</span>
                    </button>

                    {verificationResult.status === "VERIFIED" ? (
                      <button
                        type="button"
                        onClick={() => onClose()}
                        className="flex-1 py-2.5 rounded-xl bg-[#1B4318] hover:bg-[#2E7D32] text-white text-xs font-black shadow-md cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <CheckCircle2 className="w-4 h-4 text-[#F9A825]" />
                        <span>Proceed to Quality Check →</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleStaffManualConfirm("VERIFIED")}
                        className="flex-1 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-black shadow-md cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <ShieldCheck className="w-4 h-4" />
                        <span>Staff Manual Override & Confirm →</span>
                      </button>
                    )}
                  </div>
                </div>
              ) : null}
            </div>
          )}

          <p className="text-[10px] text-gray-400 font-medium">
            1:1 Live Biometric Verification • Recorded in SHA-256 Tamper-Evident
            Mandi Audit Trail.
          </p>
        </div>
      </div>
    </div>
  );
}
