import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import type { ClothingItem } from '../../types/wardrobe';
import { useWardrobeStore } from '../../store/wardrobeStore';

interface ItemCardProps {
  item: ClothingItem;
  onEdit: (item: ClothingItem) => void;
}

const ItemCard: React.FC<ItemCardProps> = ({ item, onEdit }) => {
  const deleteItem = useWardrobeStore((state) => state.deleteItem);

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="aspect-square relative group">
        <img
          src={item.thumbnail_url || item.image_url}
          alt={`${item.brand} ${item.color}`}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-opacity duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <button
            onClick={() => onEdit(item)}
            className="p-2 bg-white rounded-full mx-1 hover:bg-gray-100"
            title="Edit item"
          >
            <Edit2 className="h-4 w-4 text-gray-700" />
          </button>
          <button
            onClick={() => deleteItem(item.id)}
            className="p-2 bg-white rounded-full mx-1 hover:bg-gray-100"
            title="Delete item"
          >
            <Trash2 className="h-4 w-4 text-red-600" />
          </button>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-medium text-gray-900">{item.brand}</h3>
        <p className="text-sm text-gray-500">
          {item.categories.join(', ')} • {item.size}
        </p>
        <div className="mt-2 flex flex-wrap gap-1">
          {item.seasons.map((season) => (
            <span
              key={season}
              className="px-2 py-1 text-xs rounded-full bg-indigo-100 text-indigo-800"
            >
              {season}
            </span>
          ))}
          {item.occasions.map((occasion) => (
            <span
              key={occasion}
              className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800"
            >
              {occasion}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ItemCard;