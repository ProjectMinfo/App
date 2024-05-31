import axios from 'axios';

const baseURL = 'https://minfoapi.fly.dev';



const api = axios.create({
  // baseURL: `${baseURL}:${basePORT}`,
  baseURL: `${baseURL}`,
});
const token = 'DEV_TOKEN'; // Ajoutez votre token ici

api.interceptors.request.use(config => {
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});


export const getAchats = async () => {
  const token = "DEV_TOKEN";

  try {
    const response = await api.get('/achats', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return (response.data);

  }
  catch (error) {
    console.error('Error fetching users', error);
    throw error;
  }
}

export const getCartes = async () => {
  try {
    const response = await api.get('/cartes');
    return (response.data);

  } catch (error) {
    console.error('Error fetching cartes:', error);
    throw error;
  }
};

export const getMenus = async () => {
  try {
    const response = await api.get('/menus');
    return (response.data);
  } catch (error) {
    console.error('Error fetching menus:', error);
    throw error;
  }
}

export const getBoissons = async () => {
  try {
    const response = await api.get('/boissons');
    return (response.data);
  } catch (error) {
    console.error('Error fetching boissons:', error);
    throw error;
  }
}

export const getBoissonById = async (id: number)=>{
  try {
    const response= await api.get(`/boissons/${id}`);
    return (response.data);
  } catch (error){
    console.error('Error fetching boissons',error);
    throw error;
  }
}

export const getPlats = async () => {
  try {
    const response = await api.get('/plats');
    return (response.data);
  } catch (error) {
    console.error('Error fetching plats:', error);
    throw error;
  }
}

export const getUser = async (id: number) => {
  try {
    const response = await api.get(`/user/${id}`);
    return (response.data);
  } catch (error) {
    console.error('Error fetching id:', error);
    throw error;
  }
}

export const getCommandeById = async (id: number) => {
  try {
    const response = await api.get(`/commandes/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching id:', error);
    throw error;
  }
};

export const getCommande = async () => {
  try {
    const response = await api.get(`/commandes`);
    return response.data;
  } catch (error) {
    console.error('Error fetching commandes:', error);
    throw error;
  }
};

export const getCommandesByIdUser = async (id:number) => {
  try {
    const response = await api.get(`/commandes/user/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching commandes:', error);
    throw error;
  }
};

// Fonction pour mettre à jour une commande par son ID
export const postCommandeById = async (id: number, data: any) => {
  const token = 'DEV_TOKEN'; // Add your token here

  try {
    const response = await api.post(`/commandes/${id}`, JSON.stringify(data), {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error posting commande:', error);
    throw error;
  }
};



export const getSnacks = async () => {
  try {
    const response = await api.get('/snacks');
    return (response.data);
  } catch (error) {
    console.error('Error fetching snacks:', error);
    throw error;
  }
}

export const getComptes = async () => {
  const token = "DEV_TOKEN";

  try {
    const response = await api.get('/users', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return (response.data);

  }
  catch (error) {
    console.error('Error fetching users', error);
    throw error;
  }
}



export const postEditAchat = async (achat: any) => {
  const token = 'DEV_TOKEN'; // Add your token here

  try {
    const response = await api.post('/achats', JSON.stringify(achat), {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error posting achats:', error);
    throw error;
  }
};

export const postEditCompte = async (user: any) => {
  const token = 'DEV_TOKEN'; // Add your token here

  try {
    const response = await api.post('/user/update', JSON.stringify(user), {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error posting viandes:', error);
    throw error;
  }
}

export const postViandes = async (data: any) => {
  const token = 'DEV_TOKEN'; // Add your token here

  try {
    const response = await api.post('/viandes', JSON.stringify(data), {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });
    return response.data;

  } catch (error) {
    console.error('Error posting viandes:', error);
    throw error;
  }
}

export const getViandes = async () => {
  try {
    const response = await api.get('/viandes');
    return (response.data);

  } catch (error) {
    console.error('Error fetching viandes:', error);
    throw error;
  }

}

// Fonctions pour Viandes


export const deleteViandes = async (id: number) => {
  try {
    const response = await api.delete(`/viandes/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting viandes:', error);
    throw error;
  }
};

// Fonctions pour Ingredients

export const getIngredients = async () => {
  try {
    const response = await api.get('/ingredients');
    return (response.data);
  } catch (error) {
    console.error('Error fetching ingredients:', error);
    throw error;
  }
}


export const postIngredients = async (data: any) => {
  try {
    const response = await api.post('/ingredients', data, {
      headers: {
        "Content-Type": "application/json"
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error posting ingredients:', error);
    throw error;
  }
};

export const deleteIngredients = async (id: number) => {
  try {
    const response = await api.delete(`/ingredients/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting ingredients:', error);
    throw error;
  }
};

// Fonctions pour Menus
export const postSnacks = async (data: any) => {
  try {
    const response = await api.post('/snacks', data, {
      headers: {
        "Content-Type": "application/json"
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error posting snacks:', error);
    throw error;
  }
};

export const deleteSnacks = async (id: number) => {
  try {
    const response = await api.delete(`/snacks/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting snacks:', error);
    throw error;
  }
};


export const postBoissons = async (data: any) => {
  try {
    const response = await api.post('/boissons', data, {
      headers: {
        "Content-Type": "application/json"
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error posting boissons:', error);
    throw error;
  }
};

export const deleteBoissons = async (id: number) => {
  try {
    const response = await api.delete(`/boissons/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting boissons:', error);
    throw error;
  }
};

export const getAllTemperatures = async()=>{
  try{
    const response= await api.get(`/temperatures`);
    return response.data;
  } catch(error){
    console.error('Error fetching Temperatures',error);
    throw error;
  }
}

export const postTemperature= async (data :any)=>{
  const token='DEV_TOKEN';//Add your token here
  try {
    const response = await api.post('/temperatures', JSON.stringify(data),{
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }     
    });
    return response.data
  } catch(error){
    console.error('Error posting temperature:', error);
    throw error; 
  }
}

// Fonction pour mettre à jour une commande par son ID
export const postCommande = async (data: any) => {
  const token = 'DEV_TOKEN'; // Add your token here

  try {
    console.log('data', data);
    const response = await api.post(`/commandes`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });

    return response.data;
  } catch (error) {
    console.error('Error posting commande:', error);
    throw error;
  }
};

// Fonction pour créer un nouveau compte
export const postCreateCompte = async (data: any) => {
  const token = 'DEV_TOKEN'; // Add your token here

  try {
    const response = await api.post('/user', JSON.stringify(data), {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error creating compte:', error);
    throw error;
  }
}


// Fonction pour envoyer un e-mail de vérification
export const sendVerificationEmail = async (email: string) => {
  try {
    const response = await api.post('/send-verification-email', JSON.stringify({ email }), {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw error;
  }
};
