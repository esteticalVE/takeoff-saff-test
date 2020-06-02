import React, { useState, useCallback, useContext, useEffect } from 'react'
import { Table, InputGroup, FormControl, Button, Alert } from 'react-bootstrap'
import { useFetch, useAlert } from '../hooks'
import { AuthContext } from '../context/authContext'
import {
  PaginationComponent,
  TableBodyComponent,
  ModalComponent,
} from '../components'
import {
  phoneValidation,
  usernameValidation,
  createCorrectPhone,
} from '../utils'
import styled from './styled.module.css'

const initialContactState = { name: '', phone: '' }

export function Contacts() {
  const { token, logout } = useContext(AuthContext)
  const { request, loading } = useFetch()
  const { alert, setAlert } = useAlert()

  const [contactState, setContactState] = useState(initialContactState)
  const [contactsData, setContactsData] = useState([])
  const [pageOfItems, setPageOfItems] = useState([])
  const [paginationPage, setPaginationPage] = useState(1)
  const [isOpenModal, setIsOpenModal] = useState(false)
  const [modalData, setModalData] = useState({})
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState([])

  const fetchContacts = useCallback(async () => {
    try {
      const fetchedData = await request('/api/contact', 'GET', null, {
        Authorization: `Bearer ${token}`,
      })
      setContactsData(fetchedData.reverse())
    } catch (error) {
      setAlert({ type: 'error', message: error.message })
    }
  }, [token, request])

  function searchHandler(event) {
    setSearchTerm(event.target.value)
  }

  useEffect(() => {
    if (contactsData.length) {
      const result = contactsData.filter(person => {
        return person.name.toLowerCase().includes(searchTerm.toLowerCase())
      })
      setSearchResults(result)
    }
  }, [searchTerm, contactsData])

  function changeContactHandler(event) {
    setContactState({
      ...contactState,
      [event.target.name]: event.target.value,
    })
  }

  async function deleteContactHandler(id) {
    try {
      const data = await request(`/api/contact/delete/${id}`, 'DELETE', null, {
        Authorization: `Bearer ${token}`,
      })
      if (data.ok) {
        fetchContacts()
        setAlert({ type: 'success', message: data.message })
      }
    } catch (error) {
      setAlert({ type: 'error', message: error.message })
    }
  }

  async function addContactHandler() {
    try {
      const normalizedPhone = createCorrectPhone(contactState.phone)
      usernameValidation(contactState.name)
      phoneValidation(normalizedPhone)

      const data = await request(
        '/api/contact/add',
        'POST',
        { name: contactState.name, phone: normalizedPhone },
        {
          Authorization: `Bearer ${token}`,
        }
      )
      if (data.ok) {
        fetchContacts()
        setContactState(initialContactState)
        setAlert({ type: 'success', message: data.message })
      }
    } catch (error) {
      setAlert({ type: 'error', message: error.message })
    }
  }

  async function updateContactHandler(contact) {
    try {
      const data = await request(
        `/api/contact/update/${contact.id}`,
        'PUT',
        {
          name: contact.name,
          phone: contact.phone,
        },
        {
          Authorization: `Bearer ${token}`,
        }
      )

      if (data.ok) {
        fetchContacts()
        setAlert({ type: 'success', message: data.message })
      }
    } catch (error) {
      setAlert({ type: 'error', message: error.message })
    }
  }

  function editContactHandler(id, name, phone) {
    setModalData({ id, name, phone })
    setIsOpenModal(true)
  }

  function onChangePage(pageOfItems, page) {
    setPaginationPage(page)
    setPageOfItems(pageOfItems)
  }

  useEffect(() => {
    fetchContacts()
  }, [fetchContacts])

  function changeModalDataHandler(event) {
    setModalData({
      ...modalData,
      [event.target.name]: event.target.value,
    })
  }

  async function modalSubmitter() {
    await updateContactHandler(modalData)
    setIsOpenModal(false)
  }

  return (
    <div>
      <div className={styled.headingWrapper}>
        <h1 className={styled.heading}>Contacts</h1>
        <Button className={styled.logoutButton} onClick={() => logout()}>
          Logout
        </Button>
      </div>
      <div className={styled.addBlockWrapper}>
        <div className={styled.addBlock}>
          <InputGroup>
            <InputGroup.Prepend className={styled.addBlockPrepend}>
              <InputGroup.Text id='name'>Name*</InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl
              placeholder='Contact name'
              aria-label='Contact name'
              aria-describedby='name'
              name='name'
              required
              value={contactState.name}
              onChange={changeContactHandler}
            />
          </InputGroup>
          <InputGroup style={{ marginTop: '10px' }}>
            <InputGroup.Prepend className={styled.addBlockPrepend}>
              <InputGroup.Text id='phone'>Phone*</InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl
              placeholder='+7(999)999-99-99'
              aria-label='phone'
              aria-describedby='phone'
              name='phone'
              required
              value={contactState.phone}
              onChange={changeContactHandler}
            />
          </InputGroup>
          <Button
            variant='success'
            style={{ marginTop: '10px' }}
            onClick={addContactHandler}
          >
            Add new contact
          </Button>
        </div>
        <div className={styled.searchBlock}>
          <InputGroup>
            <FormControl
              placeholder='Search by name'
              aria-label='search'
              aria-describedby='search'
              value={searchTerm}
              onChange={searchHandler}
            />
            <InputGroup.Prepend>
              <InputGroup.Text id='search'>Search</InputGroup.Text>
            </InputGroup.Prepend>
          </InputGroup>
        </div>
      </div>
      <div style={{ margin: 10 }}>
        <Table responsive striped bordered hover variant='dark'>
          <thead>
            <tr className={styled.tableHead}>
              <th>Name</th>
              <th>Phone</th>
              <th>Actions</th>
            </tr>
          </thead>
          {contactsData.length ? (
            <TableBodyComponent
              data={pageOfItems}
              editAction={editContactHandler}
              deleteAction={deleteContactHandler}
            />
          ) : (
            !loading && (
              <tbody>
                <tr>
                  <td>no contacts yet</td>
                </tr>
              </tbody>
            )
          )}
        </Table>
        {contactsData && (
          <PaginationComponent
            items={searchResults.length ? searchResults : contactsData}
            onChangePage={onChangePage}
            inPage={searchResults.length ? 1 : paginationPage}
          />
        )}
      </div>
      <ModalComponent
        isOpen={isOpenModal}
        toggle={() => setIsOpenModal(false)}
        onSubmit={modalSubmitter}
      >
        <InputGroup>
          <InputGroup.Prepend style={{ width: 70 }}>
            <InputGroup.Text id='name'>Name</InputGroup.Text>
          </InputGroup.Prepend>
          <FormControl
            placeholder='Contact name'
            aria-label='Contact name'
            aria-describedby='name'
            name='name'
            value={modalData.name}
            onChange={changeModalDataHandler}
          />
        </InputGroup>
        <InputGroup style={{ marginTop: '10px' }}>
          <InputGroup.Prepend style={{ width: 70 }}>
            <InputGroup.Text id='phone'>Phone</InputGroup.Text>
          </InputGroup.Prepend>
          <FormControl
            placeholder='+7(999)999-99-99'
            aria-label='phone'
            aria-describedby='phone'
            name='phone'
            value={modalData.phone}
            onChange={changeModalDataHandler}
          />
        </InputGroup>
      </ModalComponent>
      {alert && (
        <Alert
          style={{ position: 'absolute', top: 10, left: '45%' }}
          variant={alert.type === 'error' ? 'danger' : 'success'}
        >
          {alert.message}
        </Alert>
      )}
    </div>
  )
}
