import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Calendar, FileText, Pill, Activity, Heart } from "lucide-react";
import { Separator } from "../ui/separator";

interface MedicalRecordEntry {
  id: string;
  type: "visit" | "medication" | "lab" | "vital";
  title: string;
  date: string;
  provider?: string;
  status: "completed" | "pending" | "cancelled";
  details: string;
  results?: string;
  priority?: "normal" | "high" | "critical";
}

interface MedicalRecordProps {
  records: MedicalRecordEntry[];
}

export const MedicalRecord = ({ records }: MedicalRecordProps) => {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case "visit":
        return <Calendar className="w-4 h-4" />;
      case "medication":
        return <Pill className="w-4 h-4" />;
      case "lab":
        return <FileText className="w-4 h-4" />;
      case "vital":
        return <Activity className="w-4 h-4" />;
      default:
        return <Heart className="w-4 h-4" />;
    }
  };

  const getStatusBadge = (status: string, priority?: string) => {
    if (priority === "critical") {
      return <Badge className="bg-medical-critical text-white">Critical</Badge>;
    }
    if (priority === "high") {
      return (
        <Badge className="bg-medical-warning text-white">High Priority</Badge>
      );
    }

    switch (status) {
      case "completed":
        return (
          <Badge className="bg-medical-success text-white">Completed</Badge>
        );
      case "pending":
        return <Badge className="bg-medical-warning text-white">Pending</Badge>;
      case "cancelled":
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "visit":
        return "border-l-primary";
      case "medication":
        return "border-l-medical-info";
      case "lab":
        return "border-l-medical-warning";
      case "vital":
        return "border-l-medical-success";
      default:
        return "border-l-muted";
    }
  };

  return (
    <div className="space-y-4">
      {records.map((record) => (
        <Card
          key={record.id}
          className={`border-l-4 ${getTypeColor(
            record.type
          )} shadow-sm hover:shadow-md transition-shadow`}
        >
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-accent rounded-lg">
                  {getTypeIcon(record.type)}
                </div>
                <div>
                  <CardTitle className="text-lg">{record.title}</CardTitle>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <span>{record.date}</span>
                    {record.provider && (
                      <>
                        <span>•</span>
                        <span>{record.provider}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              {getStatusBadge(record.status, record.priority)}
            </div>
          </CardHeader>

          <CardContent className="pt-0">
            <div className="space-y-3">
              <p className="text-sm text-foreground">{record.details}</p>

              {record.results && (
                <>
                  <Separator />
                  <div>
                    <h4 className="text-sm font-medium mb-2">Results/Notes:</h4>
                    <p className="text-sm text-muted-foreground bg-accent p-3 rounded-lg">
                      {record.results}
                    </p>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
