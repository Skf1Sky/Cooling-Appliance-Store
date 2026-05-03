import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList, Alert, ActivityIndicator, Modal, ScrollView, RefreshControl, Image } from 'react-native';
import { supabase } from '../lib/supabase';
import { Package, Tag, Info, Plus, Edit2, Trash2, X, Check, Search } from 'lucide-react-native';

// Simple slugify for React Native
const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, 'd')
    .replace(/([^0-9a-z-\s])/g, '')
    .replace(/(\s+)/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
};

export default function ProductScreen() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal state
  const [modalVisible, setModalVisible] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    category_id: '1',
    brand: '',
    image_url: ''
  });

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      Alert.alert('Lỗi', 'Không thể tải danh sách sản phẩm');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchProducts();
  };

  const handleOpenCreate = () => {
    setEditId(null);
    setFormData({
      name: '',
      price: '',
      description: '',
      category_id: '1',
      brand: '',
      image_url: ''
    });
    setModalVisible(true);
  };

  const handleOpenEdit = (item) => {
    setEditId(item.id);
    setFormData({
      name: item.name,
      price: item.price.toString(),
      description: item.description || '',
      category_id: item.category_id.toString(),
      brand: item.brand || '',
      image_url: item.image_url || ''
    });
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!formData.name || !formData.price) {
      Alert.alert('Lỗi', 'Vui lòng nhập tên và giá sản phẩm');
      return;
    }

    try {
      setLoading(true);
      const payload = {
        name: formData.name,
        slug: slugify(formData.name) + "-" + Math.random().toString(36).substring(2, 6),
        brand: formData.brand || 'Khác',
        price: parseInt(formData.price),
        description: formData.description,
        category_id: parseInt(formData.category_id),
        image_url: formData.image_url,
        condition: 'new'
      };

      if (editId) {
        // Update
        const { error } = await supabase.from('products').update({
          name: payload.name,
          brand: payload.brand,
          price: payload.price,
          description: payload.description,
          category_id: payload.category_id,
          image_url: payload.image_url
        }).eq('id', editId);
        
        if (error) throw error;
        Alert.alert('Thành công', 'Đã cập nhật sản phẩm');
      } else {
        // Create
        const { error } = await supabase.from('products').insert([payload]);
        if (error) throw error;
        Alert.alert('Thành công', 'Đã thêm sản phẩm mới');
      }
      setModalVisible(false);
      fetchProducts();
    } catch (error) {
      console.error('Error saving product:', error);
      Alert.alert('Lỗi', 'Không thể lưu sản phẩm');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id) => {
    Alert.alert(
      'Xác nhận xóa',
      'Xóa sản phẩm này khỏi kho hàng?',
      [
        { text: 'Hủy', style: 'cancel' },
        { 
          text: 'Xóa', 
          style: 'destructive',
          onPress: async () => {
            try {
              const { error } = await supabase.from('products').delete().eq('id', id);
              if (error) throw error;
              fetchProducts();
            } catch (error) {
              Alert.alert('Lỗi', 'Không thể xóa sản phẩm');
            }
          }
        }
      ]
    );
  };

  const filteredProducts = products.filter(p => 
    p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.brand?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardRow}>
        {item.image_url ? (
          <Image source={{ uri: item.image_url }} style={styles.productImage} />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Package size={24} color="#999" />
          </View>
        )}
        <View style={styles.productInfo}>
          <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
          <Text style={styles.productBrand}>{item.brand || 'No Brand'}</Text>
          <Text style={styles.productPrice}>
            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}
          </Text>
        </View>
        <View style={styles.actions}>
          <TouchableOpacity onPress={() => handleOpenEdit(item)} style={styles.actionBtn}>
            <Edit2 size={18} color="#0066cc" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.actionBtn}>
            <Trash2 size={18} color="#d93025" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Search size={20} color="#999" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm sản phẩm, thương hiệu..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {loading && !refreshing && products.length === 0 ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#0066cc" />
        </View>
      ) : (
        <FlatList
          data={filteredProducts}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#0066cc']} />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Chưa có sản phẩm nào trong kho</Text>
            </View>
          }
        />
      )}

      <TouchableOpacity style={styles.fab} onPress={handleOpenCreate}>
        <Plus size={24} color="#fff" />
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{editId ? 'Sửa Sản Phẩm' : 'Thêm Sản Phẩm'}</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <X size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalForm}>
              <Text style={styles.label}>Tên sản phẩm *</Text>
              <TextInput
                style={styles.input}
                value={formData.name}
                onChangeText={(text) => setFormData({...formData, name: text})}
                placeholder="VD: Máy lạnh Daikin 1.5HP"
              />

              <Text style={styles.label}>Thương hiệu *</Text>
              <TextInput
                style={styles.input}
                value={formData.brand}
                onChangeText={(text) => setFormData({...formData, brand: text})}
                placeholder="VD: Daikin, LG, Samsung..."
              />

              <Text style={styles.label}>Giá bán (VNĐ) *</Text>
              <TextInput
                style={styles.input}
                value={formData.price}
                onChangeText={(text) => setFormData({...formData, price: text})}
                placeholder="VD: 12000000"
                keyboardType="numeric"
              />

              <Text style={styles.label}>Danh mục *</Text>
              <View style={styles.categoryPicker}>
                <TouchableOpacity 
                  style={[styles.catOption, formData.category_id === '1' && styles.catOptionActive]}
                  onPress={() => setFormData({...formData, category_id: '1'})}
                >
                  <Text style={[styles.catText, formData.category_id === '1' && styles.catTextActive]}>Máy Lạnh</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.catOption, formData.category_id === '2' && styles.catOptionActive]}
                  onPress={() => setFormData({...formData, category_id: '2'})}
                >
                  <Text style={[styles.catText, formData.category_id === '2' && styles.catTextActive]}>Máy Giặt</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.catOption, formData.category_id === '3' && styles.catOptionActive]}
                  onPress={() => setFormData({...formData, category_id: '3'})}
                >
                  <Text style={[styles.catText, formData.category_id === '3' && styles.catTextActive]}>Tủ Lạnh</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.label}>Link ảnh sản phẩm</Text>
              <TextInput
                style={styles.input}
                value={formData.image_url}
                onChangeText={(text) => setFormData({...formData, image_url: text})}
                placeholder="https://..."
              />

              <Text style={styles.label}>Mô tả</Text>
              <TextInput
                style={[styles.input, { height: 100 }]}
                value={formData.description}
                onChangeText={(text) => setFormData({...formData, description: text})}
                placeholder="Thông tin chi tiết sản phẩm..."
                multiline
              />

              <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Check size={20} color="#fff" style={{marginRight: 8}} />
                <Text style={styles.saveButtonText}>LƯU SẢN PHẨM</Text>
              </TouchableOpacity>
              <View style={{height: 40}} />
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: 15,
    paddingHorizontal: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#eee',
    height: 50,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
  },
  listContent: {
    paddingHorizontal: 15,
    paddingBottom: 100,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  productImage: {
    width: 70,
    height: 70,
    borderRadius: 10,
    backgroundColor: '#f0f0f0',
  },
  imagePlaceholder: {
    width: 70,
    height: 70,
    borderRadius: 10,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  productInfo: {
    flex: 1,
    marginLeft: 15,
  },
  productName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
  },
  productBrand: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  productPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0066cc',
    marginTop: 4,
  },
  actions: {
    flexDirection: 'column',
    gap: 15,
    marginLeft: 10,
  },
  actionBtn: {
    padding: 5,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    color: '#999',
    fontSize: 14,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#0066cc',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    height: '85%',
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'between',
    alignItems: 'center',
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  modalForm: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#444',
    marginBottom: 8,
    marginTop: 15,
  },
  input: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 12,
    fontSize: 15,
    color: '#333',
  },
  categoryPicker: {
    flexDirection: 'row',
    gap: 8,
  },
  catOption: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  catOptionActive: {
    backgroundColor: '#e6f0ff',
    borderColor: '#0066cc',
  },
  catText: {
    fontSize: 12,
    color: '#666',
  },
  catTextActive: {
    color: '#0066cc',
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: '#0066cc',
    flexDirection: 'row',
    height: 55,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
