import { Suspense } from "react";
import JoinMatchClient from "./JoinMatchClient";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <JoinMatchClient />
    </Suspense>
  );
}