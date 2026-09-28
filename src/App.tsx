import { CaptureScreen } from "@/screens/CaptureScreen";
import { CustomizeScreen } from "@/screens/CustomizeScreen";
import { ExportScreen } from "@/screens/ExportScreen";
import { FrameScreen } from "@/screens/FrameScreen";
import { LandingScreen } from "@/screens/LandingScreen";
import { LayoutScreen } from "@/screens/LayoutScreen";
import { PermissionScreen } from "@/screens/PermissionScreen";
import { PrivacyScreen } from "@/screens/PrivacyScreen";
import { ReviewScreen } from "@/screens/ReviewScreen";
import { useSession } from "@/store/session";

export default function App() {
  const step = useSession((s) => s.step);
  switch (step) {
    case "permission":
      return <PermissionScreen />;
    case "layout":
      return <LayoutScreen />;
    case "capture":
      return <CaptureScreen />;
    case "review":
      return <ReviewScreen />;
    case "frame":
      return <FrameScreen />;
    case "customize":
      return <CustomizeScreen />;
    case "export":
      return <ExportScreen />;
    case "privacy":
      return <PrivacyScreen />;
    default:
      return <LandingScreen />;
  }
}
