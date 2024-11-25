'use client';

import Slider from 'react-slick';

export default function ImageCarousel({ images }: { images: File[] }) {
  if (!images.length) return null;

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <div className="mt-4">
      <Slider {...settings}>
        {images.map((image, index) => (
          <div key={index} className="w-full h-64 flex items-center justify-center">
            <img
              src={URL.createObjectURL(image)}
              alt={`Slide ${index}`}
              className="object-cover w-full h-full rounded-lg"
            />
          </div>
        ))}
      </Slider>
    </div>
  );
}
