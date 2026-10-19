import fs from "node:fs";
import path from "node:path";
import PDFDocument from "pdfkit";
import { formatZhDate, periodLabelZh, type CertificatePeriodKind } from "@/lib/agent-certificate-dates";

const SRC_W = 1054;
const SRC_H = 1492;
const PAGE_W = 595.28;
const PAGE_H = 841.89;
const SX = PAGE_W / SRC_W;
const SY = PAGE_H / SRC_H;

export type AgentCertificatePdfInput = {
  companyName: string;
  officialZh: string;
  periodKind: CertificatePeriodKind;
  startsAt: Date;
  endsAt: Date;
  code: string;
};

function asset(...parts: string[]) {
  return path.join(process.cwd(), "public", "brand", "certificate", ...parts);
}

function srcX(value: number) {
  return value * SX;
}

function srcY(value: number) {
  return value * SY;
}

function srcFont(value: number) {
  return value * SY;
}

export function generateAgentCertificatePdf(input: AgentCertificatePdfInput) {
  return new Promise<Buffer>((resolve, reject) => {
    const doc = new PDFDocument({
      size: "A4",
      margin: 0,
      info: {
        Title: `Sicon Art authorization ${input.code}`,
        Author: "Sicon Art"
      }
    });
    const chunks: Buffer[] = [];
    doc.on("data", (chunk: Buffer) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    const regular = asset("fonts", "ChironSungHK-Regular.ttf");
    const bold = asset("fonts", "ChironSungHK-Bold.ttf");
    if (!fs.existsSync(regular) || !fs.existsSync(bold)) {
      reject(new Error("Certificate fonts are missing"));
      return;
    }
    doc.registerFont("CertRegular", regular);
    doc.registerFont("CertBold", bold);

    doc.image(asset("background.png"), 0, 0, { width: PAGE_W, height: PAGE_H });

    const logoWidth = srcX(520);
    doc.image(asset("logo.png"), (PAGE_W - logoWidth) / 2, srcY(168), { width: logoWidth });

    const bodyWidth = PAGE_W - srcX(160);
    const bodyLeft = srcX(80);
    const bodyLines = [
      `兹授权 ${input.companyName} 为`,
      `SiconArt 品牌产品在${input.officialZh}`,
      "的区域总代理，负责该地区品牌产品的推广及销售。"
    ];
    doc.fillColor("#1c1c1c").font("CertBold").fontSize(srcFont(32));
    let bodyY = srcY(652);
    for (const line of bodyLines) {
      doc.text(line, bodyLeft, bodyY, {
        width: bodyWidth,
        align: "center",
        lineGap: 2
      });
      bodyY = doc.y + srcY(10);
    }

    const metaX = srcX(148);
    let metaY = srcY(968);
    const metaLines = [
      "授权期限满需提前一个月进行续约",
      `授权有效期：${formatZhDate(input.startsAt)}至${formatZhDate(input.endsAt)}`,
      `授权期限：${periodLabelZh(input.periodKind)}（${input.officialZh}）`
    ];
    doc.font("CertRegular").fontSize(srcFont(25));
    for (const line of metaLines) {
      doc.text(line, metaX, metaY, { width: srcX(620), align: "left" });
      metaY += srcY(44);
    }

    const sealSize = srcX(220);
    doc.image(asset("seal.png"), srcX(705), srcY(1112), {
      width: sealSize,
      height: sealSize
    });

    doc.font("CertRegular").fontSize(srcFont(20)).fillColor("#1c1c1c");
    doc.text("授权单位（盖章）：SiconArt 艺术用品有限公司", srcX(80), srcY(1326), {
      width: srcX(860),
      align: "right"
    });

    // PDFKit y is the baseline; 1466 sits in the cream under the inner gold frame.
    doc.font("CertRegular").fontSize(8).fillColor("#8a6d56");
    doc.text(input.code, 0, srcY(1466), {
      width: PAGE_W,
      align: "center"
    });

    doc.end();
  });
}

export function certificatePdfFilename(companyName: string, code: string) {
  const safe = companyName.replace(/[^\w\u4e00-\u9fff-]+/g, "-").replace(/-+/g, "-").slice(0, 40);
  return `SiconArt-Authorization-${safe || "agent"}-${code}.pdf`;
}
