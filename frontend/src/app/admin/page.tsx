"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../store/useAuthStore';
import api from '../../lib/axios';
import { Product, Order, User, HeroSlide, Category } from '../../types';
import { Package, ShoppingBag, Users, LayoutDashboard, Plus, Trash2, Edit, Home, Image as ImageIcon, MessageSquare, Folders } from 'lucide-react';

export default function AdminDashboard() {
    const router = useRouter();
    const { user, isAuthenticated } = useAuthStore();
    const [activeTab, setActiveTab] = useState('overview');
    const [stats, setStats] = useState({ sales: 0, orders: 0, customers: 0 });
    const [products, setProducts] = useState<Product[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);
    const [usersList, setUsersList] = useState<User[]>([]);
    const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([]);
    const [showHeroModal, setShowHeroModal] = useState(false);
    const initialHeroState = { image: null as File | null, heading: '', subHeading: '', description: '', productCode: '', type: 'product' as 'product' | 'coming_soon', productId: '' };
    const [newHero, setNewHero] = useState(initialHeroState);
    const [editingHeroId, setEditingHeroId] = useState<string | null>(null);
    const [marqueeConfig, setMarqueeConfig] = useState<any>({ text: '', isActive: true, bgColor: 'theme' });

    // Categories
    const [categories, setCategories] = useState<Category[]>([]);
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const initialCategoryState = { name: '', description: '', image: null as File | null };
    const [newCategory, setNewCategory] = useState(initialCategoryState);
    const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);

    // Products
    const [showProductModal, setShowProductModal] = useState(false);
    const initialProductState = { name: '', description: '', price: 0, stock: 0, category: 'Uncategorized', images: [] as File[], featured: false };
    const [newProduct, setNewProduct] = useState(initialProductState);
    const [editingProductId, setEditingProductId] = useState<string | null>(null);

    useEffect(() => {
        if (!isAuthenticated || user?.role !== 'admin') {
            router.push('/login');
        } else {
            fetchData();
        }
    }, [isAuthenticated, user, router]);

    const fetchData = async () => {
        try {
            const [productsRes, ordersRes, heroRes, marqueeRes, categoriesRes] = await Promise.all([
                api.get('/products'),
                api.get('/orders'),
                api.get('/hero'),
                api.get('/marquee'),
                api.get('/categories')
            ]);
            setProducts(productsRes.data);
            setOrders(ordersRes.data);
            setHeroSlides(heroRes.data);
            if (marqueeRes.data) {
                setMarqueeConfig(marqueeRes.data);
            }
            setCategories(categoriesRes.data || []);

            // Calculate stats
            const totalSales = ordersRes.data.reduce((acc: number, order: Order) => acc + order.totalPrice, 0);
            setStats({
                sales: totalSales,
                orders: ordersRes.data.length,
                customers: 0 // Need user list endpoint
            });

        } catch (error) {
            console.error(error);
        }
    };

    const handleDeleteProduct = async (id: string) => {
        if (confirm('Are you sure?')) {
            await api.delete(`/products/${id}`);
            fetchData();
        }
    }

    const handleAddProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('name', newProduct.name);
            formData.append('description', newProduct.description);
            formData.append('price', newProduct.price.toString());
            formData.append('stock', newProduct.stock.toString());
            formData.append('category', newProduct.category);
            formData.append('featured', newProduct.featured.toString());
            newProduct.images.forEach(img => formData.append('images', img));

            if (editingProductId) {
                await api.put(`/products/${editingProductId}`, formData);
            } else {
                await api.post('/products', formData);
            }
            setNewProduct(initialProductState);
            setEditingProductId(null);
            setShowProductModal(false);
            fetchData();
        } catch (error) {
            console.error(error);
        }
    }

    const handleEditProduct = (product: Product) => {
        setEditingProductId(product._id);
        setNewProduct({
            name: product.name,
            description: product.description,
            price: product.price,
            stock: product.stock,
            category: product.category,
            images: [],
            featured: product.featured
        });
        setShowProductModal(true);
    };

    const handleDeleteCategory = async (id: string) => {
        if (confirm('Are you sure you want to delete this category?')) {
            await api.delete(`/categories/${id}`);
            fetchData();
        }
    }

    const handleAddCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('name', newCategory.name);
            formData.append('description', newCategory.description);
            if (newCategory.image) {
                formData.append('image', newCategory.image);
            }

            if (editingCategoryId) {
                await api.put(`/categories/${editingCategoryId}`, formData);
            } else {
                await api.post('/categories', formData);
            }
            setNewCategory(initialCategoryState);
            setEditingCategoryId(null);
            setShowCategoryModal(false);
            fetchData();
        } catch (error) {
            console.error(error);
        }
    }

    const handleEditCategory = (category: Category) => {
        setEditingCategoryId(category._id);
        setNewCategory({ name: category.name, description: category.description || '', image: null });
        setShowCategoryModal(true);
    };

    const handleDeleteHero = async (id: string) => {
        if (confirm('Are you sure?')) {
            await api.delete(`/hero/${id}`);
            fetchData();
        }
    }

    const handleEditHero = (slide: HeroSlide) => {
        setEditingHeroId(slide._id);
        const editingState: any = {
            image: null, // Don't preload existing image file object, handled by backend if null
            heading: slide.heading,
            subHeading: slide.subHeading,
            description: slide.description,
            productCode: slide.productCode,
            type: slide.type || 'product',
        };
        if (slide.productId) {
            editingState.productId = slide.productId;
        } else {
            editingState.productId = '';
        }
        setNewHero(editingState);
        setShowHeroModal(true);
    };

    const handleAddHero = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            if (newHero.image) {
                formData.append('image', newHero.image);
            }
            formData.append('heading', newHero.heading);
            formData.append('subHeading', newHero.subHeading);
            formData.append('description', newHero.description);
            formData.append('productCode', newHero.productCode);
            formData.append('type', newHero.type);
            if (newHero.type === 'product' && newHero.productId) {
                formData.append('productId', newHero.productId);
            }

            if (editingHeroId) {
                await api.put(`/hero/${editingHeroId}`, formData);
            } else {
                await api.post('/hero', formData);
            }

            setNewHero(initialHeroState);
            setEditingHeroId(null);
            setShowHeroModal(false);
            fetchData();
        } catch (error) {
            console.error(error);
        }
    }

    const handleDeliver = async (id: string) => {
        await api.put(`/orders/${id}/deliver`);
        fetchData();
    }

    return (
        <div className="min-h-screen bg-gray-100 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-primary text-white hidden md:block">
                <div className="p-6">
                    <h2 className="text-2xl font-serif">Admin</h2>
                </div>
                <nav className="mt-6">
                    <button onClick={() => setActiveTab('overview')} className={`flex items-center w-full px-6 py-3 hover:bg-opacity-80 transition-colors ${activeTab === 'overview' ? 'bg-secondary' : ''}`}>
                        <LayoutDashboard className="mr-3" size={20} /> Overview
                    </button>
                    <button onClick={() => setActiveTab('products')} className={`flex items-center w-full px-6 py-3 hover:bg-opacity-80 transition-colors ${activeTab === 'products' ? 'bg-secondary' : ''}`}>
                        <ShoppingBag className="mr-3" size={20} /> Products
                    </button>
                    <button onClick={() => setActiveTab('categories')} className={`flex items-center w-full px-6 py-3 hover:bg-opacity-80 transition-colors ${activeTab === 'categories' ? 'bg-secondary' : ''}`}>
                        <Folders className="mr-3" size={20} /> Categories
                    </button>
                    <button onClick={() => setActiveTab('orders')} className={`flex items-center w-full px-6 py-3 hover:bg-opacity-80 transition-colors ${activeTab === 'orders' ? 'bg-secondary' : ''}`}>
                        <Package className="mr-3" size={20} /> Orders
                    </button>
                    <button onClick={() => setActiveTab('hero')} className={`flex items-center w-full px-6 py-3 hover:bg-opacity-80 transition-colors ${activeTab === 'hero' ? 'bg-secondary' : ''}`}>
                        <ImageIcon className="mr-3" size={20} /> Hero Section
                    </button>
                    <button onClick={() => setActiveTab('marquee')} className={`flex items-center w-full px-6 py-3 hover:bg-opacity-80 transition-colors ${activeTab === 'marquee' ? 'bg-secondary' : ''}`}>
                        <MessageSquare className="mr-3" size={20} /> Marquee
                    </button>
                    <div className="mt-8 border-t border-white/20 pt-4">
                        <button onClick={() => router.push('/')} className="flex items-center w-full px-6 py-3 hover:bg-opacity-80 transition-colors">
                            <Home className="mr-3" size={20} /> Back to Website
                        </button>
                    </div>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8">
                <h1 className="text-3xl font-serif text-gray-900 mb-8 capitalize">{activeTab}</h1>

                {activeTab === 'overview' && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white p-6 rounded-lg shadow-sm">
                            <h3 className="text-gray-500 text-sm font-medium">Total Sales</h3>
                            <p className="text-3xl font-bold text-gray-900 mt-2">${stats.sales.toFixed(2)}</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-sm">
                            <h3 className="text-gray-500 text-sm font-medium">Total Orders</h3>
                            <p className="text-3xl font-bold text-gray-900 mt-2">{stats.orders}</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-sm">
                            <h3 className="text-gray-500 text-sm font-medium">Low Stock Products</h3>
                            <p className="text-3xl font-bold text-gray-900 mt-2">{products.filter(p => p.stock < 5).length}</p>
                        </div>
                    </div>
                )}

                {activeTab === 'products' && (
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                            <h3 className="text-lg font-medium text-gray-900">Product List</h3>
                            <button onClick={() => { setNewProduct(initialProductState); setEditingProductId(null); setShowProductModal(true); }} className="bg-primary text-white px-4 py-2 rounded-md flex items-center text-sm">
                                <Plus size={16} className="mr-2" /> Add Product
                            </button>
                        </div>
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {products.map((product) => (
                                    <tr key={product._id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 border-l border-transparent">
                                            <div className="flex items-center">
                                                {product.name}
                                                {product.featured && <span title="Featured Product" className="ml-2 text-yellow-500"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg></span>}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${product.price}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.stock}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.category}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button onClick={() => handleEditProduct(product)} className="text-blue-600 hover:text-blue-900 mr-4"><Edit size={16} /></button>
                                            <button onClick={() => handleDeleteProduct(product._id)} className="text-red-600 hover:text-red-900"><Trash2 size={16} /></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {showProductModal && (
                            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                                <div className="bg-white p-8 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                                    <h2 className="text-2xl font-serif mb-6">{editingProductId ? 'Edit Product' : 'Add Product'}</h2>
                                    <form onSubmit={handleAddProduct} className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Name</label>
                                                <input type="text" required value={newProduct.name} onChange={e => setNewProduct({ ...newProduct, name: e.target.value })} className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Category</label>
                                                <select value={newProduct.category} onChange={e => setNewProduct({ ...newProduct, category: e.target.value })} className="mt-1 block w-full border border-gray-300 rounded-md p-2" required>
                                                    <option value="Uncategorized">Uncategorized</option>
                                                    {categories.map(c => (
                                                        <option key={c._id} value={c.name}>{c.name}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Price</label>
                                                <input type="number" step="0.01" required value={newProduct.price} onChange={e => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) })} className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Stock</label>
                                                <input type="number" required value={newProduct.stock} onChange={e => setNewProduct({ ...newProduct, stock: parseInt(e.target.value) })} className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
                                            </div>
                                            <div className="col-span-2">
                                                <label className="block text-sm font-medium text-gray-700">Description</label>
                                                <textarea required value={newProduct.description} onChange={e => setNewProduct({ ...newProduct, description: e.target.value })} className="mt-1 block w-full border border-gray-300 rounded-md p-2" rows={3}></textarea>
                                            </div>
                                            <div className="col-span-2 flex items-center">
                                                <input type="checkbox" id="featured" checked={newProduct.featured} onChange={e => setNewProduct({ ...newProduct, featured: e.target.checked })} className="h-4 w-4 text-primary border-gray-300 rounded mr-2" />
                                                <label htmlFor="featured" className="text-sm font-medium text-gray-700">Featured Product (Shows on Homepage)</label>
                                            </div>
                                            <div className="col-span-2">
                                                <label className="block text-sm font-medium text-gray-700">Images {editingProductId && '(Upload new images to replace existing)'}</label>
                                                <input type="file" multiple accept="image/*" onChange={e => {
                                                    if (e.target.files) {
                                                        const fileArray = Array.from(e.target.files);
                                                        setNewProduct({ ...newProduct, images: [...newProduct.images, ...fileArray] });
                                                    }
                                                    // Reset input so the same files can be selected again if needed
                                                    e.target.value = '';
                                                }} className="mt-1 block w-full border border-gray-300 rounded-md p-2" required={!editingProductId && newProduct.images.length === 0} />

                                                {/* Image Previews & Reordering */}
                                                {newProduct.images.length > 0 && (
                                                    <div className="mt-4">
                                                        <label className="block text-xs font-medium text-gray-500 mb-2">Selected Images (Drag or use arrows to reorder. The first image is the main image.)</label>
                                                        <div className="flex flex-wrap gap-4">
                                                            {newProduct.images.map((file, idx) => (
                                                                <div key={idx} className="relative w-24 h-24 border rounded-md overflow-hidden group bg-gray-50 flex-shrink-0">
                                                                    <img
                                                                        src={URL.createObjectURL(file)}
                                                                        alt={`preview ${idx}`}
                                                                        className="w-full h-full object-cover"
                                                                    />

                                                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-1">
                                                                        <div className="flex justify-between">
                                                                            <button
                                                                                type="button"
                                                                                onClick={() => {
                                                                                    if (idx > 0) {
                                                                                        const newImages = [...newProduct.images];
                                                                                        [newImages[idx - 1], newImages[idx]] = [newImages[idx], newImages[idx - 1]];
                                                                                        setNewProduct({ ...newProduct, images: newImages });
                                                                                    }
                                                                                }}
                                                                                disabled={idx === 0}
                                                                                className="bg-white/90 text-gray-800 rounded p-1 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white"
                                                                                title="Move Left"
                                                                            >
                                                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                                                                            </button>
                                                                            <button
                                                                                type="button"
                                                                                onClick={() => {
                                                                                    if (idx < newProduct.images.length - 1) {
                                                                                        const newImages = [...newProduct.images];
                                                                                        [newImages[idx + 1], newImages[idx]] = [newImages[idx], newImages[idx + 1]];
                                                                                        setNewProduct({ ...newProduct, images: newImages });
                                                                                    }
                                                                                }}
                                                                                disabled={idx === newProduct.images.length - 1}
                                                                                className="bg-white/90 text-gray-800 rounded p-1 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white"
                                                                                title="Move Right"
                                                                            >
                                                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
                                                                            </button>
                                                                        </div>
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => {
                                                                                const newImages = [...newProduct.images];
                                                                                newImages.splice(idx, 1);
                                                                                setNewProduct({ ...newProduct, images: newImages });
                                                                            }}
                                                                            className="bg-red-500/90 text-white rounded p-1 w-full flex justify-center hover:bg-red-500"
                                                                            title="Remove"
                                                                        >
                                                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /><line x1="10" x2="10" y1="11" y2="17" /><line x1="14" x2="14" y1="11" y2="17" /></svg>
                                                                        </button>
                                                                    </div>
                                                                    {idx === 0 && <span className="absolute bottom-0 left-0 right-0 bg-primary/90 text-white text-[10px] text-center font-bold py-0.5">MAIN</span>}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex justify-end gap-4 mt-6">
                                            <button type="button" onClick={() => setShowProductModal(false)} className="px-4 py-2 text-gray-600">Cancel</button>
                                            <button type="submit" className="bg-primary text-white px-4 py-2 rounded-md">{editingProductId ? 'Update' : 'Save'}</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'categories' && (
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                            <h3 className="text-lg font-medium text-gray-900">Categories</h3>
                            <button onClick={() => { setNewCategory(initialCategoryState); setEditingCategoryId(null); setShowCategoryModal(true); }} className="bg-primary text-white px-4 py-2 rounded-md flex items-center text-sm">
                                <Plus size={16} className="mr-2" /> Add Category
                            </button>
                        </div>
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {categories.map((cat) => (
                                    <tr key={cat._id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{cat.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cat.description || 'N/A'}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button onClick={() => handleEditCategory(cat)} className="text-blue-600 hover:text-blue-900 mr-4"><Edit size={16} /></button>
                                            <button onClick={() => handleDeleteCategory(cat._id)} className="text-red-600 hover:text-red-900"><Trash2 size={16} /></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {showCategoryModal && (
                            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                                <div className="bg-white p-8 rounded-lg max-w-md w-full">
                                    <h2 className="text-2xl font-serif mb-6">{editingCategoryId ? 'Edit Category' : 'Add Category'}</h2>
                                    <form onSubmit={handleAddCategory} className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Name</label>
                                            <input type="text" required value={newCategory.name} onChange={e => setNewCategory({ ...newCategory, name: e.target.value })} className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Description</label>
                                            <textarea value={newCategory.description} onChange={e => setNewCategory({ ...newCategory, description: e.target.value })} className="mt-1 block w-full border border-gray-300 rounded-md p-2" rows={3}></textarea>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Upload Image {editingCategoryId && '(Leave empty to keep existing)'}</label>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={e => setNewCategory({ ...newCategory, image: e.target.files ? e.target.files[0] : null })}
                                                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                            />
                                        </div>
                                        <div className="flex justify-end gap-4 mt-6">
                                            <button type="button" onClick={() => setShowCategoryModal(false)} className="px-4 py-2 text-gray-600">Cancel</button>
                                            <button type="submit" className="bg-primary text-white px-4 py-2 rounded-md">{editingCategoryId ? 'Update' : 'Save'}</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'hero' && (
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                            <h3 className="text-lg font-medium text-gray-900">Hero Slides</h3>
                            <button onClick={() => setShowHeroModal(true)} className="bg-primary text-white px-4 py-2 rounded-md flex items-center text-sm">
                                <Plus size={16} className="mr-2" /> Add Slide
                            </button>
                        </div>
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Heading</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {heroSlides.map((slide) => (
                                    <tr key={slide._id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <img
                                                src={slide.image?.startsWith('/')
                                                    ? `${(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api').replace('/api', '')}${slide.image}`
                                                    : slide.image}
                                                alt="" className="h-10 w-20 object-cover rounded" />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {slide.heading} <span className="text-gray-500 italic">{slide.subHeading}</span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {slide.productCode}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button onClick={() => handleEditHero(slide)} className="text-blue-600 hover:text-blue-900 mr-4"><Edit size={16} /></button>
                                            <button onClick={() => handleDeleteHero(slide._id)} className="text-red-600 hover:text-red-900"><Trash2 size={16} /></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {showHeroModal && (
                            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                                <div className="bg-white p-8 rounded-lg max-w-md w-full">
                                    <h2 className="text-2xl font-serif mb-6">{editingHeroId ? 'Edit Hero Slide' : 'Add Hero Slide'}</h2>
                                    <form onSubmit={handleAddHero} className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Upload Image {editingHeroId && '(Leave empty to keep existing)'}</label>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={e => setNewHero({ ...newHero, image: e.target.files ? e.target.files[0] : null })}
                                                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                                required={!editingHeroId}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Product Code</label>
                                            <input type="text" required value={newHero.productCode} onChange={e => setNewHero({ ...newHero, productCode: e.target.value })} className="mt-1 block w-full border border-gray-300 rounded-md p-2" placeholder="e.g. Est. 2024" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Type</label>
                                            <div className="mt-1 flex items-center space-x-4">
                                                <label className="flex items-center">
                                                    <input
                                                        type="radio"
                                                        name="type"
                                                        value="product"
                                                        checked={newHero.type === 'product'}
                                                        onChange={() => setNewHero({ ...newHero, type: 'product' })}
                                                        className="mr-2"
                                                    />
                                                    Product
                                                </label>
                                                <label className="flex items-center">
                                                    <input
                                                        type="radio"
                                                        name="type"
                                                        value="coming_soon"
                                                        checked={newHero.type === 'coming_soon'}
                                                        onChange={() => setNewHero({ ...newHero, type: 'coming_soon', productId: '' })}
                                                        className="mr-2"
                                                    />
                                                    Coming Soon
                                                </label>
                                            </div>
                                        </div>
                                        {newHero.type === 'product' && (
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Link Product</label>
                                                <select
                                                    value={newHero.productId || ''}
                                                    onChange={e => setNewHero({ ...newHero, productId: e.target.value })}
                                                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                                >
                                                    <option value="">Select a product...</option>
                                                    {products.map(p => (
                                                        <option key={p._id} value={p._id}>{p.name}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        )}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Heading (Main)</label>
                                            <input type="text" required value={newHero.heading} onChange={e => setNewHero({ ...newHero, heading: e.target.value })} className="mt-1 block w-full border border-gray-300 rounded-md p-2" placeholder="e.g. Elegance is an" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Heading (Emphasis)</label>
                                            <input type="text" required value={newHero.subHeading} onChange={e => setNewHero({ ...newHero, subHeading: e.target.value })} className="mt-1 block w-full border border-gray-300 rounded-md p-2" placeholder="e.g. Attitude" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Description</label>
                                            <textarea value={newHero.description} onChange={e => setNewHero({ ...newHero, description: e.target.value })} className="mt-1 block w-full border border-gray-300 rounded-md p-2" placeholder="Discover our curated collection..." />
                                        </div>
                                        <div className="flex justify-end gap-4 mt-6">
                                            <button type="button" onClick={() => { setShowHeroModal(false); setEditingHeroId(null); setNewHero(initialHeroState); }} className="px-4 py-2 text-gray-600">Cancel</button>
                                            <button type="submit" className="bg-primary text-white px-4 py-2 rounded-md">{editingHeroId ? 'Update Slide' : 'Save Slide'}</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'orders' && (
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Paid</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Delivered</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {orders.map((order) => (
                                    <tr key={order._id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order._id.substring(0, 10)}...</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.user?.name || 'Guest'}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${order.totalPrice.toFixed(2)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {order.isPaid ? <span className="text-green-600">Yes</span> : <span className="text-red-600">No</span>}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {order.isDelivered ? <span className="text-green-600">Yes</span> : <span className="text-red-600">No</span>}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            {!order.isDelivered && (
                                                <button onClick={() => handleDeliver(order._id)} className="text-primary hover:text-secondary">Mark Delivered</button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
                {activeTab === 'marquee' && (
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden p-6 max-w-2xl">
                        <h3 className="text-lg font-medium text-gray-900 mb-6 border-b pb-4">Marquee Settings</h3>
                        <form onSubmit={async (e) => {
                            e.preventDefault();
                            try {
                                await api.put('/marquee', marqueeConfig);
                                alert('Marquee updated successfully!');
                            } catch (err) {
                                console.error(err);
                                alert('Failed to update marquee');
                            }
                        }} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Marquee Text</label>
                                <textarea
                                    value={marqueeConfig.text}
                                    onChange={e => setMarqueeConfig({ ...marqueeConfig, text: e.target.value })}
                                    className="mt-1 block w-full border border-gray-300 rounded-md p-2 h-24"
                                    required
                                />
                            </div>
                            <div>
                                <label className="flex items-center space-x-3">
                                    <input
                                        type="checkbox"
                                        checked={marqueeConfig.isActive}
                                        onChange={e => setMarqueeConfig({ ...marqueeConfig, isActive: e.target.checked })}
                                        className="h-5 w-5 text-primary border-gray-300 rounded"
                                    />
                                    <span className="text-sm font-medium text-gray-700">Active (Show on Landing Page)</span>
                                </label>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Background Color</label>
                                <div className="flex items-center space-x-6">
                                    <label className="flex items-center">
                                        <input
                                            type="radio"
                                            name="bgColor"
                                            value="theme"
                                            checked={marqueeConfig.bgColor === 'theme'}
                                            onChange={() => setMarqueeConfig({ ...marqueeConfig, bgColor: 'theme' })}
                                            className="mr-2 h-4 w-4 text-primary"
                                        />
                                        Theme Color
                                    </label>
                                    <label className="flex items-center">
                                        <input
                                            type="radio"
                                            name="bgColor"
                                            value="red"
                                            checked={marqueeConfig.bgColor === 'red'}
                                            onChange={() => setMarqueeConfig({ ...marqueeConfig, bgColor: 'red' })}
                                            className="mr-2 h-4 w-4 text-red-700"
                                        />
                                        Luxury Red
                                    </label>
                                </div>
                            </div>
                            <div className="pt-4 border-t">
                                <button type="submit" className="bg-primary text-white px-6 py-2 rounded-md hover:bg-opacity-90 transition-colors">Save Settings</button>
                            </div>
                        </form>
                    </div>
                )}
            </main>
        </div>
    );
}
