import { TextInput, Button, Text, Anchor, Title } from "@mantine/core";
import { useForm } from "@mantine/form";
import { Link } from "react-router-dom";
  import Axios from "axios";

function Login() {
  const loginEmployee = () => {
    Axios.post("http://localhost:3000/", {
      username: form.values.username,
      password: form.values.password,
    }).then((response) => {
      if(response.status == 200){
        window.location.href = "/app";
      }
    });
  };

  const form = useForm({
    initialValues: {
      username: "",
      password: "",
    },

    validate: {
      username: (value) => (Boolean(value) ? null : "Invalid username"),
      password: (value) => (Boolean(value) ? null : "Invalid password"),
    },
  });
  return (
    <div className="w-full min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full bg-teal-50 border-2 border-teal-300 rounded-md p-8">
        <Title
          mb={24}
          align="center"
          sx={(theme) => ({
            fontFamily: `Greycliff CF, ${theme.fontFamily}`,
            fontWeight: 900,
          })}
        >
          Nazov / Logo appky
        </Title>
        <form onSubmit={form.onSubmit((values) => console.log(values))}>
          <TextInput
            label="Username"
            placeholder="Please enter your username"
            size={"lg"}
            {...form.getInputProps("username")}
          />
          <TextInput
            className="mt-8"
            label="Password"
            placeholder="Please enter your password"
            type={"password"}
            size={"lg"}
            {...form.getInputProps("password")}
          />

          <Text color="dimmed" size="sm" align="center" mt={24}>
            Do not have an account yet?{" "}
            <Link to="/register">
              <Anchor<"button"> weight={700} type="button">
                Create account
              </Anchor>
            </Link>
          </Text>

          <Button
            color="teal"
            size="lg"
            className="bg-teal-400 w-1/2 mx-auto block mt-8"
            type="submit"
            onClick={loginEmployee}

          >
            Log in
          </Button>
        </form>
      </div>
    </div>
  );
}

export default Login;
