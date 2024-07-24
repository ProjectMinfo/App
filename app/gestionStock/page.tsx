'use client';  // Indique que ce composant doit être rendu côté client.

import { getIngredientsExtras, getIngredients, getViandes, getSnacks, getBoissons, postIngredients, postViandes, postSnacks, postBoissons, postIngredientsExtras } from "@/config/api";
import { Boissons, Ingredients, Snacks, Viandes } from "@/types";
import { Table, TableBody, TableHeader, TableColumn, TableRow, TableCell, Input, Card, Button } from "@nextui-org/react";
import { useEffect, useState } from "react";

import EditQuantityModal from "@/components/EditQuantityModal";


type AllTypes = Ingredients | Viandes | Snacks | Boissons;

const GestionStock = () => {
  const [listIngredients, setIngredients] = useState<Ingredients[] | Viandes[]>([]);
  const [listViandes, setViandes] = useState<Viandes[]>([]);
  const [listSnacks, setListSnacks] = useState<Snacks[]>([]);
  const [listBoissons, setListBoissons] = useState<Boissons[]>([]);
  const [listExtras, setListExtras] = useState<Ingredients[]>([]);

  const [filteredIngredients, setFilteredIngredients] = useState<Ingredients[] | Viandes[]>([]);
  const [filteredViandes, setFilteredViandes] = useState<Viandes[]>([]);
  const [filteredSnacks, setFilteredSnacks] = useState<Snacks[]>([]);
  const [filteredBoissons, setFilteredBoissons] = useState<Boissons[]>([]);
  const [filteredExtras, setFilteredExtras] = useState<Ingredients[]>([]);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<AllTypes | null>(null);
  const [selectedItemType, setSelectedItemType] = useState<string | null>(null);

  const [search, setSearch] = useState("");


  function openEditModal(ingredient: AllTypes, type: string) {
    setSelectedItem(ingredient);
    setSelectedItemType(type);
    setIsEditModalOpen(true);
  }

  // Fetch data
  useEffect(() => {
    async function fetchData() {
      const [fetchedExtras, fetchedIngredients, fetchedViandes, fetchedSnacks, fetchedBoissons] = await Promise.all([
        getIngredientsExtras(),
        getIngredients(),
        getViandes(),
        getSnacks(),
        getBoissons(),
      ]);
      setListExtras(fetchedExtras);
      setIngredients(fetchedIngredients);
      setViandes(fetchedViandes);
      setListSnacks(fetchedSnacks);
      setListBoissons(fetchedBoissons);

      setFilteredIngredients(fetchedIngredients);
      setFilteredViandes(fetchedViandes);
      setFilteredSnacks(fetchedSnacks);
      setFilteredBoissons(fetchedBoissons);
      setFilteredExtras(fetchedExtras);
    }
    fetchData();
  }, []);


  function updateQuantity(quantity: string) {
    switch (selectedItemType) {
      case "ingredient":
        const newIngredients = listIngredients.map((ingredient) =>
          ingredient.id === selectedItem?.id ? { ...ingredient, quantite: parseInt(quantity) } : ingredient
        );

        const updatedIngredient = newIngredients.find((ingredient) => ingredient.id === selectedItem?.id);
        postIngredients(updatedIngredient);

        setIngredients(newIngredients);
        break;
      case "viande":
        const newViandes = listViandes.map((viande) =>
          viande.id === selectedItem?.id ? { ...viande, quantite: parseInt(quantity) } : viande
        );

        const updatedViande = newViandes.find((viande) => viande.id === selectedItem?.id);
        postViandes(updatedViande);

        setViandes(newViandes);
        break;
      case "snack":
        const newSnacks = listSnacks.map((snack) =>
          snack.id === selectedItem?.id ? { ...snack, quantite: parseInt(quantity) } : snack
        );
        setListSnacks(newSnacks);

        const updatedSnack = newSnacks.find((snack) => snack.id === selectedItem?.id);
        postSnacks(updatedSnack);

        break;
      case "boisson":
        const newBoissons = listBoissons.map((boisson) =>
          boisson.id === selectedItem?.id ? { ...boisson, quantite: parseInt(quantity) } : boisson
        );
        setListBoissons(newBoissons);

        const updatedBoisson = newBoissons.find((boisson) => boisson.id === selectedItem?.id);
        postBoissons(updatedBoisson);

        break;
      case "extra":
        const newExtras = listExtras.map((extra) =>
          extra.id === selectedItem?.id ? { ...extra, quantite: parseInt(quantity) } : extra
        );
        setListExtras(newExtras);

        const updatedExtra = newExtras.find((extra) => extra.id === selectedItem?.id);
        postIngredientsExtras(updatedExtra);

        break;
      default:
        break;
    }
  }


  useEffect(() => {
    setFilteredIngredients(
      listIngredients.filter((ingredient) => ingredient.nom.toLowerCase().includes(search))
    );
    setFilteredViandes(
      listViandes.filter((viande) => viande.nom.toLowerCase().includes(search))
    );
    setFilteredSnacks(
      listSnacks.filter((snack) => snack.nom.toLowerCase().includes(search))
    );
    setFilteredBoissons(
      listBoissons.filter((boisson) => boisson.nom.toLowerCase().includes(search))
    );
    setFilteredExtras(
      listExtras.filter((extra) => extra.nom.toLowerCase().includes(search))
    );
  }, [search, listIngredients, listViandes, listSnacks, listBoissons, listExtras]);


  return (
    <div className="flex flex-col gap-4 max-w-lg justify-center items-center mx-3">
      <div className="w-full">
        <Input
          autoFocus
          placeholder="Rechercher..."
          onChange={(e) => {
            setSearch(e.target.value.toLowerCase());
          }}
        />
      </div>

      <Card className="w-full">
        <h3 className="my-1">Boissons</h3>
        <Table aria-label="Liste des boissons">
          <TableHeader>
            <TableColumn className="text-center">ID</TableColumn>
            <TableColumn className="text-center">Produit</TableColumn>
            <TableColumn className="text-center">Quantité</TableColumn>
            <TableColumn className="text-center">Actions</TableColumn>
          </TableHeader>
          <TableBody>
            {filteredBoissons.map((boisson) => (
              <TableRow key={boisson.id}>
                <TableCell>{boisson.id}</TableCell>
                <TableCell>{boisson.nom}</TableCell>
                <TableCell>{boisson.quantite}</TableCell>
                <TableCell>
                  <Button onClick={() => openEditModal(boisson, "boisson")}>Modifier</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <Card className="w-full">
        <h3 className="my-1">Snacks</h3>
        <Table aria-label="Liste des snacks">
          <TableHeader>
            <TableColumn className="text-center">ID</TableColumn>
            <TableColumn className="text-center">Produit</TableColumn>
            <TableColumn className="text-center">Quantité</TableColumn>
            <TableColumn className="text-center">Actions</TableColumn>
          </TableHeader>
          <TableBody>
            {filteredSnacks.map((snack) => (
              <TableRow key={snack.id}>
                <TableCell>{snack.id}</TableCell>
                <TableCell>{snack.nom}</TableCell>
                <TableCell>{snack.quantite}</TableCell>
                <TableCell>
                  <Button onClick={() => openEditModal(snack, "snack")}>Modifier</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <Card className="w-full">
        <h3 className="my-1">Viandes</h3>
        <Table aria-label="Liste des viandes">
          <TableHeader>
            <TableColumn className="text-center">ID</TableColumn>
            <TableColumn className="text-center">Produit</TableColumn>
            <TableColumn className="text-center">Quantité</TableColumn>
            <TableColumn className="text-center">Actions</TableColumn>
          </TableHeader>
          <TableBody>
            {filteredViandes.map((viande) => (
              <TableRow key={viande.id}>
                <TableCell>{viande.id}</TableCell>
                <TableCell>{viande.nom}</TableCell>
                <TableCell>{viande.quantite}</TableCell>
                <TableCell>
                  <Button onClick={() => openEditModal(viande, "viande")}>Modifier</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <Card className="w-full">
        <h3 className="my-1">Ingrédients</h3>
        <Table aria-label="Liste des ingrédients">
          <TableHeader>
            <TableColumn className="text-center">ID</TableColumn>
            <TableColumn className="text-center">Produit</TableColumn>
            <TableColumn className="text-center">Quantité</TableColumn>
            <TableColumn className="text-center">Actions</TableColumn>
          </TableHeader>
          <TableBody>
            {filteredIngredients.map((ingredient) => (
              <TableRow key={ingredient.id}>
                <TableCell>{ingredient.id}</TableCell>
                <TableCell>{ingredient.nom}</TableCell>
                <TableCell>{ingredient.quantite}</TableCell>
                <TableCell>
                  <Button onClick={() => openEditModal(ingredient, "ingredient")}>Modifier</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <Card className="w-full">
        <h3 className="my-1">Extras</h3>
        <Table aria-label="Liste des extras">
          <TableHeader>
            <TableColumn className="text-center">ID</TableColumn>
            <TableColumn className="text-center">Produit</TableColumn>
            <TableColumn className="text-center">Quantité</TableColumn>
            <TableColumn className="text-center">Actions</TableColumn>
          </TableHeader>
          <TableBody>
            {filteredExtras.map((extra) => (
              <TableRow key={extra.id}>
                <TableCell>{extra.id}</TableCell>
                <TableCell>{extra.nom}</TableCell>
                <TableCell>{extra.quantite}</TableCell>
                <TableCell>
                  <Button onClick={() => openEditModal(extra, "extra")}>Modifier</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <EditQuantityModal
        isOpen={isEditModalOpen}
        onClose={(quantite) => {
          if (quantite !== "") {
            updateQuantity(quantite);
          }
          setIsEditModalOpen(false);
        }}
        ingredient={selectedItem}
      />
    </div>
  );
}

export default GestionStock;
