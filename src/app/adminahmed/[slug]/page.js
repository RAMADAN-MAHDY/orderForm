'use client';
import { useState, useEffect } from 'react';

import { format } from 'date-fns';
import ImageHoverEffect from '@/app/adminahmed/imageHover';

const TableAdmin = ({ params })=>{

    const [data, setData] = useState([]);

    console.log(data.code)
    console.log(params.slug)
    const [isLoading, setIsLoading] = useState(true);

    const [selectedOptions, setSelectedOption] = useState({});

    const [sendreqIsfiled, setsendreqIsfiled] = useState({});

   // handle PUT fetch state 
   const handleUpdateStatus = async (id, code) => {
    try {
        let state;
        if (sendreqIsfiled[id]) {
            state = Object.values(sendreqIsfiled[id]).join("");
        } else { state = Object.values(selectedOptions[id]).join("") }

        console.log(state)
        const response = await fetch(`https://api-order-form.onrender.com/condition/state/${code}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ state }) // إرسال البيانات كجسم JSON
        });
        if (response.ok) {
            alert('تم ارسال الطلب');


        } else {
            const errorData = await response.json();
            alert(`حدث خطأ أثناء إرسال البيانات: ${errorData.message || response.statusText}`);
        }
    } catch (error) {
        alert(`فشل في إرسال البيانات: ${error.message}`);
    }


}

const handleOptionChange = async (event, id, code) => {
    setSelectedOption(prevOptions => ({
        ...prevOptions,
        [id]: event.target.value
    }));

};
   // handle input state if shwose "ملغي"  
   const handleInputChange = (event, id) => {
    setsendreqIsfiled(prevOptions => ({
        ...prevOptions,
        [id]: event.target.value
    }));
};
useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`https://api-order-form.onrender.com/condition/${params.slug}`);
        const responseData = await response.json();
        setData(responseData);
        setIsLoading(false);
        console.log(responseData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [params]);



  if (isLoading) {
    return <div>Loading...</div>;
}
return(

<div className="overflow-x-auto ">
<table className="table-auto w-full border-collapse border border-gray-800">
    <thead>
        <tr className='text-[#32ff46] bg-[#433]' key={params.slug}>
            <th className="border border-gray-800 px-4 py-2">اسم العميل</th>
            <th className="border border-gray-800 px-4 py-2">رقم الهاتف</th>
            <th className="border border-gray-800 px-4 py-2">المحافظه</th>
            <th className="border border-gray-800 px-4 py-2">العنوان</th>
            <th className="border border-gray-800 px-4 py-2">اسم المنتج</th>
            <th className="border border-gray-800 px-4 py-2">سعر المنتج</th>
            <th className="border border-gray-800 px-4 py-2">الكميه</th>
            <th className="border border-gray-800 px-4 py-2">الشحن</th>
            <th className="border border-gray-800 px-4 py-2">العموله</th>
            <th className="border border-gray-800 px-4 py-2">اجمالي السعر</th>
            <th className="border border-gray-800 px-4 py-2">حالة الطلب</th> <th className="border border-gray-800 px-4 py-2">التاريخ </th>
            <th className="border border-gray-800 px-4 py-2">طلب العموله </th>
            <th className="border border-gray-800 px-4 py-2"> ملاحظه </th>
            <th className="border border-gray-800 px-4 py-2">الصور</th>
        </tr>
    </thead>
    <tbody key={params.slug} >
        {data.conditions.map((rowData, rowIndex) => (
            <tr key={`${rowData._id}-${rowIndex}`} className={`${rowIndex % 2 === 0 ? 'bg-gray-100' : 'bg-gray-200'}`}>
                <td className="border border-gray-800 px-4 py-2">{rowData.clientname}</td>
                <td className="border border-gray-800 px-4 py-2">{rowData.phone}</td>
                <td className="border border-gray-800 px-4 py-2">{rowData.covernorate}</td>
                <td className="border border-gray-800 px-4 py-2">{rowData.city}</td>
                <td className="border border-gray-800 px-4 py-2">{rowData.productname}</td>
                <td className="border border-gray-800 px-4 py-2">{rowData.productprece}</td>
                <td className="border border-gray-800 px-4 py-2">{rowData.quantity}</td>
                <td className="border border-gray-800 px-4 py-2">{rowData.productorder}</td>
                <td className="border border-gray-800 px-4 py-2">{rowData.commition}</td>
                <td className="border border-gray-800 px-4 py-2">{rowData.total}</td>
                <td className="border border-gray-800 px-4 py-2 text-[#5d11ff]">    <span className='text-[#fd3737]' >{rowData.state}</span>

                    <div>
                        <label htmlFor={`options-${rowData._id}`}>اختر خيارًا:</label>
                        <select className='rounded-2xl p-1 '
                            id={`options-${rowData._id}`}
                            value={selectedOptions[rowData._id] || ''}
                            onChange={(event) => handleOptionChange(event, rowData._id, data.code)}
                        >
                            <option value="">اختر...</option>
                            <option value="قيد المراجعه"> قيد المراجعه</option>
                            <option value="تم قبول الطلب"> تم قبول الطلب</option>
                            <option value="جاري التوصيل"> جاري التوصيل</option>
                            <option value="تم التسليم">  تم التسليم</option>
                            <option value="تم القبض">  تم القبض</option>
                            <option value="(خصم العموله)ملغي">   (خصم العموله)ملغي </option>
                        </select>
                        {
                            selectedOptions[rowData._id] === '(خصم العموله)ملغي' &&
                            <input className='p-2 rounded-2xl' type='text' placeholder='ملغي ' value={sendreqIsfiled[rowData._id] || ''} onChange={
                                (event) => handleInputChange(event, rowData._id, data.code)}
                            />

                        }

                        <button className=' bg-[#12e512df] p-2 rounded-2xl m-1' onClick={() => handleUpdateStatus(rowData._id, data.code)}>تحديث الحالة</button>
                    </div>



                </td>
                <td className="border border-gray-800 px-4 py-2">{format(rowData.timestamp, 'MM-dd   hh:mm a')}</td>

                <td className="border border-gray-800 px-4 py-2 text-[#ff3a3a]">{rowData.commitionreq}</td>
                <td className="border border-gray-800 px-4 py-2 text-[#ff3a3a]">{rowData.notes}</td>


                <td className="border border-gray-800 px-4 py-2">
                    {rowData.imagePaths && rowData.imagePaths.length > 0 && (

                        rowData.imagePaths.map((sre, imgIndex) => (

                            <ImageHoverEffect
                                key={`${rowData._id}-img-${imgIndex}`}
                                src={sre}
                            />
                        ))

                    )}
                </td>
            </tr>
        ))}
    </tbody>
</table>
</div>

)



}
export default TableAdmin;






