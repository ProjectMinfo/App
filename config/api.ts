import axios from 'axios';

const baseURL = 'https://minfoapi.fly.dev';
const basePORT = '8000';

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
            return response.find((article: any) => article.id === id).ingredients;
        }

        return response.map((article: any) => article.ingredients);
    } catch (error) {
        console.error('Error fetching ingredients:', error);
        throw error;
    }
}