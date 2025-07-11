// src/components/FavoritesPanel.tsx
import { useEffect, useState } from "react";
import type { Car } from "../types/Car";
import { Drawer } from "vaul";
import { Button } from "../components/ui/button";

export const FavoritesPanel = () => {
  const [favorites, setFavorites] = useState<Car[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("favorites");
    if (stored) setFavorites(JSON.parse(stored));
  }, []);

  return (
    <Drawer.Root open={open} onOpenChange={setOpen}>
      <Drawer.Trigger asChild>
        <Button className="fixed bottom-6 right-6 bg-yellow-400 text-black hover:bg-yellow-300 shadow-lg z-50">
          ❤️ Favorites ({favorites.length})
        </Button>
      </Drawer.Trigger>

      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/60" />
        <Drawer.Content className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl p-6 max-h-[70vh] overflow-y-auto shadow-xl z-50">
          <h2 className="text-xl font-semibold mb-4 text-center">Your Favorite Cars</h2>
          {favorites.length === 0 ? (
            <p className="text-gray-500 text-center">No favorites added yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {favorites.map((car) => (
                <div key={car.id} className="border p-4 rounded-md bg-gray-50">
                  <img
                    src={car.image[0]}
                    alt={car.name}
                    className="w-full h-32 object-cover rounded mb-2"
                  />
                  <h3 className="text-lg font-bold">{car.name}</h3>
                  <p className="text-sm text-gray-600">{car.tagline}</p>
                </div>
              ))}
            </div>
          )}
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
};
                      