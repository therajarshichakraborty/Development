import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";
import { motion, useAnimation } from "framer-motion";

function useOnScreen(
  ref: RefObject<HTMLDivElement | null>,
  rootMargin = "0px"
) {
  const [isIntersecting, setIntersecting] = useState(false);

  useEffect(() => {
    const currentRef = ref.current;
    if (!currentRef) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIntersecting(true);
        }
      },
      {
        rootMargin,
      }
    );

    observer.observe(currentRef);

    return () => {
      observer.unobserve(currentRef);
    };
  }, [ref, rootMargin]);

  return isIntersecting;
}

interface LazyShowProps {
  children: ReactNode;
  className?: string;
}

const LazyShow = ({ children, className = "" }: LazyShowProps) => {
  const controls = useAnimation();
  const rootRef = useRef<HTMLDivElement>(null);
  const onScreen = useOnScreen(rootRef);

  useEffect(() => {
    if (onScreen) {
      controls.start({
        x: 0,
        opacity: 1,
        transition: {
          duration: 0.6,
          ease: [0.16, 1, 0.3, 1],
        },
      });
    }
  }, [onScreen, controls]);

  return (
    <motion.div
      className={`lazy-div ${className}`}
      ref={rootRef}
      initial={{ opacity: 0, x: -30 }}
      animate={controls}
    >
      {children}
    </motion.div>
  );
};

export default LazyShow;
