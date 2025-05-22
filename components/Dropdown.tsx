import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { IconSymbol } from "./ui/IconSymbol";

// from https://dev.to/aneeqakhan/how-to-create-a-dropdown-from-scratch-in-react-native-1379

type InlineDropdownProps = {
  data: any;
  onSelect: any
  i: number;
};

const InlineDropdown = ({ data, onSelect, i }: InlineDropdownProps) => {
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [selectedValue, setSelectedValue] = useState<any | null>(null);

  const toggleDropdown = () => setDropdownVisible(!isDropdownVisible);

  const handleSelect = (item: any ) => {
    setSelectedValue(item);
    onSelect(item, i);
    setDropdownVisible(false);
  };
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={toggleDropdown}>
        <View style={styles.textContainer}>
            <Text style={styles.buttonText}>
              {selectedValue || data[i] || "None"}
            </Text>
            <IconSymbol
                name="chevron.right"
                size={18}
                weight="medium"
                color="#4d4c4c"
                style={{ transform: [{ rotate: isDropdownVisible ? '90deg' : '0deg' }] }}
            />
        </View>
      </TouchableOpacity>
      {isDropdownVisible && (
        <View style={styles.dropdown}>
            {["None", ...data.filter((item: string) => item)].map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.option}
                onPress={() => handleSelect(item)}
              >
                <Text style={styles.optionText}>{item}</Text>
              </TouchableOpacity>
            ))} 
        </View>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    // width: "100%"
  },
  textContainer:{
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  button: {
    padding: 15,
    backgroundColor: "#f6f6e9",
    borderRadius: 25,
  },
  buttonText: {
    color: "#4d4c4c",
    textAlign: "center",
    fontSize: 12
  },
  dropdown: {
    marginTop: 5,
    backgroundColor: "white",
    borderRadius: 25,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  option: {
    paddingHorizontal: 20,
    paddingVertical: 10
  },
  optionText: {
    fontSize: 12,
  },
});

export default InlineDropdown;