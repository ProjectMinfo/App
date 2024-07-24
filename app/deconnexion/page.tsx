'use client';



export default function Deconnexion() {
    if (typeof window !== 'undefined') {
        window.localStorage.clear();
    }
    if (typeof window !== 'undefined') {
        window.location.href = "/connexion";
    }
    
    return (
        <></>
    )
}