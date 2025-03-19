import { JoinType } from "@/lib/types";

interface JoinSelectorProps {
  joinType: JoinType;
  setJoinType: (joinType: JoinType) => void;
}

const JoinSelector = ({ joinType, setJoinType }: JoinSelectorProps) => {
  const joinTypes: { value: JoinType; label: string; description: string }[] = [
    { 
      value: "INNER", 
      label: "INNER JOIN", 
      description: "Returns records that have matching values in both tables"
    },
    { 
      value: "LEFT", 
      label: "LEFT JOIN", 
      description: "Returns all records from the left table, and matched records from the right table"
    },
    { 
      value: "RIGHT", 
      label: "RIGHT JOIN", 
      description: "Returns all records from the right table, and matched records from the left table"
    },
    { 
      value: "CROSS", 
      label: "CROSS JOIN", 
      description: "Returns all possible combinations of records from both tables"
    }
  ];

  return (
    <div className="flex flex-col space-y-4">
      <h2 className="text-xl font-semibold text-gray-900">Join Type</h2>
      <div className="grid grid-cols-1 gap-2">
        {joinTypes.map((type) => {
          const isSelected = joinType === type.value;
          return (
            <button
              key={type.value}
              onClick={() => setJoinType(type.value)}
              className={`flex flex-col p-3 border rounded-md transition-colors ${
                isSelected
                  ? "border-indigo-500 bg-indigo-50"
                  : "border-gray-300 hover:bg-gray-50 text-gray-900"
              }`}
              aria-pressed={isSelected}
              title={type.description}
            >
              <span className={`font-medium ${isSelected ? "text-indigo-700" : "text-gray-900"}`}>
                {type.label}
              </span>
              <span className={`text-xs mt-1 ${isSelected ? "text-indigo-500" : "text-gray-600"}`}>
                {type.description}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default JoinSelector; 