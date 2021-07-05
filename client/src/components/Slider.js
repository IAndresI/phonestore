import React, {useState, useRef, useEffect} from 'react';
import 'keen-slider/keen-slider.min.css'
import { useKeenSlider } from 'keen-slider/react'
import {Link} from 'react-router-dom'

const Slider = ({phones}) => {

  const [pause, setPause] = useState(false)
  const [currentSlide, setCurrentSlide] = React.useState(0)
  const timer = useRef()
  const [sliderRef, slider] = useKeenSlider({
    loop: true,
    dots: true,
    duration: 1000,
    dragStart: () => {
      setPause(true)
    },
    dragEnd: () => {
      setPause(false)
    },
    slideChanged(s) {
      setCurrentSlide(s.details().relativeSlide)
    },
  })

  useEffect(() => {
    sliderRef.current.addEventListener("mouseover", () => {
      setPause(true)
    })
    sliderRef.current.addEventListener("mouseout", () => {
      setPause(false)
    })
  }, [sliderRef])

  useEffect(() => {
    timer.current = setInterval(() => {
      if (!pause && slider) {
        slider.next()
      }
    }, 100000)
    return () => {
      clearInterval(timer.current)
    }
  }, [pause, slider])

  
  return (
    <>
      <div ref={sliderRef} className="keen-slider slider">
        {
          phones.map((item, i) => {
            const imagePath = `${process.env.REACT_APP_API_URL}/${item.image ? item.image : "phone.jpg"}`;
            const link = `/phone/${item.phone_id}`;
            return (
              <Link to={link} className={`keen-slider__slide number-slide${i}`}>
                <div className="slider__item">
                  <img className="slider__image" src={imagePath} alt={item.phone_name}/>
                  <h3 className="slider__item-name">{item.phone_name}</h3>
                </div>
              </Link>
            )
          })
        }
        {slider && (
          <>
            <ArrowLeft
              onClick={(e) => e.stopPropagation() || slider.prev()}
              disabled={currentSlide === 0}
            />
            <ArrowRight
              onClick={(e) => e.stopPropagation() || slider.next()}
              disabled={currentSlide === slider.details().size - 1}
            />
          </>
        )}
      </div>
      {slider && (
        <div className="dots">
          {[...Array(slider.details().size).keys()].map((idx) => {
            return (
              <button
                key={idx}
                onClick={() => {
                  slider.moveToSlideRelative(idx)
                }}
                className={"dot" + (currentSlide === idx ? " active" : "")}
              />
            )
          })}
        </div>
      )}
    </>
  )
};

function ArrowLeft(props) {
  return (
    <svg
      onClick={props.onClick}
      className="arrow arrow--left"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
    >
      <path d="M16.67 0l2.83 2.829-9.339 9.175 9.339 9.167-2.83 2.829-12.17-11.996z" />
    </svg>
  )
}

function ArrowRight(props) {
  return (
    <svg
      onClick={props.onClick}
      className="arrow arrow--right"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
    >
      <path d="M5 3l3.057-3 11.943 12-11.943 12-3.057-3 9-9z" />
    </svg>
  )
}

export default Slider;