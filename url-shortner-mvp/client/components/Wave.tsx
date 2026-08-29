import { FC, useEffect, useRef } from "react";
import { useCanvasContext } from "../hooks/useCanvas";
import useResponsiveSize from "../hooks/useResponsiveSize";
import WaveObj from "../utils/wave";

const Wave: FC = () => {
  const { context } = useCanvasContext();
  const { width } = useResponsiveSize();
  const height = 220;
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!context || !width) return;

    let frequency = 0.013;
    const waves = {
      frontWave: new WaveObj([0.0211, 0.028, 0.015], "rgba(236, 71, 85, 0.12)"),
      backWave: new WaveObj(
        [0.0122, 0.018, 0.005],
        "rgba(249, 168, 168, 0.15)"
      ),
    };

    const render = () => {
      context.clearRect(0, 0, width, height);
      Object.entries(waves).forEach(([, wave]) => {
        wave.draw(context, width, height, frequency);
      });
      frequency += 0.013;
      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animFrameRef.current !== null) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [context, width]);

  return null;
};

export default Wave;
