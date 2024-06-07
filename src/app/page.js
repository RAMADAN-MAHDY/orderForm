"use client"
import ConditionForm from '@/app/form/page';
import LoginForm from '@/app/componant/login';
import SignUpComponent from '@/app/componant/sinUp';
import { useState,useEffect } from 'react';
import Link from 'next/link';
// import io from 'socket.io-client';

export default function Home() {
    const [userEmail, setUserEmail] = useState( typeof window !== 'undefined' ?localStorage.getItem('emailorderform') || '' : '');
    const [usercode, setUsercode] = useState( typeof window !== 'undefined' ?localStorage.getItem('codeorderform') || '':'');
    const handleSignInSuccess = (email,code) => {
        setUserEmail(email);
        setUsercode(code);
      };
      const removeNumbers = (str) => {
        return str.replace(/\d/g, '');
    }
      console.log(userEmail)
      console.log(usercode)
      const [showChild, setShowChild] = useState(false)

      useEffect(() => {
        setShowChild(true)
      }, [])

      
  if (!showChild) {
    return null
  }
  
  return (

    <main className="flex min-h-screen flex-col items-center  pt-6">
       
      <h1 className='text-[#ffffff] mb-3 text-[24px] p-1 bg-[#c5c5c1] shadow-[0_35px_35px_rgba(3,3,3,1.25)]'> بسم الله الرحمن الرحيم</h1> 
      <dev className='flex justify-between '>
     
   
{userEmail && 
        <button className='bg-[#c59e44] p-2 mr-3 rounded-xl text-[#fff] hover:text-[#f43030] hover:bg-[#ebd39d] mb-3' onClick={()=>{
            localStorage.removeItem("emailorderform");
            localStorage.removeItem("codeorderform");
            location.reload();
        }}>تسجيل خروج</button>
        } 
         <div className="mb-3 self-center border border-gray-400 rounded-lg p-4 group hover:bg-white bg-gradient-to-br from-red-500 to-blue-500 via-green-500">

<span className="bg-clip-text bg-gradient-to-br from-red-500 to-blue-500 via-green-500 text-[#fff] hover:text-white animate-pulse">
  Royal corner
</span>
</div>
{usercode&& <>
    <div className="mb-3 self-center border border-gray-400 rounded-lg p-4 group hover:bg-white bg-gradient-to-br to-red-500  from-blue-500 via-green-500">
<span className="bg-clip-text bg-gradient-to-br  text-[#fff] hover:text-white animate-pulse">
<Link className='' href={`/${usercode}`}>عرض التقارير</Link>
</span>
</div>
        <div className='text-[#fff] flex flex-col m-3 bg-[#6e9c32d9] p-3 rounded-xl'>
        <p className='pt-1'> {removeNumbers(userEmail)} ازيك يا</p>
        <p className='pt-1'> {usercode}: الكود</p>
        </div>

</>}

      

      </dev>
    


        <div className='w-[95%] md:max-w-xl mx-auto'>
      {userEmail ? (
        <>
        
      <ConditionForm/>

        </>
      ) : (
        <>
         <LoginForm onSignInSuccess={handleSignInSuccess} />
        <SignUpComponent/>
        </>
       
      )}
         </div>
    </main>
  );
}
