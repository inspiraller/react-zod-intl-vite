
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';

export const FormExample = () => {
  const schema = z.object({
      username: z.string().min(3),
      password: z.string().min(6),
    });

  
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    mode: 'onBlur',
  });

  const onSubmit = (data: any) => alert(JSON.stringify(data, null, 2));

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('username')} placeholder="Username" />
      {errors.username && <p style={{ color: 'red' }}>{errors.username.message}</p>}

      <input type="password" {...register('password')} placeholder="Password" />
      {errors.password && <p style={{ color: 'red' }}>{errors.password.message}</p>}

      <button type="submit">Submit</button>
    </form>
  );
}

