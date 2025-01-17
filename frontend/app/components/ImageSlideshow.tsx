import React, { useState, useEffect, useRef } from "react";

const ImageSlideshow: React.FC<{ images: string[]; interval?: number }> = ({
  images,
  interval = 5000, 
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startTimer = () => {
    stopTimer();
    timerRef.current = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, interval);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const handlePrev = () => {
    stopTimer();
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
    startTimer();
  };

  const handleNext = () => {
    stopTimer();
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
    startTimer();
  };

  useEffect(() => {
    startTimer();
    return () => stopTimer();
  }, [images.length, interval]);

  return (
    <div className="relative w-full h-96 overflow-hidden group">
      <div className="relative w-full h-full">
        {images.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`Slide ${index + 1}`}
            className={`absolute w-full h-full object-contain rounded-xl transition-opacity duration-700 ${
              index === currentIndex ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
      </div>

      {images.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-gray-400 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-900 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          >
            <span className="text-lg">&lt;</span>
          </button>

          <button
            onClick={handleNext}
            className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-gray-400 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-900 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          >
            <span className="text-lg">&gt;</span>
          </button>
        </>
      )}

      {images.length > 1 && (
        <div className="absolute bottom-4 w-full flex justify-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {images.map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full ${
                index === currentIndex ? "bg-gray-400" : "bg-gray-300"
              }`}
            ></div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageSlideshow;
