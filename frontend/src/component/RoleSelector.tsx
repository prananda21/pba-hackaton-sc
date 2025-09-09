"use client";

import { User, Building2, Shield } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import Link from "next/link";

export const RoleSelector = () => {
  const roles = [
    {
      id: "patient",
      title: "Patient Portal",
      description:
        "View and manage your medical records and consent preferences",
      icon: User,
      path: "/patient",
      color: "bg-blue-500/10 border-blue-500/20",
    },
    {
      id: "hospital",
      title: "Hospital Staff",
      description: "Create and manage electronic medical records for patients",
      icon: Building2,
      path: "/hospital",
      color: "bg-green-500/10 border-green-500/20",
    },
    {
      id: "admin",
      title: "System Admin",
      description: "Register hospitals and manage system administration",
      icon: Shield,
      path: "/admin",
      color: "bg-purple-500/10 border-purple-500/20",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Medical Records System
          </h1>
          <p className="text-xl text-muted-foreground">
            Select your role to access the appropriate interface
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {roles.map((role) => {
            const Icon = role.icon;
            return (
              <Card
                key={role.id}
                className={`cursor-pointer transition-all hover:shadow-lg ${role.color}`}
              >
                <CardHeader className="text-center">
                  <div className="mx-auto w-16 h-16 rounded-full bg-background flex items-center justify-center mb-4">
                    <Icon className="w-8 h-8 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{role.title}</CardTitle>
                  <CardDescription className="text-sm">
                    {role.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href={role.path} className="w-full">
                    Access Portal
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};
