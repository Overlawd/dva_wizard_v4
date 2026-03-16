# DVA Wizard

A modern, interactive React application built with Vite, TypeScript, and Tailwind CSS. This project utilizes Shadcn UI components for a polished, professional interface.

## 🚀 Tech Stack

- **Framework:** React 18 with TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS v4
- **UI Components:** Shadcn UI (Radix UI primitives)
- **Icons:** Lucide React
- **Animations:** Framer Motion
- **Charts:** Recharts

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher)
- **npm** (comes with Node.js)

## 🛠️ Installation

1. **Install standard dependencies:**
   ```bash
   npm install
   ```

2. **Install Shadcn UI dependencies:**
   Since this project uses Shadcn UI components manually, you must install the required Radix UI primitives and utility libraries:
   ```bash
   npm install @radix-ui/react-slot @radix-ui/react-label @radix-ui/react-select @radix-ui/react-avatar class-variance-authority clsx tailwind-merge
   ```

3. **Verify UI Components:**
   Ensure the following files exist in your `src/components/ui/` directory. These are pre-configured for this project:
   - `button.tsx`
   - `card.tsx`
   - `input.tsx`
   - `textarea.tsx`
   - `label.tsx`
   - `avatar.tsx`
   - `select.tsx`

   *Note: If these files are missing, the application will fail to build.*

## 🏃 Running the Application

Start the development server:
