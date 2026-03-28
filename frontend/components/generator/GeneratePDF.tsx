import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import * as FileSystemLegacy from "expo-file-system/legacy";
import { Paths } from "expo-file-system";
import { template as template1 } from "@/components/TemplateDesign/template1";
import { template as template2 } from "@/components/TemplateDesign/template2";
import { resolvePdfLayoutFromTemplateId } from "@/config/templateConfig";
import { fillTemplate } from "../appcomp/FillTemplate";
import { fillTemplate2 } from "../appcomp/FillTemplate2";

let pdfCounter = 0;

export const generatePDF = async (formData: any) => {
  try {
    let safeName = `${formData.personal_info.name}Resume`;
    if (pdfCounter > 0) safeName += `(${pdfCounter})`;
    pdfCounter++;
    safeName = safeName.replace(/[^a-zA-Z0-9_.-]/g, "_");

    const pdfLayout = resolvePdfLayoutFromTemplateId(formData.selected_template);

    const html =
      pdfLayout === "modern"
        ? fillTemplate2(template2, formData)
        : fillTemplate(template1, formData);
    const { uri } = await Print.printToFileAsync({ html });
    console.log("PDF generated at:", uri);

    console.log("SafeNAme = " , safeName)
    console.log("Paths.document:", Paths.document);

    // Build new absolute file URI correctly
    const newUri = `${Paths.document.uri}${safeName}.pdf`;
    console.log("New URI = ",newUri)
    // Move file
    await FileSystemLegacy.moveAsync({
      from: uri,
      to: newUri,
    });

    console.log("Moved PDF to:", newUri);

    // Share
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(newUri);
    } 
    
  } catch (error) {
    console.error("Error generating PDF:", error);
  }
};
