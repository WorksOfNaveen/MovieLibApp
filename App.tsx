import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { ActivityIndicator, StatusBar, StyleSheet, View } from 'react-native';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import ErrorBoundary from './components/ErrorBoundary';
import RootTabs from './navigation/RootTabs';
import { persistor, store } from './Store/store';
import { colors } from './theme/colors';
import { SafeAreaProvider } from 'react-native-safe-area-context';

function App() {
  return (
    <Provider store={store}>
      <PersistGate
        loading={
          <View style={styles.boot}>
            <ActivityIndicator
              style={styles.spinner}
              size="large"
              color={colors.accent}
            />
          </View>
        }
        persistor={persistor}>
        <ErrorBoundary>
          <SafeAreaProvider>
            <NavigationContainer>
              <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
              <RootTabs />
            </NavigationContainer>
          </SafeAreaProvider>
        </ErrorBoundary>
      </PersistGate>
    </Provider>
  );
}

export default App;

const styles = StyleSheet.create({
  boot: {
    flex: 1,
    backgroundColor: colors.background,
  },
  spinner: {
    flex: 1,
  },
});
