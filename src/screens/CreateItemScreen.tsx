import React, { useState } from "react";
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  Text,
  Modal,
  TouchableOpacity,
} from "react-native";
import { useAppDispatch, useAppSelector } from "../redux/hooks/redux";
import { addItem } from "../redux/slices/itemsSlice";

import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../App";

type CreateItemScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "CreateItem"
>;

type Props = {
  navigation: CreateItemScreenNavigationProp;
};

const CreateItemScreen: React.FC<Props> = ({ navigation }) => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [errors, setErrors] = useState({ title: "", body: "" });
  const [modalVisible, setModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const dispatch = useAppDispatch();

  const validateForm = () => {
    let isValid = true;
    const newErrors = { title: "", body: "" };

    if (title.trim() === "") {
      newErrors.title = "Title is required";
      isValid = false;
    }

    if (body.trim() === "") {
      newErrors.body = "Body is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleCreateItem = async () => {
    if (validateForm()) {
      try {
        await dispatch(addItem({ title, body, userId: 1 })).unwrap();
        Alert.alert("Success", "Item created successfully");
        navigation.goBack();
      } catch (error) {
        setErrorMessage(error as string);
        setModalVisible(true);
      }
    } else {
      Alert.alert("Error", "Please fill in all required fields");
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={[styles.input, errors.title ? styles.inputError : null]}
        value={title}
        onChangeText={(text) => {
          setTitle(text);
          setErrors((prev) => ({ ...prev, title: "" }));
        }}
        placeholder="Title"
        placeholderTextColor="#999"
      />
      {errors.title ? (
        <Text style={styles.errorText}>{errors.title}</Text>
      ) : null}

      <TextInput
        style={[styles.input, errors.body ? styles.inputError : null]}
        value={body}
        onChangeText={(text) => {
          setBody(text);
          setErrors((prev) => ({ ...prev, body: "" }));
        }}
        placeholder="Body"
        placeholderTextColor="#999"
        multiline
      />
      {errors.body ? <Text style={styles.errorText}>{errors.body}</Text> : null}

      <Button title="Create" onPress={handleCreateItem} />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>{errorMessage}</Text>
            <TouchableOpacity
              style={styles.buttonClose}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.textStyle}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    marginBottom: 10,
    borderRadius: 4,
    fontSize: 16,
  },
  inputError: {
    borderColor: "red",
  },
  errorText: {
    color: "red",
    marginBottom: 10,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonClose: {
    backgroundColor: "#2196F3",
    borderRadius: 10,
    padding: 8,
    elevation: 2,
    marginTop: 15,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
});

export default CreateItemScreen;
