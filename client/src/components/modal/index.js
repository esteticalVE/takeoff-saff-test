import React from 'react'
import { Modal, Button } from 'react-bootstrap'

export function ModalComponent(props) {
  const { children, toggle, isOpen = false, onSubmit } = props

  return (
    <Modal show={isOpen} onHide={toggle} animation={false}>
      <Modal.Header>Edit</Modal.Header>
      <Modal.Body>{children}</Modal.Body>
      <Modal.Footer>
        <Button variant='info' onClick={onSubmit}>
          Submit
        </Button>
        <Button variant='danger' onClick={toggle}>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
