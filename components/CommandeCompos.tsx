import { Menus, Plats, Snacks, Boissons } from "@/types";
import { Card, CardHeader, Divider, CardBody } from "@nextui-org/react";
import { useEffect, useState } from "react";

// Type Definitions
type NewMenus = {
    id: number;
    type: "menu";
    menu: Menus;
    menuId: number;
};

type NewPlats = {
    id: number;
    type: "plat";
    plat: Plats;
    menuId?: number;
};

type NewSnacks = {
    id: number;
    type: "snack";
    snack: Snacks;
    menuId?: number;
};

type NewBoissons = {
    id: number;
    type: "boisson";
    boisson: Boissons;
    menuId?: number;
};

type NewRepas = {
    menu: NewMenus[];
    plat: NewPlats[];
    snack: NewSnacks[];
    boisson: NewBoissons[];
    complete: boolean;
    remainingPlats: number;
    remainingPerifs: number;
    currentMenu?: NewMenus;
};

type AllType = NewMenus | NewPlats | NewSnacks | NewBoissons;

interface RecapitulatifProps {
    repas: NewRepas;
    isServeur: boolean;
    handleDeleteItem: (type: keyof NewRepas, item: AllType) => void;
}

export function RecapComponent({ repas, handleDeleteItem, isServeur}: RecapitulatifProps) {
    const [prixTotal, setPrixTotal] = useState<number>(0.0);

    useEffect(() => {
        let total = 0;
        repas.menu.forEach(menu => {
            if (isServeur) {
                total += menu.menu.prixServeur;
            }
            else {
                total += menu.menu.prix;
            }
        });
        repas.plat.forEach(plat => {
            if (isServeur) {
                total += plat.plat.prixServeur;
            }
            else {
                total += plat.plat.prix;
            }
        });
        repas.snack.forEach(snack => {
            if (isServeur) {
                total += snack.snack.prixServeur;
            }
            else {
                total += snack.snack.prix;
            }
        });
        repas.boisson.forEach(boisson => {
            if (isServeur) {
                total += boisson.boisson.prixServeur;
            }
            else {
                total += boisson.boisson.prix;
            }
        });
        setPrixTotal(total);
    }, [repas, isServeur]);

    return (
        <div className="flex flex-col gap-4 max-w-[300px] min-w-[300px] text-justify">
            <h2 className="text-lg font-bold">Récapitulatif de la commande :</h2>
            <Card className="max-w-[400px]">
                <CardHeader className="flex gap-3">
                    <div className="flex flex-col">
                        <p className="text-lg font-semibold">Menu 🍱</p>
                    </div>
                </CardHeader>
                <Divider />
                <div className="max-h-[80px] h-[80px] overflow-scroll">
                    <CardBody>
                        <p className="text-default-500 font-bold">
                            {repas.menu.length > 0
                                ? repas.menu.map((menu, index) => (
                                    <div className="flex flex-row" key={menu.id}>


                                        <span key={menu.id}>
                                            <a
                                                href="#"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    handleDeleteItem("menu", menu);
                                                }}
                                                className="text-link"
                                            >
                                                {menu.menu.nom}
                                            </a>
                                            {index < repas.menu.length - 1 ? ", " : ""}
                                        </span>
                                        <span className="ml-auto">
                                            { isServeur? menu.menu.prixServeur.toFixed(2) :
                                            menu.menu.prix.toFixed(2)}
                                        </span>
                                    </div>
                                ))
                                : "Pas de menu"}
                        </p>
                    </CardBody>
                </div>
                {/* <Divider /> */}
            </Card>
            <Divider />
            {repas.remainingPlats > 0 ? (
                <div>
                    <h2>Il reste <span className='text-danger'>{repas.remainingPlats} plat(s)</span> à choisir</h2>
                </div>
            ) : (
                null
            )}
            <Card className="max-w-[400px]">
                <CardHeader className="flex gap-3">
                    <div className="flex flex-col">
                        <p className="text-lg font-semibold">Plat 🌭</p>
                    </div>
                </CardHeader>
                <Divider />
                <div className="max-h-[150px] h-[150px] overflow-scroll">
                    {repas.plat.length === 0 ? (
                        <CardBody>
                            <p className="text-default-500 font-bold">Pas de plat</p>
                        </CardBody>
                    ) : (
                        repas.plat.map((plat: NewPlats, index) => (
                            <CardBody key={plat.id}>
                                <p className="text-default-500 font-bold">
                                    <div className="flex flex-row">
                                        <span>
                                            <a
                                                href="#"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    handleDeleteItem("plat", plat);
                                                }}
                                                className="text-link"
                                            >
                                                {plat.plat.nom}
                                            </a>
                                            {index < repas.plat.length - 1 ? ", " : ""}
                                        </span>
                                        <span className="ml-auto">
                                            {isServeur? plat.plat.prixServeur.toFixed(2) :
                                            plat.plat.prix.toFixed(2)}
                                        </span>
                                    </div>
                                </p>
                                <ul>
                                    {plat.plat.ingredients.map((currentIngredient: any) => (
                                        <li className="text-default-500" key={currentIngredient.nom} >{currentIngredient.nom}</li>
                                    ))}
                                </ul>
                            </CardBody>
                        ))
                    )}
                </div>
                {/* <Divider /> */}
            </Card>
            <Divider />
            {repas.remainingPerifs > 0 ? (
                <div>
                    <h2> Il reste <span className='text-danger'>{repas.remainingPerifs} accompagnement(s)</span> à choisir</h2>
                </div>
            ) : (
                null
            )}

            <Card className="max-w-[400px]">
                <CardHeader className="flex gap-3">
                    <div className="flex flex-col">
                        <p className="text-lg font-semibold">Snack 🍪</p>
                    </div>
                </CardHeader>
                <Divider />
                <div className="max-h-[80px] h-[80px] overflow-scroll">

                    <CardBody>
                        <p className="text-default-500 font-bold">
                            {repas.snack.length > 0
                                ? repas.snack.map((snack, index) => (
                                    <div className="flex flex-row" key={snack.id}>
                                        <span key={snack.id}>
                                            <a
                                                href="#"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    handleDeleteItem("snack", snack);
                                                }}
                                                className="text-link"
                                            >
                                                {snack.snack.nom}
                                            </a>
                                            {/* {index < repas.snack.length - 1 ? ", " : ""} */}
                                        </span>
                                        <span className="ml-auto">
                                            { isServeur? snack.snack.prixServeur.toFixed(2) :
                                            snack.snack.prix.toFixed(2)}
                                        </span>
                                    </div>
                                ))
                                : "Pas de snack"}
                        </p>
                    </CardBody>
                </div>
                {/* <Divider /> */}
            </Card>
            <Card className="max-w-[400px]">
                <CardHeader className="flex gap-3">
                    <div className="flex flex-col">
                        <p className="text-lg font-semibold">Boisson 🥤</p>
                    </div>
                </CardHeader>
                <Divider />
                <div className="max-h-[80px] h-[80px] overflow-scroll">

                    <CardBody>
                        <p className="text-default-500 font-bold">
                            {repas.boisson.length > 0
                                ? repas.boisson.map((boisson, index) => (
                                    <div className="flex flex-row" key={boisson.id}>
                                        <span key={boisson.id}>
                                            <a
                                                href="#"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    handleDeleteItem("boisson", boisson);
                                                }}
                                                className="text-link"
                                            >
                                                {boisson.boisson.nom}
                                            </a>
                                            {/* {index < repas.boisson.length - 1 ? ", " : ""} */}
                                        </span>
                                        <span className="ml-auto">
                                            {isServeur ? boisson.boisson.prixServeur.toFixed(2) :
                                            boisson.boisson.prix.toFixed(2)}
                                        </span>
                                    </div>
                                ))
                                : "Pas de boisson"}
                        </p>
                    </CardBody>
                </div>
                {/* <Divider /> */}
            </Card>
            <Divider />
            <h3 className="text-lg font-bold">Total : {prixTotal.toFixed(2)} €</h3>
        </div>
    );
}
