import { useState } from "react";

import {
  ArrowLeft,
  Building2,
  Users,
  FileText,
  Shield,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@radix-ui/react-tabs";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";

// Mock data
const mockHospitals = [
  {
    id: "H001",
    name: "General Hospital",
    address: "123 Main St, City, State",
    email: "admin@generalhospital.com",
    phone: "+1-555-0101",
    status: "approved",
    registrationDate: "2024-01-01",
    staffCount: 25,
    recordsCount: 1250,
  },
  {
    id: "H002",
    name: "Family Clinic",
    address: "456 Oak Ave, City, State",
    email: "info@familyclinic.com",
    phone: "+1-555-0102",
    status: "pending",
    registrationDate: "2024-01-10",
    staffCount: 8,
    recordsCount: 0,
  },
  {
    id: "H003",
    name: "Radiology Center",
    address: "789 Pine St, City, State",
    email: "contact@radiologycenter.com",
    phone: "+1-555-0103",
    status: "approved",
    registrationDate: "2024-01-05",
    staffCount: 12,
    recordsCount: 340,
  },
];

export default function AdminPortal() {
  const navigate = useNavigate();
  const [hospitals, setHospitals] = useState(mockHospitals);
  const [newHospital, setNewHospital] = useState({
    name: "",
    address: "",
    email: "",
    phone: "",
    description: "",
  });

  const handleApproveHospital = (hospitalId: string) => {
    setHospitals((prev) =>
      prev.map((hospital) =>
        hospital.id === hospitalId
          ? { ...hospital, status: "approved" }
          : hospital
      )
    );
    toast.success("Hospital approved successfully");
  };

  const handleRejectHospital = (hospitalId: string) => {
    setHospitals((prev) =>
      prev.map((hospital) =>
        hospital.id === hospitalId
          ? { ...hospital, status: "rejected" }
          : hospital
      )
    );
    toast.success("Hospital registration rejected");
  };

  const handleRegisterHospital = () => {
    if (!newHospital.name || !newHospital.address || !newHospital.email) {
      toast.error("Please fill in all required fields");
      return;
    }

    const newId = `H${String(hospitals.length + 1).padStart(3, "0")}`;
    const hospital = {
      id: newId,
      ...newHospital,
      status: "pending" as const,
      registrationDate: new Date().toISOString().split("T")[0],
      staffCount: 0,
      recordsCount: 0,
    };

    setHospitals((prev) => [...prev, hospital]);
    setNewHospital({
      name: "",
      address: "",
      email: "",
      phone: "",
      description: "",
    });
    toast.success("Hospital registration submitted for approval");
  };

  const stats = [
    {
      title: "Total Hospitals",
      value: hospitals.length,
      icon: Building2,
      description: "Registered",
    },
    {
      title: "Approved",
      value: hospitals.filter((h) => h.status === "approved").length,
      icon: CheckCircle,
      description: "Active hospitals",
    },
    {
      title: "Pending Approval",
      value: hospitals.filter((h) => h.status === "pending").length,
      icon: Clock,
      description: "Awaiting review",
    },
    {
      title: "Total Staff",
      value: hospitals.reduce((sum, h) => sum + h.staffCount, 0),
      icon: Users,
      description: "Across all hospitals",
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return (
          <Badge className="bg-green-500/10 text-green-700 border-green-500/20">
            Approved
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-500/10 text-yellow-700 border-yellow-500/20">
            Pending
          </Badge>
        );
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

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
              System Administration
            </h1>
          </div>
          <Badge variant="outline" className="text-sm">
            <Shield className="w-4 h-4 mr-2" />
            Admin Portal
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
        <Tabs defaultValue="hospitals" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="hospitals">Hospital Management</TabsTrigger>
            <TabsTrigger value="register">Register Hospital</TabsTrigger>
            <TabsTrigger value="analytics">System Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="hospitals" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="w-5 h-5" />
                  Registered Hospitals
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {hospitals.map((hospital) => (
                    <Card key={hospital.id} className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center gap-3">
                            <h3 className="font-semibold text-lg">
                              {hospital.name}
                            </h3>
                            {getStatusBadge(hospital.status)}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {hospital.address}
                          </p>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-muted-foreground">
                                Email:
                              </span>{" "}
                              {hospital.email}
                            </div>
                            <div>
                              <span className="text-muted-foreground">
                                Phone:
                              </span>{" "}
                              {hospital.phone}
                            </div>
                            <div>
                              <span className="text-muted-foreground">
                                Staff:
                              </span>{" "}
                              {hospital.staffCount}
                            </div>
                            <div>
                              <span className="text-muted-foreground">
                                Records:
                              </span>{" "}
                              {hospital.recordsCount}
                            </div>
                            <div className="col-span-2">
                              <span className="text-muted-foreground">
                                Registered:
                              </span>{" "}
                              {hospital.registrationDate}
                            </div>
                          </div>
                        </div>

                        {hospital.status === "pending" && (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => handleApproveHospital(hospital.id)}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleRejectHospital(hospital.id)}
                            >
                              <XCircle className="w-4 h-4 mr-2" />
                              Reject
                            </Button>
                          </div>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="register" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="w-5 h-5" />
                  Register New Hospital
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="hospitalName">Hospital Name *</Label>
                    <Input
                      id="hospitalName"
                      placeholder="Enter hospital name..."
                      value={newHospital.name}
                      onChange={(e) =>
                        setNewHospital({ ...newHospital, name: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="admin@hospital.com"
                      value={newHospital.email}
                      onChange={(e) =>
                        setNewHospital({
                          ...newHospital,
                          email: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address *</Label>
                  <Input
                    id="address"
                    placeholder="Full hospital address..."
                    value={newHospital.address}
                    onChange={(e) =>
                      setNewHospital({
                        ...newHospital,
                        address: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    placeholder="+1-555-0123"
                    value={newHospital.phone}
                    onChange={(e) =>
                      setNewHospital({ ...newHospital, phone: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Brief description of the hospital..."
                    value={newHospital.description}
                    onChange={(e) =>
                      setNewHospital({
                        ...newHospital,
                        description: e.target.value,
                      })
                    }
                  />
                </div>

                <Button onClick={handleRegisterHospital} className="w-full">
                  Register Hospital
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    System Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                      <span>Total Medical Records</span>
                      <span className="font-semibold">
                        {hospitals.reduce((sum, h) => sum + h.recordsCount, 0)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                      <span>Active Hospitals</span>
                      <span className="font-semibold">
                        {
                          hospitals.filter((h) => h.status === "approved")
                            .length
                        }
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                      <span>Total Healthcare Staff</span>
                      <span className="font-semibold">
                        {hospitals.reduce((sum, h) => sum + h.staffCount, 0)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Security & Compliance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-green-50 border border-green-200 rounded-lg">
                      <span>HIPAA Compliance</span>
                      <Badge className="bg-green-100 text-green-800">
                        Active
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-green-50 border border-green-200 rounded-lg">
                      <span>Data Encryption</span>
                      <Badge className="bg-green-100 text-green-800">
                        Enabled
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <span>Audit Logs</span>
                      <Badge className="bg-blue-100 text-blue-800">
                        Monitoring
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
