import { useEffect, useState } from "react";

import type {
    CreateMemberDTO,
    Member,
    MemberField,
    MemberLevel,
} from "@/core/entities/member.entity";

import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import { FieldErrors, ValidationError } from "@/lib/validation_error";

interface StudentFormProps {
    initialData?: Partial<Member>;

    loading?: boolean;

    submitText?: string;

    onSubmit(data: CreateMemberDTO): void | Promise<void>;
}

const levels: MemberLevel[] = [
    "Nível B",
    "Nível A",
    "Indefinido",
];

const fields: MemberField[] = [
    "Programação",
    "Mecatrônica",
    "Indefinido",
];

export default function StudentForm({
    initialData,
    loading = false,
    submitText = "Salvar",
    onSubmit,
}: StudentFormProps) {
    const [warName, setWarName] = useState("");
    const [fullName, setFullName] = useState("");
    const [number, setNumber] = useState("");
    const [studentClass, setStudentClass] = useState("");
    const [phone, setPhone] = useState("");

    const [level, setLevel] =
        useState<MemberLevel>("Indefinido");

    const [field, setField] =
        useState<MemberField>("Indefinido");

    const [director, setDirector] =
        useState(false);

    const [errors, setErrors] =
        useState<FieldErrors>({});

    useEffect(() => {
        if (!initialData) {
            setWarName("");
            setFullName("");
            setNumber("");
            setStudentClass("");
            setPhone("");
            setLevel("Indefinido");
            setField("Indefinido");
            setDirector(false);
            setErrors({});
            return;
        }

        setWarName(initialData.war_name ?? "");
        setFullName(initialData.full_name ?? "");
        setNumber(initialData.number ?? "");
        setStudentClass(initialData.class ?? "");
        setPhone(initialData.phone ?? "");
        setLevel(initialData.level ?? "Indefinido");
        setField(initialData.field ?? "Indefinido");
        setDirector(initialData.is_director ?? false);
        setErrors({});
    }, [initialData]);

    function getFieldError(
        field: string
    ): string | undefined {
        return errors[field];
    }

    async function handleSubmit(
        e: React.FormEvent
    ) {
        e.preventDefault();

        setErrors({});

        try {
            await onSubmit({
                war_name: warName,
                full_name: fullName,
                number,
                class: studentClass,
                phone: phone || undefined,
                level,
                field,
                is_director: director,
            });
        } catch (err) {
            if (err instanceof ValidationError) {
                const fieldErrors: FieldErrors = {};

                for (const [field, messages] of Object.entries(
                    err.details.fieldErrors
                )) {
                    if (messages?.length) {
                        fieldErrors[field] =
                            messages[0];
                    }
                }

                setErrors(fieldErrors);
                return;
            }

            throw err;
        }
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-5"
        >
            <div className="grid grid-cols-2 gap-4">
                <Input
                    label="Nome de guerra"
                    value={warName}
                    error={getFieldError("war_name")}
                    onChange={(e) =>
                        setWarName(e.target.value)
                    }
                    required
                />

                <Input
                    label="Nome completo"
                    value={fullName}
                    error={getFieldError("full_name")}
                    onChange={(e) =>
                        setFullName(e.target.value)
                    }
                    required
                />
            </div>

            <div className="grid grid-cols-3 gap-4">
                <Input
                    label="Número"
                    value={number}
                    error={getFieldError("number")}
                    onChange={(e) =>
                        setNumber(e.target.value)
                    }
                    required
                />

                <Input
                    label="Turma"
                    value={studentClass}
                    error={getFieldError("class")}
                    onChange={(e) =>
                        setStudentClass(
                            e.target.value
                        )
                    }
                    required
                />

                <Input
                    label="Telefone"
                    value={phone}
                    error={getFieldError("phone")}
                    onChange={(e) =>
                        setPhone(e.target.value)
                    }
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <label className="space-y-2">
                    <span className="text-sm font-medium">
                        Área
                    </span>

                    <select
                        value={field}
                        onChange={(e) =>
                            setField(
                                e.target
                                    .value as MemberField
                            )
                        }
                        className="h-12 w-full rounded-xl border border-slate-200 px-4"
                    >
                        {fields.map((value) => (
                            <option
                                key={value}
                                value={value}
                            >
                                {value}
                            </option>
                        ))}
                    </select>

                    {getFieldError("field") && (
                        <p className="text-sm text-red-600">
                            {getFieldError("field")}
                        </p>
                    )}
                </label>

                <label className="space-y-2">
                    <span className="text-sm font-medium">
                        Nível
                    </span>

                    <select
                        value={level}
                        onChange={(e) =>
                            setLevel(
                                e.target
                                    .value as MemberLevel
                            )
                        }
                        className="h-12 w-full rounded-xl border border-slate-200 px-4"
                    >
                        {levels.map((value) => (
                            <option
                                key={value}
                                value={value}
                            >
                                {value}
                            </option>
                        ))}
                    </select>

                    {getFieldError("level") && (
                        <p className="text-sm text-red-600">
                            {getFieldError("level")}
                        </p>
                    )}
                </label>
            </div>

            <label className="flex items-center gap-3">
                <input
                    type="checkbox"
                    checked={director}
                    onChange={(e) =>
                        setDirector(
                            e.target.checked
                        )
                    }
                />

                <span>
                    Faz parte da diretoria
                </span>
            </label>

            {getFieldError("is_director") && (
                <p className="text-sm text-red-600">
                    {getFieldError("is_director")}
                </p>
            )}

            <div className="flex justify-end">
                <Button
                    type="submit"
                    loading={loading}
                >
                    {submitText}
                </Button>
            </div>
        </form>
    );
}