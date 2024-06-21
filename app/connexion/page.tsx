'use client';
import React, { useState } from 'react';
import { Card, CardHeader, Divider, CardBody, Input, Button, CardFooter } from '@nextui-org/react';
import { EyeFilledIcon } from "@/public/EyeFilledIcon";
import { EyeSlashFilledIcon } from "@/public/EyeSlashFilledIcon";
import { postLogin } from '@/config/api';

const LoginPage = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  const [emailInvalide, setEmailInvalide] = useState(false);
  const [passwordInvalide, setPasswordInvalide] = useState(false);

  const handleSubmit = () => {
    // Check if email contains "@" and ends with "junia.com"
    if (password.length < 1) {
      setPasswordInvalide(true);
    }
    if (!email.includes("@") || !email.endsWith("junia.com")) {
      setEmailInvalide(true);
    }

    if (!emailInvalide || !passwordInvalide) {
      const login = { "email": email, "mdp": password };
      const fetchLogin =  postLogin(login);
      fetchLogin.then((response) => {
        if (window.localStorage.getItem('token') !== null && response.token !== null){
          window.location.href = '/';
        } else {
          alert("Erreur lors de la connexion");
        }
      });
    }
  };

  const toggleVisibility = () => setIsVisible(!isVisible);

  return (
    <Card className="w-96 m-auto">
      <CardHeader className="">
        <h1 className='font-bold text-lg'>Connexion</h1>
      </CardHeader>
      <Divider />
      <CardBody className="flex flex-col gap-8 mt-6">
        <Input
          isClearable
          type="email"
          label="Mail"
          variant="bordered"
          placeholder="Votre mail de connexion"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className=""
          isInvalid={emailInvalide}
          errorMessage="L'adresse mail doit être avoir un @ et finir par junia.com"
        />
        <Input
          label="Password"
          variant="bordered"
          placeholder="Votre mot de passe"
          endContent={
            <button className="focus:outline-none" type="button" onClick={toggleVisibility}>
              {isVisible ? (
                <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
              ) : (
                <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
              )}
            </button>
          }
          type={isVisible ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className=""
          isInvalid={passwordInvalide}
          errorMessage="Le mot de passe est nécessaire"
        />
        <Button onClick={handleSubmit}>Se connecter</Button>
      </CardBody>
      <Divider className='mt-6' />
      <CardFooter>
        <p>Vous n'avez pas de compte ? <a href="/inscription" className='text-primary'>Inscrivez-vous</a></p>
      </CardFooter>
    </Card>
  );
};

export default LoginPage;
