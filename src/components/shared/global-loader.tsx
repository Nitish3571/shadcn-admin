/**
 * GlobalLoader - A reusable loading component for various use cases
 * 
 * @example
 * // Default centered loader with text
 * <GlobalLoader text="Loading orders..." />
 * 
 * @example
 * // Fullscreen overlay loader
 * <GlobalLoader variant="fullscreen" text="Loading..." size="lg" />
 * 
 * @example
 * // Inline loader (for buttons, inline text)
 * <GlobalLoader variant="inline" text="Loading..." size="sm" />
 * 
 * @example
 * // Just the spinner (for tables, cards)
 * <GlobalLoader variant="spinner" size="md" />
 * 
 * @example
 * // Custom color
 * <GlobalLoader spinnerColor="text-blue-500" size="lg" />
 */

import React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import PageLayout from "./layout/page-layout";

interface GlobalLoaderProps {
    /**
     * Size of the loader
     * @default "md"
     */
    size?: "sm" | "md" | "lg" | "xl";

    /**
     * Variant of the loader
     * @default "default"
     */
    variant?: "default" | "spinner" | "fullscreen" | "inline";

    /**
     * Loading text to display
     */
    text?: string;

    /**
     * Additional className
     */
    className?: string;

    /**
     * Color of the spinner
     * @default "text-muted-foreground"
     */
    spinnerColor?: string;
}

const sizeConfig = {
    sm: {
        spinner: "h-4 w-4",
        text: "text-sm",
        gap: "gap-2",
    },
    md: {
        spinner: "h-6 w-6",
        text: "text-base",
        gap: "gap-2",
    },
    lg: {
        spinner: "h-8 w-8",
        text: "text-lg",
        gap: "gap-3",
    },
    xl: {
        spinner: "h-12 w-12",
        text: "text-xl",
        gap: "gap-4",
    },
};

const Loader: React.FC<GlobalLoaderProps> = ({
    size = "md",
    variant = "default",
    text,
    className,
    spinnerColor = "text-muted-foreground",
}) => {
    const config = sizeConfig[size];

    // Fullscreen variant - covers entire viewport
    if (variant === "fullscreen") {
        return (
            <div
                className={cn(
                    "fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm",
                    className
                )}
            >
                <div className="flex flex-col items-center gap-4">
                    <Loader2
                        className={cn(
                            config.spinner,
                            "animate-spin",
                            spinnerColor
                        )}
                    />
                    {text && (
                        <p className={cn(config.text, "text-muted-foreground font-medium")}>
                            {text}
                        </p>
                    )}
                </div>
            </div>
        );
    }

    // Inline variant - minimal spacing, for inline use
    if (variant === "inline") {
        return (
            <div className={cn("inline-flex items-center", config.gap, className)}>
                <Loader2
                    className={cn(
                        config.spinner,
                        "animate-spin",
                        spinnerColor
                    )}
                />
                {text && (
                    <span className={cn(config.text, "text-muted-foreground")}>
                        {text}
                    </span>
                )}
            </div>
        );
    }

    // Spinner variant - just the spinner, no container
    if (variant === "spinner") {
        return (
            <Loader2
                className={cn(
                    config.spinner,
                    "animate-spin",
                    spinnerColor,
                    className
                )}
            />
        );
    }

    // Default variant - centered with padding
    return (
        <div
            className={cn(
                "flex items-center justify-center py-12",
                className
            )}
        >
            <div className="flex flex-col items-center gap-4">
                <Loader2
                    className={cn(
                        config.spinner,
                        "animate-spin",
                        spinnerColor
                    )}
                />
                {text && (
                    <p className={cn(config.text, "text-muted-foreground font-medium")}>
                        {text}
                    </p>
                )}
            </div>
        </div>
    );
};

// export default Loader;

const GlobalLoader = ({ ...props }: GlobalLoaderProps) => {
    return <PageLayout>
        <Loader {...props} />
    </PageLayout>
}

export default GlobalLoader;
