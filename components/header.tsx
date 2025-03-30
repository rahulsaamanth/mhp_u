import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "./ui/navigation-menu";
import Navbar from "./navbar";
import { ShoppingCart } from "lucide-react";
import { Button } from "./ui/button";

export default function Header() {
  return (
    <header className="flex w-full items-center justify-center gap-12 border px-4 py-4">
      <div>LOGO</div>
      <nav className="flex w-2/5 flex-col items-center justify-center">
        <div className="grid w-full place-items-center border-b">
          <Navbar />
        </div>
        <div className="grid w-full place-content-center py-4">search</div>
      </nav>
      <div className="flex items-center justify-center gap-4">
        <Button variant="ghost" className="cursor-pointer">
          <ShoppingCart />
        </Button>
        <div>Login/Register</div>
      </div>
    </header>
  );
}
