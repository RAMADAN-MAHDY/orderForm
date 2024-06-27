"use client"
// components/ConditionForm.js
import { useState , useCallback} from 'react';
import { useDropzone } from 'react-dropzone';

const ConditionForm = ({product , code , onCancel}) => {
    // const [usercode, setUsercode] = useState( typeof window !== 'undefined' ?localStorage.getItem('codeorderform') || '':'');
    const [err , setErr] = useState();
    const [isLoading, setIsLoading] = useState(false);
    console.log(product)
  const [formData, setFormData] = useState({ 
      clientname: product.clientname,
      phone: product.phone,
      covernorate: product.covernorate,
      city: product.city,
      productname: product.productname,
      productprece: product.productprece,
      productorder: product.productorder,
      quantity :product.quantity,
      commition: product.commition,
      total: product.total,
      imagePaths: product.imagePaths
  });

  const governorates = [
    "القاهرة",
    "الجيزة",
    "الإسكندرية",
    "القليوبية",
    "الشرقية",
    "الغربية",
    "المنوفية",
    "البحيرة",
    "الفيوم",
    "المنيا",
    "أسيوط",
    "سوهاج",
    "قنا",
    "الأقصر",
    "أسوان",
    "الوادي الجديد",
    " بورسعيد",
    "الاسماعيليه",
    "دمياط",
    "السويس",
    "بني سويف",
    "الدقهليه",
    "كفرالشيخ"
    // يمكنك إضافة المزيد من المحافظات والمدن هنا
  ];
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name in formData) {
      setFormData({
        ...formData,  
          [name]: value
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };
 
  
  const onDrop = useCallback((acceptedFiles) => {
    const imagePaths = acceptedFiles.map((file) => URL.createObjectURL(file));
    setFormData((prevData) => ({
      ...prevData,
        imagePaths: [...prevData.imagePaths, ...imagePaths]
    
    }));
  }, []);

  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleSubmit = async (e) => {
    try{
    e.preventDefault();
    setIsLoading(true)
    if (formData.imagePaths.length === 0) {
        setIsLoading(false)
        setErr(true); // تعديل: ضبط حالة الخطأ إذا لم يتم تحميل أي صور
        return;
    }
  
    // تحويل الصور إلى Base64
    const imageBase64 = formData.imagePaths.map((path) => {
      const img = new Image();
      img.src = path;
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      return canvas.toDataURL('image/jpeg');
    });

    // إنشاء كائن JSON للبيانات المرسلة
    // const requestData = {
    //   stateDetail: {
    //     clientname: formData.stateDetail.clientname,
    //     phone: formData.stateDetail.phone,
    //     covernorate: formData.stateDetail.covernorate,
    //     city: formData.stateDetail.city,
    //     productname: formData.stateDetail.productname,
    //     productprece: formData.stateDetail.productprece,
    //     productorder: formData.stateDetail.productorder,
    //     quantity: formData.stateDetail.quantity,
    //     commition: formData.stateDetail.commition,
    //     total: formData.stateDetail.total,
    //     imagePaths: imageBase64  
    //   }
    // };
    const requestData = {};

    for(const key in formData ){
        if(formData[key] !== product[key]){
            requestData[key]= formData[key] ;
        }
    }
   
    if(Object.keys(requestData).length===0){
        setIsLoading(false);
        alert('لم تقم بتغيير اي شئ');
        return;
    }

    // console.log(requestData)
    // console.log(product._id)

    // https://api-order-form.onrender.com 
    const response = await fetch(`https://api-order-form.vercel.app/update/${product._id}/${code}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });
  
      if (!response.ok) {
        throw new Error('Something went wrong');
      }
  
      const data = await response.json();
      console.log(data);
      alert('Data updated successfully');
    } 
catch (error) {
    alert(`فشل في إرسال البيانات: ${error.message}`);
} finally {
    setIsLoading(false);
  }
  
}
  return (
    <form onSubmit={handleSubmit} className="w-[95%] md:max-w-xl mx-auto p-6 bg-gray-100 shadow-md rounded-lg ">
      <div className="mb-4">
        <button className='text-[24px] text-[red] bg-[#6fd48adf] p-2 rounded-full '  onClick={()=>{
            onCancel();
        }}> x </button>
        <label className="block text-gray-700">اسم العميل</label>
        <input
          required
          type="text"
          name="clientname"
          value={formData.clientname}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">الهاتف</label>
        <input
          required
          type="text"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">المحافظة</label>
        <select
        required
          name="covernorate"
          value={formData.covernorate}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">اختر المحافظة</option>
          {governorates.map((governorate, index) => (
            <option key={index} value={governorate}>{governorate}</option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">العنوان بالتفصيل</label>
        <input
        required
          name="city"
          value={formData.city}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      {/* المزيد من الحقول هنا */}
      <div className="mb-4">
  <label className="block text-gray-700">الصور</label>
  <div required {...getRootProps()} className={`dropzone border-[3px] border-[#fff] ${err ?"bg-[#f80707]" :"bg-[#bcef57]"}`}>
  <input {...getInputProps()}/>
    {isDragActive ? (
      <p>قم بإسقاط الصور هنا</p>
    ) : (
      <p>قم بإسقاط الصور هنا أو انقر لتحميلها</p>
    )}
  </div>
  {/* إضافة عرض الصور المختارة */}
  {formData.imagePaths.length > 0 && (
    <div className="mt-4">
      <p>الصور المختارة:</p>
      <ul>
        {formData.imagePaths.map((path, index) => (
          <li key={index}>
            <img src={path} alt={`صورة ${index}`} className="w-32 h-32 object-cover rounded-lg" />
          </li>
        ))}
      </ul>
    </div>
  )}
</div>

      <div className="mb-4">
        <label className="block text-gray-700">اسم المنتج</label>
        <input
        required
          type="text"
          name="productname"
          value={formData.productname}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">الكميه</label>
        <input
        required
          type="text"
          name="quantity"
          value={formData.quantity}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">سعر المنتج</label>
        <input
        required
          type="text"
          name="productprece"
          value={formData.productprece}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700"> سعر الشحن</label>
        <input
        required
          type="text"
          name="productorder"
          value={formData.productorder}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
       
      <div className="mb-4">
        <label className="block text-gray-700">العمولة</label>
        <input
        required
          type="text"
          name="commition"
          value={formData.commition}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">الاجمالي شامل العموله والشحن</label>
        <input
        required
          type="text"
          name="total"
          value={formData.total}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      
      {isLoading ? (
        <p className="text-gray-700 font-bold">جاري ارسال البيانات...</p>
    ) : (
        <button type="submit" className="w-full bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700">
        إرسال
      </button>
    )}
    </form>
  );
};

export default ConditionForm;


