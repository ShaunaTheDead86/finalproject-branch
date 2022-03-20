import React, { useState } from 'react'
import Dashboard from './Dashboard'
import ProjectView from './ProjectView'
import Container from '@mui/material/Container'

export default function DashboardProject (props) {
  const { mode, setMode, user, setUser, userProjects, setUserProjects, currentProject, setCurrentProject } = props

  return (
    <Container>
      <Dashboard
        mode={mode}
        setMode={setMode}
        user={user}
        setUser={setUser}
        userProjects={userProjects}
        setUserProjects={setUserProjects}
        currentProject={currentProject}
        setCurrentProject={setCurrentProject}
			/>
      <Container>
        <ProjectView user={user} userProjects={userProjects} currentProject={currentProject}/>
      </Container>
    </Container>
  )
}