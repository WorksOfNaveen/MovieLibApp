import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DetailsScreen from '../Screens/DetailsScreen';
import ListScreen from '../Screens/ListScreen';
import { colors } from '../theme/colors';

export type MoviesStackParamList = {
  List: undefined;
  Details: { movieId: number };
};

const Stack = createNativeStackNavigator<MoviesStackParamList>();

export default function MoviesStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.headerBg },
        headerTintColor: colors.headerText,
        headerTitleStyle: { fontWeight: '600', color: colors.headerText },
        contentStyle: { backgroundColor: colors.background },
      }}>
      <Stack.Screen
        name="List"
        component={ListScreen}
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
