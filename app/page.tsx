"use client";

import styled from "@emotion/styled";
import TaskManager from "@/components/TaskManager";

const Home: React.FC = () => {
  return (
    <Container>
      <H1>Task Manager</H1>
      <TaskManager />
    </Container>
  );
};

export default Home;

const H1 = styled.h1`
  margin: 16px 0;
`;

const Container = styled.div`
  margin-top: 20px;
  height: 100vh;
  text-align: center;
  margin: 0;
`;
