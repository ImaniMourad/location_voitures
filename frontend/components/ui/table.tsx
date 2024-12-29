import * as React from "react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/context/context"; // Import du hook useTheme pour accéder au contexte

const Table = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement>
>(({ className, ...props }, ref) => {
  const { isDarkMode } = useTheme(); 

  return (
    <div className="relative w-full overflow-auto">
      <table
        ref={ref}
        className={cn(
          "w-full caption-bottom text-sm",
          isDarkMode ? "bg-gray-800 text-white" : "bg-white text-black", // Classes appliquées en fonction du mode
          className
        )}
        {...props}
      />
    </div>
  );
});
Table.displayName = "Table";

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => {
  const { isDarkMode } = useTheme(); // Récupère l'état du mode sombre

  return (
    <thead
      ref={ref}
      className={cn(
        "[&_tr]:border-b",
        isDarkMode ? "bg-gray-700 text-white" : "bg-gray-100 text-black", // Modifie le fond et la couleur du texte selon le mode
        className
      )}
      {...props}
    />
  );
});
TableHeader.displayName = "TableHeader";

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => {
  const { isDarkMode } = useTheme(); // Récupère l'état du mode sombre

  return (
    <tbody
      ref={ref}
      className={cn(
        "[&_tr:last-child]:border-0",
        isDarkMode ? "bg-gray-800 text-white" : "bg-white text-black", // Applique le fond et la couleur du texte selon le mode
        className
      )}
      {...props}
    />
  );
});
TableBody.displayName = "TableBody";

const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => {
  const { isDarkMode } = useTheme(); // Récupère l'état du mode sombre

  return (
    <tfoot
      ref={ref}
      className={cn(
        "border-t bg-muted/50 font-medium [&>tr]:last:border-b-0",
        isDarkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black", // Fond et texte adaptés en fonction du mode
        className
      )}
      {...props}
    />
  );
});
TableFooter.displayName = "TableFooter";

const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => {
  const { isDarkMode } = useTheme(); // Récupère l'état du mode sombre

  return (
    <tr
      ref={ref}
      className={cn(
        "border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
        isDarkMode ? "hover:bg-gray-600 text-white" : "hover:bg-gray-200 text-black", // Modifie la couleur du texte et l'effet hover
        className
      )}
      {...props}
    />
  );
});
TableRow.displayName = "TableRow";

const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => {
  const { isDarkMode } = useTheme(); // Récupère l'état du mode sombre

  return (
    <th
      ref={ref}
      className={cn(
        "h-10 px-2 text-left align-middle font-medium",
        isDarkMode ? "text-white" : "text-black", // Applique la couleur du texte
        className
      )}
      {...props}
    />
  );
});
TableHead.displayName = "TableHead";

const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => {
  const { isDarkMode } = useTheme(); // Récupère l'état du mode sombre

  return (
    <td
      ref={ref}
      className={cn(
        "p-2 align-middle",
        isDarkMode ? "text-white" : "text-black", // Applique la couleur du texte en fonction du mode
        className
      )}
      {...props}
    />
  );
});
TableCell.displayName = "TableCell";

const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => {
  const { isDarkMode } = useTheme(); // Récupère l'état du mode sombre

  return (
    <caption
      ref={ref}
      className={cn(
        "mt-4 text-sm",
        isDarkMode ? "text-white" : "text-black", // Change la couleur du texte en fonction du mode
        className
      )}
      {...props}
    />
  );
});
TableCaption.displayName = "TableCaption";

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
};
