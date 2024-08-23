import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { useAppDispatch, useAppSelector } from "../redux/hooks/redux";
import { updateItem, deleteItem } from "../redux/slices/itemsSlice";
import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../App";

type ItemDetailScreenRouteProp = RouteProp<RootStackParamList, "ItemDetail">;
type ItemDetailScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "ItemDetail"
>;

type Props = {
  route: ItemDetailScreenRouteProp;
  navigation: ItemDetailScreenNavigationProp;
};

const ItemDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const { itemId } = route.params;
  const dispatch = useAppDispatch();
  const item = useAppSelector((state) =>
    state.items.items.find((item) => item.id === itemId)
  );
  const [title, setTitle] = useState(item?.title || "");
  const [body, setBody] = useState(item?.body || "");

  useEffect(() => {
    if (item) {
      setTitle(item.title);
      setBody(item.body);
    }
  }, [item]);

  const handleUpdateItem = () => {
    if (item) {
      dispatch(updateItem({ ...item, title, body }));
      Alert.alert("Success", "Item updated successfully");
      navigation.goBack();
    }
  };

  const handleDeleteItem = () => {
    if (item) {
      dispatch(deleteItem(item.id));
      Alert.alert("Success", "Item deleted successfully");
      navigation.goBack();
    }
  };

  if (!item) {
    return <Text>Item not found</Text>;
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="Title"
      />
      <TextInput
        style={styles.input}
        value={body}
        onChangeText={setBody}
        placeholder="Body"
        multiline
      />
      <View style={{ gap: 5 }}>
        <Button title="Update" onPress={handleUpdateItem} />
        <Button
          title="Delete"
          onPress={() => {
            Alert.alert(
              "Confirm Deletion",
              "Are you sure you want to delete this item?",
              [
                { text: "Cancel", style: "cancel" },
                { text: "OK", onPress: handleDeleteItem },
              ]
            );
          }}
          color="red"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
    borderRadius: 4,
  },
});

export default ItemDetailScreen;
