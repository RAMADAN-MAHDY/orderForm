"use client"
// components/ConditionForm.js
import { useState , useCallback} from 'react';
import { useDropzone } from 'react-dropzone';

const ConditionForm = () => {
    const [usercode, setUsercode] = useState(localStorage.getItem('codeorderform') || '');
    const [err , setErr] = useState();
    const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    stateDetail: {
      clientname: '',
      phone: '',
      covernorate: '',
      city: '',
      productname: '',
      productprece: '',
      productorder: '',
      quantuty :1,
      commition: '',
      total: '',
      notes: '',
      state: '',
      imagePaths: []
    }
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
    "البحر الأحمر",
    "مطروح",
    "شمال سيناء",
    "جنوب سيناء",
    "الوادي الجديد",
    "مرسى مطروح"
    // يمكنك إضافة المزيد من المحافظات والمدن هنا
  ];
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name in formData.stateDetail) {
      setFormData({
        ...formData,
        stateDetail: {
          ...formData.stateDetail,
          [name]: value
        }
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };
 
  
  const onDrop = useCallback((acceptedFiles) => {
    const imagePaths = acceptedFiles.map((file) => URL.createObjectURL(file));
    setFormData((prevData) => ({
      ...prevData,
      stateDetail: {
        ...prevData.stateDetail,
        imagePaths: [...prevData.stateDetail.imagePaths, ...imagePaths]
      }
    }));
  }, []);

  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true)
    if (formData.stateDetail.imagePaths.length === 0) {
        setIsLoading(false)
        setErr(true); // تعديل: ضبط حالة الخطأ إذا لم يتم تحميل أي صور
        return;
    }
  
    // تحويل الصور إلى Base64
    const imageBase64 = formData.stateDetail.imagePaths.map((path) => {
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
    const requestData = {
      name: formData.name,
      code: usercode,
      stateDetail: {
        clientname: formData.stateDetail.clientname,
        phone: formData.stateDetail.phone,
        covernorate: formData.stateDetail.covernorate,
        city: formData.stateDetail.city,
        productname: formData.stateDetail.productname,
        productprece: formData.stateDetail.productprece,
        productorder: formData.stateDetail.productorder,
        quantity: formData.stateDetail.quantuty,
        commition: formData.stateDetail.commition,
        total: formData.stateDetail.total,
        notes: formData.stateDetail.notes,
        state: formData.stateDetail.state,
        imagePaths: imageBase64 // إضافة الصور المحولة إلى Base64
      }
    };
    console.log(err)
  
    try {
      const response = await fetch('https://api-order-form.onrender.com/condition', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData) // إرسال البيانات كجسم JSON
      });
  
      if (response.ok) {
        alert('تم إرسال البيانات بنجاح');
        setFormData({
            name: '',
            code: '',
            stateDetail: {
              clientname: '',
              phone: '',
              covernorate: '',
              city: '',
              productname: '',
              productprece: '',
              productorder: '',
              quantuty: 1,
              commition: '',
              total: '',
              notes: '',
              state: '',
              imagePaths: []
            }
          });
      } else {
        const errorData = await response.json();
        alert(`حدث خطأ أثناء إرسال البيانات: ${errorData.message || response.statusText}`);
      }
    } catch (error) {
      alert(`فشل في إرسال البيانات: ${error.message}`);
    }finally {
        setIsLoading(false); // نهاية عملية التحميل
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="w-[95%] md:max-w-xl mx-auto p-6 bg-gray-100 shadow-md rounded-lg">
      <div className="mb-4">
        <label className="block text-gray-700">اسم المسوق</label>
        <input
          type="text"
          name="name"
          required
          value={formData.name}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">الكود</label>
        <input
          required
          type="text"
          name="code"
          value={usercode}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">اسم العميل</label>
        <input
          required
          type="text"
          name="clientname"
          value={formData.stateDetail.clientname}
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
          value={formData.stateDetail.phone}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">المحافظة</label>
        <select
        required
          name="covernorate"
          value={formData.stateDetail.covernorate}
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
          value={formData.stateDetail.city}
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
  {formData.stateDetail.imagePaths.length > 0 && (
    <div className="mt-4">
      <p>الصور المختارة:</p>
      <ul>
        {formData.stateDetail.imagePaths.map((path, index) => (
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
          value={formData.stateDetail.productname}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">الكميه</label>
        <input
        required
          type="text"
          name="quantuty"
          value={formData.stateDetail.quantuty}
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
          value={formData.stateDetail.productprece}
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
          value={formData.stateDetail.productorder}
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
          value={formData.stateDetail.commition}
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
          value={formData.stateDetail.total}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">ملاحظات ( اختياري )</label>
        <input    
          type="text"
          name="notes"
          value={formData.stateDetail.notes}
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

