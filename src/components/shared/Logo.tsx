import Image from "next/image";

export function SherlockLogo({
  size = 48,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <Image
      src="/assets/sherlock-logo.png"
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
      src="/assets/merqube-logo.svg"
      alt="MerQube logo"
      width={width}
      height={width}
      className={className}
    />
  );
}
