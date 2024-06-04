'use client';
import React, { useState, useEffect } from "react";
import { getPlanning, postPlanning } from "@/config/api"; // Assurez-vous que le chemin est correct pour vos appels API

type Day = "Lundi" | "Mardi" | "Mercredi" | "Jeudi" | "Vendredi";

interface Slot {
  idPlanning: number | null;
  prenom: string | null;
  numPoste: number | null;
}

const emptySlot: Slot = {
  idPlanning: null,
  prenom: null,
  numPoste: null
};

const initialSlots: Record<Day, { devant: Slot[], derriere: Slot[] }> = {
  Lundi: { devant: Array(3).fill(emptySlot), derriere: Array(3).fill(emptySlot) },
  Mardi: { devant: Array(3).fill(emptySlot), derriere: Array(3).fill(emptySlot) },
  Mercredi: { devant: Array(3).fill(emptySlot), derriere: Array(3).fill(emptySlot) },
  Jeudi: { devant: Array(3).fill(emptySlot), derriere: Array(3).fill(emptySlot) },
  Vendredi: { devant: Array(3).fill(emptySlot), derriere: Array(3).fill(emptySlot) }
};

const PlanningServeur = () => {
  const [slots, setSlots] = useState(initialSlots);
  const [selectedWeek, setSelectedWeek] = useState<number>(getCurrentWeek());
  const [hoveredCell, setHoveredCell] = useState<{ day: Day; index: number; position: "devant" | "derriere" } | null>(null);

  useEffect(() => {
    const fetchSlots = async () => {
      try {
        const planning = await getPlanning(selectedWeek);
        const newSlots = JSON.parse(JSON.stringify(initialSlots)); // Deep copy of initialSlots
        planning.forEach((item: any) => {
          const day = getDayFromDate(item.date);
          if (newSlots[day]) {
            const position = item.numPoste === 1 ? "devant" : "derriere";
            const index = newSlots[day][position].findIndex((slot: Slot) => slot.prenom === null);
            if (index !== -1) {
              newSlots[day][position][index] = {
                idPlanning: item.idPlanning,
                prenom: item.prenom,
                numPoste: item.numPoste
              };
            }
          }
        });
        setSlots(newSlots);
      } catch (error) {
        console.error("Erreur lors de la récupération du planning :", error);
      }
    };

    fetchSlots();
  }, [selectedWeek]);

  const handleInscription = (day: Day, position: "devant" | "derriere", index: number) => {
    const name = prompt("Entrez le nom du serveur:");
    if (name) {
      const newSlots = { ...slots };
      newSlots[day][position][index] = {
        idPlanning: null,
        prenom: name,
        numPoste: position === "devant" ? 1 : 2
      };
      setSlots(newSlots);
      saveSlot(day, position, newSlots[day][position][index], index);
    }
  };

  const handleDesinscription = (day: Day, position: "devant" | "derriere", index: number) => {
    const newSlots = { ...slots };
    newSlots[day][position][index] = emptySlot;
    setSlots(newSlots);
    // If there was an idPlanning, we might want to delete the slot from the backend.
    // For now, we just set it to null.
  };

  const saveSlot = async (day: Day, position: "devant" | "derriere", slot: Slot, index: number) => {
    try {
      const data = {
        date: getDateFromDay(day, selectedWeek),
        numPoste: slot.numPoste,
        numSemaine: selectedWeek,
        prenom: slot.prenom,
        tab: index + 1, // Adjusting to 1-based index
        idPlanning: -1, // Assuming null if not present
        numCompte: Math.floor(Math.random() * 1000) // Assuming a random numCompte, replace with actual logic
      };
      await postPlanning(data);
    } catch (error) {
      console.error("Erreur lors de l'enregistrement du slot :", error);
    }
  };

  const handleWeekChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedWeek(parseInt(event.target.value));
  };

  const handlePreviousWeek = () => {
    setSelectedWeek((prevWeek) => (prevWeek > 1 ? prevWeek - 1 : 52));
  };

  const handleNextWeek = () => {
    setSelectedWeek((prevWeek) => (prevWeek < 52 ? prevWeek + 1 : 1));
  };

  const handleCurrentWeek = () => {
    setSelectedWeek(getCurrentWeek());
  };

  const weekOptions = getWeekOptions(selectedWeek);

  return (
    <div className="p-4">
      <h1 className="text-center text-2xl font-bold mb-4">Planning Serveur</h1>
      <div className="flex justify-center items-center mb-4">
        <button
          className="border px-2 py-1 rounded mr-2"
          onClick={handlePreviousWeek}
        >
          &lt;
        </button>
        <label className="mr-2">Semaine :</label>
        <select value={selectedWeek} onChange={handleWeekChange} className="border p-1 rounded">
          {weekOptions.map((week) => (
            <option key={week} value={week}>
              Semaine {week}
            </option>
          ))}
        </select>
        <button
          className="border px-2 py-1 rounded ml-2"
          onClick={handleNextWeek}
        >
          &gt;
        </button>
        <button
          className="border px-2 py-1 rounded ml-4"
          onClick={handleCurrentWeek}
        >
          Semaine Actuelle
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Object.entries(slots).map(([day, daySlots]) => (
          <div key={day} className="border p-4 rounded-lg">
            <h2 className="text-xl font-bold mb-2">{day}</h2>
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="border p-2">Devant</th>
                  <th className="border p-2">Derrière</th>
                </tr>
              </thead>
              <tbody>
                {Array(3).fill(null).map((_, index) => (
                  <tr key={index} className="border-t">
                    <td
                      className={`border p-2 cursor-pointer ${
                        daySlots.devant[index].prenom
                          ? "bg-white hover:bg-red-500 text-black"
                          : "bg-red-500 hover:bg-white hover:text-black"
                      }`}
                      onClick={() =>
                        daySlots.devant[index].prenom
                          ? handleDesinscription(day as Day, "devant", index)
                          : handleInscription(day as Day, "devant", index)
                      }
                      onMouseEnter={() => setHoveredCell({ day: day as Day, index, position: "devant" })}
                      onMouseLeave={() => setHoveredCell(null)}
                    >
                      {hoveredCell?.day === day && hoveredCell?.index === index && hoveredCell?.position === "devant" && daySlots.devant[index].prenom ? "✖" : daySlots.devant[index].prenom || "Inscription"}
                    </td>
                    <td
                      className={`border p-2 cursor-pointer ${
                        daySlots.derriere[index].prenom
                          ? "bg-white hover:bg-red-500 text-black"
                          : "bg-red-500 hover:bg-white hover:text-black"
                      }`}
                      onClick={() =>
                        daySlots.derriere[index].prenom
                          ? handleDesinscription(day as Day, "derriere", index)
                          : handleInscription(day as Day, "derriere", index)
                      }
                      onMouseEnter={() => setHoveredCell({ day: day as Day, index, position: "derriere" })}
                      onMouseLeave={() => setHoveredCell(null)}
                    >
                      {hoveredCell?.day === day && hoveredCell?.index === index && hoveredCell?.position === "derriere" && daySlots.derriere[index].prenom ? "✖" : daySlots.derriere[index].prenom || "Inscription"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  );
};

// Fonction pour obtenir le numéro de la semaine actuelle
function getCurrentWeek() {
  const currentDate = new Date();
  const oneJan = new Date(currentDate.getFullYear(), 0, 1);
  const numberOfDays = Math.floor((currentDate.getTime() - oneJan.getTime()) / (24 * 60 * 60 * 1000));
  return Math.ceil((currentDate.getDay() + 1 + numberOfDays) / 7);
}

// Fonction pour obtenir les options de semaine à afficher dans le menu déroulant
function getWeekOptions(currentWeek: number) {
  const weeks = [];
  for (let i = currentWeek - 2; i <= currentWeek + 3; i++) {
    if (i > 0 && i <= 52) {
      weeks.push(i);
    }
  }
  return weeks;
}

// Fonction pour obtenir le jour de la semaine à partir de la date
function getDayFromDate(dateString: string): Day {
  const date = new Date(dateString);
  const days = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
  return days[date.getDay()] as Day;
}

// Fonction pour obtenir la date à partir du jour de la semaine et de la semaine sélectionnée
function getDateFromDay(day: Day, selectedWeek: number): string {
  const currentYear = new Date().getFullYear();
  const firstDayOfYear = new Date(currentYear, 0, 1);
  const daysToAdd = (selectedWeek - 1) * 7 + ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"].indexOf(day);
  const date = new Date(firstDayOfYear.setDate(firstDayOfYear.getDate() + daysToAdd));
  return date.toLocaleDateString('fr-FR');
}

export default PlanningServeur;
