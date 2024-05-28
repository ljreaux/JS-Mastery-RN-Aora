import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import React, { useState } from "react";
import { icons } from "../constants";

interface FormProps {
  value: string;
  handleChangeText: (text: string) => void;
}

const SearchInput = ({ value, handleChangeText }: FormProps) => {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <View className="border-2 border-black-200 w-full h-16 px-4 bg-black-100 rounded-2xl focus:border-secondary items-center flex-row space-x-4">
      <TextInput
        className="flex-1 text-white font-pregular text-base mt-0.5"
        onChangeText={handleChangeText}
        value={value}
        placeholder="Search for a video topic"
        placeholderTextColor="#7b7b8b"
      />

      <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
        <Image className="w-5 h-5" resizeMode="contain" source={icons.search} />
      </TouchableOpacity>
    </View>
  );
};

export default SearchInput;
