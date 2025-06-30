"use client";

import { useEffect, useState } from "react";
import { createAndShuffleDeck, drawCards } from "@/lib/deckApi";
import CardList from "@/components/CardList";
import Controls from "@/components/Controls";
import Card from "@/components/Card";

// Define CardType based on your Card structure
type CardType = {
  code: string;
  suit: string;
  value: string;
  image: string;
};

export default function Home() {
  const [deckId, setDeckId] = useState<string | null>(null);
  const [playerHand, setPlayerHand] = useState<CardType[]>([]);
  const [opponentHand, setOpponentHand] = useState<CardType[]>([]);
  const [discardPile, setDiscardPile] = useState<CardType[]>([]);
  const [message, setMessage] = useState<string>("");
  const [isPlayerTurn, setIsPlayerTurn] = useState<boolean>(true);

  useEffect(() => {
    const setupGame = async () => {
      const deck = await createAndShuffleDeck();
      setDeckId(deck.deck_id);

      const draw = await drawCards(deck.deck_id, 12);
      const cards = draw.cards;
      setPlayerHand(cards.slice(0, 5));
      setOpponentHand(cards.slice(5, 10));
      setDiscardPile([cards[10]]);
    };

    setupGame();
  }, []);

  const playCard = (card: CardType) => {
    const topCard = discardPile[discardPile.length - 1];
    const isMatch = card.suit === topCard.suit || card.value === topCard.value;

    if (isMatch) {
      setPlayerHand(playerHand.filter((c) => c.code !== card.code));
      setDiscardPile([...discardPile, card]);
      setMessage("Karte gespielt: " + card.value + " of " + card.suit);
      setIsPlayerTurn(false);
      setTimeout(() => {
        opponentTurn();
      }, 1000);
    } else {
      setMessage("❌ Diese Karte passt nicht!");
    }
  };

  const drawCard = async () => {
    if (!deckId) return;
    const draw = await drawCards(deckId, 1);
    setPlayerHand([...playerHand, ...draw.cards]);
    setIsPlayerTurn(false);
    setTimeout(() => {
      opponentTurn();
    }, 1000);
  };

  const opponentTurn = async () => {
    if (!deckId) return;

    setMessage("Gegner ist am Zug...");
    await new Promise((r) => setTimeout(r, 1000)); // Warte 1 Sekunde

    const topCard = discardPile[discardPile.length - 1];
    const match = opponentHand.find(
      (card: CardType) => card.suit === topCard.suit || card.value === topCard.value
    );

    if (match) {
      setOpponentHand(opponentHand.filter((c: CardType) => c.code !== match.code));
      setDiscardPile([...discardPile, match]);
      setMessage(`Gegner spielt ${match.value} of ${match.suit}`);
    } else {
      const draw = await drawCards(deckId, 1);
      const newCard = draw.cards[0];
      const updatedHand = [...opponentHand, newCard];

      // Versuche erneut zu spielen
      if (newCard.suit === topCard.suit || newCard.value === topCard.value) {
        setOpponentHand(updatedHand.filter((c: CardType) => c.code !== newCard.code));
        setDiscardPile([...discardPile, newCard]);
        setMessage(`Gegner zieht und spielt ${newCard.value} of ${newCard.suit}`);
      } else {
        setOpponentHand(updatedHand);
        setMessage("Gegner zieht eine Karte und passt.");
      }
    }

    await new Promise((r) => setTimeout(r, 1000));
    setIsPlayerTurn(true);
  };

  return (
    <main className="min-h-screen bg-green-800 text-white p-6 text-center">
      <h1 className="text-4xl font-bold mb-4">🃏 Mau Mau</h1>
      <p className="mb-2">{message}</p>

      {/* Ablagestapel */}
      {discardPile.length > 0 && (
        <div className="mb-4">
          <p className="font-semibold mb-1">Ablagestapel:</p>
          <Card image={discardPile[discardPile.length - 1].image} />
        </div>
      )}

      {/* Spielerhand */}
      <CardList cards={playerHand} onPlayCard={playCard} />

      {/* Karte ziehen */}
      <Controls onDraw={drawCard} />
    </main>
  );
}
