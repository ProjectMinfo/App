import axios from 'axios';

const baseURL = 'https://minfoapi.fly.dev';



const api = axios.create({
    // baseURL: `${baseURL}:${basePORT}`,
    baseURL: `${baseURL}`,
});

export const getCartes = async () => {
    try {
        const response = await api.get('/cartes');
        return (response.data);
        
    } catch (error) {
        console.error('Error fetching cartes:', error);
        throw error;
    }
};

export const getArticles = async () => {
    try {
        const response = await api.get('/articles');
        return (response.data);

    } catch (error) {
        console.error('Error fetching article:', error);
        throw error;
    }
}

export const getIngredients = async (id?: number) => {
    try {
        const response = await getArticles();
        if (id) {            
            const idFiltred = response.filter((article: any) => article.typeIngredient === id);            
            return idFiltred.map((article: any) => article.nom);
        }
        
        return response.map((article: any) => article.nom);
    } catch (error) {
        console.error('Error fetching ingredients:', error);
        throw error;
    }
}


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

export const getPlats = async () => {
    try {
        const response = await api.get('/plats');
        return (response.data);
    } catch (error) {
        console.error('Error fetching plats:', error);
        throw error;
    }
}

export const getSnacks = async () => {
    try {
        const response = await api.get('/snacks');
        return (response.data);
    } catch (error) {
        console.error('Error fetching snacks:', error);
        throw error;
    }
}

export const postComptes = async (data: any) => {
    const token = 'DEV_TOKEN'; // Add your token here

    try {
        const response = await api.post('/viandes', JSON.stringify(data), {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type" : "application/json"
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
                "Content-Type" : "application/json"
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
