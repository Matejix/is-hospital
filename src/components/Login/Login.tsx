import { TextInput, Button, Text, Anchor, Title } from "@mantine/core";
import { useForm } from "@mantine/form";
import Axios from "axios";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";
function Login() {
  const loginEmployee = () => {
    Axios.post("http://localhost:3000/", {
      username: form.values.username,
      password: form.values.password,
    }).then((response: any) => {
      console.log(response);
      if (response.status == 200) {
        localStorage.setItem("token", response.data.token);
        authorized();
        //window.location.href = "/app";
      }
    });
  };

  const authorized = () => {
    Axios.get("http://localhost:3000/auth", {
      headers: { "x-access-token": localStorage.getItem("token") },
    }).then((response: any) => {
      console.log(response);
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
        <Title>
          <img className="m-auto w-32 mb-5" src={logo} alt="E-Hospital logo" />
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
