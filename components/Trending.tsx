import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ImageBackground,
  ViewToken,
} from "react-native";
import React, { ReactElement, useRef, useState } from "react";
import * as Animatable from "react-native-animatable";
import { Image } from "react-native";
import { icons } from "@/constants";
import { Video, ResizeMode } from "expo-av";

export interface itemType {
  $id: string;
  title: string;
  thumbnail: string;
  video: string;
  users: {
    username: string;
    avatar: string;
  };
}

const zoomIn = {
  from: {
    scale: 0.9,
  },
  to: {
    scale: 1.1,
  },
};

const zoomOut = {
  from: {
    scale: 1,
  },
  to: {
    scale: 0.9,
  },
};

const TrendingItem = ({
  activeItem,
  item,
}: {
  activeItem: itemType | string;
  item: itemType;
}) => {
  const video = useRef(null);
  const [play, setPlay] = useState(false);
  return (
    <Animatable.View
      className="mr-5"
      //  scale is not an animatable property in this library. Added to types for just this project
      animation={activeItem === item.$id ? zoomIn : zoomOut}
      duration={500}
    >
      {play ? (
        <Video
          ref={video}
          source={{
            uri: "https://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4",

            // Videos from tutorial appear to be in the wrong format. Will not run on IOS or Android

            // uri: item.video,
          }}
          className="w-52 h-72 rounded-[35px] mt-3 bg-white/10"
          resizeMode={ResizeMode.CONTAIN}
          useNativeControls
          shouldPlay
          onError={(error) => {
            console.log(error);
          }}
          onPlaybackStatusUpdate={(playbackStatus) => {
            if (playbackStatus.isLoaded)
              if (playbackStatus.didJustFinish) {
                setPlay(false);
              }
          }}
        />
      ) : (
        <TouchableOpacity
          className="relative justify-center items-center"
          activeOpacity={0.7}
          onPress={() => setPlay(true)}
        >
          <ImageBackground
            source={{ uri: item.thumbnail }}
            className="w-52 h-72 rounded-[35px] my-5 overflow-hidden shadow-lg shadow-black-40"
            resizeMode="cover"
          />
          <Image
            source={icons.play}
            className="w-12 h-12 absolute"
            resizeMode="contain"
          />
        </TouchableOpacity>
      )}
    </Animatable.View>
  );
};

const Trending = ({ posts = [] }: { posts: itemType[] }) => {
  const [activeItem, setActiveItem] = useState<itemType | string>(posts[0]);

  const viewableItemsChanged = ({
    viewableItems,
  }: {
    viewableItems: ViewToken[];
  }) => {
    if (viewableItems.length > 0 && viewableItems[0].key) {
      setActiveItem(viewableItems[0].key);
    }
  };
  return (
    <FlatList
      data={posts}
      keyExtractor={(item) => item.$id}
      renderItem={({ item }) => (
        <TrendingItem activeItem={activeItem} item={item} />
      )}
      horizontal
      viewabilityConfig={{
        itemVisiblePercentThreshold: 70,
      }}
      contentOffset={{ x: 170, y: 0 }}
      onViewableItemsChanged={viewableItemsChanged}
    />
  );
};

export default Trending;
