
---

# Planning Serveur Page

## Description

La page `PlanningServeur` permet de gérer et de visualiser les plannings des serveurs pour la semaine. Elle offre des fonctionnalités pour s'inscrire et se désinscrire des postes, ainsi que pour visualiser et télécharger des statistiques sur les inscriptions des serveurs.

## Fonctionnalités Principales

- **Gestion des inscriptions** : Permet aux serveurs de s'inscrire et de se désinscrire des postes pour chaque jour de la semaine.
- **Affichage des plannings** : Visualise les plannings des serveurs et des courses pour chaque jour de la semaine.
- **Statistiques** : Affiche des statistiques sur les inscriptions et les courses des serveurs, avec la possibilité de les télécharger en PDF.

## Technologies Utilisées

- **Frontend** : Next.js avec TypeScript
- **UI Library** : NextUI
- **PDF Generation** : jsPDF

## Structure du Composant

### PlanningServeur.tsx

#### Déclaration des Types

```typescript
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

export interface Comptes {
  acces: number;
  email: string;
  mdp: string;
  montant: number;
  nom: string;
  numCompte: number;
  prenom: string;
  promo: number;
  resetToken: string;
  tokenExpiration: string;
}
```

Les types `Day`, `Slot`, `PlanningCourses`, et `Comptes` définissent les structures de données utilisées dans le composant.

#### États du Composant

```typescript
const [slots, setSlots] = useState(initialSlots);
const [courseSlots, setCourseSlots] = useState(initialCourseSlots);
const [selectedWeek, setSelectedWeek] = useState<number>(getCurrentWeek());
const [hoveredCell, setHoveredCell] = useState<{ day: Day; index: number; position?: "devant" | "derriere" } | null>(null);
const [error, setError] = useState<string | null>(null);
const [showStatsModal, setShowStatsModal] = useState<boolean>(false);
const [stats, setStats] = useState<any | null>(null);
const [period, setPeriod] = useState<string>("week");
```

Les états du composant sont utilisés pour gérer les plannings des serveurs, les plannings des courses, la semaine sélectionnée, les erreurs, et l'affichage des statistiques.

#### Fonctions Principales

##### fetchSlots

```typescript
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
  }
};
```

Cette fonction récupère les plannings des serveurs pour la semaine sélectionnée à partir de l'API et met à jour l'état `slots`.

##### fetchCourseSlots

```typescript
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
```

Cette fonction récupère les plannings des courses pour la semaine sélectionnée à partir de l'API et met à jour l'état `courseSlots`.

##### handleInscription

```typescript
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
```

Cette fonction permet à un serveur de s'inscrire à un poste pour un jour et une position spécifiques.

##### handleDesinscription

```typescript
const handleDesinscription = async (day: Day, position: "devant" | "derriere", index: number) => {
  const slotToRemove = slots[day][position][index];
  if (slotToRemove.idPlanning) {
    try {
      await deletePlanning(slotToRemove.idPlanning);
      const newSlots = deepCopy(slots);
      newSlots[day][position][index] = emptySlot;
      setSlots(newSlots);
      fetchSlots();
    } catch (error) {
      console.error("Erreur lors de la suppression du slot :", error);
      setError("Erreur lors de la suppression du slot");
    }
  }
};
```

Cette fonction permet à un serveur de se désinscrire d'un poste pour un jour et une position spécifiques.

##### handleCalculateStats

```typescript
const handleCalculateStats = async () => {
  try {
    const plannings = await getAllPlanning();
    const allComptes = await getComptes();
    const comptesMap = new Map<number, Comptes>(allComptes.map((compte: Comptes) => [compte.numCompte, compte]));

    const statsData: any = {};

    const filteredPlannings = plannings.filter((planning: any) => {
      const compte = comptesMap.get(planning.numCompte);
      return compte && (compte.acces === 1 || compte.acces === 2);
    });

    filteredPlannings.forEach((planning: any) => {
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
```

Cette fonction calcule les statistiques des serveurs basées sur les inscriptions et les courses, et met à jour l'état `stats`.

##### handleDownloadPDF

```typescript
const handleDownloadPDF = () => {
  const doc = new jsPDF();

  const addPodium = (title: string, data: any, startY: number, key: string) => {
    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.setFillColor(255, 255, 255);
    doc.rect(10, startY - 10, 190, 8, 'F');
    doc.text(title, 10, startY - 2);

    data.forEach((item: any, index: number) => {
      let color;
      if (index === 0) color = [255, 215, 0];
      else if (index === 1) color = [192, 192, 192];
      else if (

index === 2) color = [205, 127, 50];
      else color = [255, 255, 255];

      doc.setFillColor.apply(doc, color as [number, number, number]);
      doc.rect(10, startY + index * 10, 190, 8, 'F');
      doc.setTextColor(0);
      doc.text(`${index + 1}. ${item[0]} - ${item[1][key]} ${key}`, 15, startY + index * 10 + 6);
    });
  };

  doc.text("Statistiques des serveurs", 10, 10);

  if (stats) {
    addPodium("Top 10 des moins inscrits", stats.top10LeastInscrit, 20, "inscrit");
    addPodium("Top 10 des plus inscrits", stats.top10MostInscrit, 100, "inscrit");
    addPodium("Top 10 des moins de courses", stats.top10LeastCourses, 180, "courses");
    addPodium("Top 10 des plus de courses", stats.top10MostCourses, 260, "courses");
  }

  doc.save("server-stats.pdf");
};
```

Cette fonction génère et télécharge un PDF des statistiques des serveurs.

---
