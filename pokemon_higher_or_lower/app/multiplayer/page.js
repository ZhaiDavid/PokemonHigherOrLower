import { Suspense } from "react";
import MultiplayerClient from "./MultiplayerClient";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MultiplayerClient />
    </Suspense>
  );
}