# Colabora-AI Frontend

Frontend da aplicação Colabora-AI - Sistema de gerenciamento de listas colaborativas para eventos.

## 🚀 Tecnologias

- **React 19** - Biblioteca UI
- **TypeScript** - Tipagem estática
- **Vite** - Build tool
- **Tailwind CSS** - Estilização
- **shadcn/ui** - Componentes UI
- **React Router Dom** - Roteamento
- **TanStack Query** - Gerenciamento de estado servidor
- **Zustand** - Gerenciamento de estado cliente
- **React Hook Form** - Formulários
- **Zod v4** - Validação de schemas
- **Axios** - Cliente HTTP
- **date-fns** - Manipulação de datas
- **Lucide React** - Ícones

## 📋 Pré-requisitos

- Node.js 18+
- pnpm 8+

## 🔧 Instalação

1. Clone o repositório
```bash
git clone <repo-url>
cd colabora-ai-frontend
```

2. Instale as dependências
```bash
pnpm install
```

3. Configure as variáveis de ambiente
```bash
cp .env.example .env
```

Edite o arquivo `.env` e configure a URL da API:
```env
VITE_API_BASE_URL=http://localhost:3000
```

## 🏃 Executando o projeto

### Modo de desenvolvimento
```bash
pnpm dev
```

A aplicação estará disponível em `http://localhost:5173`

### Build para produção
```bash
pnpm build
```

### Preview da build
```bash
pnpm preview
```

## 📁 Estrutura do Projeto

```
src/
├── components/
│   ├── ui/              # Componentes base do shadcn/ui
│   └── layout/          # Componentes de layout
├── pages/
│   ├── auth/            # Páginas de autenticação
│   ├── admin/           # Páginas do admin
│   └── public/          # Páginas públicas
├── services/            # Serviços de API
├── stores/              # Stores do Zustand
├── schemas/             # Schemas de validação Zod
├── types/               # Tipos TypeScript
├── lib/                 # Utilitários e configurações
└── hooks/               # Hooks customizados
```

## 🎨 Temas

A aplicação suporta tema claro e escuro baseado no tema azul do shadcn/ui.

## 📱 Funcionalidades

### Admin (Usuário Autenticado)
- ✅ Login e Registro
- ✅ Listagem de listas criadas
- ✅ Criar nova lista com itens
- ✅ Ver detalhes da lista
- ✅ Editar lista (modo continuar ou resetar)
- ✅ Compartilhar link público
- ✅ Acompanhar status dos itens

### Membro (Acesso Público)
- ✅ Visualizar lista via link público
- ✅ Registrar-se para um item com CPF e nome
- ✅ Ver itens disponíveis e reservados
- ✅ Validação de data do evento

## 🔒 Autenticação

O sistema utiliza JWT para autenticação. O token é armazenado no localStorage e automaticamente incluído nas requisições via interceptor do Axios.

## 🎯 Scripts Disponíveis

- `pnpm dev` - Inicia servidor de desenvolvimento
- `pnpm build` - Gera build de produção
- `pnpm preview` - Preview da build de produção
- `pnpm lint` - Executa linter

## 🌐 Rotas

### Públicas
- `/auth` - Login e Registro
- `/lists/:id/public` - Visualizar lista pública

### Protegidas (Requer autenticação)
- `/my-lists` - Minhas listas
- `/lists/create` - Criar nova lista
- `/lists/:id` - Detalhes da lista
- `/lists/:id/edit` - Editar lista

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT.
