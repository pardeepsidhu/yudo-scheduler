// components/logout.tsx
'use client'
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface LogoutConfirmationProps {
  onLogoutConfirmed: () => void;
  buttonClassName?: string;
  buttonContent: React.ReactNode;
  tooltipContent?: string;
}

const LogoutConfirmation: React.FC<LogoutConfirmationProps> = ({
  onLogoutConfirmed,
  buttonClassName = "",
  buttonContent,
  tooltipContent
}) => {
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    setOpen(false);
    onLogoutConfirmed();
  };

  const button = (
    <Button
      variant="ghost"
      onClick={() => setOpen(true)}
      className={buttonClassName}
    >
      {buttonContent}
    </Button>
  );

  return (
    <>
      {tooltipContent ? (
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              {button}
            </TooltipTrigger>
            <TooltipContent side="right">{tooltipContent}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : button}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Logout</DialogTitle>
            <DialogDescription>
              Are you sure you want to logout? Your session data will be cleared.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter
            className="flex justify-end space-x-2 mt-4"
            style={{
              paddingLeft: "50%",
            }}
          >
            <button
              className='yudo-btn !py-[0.8em]'
              onClick={() => setOpen(false)}
            >
              Cancel
            </button>
            <button
              className='yudo-btn-sec !py-[0.8em]'
              onClick={handleLogout}
            >
              Logout
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default LogoutConfirmation;