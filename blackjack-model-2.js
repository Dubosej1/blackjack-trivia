let player = {
  bank: 0,
  betAmount: 0,

  set updateBank(bank) {
    this.bank = bank;
  },

  set updateBetAmount(betAmount) {
    this.betAmount = betAmount;
  },
};

export function checkValidBet(submittedBet) {
  if (submittedBet > player.bank) return false;
  return true;
}

export function collectBankBetAmount() {
  return [player.bank, player.betAmount];
}

export function updateModelBank(bank) {
  player.updateBank(bank);
}

export function updateModelBetAmount(betAmount) {
  player.updateBetAmount(betAmount);
}
