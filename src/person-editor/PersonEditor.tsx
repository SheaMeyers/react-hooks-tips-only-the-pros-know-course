import React, { ReactElement, useState, useRef, useEffect } from "react"

import { LabeledInput, Loading } from "../components"
import { initialPerson } from "../utils"
import { usePerson } from "./usePerson"



export function PersonEditor(): ReactElement {
  const [person, setPerson, { isDirty, isValid }] = usePerson(initialPerson)
  const input = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setTimeout(() => {
      input.current?.focus()
    }, 1000)
  })
  
  if (!person) {
    return <Loading />
  }

  return (
    <form
      className="person-editor"
      onSubmit={(e) => {
        e.preventDefault()
        alert(`Submitting\n${JSON.stringify(person, null, 2)}`)
      }}
    >
      <h2>Person Editor</h2>
      <LabeledInput
        ref={input}
        label="Firstname:"
        value={person.firstname}
        onChange={(e) => {
          const newPerson = {
            ...person,
            firstname: e.target.value,
          }
          setPerson(newPerson);
        }}
      />
      <LabeledInput
        label="Surname:"
        value={person.surname}
        onChange={(e) => {
          setPerson((person) => ({ ...person!, firstname: e.target.value}));
        }}
      />
      <LabeledInput
        label="Email:"
        value={person.email}
        onChange={(e) => {
          const newPerson = { ...person, email: e.target.value }
          setPerson(newPerson);
        }}
      />
      <LabeledInput
        label="Address:"
        value={person.address}
        onChange={(e) => {
          const newPerson = { ...person, address: e.target.value }
          setPerson(newPerson);
        }}
      />
      <LabeledInput
        label="Phone:"
        value={person.phone}
        onChange={(e) => {
          const newPerson = { ...person, phone: e.target.value }
          setPerson(newPerson);
        }}
      />
      <hr />
      <div className="btn-group">
        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={!isDirty || !isValid}
        >
          Submit
        </button>
      </div>
      <hr />
      <pre>{JSON.stringify(person, null, 2)}</pre>
    </form>
  )
}
