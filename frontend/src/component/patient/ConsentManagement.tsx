import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { CheckCircle, Shield, FileText, Clock, Download } from "lucide-react";
import { Button } from "../ui/button";

interface ConsentItem {
  id: string;
  type: string;
  description: string;
  status: "granted" | "denied" | "pending";
  dateGranted?: string;
  expiryDate?: string;
}

interface ConsentManagementProps {
  consents: ConsentItem[];
  onUpdateConsent: (id: string, status: "granted" | "denied") => void;
}

export const ConsentManagement = ({
  consents,
  onUpdateConsent,
}: ConsentManagementProps) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "granted":
        return (
          <Badge className="bg-medical-success text-white">
            <CheckCircle className="w-3 h-3 mr-1" />
            Granted
          </Badge>
        );
      case "denied":
        return (
          <Badge className="bg-medical-critical text-white">
            <Shield className="w-3 h-3 mr-1" />
            Denied
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-medical-warning text-white">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <Shield className="w-5 h-5 mr-2 text-primary" />
            Consent Management
          </CardTitle>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Download Consent Forms
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {consents.map((consent, index) => (
          <div key={consent.id}>
            <div className="flex items-center justify-between p-4 bg-accent/50 rounded-lg">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{consent.type}</h4>
                  {getStatusBadge(consent.status)}
                </div>

                <p className="text-sm text-muted-foreground mb-3">
                  {consent.description}
                </p>

                <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                  {consent.dateGranted && (
                    <span>Granted: {consent.dateGranted}</span>
                  )}
                  {consent.expiryDate && (
                    <span>Expires: {consent.expiryDate}</span>
                  )}
                </div>
              </div>

              {consent.status === "pending" && (
                <div className="flex space-x-2 ml-4">
                  <Button
                    size="sm"
                    onClick={() => onUpdateConsent(consent.id, "granted")}
                    className="bg-medical-success hover:bg-medical-success/90"
                  >
                    Grant
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => onUpdateConsent(consent.id, "denied")}
                  >
                    Deny
                  </Button>
                </div>
              )}
            </div>

            {index < consents.length - 1 && <Separator className="my-4" />}
          </div>
        ))}

        <div className="mt-6 p-4 bg-primary/5 rounded-lg border border-primary/20">
          <div className="flex items-start space-x-3">
            <FileText className="w-5 h-5 text-primary mt-0.5" />
            <div>
              <h4 className="font-medium text-primary mb-1">
                HIPAA Compliance
              </h4>
              <p className="text-sm text-muted-foreground">
                All consent forms are HIPAA compliant and securely stored.
                Patient data access is logged and monitored for security
                purposes.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
