import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, UIManager, findNodeHandle, Alert } from 'react-native';
import { Ionicons, MaterialIcons, Entypo } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import BASE_URL from "../../config";
import { useTranslation } from 'react-i18next';

const AllDevoteesScreen = ({ navigation }: any) => {
  const [devotees, setDevotees] = useState([]);
  const [error, setError] = useState(null);
  const { t } = useTranslation();
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ x: 0, y: 0 });
  const [selectedDevoteeId, setSelectedDevoteeId] = useState<number | null>(null);
  const actionButtonRefs = useRef<Record<number, any>>({});

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
        console.log(arrayData)
        setDevotees(arrayData || []);
      } catch (error) {
        setError("Failed to load Devotees");
      }
    };

    fetchDevotees();
  }, []);

  const toggleDropdown = (id: number) => {
    const ref = actionButtonRefs.current[id];

    if (!ref) return;

    if (dropdownVisible && selectedDevoteeId === id) {
      setDropdownVisible(false);
      setSelectedDevoteeId(null);
      return;
    }

    UIManager.measure(findNodeHandle(ref), (x, y, width, height, pageX, pageY) => {
      setDropdownPosition({ x: pageX, y: pageY - height });
      setSelectedDevoteeId(id);
      setDropdownVisible(true);
    });
  };

  const renderStatusBadge = (approved: boolean) => {
    return (
      <View style={[styles.statusBadge, { backgroundColor: approved ? '#4CAF50' : '#FFC107' }]} >
        <Text style={styles.statusText}>{approved ? 'Active' : 'Inactive'}</Text>
      </View>
    );
  };

  const handleDevoteeViewDetails = (id) => {
    navigation.navigate('DevoteeDetail', { id: id });
  };

  const handleDeleteDevotee = async (id: number) => {
        try {
          const token = await AsyncStorage.getItem("@auth_token");
          if (!token) {
            console.error("No token found");
            return;
          }

          // Correct API endpoint for deleting devotee
          const response = await axios.delete(`${BASE_URL}/delete_devotee/${id}`, {
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          });

          // Check API response
          console.log("Delete response:", response.data);

          // Update local state after deletion
          setDevotees((prevDevotees) => prevDevotees.filter(devotee => devotee.id !== id));
          setDropdownVisible(false);
          setSelectedDevoteeId(null);

          // Optionally, show a success alert
          Alert.alert("Success", "Devotee deleted successfully.");
        } catch (error) {
          console.error("Error deleting devotee:", error);
          setError("Failed to delete Devotee");
          Alert.alert("Error", "Failed to delete devotee. Please try again.");
        }
  }
const handleEditDevotee = (id: number) => {
  navigation.navigate('EditDevotee', { id });
};
  const renderItem = ({ item }: any) => (
    <View style={styles.row}>
      <View style={styles.cell}><Text>{item.name}</Text></View>
      <View style={styles.cell}><Text>{item.relation}</Text></View>
      <View style={styles.cell}>{renderStatusBadge(item.approved)}</View>
      <View style={styles.cell}>
        <TouchableOpacity
          ref={(ref) => (actionButtonRefs.current[item.id] = ref)}
          onPress={() => toggleDropdown(item.id)}
          style={styles.actionButton}
        >
          <Text style={styles.actionText}>Action</Text>
          <Entypo name="chevron-down" size={16} color="#4D2600" />
        </TouchableOpacity>
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
        {['Name', 'Relation', 'Status', 'Action'].map((header, index) => (
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

      {dropdownVisible && (
        <View style={[styles.dropdown, { top: dropdownPosition.y, left: dropdownPosition.x }]}>
          <TouchableOpacity style={styles.option} onPress={() => handleDevoteeViewDetails(selectedDevoteeId!)}>
            <Ionicons name="eye" size={18} color="#4D2600" style={styles.icon} />
            <Text style={styles.optionText}>View</Text>
          </TouchableOpacity>
          <TouchableOpacity
  style={styles.option}
  onPress={() => handleEditDevotee(selectedDevoteeId!)}  // Pass only the id here
>
  <MaterialIcons name="edit" size={18} color="#4D2600" style={styles.icon} />
  <Text style={styles.optionText}>Edit</Text>
</TouchableOpacity>
          <TouchableOpacity style={styles.option} onPress={() => handleDeleteDevotee(selectedDevoteeId!)}>
            <MaterialIcons name="delete-outline" size={18} color="#4D2600" style={styles.icon} />
            <Text style={styles.optionText}>Delete</Text>
          </TouchableOpacity>
        </View>
      )}
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
    backgroundColor: '#D5C295',
    borderRadius: 10,
    padding: 10,
    zIndex: 1000,
    elevation: 10,
    width: 180,
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
