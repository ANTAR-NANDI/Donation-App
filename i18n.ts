// i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Translation resources for different languages
const resources = {
  en: {
    translation: {
        // Main Page
      welcome: "Welcome To",
      subText: "Central Tapoban Ashram",
      title: "Registration App",
      login: "Log In",
      register: "Register",
      languageToggle: "🌐 Eng/বাংলা",

       // Sign in Page
       phone:"Phone Number",
       phone_placeholder:"Enter Phone Number",
       password:"Password",
       password_placeholder:"Enter Password",
       forget_password:"Forget Password ?",
       // Register Page
      register_form : "Registration Form",
      name : "Name",
      name_placeholder : "Enter Your Name",
      email : "Email",
      email_placeholder : "Enter Your Email",
      confirm_password: "Confirm Password",
      confirm_password_placeholder : "Re-Enter Password",
      back : "Back",
      // Forget Password Page
       forget_password_form : "Forget Password",
      forget_password_heading : "We will send an OTP to your device",
      send_otp : "Sent OTP",
      // Reset Password Page
      reset_password_heading:"Enter the OTP to reset your password",
      enter_otp:"Enter the OTP",
      resend_otp_in:"Resend OTP in",
      resend_otp:"Resend OTP",
      reset_password:"Reset Password"
    }
  },
  bn: {
    translation: {
    // Main Page  
        welcome: "স্বাগতম",
        subText: "কেন্দ্রীয় তপোবন আশ্রম",
        title: "রেজিস্ট্রেশন অ্যাপ",
        login: "লগ ইন",
        register: "রেজিস্টার",
        languageToggle: "🌐 Eng/বাংলা",
    // Sign in Page
        phone:"ফোন নম্বর",
        phone_placeholder:"ফোন নম্বর দিন",
        password:"পাসওয়ার্ড ",
        password_placeholder:"পাসওয়ার্ড দিন",
        forget_password:"পাসওয়ার্ড ভুলে গেছেন ?",
    // Register Page
       register_form: "নিবন্ধন ফর্ম",
        name: "নাম",
        name_placeholder: "আপনার নাম লিখুন",
        email: "ইমেইল",
        email_placeholder: "আপনার ইমেইল লিখুন",
        confirm_password: "পাসওয়ার্ড নিশ্চিত করুন",
        confirm_password_placeholder: "পাসওয়ার্ড আবার লিখুন",
        back: "পিছনে",
    // Forget Password Page
        forget_password_form: "পাসওয়ার্ড ভুলে গেছেন",
        forget_password_heading: "আমরা আপনার ডিভাইসে একটি OTP পাঠাবো",
        send_otp: "OTP পাঠান",
    // Reset Password Page
        reset_password_heading: "আপনার পাসওয়ার্ড রিসেট করতে OTP দিন",
        enter_otp: "OTP দিন",
        resend_otp_in: "OTP পুনরায় পাঠানো হবে",
        resend_otp: "OTP পুনরায় পাঠান",
        reset_password: "পাসওয়ার্ড রিসেট করুন"
        
    }
  }
};

i18n
  .use(initReactI18next) // Integrate with React
  .init({
    resources,
    lng: 'en', // Default language
    fallbackLng: 'en', // Language fallback
    interpolation: {
      escapeValue: false, // Not needed for React
    },
    react: {
      useSuspense: false, // Set to false for non-suspense usage
    },
  });

export default i18n;
