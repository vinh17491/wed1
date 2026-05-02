import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { feedbackService } from '../../../services/feedback.service';

export const useFeedbacks = (filters: any) => {
  return useQuery({
    queryKey: ['feedbacks', filters],
    queryFn: () => feedbackService.getAll(filters),
  });
};

export const useFeedbackMutations = () => {
  const queryClient = useQueryClient();

  const updateStatus = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) => 
      feedbackService.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feedbacks'] });
    }
  });

  const deleteFeedback = useMutation({
    mutationFn: (id: number) => feedbackService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feedbacks'] });
    }
  });

  return { updateStatus, deleteFeedback };
};
