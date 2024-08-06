import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator, ScrollView, TouchableOpacity, Linking, Alert, RefreshControl } from 'react-native';
import axios from 'axios';

const ProductDetailScreen = ({ route }) => {
  const { productId } = route.params;
  
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
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    padding: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  productImage: {
    width: 300,
    height: 200,
    marginBottom: 20,
    borderRadius: 10,
  },
  productName: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  productPrice: {
    fontSize: 20,
    color: '#888',
    textAlign: 'center',
    marginBottom: 10,
  },
  productDescription: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 10,
  },
  head: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    padding: 13
  },
});

export default ProductDetailScreen;
