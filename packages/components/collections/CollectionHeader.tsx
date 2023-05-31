import Clipboard from "@react-native-clipboard/clipboard";
import React from "react";
import { View, Platform, StyleSheet, Linking } from "react-native";

import { CollectionStat } from "./CollectionStat";
import { TabsListType } from "./types";
import etherscanSVG from "../../../assets/icons/etherscan.svg";
import shareSVG from "../../../assets/icons/share.svg";
import { SortDirection } from "../../api/marketplace/v1/marketplace";
import { BrandText } from "../../components/BrandText";
import { SocialButtonSecondary } from "../../components/buttons/SocialButtonSecondary";
import { CollectionSocialButtons } from "../../components/collections/CollectionSocialButtons";
import { RoundedGradientImage } from "../../components/images/RoundedGradientImage";
import { SortButton } from "../../components/sorts/SortButton";
import { SpacerRow } from "../../components/spacer";
import { Tabs } from "../../components/tabs/Tabs";
import { useFeedbacks } from "../../context/FeedbacksProvider";
import { useCollectionStats } from "../../hooks/useCollectionStats";
import { useMaxResolution } from "../../hooks/useMaxResolution";
import useSelectedWallet from "../../hooks/useSelectedWallet";
import { contractExplorerLink, parseCollectionId } from "../../networks";
import { prettyPrice } from "../../utils/coins";
import { CollectionInfo } from "../../utils/collection";
import { codGrayColor, neutral33 } from "../../utils/style/colors";
import { fontSemibold28 } from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";
import { FilterButton } from "../sorts/FilterButton";

// All the screen content before the Flatlist used to display NFTs
export const CollectionHeader: React.FC<{
  collectionId: string;
  collectionInfo?: CollectionInfo;
  selectedTab: TabsListType;
  onSelectTab: (tab: TabsListType) => void;
  sortDirection: SortDirection;
  onChangeSortDirection: (val: SortDirection) => void;
}> = ({
  collectionInfo = { mintPhases: [] },
  selectedTab,
  onSelectTab,
  collectionId,
  sortDirection,
  onChangeSortDirection,
}) => {
  const wallet = useSelectedWallet();
  // variables
  const stats = useCollectionStats(collectionId, wallet?.userId);
  const { width } = useMaxResolution();
  const [network, collectionMintAddress] = parseCollectionId(collectionId);
  const { setToastSuccess } = useFeedbacks();

  const collectionScreenTabItems = {
    collections: {
      name: "Collection",
      badgeCount: stats?.totalSupply || 0,
    },
    ...(stats?.owned
      ? {
          owned: {
            name: "Owned",
            badgeCount: stats.owned,
          },
        }
      : {}),
    activity: {
      name: "Activity",
    },
    // this will be later for a "bid" system
    // offers: {
    //   name: "Offers",
    // },
  };

  // functions
  const onShare = () => {
    let currentUrl;
    if (Platform.OS === "web") {
      currentUrl = window.location.href;
    }

    try {
      Clipboard.setString(currentUrl || "");
      setToastSuccess({
        title: "URL Copied!",
        message: "",
      });
    } catch (error) {
      console.error(error);
    }
  };

  // returns
  return width > 0 && stats && network ? (
    <View
      style={{
        // maxWidth: width,
        width: "100%",
        alignSelf: "center",
        marginTop: layout.padding_x4,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          width: "100%",
          marginBottom: layout.padding_x2_5,
          borderRadius: layout.padding_x2,
          borderColor: neutral33,
          borderWidth: 1,
          padding: layout.padding_x2,
          borderStyle: "solid",
        }}
      >
        <RoundedGradientImage
          sourceURI={collectionInfo.image}
          style={{ marginRight: 24 }}
        />
        <View style={{ flex: 1 }}>
          <BrandText style={fontSemibold28}>{collectionInfo.name}</BrandText>
          <View style={styles.statRow}>
            <CollectionStat
              label="Floor"
              value={
                stats
                  ? prettyPrice(
                      network.id,
                      stats.floorPrice[0].quantity,
                      stats.floorPrice[0].denom,
                      true
                    )
                  : "-"
              }
              currencyIcon={{
                networkId: network.id,
                value: 0,
                denom: stats.floorPrice[0].denom,
              }}
            />
            <SpacerRow size={1.5} />
            <CollectionStat
              label="Total Volume"
              value={prettyPrice(
                network.id,
                parseFloat(stats.totalVolume).toFixed(0),
                stats.floorPrice[0].denom,
                true
              )}
              currencyIcon={{
                networkId: network.id,
                value: parseFloat(stats.totalVolume),
                denom: stats.floorPrice[0].denom,
              }}
            />
            <SpacerRow size={1.5} />
            <CollectionStat
              label="Owners"
              value={(stats?.owners || 0).toString()}
            />
            <SpacerRow size={1.5} />
            <CollectionStat
              label="Listed"
              value={(stats?.listed || 0).toString()}
            />
            <SpacerRow size={1.5} />
            <CollectionStat
              label="Avg Sale (24hr)"
              value={prettyPrice(
                network.id,
                stats.avgPricePeriod.toFixed(0),
                stats.floorPrice[0].denom,
                true
              )}
              currencyIcon={{
                networkId: network.id,
                value: stats.avgPricePeriod,
                denom: stats.floorPrice[0].denom,
              }}
            />
            <SpacerRow size={1.5} />
            <CollectionStat
              label="Total Supply"
              value={(stats?.totalSupply || 0).toString()}
            />
          </View>
          <View style={styles.statRow}>
            <CollectionSocialButtons collectionInfo={collectionInfo} />
            {collectionInfo.discord ||
            collectionInfo.twitter ||
            collectionInfo.website ? (
              <View
                style={{
                  height: 24,
                  width: 1,
                  backgroundColor: neutral33,
                  marginRight: 12,
                }}
              />
            ) : null}
            <SocialButtonSecondary
              text="Explorer"
              iconSvg={etherscanSVG}
              style={{ marginRight: 12 }}
              onPress={() => {
                const url = contractExplorerLink(
                  network?.id,
                  collectionMintAddress
                );
                Linking.openURL(url);
              }}
            />
            <SocialButtonSecondary
              text="Share"
              iconSvg={shareSVG}
              onPress={onShare}
            />
          </View>
        </View>
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginBottom: layout.padding_x4,
          flex: 10,
        }}
      >
        <FilterButton
          mainContainerStyle={{ backgroundColor: neutral33, width: 54 }}
        />
        <Tabs
          items={collectionScreenTabItems}
          onSelect={onSelectTab}
          selected={selectedTab}
          style={{
            height: "100%",
            flex: 8,
            paddingLeft: layout.padding_x2,
            marginHorizontal: 1,
            backgroundColor: codGrayColor,
          }}
          noUnderline
        />
        <SortButton
          mainContainerStyle={{ backgroundColor: neutral33 }}
          sortDirection={sortDirection}
          onChangeSortDirection={onChangeSortDirection}
        />
      </View>
    </View>
  ) : null;
};

const styles = StyleSheet.create({
  statRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: layout.padding_x2_5,
    alignItems: "center",
    flex: 1,
  },
});
