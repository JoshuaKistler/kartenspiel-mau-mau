// components/Card.tsx

export default function Card({ image, alt }: { image: string; alt?: string }) {
    return (
      <img
        src={image}
        alt={alt ?? "Spielkarte"}
        className="w-20 sm:w-24 rounded shadow-md hover:scale-105 transition"
      />
    );
  }
  