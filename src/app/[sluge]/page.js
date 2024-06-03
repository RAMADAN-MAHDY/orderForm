'use client'

import Link from 'next/link';
import { useState, useEffect } from 'react';

const DataComponent = ({ params }) => {
  console.log(params.sluge);

  const [data, setData] = useState(null);
  const [commitionreq, setcommitionreq] = useState("طلب العموله");
  const [isLoading, setIsLoading] = useState(true);

  const handlecommitionreq = async (id)=>{
  
    try {
    console.log(commitionreq)
    console.log(data.code)
    console.log(id)

        const response = await fetch(`https://api-order-form.onrender.com/condition/${data.code}/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
        body: JSON.stringify({commitionreq}) // إرسال البيانات كجسم JSON
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`https://api-order-form.onrender.com/condition/${params.sluge}`);
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

  return (
    <div dir='rtl'>
      {isLoading ? (
      <div className="m-[40%] loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-32 w-32 p-3">
      <p className='p-3 m-3'>Loading</p>
    </div>

      ) : data ? (
        <div className='m-3'>
                 <div className="mb-3 self-center border border-gray-400 rounded-lg p-4 group hover:bg-white bg-gradient-to-br from-red-500 to-blue-500 via-green-500">

<span className="bg-clip-text bg-gradient-to-br from-red-500 to-blue-500 via-green-500 text-[#fff] hover:text-white animate-pulse">
  Roial corner
</span>
</div>
        <Link className='bg-[#88bbd1e4] p-3 rounded-xl hover:bg-[#1ebcffd3]' href={'/'}>الصفحه الرئيسيه</Link>
          <p className='bg-[#dad1d1] p-6 '>Name: {data.name}</p>
          <p className='bg-[#dad1d1] p-6 '>Code: {data.code}</p>
          <div className="overflow-x-auto">
            <table className="table-auto w-full border-collapse border border-gray-800">
              <thead>
                <tr>
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
                  <th className="border border-gray-800 px-4 py-2">حالة الطلب</th>
                  <th className="border border-gray-800 px-4 py-2"> طلب العموله </th>
                  {/* <th className="border border-gray-800 px-4 py-2">الصور</th> */}
                </tr>
              </thead>
              <tbody>
                {data.conditions.map((rowData, index) => (
                  <tr key={rowData._id} className={`${index % 2 === 0 ? 'bg-gray-100' : 'bg-gray-200'}`}>
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
                    <td className="border border-gray-800 px-4 py-2">{rowData.state}</td>
                    {rowData.state === "تم التسليم"  &&  <td className="border border-gray-800 px-4 py-2"> 
                    <button className='bg-[#40d151] p-2 rounded-2xl hover:bg-[#2b8936] hover:text-[#fff]' onClick={()=>{
                        handlecommitionreq(rowData._id)
                    }}>
                        طلب العموله
                    </button>
                    
                    </td>}
                     {/* <img src={rowData.imagePaths[0]} alt="Product" /> */}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <p>No data available</p>
      )}
    </div>
  );
};

export default DataComponent;
