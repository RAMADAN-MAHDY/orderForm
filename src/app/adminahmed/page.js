'use client';
import ImageHoverEffect from '@/app/adminahmed/imageHover';
import { useState, useEffect, useMemo } from 'react';
import { format } from 'date-fns';
import { AiFillFrown } from "react-icons/ai";
import { AiFillSmile } from "react-icons/ai";
import Notec from '@/app/componant/notec'

import io from 'socket.io-client';
const Admin = () => {
    const [data, setData] = useState(null);
    const [fldata, setflData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedOptions, setSelectedOption] = useState({});
    const [sendreqIsfiled, setsendreqIsfiled] = useState({});
    const [searchInput, setSearchInput] = useState('');
    const [newCondition, setNewCondition] = useState(() => {
        const savedConditions = localStorage.getItem('newCondition');
        return savedConditions ? JSON.parse(savedConditions) : [];
    });// from socket io

    const [newConditionlenth, setNewConditionlength] = useState(() => {
        // استرجاع البيانات المخزنة في localStorage عند تحميل الصفحة
        const savedConditions = typeof window !== 'undefined' ? localStorage.getItem('newConditionlength') || '' : '';
        return savedConditions ? JSON.parse(savedConditions) : [];
    });

    const [Notices, setNotices] = useState(false);
    console.log(searchInput)
    console.log(fldata)

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
    // handle state 
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

    const fetchData = async () => {
        try {
            const response = await fetch('https://api-order-form.onrender.com/condition');
            const responseData = await response.json();
            setData(responseData);
            setIsLoading(false);
            console.log(responseData);
        } catch (error) {
            console.error('Error fetching data:', error);
            setIsLoading(false);
        }
    };

    useEffect(() => {

        fetchData();
    }, [selectedOptions, newCondition]);


    useEffect(() => {
        // إنشاء اتصال WebSocket مع الخادم
        const socket = io('https://api-order-form.onrender.com');

        // استقبال رسالة من الخادم عندما يتم إرسالها باستخدام io.emit('new-condition', { code });
        socket.on('new-condition', (data) => {
            console.log('تم استقبال رسالة جديدة من الخادم:', data);
            // تحديث الحالة والإضافة إلى localStorage
            setNewCondition(prevConditions => {
                const updatedConditions = [...prevConditions, Object.values(data)];
                typeof window !== 'undefined' && localStorage.setItem('newCondition', JSON.stringify(updatedConditions));
                return updatedConditions;
            });
            setNewConditionlength(prevConditions => {
                const updatedConditions = [...prevConditions, Object.values(data)];
                typeof window !== 'undefined' && localStorage.setItem('newConditionlength', JSON.stringify(updatedConditions));
                return updatedConditions;
            });

        });
        // تنظيف الاتصال عندما يتم تفكيك المكون
        return () => {
            socket.disconnect();
        };
    }, []);


    const handleSearchInputChange = (event) => {
        setSearchInput(event.target.value);
    };

    const filteredData = useMemo(() => {
        if (!data) return [];
        return data.filter((item) =>
            item.code.toString().includes(searchInput) ||
            item.name.toString().includes(searchInput)
        );
    }, [data, searchInput]);

    return (
        <div dir='rtl'>
            <div className='flex justify-between'>
                {/* مربع البحث */}
                <input
                    className='p-3 rounded-3xl m-3 w-[200px] h-[30px] left-0'
                    type="text"
                    placeholder="ابحث باستخدام الكود أو الاسم"
                    value={searchInput}
                    onChange={handleSearchInputChange}
                />
                <h1 className='text-[#ffffff] h-[50px] mb-3 text-[24px] p-1 bg-[#c5c5c1] shadow-[0_35px_35px_rgba(3,3,3,1.25)]'> بسم الله الرحمن الرحيم</h1>

                <div className="mb-3 h-[60px] self-center border border-gray-400 rounded-lg p-4 group hover:bg-white bg-gradient-to-br from-red-500 to-blue-500 via-green-500">

                    <span className="h-[60px] bg-clip-text bg-gradient-to-br from-red-500 to-blue-500 via-green-500 text-[#fff] hover:text-white animate-pulse">
                        Roial corner
                    </span>
                </div>
            </div>
            {newConditionlenth.length > 0 &&
                <div className="relative top-[8px]" >
                    <AiFillSmile className='text-[#ddff00] w-[50px] h-[50px] bg-[#000] rounded-full' onClick={() => {
                        setNotices(!Notices);
                        typeof window !== 'undefined' &&localStorage.removeItem("newConditionlength");
                    }} />

                    <p className="text-[#ffffff] text-[15px] w-[30px] h-[30px] pt-[0.3rem] pr-[0.75rem] rounded-full bg-[#ff1100] absolute top-[-9px] right-[40px]">
                        {newConditionlenth.length}
                    </p>
                </div>
            }
            {newConditionlenth.length < 1 &&
                <div className="relative top-[8px]">
                    <AiFillFrown className='text-[#ddff00] w-[50px] h-[50px] bg-[#000] rounded-full' onClick={() => {
                        setNotices(!Notices);
                    }} />
                </div>}
            {Notices &&
                <Notec lengthpro={newCondition} />
            }


            {isLoading ? (
                <div className="m-[40%] loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-32 w-32 p-3">
                    <p className='p-3 m-3'>Loading</p>
                </div>
            )
                :
                filteredData.length > 0 ? (
                    filteredData.map((dataItem, index) => {

                        return (

                            <div key={`${dataItem.code}-${index}`} className='mt-[50px]'>

                                <p className='bg-[#dad1d1] pr-6 pt-6 mt-24'> الاسم  {dataItem.name}
                                </p>
                                <p className='bg-[#dad1d1] pr-6'>
                                    الكود: {dataItem.code}
                                </p>



                                <div className="overflow-x-auto ">
                                    <table className="table-auto w-full border-collapse border border-gray-800">
                                        <thead>
                                            <tr className='text-[#32ff46] bg-[#433]' key={dataItem.code}>
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
                                        <tbody key={dataItem.code} >
                                            {dataItem.conditions.map((rowData, rowIndex) => (
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
                                                                onChange={(event) => handleOptionChange(event, rowData._id, dataItem.code)}
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
                                                                    (event) => handleInputChange(event, rowData._id, dataItem.code)}
                                                                />

                                                            }

                                                            <button className=' bg-[#12e512df] p-2 rounded-2xl m-1' onClick={() => handleUpdateStatus(rowData._id, dataItem.code)}>تحديث الحالة</button>
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
                                <hr></hr>
                            </div>
                        )
                    })
                ) :
                    data ? (
                        data.map((dataItem, index) => {

                            return (

                                <div key={`${dataItem.code}-${index}`} className='mt-[50px]'>

                                    <p className='bg-[#dad1d1] pr-6 pt-6 mt-24'> الاسم  {dataItem.name}
                                    </p>
                                    <p className='bg-[#dad1d1] pr-6'>
                                        الكود: {dataItem.code}
                                    </p>



                                    <div className="overflow-x-auto ">
                                        <table className="table-auto w-full border-collapse border border-gray-800">
                                            <thead>
                                                <tr className='text-[#32ff46] bg-[#433]' key={dataItem.code}>
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
                                            <tbody key={dataItem.code} >
                                                {dataItem.conditions.map((rowData, rowIndex) => (
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
                                                                    onChange={(event) => handleOptionChange(event, rowData._id, dataItem.code)}
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
                                                                        (event) => handleInputChange(event, rowData._id, dataItem.code)}
                                                                    />

                                                                }

                                                                <button className=' bg-[#0eff0e] p-2 rounded-2xl m-1 hover:bg-[#2a702c] hover:text-[#fff]' onClick={() => handleUpdateStatus(rowData._id, dataItem.code)}>تحديث الحالة</button>
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
                                    <hr></hr>
                                </div>
                            )
                        })
                    ) :
                        (
                            <p>No data available</p>
                        )}
        </div>
    );
};

export default Admin;
