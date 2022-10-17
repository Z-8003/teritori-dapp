import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import { ColorValue, View } from "react-native";

import { BrandText } from "../../components/BrandText/BrandText";
import { TertiaryBox } from "../../components/boxes/TertiaryBox";
import { GovernanceDetails } from "../../screens/Governance/GovernanceDetails";

export const GovernanceBox: React.FC<{
  numberProposal: string;
  titleProposal: string;
  descriptionProposal: string;
  votingEndTime: string;
  votingStartTime: string;
  turnoutValue: string;
  mostVotedValue: number;
  colorMostVoted: ColorValue | undefined;
  percentageYesValue: number;
  percentageNoValue: number;
  percentageNoWithVetoValue: number;
  percentageAbstainValue: number;
  votingSubmitTime: string;
  votingDepositEndTime: string;
}> = ({
  numberProposal,
  titleProposal,
  descriptionProposal,
  votingEndTime,
  turnoutValue,
  mostVotedValue,
  colorMostVoted,
  percentageYesValue,
  percentageNoValue,
  percentageNoWithVetoValue,
  percentageAbstainValue,
  votingStartTime,
  votingSubmitTime,
  votingDepositEndTime,
}) => {
  let isVotingPeriod = true;
  let isPassedPeriod = false;
  let isRejectedPeriod = false;
  const totalUsers =
    percentageYesValue +
    percentageNoValue +
    percentageNoWithVetoValue +
    percentageAbstainValue;
  const totalParticipant = totalUsers - percentageAbstainValue;
  const percentageTotalParticipant =
    ((totalParticipant / totalUsers) * 100).toFixed(2).toString() + "%";
  const [displayGovernanceDetails, setdisplayGovernanceDetails] =
    useState(false);

  const test = "%";
  let percentageYes = ((percentageYesValue / totalUsers) * 100)
    .toFixed(2)
    .toString();
  percentageYes = percentageYes.substring(0, 5) + test;
  let percentageNo = ((percentageNoValue / totalUsers) * 100)
    .toFixed(2)
    .toString();
  percentageNo = percentageNo.substring(0, 5) + test;

  let toppercentage;
  if (percentageYesValue > percentageNoValue) {
    toppercentage = percentageYes;
    colorMostVoted = "#16BBFF";
  } else {
    toppercentage = percentageNo;
    colorMostVoted = "#EAA54B";
  }

  const numberProposalHashtag = "#" + numberProposal;

  const today = new Date();
  let todayDate = "";
  const dd = String(today.getDate()).padStart(2, "0");
  const mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  const yyyy = today.getFullYear();
  const hours = today.getHours();
  const minutes = today.getMinutes();

  todayDate = mm + "/" + dd + "/" + yyyy;
  todayDate = yyyy + "-" + mm + "-" + dd + " " + hours + ":" + minutes;

  if (todayDate > votingEndTime) {
    isPassedPeriod = true;
    isVotingPeriod = false;
  } else {
    isVotingPeriod = true;
    isPassedPeriod = false;
  }

  if (
    percentageNoValue + percentageNoWithVetoValue > percentageYesValue &&
    isPassedPeriod === true
  ) {
    isRejectedPeriod = true;
    isPassedPeriod = false;
  }

  function avctivePopupppp() {
    setdisplayGovernanceDetails(!displayGovernanceDetails);
  }

  function activeGovernanceDetailsPopup() {
    if (displayGovernanceDetails === true) {
      return (
        <GovernanceDetails
          visible={displayGovernanceDetails}
          onClose={() => avctivePopupppp()}
          numberProposal={numberProposalHashtag}
          titleProposal={titleProposal}
          descriptionProposal={descriptionProposal}
          totalParticipant={totalParticipant}
          percentageTotalParticipant={percentageTotalParticipant}
          votingEndTime={votingEndTime}
          votingStartTime={votingStartTime}
          votingSubmitTime={votingSubmitTime}
          votingDepositEndTime={votingDepositEndTime}
          isVotingPeriod={isVotingPeriod}
          isPassedPeriod={isPassedPeriod}
          isRejectedPeriod={isRejectedPeriod}
          percentageYes={percentageYes}
          percentageNo={percentageNo}
        />
      );
    } else {
      return <></>;
    }
  }

  return (
    <View style={{ width: "50%", marginBottom: 20 }}>
      <a
        style={{ cursor: "pointer" }}
        onClick={() => {
          avctivePopupppp();
        }}
      >
        {activeGovernanceDetailsPopup()}

        <TertiaryBox width={600} height={300}>
          {isVotingPeriod && (
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#171717",
                borderRadius: 100,
                height: 27,
                width: 125,
                position: "absolute",
                left: 20,
                top: 20,
              }}
            >
              <BrandText
                style={{
                  fontSize: 13,
                  color: "#16BBFF",
                }}
              >
                VOTING PERIOD
              </BrandText>
            </View>
          )}

          {isRejectedPeriod && (
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#171717",
                borderRadius: 100,
                height: 27,
                width: 95,
                position: "absolute",
                left: 20,
                top: 20,
              }}
            >
              <BrandText
                style={{
                  fontSize: 13,
                  color: "#FFAEAE",
                }}
              >
                REJECTED
              </BrandText>
            </View>
          )}

          {isPassedPeriod && (
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#171717",
                borderRadius: 100,
                height: 27,
                width: 90,
                position: "absolute",
                left: 20,
                top: 20,
              }}
            >
              <BrandText
                style={{
                  fontSize: 13,
                  color: "#C8FFAE",
                }}
              >
                PASSED
              </BrandText>
            </View>
          )}

          <BrandText
            style={{
              fontSize: 18,
              color: "#808080",
              position: "absolute",
              left: 20,
              right: 20,
              top: 65,
            }}
          >
            {numberProposalHashtag}
          </BrandText>

          <BrandText
            style={{
              fontSize: 18,
              position: "absolute",
              left: 70,
              right: 0,
              top: 65,
            }}
          >
            {titleProposal}
          </BrandText>

          <BrandText
            style={{
              overflow: "scroll",
              fontSize: 18,
              color: "#808080",
              width: 550,
              height: 76,
              position: "absolute",
              left: 20,
              right: 20,
              top: 115,
            }}
          >
            {descriptionProposal}
          </BrandText>

          <View
            style={{
              width: "94%",
              height: 3,
              alignItems: "center",
              backgroundColor: "#333333",
              borderRadius: 10,
              position: "absolute",
              top: 210,
            }}
          >
            <View
              style={{
                width: percentageYes,
                height: 3,
                borderRadius: 10,
                position: "absolute",
                left: 0,
                zIndex: 2,
              }}
            >
              <LinearGradient
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{ height: "100%", width: "100%", borderRadius: 24 }}
                colors={["#5433FF", "#20BDFF", "#A5FECB"]}
              />
            </View>

            <View
              style={{
                width: percentageNo,
                height: 3,
                backgroundColor: "#EAA54B",
                borderRadius: 10,
                position: "absolute",
                left: percentageYes, //percentage of the width of the first view
                zIndex: 2,
              }}
            />
          </View>
          <BrandText
            style={{
              fontSize: 12,
              color: "#808080",
              position: "absolute",
              left: 20,
              right: 20,
              top: 230,
            }}
          >
            Voting End Time
          </BrandText>

          <BrandText
            style={{
              fontSize: 13,
              position: "absolute",
              left: 20,
              right: 0,
              top: 250,
            }}
          >
            {votingEndTime.slice(0, 10)}
            &nbsp;
            {votingEndTime.slice(11, 16)}
            &nbsp; UTC
          </BrandText>

          <View
            style={{
              width: 45,
              height: 0,
              borderWidth: 0.5,
              borderColor: "#808080",
              transform: [{ rotate: "90deg" }],
              position: "absolute",
              left: 160,
              top: 250,
            }}
          />

          <BrandText
            style={{
              fontSize: 12,
              color: "#808080",
              position: "absolute",
              left: 205,
              right: 20,
              top: 230,
            }}
          >
            Turnout
          </BrandText>

          <BrandText
            style={{
              fontSize: 13,
              position: "absolute",
              left: 205,
              right: 0,
              top: 250,
            }}
          >
            {percentageTotalParticipant}
          </BrandText>

          <View
            style={{
              width: 45,
              height: 0,
              borderWidth: 0.5,
              borderColor: "#808080",
              transform: [{ rotate: "90deg" }],
              position: "absolute",
              left: 255,
              top: 250,
            }}
          />

          <BrandText
            style={{
              fontSize: 12,
              color: "#808080",
              position: "absolute",
              left: 300,
              right: 20,
              top: 230,
            }}
          >
            Most voted on
          </BrandText>

          <View
            style={{
              width: 8,
              height: 8,
              backgroundColor: colorMostVoted,
              borderRadius: 4,
              position: "absolute",
              left: 300,
              top: 255,
            }}
          />

          <BrandText
            style={{
              fontSize: 13,
              position: "absolute",
              left: 315,
              right: 0,
              top: 250,
            }}
          >
            {toppercentage}
          </BrandText>
        </TertiaryBox>
      </a>
    </View>
  );
};
