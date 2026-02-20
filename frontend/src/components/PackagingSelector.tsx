"use client";

import { useState } from 'react';

interface PackagingOption {
    type: 'box' | 'cloth' | 'cushion' | 'ribbon';
    name: string;
    price: number;
    colorCode?: string;
}

// Mock options (usually fetched from API)
const packagingOptions: PackagingOption[] = [
    { type: 'box', name: 'Velvet Black', price: 5.00, colorCode: '#000000' },
    { type: 'box', name: 'Royal Blue', price: 5.00, colorCode: '#4169E1' },
    { type: 'cloth', name: 'Silk White', price: 2.00, colorCode: '#FFFFFF' },
    { type: 'cushion', name: 'Foam', price: 0.00 },
    { type: 'cushion', name: 'Satin Pillow', price: 3.00 },
    { type: 'ribbon', name: 'Gold', price: 1.00, colorCode: '#FFD700' },
    { type: 'ribbon', name: 'Red', price: 1.00, colorCode: '#DC143C' },
];

export default function PackagingSelector({ onChange }: { onChange: (data: any) => void }) {
    const [selectedBox, setSelectedBox] = useState<string>('');
    const [selectedCloth, setSelectedCloth] = useState<string>('');
    const [selectedCushion, setSelectedCushion] = useState<string>('');
    const [selectedRibbon, setSelectedRibbon] = useState<string>('');
    const [giftMessage, setGiftMessage] = useState<string>('');

    const handleChange = () => {
        // Calculate price and notify parent
        let price = 0;
        const box = packagingOptions.find(o => o.name === selectedBox);
        const cloth = packagingOptions.find(o => o.name === selectedCloth);
        const cushion = packagingOptions.find(o => o.name === selectedCushion);
        const ribbon = packagingOptions.find(o => o.name === selectedRibbon);

        if (box) price += box.price;
        if (cloth) price += cloth.price;
        if (cushion) price += cushion.price;
        if (ribbon) price += ribbon.price;

        onChange({
            boxColor: selectedBox,
            innerCloth: selectedCloth,
            cushion: selectedCushion,
            ribbonColor: selectedRibbon,
            giftMessage,
            packagingPrice: price
        });
    };

    // Need to trigger handleChange on every state update, or use useEffect.
    // Simplifying for clarity:

    const updateSelection = (setter: any, value: string) => {
        setter(value);
        // Defer calculation or use effect.
        // For now, let's just use a submit or pass raw state upstream.
        // Actually, let's use useEffect in parent or pass change handler
    }

    return (
        <div className="bg-gray-50 p-6 rounded-lg mt-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Gift Packaging Customization</h3>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Box Color</label>
                    <select
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
                        value={selectedBox}
                        onChange={(e) => { setSelectedBox(e.target.value); setTimeout(handleChange, 0); }}
                    >
                        <option value="">Standard</option>
                        {packagingOptions.filter(o => o.type === 'box').map(o => (
                            <option key={o.name} value={o.name}>{o.name} (+${o.price})</option>
                        ))}
                    </select>
                </div>

                {/* Similar select inputs for Cloth, Cushion, Ribbon */}

                <div>
                    <label className="block text-sm font-medium text-gray-700">Gift Message</label>
                    <textarea
                        rows={3}
                        className="mt-1 shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md"
                        value={giftMessage}
                        onChange={(e) => { setGiftMessage(e.target.value); setTimeout(handleChange, 0); }}
                    />
                </div>

                <div className="text-right text-sm text-gray-600">
                    <button type="button" onClick={handleChange} className="text-primary hover:underline">Apply Selection</button>
                    {/* In a real app, use useEffect to auto-update parent without button */}
                </div>
            </div>
        </div>
    );
}
