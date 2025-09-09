"use client";

import { FileText, Shield, Calendar, Activity, Bell } from "lucide-react";
import { Button } from "@/component/ui/button";
import { PatientHeader } from "@/component/patient/PatientHeader";
import { Card, CardContent } from "@/component/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/component/ui/tabs";
import { MedicalRecord } from "@/component/patient/MedicalRecord";
import { ConsentManagement } from "@/component/patient/ConsentManagement";
import { useState } from "react";

const Index = () => {
  const [patient] = useState({
    id: "P001",
    name: "Sarah Johnson",
    dateOfBirth: "March 15, 1985",
    mrn: "MR123456789",
    consentStatus: "active" as const,
    lastUpdated: "December 8, 2024",
  });

  const [medicalRecords] = useState([
    {
      id: "1",
      type: "visit" as const,
      title: "Annual Physical Examination",
      date: "December 5, 2024",
      provider: "Dr. Michael Chen",
      status: "completed" as const,
      details:
        "Routine annual physical examination with comprehensive health assessment.",
      results:
        "Patient in excellent health. All vital signs normal. Recommended continued exercise routine and annual follow-up.",
      priority: "normal" as const,
    },
    {
      id: "2",
      type: "lab" as const,
      title: "Complete Blood Count (CBC)",
      date: "December 3, 2024",
      provider: "Quest Diagnostics",
      status: "completed" as const,
      details:
        "Standard CBC panel including white blood cell count, red blood cell count, and platelet count.",
      results:
        "All values within normal ranges. Hemoglobin: 13.8 g/dL, White blood cells: 6,200/μL",
      priority: "normal" as const,
    },
    {
      id: "3",
      type: "medication" as const,
      title: "Prescription: Lisinopril 10mg",
      date: "November 28, 2024",
      provider: "Dr. Michael Chen",
      status: "completed" as const,
      details:
        "Prescribed for blood pressure management. Take once daily in the morning.",
      results:
        "Patient tolerating medication well. Blood pressure readings have improved.",
      priority: "normal" as const,
    },
    {
      id: "4",
      type: "vital" as const,
      title: "Blood Pressure Monitoring",
      date: "December 1, 2024",
      provider: "Nurse Patricia Williams",
      status: "completed" as const,
      details:
        "Routine blood pressure check as part of hypertension management.",
      results:
        "BP: 128/82 mmHg - within target range. Continue current medication regimen.",
      priority: "normal" as const,
    },
  ]);

  interface ConsentItem {
    id: string;
    type: string;
    description: string;
    status: "granted" | "denied" | "pending";
    dateGranted?: string;
    expiryDate?: string;
  }

  const [consents, setConsents] = useState<ConsentItem[]>([
    {
      id: "1",
      type: "Medical Records Access",
      description:
        "Allow healthcare providers to access complete medical history for treatment purposes.",
      status: "granted",
      dateGranted: "January 15, 2024",
      expiryDate: "January 15, 2025",
    },
    {
      id: "2",
      type: "Research Participation",
      description:
        "Consent to use anonymized medical data for clinical research studies.",
      status: "pending",
    },
    {
      id: "3",
      type: "Data Sharing with Specialists",
      description:
        "Allow sharing of relevant medical information with specialist healthcare providers.",
      status: "granted",
      dateGranted: "March 10, 2024",
      expiryDate: "March 10, 2025",
    },
    {
      id: "4",
      type: "Emergency Contact Authorization",
      description:
        "Permission to contact designated family members in case of medical emergency.",
      status: "granted",
      dateGranted: "January 15, 2024",
    },
  ]);

  const handleConsentUpdate = (id: string, status: "granted" | "denied") => {
    setConsents((prev) =>
      prev.map((consent) => {
        if (consent.id === id) {
          return {
            ...consent,
            status,
            dateGranted:
              status === "granted"
                ? new Date().toLocaleDateString()
                : consent.dateGranted,
            expiryDate: consent.expiryDate,
          };
        }
        return consent;
      })
    );
  };

  const stats = [
    {
      title: "Active Consents",
      value: consents.filter((c) => c.status === "granted").length,
      icon: Shield,
      color: "text-medical-success",
    },
    {
      title: "Medical Records",
      value: medicalRecords.length,
      icon: FileText,
      color: "text-primary",
    },
    {
      title: "Last Visit",
      value: "3 days ago",
      icon: Calendar,
      color: "text-medical-info",
    },
    {
      title: "Health Score",
      value: "Excellent",
      icon: Activity,
      color: "text-medical-success",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-primary-foreground" />
              </div>
              <h1 className="text-xl font-bold">MedicalRecord EMR</h1>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm">
                <Bell className="w-4 h-4 mr-2" />
                Notifications
              </Button>
              <Button size="sm">
                <Shield className="w-4 h-4 mr-2" />
                Privacy Settings
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PatientHeader patient={patient} />

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                  <stat.icon className={`w-8 h-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tabs */}
        <Tabs defaultValue="records" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="records">Medical Records</TabsTrigger>
            <TabsTrigger value="consent">Consent Management</TabsTrigger>
          </TabsList>

          <TabsContent value="records" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Medical Records</h2>
              <Button variant="outline">
                <FileText className="w-4 h-4 mr-2" />
                Export Records
              </Button>
            </div>
            <MedicalRecord records={medicalRecords} />
          </TabsContent>

          <TabsContent value="consent" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Consent Management</h2>
            </div>
            <ConsentManagement
              consents={consents}
              onUpdateConsent={handleConsentUpdate}
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
