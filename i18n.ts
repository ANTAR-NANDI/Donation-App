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
      reset_password:"Reset Password",
      // Dashboard Page
      dashboard_heading:"Welcome to Central Tapoban Ashram",
      devotee_registration:"Click here for Devotee Registration",
      // Chat
      loading_message:"Loading Messages ....",
      no_message:"No Messages Available",
      enter_message: "Type Your Message",
      send: "Send",
      // Donation Screen
      donation_form:"Donation Form",
      donation_amount:"Donation Amount",
      donation_amount_placeholder:"Enter Donation Amount",
      select_payment_method:"Select Payment Method",
      donate:"Donation",
      // Profile screen
      father_name_placeholder : "Enter Your Father's Name",
      mother_name_placeholder : "Enter Your Mother's Name",
       nid_placeholder : "Enter Your NID Number",
       occupation_placeholder : "Enter Your NID Number",
       nationality_placeholder : "Enter Your Nationality",
       dob_placeholder : "Enter Your Date of Birth",
       blood_placeholder : "Enter Your Blood Group",
       present_address_placeholder : "Enter Your Present Address",
       permanent_address_placeholder : "Enter Your Permanent Address",
       update_data:"Update Data",
       // Pronami Screen
       donar_name : "Donar Name",
       donar_name_placeholder : "Enter Donar Name",
       relationship : "Relationship",
       amount : "Amount",
       amount_placeholder : "Enter Amount",
       category : "Category",
       monthly_amount : "Monthly Amount",
       monthly_amount_placeholder : "Enter Monthly Amount",
       add:"Add",
        father_name:"Father's Name",
        mother_name:"Mother's Name",
         present_address:"Present Address",
        permanent_address:"Permanent Address",
        dob:"Date of Birth",  



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
        reset_password: "পাসওয়ার্ড রিসেট করুন",
        //dashboard page
        dashboard_heading: "সেন্ট্রাল তপোবন আশ্রমে স্বাগতম",
        devotee_registration: "ভক্ত নিবন্ধনের জন্য এখানে ক্লিক করুন",
        // Chat
        loading_message: "মেসেজ লোড হচ্ছে ....",
        no_message: "কোনো মেসেজ উপলব্ধ নেই",
        enter_message: "আপনার মেসেজ লিখুন",
        send: "পাঠান",
        // Donation Screen
        donation_form: "দানের ফর্ম",
        donation_amount: "দানের পরিমাণ",
        donation_amount_placeholder: "দান পরিমাণ লিখুন",
        select_payment_method: "পেমেন্ট পদ্ধতি নির্বাচন করুন",
        donate: "দান করুন",
        // Profile Screen
        father_name_placeholder: "আপনার পিতার নাম লিখুন",
        mother_name_placeholder: "আপনার মাতার নাম লিখুন",
        nid_placeholder: "আপনার NID নম্বর লিখুন",
        occupation_placeholder: "আপনার পেশা লিখুন",
        nationality_placeholder: "আপনার জাতীয়তা লিখুন",
        dob_placeholder: "আপনার জন্ম তারিখ লিখুন",
        blood_placeholder: "আপনার রক্তের গ্রুপ লিখুন",
        present_address_placeholder: "আপনার বর্তমান ঠিকানা লিখুন",
        permanent_address_placeholder: "আপনার স্থায়ী ঠিকানা লিখুন",
        update_data: "ডেটা আপডেট করুন",
        // Pronami Screen
      donar_name: "দাতার নাম",
        donar_name_placeholder: "দাতার নাম লিখুন",
        relationship: "সম্পর্ক",
        amount: "পরিমাণ",
        amount_placeholder: "পরিমাণ লিখুন",
        category: "বিভাগ",
        monthly_amount: "মাসিক পরিমাণ",
        monthly_amount_placeholder: "মাসিক পরিমাণ লিখুন",
        add: "যোগ করুন",
        //-------------
        father_name     : "পিতার নাম",
        mother_name     : "মাতার নাম",
        present_address     : "বর্তমান ঠিকানা",
        permanent_address     : "স্থায়ী ঠিকানা",
        dob     : "জন্ম তারিখ"

       


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
