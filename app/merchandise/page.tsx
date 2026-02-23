"use client";

import ProductView from "@/components/Merchandise/ProductView";
import Price from "@/components/Merchandise/Price";
import Contact from "@/components/Merchandise/Contact";
import Balls from "@/components/Balls";
import Image from "next/image";
import { Clickable } from "@/components/Clickable";
import { useState } from "react";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { usePayment } from "@/hooks/usePayment";

// export default function MerchandisePage() {
//   return (
//     <main className="full-bleed min-h-screen bg-[url('/bg.jpg')] bg-cover bg-center relative text-white">
//       <Balls/>
//       <div className="absolute inset-0 bg-black/70" />

//       <div
//         className="
//           relative z-10
//           min-h-screen
//           grid
//           grid-cols-[1fr_1.2fr]
//           gap-24
//           px-24 py-20
//           items-center
//         "
//       >
//         <div className="flex flex-col items-center gap-10">
//           <ProductView />

//           {/* <div className="flex gap-4">
//             <div className="w-16 h-16 border border-white/40" />
//             <div className="w-16 h-16 border border-white/40" />
//             <div className="w-16 h-16 border border-white/40" />
//           </div> */}

//           <div className="flex gap-4">
//             {[1, 2, 3].map((i) => (
//               <div
//                 key={i}
//                 className="
//                   w-20 h-20
//                   border border-white/40
//                   flex items-center justify-center
//                   bg-white/5
//                 "
//               >
//                   <Image
//                     src="/shirt2.png"
//                     alt="Merchandise preview"
//                     width={52}
//                     height={52}
//                     className="object-contain"
//                   />
//                 </div>
//               ))}
//             </div>
//         </div>

//         <div
//           className="
//             flex flex-col
//             items-center
//             text-center
//             gap-8
//             max-w-xl
//             mx-auto
//           "
//         >
//           <h1 className="text-7xl font-elnath tracking-wide text-[#EBD87D]">
//             MERCHANDISE
//           </h1>

//           <div className="text-white/80 space-y-4 font-[var(--font-euclid)]">
//             <p className="text-[24px] leading-[120%] font-normal">
//               Presenting the Official Merchandise for Srijan’26!
//             </p>
//             <p className="text-[22px] leading-[120%] font-normal">
//               A polo t-shirt, available in black and white colors.
//             </p>
//           </div>
//           <Price />
//           <Clickable
//             className="
//               mt-4
//               bg-white text-black
//               text-2xl
//               tracking-wide
//               hover:bg-orange-400
//             "
//           >
//             BUY
//           </Clickable>

//           <div className="pt-10 flex flex-col items-center gap-6">
//             <h3 className="text-[#EBD87D] text-2xl">
//               Contact
//             </h3>
//             <Contact />
//           </div>
//         </div>
//       </div>
//     </main>
//   );
// }

export default function MerchandisePage() {
  const { data: session } = useSession();
  const router = useRouter();

  const [activeIndex, setActiveIndex] = useState(0);
  const [formData, setFormData] = useState({
    size: "",
    color: "BLACK",
    campus: "JADAVPUR",
    customTextOption: "NO",
    customText: "",
  });
  const [error, setError] = useState("");

  const { isLoading, handlePayment } = usePayment({
    createOrderApi: "/api/create-order",
    verifyOrderApi: "/api/verify-payment",
    successRedirect: "/dashboard",
  });

  const BATCH_CODE_REGEX = /^(2k\d{2}|20\d{2}|\d{8,12})$/i;
  const ALLOWED_CHARS_REGEX = /^[a-zA-Z0-9\s@#\.()]*$/;

  const handleInputChange = (field: string, value: string) => {
    if (field === "customText") {
      if (value !== "" && !ALLOWED_CHARS_REGEX.test(value)) {
        return; // Filter out disallowed characters
      }
    }
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError("");
  };

  const validateCustomText = (text: string) => {
    if (!text) return true;
    const parts = text.split(/\s+/);
    for (const part of parts) {
      if (BATCH_CODE_REGEX.test(part)) {
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!session) {
      toast.error("Please login to buy merchandise");
      router.push("/login?redirect=/merchandise");
      return;
    }

    if (!formData.size) {
      setError("Please select a size.");
      toast.error("Please select a size.");
      return;
    }

    if (!validateCustomText(formData.customText)) {
      setError("Custom text cannot contain batch codes or roll numbers.");
      toast.error("Batch codes/roll numbers are not allowed.");
      return;
    }

    try {
      const { customTextOption, ...dataToSend } = formData;

      await handlePayment({
        amount: 349, // From Price component
        ...dataToSend,
      });
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message);
    }
  };

  const sizes = ["XS", "S", "M", "L", "XL", "XXL", "XXXL", "XXXXL"];
  const campuses = [
    { value: "JADAVPUR", label: "Jadavpur Campus" },
    { value: "SALT_LAKE", label: "Salt Lake Campus" },
  ];

  return (
    <main className="full-bleed min-h-screen bg-[url('/bg.jpg')] bg-cover bg-center relative text-white">
      <Balls />
      <div className="absolute inset-0 bg-black/70" />

      <div
        className="
          relative z-10 min-h-screen
          grid grid-cols-1 lg:grid-cols-[1fr_1.2fr]
          gap-12 md:gap-16 lg:gap-24
          px-6 py-10 md:px-12 md:py-16 lg:px-24 lg:py-20
          items-start
        "
      >
        <div className="flex flex-col items-center gap-6 md:gap-10 lg:sticky lg:top-20">
          <ProductView />

          <div className="flex gap-3 md:gap-4">
            {[0, 1, 2].map((i) => (
              <button
                key={i}
                type="button"
                onClick={() => setActiveIndex(i)}
                className={`
                  w-16 h-16 md:w-20 md:h-20
                  flex items-center justify-center
                  bg-white/5
                  border
                  transition
                  outline-none
                  ${
                    activeIndex === i
                      ? "border-[#EBD87D] ring-2 ring-[#EBD87D]/60"
                      : "border-white/40 hover:border-white"
                  }
                  focus-visible:ring-2
                  focus-visible:ring-[#EBD87D]
                  focus-visible:ring-offset-2
                  focus-visible:ring-offset-black
                `}
              >
                <Image
                  src="/shirt2.png"
                  alt={`Merchandise preview ${i + 1}`}
                  width={48}
                  height={48}
                  className="object-contain pointer-events-none"
                />
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-center text-center gap-6 md:gap-8 max-w-xl mx-auto w-full">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-elnath tracking-wide text-[#EBD87D]">
            MERCHANDISE
          </h1>

          <div className="text-white/80 space-y-3 md:space-y-4 font-euclid">
            <p className="text-lg md:text-[24px] leading-[120%]">
              Presenting the Official Merchandise for Srijan&apos;26!
            </p>
            <p className="text-base md:text-[22px] leading-[120%]">
              A polo t-shirt, available in black and white colors.
            </p>
          </div>

          <Price />

          {/* Form Start */}
          <form
            onSubmit={handleSubmit}
            className="w-full space-y-6 text-left mt-4 border border-white/10 p-6 md:p-8 rounded-2xl bg-black/40 backdrop-blur-sm"
          >
            {error && (
              <div className="bg-red-500/20 border border-red-500/50 text-red-500 p-3 rounded-lg text-sm text-center">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Size Dropdown */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#EBD87D]">
                  Shirt Size
                </label>
                <select
                  value={formData.size}
                  onChange={(e) => handleInputChange("size", e.target.value)}
                  className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-2.5 text-white focus:border-[#EBD87D] outline-none transition appearance-none"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23EBD87D'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "right 1rem center",
                    backgroundSize: "1.5em",
                  }}
                >
                  <option value="" disabled className="bg-neutral-900">
                    Select Size
                  </option>
                  {sizes.map((s) => (
                    <option key={s} value={s} className="bg-neutral-900">
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              {/* Campus Dropdown */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#EBD87D]">
                  Delivery Location
                </label>
                <select
                  value={formData.campus}
                  onChange={(e) => handleInputChange("campus", e.target.value)}
                  className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-2.5 text-white focus:border-[#EBD87D] outline-none transition appearance-none"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23EBD87D'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "right 1rem center",
                    backgroundSize: "1.5em",
                  }}
                >
                  {campuses.map((c) => (
                    <option
                      key={c.value}
                      value={c.value}
                      className="bg-neutral-900"
                    >
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Color Variant Radio Buttons */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-[#EBD87D]">
                Shirt Variant
              </label>
              <div className="flex gap-6 pt-2">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative flex items-center justify-center">
                    <input
                      type="radio"
                      name="color"
                      value="BLACK"
                      checked={formData.color === "BLACK"}
                      onChange={(e) =>
                        handleInputChange("color", e.target.value)
                      }
                      className="peer sr-only"
                    />
                    <div className="w-5 h-5 rounded-full border-2 border-white/40 peer-checked:border-[#EBD87D] transition group-hover:border-white" />
                    <div className="absolute w-2.5 h-2.5 rounded-full bg-[#EBD87D] scale-0 peer-checked:scale-100 transition" />
                  </div>
                  <span className="text-sm peer-checked:text-[#EBD87D]">
                    Black
                  </span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative flex items-center justify-center">
                    <input
                      type="radio"
                      name="color"
                      value="WHITE"
                      checked={formData.color === "WHITE"}
                      onChange={(e) =>
                        handleInputChange("color", e.target.value)
                      }
                      className="peer sr-only"
                    />
                    <div className="w-5 h-5 rounded-full border-2 border-white/40 peer-checked:border-[#EBD87D] transition group-hover:border-white" />
                    <div className="absolute w-2.5 h-2.5 rounded-full bg-[#EBD87D] scale-0 peer-checked:scale-100 transition" />
                  </div>
                  <span className="text-sm peer-checked:text-[#EBD87D]">
                    White
                  </span>
                </label>
              </div>
            </div>

            {/* Custom Text Option */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-[#EBD87D]">
                Custom Text
              </label>
              <div className="flex gap-6 pt-2">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative flex items-center justify-center">
                    <input
                      type="radio"
                      name="customTextOption"
                      value="YES"
                      checked={formData.customTextOption === "YES"}
                      onChange={(e) =>
                        handleInputChange("customTextOption", e.target.value)
                      }
                      className="peer sr-only"
                    />
                    <div className="w-5 h-5 rounded-full border-2 border-white/40 peer-checked:border-[#EBD87D] transition group-hover:border-white" />
                    <div className="absolute w-2.5 h-2.5 rounded-full bg-[#EBD87D] scale-0 peer-checked:scale-100 transition" />
                  </div>
                  <span className="text-sm peer-checked:text-[#EBD87D]">
                    Yes
                  </span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative flex items-center justify-center">
                    <input
                      type="radio"
                      name="customTextOption"
                      value="NO"
                      checked={formData.customTextOption === "NO"}
                      onChange={(e) =>
                        handleInputChange("customTextOption", e.target.value)
                      }
                      className="peer sr-only"
                    />
                    <div className="w-5 h-5 rounded-full border-2 border-white/40 peer-checked:border-[#EBD87D] transition group-hover:border-white" />
                    <div className="absolute w-2.5 h-2.5 rounded-full bg-[#EBD87D] scale-0 peer-checked:scale-100 transition" />
                  </div>
                  <span className="text-sm peer-checked:text-[#EBD87D]">
                    No
                  </span>
                </label>
              </div>
            </div>

            {formData.customTextOption === "YES" && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#EBD87D]">
                  Custom Text (to be printed on the back)
                </label>
                <input
                  type="text"
                  value={formData.customText}
                  placeholder="Ex: John Doe, @john, #26 (Optional)"
                  onChange={(e) =>
                    handleInputChange("customText", e.target.value)
                  }
                  className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-2.5 text-white focus:border-[#EBD87D] outline-none transition placeholder:text-white/20"
                />
                {/* <p className="text-[10px] text-white/40 italic">
                Allowed: A-Z, 0-9, spaces, @, #, ., (, ) | Batch codes/roll numbers are forbidden.
              </p> */}
              </div>
            )}

            <Clickable
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#EBD87D] text-black uppercase text-lg tracking-wide hover:bg-[#EBD87D]/80 disabled:opacity-50 gap-2 h-12"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  Processing...
                </>
              ) : (
                "BUY NOW"
              )}
            </Clickable>
          </form>
          {/* Form End */}

          <div className="pt-6 md:pt-10 flex flex-col items-center gap-4 md:gap-6">
            <h3 className="text-[#EBD87D] text-lg md:text-2xl">Contact us</h3>
            <Contact />
          </div>
        </div>
      </div>
    </main>
  );
}
