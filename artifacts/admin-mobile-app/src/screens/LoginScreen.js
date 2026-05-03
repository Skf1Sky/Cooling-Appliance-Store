import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';

export default function LoginScreen({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    if (!username || !password) {
      Alert.alert('Lỗi', 'Vui lòng nhập tài khoản và mật khẩu');
      return;
    }

    setLoading(true);
    // Simple hardcoded check for admin (same as web)
    setTimeout(() => {
      if (username === 'admin' && password === 'admin123') {
        onLoginSuccess();
      } else {
        Alert.alert('Lỗi', 'Tài khoản hoặc mật khẩu không chính xác');
      }
      setLoading(false);
    }, 800);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>ĐIỆN LẠNH</Text>
        <Text style={styles.subtitle}>MINH HOÀNG</Text>
        <Text style={styles.adminLabel}>ADMIN APP</Text>
      </View>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Tên đăng nhập"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Mật khẩu"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        
        <TouchableOpacity 
          style={styles.button} 
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>ĐĂNG NHẬP</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 30,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 50,
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: '#0066cc',
  },
  subtitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
  },
  adminLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#666',
    letterSpacing: 2,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 5,
  },
  form: {
    width: '100%',
  },
  input: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#eee',
  },
  button: {
    backgroundColor: '#0066cc',
    padding: 18,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#0066cc',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});
