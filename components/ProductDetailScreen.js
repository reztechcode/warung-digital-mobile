import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator } from 'react-native';
import axios from 'axios';

const ProductDetailScreen = ({ route }) => {
  const { productId } = route.params;
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const baseUrl = 'https://warung.rezweb.my.id/api/produk';
  const baseImageUrl = 'https://warung.rezweb.my.id/storage/';

  useEffect(() => {
    fetchProductDetail();
  }, []);

  const fetchProductDetail = async () => {
    try {
      const response = await axios.get(`${baseUrl}/${productId}`);
      setProduct(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching product detail:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.head}>Detail Produk</Text>
      <Text style={styles.productName}>{product.nama}</Text>
      <Image source={{ uri: baseImageUrl + product.gambar }} style={styles.productImage} />
      <Text style={styles.productPrice}>Rp {product.nominal}</Text>
      <Text style={styles.productDescription}>{product.deskripsi}</Text>
    </View>
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
