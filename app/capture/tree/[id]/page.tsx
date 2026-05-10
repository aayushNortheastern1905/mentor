import { Suspense } from "react";
import { TreeEditorContent } from "./TreeEditorContent";

export default function TreeEditorPage() {
  return (
    <Suspense>
      <TreeEditorContent />
    </Suspense>
  );
}
