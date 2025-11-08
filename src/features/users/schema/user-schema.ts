import { z } from "zod";

// Define a type for your role object for better type safety
type Role = {
  id: number;
  name: "barge_operator" | "crane_operator" | string; // Add other role strings as needed
};

// Use a factory function to create the schema, so we can pass in the roles data
export const createUserSchema = (roles: Role[]) => z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z.string().min(10, { message: "Please enter a valid phone number." }),
  
  // Make password optional for editing, we'll handle the logic in the form
  password: z.string().min(8, "Password must be at least 8 characters.")
    .or(z.literal('')) // Allow empty string for edits
    .optional(),

  role_id: z.coerce.number().positive({ message: "A role must be selected." }),
  
  barge_id: z.coerce.number().optional().nullable(),
  crane_id: z.coerce.number().optional().nullable(),
})
.superRefine((data, ctx) => {
  console.log(roles)
  console.log("data",data)
  // Find the full role object based on the selected role_id
  const selectedRole = roles?.data?.find(role => role.id == data.role_id);
  console.log("selectedRole",selectedRole)
  // Check if the selected role is "barge_operator"
});

// We can now infer the type from the factory function
export type TUserSchema = z.infer<ReturnType<typeof createUserSchema>>;