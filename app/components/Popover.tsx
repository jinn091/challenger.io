import { useEffect, useRef } from "react";
import { DRAG_SQUARE_HALF_SIZE } from "~/utils/constant";

interface DismissableProps {
	onClickOutside: () => void;
}

interface PopoverProps extends DismissableProps {
	children: React.ReactNode;
}

export default function Popover({
	children,
	onClickOutside
}: PopoverProps): JSX.Element {
	const div = useRef<HTMLDivElement>(null);
	const mouseStartX = useRef(0);
	const mouseStartY = useRef(0);
	const hasDragged = useRef(false);

	useEffect(() => {
		const handleMouseDown = (event: MouseEvent) => {
			mouseStartX.current = event.pageX;
			mouseStartY.current = event.pageY;
		};

		const handleMouseUp = (event: MouseEvent) => {
			const deltaX = Math.abs(event.pageX - mouseStartX.current);
			const deltaY = Math.abs(event.pageY - mouseStartY.current);
			hasDragged.current =
				deltaX > DRAG_SQUARE_HALF_SIZE ||
				deltaY > DRAG_SQUARE_HALF_SIZE;
		};

		const onClickOutsideListener = (event: MouseEvent) => {
			if (
				div.current &&
				!div.current.contains(event.target as Node) &&
				!hasDragged.current
			) {
				onClickOutside();
			}
		};

		document.addEventListener("mousedown", handleMouseDown);
		document.addEventListener("mouseup", handleMouseUp);
		document.addEventListener("click", onClickOutsideListener);

		return (): void => {
			document.removeEventListener("mousedown", handleMouseDown);
			document.removeEventListener("mouseup", handleMouseUp);
			document.removeEventListener("click", onClickOutsideListener);
		};
	}, [onClickOutside]);

	return <div ref={div}>{children}</div>;
}
