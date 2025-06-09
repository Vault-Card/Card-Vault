import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { SearchIcon } from "@/components/ui/icon";
import * as Linking from 'expo-linking';
import { Alert } from 'react-native'
import { useState } from 'react';

export default function SearchBar() {
  const [text, setText] = useState("");

  const handleSubmit = () => {
    if (!text.trim()) return;
    Linking.openURL(`https://www.tcgplayer.com/search/all/product?q=${encodeURIComponent(text)}&view=grid`)
      .catch(err => Alert.alert('An error occurred', err.message));
  };

  return (
    <Input>
      <InputSlot className='pl-3'>
        <InputIcon as={SearchIcon} />
      </InputSlot>
      <InputField
        value={text}
        onChangeText={setText}
        onSubmitEditing={handleSubmit} // Triggered on "enter"/"search"
        placeholder="Search..."
        returnKeyType="search"
      />
    </Input>
  );
}
