import { useForm } from "react-hook-form";

import z from "zod";
import { useTranslation } from "react-i18next";
import i18n from "@/i18n";
import { zodResolver } from "@/zod/zodResolver";

export const FormExample = () => {
  const schema = z.object({
    username: z.string().min(3),
    password: z.string().min(6),
  });

  type PropsFormExample = z.infer<typeof schema>;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PropsFormExample>({
    resolver: zodResolver(schema),
    mode: "onBlur",
  });

  const { t } = useTranslation();

  const tZod = (key: string, options?: any) =>
    i18n.t(key, { ns: "zodv3_old_map", ...options });

  const onSubmit = (data: PropsFormExample) => {
    alert(JSON.stringify(data, null, 2));

    console.log("OG text=", t("Generic.submit"));
    console.log(
      "tZod('errors.invalid_type', {expected, recieved})=",
      tZod("errors.invalid_type", {
        expected: "string",
        received: "number",
      })
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("username")} placeholder="Username" />
      {errors.username && (
        <p style={{ color: "red" }}>{errors.username.message}</p>
      )}

      <input type="password" {...register("password")} placeholder="Password" />
      {errors.password && (
        <p style={{ color: "red" }}>{errors.password.message}</p>
      )}

      <button type="submit">Submit</button>
    </form>
  );
};
