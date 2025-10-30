# 🏥 CarePulse - Modern Healthcare Onboarding Experience

![CarePulse Banner](/public/carepulse.png )

**A sleek, modern onboarding experience for healthcare management with OTP verification**

[![Next.js](https://img.shields.io/badge/Next.js-15.0-black?style=for-the-badge&logo=next.js )](https://nextjs.org/ )
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript )](https://www.typescriptlang.org/ )
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css )](https://tailwindcss.com/ )
[![Shadcn/ui](https://img.shields.io/badge/shadcn/ui-1.0-000000?style=for-the-badge )](https://ui.shadcn.com/ )

## ✨ Features

### 🎨 Modern Design

- **Dark Theme Interface** - Easy on the eyes healthcare-focused design
- **Glass Morphism Effects** - Beautiful blurred backgrounds and overlays
- **Smooth Animations** - Elegant transitions and hover effects
- **Responsive Design** - Flawless experience across all devices

### 🔐 Secure Onboarding

- **Multi-step Verification** - Phone number collection with OTP verification
- **Real-time Validation** - Instant form validation with beautiful error states
- **OTP Timer** - 2-minute countdown with automatic expiry handling
- **Resend Capability** - Secure OTP resend functionality

### 🚀 User Experience

- **Auto-focus Navigation** - Smart input field progression
- **Paste Support** - Bulk OTP entry for convenience
- **Accessibility First** - Full keyboard navigation and screen reader support
- **Loading States** - Beautiful loading indicators for all actions

## 🎥 Preview

<div align="center">

### Onboarding Screen

![Onboarding Preview](./public/assets/onboarding.png)

### OTP Verification

![OTP Modal](/public/assets/otp.png)

</div>

## 🛠 Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn/ui
- **Icons**: Lucide React
- **Notifications**: Sonner Toast
- **Development**: ESLint, Prettier

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm, yarn, or pnpm

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/youngberry1/carepulse.git
   cd carepulse
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Run the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```plaintext
carepulse/
├── app/
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   └── sonner.tsx
│   └── otp-modal.tsx
├── public/
│   ├── Logomark.svg
│   └── Illustration.svg
└── package.json
```

## 🎯 Key Components

### Onboarding Page (`app/page.tsx`)

- Beautiful split-screen layout
- Responsive form with icons
- Real-time validation
- Smooth state management

### OTP Modal (`components/otp-modal.tsx`)

- 6-digit input with auto-focus
- Countdown timer with expiry handling
- Resend functionality
- Beautiful animations and focus states

## 🎨 Design System

### Colors

- **Primary**: Green gradient (`#10B981` to `#059669`)
- **Background**: Dark theme (`#0D0F12`)
- **Surface**: Card backgrounds (`#11161c`)
- **Text**: White with gray variants

### Typography

- **Headings**: Bold, large typography with gradient text
- **Body**: Clean, readable text with proper hierarchy

### Interactions

- **Hover Effects**: Smooth scaling and shadow transitions
- **Focus States**: Green borders with glow effects
- **Animations**: 300ms transitions throughout

## 🔧 Customization

### Adding New Form Fields

```tsx
// Example: Adding a date of birth field
<Input
  type="date"
  name="dob"
  placeholder="Select your date of birth"
  // ... other props
/>
```

### Modifying OTP Timer

```tsx
// In components/otp-modal.tsx
const OTP_TIMER_SECONDS = 180; // Change to 3 minutes
```

### Styling Customization

All styling uses Tailwind CSS classes. Modify colors, spacing, and effects in the component files.

## 🤝 Contributing

We welcome contributions! Please feel free to submit issues, fork the repository, and create pull requests.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Shadcn/ui](https://ui.shadcn.com/ ) for the beautiful component library
- [Lucide](https://lucide.dev/ ) for the elegant icons
- [Tailwind CSS](https://tailwindcss.com/ ) for the utility-first CSS framework
- [Next.js](https://nextjs.org/ ) for the amazing React framework

---

<div align="center">

**Built with ❤️ for better healthcare experiences**

[Report Bug](https://github.com/youngberry1/carepulse/issues ) · [Request Feature](https://github.com/youngberry1/carepulse/issues )

</div>
