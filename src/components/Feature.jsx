import { apple, bill, google , QuizandFriend} from "../assets";
import styles, { layout } from "../style";

const Billing = () => (
  <section id="product" className={layout.sectionReverse}>
    <div className={layout.sectionImgReverse}>
      <img src={QuizandFriend} alt="billing" className="w-[80%] h-[100%] mr-6 relative z-[5]" />

      {/* gradient start */}
      <div className="absolute z-[3] -left-1/2 top-0 w-[50%] h-[50%] rounded-full white__gradient" />
      <div className="absolute z-[0] w-[50%] h-[50%] -left-1/2 bottom-0 rounded-full pink__gradient" />
      {/* gradient end */}
    </div>

    <div className={`${layout.sectionInfo} mt-[-20px] ml-auto`}>
      <h2 className={styles.heading2}>
        Easily control your <br className="sm:block hidden" /> quiz
      </h2>
      <p className={`${styles.paragraph} max-w-[470px] mt-5`}>
      Enjoy the fun of learning while playing quizzes with your friends, 
      making the learning process more engaging and exciting!
      </p>
    </div>
  </section>
);

export default Billing;
