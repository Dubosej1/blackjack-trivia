import * as sideBetFunc from "./side-bet-functions.js";

export const perfectPair = {
  name: `Perfect Pair`,
  key: `perfectPair`,
  rules: `rules`,
  beginningSideBetCheck: true,
  sequencePlacement: `initial`,
  outcomeTable: {
    perfect_pair_2: { payout: `200:1`, text: `2 Perfect Pairs` },
    perfect_pair_1: { payout: `25:1`, text: `1 Perfect Pair` },
    colored_pair: { payout: `10:1`, text: `Colored Pair` },
    red_black_pair: { payout: `5:1`, text: `Red/Black Pair` },
    lose: { payout: `0`, text: `Lose: No Pairs...` },
  },
  initSideBet: sideBetFunc.initBaseSideBetSequence,
  calcSideBet: sideBetFunc.calcPerfectPair,
};

export const twentyOnePlusThree = {
  name: `21 + 3`,
  key: `21Plus3`,
  rules: `rules`,
  beginningSideBetCheck: true,
  sequencePlacement: `initial`,
  outcomeTable: {
    jackpot_3_kind: { payout: `jackpot`, text: `Suited 3 of a Kind (Q - A)` },
    suited_3_kind: { payout: `100:1`, text: `Suited 3 of a Kind (2 - Jack)` },
    kind_3: { payout: `33:1`, text: `3 of a Kind` },
    straight_flush: { payout: `35:1`, text: `Straight Flush` },
    straight: { payout: `10:1`, text: `Straight` },
    flush: { payout: `5:1`, text: `Flush` },
    lose: { payout: `0`, text: `No Winning Hand` },
  },
  initSideBet: sideBetFunc.initBaseSideBetSequence,
  calcSideBet: sideBetFunc.calc21Plus3,
};

export const perfect11s = {
  name: `Perfect 11s`,
  key: `perfect11s`,
  rules: `rules`,
  beginningSideBetCheck: true,
  sequencePlacement: `initial`,
  outcomeTable: {
    jackpot_ace_king_spade: {
      payout: `720:10`,
      text: `Jackpot Ace and King of Spades`,
    },
    jackpot_ace_king: { payout: `130:10`, text: `Jackpot Ace and King` },
    suited_11_3_infinity: {
      payout: `25:10`,
      text: `Suited 11 and 3 Infinities`,
    },
    suited_11_2_infinity: {
      payout: `16:1`,
      text: `Suited 11 and 2 Infinities`,
    },
    suited_11: { payout: `15:1`, text: `Suited 11` },
    colored_11: { payout: `10:1`, text: `Colored 11` },
    mixed_11: { payout: `3:1`, text: `Mixed 11` },
    lose: { payout: `0`, text: `No Winning Hand` },
  },
  initSideBet: sideBetFunc.initBaseSideBetSequence,
  calcSideBet: sideBetFunc.calcPerfect11s,
};

export const extraBetBlackjack = {
  name: `Extra Bet Blackjack`,
  key: `extraBetBlackjack`,
  rules: `rules`,
  beginningSideBetCheck: true,
  sequencePlacement: `end`,
  outcomeTable: { payout: `0`, text: `n/a` },
  initSideBet: sideBetFunc.checkValidExtraBetBlackjack,
  calcSideBet: sideBetFunc.calcExtraBetBlackjack,
};

export const houseMoney = {
  name: `House Money`,
  key: `houseMoney`,
  rules: `rules`,
  beginningSideBetCheck: true,
  sequencePlacement: `initial`,
  outcomeTable: {
    suited_ace_king: { payout: `9:1`, text: `Suited Ace and King` },
    straight_flush: { payout: `4:1`, text: `Straight Flush` },
    pair: { payout: `3:1`, text: `Pair` },
    straight: { payout: `1:1`, text: `Straight` },
    lose: { payout: `0`, text: `No Winning Hand` },
  },
  initSideBet: sideBetFunc.initHouseMoney,
  calcSideBet: sideBetFunc.calcHouseMoney,
};
