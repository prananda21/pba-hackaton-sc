import { useState } from "react";

import {
  ArrowLeft,
  Search,
  Plus,
  FileText,
  Users,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/component/ui/tabs";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import Link from "next/link";

// Mock data
const mockPatients = [
  {
    id: "P001",
    name: "John Doe",
    mrn: "MRN-2024-001",
    dob: "1985-06-15",
    consentStatus: "granted",
    lastVisit: "2024-01-10",
  },
  {
    id: "P002",
    name: "Jane Smith",
    mrn: "MRN-2024-002",
    dob: "1990-03-22",
    consentStatus: "denied",
    lastVisit: "2024-01-08",
  },
  {
    id: "P003",
    name: "Bob Johnson",
    mrn: "MRN-2024-003",
    dob: "1978-11-30",
    consentStatus: "granted",
    lastVisit: "2024-01-05",
  },
];

const mockRecords = [
  {
    id: "R001",
    patientId: "P001",
    patientName: "John Doe",
    type: "Lab Result",
    date: "2024-01-10",
    description: "Complete Blood Count",
    status: "Complete",
  },
  {
    id: "R002",
    patientId: "P001",
    patientName: "John Doe",
    type: "Prescription",
    date: "2024-01-08",
    description: "Amoxicillin 500mg",
    status: "Active",
  },
];

export default function HospitalPortal() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<string>("");
  const [newRecord, setNewRecord] = useState({
    type: "",
    description: "",
    notes: "",
    diagnosis: "",
  });

  const filteredPatients = mockPatients.filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.mrn.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateRecord = () => {
    if (!selectedPatient || !newRecord.type || !newRecord.description) {
      toast.error("Please fill in all required fields");
      return;
    }

    const patient = mockPatients.find((p) => p.id === selectedPatient);
    if (patient?.consentStatus !== "granted") {
      toast.error("Patient has not granted consent for data access");
      return;
    }

    toast.success("Medical record created successfully");
    setNewRecord({ type: "", description: "", notes: "", diagnosis: "" });
    setSelectedPatient("");
  };

  const stats = [
    {
      title: "Total Patients",
      value: mockPatients.length,
      icon: Users,
      description: "In system",
    },
    {
      title: "Consented Patients",
      value: mockPatients.filter((p) => p.consentStatus === "granted").length,
      icon: CheckCircle,
      description: "With access granted",
    },
    {
      title: "Records Created",
      value: mockRecords.length,
      icon: FileText,
      description: "This month",
    },
    {
      title: "Pending Requests",
      value: 3,
      icon: XCircle,
      description: "Consent requests",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Role Selection
            </Link>
            <h1 className="text-3xl font-bold text-foreground">
              Hospital EMR System
            </h1>
          </div>
          <Badge variant="outline" className="text-sm">
            General Hospital - Staff Portal
          </Badge>
        </div>

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
        <Tabs defaultValue="patients" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="patients">Patient Search</TabsTrigger>
            <TabsTrigger value="create">Create EMR</TabsTrigger>
            <TabsTrigger value="records">Recent Records</TabsTrigger>
          </TabsList>

          <TabsContent value="patients" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="w-5 h-5" />
                  Patient Search
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-4">
                  <Input
                    placeholder="Search by name or MRN..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1"
                  />
                </div>

                <div className="space-y-3">
                  {filteredPatients.map((patient) => (
                    <Card key={patient.id} className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold">{patient.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            MRN: {patient.mrn} | DOB: {patient.dob}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Last Visit: {patient.lastVisit}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={
                              patient.consentStatus === "granted"
                                ? "default"
                                : "destructive"
                            }
                          >
                            {patient.consentStatus === "granted"
                              ? "Access Granted"
                              : "No Consent"}
                          </Badge>
                          <Button
                            size="sm"
                            disabled={patient.consentStatus !== "granted"}
                          >
                            View Records
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="create" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Create New Medical Record
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="patient">Select Patient</Label>
                    <Select
                      value={selectedPatient}
                      onValueChange={setSelectedPatient}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choose patient..." />
                      </SelectTrigger>
                      <SelectContent>
                        {mockPatients
                          .filter((p) => p.consentStatus === "granted")
                          .map((patient) => (
                            <SelectItem key={patient.id} value={patient.id}>
                              {patient.name} ({patient.mrn})
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="type">Record Type</Label>
                    <Select
                      value={newRecord.type}
                      onValueChange={(value) =>
                        setNewRecord({ ...newRecord, type: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="lab-result">Lab Result</SelectItem>
                        <SelectItem value="prescription">
                          Prescription
                        </SelectItem>
                        <SelectItem value="imaging">Imaging</SelectItem>
                        <SelectItem value="consultation">
                          Consultation
                        </SelectItem>
                        <SelectItem value="procedure">Procedure</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    placeholder="Brief description of the record..."
                    value={newRecord.description}
                    onChange={(e) =>
                      setNewRecord({
                        ...newRecord,
                        description: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="diagnosis">Diagnosis/Results</Label>
                  <Textarea
                    id="diagnosis"
                    placeholder="Detailed diagnosis or test results..."
                    value={newRecord.diagnosis}
                    onChange={(e) =>
                      setNewRecord({ ...newRecord, diagnosis: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Clinical Notes</Label>
                  <Textarea
                    id="notes"
                    placeholder="Additional clinical notes..."
                    value={newRecord.notes}
                    onChange={(e) =>
                      setNewRecord({ ...newRecord, notes: e.target.value })
                    }
                  />
                </div>

                <Button onClick={handleCreateRecord} className="w-full">
                  Create Medical Record
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="records" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Recent Medical Records
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockRecords.map((record) => (
                    <Card key={record.id} className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold">
                            {record.patientName}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {record.type} - {record.description}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Date: {record.date}
                          </p>
                        </div>
                        <Badge variant="outline">{record.status}</Badge>
                      </div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
