import React from "react";
import { Button, Dialog, DialogBody, DialogFooter } from "@strapi/design-system";

export function ConfirmationDialog({ title, onConfirm, onClose, isOpen, icon, confirmButtonProps, children }) {
  return (
    <Dialog onClose={onClose} title={title} isOpen={isOpen}>
      <DialogBody icon={icon}>{children}</DialogBody>
      <DialogFooter
        startAction={
          <Button onClick={onClose} variant="tertiary">
            Cancelar
          </Button>
        }
        endAction={
          <Button type="submit" onClick={onConfirm} {...confirmButtonProps}>
            Confirmar
          </Button>
        }
      />
    </Dialog>
  );
}
