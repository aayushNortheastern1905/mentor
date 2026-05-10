import { Suspense } from "react";
import { WalkContent } from "./WalkContent";

export default function WalkPage() {
  return (
    <Suspense>
      <WalkContent />
    </Suspense>
  );
}
