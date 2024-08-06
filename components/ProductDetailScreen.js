import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator, ScrollView, TouchableOpacity, Linking, Alert, RefreshControl } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const ProductDetailScreen = ({ route }) => {
  const { productId } = route.params;
  const navigation = useNavigation();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const baseUrl = 'https://warung.rezweb.my.id/api/produk';
  const baseImageUrl = 'https://warung.rezweb.my.id/storage/';

  useEffect(() => {
    fetchProductDetail();
  }, []);

  const fetchProductDetail = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${baseUrl}/${productId}`);
      setProduct(response.data.data);
    } catch (error) {
      console.error('Error fetching product detail:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchProductDetail();
  };

  const formatRupiah = (nominal) => {
    return `Rp ${nominal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;
  };

  const handleBuyNow = () => {
    const phoneNumber = '628123456789';
    const message = `Halo, saya tertarik untuk membeli produk "${product.nama}" dengan harga Rp ${product.nominal}. Apakah produk ini masih tersedia?`;
    const url = `whatsapp://send?text=${encodeURIComponent(message)}&phone=${phoneNumber}`;

    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          Linking.openURL(url);
        } else {
          Alert.alert('Error', 'Tidak dapat membuka WhatsApp');
        }
      })
      .catch((err) => console.error('Error opening WhatsApp:', err));
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={styles.scrollViewContainer}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      }
    >
      <View style={styles.container}>
        <Image source={{ uri: baseImageUrl + product.gambar }} style={styles.headerImage} />
        <View style={styles.productInfoContainer}>
          <Text style={styles.productName}>{product.nama}</Text>
          <Text style={styles.productPrice}>{formatRupiah(product.nominal)}</Text>
          <Text style={styles.productDescription}>{product.deskripsi}</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.whatsappButton} onPress={handleBuyNow}>
              <Text style={styles.buttonText}>WhatsApp</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollViewContainer: {
    flexGrow: 1,
    backgroundColor: '#f8f8f8',
    alignItems: 'center',
    padding: 10,
  },
  container: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
    marginBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerImage: {
    width: '100%',
    height: 250,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  productInfoContainer: {
    padding: 20,
  },
  productName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  productPrice: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#e91e63',
    marginBottom: 10,
  },
  productDescription: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  whatsappButton: {
    backgroundColor: '#25D366',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  buttonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default ProductDetailScreen;
