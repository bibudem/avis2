'use client';

import dynamic from 'next/dynamic';
import { useSnackbar } from '@/components/Snackbar/useSnackbar';
import { save } from '@/actions';
import noop from '@/utils/noop';
import './EditAvis.scss';

const CKEditor = dynamic(() => import('@/components/CustomCKEditor').then((e) => e.default), { ssr: false });

export default function EditAvis({ avis, onSaveSuccess = noop, onSaveError = noop, onStateChange = noop, onFocus = noop, onBlur = noop, ...props }) {
  const [openSnackbar] = useSnackbar();

  async function onSave(message) {
    if (!message) {
      onSaveError();
      return;
    }

    const result = await save(avis.id, message);

    if (result.success) {
      openSnackbar('Message sauvegardé.');
      onSaveSuccess(result.data);
    } else {
      openSnackbar(result.message, { autoHide: false });
    }
  }

  return (
      <CKEditor
          data={avis.message}
          onSave={onSave}
          onStateChange={onStateChange}
          onFocus={onFocus}
          onBlur={onBlur}
          {...props}
      />
  );
}
