
export function Switch({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <label className="inline-flex items-center cursor-pointer">
      <span className="relative">
        <input type="checkbox" checked={checked} onChange={onChange} className="sr-only" />
        <span className="block w-10 h-6 bg-gray-300 rounded-full shadow-inner"></span>
        <span
          className={`absolute block w-4 h-4 mt-1 ml-1 rounded-full shadow inset-y-0 left-0 bg-white transform ${
            checked ? 'translate-x-full' : ''
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