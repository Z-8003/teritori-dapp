import React, { useState, useEffect, useMemo } from "react";
import { View, StyleSheet, Pressable } from "react-native";
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";

import Logo from "../../../assets/logos/logo.svg";
import { BrandText } from "../../components/BrandText";
import { MusicPlayerCard } from "../../components/MusicPlayer/MusicPlayerCard";
import { UploadAlbumModal } from "../../components/MusicPlayer/UploadAlbumModal";
import { SVG } from "../../components/SVG";
import { useSelectedNetworkId } from "../../hooks/useSelectedNetwork";
import { mustGetMusicplayerClient } from "../../utils/backend";
import { primaryColor } from "../../utils/style/colors";
import { fontSemibold14, fontSemibold20 } from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";
import { AlbumInfo, AlbumMetadataInfo } from "../../utils/types/music";
import { GetAllAlbumListRequest } from "../../api/musicplayer/v1/musicplayer";
import { combineFetchAlbumPages, useFetchAlbum } from "../../hooks/musicplayer/useFetchAlbum";
interface MusicPlayerProps {
  req: GetAllAlbumListRequest
}

export const MusicPlayerHomeContent: React.FC<MusicPlayerProps> = ({req}) => {
  const [albumList, setAlbumList] = useState<AlbumInfo[]>([]);

  const [openUploadModal, setOpenUploadModal] = useState<boolean>(false);
  // const [openAlbumInfoModal, setOpenAlbumInfoModal] = useState<boolean>(false);
  const selectedNetworkId = useSelectedNetworkId();
  const { data, isFetching, refetch, hasNextPage, fetchNextPage, isLoading } =
    useFetchAlbum(req);
  const isLoadingValue = useSharedValue(false);
  const isGoingUp = useSharedValue(false);
  const [flatListContentOffsetY, setFlatListContentOffsetY] = useState(0);

  const albums = useMemo(
    () => (data ? combineFetchAlbumPages(data.pages) : []),
    [data]
  );

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      setFlatListContentOffsetY(event.contentOffset.y);
      if (flatListContentOffsetY > event.contentOffset.y) {
        isGoingUp.value = true;
      } else if (flatListContentOffsetY < event.contentOffset.y) {
        isGoingUp.value = false;
      }
      setFlatListContentOffsetY(event.contentOffset.y);
    },
  });

  // useEffect(() => {
  //   const getAlbumList = async () => {
  //     try {
  //       const res = await mustGetMusicplayerClient(
  //         selectedNetworkId
  //       ).GetAllAlbumList({
  //         limit: 0,
  //         offset: 10,
  //       });
  //       const newAlbumList: AlbumInfo[] = [];
  //       res.musicAlbums.map((albumInfo, index) => {
  //         const metadata = JSON.parse(albumInfo.metadata) as AlbumMetadataInfo;
  //         newAlbumList.push({
  //           id: albumInfo.identifier,
  //           name: metadata.title,
  //           description: metadata.description,
  //           image: metadata.image,
  //           audios: [],
  //         });
  //       });
  //       setAlbumList(newAlbumList);
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   };
  //   getAlbumList();
  // }, [selectedNetworkId]);

  const styles = StyleSheet.create({
    container: {
      marginTop: layout.padding_x3,
      width: "100%",
    },
    oneLine: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    contentGroup: {
      flexDirection: "row",
      justifyContent: "center",
      flexWrap: "wrap",
      marginTop: layout.padding_x3,
      gap: layout.padding_x2_5,
      marginBottom: 40,
    },
    buttonGroup: {
      flexDirection: "row",
      alignItems: "center",
      gap: layout.padding_x2,
    },
    buttonContainer: {
      flexDirection: "row",
      alignItems: "center",
      paddingLeft: layout.padding_x1,
      paddingRight: layout.padding_x1_5,
      paddingVertical: layout.padding_x1,
      backgroundColor: "#2B2B33",
      borderRadius: layout.padding_x4,
      gap: layout.padding_x1_5,
    },
    buttonText: StyleSheet.flatten([
      fontSemibold14,
      {
        color: primaryColor,
      },
    ]),
  });

  return (
    <View style={styles.container}>
      <View style={styles.oneLine}>
        <BrandText style={fontSemibold20}>All Albums</BrandText>
        <View style={styles.buttonGroup}>
          <Pressable
            style={styles.buttonContainer}
            onPress={() => setOpenUploadModal(true)}
          >
            <SVG
              source={Logo}
              width={layout.padding_x2}
              height={layout.padding_x2}
            />
            <BrandText style={styles.buttonText}>Upload album</BrandText>
          </Pressable>
          <Pressable style={styles.buttonContainer}>
            <SVG
              source={Logo}
              width={layout.padding_x2}
              height={layout.padding_x2}
            />
            <BrandText style={styles.buttonText}>Create funding</BrandText>
          </Pressable>
        </View>
      </View>
      <View style={styles.contentGroup}>
        <Animated.FlatList
          scrollEventThrottle={0.1}
          data={albums}
          renderItem={({ item: albumInfo }) => (
            <MusicPlayerCard item={albumInfo} />
          )}
          onScroll={scrollHandler}
        />
      </View>
      <UploadAlbumModal
        isVisible={openUploadModal}
        onClose={() => setOpenUploadModal(false)}
      />
    </View>

  );
};
