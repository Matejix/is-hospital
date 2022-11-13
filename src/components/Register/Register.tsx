import { TextInput, Button, Text, Anchor, Title, Select } from "@mantine/core";
import { useForm } from "@mantine/form";
import { Link } from "react-router-dom";
import Axios from "axios";
const address = "http://localhost:3000" ;
import { useState } from "react";

function Register() {
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  const registerEmployee = () => {

    Axios.post("http://localhost:3000/register", {
      username: form.values.username,
      password: form.values.password,
    }).then(() => {
      console.log(username);
    });
  };

  const form = useForm({

    initialValues: {
      username: "",
      password: "",
      confirmPass: "",
      type: "",
    },

    validate: {
      type: (value) => (Boolean(value) ? null : "Choose type"),
      username: (value) => (Boolean(value) ? null : "Invalid username"),
      password: (value) => (Boolean(value) ? null : "Invalid password"),
      confirmPass: (value, { password }) =>
        password === value ? null : "Password do not match",
    },
  });

  return (
    <div className="w-full min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full bg-indigo-50 border-2 border-indigo-300 rounded-md p-8">
        <Title
          mb={24}
          align="center"
          sx={(theme) => ({
            fontFamily: `Greycliff CF, ${theme.fontFamily}`,
            fontWeight: 900,
          })}
        >
          Registration
        </Title>
        <form onSubmit={form.onSubmit((values) => console.log(values))}>
          <Select
            style={{ marginTop: 20, zIndex: 2 }}
            data={["Lekar", "Upratovacka", "Administrator", "Sestra"]}
            placeholder="Please pick one"
            label="Type of employee"
            size={"lg"}
            className="mb-8"
            {...form.getInputProps("type")}
          />
          <TextInput
            type="text"
            onChange={(event) => {
              setUsername(event.target.value);
            }}
            label="ID number"
            placeholder="Please enter your ID number"
            size={"lg"}
            {...form.getInputProps("username")}
            
          />
          <TextInput
            onChange={(event) => {
              setPassword(event.target.value);
            }}
            className="mt-8"
            label="Password"
            placeholder="Please enter your password"
            type={"password"}
            size={"lg"}
            {...form.getInputProps("password")}
            
          />
          <TextInput
            className="mt-8"
            label="Password confirmation"
            placeholder="Please enter password again"
            type={"password"}
            size={"lg"}
            {...form.getInputProps("confirmPass")}
          />

          <Text color="dimmed" size="sm" align="center" mt={24}>
            Alreade have account?{" "}
            <Link to="/">
              <Anchor<"button"> weight={700} type="button">
                Login
              </Anchor>
            </Link>
          </Text>

          <Button
            color="indigo"
            size="lg"
            className="bg-indigo-400 w-1/2 mx-auto block mt-8"
            onClick={registerEmployee}
          >
            Create Account
          </Button>
        </form>
      </div>
    </div>
  );
}

export default Register;
