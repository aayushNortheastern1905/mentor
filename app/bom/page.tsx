import { Suspense } from "react";
import { BOMContent } from "./BOMContent";

export default function BOMPage() {
  return (
    <Suspense>
      <BOMContent />
    </Suspense>
  );
}
