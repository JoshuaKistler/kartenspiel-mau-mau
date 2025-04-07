// components/CardList.tsx

import Card from "./Card";
import { Card as CardType } from "@/types/card";

interface CardListProps {
  cards: CardType[];
  onPlayCard?: (card: CardType) => void;
}

export default function CardList({ cards, onPlayCard }: CardListProps) {
  return (
    <div className="flex flex-wrap justify-center gap-2 mt-4">
      {cards.map((card) => (
        <button
          key={card.code}
          onClick={() => onPlayCard?.(card)}
          className="focus:outline-none"
        >
          <Card image={card.image} alt={`${card.value} of ${card.suit}`} />
        </button>
      ))}
    </div>
  );
}
