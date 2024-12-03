import React from "react";
import styles from "../style";
import { discount } from "../assets";
import { TypeAnimation } from "react-type-animation";

const Hero = () => {
  return (
    <section
      id="home"
      className={`flex md:flex-row flex-col ${styles.paddingY}`}
    >
      <div
        className={`flex-1 ${styles.flexStart} flex-col xl:px-0 sm:px-16 px-6 relative`}
      >
        <div className="flex flex-row items-center py-[6px] px-4 bg-discount-gradient rounded-[10px] mb-2">
          <img src={discount} alt="discount" className="w-[32px] h-[32px]" />
          <p className={`${styles.paragraph} ml-2`}>
            <span className="text-white">100%</span> Next Quiz {" "}
            <span className="text-white">Of </span> The Month 
          </p>
        </div>

        <div className="flex flex-col justify-center items-center w-full relative z-10">
          <h1 className="font-poppins font-semibold text-5xl md:text-7xl leading-tight mb-6">
            <TypeAnimation
              sequence={[
                "Welcome to QILA SYSTEM",
                2000,
                "",
              ]}
              wrapper="span"
              speed={50}
              style={{
                display: "inline-block"
              }}
              className="bg-gradient-to-r from-cyan-300 via-cyan-100 to-cyan-300 bg-clip-text text-transparent"
              repeat={Infinity}
            />
          </h1>
          <h1 className="font-poppins font-semibold ss:text-[68px] text-[52px] text-white ss:leading-[100.8px] leading-[75px] text-center">
            <TypeAnimation
              sequence={[
                "Get Started",
                4000,
                "",
              ]}
              wrapper="span"
              speed={50}
              style={{ display: "inline-block" }}
              repeat={Infinity}
            />
          </h1>

          <p className={`${styles.paragraph} max-w-[600px] mt-6 text-center`}>
            Qila is an innovative CBT system that offers engaging practice tests
            to help you prepare for exams. Access a variety of tailored
            questions to enhance your learning and achieve great results!
          </p>
        </div>

        {/* Gradient backgrounds */}
        <div
          className={`absolute z-[0] w-[40%] h-[35%] top-0 pink__gradient`}
        />
        <div
          className={`absolute z-[1] w-[80%] h-[80%] rounded-full white__gradient bottom-40`}
        />
        <div
          className={`absolute z-[0] w-[50%] h-[50%] right-20 bottom-20 blue__gradient`}
        />
      </div>

      <div className={`ss:hidden ${styles.flexCenter}`}>
      
      </div>
    </section>
  );
};

export default Hero;
