"use client";

import { useState } from 'react';

function LoginForm({ onSignInSuccess , onSignUp }) {
    const [email, setEmail] = useState( typeof window !== 'undefined' ?localStorage.getItem('emailorderform') || '':'');
     const [code, setcodel] = useState( typeof window !== 'undefined' ?localStorage.getItem('codeorderform') || '':'');
    const [password, setPassword] = useState('');
    const [go, setGo] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);


    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };
    const handlecodeChange = (event) => {
        setcodel(event.target.value);
    };
    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        try {
            const response = await fetch("https://api-order-form.vercel.app/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password ,code}),
            });
            const data = await response.json();

            if (data.message === 'Login successful') {
                localStorage.setItem('emailorderform', email); // حفظ البريد الإلكتروني في الذاكرة المحلية
                localStorage.setItem('codeorderform', code);
                setGo(true);
                onSignInSuccess(email,code);
            } else {
                throw new Error('Network response was not ok');
             
            }
        } catch (error) {
            setErrorMessage(true);
            console.error('There was a problem with your fetch operation:', error);
        }finally {
            setIsLoading(false); // نهاية عملية التحميل
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-gray-100 shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <h2 className='text-[24px] font-bold text-center'>تسجيل الدخول</h2>
            <div className="mb-4">
                <label htmlFor="email" className={`block ${go === true ? "text-[#449029]" : "text-gray-700"} text-sm font-bold mb-2`}> اسم المستخدم</label>
                <input
                    type="text"
                    id="email"
                    value={email}
                    onChange={handleEmailChange}
                    required
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
            </div>
            <div className="mb-6">
                <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2" >  كلمة المرور </label>
                <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={handlePasswordChange}
                    required
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
               
            </div>
            <div className="mb-4">
                <label htmlFor="email" className={`block ${go === true ? "text-[#449029]" : "text-gray-700"} text-sm font-bold mb-2`}> الكود</label>
                <input
                    type="text"
                    id="code"
                    value={code}
                    onChange={handlecodeChange}
                    required
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
                 {errorMessage && <p className='text-red-800 shadow'> تاكد من الحساب وان لم تستطع التسجيل تواصل مع الدعم </p>}
            </div>
            <div className="flex items-center justify-between">
            {isLoading ? (
        <p className="text-gray-700 font-bold">جاري تسجيل الدخول...</p>
    ) : (
        <button type="submit" className={`${go === true ? "bg-green-500" : "bg-blue-500"} hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline`}>تسجيل الدخول</button>
    )}

<button type='button' onClick={()=>{
onSignUp()
}} className={` bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline`}> انشاء حساب</button>
            </div>
        </form>
    );
}

export default LoginForm;
