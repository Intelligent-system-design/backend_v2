import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';

export const validate = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessage = error.errors.map(err => err.message).join(', ');
        res.status(400).json({ error: errorMessage });
        return;
      }
      res.status(400).json({ error: 'Dữ liệu không hợp lệ' });
    }
  };
};
