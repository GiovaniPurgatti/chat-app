import {
  Box,
  Button,
  HStack,
  Text,
  Textarea,
  TextareaInput,
  VStack,
} from "@gluestack-ui/themed";
import { Audio } from "expo-av";
import * as ImagePicker from "expo-image-picker";
import { Stack } from "expo-router";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { FlatList, Image, Pressable, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { io, Socket } from "socket.io-client";

type ChatMessage =
  | { type: "text"; content: string }
  | { type: "image"; uri: string };

export default function ChatScreen() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [text, setText] = useState("");
  const [showImage, setShowImage] = useState(false);

  const socketRef = useRef<Socket | null>(null);

  const serverUrl = useMemo(() => {
    const url = process.env.EXPO_PUBLIC_SOCKET_URL || "http://localhost:3333";
    return url;
  }, []);

  const handlePickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      socketRef.current?.emit("message", { type: "image", uri });
    }
  };

  const playNotificationSound = async () => {
    const { sound } = await Audio.Sound.createAsync(
      require("../assets/notification.mp3") // ajuste o caminho
    );
    await sound.playAsync();
  };

  const playBurroSound = async () => {
    const { sound } = await Audio.Sound.createAsync(
      require("../assets/rogers.mp3") // ajuste o caminho
    );
    await sound.playAsync();
  };

  const playBarrilSound = async () => {
    const { sound } = await Audio.Sound.createAsync(
      require("../assets/barril.mp3") // ajuste o caminho
    );
    await sound.playAsync();
  };

  const playRisadaSound = async () => {
    const { sound } = await Audio.Sound.createAsync(
      require("../assets/risada.mp3") // ajuste o caminho
    );
    await sound.playAsync();
    setShowImage(true); // ativa a exibição da imagem
    setTimeout(() => {
      setShowImage(false);
    }, 3000);
  };

  useEffect(() => {
    const socket = io(serverUrl, { transports: ["websocket"] });
    socketRef.current = socket;

    socket.on("connect", () => {});

    // Receber mensagens
    socket.on("message", (message: ChatMessage) => {
      setMessages((prev) => [...prev, message]);
      playNotificationSound();
    });

    // Receber comando para limpar mensagens
    socket.on("clear_messages", () => {
      setMessages([]);
      playBurroSound();
    });

    socket.on("barril", () => {
      playBarrilSound();
    });

    socket.on("risada", () => {
      playRisadaSound();
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [serverUrl]);

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    socketRef.current?.emit("message", trimmed);
    setText("");
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Stack.Screen
        options={{
          // 🔥 aqui você substitui o título por um componente clicável
          headerTitle: () => (
            <Pressable onPress={() => socketRef.current?.emit("risada")}>
              <Text style={{ fontSize: 18, fontWeight: "bold" }}>Chat</Text>
            </Pressable>
          ),
          headerRight: () => (
            <HStack space="sm" mr={12}>
              <Button
                size="sm"
                bg="$red600"
                onPress={() => socketRef.current?.emit("clear_messages")}
              >
                <Text color="$white">☠️</Text>
              </Button>
              <Button
                size="sm"
                bg="$green600"
                onPress={() => socketRef.current?.emit("barril")}
              >
                <Text color="$white">🛢️</Text>
              </Button>
            </HStack>
          ),
        }}
      />
      <VStack flex={1} px={12} py={12} space="md">
        <Box flex={1}>
          <FlatList
            data={messages}
            keyExtractor={(item, index) => `${index}`}
            renderItem={({ item }) => (
              <Box
                mb={8}
                p={12}
                bg="$backgroundMuted"
                borderRadius="$md"
                borderWidth={1}
                borderColor="$borderMuted"
              >
                {typeof item === "string" ? (
                  <Text flexShrink={1} flexWrap="wrap">
                    {item}
                  </Text>
                ) : item.type === "image" ? (
                  <Image
                    source={{ uri: item.uri }}
                    style={{ width: 200, height: 200, borderRadius: 8 }}
                  />
                ) : null}
              </Box>
            )}
          />
        </Box>
        {showImage && (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <Image
              source={require("../assets/images/maxresdefault.jpg")}
              style={{ width: 200, height: 200 }}
            />
          </View>
        )}
        <HStack space="sm" alignItems="center">
          <Textarea flex={1} h={100}>
            <TextareaInput
              value={text}
              onChangeText={setText}
              placeholder="Digite sua mensagem"
              multiline
              onSubmitEditing={handleSend}
            />
          </Textarea>
          <Button onPress={handlePickImage} size="md" variant="outline">
            <Text>📎</Text>
          </Button>
          <Button onPress={handleSend} size="md">
            <Text color="$textContrast">Enviar</Text>
          </Button>
        </HStack>
      </VStack>
    </SafeAreaView>
  );
}
