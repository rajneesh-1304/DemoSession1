"use client";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import InputAdornment from "@mui/material/InputAdornment";
import { useForm } from "react-hook-form";
import "./register.css";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import IconButton from "@mui/material/IconButton";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { auth, provider, db, gitProvider } from "../../app/config/firebase";
import { createUserWithEmailAndPassword, signInWithPopup, signOut } from "firebase/auth";
import { collection, addDoc, } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { registerThunk } from "@/app/redux/features/users/userSlice";
import './register.css'
import { useAppDispatch } from "@/app/redux/hooks";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { FormHelperText, InputLabel, MenuItem, Select } from "@mui/material";


const RegisterUserSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Name must be at least 3 characters")
    .regex(/^[A-Za-z ]+$/, "Name can only contain letters and spaces"),

  email: z.string().trim().min(1, "Email is required").email("Enter a valid email address"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(20, "Password cannot exceed 20 characters")
    .regex(/^\S*$/, "Password cannot contain spaces")
    .regex(/[A-Z]/, "Must contain at least one uppercase letter")
    .regex(/[a-z]/, "Must contain at least one lowercase letter")
    .regex(/[0-9]/, "Must contain at least one number")
    .regex(/[!@#$%^&*]/, "Must contain at least one special character"),

  role: z.string("role is required"),

  confirmPassword: z
    .string()
    .min(1, "Confirm password is required"),
}).refine((data: any) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],


});

type RegisterFormInputs = z.infer<typeof RegisterUserSchema>;

export default function RegisterForm() {
  const dispatch = useAppDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const handleTogglePassword = () => setShowPassword(prev => !prev);
  const handleToggleConfirmPassword = () => setShowConfirmPassword(prev => !prev);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");


  const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  const handleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      if (!user.email) {
        throw new Error("Google account has no email");
      }

      const registerData = {
        displayName: user.displayName,
        email: user.email,
        role: 'CUSTOMER'
      };

      const registerResponse = await dispatch(registerThunk(registerData));

      if (!registerThunk.fulfilled.match(registerResponse)) {
        await signOut(auth);
        throw new Error("Registration failed");
      } else {
        setSnackbarMessage("Account created successfully");
        setSnackbarOpen(true);
        router.push('/login')
      }
    } catch (error: any) {
      const message =
        error?.message?.includes("Email already registered") ||
          error?.response?.data?.message?.includes("Email already registered")
          ? "User already exists, please login"
          : "Something went wrong";

      setSnackbarMessage(message);
      setSnackbarOpen(true);
    }
  };

  const onSubmit = async (data: RegisterFormInputs) => {
    try {
      await createUserWithEmailAndPassword(auth, data.email, data.password);
      const docRef = await addDoc(collection(db, 'auth'), {
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role
      });

      const dat = {
        displayName: data.name,
        email: data.email,
        role: data.role
      }
      await dispatch(registerThunk(dat)).unwrap();
      setSnackbarMessage('User created successfully!');
      setSnackbarOpen(true);
      setTimeout(() => {
        router.push('/login');
      }, 1200);
    }
    catch (err: any) {
      console.log(err, 'error is here ')
      const message =
        err?.message?.includes("email-already-in-use") ||
          err?.response?.data?.message?.includes("Email already registered")
          ? "User already exists, please login"
          : err?.message || "Registration failed";

      setSnackbarMessage(message);
      setSnackbarOpen(true);
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(RegisterUserSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role:""
    },
  });


  useEffect(() => {
    console.log(errors)
  }, [errors])


  return (
    <div className="main-form">
      <form className="formm" onSubmit={handleSubmit(onSubmit)}>
        <h1 className='register_heading'>Create Account</h1>
        <Box sx={{ display: "flex", flexDirection: "column", width: 300, gap: 1, mt: 1, padding: 1, paddingBottom: 1 }}>

          <FormControl variant="standard">
            <TextField
              label="Name"
              variant="outlined"
              size="small"
              {...register("name", { required: "Name is required" })}
              error={!!errors.name}
              helperText={errors.name ? errors.name.message : ""}
            />
          </FormControl>

          <FormControl variant="standard">
            <TextField
              label="Email"
              size="small"
              variant="outlined"
              {...register("email", { required: "Email is required" })}
              error={!!errors.email}
              helperText={errors.email ? errors.email.message : ""}
            />
          </FormControl>

          <FormControl variant="standard" fullWidth>
            <TextField
              label="Password"
              size="small"
              type={showPassword ? "text" : "password"}
              variant="outlined"
              {...register("password", { required: "Password is required" })}
              error={!!errors.password}
              helperText={errors.password ? errors.password.message : ""}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleTogglePassword} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </FormControl>

          <FormControl variant="standard" fullWidth>
            <TextField
              label="Confirm Password"
              size="small"
              type={showConfirmPassword ? "text" : "password"}
              variant="outlined"
              {...register("confirmPassword")}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword?.message}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleToggleConfirmPassword} edge="end">
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </FormControl>

          <FormControl
            fullWidth
            variant="outlined"
            size="small"
            error={!!errors.role}
          >
            <InputLabel
              id="demo-simple-select-standard-label"
              sx={{ fontSize: 14 }}
            >
              Role
            </InputLabel>

            <Select
              labelId="demo-simple-select-standard-label"
              id="demo-simple-select-standard"
              {...register("role")}
              sx={{
                minHeight: 32,
                paddingY: "2px",
              }}
            >
              <MenuItem value="ADMIN">OWNER</MenuItem>
              <MenuItem value="CUSTOMER">CUSTOMER</MenuItem>
            </Select>

            <FormHelperText sx={{ fontSize: 11, mt: 0.5 }}>
              {errors.role?.message}
            </FormHelperText>
          </FormControl>

          <Button variant="contained" sx={{ mt: 1.5, mb: 1 }} type="submit">
            Register
          </Button>
        </Box>

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={2000}
          onClose={handleClose}
          message={snackbarMessage}
        ></Snackbar>
      </form>
      <Button variant="contained" sx={{
        mt: 1.5, width: 320, backgroundColor: '#fff',
        color: '#757575',
      }} onClick={handleSignIn}>
        <FcGoogle style={{ height: "30px", marginRight: "5px" }} />Sign Up With Google
      </Button>

      <div
        className='login'><p>Already Registered <span className='login_link' onClick={() => { router.push('/login') }}>Login</span></p>
      </div>

    </div>
  );
}
