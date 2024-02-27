import React from "react";
import { Container } from "react-bootstrap";
import { login } from "../utils/auth";
import Cover from "../components/utils/Cover";
import coverImg from "../assets/img/sandwich.jpg";
import { Notification } from "../components/utils/Notifications";
import Homes from "../components/home/Homes";

const HomesPage = () => {
  const isAuthenticated = window.auth.isAuthenticated;

  return (
    <>
      <Notification />
      {isAuthenticated ? (
        <Container fluid="md">
          <main>
            <Homes />
          </main>
        </Container>
      ) : (
        <Cover name="Street Food" login={login} coverImg={coverImg} />
      )}
    </>
  );
};

export default HomesPage;
