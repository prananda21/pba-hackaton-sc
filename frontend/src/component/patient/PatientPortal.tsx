import { useState } from "react";

import { ArrowLeft, Activity, Calendar, Users, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { ConsentManagement } from "./ConsentManagement";
import { MedicalRecord } from "./MedicalRecord";
import { PatientHeader } from "./PatientHeader";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

// Mock data
const mockPatient = {
  id: "P001",
  name: "John Doe",
  dateOfBirth: "1985-06-15",
  mrn: "MRN-2024-001",
  consentStatus: "active" as const,
  lastUpdated: "2024-01-15",
};

const mockMedicalRecords = [
  {
    id: "R001",
    type: "lab" as const,
    title: "Complete Blood Count",
    date: "2024-01-10",
    provider: "General Hospital",
    status: "completed" as const,
    details: "Complete Blood Count laboratory test",
    results: "All values within normal ranges",
    priority: "normal" as const,
  },
  {
    id: "R002",
    type: "medication" as const,
    title: "Amoxicillin 500mg",
    date: "2024-01-08",
    provider: "Family Clinic",
    status: "completed" as const,
    details: "Antibiotic prescription for infection treatment",
    results: "Patient responding well to treatment",
    priority: "normal" as const,
  },
  {
    id: "R003",
    type: "vital" as const,
    title: "Chest X-Ray",
    date: "2024-01-05",
    provider: "Radiology Center",
    status: "completed" as const,
    details: "Chest imaging for routine examination",
    results: "Clear lungs, no abnormalities detected",
    priority: "normal" as const,
  },
];

const mockConsents = [
  {
    id: "C001",
    type: "Medical Records Access",
    description:
      "Allow General Hospital to access medical records for treatment",
    status: "granted" as const,
    dateGranted: "2024-01-01",
    expiryDate: "2024-12-31",
  },
  {
    id: "C002",
    type: "Prescription Management",
    description: "Allow Family Clinic to manage prescriptions and medications",
    status: "granted" as const,
    dateGranted: "2024-01-01",
    expiryDate: "2024-06-30",
  },
  {
    id: "C003",
    type: "Imaging Access",
    description: "Allow Radiology Center to access and share imaging results",
    status: "denied" as const,
  },
];

export default function PatientPortal() {
  const navigate = useNavigate();
  const [consents, setConsents] = useState(mockConsents);

  const handleConsentUpdate = (id: string, status: "granted" | "denied") => {
    setConsents((prev) =>
      prev.map((consent) => {
        if (consent.id === id) {
          if (status === "granted") {
            return {
              ...consent,
              status: "granted" as const,
              dateGranted: new Date().toISOString().split("T")[0],
              expiryDate: "2024-12-31",
            };
          } else {
            return {
              ...consent,
              status: "denied" as const,
              dateGranted: undefined,
              expiryDate: undefined,
            };
          }
        }
        return consent;
      })
    );
  };

  const stats = [
    {
      title: "Medical Records",
      value: mockMedicalRecords.length,
      icon: FileText,
      description: "Total records",
    },
    {
      title: "Active Consents",
      value: consents.filter((c) => c.status === "granted").length,
      icon: Users,
      description: "Hospitals with access",
    },
    {
      title: "Last Visit",
      value: "Jan 10",
      icon: Calendar,
      description: "2024",
    },
    {
      title: "Health Status",
      value: "Good",
      icon: Activity,
      description: "Overall condition",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={() => navigate("/")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Role Selection
            </Button>
            <h1 className="text-3xl font-bold text-foreground">
              Patient Portal
            </h1>
          </div>
          <Badge variant="outline" className="text-sm">
            Logged in as Patient
          </Badge>
        </div>

        {/* Patient Info */}
        <PatientHeader patient={mockPatient} />

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">
                    {stat.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Main Content */}
        <Tabs defaultValue="records" className="space-y-6 flex space-x-6 gap-3">
          <TabsList className="grid w-full grid-cols-2 gap-2.5">
            <TabsTrigger value="records">Medical Records</TabsTrigger>
            <TabsTrigger value="consent">Consent Management</TabsTrigger>
          </TabsList>

          <TabsContent value="records" className="space-y-6">
            <MedicalRecord records={mockMedicalRecords} />
          </TabsContent>

          <TabsContent value="consent" className="space-y-6">
            <ConsentManagement
              consents={consents}
              onUpdateConsent={handleConsentUpdate}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
