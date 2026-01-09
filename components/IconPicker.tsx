import React, { useState, useMemo } from 'react';
import { X, Search } from 'lucide-react';
import { ICONS, CATEGORY_ICONS } from '../constants';

interface IconPickerProps {
    onSelect: (iconKey: string) => void;
    onClose: () => void;
    selectedIcon: string;
}

const IconPicker: React.FC<IconPickerProps> = ({ onSelect, onClose, selectedIcon }) => {
    const [search, setSearch] = useState('');

    const filteredCategories = useMemo(() => {
        if (!search.trim()) {
            return CATEGORY_ICONS;
        }

        const query = search.toLowerCase();
        const filtered: Record<string, string[]> = {};

        Object.entries(CATEGORY_ICONS).forEach(([category, icons]) => {
            const matchingIcons = icons.filter(iconKey =>
                iconKey.toLowerCase().includes(query)
            );
            if (matchingIcons.length > 0) {
                filtered[category] = matchingIcons;
            }
        });

        return filtered;
    }, [search]);

    // Flatten for search results if you want a single grid when searching? 
    // Or keep categories. Keeping categories is nice.

    return (
        <div className="fixed inset-0 z-[60] flex flex-col bg-black/80 backdrop-blur-md sm:items-center sm:justify-center animate-in fade-in duration-200">
            <div className="w-full h-full sm:h-[80vh] sm:max-w-2xl glass-strong sm:rounded-3xl flex flex-col shadow-2xl shadow-black/50 overflow-hidden">

                {/* Header */}
                <div className="p-4 border-b border-white/10 flex items-center justify-between shrink-0">
                    <h2 className="text-xl font-bold text-white">Select Icon</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-full text-white/70 hover:text-white transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Search */}
                <div className="p-4 shrink-0">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={20} />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search icons..."
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all"
                            autoFocus
                        />
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                    {Object.entries(filteredCategories).length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-40 text-white/40">
                            <p>No icons found</p>
                        </div>
                    ) : (
                        <div className="space-y-8 pb-8">
                            {Object.entries(filteredCategories).map(([category, iconKeys]: [string, string[]]) => (
                                <div key={category}>
                                    <h3 className="text-sm font-medium text-white/50 uppercase tracking-wider mb-4 ml-1">{category}</h3>
                                    <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 gap-3">
                                        {iconKeys.map((key) => {
                                            const Icon = ICONS[key];
                                            if (!Icon) return null;
                                            const isSelected = selectedIcon === key;

                                            return (
                                                <button
                                                    key={key}
                                                    onClick={() => onSelect(key)}
                                                    className={`
                            aspect-square rounded-xl flex flex-col items-center justify-center gap-1 transition-all
                            ${isSelected
                                                            ? 'bg-white text-black shadow-lg shadow-white/20 scale-105'
                                                            : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white hover:scale-105'
                                                        }
                          `}
                                                    title={key}
                                                >
                                                    <Icon size={28} strokeWidth={isSelected ? 2.5 : 2} />
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default IconPicker;
