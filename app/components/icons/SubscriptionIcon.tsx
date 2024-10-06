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
        <path d="M10,18v-6l5,3L10,18z M17,3H7v1h10V3z M20,6H4v1h16V6z M22,9H2v12h20V9z M3,10h18v10H3V10z"></path>
      </g>
    </svg>
  );
}
