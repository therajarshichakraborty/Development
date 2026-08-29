import { useRef, FC, useEffect, useState } from "react";
import { CanvasContext } from "../hooks/useCanvas";
import useResponsiveSize from "../hooks/useResponsiveSize";
import Wave from "./Wave";

const Canvas: FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { width } = useResponsiveSize();
  const [context, setContext] = useState<
    CanvasRenderingContext2D | undefined
  >();

  useEffect(() => {
    const ctx = canvasRef?.current?.getContext("2d");
    if (ctx) setContext(ctx);
  }, [width]);

  return (
    <div className="w-full overflow-hidden leading-none pointer-events-none -my-6">
      <CanvasContext.Provider value={{ context }}>
        <canvas
          id="canvas"
          ref={canvasRef}
          width={width || 1200}
          height={220}
          className="w-full block"
        />
        <Wave />
      </CanvasContext.Provider>
    </div>
  );
};

export default Canvas;
