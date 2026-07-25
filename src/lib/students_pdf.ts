import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { rpcClient } from "@/services/api";
import { StudentReportItem } from "@/core/use-cases/members";
import { fieldSchema, levelSchema, MemberField, MemberLevel } from "@/core/entities/member.entity";

type ColorRGB = [number, number, number];

// Cores das Faltas
function getAbsenceColors(absences: number): { bg: ColorRGB; text: ColorRGB } {
    switch (absences) {
        case 0:
            return { bg: [224, 242, 254], text: [3, 105, 161] };  // sky-100 / sky-700
        case 1:
            return { bg: [125, 211, 252], text: [51, 65, 85] };   // sky-300 / slate-700
        case 2:
            return { bg: [209, 250, 229], text: [4, 120, 87] };   // emerald-100 / emerald-700
        case 3:
            return { bg: [254, 249, 195], text: [161, 98, 7] };   // yellow-100 / yellow-700
        case 4:
            return { bg: [255, 237, 213], text: [194, 65, 12] };  // orange-100 / orange-700
        default:
            return { bg: [254, 226, 226], text: [185, 28, 28] };  // red-100 / red-700
    }
}

// Cores dos Níveis
function getLevelColors(level: MemberLevel): { bg: ColorRGB; text: ColorRGB } {
    switch (level) {
        case levelSchema.enum["Nível A"]:
            return { bg: [254, 226, 226], text: [185, 28, 28] }; // vermelho claro
        case levelSchema.enum["Nível B"]:
            return { bg: [254, 249, 195], text: [161, 98, 7] };  // amarelo claro
        default:
            return { bg: [241, 245, 249], text: [71, 85, 105] }; // Slate
    }
}

// Cores das Áreas
function getFieldColors(field: MemberField): { bg: ColorRGB; text: ColorRGB } {
    switch (field) {
        case fieldSchema.enum.Programação:
            return { bg: [209, 250, 229], text: [4, 120, 87] }; // Verde claro
        case fieldSchema.enum.Mecatrônica:
            return { bg: [224, 242, 254], text: [3, 105, 161] }; // Azul claro
        default:
            return { bg: [241, 245, 249], text: [71, 85, 105] }; // Slate
    }
}

export async function generateStudentsPDF() {
    const members = await rpcClient<StudentReportItem[]>(
        "members",
        "get_report",
    );

    const doc = new jsPDF();

    // Mapeamento dos dados para a tabela
    const tableRows = members.map((member) => [
        member.number,
        member.war_name,
        member.class,
        member.level,
        member.field,
        `${member.unjustified_absences ?? 0}/5`,
    ]);

    autoTable(doc, {
        startY: 22,
        head: [["N°", "Nome de Guerra", "Sala", "Nível", "Área", "Faltas Não\nJustificadas"]],
        body: tableRows,
        headStyles: {
            fillColor: [124, 58, 237], // Roxo (violet-600)
            textColor: [255, 255, 255],
            fontStyle: "bold",
            halign: "center",
            valign: "middle",
        },
        columnStyles: {
            0: { halign: "center" },
            1: { halign: "left" },   // Apenas Nome de Guerra à esquerda
            2: { halign: "center" },
            3: { halign: "center" },
            4: { halign: "center" },
            5: { halign: "center" },
        },
        didParseCell: (data) => {
            if (data.section !== "body") return;

            const member = members[data.row.index];
            if (!member) return;

            // Nível (coluna 3)
            if (data.column.index === 3) {
                const { bg, text } = getLevelColors(member.level);
                data.cell.styles.fillColor = bg;
                data.cell.styles.textColor = text;
                data.cell.styles.fontStyle = "bold";
            }

            // Área (coluna 4)
            if (data.column.index === 4) {
                const { bg, text } = getFieldColors(member.field);
                data.cell.styles.fillColor = bg;
                data.cell.styles.textColor = text;
                data.cell.styles.fontStyle = "bold";
            }

            // Faltas (coluna 5)
            if (data.column.index === 5) {
                const absences = member.unjustified_absences ?? 0;
                const { bg, text } = getAbsenceColors(absences);
                data.cell.styles.fillColor = bg;
                data.cell.styles.textColor = text;
                data.cell.styles.fontStyle = "bold";
                data.cell.styles.fontSize = 11; // Aumentado o tamanho do texto
            }
        },
    });

    return doc;
}