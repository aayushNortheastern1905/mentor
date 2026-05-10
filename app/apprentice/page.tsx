import { Suspense } from "react";
import { ApprenticeContent } from "./ApprenticeContent";

export default function ApprenticePage() {
  return (
    <Suspense>
      <ApprenticeContent />
    </Suspense>
  );
}
