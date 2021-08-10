import { useState, useEffect, useCallback, SetStateAction } from "react"
import localforage from "localforage"

import type { Person } from '../types/person'
import { sleep } from '../utils'
import { useIsMounted } from "../hooks/useIsMounted"
import { useDebounce } from "../hooks/useDebounce"
import { useWillUnmount } from "../hooks/useWillUnmount"
import { useThrottle } from "../hooks/useThrottle"

function savePerson(person: Person | null) {
    console.log('Saving', person)
    localforage.setItem('person', person)
}

interface Metadata {
    isDirty: boolean
    isValid: boolean
}

export function usePerson(initialPerson: Person) {
    const [person, setPerson] = useState<Person | null>(null);
    const [metadata, setMetaData] = useState<Metadata>({ isDirty: false, isValid: true});
    const isMounted = useIsMounted()


    useEffect(() => {
        const getPerson = async () => {
            const person = await localforage.getItem<Person>("person");
            await sleep(2500)
            setPerson(person ?? initialPerson);
        }

        getPerson();
    }, [initialPerson, isMounted])

    const [, setNow] = useState(new Date())
    
    useEffect(() => {
        const handle = setInterval(() => setNow(new Date()), 1500)
        return () => clearInterval(handle)
    })

    const saveFn = useCallback(() => {
        savePerson(person)
    }, [person])

    useThrottle(saveFn, 1000)
    // useDebounce(saveFn, 1000)
    useWillUnmount(saveFn)

    function setPersonAndMeta(value: SetStateAction<Person | null>) {
        setPerson(value)
        setMetaData((m) => ({ ...m, isDirty: true}))
    }

    return [person, setPersonAndMeta, metadata] as const
}
