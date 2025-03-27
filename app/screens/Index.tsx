import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';

const Index = ({ navigation }: any) => {
  const { t, i18n } = useTranslation(); // Get translation function and i18n instance
  const [language, setLanguage] = useState('en'); // Default language is 'en'

  const changeLanguage = () => {
    const newLanguage = language === 'en' ? 'bn' : 'en'; // Toggle between English and Bengali
    i18n.changeLanguage(newLanguage);
    setLanguage(newLanguage);  // Update the state to reflect the new language
  };

  return (
    <View style={styles.container}>
      <Image source={require('../../assets/images/topoban.png')} style={styles.logo} />
      <Text style={styles.welcomeText}>{t('welcome')}</Text>
      <Text style={styles.subText}>{t('subText')}</Text>
      <Text style={styles.title}>{t('title')}</Text>
      
      <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.loginButton}>
        <Text style={styles.loginText}>{t('login')}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Register')} style={styles.registerButton}>
        <Text style={styles.registerText}>{t('register')}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={changeLanguage}>
        <Text style={styles.languageToggle}>{t('languageToggle')}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4D2600',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  welcomeText: {
    color: '#E8D3B5',
    fontSize: 18,
  },
  subText: {
    color: '#E8D3B5',
    fontSize: 16,
    marginBottom: 10,
  },
  title: {
    color: '#FFD700',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  loginButton: {
    backgroundColor: '#E8D3B5',
    borderWidth: 2,
    paddingVertical: 10,
    paddingHorizontal: 50,
    borderRadius: 50,
    marginBottom: 15,
  },
  loginText: {
    fontSize: 18,
    color: '#4D2600',
    alignItems: 'center',
    fontWeight: 'bold',
  },
  registerButton: {
    borderColor: '#E8D3B5',
    borderWidth: 2,
    paddingVertical: 10,
    paddingHorizontal: 50,
    borderRadius: 25,
  },
  registerText: {
    fontSize: 18,
    color: '#E8D3B5',
    fontWeight: 'bold',
  },
  languageToggle: {
    color: '#E8D3B5',
    fontSize: 16,
    marginTop: 30,
  },
});

export default Index;
