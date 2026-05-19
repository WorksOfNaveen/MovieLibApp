import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DetailsScreen from '../Screens/DetailsScreen';
import FavoritesScreen from '../Screens/FavoritesScreen';
import { colors } from '../theme/colors';

export type FavoritesStackParamList = {
  FavoritesList: undefined;
  Details: { movieId: number };
};

const Stack = createNativeStackNavigator<FavoritesStackParamList>();

export default function FavoritesStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.headerBg },
        headerTintColor: colors.headerText,
        headerTitleStyle: { fontWeight: '600', color: colors.headerText },
        contentStyle: { backgroundColor: colors.background },
      }}>
      <Stack.Screen
        name="FavoritesList"
        component={FavoritesScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Details"
        component={DetailsScreen}
        options={{ title: 'Movie Details' }}
      />
    </Stack.Navigator>
  );
}
