# Basic Blackjack Trivia Rules

## General Overview

Blackjack Trivia is a game app that combines the classic card game Blackjack with answering trivia questions.

Blackjack is played with standard decks of 52 cards, usually 2 or more decks shuffled together.

In normal Blackjack, the game is usually played with 2+ players, with one of the players performing the role of "Dealer".  The Dealer deals the other players their cards and the other players play against them.  However, this game app is a 1 player game, with the Dealer being CPU controlled.

Initially, the Dealer deals 2 cards to the Player and to itself.  Each card is worth a certain point value.  The object of the game is to have a hand of cards that is as close to 21 total points as possible, without going over.

The Player is able to place a bet on whether they can beat the Dealer’s hand total, without going over 21 pts.  The Player will have a bank of money to bet money from.  The Player can keep playing and betting on rounds of Blackjack, as long as they have money in their bank.  If the Player runs out of money in their bank, it’s GAME OVER.

Throughout a round of Blackjack, the Player and the Dealer can be dealt additional cards.  In this game app, when the Player wants an additional card, they’ll have to successfully answer a trivia question.  The Player has a separate bank of Trivia Credits that they can win or lose, by correctly and incorrectly answering trivia credits respectively.  If the Player runs out of Trivia Credits, it’s also GAME OVER.

## The Player and The Dealer

Blackjack Trivia is a 1 player game.  You will be playing as the sole PLAYER in the game.  PLAYER will be playing against the DEALER, who is CPU controlled.  The DEALER's job is to deal cards to itself and PLAYER throughout the course of the game.

## Betting

#### Base Bet

Before the start of a round, PLAYER is able to place a bet on whether they can beat DEALER in the upcoming round or not.  This bet is called the [BASE BET].

PLAYER has a [BANK] of money, that they can use to bet with.  PLAYER is free to bet whatever amount of money they want, as long as they have money in their bank.  

>:warning: **Warning**  
>If PLAYER runs out of money in their bank, they're no longer able to play anymore and its GAME OVER.

#### Side Bets

PLAYER is also able to place [SIDE BETS], bets that they can place in addition to the Base Bet.  Side Bets usually have their own sets of rules and conditions of winning, based on what happens during the round.  This topic is covered more in-depth in the [SIDE BETS](side-bet-rules.md) section of the documenation.

## Dealing the Cards

At the start of the game, DEALER will deal 2 cards to itself and PLAYER.  

PLAYER's cards will both be face up.  DEALER's 1st card will be face up, while the 2nd card will be face down and non-visible to PLAYER.  DEALER's face down card is known as the [HOLE CARD].  

The PLAYER and DEALER cards are referred to as their [HAND].

## Card Point Values

Each card is assigned a point value, based on the rank of the card.  The suits don't matter.

The point values are:

- Number cards (Cards 2 - 10) are worth their rank.

- Face cards (Jack, Queen, or King) are worth 10 pts.

- Aces are worth either 1 pt or 11 pts, based on whichever value gets a hand closest to 21 pts.

10 pt value cards (10, JACK, QUEEN, KING) are referred to as [TEN-CARDS] collectively.

## Objective of the Game

The objective of the game is to have 21 total points in a hand, or as close to 21 pts as possible, while beating DEALER's hand total.  You can't go over 21 pts.

## Flow of the Game

After all betting and card dealing are over, it'll be PLAYER's turn.  PLAYER has a variety of actions that they can take, in order to help their odds of winning the round and more money, or minimize their risk of losing money. 

Once PLAYER's turn is over, then DEALER will be able to act.  DEALER has a predetermined set of actions that they have to take during their turn.

Once DEALER's turn is over, the round will end and the outcome of the round is determined.  Any Base Bets will be resolved at this point and PLAYER will receive their winnings, if applicable.

If PLAYER has any Side Bets, they are resolved at first opportunity.  See [SIDE BETS](side-bet-rules.md) for more info on this.

Then the next round will begin, rinse and repeat.

## Hit

This is an action that is available to PLAYER throughout their turn.

`[HIT]` is a request PLAYER makes to DEALER, for them to deal them 1 additional card.  Usually a player `Hits` when they think their hand total is too low to win with.

PLAYER can `Hit` as many times as they want during the round, as long as their hand doesn't go over 21 pts.

In this game app, if PLAYER wants to `Hit`, then they'll have to successfully answer a Trivia Question.  See TRIVIA SECTION for more info on this.

DEALER is also able to `Hit` and that's covered in the [DEALER'S TURN](#dealer39**s-turn) section of this page.

## Stand

This is an action that is available to PLAYER throughout their turn.

`[STAND]` is an indication PLAYER makes that they're done making actions on their current hand.  PLAYER won't have any other opportunities to add cards to that hand afterwards.

Usually a player `Stands` when they think their current hand is as close to 21 pts as they can get.

If PLAYER is playing a single hand and they `Stand`, then their turn ends and it'll be DEALER's turn.  If PLAYER is playing multiple hands and they `Stand`, then their turn continues until they have played all of their hands.

DEALER is also able to `Stand` and that's covered in the [DEALER'S TURN](#dealer39s-turn) section of this page.

## Double Down

This is an action that is available to PLAYER **only** as the first action of playing a hand.

`[DOUBLE DOWN]` is a special request that PLAYER makes to DEALER.  PLAYER's Base Bet will be doubled and DEALER will deal them **ONLY** 1 additional card.  After PLAYER is dealt this extra card, the hand will automatically be `Stand`.

**NOTE**: DEALER is unable to `Double Down`.

## Split

This is an action that is available to PLAYER **only** as the first action of playing a hand.

`[SPLIT]` is a special request that PLAYER makes to DEALER.  If the 2 card's in PLAYER's initial hand have the same rank, then PLAYER can split the hand.  Each card will be the 1st card of 2 new [SPLIT HANDS].  Then DEALER will deal 1 additional card to each of those split hands.  The end result is PLAYER goes from having 1 initial hand with 2 cards, to having 2 split hands with 2 cards in each of them.


>Splitting Hands Example:
>
>**Before `Split`**:
>
>>HAND: `7-SPADES`, `7-HEARTS`
>
>**After `Split`**:
>
>>SPLIT HAND 1: `7-SPADES`, `5-DIAMONDS`
>>
>>SPLIT HAND 2: `7-HEARTS`, `QUEEN-CLUBS`
>

**NOTE**: DEALER is unable to `Split`.

#### Splitting Cards with the Same Rank vs Point Value

By default, PLAYER can only `Split` cards that have the same rank.  PLAYER is **NOT** allowed to `Split` cards that have the same point value, but different rank.

>**Allowed**:
>
>>HAND: `8-SPADES`, `8-HEARTS`
>
>>HAND: `QUEEN-SPADES`, `QUEEN-DIAMONDS`
>
>**NOT Allowed**:
>
>>HAND: `10-CLUBS`, `JACK-CLUBS`
>
>>HAND: `QUEEN-SPADES`, `KING-HEARTS`
>

This can be changed with the ["Split Any Ten-Card"](options-menu.md#split-any-ten-card) setting in the Options Menu.  Click the link for more info.

#### Splitting Aces

By default, PLAYER is **NOT** allowed to `Split` a hand with 2 ACES.

This can be changed with the ["Splitting Aces Allowed"](options-menu.md#splitting-aces-allowed) setting in the Options Menu.  Click the link for more info.


#### Split Betting

When PLAYER `Splits` a hand, the 1st Split Hand will inherit the Base Bet of the initial hand.  As for the 2nd Split Hand, PLAYER needs to take out an additional Base Bet for it.

>:warning: **WARNING**:  
>If PLAYER doesn't have enough money in their Bank for an additional Base Bet, then they won’t be able to `Split`.

>Split Betting Example:
>
>**Before `Split`**:
>
>>HAND: Base Bet = $100
>>
>>BET TOTAL: $100
>
>**After `Split`**:
>
>>SPLIT HAND 1: Base Bet = $100
>>
>>SPLIT HAND 2: Base Bet = $100
>>
>>BET TOTAL: $200
>

#### Game Flow with Split Hands

After PLAYER `Splits`, they'll play each Split Hand separately against the Dealer’s Hand, one after another.  Each Split Hand can win or lose against the Dealer’s Hand separately from each other.

#### Player Actions for Split Hands

PLAYER can `Hit` and `Stand` for each Split Hand.

When PLAYER `Stands` a Split Hand, if they have another one available, then their turn will continue with the other Split Hand.  Once PLAYER `Stands` all of their split hands, then it’ll be the DEALER's turn.

#### Double Down after Split

By default, PLAYER is **NOT** allowed to `Double Down` with an already Split Hand.  

This can be changed this with the [“Double Down after Split”](options-menu.md#double-down-after-split) setting in the Options Menu.  Click link for more info.

#### Resplitting

[RESPLITTING] is when a player `Splits` a Split Hand.  By default, PLAYER is **NOT** allowed to do this.

This can be changed with the ["Resplitting Allowed"](options-menu.md#resplitting-allowed) setting in the Options Menu.  Click the link for more info.

If Resplitting is allowed, PLAYER is allowed to resplit up to a maximum total of 4 Split Hands.

>:warning: **Warning**:  
>If Resplitting is allowed, PLAYER is only allowed to `Split` a Split Hand at the very beginning of playing that Split Hand.  Same as a normal `Split`.

**NOTE**: There are a variety of other options related to Resplitting.  See [Options Menu](options-menu.md) for more info.


## Bust

Whenever a hand goes over 21 total pts, then that hand is a [BUST].

If PLAYER's hand BUSTS, then the round immediately ends and PLAYER automatically loses.  DEALER doesn't play their turn.

DEALER's hand can also BUST.  When this happens, normally it's an automatic loss for DEALER.

If a PLAYER's Split Hand BUSTS, it's an automatic loss for that hand.  However, the round still continues as normal, in order to determine the outcomes of the other Split Hands.  If all the other Split Hands already have an outcome determined (such as BUST, CHARLIE or SURRENDER), then the round ends and DEALER's turn is skipped.

>:warning: **WARNING**:  
>When a Split Hand and DEALER's hand both BUST, then that Split Hand will still lose.

## Trivia Mode

In this game app, whenever PLAYER `Hits` or `Doubles Down`, they will be asked a Trivia Question.  

If they correctly answer the Question, then DEALER will deal them the card.  If they answer incorrectly, their hand will automatically `Stand`.

By default, Trivia Mode is active.  But this can be changed

#### Question Types

PLAYER can select the difficulty of the question they have to answer, either EASY, MEDIUM or HARD.  There are bonuses for answering MEDIUM and HARD difficulty questions.  See the next subsection "Trivia Credits" for more info.

The question is chosen at random from a variety of different categories.  They can either be a Multiple Choice question or True/False question.


#### Trivia Credits

Trivia Mode has its own point system named [TRIVIA CREDITS].  PLAYER starts out with 10 Credits.

PLAYER loses 1 Credit for every incorrect answer.

PLAYER can gain more Credits by answering questions of a certain difficulty.

- EASY questions earn no Credits

- MEDIUM questions earn 1 Credit

- HARD questions earn 5 Credits

If PLAYER runs out of Trivia Credits, its GAME OVER.

#### Turning off Trivia Mode

By default, Trivia Mode is active.  But this can be changed with the ["Trivia Mode"](options-menu.md#trivia-mode) setting in the Options Menu.  Click the link for more info.

When Trivia Mode is inactive, when PLAYER `Hits` or `Doubles Down`, they'll receive their card from DEALER like a regular game of Blackjack.

## Soft Hands and Hard Hands

If you recall, an ACE can either be worth 1 pt or 11 pts, depending on PLAYER's choice.

#### Soft Hand

When a hand has an ACE in it, the hand is considered to be a [SOFT HAND], since the hand can be worth 2 different total values.

When referring to a Soft Hand, the term "SOFT ##" is used, where ## is the higher of the 2 possible total values (when ACE = 11 pts).  For example, SOFT 13 or SOFT 17.

>**Soft Hand Examples**:  
>
>>HAND: `ACE-SPADES`, `3-HEARTS`
>>
>>TOTAL: **4** (1 + 3) OR **14** (11 + 3)
>>
>>SOFT HAND: **SOFT 14**
>
>>HAND: `5-CLUBS`, `ACE-DIAMONDS`, `4-CLUBS`
>>
>>TOTAL: **10** (5 + 1 + 4) OR **20** (5 + 11 + 4)
>>
>>SOFT HAND: **SOFT 20**
>
>>HAND: `ACE-HEARTS`, `ACE-CLUBS`, `7-DIAMONDS`
>>
>>TOTAL: **18** (11 + 1 + 7) OR **9** (1 + 1 + 7)
>

#### Hard Hands

If a hand doesn't have an ACE in it, it's considered to be a [HARD HAND], because there's only 1 possible total value.  Hard Hands have the same terminology as Soft Hands.  Example: HARD 7, HARD 20, etc.

#### Changing from Soft to Hard

Let's say PLAYER or DEALER `Hits` and their Soft Hand goes over 21 pts only when ACE = 11 pts.  Then their Soft Hand changes into a Hard Hand.  This is because now there's only 1 possible total value, instead of 2.

If a hand includes multiple ACES, the hand will remain a Soft Hand as long as 1 of the ACES can still be worth 2 different values.

>Soft to Hard Examples
>
>**Before `Hit`**:
>
>>HAND 1: `ACE-DIAMONDS`, `9-SPADES` **(SOFT 20)**
>>
>>HAND 2: `ACE-SPADES`, `ACE-HEARTS`, `7-CLUBS`  **(SOFT 18)**
>>
>>HAND 3: `ACE-CLUBS`, `10-DIAMONDS`, **(SOFT 21)**
>
>**AFTER `Hit`**
>
>>HAND 1: `ACE-DIAMONDS`, `9-SPADES` + `JACK-CLUBS` **(HARD 20)**
>>
>>HAND 2: `ACE-SPADES`, `ACE-HEARTS`, `7-CLUBS` + `8-SPADES`  **(HARD 17)**
>>
>>HAND 3: `ACE-CLUBS`, `10-DIAMONDS` + `KING-CLUBS` **(HARD 21)**
>

## Dealer's Turn

After PLAYER's turn is over, it'll be DEALER's turn to try and reach a 21 pt hand.

DEALER will only be able to `Hit` or `Stand` with their hand.  DEALER can't `Split`, `Double Down` or `Surrender` their hand.  DEALER will also not be required to answer a Trivia Question when they `Hit`.

DEALER has to abide by certain rules on when they can `Hit` or `Stand` with their hand.  By default, DEALER has to `[STAND ON A SOFT 17]` Hand or greater.  If DEALER's hand total is less than 17, then they have to keep `Hitting` until their total points are at least 17.  Otherwise they `Stand`, regardless if their hand is SOFT or HARD.

>**Example of DEALER `STANDS on SOFT 17`**:
>
>>HAND: `4-SPADES`, `ACE-CLUBS` **(SOFT 15)**
>>
>>**DEALER `HITS`**
>>
>>HAND: `5-SPADES`, `ACE-CLUBS` + `2-DIAMONDS` **(SOFT 17)**
>>
>>**DEALER `STANDS`**

The total hand value that DEALER has to `Stand` on can be changed via the [“Dealer Stands On”](options-menu.md#dealer-stands-on) setting in the Options Menu.  The available options are `HARD 16`, `SOFT 16`, `HARD 17` and `SOFT 17` (default).  Click the link for more info.

If DEALER `Stands on a Hard Hand`, that means that if DEALER reaches that exact total value with a SOFT hand, they are still allowed to `Hit`.

>**Example of DEALER `STANDS on HARD 16`**:
>
>>HAND: `3-DIAMONDS`, `ACE-SPADES` **(SOFT 14)**
>>
>>**DEALER `HITS`**
>>
>>HAND: `3-DIAMONDS`, `ACE-SPADES` + `2-DIAMONDS` **(SOFT 16)**
>>
>>**DEALER `HITS`**
>>
>>HAND: `3-DIAMONDS`, `ACE-SPADES`, `2-DIAMONDS` + `9-DIAMONDS` **(HARD 15)**
>>
>>**DEALER `HITS`**
>>
>>HAND: `3-DIAMONDS`, `ACE-SPADES`, `2-DIAMONDS`, `9-DIAMONDS` + `5-HEARTS` **(HARD 20)**
>>
>>**DEALER `STANDS`**

## Payouts and Winnings

#### Winnings

[WINNINGS] is the money PLAYER will receive for a successful bet outcome.  Winnings are calculated from PLAYER's Bet amount and from the Payout.


#### Payouts

[PAYOUT] is the formula used to calculate the Winnings from the Bet amount.

Payout is usually determined from the outcome of PLAYER's bet.  Different bet outcomes will have different Payouts attached to them, which will be listed in the rules and documentation.

Payout can also be determined from the way in which PLAYER won a bet.  These different ways of winnings a bet are called the bet's [WIN CONDITIONS].  Different Win Conditions will typically have different Payouts attached to them.

#### How to calculate Winnings from Payouts

Typically, Payouts will be in the form of a ratio.  For example: 1:1, 2:1, 3:2, etc.

To calculate the winnings: 

1. First turn the ratio into a fraction.  For example: 1:1 = 1/1, 3:2 = 3/2.  

2. Then multiply the Bet amount by the fraction.  For example: $100 x 3/2 (or 1.5 as a decimal) = $150.

Another method of calculating the winnings:

1. Take the Bet amount and divide it by the 2nd number in the Payout ratio.  For example: If the Bet amount is $100 and the Payout is 3:2, $100 / 2 = $50.

2. Multiply the sum by the 1st number in the Payout ratio.  From the example in #1: $50 x 3 = $150.

Most of the time, the bet is also returned to PLAYER, in addition to the Winnings they've earned.  So typically, the returned bet is lumped into the overall Winnings amount for PLAYER.  When calculating Winnings, also add the bet amount to the final sum.  That is the 3rd and final step in both of the above methods.

>:warning: **WARNING**:
>Some Side Bets and Payouts don't return the bet to PLAYER.  This will always be listed in the rules for the Side Bet and Payout.

>**Examples of Payouts and Winnings**
>
>>Bet Amount: $100, Payout: 5:1
>>
>>Winnings: $600   
>>````
>>Calc Method 1: $100 * (5/1) + $100 = $600  
>>````
>>````
>>Calc Method 2: ($500 / 1) * 5 + $100 = $600  
>>````
>
>>Bet Amount: $50, Payout: 6:5
>>
>>Winnings: $110
>>````
>>Calc Method 1: $50 * (6/5) + $50 = $110
>>````
>>````
>>Calc Method 2: ($50 / 5) * 6 + $50 = $110
>>````  

## Determining Bet Outcomes

#### Ending the Round

When DEALER's turn is over or DEALER's turn is skipped, the round ends.  At this point, DEALER's Hole Card will be revealed to PLAYER.  

The point totals of PLAYER's hand and DEALER's hand will then be matched up against each other.  This will determine the outcome of PLAYER's Base Bet against DEALER.

#### Win

If PLAYER's hand total beats DEALER's hand total without BUSTING, then PLAYER's hand WINS and receives winnings.

The regular hand Payout for winning the round is 1:1.

#### Lose

If DEALER's hand total beats PLAYER's hand total without BUSTING, then PLAYER's hand LOSES and receives nothing.

#### Push

When PLAYER and DEALER end the round with the same hand totals, then the outcome is a TIE or a [PUSH].  When this happens, PLAYER gets their Base Bet returned back to them in "Winnings".

#### Split Hands

If PLAYER has Split Hands, then each Split Hand receives separate winnings based on if it WINS,LOSES or PUSHES.

>**Examples of Determining the Outcome of Split Hands**
>
>>Base Bet: $100
>>
>>Split Hand 1: **HAND WINS**  Winnings: $200 (Payout: 1:1)
>>
>>Split Hand 2: **HAND PUSHES** Winnings: $100 (Returned Base Bet)
>>
>>PLAYER Total Winnings: $300
>
>>Base Bet: $100
>>
>>Split Hand 1: **HAND LOSES**  Winnings: $0
>>
>>Split Hand 2: **HAND WINS** Winnings: $200 (Payout: 1/1)
>>
>>PLAYER Total Winnings: $200

## Natural

#### Player Natural

If PLAYER's initial 2 cards have an exact total of 21 pts (an ACE and TEN-CARD), then PLAYER will have a `[NATURAL]`.  When this happens, the round ends immediately and PLAYER automatically wins.

>:warning: **WARNING**:
>If a Split Hand’s initial 2 cards equal 21 pts, then that’s **NOT** considered a NATURAL and that Split Hand will not received an increased Payout for winning.

#### Dealer Natural

DEALER can also have a `NATURAL`.  

If DEALER's initial face up card is either an ACE or TEN-CARD, then the Dealer will `[PEEK]` at their Hole Card to see if they have a `NATURAL`.  If DEALER has a `NATURAL`, the round ends immediately and DEALER reveals their Hole Card to PLAYER.  PLAYER automatically loses.

#### Natural Push

If Player and Dealer both have `NATURALs`, then the outcome will be a PUSH and the Base Bet will be returned to the Player.

#### Payout for Player Natural

The Payout for a Player NATURAL is greater than a normal win.  By default, the Payout for a `NATURAL` is 3:2.  

The `NATURAL` payout amount can be changed with the [“Blackjack Payout”](options-menu.md#blackjack-payout) setting via the Options Menu.  Click the link for more info.

## Surrender

This is an action that is available to PLAYER **only** as the first action of playing a hand.

PLAYER has the option to `[SURRENDER]` their hand, if they think they’re likely to lose the round.  When PLAYER `Surrenders`, the round ends immediately and PLAYER receives half of their Base Bet back.

This action can be disabled with the ["Disable Surrender"](options-menu.md#disable-surrender) setting in the Options Menu.  Click the link for more info.

**NOTE**: DEALER can't `Surrender` their hand.

#### Split Hands

Split Hands can be `Surrendered`, also only when their initial cards are first dealt.  When a Split Hand is `Surrendered`, the round continues as normal, in order to determine the outcome of the other Split Hands.  If the other Split Hands have `Stand` or their outcomes have been determined, then the round ends.

#### Late Surrender

By default, if DEALER's face up card is either an ACE or TEN-CARD, then DEALER will first `Peek` for a `NATURAL` before the Player can `Surrender`.  This is called a [LATE SURRENDER].  If the Dealer has a `NATURAL`, then the Player can’t `Surrender` their hand and they’ll automatically lose.

#### Early Surrender

An [EARLY SURRENDER] is when the Player can `Surrender` regardless if DEALER has a `NATURAL` or not.  If you want this option, you can choose the [“Early Surrender”](options-menu.md#early-surrender) setting in the Options Menu.  Click the link for more info.

## Charlie

If any Hand reaches a total of 5 or more cards without BUSTING, then that Hand is a `[CHARLIE]` and the round usually ends immediately.

When referring to a `CHARLIE`, the term `[# CARD CHARLIE]` is used, where # is the number of total cards the cardplayer's hand had reached.

If any of PLAYER's hand is a `CHARLIE, then it's an automatic win for that Hand.  If it's a Split Hand, then the round may still continue, if there are other Split Hands needing to be played.

DEALER's hand can also be a `CHARLIE`, and when that happens, it's an automatic loss for PLAYER.

If both PLAYER and DEALER's Hands have `CHARLIES`, then it is considered a PUSH and the PLAYER's Base Bet is returned for that Hand.

By default, a `CHARLIE` is determined at 5 total cards in a Hand.  If [“Disable Five Card Charlie”](options-menu.md#disable-five-card-charlie) is selected in the Options Menu, then a `CHARLIE` can be determined up to a limit 7 cards in a Hand.  Click the link for more info.


## Insurance

[INSURANCE] is a Side Bet that PLAYER can make at the beginning of a round.  It's a [CORE SIDE BET] that is a part of the base Blackjack game.

#### Insurance Basics

If DEALER's initial face up card is an ACE, then PLAYER is given the option of placing an Insurance Bet.  

The purpose of this Side Bet is for PLAYER to recover some money, in case DEALER has a `NATURAL`, which would be an automatic PLAYER loss.

#### Amount of Insurance Bet

The amount of this Side Bet is half of the Base Bet.

#### Determining Insurance Outcome

After the Insurance Bet has been placed, DEALER `Peeks` at their Hole Card to check for a `NATURAL`.

If DEALER has a `NATURAL`, the round ends immediately.  PLAYER loses the round and their Base Bet.  At the same time, PLAYER WINS the Insurance Bet, which has a Payout of 2:1.

If DEALER does NOT have a `NATURAL`, then PLAYER LOSES the Insurance Bet and the round continues as normal.

By default, the Insurance Side Bet is offered.  You can select [“Disable Insurance Bet”](options-menu.md#disable-insurance-side-bet) in the Options Menu to not have this bet offered.  Click the link for more info.

## Even Money

[EVEN MONEY] is a Side Bet that PLAYER can make at the beginning of a round.  It's a Core Side Bet that is a part of the base Blackjack game.

#### Even Money Basics

If PLAYER has a `NATURAL` and DEALER's initial Face Up card is an ACE, then PLAYER is given the option of placing an Even Money Bet.  

The purpose of this Side Bet is for PLAYER to recover some money in case DEALER also has a `NATURAL` (which would result in a PUSH and a reduced payout).

#### Amount of Even Money Bet

The amount of this Side Bet is half of the Base Bet.

#### Determining Even Money Outcome

Since the round is already ending immediately, DEALER reveals their Hole Card to PLAYER.

If DEALER has a `NATURA`L, then PLAYER WINS the Even Money Bet, which has a payout of 2:1.  The Player’s `NATURAL` becomes a PUSH and the PLAYER also receives their Base Bet back.

If DEALER doesn’t have a `NATURAL`, then PLAYER LOSES the Even Money Bet.  However, PLAYER still has their `NATURAL` and receives the increased payout for the `NATURAL`.

By default, the Even Money Side Bet is offered.  You can select [“Disable Even Money Side Bet”](options-menu.md#disable-even-money-side-bet) in the Options Menu to not have this bet offered.  Click the link for more info.

## Payouts at a glance

This is a quick look at all the various Payouts in the round:

- WIN: 1:1 Payout

- LOSE: 0 Payout

- PUSH: Base Bet returned

- SURRENDER: 1/2 Base Bet returned

- NATURAL: 3:2 Payout (default).  Can also be changed to 3:2 and 6:5 Payouts via the Options Menu.

- INSURANCE SIDE BET: 2:1 Payout of Side Bet.

- EVEN MONEY SIDE BET: 2:1 Payout of Side Bet.

**NOTE**: There is no special payout for a CHARLIE win

