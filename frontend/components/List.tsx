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
import { useTheme } from "../context/context";

interface ListProps {
  name: string;
  columns: { header: string; accessor: string }[];
  rows: any[];
  onEdit: (item: any) => void;
  onDelete: (id: any) => void;
  onAdd: () => void;
  handleClickedRow: (id: any) => void;
}

const ITEMS_PER_PAGE = 8;

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
  const [filterStatus, setFilterStatus] = useState("actived");
  const { isDarkMode } = useTheme();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [is_paid, setIsPaid] = useState(false);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

  useEffect(() => {
    setTotalPages(
      Math.ceil(
        rows.filter((row) =>
          filterStatus === "actived" ? !row.deletedAt : row.deletedAt
        ).length / ITEMS_PER_PAGE
      )
    );
  }, [rows]);

  useEffect(() => {
    const searchTerms = searchQuery
      .toLowerCase()
      .split(" ")
      .map((term) => term.trim());

    const filtered = rows.filter((row) => {
      const isStatusMatch =
        (filterStatus === "actived" && !row.deletedAt) ||
        (filterStatus === "archived" && row.deletedAt);

      const isSearchMatch = searchTerms.every((term) =>
        Object.values(row).some(
          (value) => value && value.toString().toLowerCase().includes(term)
        )
      );

      const paginationMatch =
        rows.indexOf(row) >= startIndex &&
        rows.indexOf(row) < startIndex + ITEMS_PER_PAGE;

      return isStatusMatch && isSearchMatch && paginationMatch;
    });

    setFilteredRows(filtered);
  }, [searchQuery, rows, filterStatus, currentPage]);

  const handleConfirmDelete = (row: any) => () => {
    setShowConfirmation(false);
    onDelete(row);
  };

  const handleCancel = () => {
    setShowConfirmation(false);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  return (
    <>
      <div
        className={`${
          isDarkMode ? "bg-gray-800" : "bg-white"
        } p-6 rounded-lg shadow-lg`}
      >
        <div className="flex justify-end items-center mb-4 space-x-4">
          <div>
            <Select
              onValueChange={(value) => {
                setFilterStatus(value);
                setCurrentPage(1);
                setTotalPages(
                  Math.ceil(
                    filteredRows.filter((row) =>
                      value === "actived" ? !row.deletedAt : row.deletedAt
                    ).length / ITEMS_PER_PAGE
                  ) + 1
                );
              }}
              defaultValue="actived"
            >
              <SelectTrigger
                className={`${
                  isDarkMode ? "bg-gray-700 text-white" : "bg-white text-black"
                } border-gray-600 hover:bg-gray-600 focus:ring-indigo-500`}
              >
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent
                className={`${
                  isDarkMode ? "bg-gray-700 text-white" : "bg-white text-black"
                } border-gray-600`}
              >
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
              onChange={(e) => {
                setSearchQuery(e.target.value), setCurrentPage(1);
              }}
              className={`pl-10 ${
                isDarkMode ? "bg-gray-700 text-white" : "bg-white text-black"
              } border-gray-600 focus:border-indigo-500`}
            />
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <InfoCircledIcon className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 cursor-help" />
                </TooltipTrigger>
                <TooltipContent
                  className={`${
                    isDarkMode
                      ? "bg-gray-800 text-white"
                      : "bg-white text-black"
                  } p-2 rounded-md shadow-lg max-w-xs`}
                >
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
              className={`${
                isDarkMode
                  ? "bg-indigo-600 hover:bg-indigo-700"
                  : "bg-blue-600 hover:bg-blue-700"
              } text-white`}
            >
              <PlusIcon className="mr-2 h-4 w-4" /> Add {name}
            </Button>
          )}
        </div>

        <Table>
          <TableHeader>
            <TableRow className="border-b border-gray-700">
              {columns.map((col, index) => (
                <TableHead
                  key={index}
                  className={isDarkMode ? "text-indigo-300" : "text-black"}
                >
                  {col.header}
                </TableHead>
              ))}
              {filterStatus === "archived" && (
                <TableHead
                  className={isDarkMode ? "text-gray-300" : "text-black"}
                >
                  Archived At
                </TableHead>
              )}
              {(onEdit !== undefined || onDelete !== undefined) &&
              filterStatus === "actived" ? (
                <TableHead
                  className={isDarkMode ? "text-gray-300" : "text-black"}
                >
                  Actions
                </TableHead>
              ) : null}
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredRows.length > 0 ? (
              filteredRows.map((row, index) => (
                <TableRow
                  key={index}
                  className={`border-b ${
                    isDarkMode
                      ? "border-gray-700 hover:bg-gray-700"
                      : "border-gray-200 hover:bg-gray-100"
                  } cursor-pointer`}
                >
                  {columns.map((col, colIndex) => (
                    <TableCell
                      key={colIndex}
                      className={isDarkMode ? "text-gray-300" : "text-black"}
                    >
                      <Link onClick={() => handleClickedRow(row.id)} href={""}>
                        {row[col.accessor]}
                      </Link>
                    </TableCell>
                  ))}
                  {filterStatus === "archived" && (
                    <TableCell
                      className={isDarkMode ? "text-gray-300" : "text-black"}
                    >
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
                          setIsPaid(row.is_paid !== null ? true : false);
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
                  className={`text-center ${
                    isDarkMode ? "text-gray-400" : "text-black"
                  }`}
                >
                  Aucun élément trouvé
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <div className="flex justify-end items-center mt-4 space-x-4">
          <Button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className={`${
              isDarkMode
                ? "bg-gray-700 hover:bg-gray-600"
                : "bg-blue-600 hover:bg-blue-700"
            } text-white`}
          >
            Précédent
          </Button>
          <span
            className={`${
              isDarkMode ? "text-gray-300" : "text-black"
            } font-medium text-sm`}
          >
            Page {currentPage} sur {totalPages}
          </span>
          <Button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className={`${
              isDarkMode
                ? "bg-gray-700 hover:bg-gray-600"
                : "bg-blue-600 hover:bg-blue-700"
            } text-white`}
          >
            Suivant
          </Button>
        </div>
      </div>

      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent
          className={`sm:max-w-[425px] ${
            isDarkMode ? "bg-gray-800 text-white" : "bg-white text-black"
          } border-purple-600`}
        >
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
          </DialogHeader>
          {is_paid && (
            <p >
                <span className="text-red-600 font-bold text-lg">
                Warning : the reservation is paid by the client !
                </span>
              </p>
              )}
              <p className="py-2 text-lg">Are you sure you want to delete this item?</p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={handleCancel}
              className={`bg-transparent ${
                isDarkMode
                  ? "text-white border-white"
                  : "text-black border-black"
              } hover:bg-white/10`}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete(row)}
              className={`${
                isDarkMode
                  ? "bg-purple-600 hover:bg-purple-700"
                  : "bg-red-600 hover:bg-red-700"
              }`}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
