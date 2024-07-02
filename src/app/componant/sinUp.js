'use client'
import React, { useState } from 'react';

const SignUpComponent = ({onSignin}) => {
  const [email, setEmail] = useState('');
  const [code, setcode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setloading] = useState("تأكيد انشاء الحساب ");

  const handleSignUp = async(e) => {
   
    e.preventDefault();
    // التحقق من صحة البريد الإلكتروني
    // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // if (!emailRegex.test(email)) {
    //   setError('Invalid email address');
    //   return;
    // }

    // التحقق من قوة كلمة المرور
    if (password.length < 6) {
      setError(' كلمة السر يجب ان تكون اكثر من 6 ارقام او احرف');
      return;
    }

    // if (!/[a-z]/.test(password) || !/[A-Z]/.test(password) || !/[0-9]/.test(password) || !/[@#$%^&*]/.test(password)) {
    //   setError('Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character');
    //   return;
    // }

    // التحقق من تطابق كلمتي المرور
    if (password !== confirmPassword ) {
      setError('كلمه السر غير متطابقه');
      return;
    }
    if (!email ||!code ) {
        setError('تاكد من ادخال الاسم والكود');
        return;
      }
    setloading("جاري انشاء الحساب")
    // إرسال بيانات التسجيل إلى الخادم
    try{
        const response = await fetch('https://api-order-form.vercel.app/user', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password ,code}),
          })
          if (!response.ok) {
            setloading("تأكيد انشاء الحساب ")
            throw new Error('Failed to sign up');
          }
    // إعادة تعيين الحقول بعد التسجيل
    setEmail('');
    setcode('');
    setPassword('');
    setConfirmPassword('');
    setError('');
    setloading("تم انشاء الحساب ")
    alert('تم انشاء حسابك بنجاح')
    }catch(err){
        console.error(err.message);
        setloading("تأكيد انشاء الحساب ")

        setError('An error occurred. Please try again later.');

    }


  };

  return (
    // <div className="min-h-screen bg-gray-100 flex justify-center items-center">
      <div className="bg-white p-8 rounded shadow-md w-80 ml-[10%] lg:ml-[20%] ">
        <h2 className="text-2xl font-bold mb-4 text-center">انشاء حساب </h2>
        <input
        required
          type="text"
          placeholder="اسم المستخدم"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded mb-4"
        />
        <input
        required
          type="password"
          placeholder="كلمه السر"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded mb-4"
        />
        <input
        required
          type="password"
          placeholder="تاكيد كلمة السر "
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded mb-4"
        />
          <input
          required
          type="number"
          placeholder="الكود"
          value={code}
          onChange={(e) => setcode(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded mb-4"
        />
        <button
          onClick={handleSignUp}
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
           {loading}
        </button>
        <button
          onClick={()=>{
            onSignin()
          }}
          className="w-full mt-2 bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          تسجيل الدخول
        </button>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>
    // </div>
  );
};

export default SignUpComponent;
