'use client';
import React, { useState, useEffect } from "react";

type Day = "Lundi" | "Mardi" | "Mercredi" | "Jeudi" | "Vendredi";

interface Slot {
  devant: string | null;
  derriere: string | null;
}

interface CoursesSlot {
  personne: string | null;
}

const initialSlots: Record<Day, Slot[]> = {
  Lundi: [{ devant: "Maxime", derriere: null }, { devant: "Camille", derriere: null }, { devant: "Marc-Antoine", derriere: null }],
  Mardi: [{ devant: "Mathys", derriere: "Thibault" }, { devant: "Edouard", derriere: "Baptiste" }, { devant: "Louis", derriere: null }],
  Mercredi: [{ devant: "Elodie", derriere: null }, { devant: "Thibault", derriere: null }, { devant: null, derriere: null }],
  Jeudi: [{ devant: "Camille", derriere: "Logan" }, { devant: "Yanis", derriere: "Baptiste" }, { devant: null, derriere: null }],
  Vendredi: [{ devant: null, derriere: "Matys" }, { devant: null, derriere: "Anya" }, { devant: null, derriere: "Logan" }]
};

const initialCoursesSlots: Record<Day, CoursesSlot[]> = {
  Lundi: [{ personne: "Marc-Antoine" }],
  Mardi: [{ personne: "Edouard" }],
  Mercredi: [{ personne: "Yanis" }],
  Jeudi: [{ personne: null }],
  Vendredi: [{ personne: "Louis" }]
};

const PlanningServeur = () => {
  const [slots, setSlots] = useState(initialSlots);
  const [coursesSlots, setCoursesSlots] = useState(initialCoursesSlots);
  const [selectedWeek, setSelectedWeek] = useState<number>(getCurrentWeek());
  const [hoveredCell, setHoveredCell] = useState<{ day: Day; index: number; position: "devant" | "derriere" | "personne" } | null>(null);

  useEffect(() => {
    // Simuler la récupération des données de l'API en fonction de la semaine sélectionnée
    // fetchSlots(selectedWeek).then(data => setSlots(data));
  }, [selectedWeek]);

  const handleInscription = (day: Day, index: number, position: "devant" | "derriere") => {
    const name = prompt("Entrez le nom du serveur:");
    if (name) {
      const newSlots = { ...slots };
      newSlots[day][index][position] = name;
      setSlots(newSlots);
    }
  };

  const handleDesinscription = (day: Day, index: number, position: "devant" | "derriere") => {
    const newSlots = { ...slots };
    newSlots[day][index][position] = null;
    setSlots(newSlots);
  };

  const handleCourseInscription = (day: Day, index: number) => {
    const name = prompt("Entrez le nom de la personne:");
    if (name) {
      const newCoursesSlots = { ...coursesSlots };
      newCoursesSlots[day][index].personne = name;
      setCoursesSlots(newCoursesSlots);
    }
  };

  const handleCourseDesinscription = (day: Day, index: number) => {
    const newCoursesSlots = { ...coursesSlots };
    newCoursesSlots[day][index].personne = null;
    setCoursesSlots(newCoursesSlots);
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
        {Object.entries(slots).map(([day, slots]) => (
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
                {slots.map((slot, index) => (
                  <tr key={index} className="border-t">
                    <td
                      className={`border p-2 cursor-pointer ${
                        slot.devant
                          ? "bg-white hover:bg-red-500 text-black"
                          : "bg-red-500 hover:bg-white hover:text-black"
                      }`}
                      onClick={() =>
                        slot.devant
                          ? handleDesinscription(day as Day, index, "devant")
                          : handleInscription(day as Day, index, "devant")
                      }
                      onMouseEnter={() => setHoveredCell({ day: day as Day, index, position: "devant" })}
                      onMouseLeave={() => setHoveredCell(null)}
                    >
                      {hoveredCell?.day === day && hoveredCell?.index === index && hoveredCell?.position === "devant" && slot.devant ? "✖" : slot.devant || "Inscription"}
                    </td>
                    <td
                      className={`border p-2 cursor-pointer ${
                        slot.derriere
                          ? "bg-white hover:bg-red-500 text-black"
                          : "bg-red-500 hover:bg-white hover:text-black"
                      }`}
                      onClick={() =>
                        slot.derriere
                          ? handleDesinscription(day as Day, index, "derriere")
                          : handleInscription(day as Day, index, "derriere")
                      }
                      onMouseEnter={() => setHoveredCell({ day: day as Day, index, position: "derriere" })}
                      onMouseLeave={() => setHoveredCell(null)}
                    >
                      {hoveredCell?.day === day && hoveredCell?.index === index && hoveredCell?.position === "derriere" && slot.derriere ? "✖" : slot.derriere || "Inscription"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
      <h2 className="text-center text-2xl font-bold mt-8 mb-4">Courses Match</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Object.entries(coursesSlots).map(([day, slots]) => (
          <div key={day} className="border p-4 rounded-lg">
            <h2 className="text-xl font-bold mb-2">{day}</h2>
            <div className="flex flex-col items-center">
              {slots.map((slot, index) => (
                <div
                  key={index}
                  className={`border p-2 mb-2 w-2/3 text-center rounded cursor-pointer ${
                    slot.personne
                      ? "bg-white hover:bg-red-500 text-black"
                      : "bg-red-500 hover:bg-white hover:text-black"
                  }`}
                  onClick={() =>
                    slot.personne
                      ? handleCourseDesinscription(day as Day, index)
                      : handleCourseInscription(day as Day, index)
                  }
                  onMouseEnter={() => setHoveredCell({ day: day as Day, index, position: "personne" })}
                  onMouseLeave={() => setHoveredCell(null)}
                >
                  {hoveredCell?.day === day && hoveredCell?.index === index && hoveredCell?.position === "personne" && slot.personne ? "✖" : slot.personne || "Inscription"}
                </div>
              ))}
            </div>
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

export default PlanningServeur;


//'use client';
// import React, { useState, useEffect } from "react";
// import { PlanningCourses, Plannings } from '@/types/index';
// import { getPlanningServeurs, getPlanningCourses, addPlanningServeur, deletePlanningServeur, addPlanningCourse, deletePlanningCourse } from '@/config/api';

// const PlanningServeur = () => {
//   const [slots, setSlots] = useState<Plannings[]>([]);
//   const [coursesSlots, setCoursesSlots] = useState<PlanningCourses[]>([]);
//   const [selectedWeek, setSelectedWeek] = useState<number>(getCurrentWeek());
//   const [hoveredCell, setHoveredCell] = useState<{ day: string; index: number; position: "devant" | "derriere" | "personne" } | null>(null);

//   useEffect(() => {
//     const fetchPlanning = async () => {
//       const serveurs = await getPlanningServeurs(selectedWeek);
//       const courses = await getPlanningCourses(selectedWeek);
//       setSlots(serveurs);
//       setCoursesSlots(courses);
//     };
//     fetchPlanning();
//   }, [selectedWeek]);

//   const handleInscription = async (day: string, index: number, position: "devant" | "derriere") => {
//     const name = prompt("Entrez le nom du serveur:");
//     if (name) {
//       // Logique pour trouver idUser et autres informations nécessaires pour ajouter un planning
//       const newSlot: Plannings = {
//         idPlanning: Date.now(), // Remplacer par une vraie logique pour générer un ID
//         date: new Date().toISOString(),
//         idUser: 123, // Remplacer par l'ID utilisateur réel
//         nom: name,
//         numPoste: index,
//         numSemaine: selectedWeek,
//         poste: position === "devant" ? 1 : 2,
//         prenom: name,
//         tab: 0
//       };
//       await addPlanningServeur(newSlot);
//       setSlots([...slots, newSlot]);
//     }
//   };

//   const handleDesinscription = async (idPlanning: number) => {
//     await deletePlanningServeur(idPlanning);
//     setSlots(slots.filter(slot => slot.idPlanning !== idPlanning));
//   };

//   const handleCourseInscription = async (day: string, index: number) => {
//     const name = prompt("Entrez le nom de la personne:");
//     if (name) {
//       // Logique pour trouver idUser et autres informations nécessaires pour ajouter un planning course
//       const newCourse: PlanningCourses = {
//         id: Date.now(), // Remplacer par une vraie logique pour générer un ID
//         date: new Date().toISOString(),
//         idUser: 123, // Remplacer par l'ID utilisateur réel
//         numSemaine: selectedWeek,
//         prenom: name
//       };
//       await addPlanningCourse(newCourse);
//       setCoursesSlots([...coursesSlots, newCourse]);
//     }
//   };

//   const handleCourseDesinscription = async (id: number) => {
//     await deletePlanningCourse(id);
//     setCoursesSlots(coursesSlots.filter(course => course.id !== id));
//   };

//   const handleWeekChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
//     setSelectedWeek(parseInt(event.target.value));
//   };

//   const handlePreviousWeek = () => {
//     setSelectedWeek((prevWeek) => (prevWeek > 1 ? prevWeek - 1 : 52));
//   };

//   const handleNextWeek = () => {
//     setSelectedWeek((prevWeek) => (prevWeek < 52 ? prevWeek + 1 : 1));
//   };

//   const handleCurrentWeek = () => {
//     setSelectedWeek(getCurrentWeek());
//   };

//   const weekOptions = getWeekOptions(selectedWeek);

//   return (
//     <div className="p-4">
//       <h1 className="text-center text-2xl font-bold mb-4">Planning Serveur</h1>
//       <div className="flex justify-center items-center mb-4">
//         <button
//           className="border px-2 py-1 rounded mr-2"
//           onClick={handlePreviousWeek}
//         >
//           &lt;
//         </button>
//         <label className="mr-2">Semaine :</label>
//         <select value={selectedWeek} onChange={handleWeekChange} className="border p-1 rounded">
//           {weekOptions.map((week) => (
//             <option key={week} value={week}>
//               Semaine {week}
//             </option>
//           ))}
//         </select>
//         <button
//           className="border px-2 py-1 rounded ml-2"
//           onClick={handleNextWeek}
//         >
//           &gt;
//         </button>
//         <button
//           className="border px-2 py-1 rounded ml-4"
//           onClick={handleCurrentWeek}
//         >
//           Semaine Actuelle
//         </button>
//       </div>
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//         {Object.entries(groupSlotsByDay(slots)).map(([day, slots]) => (
//           <div key={day} className="border p-4 rounded-lg">
//             <h2 className="text-xl font-bold mb-2">{day}</h2>
//             <table className="w-full border-collapse">
//               <thead>
//                 <tr>
//                   <th className="border p-2">Devant</th>
//                   <th className="border p-2">Derrière</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {slots.map((slot, index) => (
//                   <tr key={index} className="border-t">
//                     <td
//                       className={`border p-2 cursor-pointer ${
//                         slot.nom
//                           ? "bg-white hover:bg-red-500 text-black"
//                           : "bg-red-500 hover:bg-white hover:text-black"
//                       }`}
//                       onClick={() =>
//                         slot.nom
//                           ? handleDesinscription(slot.idPlanning)
//                           : handleInscription(day, index, "devant")
//                       }
//                       onMouseEnter={() => setHoveredCell({ day, index, position: "devant" })}
//                       onMouseLeave={() => setHoveredCell(null)}
//                     >
//                       {hoveredCell?.day === day && hoveredCell?.index === index && hoveredCell?.position === "devant" && slot.nom ? "✖" : slot.nom || "Inscription"}
//                     </td>
//                     <td
//                       className={`border p-2 cursor-pointer ${
//                         slot.nom
//                           ? "bg-white hover:bg-red-500 text-black"
//                           : "bg-red-500 hover:bg-white hover:text-black"
//                       }`}
//                       onClick={() =>
//                         slot.nom
//                           ? handleDesinscription(slot.idPlanning)
//                           : handleInscription(day, index, "derriere")
//                       }
//                       onMouseEnter={() => setHoveredCell({ day, index, position: "derriere" })}
//                       onMouseLeave={() => setHoveredCell(null)}
//                     >
//                       {hoveredCell?.day === day && hoveredCell?.index === index && hoveredCell?.position === "derriere" && slot.nom ? "✖" : slot.nom || "Inscription"}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         ))}
//       </div>
//       <h2 className="text-center text-2xl font-bold mt-8 mb-4">Courses Match</h2>
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//         {Object.entries(groupCoursesSlotsByDay(coursesSlots)).map(([day, slots]) => (
//           <div key={day} className="border p-4 rounded-lg">
//             <h2 className="text-xl font-bold mb-2">{day}</h2>
//             <div className="flex flex-col items-center">
//               {slots.map((slot, index) => (
//                 <div
//                   key={index}
//                   className={`border p-2 mb-2 w-2/3 text-center rounded cursor-pointer ${
//                     slot.prenom
//                       ? "bg-white hover:bg-red-500 text-black"
//                       : "bg-red-500 hover:bg-white hover:text-black"
//                   }`}
//                   onClick={() =>
//                     slot.prenom
//                       ? handleCourseDesinscription(slot.id)
//                       : handleCourseInscription(day, index)
//                   }
//                   onMouseEnter={() => setHoveredCell({ day, index, position: "personne" })}
//                   onMouseLeave={() => setHoveredCell(null)}
//                 >
//                   {hoveredCell?.day === day && hoveredCell?.index === index && hoveredCell?.position === "personne" && slot.prenom ? "✖" : slot.prenom || "Inscription"}
//                 </div>
//               ))}
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// // Fonction pour obtenir le numéro de la semaine actuelle
// function getCurrentWeek() {
//   const currentDate = new Date();
//   const oneJan = new Date(currentDate.getFullYear(), 0, 1);
//   const numberOfDays = Math.floor((currentDate.getTime() - oneJan.getTime()) / (24 * 60 * 60 * 1000));
//   return Math.ceil((currentDate.getDay() + 1 + numberOfDays) / 7);
// }

// // Fonction pour obtenir les options de semaine à afficher dans le menu déroulant
// function getWeekOptions(currentWeek: number) {
//   const weeks = [];
//   for (let i = currentWeek - 2; i <= currentWeek + 3; i++) {
//     if (i > 0 && i <= 52) {
//       weeks.push(i);
//     }
//   }
//   return weeks;
// }

// // Fonction pour grouper les slots par jour
// function groupSlotsByDay(slots: Plannings[]) {
//   const grouped: Record<string, Plannings[]> = {};
//   slots.forEach(slot => {
//     const day = new Date(slot.date).toLocaleDateString('fr-FR', { weekday: 'long' });
//     if (!grouped[day]) {
//       grouped[day] = [];
//     }
//     grouped[day].push(slot);
//   });
//   return grouped;
// }

// // Fonction pour grouper les slots de courses par jour
// function groupCoursesSlotsByDay(slots: PlanningCourses[]) {
//   const grouped: Record<string, PlanningCourses[]> = {};
//   slots.forEach(slot => {
//     const day = new Date(slot.date).toLocaleDateString('fr-FR', { weekday: 'long' });
//     if (!grouped[day]) {
//       grouped[day] = [];
//     }
//     grouped[day].push(slot);
//   });
//   return grouped;
// }

// export default PlanningServeur;
   