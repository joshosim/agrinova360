import { useRoute } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const ViewInventory = () => {
  const route = useRoute();
  const { item } = route.params as { item: any };
  return (
    <View>
      <Text>ViewInventory</Text>
      <Text>{item?.name}</Text>
      <Text>{item?.quantity}</Text>
      <Text>{item?.unit}</Text>
    </View>
  )
}

export default ViewInventory

const styles = StyleSheet.create({})