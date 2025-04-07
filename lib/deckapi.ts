const BASE_URL = "https://deckofcardsapi.com/api/deck";

export async function createAndShuffleDeck() {
  const res = await fetch(`${BASE_URL}/new/shuffle/?deck_count=1`);
  return res.json();
}

export async function drawCards(deckId: string, count: number) {
  const res = await fetch(`${BASE_URL}/${deckId}/draw/?count=${count}`);
  return res.json();
}

export async function reshuffleDeck(deckId: string) {
  const res = await fetch(`${BASE_URL}/${deckId}/shuffle/`);
  return res.json();
}
