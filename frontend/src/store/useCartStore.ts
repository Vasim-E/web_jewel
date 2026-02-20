import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
    product: string;
    name: string;
    image: string;
    price: number;
    qty: number;
    stock: number;
    packaging?: {
        boxColor?: string;
        innerCloth?: string;
        cushion?: string;
        ribbonColor?: string;
        giftMessage?: string;
        packagingPrice: number;
    }
}

interface CartState {
    cartItems: CartItem[];
    addToCart: (item: CartItem) => void;
    removeFromCart: (id: string) => void;
    clearCart: () => void;
    totalPrice: () => number;
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            cartItems: [],
            addToCart: (item) => {
                const items = get().cartItems;
                const existItem = items.find((x) => x.product === item.product);

                if (existItem) {
                    set({
                        cartItems: items.map((x) =>
                            x.product === existItem.product ? item : x
                        ),
                    });
                } else {
                    set({ cartItems: [...items, item] });
                }
            },
            removeFromCart: (id) => {
                set({
                    cartItems: get().cartItems.filter((x) => x.product !== id),
                });
            },
            clearCart: () => set({ cartItems: [] }),
            totalPrice: () => {
                return get().cartItems.reduce((acc, item) => acc + item.price * item.qty + (item.packaging?.packagingPrice || 0) * item.qty, 0);
            }
        }),
        {
            name: 'cart-storage',
        }
    )
);
