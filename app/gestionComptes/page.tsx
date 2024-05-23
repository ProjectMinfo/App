'use client';
import React, { Key } from "react";
import {Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Chip, Tooltip} from "@nextui-org/react";
import {columns, users} from "./data.js";
import {EditIcon} from "../../public/EditIcon.jsx";

// Define types for users

interface UserType {
  id: number;
  name: string;
  firstname: string;
  solde: number;
  access: string;
  [key: string]: any; // To handle dynamic keys
}


function accessColorMap(quelleCouleurPourLUtilisateur:UserType) {
  switch (quelleCouleurPourLUtilisateur.access) {
    case "user":
      return "success"
    case "serveur":
      return "primary"
    case "admin":
      return "danger"
    default:
      return "warning"
  }
};

function colorSolde(soldeDuCompte:number) {
  return soldeDuCompte < 0 ? "text-danger" : soldeDuCompte == 0 ? "text-default" : soldeDuCompte < 3.30 ? "text-warning" : "text-success"
}

export default function gestionComptePage() {

  const renderCell = React.useCallback((user:UserType, columnKey:Key) => {
    const cellValue = user[columnKey as keyof UserType];

    switch (columnKey) {
      case "id":
      case "name":
      case "firstname":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-sm capitalize">{cellValue}</p>
          </div>
        );
      case "solde":
        return (
          <div className="flex flex-col">
            <p className={`text-bold text-sm capitalize ${colorSolde(cellValue)}`}>{cellValue + " €"}</p>
          </div>
        );
      case "access":
        return (
          <Chip
            className="capitalize"
            color={accessColorMap(user)}
            size="sm"
            variant="flat"
          >
            {cellValue}
          </Chip>
      );
      case "modifier":
        return (
          <div className="relative flex items-center gap-2">
            <Tooltip content="Modifier">
              <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                <EditIcon />
              </span>
            </Tooltip>
          </div>
      );
      default:
        return cellValue;
    }
  }, []);

  return (
    <Table aria-label="Example table with custom cells">
      <TableHeader columns={columns}>
        {(column) => (
          <TableColumn key={column.uid}>
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody items={users}>
        {(item) => (
          <TableRow key={item.id}>
            {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
