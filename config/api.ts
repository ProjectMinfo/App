"use client";
import axios from "axios";
import crypto from "crypto";

const baseURL = "https://minfoapi.fly.dev";

const api = axios.create({
  // baseURL: `${baseURL}:${basePORT}`,
  baseURL: `${baseURL}`,
});

// const token = window.localStorage.getItem("token"); // Ajoutez votre token ici
const token = "DEV_TOKEN"; // Ajoutez votre token ici

api.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const getAchats = async () => {
  try {
    const response = await api.get("/achats");
    return response.data;
  } catch (error) {
    console.error("Error fetching users", error);
    throw error;
  }
};

export const getCartes = async () => {
  try {
    const response = await api.get("/cartes");
    return response.data;
  } catch (error) {
    console.error("Error fetching cartes:", error);
    throw error;
  }
};

export const getMenus = async () => {
  try {
    const response = await api.get("/menus");
    return response.data;
  } catch (error) {
    console.error("Error fetching menus:", error);
    throw error;
  }
};

export const getBoissons = async () => {
  try {
    const response = await api.get("/boissons");
    return response.data;
  } catch (error) {
    console.error("Error fetching boissons:", error);
    throw error;
  }
};

export const getPlats = async () => {
  try {
    const response = await api.get("/plats");
    return response.data;
  } catch (error) {
    console.error("Error fetching plats:", error);
    throw error;
  }
};

export const getUser = async (id: number) => {
  try {
    // const response = await api.get(`/user/${id}`);
    const response = await api.get(`/users/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching id:", error);
    throw error;
  }
};

export const getCommandeById = async (id: number) => {
  try {
    const response = await api.get(`/commandes/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching id:", error);
    throw error;
  }
};

export const getCommande = async () => {
  try {
    const response = await api.get(`/commandes`);
    return response.data;
  } catch (error) {
    console.error("Error fetching commandes:", error);
    throw error;
  }
};

export const deleteCarte = async (id: number) => {
  try {
    const response = await api.delete(`/fichiers/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting carte:", error);
    throw error;
  }
};

export const postUpload = async (formData: FormData) => {
  try {
    const response = await api.post("/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
};

export const getFileCount = async () => {
  try {
    const response = await api.get("/fichiers/num");
    return response.data; // Assurez-vous que l'API renvoie un objet avec une clé 'count'
  } catch (error) {
    console.error("Error fetching file count:", error);
    throw error;
  }
};

export const getSnacks = async () => {
  try {
    const response = await api.get("/snacks");
    return response.data;
  } catch (error) {
    console.error("Error fetching snacks:", error);
    throw error;
  }
};

export const getComptes = async () => {
  try {
    const response = await api.get("/users");
    return response.data;
  } catch (error) {
    console.error("Error fetching users", error);
    throw error;
  }
};

export const postEditAchat = async (achat: any) => {
  try {
    const response = await api.post("/achats", JSON.stringify(achat), {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error posting viandes:", error);
    throw error;
  }
};

export const insertManyAchats = async (achats: any) => {
  try {
    const response = await api.post("/achats/many", JSON.stringify(achats), {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error posting viandes:", error);
    throw error;
  }
};

export const postEditCompte = async (user: any) => {
  try {
    const response = await api.post(
      /*'/user/update'*/ "/users/update",
      JSON.stringify(user),
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error posting viandes:", error);
    throw error;
  }
};

export const postViandes = async (data: any) => {
  try {
    const response = await api.post("/viandes", JSON.stringify(data), {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error posting viandes:", error);
    throw error;
  }
};

export const getViandes = async () => {
  try {
    const response = await api.get("/viandes");
    return response.data;
  } catch (error) {
    console.error("Error fetching viandes:", error);
    throw error;
  }
};

// Fonctions pour Viandes

export const deleteViandes = async (id: number) => {
  try {
    const response = await api.delete(`/viandes/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting viandes:", error);
    throw error;
  }
};

// Fonctions pour Ingredients

export const getIngredients = async () => {
  try {
    const response = await api.get("/ingredients");
    return response.data;
  } catch (error) {
    console.error("Error fetching ingredients:", error);
    throw error;
  }
};

export const getIngredientById = async (id: number) => {
  try {
    const response = await api.get(`/ingredients/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching ingeredients :", error);
    throw error;
  }
};

export const postIngredients = async (data: any) => {
  try {
    const response = await api.post("/ingredients", data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error posting ingredients:", error);
    throw error;
  }
};

export const deleteIngredients = async (id: number) => {
  try {
    const response = await api.delete(`/ingredients/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting ingredients:", error);
    throw error;
  }
};

// Fonctions pour Menus
export const postSnacks = async (data: any) => {
  try {
    const response = await api.post("/snacks", data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error posting snacks:", error);
    throw error;
  }
};

export const deleteSnacks = async (id: number) => {
  try {
    const response = await api.delete(`/snacks/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting snacks:", error);
    throw error;
  }
};

export const postBoissons = async (data: any) => {
  try {
    const response = await api.post("/boissons", data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error posting boissons:", error);
    throw error;
  }
};

export const deleteBoissons = async (id: number) => {
  try {
    const response = await api.delete(`/boissons/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting boissons:", error);
    throw error;
  }
};

function encryptCommande(commande: any) {
  try {
    const ENC_KEY = "vuAoN8t3jAmrrUpkjgpY6YgRc4hyjQ8p";
    const IV = "D2H*wUKNwwii#CH!";

    let cipher = crypto.createCipheriv("aes-256-cbc", ENC_KEY, IV);
    let encrypted = cipher.update(commande, "utf8", "hex");
    encrypted += cipher.final("hex");
    return encrypted;
  } catch (e) {
    console.log(e);
  }
}

// Fonction pour mettre à jour une commande par son ID
export const postCommande = async (data: any) => {
  const encryptedCommande = encryptCommande(JSON.stringify(data));

  const newData = {
    data: encryptedCommande,
  };
  try {
    // console.log('data', data);
    const response = await api.post("/commandes", JSON.stringify(newData), {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error posting commande:", error);
    throw error;
  }
};

// Fonction pour créer un nouveau compte
export const postCreateCompte = async (data: any) => {
  try {
    const response = await api.post(
      /*'/user'*/ "/users",
      JSON.stringify(data),
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status === 201) {
      window.localStorage.setItem("password", data.mdp);
      window.localStorage.setItem("email", data.email);
      window.localStorage.setItem("user", JSON.stringify(data));
      return response.data;
    } else {
      throw new Error("Error creating compte");
    }
  } catch (error) {
    console.error("Error creating compte:", error);
    throw error;
  }
};

// Fonction pour envoyer un e-mail de vérification
export const sendVerificationEmail = async (email: string) => {
  try {
    const response = await api.post(
      "/send-verification-email",
      JSON.stringify({ email }),
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw error;
  }
};

// Fonction pour obtenir le planning de la semaine
export const getPlanning = async (numSemaine: number) => {
  try {
    // const response = await api.get(`/planning/week/${numSemaine}`);
    const response = await api.get(`/plannings/week/${numSemaine}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching planning:", error);
    throw error;
  }
};

// Fonction pour poster le planning
export const postPlanning = async (data: any) => {
  try {
    // const response = await api.post('/planning', data, {
    const response = await api.post("/plannings", data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error posting planning:", error);
    throw error;
  }
};

export const deletePlanning = async (idPlanning: number) => {
  try {
    // const response = await api.delete(`/planning/${idPlanning}`);
    const response = await api.delete(`/plannings/${idPlanning}`);

    return response.data;
  } catch (error) {
    console.error("Error deleting planning:", error);
    throw error;
  }
};

export const getAllPlanning = async () => {
  try {
    // const response = await api.get(`/planning`);
    const response = await api.get(`/plannings`);

    return response.data;
  } catch (error) {
    console.error("Error fetching planning:", error);
    throw error;
  }
};

// Fonction pour obtenir le planning de la semaine
export const getPlanningCourse = async (numSemaine: number) => {
  try {
    const response = await api.get(`/planning-courses/week/${numSemaine}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching planning:", error);
    throw error;
  }
};

// Fonction pour poster le planning
export const postPlanningCourse = async (data: any) => {
  try {
    const response = await api.post("/planning-courses", data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error posting planning:", error);
    throw error;
  }
};

export const deletePlanningCourse = async (id: number) => {
  try {
    const response = await api.delete(`/planning-courses/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting planning:", error);
    throw error;
  }
};

export const postPlats = async (data: any) => {
  try {
    const response = await api.post("/plats", data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error posting plats:", error);
    throw error;
  }
};

export const deletePlats = async (id: number) => {
  try {
    const response = await api.delete(`/plats/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting plats:", error);
    throw error;
  }
};

export const postMenus = async (data: any) => {
  try {
    const response = await api.post("/menus", data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error posting menus:", error);
    throw error;
  }
};

export const deleteMenus = async (id: number) => {
  try {
    const response = await api.delete(`/menus/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting menus:", error);
    throw error;
  }
};

export const deleteAchats = async (id: number) => {
  try {
    const response = await api.delete(`/achats/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting achats:", error);
    throw error;
  }
};

export const getAllTemperatures = async () => {
  try {
    const response = await api.get(`/temperatures`);
    return response.data;
  } catch (error) {
    console.error("Error fetching Temperatures", error);
    throw error;
  }
};

export const postTemperature = async (data: any) => {
  try {
    const response = await api.post("/temperatures", JSON.stringify(data), {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error posting temperature:", error);
    throw error;
  }
};

export const deleteTemperature = async (id: number) => {
  try {
    const response = await api.delete(`/temperatures/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting temperature:", error);
    throw error;
  }
};

export const getBoissonById = async (id: number) => {
  try {
    const response = await api.get(`/boissons/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching boissons", error);
    throw error;
  }
};

export const getCommandesByIdUser = async (id: number) => {
  try {
    // const response = await api.get(`/commandes/user/${id}`);
    const response = await api.get(`/commandes/user/${id}`);

    return response.data;
  } catch (error) {
    console.error("Error fetching commandes:", error);
    throw error;
  }
};

// Fonction pour mettre à jour une commande par son ID
export const postCommandeById = async (id: number, data: any) => {
  try {
    const response = await api.post(`/commandes/${id}`, JSON.stringify(data), {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error posting commande:", error);
    throw error;
  }
};

export const postLogin = async (data: any) => {
  try {
    const response = await api.post("/login", JSON.stringify(data), {
      headers: {
        "Content-Type": "application/json",
      },
    });
    // console.log('response', response.data);

    if (response.status === 200) {
      window.localStorage.setItem("password", data.mdp);
      window.localStorage.setItem("email", data.email);

      const token = response.data.token;
      const numCompte = response.data.num_compte;

      window.localStorage.setItem("token", token);
      window.localStorage.setItem("numCompte", numCompte);

      const user = await getUser(numCompte);
      window.localStorage.setItem("user", JSON.stringify(user));

      return response.data;
    } else {
      throw new Error("Error login");
    }

    // return response.data;
  } catch (error) {
    console.error("Error login:", error);
    throw error;
  }
};

export const renameCarte = async (oldId: number, newId: number) => {
  try {
    const response = await api.put(`/fichiers/${oldId}`, { newId });
    return response.data;
  } catch (error) {
    console.error("Error renaming carte:", error);
    throw error;
  }
};

export const getCarte = async (id: number) => {
  try {
    const response = await api.get(`/fichiers/${id}`, {
      responseType: "blob",
      maxBodyLength: Infinity,
    });
    const blob = new Blob([response.data], { type: "image/png" });
    const url = URL.createObjectURL(blob);
    return url;
  } catch (error) {
    console.error("Error fetching carte:", error);
    throw error;
  }
};

export const getEventMode = async () => {
  try {
    const response = await api.get("/settings/event");
    return response.data; // Assurez-vous que response.data a une structure { value: 1 } ou { value: 0 }
  } catch (error) {
    console.error("Error fetching event mode:", error);
    throw error;
  }
};

export const getSettingById = async (id: number) => {
  try {
    const response = await api.get(`/settings/${id}`);
    return response.data; // Assurez-vous que response.data a une structure { value: 1 } ou { value: 0 }
  } catch (error) {
    console.error("Error fetching event mode:", error);
    throw error;
  }
};

export const postEventMode = async (value: boolean) => {
  try {
    const response = await api.post("/settings", {
      id: 3,
      param: "event",
      value: value ? 1 : 0,
      type: "Setting",
    });
    return response.data;
  } catch (error) {
    console.error("Error updating event mode:", error);
    throw error;
  }
};

export const postLimitOrderTaking = async (value: boolean) => {
  try {
    const response = await api.post("/settings", {
      id: 4,
      param: "LimiterHeuresCommandes",
      value: value ? 1 : 0,
      type: "Setting",
    });
    return response.data;
  } catch (error) {
    console.error("Error updating limit order taking:", error);
    throw error;
  }
};

export const postOrderStatus = async (value: boolean) => {
  try {
    const response = await api.post("/settings", {
      id: 1,
      param: "Commande",
      value: value ? 1 : 0,
      type: "Setting",
    });
    return response.data;
  } catch (error) {
    console.error("Error updating order status:", error);
    throw error;
  }
};

export const getOrderHours = async () => {
  try {
    const response = await api.get("/settings/5");
    return response.data; // Assurez-vous que response.data a une structure { heureDebutCommandes: "08:00", heureFinCommandes: "20:00" }
  } catch (error) {
    console.error("Error fetching order hours:", error);
    throw error;
  }
};

export const postOrderHours = async (
  heureDebutCommandes: string,
  heureFinCommandes: string
) => {
  try {
    const response = await api.post("/settings", {
      id: 5,
      heureDebutCommandes,
      heureFinCommandes,
      type: "HeuresSetting",
    });
    return response.data;
  } catch (error) {
    console.error("Error updating order hours:", error);
    throw error;
  }
};
