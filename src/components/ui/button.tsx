import Link from "next/link";
import { LucideIcon } from "lucide-react";

type ButtonProps = {
  href: string;
  children: React.ReactNode;
  Icon?: LucideIcon;
};

export const Button = ({ href, children, Icon }: ButtonProps) => {
  return (
    <Link
      href={href}
      className="flex items-center justify-center gap-2 rounded-md bg-white px-6 py-3 font-bold text-mxpink transition-transform hover:scale-102 hover:rounded-xs"
    >
      {Icon && <Icon size={20} />}
      {children}
    </Link>
  );
};
