import { Link, useNavigate } from "react-router-dom";
import { HousePlug, LogOut, Menu, ShoppingCart, UserCog } from 'lucide-react';
import {
    Sheet,
    SheetContent,
    SheetTrigger,
    SheetTitle,
    SheetHeader,
    SheetDescription,
} from "@/components/ui/sheet";
import { Button } from '../ui/button';
import { useDispatch, useSelector } from 'react-redux';
import { shoppingViewHeaderMenuItems } from "../../config";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { logoutUser } from "../../store/auth-slice";

function MenuItems() {
    const navigate = useNavigate();

    function handleNavigate(path) {
        const url = new URL(path, window.location.origin);
        const queryParams = new URLSearchParams(url.search);
    
        let filters = {};
    
        for (const [key, value] of queryParams.entries()) {
            if (filters[key]) {
                if (Array.isArray(filters[key])) {
                    filters[key].push(value);
                } else {
                    filters[key] = [filters[key], value];
                }
            } else {
                filters[key] = [value];
            }
        }
        sessionStorage.setItem('filters', JSON.stringify(filters));
        
        const newUrl = `${url.pathname}?${queryParams.toString()}`;
        navigate(newUrl);
    }
    
    return <nav className="flex flex-col mb-3 lg:mb-0 lg:items-center gap-6 lg:flex-row">
        {
            shoppingViewHeaderMenuItems.map((menuItem) =>
                <div className="text-sm font-medium cursor-pointer" onClick={() => handleNavigate(menuItem.path)} key={menuItem.id}>
                    {menuItem.label}
                </div>)
        }
    </nav>
}

function HeaderRightContent() {

    const { user } = useSelector(state => state.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    function handleLogOut() {
        sessionStorage.setItem('filters', JSON.stringify({}));
        dispatch(logoutUser());
    }

    return <div className="flex lg:items-center lg:flex-row flex-col gap-4">
        <Button variant='outline' size='icon'>
            <ShoppingCart className="w-6 h-6" />
            <span className="sr-only">User cart</span>
        </Button>
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Avatar className="bg-black">
                    <AvatarFallback className="bg-black text-white font-extrabold">
                        {user?.userName[0].toUpperCase()}
                    </AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="right" className="w-56">
                <DropdownMenuLabel>Logged in as {user?.userName}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/shop/account')}>
                    <UserCog className="mr-2 h-4 w-4" />
                    Account
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleLogOut()}>
                    <LogOut className="mr-2 h-4 w-4" />
                    LogOut
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    </div>
}

function ShoppingHeader() {

    return <header className="sticky top-0 z-40 w-full border-b bg-background">
        <div className="flex h-16 items-center justify-between px-4 md:px-6">
            <Link to="/shop/home" className="flex items-center gap-2">
                <HousePlug className="h-6 w-6" />
                <span className="font-bold">Ecommerce</span>
            </Link>
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="outline" size='icon' className="lg:hidden">
                        <Menu className="h-6 w-6" />
                        <span className="sr-only">Toggle header menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side='left' className="w-full max-w-xs">
                    <SheetHeader>
                        <SheetTitle>

                        </SheetTitle>
                        <SheetDescription>

                        </SheetDescription>
                    </SheetHeader> 

                    <MenuItems />
                    <HeaderRightContent />
                </SheetContent>
            </Sheet>
            <div className="hidden lg:block">
                <MenuItems />
            </div>
            <div className="hidden lg:block">
                <HeaderRightContent />
            </div>
        </div>
    </header>;
}

export default ShoppingHeader;