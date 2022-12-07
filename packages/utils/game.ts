import { Coin, toUtf8 } from "cosmwasm";

import backpackSVG from "../../assets/game/backpack.svg";
import coinStakeSVG from "../../assets/game/coin-stake.svg";
import controllerSVG from "../../assets/game/controller.svg";
import lightningBoltSVG from "../../assets/game/lightning-bolt.svg";
import markSVG from "../../assets/game/mark.svg";
import medalSVG from "../../assets/game/medal.svg";
import nft1 from "../../assets/game/nft-1.png";
import nft2 from "../../assets/game/nft-2.png";
import nft3 from "../../assets/game/nft-3.png";
import nft4 from "../../assets/game/nft-4.png";
import nft5 from "../../assets/game/nft-5.png";
import subtractSVG from "../../assets/game/subtract.svg";
import toolSVG from "../../assets/game/tool.svg";
import { THE_RIOT_BREEDING_CONTRACT_ADDRESS } from "../screens/RiotGame/settings";
import { GameBgCardItem } from "../screens/RiotGame/types";
import { UserScore } from "./../api/p2e/v1/p2e";

const THE_RIOT_SQUAD_STAKING_CONTRACT_ADDRESS =
  process.env.THE_RIOT_SQUAD_STAKING_CONTRACT_ADDRESS || "";
const THE_RIOT_NFT_CONTRACT_ADDRESS =
  process.env.THE_RIOT_NFT_CONTRACT_ADDRESS || "";
const REWARD_COEF = 100;

export const parseUserScoreInfo = (userScore: UserScore) => {
  const { inProgressScore, snapshotScore, rank, snapshotRank } = userScore;

  // Duration is in seconds
  const hours = Math.floor((100 * inProgressScore) / 60 / 60) / 100;
  const xp = hours * REWARD_COEF;
  const scoreChanges =
    Math.floor(10_000 * ((inProgressScore - snapshotScore) / snapshotScore)) /
    100;
  const rankChanges = rank - snapshotRank;
  return { xp, hours, rankChanges, scoreChanges };
};

export const getRipperRarity = (
  ripper: NSRiotGame.RipperDetail
): NSRiotGame.RipperRarity => {
  let rarity: NSRiotGame.RipperRarity;

  const ripperSkin = ripper.attributes.find(
    (attr) => attr.trait_type === "Skin"
  )?.value;

  switch (ripperSkin) {
    case "Pure Gold":
    case "Pure Oil":
    case "Alloy":
      rarity = "Uncommon";
      break;
    case "Aurora":
    case "Cosmos":
    case "Supernova":
      rarity = "Rare";
      break;
    case "Marble":
    case "Ice":
    case "Lava":
      rarity = "Epic";
      break;
    case "Grey Ether":
    case "Green Ether":
    case "Blue Ether":
    case "Purple Ether":
    case "Red Ether":
      rarity = "Legendary";
      break;
    case "Iron":
    case "Silver":
    case "Bronze":
    default:
      rarity = "Common";
  }

  return rarity;
};

export const getRipperTraitValue = (
  ripper: NSRiotGame.RipperDetail,
  traitType: NSRiotGame.RipperTraitType
) => {
  let res: any = ripper?.attributes.find(
    (attr) => attr.trait_type === traitType
  )?.value;

  if (res === undefined || res === "None") {
    res = null;
  } else if (Number.isInteger(res)) {
    res = parseInt(res, 10);
  }

  return res;
};

export const getRipperTokenId = (ripperListItem: NSRiotGame.RipperListItem) =>
  ripperListItem.id.split("-")[2];

export enum StakingState {
  UNKNOWN = "UNKNOWN",
  ONGOING = "ONGOING",
  RELAX = "RELAX",
  COMPLETED = "COMPLETED",
}

export const buildApproveNFTMsg = (
  sender: string,
  spender: string,
  tokenId: string
) => {
  return {
    typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
    value: {
      sender,
      msg: toUtf8(
        JSON.stringify({
          approve: {
            spender,
            token_id: tokenId,
          },
        })
      ),
      contract: THE_RIOT_NFT_CONTRACT_ADDRESS,
      funds: [],
    },
  };
};

export const buildBreedingMsg = (
  sender: string,
  breedingPrice: Coin,
  tokenId1: string,
  tokeId2: string
) => {
  return {
    typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
    value: {
      sender,
      msg: toUtf8(
        JSON.stringify({
          breed: {
            nft_token_id1: tokenId1,
            nft_token_id2: tokeId2,
          },
        })
      ),
      contract: THE_RIOT_BREEDING_CONTRACT_ADDRESS,
      funds: [breedingPrice],
    },
  };
};

export const buildStakingMsg = (sender: string, tokenIds: string[]) => {
  return {
    typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
    value: {
      sender,
      msg: toUtf8(
        JSON.stringify({
          stake: {
            token_ids: tokenIds,
          },
        })
      ),
      contract: THE_RIOT_SQUAD_STAKING_CONTRACT_ADDRESS,
      funds: [],
    },
  };
};

export const gameBgData: GameBgCardItem[] = [
  { id: 1, type: "BLANK" },
  { id: 2, type: "BLANK" },
  { id: 3, type: "BLANK" },
  { id: 4, type: "BLANK" },
  { id: 5, type: "BLANK" },
  { id: 6, type: "BLANK" },
  { id: 7, type: "BLANK" },
  {
    id: 8,
    type: "POINTS",
    data: {
      label: "Luck",
      value: "13.6",
    },
  },
  {
    id: 9,
    type: "BLANK",
  },
  {
    id: 10,
    type: "IMAGE",
    data: {
      source: nft1,
    },
  },
  {
    id: 11,
    type: "IMAGE",
    data: {
      source: nft2,
    },
  },
  { id: 12, type: "BLANK" },
  {
    id: 13,
    type: "POINTS",
    data: {
      label: "Stamina",
      value: "10.7",
    },
  },
  { id: 14, type: "BLANK" },
  { id: 15, type: "BLANK" },
  { id: 16, type: "BLANK" },
  {
    id: 17,
    type: "IMAGE",
    data: {
      source: nft3,
    },
  },
  { id: 18, type: "BLANK" },
  { id: 19, type: "BLANK" },
  { id: 20, type: "BLANK" },
  {
    id: 21,
    type: "ICON",
    data: {
      source: markSVG,
    },
  },
  {
    id: 22,
    type: "ICON",
    data: {
      source: subtractSVG,
    },
  },
  {
    id: 23,
    type: "ICON",
    data: {
      source: backpackSVG,
    },
  },
  {
    id: 24,
    type: "ICON",
    data: {
      source: toolSVG,
    },
  },
  { id: 25, type: "BLANK" },
  { id: 26, type: "BLANK" },
  {
    id: 27,
    type: "ICON",
    data: {
      source: medalSVG,
    },
  },
  {
    id: 28,
    type: "ICON",
    data: {
      source: lightningBoltSVG,
    },
  },
  {
    id: 29,
    type: "ICON",
    data: {
      source: controllerSVG,
    },
  },
  {
    id: 30,
    type: "ICON",
    data: {
      source: coinStakeSVG,
    },
  },
  { id: 31, type: "BLANK" },
  { id: 32, type: "BLANK" },
  { id: 33, type: "BLANK" },
  {
    id: 34,
    type: "IMAGE",
    data: {
      source: nft4,
    },
  },
  { id: 35, type: "BLANK" },
  {
    id: 36,
    type: "POINTS",
    data: {
      label: "Protection",
      value: "12.8",
    },
  },
  { id: 37, type: "BLANK" },
  { id: 38, type: "BLANK" },
  { id: 39, type: "BLANK" },
  { id: 40, type: "BLANK" },
  { id: 41, type: "BLANK" },
  { id: 42, type: "BLANK" },
  { id: 43, type: "BLANK" },
  {
    id: 44,
    type: "POINTS",
    data: {
      label: "hp",
      value: "9.9",
    },
  },
  { id: 45, type: "BLANK" },
  { id: 46, type: "BLANK" },
  { id: 47, type: "BLANK" },
  {
    id: 48,
    type: "IMAGE",
    data: {
      source: nft5,
    },
  },
  { id: 49, type: "BLANK" },
  { id: 50, type: "BLANK" },
];
