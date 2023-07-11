import React, { useState } from "react";
import { View, StyleSheet } from "react-native";

import { HoverView } from "./HoverView";
import AddLibrary from "../../../assets/music-player/add-library.svg";
import Code from "../../../assets/music-player/code.svg";
import Enter from "../../../assets/music-player/enter.svg";
import Flag from "../../../assets/music-player/flag.svg";
import Link from "../../../assets/music-player/link.svg";
import Share from "../../../assets/music-player/share.svg";
import Tip from "../../../assets/music-player/tip-other.svg";
import { signingMusicPlayerClient } from "../../client-creators/musicplayerClient";
import { useFeedbacks } from "../../context/FeedbacksProvider";
import { useSelectedNetworkId } from "../../hooks/useSelectedNetwork";
import useSelectedWallet from "../../hooks/useSelectedWallet";
import { neutralA3, neutral33, secondaryColor } from "../../utils/style/colors";
import { fontSemibold13 } from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";
import { AlbumInfo } from "../../utils/types/music";
import { BrandText } from "../BrandText";
import { SVG } from "../SVG";

interface TrackHoverMenuProps {
  album: AlbumInfo;
  hasLibrary: boolean;
}
export const TrackHoverMenu: React.FC<TrackHoverMenuProps> = ({
  album,
  hasLibrary,
}) => {
  const selectedNetworkId = useSelectedNetworkId();
  const wallet = useSelectedWallet();

  const shareMenuWidth = 188;
  const lineHeight = 18;

  const [openShareMenu, setOpenShareMenu] = useState<boolean>(false);
  const { setToastError, setToastSuccess } = useFeedbacks();

  const addToLibrary = async () => {
    if (!wallet?.connected || !wallet.address) {
      return;
    }
    const client = await signingMusicPlayerClient({
      networkId: selectedNetworkId,
      walletAddress: wallet.address,
    });
    try {
      const res = await client.addToLibrary({ identifier: album.id });
      if (res.transactionHash) {
        setToastSuccess({
          title: "Add album to my library",
          message: `tx_hash: ${res.transactionHash}`,
        });
      }
    } catch (err) {
      setToastError({
        title: "Failed to add album to my library",
        message: `Error: ${err}`,
      });
    }
  };

  const removeFromLibrary = async () => {
    if (!wallet?.connected || !wallet.address) {
      return;
    }
    const client = await signingMusicPlayerClient({
      networkId: selectedNetworkId,
      walletAddress: wallet.address,
    });
    try {
      const res = await client.removeFromLibrary({ identifier: album.id });
      if (res.transactionHash) {
        setToastSuccess({
          title: "remove album from my library",
          message: `tx_hash: ${res.transactionHash}`,
        });
      }
    } catch (err) {
      setToastError({
        title: "Failed to remove album from my library",
        message: `Error: ${err}`,
      });
    }
  };

  const styles = StyleSheet.create({
    hoverBox: {
      position: "absolute",
      width: "100%",
      height: "100%",
      left: 0,
      top: 0,
      backgroundColor: "rgba(0,0,0,0.5)",
      padding: layout.padding_x1_5,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-end",
      zIndex: 999,
    },
    menuContainer: {
      borderRadius: layout.padding_x1_5,
      position: "absolute",
      right: layout.padding_x1_5,
      bottom: 44,
      backgroundColor: "rgba(41, 41, 41, 1)",
      padding: layout.padding_x1_5,
      flexDirection: "column",
      gap: layout.padding_x0_75,
    },
    unitBoxNormal: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: layout.padding_x0_75,
      borderRadius: layout.padding_x0_75,
    },
    unitBoxHovered: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: layout.padding_x0_75,
      backgroundColor: neutral33,
      borderRadius: layout.padding_x0_75,
    },
    oneLine: {
      flexDirection: "row",
      alignItems: "center",
      gap: layout.padding_x1,
    },
    text: StyleSheet.flatten([
      fontSemibold13,
      {
        color: neutralA3,
      },
    ]),
    divideLine: {
      height: 1,
      opacity: 0.12,
      backgroundColor: secondaryColor,
    },
    shareMenuContainer: {
      borderRadius: layout.padding_x1_5,
      position: "absolute",
      left: -(layout.padding_x1_5 + shareMenuWidth),
      bottom: -(
        layout.padding_x1_5 +
        lineHeight +
        layout.padding_x1_5 +
        2 * layout.padding_x0_75
      ),
      backgroundColor: "rgba(41, 41, 41, 1)",
      padding: layout.padding_x1_5,
      flexDirection: "column",
      gap: layout.padding_x0_75,
      width: shareMenuWidth,
    },
  });

  return (
    <View style={styles.menuContainer}>
      {wallet && wallet.address !== album.createdBy && !hasLibrary && (
        <HoverView
          normalStyle={styles.unitBoxNormal}
          hoverStyle={styles.unitBoxHovered}
          onPress={() => {
            addToLibrary();
          }}
        >
          <View style={styles.oneLine}>
            <SVG
              source={AddLibrary}
              width={layout.padding_x2}
              height={layout.padding_x2}
            />
            <BrandText style={styles.text}>Add to library</BrandText>
          </View>
        </HoverView>
      )}
      {wallet && wallet.address !== album.createdBy && hasLibrary && (
        <HoverView
          normalStyle={styles.unitBoxNormal}
          hoverStyle={styles.unitBoxHovered}
          onPress={() => {
            removeFromLibrary();
          }}
        >
          <View style={styles.oneLine}>
            <SVG
              source={AddLibrary}
              width={layout.padding_x2}
              height={layout.padding_x2}
            />
            <BrandText style={styles.text}>Remove From library</BrandText>
          </View>
        </HoverView>
      )}

      <View style={styles.divideLine} />

      <HoverView
        normalStyle={styles.unitBoxNormal}
        hoverStyle={styles.unitBoxHovered}
      >
        <View style={styles.oneLine}>
          <SVG
            source={Flag}
            width={layout.padding_x2}
            height={layout.padding_x2}
          />
          <BrandText style={styles.text}>Flag this track</BrandText>
        </View>
      </HoverView>

      <View style={styles.divideLine} />

      <HoverView
        normalStyle={styles.unitBoxNormal}
        hoverStyle={styles.unitBoxHovered}
      >
        <View style={styles.oneLine}>
          <SVG
            source={Tip}
            width={layout.padding_x2}
            height={layout.padding_x2}
          />
          <BrandText style={styles.text}>Tip this track</BrandText>
        </View>
      </HoverView>
      <HoverView
        normalStyle={styles.unitBoxNormal}
        onPress={() => setOpenShareMenu((value) => !value)}
        hoverStyle={styles.unitBoxHovered}
      >
        <View style={styles.oneLine}>
          <SVG
            source={Share}
            width={layout.padding_x2}
            height={layout.padding_x2}
          />
          <BrandText style={styles.text}>Share</BrandText>
        </View>
        <SVG
          source={Enter}
          width={layout.padding_x2}
          height={layout.padding_x2}
        />

        {openShareMenu && (
          <View style={styles.shareMenuContainer}>
            <HoverView
              normalStyle={styles.unitBoxNormal}
              hoverStyle={styles.unitBoxHovered}
            >
              <View style={styles.oneLine}>
                <SVG
                  source={Link}
                  width={layout.padding_x2}
                  height={layout.padding_x2}
                />
                <BrandText style={styles.text}>
                  Copy link to the track
                </BrandText>
              </View>
            </HoverView>
            <HoverView
              normalStyle={styles.unitBoxNormal}
              hoverStyle={styles.unitBoxHovered}
            >
              <View style={styles.oneLine}>
                <SVG
                  source={Code}
                  width={layout.padding_x2}
                  height={layout.padding_x2}
                />
                <BrandText style={styles.text}>Copy widget code</BrandText>
              </View>
            </HoverView>
          </View>
        )}
      </HoverView>
    </View>
  );
};
