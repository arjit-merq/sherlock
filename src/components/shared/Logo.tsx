import Image from "next/image";

/** GitHub Pages serves this app under /sherlock; local/dev uses "". */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

function asset(path: string) {
  return `${basePath}${path}`;
}

export function SherlockLogo({
  size = 48,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <Image
      src={asset("/assets/sherlock-logo.png")}
      alt="Sherlock logo"
      width={size}
      height={size}
      className={className}
      priority
    />
  );
}

/** The official MerQube cube mark — reads cleanly as-is on this light theme. */
export function MerQubeLogo({
  width = 40,
  className = "",
}: {
  width?: number;
  className?: string;
}) {
  return (
    <Image
      src={asset("/assets/merqube-logo.svg")}
      alt="MerQube logo"
      width={width}
      height={width}
      className={className}
    />
  );
}
