"use client";

import { useEffect, useState } from "react";
import { createAndShuffleDeck, drawCards } from "@/lib/deckapi";
import { Card as CardType } from "@/lib/card";
import CardList from "@/components/cardlist";
import Controls from "@/components/Controls";
import Card from "@/components/Card";

export default function Home() {
  const [deckId, setDeckId] = useState<string | null>(null);
  const [playerHand, setPlayerHand] = useState<CardType[]>([]);
  const [discardPile, setDiscardPile] = useState<CardType[]>([]);
  const [message, setMessage] = useState<string>("");

  // Setup/Restart Funktion
  const setupGame = async () => {
    const deck = await createAndShuffleDeck();
    setDeckId(deck.deck_id);

    const draw = await drawCards(deck.deck_id, 6);
    const cards = draw.cards;
    setPlayerHand(cards.slice(0, 5));
    setDiscardPile([cards[5]]);
    setMessage("");
  };

  useEffect(() => {
    setupGame();
  }, []);

  const playCard = (card: CardType) => {
    const topCard = discardPile[discardPile.length - 1];
    const isMatch = card.suit === topCard.suit || card.value === topCard.value;

    if (isMatch) {
      setPlayerHand(playerHand.filter((c) => c.code !== card.code));
      setDiscardPile([...discardPile, card]);
      setMessage("Karte gespielt: " + card.value + " of " + card.suit);
    } else {
      setMessage("❌ Diese Karte passt nicht!");
    }
  };

  const drawCard = async () => {
    if (!deckId) return;
    const draw = await drawCards(deckId, 1);
    setPlayerHand([...playerHand, ...draw.cards]);
  };

  // Restart-Button Funktion
  const restartGame = () => {
    setupGame();
  };

  return (
    <main className="min-h-screen bg-green-800 text-white p-6 text-center">
      <h1 className="text-4xl font-bold mb-4">🃏 Mau Mau</h1>
      <p className="mb-2">{message}</p>

      {/* Win-Screen */}
      {playerHand.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-96">
          <h2 className="text-3xl font-bold mb-4 text-yellow-300">🎉 Gewonnen! 🎉</h2>
          <p className="text-lg mb-4">Du hast alle Karten abgelegt.</p>
          <button
            onClick={restartGame}
            className="bg-yellow-400 hover:bg-yellow-500 text-green-900 font-bold py-2 px-6 rounded"
          >
            Neu starten
          </button>
        </div>
      ) : (
        <>
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
        </>
      )}
    </main>
  );
}