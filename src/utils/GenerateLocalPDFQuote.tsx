import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import type { TDocumentDefinitions } from "pdfmake/interfaces";
import type { ClientQuotation } from "../Clases";
import type { PartAdded } from "../pages/client_quotation/NewClientQuotation";
import { addToast } from "@heroui/react";
import logoBase64 from "./logoBase64";

pdfMake.vfs = pdfFonts.vfs;

export const generateLocalQuotationPDF = async (
  quotation: ClientQuotation,
  parts: PartAdded[]
) => {
  try {
    const {
      code,
      client,
      requesterName,
      offerValidity,
      currency,
      subtotal,
      markupPercentage,
      iva,
      localTransportCost,
      totalPrice,
    } = quotation;

    const partRows = parts.map((p) => ({
      name: p.part.name,
      quantity: p.quantity ?? 0,
      unitPrice: p.unitPrice ?? 0,
      totalPrice: p.totalPrice ?? 0,
    }));

    const docDefinition: TDocumentDefinitions = {
      content: [
        // LOGO + Empresa
        {
          columns: [
            {
              image: logoBase64,
              width: 100,
            },
            [
              { text: "SEMCON S.A.S", style: "title" },
              { text: "NIT: 805020551-2", style: "small" },
              { text: "Email: anabetancourt@semcon.com.co", style: "small" },
              { text: "Cali, Colombia", style: "small" },
            ],
          ],
        },

        { text: " ", margin: [0, 10] },

        { text: "COTIZACIÓN", style: "header" },

        {
          columns: [
            [
              { text: `Código: ${code}` },
              { text: `Cliente: ${client.name}` },
              { text: `Solicitante: ${requesterName}` },
              [{ text: `Vigencia de oferta: ${offerValidity} días` }],
            ],
          ],
        },

        { text: " ", margin: [0, 10] },

        {
          text: "Partes Cotizadas",
          style: "subheader",
          margin: [0, 5],
        },

        {
          table: {
            headerRows: 1,
            widths: ["*", "auto", "auto", "auto"],
            body: [
              ["Parte", "Cantidad", "P. Unitario", "Subtotal"],
              ...partRows.map((row) => [
                row.name,
                row.quantity,
                `${currency} ${row.unitPrice.toFixed(2)}`,
                `${currency} ${row.totalPrice.toFixed(2)}`,
              ]),
            ],
          },
          layout: "lightHorizontalLines",
        },

        { text: " ", margin: [0, 10] },

        {
          text: "Resumen de Cálculo",
          style: "subheader",
          margin: [0, 5],
        },

        {
          style: "totals",
          table: {
            widths: ["*", "auto"],
            body: [
              ["Subtotal partes", `${currency} ${subtotal?.toFixed(2)}`],
              [
                "Transporte local",
                `${currency} ${localTransportCost?.toFixed(2)}`,
              ],
              ["Markup aplicado", `${markupPercentage}%`],
              ["IVA", `${iva}%`],
              [
                { text: "TOTAL ESTIMADO", bold: true },
                {
                  text: `${currency} ${Number(totalPrice).toFixed(2)}`,
                  bold: true,
                },
              ],
            ],
          },
          layout: "noBorders",
        },
      ],
      styles: {
        title: {
          fontSize: 16,
          bold: true,
          alignment: "right",
        },
        small: {
          fontSize: 8,
          alignment: "right",
        },
        header: {
          fontSize: 16,
          bold: true,
          alignment: "center",
          margin: [0, 10],
        },
        subheader: {
          fontSize: 14,
          bold: true,
        },
        totals: {
          fontSize: 11,
          alignment: "right",
        },
      },
      defaultStyle: {
        fontSize: 10,
      },
    };

    pdfMake.createPdf(docDefinition).open();
  } catch (error) {
    console.error("Error generating PDF:", error);
    addToast({
      title: "Error",
      description: "No se pudo generar el PDF de la cotización",
      color: "danger",
      timeout: 3000,
    });
  }
};
