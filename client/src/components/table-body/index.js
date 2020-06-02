import React from 'react'
import { Button } from 'react-bootstrap'
import styled from './styled.module.css'

export function TableBodyComponent(props) {
  const { data, editAction, deleteAction } = props
  return (
    <tbody>
      {data.map((item, index) => {
        return (
          <tr key={`${item.name}/${index}`} className={styled.tableCells}>
            <td>{item.name}</td>
            <td>{item.phone}</td>
            <td>
              <div>
                <Button
                  variant='info'
                  style={{ marginRight: '2px' }}
                  onClick={() => editAction(item._id, item.name, item.phone)}
                >
                  edit
                </Button>
                <Button variant='danger' onClick={() => deleteAction(item._id)}>
                  delete
                </Button>
              </div>
            </td>
          </tr>
        )
      })}
    </tbody>
  )
}
