"use client";

import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, User, Menu, X, Search } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useCartStore } from '../store/useCartStore';
import { usePathname } from 'next/navigation';

const Navbar = () => {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const { user, logout } = useAuthStore();
    const { cartItems } = useCartStore();

    const navItems = ['Home', 'Shop', 'About', 'Contact'];

    const isAuthenticated = !!user;
    const cartCount = cartItems.length;

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    // Hide Navbar on admin pages to avoid duplication with Dashboard layout
    if (pathname && pathname.startsWith('/admin')) {
        return null;
    }

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-background/90 backdrop-blur-md shadow-sm py-4' : 'bg-transparent py-6'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <Link href="/" className="block relative w-32 h-12">
                        <Image
                            src="/jewel_logo_color.png"
                            alt="Jewel Main Logo"
                            fill
                            className="object-contain hover:opacity-60 transition-opacity duration-300"
                        />
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-12">
                        {navItems.map((item) => {
                            const href = item === 'Home' ? '/' : `/${item.toLowerCase()}`;
                            const isActive = pathname === href || (item === 'Shop' && pathname && pathname.startsWith('/shop'));

                            return (
                                <Link
                                    key={item}
                                    href={href}
                                    className="text-sm uppercase tracking-[0.2em] transition-colors relative group text-foreground hover:text-primary"
                                >
                                    {item === 'About' ? 'Our Story' : item}
                                    <span className={`absolute -bottom-2 left-0 h-[1px] bg-primary transition-all duration-300 ${isActive ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
                                </Link>
                            );
                        })}
                    </div>

                    {/* Icons */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link href="/search" className="text-foreground hover:text-primary transition-colors duration-300">
                            <Search size={20} strokeWidth={1} />
                        </Link>

                        <Link href="/cart" className="text-foreground hover:text-primary transition-colors duration-300 relative">
                            <ShoppingCart size={20} strokeWidth={1} />
                            {cartCount > 0 && (
                                <span className="absolute -top-2 -right-2 bg-primary text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                                    {cartCount}
                                </span>
                            )}
                        </Link>

                        {isAuthenticated ? (
                            <div className="relative group">
                                <Link href="/profile" className="text-foreground hover:text-primary transition-colors duration-300">
                                    <User size={20} strokeWidth={1} />
                                </Link>
                                <div className="absolute right-0 w-48 mt-2 origin-top-right bg-background border border-gray-200 text-foreground rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                                    <div className="py-1">
                                        <Link href="/profile" className="block px-4 py-2 text-sm hover:bg-gray-100 hover:text-primary transition-colors">PROFILE</Link>
                                        {user.role === 'admin' && (
                                            <Link href="/admin" className="block px-4 py-2 text-sm hover:bg-gray-100 hover:text-primary transition-colors">DASHBOARD</Link>
                                        )}
                                        <button onClick={() => logout()} className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 hover:text-primary transition-colors">LOGOUT</button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <Link href="/login" className="text-foreground hover:text-primary transition-colors duration-300">
                                <User size={20} strokeWidth={1} />
                            </Link>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center">
                        <button onClick={() => setIsOpen(!isOpen)} className="text-foreground hover:text-primary focus:outline-none">
                            {isOpen ? <X size={24} strokeWidth={1} /> : <Menu size={24} strokeWidth={1} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            {isOpen && (
                <div className="md:hidden absolute top-full left-0 w-full bg-background border-t border-secondary shadow-lg py-4 px-4 flex flex-col space-y-4 animate-fade-in-up">
                    {navItems.map((item) => {
                        const href = item === 'Home' ? '/' : `/${item.toLowerCase()}`;
                        const isActive = pathname === href || (item === 'Shop' && pathname && pathname.startsWith('/shop'));

                        return (
                            <Link
                                key={item}
                                href={href}
                                onClick={() => setIsOpen(false)}
                                className={`block text-xl font-serif transition-colors duration-300 ${isActive ? 'text-foreground border-l-2 pl-2 border-primary hover:text-primary' : 'text-foreground hover:text-primary'}`}
                            >
                                {item === 'About' ? 'Our Story' : item}
                            </Link>
                        );
                    })}
                    {user ? (
                        <>
                            <Link href="/profile" onClick={() => setIsOpen(false)} className="block text-xl font-serif text-foreground hover:text-primary transition-colors duration-300">Profile</Link>
                            <button onClick={() => { logout(); setIsOpen(false) }} className="block w-full text-left text-xl font-serif text-foreground hover:text-primary transition-colors duration-300">Logout</button>
                        </>
                    ) : (
                        <Link href="/login" onClick={() => setIsOpen(false)} className="block text-xl font-serif text-foreground hover:text-primary transition-colors duration-300">Login</Link>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;
