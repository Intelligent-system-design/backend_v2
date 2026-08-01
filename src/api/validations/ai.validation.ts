import { z } from 'zod';

export const aiValidation = {
  fenSchema: z.object({
    body: z.object({
      fen: z.string().min(1, 'Thiếu chuỗi FEN hoặc chuỗi FEN không được để trống')
    })
  }),

  moveSchema: z.object({
    body: z.object({
      fen: z.string().min(1, 'Thiếu chuỗi FEN hoặc chuỗi FEN không được để trống'),
      move: z.string().min(1, 'Thiếu nước đi (move) hoặc nước đi không được để trống')
    })
  })
};
