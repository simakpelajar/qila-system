import { Sabit } from "../assets";
import styles, { layout } from "../style";

const Quotes = () => (
  <section className={layout.section}>
    <div className={`${layout.sectionInfo} relative flex flex-col items-center justify-center h-full`}>
  
      {/* Mengatur jarak antara "Our possibilities expand" */}
      <div className="flex flex-col items-center relative mt-[100px]">
        {/* Menggunakan posisi absolut untuk menimpa gambar Sabit */}
        <h1 className={`${styles.heading2} text-center font-bold drop-shadow-md bg-gradient-to-b from-white to-black bg-clip-text text-transparent absolute z-20`}>
        "Learn Anything from Anyone 
          <br />
          with Qila System Always there."
        </h1>
        
        {/* Gambar Sabit di bawah teks */}
        <img src={Sabit} alt="billing" className="w-full h-auto mt-[5px] z-10" />
      </div>
    </div>
    <br />
  </section>
);

export default Quotes;
