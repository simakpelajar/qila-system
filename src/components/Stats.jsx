import { stats } from "../constants";
import styles from "../style";

const Stats = () => (
  <section className={`${styles.flexCenter} sm:mb-20 mb-6`}>
    <div className="w-full max-w-[1000px] p-8 rounded-xl shimmer border border-gray-800/20">
      <div className="flex flex-wrap justify-center gap-12">
        {stats.map((stat, index) => (
          <>
            <div key={stat.id} className="flex flex-col items-center text-center">
              <h4 className="font-poppins font-bold text-[42px] text-white">
                {stat.value}
              </h4>
              <p className="font-poppins font-normal text-[14px] text-cyan-400 uppercase mt-2">
                {stat.title}
              </p>
            </div>
            {/* Divider line except for last item */}
            {index !== stats.length - 1 && (
              <div className="hidden md:block w-[1px] h-20 bg-gray-800/20 self-center" />
            )}
          </>
        ))}
      </div>
    </div>
  </section>
);

export default Stats;
