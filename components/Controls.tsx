// components/Controls.tsx

interface Props {
    onDraw: () => void;
  }
  
  export default function Controls({ onDraw }: Props) {
    return (
      <div className="mt-6">
        <button
          onClick={onDraw}
          className="bg-yellow-400 hover:bg-yellow-300 text-black font-bold py-2 px-4 rounded shadow"
        >
          Karte ziehen
        </button>
      </div>
    );
  }
  