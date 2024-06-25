'use client';
import { useState, useEffect } from 'react';
import { notFound } from "next/navigation"
import { format } from 'date-fns';
import ImageHoverEffect from '@/app/adminahmed/imageHover';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import ConditionForm from '@/app/componant/updateOrder';


const TableAdmin = ({ params }) => {

    const [data, setData] = useState([]);

    // console.log(data.code)
    // console.log(params.slug)
    const [isLoading, setIsLoading] = useState(true);
    const [copyStatus, setcoby] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isEditing2, setIsEditing2] = useState(false);
    const [selectedOptions, setSelectedOption] = useState({});
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [sendreqIsfiled, setsendreqIsfiled] = useState({});
    const [commition, setcommition] = useState({});
    const [getcommition, setgetcommition] = useState([]);
    const [idOrder, setidOrder] = useState();
    const [refreshdata, setrefreshdata] = useState(false);
    const [showMessage, setshowMessage] = useState(false);
    // console.log(idOrder)

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
               setrefreshdata(!refreshdata);



            } else {
                const errorData = await response.json();
                alert(`حدث خطأ أثناء إرسال البيانات: ${errorData.message || response.statusText}`);
            }
        } catch (error) {
            alert(`فشل في إرسال البيانات: ${error.message}`);
        }


    }
   // hndle delete data by ic and code 
   const handleDeleteOrder = async (id) => {
    // console.log(idOrder)
    // console.log(params.slug)

    try {
        const response = await fetch(`https://api-order-form.onrender.com/item/${params.slug}/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
        });
        if (response.ok) {
            alert(' تم الحذف  ');
            setrefreshdata(!refreshdata)
            setshowMessage(false)

        } else {
            const errorData = await response.json();
            alert(`حدث خطأ أثناء إرسال البيانات: ${errorData.message || response.statusText}`);
        }
    } catch (error) {
        alert(`فشل في إرسال البيانات: ${error.message}`);
    }


}
    // handle get fetch state 
    const handleGetCommition = async () => {
        try {
            const response = await fetch(`https://api-order-form.onrender.com/Commitionschma`);
            const responseData = await response.json();
            // console.log(responseData)
            setgetcommition(responseData);
        } catch (error) {
            alert(`فشل في استلام البيانات: ${error.message}`);
        }
    };

// دالة لإغلاق نموذج التعديل
const cancelEdit = () => {
    setIsEditing(!isEditing);
    setSelectedProduct(null);
};


    const handleUpdateCommition = async (id) => {
        try {
            const commitionValue = commition[id];
            if (!commitionValue) {
                alert('الرجاء إدخال العمولة');
                return;
            }
            const response = await fetch(`https://api-order-form.onrender.com/Commitionschma`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id, commition: commitionValue }) // إرسال البيانات كجسم JSON
            });

            if (response.ok) {
                alert('تم ارسال الطلب');
            setrefreshdata(!refreshdata);

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
    // handle editproduct 
    const toggleEdit = (id ,rowData) => {
        setIsEditing({...isEditing ,[id]:!isEditing2 });
        setIsEditing2(!isEditing2)
        setSelectedProduct(rowData)
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                //https://api-order-form.onrender.com
                const response = await fetch(`https://api-order-form.onrender.com/condition/${params.slug}`);
                const responseData = await response.json();
                setData(responseData);
                setIsLoading(false);

                if (!responseData.ok) {
                    notFound();
                }
                // console.log(responseData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
        handleGetCommition();
    }, [params , isEditing , refreshdata]);


    //get Table Row Content to copy
    const getTableRowContent = (rowData) => {
        return `
        ${rowData.clientname} \t ${rowData.phone} \t ${rowData.covernorate} \t ${rowData.city} \t
        ${rowData.productname}  \t ${rowData.quantity} \t ${rowData.total}
    `;
    };



    if (isLoading) {
        return <div>Loading...</div>;
    }
    return (
<div className="relative">
            {/* عرض نموذج التعديل فوق الجدول */}
            {isEditing && selectedProduct && (
                <ConditionForm
                    className="absolute top-0 left-0 right-0 bg-white z-50"
                    product={selectedProduct}
                    code={params.slug}
                    onCancel={cancelEdit} // دالة لإلغاء التعديل
                />
            )}
        {/* رساله تنبيه لحذف الاوردر */}
       {showMessage&& <div className='fixed text-[#ff0000] h-[200px] rounded-se-3xl mt-10 ml-[30%] bg-[#ffffff] w-[260px]'>
            <p className='text-[30px] mt-10 p-2'>
                    سيتم حذف الطلب نهائيا 
            </p>
            <button className='text-[30px] bg-[#ff0000] text-[#fff] rounded-3xl p-3 mt-[27px]' onClick={()=>{
             handleDeleteOrder(idOrder);
            }}>
                                        تأكيد
            </button>
            <button className='text-[30px] bg-[rgb(0,30,255)] text-[#fdfcff] rounded-3xl p-3 mt-[27px]  ml-[110px]' onClick={()=>{
            setshowMessage(!showMessage);
            }}>
                                        الغاء
            </button>
        </div> }
        <div className="overflow-x-auto ">
            <table className="table-auto w-full border-collapse border border-gray-800">
                <thead>
                    <tr className='text-[#32ff46] bg-[#433]' key={params.slug}>
                        <th className="border border-gray-800 px-4 py-2 min-w-[auto]" style={{ whiteSpace: 'nowrap' }}>النسخ  </th>
                        <th className="border border-gray-800 px-4 py-2 min-w-[auto]" style={{ whiteSpace: 'nowrap' }}>اسم العميل</th>
                        <th className="border border-gray-800 px-4 py-2">رقم الهاتف</th>
                        <th className="border border-gray-800 px-4 py-2">المحافظه</th>
                        <th className="border border-gray-800 px-4 py-2 max-w-[400px] min-w-[300px]">العنوان</th>
                        <th className="border border-gray-800 px-4 py-2 max-w-[200px] min-w-[200px]">اسم المنتج</th>
                        <th className="border border-gray-800 px-4 py-2">سعر المنتج</th>
                        <th className="border border-gray-800 px-4 py-2 min-w-[30px] m-0 text-center">الكميه</th>
                        <th className="border border-gray-800 px-4 py-2">الشحن</th>
                        <th className="border border-gray-800 px-4 py-2 w-[30px]">العموله</th>
                        <th className="border border-gray-800 px-4 py-2">اجمالي السعر</th>
                        <th className="border border-gray-800 px-4 py-2">حالة الطلب</th> <th className="border border-gray-800 px-4 py-2" style={{ whiteSpace: 'nowrap' }}>التاريخ </th>
                        <th className="border border-gray-800 px-4 py-2">طلب العموله </th>
                        <th className="border border-gray-800 px-4 py-2 max-w-[200px] min-w-[200px]"> ملاحظه </th>
                        <th className="border border-gray-800 px-4 py-2"> عمولتنا </th>
                        <th className="border border-gray-800 px-4 py-2">الصور</th>
                    </tr>
                </thead>
                <tbody key={params.slug} >
                    {data.conditions ? data.conditions.map((rowData, rowIndex) => (
                        <tr key={`${rowData._id}-${rowIndex}`} className={`${rowIndex % 2 === 0 ? 'bg-gray-100' : 'bg-gray-200'}`}>
                            <CopyToClipboard text={getTableRowContent(rowData)}>
                                <button onClick={() => {
                                    setcoby({ ...copyStatus, [rowData._id]: true })
                                }} className="mt-2 px-4 py-2 bg-blue-500 text-white rounded "> {copyStatus[rowData._id] ? "تم " : "نسخ "}</button>
                            </CopyToClipboard>
                            
<button className='p-2 m-1 bg-[#054ffafc] rounded-2xl ' onClick={()=>{
    toggleEdit(rowData._id ,rowData)
}}>
        {isEditing[rowData._id] ? 'Cancel' : 'تعديل'}
      </button>
      <button className='p-2 m-1 bg-[#fa0505fc] rounded-2xl text-[#fff] ' onClick={()=>{
   setidOrder(rowData._id)
   setshowMessage(true)
}}>
       حذف
      </button>
                            <td className="border border-gray-800 px-4 py-2 w-auto" style={{ whiteSpace: 'nowrap' }}>{rowData.clientname}</td>
                            <td className="border border-gray-800 px-4 py-2">{rowData.phone}</td>
                            <td className="border border-gray-800 px-4 py-2 ">{rowData.covernorate}</td>
                            <td className="border border-gray-800 px-4 py-2 max-w-[400px] break-words">{rowData.city}</td>

                            <td className="border border-gray-800 px-4 py-2  max-w-[200px] break-words">{rowData.productname}</td>
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
                            <td className="border border-gray-800 px-4 py-2" style={{ whiteSpace: 'nowrap' }}>{format(rowData.timestamp, `dd-MM & hh:mm a`)}</td>

                            <td className="border border-gray-800 px-4 py-2 text-[#ff3a3a]"> {rowData.commitionreq && <p>طلب العموله  </p>} {rowData.commitionreq}</td>
                            <td className="border border-gray-800 px-4 py-2 text-[#ff3a3a]">{rowData.notes}</td>
                            <td className="border border-gray-800 px-4 py-2 text-[#ff3a3a]">
                                <input
                                    className='w-[100px] p-1 m-0 rounded-xl'
                                    type='text'
                                    placeholder='العموله'
                                    onChange={(event) => {
                                        const value = event.target.value;
                                        setcommition(prevCommition => ({
                                            ...prevCommition,
                                            [rowData._id]: value
                                        }));
                                    }}
                                    value={commition[rowData._id] !== undefined ? commition[rowData._id] : (getcommition.find(item => item.id === rowData._id)?.commition || "")}
                                />

                                <button className='bg-[#0bff27] p-1 m-2 rounded-2xl' onClick={() => {
                                    handleUpdateCommition(rowData._id)
                                }

                                }>حفظ</button>
                            </td>

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
                    )) : <p className='text-center text-[#fff] fixed ml-[30%] w-[300px] y-[100px] text-[34px] bg-[#343244] p-6 mt-6'> لا يوجد طلبات </p>}
                </tbody>
            </table>
          
        </div>
</div>
    )



}
export default TableAdmin;






