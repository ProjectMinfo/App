// 'use client';
import { redirect } from "next/navigation";

export const CheckAccess = (requireAccess: number) => {

    let userAccess = 0;
    if (typeof window !== 'undefined') {
        userAccess = parseInt(window.localStorage.getItem("userAccess") || "0");
    }
    if (userAccess < requireAccess) {
        redirect("/")
    }
};