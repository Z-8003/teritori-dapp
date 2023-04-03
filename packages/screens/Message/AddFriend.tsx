import React from "react";
import { View } from "react-native";

import AddFriendList from "../../components/addfriend/AddFriendList";
import data from "../../components/addfriend/data";
const AddFriend = () => {
  return (
    <View>
      {data.map((item) => (
        <AddFriendList
          avatar={item.avatar}
          name={item.name}
          isOnline={item.isOnline}
        />
      ))}
    </View>
  );
};
export default AddFriend;
