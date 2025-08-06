interface PassengerSelectorProps {
  label: string;
  count: number;
  setCount: (value: number) => void;
}

export const PassengerSelector = ({ label, count, setCount }: PassengerSelectorProps) => {
  return (
    <div className="mb-2">
      <label className="block font-semibold mb-1">{label}</label>
      <div className="flex items-center gap-2">
        <button type="button" onClick={() => setCount(Math.max(0, count - 1))} className="px-3 py-1 bg-gray-300 rounded">-</button>
        <span>{count}</span>
        <button type="button" onClick={() => setCount(count + 1)} className="px-3 py-1 bg-gray-300 rounded">+</button>
      </div>
    </div>
  );
};