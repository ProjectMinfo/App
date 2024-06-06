'use client';
import React, { useState, useEffect } from "react";
import { getPlanning, postPlanning, deletePlanning, getPlanningCourse, postPlanningCourse, deletePlanningCourse, getAllPlanning } from "@/config/api";
import { jsPDF } from "jspdf";

type Day = "Lundi" | "Mardi" | "Mercredi" | "Jeudi" | "Vendredi";

interface Slot {
  idPlanning: number | null;
  prenom: string | null;
  numPoste: number | null;
  tab: number | null;
}

interface PlanningCourses {
  id: number | null;
  date: string;
  numCompte: number | null;
  numSemaine: number | null;
  prenom: string;
}

const emptySlot: Slot = {
  idPlanning: null,
  prenom: null,
  numPoste: null,
  tab: null
};

const emptyCourseSlot: PlanningCourses = {
  id: null,
  date: '',
  numCompte: null,
  numSemaine: null,
  prenom: ''
};

const initialSlots: Record<Day, { devant: Slot[], derriere: Slot[] }> = {
  Lundi: { devant: Array(3).fill(emptySlot), derriere: Array(3).fill(emptySlot) },
  Mardi: { devant: Array(3).fill(emptySlot), derriere: Array(3).fill(emptySlot) },
  Mercredi: { devant: Array(3).fill(emptySlot), derriere: Array(3).fill(emptySlot) },
  Jeudi: { devant: Array(3).fill(emptySlot), derriere: Array(3).fill(emptySlot) },
  Vendredi: { devant: Array(3).fill(emptySlot), derriere: Array(3).fill(emptySlot) }
};

const initialCourseSlots: Record<Day, PlanningCourses> = {
  Lundi: { ...emptyCourseSlot },
  Mardi: { ...emptyCourseSlot },
  Mercredi: { ...emptyCourseSlot },
  Jeudi: { ...emptyCourseSlot },
  Vendredi: { ...emptyCourseSlot }
};

const deepCopy = (obj: any) => JSON.parse(JSON.stringify(obj));

const PlanningServeur = () => {
  const [slots, setSlots] = useState(initialSlots);
  const [courseSlots, setCourseSlots] = useState(initialCourseSlots);
  const [selectedWeek, setSelectedWeek] = useState<number>(getCurrentWeek());
  const [hoveredCell, setHoveredCell] = useState<{ day: Day; index: number; position?: "devant" | "derriere" } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showStatsModal, setShowStatsModal] = useState<boolean>(false);
  const [stats, setStats] = useState<any | null>(null);
  const [period, setPeriod] = useState<string>("week");

  const fetchSlots = async () => {
    try {
      const planning = await getPlanning(selectedWeek);
      const newSlots = deepCopy(initialSlots);
      planning.forEach((item: any) => {
        const day = getDayFromDate(item.date);
        if (newSlots[day]) {
          const position = item.numPoste === 1 ? "devant" : "derriere";
          const index = item.tab % 3;
          newSlots[day][position][index] = {
            idPlanning: item.idPlanning,
            prenom: item.prenom,
            numPoste: item.numPoste,
            tab: item.tab
          };
        }
      });
      setSlots(newSlots);
    } catch (error) {
      console.error("Erreur lors de la récupération du planning :", error);
      setSlots(initialSlots);
      setError("Erreur lors de la récupération du planning");
    }
  };

  const fetchCourseSlots = async () => {
    try {
      const planningCourse = await getPlanningCourse(selectedWeek);
      const newCourseSlots = deepCopy(initialCourseSlots);
      planningCourse.forEach((item: any) => {
        const day = getDayFromDate(item.date);
        if (newCourseSlots[day]) {
          newCourseSlots[day] = {
            id: item.id,
            date: item.date,
            numCompte: item.numCompte,
            numSemaine: item.numSemaine,
            prenom: item.prenom
          };
        }
      });
      setCourseSlots(newCourseSlots);
    } catch (error) {
      console.error("Erreur lors de la récupération du planning des courses :", error);
      setCourseSlots(initialCourseSlots);
    }
  };

  useEffect(() => {
    fetchSlots();
    fetchCourseSlots();
  }, [selectedWeek]);

  const handleInscription = (day: Day, position: "devant" | "derriere", index: number) => {
    const name = prompt("Entrez le nom du serveur:");
    if (name) {
      const newSlots = deepCopy(slots);
      const newTab = index + (position === "derriere" ? 3 : 0);
      newSlots[day][position][index] = {
        idPlanning: -1,
        prenom: name,
        numPoste: position === "devant" ? 1 : 2,
        tab: newTab
      };
      setSlots(newSlots);
      saveSlot(day, position, newSlots[day][position][index], index);
    }
  };

  const handleDesinscription = async (day: Day, position: "devant" | "derriere", index: number) => {
    const slotToRemove = slots[day][position][index];
    if (slotToRemove.idPlanning) {
      try {
        await deletePlanning(slotToRemove.idPlanning);
        const newSlots = deepCopy(slots);
        newSlots[day][position][index] = emptySlot;
        setSlots(newSlots);
        fetchSlots(); // Fetch slots after deleting
      } catch (error) {
        console.error("Erreur lors de la suppression du slot :", error);
        setError("Erreur lors de la suppression du slot");
      }
    }
  };

  const handleInscriptionCourse = (day: Day) => {
    const name = prompt("Entrez le nom de la personne pour le planning des courses:");
    if (name) {
      const newCourseSlots = deepCopy(courseSlots);
      newCourseSlots[day] = {
        id: -1,
        date: getDateFromDay(day, selectedWeek),
        numCompte: Math.floor(Math.random() * 1000),
        numSemaine: selectedWeek,
        prenom: name
      };
      setCourseSlots(newCourseSlots);
      saveSlotCourse(newCourseSlots[day]);
    }
  };

  const handleDesinscriptionCourse = async (day: Day) => {
    const slotToRemove = courseSlots[day];
    if (slotToRemove.id) {
      try {
        await deletePlanningCourse(slotToRemove.id);
        const newCourseSlots = deepCopy(courseSlots);
        newCourseSlots[day] = { ...emptyCourseSlot };
        setCourseSlots(newCourseSlots);
        fetchCourseSlots(); // Fetch course slots after deleting
      } catch (error) {
        console.error("Erreur lors de la suppression du slot de course :", error);
        setError("Erreur lors de la suppression du slot de course");
      }
    }
  };

  const saveSlot = async (day: Day, position: "devant" | "derriere", slot: Slot, index: number) => {
    try {
      const data = {
        idPlanning: slot.idPlanning,
        date: getDateFromDay(day, selectedWeek),
        numPoste: slot.numPoste,
        numSemaine: selectedWeek,
        prenom: slot.prenom,
        tab: slot.tab,
        numCompte: Math.floor(Math.random() * 1000)
      };
      console.log('Data being sent to API:', data);
      await postPlanning(data);
      fetchSlots(); // Fetch slots after posting
    } catch (error) {
      console.error("Erreur lors de l'enregistrement du slot :", error);
      setError("Erreur lors de l'enregistrement du slot");
    }
  };

  const saveSlotCourse = async (slot: PlanningCourses) => {
    try {
      const data = {
        id: slot.id,
        date: slot.date,
        numCompte: slot.numCompte,
        numSemaine: slot.numSemaine,
        prenom: slot.prenom
      };
      console.log('Data being sent to API for course:', data);
      await postPlanningCourse(data);
      fetchCourseSlots(); // Fetch course slots after posting
    } catch (error) {
      console.error("Erreur lors de l'enregistrement du slot de course :", error);
      setError("Erreur lors de l'enregistrement du slot de course");
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

  const handleCalculateStats = async () => {
    try {
      const plannings = await getAllPlanning();
      const statsData: any = {};

      plannings.forEach((planning: any) => {
        const { prenom, numPoste } = planning;
        if (!statsData[prenom]) {
          statsData[prenom] = { inscrit: 0, courses: 0 };
        }
        statsData[prenom].inscrit += 1;
        if (numPoste === 2) {
          statsData[prenom].courses += 1;
        }
      });

      const sortedStats = (key: string, isAsc = true) => {
        return Object.entries(statsData)
          .sort((a: any, b: any) => (isAsc ? a[1][key] - b[1][key] : b[1][key] - a[1][key]))
          .slice(0, 10);
      };

      setStats({
        top10LeastInscrit: sortedStats("inscrit"),
        top10MostInscrit: sortedStats("inscrit", false),
        top10LeastCourses: sortedStats("courses"),
        top10MostCourses: sortedStats("courses", false),
      });
    } catch (error) {
      console.error("Erreur lors du calcul des statistiques :", error);
      setError("Erreur lors du calcul des statistiques");
    }
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.text("Statistiques des serveurs", 10, 10);

    if (stats) {
      doc.text("Top 10 des moins inscrits", 10, 20);
      stats.top10LeastInscrit.forEach((item: any, index: number) => {
        doc.text(`${index + 1}. ${item[0]} - ${item[1].inscrit} inscriptions`, 10, 30 + index * 10);
      });

      doc.text("Top 10 des plus inscrits", 10, 80);
      stats.top10MostInscrit.forEach((item: any, index: number) => {
        doc.text(`${index + 1}. ${item[0]} - ${item[1].inscrit} inscriptions`, 10, 90 + index * 10);
      });

      doc.text("Top 10 des moins de courses", 10, 140);
      stats.top10LeastCourses.forEach((item: any, index: number) => {
        doc.text(`${index + 1}. ${item[0]} - ${item[1].courses} courses`, 10, 150 + index * 10);
      });

      doc.text("Top 10 des plus de courses", 10, 200);
      stats.top10MostCourses.forEach((item: any, index: number) => {
        doc.text(`${index + 1}. ${item[0]} - ${item[1].courses} courses`, 10, 210 + index * 10);
      });
    }

    doc.save("server-stats.pdf");
  };

  return (
    <div className="p-4">
      <h1 className="text-center text-2xl font-bold mb-4">Planning Serveur</h1>
      <div className="flex justify-center items-center mb-4">
        <button className="border px-2 py-1 rounded mr-2" onClick={handlePreviousWeek}>&lt;</button>
        <label className="mr-2">Semaine :</label>
        <select value={selectedWeek} onChange={handleWeekChange} className="border p-1 rounded">
          {weekOptions.map((week) => (
            <option key={week} value={week}>
              Semaine {week}
            </option>
          ))}
        </select>
        <button className="border px-2 py-1 rounded ml-2" onClick={handleNextWeek}>&gt;</button>
        <button className="border px-2 py-1 rounded ml-4" onClick={handleCurrentWeek}>Semaine Actuelle</button>
      </div>

      {error && <div className="text-red-500">{error}</div>}

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
                      className={`border p-2 cursor-pointer ${daySlots.devant[index].prenom ? "bg-white hover:bg-red-500 text-black" : "bg-red-500 hover:bg-white hover:text-black"}`}
                      onClick={() => daySlots.devant[index].prenom ? handleDesinscription(day as Day, "devant", index) : handleInscription(day as Day, "devant", index)}
                      onMouseEnter={() => setHoveredCell({ day: day as Day, index, position: "devant" })}
                      onMouseLeave={() => setHoveredCell(null)}
                    >
                      {hoveredCell?.day === day && hoveredCell?.index === index && hoveredCell?.position === "devant" && daySlots.devant[index].prenom ? "✖" : daySlots.devant[index].prenom || "Inscription"}
                    </td>
                    <td
                      className={`border p-2 cursor-pointer ${daySlots.derriere[index].prenom ? "bg-white hover:bg-red-500 text-black" : "bg-red-500 hover:bg-white hover:text-black"}`}
                      onClick={() => daySlots.derriere[index].prenom ? handleDesinscription(day as Day, "derriere", index) : handleInscription(day as Day, "derriere", index)}
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

      <h2 className="text-center text-2xl font-bold mt-8 mb-4">Planning Courses</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Object.entries(courseSlots).map(([day, slot]) => (
          <div key={day} className="border p-4 rounded-lg">
            <h2 className="text-xl font-bold mb-2">{day}</h2>
            <div
              className={`border p-2 cursor-pointer ${slot.prenom ? "bg-white hover:bg-red-500 text-black" : "bg-red-500 hover:bg-white hover:text-black"}`}
              onClick={() => slot.prenom ? handleDesinscriptionCourse(day as Day) : handleInscriptionCourse(day as Day)}
              onMouseEnter={() => setHoveredCell({ day: day as Day, index: 0 })}
              onMouseLeave={() => setHoveredCell(null)}
            >
              {hoveredCell?.day === day && hoveredCell?.index === 0 && slot.prenom ? "✖" : slot.prenom || "Inscription"}
            </div>
          </div>
        ))}
      </div>

      <button
        className="px-2 py-1 rounded border text-black bg-blue-500 text-white mt-4"
        onClick={() => setShowStatsModal(true)}
      >
        Voir les statistiques
      </button>

      {showStatsModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-8 rounded-lg max-w-4xl w-full overflow-auto" style={{ maxHeight: "90vh" }}>
            <h2 className="text-xl font-bold mb-4 text-black">Statistiques des serveurs</h2>
            <div className="mb-4 flex space-x-2">
              <button
                className={`px-2 py-1 rounded border text-black ${period === "week" ? "bg-blue-500 text-white" : "bg-white"}`}
                onClick={() => setPeriod("week")}
              >
                Semaine
              </button>
              <button
                className={`px-2 py-1 rounded border text-black ${period === "month" ? "bg-blue-500 text-white" : "bg-white"}`}
                onClick={() => setPeriod("month")}
              >
                Mois
              </button>
              <button
                className={`px-2 py-1 rounded border text-black ${period === "year" ? "bg-blue-500 text-white" : "bg-white"}`}
                onClick={() => setPeriod("year")}
              >
                Année
              </button>
              <button
                className={`px-2 py-1 rounded border text-black  ${period === "all" ? "bg-blue-500 text-white" : "bg-white"}`}
                onClick={() => setPeriod("all")}
              >
                Depuis le début
              </button>
              <button
                className="px-2 py-1 rounded border text-black bg-green-500 text-white"
                onClick={handleCalculateStats}
              >
                Calculer
              </button>
            </div>

            <div className="flex flex-col space-y-4">
              {stats && (
                <>
                  <div className="p-2 border rounded mb-2 text-black black">
                    <h3 className="text-lg font-bold mb-2 p-2 border rounded ">Top 10 des moins inscrits</h3> 
                    {stats.top10LeastInscrit.map((item: any, index: number) => (
                      <div key={index} className="mb-1">
                        {index + 1}. {item[0]} - {item[1].inscrit} inscriptions
                      </div>
                    ))}
                  </div>
                  <div className="p-2 border rounded mb-2 text-black black">
                    <h3 className="text-lg font-bold mb-2 p-2 border rounded ">Top 10 des plus inscrits</h3>
                    {stats.top10MostInscrit.map((item: any, index: number) => (
                      <div key={index} className="mb-1">
                        {index + 1}. {item[0]} - {item[1].inscrit} inscriptions
                      </div>
                    ))}
                  </div>
                  <div className="p-2 border rounded mb-2 text-black black">
                    <h3 className="text-lg font-bold mb-2 p-2 border rounded ">Top 10 des moins de courses</h3>
                    {stats.top10LeastCourses.map((item: any, index: number) => (
                      <div key={index} className="mb-1">
                        {index + 1}. {item[0]} - {item[1].courses} courses
                      </div>
                    ))}
                  </div>
                  <div className="p-2 border rounded mb-2 text-black black">
                    <h3 className="text-lg font-bold mb-2 p-2 border rounded ">Top 10 des plus de courses</h3>
                    {stats.top10MostCourses.map((item: any, index: number) => (
                      <div key={index} className="mb-1">
                        {index + 1}. {item[0]} - {item[1].courses} courses
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            <button
              className="px-2 py-1 rounded border text-black bg-blue-500 text-white mt-4"
              onClick={handleDownloadPDF}
            >
              Télécharger le PDF
            </button>
            <button
              className="px-2 py-1 rounded border text-black bg-red-500 text-white mt-4 ml-2"
              onClick={() => setShowStatsModal(false)}
            >
              Fermer
            </button>
          </div>
        </div>
      )}
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
  const date = new Date(dateString.split('/').reverse().join('-'));
  const days = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
  return days[date.getDay()] as Day;
}

// Fonction pour obtenir la date à partir du jour de la semaine et de la semaine sélectionnée
function getDateFromDay(day: Day, selectedWeek: number): string {
  const currentYear = new Date().getFullYear();
  const firstDayOfYear = new Date(currentYear, 0, 1);
  const daysToAdd = (selectedWeek - 1) * 7 + ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"].indexOf(day);
  const date = new Date(firstDayOfYear.setDate(firstDayOfYear.getDate() + daysToAdd));
  return date.toLocaleDateString('fr-FR');
}

export default PlanningServeur;
