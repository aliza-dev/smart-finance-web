"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Loader2, AlertTriangle, CheckCircle2, TrendingUp, AlertCircle, Download } from "lucide-react";
import { generateAIReport } from "@/app/actions/report";
import { toast } from "sonner";

import jsPDF from "jspdf";

interface AIReport {
  quickSummary: string;
  topSpendingCategory: string;
  criticalAlerts: string[];
  actionPlan: string[];
}

export function GenerateReportCard({ month }: { month: string }) {
  const [report, setReport] = useState<AIReport | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    const { report: newReport, error } = await generateAIReport(month);
    setLoading(false);

    if (error) {
      toast.error(error);
    } else if (newReport) {
      setReport(newReport as AIReport);
      toast.success("Report generated successfully!");
    }
  };

  const downloadPDF = () => {
    if (!report) {
      toast.error("No report available to download.");
      return;
    }

    try {
      toast.info("Generating PDF...", { id: "pdf-toast" });
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      
      // Premium Document Header
      doc.setFillColor(15, 23, 42); // slate-900
      doc.rect(0, 0, pageWidth, 40, "F");
      
      doc.setFontSize(24);
      doc.setTextColor(255, 255, 255); // white
      doc.setFont("helvetica", "bold");
      doc.text("AI Financial Insights", 14, 22);
      
      doc.setFontSize(10);
      doc.setTextColor(148, 163, 184); // slate-400
      doc.setFont("helvetica", "normal");
      doc.text(`Report for: ${month}  |  Generated on: ${new Date().toLocaleDateString()}`, 14, 32);
      
      let currentY = 55;
      
      // Quick Summary (Italicized and Indented)
      doc.setFontSize(13);
      doc.setTextColor(51, 65, 85); // slate-700
      doc.setFont("helvetica", "italic");
      const splitSummary = doc.splitTextToSize(`"${report.quickSummary}"`, pageWidth - 40);
      doc.text(splitSummary, 20, currentY);
      
      currentY += (splitSummary.length * 7) + 15;

      // Helper function to draw card-like sections
      const drawSection = (
        title: string, 
        titleColor: [number, number, number], 
        contentLines: string[], 
        contentColor: [number, number, number],
        bgColor: [number, number, number]
      ) => {
        const padding = 8;
        const titleHeight = 10;
        const lineSpacing = 6;
        
        const contentHeight = contentLines.length * lineSpacing;
        const boxHeight = padding * 2 + titleHeight + contentHeight;
        
        // Page break if needed
        if (currentY + boxHeight > pageHeight - 20) {
           doc.addPage();
           currentY = 20;
        }
        
        // Draw card background
        doc.setFillColor(...bgColor);
        doc.rect(14, currentY, pageWidth - 28, boxHeight, "F");
        
        // Draw title
        doc.setFont("helvetica", "bold");
        doc.setFontSize(14);
        doc.setTextColor(...titleColor);
        doc.text(title, 20, currentY + padding + 5);
        
        // Draw content
        doc.setFont("helvetica", "normal");
        doc.setFontSize(11);
        doc.setTextColor(...contentColor);
        
        let textY = currentY + padding + titleHeight + 4;
        contentLines.forEach((line) => {
           doc.text(line, 20, textY);
           textY += lineSpacing;
        });
        
        currentY += boxHeight + 8;
      };

      // 1. Top Spending Category
      drawSection(
        "Top Spending Category",
        [15, 23, 42], // slate-900
        [report.topSpendingCategory],
        [51, 65, 85], // slate-700
        [248, 250, 252] // slate-50
      );
      
      // 2. Critical Alerts
      const alertsLines: string[] = [];
      if (report.criticalAlerts.length > 0) {
        report.criticalAlerts.forEach(alert => {
           const split = doc.splitTextToSize(`• ${alert}`, pageWidth - 40);
           alertsLines.push(...split);
        });
      } else {
        alertsLines.push("No critical alerts this month.");
      }
      
      drawSection(
        "Critical Alerts",
        [225, 29, 72], // rose-600
        alertsLines,
        [82, 82, 91], // zinc-600
        [255, 241, 242] // rose-50
      );

      // 3. Action Plan
      const actionPlanLines: string[] = [];
      if (report.actionPlan.length > 0) {
        report.actionPlan.forEach((plan, idx) => {
           const split = doc.splitTextToSize(`${idx + 1}. ${plan}`, pageWidth - 40);
           actionPlanLines.push(...split);
           actionPlanLines.push(""); // Add extra blank line for premium spacing
        });
        // Remove trailing empty line
        if (actionPlanLines[actionPlanLines.length - 1] === "") {
          actionPlanLines.pop();
        }
      } else {
        actionPlanLines.push("No action plan provided.");
      }
      
      drawSection(
        "Action Plan",
        [16, 185, 129], // emerald-500
        actionPlanLines,
        [82, 82, 91], // zinc-600
        [236, 253, 245] // emerald-50
      );
      
      // Footer
      const pageCount = (doc.internal as unknown as { getNumberOfPages: () => number }).getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(9);
        doc.setTextColor(148, 163, 184); // slate-400
        doc.text(`Page ${i} of ${pageCount}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
      }

      doc.save(`AI_Financial_Report_${month}.pdf`);
      toast.success("PDF Downloaded Successfully", { id: "pdf-toast" });
    } catch (error) {
      console.error("PDF Generation Error:", error);
      toast.error(`Failed to generate PDF: ${error instanceof Error ? error.message : String(error)}`, { id: "pdf-toast" });
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          AI Financial Advisor
        </CardTitle>
        <CardDescription>
          Get personalized financial advice based on your current month&apos;s transactions and budgets.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!report ? (
          <div className="flex flex-col items-center justify-center p-8 border border-dashed rounded-lg bg-muted/50 space-y-4">
            <p className="text-muted-foreground text-center max-w-md text-sm">
              Our Gemini AI will analyze your income, expenses, and budget limits to provide actionable insights for your financial health.
            </p>
            <Button onClick={handleGenerate} disabled={loading} size="lg">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing Data...
                </>
              ) : (
                "Generate My Report"
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-6" id="ai-report-content">
            <div className="text-lg font-medium text-center italic text-muted-foreground mb-6">
              &quot;{report.quickSummary}&quot;
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="bg-primary/5 border-primary/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-primary" />
                    Top Spending Category
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-primary">{report.topSpendingCategory}</p>
                </CardContent>
              </Card>
              
              <Card className="bg-destructive/5 border-destructive/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2 text-destructive">
                    <AlertTriangle className="h-4 w-4" />
                    Critical Alerts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {report.criticalAlerts.length > 0 ? (
                    <ul className="space-y-2">
                      {report.criticalAlerts.map((alert, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-destructive/90">
                          <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                          <span>{alert}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-muted-foreground">No critical alerts for this month.</p>
                  )}
                </CardContent>
              </Card>
              
              <Card className="md:col-span-2">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    Action Plan
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {report.actionPlan.length > 0 ? (
                    <ul className="space-y-3">
                      {report.actionPlan.map((step, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                            {idx + 1}
                          </div>
                          <p className="text-sm leading-relaxed mt-0.5">{step}</p>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-muted-foreground">No action steps provided.</p>
                  )}
                </CardContent>
              </Card>
            </div>
            
            <div className="flex justify-end gap-4 pt-6 border-t mt-6">
              <Button onClick={downloadPDF} variant="outline" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Download PDF
              </Button>
              <Button onClick={handleGenerate} disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Regenerating...
                  </>
                ) : (
                  "Regenerate Report"
                )}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
