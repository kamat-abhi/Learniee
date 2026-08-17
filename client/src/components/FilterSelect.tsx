import { ChevronDown } from "lucide-react";

interface Props {
  label: string;
  value: string;
  options: string[];
  optionLabels?: string[];
  onChange: (value: string) => void;
}

export default function FilterSelect({
  label,
  value,
  options,
  optionLabels = options,
  onChange
}: Props) {
  return (
    <label className="filter-field">
      <span>{label}</span>
      <div className="select-control">
        <select value={value} onChange={(event) => onChange(event.target.value)}>
          <option value="">All</option>
          {options.map((option, index) => (
            <option value={option} key={option}>
              {optionLabels[index]}
            </option>
          ))}
        </select>
        <ChevronDown size={15} />
      </div>
    </label>
  );
}