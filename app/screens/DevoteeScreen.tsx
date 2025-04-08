import React, { useState,useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Modal } from 'react-native';
import { Ionicons, MaterialIcons, Entypo } from '@expo/vector-icons';
import { Card, Avatar } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import BASE_URL from "../../config";
import { useTranslation } from 'react-i18next';
// const devotees = [
//   { id: 1, name: 'D', relation: 'father', status: 'De-active' },
//   { id: 2, name: 'ANTAR NANDI', relation: 'himself', status: 'Active' },
//   { id: 3, name: 'Y', relation: 'mother', status: 'Active' },
//   { id: 4, name: 'X Talukder', relation: 'father', status: 'Active' },
// ];


const AllDevoteesScreen = ({ navigation }: any) => {
      const [devotees, setDevotees] = useState([]);
        const [error, setError] = useState(null);
      const { t, i18n } = useTranslation();
  const [dropdownVisible, setDropdownVisible] = useState<number | null>(null);

  const toggleDropdown = (id: number) => {
    setDropdownVisible(dropdownVisible === id ? null : id);
  };

   useEffect(() => {
      const fetchDevotees = async () => {
        try {
          const token = await AsyncStorage.getItem("@auth_token");
          if (!token) {
            console.error("No token found");
            return;
          }
  
          const response = await axios.get(`${BASE_URL}/get_devotees`, {
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          });
          const arrayData = Object.values(response.data.devotees);
          setDevotees(arrayData || []); 
        } catch (error) {
          setError("Failed to load Devotees");
        }
      };
  
      fetchDevotees();
    }, []);

  const renderStatusBadge = (status: string) => {
    const isActive = status ;
    return (
      <View style={[styles.statusBadge, { backgroundColor: isActive ? '#4CAF50' : '#FFC107' }]}>
        <Text style={styles.statusText}>{status? "Active" : "Inactive"}</Text>
      </View>
    );
  };

  const renderItem = ({ item }: any) => (
    <View style={styles.row}>
      <View style={styles.cell}><Text>{item.name}</Text></View>
      <View style={styles.cell}><Text>{item.relation}</Text></View>
      <View style={styles.cell}>{renderStatusBadge(item.approved)}</View>
      <View style={styles.cell}>
        <TouchableOpacity onPress={() => toggleDropdown(item.id)} style={styles.actionButton}>
          <Text style={styles.actionText}>Action</Text>
          <Entypo name="chevron-down" size={16} color="#4D2600" />
        </TouchableOpacity>
        {dropdownVisible === item.id && (
          <View style={styles.dropdown}>
            <TouchableOpacity style={styles.option}>
              <Ionicons name="eye" size={18} color="#4D2600" style={styles.icon} />
              <Text style={styles.optionText}>Description</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.option}>
              <MaterialIcons name="edit" size={18} color="#4D2600" style={styles.icon} />
              <Text style={styles.optionText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.option}>
              <MaterialIcons name="delete-outline" size={18} color="#4D2600" style={styles.icon} />
              <Text style={styles.optionText}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>All Devotees</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('MemberRegistration')}>
        
          <Text style={styles.addButtonText}>{t('devotee_registration')}</Text>
        
      </TouchableOpacity>
      </View>

      <View style={styles.tableHeader}>
        {[ 'Name', 'Relation', 'Status', 'Action'].map((header, index) => (
          <View style={styles.cell} key={index}>
            <Text style={styles.headerText}>{header}</Text>
          </View>
        ))}
      </View>

      <FlatList
        data={devotees}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
     addButton: {
    backgroundColor: '#B71C1C',
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: 'black',
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    backgroundColor: '#D5C295',
    padding: 20,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#4D2600',
  },

  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f8e6b2',
    paddingVertical: 8,
    marginBottom: 5,
  },
  row: {
    flexDirection: 'row',
    backgroundColor: '#fce7a3',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0c488',
  },
  cell: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
  headerText: {
    fontWeight: 'bold',
    color: '#6b4e2d',
  },
  statusBadge: {
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  statusText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  actionButton: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#4D2600',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    backgroundColor: '#f9e6c8',
    alignItems: 'center',
  },
  actionText: {
    marginRight: 5,
    color: '#4D2600',
  },
  dropdown: {
    position: 'absolute',
    top: 40,
    left: 0,
    backgroundColor: '#D5C295',
    borderRadius: 10,
    padding: 10,
    zIndex: 999,
    elevation: 5,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
  },
  optionText: {
    fontSize: 14,
    color: '#4D2600',
  },
  icon: {
    marginRight: 8,
  },
});

export default AllDevoteesScreen;
