import { config } from "@gluestack-ui/config";
import { GluestackUIProvider } from "@gluestack-ui/themed";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <GluestackUIProvider config={config}>
      <Stack />
    </GluestackUIProvider>
  );
}
