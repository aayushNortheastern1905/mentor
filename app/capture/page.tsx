import { Suspense } from "react";
import { CaptureContent } from "./CaptureContent";

export default function CapturePage() {
  return (
    <Suspense>
      <CaptureContent />
    </Suspense>
  );
}
