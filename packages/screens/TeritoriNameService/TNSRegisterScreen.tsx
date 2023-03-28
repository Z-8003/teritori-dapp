import React from "react";
import { useWindowDimensions } from "react-native";

import { PrimaryButton } from "../../components/buttons/PrimaryButton";
import ModalBase from "../../components/modals/GradientModalBase";
import { FindAName } from "../../components/teritoriNameService/FindAName";
import { useTNS } from "../../context/TNSProvider";
import { useNSNameAvailability } from "../../hooks/useNSNameAvailability";
import { useSelectedNetworkId } from "../../hooks/useSelectedNetwork";
import { getCosmosNetwork } from "../../networks";
import { neutral00, neutral17, neutral33 } from "../../utils/style/colors";
import { modalWidthRatio, smallMobileWidth } from "../../utils/style/layout";
import { TNSCloseHandler } from "./TNSHomeScreen";

interface TNSRegisterScreenProps {
  onClose: TNSCloseHandler;
}

export const TNSRegisterScreen: React.FC<TNSRegisterScreenProps> = ({
  onClose,
}) => {
  const networkId = useSelectedNetworkId();
  const { name, setName } = useTNS();
  const network = getCosmosNetwork(networkId);
  const tokenId = name + network?.nameServiceTLD || "";
  const { nameAvailable, nameError, loading } = useNSNameAvailability(
    networkId,
    tokenId
  );
  const { width } = useWindowDimensions();

  return (
    <ModalBase
      onClose={() => onClose()}
      label="Find a name"
      width={width < smallMobileWidth ? modalWidthRatio * width : 457}
      modalStatus={name && nameAvailable ? "success" : "danger"}
      hideMainSeparator
      scrollable
    >
      {/*----- The first thing you'll see on this screen is <FindAName> */}
      <FindAName
        name={name}
        setName={setName}
        nameError={nameError}
        nameAvailable={nameAvailable}
        loading={loading}
        nameNFTStyle={{
          backgroundColor: neutral00,
          borderWidth: 1,
          borderColor: neutral33,
          borderRadius: 8,
          paddingBottom: 48,
          width: "100%",
        }}
      >
        {name && !nameError && nameAvailable ? (
          <PrimaryButton
            size="XL"
            width={280}
            squaresBackgroundColor={neutral17}
            text="Register your Username"
            onPress={() => {
              setName(name);
              onClose("TNSMintName");
              // onClose("TNSBurnName");
              // onClose("TNSUpdateName");
              // onClose("TNSConsultName");
            }}
          />
        ) : null}

        {name && !nameError && !nameAvailable && (
          <PrimaryButton
            size="XL"
            width={280}
            text="View"
            onPress={() => {
              onClose("TNSConsultName");
            }}
            squaresBackgroundColor={neutral17}
          />
        )}
      </FindAName>
    </ModalBase>
  );
};
