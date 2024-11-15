import { Cahaya, Sabit } from "../assets";
import styles, { layout } from "../style";

const CardDeal = () => (
  <section className={layout.section}>
    <div className={`${layout.sectionInfo} relative flex flex-col items-center justify-center h-full`}>
      {/* Pindahkan gambar Cahaya ke bawah */}
      <img src={Cahaya} alt="billing" className="absolute top-[-50px] left-1/2 transform -translate-x-1/2 w-full h-[auto]" />
      
      <h2 className={`${styles.heading2} z-10 text-center mt-[50px]`}>
        OUR VISION <br className="sm:block hidden" />
      </h2>

      <p className={`${styles.paragraph} max-w-[470px] mt-5 text-center z-10`}>
        We provide innovative tomorrow’s possibilities today and crafting transformative software solutions for a connected world.
      </p>

      {/* Mengatur jarak antara "Our possibilities expand" dan "Sabit" */}
      <div className="flex flex-col items-center relative mt-[100px]">
        {/* Menggunakan posisi absolut untuk menimpa gambar Sabit */}
        <h1 className={`${styles.heading2} text-center font-bold drop-shadow-md bg-gradient-to-b from-white to-black bg-clip-text text-transparent absolute z-20`}>
          Our possibilities expand 
          <br />
          far beyond a solitary platform.
        </h1>
        
        {/* Gambar Sabit di bawah teks */}
        <img src={Sabit} alt="billing" className="w-full h-auto mt-[5px] z-10" />
      </div>
    </div>
    <br />
  </section>
);

export default CardDeal;
