### Some development guidelines

- To access the database, import {prisma} from "@/prisma/client". Do not create a new Prisma Client instance for every file.

- For protected components, use the checkAuthentication method from "@/services/AuthService".

- For critical operations (editing/deleting data, etc), use a Confirmation Dialog on the frontend. Check [this](hooks/useConfirmationDialog.tsx) page for usage instructions.