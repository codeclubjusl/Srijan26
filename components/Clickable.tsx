import { ReactNode, ComponentPropsWithoutRef } from "react";

type BaseProps = {
  children: ReactNode;
  className?: string;
  iconOnly?: boolean;
};

type LinkProps = BaseProps & { as?: "a" } & Omit<
    ComponentPropsWithoutRef<"a">,
    "className" | "children"
  >;

type ButtonProps = BaseProps & { as?: "button" } & Omit<
    ComponentPropsWithoutRef<"button">,
    "className" | "children"
  >;

type ClickableProps = LinkProps | ButtonProps;

export const Clickable = ({
  children,
  className = "",
  as = "button",
  iconOnly = false,
  ...rest
}: ClickableProps) => {
  const baseClassName = `px-10 h-10 font-bold transition-all hover:drop-shadow-[0_0_11px_rgba(200,200,200,0.6)] flex items-center justify-center ${className}`;
  const baseStyle = iconOnly
    ? {}
    : {
        clipPath:
          "polygon(9% 0%, 95.45% 0%, 100% 37.5%, 74.21% 100%, 16.67% 100%, 0% 37.5%)",
      };

  return as === "a" ? (
    <a
      {...(rest as React.ComponentPropsWithoutRef<"a">)}
      className={baseClassName}
      style={baseStyle}
    >
      {children}
    </a>
  ) : (
    <button
      {...(rest as React.ComponentPropsWithoutRef<"button">)}
      className={baseClassName}
      style={baseStyle}
    >
      {children}
    </button>
  );
};
