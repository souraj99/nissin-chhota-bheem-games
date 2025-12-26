import "../styles/pages.scss";
import "./SelectFrame.scss";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-coverflow";

import MainLayout from "../layouts/MainLayout.tsx";
import { useState, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation, EffectCoverflow } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import { PHOTO_FRAMES } from "../lib/images.ts";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../lib/consts.ts";

function SelectFrame() {
  const middleIndex = Math.floor(PHOTO_FRAMES.length / 2);
  const [selectedFrame, setSelectedFrame] = useState(middleIndex);
  const mainSwiperRef = useRef<SwiperType | null>(null);
  const thumbSwiperRef = useRef<SwiperType | null>(null);
  const navigate = useNavigate();

  const handleFrameSelect = (index: number) => {
    setSelectedFrame(index);
    mainSwiperRef.current?.slideTo(index);
    thumbSwiperRef.current?.slideTo(index);
  };

  const handleNextClick = () => {
    const selectedFrameData = PHOTO_FRAMES[selectedFrame];
    console.log(selectedFrameData);
    navigate(ROUTES.CLICK_PHOTO, { state: { frame: selectedFrameData } });
  };

  return (
    <MainLayout className="common-page select-frame-page">
      <div className="common-content">
        <h1 className="common-heading lh-70 mb2">
          <span className="heading-line heading-small orange-font">
            NICE SELECTION
          </span>
        </h1>

        {/* Main Frame Display Slider */}
        <div className="main-slider-container">
          <Swiper
            modules={[Pagination, Navigation, EffectCoverflow]}
            spaceBetween={100}
            effect="coverflow"
            coverflowEffect={{
              rotate: 0,
              stretch: 0,
              depth: 100,
              modifier: 2,
              slideShadows: false,
            }}
            slidesPerView={"auto"}
            centeredSlides={true}
            initialSlide={middleIndex}
            loop={false}
            centerInsufficientSlides={true}
            onSwiper={(swiper) => (mainSwiperRef.current = swiper)}
            onSlideChange={(swiper) => {
              setSelectedFrame(swiper.activeIndex);
              thumbSwiperRef.current?.slideTo(swiper.activeIndex);
            }}
            pagination={{
              clickable: true,
              el: ".custom-pagination",
            }}
            className="main-swiper"
          >
            {PHOTO_FRAMES.map((frame, index) => (
              <SwiperSlide key={frame.id}>
                <div
                  className={`frame-wrapper ${
                    selectedFrame === index ? "selected" : ""
                  }`}
                >
                  <img
                    src={frame.image}
                    alt={frame.name}
                    className="frame-image"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Custom Pagination Dots */}
          <div className="custom-pagination"></div>
        </div>

        {/* Thumbnail Slider */}
        <div className="thumb-slider-container">
          <Swiper
            modules={[Navigation]}
            spaceBetween={15}
            slidesPerView={3}
            centeredSlides={true}
            initialSlide={middleIndex}
            loop={false}
            onSwiper={(swiper) => (thumbSwiperRef.current = swiper)}
            onSlideChange={(swiper) => {
              setSelectedFrame(swiper.activeIndex);
              mainSwiperRef.current?.slideTo(swiper.activeIndex);
            }}
            className="thumb-swiper"
          >
            {PHOTO_FRAMES.map((frame, index) => (
              <SwiperSlide key={frame.id}>
                <div
                  className={`thumb-frame ${
                    selectedFrame === index ? "selected" : ""
                  }`}
                  onClick={() => handleFrameSelect(index)}
                >
                  <img
                    src={frame.image}
                    alt={frame.name}
                    className="thumb-image"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Select Button */}
        <button className="btn select-btn" onClick={handleNextClick}>
          SELECT FRAME
        </button>
      </div>
    </MainLayout>
  );
}

export default SelectFrame;
