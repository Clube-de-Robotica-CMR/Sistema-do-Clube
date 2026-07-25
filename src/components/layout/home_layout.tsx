import { useEffect, useState } from "react";

import Sidebar from "./sidebar";
import Header from "./header";

import {
    HomeModule,
    HOME_MODULE_STORAGE_KEY,
    SIDEBAR_COLLAPSED_STORAGE_KEY,
} from "@/lib/home";
import StudentsModule from "../modules/students";
import MeetingsModule from "../modules/meetings";
import BonusModule from "../modules/bonus";
import CompetitionsModule from "../modules/competitions";
import RankingModule from "../modules/ranking";

interface HomeLayoutProps {
    role: "admin" | "diretoria";
}

export default function HomeLayout({
    role,
}: HomeLayoutProps) {
    const [activeModule, setActiveModule] =
        useState<HomeModule>("students");

    const [collapsed, setCollapsed] =
        useState(false);

    /*
     * Carrega preferências salvas
     */

    useEffect(() => {
        const savedModule =
            localStorage.getItem(
                HOME_MODULE_STORAGE_KEY
            ) as HomeModule | null;

        const savedCollapsed =
            localStorage.getItem(
                SIDEBAR_COLLAPSED_STORAGE_KEY
            );

        if (savedModule) {
            setActiveModule(savedModule);
        }

        if (savedCollapsed !== null) {
            setCollapsed(savedCollapsed === "true");
        }
    }, []);

    /*
     * Persiste módulo
     */

    useEffect(() => {
        localStorage.setItem(
            HOME_MODULE_STORAGE_KEY,
            activeModule
        );
    }, [activeModule]);

    /*
     * Persiste sidebar
     */

    useEffect(() => {
        localStorage.setItem(
            SIDEBAR_COLLAPSED_STORAGE_KEY,
            String(collapsed)
        );
    }, [collapsed]);

    function renderModule() {
        switch (activeModule) {
            case "students":
                return (
                    <div className="p-8">
                        <div className="rounded-3xl border bg-white p-10 shadow-sm">
                            <StudentsModule role={role} />

                        </div>
                    </div>
                );

            case "meetings":
                return (
                    <div className="p-8">
                        <div className="rounded-3xl border bg-white p-10 shadow-sm">
                            <MeetingsModule role={role} />
                        </div>
                    </div>
                );

            case "bonus":
                return (
                    <div className="p-8">
                        <div className="rounded-3xl border bg-white p-10 shadow-sm">
                            <BonusModule />
                        </div>
                    </div>
                );

            case "competitions":
                return (
                    <div className="p-8">
                        <div className="rounded-3xl border bg-white p-10 shadow-sm">
                            <CompetitionsModule />
                        </div>
                    </div>
                );

            case "ranking":
                return (
                    <div className="p-8">
                        <div className="rounded-3xl border bg-white p-10 shadow-sm">
                            <RankingModule />
                        </div>
                    </div>
                );

            case "inventory":
                return (
                    <div className="p-8">
                        <div className="rounded-3xl border bg-white p-10 shadow-sm">
                            Inventário
                        </div>
                    </div>
                );

            case "users":
                return (
                    <div className="p-8">
                        <div className="rounded-3xl border bg-white p-10 shadow-sm">
                            Usuários
                        </div>
                    </div>
                );

            default:
                return null;
        }
    }

    return (
        <main className="flex h-screen bg-slate-100">
            <Sidebar
                role={role}
                activeModule={activeModule}
                collapsed={collapsed}
                onChangeModule={setActiveModule}
                onToggleCollapse={() =>
                    setCollapsed(previous => !previous)
                }
            />

            <section className="flex flex-1 flex-col overflow-hidden">
                <Header activeModule={activeModule} />

                <div className="flex-1 overflow-y-auto">
                    {renderModule()}
                </div>
            </section>
        </main>
    );
}