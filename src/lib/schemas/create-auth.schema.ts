import { z } from "zod";

export const createAuthSchema = z.object({

  email: z.string({
    invalid_type_error: 'El email debe ser texto',
    required_error: 'Email es obligatorio'
  })
    .trim()
    .min(12, 'El email no puede estar vacío')
    .email('Formato de email inválido'),

  password: z.string({
    invalid_type_error: 'La contraseña debe ser texto',
    required_error: 'Contraseña es obligatoria'
  })
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .max(32, 'La contraseña no puede exceder 32 caracteres')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      'La contraseña debe contener al menos una mayúscula, una minúscula, un número y un carácter especial'
    ),

  username: z.string({
    invalid_type_error: 'El nombre debe ser texto',
    required_error: 'Nombre es obligatorio'
  }).trim().min(12, 'El email no puede estar vacío')

})