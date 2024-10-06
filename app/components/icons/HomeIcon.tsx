import { SvgProps } from "~/utils/types";

export default function HomeIcon({
  width,
  height,
  className,
}: SvgProps): JSX.Element {
  return (
    <svg
      height={height}
      width={width}
      className={className}
      viewBox="0 0 24 24"
      preserveAspectRatio="xMidYMid meet"
      focusable="false"
    >
      <g>
        <path d="M4,10V21h6V15h4v6h6V10L12,3Z"></path>
      </g>
    </svg>
  );
}
