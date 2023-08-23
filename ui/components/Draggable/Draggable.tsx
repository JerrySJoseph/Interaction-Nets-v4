import React, { useState, useRef, ReactNode, Ref, RefObject } from 'react';

interface DraggableProps {
    children?: ReactNode;
    x: number;
    y: number;
    containerRef?: RefObject<HTMLDivElement>
    dragDisabled?: boolean
    onDrag?: (posX: number, posY: number) => any;
    onDragEnd?: (posX: number, posY: number) => any;
    onDragStart?: (posX: number, posY: number) => any;
    onClick?: () => any;
}

const Draggable: React.FC<DraggableProps> = ({
    children,
    x,
    y,
    containerRef,
    dragDisabled = false,
    onDrag,
    onDragEnd,
    onDragStart,
    onClick,
}) => {
    const [dragging, setDragging] = useState(false);
    const [position, setPosition] = useState({ x, y });
    const dragStartPos = useRef({ x: 0, y: 0 });
    const nodeRef = useRef<HTMLDivElement>(null);
    const hasDragged = useRef(false);

    const handleMouseDown = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (dragDisabled)
            return;

        setDragging(true);
        const x = e.clientX - position.x;
        const y = e.clientY - position.y;
        dragStartPos.current = { x, y };
        onDragStart && onDragStart(x, y);
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (dragDisabled)
            return;
        if (dragging) {
            e.preventDefault();
            e.stopPropagation();
            hasDragged.current = true;
            let left = e.clientX - dragStartPos.current.x;
            let top = e.clientY - dragStartPos.current.y;
            // Boundary checks

            if (containerRef && containerRef.current && nodeRef.current) {
                const padding = 10;
                const xlimit = containerRef.current.offsetWidth - nodeRef.current.offsetWidth - padding - 65;
                const ylimit = containerRef.current.offsetHeight - nodeRef.current.offsetHeight - padding - 65;

                if (left < 0) left = padding;
                if (top < 0) top = padding;
                if (left > xlimit) {
                    left = xlimit;
                }
                if (top > ylimit) {
                    top = ylimit;

                }
            }
            setPosition({ x: left, y: top });
            onDrag && onDrag(left, top);
        }
    };

    

    const handleMouseUp = (e: MouseEvent) => {
        if (dragDisabled)
            return;

        e.preventDefault();
        e.stopPropagation();
        if (hasDragged.current) {
            onDragEnd && onDragEnd(position.x, position.y);
        } else {
            onClick && onClick();
        }
        hasDragged.current = false;
        setDragging(false);
        
    };

    const handleClickCapture = (e: React.MouseEvent) => {
        if (dragging) {
            e.stopPropagation();
            e.preventDefault();
        }
        
    };

    React.useEffect(() => {

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [dragging]);

    return (
        <div
            ref={nodeRef}
            onMouseDown={handleMouseDown}
            onClickCapture={handleClickCapture}
            style={{
                cursor: dragging ? 'move' : 'pointer',
                position: 'absolute',
                left: `${position.x}px`,
                top: `${position.y}px`,
            }}
        >
            {children}
        </div>
    );
};

export default Draggable;
