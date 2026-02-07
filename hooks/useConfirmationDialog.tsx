/* 
    Usage - 

    Import:
        import { useConfirmationDialogContext } from "@/hooks/useConfirmationDialog";

    Inside top level component: 
        const modalContext = useConfirmationDialogContext();

    Inside handler function when you are performing the operation:
        modalContext.showDialog("This text will be displayed in the dialog", () => {console.log("this function will be run if the user clicks ok")});
    
    - Check out @/components/EventRegistration/MemberControls.tsx for reference.
    - If the user clicks cancel, the dialog will simply close and no other function will be called. Your dialog text should be in this format - "Are you sure you want to perform XYZ action?" - so the user says yes to call the given function, no to simply close the dialog.

*/
"use client";

import { createContext, ReactNode, useContext, useRef, useState } from "react";

type ModalContextType = {
  showDialog: (dialogText: string, confirmFunction: () => void) => void;
};

const ConfirmationDialogContext = createContext<ModalContextType>(
  {} as ModalContextType,
);

export const ConfirmationDialogContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [text, setText] = useState("");
  const [handleConfirm, setHandleConfirm] = useState(() => () => {});

  const handleShow = (dialogText: string, confirmFunction: () => void) => {
    setText(dialogText);
    setHandleConfirm(() => confirmFunction);
    dialogRef.current?.showModal();
  };

  const handleCancel = () => {
    dialogRef.current?.close();
  };

  return (
    <ConfirmationDialogContext.Provider value={{ showDialog: handleShow }}>
      {children}
      <div className="fixed h-screen w-screen -z-10">
        <dialog
          ref={dialogRef}
          className="fixed top-1/2 left-1/2 -translate-1/2 z-300 rounded-sm backdrop:bg-gray-800/75"
        >
          <div className="flex flex-col items-center gap-4 px-8 py-3">
            <h3 className="text-2xl underline underline-offset-4">
              Confirmation
            </h3>
            <p>{text}</p>
            <div className="flex w-4/5 justify-around border-t border-t-black/60 pt-3 text-white">
              <button
                onClick={() => {
                  handleConfirm();
                  dialogRef.current?.close();
                }}
                className="rounded-xs bg-black px-2 py-1 outline-none"
              >
                Yes
              </button>
              <button
                onClick={handleCancel}
                className="rounded-xs bg-red-500 px-2 py-1 outline-none"
              >
                Cancel
              </button>
            </div>
          </div>
        </dialog>
      </div>
    </ConfirmationDialogContext.Provider>
  );
};

export const useConfirmationDialogContext = (): ModalContextType =>
  useContext(ConfirmationDialogContext);
