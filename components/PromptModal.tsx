import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type PromptType = {
  yes: () => void;
  no: () => void;
  message: string;
}

const PromptModal = ({ yes, no, message }: PromptType) => {
  return (
    <View style={styles.container}>
      <Text>{message}</Text>
      <View style={styles.buttonLayout}>
        <Pressable style={[styles.button, { backgroundColor: 'red' }]} onPress={yes}>
          <Text>Yes</Text>
        </Pressable>
        <Pressable style={[styles.button, { backgroundColor: 'green' }]} onPress={no}>
          <Text>No</Text>
        </Pressable>
      </View>
    </View>
  )
}

export default PromptModal

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    position: 'absolute',
    top: '50%',
    left: '15%',
    borderRadius: 15,
    padding: 20
  },
  buttonLayout: {
    flexDirection: 'row',
    alignSelf: 'center',
    gap: 20,
    marginTop: 20
  },
  button: {
    paddingHorizontal: 15,
    paddingVertical: 7.5,
    borderRadius: 10
  }
})