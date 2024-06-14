import { motion } from "framer-motion";
import { useState } from "react";

const Notec = ({ lengthpro, unseedata }) => {
    console.log(unseedata)
    // استخدام دالة slice() لإنشاء نسخة جديدة من المصفوفة
    const [lengthpros, setlengthpro] = useState([...lengthpro]);

    // عكس ترتيب النسخة الجديدة من المصفوفة
    const lengthprosrevers = [...lengthpros].reverse();

    return (
        <motion.div
            className="bg-[#fcfcfc] w-[200px] relative rounded-br-3xl rounded-bl-3xl rounded-tl-3xl p-5 mt-1 mr-4"
            initial={{ translateY: -100, opacity: 0 }}
            animate={{ translateY: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
        > 
        
          {lengthpros.length>0 && lengthpros.map((eo, index) => (
            <p key={index} className="p-1 text-[#000]">
                تم ارسال طلب من هذا الكود : {eo}
            </p>
        ))}
            {lengthprosrevers && lengthprosrevers.map((eo, index) => (
                <p key={index} className="p-1 text-[#000]">
                    تم ارسال طلب من هذا الكود : {eo}
                </p>
            ))}
        </motion.div>
    );
}

export default Notec;
