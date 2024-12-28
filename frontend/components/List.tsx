import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableHeader,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Pencil2Icon,
  TrashIcon,
  PlusIcon,
  MagnifyingGlassIcon,
} from "@radix-ui/react-icons";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import Link from "next/link";

interface ListProps {
  name: string; // Name of the items (clients, vehicles, etc.)
  columns: { header: string; accessor: string }[]; // List of columns with header and accessor (key)
  rows: any[]; // Array of data (clients, vehicles, etc.)
  onEdit: (item: any) => void; // Function to handle editing an item
  onDelete: (id: any) => void; // Function to handle deleting an item
  onAdd: () => void; // Function to open the form to add a new item
  handleClickedRow: (id: any) => void; // Function to handle clicking on a row
}

export default function List({
  name,
  columns,
  rows,
  onEdit,
  onDelete,
  onAdd,
  handleClickedRow,
}: ListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredRows, setFilteredRows] = useState(rows);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [row, setRow] = useState<any | null>(null);
  const [filterStatus, setFilterStatus] = useState("actived"); // State for the select filter

  // Fonction pour filtrer les lignes en fonction de la recherche et du status
  useEffect(() => {
    const searchTerms = searchQuery
      .toLowerCase()
      .split(" ")
      .map((term) => term.trim());

    const filtered = rows.filter((row) => {
      // Vérifie si la ligne correspond au filtre `filterStatus`
      const isStatusMatch =
        (filterStatus === "actived" && !row.deletedAt) ||
        (filterStatus === "archived" && row.deletedAt);

      // Vérifie si la ligne correspond à la recherche
      const isSearchMatch = searchTerms.every((term) =>
        Object.values(row).some(
          (value) => value && value.toString().toLowerCase().includes(term)
        )
      );

      // Combine les deux conditions
      return isStatusMatch && isSearchMatch;
    });

    setFilteredRows(filtered);
  }, [searchQuery, rows, filterStatus]);

  // Fonction pour confirmer la suppression d'un élément
  const handleConfirmDelete = (row: any) => () => {
    setShowConfirmation(false);
    onDelete(row);
  };

  // Fonfirmation de la suppression
  const handleCancel = () => {
    setShowConfirmation(false);
  };

  return (
    <>
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
        <div className="flex justify-end items-center mb-4 space-x-4">
          <div>
            <Select onValueChange={setFilterStatus} defaultValue="actived">
              <SelectTrigger className="bg-gray-700 text-white border-gray-600 hover:bg-gray-600 focus:ring-indigo-500">
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 text-white">
                <SelectItem value="actived">Actived</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="relative w-64">
            <Input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-gray-700 text-white border-gray-600 focus:border-indigo-500"
            />
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <InfoCircledIcon className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="bg-gray-800 text-white p-2 rounded-md shadow-lg max-w-xs">
                  <p>
                    Search by multiple criteria separated by spaces (ex:
                    criterion1 criterion2 ...)
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          {onAdd && (
            <Button
              onClick={onAdd}
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              <PlusIcon className="mr-2 h-4 w-4" /> Add {name}
            </Button>
          )}
        </div>

        <Table>
          <TableHeader>
            <TableRow className="border-b border-gray-700">
              {columns.map((col, index) => (
                <TableHead key={index} className="text-indigo-300">
                  {col.header}
                </TableHead>
              ))}
              {filterStatus === "archived" && (
                <TableHead className="text-indigo-300">Archived At</TableHead>
              )}
              {(onEdit !== undefined || onDelete !== undefined) &&
              filterStatus === "actived" ? (
                <TableHead className="text-indigo-300">Actions</TableHead>
              ) : null}
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredRows.length > 0 ? (
              filteredRows.map((row, index) => (
                <TableRow
                  key={index}
                  className="border-b border-gray-700 cursor-pointer hover:bg-gray-700"
                >
                  {columns.map((col, colIndex) => (
                    <TableCell key={colIndex} className="text-gray-300">
                      <Link onClick={() => handleClickedRow(row.id)} href={""}>
                        {row[col.accessor]}
                      </Link>
                    </TableCell>
                  ))}
                  {filterStatus === "archived" && (
                    <TableCell className="text-gray-300">
                      {row.deletedAt
                        ? new Date(row.deletedAt).toLocaleString()
                        : "N/A"}
                    </TableCell>
                  )}
                  {(onEdit !== undefined || onDelete !== undefined) &&
                  filterStatus === "actived" ? (
                    <TableCell>
                      {onEdit && (
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => onEdit(row.id)}
                          className="mr-2 bg-gray-700 hover:bg-gray-600 text-indigo-300"
                        >
                          <Pencil2Icon className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => {
                          setRow(row.id);
                          setShowConfirmation(true);
                        }}
                        className="bg-red-600 hover:bg-red-700 text-white"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  ) : null}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length + 1}
                  className="text-center text-gray-400"
                >
                  Aucun élément trouvé
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent className="sm:max-w-[425px] bg-[#0f1725] text-white border-purple-600">
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
          </DialogHeader>
          <p className="py-4">Are you sure you want to delete this item?</p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={handleCancel}
              className="bg-transparent text-white border-white hover:bg-white/10"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete(row)}
              className="bg-purple-600 hover:bg-purple-700"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
