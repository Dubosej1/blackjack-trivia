class Bet {
  bank;
  tempBank;
  baseBet;
  tempBaseBet;
  sideBetTotal;
  tempSideBetTotal;
  sideBet = [];

  constructor(bank) {
    this.bank = bank;
    this.tempBank = bank;
  }

  updateTempBaseBetTotal(addend) {
    this.tempBaseBet = this.tempBaseBet + addend;
    this.tempBank = this.tempBank - addend;
  }

  clearTempBaseBet() {
    this.tempBaseBet = 0;
    this.bank = this.bank;
  }

  addSideBetObj(sideBetObj) {
    this.sideBet.push(sideBetObj);
  }

  checkSideBetExists(sideBet) {
    if (this.getSideBet(sideBet)) return true;
    else return false;
  }

  updateSideBetAmount(sideBet, addend) {
    let sideBetObj = this.getSideBet(sideBet);

    sideBetObj.updateTempBetTotal(addend);
    this.tempSideBetTotal = this.tempSideBetTotal + addend;
    this.tempBank = this.tempBank - addend;
  }

  clearTempSideBetAmount(sideBet) {
      let sideBetObj = getSideBet(sideBet);

      let sideBetIndvTotal = sideBetObj.getTempTotal();

      this.tempSideBetTotal = this.tempSideBetTotal - sideBetIndvTotal;
      this.tempBank = this.tempBank + sideBetIndvTotal;

      sideBetObj.clearTempBet();
  }

  get getSideBet (sideBet) {
      return this.sideBet.find((obj) => obj.key === sideBet);
  }

  get getTempSideBetTotalValue () {
      return this.tempSideBetTotal
  }
}

class SideBet extends Bet {
  total;
  tempTotal;

  constructor(obj) {
    let [rules, payout] = obj;
    this.rules = rules;
    this.payout = payout;
  }

  updateTempBetTotal(addend) {
    this.tempTotal = this.tempTotal + addend;
  }

  clearTempBet() {
      this.tempTotal = 0;
  }

  getTempTotal () {
      return this.tempTotal;
  }
}

const perfectPair = {
  name: `Perfect Pair`,
  key: `perfectPair`,
  rules: `rules`,
  payout: `payout`,
};

export function initBaseBet(bank) {
  let bet = new Bet(bank);
  return bet;
}

export function generateSideBetObj(name) {
  let sideBet;

  switch (name) {
    case "perfectPair":
      sideBet = new SideBet(perfectPair);
      break;
    case `21Plus3`:
      sideBet = new SideBet(TwentyOnePlusThree);
      break;
    default:
      console.log(`no side bet`);
  }

  return sideBet;
}