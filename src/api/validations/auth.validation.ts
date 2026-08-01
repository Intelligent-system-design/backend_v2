import { z } from 'zod';

export const authValidation = {
  loginSchema: z.object({
    body: z.object({
      email: z.string().email('Email không đúng định dạng').optional(),
      username: z.string().min(3, 'Tên người dùng phải có ít nhất 3 ký tự').optional(),
      password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
    }).refine(data => data.email || data.username, {
      message: 'Vui lòng cung cấp email hoặc tên người dùng',
      path: ['username'] // or email
    })
  }),

  registerSchema: z.object({
    body: z.object({
      email: z.string().min(1, 'Email không được để trống').email('Email không đúng định dạng'),
      username: z.string().min(3, 'Tên người dùng phải có ít nhất 3 ký tự'),
      password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
    })
  })
};
