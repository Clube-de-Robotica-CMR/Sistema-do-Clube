import { useEffect, useState } from "react";

import type {
    CreateUserDTO,
    UpdateUserDTO,
} from "@/core/entities/user.entity";

import Input from "@/components/ui/input";
import Button from "@/components/ui/button";

import { ValidationError } from "@/lib/validation_error";

interface UserFormProps {
    mode: "create" | "edit";

    initialValues?: Partial<UpdateUserDTO>;

    loading?: boolean;

    submitText: string;

    onSubmit(
        data: CreateUserDTO | UpdateUserDTO
    ): Promise<void>;
}

export default function UserForm({
    mode,
    initialValues,
    loading,
    submitText,
    onSubmit,
}: UserFormProps) {
    const [name, setName] = useState("");

    const [password, setPassword] = useState("");

    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        setName(initialValues?.name ?? "");

        setPassword("");

        setErrors({});
    }, [initialValues]);

    async function handleSubmit(event: React.FormEvent) {
        event.preventDefault();

        setErrors({});

        try {
            if (mode === "create") {
                await onSubmit({
                    name,
                    password,
                });
            } else {
                await onSubmit({
                    id: initialValues!.id!,
                    name,
                    ...(password ? { password } : {}),
                });
            }
        } catch (error) {
            if (error instanceof ValidationError) {
                const fieldErrors: Record<string, string> = {};

                Object.entries(error.details.fieldErrors).forEach(
                    ([field, messages]) => {
                        if (messages && messages.length > 0) {
                            fieldErrors[field] = messages[0];
                        }
                    }
                );

                setErrors(fieldErrors);
            }
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <Input
                label="Nome"
                value={name}
                onChange={(event) => setName(event.target.value)}
                error={errors.name}
            />

            <Input
                label={mode === "create" ? "Senha" : "Nova senha"}
                type="password"
                autoComplete={mode === "edit" ? "new-password" : undefined}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder={
                    mode === "edit"
                        ? "Deixe em branco para manter a senha atual"
                        : undefined
                }
                error={errors.password}
            />

            <div className="flex justify-end">
                <Button type="submit" loading={loading}>
                    {submitText}
                </Button>
            </div>
        </form>
    );
}