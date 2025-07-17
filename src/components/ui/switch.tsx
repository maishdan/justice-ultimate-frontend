
export function Switch({ checked, onChange, onCheckedChange }: { checked: boolean; onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void; onCheckedChange?: (checked: boolean) => void }) {
  return (
    <label className="inline-flex items-center cursor-pointer">
      <span className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={e => {
            onChange && onChange(e);
            onCheckedChange && onCheckedChange(e.target.checked);
          }}
          className="sr-only"
        />
        <span
          className={`block w-10 h-6 rounded-full shadow-inner transition-colors duration-200 ${
            checked ? 'bg-green-500' : 'bg-gray-300'
          }`}
        ></span>
        <span
          className={`absolute block w-4 h-4 mt-1 ml-1 rounded-full shadow inset-y-0 left-0 bg-white transform transition-transform duration-200 ${
            checked ? 'translate-x-full bg-green-700' : 'bg-gray-400'
          }`}
        ></span>
      </span>
    </label>
  );
}
export function DarkModeSwitch({ darkMode, toggleDarkMode }: { darkMode: boolean; toggleDarkMode: () => void }) {
  return (
    <Switch checked={darkMode} onChange={toggleDarkMode} />
  );
}