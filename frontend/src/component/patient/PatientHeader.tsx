import { CheckCircle, Shield, Calendar, User } from "lucide-react";
import { Badge } from "../ui/badge";
import { Card } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface PatientHeaderProps {
  patient: {
    id: string;
    name: string;
    dateOfBirth: string;
    mrn: string;
    consentStatus: "active" | "pending" | "revoked";
    lastUpdated: string;
    avatar?: string;
  };
}

export const PatientHeader = ({ patient }: PatientHeaderProps) => {
  const getConsentBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-medical-success text-white">
            <CheckCircle className="w-3 h-3 mr-1" />
            Consent Active
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-medical-warning text-white">
            <Shield className="w-3 h-3 mr-1" />
            Consent Pending
          </Badge>
        );
      case "revoked":
        return (
          <Badge className="bg-medical-critical text-white">
            <Shield className="w-3 h-3 mr-1" />
            Consent Revoked
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="p-6 mb-6 shadow-lg border-l-4 border-l-primary">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={patient.avatar} alt={patient.name} />
            <AvatarFallback className="bg-primary text-primary-foreground text-lg">
              {patient.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>

          <div className="space-y-2">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                {patient.name}
              </h1>
              <div className="flex items-center space-x-4 text-muted-foreground text-sm">
                <div className="flex items-center">
                  <User className="w-4 h-4 mr-1" />
                  MRN: {patient.mrn}
                </div>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  DOB: {patient.dateOfBirth}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-right space-y-2">
          {getConsentBadge(patient.consentStatus)}
          <p className="text-xs text-muted-foreground">
            Last updated: {patient.lastUpdated}
          </p>
        </div>
      </div>
    </Card>
  );
};
