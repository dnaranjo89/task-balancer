import { Link } from "react-router";
import { Button } from "./Button";

interface ErrorStateProps {
  title: string;
  message: string;
  buttonText?: string;
  buttonLink?: string;
  gradient?: string;
}

export function ErrorState({
  title,
  message,
  buttonText,
  buttonLink,
  gradient = "from-red-50 to-red-100",
}: ErrorStateProps) {
  return (
    <div
      className={`min-h-screen bg-gradient-to-br ${gradient} flex items-center justify-center`}
    >
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">{title}</h1>
        <p className="text-xl text-gray-600 mb-8">{message}</p>
        {buttonText && buttonLink && (
          <Link to={buttonLink}>
            <Button onClick={() => {}} variant="primary">
              {buttonText}
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}
