import React from "react";
import { Provider } from "react-redux";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { store } from "./src/redux/store";
import ItemList from "./src/components/ItemList";
import ItemDetailScreen from "./src/screens/ItemDetailScreen";
import CreateItemScreen from "./src/screens/CreateItemScreen";
import LoadingScreen from "./src/components/LoadingScreen";
import { useSelector } from "react-redux";
import { RootState } from "./src/redux/store";

export type RootStackParamList = {
  ItemList: undefined;
  ItemDetail: { itemId: number };
  CreateItem: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const AppContent = () => {
  const isLoading = useSelector((state: RootState) => state.loading);

  return (
    <>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="ItemList">
          <Stack.Screen
            name="ItemList"
            component={ItemList}
            options={{ title: "Items" }}
          />
          <Stack.Screen
            name="ItemDetail"
            component={ItemDetailScreen}
            options={{ title: "Item Details" }}
          />
          <Stack.Screen
            name="CreateItem"
            component={CreateItemScreen}
            options={{ title: "Create New Item" }}
          />
        </Stack.Navigator>
      </NavigationContainer>
      {isLoading && <LoadingScreen />}
    </>
  );
};

export default function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}
