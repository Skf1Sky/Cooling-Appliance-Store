import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { supabase } from '../lib/supabase';
import { Package, Tag, Info, Image as ImageIcon, Save } from 'lucide-react-native';

export default function ProductScreen() {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAddProduct = async () => {
    if (!name || !price) {
      Alert.alert('Lỗi', 'Vui lòng nhập tên và giá sản phẩm');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('products')
        .insert([
          { 
            name, 
            price: parseInt(price), 
            description, 
            category_id: parseInt(category) || 1,
            condition: 'new',
            created_at: new Date()
          }
        ]);

      if (error) throw error;

      Alert.alert('Thành công', 'Đã thêm sản phẩm mới');
      setName('');
      setPrice('');
      setDescription('');
      setCategory('');
    } catch (error) {
      console.error('Error adding product:', error);
      Alert.alert('Lỗi', 'Không thể thêm sản phẩm. Vui lòng kiểm tra lại bảng products trên Supabase.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Thêm Sản Phẩm Mới</Text>
        <Text style={styles.subtitle}>Nhập thông tin sản phẩm vào kho hàng</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Tên sản phẩm</Text>
          <View style={styles.inputWrapper}>
            <Package size={20} color="#0066cc" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="VD: Máy lạnh Daikin 1.5HP"
              value={name}
              onChangeText={setName}
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Giá bán (VNĐ)</Text>
          <View style={styles.inputWrapper}>
            <Tag size={20} color="#0066cc" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="VD: 12000000"
              value={price}
              onChangeText={setPrice}
              keyboardType="numeric"
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Mô tả</Text>
          <View style={[styles.inputWrapper, { alignItems: 'flex-start', paddingTop: 10 }]}>
            <Info size={20} color="#0066cc" style={[styles.inputIcon, { marginTop: 5 }]} />
            <TextInput
              style={[styles.input, { height: 100 }]}
              placeholder="Mô tả chi tiết sản phẩm..."
              value={description}
              onChangeText={setDescription}
              multiline
            />
          </View>
        </View>

        <TouchableOpacity 
          style={styles.saveButton} 
          onPress={handleAddProduct}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Save size={20} color="#fff" style={{ marginRight: 10 }} />
              <Text style={styles.saveButtonText}>LƯU SẢN PHẨM</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 25,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  form: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#444',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    paddingHorizontal: 15,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 15,
    color: '#333',
  },
  saveButton: {
    backgroundColor: '#0066cc',
    flexDirection: 'row',
    height: 55,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    shadowColor: '#0066cc',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});
