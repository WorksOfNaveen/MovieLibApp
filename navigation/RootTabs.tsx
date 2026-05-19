import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigatorScreenParams } from '@react-navigation/native';
import FavoritesStack, { FavoritesStackParamList } from './FavoritesStack';
import MoviesStack, { MoviesStackParamList } from './MoviesStack';
import SearchScreen from '../Screens/SearchScreen';
import { colors } from '../theme/colors';

export type RootTabParamList = {
  Movies: NavigatorScreenParams<MoviesStackParamList>;
  Search: undefined;
  Favorites: NavigatorScreenParams<FavoritesStackParamList>;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

export default function RootTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarIcon: () => null,
        tabBarStyle: {
          backgroundColor: colors.tabBarBg,
          borderTopColor: colors.tabBarBorder,
        },
        tabBarActiveTintColor: colors.tabBarActive,
        tabBarInactiveTintColor: colors.tabBarInactive,
        tabBarLabelStyle: {
          fontSize: 14,
          fontWeight: '600',
          marginBottom: 4,
        },
      }}>
      <Tab.Screen
        name="Movies"
        component={MoviesStack}
        options={{ tabBarLabel: 'Movies' }}
      />
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{ tabBarLabel: 'Search' }}
      />
      <Tab.Screen
        name="Favorites"
        component={FavoritesStack}
        options={{ tabBarLabel: 'Favorites' }}
      />
    </Tab.Navigator>
  );
}
