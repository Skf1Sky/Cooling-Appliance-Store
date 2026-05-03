import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, TextInput, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { supabase } from '../lib/supabase';
import { Search, Plus, User, Phone, Package, Calendar } from 'lucide-react-native';

export default function WarrantyScreen() {
  const [warranties, setWarranties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

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
        <Text style={styles.infoText}>{item.product_name} ({item.serial_number})</Text>
      </View>

      <View style={styles.infoRow}>
        <Calendar size={14} color="#666" style={styles.rowIcon} />
        <Text style={styles.infoText}>Hết hạn: {new Date(item.warranty_end_date).toLocaleDateString('vi-VN')}</Text>
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

      {loading && !refreshing ? (
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

      <TouchableOpacity style={styles.fab}>
        <Plus size={24} color="#fff" />
      </TouchableOpacity>
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
});
