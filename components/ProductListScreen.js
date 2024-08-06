import React, { useEffect } from 'react';
import { View, Text, FlatList, Image, StyleSheet, RefreshControl, TouchableOpacity, Dimensions } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { setProducts, setRefreshing } from './store';

const ProductListScreen = () => {
  const products = useSelector((state) => state.products.data);
  const refreshing = useSelector((state) => state.products.refreshing);
  const dispatch = useDispatch();
  const baseUrl = 'https://warung.rezweb.my.id/api/produk';
  const baseImageUrl = 'https://warung.rezweb.my.id/storage/';
  const screenWidth = Dimensions.get('window').width;
  const navigation = useNavigation();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(baseUrl);
      dispatch(setProducts(response.data.data.data));
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const onRefresh = async () => {
    dispatch(setRefreshing(true));
    await fetchProducts();
    dispatch(setRefreshing(false));
  };
  const formatRupiah = (nominal) => {
    return `Rp ${nominal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;
  };

  const renderProductItem = ({ item }) => (
    <TouchableOpacity 
      style={[styles.productContainer, { width: screenWidth / 2 - 15 }]}
      onPress={() => navigation.navigate('ProductDetail', { productId: item.id })}
    >
      <Image source={{ uri: baseImageUrl + item.gambar }} style={styles.productImage} />
      <Text style={styles.productName}>{item.nama}</Text>
      <Text style={styles.productPrice}>{formatRupiah(item.nominal)}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
        <Text style={styles.head}>Daftar Produk</Text>
      <FlatList
        data={products}
        renderItem={renderProductItem}
        keyExtractor={item => item.id.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    paddingTop: 10,
  },
  listContent: {
    paddingBottom: 50,
    padding: 5,
  },
  row: {
    flex: 1,
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  productContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 2,
    marginBottom: 10,
    marginLeft: 5,
    marginRight: 5,
  },
  productImage: {
    width: 100,
    height: 100,
    marginBottom: 10,
    borderRadius: 5,
  },
  productName: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  productPrice: {
    fontSize: 14,
    color: '#888',
    marginTop: 5,
  },
  head: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    padding: 10
  },
});

export default ProductListScreen;
