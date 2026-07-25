import { useEffect, useState, useCallback } from "react";
import jsPDF from "jspdf";

import ConfirmDialog from "@/components/ui/confirm_dialog";

interface ExportPdfDialogProps {
    open: boolean;
    onClose(): void;
    onPreparePdf(): Promise<jsPDF>;
}

export default function ExportPdfDialog({
    open,
    onClose,
    onPreparePdf,
}: ExportPdfDialogProps) {
    const [loading, setLoading] = useState(false);
    const [pdfDoc, setPdfDoc] = useState<jsPDF | null>(null);
    const [error, setError] = useState(false);

    const generate = useCallback(async () => {
        try {
            setLoading(true);
            setError(false);
            const doc = await onPreparePdf();
            setPdfDoc(doc);
        } catch (err) {
            console.error("Erro ao preparar PDF:", err);
            setError(true);
        } finally {
            setLoading(false);
        }
    }, [onPreparePdf]);

    useEffect(() => {
        if (!open) {
            setPdfDoc(null);
            setError(false);
            return;
        }

        generate();
    }, [open, generate]);

    function handleDownload() {
        if (!pdfDoc) return;
        pdfDoc.save("Relacao_Robotica.pdf");
        onClose();
    }

    if (error) {
        return (
            <ConfirmDialog
                open={open}
                variant="danger"
                title="Erro ao gerar PDF"
                description="Ocorreu um problema ao carregar as informações."
                confirmText="Tentar novamente"
                cancelText="Fechar"
                onConfirm={generate}
                onClose={onClose}
            />
        );
    }

    return (
        <ConfirmDialog
            open={open}
            variant="primary"
            title={loading ? "Gerando PDF..." : "Relatório Pronto!"}
            description={
                loading
                    ? "Aguarde enquanto preparamos a relação dos alunos."
                    : "O arquivo foi gerado com sucesso. Clique no botão abaixo para baixar."
            }
            confirmText={loading ? "Gerando..." : "Baixar PDF"}
            cancelText="Cancelar"
            loading={loading}
            onConfirm={handleDownload}
            onClose={onClose}
        />
    );
}