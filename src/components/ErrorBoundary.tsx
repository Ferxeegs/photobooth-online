import { Component, type ErrorInfo, type ReactNode } from "react";
import { Button } from "@/components/ui/Button";

interface Props {
  children: ReactNode;
}

interface State {
  message: string;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { message: "" };

  static getDerivedStateFromError(error: Error): State {
    return { message: error.message || "Terjadi kesalahan." };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error("Snapie error:", error, info.componentStack);
  }

  render(): ReactNode {
    if (!this.state.message) return this.props.children;
    return (
      <div className="bg-app grid min-h-dvh place-items-center px-6">
        <div className="max-w-md rounded-3xl bg-white/80 p-6 text-center">
          <h1 className="font-display text-2xl">Ada yang kurang beres</h1>
          <p className="mt-2 text-sm text-ink-soft">{this.state.message}</p>
          <Button className="mt-4" onClick={() => window.location.reload()}>
            Muat ulang
          </Button>
        </div>
      </div>
    );
  }
}
