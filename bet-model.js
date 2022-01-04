class Bet {
  bank;
  tempBank;
  baseBet = 0;
  tempBaseBet = 0;
  sideBetTotal = 0;
  tempSideBetTotal = 0;
  sideBet = [];
  sideBetPlacedModalActive;

  constructor(bank) {
    this.bank = bank;
    this.tempBank = bank;
  }

  updateTempBaseBet(addend) {
    this.tempBaseBet = this.tempBaseBet + addend;
    this.tempBank = this.tempBank - addend;
  }

  clearTempBaseBet() {
    this.tempBaseBet = 0;
    this.tempBank = this.bank;
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
    let sideBetObj = this.getSideBet(sideBet);

    let sideBetIndvTotal = sideBetObj.getTempTotal();

    this.tempSideBetTotal = this.tempSideBetTotal - sideBetIndvTotal;
    this.tempBank = this.tempBank + sideBetIndvTotal;

    sideBetObj.clearTempBet();
  }

  getSideBet(sideBet) {
    return this.sideBet.find((obj) => obj.key === sideBet);
  }

  getTempSideBetTotalValue() {
    return this.tempSideBetTotal;
  }

  getTempBank() {
    return this.tempBank;
  }

  getSideBetsPlacedModalText() {
    let modalText = [];
    this.sideBet.forEach(function (obj) {
      modalText.push(obj.getSideBetAmountInfoText());
    });
    return modalText.join();
  }

  clearSideBets() {
    //   let length = this.sideBet.length;

    for (let i = 0; i <= this.sideBet.length; i++) {
      this.sideBet.pop();
    }
    this.tempBank = this.tempBank + this.tempSideBetTotal;
    this.tempSideBetTotal = 0;
  }

  toggleSideBetPlacedModalActive(boolean) {
    if (boolean) this.sideBetPlacedModalActive = true;
    else this.sideBetPlacedModalActive = false;
  }
}

class SideBet extends Bet {
  total = 0;
  tempTotal = 0;
  name;
  key;
  rules;
  payout;

  constructor(obj) {
    let { name, key, rules, payout } = obj;
    super();
    this.name = name;
    this.key = key;
    this.rules = rules;
    this.payout = payout;
  }

  updateTempBetTotal(addend) {
    this.tempTotal = this.tempTotal + addend;
  }

  clearTempBet() {
    this.tempTotal = 0;
  }

  getTempTotal() {
    return this.tempTotal;
  }

  getSideBetAmountInfoText() {
    let text = `${this.name} : $${this.tempTotal} Bet <br>`;
    return text;
  }
}

const perfectPair = {
  name: `Perfect Pair`,
  key: `perfectPair`,
  rules: `rules`,
  payout: `payout`,
};

const twentyOnePlusThree = {
  name: `21 + 3`,
  key: `21Plus3`,
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
      sideBet = new SideBet(twentyOnePlusThree);
      break;
    default:
      console.log(`no side bet`);
  }

  return sideBet;
}
