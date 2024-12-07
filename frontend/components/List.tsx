import { useState } from "react";
import { Table, TableBody, TableHeader, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil2Icon, TrashIcon, PlusIcon, MagnifyingGlassIcon } from "@radix-ui/react-icons";

interface ListProps {
    name: string; // Name of the items (clients, vehicles, etc.)
    columns: { header: string; accessor: string }[]; // List of columns with header and accessor (key)
    rows: any[]; // Array of data (clients, vehicles, etc.)
    onEdit: (item: any) => void; // Function to handle editing an item
    onDelete: (id: number) => void; // Function to handle deleting an item
    onAdd: () => void; // Function to open the form to add a new item
}

export default function List({ name, columns, rows, onEdit, onDelete, onAdd }: ListProps) {
    const [searchQuery, setSearchQuery] = useState("");

    // Fonction pour filtrer les lignes en fonction de la recherche
    const filteredRows = rows.filter((row) =>
        columns.some((col) =>
            row[col.accessor]?.toString().toLowerCase().includes(searchQuery.toLowerCase())
        )
    );

    return (
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <div className="flex justify-end items-center mb-4 space-x-4">
                <div className="relative w-64">
                    <Input
                        type="text"
                        placeholder="Rechercher..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 bg-gray-700 text-white border-gray-600 focus:border-indigo-500"
                    />
                    <MagnifyingGlassIcon
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5"/>
                </div>
                {onAdd && (
                    <Button onClick={onAdd} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                        <PlusIcon className="mr-2 h-4 w-4"/> Add {name}
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
                        {onEdit || onDelete ? (
                            <TableHead className="text-indigo-300">Actions</TableHead>
                        ) : null}
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {filteredRows.length > 0 ? (
                        filteredRows.map((row, index) => (
                            <TableRow key={index} className="border-b border-gray-700">
                                {columns.map((col, colIndex) => (
                                    <TableCell key={colIndex} className="text-gray-300">
                                        {row[col.accessor]}
                                    </TableCell>
                                ))}
                                {onEdit || onDelete ? (
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
                                        {onDelete && (
                                            <Button
                                                variant="destructive"
                                                size="icon"
                                                onClick={() => onDelete(row.id)}
                                                className="bg-red-600 hover:bg-red-700 text-white"
                                            >
                                                <TrashIcon className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </TableCell>
                                ) : null}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={columns.length + 1} className="text-center text-gray-400">
                                Aucun élément trouvé
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
