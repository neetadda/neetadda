import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted">
      <div className="text-center max-w-md px-4">
        <h1 className="mb-2 text-3xl font-bold">NEET Tracker: Page not found</h1>
        <p className="mb-4 text-sm text-muted-foreground">
          This NEET preparation page link is invalid—go back to your NEET 2026 tracker to continue daily study, coaching, and revision.
        </p>
        <Link to="/" className="text-primary underline hover:text-primary/90">
          Return to NEET Dashboard
        </Link>
      </div>
    </main>
  );
};

export default NotFound;
