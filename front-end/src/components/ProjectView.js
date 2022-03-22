import * as React from 'react'
import { useEffect, useState } from 'react'
import ProjectColumn from './ProjectColumn'
import ProjectColumnNew from './ProjectColumnNew'
import Box from '@mui/material/Box'
import NewProjectForm from './Forms/NewProjectForm'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import axios from 'axios'

export default function ProjectView (props) {
  const { user, currentProject, mode, setViewMode, setCurrentColumn } = props
  const [columns, setColumns] = useState([])

  useEffect(
		() => {
  if (currentProject) {
    setColumns(currentProject.Columns)
  }
},
		[currentProject]
	)

  function onDragEnd (result, provided) {
    const { source, destination, type } = result
    if (!destination) return
    if (!destination.droppableId) return
    if (
			destination.droppableId === source.droppableId &&
			destination.index === source.index
		) {
      return
    }

		// moving the whole column
    if (type === 'column') {
      const newColumns = JSON.parse(JSON.stringify(columns)) // deep clone
      const [movingColumn] = newColumns.splice(source.index, 1)
      newColumns.splice(destination.index, 0, movingColumn)
      setColumns(newColumns)
    } else if (type === 'ticket') {
			// moving ticket
      if (destination.droppableId === source.droppableId) {
        let column
        let columnIndex
        for (let i = 0; i < columns.length; i++) {
          if (columns[i].name === source.droppableId) {
            column = columns[i]
            columnIndex = i
          }
        }
        const newTickets = JSON.parse(JSON.stringify(column.Tickets)) // deep clone
        const [movingTicket] = newTickets.splice(source.index, 1)
        newTickets.splice(destination.index, 0, movingTicket)
        const newColumn = { ...column, Tickets: newTickets }
        columns[columnIndex] = newColumn
      } else {
        let sourceColumn
        let sourceColumnIndex
        let destColumn
        let destColumnIndex
        for (let i = 0; i < columns.length; i++) {
          if (columns[i].name === source.droppableId) {
            sourceColumn = columns[i]
            sourceColumnIndex = i
          }
          if (columns[i].name === destination.droppableId) {
            destColumn = columns[i]
            destColumnIndex = i
          }
        }
        const newSourceTickets = JSON.parse(
					JSON.stringify(sourceColumn.Tickets)
				) // deep clone
        const newDestTickets = JSON.parse(JSON.stringify(destColumn.Tickets)) // deep clone

        const [movingTicket] = newSourceTickets.splice(source.index, 1)
        const newSourceColumn = { ...sourceColumn, Tickets: newSourceTickets }

        newDestTickets.splice(destination.index, 0, movingTicket)
        const newDestColumn = { ...destColumn, Tickets: newDestTickets }

        columns[sourceColumnIndex] = newSourceColumn
        columns[destColumnIndex] = newDestColumn

				// persist new column id to the ticket details in db
        axios
					.post(process.env.REACT_APP_BACKEND_URL + '/tickets/updateColumn', {
  ticketId: movingTicket.id,
  newColumnId: destColumn.id
})
					.then(res => {
  console.log(res.data)
})
					.catch(function (error) {
  console.log(error.message)
})
      }
			// update state to retain moving position
      setColumns(prev => [...prev])
    }
  }

  const generatedColumns = columns.map((column, colIndex) =>
    <ProjectColumn
      disablePadding
      key={column.id}
      user={user}
      title={column.name}
      column={column}
      setViewMode={setViewMode}
      setCurrentColumn={setCurrentColumn}
      colIndex={colIndex}
		/>
	)
  const createNewColumn = function (newColumnName) {
    console.log('AAAAAAAA:' + newColumnName)
    console.log(columns)

    axios
			.post(process.env.REACT_APP_BACKEND_URL + '/columns/new', {
  name: newColumnName,
  project_id: currentProject.id
})
			.then(res => {
  console.log(res.data)
  const newColumn = { ...res.data, Tickets: [] }
  setColumns([...columns, newColumn])
})
			.catch(function (error) {
  console.log(error.message)
})
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId='all-column' direction='horizontal' type='column'>
        {provided =>
          <Box
            disablePadding
            sx={{ display: 'flex' }}
            {...provided.droppableProps}
            ref={provided.innerRef}
					>
            {generatedColumns}
            <ProjectColumnNew
              disablePadding
              name={'+ New Column'}
              createNewColumn={createNewColumn}
						/>
            {provided.placeholder}
          </Box>}
      </Droppable>
    </DragDropContext>
  )
}
