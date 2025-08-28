# Chat App (Frontend)

Frontend Expo + React Native com Expo Router e Gluestack UI.

Backend AdonisJS 6 + Socket.IO incluído. Para rodar:

1) Inicie o backend:
```bash
cd server
npm run dev
```

2) Em outro terminal, rode o frontend:
```bash
npm start
```

3) O frontend já está configurado para conectar em `http://localhost:3333` via `.env`.

Para usar com outra API, edite o `.env`:
```
EXPO_PUBLIC_SOCKET_URL=http://seu-servidor:3333
```
