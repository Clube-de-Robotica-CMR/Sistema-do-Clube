import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import type { Quarter } from "@/core/entities/meeting.entity";
import { findBonusRows } from "@/components/modules/bonus/services";


export async function generateBonusPDF(
    quarter: Quarter,
) {
    const rows = await findBonusRows(quarter);

    const doc = new jsPDF();

    const tableRows = rows.map((row) => [
        row.number,
        row.war_name,
        row.class,
        `+${row.grade_bonus.toFixed(1)}`,
    ]);

    autoTable(doc, {
        startY: 22,

        head: [[
            "N°",
            "Nome de Guerra",
            "Turma",
            "GIP",
        ]],

        body: tableRows,

        headStyles: {
            fillColor: [124, 58, 237],
            textColor: [255, 255, 255],
            fontStyle: "bold",
            halign: "center",
            valign: "middle",
        },

        columnStyles: {
            0: {
                halign: "center",
            },

            1: {
                halign: "left",
            },

            2: {
                halign: "center",
            },

            3: {
                halign: "center",
            },
        },

        didParseCell: (data) => {
            if (data.section !== "body") {
                return;
            }

            /*
             * Destaca a coluna de GIP.
             */
            if (data.column.index === 3) {
                data.cell.styles.fillColor = [
                    237,
                    233,
                    254,
                ];

                data.cell.styles.textColor = [
                    109,
                    40,
                    217,
                ];

                data.cell.styles.fontStyle =
                    "bold";

                data.cell.styles.fontSize = 11;
            }
        },
    });

    return doc;
}