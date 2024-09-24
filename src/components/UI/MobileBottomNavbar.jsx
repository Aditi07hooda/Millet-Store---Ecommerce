import React from 'react'
import { HeartIcon, HomeIcon } from "@heroicons/react/24/outline"
import { BiSolidCategoryAlt } from "react-icons/bi";
import Badge, { BadgeProps } from '@mui/material/Badge';
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Link from 'next/link';
import { useSelector } from 'react-redux';

function MobileBottomNavbar() {
    const cartItems = useSelector((state) => state.cart.items);
    const cartCount = String(cartItems.length)

    const bottomItems = [
        { label: 'Home', href: '/', icon: HomeIcon, },
        { label: 'Category', href: '/', icon: BiSolidCategoryAlt, },
        {
            label: 'Wishlist',
            href: '/wishlist',
            icon: HeartIcon,
        }, {
            label: 'Cart',
            href: '/cart',
            icon: 'info-circle'
        }, {
            label: '',
            href: '/',
            icon: 'phone-alt'
        },
    ]

    const StyledBadge = styled(Badge)(({ theme }) => ({
        '& .MuiBadge-badge': {
            right: -3,
            top: 13,
            border: `1px solid ${theme.palette.background.paper}`,
            backgroundColor: '#8B4513',
            padding: '0 1px',
        },
    }));

    return (
        <>
            <div className="sticky bottom-0 z-10 bg-secondary">
                <div className="flex justify-between items-center px-4 py-2 text-sm text-black">
                    {bottomItems.map((item) => {
                        const cartItem = item.label;
                        console.log(cartItem)
                        {
                            (cartItem === 'Cart') ? (
                                <IconButton aria-label="cart">
                                    <StyledBadge badgeContent={cartCount} color="secondary">
                                        <ShoppingCartIcon />
                                    </StyledBadge>
                                </IconButton>
                            ) : (
                                <Link
                                    key={item.label}
                                    href={item.href}
                                    className="flex flex-col items-center hover:bg-primary"
                                >
                                    <item.icon className="w-5 h-5" />
                                    <p className='text-xs text-gray-500'>{item.label}</p>
                                </Link>
                            )
                        }
                    })
                    }
                </div>
            </div>
        </>
    )
}

export default MobileBottomNavbar
