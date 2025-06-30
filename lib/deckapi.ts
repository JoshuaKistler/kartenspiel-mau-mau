// /lib/deckApi.ts
export const createAndShuffleDeck = async () => {
    const res = await fetch("https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1");
    return res.json();
  };
  
  export const drawCards = async (deckId: string, count: number) => {
    const res = await fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=${count}`);
    return res.json();
  };
  