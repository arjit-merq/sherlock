import { MerQubeLogo } from "@/components/shared/Logo";

/** Fixed MerQube mark — stays in the top-right on every section. */
export function BrandLockup() {
  return (
    <div className="pointer-events-none fixed right-4 top-4 z-50 md:right-6 md:top-5">
      <MerQubeLogo width={40} />
    </div>
  );
}
