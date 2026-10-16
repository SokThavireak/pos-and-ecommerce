import { defineStore } from 'pinia';

export interface ToastNotification {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
  duration?: number;
}

export interface ModalPromptOptions {
  title: string;
  message: string;
  type?: 'success' | 'warning' | 'danger' | 'info';
  confirmText?: string;
  cancelText?: string;
}

export const useAlertStore = defineStore('alert', {
  state: () => ({
    toasts: [] as ToastNotification[],
    confirmModal: {
      show: false,
      title: '',
      message: '',
      type: 'info' as 'success' | 'warning' | 'danger' | 'info',
      confirmText: 'Confirm',
      cancelText: 'Cancel',
      resolve: null as ((val: boolean) => void) | null,
    },
  }),

  actions: {
    notify(opts: { type?: 'success' | 'error' | 'info' | 'warning'; title?: string; message: string; duration?: number }) {
      const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
      const toast: ToastNotification = {
        id,
        type: opts.type || 'info',
        title: opts.title || (opts.type === 'success' ? 'Success' : opts.type === 'error' ? 'Notice' : 'Notification'),
        message: opts.message,
        duration: opts.duration || 4000,
      };

      this.toasts.push(toast);

      if (toast.duration > 0) {
        setTimeout(() => {
          this.removeToast(id);
        }, toast.duration);
      }
    },

    success(message: string, title = 'Operation Successful') {
      this.notify({ type: 'success', title, message });
    },

    error(message: string, title = 'Attention Required') {
      this.notify({ type: 'error', title, message });
    },

    info(message: string, title = 'Information') {
      this.notify({ type: 'info', title, message });
    },

    removeToast(id: string) {
      this.toasts = this.toasts.filter((t) => t.id !== id);
    },

    confirm(opts: ModalPromptOptions): Promise<boolean> {
      return new Promise((resolve) => {
        this.confirmModal = {
          show: true,
          title: opts.title,
          message: opts.message,
          type: opts.type || 'warning',
          confirmText: opts.confirmText || 'Confirm',
          cancelText: opts.cancelText || 'Cancel',
          resolve,
        };
      });
    },

    handleConfirm(result: boolean) {
      if (this.confirmModal.resolve) {
        this.confirmModal.resolve(result);
      }
      this.confirmModal.show = false;
      this.confirmModal.resolve = null;
    },
  },
});
