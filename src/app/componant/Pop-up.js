"use client"
import React, { useState } from 'react';
import {AiOutlineSearch} from "react-icons/ai";
const LogoModal = ({ clientname ,getCodeBYClientName ,setclientname ,handleGetCodeByClientname ,setgetCodeBYClientName}) => {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <div className="relative">
<div className='flex flex-row  p-2 m-3 '>

<input
                    className='p-3 rounded-3xl mt-3 sm:w-[200px] w-[200px] h-[30px] left-0'
                    type="text"
                    placeholder="البحث بأسم العميل  "
                    value={clientname}
                    onChange={(event)=>{
                        setclientname(event.target.value)
                    }}
                />
                <button className='h-[30px] bg-[#ffffffee] rounded-3xl mt-3'  onClick={()=>{
                  openModal();
                  handleGetCodeByClientname();
                }
                    }>
 <AiOutlineSearch className='w-11 text-[30px] text-[#033afe] '/>

                </button>
</div>

      {(isOpen && getCodeBYClientName) && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div
            className="absolute inset-0 bg-gray-900 opacity-75"
            onClick={closeModal}
          ></div>
          <div className="bg-white p-8 rounded-lg shadow-lg z-50">
            <h2 className="text-2xl font-bold mb-4"> الكود  : {getCodeBYClientName} </h2>

            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={()=>{
                closeModal();
                setclientname('');
                setgetCodeBYClientName('')
            }
              }>
              إغلاق
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LogoModal;
