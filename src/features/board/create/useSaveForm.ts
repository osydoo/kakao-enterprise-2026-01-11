import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { setZodErrors } from '@/utils/form';

const boardFormSchema = z.object({
  title: z.string().min(1, '제목은 필수입니다.').trim(),
  content: z.string().min(1, '내용은 필수입니다.').trim(),
});

type BoardFormData = z.infer<typeof boardFormSchema>;

interface Props {
  initialTitle: string;
  initialContent: string;
  onSubmit: (title: string, content: string) => Promise<void>;
}

export const useSaveForm = ({ initialTitle, initialContent, onSubmit }: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError: setFormError,
  } = useForm<BoardFormData>({
    defaultValues: {
      title: initialTitle,
      content: initialContent,
    },
  });

  const onSubmitForm = async (data: BoardFormData) => {
    const result = boardFormSchema.safeParse(data);

    if (!result.success) {
      setZodErrors(result.error, setFormError);
      return;
    }

    try {
      await onSubmit(result.data.title, result.data.content);
    } catch (err) {
      setFormError('root', {
        message: err instanceof Error ? err.message : '게시글 등록 중 오류가 발생했습니다.',
      });
    }
  };

  return {
    register,
    formState: { errors, isSubmitting },
    handleSubmit: handleSubmit(onSubmitForm),
  };
};
