import { CheckCircle } from "lucide-react";
import { AuthCard } from "./auth-card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface SuccessCardProps {
  title: string;
  message: string;
  actionLabel: string;
  actionLink: string;
}

export function SuccessCard({
  title,
  message,
  actionLabel,
  actionLink,
}: SuccessCardProps) {
  return (
    <AuthCard title={title}>
      <div className="flex flex-col items-center space-y-4">
        <CheckCircle className="h-12 w-12 text-green-500" />
        <p className="text-center text-muted-foreground">{message}</p>
        <Button variant="link" asChild className="mt-4">
          <Link to={actionLink}>{actionLabel}</Link>
        </Button>
      </div>
    </AuthCard>
  );
}
