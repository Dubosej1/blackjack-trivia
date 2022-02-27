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

Before the start of a round, PLAYER is able to place a bet on whether they can win the upcoming round or not.  This bet is called the [BASE BET].

PLAYER has a [BANK] of money, that they can use to bet with.  PLAYER is free to bet whatever amount of money they want, as long as they have money in their bank.  When they run out of money in their bank, they're no longer able to play anymore and its GAME OVER.

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

The objective of the game is to have 21 total points a hand, or as close to 21 pts as possible, while beating DEALER's hand total.  You can't go over 21 pts.

## Flow of the Game

After all betting and card dealing are over, it'll be PLAYER's turn.  PLAYER has a variety of actions that they can take, in order to help their odds of winning the round and more money, or minimize their risk of losing money. 

Once PLAYER's turn is over, then DEALER will be able to act.  DEALER has a predetermined set of actions that they have to take during their turn.

Once DEALER's turn is over, the round will end and the outcome of the round is determined.  Any Base Bets will be resolved at this point and PLAYER will receive their winnings, if applicable.

If PLAYER has any Side Bets, they are resolved at first opportunity.  See [SIDE BETS](side-bet-rules.md) for more info on this.

Then the next round will begin, rinse and repeat.

## Hit

After you are dealt your initial 2 cards, it will be your turn to act.  If you think your HAND needs more points to reach 21, then you can HIT and the Dealer will deal you another card to add to your HAND.  You can HIT as many times as you want, as long as your point total doesn’t go over 21.

## Stand

Whenever you’re satisfied with your HAND’s point total, you can STAND.  When you STAND, your turn will end and it’ll be the Dealer’s turn.   You won’t have another opportunity to add cards to your hand for the rest of the round.

## Double Down

After you’re dealt your initial 2 cards, you’ll have the opportunity to DOUBLE DOWN.  When you DOUBLE DOWN, your Base Bet will double and the Dealer will deal you only 1 extra card.  After you’re dealt this extra card, you will automatically STAND and it’ll be the Dealer’s Turn.

NOTE: DOUBLE DOWN is only available as the first move after you’re dealt your initial 2 cards.  If you choose another action, you won’t be able to DOUBLE DOWN anymore.

## Split

If your initial 2 cards have the same card value, then you’ll have the opportunity to SPLIT.  When you SPLIT, each card in your Hand will form the base for a new HAND.  You’re splitting your 1 HAND into 2 separate SPLIT HANDS.  Then the Dealer will deal you 1 additional card for each SPLIT HAND.  Now you have 2 SPLIT HANDS with 2 cards each.

For each new hand you create from a SPLIT, you’ll take out an additional bet equal to your initial Base Bet.  If you don’t have enough money in the bank for an additional bet, then you won’t be able to SPLIT.

As an example, let’s say you have a Base Bet of $100 and your initial 2 cards are a CLUB 6 and a DIAMOND 6.  You’ll be able to SPLIT them!  The CLUB 6 will be the 1st card of your 1st SPLIT HAND and the DIAMOND 6 will be the 1st card of your 2nd SPLIT HAND.  Your 1st SPLIT HAND will inherit your Base Bet of $100, and you’ll place an additional $100 bet for your 2nd SPLIT HAND, for a total bet of $200 for the round.  Then the Dealer will deal an additional card for each of your SPLIT HANDs.  Now your 1st SPLIT HAND will be a CLUB 6 and a SPADE 10, while your 2nd SPLIT HAND will be a DIAMOND 6 and a HEART JACK.  

After you SPLIT, you’ll play each HAND separately against the Dealer’s Hand, one after another.  Each HAND can win or lose against the Dealer’s Hand separately from each other.  

You’ll have the opportunity to HIT and STAND for each hand.  Once you STAND all of your split hands, then it’ll be the Dealer’s turn.  

NOTE: In normal play, you can’t DOUBLE DOWN with an already split hand.  But you can change this with the “Double Down after Split” setting in the Options Menu.  See OPTIONS for more info.

NOTE: In normal play, you can’t SPLIT an already split hand (this is called “Resplitting).  You can change this with the “Resplitting Allowed” setting in the Options Menu.  If you turn the setting on, you can resplit up to a total of 4 SPLIT HANDs.  There are a variety of other options related to Resplitting.  See OPTIONS for more info.

NOTE: In normal play, you can only SPLIT cards that have the same “card” value.  For example, you can split two 7s and two KINGs, but you can’t split a JACK or a QUEEN, even though they have the same point value.  If you want to SPLIT cards with the same point value, you can change the “Split any 10 pt value card” setting via the Options Menu.  See OPTIONS for more info.

NOTE: In normal play, you can’t SPLIT if your initial 2 cards are two ACES.  If you want to split ACES, you can change the “Splitting Aces Allowed” setting via the Options Menu.  See OPTIONS for more info.

NOTE: You can only SPLIT as the first move after you are dealt your initial 2 cards.  If you choose another action, you won’t be able to SPLIT anymore.  This applies to resplitting SPLIT HANDS too, if you have resplitting activated via the OPTIONS Menu.

## Bust

If your HAND has over 21 pts, then your Hand will BUST.  When this happens, the round will immediately end and Player’s HAND loses the round.  The Dealer’s HAND can also BUST, and they will lose the round.

If a Player’s split hand BUSTS, then the round will continue as normal unless all split hands BUSTS, then the round immediately ends.

## Trivia Question

In normal play, whenever you HIT or DOUBLE DOWN, you will be asked a Trivia Question.  If you successfully answer the Trivia Question, then the Dealer will deal you the card.  If you get the question wrong, then you will automatically STAND and it’ll be the Dealer’s Turn.  See the TRIVIA section for more info about this.

NOTE: You can turn the Trivia Question feature off with the “Trivia Mode” setting via the Options Menu.  See OPTIONS for more info.

H2: Soft Hands vs Hard Hands

If you recall, an ACE can either be worth 1 pt or 11pts, depending on whichever point value brings the HAND’s total value closest to 21 pts.

When a HAND has an ACE in it, the HAND is considered to be a SOFT hand, since the HAND can be worth 2 different total values (a HAND without an ACE in it is a HARD hand).  For example, if the Player’s HAND has a HEART ACE and CLUB 9, then the Player has a SOFT 20 HAND (Ace = 11 pts, 9 = 9 pts).

If an ACE’s 11 pts will put a HAND over 21 pts, then the ACE will automatically be only worth 1 pt and the SOFT HAND will become a HARD HAND (since it can only be 1 total value now).  For example, if the Player’s HAND has a HEART ACE, CLUB 9 and a DIAMOND 4, then the PLAYER now has a HARD 14 HAND (Ace = 1 pt, 9 = 9 pts, 4 = 4pts).

## Dealer’s Turn

After your turn is over, it’ll be the Dealer’s Turn to try to reach 21 pts.  The Dealer will only be able to HIT or STAND with their hand.  The Dealer can’t SPLIT or DOUBLE DOWN their HAND, as they’re not betting.  The Dealer also won’t be required to answer a Trivia Question when they HIT.

The Dealer has certain rules on when they can HIT or STAND with their hand.  By default, the Dealer has to STAND on a SOFT 17 HAND or greater.  For example, if the Dealer’s HAND total is under 17 pts, then the Dealer has to keep HITTING until their point total is 17 pts or above, then they have to STAND.  If the Dealer’s HAND has exactly 17 pts, then the Dealer has to STAND, even if their hand is SOFT.

NOTE: The total value that the Dealer has to STAND on can be changed via the “Dealer Stands On” setting in the Options Menu.  The available options are HARD 16, SOFT 16, HARD 17 and SOFT 17 (default).  If the Dealer Stands on a HARD hand, that means that if the Dealer reaches that exact total value with a SOFT hand, then they can still hit.  See OPTIONS for more info.

## End of the Round

Once the Dealer STANDS, the round ends.  The Dealer’s face down card will be revealed to the Player and the HAND totals will be calculated.  If the Player’s HAND total beats the Dealer’s HAND total without BUSTING, then the Player’s HAND wins and receives a 2:1 payout of the Base Bet.  If the Dealer’s HAND beats the Player’s HAND, then the Player loses and receives nothing.

If the Player has SPLIT HANDs, then each HAND receives a separate payout based on if it wins or loses.  For example, your 1st Split Hand can win a 2:1 payout and your 2nd Split Hand can lose and receive nothing.

## Push

If the Player’s HAND and Dealer’s HAND have the same point total at the end of a round, then their hands will be a PUSH.  When this happens, the Player gets their base bet returned to them for that HAND.

## Natural

If the Player’s initial 2 cards have an exact total of 21 pts (an ACE and 10 pt card), then the Player will have a NATURAL.  When this happens, the round ends immediately and the Player automatically wins.

The Dealer can also have a NATURAL.  If the Dealer’s initial face up card is either an ACE or 10 pt Card, then the Dealer will PEEK at their face down card to see if they have a NATURAL.  If the Dealer has a NATURAL, the round ends immediately and the Dealer reveals their face down card to the Player.  The Player automatically loses.

If the Player and Dealer both have NATURALs, then their hands will be a PUSH and the base bet will be returned to the Player.

The payout for a Player NATURAL is greater than a normal win.  By default, the payout for a NATURAL is 3:2.  This payout amount can be changed with the “Blackjack Payout” setting via the Options Menu.  See OPTIONS for more info.

NOTE: If a split hand’s initial 2 cards equal 21 pts, then that’s NOT considered a NATURAL.

## Surrender

After all of the initial cards are first dealt, the Player has the option to SURRENDER their hand, if they think they’re likely to lose the round.  When the Player SURRENDERS, the round ends immediately and the Player receives half of their Base Bet back.

SURRENDER is only offered as the first move after a Player’s HAND is dealt their initial 2 cards.  SPLIT HANDs can be SURRENDERED, so this applies to those hands as well.  When a Split Hand is SURRENDERED, the round continues as normal, in order to determine the outcome of the other split hands.

By default, if the Dealer’s face up card is either an ACE or 10 pt card, then the Dealer will first PEEK for a NATURAL before the Player can SURRENDER.  This is called a LATE SURRENDER.  If the Dealer has a NATURAL, then the Player can’t SURRENDER their hand and they’ll automatically lose.

An EARLY SURRENDER is when the Player can SURRENDER regardless if the Dealer has a NATURAL or not.  If you want this option, you can choose the “Early Surrender” setting in the Options Menu.  See OPTIONS for more info.

NOTE: The Dealer can’t SURRENDER their hand.

## Charlie

If the Player’s HAND reaches a total of 5 or more cards without BUSTING, then the Player’s HAND is a CHARLIE.  When this happens, the round immediately ends and the Player’s HAND automatically wins.

The Dealer’s hand can also have a CHARLIE.  When that happens, the round immediately ends and the Player automatically loses.

If both the Player and Dealer’s Hands are CHARLIEs, then it’s considered a PUSH and the Player’s bet is returned.

If a Player’s Split Hand has a CHARLIE, then the round continues as normal, in order to determine the outcome of the other split hands.

By default, a CHARLIE is determined at 5 total cards in a HAND.  If “Disable Five Card Charlie” is selected in the Options Menu, then a CHARLIE is determined at 7 cards in a HAND.  See OPTIONS for more info.

## Insurance

If the Dealer’s initial face up card is an ACE, then the Player is given the option of placing an INSURANCE Side Bet.  The purpose of this Side Bet is for the Player to recover some money in case the Dealer has a NATURAL, which would be an automatic Player loss.  The amount of this Side Bet is half of the Base Bet.

After the Insurance Side Bet has been placed, the Dealer peeks at their face down card to check for a NATURAL.

If the Dealer has a NATURAL, the round ends immediately.  The Player loses the round and their Base Bet.  At the same time, The Player wins the INSURANCE Side Bet, which has a payout of 2:1 of the Side Bet.

If the Dealer doesn’t have a NATURAL, then the Player loses the INSURANCE Side Bet and the round continues as normal.

By default, the INSURANCE Side Bet is offered.  You can select “Disable Insurance Bet” in the Options Menu to not have this bet offered.  See OPTIONS for more info.

## Even Money

If the Player has a NATURAL and the Dealer’s initial face up card is an ACE, then the Player is given the option of placing an EVEN MONEY Side Bet.  The purpose of this Side Bet is for the Player to recover some money in case the Dealer also has a NATURAL (which would result in a PUSH and a reduced payout).  The amount of this Side Bet is half of the Base Bet.

Since the round is already ending immediately, the Dealer reveals their face down card to the Player.

If the Dealer has a NATURAL, then the Player wins the Even Money Side Bet, which has a payout of 2:1 of the Side Bet.  The Player’s NATURAL becomes a PUSH and the Player also receives their Base Bet back.

If the Dealer doesn’t have a NATURAL, then the Player loses the EVEN MONEY Side Bet.  However, the Player still has their NATURAL and receives the increased payout for the NATURAL.

By default, the EVEN MONEY Side Bet is offered.  You can select “Disable Even Money Bet” in the Options Menu to not have this bet offered.  See OPTIONS for more info.
