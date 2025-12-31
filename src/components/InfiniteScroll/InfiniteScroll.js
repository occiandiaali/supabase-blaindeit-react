import { useEffect, useRef, useState } from "react";

export default function InfiniteScroll(data = []) {
  const [peeps, setPeeps] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const target = useRef(null);

  useEffect(() => {
    setItems((prevItems) => [...prevItems, ...data]);
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setItems((prevItems) => [...prevItems, ...data]);
        }
      },
      { threshold: 1 }
    );

    if (target.current) {
      observer.observe(target.current);
    }

    return () => {
      if (target.current) {
        observer.unobserve(target.current);
      }
    };
  }, [target]);
  return { items, target };
}
