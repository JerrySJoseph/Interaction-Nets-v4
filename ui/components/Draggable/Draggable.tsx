import React, { useState, useRef, ReactNode } from 'react';

interface DraggableProps {
    children?: ReactNode;
    x: number;
    y: number;
    dragDisabled?:boolean
    onDrag?: (posX: number, posY: number) => any;
    onDragEnd?: (posX: number, posY: number) => any;
    onDragStart?: (posX: number, posY: number) => any;
    onClick?: () => any;
}

const Draggable: React.FC<DraggableProps> = ({
    children,
    x,
    y,
    dragDisabled=false,
    onDrag,
    onDragEnd,
    onDragStart,
    onClick,
}) => {
    const [dragging, setDragging] = useState(false);
    const [position, setPosition] = useState({ x, y });
    const dragStartPos = useRef({ x: 0, y: 0 });
    const hasDragged = useRef(false);

    const handleMouseDown = (e: React.MouseEvent) => {
        // e.preventDefault();
        // e.stopPropagation();

        if(dragDisabled)
            return;

        setDragging(true);
        const x = e.clientX - position.x;
        const y = e.clientY - position.y;
        dragStartPos.current = { x, y };
        onDragStart && onDragStart(x, y);
    };

    const handleMouseMove = (e: MouseEvent) => {
        if(dragDisabled)
            return;
        if (dragging) {
            // e.preventDefault();
            // e.stopPropagation();
            hasDragged.current = true;
            const newX = e.clientX - dragStartPos.current.x;
            const newY = e.clientY - dragStartPos.current.y;
            setPosition({ x: newX, y: newY });
            onDrag && onDrag(newX, newY);
        }
    };

    const handleMouseUp = (e: MouseEvent) => {
        if(dragDisabled)
            return;

        // e.preventDefault();
        // e.stopPropagation();
        if (hasDragged.current) {
            onDragEnd && onDragEnd(position.x, position.y);
        } else {
            onClick && onClick();
        }
        hasDragged.current = false;
        setDragging(false);
    };

    const handleClickCapture = (e: React.MouseEvent) => {
        if (dragging)
            e.stopPropagation();
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
