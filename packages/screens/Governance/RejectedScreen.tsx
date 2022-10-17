import React, { useEffect, useState} from "react";

import { ScreenContainer } from "../../components/ScreenContainer"
import { View } from "react-native";

import { BrandText } from "../../components/BrandText/BrandText";
import { GovernanceBox } from "../../components/GovernanceBox/GovernanceBox";

import logoSVG from "../../../assets/logos/logo.svg";
import { SVG } from "../../components/SVG/svg";

import { useAppNavigation } from "../../utils/navigation";
import  {NavBarGovernance} from "./NavBarGovernance";
import { CreateProposalPopUp } from "../../components/GovernanceBox/CreateProposalPopUp"
import { PrimaryButtonOutline } from "../../components/buttons/PrimaryButtonOutline";

export const RejectedScreen: React.FC = () => {
  const [cards, setCards] = useState([])
  const [displayCreateProposal, setdisplayCreateProposal] = useState(false)
  const navigation = useAppNavigation();

  useEffect(() => {
    fetch('https://rest.testnet.teritori.com/cosmos/gov/v1beta1/proposals?proposal_status=4')
      .then(res => res.json())
      .then(kl => setCards(kl.proposals))
  }, [])

  function handleCreateProposal() {
    if (displayCreateProposal == true) {
      return (
        <CreateProposalPopUp visible={true} onClose={() =>  setdisplayCreateProposal(false)}/>
      )
    }
    else
      return ""
  }

  return (
    <ScreenContainer>
      {handleCreateProposal()}
      <View style={{
          flexDirection: "row",
          display: "flex", 
          width: 1240, 
          right: 75, 
          justifyContent: "space-between",
          top: 55,
        }}>
          <BrandText style={{fontSize: 28,}}>
            Decentralized Governance
          </BrandText>

          <View style={{bottom: 10, right: 100}}>
            <NavBarGovernance visible={true} onClose={() => {}}/>
          </View>

          <PrimaryButtonOutline  
            size="SM"
            text="Create Proposal"
            onPress={() => { setdisplayCreateProposal(true)}}/>
      </View>

      <View  
      style={{
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        marginTop: 110,
        marginLeft: -70,
        marginRight: -60,
      }}
      >
        {
          cards.map((proposals: any, item) => (
            <GovernanceBox
              key={item}
              numberProposal={proposals.proposal_id}
              titleProposal={proposals.content.title}
              descriptionProposal={proposals.content.description}
              votingEndTime={proposals.voting_end_time}
              votingStartTime={proposals.voting_start_time}
              votingSubmitTime={proposals.submit_time}
              votingDepositEndTime={proposals.deposit_end_time}
              turnoutValue="80.69%"
              mostVotedValue={parseFloat(proposals.final_tally_result.yes)}
              colorMostVoted="#16BBFF"
              pourcentageNoValue={parseFloat(proposals.final_tally_result.no)}
              pourcentageYesValue={parseFloat(proposals.final_tally_result.yes)}
              pourcentageNoWithVetoValue={parseFloat(proposals.final_tally_result.no_with_veto)}
              pourcentageAbstainValue={parseFloat(proposals.final_tally_result.abstain)}
            />
        ))}

      </View>
      <SVG width={200} height={200} style={{marginTop: 190, marginLeft:"40%"}} source={logoSVG} />
    </ScreenContainer>
  );
};
