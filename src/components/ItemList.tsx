import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Button,
} from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome';
import { useAppDispatch, useAppSelector } from "../redux/hooks/redux";
import { fetchItems, deleteItem, Item } from "../redux/slices/itemsSlice";
import { StackNavigationProp } from "@react-navigation/stack";
import LoadingScreen from "./LoadingScreen";
import { RootStackParamList } from "../../App";
import { Pressable } from "react-native";

type ItemListNavigationProp = StackNavigationProp<
  RootStackParamList,
  "ItemList"
>;

interface ItemListProps {
  navigation: ItemListNavigationProp;
}

const ItemList: React.FC<ItemListProps> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const { items, status, error } = useAppSelector((state) => state.items);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchItems());
    }
  }, [status, dispatch]);

  const handleDeleteItem = (id: number) => {
    dispatch(deleteItem(id));
  };

  const renderItem = ({ item }: { item: Item }) => (
    <View style={styles.itemContainer}>
      <View style={{ width: "80%" }}>
        <TouchableOpacity
          onPress={() => navigation.navigate("ItemDetail", { itemId: item.id })}
        >
          <Text style={styles.itemTitle}>{item.title}</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDeleteItem(item.id)}
      >
        <Text style={styles.deleteButtonText}>Delete</Text>
        <Icon name="trash" style={styles.deleteIcon} size={16} color="#fff" />
      </TouchableOpacity>
    </View>
  );

  const filteredItems = items.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedItems = [...filteredItems].sort((a, b) => {
    if (sortOrder === "asc") {
      return a.title.localeCompare(b.title);
    } else {
      return b.title.localeCompare(a.title);
    }
  });

  if (status === "failed") {
    return <Text>Error: {error}</Text>;
  }

  return (
    <View style={styles.container}>
     
      <View style={styles.searchContainer}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search items..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <Icon name="search" style={styles.searchIcon} size={16} color="grey" />
      </View>
      <View style={styles.buttonContainer}>
        <View>

        <Pressable
          style={styles.ButtonStyle}
          onPress={() => navigation.navigate("CreateItem")}
          ><Text style={styles.buttonText}>Create Item</Text></Pressable>
          <Icon name="plus" style={styles.CreateListIcon} size={16} color="#fff" />
          </View>
        <View>

        <Pressable
          style={styles.ButtonStyle}
          onPress={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
          ><Text style={styles.buttonText}>{`Sort ${sortOrder === "asc" ? "Descending" : "Ascending"}`}</Text></Pressable>
         {sortOrder === "asc" ? <Icon name="arrow-up" style={styles.CreateListIcon} size={16} color="#fff" /> :
          <Icon name="arrow-down" style={styles.CreateListIcon} size={16} color="#fff" />}
          </View>
        </View>
      <FlatList
        data={sortedItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  itemContainer: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  itemTitle: {
    fontSize: 16,
    flex: 1,
  },
  searchInput: {
    marginTop: 10,
    height: 40,
    borderColor: "gray",
    borderRadius: 4,
    borderWidth: 1,
    paddingLeft: 10,
    marginBottom: 10,
  },
  deleteButton: {
    backgroundColor: "red",
    padding: 5,
    borderRadius: 5,
    paddingRight: 32
  },
  deleteButtonText: {
    color: "white",
    fontSize:16,
    fontWeight:600
  },
  centeredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  searchContainer:{
    position:"relative"
  },
  searchIcon:{
    position:"absolute",
    right: 12,
    top: 22
  },
  buttonContainer:{
    display:"flex",
    justifyContent: "space-between",
    flexDirection: "row"
  },
  CreateListIcon:{
  position: "absolute",
  top: 12,
  left:12
  },
  ButtonStyle:{
    backgroundColor: "rgb(33, 150, 243)",
    paddingLeft:32,
    paddingRight:16,
    paddingTop:8,
    paddingBottom:8,
    borderRadius: 4,
  },
  buttonText:{
    fontSize:16,
    color:"#fff",
    fontWeight:"600"
  },
  deleteIcon:{
    position: "absolute",
    right:8,
    top:6
  }
});

export default ItemList;
