"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import NarrowPageWrapper from "@/components/ui/layout/NarrowPageWrapper";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/form/Input";
import PlanBadge from "@/components/ui/PlanBadge";
import SectionToggle from "@/components/ui/SectionToggle";
import { Users, Search, ChevronLeft, ChevronRight, Pencil, X, Loader2, Check } from "lucide-react";
import { UserPlan, userPlans } from "@/db/schemas/enum/user-plan";
import clsx from "clsx";

interface AdminUser {
    id: number;
    name: string;
    email: string;
    plan: UserPlan;
    language: string;
    createdAt: string;
}

interface Pagination {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
}

const ADMIN_SECTIONS = [
    { key: "users", label: "Users", Icon: Users },
];

export default function AdminPage() {
    const t = useTranslations("admin");
    const { user, isLoading: authLoading } = useAuth();
    const router = useRouter();

    const [activeSection, setActiveSection] = useState("users");
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [pagination, setPagination] = useState<Pagination | null>(null);
    const [search, setSearch] = useState("");
    const [searchInput, setSearchInput] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
    const [editForm, setEditForm] = useState({ name: "", email: "", plan: "free" as UserPlan, password: "" });
    const [isSaving, setIsSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);

    const fetchUsers = useCallback(async (page = 1, searchQuery = "") => {
        setIsLoading(true);
        try {
            const params = new URLSearchParams({ page: page.toString() });
            if (searchQuery) params.set("search", searchQuery);

            const response = await fetch(`/api/admin/users?${params}`);
            if (response.status === 403) {
                router.push("/");
                return;
            }
            if (!response.ok) throw new Error("Failed to fetch");

            const data = await response.json();
            setUsers(data.users);
            setPagination(data.pagination);
        } catch (error) {
            console.error("Failed to fetch users:", error);
        } finally {
            setIsLoading(false);
        }
    }, [router]);

    useEffect(() => {
        if (!authLoading) {
            if (!user || user.plan !== "admin") {
                router.push("/");
            } else {
                fetchUsers();
            }
        }
    }, [authLoading, user, router, fetchUsers]);

    const handleSearch = () => {
        setSearch(searchInput);
        fetchUsers(1, searchInput);
    };

    const handlePageChange = (newPage: number) => {
        fetchUsers(newPage, search);
    };

    const openEditModal = (adminUser: AdminUser) => {
        setEditingUser(adminUser);
        setEditForm({
            name: adminUser.name,
            email: adminUser.email,
            plan: adminUser.plan,
            password: "",
        });
        setSaveSuccess(false);
    };

    const closeEditModal = () => {
        setEditingUser(null);
        setSaveSuccess(false);
    };

    const handleSaveUser = async () => {
        if (!editingUser) return;

        setIsSaving(true);
        setSaveSuccess(false);

        try {
            const updates: Record<string, string> = {};
            if (editForm.name !== editingUser.name) updates.name = editForm.name;
            if (editForm.email !== editingUser.email) updates.email = editForm.email;
            if (editForm.plan !== editingUser.plan) updates.plan = editForm.plan;
            if (editForm.password) updates.password = editForm.password;

            if (Object.keys(updates).length === 0) {
                closeEditModal();
                return;
            }

            const response = await fetch(`/api/admin/users/${editingUser.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updates),
            });

            if (response.ok) {
                const data = await response.json();
                setUsers(users.map(u => u.id === editingUser.id ? data.user : u));
                setSaveSuccess(true);
                setTimeout(() => {
                    closeEditModal();
                }, 1000);
            }
        } catch (error) {
            console.error("Failed to update user:", error);
        } finally {
            setIsSaving(false);
        }
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    if (authLoading || !user || user.plan !== "admin") {
        return (
            <NarrowPageWrapper maxWidth="lg">
                <Card className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-muted" />
                </Card>
            </NarrowPageWrapper>
        );
    }

    return (
        <NarrowPageWrapper maxWidth="lg">
            <div className="flex flex-col gap-6">
                {/* Header */}
                <div className="flex flex-col items-center">
                    <h1 className="text-2xl font-bold">{t("title")}</h1>
                </div>

                {/* Section Toggle */}
                <SectionToggle
                    sections={ADMIN_SECTIONS}
                    activeSectionKey={activeSection}
                    onSectionChange={setActiveSection}
                />

                {/* Users Section */}
                {activeSection === "users" && (
                    <Card>
                        {/* Search */}
                        <div className="flex gap-2 mb-4">
                            <div className="flex-1 relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
                                <Input
                                    type="text"
                                    placeholder={t("searchUsers")}
                                    value={searchInput}
                                    onChange={(e) => setSearchInput(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                                    className="pl-10"
                                />
                            </div>
                            <Button
                                text={t("search")}
                                onClick={handleSearch}
                                size="md"
                            />
                        </div>

                        {/* Users List */}
                        {isLoading ? (
                            <div className="flex justify-center py-8">
                                <Loader2 className="w-6 h-6 animate-spin text-muted" />
                            </div>
                        ) : users.length === 0 ? (
                            <div className="text-center py-8 text-muted">
                                {t("noUsersFound")}
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {users.map((adminUser) => (
                                    <div
                                        key={adminUser.id}
                                        className="flex items-center justify-between p-3 bg-background-secondary rounded-lg"
                                    >
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium truncate">{adminUser.name}</span>
                                                <PlanBadge plan={adminUser.plan} size="sm" />
                                            </div>
                                            <div className="text-sm text-muted truncate">{adminUser.email}</div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs text-muted hidden sm:block">
                                                {formatDate(adminUser.createdAt)}
                                            </span>
                                            <Button
                                                text=""
                                                Icon={Pencil}
                                                variant="skeleton"
                                                size="sm"
                                                onClick={() => openEditModal(adminUser)}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Pagination */}
                        {pagination && pagination.totalPages > 1 && (
                            <div className="flex items-center justify-center gap-2 mt-4">
                                <Button
                                    text=""
                                    Icon={ChevronLeft}
                                    variant="skeleton"
                                    size="sm"
                                    onClick={() => handlePageChange(pagination.page - 1)}
                                    disabled={pagination.page <= 1}
                                />
                                <span className="text-sm text-muted">
                                    {pagination.page} / {pagination.totalPages}
                                </span>
                                <Button
                                    text=""
                                    Icon={ChevronRight}
                                    variant="skeleton"
                                    size="sm"
                                    onClick={() => handlePageChange(pagination.page + 1)}
                                    disabled={pagination.page >= pagination.totalPages}
                                />
                            </div>
                        )}
                    </Card>
                )}

                {/* Edit User Modal */}
                {editingUser && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <Card className="w-full max-w-md">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-semibold">{t("editUser")}</h2>
                                <button onClick={closeEditModal} className="text-muted hover:text-foreground">
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <Input
                                    label={t("name")}
                                    value={editForm.name}
                                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                />

                                <Input
                                    label={t("email")}
                                    type="email"
                                    value={editForm.email}
                                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                                />

                                <div>
                                    <label className="block text-sm font-medium mb-1">{t("plan")}</label>
                                    <div className="flex gap-2 flex-wrap">
                                        {userPlans.map((plan) => (
                                            <button
                                                key={plan}
                                                onClick={() => setEditForm({ ...editForm, plan })}
                                                className={clsx(
                                                    "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
                                                    editForm.plan === plan
                                                        ? "bg-primary text-white"
                                                        : "bg-background-secondary text-muted hover:text-foreground"
                                                )}
                                            >
                                                <PlanBadge plan={plan} size="sm" />
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <Input
                                    label={t("newPassword")}
                                    type="password"
                                    value={editForm.password}
                                    onChange={(e) => setEditForm({ ...editForm, password: e.target.value })}
                                    placeholder={t("leaveBlankToKeep")}
                                />

                                <div className="flex items-center justify-end gap-2">
                                    {saveSuccess && (
                                        <span className="text-sm text-green-500 flex items-center gap-1">
                                            <Check size={14} />
                                            {t("userUpdated")}
                                        </span>
                                    )}
                                    <Button
                                        text={t("cancel")}
                                        variant="skeleton"
                                        onClick={closeEditModal}
                                    />
                                    <Button
                                        text={isSaving ? t("saving") : t("save")}
                                        onClick={handleSaveUser}
                                        disabled={isSaving}
                                    />
                                </div>
                            </div>
                        </Card>
                    </div>
                )}
            </div>
        </NarrowPageWrapper>
    );
}
