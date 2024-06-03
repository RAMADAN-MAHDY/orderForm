import { motion } from "framer-motion";

const Notec = ({ lengthpro }) => {
    // إنشاء نسخة من المصفوفة الأصلية لعكسها بدون تعديل المصفوفة الأصلية
    const reversedLengthpro = [...lengthpro].reverse();
  
    // console.log(reversedLengthpro);
  
    return (
        <motion.div
          className="bg-[#fcfcfc] w-[200px] relative rounded-br-3xl rounded-bl-3xl rounded-tl-3xl p-5 mt-1 mr-4"
          initial={{ translateY: -100, opacity: 0 }}
          animate={{ translateY: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          {reversedLengthpro && reversedLengthpro.map((eo, index) => (
            <p key={index} className="p-1 text-[#000]">
              تم ارسال طلب من هذا الكود : {eo}
            </p>
          ))}
        </motion.div>
      );
  }
  
  export default Notec;