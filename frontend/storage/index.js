import * as SecureStore from 'expo-secure-store';

class SecureStorageManager {
  static instance = null;

  static getInstance() {
    if (SecureStorageManager.instance === null) {
      console.log('secure storage created');
      SecureStorageManager.instance = new SecureStorageManager();
    }
    return SecureStorageManager.instance;
  }

  async put(key, value) {
    try {
      await SecureStore.setItemAsync(key, value);
      console.log(`${key} successfully saved`);
    } catch (error) {
      console.log(`Error saving ${key}`, error);
    }
  }

  async get(key) {
    try {
      const value = await SecureStore.getItemAsync(key);
      console.log(`${key} retrieved successfully: ${value}`);
      return value;
    } catch (error) {
      console.log(`Error retrieving ${key}`, error);
      return null;
    }
  }

  async delete(key) {
    try {
      await SecureStore.deleteItemAsync(key);
      console.log(`${key} successfully removed`);
    } catch (error) {
      console.log(`Error removing ${key}`, error);
    }
  }
}

export default SecureStorageManager;
