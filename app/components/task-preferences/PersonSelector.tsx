interface PersonSelectorProps {
  people: string[];
  selectedPerson: string;
  onPersonChange: (person: string) => void;
}

export function PersonSelector({
  people,
  selectedPerson,
  onPersonChange,
}: PersonSelectorProps) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-lg mb-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">
        ¿Quién configura sus preferencias?
      </h2>
      <div className="flex gap-4">
        {people.map((person) => (
          <button
            key={person}
            onClick={() => onPersonChange(person)}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              selectedPerson === person
                ? "bg-blue-500 text-white shadow-lg"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {person}
          </button>
        ))}
      </div>
    </div>
  );
}
