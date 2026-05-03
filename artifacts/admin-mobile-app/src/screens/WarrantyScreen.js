import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, TextInput, TouchableOpacity, ActivityIndicator, RefreshControl, Modal, ScrollView, Alert } from 'react-native';
import { supabase } from '../lib/supabase';
import { Search, Plus, User, Phone, Package, Calendar, Edit2, Trash2, X, Check } from 'lucide-react-native';

export default function WarrantyScreen() {
  const [warranties, setWarranties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal state
  const [modalVisible, setModalVisible] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    customer_name: '',
    phone: '',
    product_name: '',
    serial_number: '',
    warranty_end_date: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
    status: 'active'
  });

  const fetchWarranties = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('warranties')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setWarranties(data || []);
    } catch (error) {
      console.error('Error fetching warranties:', error);
      Alert.alert('Lỗi', 'Không thể tải dữ liệu bảo hành');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchWarranties();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchWarranties();
  };

  const handleOpenCreate = () => {
    setEditId(null);
    setFormData({
      customer_name: '',
      phone: '',
      product_name: '',
      serial_number: '',
      warranty_end_date: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
      status: 'active'
    });
    setModalVisible(true);
  };

  const handleOpenEdit = (item) => {
    setEditId(item.id);
    setFormData({
      customer_name: item.customer_name,
      phone: item.phone,
      product_name: item.product_name,
      serial_number: item.serial_number || '',
      warranty_end_date: new Date(item.warranty_end_date).toISOString().split('T')[0],
      status: item.status
    });
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!formData.customer_name || !formData.phone || !formData.product_name) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ các trường bắt buộc');
      return;
    }

    try {
      setLoading(true);
      const payload = {
        ...formData,
        purchase_date: new Date().toISOString()
      };

      if (editId) {
        const { error } = await supabase.from('warranties').update(payload).eq('id', editId);
        if (error) throw error;
        Alert.alert('Thành công', 'Đã cập nhật hồ sơ bảo hành');
      } else {
        const { error } = await supabase.from('warranties').insert([payload]);
        if (error) throw error;
        Alert.alert('Thành công', 'Đã thêm hồ sơ bảo hành mới');
      }
      setModalVisible(false);
      fetchWarranties();
    } catch (error) {
      console.error('Error saving warranty:', error);
      Alert.alert('Lỗi', 'Không thể lưu hồ sơ');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id) => {
    Alert.alert(
      'Xác nhận xóa',
      'Bạn có chắc chắn muốn xóa hồ sơ này?',
      [
        { text: 'Hủy', style: 'cancel' },
        { 
          text: 'Xóa', 
          style: 'destructive',
          onPress: async () => {
            try {
              const { error } = await supabase.from('warranties').delete().eq('id', id);
              if (error) throw error;
              fetchWarranties();
            } catch (error) {
              Alert.alert('Lỗi', 'Không thể xóa hồ sơ');
            }
          }
        }
      ]
    );
  };

  const filteredWarranties = warranties.filter(item => 
    item.customer_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.phone?.includes(searchQuery) ||
    item.serial_number?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.iconContainer}>
          <User size={16} color="#0066cc" />
        </View>
        <Text style={styles.customerName}>{item.customer_name}</Text>
        <View style={[styles.statusBadge, { backgroundColor: item.status === 'active' ? '#e6f4ea' : '#fce8e6' }]}>
          <Text style={[styles.statusText, { color: item.status === 'active' ? '#1e8e3e' : '#d93025' }]}>
            {item.status === 'active' ? 'Còn hạn' : 'Hết hạn'}
          </Text>
        </View>
      </View>

      <View style={styles.infoRow}>
        <Phone size={14} color="#666" style={styles.rowIcon} />
        <Text style={styles.infoText}>{item.phone}</Text>
      </View>

      <View style={styles.infoRow}>
        <Package size={14} color="#666" style={styles.rowIcon} />
        <Text style={styles.infoText}>{item.product_name} {item.serial_number ? `(${item.serial_number})` : ''}</Text>
      </View>

      <View style={styles.infoRow}>
        <Calendar size={14} color="#666" style={styles.rowIcon} />
        <Text style={styles.infoText}>Hết hạn: {new Date(item.warranty_end_date).toLocaleDateString('vi-VN')}</Text>
      </View>

      <View style={styles.cardActions}>
        <TouchableOpacity style={styles.actionButton} onPress={() => handleOpenEdit(item)}>
          <Edit2 size={16} color="#0066cc" />
          <Text style={[styles.actionText, { color: '#0066cc' }]}>Sửa</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={() => handleDelete(item.id)}>
          <Trash2 size={16} color="#d93025" />
          <Text style={[styles.actionText, { color: '#d93025' }]}>Xóa</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Search size={20} color="#999" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm tên, SĐT, Serial..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {loading && !refreshing && warranties.length === 0 ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#0066cc" />
        </View>
      ) : (
        <FlatList
          data={filteredWarranties}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#0066cc']} />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Không tìm thấy hồ sơ bảo hành nào</Text>
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
              <Text style={styles.modalTitle}>{editId ? 'Sửa Bảo Hành' : 'Thêm Bảo Hành'}</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <X size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalForm}>
              <Text style={styles.label}>Tên khách hàng *</Text>
              <TextInput
                style={styles.input}
                value={formData.customer_name}
                onChangeText={(text) => setFormData({...formData, customer_name: text})}
                placeholder="Nhập tên khách hàng"
              />

              <Text style={styles.label}>Số điện thoại *</Text>
              <TextInput
                style={styles.input}
                value={formData.phone}
                onChangeText={(text) => setFormData({...formData, phone: text})}
                placeholder="Nhập số điện thoại"
                keyboardType="phone-pad"
              />

              <Text style={styles.label}>Tên sản phẩm *</Text>
              <TextInput
                style={styles.input}
                value={formData.product_name}
                onChangeText={(text) => setFormData({...formData, product_name: text})}
                placeholder="VD: Máy lạnh Daikin 1.5HP"
              />

              <Text style={styles.label}>Số Serial</Text>
              <TextInput
                style={styles.input}
                value={formData.serial_number}
                onChangeText={(text) => setFormData({...formData, serial_number: text})}
                placeholder="Nhập số serial (nếu có)"
              />

              <Text style={styles.label}>Ngày hết hạn (YYYY-MM-DD) *</Text>
              <TextInput
                style={styles.input}
                value={formData.warranty_end_date}
                onChangeText={(text) => setFormData({...formData, warranty_end_date: text})}
                placeholder="2025-12-31"
              />
              
              <Text style={styles.label}>Trạng thái</Text>
              <View style={styles.statusPicker}>
                <TouchableOpacity 
                  style={[styles.statusOption, formData.status === 'active' && styles.statusOptionActive]}
                  onPress={() => setFormData({...formData, status: 'active'})}
                >
                  <Text style={[styles.statusOptionText, formData.status === 'active' && styles.statusOptionTextActive]}>Còn hạn</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.statusOption, formData.status === 'expired' && styles.statusOptionExpired]}
                  onPress={() => setFormData({...formData, status: 'expired'})}
                >
                  <Text style={[styles.statusOptionText, formData.status === 'expired' && styles.statusOptionTextActive]}>Hết hạn</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Check size={20} color="#fff" style={{marginRight: 8}} />
                <Text style={styles.saveButtonText}>LƯU HỒ SƠ</Text>
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
    padding: 15,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    borderLeftWidth: 4,
    borderLeftColor: '#0066cc',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#e6f0ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  customerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  rowIcon: {
    marginRight: 8,
    width: 16,
  },
  infoText: {
    fontSize: 13,
    color: '#666',
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 20,
  },
  actionText: {
    fontSize: 13,
    fontWeight: 'bold',
    marginLeft: 5,
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
    shadowColor: '#0066cc',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
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
    marginBottom: 20,
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
  statusPicker: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 5,
  },
  statusOption: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  statusOptionActive: {
    backgroundColor: '#e6f4ea',
    borderColor: '#1e8e3e',
  },
  statusOptionExpired: {
    backgroundColor: '#fce8e6',
    borderColor: '#d93025',
  },
  statusOptionText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
  },
  statusOptionTextActive: {
    color: '#1e8e3e',
  },
  saveButton: {
    backgroundColor: '#0066cc',
    flexDirection: 'row',
    height: 55,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
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
  },
});
